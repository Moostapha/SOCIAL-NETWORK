<template>
    <div class="createComment">
        <UpdateComment msg='Modifier votre commentaire:'/>
    </div>
</template>


<script>
    // Importation du component 
    import UpdateComment from '../components/UpdateComment';
    // import AlertNotifValidator from '../components/AlertNotifValidator.vue';
    // export vers index.js + template du haut
    export default {
        name: 'ModifComment',
        components: { UpdateComment},
    }
</script>