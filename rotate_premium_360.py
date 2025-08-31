#!/usr/bin/env python3
"""
Скрипт для вращения изображений верхнего (u) и нижнего (d) направлений на 180 градусов
для Premium 360° туров.

Использование:
    python rotate_premium_360.py

Требования:
    - Python 3.6+
    - Pillow (PIL Fork): pip install Pillow
"""

import os
import glob
from PIL import Image

# Базовая директория для Premium домов
BASE_DIR = "public/assets/premium"

# Список домов Premium коллекции
PREMIUM_HOUSES = ["Aspen", "Canyon", "Redwood", "Willow", "Sequoia"]

def rotate_image(image_path):
    """Вращает изображение на 180 градусов и сохраняет его."""
    try:
        # Открываем изображение
        img = Image.open(image_path)
        
        # Вращаем на 180 градусов
        rotated_img = img.rotate(180)
        
        # Сохраняем изображение
        rotated_img.save(image_path)
        
        print(f"Успешно повернуто: {image_path}")
        return True
    except Exception as e:
        print(f"Ошибка при обработке {image_path}: {e}")
        return False

def process_house_rooms(house_dir):
    """Обрабатывает все комнаты для заданного дома."""
    # Находим все директории 360
    room_dirs = glob.glob(os.path.join(house_dir, "360", "*"))
    
    for room_dir in room_dirs:
        # Проверяем наличие файлов u.jpg и d.jpg
        u_file = os.path.join(room_dir, "u.jpg")
        d_file = os.path.join(room_dir, "d.jpg")
        
        # Вращаем файл u.jpg, если он существует
        if os.path.exists(u_file):
            rotate_image(u_file)
        else:
            print(f"Файл не найден: {u_file}")
        
        # Вращаем файл d.jpg, если он существует
        if os.path.exists(d_file):
            rotate_image(d_file)
        else:
            print(f"Файл не найден: {d_file}")

def main():
    """Основная функция скрипта."""
    print("Начинаем вращение изображений для Premium 360° туров...")
    
    # Обрабатываем каждый дом
    for house in PREMIUM_HOUSES:
        house_dir = os.path.join(BASE_DIR, house)
        
        if os.path.exists(house_dir):
            print(f"\nОбрабатываем дом: {house}")
            process_house_rooms(house_dir)
        else:
            print(f"\nДиректория не найдена для дома {house}: {house_dir}")
    
    print("\nОбработка завершена!")

if __name__ == "__main__":
    main()
