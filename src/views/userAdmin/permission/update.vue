<template> 
  <detail :is-edit='true'></detail>
</template>
<script>
  import detail from './components/UserDetail'
  export default {
    name: 'updateUser',
    components: { detail }
  }
</script>
<style>
</style>


