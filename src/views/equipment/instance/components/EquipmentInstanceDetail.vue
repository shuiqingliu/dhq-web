<template>
  <el-card class="form-container" shadow="never">
    <el-form
      :model="equipmentInstance"
      :rules="rules"
      ref="equipmentInstanceForm"
      label-width="150px"
    >
      <!-- <el-form-item label="设备编号：" prop="firstCategory">
        <el-input v-model="equipmentInstance.id"></el-input>
      </el-form-item>-->
      <el-form-item label="设备名：" prop="name">
        <el-input v-model="equipmentInstance.name"></el-input>
      </el-form-item>
      <el-form-item label="单价：" prop="price">
        <el-input v-model="equipmentInstance.price"></el-input>
      </el-form-item>
      <el-form-item label="生产日期：" prop="produceDate">
        <el-date-picker v-model="equipmentInstance.produceDate" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="使用年限：" prop="useYear">
        <el-input v-model="equipmentInstance.useYear"></el-input>
      </el-form-item>
      <el-form-item label="类型Id：" prop="typeId">
        <el-input v-model="equipmentInstance.typeId"></el-input>
      </el-form-item>
      <el-form-item label="设备描述：">
        <el-input v-model="equipmentInstance.describtion" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('equipmentInstanceForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('equipmentInstanceForm')">重置</el-button>
        <el-button @click="dialogVisible = true">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>
        <font color="#FF0000">您确定要返回吗? 您填写的内容将不会被保存</font>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="returnToEquipmentInstance(),dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import {
  createEquipmentInstance,
  getEquipmentInstance,
  updateEquipmentInstance
} from "@/api/equipmentInstance";
//默认信息
const defaultEquipmentInstance = {
  describtion: "傻",
  id: 0,
  name: "string会更好",
  produceDate: "2019-04-09",
  price: 0,
  typeId: 1,
  useYear: 0
};
export default {
  name: "EquipmentInstanceDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      equipmentInstance: Object.assign({}, defaultEquipmentInstance),
      rules: {
        price: [{ required: true, message: "请输入单价", trigger: "blur" }],
        useYear: [
          { required: true, message: "请输入使用年限", trigger: "blur" }
        ],
        typeId: [
          { required: true, message: "请输入设备所属类型", trigger: "blur" }
        ]
      },
      dialogVisible: false,
    };
  },
  created() {
    if (this.isEdit) {
      getEquipmentInstance(this.$route.query.id).then(response => {
        this.equipmentInstance = response.data;
      });
    } else {
      this.equipmentInstance = Object.assign({}, defaultEquipmentInstance);
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
              updateEquipmentInstance(
                this.$route.query.id,
                this.equipmentInstance
              ).then(response => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: "修改成功",
                  type: "success",
                  duration: 1000
                });
                this.$router.back();
              });
            } else {
              createEquipmentInstance(this.equipmentInstance).then(response => {
                this.$refs[formName].resetFields();
                this.equipmentInstance = Object.assign(
                  {},
                  defaultEquipmentInstance
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
      this.equipmentInstance = Object.assign({}, defaultEquipmentInstance);
    },
    returnToEquipmentInstance() {
      this.$router.push({ path: "/equipment/instance" });
    }
  }
};
</script>
<style>
</style>


