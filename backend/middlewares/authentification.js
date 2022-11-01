const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
    const token = req.headers.authorization.split(' ')[1];  // extraction du token du header requête
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');  // Décodage du token, si invalide => erreur
    const userId = decodedToken.userID;  // extraction userID du token, si invalide => erreur
    if (req.body.userID && req.body.userID !== userId) { // comparaison userId requête avec celui du token
      throw 'Invalid user ID';  // si no match => erreur
    } else { //sinon user identifié on passe au next middleware
        next();
    }
    } catch {
    res.status(401).json({
        error: new Error('Invalid request!')
    });
    }
};