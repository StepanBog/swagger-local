const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// Определение MIME типа
function getMimeType(filename) {
    if (filename.endsWith('.html')) return 'text/html';
    if (filename.endsWith('.css')) return 'text/css';
    if (filename.endsWith('.js')) return 'application/javascript';
    if (filename.endsWith('.json')) return 'application/json';
    if (filename.endsWith('.yaml') || filename.endsWith('.yml')) return 'application/yaml';
    return 'text/plain';
}

// Создание HTTP сервера
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    try {
        // Главная страница
        if (pathname === '/' || pathname === '/index.html') {
            const filePath = path.join(__dirname, 'index.html');
            const content = await fs.readFile(filePath, 'utf8');
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
            return;
        }

        // Статические файлы (если понадобятся)
        if (pathname.startsWith('/static/')) {
            const filePath = path.join(__dirname, pathname);
            const content = await fs.readFile(filePath, 'utf8');
            const mimeType = getMimeType(filePath);
            
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content);
            return;
        }

        // API для получения статуса сервисов
        if (pathname === '/api/status' && req.method === 'GET') {
            const services = [
                { name: 'Swagger Editor', url: 'http://swagger-editor:8080', icon: '✏️' },
                { name: 'Swagger UI', url: 'http://swagger-ui:8080', icon: '📖' },
                { name: 'Auto-save Service', url: 'http://auto-save-service:3000', icon: '💾' }
            ];

            const statusResults = [];

            for (const service of services) {
                try {
                    const response = await fetch(service.url, { method: 'HEAD' });
                    statusResults.push({
                        name: service.name,
                        url: service.url,
                        icon: service.icon,
                        status: 'online',
                        timestamp: new Date().toISOString()
                    });
                } catch (error) {
                    statusResults.push({
                        name: service.name,
                        url: service.url,
                        icon: service.icon,
                        status: 'offline',
                        timestamp: new Date().toISOString()
                    });
                }
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(statusResults));
            return;
        }

        // API для получения контрактов
        if (pathname === '/api/contracts' && req.method === 'GET') {
            try {
                const response = await fetch('http://swagger-editor:8080/contracts/');
                const contracts = await response.json();
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(contracts));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to fetch contracts' }));
            }
            return;
        }

        // Проксирование запросов к swagger-editor
        if (pathname.startsWith('/editor/')) {
            const targetPath = pathname.replace('/editor/', '/');
            const targetUrl = `http://swagger-editor:8080${targetPath}`;
            
            try {
                const response = await fetch(targetUrl);
                const content = await response.text();
                
                res.writeHead(response.status, { 'Content-Type': response.headers.get('content-type') || 'text/plain' });
                res.end(content);
            } catch (error) {
                res.writeHead(502, { 'Content-Type': 'text/plain' });
                res.end('Bad Gateway');
            }
            return;
        }

        // Проксирование запросов к swagger-ui
        if (pathname.startsWith('/ui/')) {
            const targetPath = pathname.replace('/ui/', '/');
            const targetUrl = `http://swagger-ui:8080${targetPath}`;
            
            try {
                const response = await fetch(targetUrl);
                const content = await response.text();
                
                res.writeHead(response.status, { 'Content-Type': response.headers.get('content-type') || 'text/plain' });
                res.end(content);
            } catch (error) {
                res.writeHead(502, { 'Content-Type': 'text/plain' });
                res.end('Bad Gateway');
            }
            return;
        }

        // 404 для всех остальных запросов
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <head><title>404 - Страница не найдена</title></head>
                <body>
                    <h1>404 - Страница не найдена</h1>
                    <p>Запрашиваемая страница не существует.</p>
                    <a href="/">Вернуться на главную</a>
                </body>
            </html>
        `);

    } catch (error) {
        console.error('Error handling request:', error);
        
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <head><title>500 - Внутренняя ошибка сервера</title></head>
                <body>
                    <h1>500 - Внутренняя ошибка сервера</h1>
                    <p>Произошла ошибка при обработке запроса.</p>
                    <a href="/">Вернуться на главную</a>
                </body>
            </html>
        `);
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Главный сервер запущен на порту ${PORT}`);
    console.log(`📱 Главная страница: http://localhost:${PORT}`);
    console.log(`📊 API статуса: http://localhost:${PORT}/api/status`);
    console.log(`📁 API контрактов: http://localhost:${PORT}/api/contracts`);
}); 