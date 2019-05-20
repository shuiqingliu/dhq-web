<template> 
  <equipment-type-detail :is-edit='false'></equipment-type-detail>
</template>
<script>
  import EquipmentTypeDetail from './components/EquipmentTypeDetail'
  export default {
    name: 'addEquipmentType',
    components: { EquipmentTypeDetail }
  }
</script>
<style>
</style>