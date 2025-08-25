export const CATEGORIES = [
  'Alimentation',
  'Transport',
  'Divertissement',
  'Shopping',
  'Santé',
  'Logement',
  'Éducation',
  'Salaire',
  'Autre'
];

export const TRANSACTION_TYPES = {
  expense: 'expense',
  income: 'income'
};

export const COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  DANGER: '#ef4444',
  WARNING: '#f59e0b',
  GRAY: '#6b7280'
};

export const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    return "0 €";
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const calculateTotal = (transactions, type) => {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
};