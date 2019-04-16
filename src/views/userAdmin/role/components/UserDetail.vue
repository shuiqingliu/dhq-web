<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="user" :rules="rules" ref="userform" label-width="150px">
      <el-form-item label="角色名：" prop="name">
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="角色描述：">
        <el-input v-model="user.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('userform')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('userform')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createRole, updateRole,getRole} from '@/api/role'

  const defaultuser={    
    name: '',
    pwd: '',
    roles: []
  };
  export default {
    name: 'detail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        user: {
          name:'',
          description:'',
          id: 0
        },
        rules: {
          name: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
        },
        
      }
    },
    
    created() {
      
    },
   
    methods: {
      onSubmit(formName) {
        console.log(this.user)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateRole(this.$route.query.id, this.user).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createRole(this.user).then(response => {
                  this.$refs[formName].resetFields();
                  this.user = Object.assign({},defaultuser);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.user = Object.assign({},defaultuser);
      }
    }
  }
</script>
<style>
</style>


