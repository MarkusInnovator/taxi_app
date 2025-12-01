# Docker Setup Guide 🐳

## Voraussetzungen

- Docker Desktop muss installiert und gestartet sein
- `.env` Datei muss existieren (kopiert von `.env.example`)

## Docker-Befehle

### 1. Standalone Docker Build & Run

```powershell
# Zum Server-Verzeichnis wechseln
cd server

# Docker Image bauen
docker build -t taxi-app-server .

# Container starten
docker run -p 3001:3001 --env-file .env taxi-app-server

# Im Hintergrund starten
docker run -d -p 3001:3001 --env-file .env --name taxi-backend taxi-app-server

# Container stoppen
docker stop taxi-backend

# Container entfernen
docker rm taxi-backend
```

### 2. Docker Compose (Empfohlen für Entwicklung)

```powershell
# Zum Server-Verzeichnis wechseln
cd server

# Alle Services starten (MongoDB, Redis, Backend)
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# Services stoppen
docker-compose down

# Services stoppen und Volumes löschen
docker-compose down -v

# Services neu bauen
docker-compose up -d --build
```

### 3. Produktion (mit docker-compose.prod.yml)

```powershell
# Produktion starten
docker-compose -f docker-compose.prod.yml up -d

# Produktion stoppen
docker-compose -f docker-compose.prod.yml down
```

## Nützliche Docker-Befehle

```powershell
# Alle laufenden Container anzeigen
docker ps

# Logs eines Containers anzeigen
docker logs taxi-backend

# In Container einloggen
docker exec -it taxi-backend sh

# Alle gestoppten Container entfernen
docker container prune

# Alle ungenutzten Images entfernen
docker image prune -a

# Docker Disk Space anzeigen
docker system df

# Komplettes Cleanup
docker system prune -a --volumes
```

## Fehlerbehebung

### Docker Desktop läuft nicht
```
ERROR: error during connect: ... dockerDesktopLinuxEngine: The system cannot find the file specified.
```
**Lösung:** Docker Desktop starten und warten bis es vollständig gestartet ist.

### .env Datei fehlt
```
docker: open .env: The system cannot find the file specified.
```
**Lösung:**
```powershell
cd server
Copy-Item .env.example .env
```

### Port bereits belegt
```
Error: port is already allocated
```
**Lösung:**
```powershell
# Anderen Container stoppen der Port 3001 verwendet
docker ps
docker stop <container-id>

# Oder anderen Port verwenden
docker run -p 3002:3001 --env-file .env taxi-app-server
```

## Health Check

Nach dem Start können Sie die Health-Check-Route aufrufen:

```powershell
# Mit curl (falls installiert)
curl http://localhost:3001/health

# Mit PowerShell
Invoke-RestMethod http://localhost:3001/health
```

Expected Response:
```json
{
  "status": "OK",
  "timestamp": "2025-12-01T10:00:00.000Z",
  "uptime": 42.5
}
```

## Umgebungsvariablen

Wichtige Variablen in der `.env` Datei:

- `NODE_ENV` - Umgebung (development/production)
- `PORT` - Server Port (default: 3001)
- `MONGODB_URI` - MongoDB Connection String
- `JWT_SECRET` - Secret für JWT Tokens
- `GOOGLE_MAPS_API_KEY` - Für Routenberechnung

## Docker Compose Services

- **mongodb** - MongoDB 7.0 auf Port 27017
- **redis** - Redis 7 auf Port 6379
- **backend** - Node.js API auf Port 3001

## Build-Performance

Das Multi-Stage Dockerfile nutzt Layer-Caching:

1. **Builder Stage** - Kompiliert TypeScript zu JavaScript
2. **Production Stage** - Nur notwendige Dependencies und kompilierter Code

**Build-Zeit:** ~2-5 Minuten (erste Build)
**Build-Zeit:** ~30 Sekunden (mit Cache)

## Sicherheit

- ✅ Non-root User (taxi-app:1001)
- ✅ Minimale Base Image (node:20-alpine)
- ✅ Nur Production Dependencies
- ✅ Health Checks aktiviert
- ✅ Resource Limits in docker-compose.yml
