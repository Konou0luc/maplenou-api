import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";
import { listCategories, createCategorie, updateCategorie, deleteCategorie } from "../controllers/categorieController.js";

const router = express.Router();

router.get("/", listCategories);
router.post("/", authMiddleware, requireRole("admin"), createCategorie);
router.put(":id", authMiddleware, requireRole("admin"), updateCategorie);
router.delete(":id", authMiddleware, requireRole("admin"), deleteCategorie);

export default router;


