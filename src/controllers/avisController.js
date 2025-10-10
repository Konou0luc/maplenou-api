import Avis from "../models/avis.js";
import Commande from "../models/commande.js";

// POST /api/avis
export const createAvis = async (req, res) => {
    try {
        const { produit_id, commande_id, note, commentaire } = req.body;
        if (!produit_id || !commande_id || !note) {
            return res.status(400).json({ message: "Champs requis: produit_id, commande_id, note" });
        }

        const cmd = await Commande.findById(commande_id);
        if (!cmd || cmd.client_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Commande invalide" });
        }
        if (cmd.statut !== "livre" || !cmd.date_livraison) {
            return res.status(400).json({ message: "Avis possible 24h après livraison" });
        }
        const diffHrs = (Date.now() - new Date(cmd.date_livraison).getTime()) / 3600000;
        if (diffHrs < 24) return res.status(400).json({ message: "Attendre 24h après livraison" });

        const avis = await Avis.create({ produit_id, utilisateur_id: req.user.id, commande_id, note, commentaire });
        res.status(201).json({ message: "Avis soumis", avis });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET /api/avis/produit/:id
export const listAvisProduit = async (req, res) => {
    try {
        const list = await Avis.find({ produit_id: req.params.id, statut: { $ne: "rejete" } })
            .sort({ createdAt: -1 });
        res.json(list);
    } catch {
        res.status(400).json({ message: "ID invalide" });
    }
};


