<template>
<div class="createComment">
    
    <div class="form">
        <ValidationObserver v-slot="{ handleSubmit}">
                <!-- <label>{{msg}}</label> -->
            <form @submit.prevent="handleSubmit(createComment)" method="post" type="submit" enctype="multipart/form-data">
                
                <!-- NOTIF USER VALIDATION CHAMPS FROM -->
                    <AlertNotifValidator v-if="error" 
                        alertType= "alert-danger"
                        alertMsg= 'Erreur ! Vérifiez les informations saisies:'
                        :error="error"
                    />
                <!-- FIN -->
                <label for="commentInputForm" id="commentInputLabel"> {{msg}}</label>
                <validationProvider name="comment" rules="required|alpha_num" v-slot="{ errors }">
                    <textarea v-model="contentComment"
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
                        <button @click="createComment()"
                            type="submit" 
                            class="sm md lg btn btn-outline-success">
                            Publier
                        </button>
                        
                        <!-- BOUTON ANNULER RETOUR SUR PUBLICATIONS -->
                            <router-link :to="{name:'Fil d\'actualité'}">
                                <button type="button" class="btn btn-outline-danger">
                                    Annuler
                                </button>
                            </router-link>
                        <!-- FIN -->
                    </div>
                <!-- FIN -->
            </form>
        </ValidationObserver>
        
    </div>
    <!-- USER NOTIFS -->
        <FlashMessage></FlashMessage>
    <!-- FIN -->
</div>
</template>


<script>
import axios from 'axios';
import AlertNotifValidator from '../components/AlertNotifValidator.vue';

export default {
    
    components: {
        AlertNotifValidator
    },
    
    name: 'CreateComment',
    props: {
        msg: String,
        newComment: String
    },
    
    data () {
        return {
            
            // Infos à poster au back (dans l'ordre des colonnes de ma table comments)
            id_post_commented : +this.$route.params.postID, 
            id_user_auteur_comment: +localStorage.getItem('userID'), 
            username: localStorage.getItem('username'),
            contentComment:"",
            
            // Gestion erreurs 
            error: ""
        }
    },
    
    methods: {
        
        // FONCTION ENVOYANT LES DATAS SUR LA ROUTE CREATE DE comment.js POUR CREATION DE COMMENTAIRE
        createComment(){
            // Préparation des datas envoyés depuis le front dans FormData()
            const formdata = new FormData();
                formdata.append('id_post_commented', this.id_post_commented);
                formdata.append('id_user_auteur_comment', this.id_user_auteur_comment );
                formdata.append('username', this.username );
                formdata.append('contentComment', this.contentComment );
                
                console.log('elements du formdata: ', Array.from(formdata));
            
            
            // Je n'ai pas besoin de préciser postID dans le post axios car j'ai déja tout dans mon formdata
            // Vu que la table comments est séparée et à part de posts
            // Cela aurait été vrai si dans posts j'avais une colonne comment
            // Ici je vais juste remplir les colonnes de comments avec les infos venant du formdata sent par le front
            axios.post('api/comments/create' , formdata)
            .then(response => {
                console.log(response);
                this.$router.push('/groupomania/publications');
                // flashmessage ('Modif réussie !!!!')
                this.flashMessage.show({
                    status: 'success',
                    icon: '../assets/success.png',
                    title: 'SUCCES !!!',
                    message: 'Votre commentaire sur ce post est enregistré !!!'
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
        
    
    }
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