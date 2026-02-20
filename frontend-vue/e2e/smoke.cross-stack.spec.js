import { test, expect } from '@playwright/test'

function runtimeSuffix() {
  return `${Date.now()}${Math.random().toString(36).slice(2, 8)}`
}

function runtimeEmail(suffix) {
  return `e2e.${suffix}@example.test`
}

function runtimeCredential() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 14)
}

test.describe('Cross-stack smoke flow', () => {
  test('login -> create vehicle -> add expense -> reports -> ai message', async ({ page, request }) => {
    const suffix = runtimeSuffix()
    const email = runtimeEmail(suffix)
    const password = runtimeCredential()

    const registerResponse = await request.post('http://127.0.0.1:8000/api/register/', {
      data: {
        username: email,
        email,
        password,
        password2: password,
        first_name: `E2E-${suffix.slice(0, 6)}`,
        last_name: '',
      },
    })
    expect(registerResponse.ok()).toBeTruthy()

    await page.addInitScript(() => {
      localStorage.setItem('locale', 'fa')
    })

    // 1) Login (frontend + backend token endpoint)
    await page.goto('/login')
    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="password"]').fill(password)
    await page.getByRole('button', { name: 'ورود' }).click()
    await expect(page).toHaveURL(/\/$/, { timeout: 20_000 })

    // 2) Create vehicle (UI)
    const vehicleModel = `خودرو-${suffix.slice(0, 6)}`
    const plateNumber = `${suffix.slice(0, 4)}-الف-${suffix.slice(4, 6)}`
    await page.goto('/vehicle-management?action=add')
    await page.locator('form input[type="text"]').first().fill(vehicleModel)
    await page.locator('form input[type="number"]').nth(0).fill('1402')
    await page.locator('form input[type="text"]').nth(1).fill(plateNumber)
    await page.locator('form input[type="number"]').nth(1).fill('12345')
    await page.locator('form button[type="submit"]').click()
    await expect(page).toHaveURL(/\/vehicle-list/, { timeout: 20_000 })
    await expect(page.getByText(vehicleModel)).toBeVisible()

    // 3) Add expense (service/expense flow via UI)
    await page.goto('/add-service')
    await page.getByRole('tab', { name: 'هزینه جانبی' }).click()

    const expenseTextInputs = page.locator('#expense-tabpanel input[type="text"]')
    await expenseTextInputs.first().fill('1403/01/15')

    const categoryInput = page.locator('#expense-tabpanel input[placeholder="انتخاب دسته‌بندی..."]')
    await categoryInput.fill('سوخت')
    await page.locator('#expense-category-autocomplete button').first().click()

    const numberInputs = page.locator('#expense-tabpanel input[type="number"]')
    await numberInputs.nth(0).fill('12400')
    await numberInputs.nth(1).fill('250000')
    await page.locator('form button[type="submit"]').click()
    await expect(page).toHaveURL(/\/$/, { timeout: 20_000 })

    // 4) Reports summary (frontend + backend reports endpoint)
    await page.goto('/reports')
    await expect(page.getByText('کل هزینه‌ها')).toBeVisible()
    await expect(page.getByText('هزینه‌های اخیر')).toBeVisible()

    // 5) AI message (frontend + backend AI endpoint; success/error both acceptable)
    await page.goto('/smart-assistant')
    const prompt = `بررسی وضعیت خودرو ${suffix.slice(0, 6)}`
    await page.locator('textarea[aria-label="متن پیام"]').fill(prompt)
    await page.locator('button[aria-label="ارسال پیام"]').click()

    await expect(page.getByText(prompt)).toBeVisible({ timeout: 15_000 })

    // In current environments AI provider may be unavailable; both assistant-response and handled-error are valid.
    await expect(page.locator('.whitespace-pre-wrap')).toHaveCount(1, { timeout: 25_000 })
  })

  test('vehicle management path updates vehicle details', async ({ page, request }) => {
    const suffix = runtimeSuffix()
    const email = runtimeEmail(suffix)
    const password = runtimeCredential()

    const registerResponse = await request.post('http://127.0.0.1:8000/api/register/', {
      data: {
        username: email,
        email,
        password,
        password2: password,
        first_name: `E2E-${suffix.slice(0, 6)}`,
        last_name: '',
      },
    })
    expect(registerResponse.ok()).toBeTruthy()

    await page.addInitScript(() => {
      localStorage.setItem('locale', 'fa')
    })

    // Login
    await page.goto('/login')
    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="password"]').fill(password)
    await page.getByRole('button', { name: 'ورود' }).click()
    await expect(page).toHaveURL(/\/$/, { timeout: 20_000 })

    // Create a vehicle from management form
    const initialModel = `خودرو-مدیریت-${suffix.slice(0, 4)}`
    const updatedModel = `خودرو-ویرایش-${suffix.slice(4, 8)}`
    const plateNumber = `${suffix.slice(0, 4)}-ب-${suffix.slice(4, 6)}`

    await page.goto('/vehicle-management?action=add')
    await page.locator('form input[type="text"]').first().fill(initialModel)
    await page.locator('form input[type="number"]').nth(0).fill('1401')
    await page.locator('form input[type="text"]').nth(1).fill(plateNumber)
    await page.locator('form input[type="number"]').nth(1).fill('22222')
    await page.locator('form button[type="submit"]').click()

    await expect(page).toHaveURL(/\/vehicle-list/, { timeout: 20_000 })
    await expect(page.getByText(initialModel)).toBeVisible()

    // Open details page from vehicle list (management path)
    await page.getByText(initialModel).click()
    await expect(page).toHaveURL(/\/vehicle-details\/[^/?#]+/, { timeout: 20_000 })

    const detailsMatch = page.url().match(/\/vehicle-details\/([^/?#]+)/)
    expect(detailsMatch).toBeTruthy()
    const vehicleId = detailsMatch ? detailsMatch[1] : ''
    expect(vehicleId).not.toBe('')

    // Edit details from vehicle details page
    await page.getByRole('button', { name: 'ویرایش جزئیات' }).click()
    await expect(page).toHaveURL(new RegExp(`/vehicle-management\\?action=edit&id=${vehicleId}`), { timeout: 20_000 })

    await page.locator('form input[type="text"]').first().fill(updatedModel)
    await page.locator('form button[type="submit"]').click()

    // Should navigate back to the same vehicle details with updated model
    await expect(page).toHaveURL(new RegExp(`/vehicle-details/${vehicleId}`), { timeout: 20_000 })
    await expect(page.getByRole('heading', { name: updatedModel })).toBeVisible()
  })
})
