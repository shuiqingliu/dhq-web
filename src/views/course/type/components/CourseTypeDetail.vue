<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="courseType" :rules="rules" ref="courseTypeForm" label-width="150px">
      <el-form-item label="一级类别：" prop="firstClass">
        <el-input v-model="courseType.firstClass"></el-input>
      </el-form-item>
      <el-form-item label="二级类别：" prop="secondClass">
        <el-input v-model="courseType.secondClass"></el-input>
      </el-form-item>
      <el-form-item label="三级类别：" prop="thirdClass">
        <el-input v-model="courseType.thirdClass"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('courseTypeForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('courseTypeForm')">重置</el-button>
        <el-button @click="dialogVisible = true">取消</el-button>
      </el-form-item>
    </el-form>
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
  createCourseType,
  getCourseType,
  updateCourseType
} from "@/api/courseType";
//默认信息
const defaultCourseType = {
  firstClass: "XXX",
  secondClass: "YYY",
  thirdClass: "ZZZ"
};
export default {
  name: "CourseTypeDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      courseType: Object.assign({}, defaultCourseType),
      rules: {
        firstClass: [
          { required: true, message: "请输入单一节类别", trigger: "blur" }
        ],
        secondClass: [
          { required: true, message: "请输入二级类别", trigger: "blur" }
        ],
        thirdClass: [
          { required: true, message: "请输入三级类别", trigger: "blur" }
        ]
      },
      dialogVisible: false
    };
  },
  created() {
    if (this.isEdit) {
      getCourseType(this.$route.query.id).then(response => {
        this.courseType = response.data;
      });
    } else {
      this.courseType = Object.assign({}, defaultCourseType);
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
              updateCourseType(this.$route.query.id, this.courseType).then(
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
              createCourseType(this.courseType).then(response => {
                this.$refs[formName].resetFields();
                this.courseType = Object.assign({}, defaultCourseType);
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
      this.courseType = Object.assign({}, defaultCourseType);
    },
     returnToStoreInformation() {
      this.$router.push({ path: "/course/type" });
    }
  }
};
</script>
<style>
</style>


