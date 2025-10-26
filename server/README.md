# Taxi App Backend

Ein vollständiges Backend für eine Taxi-Buchungs-App mit Node.js, TypeScript, Express und MongoDB.

## 🚀 Features

- **Benutzer-Authentifizierung**: Registrierung und Login für Kunden und Fahrer
- **Buchungssystem**: Erstellen, Verwalten und Verfolgen von Taxi-Buchungen
- **Real-time Tracking**: Live-Standortverfolgung mit Socket.IO
- **Zahlungsverarbeitung**: Unterstützung für Bargeld, Karte und digitale Wallets
- **Fahrer-Management**: Profile, Dokumentenverwaltung und Verifizierung
- **Admin-Panel**: Benutzer- und Fahrerverwaltung
- **API-Dokumentation**: RESTful API mit vollständiger Dokumentation

## 📋 Voraussetzungen

- Node.js (v18 oder höher)
- MongoDB (v5 oder höher)
- npm oder yarn

## 🛠️ Installation

1. **Dependencies installieren:**
   ```bash
   cd server
   npm install
   ```

2. **Umgebungsvariablen konfigurieren:**
   ```bash
   cp .env.example .env
   ```
   
   Bearbeiten Sie `.env` mit Ihren eigenen Werten:
   ```
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/taxi_app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

3. **MongoDB starten:**
   ```bash
   # Windows (wenn MongoDB als Service installiert ist)
   net start MongoDB
   
   # oder direkter Start
   mongod
   ```

4. **Server starten:**
   ```bash
   # Development
   npm run dev
   
   # Production Build
   npm run build
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Benutzer registrieren
- `POST /api/auth/login` - Benutzer anmelden
- `GET /api/auth/me` - Aktueller Benutzer

### Users
- `GET /api/users/profile` - Benutzerprofil abrufen
- `PUT /api/users/profile` - Profil aktualisieren
- `GET /api/users` - Alle Benutzer (Admin)

### Drivers
- `GET /api/drivers/profile` - Fahrerprofil abrufen
- `PUT /api/drivers/profile` - Fahrerprofil aktualisieren
- `PUT /api/drivers/location` - Standort aktualisieren
- `PUT /api/drivers/status` - Online/Offline Status
- `GET /api/drivers/earnings` - Verdienstübersicht

### Bookings
- `POST /api/bookings` - Neue Buchung erstellen
- `GET /api/bookings/my-bookings` - Eigene Buchungen
- `GET /api/bookings/:id` - Buchungsdetails
- `PUT /api/bookings/:id/accept` - Buchung annehmen (Fahrer)
- `PUT /api/bookings/:id/cancel` - Buchung stornieren

### Payments
- `POST /api/payments/process` - Zahlung verarbeiten
- `GET /api/payments/history` - Zahlungshistorie
- `POST /api/payments/refund` - Rückerstattung

## 🔌 Socket.IO Events

### Client → Server
- `location-update` - Standort-Update (Fahrer)
- `driver-status-change` - Online/Offline Status
- `booking-status-update` - Buchungsstatus-Update
- `emergency-alert` - Notfall-Alert

### Server → Client
- `new-booking-request` - Neue Buchungsanfrage
- `booking-accepted` - Buchung angenommen
- `booking-cancelled` - Buchung storniert
- `driver-location-update` - Fahrer-Standort-Update
- `driver-arrived` - Fahrer angekommen
- `trip-started` - Fahrt begonnen
- `trip-completed` - Fahrt beendet

## 🗄️ Datenbank Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: 'customer' | 'driver' | 'admin',
  isActive: Boolean,
  profileImage: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  }
}
```

### Driver Collection
```javascript
{
  userId: ObjectId (ref: User),
  licenseNumber: String,
  vehicleInfo: {
    make: String,
    model: String,
    year: Number,
    color: String,
    licensePlate: String,
    vehicleType: 'sedan' | 'suv' | 'van' | 'luxury'
  },
  rating: Number,
  totalRides: Number,
  isOnline: Boolean,
  isVerified: Boolean,
  currentLocation: {
    latitude: Number,
    longitude: Number,
    heading: Number,
    speed: Number,
    lastUpdated: Date
  },
  earnings: {
    today: Number,
    thisWeek: Number,
    thisMonth: Number,
    total: Number
  }
}
```

### Booking Collection
```javascript
{
  customerId: ObjectId (ref: User),
  driverId: ObjectId (ref: User),
  pickupLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
    details: String
  },
  dropoffLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
    details: String
  },
  status: 'pending' | 'accepted' | 'driver_en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled',
  vehicleType: 'sedan' | 'suv' | 'van' | 'luxury',
  estimatedFare: Number,
  actualFare: Number,
  paymentMethod: 'cash' | 'card' | 'digital_wallet',
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  timeline: {
    createdAt: Date,
    acceptedAt: Date,
    driverArrivedAt: Date,
    tripStartedAt: Date,
    tripCompletedAt: Date,
    cancelledAt: Date
  }
}
```

## 🔐 Authentifizierung

Das Backend verwendet JWT (JSON Web Tokens) für die Authentifizierung. Alle geschützten Routen erfordern einen Bearer Token im Authorization Header:

```
Authorization: Bearer <your-jwt-token>
```

## 🏃‍♂️ Nächste Schritte

1. **Frontend Integration**: Verbinden Sie Ihr React-Frontend mit diesen APIs
2. **Payment Gateway**: Integrieren Sie echte Payment-Provider (Stripe, PayPal)
3. **Maps Integration**: Implementieren Sie Google Maps oder andere Kartendienste
4. **Push Notifications**: Fügen Sie Push-Benachrichtigungen hinzu
5. **Testing**: Schreiben Sie Tests für alle Endpoints
6. **Deployment**: Deployen Sie auf AWS, Heroku oder anderen Cloud-Anbietern

## 📱 Beispiel-Requests

### Benutzer registrieren
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max Mustermann",
    "email": "max@example.com",
    "phone": "+491234567890",
    "password": "password123",
    "role": "customer"
  }'
```

### Buchung erstellen
```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "pickupLocation": {
      "latitude": 52.5200,
      "longitude": 13.4050,
      "address": "Brandenburger Tor, Berlin"
    },
    "dropoffLocation": {
      "latitude": 52.5244,
      "longitude": 13.4105,
      "address": "Reichstag, Berlin"
    },
    "vehicleType": "sedan",
    "paymentMethod": "card"
  }'
```

## 🤝 Beitragen

1. Fork das Repository
2. Erstellen Sie einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE) Datei für Details.

## 📞 Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository oder kontaktieren Sie das Entwicklungsteam.

---

**Viel Erfolg mit Ihrer Taxi-App! 🚗💨**