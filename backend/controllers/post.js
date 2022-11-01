const postModel = require('../models/Post'); // Import des fonctions Models possédant nos requetes SQL

const fs = require('fs'); // Import fonctionnalité de node.js pour fileSystem pour la fonction delete

/* LOGIQUES METIERS DES POSTS CRUD
Notre app doit permettre aux users d'accéder:
1) à tous les posts
2) à un post en particulier (id)
3) Opérations CUD (R read étant les 2 du haut).
*/

// Fonction affichant tous les posts (page d'accueil) admin
exports.getAllPosts = async(req, res, next) => {
    const posts = await postModel.getAll().catch( error => { console.error(error) });  // model.nomFonctionModelPost
    res.status(200).json({
        message:'Liste des posts', 
        posts : posts 
    });
};


// Fonction affichant un seul post => Pour component UpdatePost
exports.getOnePost = async(req, res, next) => {
    const postID = req.params.postID; // clé primaire de la ligne de table posts
    const post = await postModel.getOne(postID).catch( error => { console.error(error) });
    res.status(200).json({ 
        message:'post sélectionné', 
        post : post 
    });
};

// ----------------------------------- POSSIBILITE 1 => 2 LOGIQUES METIERS SEPARES POUR TEXTE ET IMAGE ------------------------
// Fonction créant un post
exports.createPost = async(req, res, next) => {
    
    // 1) on capture le corps de la requete dans une cst => Requête axios
    const created = req.body;
    
    // Affichage du corps de requête dans la console
    console.log('---- 1) CORPS REQUETE CREATEPOST() PAR AXIOS: ', created);
    
    // 2) on la passe à la fonction Model  en précisant les champs dans l'ordre de la requete sql (dans Models)
    const createdPost = await postModel.create( 
        // inputs du front:
        created.userID,    
        created.username, 
        created.contentPost
    ).catch( error => { console.log(error) });
    
    console.log("----- 2) RESULTAT DE LA PROMISE: ", createdPost)
    res.status(201).json({ 
        message:'post créé avec succés',  
        post: createdPost,
    });
};


// Fonction modifiant un post (after) => axios.put dans Post.vue
exports.updatePost = async(req, res, next) => {
    const postID = req.params.postID;  // clé primaire du post dans db
    // on recupere le corps du nouveau post dans une constante
    const newPost = req.body;
    console.log('----1) POSTID POST MODIFIE: ', postID);
    console.log('----2) TYPE DE POSTID: ', typeof postID);
    console.log('----3) CORPS REQUETE UPDATEPOST(): ', newPost);
    console.log('----4) TYPE DE LA REQUETE UPDATEPOST(): ', typeof newPost);
    
    if (newPost.contentPost === 'null') {
        res.status(204).json({ 
            message:'post non modifié', 
        })
    } else {
        // on les met en paramètre dans la fonction Model update de Post.js
        const updatedPost = await postModel.update( 
            newPost.contentPost, 
            newPost.postID 
        ).catch( error => { console.log(error) });
        console.log("----5) RESULTAT DE LA PROMISE UPDATEPOST(): ", updatedPost)
        res.status(201).json({ 
            message:'post modifié avec succés', 
            post: updatedPost 
        });
    }
    
};

// Fonction uploadFile qui permet aux users de télécharger une image pour la publier
exports.uploadImagePost = async(req, res, next) => {
    
    // Récupération corps post request chaine de caractère transformée en objet JS
    // const createdData = JSON.parse(req.body);
    const createdData = req.body;
    console.log('----- 1) CORPS REQUETE AXIOS UPLOADIMAGEPOST(): ', createdData);
    
    if (createdData.imagePost === 'null' || createdData.imagePost === 'undefined' ) {
        res.status(204).json({
            message:'Fichier non mis à jour, ancien fichier conservé',
        })
    } else {
        // Fichier téléchargé et envoyé depuis le front
        const file = req.file;
        console.log('----- 2) MEDIA TELECHARGE: ', file)
        
        // URL image pour lecture GET au niveau frontend + configuration URL dynamique des fichiers images
        // cet URL sera dans la colonne imagePost de notre database
        const imageURL = `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`;
        console.log('--- 2) URL FICHIER IMAGE UPLOADED : ', imageURL);
        console.log('--- 3) NOM DU FICHIER TELECHARGE: ', req.file.filename,);
        
        // Insertion ligne dans database
        const uploadedFilePost = await postModel.uploadImage(
            //inputs venant du front (axios)
            createdData.userID,
            createdData.username,
            imageURL, 
        ).catch( error => { console.log(error) });
        
        console.log('4) RESULTAT DE LA PROMISE UPLOADIMAGEPOST(): ', uploadedFilePost);
        res.status(200).json({
            message:'Fichier téléchargé avec succés',
            fileUploaded: uploadedFilePost
        })
    }
    // (async function () {
    //     var result = await returnsPromise().catch((e) => { console.error(e.message) })
    //     console.log( result ? 'This was a success! ' + result : 'This was a failure.' )
    //     })()
};


// Fonction de modification fichier image
exports.updateImagePost = async(req, res, next) => {
    // // postID dont on modifie l'image
    const updatedData = req.body;
    console.log("------ 1) Corps de la requête axios pour update image ------>", updatedData);
    // // Fichier nouveau choisi par user
    const uploadedImg = req.body.imagePost
    console.log("------ 2) Fichier téléchargé non modifié par user ----->", uploadedImg)
    
    if (updatedData.imagePost === 'null') {
        // return {
            res.status(204).json({
                message:'Fichier non mis à jour, ancien fichier conservé',
            })
            
        //}
    } else {
        const file = req.file;
        console.log("------- 3) URL Nouveau fichier ------> ", file); 
        
        // URL dynamique du fichier mis à jour à stocker dans la db + Stockage dans backend/images
        const imageURL = `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`;
        
        // Enregistrement dans la db via le Model updateUpload
        const updatedFilePost = await postModel.updateUploadImage(
            imageURL,
            updatedData.postID
        ).catch( error => { 
            console.log(error) 
        });
        
        console.log('Résultat de la promise: ', updatedFilePost);
        res.status(200).json({
            message:'Fichier mis à jour avec succés',
            fileUpdated: updatedFilePost
        })
    }
}


// ----------------------------------- POSSIBILITE 2 => 1 seule LOGIQUES METIERS POUR TEXTE ET IMAGE ------------------------

// Fonction création d'une publication (texte seul obligé, sinon erreur 422 validator | texte + image)

exports.createPublication = async(req, res, next) => {
    // Formulaire datas venant du client: req.body avec 4 champs => userID, username, contentPost, imagePost
    
    // Récupération des datas venant du front par requête axios
    const dataFrontAxiosCreated = req.body;
    
    // Affichage du corps de requête dans la console
    console.log('---- 1) CORPS REQUETE CREATEPUBLICATION() PAR AXIOS: ', dataFrontAxiosCreated )
    
    /* Vérification si req.file présent dans requête ou non
    Nous devons  résoudre l'URL complète de notre image, car req.file.filename ne contient que le segment filename
    Route GET pour servir image sur http://localhost:3000/images/<image-name>.jpg depuis API
    Cela semble simple, mais n'oubliez pas que notre application s'exécute sur localhost:3000
    et nous ne lui avons pas indiqué comment répondre aux requêtes transmises à cette route
    */
    
    // cas contentPost 1 | imagePost 0 => Texte seul
    if( dataFrontAxiosCreated.imagePost === '') {
        // Si requête dataFrontAxiosCreated ne contient pas de fichier et que sa valeur soit 'null'
        
        // Consommation de la promise + insertion des datas dans les colonnes de la db posts via requête SQL sans le fichier
        const newPublication = await postModel.creation(
            dataFrontAxiosCreated.userID,
            dataFrontAxiosCreated.username,
            dataFrontAxiosCreated.contentPost,
            dataFrontAxiosCreated.imagePost    //inscrira vide dans la colonne imagePost de table posts
        ).catch( (error) => {
            console.log(error)
        });
        
        console.log('2) RESULTAT PROMISE CREATION: ', newPublication );
        res.status(201).json({
            message: 'Publication texte créée avec succés !!!',
            newPublication: newPublication
        })
    } 
    // sinon le reste de la requête est traitée et enregistrée dans notre db sans l'image
    // cas contentPost 0 | imagePost 1 => Image seule
    else {
        // encodage de file dans backend/images/post + lecture sur port 3000 pour les requêtes GET axios de l'image
        const imageURL = `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`;
        // Consommation de la promise + insertion des lignes dans la db via requête SQL avec le fichier
        const newPublication = await postModel.creation(
            dataFrontAxiosCreated.userID,
            dataFrontAxiosCreated.username,
            dataFrontAxiosCreated.contentPost, //inscrira vide dans la colonne contentPost de table posts
            imageURL
        ).catch((error) => {
            console.log(error)
        });
        
        console.log('2) RESULTAT PROMISE CREATION: ', newPublication );
        res.status(201).json({
            message: 'Publication texte avec fichier créèe avec succés !!!',
            newPublication: newPublication
        })
    }

};

// Fonction modifiant la publication ( texte ou image, texte et image, texte only, image only)

exports.updatePublication = async(req, res, next) => {
    // Formulaire datas venant du client: req.body avec 3 champs
    const dataUpdated = req.body;
    console.log('DATAS MODIFIES VENANT DU FRONT DEPUIS UPDATEPUBLICATION()', dataUpdated)
    // contentPost, imagePost, postID
    // Pour file updated => 2 cas:
    // 2) La publication avait déjà une image => Partie if : Il faut récupérer cette image et la réinsérer dans la colonne imagePost
    // 1) la publication n'avait pas d'image => 
    // Partie else : New Fichier présent dans requête front Axios
    // Nous devons  résoudre l'URL complète de notre image, car req.file.filename ne contient que le segment filename
    // Route GET pour servir image sur http://localhost:3000/images/<image-name>.jpg depuis API
    // Cela semble simple, mais n'oubliez pas que notre application s'exécute sur localhost:3000
    // et nous ne lui avons pas indiqué comment répondre aux requêtes transmises à cette route*/ 
    
    if ( dataUpdated.imagePost === 'null' || dataUpdated.imagePost ==='undefined' || dataUpdated.imagePost === '') {
        const updatedPublication = await postModel.modification(
            dataUpdated.contentPost,
            dataUpdated.imagePost, // 2 cas => user n'a pas d'image sur son post ou user a déjà image sur son post, il faut le réécrire ds la db
            dataUpdated.postID,
        ).catch((error) => {
            console.log(error)
        });
        
        console.log('2) RESULTAT PROMISE MODIFICATION PUBLICATION: ', updatedPublication  );
        res.status(201).json({
            message: 'Modification texte  créée avec succés !!!',
            updatedPublication : updatedPublication 
        })
        
    } else {
        // encodage de file dans backend/images/post + lecture sur port 3000 pour les requêtes GET axios de l'image
        const imageURL = `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`;
        const updatedPublication = await postModel.modification(
            dataUpdated.contentPost,
            imageURL,
            dataUpdated.postID,
        ).catch((error) => {
            console.log(error)
        });
        
        console.log('2) RESULTAT PROMISE MODIFICATION PUBLICATION: ', updatedPublication );
        res.status(201).json({
            message: 'Modification texte avec fichier créèe avec succés !!!',
            updatedPublication: updatedPublication
        })
    } 
};



// Fonction supprimant un post (after) à modifier pour supprimer file du dossier images 
exports.deletePost = async(req, res, next) => {
    
    //Récup. clé primaire à supp
    const postID = req.params.postID;
    console.log('postId post supprimé: ', postID);
    
    // Recherche et récupération du post à supprimer
    const publicationToDelete = await postModel.getOne(postID);
    console.log('1) FICHIER A DELETE DU DOSSIER IMAGES/POST: ', publicationToDelete[0].imagePost);
    
    // Récupération de l'url de l'image que l'on doit supprimer
    const imageUrl = publicationToDelete[0].imagePost;
    console.log('2) url du fichier: ',imageUrl);
    console.log('3) Longueur string: ',imageUrl.length);
    
    if (imageUrl.length === 0) {
        const deletedPostWithNoFile = await postModel.delete(postID).catch(
            (error) => {console.log(error)}
        );
        console.log("résultat de la promise: ", deletedPostWithNoFile);
        
        // Renvoie de la réponse au front 
        res.status(200).json({ 
            message:'post supprimé avec succés', 
            deletedPostWithNoFile: deletedPostWithNoFile 
        });
    } else {
        const filename = imageUrl.split('/images/post')[1];
        console.log('FILENAME ',filename);
        // unlink() => Fonction de suppression de fichier du module fs
        // unlink( chaîne de caractère chemin du fichier, callback à faire une fois le fichier supprimé)
        fs.unlink(`images/post/${filename}`, function(error){
            if(error) throw error;
            console.log('fichier supprimé du dossier images/post !!!')
        });
        
        const deletedPostWithFile = await postModel.delete(postID).catch(
            (error) => {console.log(error)}
        );
        console.log("résultat de la promise: ", deletedPostWithFile);
        
        // Renvoie de la réponse au front 
        res.status(200).json({ 
            message:'post supprimé avec succés', 
            deletedPostWithFile : deletedPostWithFile 
        });
    }


    // POSSIBILITE 2
    // switch (imageUrl.length) {
        
    //     // cas ou fichier image n'existe pas
    //     case 0:
    //         const deletedPostWithNoFile = await postModel.delete(postID).catch(
    //             (error) => {console.log(error)}
    //         );
    //         console.log("résultat de la promise: ", deletedPostWithNoFile);
            
    //         // Renvoie de la réponse au front 
    //         res.status(200).json({ 
    //             message:'post supprimé avec succés', 
    //             deletedPostWithNoFile: deletedPostWithNoFile 
    //         });
    //     break;
            
    //     // cas ou fichier existe
    //     // .split('/image/post/') => coupe autour de /image/post/ et renvoie un tableau de 2 éléments => Tout ce qu'il y a avant et après '/images/post/'
    //     // on prend ce qui est after qui est notre nom de fichier filename => [1]
    //     // Exemple http://localhost:3000/images/post/goku-sayan.gif1647936085517.gif
    //     case 1:
    //         const filename = imageUrl.split('/images/post')[1];
    //         console.log('FILENAME ',filename);
    //         // unlink() => Fonction de suppression de fichier du module fs
    //         // unlink( chaîne de caractère chemin du fichier, callback à faire une fois le fichier supprimé)
    //         fs.unlink(`images/post/${filename}`, function(error){
    //             if(error) throw error;
    //             console.log('fichier supprimé du dossier images/post !!!')
    //         });
            
    //         const deletedPostWithFile = await postModel.delete(postID).catch(
    //             (error) => {console.log(error)}
    //         );
    //         console.log("résultat de la promise: ", deletedPostWithFile);
            
    //         // Renvoie de la réponse au front 
    //         res.status(200).json({ 
    //             message:'post supprimé avec succés', 
    //             deletedPostWithFile : deletedPostWithFile 
    //         });
            
    //     break;
        
    //     default:
    //         break;
    // }
    
    
    
    //On la met en paramètre dans la fonction delete de Post.js
    // const deletedPost = await postModel.delete(postID).catch(
    //     (error) => {console.log(error)}
    // );
    // console.log("résultat de la promise: ", deletedPost);
    
    // // Renvoie de la réponse au front 
    // res.status(200).json({ 
    //     message:'post supprimé avec succés', 
    //     post: deletedPost 
    // });
    
    
    // .then(
    //     // console.log(postToDelete[0]),
    //     post => {
    //         // .split('/image/post/') => coupe autour de /image/post/ et renvoie un tableau de 2 éléments => Tout ce qu'il y a avant et après '/images/post/'
    //         // on prend ce qui est after qui est notre nom de fichier filename => [1]
    //         // Exemple http://localhost:3000/images/post/goku-sayan.gif1647936085517.gif
            
    //         const filename = fileToDelete[0].imagePost.split('/images/post/')[1];
            
    //         // unlink() => Fonction de suppression de fichier du module fs
    //         // unlink( chaîne de caractère chemin du fichier, callback à faire une fois le fichier supprimé)
    //         fs.unlink(`image/post/${filename}`, () => {
    //             res.status(200).json({ 
    //                 message:'post et son fichier supprimés avec succés', 
    //                 post: deletedPost 
    //             });
    //         })
    //     }).catch((error) => {console.log(error)}
    // );
};



// Toutes nos fonctions exportées vers /routes/post
