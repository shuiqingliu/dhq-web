<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="equipmentType" :rules="rules" ref="equipmentTypeForm" label-width="150px">
      <el-form-item label="一级类别：" prop="firstCategory">
        <el-input v-model="equipmentType.firstCategory"></el-input>
      </el-form-item>
      <el-form-item label="二级类别：" prop="secondCategory">
        <el-input v-model="equipmentType.secondCategory"></el-input>
      </el-form-item>
      <el-form-item label="三级类别：" prop="thirdCategory">
        <el-input v-model="equipmentType.thirdCategory"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('equipmentTypeForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('equipmentTypeForm')">重置</el-button>
        <el-button @click="dialogVisible=true">取消</el-button>
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
  createEquipmentType,
  getEquipmentType,
  updateEquipmentType
} from "@/api/equipmentType";
//默认信息
const defaultEquipmentType = {
  firstCategory: "",
  id: 0,
  secondCategory: "",
  thirdCategory: ""
};
export default {
  name: "EquipmentTypeDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      equipmentType: Object.assign({}, defaultEquipmentType),
      rules: {
        firstCategory: [
          { required: true, message: "请输入一级类别", trigger: "blur" },
          { min: 2, max: 140, message: "长度为10位", trigger: "blur" }
        ],
        secondCategory: [
          { required: true, message: "请输二级类别", trigger: "blur" }
        ],
        thirdCategory: [
          { required: true, message: "请输三级类别", trigger: "blur" }
        ]
      },
      dialogVisible:false
    };
  },
  created() {
    if (this.isEdit) {
      getEquipmentType(this.$route.query.id).then(response => {
        this.equipmentType = response.data;
      });
    } else {
      this.equipmentType = Object.assign({}, defaultEquipmentType);
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
              updateEquipmentType(
                this.$route.query.id,
                this.equipmentType
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
              createEquipmentType(this.equipmentType).then(response => {
                this.$refs[formName].resetFields();
                this.equipmentType = Object.assign({}, defaultEquipmentType);
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
      this.equipmentType = Object.assign({}, defaultEquipmentType);
    },
    returnToEquipmentInstance() {
      //this.$router.push({ path: "/equipment/instance" });
      this.$router.back();
    }
  }
};
</script>
<style>
</style>


