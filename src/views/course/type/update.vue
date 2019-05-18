<template> 
  <course-type-detail :is-edit='true'></course-type-detail>
</template>
<script>
  import CourseTypeDetail from './components/CourseTypeDetail'
  export default {
    name: 'updateCourseType',
    components: { CourseTypeDetail }
  }
</script>
<style>
</style>