<template>
    <div >
        <UpdatePost msg='Changer votre publication ?'/>
    </div>
</template>


<script>
    // Importation du component 
    import UpdatePost from '../components/UpdatePost'
    // export vers index.js + template du haut
    export default {
        name: 'ModifPost',
        components: { UpdatePost },
    }
</script>

<style lang="sass" scoped>
    // .modification
    //     width: fit-content

</style>