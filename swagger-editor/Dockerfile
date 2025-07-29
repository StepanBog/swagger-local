FROM node:18-alpine

# Создание рабочей директории
WORKDIR /swagger-editor

# Создание директории для контрактов
RUN mkdir -p contracts

# Копирование кастомных файлов
COPY index.html ./index.html
COPY auto-save.js ./auto-save.js
COPY server.js ./server.js

# Установка зависимостей для сервера
RUN npm install express cors

# Экспорт порта
EXPOSE 8080

# Запуск кастомного сервера
CMD ["node", "server.js"] 