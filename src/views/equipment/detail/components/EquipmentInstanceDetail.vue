<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="equipmentDetail" :rules="rules" ref="equipmentDetailForm" label-width="150px">
      <!-- <el-form-item label="设备编号：" prop="firstCategory">
        <el-input v-model="equipmentDetail.id"></el-input>
      </el-form-item>-->
      <el-form-item label="设备编号：" prop="deviceNumber">
        <el-input v-model="equipmentDetail.deviceNumber"></el-input>
      </el-form-item>
      <!-- <el-form-item label="设备类型Id：">
        <el-input v-model="equipmentDetail.deviceTypeId"></el-input>
      </el-form-item>-->
      <el-form-item label="生产日期：">
        <el-date-picker v-model="equipmentDetail.produceDate" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('equipmentDetailForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('equipmentDetailForm')">重置</el-button>
        <el-button @click="dialogVisible = true">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>
        <font color="#FF0000">您确定要返回吗? 您填写的内容将不会被保存</font>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="returnToEquipmentDetail(),dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import {
  createEquipmentDetail,
  getEquipmentDetail,
  updateEquipmentDetail
} from "@/api/equipmentDetail";
//默认信息
const defaultEquipmentDetail = {
  //deviceNumber: "1231231231",
  deviceTypeId: 1,
  deviceUseState: 0,
  id: 0,
  //produceDate: "2019-05-19"
};
export default {
  name: "EquipmentDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      equipmentDetail: Object.assign({}, defaultEquipmentDetail),
      rules: {
        deviceNumber: [
          { required: true, message: "请输入设备编号", trigger: "blur" }
        ]
        // price: [{ required: true, message: "请输入单价", trigger: "blur" }],
        // useYear: [
        //   { required: true, message: "请输入使用年限", trigger: "blur" }
        // ],
        // typeId: [
        //   { required: true, message: "请输入设备所属类型", trigger: "blur" }
        // ]
      },
      dialogVisible: false
    };
  },
  created() {
    if (this.isEdit) {
      getEquipmentDetail(this.$route.query.id).then(response => {
        this.equipmentDetail = response.data;
      });
    } else {
      defaultEquipmentDetail.deviceTypeId = this.$route.query.deviceTypeId;
      this.equipmentDetail = Object.assign({}, defaultEquipmentDetail);
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
              updateEquipmentDetail(
                this.$route.query.id,
                this.equipmentDetail
              ).then(response => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: "修改成功",
                  type: "success",
                  duration: 1000
                });
                this.$router.push({
                  path: "/equipment/equipmentDetail",
                  query: {
                    deviceTypeId: this.$route.query.deviceTypeId,
                    listQuery: this.$route.query.listQuery
                  }
                });
              });
            } else {
              createEquipmentDetail(this.equipmentDetail).then(response => {
                this.$refs[formName].resetFields();
                this.equipmentDetail = Object.assign(
                  {},
                  defaultEquipmentDetail
                );
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
      this.equipmentDetail = Object.assign({}, defaultEquipmentDetail);
    },
    returnToEquipmentDetail() {
      //this.$router.back();
      this.$router.push({
        path: "/equipment/equipmentDetail",
        query: {
          deviceTypeId: this.$route.query.deviceTypeId,
          listQuery: this.$route.query.listQuery
        }
      });
    }
  }
};
</script>
<style>
</style>


