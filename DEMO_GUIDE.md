# 🎯 TaxiFlow - Quick Start & Demo Guide

## 🚀 Schnellstart (3 Minuten)

### Option 1: Docker (Empfohlen)

```bash
# 1. Repository klonen
git clone https://github.com/MarkusInnovator/taxi_app.git
cd taxi_app

# 2. Alle Services starten
docker-compose up --build

# 3. Fertig! Öffne:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000
# - Health Check: http://localhost:3000/health
```

### Option 2: Lokale Entwicklung

**Voraussetzungen:**
- Node.js 20+
- PostgreSQL 15+

```bash
# Backend
cd backend
npm install
cp .env.example .env
# .env bearbeiten mit deinen PostgreSQL Credentials
node src/db/migrate.js
npm run dev

# Frontend (neues Terminal)
cd frontend
npm install
npm run dev
```

## 👥 Demo-Accounts

### Customer Account
```
Email: customer@taxi.com
Password: customer123
Rolle: CUSTOMER
```

**Features:**
- ✅ Fahrten buchen
- ✅ Fahrten-Historie ansehen
- ✅ Fahrten stornieren (nur REQUESTED Status)

### Driver Account
```
Email: driver@taxi.com
Password: driver123
Rolle: DRIVER
```

**Features:**
- ✅ Offene Fahrten sehen
- ✅ Fahrten annehmen
- ✅ Fahrten starten
- ✅ Fahrten abschließen (mit Endpreis)

### Admin Account
```
Email: admin@taxi.com
Password: admin123
Rolle: ADMIN
```

**Features:**
- ✅ Alle Benutzer verwalten
- ✅ Rollen ändern
- ✅ Benutzer löschen
- ✅ Plattform-Statistiken
- ✅ Alle Fahrten einsehen

## 🎬 Demo-Workflow

### 1. Customer Flow (Fahrt buchen)

```bash
1. Gehe zu http://localhost:5173
2. Klicke "Login"
3. Login mit: customer@taxi.com / customer123
4. Klicke "Book a Ride"
5. Fülle Formular aus:
   - Pickup: "Hauptbahnhof München"
   - Dropoff: "Flughafen München"
   - Estimated Price: 45.00
6. Klicke "Book Ride"
7. Sieh deine Fahrt in "My Rides"
```

### 2. Driver Flow (Fahrt annehmen)

```bash
1. Logout (customer)
2. Login mit: driver@taxi.com / driver123
3. Tab "Open Rides" zeigt verfügbare Fahrten
4. Klicke "Accept" bei einer Fahrt
5. Fahrt erscheint in "My Rides" Tab
6. Klicke "Start" um Fahrt zu beginnen
7. Klicke "Finish" und gib Endpreis ein (z.B. 48.50)
```

### 3. Admin Flow (Plattform verwalten)

```bash
1. Login mit: admin@taxi.com / admin123
2. "Statistics" Tab zeigt:
   - Anzahl Customers, Drivers, Admins
   - Ride Status (Requested, Ongoing, Completed)
3. "Users" Tab:
   - Alle Benutzer sehen
   - Rollen ändern
   - Benutzer löschen
4. "All Rides" Tab:
   - Alle Fahrten der Plattform
```

## 📡 API Testen (mit curl)

### Health Check
```bash
curl http://localhost:3000/health
curl http://localhost:3000/health/db
```

### Registrierung
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User",
    "role": "CUSTOMER"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@taxi.com",
    "password": "customer123"
  }'
```

### Fahrt buchen (mit Token)
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3000/api/rides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "pickupAddress": "Main St 123",
    "dropoffAddress": "Oak Ave 456",
    "estimatedPrice": 25.00
  }'
```

### Meine Fahrten abrufen
```bash
curl -X GET http://localhost:3000/api/rides/my \
  -H "Authorization: Bearer $TOKEN"
```

## 🧪 Tests ausführen

### Backend Tests (54 Tests)
```bash
cd backend
npm test

# Einzelne Test-Suite
npm test -- auth.test.js
npm test -- rides.test.js
```

### Frontend Tests
```bash
cd frontend
npm test

# Watch Mode
npm test -- --watch

# Mit Coverage
npm test -- --coverage
```

## 🐛 Debugging

### Backend Logs aktivieren
```bash
cd backend
DEBUG=* npm run dev
```

### Docker Logs
```bash
# Alle Services
docker-compose logs -f

# Nur Backend
docker-compose logs -f backend

# Nur Frontend
docker-compose logs -f frontend
```

### Datenbank direkt verbinden
```bash
# Mit Docker
docker exec -it taxiflow_db psql -U postgres -d taxiflow

# Lokal
psql -U postgres -d taxiflow
```

**Nützliche SQL Queries:**
```sql
-- Alle Benutzer
SELECT id, email, name, role FROM users;

-- Alle Fahrten mit Namen
SELECT 
  r.id, 
  r.status, 
  c.name as customer, 
  d.name as driver,
  r.pickup_address,
  r.dropoff_address
FROM rides r
LEFT JOIN users c ON r.customer_id = c.id
LEFT JOIN users d ON r.driver_id = d.id;

-- Statistiken
SELECT 
  role, 
  COUNT(*) as count 
FROM users 
GROUP BY role;
```

## 📊 Projekt-Statistiken

```bash
# Code-Zeilen zählen
cd taxi_app
find . -name "*.js" -o -name "*.jsx" | xargs wc -l

# Dependencies anzeigen
cd backend && npm list --depth=0
cd frontend && npm list --depth=0
```

## 🔧 Häufige Probleme

### Port 3000 bereits belegt
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### PostgreSQL läuft nicht
```bash
# Docker neustarten
docker-compose down
docker-compose up db

# Status prüfen
docker-compose ps
```

### Frontend baut nicht
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Tests schlagen fehl
```bash
# Backend
cd backend
npm install
npm test

# Frontend
cd frontend
npm install
npm test
```

## 🎓 Lernressourcen

**Backend:**
- Express.js: https://expressjs.com/
- PostgreSQL: https://www.postgresql.org/docs/
- JWT: https://jwt.io/introduction
- Jest: https://jestjs.io/

**Frontend:**
- React: https://react.dev/
- React Router: https://reactrouter.com/
- Vite: https://vitejs.dev/
- Vitest: https://vitest.dev/

**DevOps:**
- Docker: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- GitHub Actions: https://docs.github.com/actions

## 💡 Next Steps

**Mögliche Erweiterungen:**
1. 🗺️ Google Maps Integration
2. 💳 Payment Integration (Stripe)
3. 📱 Real-time Updates (WebSockets)
4. 📧 Email Notifications
5. 📍 GPS Tracking
6. ⭐ Rating System
7. 💬 Chat zwischen Customer/Driver
8. 📊 Advanced Analytics Dashboard
9. 🌍 Internationalisierung (i18n)
10. 🎨 Theme Switcher (Dark Mode)

## 🤝 Contribution

```bash
# Fork repository
# Create feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m "feat: Add amazing feature"

# Push to branch
git push origin feature/amazing-feature

# Open Pull Request
```

## 📞 Support

Bei Fragen oder Problemen:
1. Prüfe die READMEs (README.md, README.en.md)
2. Schaue in die Tests für Beispiele
3. Prüfe GitHub Issues
4. Erstelle ein neues Issue

---

**Happy Coding! 🚀**
