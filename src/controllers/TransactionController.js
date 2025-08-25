import {
  Transaction
} from '../models/Transaction';
import {
  User
} from '../models/User';
import StorageService from '../services/StorageService';
import ApiService from '../services/ApiService';

class TransactionController {
  constructor() {
    this.user = null;
  }

  async loadUserTransactions() {
    try {
      let transactions = await StorageService.getTransactions();

      if (transactions.length === 0) {
        const initialTransactions = await ApiService.getInitialTransactions();
        transactions = initialTransactions.map((t) => Transaction.fromJSON(t));
        await StorageService.saveTransactions(transactions.map((t) => t.toJSON()));
      }

      this.user = new User(1, 'John Doe', 'john.doe@example.com', transactions);
      return this.user;
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return new User(1, 'John Doe', 'john.doe@example.com');
    }
  }

  get transactions() {
    return this.user ? this.user.transactionsHistory : [];
  }

  async addTransaction(transactionData) {
    try {
      const transaction = new Transaction(
        null,
        transactionData.date,
        transactionData.amount,
        transactionData.category,
        transactionData.description,
        transactionData.type
      );
      this.user.addTransaction(transaction);
      await StorageService.saveTransactions(this.user.transactionsHistory.map(t => t.toJSON()));
      return {
        success: true,
        transaction
      };
    } catch (error) {
      console.error('Error adding transaction:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteTransaction(transactionId) {
    try {
      this.user.removeTransaction(transactionId);
      await StorageService.saveTransactions(this.user.transactionsHistory.map(t => t.toJSON()));
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  filterTransactions(filters) {
    let filtered = [...this.transactions];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
        t.description.toLowerCase().includes(searchTerm) ||
        t.category.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    if (filters.type && filters.type !== 'All') {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        (t) => new Date(t.date) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (t) => new Date(t.date) <= new Date(filters.dateTo)
      );
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getTransactionsByCategory() {
    const categoryTotals = {};

    this.transactions
      .filter((t) => t.type === 'expense')
      .forEach((transaction) => {
        if (!categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += transaction.amount;
      });

    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total
    }));
  }
}

export default new TransactionController();