import {
  User
} from '../models/User';

class DashboardController {
  constructor() {
    this.user = new User(1, 'John Doe', 'john.doe@example.com');
  }

  loadUser(user) {
    this.user = user;
  }

  get balance() {
    return this.user.balance;
  }

  get transactions() {
    return this.user.transactionsHistory;
  }

  getMonthlyExpenses() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return this.transactions
      .filter(
        (t) => t.type === 'expense' && new Date(t.date) >= startOfMonth
      )
      .reduce((total, t) => total + t.amount, 0);
  }

  getMonthlyIncome() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return this.transactions
      .filter(
        (t) => t.type === 'income' && new Date(t.date) >= startOfMonth
      )
      .reduce((total, t) => total + t.amount, 0);
  }

  getRecentTransactions(limit = 3) {
    return this.transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  getChartData() {
    const last7Days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const dayTransactions = this.transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate.toDateString() === date.toDateString();
      });

      const expenses = dayTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const income = dayTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      last7Days.push({
        date: date.getDate(),
        day: date.toLocaleDateString('fr-FR', {
          weekday: 'short'
        }),
        expenses,
        income,
      });
    }

    return last7Days;
  }

  getCategoryExpenses() {
    const categoryTotals = {};

    this.transactions
      .filter((t) => t.type === 'expense')
      .forEach((transaction) => {
        if (!categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += transaction.amount;
      });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount
      }))
      .sort((a, b) => b.amount - a.amount);
  }
}

export default new DashboardController();