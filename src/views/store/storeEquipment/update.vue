<template> 
  <equipment-instance-detail :is-edit='true'></equipment-instance-detail>
</template>
<script>
  import EquipmentInstanceDetail from './components/EquipmentInstanceDetail'
  export default {
    name: 'updateEquipmentInstance',
    components: { EquipmentInstanceDetail }
  }
</script>
<style>
</style>