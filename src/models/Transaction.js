export class Transaction {
  constructor(id, date, montant, categorie, description, type = 'depense') {
    this.id = id || Date.now().toString();
    this.date = date || new Date().toISOString();
    this.montant = parseFloat(montant);
    this.categorie = categorie;
    this.description = description;
    this.type = type; // 'depense' ou 'recette'
  }

  static fromJSON(json) {
    return new Transaction(
      json.id,
      json.date,
      json.montant,
      json.categorie,
      json.description,
      json.type
    );
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date,
      montant: this.montant,
      categorie: this.categorie,
      description: this.description,
      type: this.type
    };
  }
}