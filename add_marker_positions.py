#!/usr/bin/env python3
"""
Скрипт для автоматического добавления markerPositions для всех домов в house-assets.json
"""

import json
import os
import copy

def create_marker_positions(rooms):
    """Создает markerPositions для списка комнат"""
    marker_positions = {}
    
    # Для каждой комнаты создаем ссылки на все остальные
    for i, room in enumerate(rooms):
        marker_positions[room] = {}
        
        # Распределяем остальные комнаты равномерно по кругу
        other_rooms = [r for r in rooms if r != room]
        angle_step = 360 / len(other_rooms) if other_rooms else 0
        
        for j, other_room in enumerate(other_rooms):
            angle = int(j * angle_step)
            marker_positions[room][other_room] = {"yaw": angle, "pitch": 0}
    
    return marker_positions

def main():
    # Путь к JSON файлу
    json_path = "public/data/house-assets.json"
    
    if not os.path.exists(json_path):
        print(f"❌ Файл не найден: {json_path}")
        return
    
    # Загружаем JSON
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Создаем бэкап
    backup_path = f"{json_path}.backup"
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print(f"💾 Создан бэкап: {backup_path}")
    
    # Обрабатываем каждый дом
    houses_updated = 0
    
    for house_id, house_data in data["houses"].items():
        if "tour360" in house_data and "rooms" in house_data["tour360"]:
            rooms = house_data["tour360"]["rooms"]
            
            # Создаем markerPositions
            house_data["tour360"]["markerPositions"] = create_marker_positions(rooms)
            houses_updated += 1
            print(f"✅ Добавлены markerPositions для дома {house_id} ({len(rooms)} комнат)")
    
    # Сохраняем обновленный JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"\n📊 Итого: обновлено {houses_updated} домов")
    print(f"🏠 Файл сохранен: {json_path}")

if __name__ == "__main__":
    main()

