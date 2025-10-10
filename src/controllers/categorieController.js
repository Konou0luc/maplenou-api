import Categorie from "../models/categorie.js";

export const listCategories = async (req, res) => {
    try {
        const items = await Categorie.find({ statut: "actif" }).sort({ tri_ordre: 1, createdAt: -1 });
        res.json(items);
    } catch {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const createCategorie = async (req, res) => {
    try {
        const { nom, description, tri_ordre, statut } = req.body;
        const c = await Categorie.create({ nom, description, tri_ordre, statut });
        res.status(201).json({ message: "Catégorie créée", categorie: c });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateCategorie = async (req, res) => {
    try {
        const c = await Categorie.findById(req.params.id);
        if (!c) return res.status(404).json({ message: "Catégorie introuvable" });
        ["nom", "description", "tri_ordre", "statut"].forEach((k) => {
            if (k in req.body) c[k] = req.body[k];
        });
        await c.save();
        res.json({ message: "Catégorie mise à jour", categorie: c });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteCategorie = async (req, res) => {
    try {
        await Categorie.findByIdAndDelete(req.params.id);
        res.json({ message: "Catégorie supprimée" });
    } catch {
        res.status(400).json({ message: "ID invalide" });
    }
};


