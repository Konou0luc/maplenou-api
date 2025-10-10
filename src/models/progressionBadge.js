import mongoose from "mongoose";

const progSchema = new mongoose.Schema({
    utilisateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", unique: true, required: true },
    serie_actuelle: { type: Number, default: 0 },
    niveau_badge_max: { type: Number, default: 0 }, // 0..4
    date_derniere_commande: { type: Date },
    date_badge_1: { type: Date },
    date_badge_2: { type: Date },
    date_badge_3: { type: Date },
    date_badge_4: { type: Date },
    eligible_loterie: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("ProgressionBadge", progSchema);


