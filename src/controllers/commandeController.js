import Commande from "../models/commande.js";
import Produit from "../models/produit.js";
import Vendeur from "../models/vendeur.js";
import { appliquerProgressionApresCommande } from "../services/badgesService.js";

// Helper: calcule le montant total à partir d'un seul produit (MVP: 1 produit / commande)
const computeMontant = (prixUnitaire, quantite) => Number((prixUnitaire * quantite).toFixed(2));

// POST /api/commandes
export const createCommande = async (req, res) => {
    try {
        const { produit_id, quantite = 1, moyen_paiement, adresse_livraison } = req.body;
        if (!produit_id || !moyen_paiement || !adresse_livraison) {
            return res.status(400).json({ message: "Champs requis: produit_id, moyen_paiement, adresse_livraison" });
        }

        const produit = await Produit.findById(produit_id).populate({ path: "vendeur_id", select: "_id" });
        if (!produit) return res.status(404).json({ message: "Produit introuvable" });

        // MVP: 1 item par commande
        const prix = produit.prix;
        const montant = computeMontant(prix, Number(quantite));

        const cmd = await Commande.create({
            client_id: req.user.id,
            vendeur_id: produit.vendeur_id._id || produit.vendeur_id,
            produits: [{ produit_id: produit._id, quantite: Number(quantite), prix_unitaire: prix }],
            moyen_paiement,
            adresse_livraison,
            montant_total: montant,
            statut: "en_attente"
        });

        res.status(201).json({ message: "Commande créée", commande: cmd });
    } catch (err) {
        res.status(500).json({ message: err.message || "Erreur serveur" });
    }
};

// GET /api/commandes/me
export const getMesCommandes = async (req, res) => {
    try {
        const list = await Commande.find({ client_id: req.user.id }).sort({ createdAt: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// GET /api/commandes/vendeur (vendeur: ses commandes)
export const getMesCommandesVendeur = async (req, res) => {
    try {
        const vendeur = await Vendeur.findOne({ utilisateur_id: req.user.id }).select("_id");
        if (!vendeur) return res.status(404).json({ message: "Profil vendeur introuvable" });
        const list = await Commande.find({ vendeur_id: vendeur._id }).sort({ createdAt: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// PATCH /api/commandes/:id/approve
export const approveCommande = async (req, res) => {
    try {
        const vendeur = await Vendeur.findOne({ utilisateur_id: req.user.id }).select("_id");
        if (!vendeur) return res.status(404).json({ message: "Profil vendeur introuvable" });

        const cmd = await Commande.findById(req.params.id);
        if (!cmd) return res.status(404).json({ message: "Commande introuvable" });
        if (String(cmd.vendeur_id) !== String(vendeur._id)) {
            return res.status(403).json({ message: "Non autorisé" });
        }
        if (cmd.statut !== "en_attente") return res.status(400).json({ message: "Statut invalide" });

        cmd.statut = "approuve";
        await cmd.save();
        res.json({ message: "Commande approuvée", commande: cmd });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// PATCH /api/commandes/:id/livrer
export const markLivree = async (req, res) => {
    try {
        const vendeur = await Vendeur.findOne({ utilisateur_id: req.user.id }).select("_id");
        if (!vendeur) return res.status(404).json({ message: "Profil vendeur introuvable" });

        const cmd = await Commande.findById(req.params.id);
        if (!cmd) return res.status(404).json({ message: "Commande introuvable" });
        if (String(cmd.vendeur_id) !== String(vendeur._id)) {
            return res.status(403).json({ message: "Non autorisé" });
        }
        if (!["approuve", "en_livraison"].includes(cmd.statut)) {
            return res.status(400).json({ message: "Statut invalide" });
        }

        cmd.statut = "livre";
        cmd.date_livraison = new Date();
        await cmd.save();

        // Progression badges (globale)
        await appliquerProgressionApresCommande(cmd.client_id, cmd.date_livraison);
        res.json({ message: "Commande livrée", commande: cmd });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};


