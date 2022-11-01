import axios from 'axios';

// Config globale par défaut d'axios

// Refactoring préfixe URL de l'application
axios.defaults.baseURL = 'http://localhost:3000/';

// Gestion des tokens par axios
//token à la place de AUTH_TOKEN => clé: valeur | token: AUTH_TOKEN

axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem('token'); 

// Global setting des headers POST: mettre header pour que le front configure les infos correctement pour le backend
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

// const axiosConfig = axios.create({
//     // Refactoring préfixe URL de l'application
//     baseURL : 'http://localhost:3000/',
    
//     // Gestion des tokens par axios
//     //token à la place de AUTH_TOKEN => clé: valeur | token: AUTH_TOKEN
//     // Global setting des headers POST: mettre header pour que le front configure les infos correctement pour le backend
//     header: {
//         ['Authorization'] : 'Bearer '+ localStorage.getItem('token'), 
//         ['Content-Type'] : 'multipart/form-data',
//     },
    
//     timeout: 1000
// });

// export default axiosConfig