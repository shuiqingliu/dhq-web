<template> 
  <store-info-detail :is-edit='false'></store-info-detail>
</template>
<script>
  import StoreInfoDetail from './components/StoreInfoDetail'
  export default {
    name: 'updateStoreInfo',
    components: { StoreInfoDetail }
  }
</script>
<style>
</style>