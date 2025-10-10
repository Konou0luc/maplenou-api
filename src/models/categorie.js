import mongoose from "mongoose";

const categorieSchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    tri_ordre: { type: Number, default: 0 },
    statut: { type: String, enum: ["actif", "inactif"], default: "actif" }
}, { timestamps: true });

categorieSchema.index({ statut: 1, tri_ordre: 1 });

export default mongoose.model("Categorie", categorieSchema);


