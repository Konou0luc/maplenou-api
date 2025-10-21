import Vendeur from "../models/vendeur.js";

// Créer ou mettre à jour le profil vendeur de l'utilisateur connecté
export const createOrUpdateMyVendeur = async (req, res) => {
    try {
        // Vérifier que l'utilisateur est bien un vendeur
        if (req.user.role !== "vendeur") {
            return res.status(403).json({ message: "Accès interdit. Seuls les vendeurs peuvent créer un profil vendeur." });
        }

        const { 
            nom_restaurant, 
            description, 
            adresse, 
            horaires_ouverture, 
            telephone, 
            email_contact 
        } = req.body;

        let vendeur = await Vendeur.findOne({ utilisateur_id: req.user.id });

        if (vendeur) {
            // Mise à jour
            vendeur.nom_restaurant = nom_restaurant || vendeur.nom_restaurant;
            vendeur.description = description || vendeur.description;
            vendeur.adresse = adresse || vendeur.adresse;
            vendeur.horaires_ouverture = horaires_ouverture || vendeur.horaires_ouverture;
            vendeur.telephone = telephone || vendeur.telephone;
            vendeur.email_contact = email_contact || vendeur.email_contact;
            await vendeur.save();

            return res.json({ message: "Profil vendeur mis à jour ✅", vendeur });
        }

        // Création
        vendeur = new Vendeur({
            utilisateur_id: req.user.id,
            nom_restaurant,
            description,
            adresse,
            horaires_ouverture,
            telephone,
            email_contact
        });

        await vendeur.save();
        res.status(201).json({ message: "Profil vendeur créé ✅", vendeur });
    } catch (err) {
        res.status(500).json({ message: err.message || "Erreur serveur" });
    }
};

// Récupérer mon profil vendeur
export const getMyVendeur = async (req, res) => {
    try {
        if (req.user.role !== "vendeur") {
            return res.status(403).json({ message: "Accès interdit." });
        }

        const vendeur = await Vendeur.findOne({ utilisateur_id: req.user.id });
        if (!vendeur) return res.status(404).json({ message: "Profil vendeur introuvable." });

        res.json(vendeur);
    } catch (err) {
        res.status(500).json({ message: err.message || "Erreur serveur" });
    }
};
