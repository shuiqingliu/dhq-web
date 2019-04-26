<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="user" :rules="rules" ref="userform" label-width="150px">
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if='!isEdit'>
        <el-input v-model="user.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input v-model="user.phone"></el-input>
      </el-form-item>
      <el-form-item label="用户地址：">
        <el-input v-model="user.address"></el-input>
      </el-form-item>
        
      <el-form-item>
        <el-button type="primary" @click="onSubmit('userform')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('userform')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createUser, getUser, updateUser} from '@/api/userAdmin'
  
  const defaultuser={    
    username: '',
    password: '',
    roles: []
  };
  export default {
    name: 'detail',
    props: {
      isEdit: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        user: {
          username:'fsass',
          password:'',
          phone: '',
          address: ''
          
        },
        allrole:[],
        rules: {
          username: [
            {required: true, message: '请输入品牌名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          password:[
            {required: true, message: '请输密码', trigger: 'blur'},
          ]

        },
      }
    },
    watch:{
      roles(newVal, oldVal){
        this.user.roles = newVal;
        console.log(...newVal)
      }
    },
    created() {
      
      if (this.isEdit) {
        getUser(this.$route.query.id).then(response => {
          this.user = response.data;
        });
        //获取用户对应的角色，然后将对应的选项设置为checked
        getUserRole(this.$route.query.id).then(response =>{
          for(var role in response.data){
            this.checkId.push(role.id)
          }
          console.log(...this.checkId)
        });
      }else{
        this.user = Object.assign({},defaultuser);
      }
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
                updateUser(this.$route.query.id, this.user).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createUser(this.user).then(response => {
                  this.$refs[formName].resetFields();
                  this.user = Object.assign({},defaultuser);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                })
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


