const history = require('connect-history-api-fallback');
// PARTIE IMPORT DE app.js package express
const express = require('express'); 
// utilisation d'express
const app = express(); 
// Middleware permettant la navigation sur les SPA pour reload les routes et leurs datas
app.use(history());
// package contre injections xss
const xss = require('xss-clean'); 
// package protection headers
const helmet = require('helmet');
// package cors
const cors = require('cors');
// package file system gestion fichier image (multer)
const path = require('path');
// Morgan pour développement
const morgan = require('morgan');
//

// Import des routes USER | POST | COMMENT | REACTIONS | ADMIN
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const reactionRoutes = require('./routes/reaction');
const adminRoutes = require('./routes/administrateur');

// PARTIE MIDDLEWARES de app.js

// Middleware de sécurite des headers
app.use(helmet());


// Middleware général pouvant gérer l'erreur CORS ou cross origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// Middleware Node.js de connection pour sécuriser les users inputs venant de POST, GET et des URL PARAMS
app.use(xss()); 


// Middleware pour bodyparser qui transforme le corps de la requête en objet JS utilisable
// avec version 4.16 d'express, bodyParser devient express
app.use(express.json()); 


// encodage URL infos venant du front au format JSON
// avec version 4.16 d'express, bodyParser devient express
app.use(express.urlencoded({ extended: true })); // Rend le corps de la requête exploitabe facilement


// Middleware permettant de recevoir http de localhost 8080 frontend
app.use(cors());

// Middleware morgan
app.use(morgan(':method - :url - :status - :res[content]- :response-time ms'));


// Gestionnaire des images avatar et publications
app.use('/images', express.static(path.join(__dirname, 'images'))); // gestion des fichiers img statique uploads


//PARTIE DES ROUTES DE app.js => USER POST ET COMMENT
app.use('/api/users', userRoutes); // Route user
app.use('/api/posts', postRoutes);  // Route post
app.use('/api/comments', commentRoutes);  // Route commentaire
app.use('/api/reactions', reactionRoutes) // Route reaction
app.use('/api/admin', adminRoutes) // Route administrateur
// export vers le server.js
module.exports= app;
