// schema de donnees User de User/model
const Admin = require('../models/Administrateur'); 


// Fonction pour voir toutes les infos et activités des users
exports.getAllUsersInfos = async(req, res, next) => {
    const allUsersInfos = await Admin.getUsersInfosAndStats();
    res.status(200).json({ 
        message:'Infos de tous les users et leurs statistiques', 
        users: allUsersInfos 
    });
};

// Fonction donnant le ndre de likes | dislikes par user
exports.getUsersLikesAndDislikes = async(req, res, next) => {
    const allLikesDislikesByUser = await Admin.getUsersAllReactions();
    res.status(200).json({
        message: 'Likes et Dislikes par user',
        reactions: allLikesDislikesByUser
    });
}

// Fonction donnant le dernier post (image et texte) d'un user
exports.lastUserPost = async(req,res,next) => {
    const lastPost = await Admin.getUserLastPost();
    res.status(200).json({
        message:'Dernier post par user',
        recentPublications: lastPost
    })
}

// Fonction donnant le dernier comment d'un user
exports.lastUserComment = async(req,res,next) => {
    const lastComment = await Admin.getUserLastComment();
    res.status(200).json({
        message:'Dernier commentaire par user',
        recentCommentaires: lastComment
    })

}


// Fonction de suppression d'un user par Admin avec suppression de son avatar du dossier images/avatar + images postées du dossier images/post
// Cf controller/user.js avec la fonction deleteUserAndFile => Fonction commune (DRY)
