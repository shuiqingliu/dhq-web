<template> 
  <detail :is-edit='false'></detail>
</template>
<script>
  import detail from './components/UserDetail'
  export default {
    name: 'addUser',
    components: { detail }
  }
</script>
<style>
</style>


