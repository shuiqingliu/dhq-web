<template> 
  <course-instance-detail :is-edit='false'></course-instance-detail>
</template>
<script>
  import CourseInstanceDetail from './components/CourseInstanceDetail'
  export default {
    name: 'addCourseInstance',
    components: { CourseInstanceDetail }
  }
</script>
<style>
</style>