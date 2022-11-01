<template>
<div id="validatorNotif" v-bind:class="alertType" role= "alert">
    <strong> {{ alertMsg }} </strong> 
    <button
        @click="closeBox"
        type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
    <ul>
        <li v-for="(errorValidator, index) in error" :key="index">
            {{errorValidator.msg}}
        </li>
    </ul>
</div>
</template>


<script>
export default {
    name: 'AlertNotifValidator',
    // props: ['alertType', 'alertMsg', 'errorValidatorMsg'] ,
    
    props: {
        alertType: String,
        alertMsg: String,
        error: Array
        // la props error est le tableau des erreurs de champs de form post défini ds validator.js
        // Cette props est transmise dans le component parent PostsComments qui recoit les datas du tableau
        // la clé qui nous intéresse est .msg d'ou l'expression moustache ligne 13
        // Pour le rendu ds PostsComments, il faut binder error avec l'error définie ds data
    },
    
    methods: {
        closeBox(){
            console.log('clicked');
            document.getElementById('validatorNotif').style.display='none';
        },
        
        // FONCTION DISPARITION ALERT APRES UN DELAI
        // alertFade(){
        //     const Closed = document.getElementById('validatorNotif');
        //     setTimeout(
        //         () => {
        //             Closed.style.display = 'none'
        //         }, 4000
        //     )
        // }
    }
}
</script>

<style lang="sass" scoped>
    #validatorNotif
        padding: 0.75rem 1.25rem
        border-radius: 4vh
        ul
            list-style-type: none
            padding: 0
</style>






