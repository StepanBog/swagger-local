const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.text({ type: 'application/yaml' }));
app.use(express.json());

// Статические файлы
app.use(express.static('.'));
app.use('/swagger-editor', express.static('/usr/local/lib/node_modules/swagger-editor-dist'));

// Тестовая страница
app.get('/test', (req, res) => {
    const testHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Swagger Editor</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-editor-dist@4.14.6/swagger-editor.css" >
</head>
<body>
    <div id="swagger-editor"></div>
    <div style="position: fixed; top: 10px; right: 10px; z-index: 1000; background: white; padding: 10px; border: 1px solid #ccc;">
        <h3>Test Status</h3>
        <div id="status">Loading...</div>
        <button onclick="testLoad()">Test Load Contract</button>
        <button onclick="checkContracts()">Check Contracts</button>
    </div>

    <script src="https://unpkg.com/swagger-editor-dist@4.14.6/swagger-editor-bundle.js"></script>
    <script>
        let editor = null;
        
        window.onload = function() {
            console.log('Window loaded');
            
            if (typeof SwaggerEditorBundle === 'undefined') {
                document.getElementById('status').innerHTML = 'ERROR: SwaggerEditorBundle not loaded';
                return;
            }
            
            console.log('SwaggerEditorBundle available');
            
            try {
                editor = SwaggerEditorBundle({
                    dom_id: '#swagger-editor',
                    presets: [
                        SwaggerEditorBundle.presets
                    ],
                    plugins: [
                        SwaggerEditorBundle.plugins
                    ],
                    onComplete: function() {
                        console.log('Editor loaded successfully');
                        document.getElementById('status').innerHTML = '✅ Editor loaded successfully';
                    },
                    onError: function(error) {
                        console.error('Editor error:', error);
                        document.getElementById('status').innerHTML = '❌ Editor error: ' + error;
                    }
                });
                
                console.log('Editor instance created');
                
            } catch (error) {
                console.error('Error creating editor:', error);
                document.getElementById('status').innerHTML = '❌ Error creating editor: ' + error.message;
            }
        };
        
        function testLoad() {
            if (!editor) {
                alert('Editor not ready');
                return;
            }
            
            const testContent = \`openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
  description: Test API for Swagger Editor
paths:
  /test:
    get:
      summary: Test endpoint
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Hello World"\`;
            
            try {
                editor.specActions.updateSpec(testContent);
                document.getElementById('status').innerHTML = '✅ Test content loaded';
            } catch (error) {
                console.error('Error loading test content:', error);
                document.getElementById('status').innerHTML = '❌ Error loading test content: ' + error.message;
            }
        }
        
        function checkContracts() {
            fetch('/contracts/')
                .then(response => response.json())
                .then(contracts => {
                    console.log('Contracts:', contracts);
                    document.getElementById('status').innerHTML = '✅ Contracts: ' + contracts.join(', ');
                })
                .catch(error => {
                    console.error('Error loading contracts:', error);
                    document.getElementById('status').innerHTML = '❌ Error loading contracts: ' + error.message;
                });
        }
    </script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(testHtml);
});

// Директория для контрактов
const CONTRACTS_DIR = path.join(__dirname, 'contracts');

// Создание директории контрактов если не существует
async function ensureContractsDir() {
    try {
        await fs.access(CONTRACTS_DIR);
    } catch {
        await fs.mkdir(CONTRACTS_DIR, { recursive: true });
    }
}

// API для получения списка контрактов
app.get('/contracts', async (req, res) => {
    try {
        await ensureContractsDir();
        const files = await fs.readdir(CONTRACTS_DIR);
        const yamlFiles = files.filter(file => 
            file.endsWith('.yaml') || file.endsWith('.yml') || file.endsWith('.json')
        );
        res.json(yamlFiles);
    } catch (error) {
        console.error('Error reading contracts directory:', error);
        res.status(500).json({ error: 'Failed to read contracts' });
    }
});

// API для получения контракта
app.get('/contracts/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(CONTRACTS_DIR, filename);
        
        const content = await fs.readFile(filePath, 'utf8');
        res.setHeader('Content-Type', 'application/yaml');
        res.send(content);
    } catch (error) {
        console.error('Error reading contract:', error);
        res.status(404).json({ error: 'Contract not found' });
    }
});

// API для создания нового контракта
app.post('/contracts/:filename', async (req, res) => {
    try {
        await ensureContractsDir();
        const filename = req.params.filename;
        const filePath = path.join(CONTRACTS_DIR, filename);
        const content = req.body;
        
        await fs.writeFile(filePath, content, 'utf8');
        res.status(201).json({ message: 'Contract created successfully' });
    } catch (error) {
        console.error('Error creating contract:', error);
        res.status(500).json({ error: 'Failed to create contract' });
    }
});

// API для обновления контракта
app.put('/contracts/:filename', async (req, res) => {
    try {
        await ensureContractsDir();
        const filename = req.params.filename;
        const filePath = path.join(CONTRACTS_DIR, filename);
        const content = req.body;
        
        await fs.writeFile(filePath, content, 'utf8');
        res.json({ message: 'Contract updated successfully' });
    } catch (error) {
        console.error('Error updating contract:', error);
        res.status(500).json({ error: 'Failed to update contract' });
    }
});

// API для удаления контракта
app.delete('/contracts/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(CONTRACTS_DIR, filename);
        
        await fs.unlink(filePath);
        res.json({ message: 'Contract deleted successfully' });
    } catch (error) {
        console.error('Error deleting contract:', error);
        res.status(500).json({ error: 'Failed to delete contract' });
    }
});

// Создание дефолтного контракта при запуске
async function createDefaultContract() {
    try {
        await ensureContractsDir();
        const defaultContractPath = path.join(CONTRACTS_DIR, 'default.yaml');
        
        try {
            await fs.access(defaultContractPath);
        } catch {
            const defaultContent = `openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
  description: A sample API for demonstration
paths:
  /hello:
    get:
      summary: Hello endpoint
      description: Returns a greeting message
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Hello, World!"
                  timestamp:
                    type: string
                    format: date-time
                    example: "2023-01-01T00:00:00Z"`;
            
            await fs.writeFile(defaultContractPath, defaultContent, 'utf8');
            console.log('Default contract created');
        }
    } catch (error) {
        console.error('Error creating default contract:', error);
    }
}

// Запуск сервера
app.listen(PORT, async () => {
    console.log(`Swagger Editor server running on port ${PORT}`);
    await createDefaultContract();
}); 