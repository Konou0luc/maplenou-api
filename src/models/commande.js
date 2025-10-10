import mongoose from "mongoose";

const commandeSchema = new mongoose.Schema({
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    vendeur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendeur", required: true },
    livreur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur" },
    produits: [{
        produit_id: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
        quantite: { type: Number, required: true, min: 1 },
        prix_unitaire: { type: Number, required: true, min: 0 }
    }],
    statut: {
        type: String,
        enum: ["en_attente", "approuve", "rejete", "en_livraison", "livre"],
        default: "en_attente",
        index: true
    },
    moyen_paiement: {
        type: String,
        enum: ["flooz", "yass", "cash"],
        required: true,
    },
    txn_id: { type: String },
    montant_total: { type: Number, required: true, min: 0 },
    adresse_livraison: { type: String, required: true },
    date_commande: { type: Date, default: Date.now },
    date_livraison: { type: Date }
}, { timestamps: true });

export default mongoose.model("Commande", commandeSchema);