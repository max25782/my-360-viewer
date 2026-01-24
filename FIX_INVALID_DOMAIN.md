# Исправление Invalid Configuration для alpha-adu.com

## Проблема

Домены `alpha-adu.com` и `www.alpha-adu.com` показывают статус **"Invalid Configuration"** в Vercel.

## Возможные причины

1. **DNS записи не настроены** или настроены неправильно
2. **DNS еще не распространились** (может занять до 48 часов)
3. **Неправильные значения DNS** записей
4. **Домен не указывает на Vercel**

## Решение

### Шаг 1: Проверьте DNS записи

Откройте терминал и проверьте текущие DNS записи:

```bash
# Проверьте A запись
dig alpha-adu.com A

# Проверьте CNAME для www
dig www.alpha-adu.com CNAME

# Или используйте nslookup
nslookup alpha-adu.com
nslookup www.alpha-adu.com
```

### Шаг 2: Нажмите "Edit" в Vercel

1. В Vercel Dashboard найдите домен `alpha-adu.com`
2. Нажмите кнопку **"Edit"**
3. Vercel покажет инструкции по настройке DNS

### Шаг 3: Настройте DNS у регистратора домена

Перейдите к вашему регистратору домена (Namecheap, GoDaddy, Cloudflare и т.д.) и добавьте DNS записи:

#### Для корневого домена (alpha-adu.com):

**Вариант A: CNAME (если поддерживается)**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**Вариант B: A запись**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Примечание:** Vercel покажет точные значения в интерфейсе "Edit". Используйте те, что указаны там!

#### Для поддомена (www.alpha-adu.com):

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Шаг 4: Нажмите "Refresh" в Vercel

После настройки DNS:

1. Подождите 5-10 минут для распространения DNS
2. Вернитесь в Vercel Dashboard
3. Нажмите кнопку **"Refresh"** рядом с доменом
4. Vercel проверит конфигурацию заново

### Шаг 5: Проверка статуса

После обновления DNS и нажатия Refresh:

- ✅ **Valid Configuration** - домен настроен правильно
- ⚠️ **Invalid Configuration** - проверьте DNS записи еще раз

## Troubleshooting

### Если домен все еще Invalid:

1. **Проверьте точные значения DNS:**
   - В Vercel нажмите "Edit" на домене
   - Скопируйте точные значения DNS записей
   - Убедитесь, что они совпадают с записями у регистратора

2. **Убедитесь, что DNS записи активны:**
   - Проверьте, что записи не удалены
   - Проверьте, что нет конфликтующих записей

3. **Подождите дольше:**
   - DNS может распространяться до 48 часов
   - Обычно достаточно 5-60 минут

4. **Проверьте регистратора домена:**
   - Убедитесь, что домен не истек
   - Проверьте, что DNS управление включено

### Проверка через командную строку:

```bash
# Проверьте, что домен указывает на Vercel
dig alpha-adu.com +short

# Должен вернуть IP адрес Vercel или cname.vercel-dns.com
```

## После исправления

Когда домены станут Valid:

1. ✅ SSL сертификат будет выдан автоматически
2. ✅ Домен будет доступен по HTTPS
3. ✅ Логотип будет определяться автоматически по домену

## Быстрая проверка

После настройки DNS, проверьте:

```bash
# Проверьте DNS
dig alpha-adu.com A
dig www.alpha-adu.com CNAME

# Проверьте доступность
curl -I https://alpha-adu.com
```

## Полезные ссылки

- [Vercel DNS Troubleshooting](https://vercel.com/docs/concepts/projects/domains/troubleshooting)
- [Vercel Domain Configuration](https://vercel.com/docs/concepts/projects/domains/add-a-domain)
