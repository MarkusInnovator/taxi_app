# Docker Quick Start Script for Taxi App Backend
# Run this script from the server directory

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('start', 'stop', 'restart', 'logs', 'build', 'clean', 'status')]
    [string]$Action = 'start'
)

$ErrorActionPreference = "Stop"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Check-DockerRunning {
    try {
        docker info > $null 2>&1
        return $true
    }
    catch {
        return $false
    }
}

function Check-EnvFile {
    if (-not (Test-Path ".env")) {
        Write-ColorOutput "⚠️  .env file not found!" "Yellow"
        Write-ColorOutput "Creating .env from .env.example..." "Cyan"
        Copy-Item .env.example .env
        Write-ColorOutput "✅ .env file created. Please update it with your settings." "Green"
    }
}

# Check if Docker is running
if (-not (Check-DockerRunning)) {
    Write-ColorOutput "❌ Docker Desktop is not running!" "Red"
    Write-ColorOutput "Please start Docker Desktop and try again." "Yellow"
    exit 1
}

# Check .env file
Check-EnvFile

Write-ColorOutput "🐳 Taxi App Backend - Docker Manager" "Cyan"
Write-ColorOutput "Action: $Action" "White"
Write-ColorOutput ""

switch ($Action) {
    'start' {
        Write-ColorOutput "🚀 Starting services..." "Green"
        docker-compose up -d
        Write-ColorOutput ""
        Write-ColorOutput "✅ Services started successfully!" "Green"
        Write-ColorOutput "Backend API: http://localhost:3001" "Cyan"
        Write-ColorOutput "Health Check: http://localhost:3001/health" "Cyan"
        Write-ColorOutput ""
        Write-ColorOutput "Run './docker-manager.ps1 logs' to view logs" "Yellow"
    }
    
    'stop' {
        Write-ColorOutput "🛑 Stopping services..." "Yellow"
        docker-compose down
        Write-ColorOutput "✅ Services stopped successfully!" "Green"
    }
    
    'restart' {
        Write-ColorOutput "🔄 Restarting services..." "Yellow"
        docker-compose restart
        Write-ColorOutput "✅ Services restarted successfully!" "Green"
    }
    
    'logs' {
        Write-ColorOutput "📋 Showing logs (Ctrl+C to exit)..." "Cyan"
        docker-compose logs -f
    }
    
    'build' {
        Write-ColorOutput "🔨 Building Docker images..." "Cyan"
        docker-compose build --no-cache
        Write-ColorOutput "✅ Build completed successfully!" "Green"
    }
    
    'clean' {
        Write-ColorOutput "🧹 Cleaning up Docker resources..." "Yellow"
        docker-compose down -v
        docker system prune -f
        Write-ColorOutput "✅ Cleanup completed!" "Green"
    }
    
    'status' {
        Write-ColorOutput "📊 Docker Services Status:" "Cyan"
        docker-compose ps
        Write-ColorOutput ""
        Write-ColorOutput "📊 Docker Resources:" "Cyan"
        docker system df
    }
    
    default {
        Write-ColorOutput "❌ Unknown action: $Action" "Red"
        Write-ColorOutput "Available actions: start, stop, restart, logs, build, clean, status" "Yellow"
        exit 1
    }
}
