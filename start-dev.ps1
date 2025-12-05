# TaxiFlow - Development Startup Script (Windows)
# PowerShell version

Write-Host "🚕 TaxiFlow - Starting Development Environment" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if docker-compose is installed
if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ docker-compose is not installed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ docker-compose is installed" -ForegroundColor Green

# Stop any existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Blue
docker-compose down 2>$null

# Ask to remove volumes
$removeVolumes = Read-Host "Remove old database volumes? (y/N)"
if ($removeVolumes -eq 'y' -or $removeVolumes -eq 'Y') {
    Write-Host "🗑️  Removing old volumes..." -ForegroundColor Yellow
    docker-compose down -v
}

# Build and start services
Write-Host "🏗️  Building and starting services..." -ForegroundColor Blue
docker-compose up --build -d

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Blue
Start-Sleep -Seconds 5

# Check service health
Write-Host "🔍 Checking service health..." -ForegroundColor Blue

# Check database
try {
    docker-compose exec -T db pg_isready -U postgres | Out-Null
    Write-Host "✅ Database is ready" -ForegroundColor Green
} catch {
    Write-Host "❌ Database failed to start" -ForegroundColor Red
    exit 1
}

# Check backend
Start-Sleep -Seconds 3
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is ready" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Backend is starting..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 5
        Write-Host "✅ Backend is ready" -ForegroundColor Green
    } catch {
        Write-Host "❌ Backend failed to start" -ForegroundColor Red
        docker-compose logs backend
        exit 1
    }
}

# Check frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend is ready" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Frontend is starting..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5
        Write-Host "✅ Frontend is ready" -ForegroundColor Green
    } catch {
        Write-Host "❌ Frontend failed to start" -ForegroundColor Red
        docker-compose logs frontend
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 All services are running!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "📱 Frontend: " -NoNewline -ForegroundColor Blue
Write-Host "http://localhost:5173"
Write-Host "🔧 Backend API: " -NoNewline -ForegroundColor Blue
Write-Host "http://localhost:3000"
Write-Host "🗄️  Database: " -NoNewline -ForegroundColor Blue
Write-Host "postgresql://postgres:postgres@localhost:5432/taxiflow"
Write-Host ""
Write-Host "📋 Demo Accounts:" -ForegroundColor Yellow
Write-Host "  Customer: customer@taxi.com / customer123"
Write-Host "  Driver:   driver@taxi.com / driver123"
Write-Host "  Admin:    admin@taxi.com / admin123"
Write-Host ""
Write-Host "📊 View logs: " -NoNewline -ForegroundColor Blue
Write-Host "docker-compose logs -f"
Write-Host "🛑 Stop: " -NoNewline -ForegroundColor Blue
Write-Host "docker-compose down"
Write-Host "==============================================" -ForegroundColor Cyan
