import { Transaction } from '../models/Transaction';
import StorageService from '../services/StorageService';
import ApiService from '../services/ApiService';

class TransactionController {
  async getTransactions() {
    try {
      // Récupère d'abord les transactions locales
      let transactions = await StorageService.getTransactions();
      
      // Si pas de transactions locales, récupère les données initiales de l'API mock
      if (transactions.length === 0) {
        const initialTransactions = await ApiService.getInitialTransactions();
        transactions = initialTransactions.map(t => Transaction.fromJSON(t));
        await StorageService.saveTransactions(transactions.map(t => t.toJSON()));
      } else {
        transactions = transactions.map(t => Transaction.fromJSON(t));
      }
      
      return transactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  async addTransaction(transactionData) {
    try {
      const transaction = new Transaction(
        null,
        transactionData.date,
        transactionData.montant,
        transactionData.categorie,
        transactionData.description,
        transactionData.type
      );

      await StorageService.addTransaction(transaction.toJSON());
      return { success: true, transaction };
    } catch (error) {
      console.error('Error adding transaction:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteTransaction(transactionId) {
    try {
      await StorageService.removeTransaction(transactionId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return { success: false, error: error.message };
    }
  }

  filterTransactions(transactions, filters) {
    let filtered = [...transactions];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm) ||
        t.categorie.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.category && filters.category !== 'Toutes') {
      filtered = filtered.filter(t => t.categorie === filters.category);
    }

    if (filters.type && filters.type !== 'Tous') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateTo));
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getTransactionsByCategory(transactions) {
    const categoryTotals = {};
    
    transactions
      .filter(t => t.type === 'depense')
      .forEach(transaction => {
        if (!categoryTotals[transaction.categorie]) {
          categoryTotals[transaction.categorie] = 0;
        }
        categoryTotals[transaction.categorie] += transaction.montant;
      });

    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total
    }));
  }
}

export default new TransactionController();