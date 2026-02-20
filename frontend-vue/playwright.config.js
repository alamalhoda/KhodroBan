import { defineConfig, devices } from '@playwright/test'

const backendDjangoDir = '/Users/alamalhoda/Projects/OilChenger/backend/django'

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:5174',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: `bash -lc "cd '${backendDjangoDir}' && source venv/bin/activate && python manage.py migrate --noinput && python manage.py runserver 127.0.0.1:8000"`,
      url: 'http://127.0.0.1:8000/admin/login/',
      timeout: 180_000,
      reuseExistingServer: true,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5174',
      url: 'http://127.0.0.1:5174/login',
      timeout: 120_000,
      reuseExistingServer: true,
    },
  ],
})
