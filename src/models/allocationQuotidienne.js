import mongoose from "mongoose";

const allocSchema = new mongoose.Schema({
    vendeur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendeur", required: true },
    produit_id: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
    date_allocation: { type: Date, required: true },
    quantite_allouee: { type: Number, required: true, min: 0 },
    quantite_vendue: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

allocSchema.virtual("quantite_restante").get(function() {
    return Math.max(0, (this.quantite_allouee || 0) - (this.quantite_vendue || 0));
});

allocSchema.index({ vendeur_id: 1, produit_id: 1, date_allocation: 1 }, { unique: true });

export default mongoose.model("AllocationQuotidienne", allocSchema);


