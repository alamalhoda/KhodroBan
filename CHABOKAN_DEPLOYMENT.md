# 🚀 آماده‌سازی برای Deploy به chabokan.net

این branch شامل تمام فایل‌ها و تنظیمات لازم برای deploy به chabokan.net است.

## 📁 فایل‌های اضافه شده

### برای Static Site (توصیه می‌شود)
- `frontend/public/.htaccess` - تنظیمات Apache برای SPA routing
- `docs/deployment/CHABOKAN_NET.md` - راهنمای کامل

### برای Node.js
- `package.chabokan.json` - Package.json برای Node.js deployment

### برای Docker
- `Dockerfile` - برای build و serve با nginx
- `nginx.conf` - تنظیمات nginx
- `.dockerignore` - فایل‌های غیرضروری

## 🎯 مراحل Deploy

### گزینه 1: Static Site (ساده‌ترین)

```bash
# 1. Build
cd frontend
npm run build

# 2. فایل‌های build/ را به chabokan.net آپلود کنید
# 3. فایل .htaccess را هم در root قرار دهید
```

### گزینه 2: Node.js

```bash
# 1. از package.chabokan.json استفاده کنید
cp package.chabokan.json package.json

# 2. Build
npm run build

# 3. در chabokan.net:
#    - Start command: npm start
#    - Port: 3000 (یا از environment variable)
```

### گزینه 3: Docker

```bash
# 1. در chabokan.net:
#    - Dockerfile path: Dockerfile
#    - Port: 80
#    - Build خودکار انجام می‌شود
```

## ⚙️ تنظیمات

### svelte.config.js

برای chabokan.net، base path به صورت خودکار خالی است (چون `STATIC_PAGES` تنظیم نمی‌شود):

```javascript
paths: {
  base: process.env.STATIC_PAGES === 'true' ? `/${process.env.REPO_NAME || 'KhodroBan'}` : ''
}
```

### Environment Variables

در chabokan.net این متغیرها را اضافه کنید:

```env
VITE_BACKEND_TYPE=supabase
VITE_SUPABASE_URL=https://zwrzokyzjwircrhrtyyi.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## ✅ چک‌لیست قبل از Deploy

- [ ] Build موفق انجام شده (`npm run build`)
- [ ] فایل `index.html` در root قرار دارد
- [ ] پوشه `_app/` در دسترس است
- [ ] فایل `.htaccess` برای Static Site اضافه شده
- [ ] Environment variables تنظیم شده‌اند

## 📚 راهنمای کامل

برای جزئیات بیشتر، به `docs/deployment/CHABOKAN_NET.md` مراجعه کنید.

