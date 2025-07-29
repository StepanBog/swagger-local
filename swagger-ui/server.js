const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const CONTRACTS_DIR = path.join(__dirname, 'contracts');

// Создание директории контрактов если не существует
async function ensureContractsDir() {
    try {
        await fs.access(CONTRACTS_DIR);
    } catch {
        await fs.mkdir(CONTRACTS_DIR, { recursive: true });
    }
}

// Чтение файла
async function readFile(filePath) {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch (error) {
        throw new Error('File not found');
    }
}

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
    
    console.log(`Request: ${req.method} ${pathname}`);

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
        // API для получения списка контрактов
        if ((pathname === '/contracts' || pathname === '/contracts/') && req.method === 'GET') {
            await ensureContractsDir();
            const files = await fs.readdir(CONTRACTS_DIR);
            const yamlFiles = files.filter(file => 
                file.endsWith('.yaml') || file.endsWith('.yml') || file.endsWith('.json')
            );
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(yamlFiles));
            return;
        }

        // API для получения контракта
        if (pathname.startsWith('/contracts/') && req.method === 'GET') {
            const filename = pathname.replace('/contracts/', '');
            const filePath = path.join(CONTRACTS_DIR, filename);
            const content = await readFile(filePath);
            
            const contentType = filename.endsWith('.json') ? 'application/json' : 'application/yaml';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
            return;
        }

        // Статические файлы
        let filePath;
        if (pathname === '/' || pathname === '/index.html') {
            filePath = path.join(__dirname, 'dist', 'index.html');
        } else if (pathname.startsWith('/contracts/')) {
            // Это уже обработано выше, не должно сюда попасть
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            return;
        } else {
            filePath = path.join(__dirname, 'dist', pathname);
        }

        const content = await readFile(filePath);
        const mimeType = getMimeType(filePath);
        
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(content);

    } catch (error) {
        console.error('Error handling request:', error);
        
        if (error.message === 'File not found') {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        } else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }
});

server.listen(PORT, () => {
    console.log(`Swagger UI server running on port ${PORT}`);
}); 