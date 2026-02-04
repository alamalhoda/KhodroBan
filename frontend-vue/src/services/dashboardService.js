import { vehicleService } from '@services/vehicleService'
import { serviceService } from '@services/serviceService'
import { expenseService } from '@services/expenseService'
import { reminderService } from '@services/reminderService'

/**
 * Dashboard Service
 * 
 * جمع‌آوری و محاسبه داده‌های dashboard از سایر services
 */
export const dashboardService = {
  /**
   * دریافت خلاصه داده‌های dashboard
   */
  async getSummary() {
    try {
      // دریافت داده‌ها به صورت موازی - با error handling برای هر کدام
      const [vehiclesResult, servicesResult, expensesResult, remindersResult] = await Promise.allSettled([
        vehicleService.getAll(),
        serviceService.getAll(),
        expenseService.getAll(),
        reminderService.getAll(),
      ])

      // Extract data or use empty array on error
      const vehicles = vehiclesResult.status === 'fulfilled' ? vehiclesResult.value : []
      const services = servicesResult.status === 'fulfilled' ? servicesResult.value : []
      const expenses = expensesResult.status === 'fulfilled' ? expensesResult.value : []
      const reminders = remindersResult.status === 'fulfilled' ? remindersResult.value : []

      // Log errors if any
      if (vehiclesResult.status === 'rejected') {
        console.error('Error fetching vehicles:', vehiclesResult.reason)
      }
      if (servicesResult.status === 'rejected') {
        console.error('Error fetching services:', servicesResult.reason)
      }
      if (expensesResult.status === 'rejected') {
        console.error('Error fetching expenses:', expensesResult.reason)
      }
      if (remindersResult.status === 'rejected') {
        console.error('Error fetching reminders:', remindersResult.reason)
      }

      // محاسبه آمار پایه
      const totalVehicles = vehicles.length
      const totalServices = services.length
      const totalExpensesCount = expenses.length
      const totalCost = 
        services.reduce((sum, s) => sum + (s.cost || 0), 0) +
        expenses.reduce((sum, e) => sum + (e.amount || 0), 0)

      // محاسبه یادآورها
      const activeRemindersList = reminders.filter(r => !r.dismissed)
      const overdueRemindersList = activeRemindersList.filter(r => r.status === 'overdue')

      // سرویس‌های اخیر (۵ مورد آخر)
      const recentServices = services
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)

      // یادآورهای آینده (۳ مورد اول)
      const upcomingReminders = activeRemindersList
        .sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
          return dateA - dateB
        })
        .slice(0, 3)

      // محاسبه هزینه‌های این ماه
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      const thisMonthExpenses = expenses
        .filter(e => {
          const expenseDate = new Date(e.date)
          return expenseDate.getMonth() === currentMonth && 
                 expenseDate.getFullYear() === currentYear
        })
        .reduce((sum, e) => sum + (e.amount || 0), 0)

      const servicesThisMonth = services.filter(s => {
        const serviceDate = new Date(s.date)
        return serviceDate.getMonth() === currentMonth && 
               serviceDate.getFullYear() === currentYear
      }).length

      // محاسبه میانگین هزینه ماهانه (از ۱۲ ماه گذشته)
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        return { month: date.getMonth(), year: date.getFullYear() }
      })

      let totalMonthlyExpenses = 0
      let monthsWithExpenses = 0

      last12Months.forEach(({ month, year }) => {
        const monthlyTotal = expenses
          .filter(e => {
            const expenseDate = new Date(e.date)
            return expenseDate.getMonth() === month && expenseDate.getFullYear() === year
          })
          .reduce((sum, e) => sum + (e.amount || 0), 0)

        if (monthlyTotal > 0) {
          totalMonthlyExpenses += monthlyTotal
          monthsWithExpenses++
        }
      })

      const avgMonthlyExpense = monthsWithExpenses > 0 
        ? totalMonthlyExpenses / monthsWithExpenses 
        : 0

      // پیدا کردن سرویس بعدی
      const nextServiceDue = upcomingReminders.length > 0 ? upcomingReminders[0] : null

      return {
        totalVehicles,
        totalServices,
        totalExpenses: totalExpensesCount,
        totalCost,
        activeReminders: activeRemindersList.length,
        overdueReminders: overdueRemindersList.length,
        recentServices,
        upcomingReminders,
        thisMonthExpenses,
        servicesThisMonth,
        avgMonthlyExpense,
        nextServiceDue,
        vehicles, // برای استفاده در کامپوننت
        reminders: activeRemindersList, // برای استفاده در کامپوننت
      }
    } catch (error) {
      console.error('Error fetching dashboard summary:', error)
      throw error
    }
  },
}

