<template>
<div class="app-container">
    <el-card >
    <el-row>
        <tinymce :width="1270" :height="300"></tinymce>
    </el-row>
    <el-row>
        <el-button type="primary">提交</el-button>
    </el-row>
    </el-card>  
</div>
    
</template>

<script>
    import Tinymce from '@/components/Tinymce'
    export default{
        name: 'news',
        components: {Tinymce}
    }
</script>

<style>

</style>
