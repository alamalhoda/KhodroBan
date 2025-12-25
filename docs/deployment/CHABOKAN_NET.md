# 🚀 راهنمای کامل Deploy به chabokan.net

چابکان یک پلتفرم ابری ایرانی است که از انواع پلتفرم‌ها پشتیبانی می‌کند:
- ✅ **Static Site** - برای SPA های static (توصیه می‌شود)
- ✅ **Node.js** - برای اجرای Node.js applications
- ✅ **Docker** - برای containerized applications

---

## 🎯 گزینه 1: Static Site (توصیه می‌شود - ساده‌ترین)

### مزایا:
- ✅ ساده و سریع
- ✅ هزینه کمتر
- ✅ بدون نیاز به Node.js runtime
- ✅ مناسب برای SPA های static

### مراحل:

#### 1. Build محلی

```bash
cd frontend
npm install
npm run build
```

خروجی در پوشه `frontend/build/` قرار می‌گیرد.

#### 2. ایجاد پروژه در chabokan.net

1. به پنل chabokan.net بروید
2. **ایجاد پروژه جدید** → **Static Site** را انتخاب کنید
3. نام پروژه را وارد کنید (مثلاً: `khodroban`)

#### 3. آپلود فایل‌ها

**روش A: از طریق پنل**
1. تمام محتویات پوشه `build/` را به root directory پروژه آپلود کنید
2. مطمئن شوید که `index.html` در root قرار دارد

**روش B: از طریق Git (اگر پشتیبانی می‌شود)**
1. Repository را به chabokan.net متصل کنید
2. Build command: `cd frontend && npm install && npm run build`
3. Publish directory: `frontend/build`

#### 4. تنظیمات .htaccess (برای Apache)

در root directory فایل `.htaccess` ایجاد کنید:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle SvelteKit SPA routing
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets برای عملکرد بهتر
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

---

## 🚀 گزینه 2: Node.js (برای کنترل بیشتر)

### مراحل:

#### 1. ایجاد پروژه Node.js در chabokan.net

1. **ایجاد پروژه جدید** → **Node.js** را انتخاب کنید
2. Node.js version را انتخاب کنید (مثلاً: 20.x)

#### 2. استفاده از package.chabokan.json

فایل `package.chabokan.json` را به `package.json` در root پروژه کپی کنید یا از آن استفاده کنید.

#### 3. Environment Variables

در پنل chabokan.net این متغیرها را اضافه کنید:

```env
PORT=3000
VITE_BACKEND_TYPE=supabase
VITE_SUPABASE_URL=https://zwrzokyzjwircrhrtyyi.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
NODE_ENV=production
```

---

## 🐳 گزینه 3: Docker (برای کنترل کامل)

### مراحل:

#### 1. استفاده از Dockerfile موجود

فایل `Dockerfile` در root پروژه موجود است.

#### 2. ایجاد پروژه Docker در chabokan.net

1. **ایجاد پروژه جدید** → **Docker** را انتخاب کنید
2. Dockerfile path: `Dockerfile`
3. Port: `80`

---

## 📊 مقایسه گزینه‌ها

| ویژگی | Static Site | Node.js | Docker |
|-------|-------------|---------|--------|
| **سادگی** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **هزینه** | 💰 کم | 💰💰 متوسط | 💰💰💰 بیشتر |
| **کنترل** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## ✅ توصیه نهایی

**برای Production:** Static Site - ساده، سریع، ارزان

---

## 🔧 تنظیمات svelte.config.js

برای chabokan.net، base path را خالی بگذارید:

```javascript
kit: {
  paths: {
    base: '' // بدون base path برای chabokan.net
  }
}
```

