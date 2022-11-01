<template>
    <div class="signup">

        
        <div class="container">
            
            <h1>SOCIAL NETWORK</h1>
            <h2>{{ msg }}</h2>
            
            <!-- MESSAGES NOTIFICATION -->
            
            <!-- MESSAGE ECHEC -->
            <AlertNotifValidator v-if="error" 
                alertType= "alert-danger"
                alertMsg= 'Erreur ! Vérifiez les informations saisies:'
                :error="error"
            />

            <!-- Formulaire avec 3 champs : username | email | password -->
            <ValidationObserver v-slot="{ handleSubmit}">
                
                <form @submit.prevent="handleSubmit(submit)">  <!-- Ajout de l'eventlistener(fonction submit ligne 60) avec .prevent pour empêcher comportement par défaut -->
                <i class="far fa-user"></i>
                    <div class="form-group">
                        <label for="InputUsername">Username</label>
                        <!-- Validation de champ avec vee-validate-->
                        <validationProvider name="Username" rules="required|alpha_num|max_value:10" v-slot="{ errors }">
                            <!-- 2 way binding avec v-model qui remplira data (objet signup ligne 55) avec input -->
                            <input v-model="username"  
                                type="text"
                                id="InputUsername" 
                                method="post"
                                class="form-control" 
                                placeholder="Nom ou pseudo" 
                                autocomplete="current-password"
                                aria-describedby="emailHelp"
                                required="required"
                            />
                            <span>{{ errors[0] }}</span>
                        </validationProvider>
                    </div>
                    
                    <div class="form-group">
                        <label for="InputEmail">Adresse Email</label>
                        <!-- Validation de champ avec vee-validate-->
                        <validationProvider name="email" rules="email|required|alpha_num|max_value:10" v-slot="{ errors }">
                            <!-- 2 way binding avec v-model qui remplira data (objet signup ligne 55) avec input -->
                            <input v-model="email" 
                                type="email" required="required" class="form-control" id="InputEmail" 
                                aria-describedby="emailHelp" placeholder="email@adresse.com" method="post"
                            />
                            <span>{{ errors[0] }}</span>
                        </validationProvider>
                    </div>
                    
                    <div class="form-group">
                        <label for="InputPassword">Mot de passe</label>
                        <!-- Validation de champ avec vee-validate-->
                        <validationProvider name="password" rules="required|alpha_num|max_value:10" v-slot="{ errors }">
                            <!-- 2 way binding avec v-model qui remplira data (objet signup ligne 55) avec input -->
                            <input v-model="password" 
                                type="password" autocomplete="current-password" required="required" class="form-control" id="InputPassword" 
                                aria-describedby="emailHelp" placeholder="Chiffres et lettres uniquement, max 10 caractères" method="post"
                            />
                            <span>{{ errors[0] }}</span>
                        </validationProvider>
                    </div>
                    
                    <!-- Bouton de soumission du formulaire Mettre type="button" pour éviter "form not connected" -->
                    <div>
                        <button v-on:click="submit" 
                            type="button" class="btn btn-primary">
                            Inscription
                        </button>
                    </div>
                    
                    <br>
                    
                    <!-- Si compte existant redirection vers page login pour connexion directe -->
                    <small>Vous avez déjà un compte ?
                        <router-link :to="{name: 'Connexion'}">
                            connectez-vous ici
                        </router-link>
                    </small>
                </form>
                
            </ValidationObserver>
            <FlashMessage></FlashMessage>
        </div>
    </div>
</template>


<script>

    // Librairie pour les API calls
    import axios from 'axios'
    // Validation champs formulaire
    import AlertNotifValidator from './AlertNotifValidator.vue'
    // export de ce component vers la view Inscription
    export default {
        name: "Signup",
        props: { msg: String, },
        
        components: {
        AlertNotifValidator
        },
        
        data () {
            return {
                // inputs formulaire
                username: "",
                email: "",   
                password: "",
                
                // gestion des erreurs de saisie du formulaire + apparition notif user
                error: "",
            }
        },
        
        methods: {
        
        // fonction eventListener submit sur le click => promise avec appel qui nécessite une attente (await)
            submit() {
                
                const dataPosted = {
                    username: this.username,
                    email: this.email,
                    password: this.password
                }
                // Affichage données sent ds console
                console.log(dataPosted);
                
                // pour requete post, axios prend 3 arguments => axios.post('URL endpoint', data, axiosConfig ou headers)
                // adresse url refactoré avec axiosConfig.js
                axios.post('api/users/signup', dataPosted) // Ma route n'est pas reconnue => erreur 404 !!!
                .then(response => {
                    console.log(response);
                    // redirection vers route login
                    this.$router.push('/groupomania/login');
                    
                    // flashmessage ('Création compte réussie !!!!')
                    this.flashMessage.show({
                        status: 'success',
                        icon: '../assets/success.png',
                        title: 'SUCCES !!!',
                        message: 'Création compte réussie'
                    })
                })
                .catch((error) => {
                    console.log(error);
                    this.error = error.response.data.errors;
                    const errorArray = new Array(error.response.data);
                    console.log('Premier élément errorArray:',errorArray[0].errors[0].msg) //Champs Username requis
                    // notif user avec flashmessage
                    this.flashMessage.show({
                    status: 'error',
                    icon: 'success',
                    title: 'ERREUR !!!',
                    message: 'Une erreur est survenue' + error.message
                    })
                })
            },
        },
    }
</script>


<style lang="sass" scoped>
.signup
    height: fit-content
    background-image: url('../assets/img1.jpg')
    background-size: cover
    background-position: center
    padding-bottom: 15vh
    .container
        padding-top: 20vh
        
    .fa-user
        // color: #42b7b9
        font-size: 11vh
        margin: 2vh
        color: royalblue
    h1, h2
        font-size: 2em
        color: white //#007bff
        font-weight: 800
        @media screen and (max-width: 576px)
            font-size: 1.5rem
    ul
        margin-top: 1rem
        margin-bottom: 1rem
        list-style: none
        padding: 0
    form
        max-width: 100vh
        padding: 15px 30px 30px 30px
        margin: auto
        margin-top: 3vh
        background-color: #ffffffd4
        box-shadow: 0px 15px 15px 0px 
        border-radius: 20px
        span 
            color: red
        label
            // color: #42b7b9
            font-weight: bold
            color: royalblue
            font-size: x-large
    .btn btn-primary
        opacity: 0.6
        transition: 0.3s
        &:hover
            opacity: 1
</style>
