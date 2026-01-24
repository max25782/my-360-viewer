# Конвертация logo2.jpeg в PNG с прозрачным фоном

## Требование

Нужно конвертировать `logo2.jpeg` в `logo2.png` с прозрачным фоном (без белого фона).

## Способы конвертации

### Способ 1: Использование онлайн инструментов (самый простой)

1. **Remove.bg** (https://www.remove.bg/)
   - Загрузите `logo2.jpeg`
   - Автоматически удалит фон
   - Скачайте PNG с прозрачным фоном
   - Сохраните как `logo2.png` в папку `public/`

2. **Photopea** (https://www.photopea.com/)
   - Откройте `logo2.jpeg`
   - Используйте Magic Wand или Background Eraser для удаления белого фона
   - Сохраните как PNG с прозрачностью

### Способ 2: Использование ImageMagick (командная строка)

Если установлен ImageMagick:

```bash
# Удалить белый фон и сделать прозрачным
magick public/logo2.jpeg -fuzz 10% -transparent white public/logo2.png

# Или более точная настройка
magick public/logo2.jpeg -fuzz 5% -transparent "#FFFFFF" public/logo2.png
```

### Способ 3: Использование Python + PIL

```python
from PIL import Image

# Открыть JPEG
img = Image.open('public/logo2.jpeg').convert('RGBA')

# Получить данные пикселей
data = img.getdata()

# Создать новый список пикселей
new_data = []
for item in data:
    # Если пиксель белый или близок к белому, сделать прозрачным
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        new_data.append((255, 255, 255, 0))  # Прозрачный
    else:
        new_data.append(item)

# Установить новые данные
img.putdata(new_data)

# Сохранить как PNG
img.save('public/logo2.png', 'PNG')
```

### Способ 4: Использование GIMP или Photoshop

1. Откройте `logo2.jpeg` в GIMP/Photoshop
2. Используйте инструмент "Magic Wand" для выбора белого фона
3. Удалите выделенный фон (Delete)
4. Сохраните как PNG с прозрачностью

## После конвертации

1. Убедитесь, что файл `logo2.png` находится в папке `public/`
2. Проверьте, что фон действительно прозрачный (откройте файл и проверьте)
3. Код уже обновлен для использования `logo2.png`

## Проверка

После создания `logo2.png`:

```bash
# Проверьте, что файл существует
ls -lh public/logo2.png

# Должен быть PNG файл с прозрачным фоном
```

## Важно

- PNG файл должен иметь прозрачный фон (alpha channel)
- Размер файла может быть больше, чем JPEG
- Убедитесь, что качество логотипа не ухудшилось

## Обновление кода

Код уже обновлен:
- `getLogoByDomain.ts` → использует `/logo2.png`
- `HeroAdvertisementBanner.tsx` → использует `/logo2.png`

После создания `logo2.png` все будет работать автоматически!
