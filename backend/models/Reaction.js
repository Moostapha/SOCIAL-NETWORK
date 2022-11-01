// Import des paramètres de connexion à notre bd groupomania
const dbmySql = require('../mysqlconnection');


// Fonction GET donnant tous les likes sur un post
exports.getLikes = () => {
    
    return new Promise((resolve, reject) => {
        
        const sql = 'SELECT `posts`.`postID`,`reactions`.`id_user_auteur_reaction` AS auteur_like, SUM(`reactions`.`like`) AS nbre_like FROM `posts` LEFT JOIN `reactions` ON `posts`.`postID` = `reactions`.`id_post_reacted` GROUP BY `posts`.`postID`';
        dbmySql.query(sql, function(error, results, fields){
            if (error) reject(error);
            resolve(results);
            console.log(results);
            // console.log(fields)
        })
    })
}


// Fonction GET donnant tous les dislikes sur un post
exports.getDislikes = () => {
    
    return new Promise((resolve, reject) => {
        
        const sql = 'SELECT `posts`.`postID`,`reactions`.`id_user_auteur_reaction` AS auteur_dislike, SUM(`reactions`.`dislike`) AS nbre_dislike FROM `posts` LEFT JOIN `reactions` ON `posts`.`postID` = `reactions`.`id_post_reacted` GROUP BY `posts`.`postID`';
        dbmySql.query(sql, function(error, results, fields){
            if(error) reject (error);
            resolve(results);
            console.log(results);
            // console.log(fields);
        })
    })
}


// Fonction requête vérifiant si le user a déjà liké un post
exports.checkIfUserLikeExists = async(postID, userID) => {
    
    // SELECT EXISTS(SELECT 1 FROM `reactions` WHERE (`reactions`.`id_post_reacted`= ?) AND (`reactions`.`id_user_auteur_reaction`= ?) AND (`reactions`.`like`= 1)) AS mycheckIfUserLikeAlready
    
    return new Promise ((resolve, reject) => {
        let data = [postID, userID];
        const sql = 'SELECT * FROM `reactions` WHERE `reactions`.`id_post_reacted` = ? AND `reactions`.`id_user_auteur_reaction`= ? AND `reactions`.`like`= 1';
        dbmySql.query(sql, data, function(error, results, fields){
            if(error) reject (error);
            resolve(results);
            console.log(results);
            // console.log(fields);
        })
    })
    
}


// Fonction réaction like +1 => j'aime ou create like dans table reaction
exports.createLike = async(postID, userID) => {
    
    return new Promise((resolve, reject) => {
        
        // requête permettant de vérifier si cette ligne avec ces 2 datas existe => renvoie 0 si rien et 1 si ok
        // SELECT EXISTS(SELECT 1 FROM `reactions` WHERE `reactions`.`id_post_reacted`  = ? AND `reactions`.`id_user_auteur_reaction` = ? AND `reactions`.`like` = 1 ) AS mycheckIfUserLike;
        
        const sql = 'INSERT INTO `reactions` (`id_post_reacted`, `id_user_auteur_reaction`, `like`) VALUES (?,?,1)';
        let data = [postID, userID]
        dbmySql.query(sql, data, function(error, result, fields){
            if(error) reject (error);
            resolve(result);
            console.log(result);
            // console.log(fields);
        })
    })
};


// Fonction requête vérifiant si le user a déjà disliké un post
exports.checkIfUserDislikeExists = async(postID, userID) => {
    // SELECT EXISTS(SELECT 1 FROM `reactions` WHERE `reactions`.`id_post_reacted`  = ? AND `reactions`.`id_user_auteur_reaction` = ? AND `reactions`.`dislike` = 1 ) AS mycheckIfUserDislikeAlready
    
    return new Promise ((resolve, reject) => {
        let data = [postID, userID];
        const sql = 'SELECT * FROM `reactions` WHERE `reactions`.`id_post_reacted` = ? AND `reactions`.`id_user_auteur_reaction`= ? AND `reactions`.`dislike`= 1';
        dbmySql.query(sql, data, function(error, results, fields){
            if(error) reject (error);
            resolve(results);
            console.log(results);
            // console.log(fields);
        })
    })
    
}


// Fonction réaction dislike +1 => j'aime pas
exports.createDislike = async(postID, userID) => {
    
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO `reactions` (`id_post_reacted`, `id_user_auteur_reaction`, `dislike`) VALUES (?,?,1)';
        let data = [postID, userID]
        dbmySql.query(sql, data, function(error, result, fields){
            if(error) reject (error);
            resolve(result);
            console.log(result);
            // console.log(fields);
        })
    })
};


// Fonction cancelLike => Fonction qui annule like ou dislike sur un post
exports.cancelLikeDislike = async(postID, userID) => {
    
    return new Promise ((resolve, reject) => {
        //UPDATE `reactions` SET `like`= 0 WHERE `reactions`.`id_post_reacted` = ? AND `reactions`.`id_user_auteur_reaction` = ?
        let data = [postID, userID];
        const sql = 'DELETE FROM `reactions` WHERE `id_post_reacted` = ? AND `id_user_auteur_reaction` = ?';
        dbmySql.query(sql, data, function(error, result, fields) {
            if(error) reject (error);
            resolve(result);
            console.log(result);
        })
    })
};

