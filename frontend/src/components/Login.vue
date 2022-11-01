<template>
    <div class="login">
        
        <!-- <div class="logo"></div> -->

        <div class="container">
            
            <transition></transition>
            
            <h1>SOCIAL NETWORK</h1>
            <h2>{{ msg }}</h2>
            <AlertNotifValidator v-if="error" 
                alertType= "alert-danger"
                alertMsg= 'Erreur ! Vérifiez les informations saisies:'
                :error="error"
            />

            <ValidationObserver v-slot="{ handleSubmit}">

                <form @submit.prevent="handleSubmit(submit)" class="sm md lg xl"> <!-- Ajout de l'eventlistener (fonction submit ligne) avec .prevent-->
                    <i class="far fa-user"></i>
                    <!-- CHAMP EMAIL -->
                    <div class="form-group">
                        <label for="InputEmail">Adresse Email</label>
                        <!-- regex email à rajouter dans rules pour protection injections  -->
                        <validationProvider 
                            name="email" 
                            rules="email|required" 
                            v-slot="{ errors }">  
                            <!-- 2 way binding grâce à v-model qui remplira data (objet signup ligne 49) avec input -->
                            <input 
                                v-model="email"
                                type="email" autocomplete="current-email" required="required" class="form-control " 
                                id="InputEmail" aria-describedby="emailHelp" placeholder="email@adresse.com"
                            />
                            <span>{{ errors[0] }}</span>
                        </validationProvider>
                    </div>

                    <!-- CHAMP PASSWORD -->
                    <div class="form-group">
                        <label for="InputPassword">Mot de passe</label>
                        <!-- regex supp caractères spéciaux à rajouter dans rules pour protection injections  -->
                        <validationProvider 
                            name="password" 
                            rules="required|alpha_num" 
                            v-slot="{ errors }">
                            <!-- 2 way binding grâce à v-model qui remplira data (objet signup ligne 49) avec input -->
                            <input 
                                v-model="password"
                                type="password" autocomplete="current-password" required="required" class="form-control" id="InputPassword" 
                                placeholder="Chiffres et lettres uniquement, max 10 caractères"
                            />
                            <span>{{ errors[0] }}</span>
                        </validationProvider>
                    </div>
                    
                    <!-- BOUTON CONNEXION  Mettre type="button" pour éviter "form not connected" -->
                    <div>
                        <button @click="submit" 
                            type="button" class="btn btn-primary">
                            Connexion
                        </button>
                    </div>
                    
                    <br>
                    
                    <!-- Si compte inexistant redirection vers page Signup pour inscription -->
                    <small>Vous n'êtes pas encore inscrit ?
                        <router-link :to="{name: 'Inscription'}">
                            inscrivez-vous ici
                        </router-link>
                    </small>
                    
                </form>
            </ValidationObserver>
            <FlashMessage></FlashMessage>
        </div>
    </div>
</template>


<script>

    // Librairie pour requetes vers (POST) et venant (GET) de l'API
    import axios from'axios'
    import AlertNotifValidator from './AlertNotifValidator.vue'
    // export de ce component Login vers le component /view/Connexion
    export default {
        name: 'Login',
        props: {msg: String,},
        
        components: {
        AlertNotifValidator
        },
        
        data () {
            return {
                // Inputs form login
                email:"",
                password:"",
                
                // Gestion des erreurs inputs forms par express-validator + apparition notif user
                error:"",
            }
        },
        
        
        methods: {
            
            // Fonction de soumission du formulaire
            submit() {
                
                // récupération des valeurs d'inputs (email | password)
                const dataPosted = {
                    email: this.email,
                    password: this.password,
                }
            
                // pour requete post, axios prend 3 arguments => axios.post('URL endpoint', data, axiosConfig ou headers)
                // Nous postons ces datas vers le endpoint pertinent
                axios.post('api/users/login', dataPosted)
                .then(response => {
                    
                    //on vérifie les éléments de la réponse
                    console.log(response.data);
                    
                    // On récupere et on enregistre le token donné par la fonction login du backend (ctler/user.js)
                    localStorage.setItem('token', response.data.USER_AUTH_TOKEN);
                    
                    // récupération du userID côté client qui est un String qu'il faut transformer en int
                    localStorage.setItem('userID', response.data.userID );
                    
                    // récupération du username côté client
                    localStorage.setItem('username', response.data.username);
                    
                    // récupération statut administrateur user logged
                    localStorage.setItem('is_admin', response.data.is_admin);
                    
                    // redirection vers route fil d'actualité
                    this.$router.push('/groupomania/publications');
                    
                    // flashmessage ('Connexion réussie !!!!')
                    // this.flashMessage.show({
                    //     status: 'success',
                    //     icon: '../assets/success.png',
                    //     title: 'CONNEXION REUSSIE !!!',
                    //     message: 'Compte authentifié'
                    // })
                    
                    
                })
                .catch((error) => {
                    // récupération de la réponse du middleware validator.js validation des champs de saisie des formulaires
                    // this.error linked a error dans data et à v-if error dans render template
                    this.error = error.response.data.errors; //.errors at the end à cause du format réponse dans middleware express-validator
                     // notif user avec flashmessage
                    this.flashMessage.show({
                        status: 'error',
                        icon: 'success',
                        title: 'ERREUR !!!',
                        message: 'Une erreur est survenue' + error.message
                    })
                })
            },
            
            // Fonction close alert
            closeNotification(){
                document.getElementsByClassName('alert')[0].style.display='none';
            }
            
        }
    }
</script>



<style lang="sass" scoped>
.login
    padding-top: 14vh
    background-image: url('../assets/socialNetwork.jpg')
    background-size: cover // ou taille en %
    background-position: center
    padding-bottom: 15vh
    
    @media screen and (max-width: 1024px) 
        margin-top: 0vh
        padding-top: 0vh
    .container
        padding-top: 6vh
        // background-image: url('../assets/social1.jpg')
        @media screen and (max-width: 1024px) 
            padding-top: 20vh
    .fa-user
        font-weight: 1
        font-size: 11vh
        margin: 2vh
        color: royalblue
        // color: #42b7b9
    h1,h2
        font-size: 2em
        color: #fafafa //royalblue//#fcfcfc
        font-weight: 800
        // background-color: royalblue
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
        background-color: #ffffffd4 //#007bff
        box-shadow: 0px 15px 15px 0px 
        border-radius: 20px
        label
            font-weight: bold
            color: royalblue
            font-size: x-large
            // color: #42b7b9
        span 
            color: red
</style>

