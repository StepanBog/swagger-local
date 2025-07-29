// Автосохранение для Swagger Editor
let autoSaveInterval;
let currentContract = '';
let lastSavedContent = '';

// Делаем lastSavedContent глобальной для доступа из других скриптов
window.lastSavedContent = '';

function initializeAutoSave() {
    console.log('Initializing auto-save...');
    
    // Запуск автосохранения каждые 3 секунды
    autoSaveInterval = setInterval(autoSave, 3000);
    
    // Инициализируем lastSavedContent
    if (window.swaggerEditor) {
        lastSavedContent = window.swaggerEditor.specSelectors.specStr();
        window.lastSavedContent = lastSavedContent;
        console.log('Initialized lastSavedContent:', lastSavedContent.length, 'characters');
    }
    
    // Слушатель изменений в редакторе
    if (window.swaggerEditor) {
        // Сохраняем оригинальную функцию
        const originalUpdateSpec = window.swaggerEditor.specActions.updateSpec;
        
        window.swaggerEditor.specActions.updateSpec = function(spec) {
            // Вызываем оригинальную функцию
            originalUpdateSpec.call(this, spec);
            
            // Отслеживаем изменения
            trackChanges();
        };
    }
    
    // Слушатель событий клавиатуры
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 's') {
                e.preventDefault();
                manualSave();
            }
        }
    });
}

function trackChanges() {
    if (window.swaggerEditor) {
        const currentContent = window.swaggerEditor.specSelectors.specStr();
        if (currentContent !== lastSavedContent) {
            console.log('Content changed, will auto-save...');
            // Не обновляем lastSavedContent здесь - это произойдет после успешного сохранения
        }
    }
}

function autoSave() {
    if (!window.swaggerEditor) return;
    
    const currentContent = window.swaggerEditor.specSelectors.specStr();
    const selectedContract = document.getElementById('contract-select').value;
    
    if (!selectedContract) {
        console.log('No contract selected for auto-save');
        return;
    }
    
    // Проверяем, есть ли изменения
    if (currentContent !== lastSavedContent && currentContent.trim() !== '') {
        console.log('Auto-saving contract:', selectedContract);
        console.log('Content length:', currentContent.length);
        
        fetch(`/contracts/${selectedContract}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/yaml'
            },
            body: currentContent
        })
        .then(response => {
            if (response.ok) {
                console.log('Auto-save successful');
                lastSavedContent = currentContent;
                showAutoSaveNotification('Auto-saved successfully!', 'success');
            } else {
                console.error('Auto-save failed, status:', response.status);
                showAutoSaveNotification('Auto-save failed!', 'error');
            }
        })
        .catch(error => {
            console.error('Auto-save error:', error);
            showAutoSaveNotification('Auto-save error!', 'error');
        });
    } else {
        console.log('No changes detected or empty content');
    }
}

function manualSave() {
    if (!window.swaggerEditor) return;
    
    const currentContent = window.swaggerEditor.specSelectors.specStr();
    const selectedContract = document.getElementById('contract-select').value;
    
    if (!selectedContract) {
        alert('Please select a contract to save');
        return;
    }
    
    console.log('Manual save for contract:', selectedContract);
    
    fetch(`/contracts/${selectedContract}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/yaml'
        },
        body: currentContent
    })
    .then(response => {
        if (response.ok) {
            console.log('Manual save successful');
            lastSavedContent = currentContent;
            showAutoSaveNotification('Saved successfully!', 'success');
        } else {
            console.error('Manual save failed');
            showAutoSaveNotification('Save failed!', 'error');
        }
    })
    .catch(error => {
        console.error('Manual save error:', error);
        showAutoSaveNotification('Save error!', 'error');
    });
}

function showAutoSaveNotification(message, type) {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.auto-save-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = 'auto-save-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 15px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: opacity 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Экспорт функций для использования в других скриптах
window.autoSaveFunctions = {
    initializeAutoSave,
    manualSave,
    autoSave
}; 