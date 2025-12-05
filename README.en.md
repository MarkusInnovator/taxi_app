# 🚕 TaxiFlow - Production Fullstack Taxi Application

[![CI/CD](https://github.com/YOUR_USERNAME/taxi_app/workflows/CI%2FCD/badge.svg)](https://github.com/YOUR_USERNAME/taxi_app/actions)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

Complete taxi booking platform demonstrating senior-level fullstack development with modern technologies.

## 🎯 Features

- 🚗 **Customer Booking**: Book rides, track status, view history
- 👨‍✈️ **Driver Dashboard**: Accept, start, and complete rides  
- 👑 **Admin Panel**: User management, platform statistics
- 🔐 **Authentication**: JWT-based auth with bcrypt
- ✅ **Comprehensive Testing**: 54+ backend + frontend tests
- 🐳 **Docker**: Full containerization with Docker Compose
- 🚀 **CI/CD**: Automated testing and deployment pipeline

## 🛠️ Tech Stack

**Backend:**
- Node.js 20 + Express.js
- PostgreSQL 15
- JWT + bcrypt
- Jest + Supertest (54 tests)

**Frontend:**
- React 18 + Vite
- React Router v6
- Axios
- Vitest + React Testing Library

**DevOps:**
- Docker + Docker Compose
- GitHub Actions CI/CD
- Multi-stage builds

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/taxi_app.git
cd taxi_app

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3001
# Backend API: http://localhost:3000
```

### Local Development

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
node src/db/migrate.js
npm run dev  # http://localhost:3000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/auth/me` - Get current user

### Customer (requires CUSTOMER role)
- `POST /api/rides` - Book a ride
- `GET /api/rides/my` - Get my rides
- `PATCH /api/rides/:id/cancel` - Cancel ride

### Driver (requires DRIVER role)
- `GET /api/driver/rides/open` - View available rides
- `PATCH /api/driver/rides/:id/accept` - Accept ride
- `PATCH /api/driver/rides/:id/start` - Start ride
- `PATCH /api/driver/rides/:id/finish` - Complete ride

### Admin (requires ADMIN role)
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/role` - Update user role
- `GET /api/admin/stats` - Platform statistics

## 🧪 Testing

**Backend:**
```bash
cd backend
npm test  # 54 tests
```

**Frontend:**
```bash
cd frontend
npm test
```

## 🏗️ Project Structure

```
taxi_app/
├── backend/
│   ├── src/
│   │   ├── config/       # DB & env configuration
│   │   ├── db/           # Migrations
│   │   ├── middleware/   # Auth middleware
│   │   ├── models/       # Data access layer
│   │   ├── routes/       # API routes
│   │   └── index.js      # Express app
│   └── tests/            # 54 comprehensive tests
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, ProtectedRoute
│   │   ├── context/      # AuthContext
│   │   ├── pages/        # All route pages
│   │   ├── services/     # API client
│   │   └── tests/        # Component tests
│   └── vite.config.js
├── docker-compose.yml
├── backend.Dockerfile
├── frontend.Dockerfile
└── .github/workflows/ci.yml
```

## 🗄️ Database Schema

**Users:**
- id, email, password_hash, name, role (CUSTOMER/DRIVER/ADMIN)

**Rides:**
- id, customer_id, driver_id, pickup_address, dropoff_address
- status (REQUESTED → ACCEPTED → ONGOING → COMPLETED / CANCELLED)
- estimated_price, final_price, scheduled_for

## 🔐 User Roles

| Role | Capabilities |
|------|-------------|
| CUSTOMER | Book rides, view history, cancel rides |
| DRIVER | Accept/start/finish rides, view available rides |
| ADMIN | Manage users, view all rides, statistics |

## 📋 Environment Variables

**Backend (.env):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taxiflow
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key
PORT=3000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000
```

## 🚢 CI/CD Pipeline

GitHub Actions workflow includes:
- ✅ Backend tests with PostgreSQL service
- ✅ Frontend tests
- ✅ Docker image builds
- ✅ Automated on push/PR

## 📝 Development Workflow

This project was built in 13 structured steps:

1. ✅ Project setup + dummy tests
2. ✅ Express server + health checks
3. ✅ Database migrations
4. ✅ Authentication (JWT + bcrypt)
5. ✅ Customer ride endpoints
6. ✅ Driver workflow endpoints
7. ✅ Admin management endpoints
8. ✅ Frontend routing + services
9. ✅ Auth pages (Login/Register)
10. ✅ Customer pages (BookRide, MyRides)
11. ✅ Driver + Admin dashboards
12. ✅ Docker configuration
13. ✅ CI/CD pipeline

Each step implemented, tested, and validated independently.

## 🛡️ Security Features

- ✅ bcrypt password hashing (10 rounds)
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Protected API routes with middleware
- ✅ Environment variable configuration

## 🐛 Troubleshooting

**Port conflicts:**
```bash
# Check ports
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F
```

**Docker issues:**
```bash
# Clean restart
docker-compose down -v
docker-compose up --build
```

## 📄 License

MIT License - Educational/demonstration purposes

## 🙏 Acknowledgments

Built as a comprehensive demonstration of modern fullstack development practices following senior-level standards.

---

**Made with ❤️ for the developer community**
