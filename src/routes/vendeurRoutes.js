import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createOrUpdateMyVendeur, getMyVendeur } from "../controllers/vendeur.js";

const router = express.Router();

router.post("/me", authMiddleware, createOrUpdateMyVendeur); // créer ou mettre à jour
router.get("/me", authMiddleware, getMyVendeur);            // consulter

export default router;
