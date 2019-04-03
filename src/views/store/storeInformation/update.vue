<template> 
  <brand-detail :is-edit='true'></brand-detail>
</template>
<script>
  import BrandDetail from './components/BrandDetail'
  export default {
    name: 'updateStoreInfo',
    components: { BrandDetail }
  }
</script>
<style>
</style>