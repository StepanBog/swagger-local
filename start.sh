#!/bin/bash

echo "🚀 Starting Swagger Service..."

# Проверяем, установлен ли Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Проверяем, установлен ли Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Stopping existing containers..."
docker-compose down

# Запускаем контейнеры
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Ждем немного для запуска
echo "⏳ Waiting for services to start..."
sleep 5

# Проверяем статус
echo "📊 Checking service status..."
docker-compose ps

echo ""
echo "✅ Swagger Service is running!"
echo ""
echo "🌐 Access URLs:"
echo "   Главная страница: http://localhost:3000"
echo "   Swagger Editor:   http://localhost:8080"
echo "   Swagger UI:       http://localhost:8081"
echo ""
echo "📁 Contracts are stored in: ./contracts/"
echo "💾 Auto-save backups in: ./auto-save/"
echo ""
echo "📋 Useful commands:"
echo "   View logs:      docker-compose logs -f"
echo "   Stop services:  docker-compose down"
echo "   Restart:        docker-compose restart" 