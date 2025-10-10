import AllocationQuotidienne from "../models/allocationQuotidienne.js";

// POST /api/allocations (admin)
export const allouerStock = async (req, res) => {
    try {
        const { vendeur_id, produit_id, date_allocation, quantite_allouee } = req.body;
        if (!vendeur_id || !produit_id || !date_allocation || quantite_allouee == null) {
            return res.status(400).json({ message: "Champs requis: vendeur_id, produit_id, date_allocation, quantite_allouee" });
        }
        const a = await AllocationQuotidienne.findOneAndUpdate(
            { vendeur_id, produit_id, date_allocation: new Date(date_allocation) },
            { $set: { quantite_allouee } },
            { new: true, upsert: true }
        );
        res.status(201).json({ message: "Allocation enregistrée", allocation: a });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET /api/allocations/vendeur (vendeur)
export const getAllocationsVendeur = async (req, res) => {
    try {
        const { date } = req.query;
        const filtre = { vendeur_id: req.user.vendeur_id };
        if (date) filtre.date_allocation = new Date(date);
        const items = await AllocationQuotidienne.find(filtre).sort({ date_allocation: -1 });
        res.json(items);
    } catch {
        res.status(500).json({ message: "Erreur serveur" });
    }
};


