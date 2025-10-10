import { validationResult } from "express-validator";
import Produit from "../models/produit.js";
import Vendeur from "../models/vendeur.js";

const resolveVendeurIdPourUtilisateur = async (user) => {
    // Admin peut créer pour un vendeur donné (via body.vendeur_id)
    if (user.role === "admin") return null; // on gère plus bas
    const vendeur = await Vendeur.findOne({ utilisateur_id: user.id }).select("_id");
    if (!vendeur) throw new Error("Profil vendeur introuvable, crée-le d'abord.");
    return vendeur._id;
};

// POST /api/produits
export const createProduit = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { nom, description, prix, image, categorie, disponible, vendeur_id } = req.body;

        // Déterminer le vendeur
        let vendeurId;
        if (req.user.role === "admin") {
            if (!vendeur_id) return res.status(400).json({ message: "vendeur_id est requis pour un admin." });
            vendeurId = vendeur_id;
        } else {
            vendeurId = await resolveVendeurIdPourUtilisateur(req.user);
        }

        const produit = await Produit.create({
            vendeur_id: vendeurId,
            nom, description, prix, image, categorie, disponible
        });

        res.status(201).json({ message: "Produit créé", produit });
    } catch (err) {
        res.status(500).json({ message: err.message || "Erreur serveur" });
    }
};

// GET /api/produits
export const getProduits = async (req, res) => {
    try {
        const { categorie, vendeur, q, page = 1, limit = 10 } = req.query;
        const filtre = {};
        if (categorie) filtre.categorie = categorie;
        if (vendeur) filtre.vendeur_id = vendeur;
        if (q) filtre.$or = [
            { nom: new RegExp(q, "i") },
            { description: new RegExp(q, "i") }
        ];

        const skip = (Number(page) - 1) * Number(limit);

        const [items, total] = await Promise.all([
            Produit.find(filtre).populate({ path: "vendeur_id", select: "nom_restaurant" })
                .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            Produit.countDocuments(filtre)
        ]);

        res.json({
            items,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
        });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// GET /api/produits/:id
export const getProduitById = async (req, res) => {
    try {
        const produit = await Produit.findById(req.params.id)
            .populate({ path: "vendeur_id", select: "nom_restaurant" });
        if (!produit) return res.status(404).json({ message: "Produit introuvable" });
        res.json(produit);
    } catch {
        res.status(400).json({ message: "ID invalide" });
    }
};

// PUT /api/produits/:id
export const updateProduit = async (req, res) => {
    try {
        const produit = await Produit.findById(req.params.id);
        if (!produit) return res.status(404).json({ message: "Produit introuvable" });

        // Contrôle ownership: vendeur propriétaire ou admin
        if (req.user.role !== "admin") {
            const myVendeurId = await resolveVendeurIdPourUtilisateur(req.user);
            if (String(produit.vendeur_id) !== String(myVendeurId)) {
                return res.status(403).json({ message: "Tu ne peux modifier que tes produits." });
            }
        }

        const champsAutorisés = ["nom", "description", "prix", "image", "categorie", "disponible"];
        champsAutorisés.forEach((c) => {
            if (c in req.body) produit[c] = req.body[c];
        });

        await produit.save();
        res.json({ message: "Produit mis à jour", produit });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// DELETE /api/produits/:id
export const deleteProduit = async (req, res) => {
    try {
        const produit = await Produit.findById(req.params.id);
        if (!produit) return res.status(404).json({ message: "Produit introuvable" });

        if (req.user.role !== "admin") {
            const myVendeurId = await resolveVendeurIdPourUtilisateur(req.user);
            if (String(produit.vendeur_id) !== String(myVendeurId)) {
                return res.status(403).json({ message: "Tu ne peux supprimer que tes produits." });
            }
        }

        await produit.deleteOne();
        res.json({ message: "Produit supprimé " });
    } catch {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
