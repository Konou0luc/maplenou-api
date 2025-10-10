import mongoose from "mongoose";

const vendeurSchema = new mongoose.Schema({
    utilisateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true, unique: true },
    nom_restaurant: { type: String, required: true },
    description: { type: String, default: "" },
    adresse: { type: String, default: "" },
    horaires_ouverture: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Vendeur", vendeurSchema);
