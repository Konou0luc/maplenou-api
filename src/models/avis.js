import mongoose from "mongoose";

const avisSchema = new mongoose.Schema({
    produit_id: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
    utilisateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    commande_id: { type: mongoose.Schema.Types.ObjectId, ref: "Commande", required: true },
    note: { type: Number, required: true, min: 1, max: 5 },
    commentaire: { type: String, default: "" },
    statut: { type: String, enum: ["en_attente", "approuve", "rejete"], default: "en_attente" }
}, { timestamps: true });

avisSchema.index({ produit_id: 1, utilisateur_id: 1, commande_id: 1 }, { unique: true });

export default mongoose.model("Avis", avisSchema);


