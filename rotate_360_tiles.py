#!/usr/bin/env python3
"""
Скрипт для поворота изображений u.jpg и d.jpg на 180 градусов
в директории assets/premium/Aspen/360/living/
"""

import os
from PIL import Image

def rotate_images(directory_path):
    """
    Поворачивает изображения u.jpg и d.jpg на 180 градусов в указанной директории
    """
    # Проверяем существование директории
    if not os.path.exists(directory_path):
        print(f"Ошибка: Директория {directory_path} не существует")
        return False
    
    # Файлы для поворота
    files_to_rotate = ["u.jpg", "d.jpg"]
    
    for filename in files_to_rotate:
        file_path = os.path.join(directory_path, filename)
        
        # Проверяем существование файла
        if not os.path.exists(file_path):
            print(f"Предупреждение: Файл {file_path} не найден")
            continue
        
        try:
            # Открываем изображение
            print(f"Открываю {file_path}...")
            image = Image.open(file_path)
            
            # Создаем резервную копию
            backup_path = file_path.replace(".jpg", "_backup.jpg")
            if not os.path.exists(backup_path):
                image.save(backup_path)
                print(f"Создана резервная копия: {backup_path}")
            
            # Поворачиваем на 180 градусов
            rotated_image = image.rotate(180)
            
            # Сохраняем с тем же качеством
            print(f"Поворачиваю {filename} на 180 градусов...")
            rotated_image.save(file_path, quality=95)
            
            print(f"Успешно повернут файл: {filename}")
        
        except Exception as e:
            print(f"Ошибка при обработке {file_path}: {e}")
    
    return True

if __name__ == "__main__":
    # Путь к директории с изображениями
    target_dir = os.path.join("public", "assets", "premium", "Aspen", "360", "living")
    
    print(f"Начинаю поворот изображений в {target_dir}...")
    
    if rotate_images(target_dir):
        print("Поворот изображений завершен успешно!")
    else:
        print("Произошла ошибка при повороте изображений.")
