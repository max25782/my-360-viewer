import os
import sys
from PIL import Image

def rotate_ud_images(directory):
    """
    Рекурсивно ищет и поворачивает на 180 градусов изображения с названиями u.jpg и d.jpg
    в указанной директории и всех её поддиректориях.
    """
    print(f"Обрабатываю директорию: {directory}")
    
    # Получаем список всех файлов и директорий
    try:
        items = os.listdir(directory)
    except Exception as e:
        print(f"Ошибка при чтении директории {directory}: {e}")
        return
    
    # Обрабатываем каждый элемент
    for item in items:
        item_path = os.path.join(directory, item)
        
        # Если это директория, рекурсивно обрабатываем её
        if os.path.isdir(item_path):
            rotate_ud_images(item_path)
        
        # Если это файл u.jpg или d.jpg, поворачиваем его
        elif item.lower() in ['u.jpg', 'd.jpg']:
            try:
                print(f"Поворачиваю файл: {item_path}")
                img = Image.open(item_path)
                rotated_img = img.rotate(180)
                
                # Сохраняем изображение, перезаписывая оригинал
                rotated_img.save(item_path, quality=95)
                print(f"Файл успешно повернут: {item_path}")
            except Exception as e:
                print(f"Ошибка при обработке файла {item_path}: {e}")

def main():
    # Путь к директории Neo
    neo_directory = os.path.join('public', 'assets', 'neo')
    
    # Проверяем существование директории
    if not os.path.exists(neo_directory):
        print(f"Директория {neo_directory} не найдена.")
        return
    
    print(f"Начинаю обработку файлов u.jpg и d.jpg в директории {neo_directory}")
    rotate_ud_images(neo_directory)
    print("Обработка завершена.")

if __name__ == "__main__":
    main()
