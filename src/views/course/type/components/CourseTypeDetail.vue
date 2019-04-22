<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="courseType" :rules="rules" ref="courseTypeForm" label-width="150px">
      <el-form-item label="一级类别：" prop="firstType">
        <el-input v-model="courseType.firstType"></el-input>
      </el-form-item>
      <el-form-item label="二级类别：" prop="secondType">
        <el-input v-model="courseType.secondType"></el-input>
      </el-form-item>
      <el-form-item label="三级类别：" prop="thirdType">
        <el-input v-model="courseType.thirdType"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('courseTypeForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('courseTypeForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { createCourseType, getCourseType, updateCourseType } from "@/api/courseType";
//默认信息
const defaultCourseType = {
  firstType: "XXX",
  secondType:"YYY",
  thirdType:"ZZZ"
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
        firstType: [
          { required: true, message: "请输入单一节类别", trigger: "blur" }
        ],
        secondType: [
          { required: true, message: "请输入二级类别", trigger: "blur" }
        ],
        thirdType: [
          { required: true, message: "请输入三级类别", trigger: "blur" }
        ]
      }
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
    }
  }
};
</script>
<style>
</style>


