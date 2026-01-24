# Добавление доменов в Vercel

## Пошаговая инструкция

### 1. Войдите в Vercel Dashboard

1. Откройте [vercel.com](https://vercel.com)
2. Войдите в свой аккаунт
3. Выберите ваш проект (`my-360-viewer`)

### 2. Перейдите в настройки доменов

1. В проекте нажмите на вкладку **Settings** (Настройки)
2. В левом меню выберите **Domains** (Домены)

### 3. Добавьте домены

Для каждого домена выполните следующие шаги:

#### Добавление домена `seattle-catalog.com`

1. В поле **Domain** введите: `seattle-catalog.com`
2. Нажмите **Add** (Добавить)
3. Vercel покажет инструкции по настройке DNS

#### Добавление домена `alpha-adu.com`

1. В поле **Domain** введите: `alpha-adu.com`
2. Нажмите **Add** (Добавить)
3. Следуйте инструкциям по DNS

#### Добавление домена `la-catalog.com`

1. В поле **Domain** введите: `la-catalog.com`
2. Нажмите **Add** (Добавить)
3. Следуйте инструкциям по DNS

### 4. Настройка DNS записей

Для каждого домена нужно добавить DNS записи у вашего регистратора домена:

#### Вариант A: Использование CNAME (рекомендуется для поддоменов)

```
Type: CNAME
Name: @ (или www)
Value: cname.vercel-dns.com
```

#### Вариант B: Использование A записи (для корневого домена)

```
Type: A
Name: @
Value: 76.76.21.21
```

**Примечание:** Vercel покажет точные значения для вашего проекта. Используйте те, что указаны в интерфейсе Vercel.

### 5. Проверка домена

После добавления DNS записей:

1. **Подождите 5-60 минут** для распространения DNS
2. Vercel автоматически проверит домен
3. Статус изменится с "Pending" на "Valid" (Валидный)

### 6. SSL сертификат

Vercel автоматически:
- ✅ Выдаст SSL сертификат (Let's Encrypt)
- ✅ Настроит HTTPS
- ✅ Обновит сертификат автоматически

## Проверка после настройки

После того, как домены добавлены и проверены:

1. **Откройте домены в браузере:**
   - `https://seattle-catalog.com`
   - `https://alpha-adu.com`
   - `https://la-catalog.com`

2. **Проверьте логотипы:**
   - Каждый домен должен показывать свой логотип
   - Откройте DevTools → Network tab
   - Проверьте, что загружается правильный файл логотипа

## Важные моменты

### Все домены указывают на один деплой

✅ **Это правильно!** Все домены (`seattle-catalog.com`, `alpha-adu.com`, `la-catalog.com`) должны указывать на один и тот же проект в Vercel.

✅ **Логотипы определяются автоматически** по домену через функцию `getLogoByDomain()`.

### Поддомены (www)

Если хотите поддержать `www.seattle-catalog.com`:

1. Добавьте `www.seattle-catalog.com` как отдельный домен в Vercel
2. Или настройте редирект с www на основной домен (через DNS или Vercel)

**Примечание:** Код уже поддерживает поддомены автоматически (например, `www.seattle-catalog.com` → `seattle-catalog.com`).

### DNS провайдеры

Популярные регистраторы доменов:
- **Namecheap** - Settings → Advanced DNS
- **GoDaddy** - DNS Management
- **Google Domains** - DNS → Custom records
- **Cloudflare** - DNS → Records
- **Route 53** (AWS) - Hosted zones

## Troubleshooting

### Домен не проверяется

1. **Проверьте DNS записи:**
   ```bash
   # Проверьте A запись
   dig seattle-catalog.com A
   
   # Проверьте CNAME
   dig seattle-catalog.com CNAME
   ```

2. **Убедитесь, что значения совпадают** с теми, что указаны в Vercel

3. **Подождите дольше** - DNS может распространяться до 48 часов (обычно 5-60 минут)

### SSL сертификат не выдается

1. Убедитесь, что DNS записи настроены правильно
2. Проверьте, что домен указывает на Vercel
3. Подождите несколько минут после настройки DNS

### Логотип не меняется

1. Проверьте консоль браузера на ошибки
2. Убедитесь, что домен правильно определен:
   ```javascript
   console.log('Hostname:', window.location.hostname);
   ```
3. Проверьте, что файлы логотипов существуют в `public/`

## Быстрая проверка

После настройки всех доменов проверьте:

```bash
# Проверьте DNS
nslookup seattle-catalog.com
nslookup alpha-adu.com
nslookup la-catalog.com

# Все должны указывать на IP Vercel или cname.vercel-dns.com
```

## Дополнительные ресурсы

- [Vercel Domains Documentation](https://vercel.com/docs/concepts/projects/domains)
- [DNS Configuration Guide](https://vercel.com/docs/concepts/projects/domains/add-a-domain#dns-configuration)
