<template> 
  <course-type-detail :is-edit='false'></course-type-detail>
</template>
<script>
  import CourseTypeDetail from './components/CourseTypeDetail'
  export default {
    name: 'addCourseType',
    components: { CourseTypeDetail }
  }
</script>
<style>
</style>