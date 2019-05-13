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
      <el-form-item label="用户状态：">
        <el-radio-group v-model="user.status">
          <el-radio :label="0">无效</el-radio>
          <el-radio :label="1">有效</el-radio>
          
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户角色：">
        <el-select
          v-model="checkedIds"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择用户角色">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="用户邮箱：">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <!-- <el-form-item label="用户所属机构：">
          <el-select v-model="user.organizationId" placeholder="请选择">
            <el-option
              v-for="item in organizations"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
         
        </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit('userform')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('userform')">重置</el-button>
        <el-button @click="onCancel" >取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createUser, getUser, updateUser} from '@/api/userAdmin'
  import {getRoles,addUserRole,updateUserRole} from '@/api/role'
  import {fmtRoles} from '@/utils/utils'
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
        checkedIds:[],
        organizations: [
          {
            value: ''
          }
        ],
        options: [
          {
            value: '系统管理员',
            label: '系统管理员'
          },
          {
            value: '维修人员',
            label: '维修人员'
          }
        ],
        userRole:{
          userId: 1,
          roleIds:''
        },
        user: {
          username:'fsass',
          password:'',
          phone: '',
          address: '',
          status: 1,
          roleIds:[],
          email: ''
        },
        allrole:[],
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          password:[
            {required: true, message: '请输密码', trigger: 'blur'},
          ]

        },
      }
    },
    
    created() {
      this.userRole.userId = this.$route.query.id
      getRoles().then(response => {
        this.options = fmtRoles(response.data)
      })
      if (this.isEdit) {
        getUser(this.$route.query.id).then(response => {
          this.user = response.data;
          console.log(this.user)
          for(var u in response.data.roles){
            this.checkedIds.push(response.data.roles[u]['id'])
            console.log(u)
          }
          // console.log(this.checkedIds)
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
                  this.userRole.roleIds = this.checkedIds.join(',');
                  updateUserRole(this.userRole);
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });

              } else {
                
                this.user.roleIds = this.checkedIds;
                // alert(this.checkedIds)
                createUser(this.user).then(response => {
                  this.$refs[formName].resetFields();
                  this.user = Object.assign({},defaultuser);
                  
                  // updateUserRole(this.userRole);
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
      },
      onCancel(){
        this.$router.back();
      }
    }
  }
</script>
<style>
</style>


