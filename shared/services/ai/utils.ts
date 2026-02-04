// ========================================
// AI Service Utilities
// ========================================

import type { UserContext } from './types';
import type { Vehicle, ServiceRecord, Expense, ServiceType, ExpenseCategory } from '../../types';
import { SERVICE_TYPES } from '../../utils/constants';

// Map برای تبدیل expense categories به فارسی
const EXPENSE_CATEGORY_NAMES: Record<ExpenseCategory, string> = {
  fuel: 'سوخت',
  wash: 'کارواش',
  parking: 'پارکینگ',
  toll: 'عوارض',
  minor_repair: 'تعمیرات جزئی',
  other: 'سایر',
};

/**
 * ساخت UserContext از اطلاعات کاربر
 */
export function buildUserContext(params: {
  vehicles?: Vehicle[];
  services?: ServiceRecord[];
  expenses?: Expense[];
  maxServices?: number;
  maxExpenses?: number;
}): UserContext {
  const { vehicles = [], services = [], expenses = [], maxServices = 10, maxExpenses = 10 } = params;

  // ساخت map برای دسترسی سریع به نام خودرو
  const vehicleMap = new Map<string, Vehicle>();
  vehicles.forEach(v => vehicleMap.set(v.id, v));

  // گرفتن آخرین سرویس‌ها
  const recentServices = services
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxServices)
    .map(service => {
      const vehicle = vehicleMap.get(service.vehicleId);
      // تبدیل service types به فارسی
      const typeName = SERVICE_TYPES[service.type] || service.type;
      const typesNames = service.types?.map(t => SERVICE_TYPES[t as ServiceType] || t);
      
      return {
        date: service.date,
        km: service.km,
        cost: service.cost,
        type: typeName,
        types: typesNames,
        note: service.note,
        vehicleModel: vehicle?.model || 'نامشخص',
      };
    });

  // گرفتن آخرین هزینه‌ها
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxExpenses)
    .map(expense => {
      const vehicle = vehicleMap.get(expense.vehicleId);
      // تبدیل expense category به فارسی
      const categoryName = EXPENSE_CATEGORY_NAMES[expense.category] || expense.category;
      
      return {
        date: expense.date,
        amount: expense.amount,
        category: categoryName,
        km: expense.km,
        note: expense.note,
        vehicleModel: vehicle?.model || 'نامشخص',
      };
    });

  return {
    vehicles: vehicles.map(v => ({
      id: v.id,
      model: v.model,
      year: v.year,
      plateNumber: v.plateNumber,
      currentKm: v.currentKm,
      note: v.note,
    })),
    recentServices,
    recentExpenses,
  };
}

/**
 * ساخت متن context برای system prompt
 */
export function formatUserContextForPrompt(context: UserContext): string {
  let contextText = '';

  // اطلاعات خودروها
  if (context.vehicles && context.vehicles.length > 0) {
    contextText += '\n\n=== اطلاعات خودروهای کاربر ===\n';
    context.vehicles.forEach((vehicle, index) => {
      contextText += `${index + 1}. ${vehicle.model} (${vehicle.year})\n`;
      contextText += `   - پلاک: ${vehicle.plateNumber}\n`;
      contextText += `   - کیلومتر فعلی: ${vehicle.currentKm.toLocaleString('fa-IR')} کیلومتر\n`;
      if (vehicle.note) {
        contextText += `   - یادداشت: ${vehicle.note}\n`;
      }
    });
  }

  // آخرین سرویس‌ها
  if (context.recentServices && context.recentServices.length > 0) {
    contextText += '\n\n=== آخرین سرویس‌های انجام شده ===\n';
    context.recentServices.forEach((service, index) => {
      contextText += `${index + 1}. تاریخ: ${service.date} | ${service.vehicleModel}\n`;
      contextText += `   - نوع: ${service.types?.join(', ') || service.type}\n`;
      contextText += `   - کیلومتر: ${service.km.toLocaleString('fa-IR')}\n`;
      contextText += `   - هزینه: ${service.cost.toLocaleString('fa-IR')} تومان\n`;
      if (service.note) {
        contextText += `   - یادداشت: ${service.note}\n`;
      }
    });
  }

  // آخرین هزینه‌ها
  if (context.recentExpenses && context.recentExpenses.length > 0) {
    contextText += '\n\n=== آخرین هزینه‌های ثبت شده ===\n';
    context.recentExpenses.forEach((expense, index) => {
      contextText += `${index + 1}. تاریخ: ${expense.date} | ${expense.vehicleModel}\n`;
      contextText += `   - دسته: ${expense.category}\n`;
      contextText += `   - مبلغ: ${expense.amount.toLocaleString('fa-IR')} تومان\n`;
      if (expense.km) {
        contextText += `   - کیلومتر: ${expense.km.toLocaleString('fa-IR')}\n`;
      }
      if (expense.note) {
        contextText += `   - یادداشت: ${expense.note}\n`;
      }
    });
  }

  return contextText;
}

/**
 * ساخت متن conversation context برای prompt
 */
export function formatConversationContextForPrompt(
  messages: Array<{ role: 'user' | 'model'; text: string }>,
  maxMessages: number = 10
): string {
  // فقط آخرین N پیام را بگیر (برای کنترل token usage)
  const recentMessages = messages.slice(-maxMessages);
  
  if (recentMessages.length === 0) {
    return '';
  }

  let contextText = '\n\n=== تاریخچه گفتگو ===\n';
  recentMessages.forEach((msg) => {
    const role = msg.role === 'user' ? 'کاربر' : 'مشاور';
    contextText += `${role}: ${msg.text}\n`;
  });

  return contextText;
}

