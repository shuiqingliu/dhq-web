<template>
    <el-card class="form-container" shadow="never">
        <el-form :model="passParam" status-icon :rules="rules" ref="changePass" label-width="150px">
          <el-form-item label="原密码" prop="oldPassword">
              <el-input type="password" v-model="passParam.oldPassword" placeholder="请输入原密码" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
              <el-input type="password" v-model="passParam.newPassword" placeholder="请输入 6～15 位密码" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword">
              <el-input type="password" v-model="passParam.checkPassword" placeholder="请再次输入密码" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
                <el-button type="primary" @click="submitForm('changePass')">提交</el-button>
                <el-button @click="cancle('changePass')">取消</el-button>
          </el-form-item>
        </el-form>
    </el-card>
</template>

<script>

import { changePassword } from '@/api/userAdmin';
import { getToken } from '@/utils/auth' 

export default {
    name: 'changePassword',
    data(){
        var checkOld = (rule,value,callback) => {
            if(value === ''){
                return callback(new Error('原密码不能为空'));
            }else{
                callback();
            }
        }

        var checkNew = (rule,value,callback) => {
            if(value === ''){
                return callback(new Error("新密码不能为空"));
            }else if(!/^[0-9A-Za-z]{6,15}$/.test(value)){
                return callback(new Error('密码是 6 ～ 15位字符'));
            }else{
                if(this.passParam.checkPassword !== ''){
                    this.$refs.changePass.validateField('checkPassword');
                }
                callback();
            }
        }

        var checkComfirm = (rule,value,callback) => {
            if(value === ''){
                return callback(new Error('请再次输入密码'));
            }else if(value !== this.passParam.newPassword){
                callback(new Error('两次输入密码不一致'));
            }else{
                callback();
            }
        }   

        return {
            passParam:{
                token:getToken(),
                oldPassword:'',
                newPassword:'',
                checkPassword:''
            },
            rules:{
                oldPassword:[
                    {validator: checkOld, trigger:'blur'}
                ],
                newPassword:[
                    {validator: checkNew, trigger:'blur'}
                ],
                checkPassword:[
                    {validator: checkComfirm, trigger:'blur'}
                ]
                
            }
        }


    },
    methods:{
        submitForm(name){
            this.$refs[name].validate((valid) =>{
                if(valid){
                    this.$confirm('是否修改密码','提示',{
                        confirmButtonText :'确定',
                        cancleButtonText:'取消',
                        type:'warning'
                    }).then(() => {
                        changePassword(this.passParam).then(response =>{
                             this.$message({
                                message: response.message,
                                type: 'success',
                                duration:1000
                            });
                            this.$store.dispatch('LogOut').then(() => {
                                location.reload() // 为了重新实例化vue-router对象 避免bug
                            })
                        })
                    })
                }else{
                    return false;
                }
            })
        },
        cancle(){
            this.$router.back();
        }
    }
}
</script>

