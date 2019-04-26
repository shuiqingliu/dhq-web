<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created(){
      // var notFound = [{path: '*', redirect: '/404', hidden: true}];
      // router.addRoutes(notFound);
    }
  }
</script>

<style>
</style>
