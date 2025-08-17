#!/usr/bin/env python3
"""
Скрипт для поворота ВСЕХ изображений u.jpg и d.jpg на 180° 
в доме Pine (папка 3D)
"""

import os
import glob
import shutil
from datetime import datetime
from PIL import Image

def create_backup(file_path):
    """Создать бэкап файла"""
    backup_path = f"{file_path}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    shutil.copy2(file_path, backup_path)
    return backup_path

def rotate_image_180(image_path, create_backup_flag=True):
    """Повернуть изображение на 180 градусов"""
    try:
        if create_backup_flag:
            backup_path = create_backup(image_path)
            print(f"💾 Бэкап: {backup_path}")
        
        with Image.open(image_path) as img:
            rotated_img = img.rotate(180)
            rotated_img.save(image_path, quality=95, optimize=True)
            print(f"✅ Повернуто: {image_path}")
            return True
    except Exception as e:
        print(f"❌ Ошибка {image_path}: {e}")
        return False

def main():
    # Возможные пути к дому Pine (в папке 3D)
    possible_paths = [
        "public/assets/Pine/360",
        "public/assets/pine/360", 
        "assets/Pine/360",
        "assets/pine/360"
    ]
    
    pine_path = None
    
    # Найти правильный путь
    for path in possible_paths:
        if os.path.exists(path):
            pine_path = path
            break
    
    if not pine_path:
        print("❌ Папка Pine/3D не найдена!")
        print("🔍 Проверьте следующие пути:")
        for path in possible_paths:
            print(f"  - {path}")
        return
    
    print(f"🏠 Найден дом Pine: {pine_path}")
    
    # Найти ВСЕ файлы u.jpg и d.jpg во всех комнатах
    u_files = glob.glob(f"{pine_path}/**/u.jpg", recursive=True)
    d_files = glob.glob(f"{pine_path}/**/d.jpg", recursive=True)
    u_webp = glob.glob(f"{pine_path}/**/u.webp", recursive=True)
    d_webp = glob.glob(f"{pine_path}/**/d.webp", recursive=True)
    
    all_files = u_files + d_files + u_webp + d_webp
    
    if not all_files:
        print("❌ Файлы u.jpg/d.jpg/u.webp/d.webp не найдены!")
        print(f"📁 Содержимое папки {pine_path}:")
        try:
            dirs = [d for d in os.listdir(pine_path) if os.path.isdir(os.path.join(pine_path, d))]
            print(f"  Комнаты: {', '.join(dirs)}")
            for room in dirs:
                room_path = os.path.join(pine_path, room)
                files = os.listdir(room_path)
                print(f"    {room}: {', '.join(files)}")
        except:
            print("  Не удалось прочитать содержимое")
        return
    
    # Группировка по комнатам для красивого вывода
    rooms = {}
    for file_path in all_files:
        room_name = file_path.split(os.sep)[-2]  # Получаем название комнаты
        if room_name not in rooms:
            rooms[room_name] = []
        rooms[room_name].append(file_path)
    
    print(f"📁 Найдено {len(all_files)} файлов в доме Pine:")
    for room, files in rooms.items():
        print(f"  🏠 {room}: {len(files)} файлов")
        for file_path in files:
            filename = os.path.basename(file_path)
            print(f"    - {filename}")
    
    # Подтверждение
    choice = input(f"\n❓ Повернуть ВСЕ {len(all_files)} изображений u/d на 180°? (y/n): ").strip().lower()
    if choice != 'y':
        print("❌ Отменено")
        return
    
    # Вопрос о бэкапе
    backup_choice = input("💾 Создать бэкап перед поворотом? (y/n): ").strip().lower()
    create_backup_flag = backup_choice == 'y'
    
    # Поворачиваем изображения
    print(f"\n🔄 Поворот всех изображений u/d в доме Pine...")
    success_count = 0
    total_count = len(all_files)
    
    for i, image_path in enumerate(all_files, 1):
        print(f"\n[{i}/{total_count}] Обрабатываем: {image_path}")
        if rotate_image_180(image_path, create_backup_flag):
            success_count += 1
    
    print(f"\n✅ Результат:")
    print(f"  🏠 Дом: Pine")
    print(f"  📁 Папка: 3D (360° files)")
    print(f"  🏠 Комнат обработано: {len(rooms)}")
    print(f"  ✅ Успешно повернуто: {success_count}/{total_count} файлов")
    if success_count < total_count:
        print(f"  ❌ Ошибки: {total_count - success_count} файлов")
    print(f"  🔄 Все изображения u и d в Pine повернуты на 180°")
    
    print(f"\n🏠 Обработанные комнаты:")
    for room in rooms.keys():
        print(f"  ✅ {room}")
    
    if create_backup_flag:
        print(f"\n💾 Бэкапы сохранены с расширением .backup_YYYYMMDD_HHMMSS")

if __name__ == "__main__":
    main()
