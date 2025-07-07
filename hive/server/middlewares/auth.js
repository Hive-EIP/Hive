const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ error: 'Token manquant' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Injecte l’utilisateur décodé dans la requête
        next(); // Passe au contrôleur suivant
    } catch (err) {
        res.status(401).json({ error: 'Token invalide' });
    }
};
