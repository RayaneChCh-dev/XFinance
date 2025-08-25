import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@carrefour_finance_user',
  TRANSACTIONS: '@carrefour_finance_transactions'
};

class StorageService {
  // User methods
  async saveUser(user) {
    try {
      await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async getUser() {
    try {
      const user = await AsyncStorage.getItem(KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async removeUser() {
    try {
      await AsyncStorage.removeItem(KEYS.USER);
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  }

  // Transactions methods
  async saveTransactions(transactions) {
    try {
      await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
      throw error;
    }
  }

  async getTransactions() {
    try {
      const transactions = await AsyncStorage.getItem(KEYS.TRANSACTIONS);
      return transactions ? JSON.parse(transactions) : [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  async addTransaction(transaction) {
    try {
      const transactions = await this.getTransactions();
      transactions.push(transaction);
      await this.saveTransactions(transactions);
      return transactions;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async removeTransaction(transactionId) {
    try {
      const transactions = await this.getTransactions();
      const updatedTransactions = transactions.filter(t => t.id !== transactionId);
      await this.saveTransactions(updatedTransactions);
      return updatedTransactions;
    } catch (error) {
      console.error('Error removing transaction:', error);
      throw error;
    }
  }
}

export default new StorageService();