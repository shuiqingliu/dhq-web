<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="user" :rules="rules" ref="userform" label-width="150px">
      <el-form-item label="角色名：" prop="description">
        <el-input v-model="user.description" placeholder="支持中文、字母、数字、下划线,2-20个字符"></el-input>
      </el-form-item>
      <el-form-item label="角色描述：">
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="角色权限：" v-if="!isEdit">
           <el-tree
              :data="permisisonTree"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[]"
              :default-checked-keys="[]"
             
       
              center=true
              ref="tree"
              >
          </el-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('userform')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('userform')">重置</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createRole, updateRole,getRole, getPermisisonTree} from '@/api/role'
  import {isvalidUsername} from '@/utils/validate'
 import {fmtTree} from '@/utils/utils' 
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
        permisisonTree: [
          {
            id:0,
            label: 1,
            children: []
          }
        ],
        permissionIDs:[],
        user: {
          name:'',
          description:'',
          id: 0
        },
        rules: {
          description: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
        },
        
      }
    },
    
    created() {
       getPermisisonTree().then((resp)=>{
          var data = resp.data
          //console.log(resp.data)
          this.permisisonTree = fmtTree(data);
          // alert(1)
          // console.log( this.permisisonTree)

      })
      if(this.$route.query.id != undefined){
        getRole(this.$route.query.id).then(resp=>{
                this.user = resp.data
              })
      }
   
      
    },
    watch:{
      permissionIDs: function(n,o){
        console.log(n)
      }
    },
   
    methods: {
      onSubmit(formName) {
       
        if(!isvalidUsername(this.user.description)){
          this.$message({
            message: '角色名有错误！',
            type: 'error',
            duration:1000
          });
          return
        }

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
                this.permissionIDs = this.$refs.tree.getCheckedKeys()
                if(this.permissionIDs.length < 1){
                   this.$message({
                    message: '请至少添加一个权限！',
                    type: 'error',
                    duration:1000
                  });
                  return 
                }
                console.log(this.permissionIDs)
                createRole({permissionIds:this.permissionIDs, role:this.user}).then(response => {
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
      },
      onCancel(){
        this.$router.back();
      }
    }
  }
</script>
<style>
</style>