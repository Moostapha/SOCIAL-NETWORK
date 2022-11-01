<template>
    <div class="inscriptionSignup">
        <Signup msg=" Créez votre compte"/>
    </div>
</template>


<script>
    // Importation du component Signup
    import Signup from '../components/Signup'
    // export vers index.js + template du haut
    export default {
        name: 'Inscription',
        components: { Signup },
    }
</script>


<!-- Style dans component d'origine SignUp -->
<style>
    
</style>