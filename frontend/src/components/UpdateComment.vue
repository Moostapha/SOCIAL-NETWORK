<template>
<div class="createComment">
    
    <div class="form">
        <ValidationObserver v-slot="{ handleSubmit}">
                <!-- <label>{{msg}}</label> -->
            <form @submit.prevent="handleSubmit(updateComment)" method="post" type="submit" enctype="multipart/form-data">
                
                <!-- NOTIF USER VALIDATION CHAMPS FROM -->
                    <AlertNotifValidator v-if="error" 
                        alertType= "alert-danger"
                        alertMsg= 'Erreur ! Vérifiez les informations saisies:'
                        :error="error"
                    />
                <!-- FIN -->
                <label for="commentInputForm" id="commentInputLabel"> {{msg}}</label>
                <validationProvider name="comment" rules="required|alpha_num" v-slot="{ errors }">
                    <textarea 
                        
                        v-model="contentComment"
                        id="commentInputForm"
                        type="text"
                        name="contentComment"
                        class="form-control sm md lg " 
                        placeholder="Votre commentaire..."
                        require="required">
                        
                    </textarea>
                <span>{{ errors[0] }}</span>
                </validationProvider>
                <!-- <input type="hidden" name="commentID" :value="article.id"> -->
                <!-- BOUTONS -->
                    <div class="dispoBtn">
                        
                        <!-- BOUTON DE MODIFICATION DU COMMENTAIRE -->
                            <button @click="updateComment()"
                                type="submit" 
                                class="sm md lg btn btn-outline-primary">
                                Modifier
                            </button>
                        <!-- FIN BOUTON DE MODIFICATION DU COMMENTAIRE -->
                        
                        <!-- BOUTON ANNULER RETOUR SUR PUBLICATIONS -->
                            <!-- <router-link :to="{name:'Fil d\'actualité'}"> -->
                                <button @click="cancelUpdate()" type="button" class="btn btn-outline-danger">
                                    Annuler
                                </button>
                            <!-- </router-link> -->
                        <!-- FIN BOUTON ANNULER RETOUR SUR PUBLICATIONS -->
                    </div>
                <!-- FIN -->
            </form>
        </ValidationObserver>
        
    </div>
    <!-- USER NOTIFS -->
        <FlashMessage></FlashMessage>
    <!-- FIN USER NOTIFS -->
</div>
</template>

<script>
import axios from 'axios';
import AlertNotifValidator from '../components/AlertNotifValidator.vue';

export default {
    components: {
        AlertNotifValidator
    },
    name: 'UpdateComment',
    props: {
        msg: String,
        UpdateComment: String
    },
    
    data() {
        return {
            
            // récupération dynamique du commentID sur commentaire choisi pour modification
            commentID: +this.$route.params.commentID,
            
            // récupération dynamique du contentPost dans l'URL => affichage ancien message dans textarea
            // Saisie nouvelle valeur du commentaire à écrire dans la table comments
            contentComment: this.$route.params.contentComment, 
            
            // récupération du username pour boite de dialogue dynamique pour confirmation
            username: localStorage.getItem("username"), 
            
            // Gestion erreurs champs commentaire+ validation saisie user (regex validator)
            error: ""
        }
    },
    
    methods: {
        
        // FONCTION ENVOYANT LES DATAS SUR LA ROUTE PUT DE MODIFICATION DE comment.js POUR MODIFICATION DE COMMENTAIRE
        updateComment(){
            
            // 1) Préparation des new datas saisies depuis le front dans FormData()
            const formData = new FormData();
                formData.append('contentComment', this.contentComment );
                formData.append('commentID', this.commentID);
            
            // 2) Affichage de notre objet formData dans la console
            console.log(Array.from(formData));
                for(let obj of formData) {
                    console.log(obj);
                }
                // console.log('elements du formdata: ', Array.from(formdata));
            
            //3) Cas d'exception
            // Si fichier non updated par user 
            if (formData.get('contentComment') === 'null') {
                // info user pour confirmation
                confirm(this.username+', aucune modification conserver ce commentaire?')
                // Redirection vers forum
                this.$router.push('/groupomania/publications')
                
            } 
            // sinon on peut passer à la requête axios
            else {
                confirm(this.username+', voulez vous vraiment modifier votre commentaire?')
            }
            
            // requête axios du frontend vers le backend => Récup. dynamique de commentID dans l'URL
            axios.put(`api/comments/${this.$route.params.commentID}/update` , formData)
            .then(response => {
                console.log(response);
                // redirection vers page publications
                this.$router.push('/groupomania/publications');
                // Notif SUCCESS 
                this.flashMessage.show({
                    status: 'success',
                    icon: '../assets/success.png',
                    title: 'SUCCES !!!',
                    message: 'Votre commentaire a bien été modifié !!!'
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
                    message: 'Une erreur est survenue' + error.message
                })
            })
            
            this.contentComment = "";
        },
        
        cancelUpdate(){
            if(confirm(this.username+', abandonner la modification et retourner sur la page Publication ?'))
            this.$router.go(-1)
        }
    },

}
</script>

<style lang="sass" scoped>
    .form
        display: flex
        justify-content: center
        padding: 30vh 0vh 15vh 0vh
        background-image: url('../assets/img3.jpg')
        background-size: cover
        #commentInputLabel
            color: white
            // float: left
            font-size: xx-large
            @media screen and (max-width: 768px)
                font-size: large
        #commentInputForm
            height: 30vh
            width: 100vh
            border-radius: 25px
            margin-top: 3vh
            padding-top: 2vh
            padding-left: 2vh
            @media screen and (max-width: 453px) 
                width: 75vh
                height: 20vh
            @media screen and (max-width: 348px) 
                width: 61vh
                height: 20vh
        span
            color: red
            font-size: medium
        .dispoBtn
            display: flex
            @media screen and (max-width: 426px)
                    font-size: small
                    justify-content: center
            .btn
                margin: 1vh
                font-size: x-large
                @media screen and (max-width: 768px)
                    font-size: medium
                @media screen and (max-width: 426px)
                    font-size: small
                    justify-content: center
</style>