import mongoose from "mongoose";

const produitSchema = new mongoose.Schema({
    vendeur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendeur", required: true }, // lien vendeur
    nom: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    prix: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    categorie: { type: String, index: true },
    disponible: { type: Boolean, default: true }
}, { timestamps: true });

produitSchema.index({ vendeur_id: 1, nom: 1 });

export default mongoose.model("Produit", produitSchema);
