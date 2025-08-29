import os
import glob
from PIL import Image

def rotate_cubemap_images(directory):
    """
    Поворачивает изображения 'up' и 'down' на 180 градусов для всех кубических панорам в указанной директории.
    
    :param directory: Корневая директория с Neo домами
    """
    # Счетчики для статистики
    total_rotated = 0
    total_skipped = 0
    
    # Шаблоны путей для поиска изображений
    image_patterns = [
        '360/white/*/u.jpg',
        '360/white/*/d.jpg',
        '360/dark/*/u.jpg',
        '360/dark/*/d.jpg'
    ]
    
    # Функция для поиска и поворота изображений
    def process_images(root_dir):
        nonlocal total_rotated, total_skipped
        
        for pattern in image_patterns:
            search_path = os.path.join(root_dir, pattern)
            print(f"🔍 Searching: {search_path}")
            files = glob.glob(search_path, recursive=True)
            
            if not files:
                print(f"⚠️ No files found for pattern: {pattern}")
                continue
                
            print(f"📂 Found {len(files)} files for pattern: {pattern}")
            
            for filepath in files:
                try:
                    with Image.open(filepath) as img:
                        # Поворачиваем изображение на 180 градусов
                        rotated_img = img.rotate(180)
                        
                        # Сохраняем с тем же именем и форматом
                        rotated_img.save(filepath, quality=95)
                        
                        print(f"✅ Rotated: {filepath}")
                        total_rotated += 1
                
                except Exception as e:
                    print(f"❌ Error processing {filepath}: {e}")
                    total_skipped += 1
    
    # Находим все директории Neo домов
    neo_houses = [
        d for d in os.listdir(directory) 
        if os.path.isdir(os.path.join(directory, d)) and not d.startswith('.')
    ]
    
    print("🏠 Найдены Neo дома:", neo_houses)
    
    # Обрабатываем каждый дом
    for house in neo_houses:
        house_path = os.path.join(directory, house)
        print(f"\n🔄 Обработка дома: {house}")
        process_images(house_path)
    
    # Выводим статистику
    print(f"\n📊 Статистика:\n"
          f"Всего повернуто изображений: {total_rotated}\n"
          f"Пропущено изображений: {total_skipped}")

def main():
    
    # Путь к директории с Neo домами
    neo_assets_dir = 'public/assets/neo'
    
    # Проверяем существование директории
    if not os.path.exists(neo_assets_dir):
        print(f"❌ Директория не найдена: {neo_assets_dir}")
        return
    
    # Запускаем ротацию
    rotate_cubemap_images(neo_assets_dir)

if __name__ == '__main__':
    main()
