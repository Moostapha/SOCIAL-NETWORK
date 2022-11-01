<template>
  
    <div id="app">
      <NavHeader/>
      <router-view />
      <AppFooter/>
    </div>
  
</template>

<script>
  import NavHeader from './components/NavHeader'
  import AppFooter from './components/AppFooter'
  export default {
    name:'App',
    components: {
      NavHeader,
      AppFooter
    },
  }
</script>

<style lang="sass">
  #app 
    font-family: Avenir, Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    text-align: center
    height: 100%
    width: 100%
</style>



