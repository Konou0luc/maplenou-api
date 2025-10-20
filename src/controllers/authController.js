import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Utilisateur from "../models/utilisateur.js";

// inscription 
export const register = async (req, res) => {
    try {
        const { nom, prenom, email, mot_de_passe, telephone, photo_profil, role, institut, parcours } = req.body;

        // Vérif email unique
        const exist = await Utilisateur.findOne({ email });
        if (exist) return res.status(400).json({ message: "Email déjà utilisé." });

        // Hash password
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        const user = new Utilisateur({
            nom,
            prenom,
            email,
            telephone,
            photo_profil,
            mot_de_passe_hash: hashedPassword,
            role: role || 'client',
            institut: institut || null,
            parcours: parcours || null,
        });

        await user.save();

        res.status(201).json({ message: "Utilisateur créé avec succès ", user });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

//  Connexion
export const login = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        const user = await Utilisateur.findOne({ email });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe_hash);
        if (!validPassword) return res.status(400).json({ message: "Mot de passe incorrect" });

        // Générer Token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Connexion réussie ", token, user });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

//  Profil utilisateur (protégé)
export const getProfile = async (req, res) => {
    try {
        const user = await Utilisateur.findById(req.user.id).select("-mot_de_passe_hash");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
