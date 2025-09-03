#!/usr/bin/env python3
"""
Скрипт для поворота изображений 'u.jpg' (верх) и 'd.jpg' (низ) в каталоге Everest/360.
Поворачивает изображения на 180 градусов.
"""

import os
from PIL import Image
import glob

def rotate_image(image_path, degrees=180):
    """
    Поворачивает изображение на указанное количество градусов и сохраняет его.
    
    Args:
        image_path: Путь к изображению
        degrees: Градусы поворота (по умолчанию 180)
    """
    try:
        # Открываем изображение
        img = Image.open(image_path)
        
        # Поворачиваем изображение
        rotated_img = img.rotate(degrees, expand=False)
        
        # Сохраняем изображение, перезаписывая оригинал
        rotated_img.save(image_path, quality=95, optimize=True)
        
        print(f"Успешно повернуто: {image_path}")
        
    except Exception as e:
        print(f"Ошибка при повороте {image_path}: {str(e)}")

def process_everest_360_folders():
    """
    Обрабатывает все подпапки в каталоге Everest/360 и поворачивает файлы u.jpg и d.jpg
    """
    # Базовый путь к каталогу Everest/360
    base_path = "public/assets/premium/Everest/360"
    
    # Получаем список всех подпапок
    subfolders = [f for f in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, f))]
    
    print(f"Найдено {len(subfolders)} подпапок в каталоге Everest/360")
    
    # Обрабатываем каждую подпапку
    for folder in subfolders:
        folder_path = os.path.join(base_path, folder)
        
        # Пути к файлам u.jpg и d.jpg
        u_file = os.path.join(folder_path, "u.jpg")
        d_file = os.path.join(folder_path, "d.jpg")
        
        # Проверяем и поворачиваем файл u.jpg
        if os.path.exists(u_file):
            print(f"Поворачиваем {u_file}...")
            rotate_image(u_file)
        else:
            print(f"Файл {u_file} не найден")
        
        # Проверяем и поворачиваем файл d.jpg
        if os.path.exists(d_file):
            print(f"Поворачиваем {d_file}...")
            rotate_image(d_file)
        else:
            print(f"Файл {d_file} не найден")

if __name__ == "__main__":
    print("Начинаем поворот изображений u.jpg и d.jpg в каталоге Everest/360...")
    process_everest_360_folders()
    print("Обработка завершена!")
