<template>
  <main class="filActualite">
    
    <!-- NOTICATION USER DE CONNEXION REUSSIE -->
    <Alert v-if="user" 
      alertType="alert-success" 
      alertMsg= 'Connexion réussie ! Bienvenue sur votre réseau GROUPOMANIA'
    /> 
    <!-- FIN -->
    
    
    <!-- NOTICATION USER DE CONNEXION ECHOUEE -->
    <Alert v-if="!user" 
      alertType="alert-danger" 
      alertMsg= 'Connexion echouée ! Veuillez vous connecter'
    /> 
    <!-- FIN -->
    
    
    <div class="jumbotron">
      
      <div class="logo"></div>
      
      <div class="postcomment">
        <!-- MESSAGE D'ACCUEIL + MESSAGE BLOQUANT ACCES APERCU APP -->
          <div v-if="user">
            <h1>Bonjour {{username}}</h1>
          </div>
          <div v-else>
            <h1> Accés non autorisé !!!! Contenu non accessible </h1>
          </div>
        <!-- FIN -->
        
        <div class="espacement"></div>
        
        <!-- ERREUR VALIDATOR SUR CHAMP POST -->
          <AlertNotifValidator v-if="error" 
            alertType= "alert-danger"
            alertMsg= 'Erreur ! Vérifiez les informations saisies:'
            :error="error"
          />
        <!-- FIN -->
        
        <div v-if="user" class="textImageSubmit">

          <!-- TEXTAREA + BTN PUBLIER + BTN TELECHARGER FICHIER -->
            <label for="inputpost" id="labelInputPost">Publier du texte?</label>
            <ValidationObserver v-slot="{ handleSubmit}">
              <form @submit.prevent="handleSubmit(createPost)" class="formPost" method="post" enctype="multipart/form-data">
              
                <!--  CHAMP PUBLICATION (POST) => Seuls les champs de formulaires valides sont inclus dans un objet FormData, c'est-à-dire ceux qui portent un nom (attribut name) -->
                  <!-- <label for="inputpost">Que voulez vous dire?</label> -->
                  <div class="addPost">
                    <validationProvider name="publication" rules="required|alpha_num" v-slot="{ errors }">
                      
                      <textarea 
                        v-model="publication.contentPost"
                        name="contentPost"  
                        type="text"
                        id="inputpost"
                        class="form-control sm md lg xl"
                        placeholder="Editer vos posts ici..."
                        rows="2" cols="4"> 
                      </textarea>
                      <span>{{ errors[0] }}</span>
                      
                    </validationProvider>
                  </div>
                <!-- FIN -->
                
                <!-- BOUTONS DE SOUMISSION DES PUBLICATIONS + TELECHARGEMENT DE FICHIER-->
                  <!-- <div class="buttonPost"> -->
                    <!-- BTN PUBLIER DU TEXTE -->
                    
                      <!-- <button @click="createPost()"
                        id="btnPost"
                        method="post"
                        class="sm md lg xl btn btn-primary btnpublier">
                        <i class="far fa-paper-plane"></i>
                        Publier texte
                      </button> -->
                    
                    <!-- FIN -->
              </form>
            </ValidationObserver>
            
            <!-- PREVISUALISATION FICHIER CHOISI PAR USER -->
                  <h4 v-if="url">Prévisualisation du fichier séléctionné:</h4> 
                  <div v-if="url"  id="preview">
                    <img :src="url"/>
                    <button @click="cancelSubmitFile()" 
                      type="button" class="sm md lg xl btn btn-danger">
                        Annuler
                    </button>
                </div>
            <!-- FIN -->
            
            <label>Ajouter un fichier ?</label>
            <div class="buttonPost">

              <!-- CHOISIR UN FICHIER -->
                <input @change="handleFileSelected"
                  type="file"
                  method="post" 
                  style="display: none"
                  ref="fileSelectedInput"
                  class="btnPost form-control-file sm md lg xl btn btn-primary"
                />
                <button @click="$refs.fileSelectedInput.click()" id="btnPost"  
                  class="sm md lg xl btn btn-primary" >
                  Choisir un fichier
                </button>
              <!-- FIN -->  

              <!-- BTN TELECHARGER FICHIER -->
                <!-- <button @click="submitFile()"
                  name="imagePost"
                  id="btnPost"  
                  type = "button"
                  method="post"
                  class="sm md lg xl btn btn-primary form-control-file">
                  <i class="fa fa-download"></i>
                    Publier Fichier
                </button> -->
              <!-- FIN -->
              
              <!-- BTN PUBLIER TEXTE IMAGE TEST POSSIBILITE 2 -->
                <button @click="createPublication()"
                  name="imagePost"
                  id="btnPost"  
                  type = "button"
                  method="post"
                  class="sm md lg xl btn btn-primary form-control-file">
                  <i class="fa fa-download"></i>
                    Publier
                </button>
                <!-- FIN -->
            </div>
            
            <hr class="my-4">
            <h1> {{msg}} </h1>
          <!-- FIN -->
        </div>
        
        <!-- RENDU DYNAMIQUE DES POSTS ET DES COMMENTAIRES-->
          
          <div id="allPosts" v-for="(post, index) in posts" :key="index" class="card mb-5">
            
            <div class="row">
              <div class="col-md-8">
                <div class="card-body">
                  
                  <div class="info">
                    
                    <!-- RENDU DYNAMIQUE ET CONDITIONNELS DES AVATARS (AUTEUR USER AVATAR SUR SON POST) -->
                      <div class="avatar">
                        <!-- boucle sur [users] -->
                          <div class="allUsersForPost" v-for="(user, index) in users" :key="index" >
                            <!-- condition assignant avatar de l'auteur sur son post -->
                              <img class="card-img"  v-if="user.userID === post.id_user_auteur_post" 
                                :src=" user.avatar" 
                                :alt="user.username"
                              >
                            <!-- fin -->
                          </div>
                        <!-- fin -->
                        <!-- AFFICHAGE DYNAMIQUE DU USER AUTEUR DU POST -->
                          <h5 class="card-title">
                            {{ post.username }}
                          </h5>
                        <!-- FIN -->
                      </div>
                    <!-- FIN -->
                    
                    <!-- RENDU DYNAMIQUE  POST + TEXTE + BOUTONS -->
                    <div class="imgPostContentPost">
                      
                      <!-- PUBLICATION IMAGE -->
                        <!-- Condition: apparition de l'image du post que si elle existe dans la bd -->
                          <figure v-if="post.imagePost " class="imgPost">
                            <img :src="post.imagePost" :alt="post.imagePost">
                            <figcaption v-for="(user, index) in users" :key="index"> 
                              <small class="text-muted" v-if="user.userID === post.id_user_auteur_post">
                                Belle image partagée sur Groupomania par {{user.username}}
                              </small>
                            </figcaption>
                            
                          </figure>
                          <figure v-if="post.imagePost === null"> no image</figure>
                        <!-- fin conditionnalité -->
                      <!-- FIN PUBLICATION IMAGE -->
                      
                      <!-- AFFICHAGE CONTENU DU POST + BOUTONS -->
                        <div class="card-text">
                          
                          <!-- IDEE DE RENDU INTERESSANT -->
                            <!-- <figure v-if="post.imagePost"  class="imgPost">
                              <img :src="post.imagePost" alt="" style="width:80%">
                            </figure> -->
                          <!-- FIN IDEE RENDU INTERESSANT -->
                          
                          <!-- TEXTE PUBLICATIONS + BOUTONS COMMENTER LIKE DISLIKE -->
                            <div class="publication">
                              
                              <!-- PUBLICATION TEXTE -->
                                <p>{{ post.contentPost }}</p>
                                <small class="text-muted">
                                  auteur: {{ post.username }} - publié le: {{dateFormat(post.date_creation)}} 
                                </small>
                              <!-- FIN -->
                              
                              <div class="space"></div>
                              
                              <!-- BOUTONS COMMENTER + LIKES | DISLIKE -->
                                <div id="likeThumbsCommenter">
                              
                                <!-- BOUTON COMMENTER UN POST SUR CHAQUE PUBLICATION-->
                                  <router-link :to="{ name: 'NewComment' , params: {postID: post.postID} }">
                                    <button 
                                        id="btnCommenter"
                                        type="button"
                                        class="sm md lg btn btn-outline-primary">
                                        <i type="button"  
                                        class="far fa-comments"></i>
                                        Commenter
                                    </button>
                                  </router-link>
                                <!-- FIN -->
                                
                                <!-- BOUTON LIKE + NOMBRE DE LIKES SUR CHAQUE POST -->
                                  <button @click="likePost(post.postID)"
                                    method="post"
                                    id='btnThumb' 
                                    type="button"
                                    class="sm md lg btn btn-outline-primary"> 
                                    <i class="far fa-thumbs-up"></i>
                                      <!-- boucle sur [likes]  -->
                                        <div class= "allLikes" v-for="(like, index) in likes" :key="index">
                                          
                                          <!-- condition assignant le nbre de like sur son post -->
                                            <span id="like"  v-if="like.postID === post.postID">
                                              {{like.nbre_like}}
                                            </span>
                                          <!-- fin -->
                                          
                                          <!-- affichage par défaut => 0 like si nbre_like = null -->
                                            <span id="like"  v-if="like.nbre_like === null && like.postID === post.postID">
                                                0
                                            </span>
                                          <!-- fin -->
                                          
                                          <!-- affichage mention "j'aime" du user connecté sur les posts qu'il a liké -->
                                            <span id="like" v-if="like.auteur_like === user.userID && like.nbre_like === 1 && like.postID === post.postID">
                                              J'aime
                                            </span>
                                          <!-- fin -->
                                        </div>
                                      <!-- fin -->
                                  </button>
                                <!-- FIN BOUTON LIKE + NOMBRE DE LIKES SUR CHAQUE POST -->  
                                
                                <!-- BOUTON DISLIKE + NOMBRE DE DISLIKE SUR CHAQUE POST -->
                                  <button @click="dislikePost(post.postID)"
                                    method="post"
                                    id='btnThumb' 
                                    type="button"
                                    class="sm md lg btn btn-outline-danger"> 
                                    <i class="far fa-thumbs-down"></i>
                                    <!-- boucle sur [dislikes] -->
                                      <div class= "allDislikes" v-for="(dislike, index) in dislikes" :key="index"> 
                                        
                                        <!-- condition assignant le nbre de dislike sur son post -->
                                          <span id="dislike" v-if="dislike.postID === post.postID" >
                                            {{dislike.nbre_dislike}}
                                          </span>
                                        <!-- fin -->
                                        
                                        <!-- affichage par défaut => 0 like si nbre_like = null -->
                                          <span id="dislike"  v-if="dislike.nbre_dislike === null && dislike.postID === post.postID">
                                            0
                                          </span>
                                        <!-- fin -->
                                        
                                        <!-- affichage mention "je" n'aime pas" du user connecté sur les posts qu'il a disliké (si dislike existe)-->
                                            <span id="dislike" v-if="dislike.auteur_dislike === user.userID && dislike.nbre_dislike === 1 && dislike.postID === post.postID">
                                              Je n'aime pas
                                            </span>
                                        <!-- fin -->
                                        
                                      </div>
                                    <!-- fin -->
                                  </button>
                                <!-- FIN BOUTON DISLIKE + NOMBRE DE DISLIKE SUR CHAQUE POST -->
                                
                              </div>
                              <!-- FIN -->
                            </div>
                          <!-- FIN TEXTE PUBLICATIONS + BOUTONS COMMENTER LIKE DISLIKE -->
                          
                          <!-- BOUTONS UPDATE + DELETE POST -->
                            <!-- 1) RENDU CONDITIONNEL L'ADMIN A ACCES A TOUTE ACTION SUR TOUS LES POSTS -->
                              <div v-if="user.is_admin === 1" class="btnModifSupPublication">
                                
                                <!-- BOUTON MODIFPOST -->
                                  <!-- navigation programmatique pour récupération en dynamique du postID et du texte -->
                                    <router-link :to="{ 
                                      name: 'ModifPost', 
                                      params: {
                                        postID: post.postID,
                                         
                                    }}">
                                      <button 
                                        type="button" 
                                        class="btn btn-outline-success">
                                        <i class="fas fa-pen"></i>
                                      </button>
                                    </router-link>
                                <!-- FIN -->
                                
                                <!-- BOUTON DELETEPOST -->
                                  <button  @click="deletePost(post.postID)" 
                                    type="button" 
                                    class="btn btn-outline-danger">
                                    <i class="fas fa-trash-alt"></i>
                                  </button>
                                <!-- FIN -->
                              </div>
                            <!-- FIN RENDU CONDITIONNEL L'ADMIN A ACCES A TOUTE ACTION SUR TOUS LES POSTS -->
                            
                            <!-- 2) RENDU CONDITIONNEL DES BOUTONS DELETE ET UPDATE: SSI LE USER EST AUTEUR DU POST -->
                              <div v-else-if="userID === post.id_user_auteur_post" class="btnModifSupPublication">
                                
                                <!-- BOUTON MODIFPOST -->
                                  <!-- navigation programmatique pour récupération en dynamique du postID et du texte -->
                                    <router-link :to="{ 
                                      name: 'ModifPost', 
                                      params: {
                                        postID: post.postID,
                                        contentPost: post.contentPost,
                                        imagePost: post.imagePost
                                      }, 
                                      
                                    }">
                                      <button type="button" class="btn btn-outline-success">
                                        <i class="fas fa-pen"></i>
                                      </button>
                                    </router-link>
                                <!-- FIN -->
                                
                                <!-- BOUTON DELETEPOST -->
                                  <button @click="deletePost(post.postID)" 
                                    type="button" 
                                    class="btn btn-outline-danger">
                                    <i class="fas fa-trash-alt"></i>
                                  </button>
                                <!-- FIN -->
                                
                              </div>
                            <!-- FIN RENDU CONDITIONNEL DES BOUTONS DELETE ET UPDATE: SSI LE USER EST AUTEUR DU POST-->
                          <!-- FIN BOUTONS UPDATE ET DELETE -->
                        
                        </div>
                      <!-- FIN AFFICHAGE CONTENU DU POST + BOUTONS (CARD TEXT)-->
                    </div> 
                    <!-- FIN RENDU DYNAMIQUE  POST + TEXTE + BOUTONS-->
                  </div>
                  <!-- FIN CARD INFO -->
                </div>
                <!-- FIN CARD-BODY -->
                
                
                <!-- --------------------------------------------------------------  COMMENTAIRES  --------------------------------------------------------------------------- -->
                <!-- PARTIE COMMENTAIRE DES POSTS -->
                <!-- RENDU DYNAMIQUE DES COMMENTAIRES USERS-->
                
                  <div id="allComments" v-for="(comment, index) in comments" :key="index">
                    <!-- RENDU COMMENT SSI Il EST FAIT SUR CE POST -->
                      
                        <div v-if="comment.id_post_commented === post.postID" class="commentaire">
                          
                          <div class="comment-info-imgAvatar">
                            <!-- RENDUS DYNAMIQUES ET CONDITIONNELS AVATAR AUTEUR COMMENTAIRES -->
                              <div id="allUsers" v-for="(user, index) in users" :key="index" class="imgAvatar">
                                <img class="avatar_commentateur" 
                                v-if="user.userID === comment.id_user_auteur_comment" :src="user.avatar" :alt="user.username">
                              </div>
                            <!-- FIN -->
                            <!-- COMMENTAIRES -->
                              <div class="comment-info">
                                <small class="text-muted">
                                  {{ comment.username }}, le {{ dateFormat(comment.date_creation) }}, a commenté:
                                </small>
                                <p>{{ comment.contentComment }}</p>
                              </div>
                            <!-- FIN -->
                          </div>
                          
                          <!-- ACCES BOUTON DELETE + UPDATE  COMMENT SSI C'EST L'AUTEUR -->
                            <div class="actionOnComment" v-if="comment.id_user_auteur_comment === userID" >
                            
                              <span @click="show= !show">...</span>
                              <!-- MENU DEROULANT DEVOILANT LES ACTIONS (BTNS SUR LE COMMENTAIRE) -->
                                <div class="btnOnComment"  v-if="show">
                                
                                  <!-- BOUTON MODIFICATION COMMENTAIRE PAR USER-AUTEUR -->
                                    <router-link :to="{ 
                                      name: 'ModifComment', 
                                      params: {
                                        commentID: comment.commentID, // récupération dynamique via URL du postID
                                        contentComment: comment.contentComment  // récupération dynamique via URL du contenu du commentaire
                                      } }"
                                    >
                                      <span id="updateComment" class="btn btn-outline-success" aria-hidden="true">
                                        <i class="fas fa-pen"></i>
                                      </span>
                                    </router-link>
                                  <!-- FIN BOUTON MODIFICATION COMMENTAIRE PAR USER-AUTEUR -->
                                  
                                  <!-- BOUTON DELETE COMMENTAIRE PAR USER-AUTEUR -->
                                    <span @click="deleteComment(comment.commentID)" 
                                      id="deleteComment" class="btn btn-outline-danger" aria-hidden="true">
                                      <i class="fas fa-trash-alt"></i>
                                    </span>
                                  <!-- BOUTON DELETE COMMENTAIRE PAR USER-AUTEUR -->
                                
                                </div>
                              <!-- FIN MENU DEROULANT DEVOILANT LES ACTIONS (BTNS SUR LE COMMENTAIRE) -->
                            </div>
                          <!-- FIN ACCES BOUTON DELETE + UPDATE  COMMENT SSI C'EST L'AUTEUR -->
                          
                          
                          <!-- ACCES BOUTON DELETE + UPDATE  COMMENT  SI C'EST L'ADMIN-->
                            <div class="actionOnComment" v-else-if="user.is_admin === 1">
                              <span @click="show= !show">...</span>
                              <div class="btnOnComment"  v-if="show">
                                
                                <span @click="deleteComment(comment.commentID)" 
                                  id="deleteComment" class="btn btn-outline-danger" aria-hidden="true">
                                  <i class="fas fa-trash-alt"></i>
                                </span>
                                </div>
                            </div>
                          <!-- FIN -->
                        </div> 
                      
                    <!-- FIN -->
                  </div>
                <!-- FIN -->
              </div>
            </div>
          </div>
        <!-- FIN -->
      </div>
      
      <!-- USER'S ACTIONS NOTIFS -->
        <FlashMessage></FlashMessage>
      <!-- FIN USER'S ACTIONS NOTIFS -->
    
    </div>
  </main>
</template>


<script>
// Client http axios
import axios from "axios";
// setups global axios
// import axiosConfig from'../axiosConfig.js'
// component pour notififications user
import Alert from '../components/Alert.vue';
// component pour notif erreur des champs invalides (post + comment)
import AlertNotifValidator from '../components/AlertNotifValidator.vue';

export default {
  // Export du component de notif validator dans template 
  components: { 
    // nom donné sera la tag used dans template
    Alert, 
    AlertNotifValidator 
  },
  
  // sera exporté vers views/Actualites.vue
  name: "Posts",
  props: { msg: String },
  
  data() {
    return {
      
      // Statut administrateur => pour rendu conditionnel d'actions spécifiques à l'admin et disparition si user normal (is_admin=0)
      is_admin: 1,
      
      // Faire apparaitre ou disparaitre le bouton like, rajout de v-if = like sur ce btn
      // like: 1,
      
      // data pour state connection
      user: "", 
      
      // infos user connecté + authentifié récupéré depuis localStorage
      username: localStorage.getItem("username"), 
      userID: +localStorage.getItem("userID"),
      
      // fichier image téléchargé
      fileSelected: null, 
      
      // prévisualisation fichier téléchargé
      url: null, 
      
      // GET BACK => FRONT
      // Affichage de tous les users | posts | comments | likes | dislikes => toutes les données des 5 tables (GET from backend)
      
      // Tableau datas table users
      users: [],
      
      // Tableau datas table posts
      posts: [], 
      
      // Tableau datas table comments
      comments: [],
      
      // Tableau datas nbre de like par post
      likes: [], 
      
      // Tableau datas nbre de dislike par post  
      dislikes: [],
      
      // compteur like/dislike
      counter:0,
      
      // POST FRONT => BACK
      // infos à envoyer au backend dans la table posts
      publication: {
        userID:"", // id_user_auteur_post 
        username:"",
        contentPost:"",
        imagePost:"",
      },
      
      // infos à envoyer au backend dans la table comments
      commentaire:{
        id_post_commented:"", // postID
        id_user_auteur_comment:"", // userID
        username:"",
        contentComment:"",
      },
      
      // infos à envoyer au backend dans la table reactions
      reaction:{
        id_post_reacted:"",          // postID liké ou disliké
        id_user_auteur_reaction:"",  // userID auteur de la réaction
        like:"",
        dislike:""
      },
      
      
      // gestion des erreurs de saisie du formulaire + apparition notif user
      error:'',
      
      // montrer actions possibles sur commentaire auteur + admin
      show: false,
      
      // componentKey: 0
    }
    
  },
  
  mounted() {
    
  // Affichage user loggé
    axios.get('api/users/' + this.userID)
    .then(response => {
      console.log(response.data);
      this.user = response.data.user;
    })
    .catch((error) => {
      console.log(error);
    }) 
  
  //Affichage de tous les users 
    axios.get('api/users')
    .then(response => {
      console.log(response.data);
      this.users = response.data.users;
    })
    .catch((error) => {
      console.log(error);
    })
  
  //Affichage de tous les posts 
    axios.get('api/posts/readAll')
    .then(response => {
      console.log(response.data);
      this.posts = response.data.posts;
    })
    .catch((error) => {
      console.log(error);
    })
  
  //Affichage de tous les comments 
    axios.get('api/comments/readAll')
    .then(response => {
      console.log(response.data);
      this.comments = response.data.comments
    })
    .catch((error) => {
      console.log(error);
    })
    
  // Affichage de tous les likes
    axios.get('api/reactions/likes')
    .then(response => {
      console.log(response.data);
      this.likes = response.data.likes
    })
    .catch((error) => {
      console.log(error);
    })
  
  // Affichage de tous les dislikes
    axios.get('api/reactions/dislikes')
    .then(response => {
      console.log(response.data);
      this.dislikes = response.data.dislikes
    })
    .catch((error) => {
      console.log(error);
    })
    
  },
  
  // Formatage des données de formulaire transmis via axios, il faut préciser, traduire les données transmises
  // on a un tableau avec +sieurs types de données différents à envoyer => string, int, images etc....
  // Création objet FormData() sur lequel la méthode append() est appliquée pour ajouter name:
  // FormData => infos createdPost
    
    methods: {
    
    // Fonction createPublication pour création texte +fichier (logique fusionnée)
    createPublication(){
      
      // 1) Récupération userinputs dans formdata
      const formData = new FormData();
      formData.append("userID" , this.userID);
      formData.append("username" , this.username);
      formData.append("contentPost" , this.publication.contentPost );
      formData.append("imagePost" , this.fileSelected ); // si no file la valeur sera null 
      
      // 2) Vérification du formulaire de données dans console
      console.log('PUBLICATION CREATED: ', Array.from(formData));
        for(let obj of formData) {
            console.log(obj);
        }
      
      // 3) Check si file n'existe pas, on va reset sa valeur en '' car elle est par défaut à null (table posts sans null pour imagePost)
      if(formData.get('imagePost') === 'null'){
        formData.set('imagePost', '');
        console.log('Si file est null, reset de sa valeur en: ', formData)
      }
      // ) Envoie du formulaire vers le endpoint 
      axios.post('api/posts/createPublication', formData)
      .then(response => {
        console.log(response);
        
        // rechargement de la page pour affichage nouvelle donnée via axios.get()
        // this.$router.go(0)
        
        // Notif FlashMessage succés
        this.flashMessage.show({
          status: 'success',
          icon: true,
          title: 'PUBLICATION REUSSIE !!!',
          time: 4000,
          message: 'Votre post a été publié avec succés'
        })
        
      })
      .catch((error) => {
        console.log(error);
        
        // Erreurs de validation champ formulaire => 422 lié au middleware validator qui check les formulaires de l'app.
        // this.error = error.response.data.errors;
        
        // notif erreur avec flashmessage
        this.flashMessage.show({
          status: 'error',
          icon: 'success',
          title: 'ERREUR !!!',
          message: 'Une erreur est survenue '+ error.message
        })
      })
    },
    
    
    // FONCTION BOUTON "AJOUTER UN POST" POUR DU TEXTE
    createPost(){
      // Création post texte
     // 1) Récupération des userInputs (données postées) pour les poster au backend
      const formData = new FormData();
      formData.append("userID" , this.userID);
      formData.append("username" , this.username);
      formData.append("contentPost" , this.publication.contentPost );
      
      // 2) Affichage de notre objet formData dans la console
      console.log('POST CREATED: ',Array.from(formData));
        for(let obj of formData) {
            console.log(obj);
        }
      // console.log(Array.from(formData));
      // Cas ou texte non publié
      // 3) envoie des données par requête axios => headers configuré en global dans axiosConfig.js
      axios.post(
        'api/posts/create', // endpoint API createPost
        formData           // Formulaire de datas envoyés
      )
      .then(response => {
        console.log(response.data);
        
        // refreshing page actuelle 
        this.$router.go(0)
        
        // notification de réussite avec FlashMessage
        this.flashMessage.show({
          status: 'success',
          icon: true,
          title: 'PUBLICATION REUSSIE !!!',
          message: 'Votre post a été publié avec succés'
        })
      })
      .catch((error) => {
        console.log(error);
        // Erreurs de validation champ formulaire 
        this.error = error.response.data.errors;
        // notif erreur avec flashmessage
        this.flashMessage.show({
          status: 'error',
          icon: 'success',
          title: 'ERREUR !!!',
          message: 'Une erreur est survenue '+ error.message
        })
      })
      // 4) reset du input post form
      this.publication = "";
    },
    
    
    // Stockage fichier img de l'input possibilité 1 ou logique texte et image séparées
    handleFileSelected(event){
      this.fileSelected = event.target.files[0];
      console.log(event);
      
      // preview image sélectionnée
      const file = event.target.files[0];
      this.url = URL.createObjectURL(file)
    
    },
    
    
    // FONCTION TELECHARGEMENT DE FICHIER IMAGE POUR POST (createImg)
    submitFile(){
      let formData = new FormData();
      formData.append("userID" , this.userID);
      formData.append("username" , this.username);
      formData.append('imagePost', this.fileSelected);
      
      console.log(Array.from(formData));
      for(let obj of formData) {
          console.log(obj);
      }
      // console.log(Array.from(formData));
      
      // si user veut télécharger sans choisir un fichier
      if (formData.get('imagePost') === 'null') {
        alert("Veuillez d'abord sélectionner un fichier")
      }
      
      // sinon, et on peut passer à la request axios, après confirmation
      else {
          //info user pour confirmation
          confirm(this.username+', voulez vous télécharger ce fichier ?')
          
      }
      axios.post('api/posts/uploadImg', formData)
      .then(response => {
        
        console.log('SUCCES: ', response.data);
        
        // refresh page
        this.$router.go(0)
        
        // notification de réussite avec FlashMessage
        this.flashMessage.show({
          status: 'success',
          title: 'TELECHARGEMENT REUSSIE !!!',
          message: 'Votre fichier a été téléchargé avec succés',
          time: 4000
        })
      })
      .catch((error) => {
        console.log('ERREUR: ', error);
         // notif erreur avec flashmessage
        this.flashMessage.show({
          status: 'error',
          title: 'ERREUR !!!',
          time: 4000,
          message: 'Une erreur est survenue ' + error.message
        })
      })
    },
    
    cancelSubmitFile (){
      // refresh page si fuser ne veut pas ce fichier
      this.$router.go(0)
    },
    
    // FONCTION BOUTON SUPPRESSION DE POST PAR SON AUTEUR + ADMIN (régulateur)
    deletePost(postID){
      
      if(confirm(this.username +', voulez vous vraiment supprimer ce post?'))
        axios.delete( `api/posts/${postID}/delete`)
        .then(response => {
          console.log(response.data);
          
          // refresh page
          this.$router.go(0)
          
          // notification de réussite avec FlashMessage
          this.flashMessage.show({
            status: 'success',
            title: 'SUPPRESSION REUSSIE !!!',
            message: 'Votre post a été supprimé avec succés'
          })
        }) 
        .catch((error) => {
          console.log(error);
          // notif erreur avec flashmessage
          this.flashMessage.show({
            status: 'error',
            title: 'ERREUR !!!',
            message: 'Une erreur est survenue' + error.message
          })
        })
    },

    // FONCTION BOUTON DE SUPPRESSION DU COMMENTAIRE PAR SON AUTEUR + ADMIN (régulateur)
    deleteComment(commentID){
      
      if(confirm(this.username+', voulez vous vraiment supprimer ce commentaire ?'))
      axios.delete( `api/comments/${commentID}/delete`)
      .then(response => {
        console.log(response.data);
        
        // refresh page
          this.$router.go(0)
        
        // notification de réussite avec FlashMessage
        this.flashMessage.show({
          status: 'success',
          icon: '../assets/success.png',
          title: 'SUPPRESSION REUSSIE !!!',
          message: 'Votre commentaire a été supprimé avec succés'
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
    
    
    // FONCTION BOUTON LIKE 
    likePost(postID){
      
      //Table likes => likeID PK | userID_auteur_like | postID_liked
      
      // test pour le postID dynamique
      alert(postID)
      
      // Préparation envoie données du formulaire (entrées = lignes table likes)
      const formData = new FormData();
      formData.append('id_post_reacted', postID);
      formData.append('id_user_auteur_reaction', this.userID); // 
      
      console.log(Array.from(formData));
      for(let obj of formData) {
          console.log(obj);
      }
      // console.log(Array.from(formData));
      
      axios.post('api/reactions/like', formData)
      .then(response => {
        console.log(response.data);
        
        // refresh page
        this.$router.go(0)
        
        // Notif reussite
        this.flashMessage.show({
          status: 'success',
          icon: true,
          title: 'ACTION REUSSIE !!!',
          message: 'Votre réaction a bien été enregistrée !!!'
        })
      })
      .catch((error) => {
        console.log(error);
        
        // Notif échec
        this.flashMessage.show({
          status: 'error',
          icon: 'success',
          title: 'ERREUR !!!',
          message: 'Une erreur est survenue ' + error.message
          
        })
      })
    },
    
    // FONCTION BOUTON DISLIKE 
    dislikePost(postID){
      
      // test pour le postID dynamique
      alert(postID)
      
      // Préparation envoie données du formulaire (entrées = lignes table dislikes)
      const formData = new FormData();
      formData.append('id_post_reacted', postID);
      formData.append('id_user_auteur_reaction', this.userID);
      
      // datas envoyés dans console
      console.log(Array.from(formData));
      for(let obj of formData) {
          console.log(obj);
      }
      // console.log(Array.from(formData));
      
      axios.post('api/reactions/dislike' , formData)
      .then(response => {
        console.log(response.data);
        
        // refresh page => Affiche le dislike en rappelant axios.get dans mounted
        this.$router.go(0)
        
        // Notif de réussite
        this.flashMessage.show({
          status: 'success',
          icon: true,
          title: 'ACTION REUSSIE !!!',
          message: 'Votre réaction a bien été enregistrée !!!'
        })
      })
      .catch((error) => {
        console.log(error);
        // Notif échec
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
    
  }
}
</script>


<style scoped lang="sass">
  .filActualite
    margin-top: 2vh
    padding-top: 13vh
    height: fit-content
    display: flex
    flex-direction: column
    .jumbotron
      padding-top: 6vh
      flex: 1
      margin-bottom: 0vh
      background-image: url('../assets/imgPost1.jpg')
      background-size: 100%
      @media screen and (max-width: 508px) 
        min-height: 58vh
      @media screen and (max-width: 1040px) 
        padding-top: 36px
        
      @media screen and (min-width: 1024px)
        padding: 5rem 10rem
      .logo
        margin-top: 10px
        background-image: url('../assets/icon-left-font-monochrome-white.svg')
        background-repeat: no-repeat
        background-position: top
        height: 14vh
        @media screen and (max-width: 536px) 
          display: none
        @media screen and (max-width: 768px) 
          height: 20vh
      h1, h2, label
        color: white
        font-weight: bold
        @media screen and (max-width: 576px)
          font-size: 2rem
      label
        font-size: xx-large
        @media screen and (max-width: 768px)
          font-size: larger
      #labelInputPost
          float: left
          margin-left: 7vh
      h5, h6
        box-shadow: 2px 5px 5px #e0e3ea
        font-weight: bold
      h6 
        padding: 0.6rem
      
      h4 
        color: white
        font-weight: bold
      ul
        list-style-type: none
        padding: 0
      li
        display: inline-block
        margin: 0 10px
      #inputpost
        border-radius: 20px
        padding: 1vh
        padding-left: 3vh
      .posts, .commentaire, li
        display: flex
        flex-direction: column
      // espace nécessaire pour la pic de ce doux visage 
      .espacement
        height: 39vh 
        @media screen and (max-width: 768px)
          height: 6vh
      
      // Partie formulaire de publication + post + upload
      .formPost
        background-color: #b8b8b81c
        padding-bottom: 4vh
        padding-top: 5vh
        border-radius: 8vh
        // margin-top: 2vh
        // display: flex
        // align-item: center
      // div Champs poster publication
      .addPost
        padding: 1px 30px 1px 30px
        margin-top: 1vh
        @media screen and (max-width: 768px)
          margin-top: 0vh
        span
          color: red
      .btnpublier
        margin-top: 3vh
        width: 15%
        border-radius: 4vh
        font-size: large
        font-weight: bold
        @media screen and (max-width: 1041px)
          width: 16%
        @media screen and (max-width: 768px)
          font-size: small
          width: 15%
          border-radius: 2vh
        @media screen and (max-width: 500px)
          font-size: x-small
          width: 20%
          border-radius: 2vh
          padding: 1vh
      // Boutons publier + télécharger 
      .buttonPost
        // display: inline-flex
        display: flex
        justify-content: space-around
        align-items: center
        @media screen and (max-width: 326px)
          display: flex
          flex-direction: column
          margin-top: 0vh
          padding: 0vh 4vh 0vh 4vh
        #btnPost
          width: 20%
          border-radius: 4vh
          font-size: large
          font-weight: bold
          // margin: 1vh
          @media screen and (max-width: 1200px)
            font-size: large
            width: 23%
          @media screen and (max-width: 768px)
            width: 40%
            font-size: larger
            border-radius: 1vh
            @media screen and (max-width: 500px)
              font-size: small
              padding: 1vh
              margin: 2vh
            @media screen and (max-width: 326px)
              width: 60%
          .fa-paper-plane, .fa-download
            font-size: larger
      // preview fileSelected
      #preview
        display: flex
        justify-content: center
        @media screen and (max-width: 768px)
          flex-direction: column
      // style du card PARTIE POST (PUBLICATIONS DES USERS)
      .card
        border: solid, 1px
        box-shadow: 0px 5px 5px 0px 
        border-radius: 20px
        padding-bottom: 4vh
      .row 
        justify-content: space-evenly
      .card-body
        display: flex
        flex: 1
        justify-content: space-between
        padding: 0px
      .info
        flex: 2
      .avatar //div contenant image avatar + nom
        padding: 0vh
        display: flex
        flex-direction: row
        align-items: center
        margin-left: -12vh
        @media screen and (min-width: 1599px)
          margin-left: -10vh
        @media screen and (max-width: 1599px)
          margin-left: -11vh
        @media screen and (max-width: 768px)
          flex-direction: column
          margin-left: 0vh
        // avatarUser
        .card-img
          margin: 2vh 0vh
          flex-shrink: 1
          background-color: #f2f4f6
          box-shadow: 0px 5px 5px #e0e3ea
          border: groove
          border-radius: 100%
          width: 45%
          @media screen and (max-width: 1440px)
            width: 40%
          @media screen and (max-width: 768px)
            width: 35%
        // Username
        .card-title
          margin-top: 2vh
          margin-left: -13vh
          padding: 2vh
          border: groove 0.3px //inset
          border-radius: 2vh
          width: 70%
          @media screen and (min-width: 1599px)
            width: 73%
            margin-left: -7vh
          @media screen and (max-width: 1599px)
            width: 72%
            margin-left: -9vh
          @media screen and (max-width: 768px)
            margin: 0vh 1vh 0vh 1vh
            width: 60%
            margin-left: 0vh
      .imgPost
        box-shadow: 0px 5px 5px #e0e3ea
        margin-top: 2vh
        border-radius: 3vh
        border: solid .5px
        @media screen and (max-width: 768px)
          border: none 
          margin-top: 2vh
        img
          margin: 1vh 0vh 0vh 0vh
          padding: 0vh 1vh
          width: 100%
          border-radius: 2vh
      .imgPost1
        display: none
      .card-text
        margin: 3vh 1vh 3vh 1vh
        padding-left: 2vh
        display: flex
        justify-content: space-between
        border-radius: 4vh
        box-shadow: 0px 5px 5px #e0e3ea
        background-color: white
        border: solid .5px
        align-items: flex-end
        @media screen and (max-width: 768px)
          border: none
        .publication 
          width: 95%
          margin: 0vh 0vh 2vh
          display: flex
          flex-direction: column
          align-items: flex-start
          // margin-bottom: 4vh
          p 
            margin: 1vh
          small
            align-self: center
          .space
            height: 1vh
          #likeThumbsCommenter
            display: flex
            @media screen and (max-width: 440px) 
              display: flex
              flex-direction: column
            .fa-thumbs-up, .fa-thumbs-down
              margin: 0 rem
              font-size: x-large
            // .allLikes
            //   display: flex
            //   flex-direction: row
            #like, #dislike
              font-size: large
            #btnThumb
              padding: 0.5vh
              margin-left: 1vh
              display: flex
              @media screen and (max-width: 440px)
                padding: 0vh
                margin: .5vh 0vh
                padding-top: 1vh
                width: 10vh
            #btnCommenter
              margin-right: 1vh
              @media screen and (max-width: 440px)
                margin-bottom: .5vh
      .btnModifSupPublication
        // display: 
        margin-top: 0vh
        margin-bottom: 1vh
        width: 24%
        .btn
          margin: 1vh
          font-size: large
      //FIN style card
      
      // style PARTIE COMMENTAIRE
      .commentaire
        background-color: #f2f4f6
        box-shadow: 0px 5px 5px #e0e3ea
        margin: 2vh 1vh 0vh 1vh
        border-radius: 4vh
        display: flex
        flex-direction: row
        width: 95%
        //ajouter rules pour devices sur ce width
        @media screen and (max-width: 768px)
          width: 90%
          margin: 2vh 2vh
        .comment-info-imgAvatar
          width: 90%  // à ajuster sur smartphone
          display: flex
          padding-top: 1vh
          // .imgAvatar
          //   @media screen and (max-width: 768px)
          //     width: 15vh
          .avatar_commentateur
            width: 30%
            border-radius: 100%
            padding-bottom: 1vh
            @media screen and (max-width: 768px)
              width: 20%
          .comment-info
            width: 100%
        
        // Boutons action sur commentaire par son auteur + admin
        .actionOnComment
          margin: -1vh 1vh
          font-weight: bolder
          cursor: pointer
          font-size: x-large
          padding: 0vh 1vh 1vh 1vh
        .btnOnComment
          display: flex
          flex-direction: column
        #updateComment,#deleteComment
          margin: 1vh
        .close
          // margin-left: 1vh
          cursor: pointer
          padding: 1vh
          font-size: medium
</style>