const commentModel = require('../models/Comment');

/* LOGIQUE METIER DES COMMENTAIRES 
Les commentaires doivent pouvoir etre crees , modifier ou effacer par un utilisateur
Doit on pouvoir voir les commentaires des autres users?
*/

//Afficher commentaire
exports.readComment = async(req, res, next) => {
    const comments = await commentModel.read();
    res.status(200).json({ message:'Liste des commentaires', comments: comments })
};


// Fonction créant un commentaire sur un post
//commun a user + admin
exports.createComment = async(req, res, next) => {
    //Stockage datas envoyés par front
    const newComment = req.body;
    console.log(" Infos new commentaire:  ", newComment);
    
    const createdComment = await commentModel.create( 
        newComment.id_post_commented , 
        newComment.id_user_auteur_comment, 
        newComment.username,
        newComment.contentComment, 
    );
    console.log("résultat promise: ", createdComment);
    res.status(201).json({ 
        message:'commentaire créé avec succés', 
        comment: createdComment 
    });
};


// Fonction modifiant un commentaire sur un post
exports.updateComment = async(req, res, next) => {
    
    const commentID = req.params.commentID;  // capture de l'id du commentaire modifié
    const modify = req.body;   
    
    console.log('=> commentID modifié : ',commentID)
    console.log('=> Datas new comment : ',modify);
    // Attention !!! Respecter ordre des paramètres de fonction (fonction udpate de Comment.js)
    const updatedComment = await commentModel.update( 
        modify.contentComment , 
        modify.commentID , 
    );
    res.status(200).json({ 
        message:'commentaire modifié avec succés', 
        newComment: updatedComment
    });
};


// Fonction supprimant un commentaire
exports.deleteComment = async(req, res, next) => {
    //Récupération clé primaire depuis req venant du frobt
    const commentID = req.params.commentID;
    console.log('commentID à supprimer: ', commentID);
    
    //On la met en paramètre dans la fonction Model deleteComment de Comment.js
    const deletedComment = await commentModel.delete(commentID);
    console.log('Résultat de la promise: ', deletedComment);
    
    //Renvoie de la réponse au front
    res.status(200).json({ 
        message:'commentaire supprimé avec succés', 
        comment: deletedComment 
    });
};