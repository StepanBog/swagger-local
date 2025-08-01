# Swagger Local Service

Локальный сервис для работы с Swagger Editor и Swagger UI с поддержкой автосохранения и управления контрактами.

## 🚀 Возможности

- **Swagger Editor** - веб-редактор для создания и редактирования OpenAPI спецификаций
- **Swagger UI** - интерактивная документация API
- **Автосохранение** - автоматическое сохранение изменений каждые 3 секунды
- **Управление контрактами** - создание, редактирование и переключение между контрактами
- **Общий интерфейс** - центральная страница для доступа ко всем сервисам
- **Docker Compose** - простое развертывание всех сервисов

## 📋 Требования

- Docker
- Docker Compose

## 🛠 Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/StepanBog/swagger-local.git
cd swagger-local
```

### 2. Запуск проекта
```bash
# Запуск всех сервисов
docker-compose up -d

# Или с пересборкой
docker-compose up --build -d
```

### 3. Остановка проекта
```bash
docker-compose down
```

## 🌐 Доступные сервисы

После запуска будут доступны следующие URL:

- **Главная страница**: http://localhost:3000
- **Swagger Editor**: http://localhost:8080
- **Swagger UI**: http://localhost:8081

## 📁 Структура проекта

```
swagger-service/
├── docker-compose.yml          # Конфигурация Docker Compose
├── swagger-editor/             # Swagger Editor сервис
│   ├── Dockerfile
│   ├── index.html              # Кастомная страница редактора
│   ├── auto-save.js            # Скрипт автосохранения
│   └── server.js               # Node.js сервер
├── swagger-ui/                 # Swagger UI сервис
│   ├── Dockerfile
│   ├── index.html              # Кастомная страница UI
│   └── server.js               # Node.js сервер
├── auto-save/                  # Сервис мониторинга файлов
│   ├── Dockerfile
│   └── auto-save.js            # Мониторинг изменений
├── main-server/                # Главный сервер
│   ├── Dockerfile
│   ├── index.html              # Главная страница
│   └── main-server.js          # API и прокси
├── contracts/                  # Директория с контрактами
├── start.sh                    # Скрипт запуска
└── stop.sh                     # Скрипт остановки
```

## 🔧 Использование

### Swagger Editor

1. Откройте http://localhost:8080
2. Выберите контракт из выпадающего списка
3. Редактируйте спецификацию
4. Изменения сохраняются автоматически каждые 3 секунды
5. Используйте кнопку "Save Contract" для ручного сохранения

### Swagger UI

1. Откройте http://localhost:8081
2. Выберите контракт для просмотра
3. Изучайте интерактивную документацию API

### Главная страница

1. Откройте http://localhost:3000
2. Получите обзор всех сервисов
3. Проверьте статус сервисов
4. Перейдите к нужному сервису

## ⌨️ Горячие клавиши

- **Ctrl+S** (Windows/Linux) или **Cmd+S** (Mac) - ручное сохранение в Swagger Editor

## 🔄 Автосохранение

- Автоматическое сохранение каждые 3 секунды
- Уведомления о статусе сохранения
- Отслеживание изменений в реальном времени
- Поддержка ручного сохранения

## 📝 Поддерживаемые форматы

- YAML (.yaml, .yml)
- JSON (.json)

## 🐛 Устранение неполадок

### Проблемы с автосохранением
- Проверьте консоль браузера на наличие ошибок
- Убедитесь, что выбран контракт в выпадающем списке
- Проверьте логи контейнеров: `docker-compose logs swagger-editor`

### Проблемы с загрузкой контрактов
- Убедитесь, что файлы контрактов находятся в директории `contracts/`
- Проверьте права доступа к файлам
- Перезапустите сервисы: `docker-compose restart`

### Проблемы с Docker
- Остановите все контейнеры: `docker-compose down`
- Удалите образы: `docker-compose down --rmi all`
- Пересоберите: `docker-compose up --build -d`

## 📊 Статус проекта

- ✅ Swagger Editor работает
- ✅ Swagger UI работает
- ✅ Автосохранение работает
- ✅ Переключение контрактов работает
- ✅ Общий интерфейс работает

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License

## 👨‍💻 Автор

StepanBog - [GitHub](https://github.com/StepanBog)

## 📞 Поддержка

Если у вас есть вопросы или проблемы, создайте Issue в репозитории. 