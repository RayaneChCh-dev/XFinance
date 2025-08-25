class DashboardController {
  calculateBalance(transactions) {
    return transactions.reduce((balance, transaction) => {
      return transaction.type === 'recette' 
        ? balance + transaction.montant 
        : balance - transaction.montant;
    }, 0);
  }

  getMonthlyExpenses(transactions) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions
      .filter(t => 
        t.type === 'depense' && 
        new Date(t.date) >= startOfMonth
      )
      .reduce((total, t) => total + t.montant, 0);
  }

  getMonthlyIncome(transactions) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions
      .filter(t => 
        t.type === 'recette' && 
        new Date(t.date) >= startOfMonth
      )
      .reduce((total, t) => total + t.montant, 0);
  }

  getRecentTransactions(transactions, limit = 3) {
    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }

  getChartData(transactions) {
    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.toDateString() === date.toDateString();
      });
      
      const expenses = dayTransactions
        .filter(t => t.type === 'depense')
        .reduce((sum, t) => sum + t.montant, 0);
      
      const income = dayTransactions
        .filter(t => t.type === 'recette')
        .reduce((sum, t) => sum + t.montant, 0);
      
      last7Days.push({
        date: date.getDate(),
        day: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        expenses,
        income
      });
    }
    
    return last7Days;
  }

  getCategoryExpenses(transactions) {
    const categoryTotals = {};
    
    transactions
      .filter(t => t.type === 'depense')
      .forEach(transaction => {
        if (!categoryTotals[transaction.categorie]) {
          categoryTotals[transaction.categorie] = 0;
        }
        categoryTotals[transaction.categorie] += transaction.montant;
      });
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }
}

export default new DashboardController();