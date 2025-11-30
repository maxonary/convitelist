#!/bin/bash

# Deployment script for Convitelist
# This script helps deploy the application using Docker Compose

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warn ".env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_warn "Please edit .env file with your configuration before continuing."
        print_warn "Press Enter to continue after editing, or Ctrl+C to cancel..."
        read
    else
        print_error ".env.example not found. Please create .env file manually."
        exit 1
    fi
fi

# Function to generate a random secret
generate_secret() {
    openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64
}

# Check if SESSION_SECRET is set to default
if grep -q "change-this-to-a-very-secure-random-secret-key" .env 2>/dev/null; then
    print_warn "SESSION_SECRET is set to default value. Generating a new one..."
    SECRET=$(generate_secret)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/SESSION_SECRET=.*/SESSION_SECRET=$SECRET/" .env
    else
        # Linux
        sed -i "s/SESSION_SECRET=.*/SESSION_SECRET=$SECRET/" .env
    fi
    print_info "Generated new SESSION_SECRET"
fi

# Parse command line arguments
COMMAND=${1:-up}

case $COMMAND in
    up|start)
        print_info "Starting Convitelist services..."
        docker-compose up -d
        print_info "Waiting for services to be healthy..."
        sleep 5
        print_info "Running database migrations..."
        docker-compose exec -T backend npx prisma migrate deploy || print_warn "Migration may have failed, check logs"
        print_info "Services started successfully!"
        print_info "Frontend: http://localhost:3000"
        print_info "Backend API: http://localhost:3001"
        print_info "View logs: docker-compose logs -f"
        ;;
    down|stop)
        print_info "Stopping Convitelist services..."
        docker-compose down
        print_info "Services stopped."
        ;;
    restart)
        print_info "Restarting Convitelist services..."
        docker-compose restart
        print_info "Services restarted."
        ;;
    build)
        print_info "Building Docker images..."
        docker-compose build
        print_info "Build complete."
        ;;
    logs)
        docker-compose logs -f
        ;;
    update)
        print_info "Updating Convitelist..."
        git pull || print_warn "Could not pull latest changes"
        print_info "Rebuilding images..."
        docker-compose build
        print_info "Restarting services..."
        docker-compose up -d
        print_info "Running migrations..."
        docker-compose exec -T backend npx prisma migrate deploy || print_warn "Migration may have failed, check logs"
        print_info "Update complete!"
        ;;
    backup)
        print_info "Creating database backup..."
        BACKUP_DIR="./backups"
        mkdir -p $BACKUP_DIR
        BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).db"
        docker-compose exec -T backend cp /app/data/prod.db /app/data/backup_$(date +%Y%m%d_%H%M%S).db || {
            print_error "Failed to create backup"
            exit 1
        }
        print_info "Backup created: $BACKUP_FILE"
        ;;
    clean)
        print_warn "This will remove all containers, volumes, and images. Are you sure? (y/N)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            print_info "Cleaning up..."
            docker-compose down -v
            docker system prune -f
            print_info "Cleanup complete."
        else
            print_info "Cleanup cancelled."
        fi
        ;;
    health)
        print_info "Checking service health..."
        docker-compose ps
        echo ""
        print_info "Backend health:"
        curl -s http://localhost:3001/api || print_error "Backend is not responding"
        echo ""
        print_info "Frontend health:"
        curl -s http://localhost:3000/health || print_error "Frontend is not responding"
        ;;
    *)
        echo "Usage: $0 {up|down|restart|build|logs|update|backup|clean|health}"
        echo ""
        echo "Commands:"
        echo "  up, start    - Start all services"
        echo "  down, stop   - Stop all services"
        echo "  restart      - Restart all services"
        echo "  build        - Build Docker images"
        echo "  logs         - View logs (follow mode)"
        echo "  update       - Pull latest code and update"
        echo "  backup       - Backup database"
        echo "  clean        - Remove all containers and volumes"
        echo "  health       - Check service health"
        exit 1
        ;;
esac

