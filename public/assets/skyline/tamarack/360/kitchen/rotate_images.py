from PIL import Image
import os

# Список файлов для поворота
files_to_rotate = ['u.jpg', 'u.webp', 'd.jpg', 'd.webp']

for filename in files_to_rotate:
    if os.path.exists(filename):
        print(f"Rotating {filename}...")
        try:
            # Открываем изображение
            with Image.open(filename) as img:
                # Поворачиваем на 180 градусов
                rotated = img.rotate(180)
                # Сохраняем обратно
                rotated.save(filename)
            print(f"Successfully rotated {filename}")
        except Exception as e:
            print(f"Error rotating {filename}: {e}")
    else:
        print(f"File {filename} not found")

print("Rotation completed!")
