#!/usr/bin/env python3
"""
Скрипт для создания файла f.webp в ванной Hemlock
"""

import os
from PIL import Image
import shutil

def create_front_image(bathroom_path):
    """Создать front изображение из back с поворотом на 180°"""
    try:
        # Проверяем наличие back.webp
        back_path = os.path.join(bathroom_path, "b.webp")
        if not os.path.exists(back_path):
            print(f"❌ Файл {back_path} не найден!")
            return False
        
        # Создаем front из back с поворотом на 180°
        with Image.open(back_path) as img:
            # Поворачиваем на 180°
            rotated_img = img.rotate(180)
            
            # Сохраняем как f.webp
            front_path = os.path.join(bathroom_path, "f.webp")
            rotated_img.save(front_path, "WEBP", quality=95, method=6)
            print(f"✅ Создан файл: {front_path}")
            
            # Также создаем jpg версию
            front_jpg_path = os.path.join(bathroom_path, "f.jpg")
            rotated_img.save(front_jpg_path, "JPEG", quality=95)
            print(f"✅ Создан файл: {front_jpg_path}")
            
            return True
            
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return False

def main():
    # Возможные пути к ванной Hemlock
    possible_paths = [
        "public/assets/Hemlock/360/bathroom",
        "public/assets/hemlock/360/bathroom",
        "assets/Hemlock/360/bathroom",
        "assets/hemlock/360/bathroom"
    ]
    
    bathroom_path = None
    
    # Найти правильный путь
    for path in possible_paths:
        if os.path.exists(path):
            bathroom_path = path
            break
    
    if not bathroom_path:
        print("❌ Папка ванной Hemlock не найдена!")
        print("🔍 Проверьте следующие пути:")
        for path in possible_paths:
            print(f"  - {path}")
        return
    
    print(f"🏠 Найдена ванная Hemlock: {bathroom_path}")
    
    # Проверяем существующие файлы
    files = os.listdir(bathroom_path)
    print("\n📁 Текущие файлы:")
    for file in sorted(files):
        print(f"  - {file}")
    
    # Проверяем, нет ли уже f.webp/f.jpg
    if "f.webp" in files or "f.jpg" in files:
        print("\n⚠️ Внимание! Файлы f.webp и/или f.jpg уже существуют!")
        choice = input("❓ Хотите пересоздать эти файлы? (y/n): ").strip().lower()
        if choice != 'y':
            print("❌ Отменено")
            return
        
        # Создаем бэкапы если файлы существуют
        if "f.webp" in files:
            backup = "f.webp.backup"
            shutil.copy2(os.path.join(bathroom_path, "f.webp"), 
                        os.path.join(bathroom_path, backup))
            print(f"💾 Создан бэкап: {backup}")
        
        if "f.jpg" in files:
            backup = "f.jpg.backup"
            shutil.copy2(os.path.join(bathroom_path, "f.jpg"), 
                        os.path.join(bathroom_path, backup))
            print(f"💾 Создан бэкап: {backup}")
    
    # Создаем front изображения
    print("\n🔄 Создаем front изображения из back...")
    if create_front_image(bathroom_path):
        print("\n✅ Готово!")
        print("  🏠 Дом: Hemlock")
        print("  🛁 Комната: Bathroom")
        print("  📄 Созданы файлы: f.webp и f.jpg")
        
        # Проверяем новые файлы
        new_files = [f for f in os.listdir(bathroom_path) if f.startswith('f.')]
        print("\n📁 Новые файлы:")
        for file in sorted(new_files):
            print(f"  - {file}")
    else:
        print("\n❌ Не удалось создать front изображения")

if __name__ == "__main__":
    main()
