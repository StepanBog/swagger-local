FROM node:18-alpine

# Создание рабочей директории
WORKDIR /swagger-ui

# Создание директории для контрактов
RUN mkdir -p contracts

# Копирование кастомных файлов
COPY index.html ./dist/index.html
COPY server.js ./server.js

# Установка зависимостей для сервера (не нужны для простого HTTP сервера)
# RUN npm install express cors

# Экспорт порта
EXPOSE 8080

# Запуск кастомного сервера
CMD ["node", "server.js"] 