<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="storeInfo"  ref="storeInfoForm" label-width="150px">
      <el-form-item label="门店ID："  prop="managerId">
        <el-input v-model="storeInfo.id"></el-input>
      </el-form-item>
      <el-form-item label="管理者ID："  prop="managerId">
        <el-input v-model="storeInfo.managerId"></el-input>
      </el-form-item>
       <el-form-item label="门店类型："  prop="shopType">
         <el-input v-model="storeInfo.shopType" ></el-input>
      </el-form-item>
      <el-form-item label="门店描述：" >
         <el-input v-model="storeInfo.shopDesc" type="textarea" placeholder="请输入内容"></el-input>
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
         <el-button size="mini" type="primary" @click="action()">返回</el-button>
      </el-form-item>
      
    </el-form>
  </el-card>
</template>
<script>
  import {createStoreInfo, getStoreInfoById, updateStoreInfo} from '@/api/storeInformation'
  export default {
    name: 'StoreInfoDetail',
    data() {
      return {
        storeInfo:{}
      }
    },
    created() {
        getStoreInfoById(this.$route.query.id).then(response => {
          this.storeInfo = response.data;
        });
    },
    methods:{
      action(){
      this.$router.back();
      }
    }
  }
</script>
<style>
</style>