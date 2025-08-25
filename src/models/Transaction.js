export class Transaction {
  constructor(id, date, amount, category, description, type = 'expense') {
    this.id = id || Date.now().toString();
    this.date = date || new Date().toISOString();
    this.amount = parseFloat(amount);
    this.category = category;
    this.description = description;
    this.type = type; // 'expense' ou 'income'
  }

  static fromJSON(json) {
    return new Transaction(
      json.id,
      json.date,
      json.amount,
      json.category,
      json.description,
      json.type
    );
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date,
      amount: this.amount,
      category: this.category,
      description: this.description,
      type: this.type
    };
  }
}