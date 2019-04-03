<template> 
  <detail :is-edit='false'></detail>
</template>
<script>
  import detail from './components/UserDetail'
  export default {
    name: 'updateRole',
    components: { detail }
  }
</script>
<style>
</style>


