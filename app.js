import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import produitRoutes from "./src/routes/produitRoutes.js";
import vendeurRoutes from "./src/routes/vendeurRoutes.js";
import commandeRoutes from "./src/routes/commandeRoutes.js";
import categorieRoutes from "./src/routes/categorieRoutes.js";
import avisRoutes from "./src/routes/avisRoutes.js";
import allocationRoutes from "./src/routes/allocationRoutes.js";

// Configuration temporaire pour le développement local
// import './config-temp.js'; // Supprimé

dotenv.config();
connectDB();

const app = express();

// Middlewares globaux
app.use(express.json());
app.use(cors());
app.use(helmet());

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'API MapLeNou fonctionne!', timestamp: new Date().toISOString() });
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'API test endpoint fonctionne!', status: 'OK' });
});

// Rate limiter (sécurité login)
app.use("/api/auth/login", rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: "Trop de tentatives, réessaie plus tard."
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/produits", produitRoutes);
app.use("/api/vendeurs", vendeurRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/categories", categorieRoutes);
app.use("/api/avis", avisRoutes);
app.use("/api/allocations", allocationRoutes);


// Lancement serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Serveur lancé sur le port ${PORT}`));

// Export pour Vercel
export default app;
