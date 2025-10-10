import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createAvis, listAvisProduit } from "../controllers/avisController.js";

const router = express.Router();

router.post("/", authMiddleware, createAvis);
router.get("/produit/:id", listAvisProduit);

export default router;


