import express from "express";
import { body } from "express-validator";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import {
    createProduit, getProduits, getProduitById, updateProduit, deleteProduit
} from "../controllers/produitController.js";

const router = express.Router();

// Validation création / mise à jour
const createValidation = [
    body("nom").isString().isLength({ min: 2 }).withMessage("nom requis (min 2 caractères)"),
    body("prix").isFloat({ gt: 0 }).withMessage("prix > 0 requis"),
    body("description").optional().isString(),
    body("image").optional().isString(),
    body("categorie").optional().isString(),
    body("disponible").optional().isBoolean(),
    body("vendeur_id").optional().isMongoId() // Utilisé par un admin
];

const updateValidation = [
    body("nom").optional().isString().isLength({ min: 2 }),
    body("prix").optional().isFloat({ gt: 0 }),
    body("description").optional().isString(),
    body("image").optional().isString(),
    body("categorie").optional().isString(),
    body("disponible").optional().isBoolean()
];

// Public: listing & détail
router.get("/", getProduits);
router.get("/:id", getProduitById);

// Protégé: CRUD
router.post("/", authMiddleware, requireRole("vendeur", "admin"), createValidation, createProduit);
router.put("/:id", authMiddleware, requireRole("vendeur", "admin"), updateValidation, updateProduit);
router.delete("/:id", authMiddleware, requireRole("vendeur", "admin"), deleteProduit);

export default router;
