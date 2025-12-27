import { supabase } from '../supabase';
import api from './api';
import type { ReportFilter, ReportSummary, ApiResponse } from '../types';
import { selectService } from './base/router';
import type { IReportService } from './base/types';
import { serviceService } from './serviceService';
import { expenseService } from './expenseService';
import { formatJalaliDate } from '../utils/format';

// ============================================
// MOCK IMPLEMENTATION
// ============================================
// استفاده: VITE_BACKEND_TYPE=mock
// ویژگی‌ها:
// - داده‌ها از serviceService و expenseService استفاده می‌کند
// - مناسب برای تست و یادگیری

const reportServiceMock: IReportService = {
  async getSummary(filter?: ReportFilter): Promise<ReportSummary> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Get data from other services
    const services = await serviceService.getAll(filter?.vehicleId);
    const expenses = await expenseService.getAll(filter?.vehicleId);

    // Calculate totals
    const totalServiceCost = services.reduce((sum, s) => sum + s.cost, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Group by category
    const costByCategory: Record<string, number> = {};

    // Add service costs
    services.forEach((s) => {
      const key = `service_${s.type}`;
      costByCategory[key] = (costByCategory[key] || 0) + s.cost;
    });

    // Add expense costs
    expenses.forEach((e) => {
      costByCategory[e.category] = (costByCategory[e.category] || 0) + e.amount;
    });

    // Mock monthly data
    const costByMonth = [
      { month: '1403/07', amount: 850000 },
      { month: '1403/08', amount: 1200000 },
      { month: '1403/09', amount: 1550000 },
    ];

    return {
      totalServiceCost,
      totalExpenses,
      totalCost: totalServiceCost + totalExpenses,
      serviceCount: services.length,
      expenseCount: expenses.length,
      costByCategory,
      costByMonth,
    };
  },

  async exportCSV(filter?: ReportFilter): Promise<Blob> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate mock CSV
    const services = await serviceService.getAll(filter?.vehicleId);
    const expenses = await expenseService.getAll(filter?.vehicleId);

    let csv = 'نوع,تاریخ,مبلغ,توضیحات\n';

    services.forEach((s) => {
      csv += `سرویس - ${s.type},${s.date},${s.cost},${s.note || ''}\n`;
    });

    expenses.forEach((e) => {
      csv += `هزینه - ${e.category},${e.date},${e.amount},${e.note || ''}\n`;
    });

    // Add BOM for Persian text support
    const BOM = '\uFEFF';
    return new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' });
  },

  async exportPDF(filter?: ReportFilter): Promise<Blob> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In real app, this would generate a PDF
    // For mock, just return an empty blob
    return new Blob(['PDF content'], { type: 'application/pdf' });
  },

  async getMonthlyTrend(
    vehicleId?: string,
    months = 6
  ): Promise<{ month: string; amount: number }[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Generate mock trend data
    return [
      { month: '1403/04', amount: 620000 },
      { month: '1403/05', amount: 890000 },
      { month: '1403/06', amount: 1100000 },
      { month: '1403/07', amount: 750000 },
      { month: '1403/08', amount: 1300000 },
      { month: '1403/09', amount: 980000 },
    ].slice(-months);
  },

  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

// ============================================
// SUPABASE IMPLEMENTATION
// ============================================
// استفاده: VITE_BACKEND_TYPE=supabase
// نیاز به: VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY
// جداول: services, daily_expenses

const reportServiceSupabase: IReportService = {
  async getSummary(filter?: ReportFilter): Promise<ReportSummary> {    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    // دریافت services با تاریخ
    let servicesQuery = supabase
      .from('services')
      .select(
        `
        cost,
        service_type,
        service_date_gregorian,
        vehicle:vehicles!inner(user_id)
      `
      )
      .eq('vehicles.user_id', user.id);

    if (filter?.vehicleId) {
      servicesQuery = servicesQuery.eq('vehicle_id', parseInt(filter.vehicleId));
    }

    const { data: services } = await servicesQuery;

    // دریافت expenses با تاریخ
    let expensesQuery = supabase
      .from('daily_expenses')
      .select(
        `
        amount,
        category,
        expense_date_gregorian,
        vehicle:vehicles!inner(user_id)
      `
      )
      .eq('vehicles.user_id', user.id);

    if (filter?.vehicleId) {
      expensesQuery = expensesQuery.eq('vehicle_id', parseInt(filter.vehicleId));
    }

    const { data: expenses } = await expensesQuery;

    // محاسبه totals
    const totalServiceCost = (services || []).reduce((sum, s) => sum + (s.cost || 0), 0);
    const totalExpenses = (expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0);

    // Group by category
    const costByCategory: Record<string, number> = {};

    (services || []).forEach((s) => {
      const key = `service_${s.service_type}`;
      costByCategory[key] = (costByCategory[key] || 0) + (s.cost || 0);
    });

    (expenses || []).forEach((e) => {
      costByCategory[e.category] = (costByCategory[e.category] || 0) + (e.amount || 0);
    });

    // محاسبه monthly trend از داده‌های واقعی
    const monthlyData: Record<string, number> = {};

    // اضافه کردن هزینه‌های services به ماه‌ها
    (services || []).forEach((s: any) => {
      if (s.service_date_gregorian) {
        const date = new Date(s.service_date_gregorian);
        const monthKey = formatJalaliDate(s.service_date_gregorian).substring(0, 7); // YYYY/MM
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (s.cost || 0);
      }
    });

    // اضافه کردن هزینه‌های expenses به ماه‌ها
    (expenses || []).forEach((e: any) => {
      if (e.expense_date_gregorian) {
        const monthKey = formatJalaliDate(e.expense_date_gregorian).substring(0, 7); // YYYY/MM
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (e.amount || 0);
      }
    });

    // تبدیل به آرایه و مرتب‌سازی بر اساس ماه
    const costByMonth = Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => {
        // مرتب‌سازی بر اساس سال و ماه (مثلاً '1403/09' > '1403/08')
        return b.month.localeCompare(a.month);
      })
      .slice(0, 12); // فقط 12 ماه اخیر

    return {
      totalServiceCost,
      totalExpenses,
      totalCost: totalServiceCost + totalExpenses,
      serviceCount: services?.length || 0,
      expenseCount: expenses?.length || 0,
      costByCategory,
      costByMonth,
    };
  },

  async exportCSV(filter?: ReportFilter): Promise<Blob> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    // دریافت services
    let servicesQuery = supabase
      .from('services')
      .select(
        `
        service_date,
        cost,
        service_type,
        description,
        vehicle:vehicles!inner(user_id)
      `
      )
      .eq('vehicles.user_id', user.id);

    if (filter?.vehicleId) {
      servicesQuery = servicesQuery.eq('vehicle_id', parseInt(filter.vehicleId));
    }

    const { data: services } = await servicesQuery;

    // دریافت expenses
    let expensesQuery = supabase
      .from('daily_expenses')
      .select(
        `
        expense_date,
        amount,
        category,
        description,
        vehicle:vehicles!inner(user_id)
      `
      )
      .eq('vehicles.user_id', user.id);

    if (filter?.vehicleId) {
      expensesQuery = expensesQuery.eq('vehicle_id', parseInt(filter.vehicleId));
    }

    const { data: expenses } = await expensesQuery;

    let csv = 'نوع,تاریخ,مبلغ,توضیحات\n';

    (services || []).forEach((s) => {
      csv += `سرویس - ${s.service_type},${s.service_date},${s.cost},${s.description || ''}\n`;
    });

    (expenses || []).forEach((e) => {
      csv += `هزینه - ${e.category},${e.expense_date},${e.amount},${e.description || ''}\n`;
    });

    const BOM = '\uFEFF';
    return new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' });
  },

  async exportPDF(filter?: ReportFilter): Promise<Blob> {
    // TODO: پیاده‌سازی PDF generation
    // می‌توانید از یک library مثل jsPDF استفاده کنید
    throw new Error('PDF export هنوز پیاده‌سازی نشده است');
  },

  async getMonthlyTrend(
    vehicleId?: string,
    months = 6
  ): Promise<{ month: string; amount: number }[]> {
    if (!supabase) throw new Error('Supabase client not available. Check VITE_BACKEND_TYPE and environment variables.');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('کاربر لاگین نشده است');

    // دریافت services با تاریخ
    let servicesQuery = supabase
      .from('services')
      .select(
        `
        cost,
        service_date_gregorian,
        vehicle:vehicles!inner(user_id)
      `
      )
      .eq('vehicles.user_id', user.id);

    if (vehicleId) {
      servicesQuery = servicesQuery.eq('vehicle_id', parseInt(vehicleId));
    }

    const { data: services } = await servicesQuery;

    // دریافت expenses با تاریخ
    let expensesQuery = supabase
      .from('daily_expenses')
      .select(
        `
        amount,
        expense_date_gregorian,
        vehicle:vehicles!inner(user_id)
      `
      )
      .eq('vehicles.user_id', user.id);

    if (vehicleId) {
      expensesQuery = expensesQuery.eq('vehicle_id', parseInt(vehicleId));
    }

    const { data: expenses } = await expensesQuery;

    // محاسبه monthly trend از داده‌های واقعی
    const monthlyData: Record<string, number> = {};

    // اضافه کردن هزینه‌های services به ماه‌ها
    (services || []).forEach((s: any) => {
      if (s.service_date_gregorian) {
        const monthKey = formatJalaliDate(s.service_date_gregorian).substring(0, 7); // YYYY/MM
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (s.cost || 0);
      }
    });

    // اضافه کردن هزینه‌های expenses به ماه‌ها
    (expenses || []).forEach((e: any) => {
      if (e.expense_date_gregorian) {
        const monthKey = formatJalaliDate(e.expense_date_gregorian).substring(0, 7); // YYYY/MM
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (e.amount || 0);
      }
    });

    // تبدیل به آرایه و مرتب‌سازی بر اساس ماه (جدیدترین اول)
    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, months); // فقط N ماه اخیر
  },

  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

// ============================================
// DJANGO IMPLEMENTATION (Placeholder)
// ============================================
// استفاده: VITE_BACKEND_TYPE=django
// نیاز به: VITE_DJANGO_API_URL
// API: Django REST Framework

const reportServiceDjango: IReportService = {
  async getSummary(filter?: ReportFilter): Promise<ReportSummary> {
    const response = await api.get<ApiResponse<ReportSummary>>('/reports/summary/', {
      params: filter,
    });
    return response.data.data;
  },

  async exportCSV(filter?: ReportFilter): Promise<Blob> {
    const response = await api.get('/reports/export/csv/', {
      params: filter,
      responseType: 'blob',
    });
    return response.data;
  },

  async exportPDF(filter?: ReportFilter): Promise<Blob> {
    const response = await api.get('/reports/export/pdf/', {
      params: filter,
      responseType: 'blob',
    });
    return response.data;
  },

  async getMonthlyTrend(
    vehicleId?: string,
    months = 6
  ): Promise<{ month: string; amount: number }[]> {
    const response = await api.get<ApiResponse<{ month: string; amount: number }[]>>(
      '/reports/trend/monthly/',
      { params: { vehicle_id: vehicleId, months } }
    );
    return response.data.data;
  },

  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

// ============================================
// EXPORTED SERVICE (Router)
// ============================================
// این service به صورت خودکار بر اساس VITE_BACKEND_TYPE
// یکی از implementations بالا را انتخاب می‌کند

export const reportService = selectService(
  reportServiceMock,
  reportServiceSupabase,
  reportServiceDjango
);
