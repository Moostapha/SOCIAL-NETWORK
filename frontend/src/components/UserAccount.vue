<template>
    <main class = "useraccount">
        <div class="container" >
            <!-- NOTICATION USER DE CONNEXION ECHOUEE -->
                <Alert v-if="!user" 
                alertType="alert-danger" 
                alertMsg= 'Connexion echouée ! Veuillez vous connecter'
                /> 
            <!-- FIN -->
            <div class="logo"></div>
            <div class="sm md lg xl">
                <!-- RENDU CONDITIONNEL SI USER NON CONNECTE -->
                    <div v-if="!user">
                        <h1 class="noConnexion">
                            Accés impossible !!! Veuillez vous connecter
                        </h1>
                    </div>
                <!-- FIN -->
                <!-- RENDU SI USER CONNECTE: -->
                <div v-else>
                    <div class="card">
                        <div class="card-body">
                            <h2>
                                Profil de {{user.username}}
                            </h2>
                            <div v-if="message" :class="`message ${error ? 'is-danger' : 'is-success'}`" >
                                <div class="message-body"> 
                                    {{message}} 
                                </div>
                            </div>
                            <div class="d-flex flex-column align-items-center text-center">
                                
                                <img :src="user.avatar" 
                                    @click="$refs.fileSelectedInput.click()" 
                                    alt="userPic" 
                                    title="Cliquez ici pour sélectionner une image" 
                                    id="userAvatarPic" class="rounded-circle" ref="fileSelectedInput"
                                >
                                
                                <input @change="handleFile"
                                    type="file"
                                    method="post" 
                                    style="display: none"
                                    ref="fileSelectedInput"
                                    class="btnPost form-control-file sm md lg xl btn btn-primary"
                                    
                                />
                                
                                <!-- PREVISUALISATION FICHIER CHOISI PAR USER -->
                                    <div v-if="url"  id="preview">
                                        <h4>Fichier séléctionné:</h4> 
                                        <img :src="url"/>
                                        
                                            <button @click="cancelUpdateFile(user.userID)" type="button" class="sm md lg xl btn btn-outline-danger">
                                                Annuler
                                            </button>
                                        
                                    </div>
                                <!-- FIN -->
                                <button @click="uploadAvatar(user.userID)" id="chooseAvatarPic" class="sm md lg xl btn btn-primary">
                                    Modifier votre avatar
                                </button>
                                
                                <div class="mt-3">
                                    
                                    <!-- INFOS DU PROFIL -->
                                        <h4 >Infos de votre compte</h4>
                                        <p class="text-secondary mb-1">
                                            Email: {{user.email}}
                                        </p>
                                        <p class="text-secondary mb-1">
                                            Date de création du compte: {{ dateFormat(user.date_creation) }}
                                        </p>
                                    <!-- FIN -->
                                    
                                    <div class="space"></div>
                                    
                                    <!-- BOUTON DEROULANT les options de modification du compte Mettre type="button" pour éviter "form not connected" -->
                                        <div>
                                            <button  v-on:click="show = !show" 
                                                id='btnShow'
                                                type="button" class="btn btn-primary sm md lg xl">
                                                <i class="fas fa-pen"></i> 
                                                Modifier votre profil
                                            </button> 
                                        </div>
                                    <!-- FIN -->
                                    
                                    <div class="space"></div>
                                    
                                    <!-- OPTIONS DE MODIFICATION DU COMPTE -->
                                    <div v-if="show" class="ModifCompte">
                                        
                                        <div class="space"></div> 
                                        
                                        <!-- MESSAGE ERREUR CHAMPS INVALIDES (EXPRESS-VALIDATOR) -->
                                            <AlertNotifValidator v-if="error"
                                                alertType= 'alert-danger'
                                                alertMsg= 'Erreur ! Vérifiez les informations saisies:'
                                                :error="error"
                                            />
                                        <!-- FIN -->
                                        
                                        <!-- CHAMPS UPDATE USERNAME ET PASSWORD -->
                                            <ValidationObserver v-slot="{ handleSubmit}">
                                                <form @submit.prevent="handleSubmit(submit)" class="userInfos">
                                                    <!-- CHAMP UPDATE USERNAME -->
                                                        <!-- <div class="form-group">
                                                            <label for="InputUsername">Nouveau username</label> -->
                                                            <!-- regex supp caractères spéciaux à rajouter dans rules pour protection injections  -->
                                                            <!-- <validationProvider name="username" rules="required|alpha_num" v-slot="{ errors }"> -->
                                                                <!-- 2 way binding grâce à v-model qui remplira data avec userinput -->
                                                                <!-- <input 
                                                                    v-model="updatedUsername"
                                                                    autocomplete="username"
                                                                    type="text"  required="required" 
                                                                    class="form-control" id="InputUsername" 
                                                                    placeholder="Chiffres et lettres uniquement, max 10 caractères"
                                                                /> -->
                                                                <!-- <span>{{ errors[0] }}</span>
                                                            </validationProvider>
                                                        </div> -->
                                                    <!-- FIN -->
                                                    
                                                    <!-- CHAMP UPDATED EMAIL -->
                                                        <div class="form-group">
                                                            <label for="InputPassword">Nouvel email</label>
                                                            <!-- regex supp caractères spéciaux à rajouter dans rules pour protection injections  -->
                                                            <validationProvider name="email" rules="email|required|alpha_num|max_value:10" v-slot="{ errors }">
                                                                <!-- 2 way binding grâce à v-model qui remplira data (objet signup ligne 49) avec input -->
                                                                <input 
                                                                    v-model="updatedEmail"
                                                                    type="email" autocomplete="current-email" required="required" 
                                                                    class="form-control" id="InputOldPassword" placeholder="email@adresse.com"
                                                                />
                                                                <span>{{ errors[0] }}</span>
                                                            </validationProvider>
                                                        </div>
                                                    <!-- FIN -->
                                                    
                                                    <!-- CHAMP UPDATED PASSWORD -->
                                                        <div class="form-group">
                                                            <label for="InputPassword">Nouveau mot de passe</label>
                                                            <!-- regex supp caractères spéciaux à rajouter dans rules pour protection injections  -->
                                                            <validationProvider name="password" rules="required|alpha_num" v-slot="{ errors }">
                                                                <!-- 2 way binding grâce à v-model qui remplira data (objet signup ligne 49) avec input -->
                                                                <input 
                                                                    v-model="updatedPassword"
                                                                    type="password" autocomplete="current-password" required="required" class="form-control" id="InputNewPassword" 
                                                                    placeholder="Chiffres et lettres uniquement, max 10 caractères"
                                                                />
                                                                <span>{{ errors[0] }}</span>
                                                            </validationProvider>
                                                        </div>
                                                    <!-- FIN -->
                                                    
                                                    <!-- POSITION BOUTONS UPDATE(SUBMIT FORMDATA) ET DELETEACCOUNT -->
                                                        <div class='btnUpdateDelete'>
                                                            <!-- Bouton de validation Mettre type="button" pour éviter "form not connected" -->
                                                                <button @click="submitUpdated(user.userID)"
                                                                    id="btnModif" 
                                                                    type="button" class="sm md lg xl btn btn-outline-success">
                                                                    <i class="fas fa-pen"></i> 
                                                                </button>
                                                            <!-- FIN -->
                                                            
                                                            <div class="space"></div>
                                                            <!-- BOUTON SUPPRESSION DE COMPTE mettre en dehors de validationObserver en dessous-->
                                                            <!-- Bouton de validation Mettre type="button" pour éviter "form not connected" -->
                                                                <button @click="deleteAccount(user.userID)" id="btnDelete" type="button" class="sm md lg xl btn btn-outline-danger">
                                                                    <i class="fas fa-trash-alt"></i> 
                                                                </button>
                                                            <!-- FIN -->
                                                        </div>
                                                    <!-- FIN -->
                                                </form>
                                            </ValidationObserver>
                                        <!-- FIN -->
                                        <div class="space"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <FlashMessage></FlashMessage>
    </main>
</template>


<script>
    
    import axios from 'axios'
    // Notifs user + champ de validation des formulaires
    import Alert from '../components/Alert.vue';
    import AlertNotifValidator from '../components/AlertNotifValidator.vue';
    
    export default {
        
        components: {
            Alert,
            AlertNotifValidator
        },
        
        name: 'UserAccount',
        props: {
            msg: String,
        },
        
        data () {
        return {
            
            // Etat de connection pour rendu conditionnel
            user: "",
            
            // Infos user logged récupération dans localStorage et conversion en int avec +
            userID: +localStorage.getItem("userID"),
            username: localStorage.getItem("username"), 
            
            
            file: null, // avatar user
            // prévisualisation fichier téléchargé
            url: null, 
            
            // infos des updates
            // updatedUsername:"",
            updatedEmail:"",
            updatedPassword:"",
            
            // Gestion message d'erreurs des champs de saisie middleware express-validator
            error:"",
            
            message:"",
            
            // état du bouton "modifier votre compte"
            isDisplay: false,
            show: false
        }
    },
    
    created () {
        
        // route dynamique avec id du user loggé en paramètre
        axios.get('api/users/'+ this.userID)
        .then(response => {
            console.log(response.data)
            this.user = response.data.user;
        })
        .catch((error) => {
            console.log(error);
        })
    },
    
    
    methods: {
        
        handleFile(event){
            
            // Affectation et récupération du fichier
            this.file= event.target.files[0];
            console.log(event);
            
            // preview image sélectionnée
            const file = event.target.files[0];
            this.url = URL.createObjectURL(file)
        },
        
        // FONCTION DE CHARGEMENT DE FICHIER USER
        uploadAvatar(userID) {
            
            // 1) Récupération des userInputs (données postées) pour les poster au backend
            const fileUploaded = new FormData();
            fileUploaded.append('avatar', this.file);
            fileUploaded.append('userID', this.userID);
            
            // 2) Affichage de notre objet formData dans la console
            console.log(Array.from(fileUploaded));
            for(let obj of fileUploaded) {
                console.log(obj);
            }
            
            // 3) Gestion des erreurs éventuelles et boite de dialogue user
            
            // Affichage dans console de la valeur de avatar
            console.log('Valeur de avatar: ',fileUploaded.get('avatar'));
            
            // si fichier non sélectionné par user
            if (fileUploaded.get('avatar') === 'null') {
                
                // info user
                alert("Veuillez sélectionner un fichier en cliquant sur votre avatar")
                
            }
            // sinon, et on peut passer à la request axios
            else {
                
                //info user pour confirmation
                confirm(this.username+', voulez vous télécharger ce fichier ?')
                
            }
            
            
            // 4) Requête PUT vers serveur
            axios.put(`api/users/${userID}/updateAvatar`, fileUploaded, {
                headers: {
                    // mettre header pour que le front configure les infos correctement pour le backend
                    'content-type': 'multipart/form-data',
                    'Authorization': 'Bearer '+ localStorage.getItem('token'),
                }
            })
            .then(response => {
                console.log(response.data);
                
                // refresh de la page
                this.$router.go(0);
                
                 // notification de réussite avec FlashMessage
                this.flashMessage.show({
                    status: 'success',
                    title: 'MODIFICATION AVATAR REUSSIE !!!',
                    message: 'Votre image de profil a été modifiée avec succés'
                })
                this.message = 'Fichier téléchargé';
                this.error = false;
                console.log('clicked');
            })
            .catch((error) => {
                console.log(error);
                this.flashMessage.show({
                    status: 'error',
                    title: 'ERREUR !!!',
                    message: 'Une erreur est survenue ' + error.message
                })
                this.message = 'Un erreur est survenue';
                this.error = true;
            })
            
            // reset champ file
            this.file ="";
        },
        
        
        // Fonction submitUpdated des updatedDatas
        submitUpdated(userID) {
            
            // 1) Récupération des données à poster au backend
            const dataPosted = new FormData();
            // dataPosted.append('username', this.updatedUsername);
            dataPosted.append('email', this.updatedEmail);
            dataPosted.append('password', this.updatedPassword);
            dataPosted.append('userID', this.userID);
            
            // 2) Affichage de notre objet formData dans la console
            console.log(Array.from(dataPosted));
            for(let obj of dataPosted) {
                console.log(obj);
            }
            
            // boite de dialogue pour confirmation
            if(confirm(this.username +', voulez vous modifier vos informations?'))
            
            // 3) Requête put axios vers endpoint express.js
            axios.put(`api/users/${userID}/updateInfo`, dataPosted)
            .then(response => {
                console.log(response.data);
                
                // refresh de la page
                this.$router.go(0)
                
                // notification de réussite avec FlashMessage
                this.flashMessage.show({
                    status: 'success',
                    // icon: '../assets/success.png',
                    title: 'MODIFICATION REUSSIE !!!',
                    message: 'Infos du profil modifiés avec succés',
                    time: 3000
                })
            })
            .catch((error) => {
                console.log(error);
                this.error = error.response.data.errors;
                // notif erreur avec flashmessage
                this.flashMessage.show({
                    status: 'error',
                    icon: 'success',
                    title: 'ERREUR !!!',
                    message: 'Une erreur est survenue, veuillez recommencer plus tard' + error.message
                })
            })
            
            // 4) reset inputs
            // this.updatedUsername = "";
            this.updatedEmail = "";
            this.updatedPassword= "";
        },
        
        
        // Fonction qui supprime le compte user
        deleteAccount(userID) {
            if(confirm(this.username+', voulez vous vraiment supprimer votre compte?'))
                axios.delete(`api/users/${userID}/delete`)
                .then(response => {
                    console.log(response.data);
                    console.log('button cliked !!!');
                    // redirection vers page signup
                    this.$router.push('/groupomania/signup');
                    // notification de réussite avec FlashMessage
                    this.flashMessage.show({
                        status: 'success',
                        icon: '../assets/success.png',
                        title: 'SUPPRESSION DU COMPTE REUSSIE !!!',
                        message: 'Votre compte a été supprimé avec succés'
                    })
                })
                .catch((error) => {
                    console.log(error);
                    // notif erreur avec flashmessage
                    this.flashMessage.show({
                        status: 'error',
                        icon: 'success',
                        title: 'ERREUR !!!',
                        message: 'Une erreur est survenue' + error.message
                    })
                })
        },
        
        // Fonction cancel Update + refresh page
        cancelUpdateFile(){
            this.$router.go(0)
        },
        
        // fonction qui transforme le format de la date reçu pour un meilleur affichage
        dateFormat(date){                                                       
            const event = new Date(date);
            // const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
            return event.toLocaleDateString('fr-FR', options);
        },
    },   
}
</script>


<style lang="sass" scoped>
.useraccount
    // background-color: #42b7b9
    padding-top: 16vh
    padding-bottom: 3vh
    // min-height: 97vh
    display: flex
    flex-direction: column
    background-image: url('../assets/useraccount.jpg')
    background-size: cover
    @media screen and (max-width: 991px) 
        padding-top: 6vh
    @media screen and (max-width: 1040px) 
        min-height: 95vh
        padding-top: 10vh
    .logo
        background-image: url('../assets/icon-left-font-monochrome-white.svg')
        background-repeat: no-repeat
        background-position: top
        height: 14vh
        margin-top: 3vh
        @media screen and (max-width: 508px) 
            display: none
        @media screen and (max-width: 768px) 
            height: 20vh
            margin-top: 1vh
    .container
        flex: 1
        padding-top: 4vh
        padding-bottom: 4vh
        height: fit-content
        @media screen and (max-width: 426px)
            padding-top: 4vh
        h1
            color: white
            font-weight: bold
        .noConnexion
            color: white
            @media screen and (max-width: 576px)
                font-size: 2rem
        h2
            font-weight: 800
            color: royalblue
        h4 
            color: #007bff
            font-weight: 700
        .card
            margin-top: 4vh
            padding-top: 5vh
            box-shadow: 0px 15px 15px 0px 
            border-radius: 20px
            background-color: #ffffffd4
            label
                font-weight: bold
                color: royalblue
                // color: #42b7b9
                display: block
                float: left
            span
                color: red
            .space
                height: 3vh 
                width: 2vh
            .userInfos // taille formulaire
                @media screen and (min-width: 768px)
                    width: 100vh
            ul
                margin-top: 1rem
                margin-bottom: 1rem
                list-style: none
                padding: 0
            #userAvatarPic // avatar img
                width: 200px
                border: solid 2px
                cursor: pointer
                opacity: 1
                &:hover
                    opacity: 0.9
                    border: solid 1px
                    box-shadow: 0px 5px 5px
                    background: royalblue
                @media screen and (max-width: 426px)
                    width: 130px
                @media screen and (max-width: 768px)
                    font-size: small
            #preview
                display: flex
                flex-direction: column
            #chooseAvatarPic
                margin-top: 2vh
                @media screen and (max-width: 768px)
                    font-size: small
            #btnShow
                // width: 30vh
                @media screen and (max-width: 768px)
                    font-size: small
            #formFileLg
                margin-right: 1vh
            #uploadInputBtn
                display: inline-flex
                justify-content: space-between
                align-items: center
            .btnUpdateDelete
                display: flex
            #btnUpload, #btnModif, #btnDelete
                width: fit-content
                padding: 0.5vh
                height: 7vh
                width: 10vh
</style>