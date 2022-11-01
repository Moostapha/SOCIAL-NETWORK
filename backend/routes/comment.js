// import d'express
const express = require('express');

// création d'un router avec la méthode Router() fournie par express
const Router = express.Router();

// Import du controller comment.js (logique métier)
const commentCtler = require('../controllers/comment');

// import du middleware d'authentification
const auth = require('../middlewares/authentification');

// Middleware de validation des user's inputs => Règles de saisies validator sur champs commentaire
const rules= require('../middlewares/validator');

// Middleware gérant fichiers venant du front
const multer = require('../middlewares/multer');



// ROUTES COMMENT ENDPOINTS CRUD Pour 'commment', un user doit pouvoir créer | modifier (update) | supprimer son commentaire

// Route pour lire tous les commentaires sur les publications
Router.get('/readAll', auth, commentCtler.readComment);


// Route pour édition d'un commentaire sur une publication
Router.post('/create', auth, multer, rules.validFormComment(), rules.validate, commentCtler.createComment);


// Route pour supprimer un commentaire (par son auteur + admin)
Router.delete('/:commentID/delete', auth, multer, commentCtler.deleteComment);


// Route de modification d'un commentaire (par son auteur)
Router.put('/:commentID/update', auth, multer, rules.validFormComment(), rules.validate, commentCtler.updateComment);




// Exportation
module.exports = Router
