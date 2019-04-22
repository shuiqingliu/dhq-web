<template> 
  <course-instance-detail :is-edit='true'></course-instance-detail>
</template>
<script>
  import CourseInstanceDetail from './components/CourseInstanceDetail'
  export default {
    name: 'updateCourseInstance',
    components: { CourseInstanceDetail }
  }
</script>
<style>
</style>