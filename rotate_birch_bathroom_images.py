from PIL import Image
import os

def rotate_image(input_path, output_path):
    """Поворачивает изображение на 180 градусов."""
    try:
        img = Image.open(input_path)
        rotated_img = img.rotate(180)
        rotated_img.save(output_path)
        print(f"✅ Успешно повернуто: {input_path} → {output_path}")
    except Exception as e:
        print(f"❌ Ошибка при повороте {input_path}: {e}")

def main():
    # Путь к папке с изображениями
    base_path = "public/assets/birch/360/bathroom"
    
    # Файлы для поворота
    files_to_rotate = ['u.jpg', 'u.webp', 'd.jpg', 'd.webp']
    
    # Выполняем поворот
    for filename in files_to_rotate:
        input_path = os.path.join(base_path, filename)
        output_path = os.path.join(base_path, filename)
        
        if os.path.exists(input_path):
            rotate_image(input_path, output_path)
        else:
            print(f"⚠️ Файл не найден: {input_path}")

if __name__ == "__main__":
    main()
