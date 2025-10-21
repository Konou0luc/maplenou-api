import mongoose from "mongoose";

let retriesLeft = 5;

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.warn("MONGO_URI manquant dans .env - Mode développement sans DB");
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connecté");
    } catch (error) {
        console.warn("Erreur MongoDB:", error.message, "- Mode développement sans DB");
        // Ne pas arrêter le serveur en cas d'erreur MongoDB
    }
};

mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB déconnecté");
});

mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err?.message || err);
});

export default connectDB;
