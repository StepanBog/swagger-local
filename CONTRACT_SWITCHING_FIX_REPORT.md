# Отчет об исправлении переключения контрактов

**Дата**: 29 июля 2025  
**Время**: 19:30  
**Статус**: ✅ ПРОБЛЕМА ИСПРАВЛЕНА

## 🚨 Исходная проблема

### **Проблема**: Контракты сбрасываются на default при переключении
- При выборе контракта из выпадающего списка происходил сброс на первый контракт (default)
- Выбранный контракт не сохранялся при переключении
- Автоматическая загрузка первого контракта конфликтовала с пользовательским выбором

## 🔍 Диагностика

### **Проблемный код** (до исправления):
```javascript
// Загрузка списка контрактов
function loadContracts() {
    // ... загрузка контрактов ...
    .then(contracts => {
        const select = document.getElementById('contract-select');
        select.innerHTML = ''; // ❌ Очищаем список
        
        contracts.forEach(contract => {
            const option = document.createElement('option');
            option.value = contract;
            option.textContent = contract;
            select.appendChild(option);
        });

        if (contracts.length > 0) {
            select.value = contracts[0]; // ❌ Всегда устанавливаем первый
            loadContract(contracts[0]); // ❌ Всегда загружаем первый
        }
    });
}
```

### **Проблемы**:
1. **Потеря выбранного значения** - при обновлении списка контрактов терялось текущее значение
2. **Принудительная загрузка первого контракта** - всегда загружался первый контракт, игнорируя выбор пользователя
3. **Конфликт с автосохранением** - загрузка контракта могла конфликтовать с автосохранением

## ✅ Решение

### **Исправленный код**:

#### 1. **Сохранение выбранного значения**:
```javascript
function loadContracts() {
    // ... загрузка контрактов ...
    .then(contracts => {
        const select = document.getElementById('contract-select');
        const currentValue = select.value; // ✅ Сохраняем текущее значение
        select.innerHTML = '';
        
        contracts.forEach(contract => {
            const option = document.createElement('option');
            option.value = contract;
            option.textContent = contract;
            select.appendChild(option);
        });

        // ✅ Восстанавливаем выбранное значение или устанавливаем первое
        if (currentValue && contracts.includes(currentValue)) {
            select.value = currentValue;
        } else if (contracts.length > 0) {
            select.value = contracts[0];
            loadContract(contracts[0]);
        }
    });
}
```

#### 2. **Управление автосохранением при загрузке контракта**:
```javascript
function loadContract(filename) {
    // ... загрузка контракта ...
    .then(content => {
        if (window.swaggerEditor && window.swaggerEditor.specActions) {
            // ✅ Временно отключаем автосохранение при загрузке контракта
            const wasAutoSaveEnabled = window.autoSaveInterval;
            if (wasAutoSaveEnabled) {
                clearInterval(window.autoSaveInterval);
            }
            
            window.swaggerEditor.specActions.updateSpec(content);
            
            // ✅ Восстанавливаем автосохранение через задержку
            if (wasAutoSaveEnabled) {
                setTimeout(() => {
                    if (window.autoSaveFunctions && window.autoSaveFunctions.initializeAutoSave) {
                        window.autoSaveFunctions.initializeAutoSave();
                    }
                }, 1000);
            }
        }
    });
}
```

#### 3. **Добавлен обработчик кнопки сохранения**:
```javascript
// ✅ Обработчик кнопки сохранения контракта
document.getElementById('save-contract').addEventListener('click', function() {
    if (window.autoSaveFunctions && window.autoSaveFunctions.manualSave) {
        window.autoSaveFunctions.manualSave();
    } else {
        console.error('Auto-save functions not available');
    }
});
```

## 🔧 Технические детали

### **Что было исправлено**:
1. **Сохранение состояния выбора** - текущий выбранный контракт сохраняется при обновлении списка
2. **Умная загрузка контрактов** - загружается только первый контракт при инициализации, не при каждом обновлении
3. **Управление автосохранением** - автосохранение временно отключается при загрузке контракта
4. **Добавлена кнопка сохранения** - ручное сохранение через кнопку "Save Contract"

### **Файлы изменены**:
- `swagger-editor/index.html` - исправлена логика переключения контрактов
- `swagger-editor/` - пересобран Docker контейнер

## 📊 Результат

### ✅ **Исправлено**:
- Переключение между контрактами работает корректно
- Выбранный контракт сохраняется при обновлении списка
- Нет конфликтов с автосохранением
- Добавлена функциональность ручного сохранения

### ✅ **Проверено**:
- Выбор контракта из выпадающего списка работает
- Выбранный контракт не сбрасывается на default
- Автосохранение работает корректно
- Ручное сохранение через кнопку работает

## 🎯 Заключение

**Проблема с переключением контрактов полностью исправлена!**

Теперь Swagger Editor корректно работает с переключением контрактов:
- ✅ Выбор контракта из списка работает стабильно
- ✅ Выбранный контракт сохраняется при обновлении
- ✅ Автосохранение не конфликтует с загрузкой контрактов
- ✅ Ручное сохранение доступно через кнопку

**Доступные URL:**
- **Swagger Editor**: http://localhost:8080
- **Swagger UI**: http://localhost:8081
- **Main Server**: http://localhost:3000 