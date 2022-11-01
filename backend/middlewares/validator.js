const { body, check, validationResult} = require('express-validator');

// FORM VALIDATION DES SAISIES USERS
// user input rules sur tous les formulaires signup | login | champs post + comment


// MES REGEXS CARACTERES SPECIAUX
const specialChars = "/^[^*|\":<>[\]{}`\\()';@&$]+$";
// /^[a-z0-9]+$/i

// ^         Start of string
// [a-z0-9]  a or b or c or ... z or 0 or 1 or ... 9
// +         one or more times (change to * to allow empty string)
// $         end of string    
// /i        case-insensitive


// FORMULAIRE LOGIN
const userLoginInput = () => { 
    
    return [
    
       // inputs rules au niveau des 2 champs email | mot de passe pour login
        
        // email: .not(specialCharsMail).withMessage("caractères spéciaux: *|\":<>[\]{}`\\()';&$ non acceptés.")
        // .isAlphanumeric().withMessage('Votre mail ne doit contenir que des caractères alphanumériques')
        // password: .not(specialChars).withMessage("caractères spéciaux: *|\":<>[\]{}`\\()';@&$ non acceptés.")
        
        body('email')
            .not().isEmpty().withMessage('Champs "Email" requis')
            .isEmail().normalizeEmail().withMessage('Format email non valide')
            .trim()
            .escape(),
            
        body('password')
            .not().isEmpty().withMessage('Champs "Mot de passe" requis')
            .isAlphanumeric().withMessage(' Caractères alphanumériques')
            .isLength({min:3, max:10}).withMessage(' minimum 3 caractères, maximum 10')
            .trim()
            .escape(),
            
    ]
};



// FORMULAIRE SIGNUP
const userSignupInput = () => { 
    
    return [
    
    // inputs rules au niveau des 3 champs username | email | mot de passe pour signup
        
        body('username')
            .not().isEmpty().withMessage('Champs "Username" requis')
            .isAlphanumeric().withMessage('Champs "Username": Caractères alphanumériques')
            .isLength({min:3, max:10}).withMessage('Le username doit avoir minimum 3 caractères, maximum 10')
            .not(specialChars).withMessage("caractères spéciaux: *|\":<>[\]{}`\\()';@&$ non acceptés.")
            .trim()
            .escape(),
            
        
        body('email')
            .not().isEmpty().withMessage('Champs "Email" requis')
            .isEmail().normalizeEmail().withMessage('Format email non valide')
            .trim()
            .escape(),
            
        
        body('password')
            .not().isEmpty().withMessage('Champs "Mot de passe" requis')
            .isAlphanumeric().withMessage('Champs "Mot de passe": Caractères alphanumériques')
            .isLength({min:3, max:10}).withMessage('Longueur minimum 3 caractères, maximum 10')
            .not(specialChars).withMessage("caractères spéciaux: *|\":<>[\]{}`\\()';@&$ non acceptés.")
            .trim()
            .escape(),
            
    ]
};


// FORMULAIRE USERACCOUNT
const userAccountInput = () => { 
    
    return [
    
    // inputs rules au niveau des 2 champs username | mot de passe pour useraccount
        
        // body('username')
        //     .not().isEmpty().withMessage('Champs "Username" requis')
        //     .isAlphanumeric().withMessage('Caractères alphanumériques')
        //     .isLength({min:3, max:10}).withMessage('Longueur minimum 3 caractères, maximum 10')
        //     .not(specialChars).withMessage("caractères spéciaux: *|\":<>[\]{}`\\()';@&$ non acceptés.")
        //     .trim()
        //     .escape(),
        
        body('email')
            .not().isEmpty().withMessage('Champs "Email" requis')
            .isEmail().normalizeEmail().withMessage('Format email non valide')
            .trim()
            .escape(),
        
        body('password')
            .not().isEmpty().withMessage('Champs "Mot de passe" requis')
            .isAlphanumeric().withMessage('Caractères alphanumériques')
            .isLength({min:3, max:10}).withMessage('Longueur minimum 3 caractères, maximum 10')
            .not(specialChars).withMessage("caractères spéciaux: *|\":<>[\]{}`\\()';@&$ non acceptés.")
            .trim()
            .escape(),
        
    ]
};


// FORMULAIRES POST + COMMENTAIRE => espace permis dans la saisie car express-validator ne prend pas en compte les spaces comme un caractère alpha

// FormPost data validation
const validFormPost = () => {
    
    return [
        //todo: bannir certains caractères spéciaux
        // /^[a-z0-9]+$/i
        body('contentPost')
            .not().isEmpty().withMessage('Champs requis')
            .matches(/^[a-zA-Z0-9_]+(?:\W+[a-zA-Z0-9_]+)*\W*$/).withMessage('Veuillez n\'écrire que des caractères alphanumériques')
            // .trim()
            // .escape(),
    ]
};


// FormComment data validation
const validFormComment = () => {
    
    return [
        //todo: bannir certains caractères spéciaux
        // input's rules du form post
        // /^[A-Za-z_][A-Za-z\d_]*$/
        // /^[a-z0-9]+$/i
        body('contentComment')
            .not().isEmpty().withMessage('Champs requis')
            .matches(/^[a-zA-Z0-9'_]+(?:\W+[a-zA-Z0-9'_]+)*\W*$/).withMessage('Veuillez n\'écrire que des caractères alphanumériques')
            // .trim()
            // .escape(),
    ]
};


// VALIDATION DES REGLES DES FORMULAIRES
const validate = (req,res,next) => {
    
    // Check des éléments de la requête (inputs)
    const errors = validationResult(req);
    console.log(req.body);
    
    // Si aucune erreur détectée, on passe au middleware next
    if(errors.isEmpty()) {
        return next()
    }
    const erreur = errors.array();
    console.log(erreur)
    
    return res.status(422).json({ message:"Array des erreurs d'express-validator", errors: errors.array() })
};


// Exportation pour utilisation sur les routes
module.exports = {
    userSignupInput,
    userLoginInput,
    userAccountInput,
    validFormPost,
    validFormComment,
    validate,
};