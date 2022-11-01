<template>
    
    <main id='admin'>
        
        <!-- NOTIFICATION USER -->
            <Alert v-if="is_admin === 0"
                alertType="alert-danger" 
                alertMsg= 'Vous ne pouvez pas accéder à cette page !!!'
            />
        <!-- FIN NOTIFICATION USER -->
        
        <!-- NOTIFICATION ADMIN -->
            <Alert v-if="is_admin === 1"
                alertType="alert-success" 
                alertMsg= 'Bonjour Administrateur, bienvenue sur votre Dashboard'
            />
        <!-- FIN NOTIFICATION ADMIN -->
        
        <div class="container">
            
            <!-- LOGO GROUPOMANIA -->
                <div class="logo"></div>
            <!-- FIN LOGO GROUPOMANIA -->
            <div class="space"></div>
            <!-- RENDU CONDITIONNEL SSI ADMIN CONNECTED -->
                <div  v-if="is_admin === 1">
                    
                    <h1>ADMIN DASHBOARD</h1>
                    <ul >
                        <li id="allUsers" v-for="(user, index) in users" :key="index"  class='card mb-4'>
                            <h3>{{user.username}}</h3>
                            <div id="user_avatar_infos">
                                
                                <!-- AVATAR DU USER -->
                                    <img :src=" user.avatar" :alt="user.username" class="card-img" id="userAvatar">
                                <!-- FIN AVATAR DU USER --> 
                                
                                <section id="userInfosStats">
                                    
                                    <!-- INFOS GENERALES DU USER -->
                                    <strong><h4>Informations</h4></strong>
                                    <div class="space"></div>
                                    <p>
                                        <strong class="informations_sub">Email:</strong> 
                                        {{user.email}} <br>
                                        <strong class="informations_sub">Création du compte:</strong><br>
                                        {{dateFormat(user.date_creation_compte)}}<br>
                                        
                                    </p>
                                    <!-- FIN INFOS GENERALES USER -->
                                    
                                    <!-- STATISTIQUES GENERALES USER -->
                                    <strong><h4>Statistiques</h4></strong>
                                    <div class="space"></div>
                                    <p>
                                        Auteur de <strong>{{user.nbre_de_posts}} publication(s)</strong><br>
                                        A commenté <strong>{{user.nbre_de_commentaires}} publication(s)</strong><br>
                                        A réagi à <strong>{{user.nbre_de_reactions}} publication(s)</strong><br>
                                        <!-- Boucle sur [reactions] -->
                                            <em v-for="(reaction, index) in reactions" :key="index">
                                                
                                                <!-- Condition affichage 1 => Affectation du nbre de reactions sur le user auteur si ce like ou dislike existe -->
                                                    <p v-if="reaction.userID === user.userID && reaction.nbre_de_like !== null && reaction.nbre_de_like !== null ">
                                                        Dont <strong>{{reaction.nbre_de_like}} like(s)</strong>
                                                        et <strong>{{reaction.nbre_de_dislike}} dislike(s)</strong><br>
                                                    </p>
                                                <!-- fin -->
                                                
                                                <!-- Condition affichage 2 => Affectation du nbre de reactions sur le user auteur si ce like ou dislike n'existe pas-->
                                                    <p v-if="reaction.userID === user.userID && reaction.nbre_de_like === null && reaction.nbre_de_dislike === null">
                                                        Dont <strong>0 like(s)</strong> 
                                                        et <strong>0 dislike(s)</strong> <br>
                                                    </p>
                                                <!-- fin -->
                                            </em>
                                        <!-- fin -->
                                    </p>
                                <!-- FIN STATS GENERALES USER -->
                                </section>
                            </div>
                            
                            <!-- ACTIVITES RECENTES -->
                                <div class="lastUsersActivities">
                                    <strong><h4>Activités récentes</h4></strong>
                                    <br>
                                    <!-- Publications récentes (texte + image + date) -->
                                        <div id="allRecentPost" >
                                            
                                            <!-- Boucle sur [recentPublications] -->
                                                <div class ="publications" v-for="(recentPublication, index) in recentPublications" :key="index">
                                                    
                                                    <!-- condition affectant publication (texte + image + date la plus récente) à son auteur -->
                                                        <div class="userPublication" v-if="recentPublication.id_user_auteur_post === user.userID">
                                                            
                                                            <!-- texte -->
                                                                <strong><h5>Dernier texte</h5></strong>
                                                                
                                                                <!-- si user a posté une image -->
                                                                <p v-if="recentPublication.last_post">
                                                                    <strong>
                                                                        <em>{{recentPublication.last_post}}</em>
                                                                    </strong> <br> 
                                                                    <small> Publié le {{dateFormat(recentPublication.last_published_date)}}</small>  
                                                                </p>
                                                                
                                                                <!-- sinon -->
                                                                <p v-if="!recentPublication.last_post">
                                                                    Aucun texte de publié
                                                                </p>
                                                            <!-- fin texte -->
                                                            
                                                            <div class="space"></div>
                                                            
                                                            <!-- image -->
                                                                <!-- si user a posté une image -->
                                                                    <figure v-if="recentPublication.last_image">
                                                                        <strong>
                                                                            <h5>Derniere image</h5>
                                                                        </strong>
                                                                        <img :src="recentPublication.last_image" :alt="user.username" class="card-img" id="last_image">
                                                                        <figcaption>
                                                                            Image publiée le {{dateFormat(recentPublication.last_published_date)}}
                                                                        </figcaption>
                                                                    </figure>
                                                                
                                                                <!-- sinon -->
                                                                    <div class="noImage" v-if="!recentPublication.last_image">
                                                                        <strong>
                                                                            <h5>Dernière image</h5>
                                                                        </strong>
                                                                        <p>Aucune image postée par {{user.username}}</p> 
                                                                    </div>
                                                            <!-- fin texte -->
                                                            
                                                        </div>
                                                    <!-- fin condition affectant publication à son auteur -->
                                                    
                                                </div>
                                            <!-- Fin boucle -->
                                        </div>
                                    <!-- FIN Publications récentes (texte + image + date) -->
                                    
                                    <div class="space"></div>
                                    <!-- Commentaires récents -->
                                        <div id="allRecentComment">
                                            
                                            <!-- boucle sur [recentCommentaires] -->
                                                <div class="commentaires" v-for="(recentCommentaire, index) in recentCommentaires" :key="index" >
                                                    
                                                    <!-- Condition affectant le commentaire à son auteur -->
                                                        <div class="userCommentaire" v-if="recentCommentaire.id_user_auteur_comment === user.userID">
                                                            
                                                            <!-- Si le commentaire du user existe -->
                                                            <div class="ifLastComment" v-if="recentCommentaire.last_comment">
                                                                <strong><h5>Dernier commentaire</h5></strong>
                                                                <p>
                                                                    <strong>
                                                                        <em>{{recentCommentaire.last_comment}}</em> 
                                                                    </strong><br>  
                                                                    <small>publié le {{dateFormat(recentCommentaire.last_published_date)}}</small>  
                                                                </p>
                                                            </div>
                                                            
                                                            <!-- sinon -->
                                                            <div class="ifNoLastComment" v-if="!recentCommentaire.last_comment">
                                                                <strong><h5>Dernier commentaire</h5></strong>
                                                                <p>Aucun commentaire pour {{user.username}}</p>
                                                            </div>
                                                        
                                                        </div>
                                                    <!-- Fin Condition affectant le commentaire à son auteur -->
                                                
                                                </div>
                                            <!-- Fin boucle sur [recentCommentaires] -->
                                            
                                        </div>
                                    <!-- Fin Commentaires récents -->
                                </div>
                            <!-- FIN ACTIVITES RECENTES -->
                            
                            <br>
                            
                            <!-- BOUTON DE BANISSEMENT D'UN USER PAR ADMIN-->
                            <button @click="deleteBanUser(user.userID)"
                                type="button" class="btn btn-outline-danger">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            <!-- FIN RENDU CONDITIONNEL SSI ADMIN CONNECTED -->
            
            <!-- RENDU SI ADMIN NON CONNECTED | SI SIMPLE USER -->
                <div v-else>
                    <h1>
                        Accés réservé à l'administrateur !!!
                    </h1>
                </div>
            <!-- FIN RENDU CONDITIONNEL SSI ADMIN CONNECTED -->
        </div>
        
        
        <!-- ADMIN ACTIONS NOTIFS -->
            <FlashMessage></FlashMessage>
        <!-- NOTIFICATION USER -->
        
    </main>
    
</template>


<script>
    
    // import axios
    import axios from 'axios';
    
    // import Alert.vue pour notifications sur page AdminDashboard
    import Alert from '../components/Alert.vue';
    
    export default {
        
        components: {
            Alert
        },
        
        // Export vers views AdminDashboard
        name: 'Admin',
        props: {
            msg: String,
            Admin: String
        },
        
        data() {
            return {
                
                // Récupération statut administrateur pour rendu conditionnel
                is_admin: +localStorage.getItem("is_admin"),
                
                // Affichage infos et stats de tous les users (requête getUsersInfosAndStats() de Administrateurs.js)
                users: [],
                
                // Affichage du nbre de likes et de dislikes par user
                reactions: [],
                
                // Affichage publication récente par user
                recentPublications: [],
                
                // Affichage commentaire récent par user
                recentCommentaires: [],
            }
        },
        
        mounted(){
            
            // Requête Affichage de tous les users avec leurs infos + stats
            axios.get('api/admin/infos')
            .then(response => {
            console.log(response.data);
            this.users = response.data.users;
            })
            .catch((error) => {
            console.log(error);
            });
            
            // Requête Affichage de tous les likes et dislikes de chaque user
            axios.get('api/admin/reactions')
            .then(response => {
            console.log(response.data);
            this.reactions = response.data.reactions;
            })
            .catch((error) => {
            console.log(error);
            });
            
            // Requête Affichage de toutes les dernières publication (incluant texte + image + date de publication) de chaque user
            axios.get('api/admin/lastPost')
            .then(response => {
            console.log(response.data);
            this.recentPublications = response.data.recentPublications;
            })
            .catch((error) => {
            console.log(error);
            });
            
            // Requête Affichage de tous les derniers commentaires de chaque user
            axios.get('api/admin/lastComment')
            .then(response => {
            console.log(response.data);
            this.recentCommentaires = response.data.recentCommentaires;
            })
            .catch((error) => {
            console.log(error);
            })
        },
        
        methods: {
            
            // Fonction requête delete user par l'admin
            deleteBanUser(userID){
                // test pour le postID dynamique
                alert(userID)
                // Message d'avertissement avant destruction
                if(confirm('voulez vous vraiment bannir cet utilisateur du réseau GROUPOMANIA ?'))
                
                //Requêtes axios vers endpoint admin => '/:userID/delete'
                axios.delete(`api/admin/${userID}/delete`)
                .then(response => {
                    console.log(response.data);
                    console.log('button cliked !!!');
                    // notification de réussite avec FlashMessage
                    this.flashMessage.show({
                        status: 'success',
                        icon: '../assets/success.png',
                        title: 'SUPPRESSION REUSSIE !!!',
                        message: 'Utilisateur supprimé avec succés !!!'
                    })
                })
                .catch((error) => {
                    console.log(error);
                    // notif erreur avec flashmessage
                    this.flashMessage.show({
                        status: 'error',
                        icon: 'success',
                        title: 'ERREUR !!!',
                        message: 'Une erreur est survenue ' + error.message
                    })
                })
            },
            
            //fonction qui transforme le format de la date reçu pour un meilleur affichage
            dateFormat(date){                                                       
                const event = new Date(date);
                const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                return event.toLocaleDateString('fr-FR', options);
            },
        },
    }
</script>


<style lang="sass" scoped>
    
    #admin
        background-image: url('../assets/img5.jpg')
        background-size: 100%
        margin-top: 6vh
        padding-top: 12vh    // à baisser sur large écran
        min-height: 90vh    // hauteur minimum au cas ou pas de contenu pour que l'image apparaisse correctement
        display: flex
        flex-direction: column
        @media screen and (max-width: 768px) 
            margin: 0vh
        @media screen and (max-width: 991px) 
            padding-top: 6vh
        // @media screen and (max-width: 1040px) 
        //     min-height: 95vh
        //     padding-top: 16vh
        .container
            flex: 1
            padding-top: 4vh
            padding-bottom: 4vh
            height: fit-content
        h1 
            // color: #51a4fe
            color: white //#ff0000
            font-weight: bold
            background-color: #8785f761  //#8785f7 //black
            margin: auto
            border-radius: 3vh
            @media screen and (max-width: 576px)
                font-size: 2rem
        ul
            display: flex
            flex-wrap: wrap
            justify-content: center
            margin: 5vh 3vh 3vh 3vh
            padding: 2vh 0vh 0vh 0vh
            background-color: #fffc
            
            li
                padding: 2vh
                margin: 1vh
                h3,h4
                    font-weight: bold
                    color: royalblue
                    margin: 0vh
                h4 
                    margin-top: 2vh
                    background-color: #357f7f21
                    border-radius: 4vh
                // strong 
                //     color: royalblue
                h5 
                    color: royalblue
                p 
                    margin: 0vh
                    background-color: azure
                    border-radius: 2vh
                button
                    width: 20%
                    margin: 0vh 0vh 2vh 2vh
                #user_avatar_infos
                    display: flex
                    justify-content: space-around
                    align-items: center
                    #userAvatar
                        width: 45%
                        border-radius: 50%
                        @media screen and (min-width: 990px)
                            width: 20%
                    #userInfosStats
                        width: 50%
                    @media screen and (max-width: 990px)
                        flex-direction: column
                    .space
                        height: 1vh
                    .informations_sub
                        color: royalblue
                #last_image
                    box-shadow: 0px 5px 5px #e0e3ea
                    margin-top: 2vh
                    border-radius: 3vh
                    border: solid 0.5px
                    @media screen and (min-width: 990px)
                        width: 50%
    .logo
        background-image: url('../assets/icon-left-font-monochrome-white.svg')
        background-repeat: no-repeat
        background-position: center
        background-color: #8785f761 //#8785f7   //black
        height: 8vh
        margin: auto
        border-radius: 2vh
        @media screen and (max-width: 508px) 
            display: none
        @media screen and (max-width: 1024px) 
            height: 15vh   
        @media screen and (min-width: 1024px) 
            height: 14vh 
    .space 
        height: 4vh        
</style>