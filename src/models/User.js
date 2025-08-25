export class User {
  constructor(id, nom, email, soldeActuel = 0, historiqueTransactions = []) {
    this.id = id;
    this.nom = nom;
    this.email = email;
    this.soldeActuel = soldeActuel;
    this.historiqueTransactions = historiqueTransactions;
  }

  static fromJSON(json) {
    return new User(
      json.id,
      json.nom,
      json.email,
      json.soldeActuel,
      json.historiqueTransactions
    );
  }

  toJSON() {
    return {
      id: this.id,
      nom: this.nom,
      email: this.email,
      soldeActuel: this.soldeActuel,
      historiqueTransactions: this.historiqueTransactions
    };
  }

  calculerSolde(transactions) {
    return transactions.reduce((solde, transaction) => {
      return transaction.type === 'recette' 
        ? solde + transaction.montant 
        : solde - transaction.montant;
    }, 0);
  }
}