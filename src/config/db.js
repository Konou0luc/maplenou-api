import mongoose from "mongoose";

let retriesLeft = 5;

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("MONGO_URI manquant dans .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connecté");
    } catch (error) {
        console.error("Erreur MongoDB:", error.message);
        if (retriesLeft > 0) {
            const delayMs = 3000;
            console.log(`Nouvelle tentative de connexion dans ${delayMs / 1000}s (retries restants: ${retriesLeft})`);
            retriesLeft -= 1;
            setTimeout(connectDB, delayMs);
        } else {
            process.exit(1);
        }
    }
};

mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB déconnecté");
});

mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err?.message || err);
});

export default connectDB;
