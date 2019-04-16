<template> 
  <detail :is-edit='true'></detail>
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


