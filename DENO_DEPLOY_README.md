# 🚀 راهنمای تنظیم Deno Deploy

این سند راهنمای کامل برای تنظیم و رفع مشکل build در Deno Deploy است.

---

## 📋 مشکل اصلی

خطای `vite: command not found` در Deno Deploy به خاطر این است که:
- Deno از محیط ایزوله استفاده می‌کند
- npm/node_modules در Deno وجود ندارد
- Deno از سیستم ماژول مخصوص خودش استفاده می‌کند

---

## ✅ راه‌حل

### فایل‌های اضافه شده

#### 1. `deno.jsonc` (root)
```json
{
  "tasks": {
    "build": "cd frontend && deno task build",
    "start": "cd frontend && deno task start"
  },
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  },
  "importMap": "frontend/import_map.json"
}
```

#### 2. `frontend/deno.jsonc`
```json
{
  "tasks": {
    "dev": "deno run --allow-read --allow-write --allow-env --allow-net npm:vite@^5.4.0 dev",
    "build": "deno run --allow-read --allow-write --allow-env --allow-net npm:vite@^5.4.0 build",
    "preview": "deno run --allow-read --allow-write --allow-env --allow-net npm:vite@^5.4.0 preview",
    "check": "deno run --allow-read --allow-write --allow-env --allow-net npm:svelte-kit@^2.0.0 sync && deno run --allow-read --allow-write --allow-env --allow-net npm:svelte-check@^4.0.0 --tsconfig ./tsconfig.json check"
  },
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  },
  "importMap": "./import_map.json"
}
```

#### 3. `frontend/import_map.json`
```json
{
  "imports": {
    "svelte": "npm:svelte@^5.0.0",
    "svelte/": "npm:svelte@^5.0.0/",
    "@sveltejs/kit": "npm:@sveltejs/kit@^2.0.0",
    "@sveltejs/vite-plugin-svelte": "npm:@sveltejs/vite-plugin-svelte@^4.0.0",
    "@sveltejs/adapter-netlify": "npm:@sveltejs/adapter-netlify@^5.2.4",
    "@sveltejs/adapter-static": "npm:@sveltejs/adapter-static@^3.0.10",
    "@deno/svelte-adapter": "npm:@deno/svelte-adapter@^0.1.0",
    "vite": "npm:vite@^5.4.0",
    "@supabase/supabase-js": "npm:@supabase/supabase-js@^2.89.0",
    "axios": "npm:axios@^1.7.0",
    "chart.js": "npm:chart.js@^4.4.0",
    "persian-date": "npm:persian-date@^1.1.0",
    "svelte-i18n": "npm:svelte-i18n@^4.0.1"
  }
}
```

---

## 🚀 تنظیم Deno Deploy با GitHub Actions

### چرا GitHub Actions؟

چون Deno Deploy امکان انتخاب برنچ ندارد و همیشه از برنچ اصلی (main) استفاده می‌کند، از GitHub Actions برای deploy استفاده می‌کنیم.

### مرحله 1: ایجاد پروژه در Deno Deploy

1. به https://deno.com/deploy بروید
2. حساب رایگان ایجاد کنید
3. یک پروژه جدید بسازید
4. نام پروژه را یادداشت کنید (مثل: `khodroban`)

### مرحله 2: تنظیم GitHub Actions

1. **به GitHub repository بروید**
2. **روی Settings → Secrets and variables → Actions کلیک کنید**
3. **یک secret جدید اضافه کنید:**
   - Name: `DENO_DEPLOY_TOKEN`
   - Value: از https://deno.com/deploy/account#access-tokens کپی کنید

### مرحله 3: تنظیمات Environment Variables در Deno Deploy

در dashboard Deno Deploy، environment variables زیر را اضافه کنید:

```env
DEPLOY_PLATFORM=deno
VITE_BACKEND_TYPE=supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_REDIRECT_BASE_URL=https://khodroban.deno.dev
```

⚠️ **نکته مهم:** متغیرهای `DENO_REGION` و `DENO_DEPLOY` را اضافه نکنید چون Deno Deploy اجازه تغییر متغیرهای محیطی که با `DENO_` شروع می‌شوند را نمی‌دهد.

### مرحله 4: غیرفعال کردن Netlify Build

**از Netlify Dashboard:**
1. به https://app.netlify.com/projects/khodroban/configuration/deploys#continuous-deployment بروید
2. بخش **Build settings** را انتخاب کنید
3. گزینه **Build status** را پیدا کنید
4. از **Active builds** به **Stopped builds** تغییر دهید

این کار باعث می‌شود:
- Netlify دیگر به صورت خودکار build نکند
- محدودیت build شما مصرف نشود
- می‌توانید در صورت نیاز، دستی deploy کنید

### مرحله 5: Deploy خودکار

وقتی به برنچ `main` push می‌کنید:
1. GitHub Actions اجرا می‌شود
2. پروژه build می‌شود
3. به Deno Deploy deploy می‌شود
4. URL شما آماده است!

---

## 🔧 عیب‌یابی

### خطای "vite: command not found"

**علت:** Vite پیدا نمی‌شود

**راه‌حل:**
- مطمئن شوید `frontend/deno.jsonc` وجود دارد
- مطمئن شوید `frontend/import_map.json` وجود دارد
- Build command باید `deno task build` باشد

### خطای import

**علت:** ماژول‌ها پیدا نمی‌شوند

**راه‌حل:**
- بررسی کنید `import_map.json` کامل باشد
- همه dependencies در import_map تعریف شده باشند
- نسخه‌ها با package.json سازگار باشند

### خطای build

**علت:** مشکلات build

**راه‌حل:**
- Log های build را بررسی کنید
- مطمئن شوید همه فایل‌ها commit شده‌اند
- از Deno Deploy dashboard برای دیدن log ها استفاده کنید

---

## 🎯 نتیجه

بعد از تنظیمات بالا:

1. **Netlify** همچنان روی branch اصلی کار می‌کند (برای backup)
2. **Deno Deploy** از تنظیمات جدید استفاده می‌کند
3. Build در Deno موفق می‌شود
4. محدودیت build Netlify تمام نمی‌شود

---

## 📚 منابع

- [Deno Deploy Documentation](https://deno.com/deploy/docs)
- [Deno Manual](https://deno.land/manual)
- [SvelteKit Deployment](https://kit.svelte.dev/docs/adapters)

---

**نکته:** اگر هنوز مشکل دارید، log های Deno Deploy را بررسی کنید و در صورت نیاز تنظیمات را تغییر دهید.
