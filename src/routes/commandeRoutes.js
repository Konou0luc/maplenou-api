import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import { createCommande, getMesCommandes, getMesCommandesVendeur, approveCommande, markLivree } from "../controllers/commandeController.js";

const router = express.Router();

// Client
router.post("/", authMiddleware, requireRole("etudiant", "client", "vendeur", "admin"), createCommande);
router.get("/me", authMiddleware, getMesCommandes);

// Vendeur
router.get("/vendeur", authMiddleware, requireRole("vendeur", "admin"), getMesCommandesVendeur);
router.patch(":id/approve", authMiddleware, requireRole("vendeur", "admin"), approveCommande);
router.patch(":id/livrer", authMiddleware, requireRole("vendeur", "admin"), markLivree);

export default router;


