#!/usr/bin/env ts-node

/**
 * Скрипт валидации данных домов
 * Проверяет целостность данных после нормализации
 */

import * as fs from 'fs';
import * as path from 'path';
import type { CategoriesIndex, HouseCard, HouseDetails } from '../src/types/houses';

const DATA_DIR = path.join(process.cwd(), 'public/data');
const HOUSES_DIR = path.join(DATA_DIR, 'houses');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
}

async function validateData(): Promise<ValidationResult> {
  const result: ValidationResult = {
    success: true,
    errors: [],
    warnings: []
  };

  console.log('🔍 Начинаем валидацию данных...');

  try {
    // 1. Проверяем существование основных файлов
    const requiredFiles = [
      path.join(DATA_DIR, 'index.json'),
      path.join(DATA_DIR, 'houses.A.json'),
      path.join(DATA_DIR, 'houses.B.json'),
      path.join(DATA_DIR, 'houses.C.json')
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        result.errors.push(`Отсутствует файл: ${file}`);
      }
    }

    if (result.errors.length > 0) {
      result.success = false;
      return result;
    }

    // 2. Загружаем и валидируем индекс
    const indexData: CategoriesIndex = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'index.json'), 'utf-8')
    );

    console.log('📊 Валидируем индекс категорий...');
    
    if (!indexData.categories || !Array.isArray(indexData.categories)) {
      result.errors.push('Индекс не содержит массив категорий');
    }

    const expectedCategories = ['A', 'B', 'C'];
    for (const catId of expectedCategories) {
      const category = indexData.categories.find(c => c.id === catId);
      if (!category) {
        result.errors.push(`Отсутствует категория ${catId} в индексе`);
      }
    }

    // 3. Валидируем карточки домов по категориям
    const allHouseIds = new Set<string>();
    
    for (const catId of expectedCategories) {
      console.log(`🏘️ Валидируем категорию ${catId}...`);
      
      const categoryFile = path.join(DATA_DIR, `houses.${catId}.json`);
      const houses: HouseCard[] = JSON.parse(fs.readFileSync(categoryFile, 'utf-8'));
      
      const category = indexData.categories.find(c => c.id === catId);
      if (category && houses.length !== category.count) {
        result.warnings.push(
          `Несоответствие количества домов в категории ${catId}: ` +
          `файл содержит ${houses.length}, индекс указывает ${category.count}`
        );
      }

      for (const house of houses) {
        // Проверяем уникальность ID
        if (allHouseIds.has(house.id)) {
          result.errors.push(`Дублирующийся ID дома: ${house.id}`);
        }
        allHouseIds.add(house.id);

        // Проверяем обязательные поля
        if (!house.name) {
          result.errors.push(`Дом ${house.id}: отсутствует название`);
        }
        if (!house.thumbnail) {
          result.errors.push(`Дом ${house.id}: отсутствует thumbnail`);
        }
        if (house.category !== catId) {
          result.errors.push(`Дом ${house.id}: категория ${house.category} не соответствует файлу ${catId}`);
        }

        // Проверяем существование thumbnail
        if (house.thumbnail) {
          const thumbPath = path.join(PUBLIC_DIR, house.thumbnail);
          if (!fs.existsSync(thumbPath)) {
            result.warnings.push(`Дом ${house.id}: файл thumbnail не найден: ${house.thumbnail}`);
          }
        }
      }
    }

    // 4. Валидируем детальные данные домов
    console.log('🏠 Валидируем детальные данные домов...');
    
    if (!fs.existsSync(HOUSES_DIR)) {
      result.errors.push(`Директория домов не найдена: ${HOUSES_DIR}`);
      result.success = false;
      return result;
    }

    const houseFiles = fs.readdirSync(HOUSES_DIR).filter(f => f.endsWith('.json'));
    
    for (const houseFile of houseFiles) {
      const houseId = path.basename(houseFile, '.json');
      const houseFilePath = path.join(HOUSES_DIR, houseFile);
      
      if (!allHouseIds.has(houseId)) {
        result.warnings.push(`Файл дома ${houseId} не найден в карточках категорий`);
      }

      try {
        const houseData: HouseDetails = JSON.parse(fs.readFileSync(houseFilePath, 'utf-8'));
        
        // Проверяем обязательные поля
        if (houseData.id !== houseId) {
          result.errors.push(`Дом ${houseId}: ID в файле (${houseData.id}) не соответствует имени файла`);
        }

        // Проверяем hero изображение
        if (houseData.hero) {
          const heroPath = path.join(PUBLIC_DIR, houseData.hero);
          if (!fs.existsSync(heroPath)) {
            result.warnings.push(`Дом ${houseId}: файл hero не найден: ${houseData.hero}`);
          }
        }

        // Проверяем панорамы
        if (houseData.tour360?.enabled && houseData.tour360.panoramas) {
          for (const panorama of houseData.tour360.panoramas) {
            // Проверяем файлы тайлов
            const tiles = Object.values(panorama.tiles);
            for (const tile of tiles) {
              const tilePath = path.join(PUBLIC_DIR, tile);
              if (!fs.existsSync(tilePath)) {
                result.warnings.push(`Дом ${houseId}, панорама ${panorama.id}: файл тайла не найден: ${tile}`);
              }
            }

            // Проверяем маркеры
            for (const marker of panorama.markers) {
              if (marker.targetPanoramaId) {
                const targetExists = houseData.tour360!.panoramas.some(p => p.id === marker.targetPanoramaId);
                if (!targetExists) {
                  result.errors.push(
                    `Дом ${houseId}, панорама ${panorama.id}, маркер ${marker.id}: ` +
                    `целевая панорама ${marker.targetPanoramaId} не найдена`
                  );
                }
              }
            }
          }
        }

        // Проверяем relatedIds
        for (const relatedId of houseData.relatedIds) {
          if (!allHouseIds.has(relatedId)) {
            result.errors.push(`Дом ${houseId}: связанный дом ${relatedId} не найден`);
          }
        }

      } catch (error) {
        result.errors.push(`Дом ${houseId}: ошибка парсинга JSON: ${error}`);
      }
    }

    // 5. Проверяем, что все дома из карточек имеют детальные файлы
    for (const houseId of allHouseIds) {
      const houseFilePath = path.join(HOUSES_DIR, `${houseId}.json`);
      if (!fs.existsSync(houseFilePath)) {
        result.errors.push(`Дом ${houseId}: отсутствует детальный файл`);
      }
    }

    result.success = result.errors.length === 0;

  } catch (error) {
    result.errors.push(`Критическая ошибка валидации: ${error}`);
    result.success = false;
  }

  return result;
}

// Запуск валидации
if (require.main === module) {
  validateData()
    .then((result) => {
      console.log('\n📋 Результаты валидации:');
      
      if (result.success) {
        console.log('✅ Валидация прошла успешно!');
      } else {
        console.log('❌ Найдены ошибки в данных:');
      }
      
      if (result.errors.length > 0) {
        console.log('\n🚨 Ошибки:');
        result.errors.forEach(error => console.log(`  - ${error}`));
      }
      
      if (result.warnings.length > 0) {
        console.log('\n⚠️ Предупреждения:');
        result.warnings.forEach(warning => console.log(`  - ${warning}`));
      }
      
      console.log(`\n📊 Статистика:`);
      console.log(`  - Ошибки: ${result.errors.length}`);
      console.log(`  - Предупреждения: ${result.warnings.length}`);
      
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Критическая ошибка:', error);
      process.exit(1);
    });
}

export { validateData };
