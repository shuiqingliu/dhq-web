<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="storeInfo" :rules="rules" ref="storeInfoForm" label-width="150px">
      <el-form-item label="管理者：" prop="managerId">
        <el-input v-model="storeInfo.managerId"></el-input>
      </el-form-item>

      <el-form-item label="门店名字：" prop="shopType">
        <el-input v-model="storeInfo.shopName"></el-input>
      </el-form-item>

      <!-- <el-form-item label="门店类型：" prop="shopType">
        <el-input v-model="storeInfo.shopType"></el-input>
      </el-form-item>-->
      <el-form-item label="门店类型：">
        <el-select v-model="storeInfo.shopType" placeholder="请选择门店类别">
          <el-option
            v-for="item in shopType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门店描述：">
        <el-input v-model="storeInfo.shopDesc" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <!-- <img style="height: 70px" :src="'http://10.103.250.120:2140/deviceType/showImage?id='+equipmentInstance.id"> -->
        <el-upload
          ref="upload"
          action
          :http-request="handleFile"
          :on-change="img_path_file"
          :multiple="false"
          :limit="1"
          :file-list="img_path"
          list-type="picture"
          accept=".jpg"
        >
          <el-button size="small" type="primary" @click="clearUploadedImage('upload')">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传.jpg文件</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="省市区" >
        <el-cascader size="large" :options="options" v-model="selectedOptions"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址：">
        <el-input v-model="storeInfo.shopLocationDetail"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="shopPhone">
        <el-input v-model.number="storeInfo.shopPhone"></el-input>
      </el-form-item>
      <el-form-item label="门店面积：" prop="shopSize">
        <el-input v-model.number="storeInfo.shopSize"></el-input>
      </el-form-item>
      <el-form-item label="教室数量:" prop="classroomNum">
        <el-input v-model.number="storeInfo.classroomNum"></el-input>
      </el-form-item>
      <el-form-item label="员工数量：" prop="employeeNum">
        <el-input v-model.number="storeInfo.employeeNum"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('storeInfoForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('storeInfoForm')">重置</el-button>
        <el-button @click="dialogVisible = true">取消</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose"> -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>
        <font color="#FF0000">您确定要返回门店信息列表吗? 您填写的内容将不会被保存</font>
      </span>
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
import { isvalidPhone, isvalidUsername } from "../../../../utils/validate";

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
  classroomNum: 10,
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
    var validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      storeInfo: Object.assign({}, defaultStoreInfo),
      rules: {
        managerId: [
          { required: true, message: "请输入管理者Id", trigger: "blur" },
          { min: 2, max: 10, message: "长度为10位", trigger: "blur" }
        ],
        employeeNum: [
          // { validator: checkEmployeeNum, trigger: "blur" },
          { required: true, message: "员工数量不能为空" },
          { type: "number", message: "员工数量必须为数字值" }
        ],
        shopSize: [
          { required: true, message: "门店大小不能为空" },
          { type: "number", message: "门店大小必须为数字值" }
        ],
        classroomNum: [
          { required: true, message: "门店大小不能为空" },
          { type: "number", message: "门店大小必须为数字值" }
        ],
        shopPhone: [
          { required: true, trigger: "blur", validator: validPhone } //这里需要用到全局变量
        ]
      },
      options: regionDataPlus,
      selectedOptions: [],
      dialogVisible: false,
      shopType: [
        {
          value: "学校",
          label: "学校"
        },
        {
          value: "门店",
          label: "门店"
        }
      ],
      img_path: []
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
        this.img_path = [
          {
            url: response.data.url
          }
        ];
      });
    } else {
      this.storeInfo = Object.assign({}, defaultStoreInfo);
    }
  },
  methods: {
    onSubmit(formName) {
      let form = this.$refs[formName];
      // 创建 FormData 对象
      let formData = new FormData();
      form.validate(valid => {
        if (!isvalidUsername(this.storeInfo.managerId)) {
          this.$message({
            message: "请勿输入？！*&%……@等特殊符号",
            type: "error",
            duration: 1000
          });
          return false;
        }
        if (this.selectedOptions == null || this.selectedOptions.length < 3) {
                this.$message({
                  message: "请填写完整的省市区信息",
                  type: "error",
                  duration: 1000
                });
                return false;
              }
        if (valid) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            if (this.isEdit) {
              this.storeInfo.shopLocationProvince =
                CodeToText[this.selectedOptions[0]];
              this.storeInfo.shopLocationCity =
                CodeToText[this.selectedOptions[1]];
              this.storeInfo.shopLocationDistrict =
                CodeToText[this.selectedOptions[2]];
              formData.append("shopInfoParam", JSON.stringify(this.storeInfo));
              formData.append(
                "image",
                this.img_path[0] ? this.img_path[0].raw : ""
              );
              updateStoreInfo(this.$route.query.id, formData).then(response => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: "修改成功",
                  type: "success",
                  duration: 1000
                });
                this.$router.push({
                  path: "/store/storeInformation",
                  query: { listQuery: this.$route.query.listQuery }
                });
              });
            } else {
              
              this.storeInfo.shopLocationProvince =
                CodeToText[this.selectedOptions[0]];
              this.storeInfo.shopLocationCity =
                CodeToText[this.selectedOptions[1]];
              this.storeInfo.shopLocationDistrict =
                CodeToText[this.selectedOptions[2]];
              formData.append("shopInfo", JSON.stringify(this.storeInfo));
              formData.append(
                "image",
                this.img_path[0] ? this.img_path[0].raw : ""
              );
              createStoreInfo(formData).then(response => {
                this.$refs[formName].resetFields();
                this.storeInfo = Object.assign({}, defaultStoreInfo);
                this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000
                });
                this.$router.push({
                  path: "/store/storeInformation",
                  query: { listQuery: this.$route.query.listQuery }
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
    returnToStoreInformation() {
      //this.$router.push({ path: "/store/storeInformation" });
      this.$router.push({
        path: "/store/storeInformation",
        query: { listQuery: this.$route.query.listQuery }
      });
    },
    handleFile() {},
    img_path_file(file, fileList) {
      //alert(fileList);
      // 证书上传组件 on-change 事件
      this.img_path = fileList;
    },
    clearUploadedImage(type) {
      // 重新选择文件时清空文件列表
      if (type === "upload") {
        this.$refs.upload.clearFiles();
        this.img_path = [];
      } else if (type === "upload1") {
        this.$refs.upload1.clearFiles();
        this.key_path = [];
      }
    }
  }
};
</script>
<style>
</style>


