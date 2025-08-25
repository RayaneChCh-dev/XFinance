import axios from 'axios';

const mockTransactions = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000).toISOString(),
    amount: 50.00,
    category: 'Alimentation',
    description: 'Courses Carrefour',
    type: 'expense'
  },
  {
    id: '2',
    date: new Date(Date.now() - 172800000).toISOString(),
    amount: 2500.00,
    category: 'Salaire',
    description: 'Salaire mensuel',
    type: 'income'
  },
  {
    id: '3',
    date: new Date(Date.now() - 259200000).toISOString(),
    amount: 30.00,
    category: 'Transport',
    description: 'Essence',
    type: 'expense'
  },
  {
    id: '4',
    date: new Date(Date.now() - 345600000).toISOString(),
    amount: 15.99,
    category: 'Divertissement',
    description: 'Netflix',
    type: 'expense'
  },
  {
    id: '5',
    date: new Date(Date.now() - 432000000).toISOString(),
    amount: 100.00,
    category: 'Shopping',
    description: 'Vêtements',
    type: 'expense'
  }
];

class ApiService {
  constructor() {
    this.baseURL = 'https://api.mockserver.com'; // Mock URL
  }

  // Simule un appel API pour récupérer les transactions initiales
  async getInitialTransactions() {
    // En production, ceci ferait un vrai appel API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTransactions);
      }, 1000);
    });
  }

  // Mock d'autres appels API si nécessaire
  async syncTransactions(transactions) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
}

export default new ApiService();