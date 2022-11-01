// Import des paramètres de connexion à notre bd groupomania
const dbmySql = require('../mysqlConnection'); 

// Modèle sql donnant les infos persos des users et leurs posts respectifs 
exports.getUsersInfosAndStats = () => {
    
    return new Promise((resolve, reject) => {
        
        const sql = 'SELECT `users`.`userID`, `users`.`username`, `users`.`email`, `users`.`avatar`, `users`.`date_creation` AS date_creation_compte, COUNT(DISTINCT`posts`.`postID`) AS nbre_de_posts, COUNT( DISTINCT`comments`.`commentID`) AS nbre_de_commentaires,COUNT( DISTINCT`reactions`.`reactionID`) AS nbre_de_reactions FROM `users` LEFT JOIN `posts` ON `users`.`userID` = `posts`.`id_user_auteur_post` LEFT JOIN `comments` ON `users`.`userID` = `comments`.`id_user_auteur_comment`  LEFT JOIN `reactions` ON `users`.`userID` = `reactions`.`id_user_auteur_reaction` GROUP BY `users`.`userID`';
        dbmySql.query(sql, function(error, results, fields) {
            if(error) reject (error);
            resolve(results);
            console.log(results)
        })
    })
};


/* NBRE DE LIKE et de DISLIKE PAR USER */ 
exports.getUsersAllReactions = () => {
    
    return new Promise((resolve, reject) => {
        
        const sql = 'SELECT `users`.`userID`, SUM(`reactions`.`like`) AS nbre_de_like , SUM(`reactions`.`dislike`) AS nbre_de_dislike FROM `users` LEFT JOIN `reactions` ON `users`.`userID` = `reactions`.`id_user_auteur_reaction` GROUP BY `users`.`userID`';
        dbmySql.query(sql, function(error, results, fields) {
            if(error) reject (error);
            resolve(results);
            console.log(results)
        })
    })
}

// DERNIER POST PAR USER
exports.getUserLastPost = () => {
    return new Promise((resolve,reject) => {
        const sql = 'SELECT `users`.`userID` AS id_user_auteur_post, `posts`.`contentPost` AS last_post, `posts`.`imagePost` AS last_image, max(`posts`.`date_creation`) AS last_published_date FROM `users` LEFT JOIN `posts` ON `users`.`userID`=`posts`.`id_user_auteur_post` GROUP BY `users`.`userID` ORDER BY `posts`.`date_creation` ASC'
        dbmySql.query(sql, function(error, results, fields) {
            if(error) reject (error);
            resolve(results);
            console.log(results)
        })
    })
}


// DERNIER COMMENTAIRE PAR USER
exports.getUserLastComment = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT `users`.`userID` AS id_user_auteur_comment, `comments`.`contentComment` AS last_comment, max(`comments`.`date_creation`) AS last_published_date FROM `users` LEFT JOIN `comments` ON `users`.`userID`=`comments`.`id_user_auteur_comment` GROUP BY `users`.`userID` ORDER BY `comments`.`date_creation` ASC'
        dbmySql.query(sql, function(error, results, fields) {
            if(error) reject (error);
            resolve(results);
            console.log(results)
        })
    })
}


// Modèle avec requeête SQL supprimant un userID
exports.deleteUser = (userID) => {
    
    return new Promise((resolve, reject) => {
        
        const sql = 'DELETE FROM `users` WHERE `users`.`userID` = ?';
        dbmySql.query( sql, [userID], function(error, result, field){
            if(error) reject(error);
            resolve(result);
            // console.log(field);
        })
    })
};

