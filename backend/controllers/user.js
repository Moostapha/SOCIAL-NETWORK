// Import du package de cryptage pour password
const bcrypt = require('bcrypt');
// Import du package de remise de TOKEN pour authentification
const jwt = require('jsonwebtoken');
// schema de donnees User de User/model
const User = require('../models/User'); 
// schéma de données Posts pour delete les fichiers images lors de la suppression du user
const Post = require('../models/Post');
// Import fonctionnalité de node.js pour fileSystem pour la fonction deleteUserAndFile
const fs = require('fs'); 

/* 
========================================================================================================================================================
API LOGIQUES METIERS CRUD LIE AU USER qui doit pouvoir :
1) créer un compte => signup avec mail et password sécurisés dans la bdMysql 
2) se connecter =>  login de manière authentique et sécurisée (bcrypt, jsonwebtoken)
3) Pouvoir avoir accés à son compte ,une fois ces étapes effectuées, Doit pouvoir le modifier => readMyAccount et UpdateMyAccount
4) Le supprimer => deleteMyAccount
5) Editer un post
6) Poster un commentaire sur son post ou celui des autres.
7) Liker/disliker des commentaires => Fonctions likePost et dislikePost
=======================================================================================================================================================
*/


// FONCTION SIGNUP CREATION COMPTE USER AVEC CRYPTAGE MOT DE PASSE

exports.signup = (req, res, next) => {
    // Validation des inputs formulaire signup
    
    // récupération infos envoyées par le front
    const newUser = req.body;
    console.log(" ----- Infos new user -----:  ", newUser); 
    // Cryptage | hash du password
    bcrypt.hash(newUser.password , 10) // cryptage de ce dernier
    .then (
        async(hash) => {
            const inscription = await User.signUp( newUser.username, newUser.email, hash ); // params fonction ici dans le meme ordre que params fonction du Model
            res.status(201).json({ 
                message:'Utilisateur créè avec succés' , 
                account: inscription 
            });
            // console.log(inscription);
        }
    )
    .catch( error => res.status(500).json({ message: error }) );
};


// Fonction de connexion sécurisée avec remise de tokens

exports.login = async(req, res, next) => {
    
    // Récupération password et email send avec requête depuis le front
    const password = req.body.password;
    console.log(" ----- Password venant du front -----=> :  ", password); 
    const email = req.body.email; 
    console.log(" ----- email venant du front -----=> :  ", email); 
    
    // Gestion erreur 1 => Cas ou une entrée manque => est ce nécessaire vu que cas traité via validator?
    if( password == null || email == null){
        return res.status(400).json({ error: "Il manque une entrée password ou email !!!" })
    };
    
    // email user dans la promise login/User.js => renverra les infos de la ligne ou email apparait dans la table users
    const result = await User.login(email); 
    
    // resultat de la promise affichée dans console toujours sur des var et des resultats attendus comme await
    console.log("----- résultat recherche email dans DB ----- => : ", result[0]); 
    
    // Gestion erreur 2 => cas où le résultat de la requête est vide
    if(result.length == 0) {
        return res.status(401).json({ error: "Utilisateur non trouvé !!!" })
    };
    
    // comparaison password entré avec password stocké dans db
    bcrypt.compare(password, result[0].password)  
    .then( valid => { 
        
        // Gestion erreur 3 => cas ou la comparaison est invalide
        if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !!!' }); 
        }
        
        // émission du token d'authentification du user
        const token = jwt.sign(
            {userID: result[0].userID},
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h'},
        );
        // Check du token 
        console.log('----- Token du user loggé ----- : ',token);
        
        // réponse renvoyée au front
        // succés et assignation du TOKEN + récupération du userId
        res.status(200).json({ 
            message: 'Authentification user réussie', 
            USER_AUTH_TOKEN: token, 
            userID: result[0].userID, 
            username: result[0].username,
            is_admin: result[0].is_admin,
        }) 
    })
    .catch(error => res.status(500).json({ error }));
};



//Fonction pour lire mon compte user

// commun a user + admin
exports.getUser = async(req, res, next) => {
    
    console.log('----- param de la requete axios.get ----- : ',req.params);
    const userById = req.params.userID;
    console.log('----- type de userID ----- : ', typeof userById);
    console.log("userId de la request: ", userById);
    // on reprend la fonction getOneUser du model
    const result = await User.getOneUser(userById); 
    console.log("----- résultat de la promise -----:  ", result[0]); 
    res.status(200).json(
        { 
            message:'user loggé et authentifié', 
            user: result[0]
        }
    );
};


// Fonction pour voir tous les users (admin et users)
exports.getAllUsers = async(req, res, next) => {
    const allUsers = await User.getUsers();
    res.status(200).json({ 
        message:'Liste des users statut 0 et statut 1', 
        users: allUsers 
    });
};


// Fonction modif de mon compte user => Choix laissé au user de changer leur username + password

// commun a user + admin
exports.updateUser = async(req, res, next) => {
    // Corps de la reqête venant du front
    // const updated = JSON.parse(JSON.stringify(req.body));
    const updated = req.body
    console.log(" ----- Update venant du front -----:  ", updated); 
    // Cas ou le user veut modifier soit son username soit son password
    if ( updated.email || updated.password ) {
        bcrypt.hash(updated.password, 10)
        .then(async(hash)=> {
            const updatedAccount = await User.updateUser( updated.email, hash, updated.userID)
            res.status(201).json({ 
                message:'Modifications réussies',
                updatedUser: updatedAccount,
                // updatedPassword: updatedAccount,
                // updatedUsername: updatedAccount
            })
            console.log('----- Résultat de la promise -----: ',updatedAccount)
        })
        .catch( error => res.status(500).json({ message: error }));
    }
};

// Fonction de modification de l'image avatar du profile
exports.updateUserAvatar = async(req,res,next) => {
    
    // try {
        
    // } catch (error) {
    //     //throw Error(error)
    // }
    
    // Récupération données envoyées par le front
    // const updatedData = JSON.parse(JSON.stringify(req.body));
    const updatedData = req.body;
    console.log('---- axios request -----: ', updatedData)
    // Fichier téléchargé
    const avatarFile = req.file;
    console.log('----- Avatar média modifié -----: ', avatarFile)
    
    // Gestion d'erreur cas ou aucun fichier n'est sélectionné pour chargement
    if (avatarFile === undefined) {
        throw "Veuillez sélectionner un fichier !!!"
    } 
    
    else {
        // Encodage URL image avatar dans dossier images/avatar
        const avatarURL = `${req.protocol}://${req.get('host')}/images/avatar/${req.file.filename}`;
        console.log('----- URL avatar fichier image -----: ', avatarURL);
        
        //Insert data dans ligne database users
        const newAvatar = await User.updateAvatar(
            avatarURL,
            updatedData.userID
        );
        console.log('----- Résultat de la promise -----: ', newAvatar);
        res.status(200).json({
            message:'Avatar de profil modifié avec succés',
            avatarUploaded: newAvatar
        })
    } 
};


// Fonction suppression de mon compte user commun a user + admin
// Fonction suppression avatar + fichiers user dans le dossier images du backend => fs unlink

exports.deleteUserAndFile = async(req, res, next) => {
    
    // userID à delete
    const userById  = req.params.userID;
    console.log("1) USERID A SUPPRIMER  ", userById);
    
    // Pour delete de son avatar...
    const userToDelete = await User.getOneUser(userById);
    console.log('2) INFOS USER A SUPPRIMER: ', userToDelete);
    
    // Url de l'avatar est donné par le 1er résultat retourné par getOneUser
    const urlAvatar = userToDelete[0].avatar;
    console.log('3) URL AVATAR USER: ', urlAvatar)
    
    // Pour delete de ses post dans fichier images/post => Use de la fonction getAllImage(id_user_auteur_post) de Post.js
    const urlImagePost = await Post.getAllImagePost(userById);
    for(let obj of urlImagePost) {
        console.log('4) URLS IMAGEPOST: ' , obj.imagePost);
    }
    
    // Test sur la longueur des tableaux => pour déterminer que faire selon tableau vide ou pas
    
    // Si user n'a aucun fichier dans le dossier image (il n'a rien téléchargé)
    if (urlAvatar.length === 0 && urlImagePost.length === 0) {
        //do something
        // Consommation de la promise deleteUser dans un param x
        const deletedAccount = await User.deleteUser(userById);
        res.status(200).json({ 
            message:'Utilisateur supprimé avec succés', 
            userDeleted : deletedAccount
        });
    }
    // Si user a des fichiers dans le dossier image (il a téléchargé un avatar et des imagePost)
    else if (urlAvatar.length !== 0 && urlImagePost.length !== 0) {
        
        // 1) Delete du fichier avatar s'il existe unlink avatar => images/avatar
        
        // Décomposition de l'URL en 2 parties avec split() => 1ere en amont de 'images/avatar' et 2e en aval => Nom du fichier [1] 
        const filenameAvatar = urlAvatar.split('images/avatar')[1];
        console.log('5) NOM DU FICHIER AVATAR A SUPPRIMER: ', filenameAvatar);
        // Application de unlink => 2 params (chaine de caractère chemin fichier en dynamique + fonction) 
        fs.unlink(`images/avatar/${filenameAvatar}`, function(error){
            if(error) throw error;
            console.log('fichier avatar du user supprimé du dossier images/avatar !!!')
        });
        
        // 2) Delete  fichiers posts s'ils existent unlink post => images/post
        
        // Boucle sur l'objet urlImagePost | Catch du fichier localhost/urlImagePost avec obj.imagePost | Split pour le nom du fichier | Application de fs unlink de way dynamique pour each file
        for(let obj of urlImagePost) {
            console.log('6) URLS IMAGEPOST: ' , obj.imagePost);
            // Décomposition de l'URL en 2 parties avec split() => 1ere en amont de 'images/post' et 2e en aval => Nom du fichier [1] 
            // files sera tous les noms de fichiers téléchargés par le user dans backend/images/post
            const files = obj.imagePost.split('images/post')[1];
            console.log('7) NOM DES FICHIERS A DELETE DU DOSSIER IMAGES/POST', files)
            fs.unlink(`images/post/${files}`, function(error){
                if(error) throw error;
                console.log('Tous les fichiers imagePost du user supprimés du dossier images/post !!!')
            });
        }
        
        // 3) Consommation de la promise deleteUser() dans param y (doit être différent de param x sinon erreur)
        const deletedAccountAndFiles = await User.deleteUser(userById);
        res.status(200).json({ 
            message:'Utilisateur, fichier avatar et fichiers post supprimés avec succés', 
            deletedAccountAndFiles : deletedAccountAndFiles
        });
    }
};
