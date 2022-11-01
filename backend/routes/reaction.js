// import d'express
const express = require('express');

// création d'un router avec la méthode Router() fournie par express
const Router = express.Router();

// Import du controller post.js (logique métier)
const reactionCtler = require('../controllers/reaction');

// Middleware d'authentification 
const auth = require('../middlewares/authentification');

// Middleware gérant fichiers venant du front
const multer = require('../middlewares/multer');


// ENDPOINTS

// Route pour afficher tous les likes
Router.get('/likes', auth, reactionCtler.getAllLikes);


// Route pour afficher tous les dislikes
Router.get('/dislikes', auth, reactionCtler.getAllDislikes);


// Route créant un like sur un post dans la table likes
Router.post('/like', auth, multer, reactionCtler.likePost);


// Route créant un dislike sur un post dans la table dislikes
Router.post('/dislike', auth, multer, reactionCtler.dislikePost);


// Route modifiant un like
// Router.put('/:postID/like', auth, multer, reactionCtler.updateLikePost);


// Route modifiant un dislike
// Router.put('/:postID/dislike', auth, multer, reactionCtler.updateDislikePost);


// exportation vers app.js
module.exports = Router