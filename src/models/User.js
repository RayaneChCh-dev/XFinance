import {
  Transaction
} from './Transaction';

export class User {
  constructor(id, name, email, transactionsHistory = []) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.transactionsHistory = transactionsHistory.map(t => Transaction.fromJSON(t));
  }

  static fromJSON(json) {
    return new User(
      json.id,
      json.name,
      json.email,
      json.transactionsHistory
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      transactionsHistory: this.transactionsHistory.map(t => t.toJSON())
    };
  }

  get balance() {
    return this.transactionsHistory.reduce((balance, transaction) => {
      return transaction.type === 'income' ?
        balance + transaction.amount :
        balance - transaction.amount;
    }, 0);
  }

  addTransaction(transaction) {
    this.transactionsHistory.push(transaction);
  }

  removeTransaction(transactionId) {
    this.transactionsHistory = this.transactionsHistory.filter(
      (t) => t.id !== transactionId
    );
  }
}