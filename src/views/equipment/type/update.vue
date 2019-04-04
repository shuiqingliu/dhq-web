<template> 
  <equipment-type-detail :is-edit='true'></equipment-type-detail>
</template>
<script>
  import EquipmentTypeDetail from './components/EquipmentTypeDetail'
  export default {
    name: 'updateEquipmentType',
    components: { EquipmentTypeDetail }
  }
</script>
<style>
</style>