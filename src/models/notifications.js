import mongoose from "mongoose";

const notificationsSchema = new mongoose.Schema({
    utilisateur_id: {type: mongoose.Schema.Types.ObjectId, ref : "Utilisateur", required: true, unique: true},
    titre: {type: String, required: true},
    message: {type: String, required: true},
    type: {
        type: String,
        enum: ["commande", "livreur", "info", "promo"],
        required: true
    },
    date_creation: {type: Date, default: Date.now},
    lu: {type: Boolean}
})

export default mongoose.model("Notification", notificationsSchema);