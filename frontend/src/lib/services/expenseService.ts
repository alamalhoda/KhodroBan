import { supabase } from '../supabase';
import api from './api';
import type { Expense, ExpenseFormData, ApiResponse } from '../types';
import { selectService } from './base/router';
import type { IExpenseService } from './base/types';

// ============================================
// MOCK IMPLEMENTATION
// ============================================
// استفاده: VITE_BACKEND_TYPE=mock
// ویژگی‌ها:
// - داده‌ها در memory (بعد از refresh از بین می‌روند)
// - مناسب برای تست و یادگیری
// - بدون نیاز به backend واقعی

const mockExpenses: Expense[] = [
  {
    id: '1',
    vehicleId: '1',
    date: '1403/09/18',
    amount: 350000,
    category: 'fuel',
    km: 84500,
    note: 'بنزین سوپر',
    createdAt: '2024-12-08',
    updatedAt: '2024-12-08',
  },
  {
    id: '2',
    vehicleId: '1',
    date: '1403/09/10',
    amount: 80000,
    category: 'wash',
    note: 'کارواش کامل',
    createdAt: '2024-12-01',
    updatedAt: '2024-12-01',
  },
  {
    id: '3',
    vehicleId: '1',
    date: '1403/09/05',
    amount: 25000,
    category: 'parking',
    createdAt: '2024-11-25',
    updatedAt: '2024-11-25',
  },
  {
    id: '4',
    vehicleId: '2',
    date: '1403/09/12',
    amount: 420000,
    category: 'fuel',
    km: 141500,
    createdAt: '2024-12-02',
    updatedAt: '2024-12-02',
  },
  {
    id: '5',
    vehicleId: '1',
    date: '1403/08/28',
    amount: 150000,
    category: 'toll',
    note: 'عوارض آزادراه',
    createdAt: '2024-11-18',
    updatedAt: '2024-11-18',
  },
];

const expenseServiceMock: IExpenseService = {
  async getAll(vehicleId?: string): Promise<Expense[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (vehicleId) {
      return mockExpenses.filter(e => e.vehicleId === vehicleId);
    }
    return [...mockExpenses];
  },

  async getById(id: string): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const expense = mockExpenses.find(e => e.id === id);
    if (!expense) throw new Error('هزینه یافت نشد');
    return expense;
  },

  async create(data: ExpenseFormData): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockExpenses.unshift(newExpense);
    return newExpense;
  },

  async update(id: string, data: Partial<ExpenseFormData>): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockExpenses.findIndex(e => e.id === id);
    if (index === -1) throw new Error('هزینه یافت نشد');
    
    mockExpenses[index] = {
      ...mockExpenses[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockExpenses[index];
  },

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockExpenses.findIndex(e => e.id === id);
    if (index !== -1) {
      mockExpenses.splice(index, 1);
    }
  },

  async getByCategory(category: string): Promise<Expense[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockExpenses.filter(e => e.category === category);
  },
};

// ============================================
// SUPABASE IMPLEMENTATION
// ============================================
// استفاده: VITE_BACKEND_TYPE=supabase
// نیاز به: VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY
// جدول: daily_expenses

const expenseServiceSupabase: IExpenseService = {
  async getAll(vehicleId?: string): Promise<Expense[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    let query = supabase
      .from('daily_expenses')
      .select(`
        *,
        vehicle:vehicles!inner(user_id)
      `)
      .eq('vehicles.user_id', user.id)
      .order('expense_date_gregorian', { ascending: false });

    if (vehicleId) {
      query = query.eq('vehicle_id', parseInt(vehicleId));
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return (data || []).map((e: any) => ({
      id: e.expense_id.toString(),
      vehicleId: e.vehicle_id.toString(),
      date: e.expense_date,
      amount: e.amount,
      category: e.category as any,
      km: e.km_at_expense || undefined,
      note: e.description || undefined,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    }));
  },

  async getById(id: string): Promise<Expense> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const { data, error } = await supabase
      .from('daily_expenses')
      .select(`
        *,
        vehicle:vehicles!inner(user_id)
      `)
      .eq('expense_id', id)
      .eq('vehicles.user_id', user.id)
      .single();

    if (error) throw new Error(error.message);

    const expenseData = data as any;
    return {
      id: expenseData.expense_id.toString(),
      vehicleId: expenseData.vehicle_id.toString(),
      date: expenseData.expense_date,
      amount: expenseData.amount,
      category: expenseData.category as any,
      km: expenseData.km_at_expense || undefined,
      note: expenseData.description || undefined,
      createdAt: expenseData.created_at,
      updatedAt: expenseData.updated_at,
    };
  },

  async create(data: ExpenseFormData): Promise<Expense> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    // تبدیل تاریخ شمسی به میلادی (ساده - در production باید از کتابخانه استفاده شود)
    const expenseDateGregorian = new Date().toISOString().split('T')[0];

    const { data: newExpense, error } = await supabase
      .from('daily_expenses')
      .insert({
        vehicle_id: parseInt(data.vehicleId),
        expense_date: data.date,
        expense_date_gregorian: expenseDateGregorian,
        amount: data.amount,
        category: data.category,
        km_at_expense: data.km || null,
        description: data.note || null,
      } as any)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const newExpenseData = newExpense as any;
    return {
      id: newExpenseData.expense_id.toString(),
      vehicleId: newExpenseData.vehicle_id.toString(),
      date: newExpenseData.expense_date,
      amount: newExpenseData.amount,
      category: newExpenseData.category as any,
      km: newExpenseData.km_at_expense || undefined,
      note: newExpenseData.description || undefined,
      createdAt: newExpenseData.created_at,
      updatedAt: newExpenseData.updated_at,
    };
  },

  async update(id: string, data: Partial<ExpenseFormData>): Promise<Expense> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const updates: any = {};
    if (data.date !== undefined) updates.expense_date = data.date;
    if (data.amount !== undefined) updates.amount = data.amount;
    if (data.category !== undefined) updates.category = data.category;
    if (data.km !== undefined) updates.km_at_expense = data.km || null;
    if (data.note !== undefined) updates.description = data.note || null;

    // @ts-ignore - Supabase type inference issue
    const { data: updatedExpense, error } = await supabase
      .from('daily_expenses')
      .update(updates as any)
      .eq('expense_id', id)
      .select(`
        *,
        vehicle:vehicles!inner(user_id)
      `)
      .eq('vehicles.user_id', user.id)
      .single();

    if (error) throw new Error(error.message);

    const updatedExpenseData = updatedExpense as any;
    return {
      id: updatedExpenseData.expense_id.toString(),
      vehicleId: updatedExpenseData.vehicle_id.toString(),
      date: updatedExpenseData.expense_date,
      amount: updatedExpenseData.amount,
      category: updatedExpenseData.category as any,
      km: updatedExpenseData.km_at_expense || undefined,
      note: updatedExpenseData.description || undefined,
      createdAt: updatedExpenseData.created_at,
      updatedAt: updatedExpenseData.updated_at,
    };
  },

  async delete(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const { error } = await supabase
      .from('daily_expenses')
      .delete()
      .eq('expense_id', id)
      .select(`
        vehicle:vehicles!inner(user_id)
      `)
      .eq('vehicles.user_id', user.id);

    if (error) throw new Error(error.message);
  },

  async getByCategory(category: string): Promise<Expense[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    const { data, error } = await supabase
      .from('daily_expenses')
      .select(`
        *,
        vehicle:vehicles!inner(user_id)
      `)
      .eq('vehicles.user_id', user.id)
      .eq('category', category)
      .order('expense_date_gregorian', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((e: any) => ({
      id: e.expense_id.toString(),
      vehicleId: e.vehicle_id.toString(),
      date: e.expense_date,
      amount: e.amount,
      category: e.category as any,
      km: e.km_at_expense || undefined,
      note: e.description || undefined,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    }));
  },
};

// ============================================
// DJANGO IMPLEMENTATION (Placeholder)
// ============================================
// استفاده: VITE_BACKEND_TYPE=django
// نیاز به: VITE_DJANGO_API_URL
// API: Django REST Framework

const expenseServiceDjango: IExpenseService = {
  async getAll(vehicleId?: string): Promise<Expense[]> {
    const params = vehicleId ? { vehicle_id: vehicleId } : {};
    const response = await api.get<ApiResponse<Expense[]>>('/expenses/', { params });
    return response.data.data;
  },

  async getById(id: string): Promise<Expense> {
    const response = await api.get<ApiResponse<Expense>>(`/expenses/${id}/`);
    return response.data.data;
  },

  async create(data: ExpenseFormData): Promise<Expense> {
    const response = await api.post<ApiResponse<Expense>>('/expenses/', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<ExpenseFormData>): Promise<Expense> {
    const response = await api.patch<ApiResponse<Expense>>(`/expenses/${id}/`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/expenses/${id}/`);
  },

  async getByCategory(category: string): Promise<Expense[]> {
    const response = await api.get<ApiResponse<Expense[]>>('/expenses/', {
      params: { category },
    });
    return response.data.data;
  },
};

// ============================================
// EXPORTED SERVICE (Router)
// ============================================
// این service به صورت خودکار بر اساس VITE_BACKEND_TYPE
// یکی از implementations بالا را انتخاب می‌کند

export const expenseService = selectService(
  expenseServiceMock,
  expenseServiceSupabase,
  expenseServiceDjango
);
