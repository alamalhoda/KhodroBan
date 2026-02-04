import { describe, it, expect } from 'vitest';
import {
  buildUserContext,
  formatUserContextForPrompt,
  formatConversationContextForPrompt,
} from '../utils';
import type { Vehicle, ServiceRecord, Expense } from '../../../types';

describe('AI Service Utils', () => {
  describe('buildUserContext', () => {
    const mockVehicle: Vehicle = {
      id: 'vehicle-1',
      userId: 'user-1',
      model: 'پژو ۲۰۶',
      year: 1395,
      plateNumber: '12ج34567',
      currentKm: 150000,
      note: 'خودروی اصلی',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const mockService: ServiceRecord = {
      id: 'service-1',
      vehicleId: 'vehicle-1',
      date: '2024-01-15',
      km: 145000,
      cost: 500000,
      type: 'oil_change',
      types: ['oil_change'],
      note: 'تعویض روغن',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    };

    const mockExpense: Expense = {
      id: 'expense-1',
      vehicleId: 'vehicle-1',
      date: '2024-01-20',
      amount: 100000,
      category: 'fuel',
      km: 148000,
      note: 'بنزین',
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z',
    };

    it('should build user context with empty arrays', () => {
      const context = buildUserContext({
        vehicles: [],
        services: [],
        expenses: [],
      });

      expect(context.vehicles).toEqual([]);
      expect(context.recentServices).toEqual([]);
      expect(context.recentExpenses).toEqual([]);
    });

    it('should build user context with vehicles', () => {
      const context = buildUserContext({
        vehicles: [mockVehicle],
        services: [],
        expenses: [],
      });

      expect(context.vehicles).toHaveLength(1);
      expect(context.vehicles![0]).toEqual({
        id: mockVehicle.id,
        model: mockVehicle.model,
        year: mockVehicle.year,
        plateNumber: mockVehicle.plateNumber,
        currentKm: mockVehicle.currentKm,
        note: mockVehicle.note,
      });
    });

    it('should build user context with services', () => {
      const context = buildUserContext({
        vehicles: [mockVehicle],
        services: [mockService],
        expenses: [],
      });

      expect(context.recentServices).toHaveLength(1);
      expect(context.recentServices![0].vehicleModel).toBe(mockVehicle.model);
      expect(context.recentServices![0].date).toBe(mockService.date);
      expect(context.recentServices![0].km).toBe(mockService.km);
      expect(context.recentServices![0].cost).toBe(mockService.cost);
    });

    it('should build user context with expenses', () => {
      const context = buildUserContext({
        vehicles: [mockVehicle],
        services: [],
        expenses: [mockExpense],
      });

      expect(context.recentExpenses).toHaveLength(1);
      expect(context.recentExpenses![0].vehicleModel).toBe(mockVehicle.model);
      expect(context.recentExpenses![0].date).toBe(mockExpense.date);
      expect(context.recentExpenses![0].amount).toBe(mockExpense.amount);
      expect(context.recentExpenses![0].category).toBe('سوخت'); // باید به فارسی تبدیل شود
    });

    it('should limit services to maxServices', () => {
      const services: ServiceRecord[] = Array.from({ length: 15 }, (_, i) => ({
        ...mockService,
        id: `service-${i}`,
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      }));

      const context = buildUserContext({
        vehicles: [mockVehicle],
        services,
        expenses: [],
        maxServices: 10,
      });

      expect(context.recentServices).toHaveLength(10);
    });

    it('should limit expenses to maxExpenses', () => {
      const expenses: Expense[] = Array.from({ length: 15 }, (_, i) => ({
        ...mockExpense,
        id: `expense-${i}`,
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      }));

      const context = buildUserContext({
        vehicles: [mockVehicle],
        services: [],
        expenses,
        maxExpenses: 10,
      });

      expect(context.recentExpenses).toHaveLength(10);
    });

    it('should sort services by date (newest first)', () => {
      const services: ServiceRecord[] = [
        { ...mockService, id: 'service-1', date: '2024-01-10' },
        { ...mockService, id: 'service-2', date: '2024-01-20' },
        { ...mockService, id: 'service-3', date: '2024-01-15' },
      ];

      const context = buildUserContext({
        vehicles: [mockVehicle],
        services,
        expenses: [],
      });

      expect(context.recentServices![0].date).toBe('2024-01-20');
      expect(context.recentServices![1].date).toBe('2024-01-15');
      expect(context.recentServices![2].date).toBe('2024-01-10');
    });

    it('should handle service with unknown vehicleId', () => {
      const serviceWithUnknownVehicle: ServiceRecord = {
        ...mockService,
        vehicleId: 'unknown-vehicle',
      };

      const context = buildUserContext({
        vehicles: [mockVehicle],
        services: [serviceWithUnknownVehicle],
        expenses: [],
      });

      expect(context.recentServices![0].vehicleModel).toBe('نامشخص');
    });
  });

  describe('formatUserContextForPrompt', () => {
    it('should format empty context', () => {
      const formatted = formatUserContextForPrompt({});
      expect(formatted).toBe('');
    });

    it('should format context with vehicles', () => {
      const context = {
        vehicles: [
          {
            id: 'v1',
            model: 'پژو ۲۰۶',
            year: 1395,
            plateNumber: '12ج34567',
            currentKm: 150000,
            note: 'خودروی اصلی',
          },
        ],
      };

      const formatted = formatUserContextForPrompt(context);
      expect(formatted).toContain('اطلاعات خودروهای کاربر');
      expect(formatted).toContain('پژو ۲۰۶');
      expect(formatted).toContain('12ج34567');
      expect(formatted).toContain('۱۵۰٬۰۰۰'); // فرمت فارسی
      expect(formatted).toContain('خودروی اصلی');
    });

    it('should format context with services', () => {
      const context = {
        recentServices: [
          {
            date: '2024-01-15',
            km: 145000,
            cost: 500000,
            type: 'تعویض روغن',
            vehicleModel: 'پژو ۲۰۶',
            note: 'سرویس دوره‌ای',
          },
        ],
      };

      const formatted = formatUserContextForPrompt(context);
      expect(formatted).toContain('آخرین سرویس‌های انجام شده');
      expect(formatted).toContain('2024-01-15');
      expect(formatted).toContain('۱۴۵٬۰۰۰'); // فرمت فارسی
      expect(formatted).toContain('۵۰۰٬۰۰۰'); // فرمت فارسی
    });

    it('should format context with expenses', () => {
      const context = {
        recentExpenses: [
          {
            date: '2024-01-20',
            amount: 100000,
            category: 'سوخت',
            vehicleModel: 'پژو ۲۰۶',
            km: 148000,
            note: 'بنزین',
          },
        ],
      };

      const formatted = formatUserContextForPrompt(context);
      expect(formatted).toContain('آخرین هزینه‌های ثبت شده');
      expect(formatted).toContain('2024-01-20');
      expect(formatted).toContain('۱۰۰٬۰۰۰'); // فرمت فارسی
      expect(formatted).toContain('سوخت');
    });

    it('should format complete context', () => {
      const context = {
        vehicles: [
          {
            id: 'v1',
            model: 'پژو ۲۰۶',
            year: 1395,
            plateNumber: '12ج34567',
            currentKm: 150000,
          },
        ],
        recentServices: [
          {
            date: '2024-01-15',
            km: 145000,
            cost: 500000,
            type: 'تعویض روغن',
            vehicleModel: 'پژو ۲۰۶',
          },
        ],
        recentExpenses: [
          {
            date: '2024-01-20',
            amount: 100000,
            category: 'سوخت',
            vehicleModel: 'پژو ۲۰۶',
          },
        ],
      };

      const formatted = formatUserContextForPrompt(context);
      expect(formatted).toContain('اطلاعات خودروهای کاربر');
      expect(formatted).toContain('آخرین سرویس‌های انجام شده');
      expect(formatted).toContain('آخرین هزینه‌های ثبت شده');
    });
  });

  describe('formatConversationContextForPrompt', () => {
    it('should format empty messages', () => {
      const formatted = formatConversationContextForPrompt([]);
      expect(formatted).toBe('');
    });

    it('should format single message', () => {
      const messages = [
        { role: 'user' as const, text: 'سلام' },
      ];

      const formatted = formatConversationContextForPrompt(messages);
      expect(formatted).toContain('تاریخچه گفتگو');
      expect(formatted).toContain('کاربر: سلام');
    });

    it('should format multiple messages', () => {
      const messages = [
        { role: 'user' as const, text: 'سلام' },
        { role: 'model' as const, text: 'سلام! چطور می‌تونم کمکتون کنم؟' },
        { role: 'user' as const, text: 'سوال دارم' },
      ];

      const formatted = formatConversationContextForPrompt(messages);
      expect(formatted).toContain('کاربر: سلام');
      expect(formatted).toContain('مشاور: سلام! چطور می‌تونم کمکتون کنم؟');
      expect(formatted).toContain('کاربر: سوال دارم');
    });

    it('should limit messages to maxMessages', () => {
      const messages = Array.from({ length: 15 }, (_, i) => ({
        role: (i % 2 === 0 ? 'user' : 'model') as 'user' | 'model',
        text: `پیام ${i}`,
      }));

      const formatted = formatConversationContextForPrompt(messages, 10);
      // باید فقط 10 پیام آخر را بگیرد
      const messageCount = (formatted.match(/کاربر:|مشاور:/g) || []).length;
      expect(messageCount).toBe(10);
    });

    it('should use default maxMessages (10)', () => {
      const messages = Array.from({ length: 15 }, (_, i) => ({
        role: (i % 2 === 0 ? 'user' : 'model') as 'user' | 'model',
        text: `پیام ${i}`,
      }));

      const formatted = formatConversationContextForPrompt(messages);
      const messageCount = (formatted.match(/کاربر:|مشاور:/g) || []).length;
      expect(messageCount).toBe(10);
    });

    it('should handle custom maxMessages', () => {
      const messages = Array.from({ length: 20 }, (_, i) => ({
        role: (i % 2 === 0 ? 'user' : 'model') as 'user' | 'model',
        text: `پیام ${i}`,
      }));

      const formatted = formatConversationContextForPrompt(messages, 5);
      const messageCount = (formatted.match(/کاربر:|مشاور:/g) || []).length;
      expect(messageCount).toBe(5);
    });
  });
});

