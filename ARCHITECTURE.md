# 🏗️ TaxiFlow - Architecture & Technical Documentation

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Landing   │  │ Auth Pages   │  │  Dashboards  │        │
│  │    Page     │  │ Login/Reg    │  │  C/D/A       │        │
│  └─────────────┘  └──────────────┘  └──────────────┘        │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                     AuthContext + React Router               │
│                            │                                 │
│              ┌─────────────┴─────────────┐                  │
│              │     API Services Layer     │                  │
│              │  (Axios + Interceptors)   │                  │
│              └─────────────┬─────────────┘                  │
└────────────────────────────┼──────────────────────────────┘
                             │ HTTP/REST
                             │ JWT Token
┌────────────────────────────┼──────────────────────────────┐
│                  Backend (Node.js/Express)                  │
│              ┌─────────────┴─────────────┐                 │
│              │      Routes Layer         │                 │
│              │  /auth /rides /driver     │                 │
│              │       /admin              │                 │
│              └─────────────┬─────────────┘                 │
│                            │                                │
│              ┌─────────────┴─────────────┐                 │
│              │  Middleware (Auth/RBAC)   │                 │
│              └─────────────┬─────────────┘                 │
│                            │                                │
│              ┌─────────────┴─────────────┐                 │
│              │    Models/Data Layer      │                 │
│              │   User / Ride Models      │                 │
│              └─────────────┬─────────────┘                 │
└────────────────────────────┼──────────────────────────────┘
                             │ SQL
                             │
┌────────────────────────────┼──────────────────────────────┐
│                      PostgreSQL 15                          │
│  ┌────────────┐                    ┌────────────┐          │
│  │   users    │────────────────────│   rides    │          │
│  │  table     │     FK relations   │   table    │          │
│  └────────────┘                    └────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 🗄️ Database Schema (Detailed)

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL 
    CHECK (role IN ('CUSTOMER', 'DRIVER', 'ADMIN')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Rides Table
```sql
CREATE TABLE rides (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  driver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  status VARCHAR(50) NOT NULL 
    CHECK (status IN ('REQUESTED', 'ACCEPTED', 'ONGOING', 'COMPLETED', 'CANCELLED')),
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  scheduled_for TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_rides_customer ON rides(customer_id);
CREATE INDEX idx_rides_driver ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_created ON rides(created_at DESC);
```

## 🔐 Authentication Flow

```
┌─────────┐                ┌─────────┐               ┌──────────┐
│ Client  │                │ Backend │               │ Database │
└────┬────┘                └────┬────┘               └────┬─────┘
     │                          │                         │
     │ POST /api/auth/register  │                         │
     │─────────────────────────>│                         │
     │                          │ bcrypt.hash(password)   │
     │                          │ INSERT user             │
     │                          │────────────────────────>│
     │                          │<────────────────────────│
     │                          │ JWT.sign(user)          │
     │<─────────────────────────│                         │
     │  { token, user }         │                         │
     │                          │                         │
     │ Store token in localStorage                        │
     │                          │                         │
     │ POST /api/auth/login     │                         │
     │─────────────────────────>│                         │
     │                          │ SELECT user by email    │
     │                          │────────────────────────>│
     │                          │<────────────────────────│
     │                          │ bcrypt.compare()        │
     │                          │ JWT.sign(user)          │
     │<─────────────────────────│                         │
     │  { token, user }         │                         │
     │                          │                         │
     │ GET /api/rides/my        │                         │
     │ Header: Bearer <token>   │                         │
     │─────────────────────────>│                         │
     │                          │ JWT.verify(token)       │
     │                          │ authMiddleware          │
     │                          │ SELECT rides            │
     │                          │────────────────────────>│
     │<─────────────────────────│<────────────────────────│
     │  { rides: [...] }        │                         │
```

## 🚦 Ride Status Workflow

```
REQUESTED ────> ACCEPTED ────> ONGOING ────> COMPLETED
    │                                             ▲
    │                                             │
    └─────────────> CANCELLED <──────────────────┘

Actions:
- REQUESTED: Customer creates ride
  → Driver can: Accept
  → Customer can: Cancel

- ACCEPTED: Driver accepted
  → Driver can: Start
  → Customer can: Cancel (not implemented for safety)

- ONGOING: Ride in progress
  → Driver can: Finish (with final_price)

- COMPLETED: Ride finished
  → No further actions

- CANCELLED: Ride cancelled
  → No further actions
```

## 🎯 Role-Based Access Control (RBAC)

### Route Protection Matrix

| Endpoint | CUSTOMER | DRIVER | ADMIN |
|----------|----------|--------|-------|
| GET /api/auth/me | ✅ | ✅ | ✅ |
| POST /api/rides | ✅ | ❌ | ❌ |
| GET /api/rides/my | ✅ | ❌ | ❌ |
| PATCH /api/rides/:id/cancel | ✅ | ❌ | ❌ |
| GET /api/driver/rides/open | ❌ | ✅ | ❌ |
| PATCH /api/driver/rides/:id/accept | ❌ | ✅ | ❌ |
| PATCH /api/driver/rides/:id/start | ❌ | ✅ | ❌ |
| PATCH /api/driver/rides/:id/finish | ❌ | ✅ | ❌ |
| GET /api/admin/users | ❌ | ❌ | ✅ |
| GET /api/admin/rides | ❌ | ❌ | ✅ |
| PATCH /api/admin/users/:id/role | ❌ | ❌ | ✅ |
| DELETE /api/admin/users/:id | ❌ | ❌ | ✅ |
| GET /api/admin/stats | ❌ | ❌ | ✅ |

### Frontend Route Protection

```javascript
// Protected Route Wrapper
<ProtectedRoute allowedRoles={['CUSTOMER']}>
  <BookRide />
</ProtectedRoute>

// Implementation
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};
```

## 📦 Project Structure (Detailed)

```
taxi_app/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js             # PostgreSQL pool configuration
│   │   │   └── env.js            # Environment validation
│   │   ├── db/
│   │   │   ├── migrate.js        # Database schema creation
│   │   │   └── reset.js          # Test database cleanup
│   │   ├── middleware/
│   │   │   └── authMiddleware.js # JWT + RBAC middleware
│   │   ├── models/
│   │   │   ├── userModel.js      # User CRUD + password hashing
│   │   │   └── rideModel.js      # Ride CRUD + status transitions
│   │   ├── routes/
│   │   │   ├── authRoutes.js     # Register, login, /me
│   │   │   ├── rideRoutes.js     # Customer ride management
│   │   │   ├── driverRoutes.js   # Driver workflow
│   │   │   └── adminRoutes.js    # Admin management
│   │   └── index.js              # Express app setup
│   ├── tests/
│   │   ├── smoke.test.js         # Basic infrastructure test
│   │   ├── health.test.js        # Health endpoints (6 tests)
│   │   ├── db.test.js            # Database operations (5 tests)
│   │   ├── auth.test.js          # Auth endpoints (13 tests)
│   │   ├── rides.test.js         # Customer rides (11 tests)
│   │   ├── driver.test.js        # Driver workflow (9 tests)
│   │   └── admin.test.js         # Admin operations (11 tests)
│   ├── package.json              # Dependencies + scripts
│   ├── .env.example              # Environment template
│   └── jest.config.js            # Jest configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation with role-based menu
│   │   │   ├── Navbar.css        # Navbar styling
│   │   │   └── ProtectedRoute.jsx # Route guard HOC
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state (useAuth hook)
│   │   ├── pages/
│   │   │   ├── Landing.jsx       # Homepage with features
│   │   │   ├── Landing.css
│   │   │   ├── Login.jsx         # Login form
│   │   │   ├── Register.jsx      # Registration form
│   │   │   ├── Auth.css          # Shared auth styling
│   │   │   ├── BookRide.jsx      # Ride booking form (Customer)
│   │   │   ├── BookRide.css
│   │   │   ├── MyRides.jsx       # Ride history (Customer)
│   │   │   ├── MyRides.css
│   │   │   ├── DriverDashboard.jsx # Driver interface
│   │   │   ├── AdminDashboard.jsx  # Admin interface
│   │   │   └── Dashboard.css     # Shared dashboard styling
│   │   ├── services/
│   │   │   ├── api.js            # Axios instance + interceptors
│   │   │   ├── authService.js    # Auth API calls
│   │   │   ├── rideService.js    # Ride API calls
│   │   │   ├── driverService.js  # Driver API calls
│   │   │   └── adminService.js   # Admin API calls
│   │   ├── tests/
│   │   │   ├── setup.js          # Testing library setup
│   │   │   ├── smoke.test.jsx    # Infrastructure test
│   │   │   ├── Login.test.jsx    # Login component tests
│   │   │   ├── BookRide.test.jsx # BookRide component tests
│   │   │   └── MyRides.test.jsx  # MyRides component tests
│   │   ├── App.jsx               # Main app with routing
│   │   ├── App.css               # Global app styles
│   │   └── main.jsx              # React entry point
│   ├── index.html                # HTML template
│   ├── package.json              # Dependencies + scripts
│   ├── vite.config.js            # Vite + Vitest config
│   ├── .env                      # Local development
│   └── .env.production           # Docker/production
│
├── docker-compose.yml            # Orchestration (db + backend + frontend)
├── backend.Dockerfile            # Backend container
├── frontend.Dockerfile           # Frontend multi-stage build
├── README.md                     # Main documentation (German)
├── README.en.md                  # English documentation
├── DEMO_GUIDE.md                 # Quick start guide
└── .gitignore                    # Git ignore rules
```

## 🧪 Test Coverage

### Backend Tests (54 total)

**smoke.test.js (1 test)**
- ✅ Basic arithmetic works

**health.test.js (6 tests)**
- ✅ GET /health returns OK
- ✅ GET /health/db with DB available
- ✅ GET /health/db without DB
- ✅ Invalid routes return 404
- ✅ Server starts successfully
- ✅ Server closes gracefully

**db.test.js (5 tests)**
- ✅ Database connection pool created
- ✅ SELECT NOW() works
- ✅ CREATE TABLE works
- ✅ INSERT and SELECT works
- ✅ Transaction rollback works

**auth.test.js (13 tests)**
- ✅ POST /register creates user
- ✅ POST /register validates email
- ✅ POST /register hashes password
- ✅ POST /register rejects duplicate email
- ✅ POST /register validates role
- ✅ POST /login returns JWT
- ✅ POST /login validates credentials
- ✅ POST /login rejects wrong password
- ✅ POST /login rejects non-existent user
- ✅ GET /me returns current user
- ✅ GET /me rejects invalid token
- ✅ GET /me rejects missing token
- ✅ JWT token expires after 7 days

**rides.test.js (11 tests)**
- ✅ POST /rides creates ride (CUSTOMER)
- ✅ POST /rides rejects non-CUSTOMER
- ✅ POST /rides validates required fields
- ✅ GET /my returns customer's rides
- ✅ GET /my filters by customer_id
- ✅ GET /:id returns ride details
- ✅ GET /:id checks ownership
- ✅ PATCH /:id/cancel cancels ride
- ✅ PATCH /:id/cancel only REQUESTED rides
- ✅ PATCH /:id/cancel checks ownership
- ✅ GET /:id with invalid ID returns 404

**driver.test.js (9 tests)**
- ✅ GET /driver/rides/open returns REQUESTED rides
- ✅ GET /driver/rides/open requires DRIVER role
- ✅ PATCH /driver/rides/:id/accept assigns driver
- ✅ PATCH /driver/rides/:id/accept only REQUESTED
- ✅ PATCH /driver/rides/:id/start changes to ONGOING
- ✅ PATCH /driver/rides/:id/start only ACCEPTED
- ✅ PATCH /driver/rides/:id/finish completes ride
- ✅ PATCH /driver/rides/:id/finish requires final_price
- ✅ PATCH /driver/rides/:id/finish only ONGOING

**admin.test.js (11 tests)**
- ✅ GET /admin/users returns all users
- ✅ GET /admin/users requires ADMIN role
- ✅ GET /admin/rides returns all rides
- ✅ GET /admin/rides requires ADMIN role
- ✅ PATCH /admin/users/:id/role updates role
- ✅ PATCH /admin/users/:id/role validates role
- ✅ DELETE /admin/users/:id deletes user
- ✅ DELETE /admin/users/:id cascades rides
- ✅ DELETE /admin/users/:id prevents self-delete
- ✅ GET /admin/stats returns statistics
- ✅ GET /admin/stats requires ADMIN role

## 🔒 Security Features

### Password Security
```javascript
// Hashing with bcrypt (10 rounds)
const hashedPassword = await bcrypt.hash(password, 10);

// Verification
const isValid = await bcrypt.compare(password, user.password_hash);
```

### JWT Security
```javascript
// Token generation
const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Token verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### SQL Injection Prevention
```javascript
// Parameterized queries (safe)
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// NEVER do this (vulnerable):
// const result = await pool.query(`SELECT * FROM users WHERE email = '${email}'`);
```

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

## 🐳 Docker Architecture

### Multi-Stage Frontend Build
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
```

### Health Checks
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### Dependency Management
```yaml
depends_on:
  db:
    condition: service_healthy  # Wait for DB health check
```

## 📊 Performance Considerations

### Database Indexes
```sql
-- Speeds up user lookups
CREATE INDEX idx_users_email ON users(email);

-- Speeds up ride queries
CREATE INDEX idx_rides_customer ON rides(customer_id);
CREATE INDEX idx_rides_status ON rides(status);
```

### Connection Pooling
```javascript
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,  // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Frontend Optimization
- Code splitting with React Router
- Lazy loading of components
- Vite's fast HMR (Hot Module Replacement)
- Production build with minification

## 🚀 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: taxiflow_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - Checkout code
      - Setup Node.js 20
      - Install dependencies
      - Run migrations
      - Run tests (54 tests)

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 20
      - Install dependencies
      - Run tests
      
  docker-build:
    needs: [backend-tests, frontend-tests]
    steps:
      - Build backend image
      - Build frontend image
```

---

**Architecture designed for scalability, maintainability, and security.** 🏗️
