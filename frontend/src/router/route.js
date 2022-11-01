import Vue from 'vue'

import VueRouter from 'vue-router'                     // Import de vue-router pour gestion de la navigation entre les différentes views de l'app


// VIEWS DES COMPONENTS DE L'APPLICATION
import AccueilConnexion from '../views/AccueilConnexion'     // Import view pour page d'accueil connexion (component Login)
import Inscription from '../views/Inscription.vue'          //  Import view pour page signup (component Signup)
import Actualite from '../views/Actualite.vue'             // Import view pour page publications (component Posts)
import Profil from '../views/Profil'                      // Import view pour page profil (component UserAccount)
import ModifPost from '../views/ModifPost'               // Import pour page de modification post
import NewComment from '../views/NewComment'            // Import pour page d'edition commentaire
import ModifComment from '../views/ModifComment'       // Import pour page de modification commentaire
import AdminDashboard from '../views/AdminDashboard'  // Import pour page de l'administrateur

Vue.use(VueRouter)

/* ROUTES DE L'APPLICATION
Tableau contenant des objets définissant chaque route.
Match entre les URL et le view correspondant
*/

const routes = [
  
  // URL PAGE D'ACCUEIL navbar:Login
  // component: Login => views: AccueilConnexion
  {
    path: '/groupomania/login',
    name: 'Connexion',
    component: AccueilConnexion // component venant de views importé en haut
  },
  
  
  // URL PAGE D'INSCRIPTION navbar: signup | component: Signup => views: Inscription
  {
    path: '/groupomania/signup',
    name: 'Inscription',
    component: Inscription
  },
  
  
  // URL PAGE FIL D'ACTUALITE navbar: publications | component: Posts => views: Actualite
  {
    path: '/groupomania/publications',       // URL correspondant au composant
    name: 'Fil d\'actualité',               // Nom de cette route pas obligatoire | champ non obligatoire
    component: Actualite,                  // Composant affiché lorsque le path est trouvé
  },
  
  
  // URL Page de modification des posts => Component: UpdatePost.vue dans view: ModifPost.vue
  // Modif de cette route avec contentPost en dynamique pour afficher l'ancien post dans le textarea dédié de UpdatePost.vue
  {
    path: '/groupomania/publications/:postID/editer',
    name: 'ModifPost',
    component: ModifPost,
    // props: true  // contentPost dynamique sera query URL récupérable dans ce component
  },
  
  
  // URL Page d'édition des commentaires => CreatePost.vue dans view NewComment.vue
  // Récupération dynamique du postID pour y assigner une commentaire => Navigation programmatique
  {
    path: '/groupomania/publications/:postID/commentaire/editer',
    name: 'NewComment',
    component: NewComment
  },
  
  
  // URL PAGE MODIFICATION D'UN COMMENTAIRE PAR SON AUTEUR => Component: UpdateComment.vue dans views: ModifComment.vue
  // Navigation programmatique pour récupérer de manière dynamique le commentID à modifier dans la table comments de la db groupomania
  {
    path: '/groupomania/commentaire/:commentID/modifier',
    name: 'ModifComment',
    component: ModifComment
  },
  
  // URL PAGE profil
  // component: UserAccount => views: profil
  {
    path: '/groupomania/profil/:userID',       // URL correspondant au composant
    name: 'Profil',                           // Nom de cette route pas obligatoire | champ non obligatoire
    component: Profil,                       // Composant affiché lorsque le path est trouvé
  },
  
  // URL page Admin Dashboard
  {
    path: '/groupomania/administrateur',         // URL correspondant au composant
    name: 'AdminDashboard',                     // Nom de cette route pas obligatoire | champ non obligatoire
    component: AdminDashboard,                 // Composant affiché lorsque le path est trouvé
  },

]

const router = new VueRouter({
  
  mode:'history',          // mode:'history' => pour enlever le # de l'URL
  routes
  
})


// export du router vers router-link => component Nav
export default router






