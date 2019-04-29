<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="storeInfo" :rules="rules" ref="storeInfoForm" label-width="150px">
      <el-form-item label="管理者：" prop="managerId">
        <el-input v-model="storeInfo.managerId"></el-input>
      </el-form-item>

      <el-form-item label="门店名字：" prop="shopType">
        <el-input v-model="storeInfo.shopName"></el-input>
      </el-form-item>

      <el-form-item label="门店类型：" prop="shopType">
        <el-input v-model="storeInfo.shopType"></el-input>
      </el-form-item>

      <el-form-item label="门店描述：">
        <el-input v-model="storeInfo.shopDesc" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="省市区">
        <el-cascader size="large" :options="options" v-model="selectedOptions"></el-cascader>
      </el-form-item>
      <!-- <el-form-item label="省份：">
        <el-input v-model="storeInfo.shopLocationProvince"></el-input>
      </el-form-item>
      <el-form-item label="城市：">
        <el-input v-model="storeInfo.shopLocationCity"></el-input>
      </el-form-item>
      <el-form-item label="区县：">
        <el-input v-model="storeInfo.shopLocationDistrict"></el-input>
      </el-form-item>-->
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
        <el-button @click="dialogVisible = true">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span><font color="#FF0000">您确定要返回门店信息列表吗?  您填写的内容将不会被保存</font></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="returnToStoreInformation(),dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import {
  createStoreInfo,
  getStoreInfoById,
  updateStoreInfo
} from "@/api/storeInformation";
import {
  regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
//默认信息
const defaultStoreInfo = {
  id: 1,
  managerId: "刘召信",
  shopName: "北邮店",
  shopType: "学校",
  shopDesc: "北邮天下第一",
  shopLocationProvince: "北京市",
  shopLocationCity: "海淀区",
  shopLocationDistrict: "北太平庄",
  shopLocationDetail: "学院路10号院",
  shopPhone: "13340248013",
  shopSize: 1233,
  employeeNum: 20
};
export default {
  name: "StoreInfoDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      storeInfo: Object.assign({}, defaultStoreInfo),
      rules: {
        managerId: [
          { required: true, message: "请输入管理者Id", trigger: "blur" },
          { min: 2, max: 140, message: "长度为10位", trigger: "blur" }
        ],
        shopType: [
          { required: true, message: "请输入门店类型", trigger: "blur" }
        ]
      },
      options: regionDataPlus,
      selectedOptions: [],
      dialogVisible: false
    };
  },
  created() {
    if (this.isEdit) {
      getStoreInfoById(this.$route.query.id).then(response => {
        this.selectedOptions.push(
          TextToCode[response.data.shopLocationProvince].code,
          TextToCode[response.data.shopLocationProvince][
            response.data.shopLocationCity
          ].code,
          TextToCode[response.data.shopLocationProvince][
            response.data.shopLocationCity
          ][response.data.shopLocationDistrict].code
        );
        // alert(TextToCode["山东省"].code);
        // alert(TextToCode["菏泽市"].code);
        this.storeInfo = response.data;
      });
    } else {
      this.storeInfo = Object.assign({}, defaultStoreInfo);
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            if (this.isEdit) {
              updateStoreInfo(this.$route.query.id, this.storeInfo).then(
                response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: "修改成功",
                    type: "success",
                    duration: 1000
                  });
                  this.$router.back();
                }
              );
            } else {
              this.storeInfo.shopLocationProvince =
                CodeToText[this.selectedOptions[0]];
              this.storeInfo.shopLocationCity =
                CodeToText[this.selectedOptions[1]];
              this.storeInfo.shopLocationDistrict =
                CodeToText[this.selectedOptions[2]];
              createStoreInfo(this.storeInfo).then(response => {
                this.$refs[formName].resetFields();
                this.storeInfo = Object.assign({}, defaultStoreInfo);
                this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000
                });
              });
            }
          });
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.storeInfo = Object.assign({}, defaultStoreInfo);
    },
    returnToStoreInformation(){
      this.$router.push({ path: "/store/storeInformation" });
    }
  }
};
</script>
<style>
</style>


