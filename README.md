# ГРУЗ.kg — Грузоперевозки в Бишкеке

Лендинг для грузоперевозок по Бишкеку и регионам Кыргызстана.

## Стек

- Чистый HTML/CSS/JS, без сборки
- GSAP + ScrollTrigger (CDN) — для marquee и плавных скроллов
- Lenis (CDN) — smooth scroll
- Шрифты: Manrope, JetBrains Mono (Google Fonts)

## Структура

```
├── index.html          # разметка
├── style.css           # стили (брейкпоинты 920, 640, 520)
├── app.js              # калькулятор, smooth scroll, fade-in, marquee
├── home.jpg            # фото автопарка для hero и Спринтера
├── gidra.jpg           # фото машины с гидролапатой
├── favicon.svg         # фавиконка (оранжевая Г)
├── manifest.json       # PWA-манифест
├── robots.txt          # для поисковиков
├── sitemap.xml         # карта сайта
└── README.md
```

## Чек-лист перед деплоем

### Обязательно

- [ ] **Оптимизировать картинки** — `home.jpg` (jpg) и `gidra.jpg` (jpg) слишком тяжёлые. Прогнать через [squoosh.app](https://squoosh.app) или конвертировать в WebP. Цель: < 300 КБ каждая.
- [ ] Заменить домен `https://gruz.kg/` в:
  - `<link rel="canonical">`
  - Open Graph и Twitter мета-тегах
  - JSON-LD (`@id`, `url`, `logo`, `image`)
  - `sitemap.xml`
  - `robots.txt`
- [ ] Проверить номера телефонов (`+996 505 848 591` Таалай, `+996 709 259 979` Салават)
- [ ] Заменить плейсхолдеры:
  - Email: `hello@gruz.kg` → реальный
  - Адрес: «ул. Чуй, 123» → реальный
  - Координаты в JSON-LD и geo-метатегах (lat/lng)
- [ ] Обновить `<lastmod>` в `sitemap.xml`
- [ ] Подключить HTTPS, настроить редирект с www
- [ ] Зарегистрировать в Google Search Console и Яндекс.Вебмастер
- [ ] Подать sitemap.xml в оба поисковика

### Рекомендуется

- [ ] Сгенерировать `favicon-32x32.png`, `apple-touch-icon-180x180.png` (через [realfavicongenerator.net](https://realfavicongenerator.net))
- [ ] Добавить Google Analytics / Яндекс.Метрику
- [ ] Подключить Pixel ВК / Facebook Pixel если есть рекламные кампании
- [ ] CDN для статики (Cloudflare)
- [ ] Gzip/Brotli на сервере для html/css/js
- [ ] HTTP/2 или HTTP/3
- [ ] Cache-Control заголовки на статику (1 год для версионированных файлов)
- [ ] OG-картинка отдельная (1200×630 с лого + слоганом) вместо `home.jpg`

## SEO

- Полные мета-теги (title, description, keywords)
- Open Graph + Twitter Cards
- Geo-теги (KG, координаты Бишкека)
- JSON-LD структурированные данные (`MovingCompany` schema с прайсом, контактами, зоной обслуживания)
- Canonical URL
- Семантическая разметка (header, nav, main, section, article, aside, footer)
- Skip-to-content link
- Alt-тексты на изображениях
- Width/height на `<img>` для предотвращения CLS

## Локальный запуск

Просто открыть `index.html` в браузере. Для проверки в "честной" среде:

```bash
npx serve .
# или
python -m http.server 8000
```

## Контакты

- Таалай: +996 505 848 591
- Салават: +996 709 259 979
