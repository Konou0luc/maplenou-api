import ProgressionBadge from "../models/progressionBadge.js";

const seuils = [0, 30, 60, 90, 120];

export const appliquerProgressionApresCommande = async (utilisateurId, dateCommande) => {
    const today = new Date(dateCommande);
    let p = await ProgressionBadge.findOne({ utilisateur_id: utilisateurId });
    if (!p) {
        p = await ProgressionBadge.create({ utilisateur_id: utilisateurId, serie_actuelle: 1, date_derniere_commande: today, niveau_badge_max: 0 });
    } else {
        if (p.date_derniere_commande) {
            const prev = new Date(p.date_derniere_commande);
            const diffJ = Math.floor((today - new Date(prev.setHours(0,0,0,0))) / 86400000);
            if (diffJ === 1) {
                p.serie_actuelle += 1;
            } else if (diffJ >= 2) {
                // Régression au dernier badge acquis
                const n = p.niveau_badge_max;
                p.serie_actuelle = seuils[n];
            }
        } else {
            p.serie_actuelle = 1;
        }
        p.date_derniere_commande = today;
    }

    // Mise à jour badge max et dates
    if (p.serie_actuelle >= 120 && p.niveau_badge_max < 4) { p.niveau_badge_max = 4; p.date_badge_4 = p.date_badge_4 || today; p.eligible_loterie = true; }
    else if (p.serie_actuelle >= 90 && p.niveau_badge_max < 3) { p.niveau_badge_max = 3; p.date_badge_3 = p.date_badge_3 || today; }
    else if (p.serie_actuelle >= 60 && p.niveau_badge_max < 2) { p.niveau_badge_max = 2; p.date_badge_2 = p.date_badge_2 || today; }
    else if (p.serie_actuelle >= 30 && p.niveau_badge_max < 1) { p.niveau_badge_max = 1; p.date_badge_1 = p.date_badge_1 || today; }

    await p.save();
    return p;
};


