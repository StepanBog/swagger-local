# 🚀 Быстрый старт Swagger Service

## Запуск

```bash
# Запустить все сервисы
./start.sh

# Или вручную
docker-compose up -d
```

## Доступ к сервисам

- **Swagger Editor**: http://localhost:8080
- **Swagger UI**: http://localhost:8081

## Остановка

```bash
# Остановить все сервисы
./stop.sh

# Или вручную
docker-compose down
```

## Основные возможности

### Swagger Editor (http://localhost:8080)
- ✅ Редактирование OpenAPI контрактов
- ✅ Автосохранение каждые 5 секунд
- ✅ Выбор контракта из выпадающего списка
- ✅ Создание новых контрактов
- ✅ Ручное сохранение (Ctrl+S)

### Swagger UI (http://localhost:8081)
- ✅ Просмотр контрактов
- ✅ Тестирование API эндпоинтов
- ✅ Выбор контракта из выпадающего списка
- ✅ Обновление списка контрактов

### Автосохранение
- ✅ Автоматическое сохранение изменений
- ✅ Резервное копирование файлов
- ✅ Хранение последних 5 версий каждого файла

## Структура файлов

```
swagger-service/
├── contracts/          # Контракты OpenAPI
├── auto-save/          # Резервные копии
├── swagger-editor/     # Сервис редактора
├── swagger-ui/         # Сервис UI
└── docker-compose.yml  # Конфигурация Docker
```

## Полезные команды

```bash
# Просмотр логов
docker-compose logs -f

# Перезапуск сервиса
docker-compose restart swagger-editor

# Проверка статуса
docker-compose ps

# Пересборка и запуск
docker-compose up --build -d
```

## Добавление новых контрактов

1. Поместите файлы `.yaml`, `.yml` или `.json` в папку `contracts/`
2. Обновите страницу в браузере
3. Выберите новый контракт из выпадающего списка

## Устранение неполадок

### Проблемы с портами
```bash
# Проверить, какие процессы используют порты
lsof -i :8080
lsof -i :8081
```

### Проблемы с Docker
```bash
# Очистить Docker кэш
docker system prune -a
```

### Просмотр логов
```bash
# Все сервисы
docker-compose logs

# Конкретный сервис
docker-compose logs swagger-editor
``` 