// Import du Model Reaction
const reactionModel = require('../models/Reaction');


// Fonction affichant allLikes
exports.getAllLikes = async(req, res, next) => {
    const likes = await reactionModel.getLikes();
    res.status(200).json({
        message: 'Liste de tous les likes par post',
        likes: likes
    })
}


// Fonction affichant all dislikes
exports.getAllDislikes = async(req, res, next) => {
    const dislikes = await reactionModel.getDislikes();
    res.status(200).json({
        message:'Liste de tous les dislikes par post',
        dislikes: dislikes
    })
}


// Fonction créant | annulant un like après check s'il existe déjà dans la table reactions
exports.likePost = async(req, res, next)=> {
    
    // 1) Capture corps requête venant du front via axios
    const newLike = req.body;
    console.log(' 1) ---- corps requête POST by axios ---- => ', newLike);
    
    // 2) on vérifie si les datas postID (id_post_reacted) et userID (id_user_auteur_reaction) sont déjà dans la table reactions et si like ou pas sur ce post par ce user
    const checkUserLikeOnPost = await reactionModel.checkIfUserLikeExists(
        newLike.id_post_reacted,          
        newLike.id_user_auteur_reaction  
    );
    
    // 3) Affichage 1er résultat du check 
    console.log(' 2) ---- user a déjà liké ? ---- => ', checkUserLikeOnPost);
    
    // 4) Si présence ou non des données dans la table reactions et selon, on effectue 2 actions => createLike ou cancleLike
    switch (checkUserLikeOnPost.length) {
        
        // CAS 1: User n'a pas encore liké ce post
        // checkUserLikeOnPost.length == 0 => like n'existe pas (pour ce user et pour ce post)
        case 0: 
            // Dans ce cas on crée une ligne avec new post | new user | new like = 1
            const createdLike = await reactionModel.createLike(
                newLike.id_post_reacted,
                newLike.id_user_auteur_reaction
            );
            console.log(' 3) ---- Résultat de la promise ---- => ', createdLike)
            res.status(201).json({
                message:'like du post créé avec succés',
                newLikedPost: createdLike
            }) 
        break;
        
        // CAS 2: User a déjà liké ce post
        // checkUserLikeOnPost.length == 1 => like existe (pour ce user et pour ce post) 
        case 1: 
            // Dans ce cas le like est remis à o avec cancelLike
            const deletedReaction = await reactionModel.cancelLikeDislike(
                newLike.id_post_reacted,
                newLike.id_user_auteur_reaction
            );
            console.log(' 4) ---- Résultat de la promise ---- => ', deletedReaction)
            res.status(201).json({
                message:'Votre like est annulé',
                newCancelLike: deletedReaction
            }) 
            break;
        
        default: // aucune de ces options ci-dessus
            
            break;
    }
    
    // 4) Si  présence de ces données, on stoppe ici car le user a déjà liké ce post
    // si user like existe (user a déjà liké) et like = 1
    
    
    
    // if (checkUserLikeOnPost.length == 1) {
    //     // fonction deleteLike() ou updateLike() ou cancelReaction ?
    //     return res.status(401).json({ 
    //         error: "Vous avez déjà liké ce post !!!",
    
    //     })
    // }
    // // 5) Si non présence du like déjà dans la table, on effectue l'écriture des datas dans la table
    // else {
    //     const createdLike = await reactionModel.createLike(
    //         newLike.id_post_reacted,
    //         newLike.id_user_auteur_reaction
    //     );
    //     console.log(' ---- Résultat de la promise ---- => ', createdLike)
    //     res.status(201).json({
    //         message:'like du post créé avec succés',
    //         newLikedPost: createdLike
    //     }) 
    // }
};


// Fonction créant | annulant un dislike aprés check s'il existe déjà dans la table reactions
exports.dislikePost = async(req, res, next) => {
    
    // 1) Capture du corps de la requête venant d'axios front
    const newDisLike = req.body;
    console.log(' 1) ---- corps requête POST by axios ---- => ', newDisLike);
    
    // 2) on vérifie si les datas userID et postID sont déjà dans la table reactions et si like associé ou pas
    const checkUserDislikeOnPost = await reactionModel.checkIfUserDislikeExists(
        newDisLike.id_post_reacted,  // newDisLike.userID, 
        newDisLike.id_user_auteur_reaction       // newDisLike.postID  
    );
    
    // 3) Affichage résultat du check => 0 = non et 1 = oui
    console.log(' 2) ---- user a déjà disliké ? ----=> ', checkUserDislikeOnPost);
    
    // 4) Si présence ou non des données dans la table reactions et selon, on effectue 2 actions => createLike ou cancleLike
    switch (checkUserDislikeOnPost.length) {
        
        // CAS 1: User n'a pas encore liké ce post
        // checkUserLikeOnPost.length == 0 => like n'existe pas (pour ce user et pour ce post)
        case 0: 
            // Dans ce cas on crée une ligne avec new post | new user | new like = 1
            const createDislike = await reactionModel.createDislike(
                newDisLike.id_post_reacted,
                newDisLike.id_user_auteur_reaction
            );
            console.log(' 3) ---- Résultat de la promise ---- => ', createDislike)
            res.status(201).json({
                message:'like du post créé avec succés',
                newDislikedPost: createDislike
            }) 
        break;
        
        // CAS 2: User a déjà liké ce post
        // checkUserDislikeOnPost.length == 1 => like existe (pour ce user et pour ce post) 
        case 1: 
            // Dans ce cas le like est remis à o avec cancelLikeDislike
            const deletedReaction = await reactionModel.cancelLikeDislike(
                newDisLike.id_post_reacted,
                newDisLike.id_user_auteur_reaction
            );
            console.log(' 4) ---- Résultat de la promise ---- => ', deletedReaction)
            res.status(201).json({
                message:'Votre dislike est annulé',
                newCancelDislike: deletedReaction
            }) 
            break;
        
        default: // aucune de ces options ci-dessus
            
            break;
    }
    
    // // 4) Si  présence de ces données le rslt est 1, on stoppe ici car le user a déjà liké ce post
    // if (checkUserdislikeOnPost === 1) {
    //     return res.status(401).json({ 
    //         error: "Vous avez déjà disliké ce post !!!" 
    //     })
    // }
    // // 5) Si non présence du like déjà dans la table, on effectue l'écriture des datas dans la table
    // else {
    //     const createdDislike = await reactionModel.createDislike(
    //         newDisLike.id_post_reacted,
    //         newDisLike.id_user_auteur_reaction
    //     );
    //     console.log(' 3) ----  Résultat de la promise ---- => ', createdDislike)
    //     res.status(201).json({
    //         message:'Dislike du post créé avec succés',
    //         newDislikedPost: createdDislike
    //     }) 
    // }
}


// Fonction modifiant un like
exports.updateLikePost = async(req, res, next)=> {
    // si user a déja liké enlever le like 
    // sinon
}


// Fonction modifiant un dislike
exports.updateDislikePost = async(req, res, next)=> {}
