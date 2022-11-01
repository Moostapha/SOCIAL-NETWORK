// import d'express
const express = require('express'); 

// création d'un router avec la méthode Router() fournie par express
const router = express.Router(); 

// Import du controller user.js (logique métier)
const userCtler = require('../controllers/user'); 

// Protection contre attaque brute force => Blocage après 2 tentatives erronées
const bouncer = require('express-bouncer')(500, 60000, 2) // a mettre sur route /login => sécurité

// import du middleware d'authentification
const auth = require('../middlewares/authentification');

// Middleware de validation des user's inputs avec rules des inputs du formulaire
const rules = require('../middlewares/validator');

// Middleware gérant fichiers venant du front
const multer = require('../middlewares/multer');

// Middleware gérant fichiers venant du front
const multerAvatar = require('../middlewares/multerAvatar');



// ROUTES ENDPOINTS CRUD USER 

// route création compte user
router.post('/signup', bouncer.block, rules.userSignupInput(), rules.validate, userCtler.signup); 


// route connexion user => bouncer.block avant all others
router.post('/login', bouncer.block, rules.userLoginInput(), rules.validate, userCtler.login); 


// route pour voir all users  => component PostsComments.vue
router.get('/', auth, userCtler.getAllUsers); 


// route affichage profil user => component UserAccount.vue
router.get('/:userID', auth, userCtler.getUser); 


// route pour effacer un user + tous ses fichiers téléchargés du dossier backend/images => UserAccount.vue + Admin.vue
router.delete('/:userID/delete', auth, userCtler.deleteUserAndFile); 


// route pour update infos profil user  => UserAccount.vue
router.put('/:userID/updateInfo', auth,  multer, rules.userAccountInput(), rules.validate, userCtler.updateUser); 


// Route update avatar du profil
router.put('/:userID/updateAvatar', auth, multerAvatar, userCtler.updateUserAvatar); 


// Exportation vers app.js
module.exports = router;