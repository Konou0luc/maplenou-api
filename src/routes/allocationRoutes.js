import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import { allouerStock, getAllocationsVendeur } from "../controllers/allocationController.js";

const router = express.Router();

router.post("/", authMiddleware, requireRole("admin"), allouerStock);
router.get("/vendeur", authMiddleware, requireRole("vendeur", "admin"), getAllocationsVendeur);

export default router;


