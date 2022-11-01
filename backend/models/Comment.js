const dbmySql = require('../mysqlConnection');   // import configuration de connection avec BD sql

// Nous écrivons les fonctions query du model Comment:
// User doit pouvoir créer | modifier | effacer son commentaire
// Table Comments => id | commentaire | postId | userId | date_creation

exports.read = () => {
    return new Promise((resolve, reject) => {
        dbmySql.query('SELECT * FROM comments', function(error, results, fields){
            if (error) reject(error);
            resolve(results);
            
        })
    })
};
// 'SELECT comments.*, users.avatar FROM comments JOIN users ON comments.idAuteur = users.id AND comments.idPost="'+req.params.id+'" ORDER BY id DESC'


exports.create = ( postID, userID, username, contentComment ) => {
    return new Promise((resolve, reject) => {
        // respecter ordre champs des tables
        
        const sql = 'INSERT INTO comments (id_post_commented, id_user_auteur_comment, username, contentComment) VALUES (?, ?, ?, ?)'
        let dataInserted = [postID, userID, username, contentComment]
        dbmySql.query( sql, dataInserted , function(error, result, field) {
            if (error) reject (error);
            resolve (result);
            
        })
    })
};


exports.update = ( contentComment, commentID ) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE `comments` SET `contentComment` = ? WHERE `comments`.`commentID` = ?';
        let dataUpdated = [contentComment, commentID]
        dbmySql.query( sql , dataUpdated ,function(error, result, field) {
            if ( error ) reject( error );
            resolve(result);
            // console.log(field)
        })
    })
};


exports.delete = (commentID) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM `comments` WHERE `comments`.`commentID` = ?'
        let dataDeleted = [commentID]
        dbmySql.query( sql, dataDeleted ,function(error, result, field){
            if (error) reject(error);
            resolve(result);
        })
    })
};