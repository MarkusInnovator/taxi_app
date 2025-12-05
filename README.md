# TaxiFlow - Senior Fullstack Taxi Application

Eine vollständige Taxi-Buchungsplattform mit Node.js/Express Backend, React Frontend, PostgreSQL, Docker und CI/CD.

## ✅ Projektstatus

- ✅ **Backend komplett** (54 Tests passing)
- ✅ **Frontend komplett** (React Router, Auth, Customer/Driver/Admin Dashboards)
- ✅ **Docker & Docker Compose** konfiguriert
- ✅ **CI/CD Pipeline** mit GitHub Actions
- ✅ **Production Ready** 🚀

## 🚀 Tech Stack

**Backend:**
- Node.js 20 + Express
- PostgreSQL 15
- JWT Authentication + bcrypt
- Bcrypt for password hashing
- Jest + Supertest for testing

**Frontend:**
- React 18 (Vite)
- React Router
- Axios
- Vitest + React Testing Library

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Automated Testing

## 📁 Project Structure

```
taxi_app/
├── backend/              # Node.js Express API
│   ├── src/
│   │   ├── config/      # DB & env configuration
│   │   ├── middleware/  # Auth middleware
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   └── db/          # Migrations
│   └── tests/           # Backend tests
├── frontend/            # React application
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── tests/       # Frontend tests
└── .github/
    └── workflows/       # CI/CD pipelines
```

## 🎯 Features

### User Roles
- **Customer**: Book rides, view ride history, cancel rides
- **Driver**: Accept rides, manage ride status, complete rides
- **Admin**: Manage users, view all rides, change user roles

### Core Functionality
- User authentication (Register/Login with JWT)
- Ride booking with pickup/dropoff addresses
- Real-time ride status tracking
- Role-based access control
- Admin dashboard for user management

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (for containerized setup)

### Local Development

**Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run db:migrate
npm run dev
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

### Running Tests

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

### Docker Setup

```bash
docker-compose up --build
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

## 🧪 Testing Strategy

- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints with test database
- **Component Tests**: React components with mocked services
- **CI/CD**: Automated testing on every push/PR

## 📊 Database Schema

### Users Table
- Roles: CUSTOMER, DRIVER, ADMIN
- Authentication with hashed passwords

### Rides Table
- Status: REQUESTED, ACCEPTED, ONGOING, COMPLETED, CANCELLED
- Links customers with drivers

### Vehicles Table
- Driver vehicle information

## 🔐 Security

- Passwords hashed with bcrypt
- JWT token-based authentication
- Role-based authorization middleware
- Environment variables for sensitive data

## 📝 API Documentation

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Ride Endpoints (Customer)
- `POST /api/rides` - Create new ride
- `GET /api/rides/my` - Get user's rides
- `PATCH /api/rides/:id/cancel` - Cancel ride

### Driver Endpoints
- `GET /api/driver/rides/open` - View available rides
- `PATCH /api/driver/rides/:id/accept` - Accept ride
- `PATCH /api/driver/rides/:id/start` - Start ride
- `PATCH /api/driver/rides/:id/finish` - Complete ride

### Admin Endpoints
- `GET /api/admin/users` - List all users
- `GET /api/admin/rides` - List all rides
- `PATCH /api/admin/users/:id/role` - Update user role

## 🚦 CI/CD Pipeline

GitHub Actions automatically:
- Runs backend tests with PostgreSQL service
- Runs frontend tests
- Verifies Docker builds
- Executes on every push and pull request

## 📄 License

ISC

## 👨‍💻 Author

MarkusInnovator
