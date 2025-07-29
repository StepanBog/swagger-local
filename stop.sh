#!/bin/bash

echo "🛑 Stopping Swagger Service..."

# Останавливаем контейнеры
docker-compose down

echo "✅ Swagger Service stopped!"
echo ""
echo "📋 To start again, run: ./start.sh" 