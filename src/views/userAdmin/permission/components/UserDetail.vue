<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="user" :rules="rules" ref="userform" label-width="150px">
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if='!isEdit'>
        <el-input v-model="user.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="用户角色：">
        <el-checkbox-group v-model="user.roles" v-for="role in allrole" :key="role.id">
          <el-checkbox :label="role.name"></el-checkbox>
        </el-checkbox-group>
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
  import {getRoles} from '@/api/role'
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
          roles: []
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
    
    created() {
      getRoles().then(response=>{
        this.allrole = response.data
      })
      if (this.isEdit) {
        getUser(this.$route.query.id).then(response => {
          this.user = response.data;
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


