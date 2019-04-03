<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="storeInfo" ref="storeInfoForm" label-width="150px">
      <el-form-item label="管理者ID：">
        <el-input v-model="storeInfo.managerId"></el-input>
      </el-form-item>
       <el-form-item label="门店类型：">
         <el-input v-model="storeInfo.shopType"></el-input>
      </el-form-item>
      <el-form-item label="门店描述：">
         <el-input v-model="storeInfo.shopDesc"></el-input>
      </el-form-item>
      <el-form-item label="省份：">
         <el-input v-model="storeInfo.shopLocationProvince"></el-input>
      </el-form-item>
      <el-form-item label="城市：">
         <el-input v-model="storeInfo.shopLocationCity"></el-input>
      </el-form-item>
      <el-form-item label="区县：">
         <el-input v-model="storeInfo.shopLocationDistrict"></el-input>
      </el-form-item>
      <el-form-item label="详细地址：">
         <el-input v-model="storeInfo.shopLocationDetail"></el-input>
      </el-form-item>
      <el-form-item label="电话">
         <el-input v-model="storeInfo.shopPhone"></el-input>
      </el-form-item>
      <el-form-item label="门店大小：">
         <el-input v-model="storeInfo.shopSize"></el-input>
      </el-form-item>
      <el-form-item label="员工数量：">
         <el-input v-model="storeInfo.employeeNum"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('storeInfoForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('storeInfoForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createBrand, getBrand, updateBrand} from '@/api/brand'
  const defaultStoreInfo={
    shopId: 0,
    managerId: '2018140699',
    shopType: '',
    shopName: '学能通北邮分店',
    shopDesc: '我们去哪里呀',
    shopLocationProvince: '北京市',
    shopLocationCity: '北京市',
    shopLocationDistrict: '海淀区',
    shopLocationDetail:'北京邮电大学',
    shopPhone: '010-8686886',
    shopSize: 6666,
    employeeNum: 222
  };
  export default {
    name: 'BrandDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        storeInfo:Object.assign({}, defaultStoreInfo)
        //此处可以添加一些验证。
      }
    },
    created() {
      if (this.isEdit) {
        getBrand(this.$route.query.id).then(response => {
          this.storeInfo = response.data;
        });
      }else{
        this.storeInfo = Object.assign({},defaultStoreInfo);
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateBrand(this.$route.query.id, this.storeInfo).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createBrand(this.storeInfo).then(response => {
                  this.$refs[formName].resetFields();
                  this.storeInfo = Object.assign({},defaultStoreInfo);
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
        this.storeInfo = Object.assign({},defaultStoreInfo);
      }
    }
  }
</script>
<style>
</style>


