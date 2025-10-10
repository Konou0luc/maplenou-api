import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mot_de_passe_hash: { type: String, required: true },
    telephone: { type: String },
    photo_profil: { type: String },
    role: {
        type: String,
        enum: ["etudiant", "vendeur", "livreur", "admin"],
        default: "etudiant"
    },
    date_inscription: { type: Date, default: Date.now },
    etat_compte: { type: String, enum: ["actif", "inactif"], default: "actif" }
});

export default mongoose.model("Utilisateur", userSchema);
