import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

// Test utilities for Vue components

export function createTestPinia() {
  return createPinia()
}

export function createTestRouter(routes = []) {
  return createRouter({
    history: createWebHistory(),
    routes: routes.length ? routes : [
      { path: '/', component: { template: '<div>Home</div>' } }
    ]
  })
}

export function mountWithProviders(component, options = {}) {
  const pinia = createTestPinia()
  const router = createTestRouter()
  
  return mount(component, {
    global: {
      plugins: [pinia, router],
      ...options.global
    },
    ...options
  })
}

// Property-based testing utilities
export function generateRandomString(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateRandomNumber(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateRandomDate(startYear = 2020, endYear = 2025) {
  const start = new Date(startYear, 0, 1)
  const end = new Date(endYear, 11, 31)
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export function generateRandomVehicle() {
  return {
    id: generateRandomString(8),
    model: generateRandomString(10),
    year: generateRandomNumber(1380, 1403),
    plateNumber: `${generateRandomNumber(10, 99)}ا${generateRandomNumber(100, 999)}${generateRandomNumber(10, 99)}`,
    currentKm: generateRandomNumber(0, 500000),
    color: ['سفید', 'مشکی', 'نقره‌ای', 'قرمز', 'آبی'][generateRandomNumber(0, 4)]
  }
}

export function generateRandomService() {
  return {
    id: generateRandomString(8),
    vehicleId: generateRandomString(8),
    date: generateRandomDate().toISOString().split('T')[0],
    km: generateRandomNumber(0, 500000),
    cost: generateRandomNumber(100000, 5000000),
    types: ['تعویض روغن', 'تعویض فیلتر', 'بازدید کلی'][generateRandomNumber(0, 2)],
    description: generateRandomString(50)
  }
}