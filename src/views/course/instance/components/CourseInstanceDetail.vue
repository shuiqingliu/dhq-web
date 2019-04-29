<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="courseInstance" :rules="rules" ref="courseInstanceForm" label-width="150px">
      <el-form-item label="课程编号：" prop="courseNumber">
        <el-input v-model="courseInstance.courseNumber"></el-input>
      </el-form-item>
      <el-form-item label="课程名：" prop="name">
        <el-input v-model="courseInstance.name"></el-input>
      </el-form-item>
      <el-form-item label="课程描述：" prop="description">
        <el-input v-model="courseInstance.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="课程图片:">
        <single-upload v-model="courseInstance.picture"></single-upload>
      </el-form-item>
      <el-form-item label="课长(分/每节):" prop="timesOfClass">
        <el-input v-model="courseInstance.timesOfClass" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="课时:" prop="countsOfClass">
        <el-input v-model="courseInstance.countsOfClass" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="推荐指数:">
        <el-input v-model="courseInstance.recommendationCoefficient" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="价格：" prop="price">
        <el-input v-model="courseInstance.price"></el-input>
      </el-form-item>
      <el-form-item label="课程内容：" prop="courseContent">
        <el-input v-model="courseInstance.courseContent" placeholder="请输入内容"></el-input>
      </el-form-item>
      <!-- <el-form-item label="类型Id：" prop="typeId">
        <el-input v-if="this.isEdit" v-model="courseInstance.courseType.id" ></el-input>
        <el-input v-model="courseInstance.typeId" placeholder="请输入内容"></el-input>
      </el-form-item>-->

      <el-form-item label="选择类型：">
        <el-select
          v-model="listQuery.firstType"
          placeholder="一级类别"
          clearable
          style="width:150px"
          @change="selectFirstCategory()"
        >
          <el-option
            v-for="item in firstCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="listQuery.secondType"
          placeholder="二级类别"
          clearable
          style="width:150px"
          @change="selectSecondCategory()"
        >
          <el-option
            v-for="item in secondCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="listQuery.thirdType"
          placeholder="三级类别"
          clearable
          style="width:150px"
          @change="selectThirdCategory()"
        >
          <el-option
            v-for="item in thirdCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="特色课程：">
        <el-radio-group v-model="courseInstance.specialState">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="线上/线下：">
        <el-radio-group v-model="courseInstance.online">
          <el-radio :label="0">线上</el-radio>
          <el-radio :label="1">线下</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上架/下架：">
        <el-radio-group v-model="courseInstance.status">
          <el-radio :label="1">上架</el-radio>
          <el-radio :label="0">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('courseInstanceForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('courseInstanceForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import SingleUpload from "@/components/Upload/singleUpload";
import {
  createCourseInstance,
  getCourseInstance,
  updateCourseInstance
} from "@/api/courseInstance";

import {
  fetchList,
  fetchList as getListByCategory,
  deleteCourseType,
  batchDeleteCourseType
  //getFirstCategory,
  // getSecondCategory,
  // getThirdCategory
} from "@/api/courseType";

//默认信息
const defaultCourseInstance = {
  courseNumber: null,
  courseContent: null,
  description: null,
  id: 0,
  name: null,
  online: 0,
  picture: null,
  price: null,
  status: 1,
  timesOfClass: null,
  countsOfClass: null,
  typeId: null,
  recommendationCoefficient: null,
  specialState: 0
};
export default {
  name: "CourseInstanceDetail",
  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      courseInstance: Object.assign({}, defaultCourseInstance),
      rules: {
        courseNumber: [
          { required: true, message: "请输入课程名", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入课程名", trigger: "blur" }],
        timesOfClass: [{ required: true, message: "请输入课长", trigger: "blur" }],
        countsOfClass: [{ required: true, message: "请输入课时", trigger: "blur" }],
        courseContent: [
          { required: true, message: "请输入课程内容", trigger: "blur" }
        ],
        typeId: [
          { required: true, message: "请输入课程所属类型", trigger: "blur" }
        ],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }]
      },
      fileList: [],
      firstCategoryOptions: [],
      secondCategoryOptions: [],
      thirdCategoryOptions: [],
      listQuery: {
        firstType: null,
        secondType: null,
        thirdType: null,
        pageNum: 1,
        pageSize: 5
      }
    };
  },
  created() {
    this.getFirstCategoryList();
    if (this.isEdit) {
      getCourseInstance(this.$route.query.id).then(response => {
        this.courseInstance = response.data;
        this.courseInstance.typeId = response.data.courseType.id;
        this.listQuery.firstType = response.data.courseType.firstType;
        this.selectFirstCategory();
        this.listQuery.secondType = response.data.courseType.secondType;
        this.selectSecondCategory();
        this.listQuery.thirdType = response.data.courseType.thirdType;
      });
    } else {
      this.courseInstance = Object.assign({}, defaultCourseInstance);
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
              updateCourseInstance(
                this.$route.query.id,
                this.courseInstance
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
              alert(this.courseInstance.picture);
              createCourseInstance(this.courseInstance).then(response => {
                this.$refs[formName].resetFields();
                this.courseInstance = Object.assign({}, defaultCourseInstance);
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
      this.courseInstance = Object.assign({}, defaultCourseInstance);
    },
    handleRemove(file, fileList) {
      alert(fileList[0]);
      console.log(file, fileList);
    },
    handlePreview(file) {
      alert(fileList[0]);
      console.log(file);
    },
    handleUploadSuccess(res, file) {
      this.showFileList = true;
      this.fileList.pop();
      this.fileList.push({
        name: file.name,
        url: this.dataObj.host + "/" + this.dataObj.dir + "/" + file.name
      });
      this.emitInput(this.fileList[0].url);
    },
    //自动获取一级列表。
    getFirstCategoryList() {
      getListByCategory({ pageNum: 1, pageSize: 100 }).then(response => {
        this.firstCategoryOptions = [];
        let firstCategoryList = response.data.list;
        let arr = [];
        for (let i = 0; i < firstCategoryList.length; i++) {
          arr.push(firstCategoryList[i].firstType);
        }
        //去重
        arr = [...new Set(arr)];
        for (let i = 0; i < arr.length; i++) {
          this.firstCategoryOptions.push({ label: arr[i], value: arr[i] });
        }
      });
    },
    //选择一级列表以后
    selectFirstCategory() {
      this.secondCategoryOptions = [];
      //加载二级列表
      getListByCategory({
        firstType: this.listQuery.firstType,
        secondType: null,
        thirdType: null,
        pageSize: 100
      }).then(response => {
        // this.firstCategoryOptions = [];
        let secondCategoryList = response.data.list;
        let arr = [];
        for (let i = 0; i < secondCategoryList.length; i++) {
          arr.push(secondCategoryList[i].secondType);
        }
        //去重
        arr = [...new Set(arr)];
        //赋值
        for (let i = 0; i < arr.length; i++) {
          this.secondCategoryOptions.push({ label: arr[i], value: arr[i] });
        }
      });
      this.listQuery.secondType = null; //将上一次二级分类选中的结果置为空。
      this.listQuery.thirdType = null; //将上一次二级分类选中的结果置为空。
    },
    //选择二级列表以后
    selectSecondCategory() {
      this.thirdCategoryOptions = [];
      //加载二级列表
      getListByCategory({
        firstType: this.listQuery.firstType,
        secondType: this.listQuery.secondType,
        thirdType: null,
        pageSize: 100
      }).then(response => {
        // this.firstCategoryOptions = [];
        let thirdCategoryList = response.data.list;
        let arr = [];
        for (let i = 0; i < thirdCategoryList.length; i++) {
          arr.push(thirdCategoryList[i].thirdType);
        }
        //去重
        arr = [...new Set(arr)];
        for (let i = 0; i < arr.length; i++) {
          this.thirdCategoryOptions.push({ label: arr[i], value: arr[i] });
        }
      });
      this.listQuery.thirdType = null; //将上一次三级分类选中的结果置为空。
    },
    selectThirdCategory() {
      fetchList(this.listQuery).then(response => {
        alert(response.data.list[0].id);
        this.courseInstance.typeId = response.data.list[0].id;
      });
    }
  }
};
</script>
<style>
</style>


