const dbmySql = require('../mysqlconnection');  // import configuration de connection avec BD sql

/* FICHIER MODEL POST AVEC TOUTES LES REQUETES SQL CRUD concernant le tableau 'posts' de notre DB mysql
Requetes sql de l'API pour les 'posts'
Table post => postID | idUserAuteur | username | contentPost | date_creation */

// REQUETES CRUD SUR LA TABLE POSTS DE NOTRE DB MYSQL

// Fonction requête sql pour affichage de tous les posts
exports.getAll = () => {
    return new Promise((resolve, reject) => { 
        // Préparation requête SQL donnant le post le plus récent au plus ancien
        //const sql = 'SELECT * FROM posts ORDER BY posts.date_creation DESC' => post du plus récent au moins récent
        const sql = 'SELECT * FROM `posts` ORDER BY `posts`.`date_creation` DESC';
        // Exécution requête
        dbmySql.query( sql, function(error, results, fields) {
            if (error) reject(error);
            resolve(results);
            // console.log(results);
        });
    })
};


// Fonction requête sql pour affichage d'un seul post
// Requete query on selectionne toutes les colonnes correspondant à l'id_post en parametre
exports.getOne = (postID) => { // idPost === primaryId
    return new Promise((resolve, reject) => { //gestion asynchrone
        // const sql = 'SELECT * FROM posts WHERE id= ?';
        // SELECT * FROM posts JOIN users ON posts.userId = users.id WHERE postID=?
        const sql = 'SELECT * FROM `posts` WHERE `posts`.`postID` = ?'
        dbmySql.query( sql , [postID] , function(error, results, fields) {
            if (error) reject(error);
            resolve(results);
            console.log(results)
        })
    })
};


// OPTION 1 POUR CREATION DE PUBLICATION => UNE SEULE LOGIQUE POUR CREATION DE TEXTE ET IMAGE DANS UNE SEULE REQUETE SQL

// Fonction createPublication( texte + image | texte ou image)
exports.creation = (userID, username, contentPost, imagePost) => {

    return new Promise((resolve,reject) => {
        const sql ='INSERT INTO `posts` ( `id_user_auteur_post`, `username` , `contentPost`, imagePost ) VALUES (?,?,?,?)'
        let dataCreated = [ userID, username, contentPost, imagePost ]
        dbmySql.query(sql, dataCreated, function (error, results, fields) {
            if (error) reject (error);
            resolve(results);
            console.log(results.affectedRows + " record(s) updated");
            // console.log(results);
        })
    })
}


// Fonction updatePublication( texte + image | texte ou image)  => 2 cas à gérer dans le ctler
// cas 1 => contentPost 1 imagePost 0 : update texte et pas update image (gestion de req.file)
// cas 2 => contentPost 0 imagePost 1 : pas update texte et update image (gestion de req.file)

exports.modification = (contentPost, imagePost, postID) => {
    
    return new Promise( (resolve, reject) => {
        const sql ='UPDATE `posts` SET `contentPost`= ?, `imagePost`= ? WHERE `posts`.`postID` = ?'
        let dataUpdated = [contentPost, imagePost, postID]
        dbmySql.query(sql, dataUpdated, function (error, results,fields) {
            if (error) reject (error);
            resolve(results);
            console.log(results.affectedRows + " record(s) updated");
        })
    })
}




// OPTION 2 POUR CREATION DE PUBLICATION => DEUX LOGIQUE: SEPARATION STRICTE TEXTE ET IMAGE POUR CREATION  DANS DEUX REQUETE SQL
// Fonction requête sql pour CREATION d'une ligne dans la table post
// userID est la clé primaire id de user
exports.create = ( userID, username, contentPost ) => { 
    return new Promise((resolve, reject) => {
        // colonnes de la table posts à remplir Mysql request
        const sql = 'INSERT INTO `posts` ( `id_user_auteur_post`, `username` , `contentPost` ) VALUES (?,?,?)';
        // data postée venant du front
        let dataInserted = [ userID, username, contentPost ]
        dbmySql.query(sql, dataInserted, function (error, results, fields){
            if (error) reject (error);
            resolve(results);
            console.log(results);
            console.log(results.affectedRows + " record(s) updated");
        })
    })
};



// Fonction requête sql pour MODIFIER un post after => texte + image ou texte ou image only dans UpdatePost.vue
exports.update = ( contentPost, postID ) => {
    return new Promise((resolve,reject) => {
        //requete sql dans une const
        const sql = 'UPDATE `posts` SET `contentPost`= ? WHERE `posts`.`postID` = ?' ;
        let dataUpdated = [contentPost,postID]
        dbmySql.query( sql, dataUpdated , function (error, results, fields){
            if(error) reject(error);
            resolve(results);
            console.log(results.affectedRows + " record(s) updated");
        })
    })
};


// Fonction upload image du post => PostComments.vue
exports.uploadImage = (userID, username, imagePost) => {

    return new Promise((resolve, reject) =>{
        
        const sql ='INSERT INTO `posts` (`id_user_auteur_post`, `username`, `imagePost`) VALUES (?,?,?)';
        let data = [userID, username, imagePost]
        dbmySql.query(sql, data, function(error, results, fields){
            if(error) reject(error);
            resolve(results);
            console.log(results.affectedRows + " record(s) updated");
            // console.log(results);
        })
    })
};


// Fonction update upload image du post => UpdatePost.vue
exports.updateUploadImage = ( imagePost, postID ) => {
    
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE `posts` SET `imagePost`= ? WHERE `posts`.`postID` = ?';
        let data = [imagePost, postID]
        dbmySql.query(sql, data, function(error, results, fields){
            if(error) reject(error);
            console.log('Résultat du update image: ',results);
            resolve(results);
            console.log(results.affectedRows + " record(s) updated");
            // console.log(result);
        })
    })
};

// Fonction requête sql pour SUPPRIMER un post (after)
exports.delete = (postID) => { 
    
    return new Promise((resolve,reject) => {
        const sql = 'DELETE FROM `posts` WHERE `posts`.`postID` = ?';
        dbmySql.query( sql, [postID], function (error, results, fields){
            if (error) reject (error);
            resolve(results);
            console.log(results.affectedRows + " record(s) updated");
            // console.log(results);
        })
    })
};


// Fonction requête sql pour GET pour pouvoir enlever toutes images postées par ce user lorsque son compte est supprimé (par lui ou admin)
// Requête personalisée réutilisée dans ctler user.js pour la fonction deleteUserAndFile

exports.getAllImagePost = (id_user_auteur_post) => { 
    
    return new Promise((resolve,reject) => {
        const sql = 'SELECT `posts`.`imagePost` FROM `posts` WHERE `posts`.`id_user_auteur_post` = ?';
        dbmySql.query( sql, [id_user_auteur_post], function (error, results, fields){
            if (error) reject (error);
            resolve(results);
            console.log(results.affectedRows + " record(s) updated");
            // console.log(results);
        })
    })
};

