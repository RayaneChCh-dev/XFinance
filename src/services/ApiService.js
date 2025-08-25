import axios from 'axios';

const mockTransactions = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000).toISOString(),
    montant: 50.00,
    categorie: 'Alimentation',
    description: 'Courses Carrefour',
    type: 'depense'
  },
  {
    id: '2',
    date: new Date(Date.now() - 172800000).toISOString(),
    montant: 2500.00,
    categorie: 'Salaire',
    description: 'Salaire mensuel',
    type: 'recette'
  },
  {
    id: '3',
    date: new Date(Date.now() - 259200000).toISOString(),
    montant: 30.00,
    categorie: 'Transport',
    description: 'Essence',
    type: 'depense'
  },
  {
    id: '4',
    date: new Date(Date.now() - 345600000).toISOString(),
    montant: 15.99,
    categorie: 'Divertissement',
    description: 'Netflix',
    type: 'depense'
  },
  {
    id: '5',
    date: new Date(Date.now() - 432000000).toISOString(),
    montant: 100.00,
    categorie: 'Shopping',
    description: 'Vêtements',
    type: 'depense'
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