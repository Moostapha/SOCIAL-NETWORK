const multer = require('multer');

// Dico d'extension des fichiers images téléchargeables pour les avatars users

const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png',
    'image/gif': 'gif'
};

// Objet de gestion des fichiers images entrants
const storage = multer.diskStorage({  
    // callback (arg1 => no error, arg2 => dossier de destination)    
    destination: (req, file, callback) => {
        callback(null, 'images/avatar');
    },
    filename: (req, file, callback) => {
        // récup nom fichier + supp + remplacement des espaces car soucis éventuel côté server
        const name = file.originalname.split(' ',).join('_');
        // création extension fichier à l'aide du dico
        const extension = MIME_TYPES[file.mimetype];
        // Nom de fichier unique=> nomFichier + date + extensionFichier
        callback(null, name + Date.now() + '.' + extension); 
    }
});

module.exports = multer({ storage: storage }).single('avatar');