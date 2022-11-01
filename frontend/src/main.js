import Vue from 'vue'

import App from './App.vue'

import axios from 'axios'

// Ajout de bootstrap by us
import "bootstrap/dist/css/bootstrap.css";

// Plugin vue router 
import router from './router/route'


// CONFIGURATION GLOBALE DE AXIOS (correction erreur reload page qui me donnait un appel de l'API sur localhost 8080)

// Refactoring préfixe URL de l'application
axios.defaults.baseURL = 'http://localhost:3000/';

// Gestion des tokens par axios set dans Login.vue token à la place de AUTH_TOKEN => clé: valeur | token: AUTH_TOKEN
axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem('token'); 


/* Plugin vee-validate pour customer inputs, installation globale => les règles de validation ne sont pas mises par défaut, nous les avons toutes importées*/
import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
Vue.component('ValidationProvider', ValidationProvider);


/* Plugin de vee-validate permettant de soumettre le formulaire qu'APRES validation des champs*/
import { ValidationObserver } from 'vee-validate';
Vue.component('ValidationObserver', ValidationObserver);


// Ajout de vue-flash-message pour user notifs, global setting pour use du component dans toute l'application
import VueFlashMessage from '@smartweb/vue-flash-message';
// import vueFlashMsgCommon from 'node_modules/@smartweb/vue-flash-message/build/vue-flash-msg.common';
Vue.use(VueFlashMessage);


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
