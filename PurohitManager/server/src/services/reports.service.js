import { paymentsRepo } from '../repositories/payments.repo.js';
import { expensesRepo } from '../repositories/expenses.repo.js';
import { bookingsRepo } from '../repositories/bookings.repo.js';

export const reportsService = {
  async getFinancialSummary(year = new Date().getFullYear()) {
    const payments = await paymentsRepo.getAll();
    const expenses = await expensesRepo.getAll();
    const bookings = await bookingsRepo.getAll();

    // Filter by year
    const yearPayments = payments.filter(p => p.date && p.date.startsWith(`${year}-`));
    const yearExpenses = expenses.filter(e => e.date && e.date.startsWith(`${year}-`));
    const yearBookings = bookings.filter(b => b.date && b.date.startsWith(`${year}-`));

    const totalIncome = yearPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const totalExpenses = yearExpenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const netEarnings = totalIncome - totalExpenses;

    // Monthly breakdown (12 months)
    const monthly = Array.from({ length: 12 }, (_, i) => {
      const monthStr = String(i + 1).padStart(2, '0');
      const prefix = `${year}-${monthStr}`;
      const inc = yearPayments
        .filter(p => p.date.startsWith(prefix))
        .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
      const exp = yearExpenses
        .filter(e => e.date.startsWith(prefix))
        .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
      const ceremonyCount = yearBookings
        .filter(b => b.date.startsWith(prefix) && b.status === 'completed').length;

      return {
        month: i + 1,
        monthName: new Date(year, i, 1).toLocaleString('default', { month: 'short' }),
        income: inc,
        expenses: exp,
        net: inc - exp,
        ceremonies: ceremonyCount
      };
    });

    // Breakdown by ceremony type
    const byService = {};
    for (const b of yearBookings) {
      const svc = b.serviceName || 'Other';
      if (!byService[svc]) byService[svc] = { count: 0, revenue: 0 };
      byService[svc].count += 1;
      byService[svc].revenue += Number(b.paidAmount) || 0;
    }

    // Breakdown by payment mode
    const byMode = { Cash: 0, UPI: 0, BankTransfer: 0 };
    for (const p of yearPayments) {
      if (p.mode === 'Cash') byMode.Cash += p.amount;
      else if (p.mode === 'UPI') byMode.UPI += p.amount;
      else byMode.BankTransfer += p.amount;
    }

    return {
      year,
      totalIncome,
      totalExpenses,
      netEarnings,
      totalBookings: yearBookings.length,
      completedBookings: yearBookings.filter(b => b.status === 'completed').length,
      monthly,
      byService,
      byMode
    };
  }
};

