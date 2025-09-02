$houses = @("Aspen", "Canyon", "Everest", "Redwood", "Willow")

foreach ($house in $houses) {
    $sourceFile = "public\assets\premium\$house\hero.jpg"
    $targetDir = "public\assets\premium\$house\360"
    $targetFile = "$targetDir\hero.jpg"
    
    # Проверяем существование исходного файла
    if (Test-Path $sourceFile) {
        # Проверяем существование целевой директории
        if (-not (Test-Path $targetDir)) {
            Write-Host "Создаем директорию: $targetDir"
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        # Копируем файл
        Write-Host "Копируем $sourceFile в $targetFile"
        Copy-Item -Path $sourceFile -Destination $targetFile -Force
    }
    else {
        Write-Host "Исходный файл не найден: $sourceFile"
    }
}

Write-Host "Копирование завершено!"
