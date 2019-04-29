<template> 
  <equipment-instance-detail :is-edit='false'></equipment-instance-detail>
</template>
<script>
  import EquipmentInstanceDetail from './components/EquipmentInstanceDetail'
  export default {
    name: 'addEquipmentInstance',
    components: { EquipmentInstanceDetail }
  }
</script>
<style>
</style>