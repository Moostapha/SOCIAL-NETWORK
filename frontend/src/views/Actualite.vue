<template>
  <div class="accueil-posts">
    <Posts msg ="MUR DES PUBLICATIONS" :key="componentKey"/>
  </div>
</template>


<script>
// @ is an alias to /src
import Posts from '../components/PostsComments.vue'

// export vers index.js + template du haut
export default {
  name: 'Actualite',
  components: { Posts },
  
  data() {
    return {
      componentKey: 0,
    };
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    }
  },
  created(){
    this.forceRerender()
  }
}
</script>
