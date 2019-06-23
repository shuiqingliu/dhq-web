<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="courseInstance" :rules="rules" ref="courseInstanceForm" label-width="150px">
      <!-- <el-form-item label="课程编号：" prop="courseTypeNumber">
        <el-input v-model="courseInstance.courseTypeNumber"></el-input>
      </el-form-item>-->
      <el-form-item label="课程名：" prop="name">
        <el-input v-model="courseInstance.name"></el-input>
      </el-form-item>
      <el-form-item label="课程描述：" prop="description">
        <el-input v-model="courseInstance.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          ref="upload"
          action
          :http-request="handleFile"
          :on-change="img_path_file"
          :multiple="false"
          :limit="1"
          :file-list="img_path"
          accept=".jpg"
          list-type="picture"
        >
          <el-button size="small" type="primary" @click="clearUploadedImage('upload')">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传.jpg文件</div>
        </el-upload>
      </el-form-item>
      <!-- <el-form-item label="课程图片:">
        <single-upload v-model="courseInstance.picture"></single-upload>
      </el-form-item>-->
      <el-form-item label="课长(分/每节):" prop="timesOfClass">
        <el-input v-model="courseInstance.timesOfClass" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="课时:" prop="countsOfClass">
        <el-input v-model.number="courseInstance.countsOfClass" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="推荐指数:">
        <el-input v-model.number="courseInstance.recommendationCoefficient" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="价格：" prop="price">
        <el-input v-model.number="courseInstance.price"></el-input>
      </el-form-item>
      <el-form-item label="课程内容：" prop="courseContent">
        <el-input v-model="courseInstance.courseContent" placeholder="请输入内容"></el-input>
      </el-form-item>
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
      <el-card v-show="courseInstance.online === 0 && !isEdit">
        <el-form-item label="第几课时">
          <el-input v-model.number="onlineCourseInfo.period"></el-input>
        </el-form-item>
        <el-form-item label="课时标题">
          <el-input v-model="onlineCourseInfo.periodTitle"></el-input>
        </el-form-item>
        <el-form-item label="课时链接">
          <el-input v-model="onlineCourseInfo.periodContent"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pre()">上一个</el-button>
          <el-button type="primary" @click="next()">下一个</el-button>
          <el-button type="primary" @click="falseSubmit()">确定</el-button>
        </el-form-item>
      </el-card>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('courseInstanceForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('courseInstanceForm')">重置</el-button>
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
  //courseTypeNumber: null,
  courseContent: null,
  description: null,
  id: 0,
  name: null,
  online: 1,
  // picture: null,
  price: null,
  status: 1,
  timesOfClass: null,
  countsOfClass: null,
  courseClassId: null,
  recommendationCoefficient: null
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
        // courseTypeNumber: [
        //   { required: true, message: "请输入课程名", trigger: "blur" }
        // ],
        name: [{ required: true, message: "请输入课程名", trigger: "blur" }],
        timesOfClass: [
          { required: true, message: "请输入课长", trigger: "blur" }
        ],
        countsOfClass: [
          { required: true, message: "请输入课时", trigger: "blur" }
        ],
        courseContent: [
          { required: true, message: "请输入课程内容", trigger: "blur" }
        ],
        courseClassId: [
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
      },
      onlineCourseInfo: {
        courseOnlinId: 0,
        id: 0,
        period: null,
        periodTitle: "xxxx",
        periodContent: null
      },
      dialogVisible: false,
      onlineCourseList: [],
      listSize: null,
      img_path: []
    };
  },
  created() {
    this.getFirstCategoryList();
    if (this.isEdit) {
      getCourseInstance(this.$route.query.id).then(response => {
        this.courseInstance = response.data;
        this.courseInstance.courseClassId = response.data.courseClass.id;
        this.listQuery.firstType = response.data.courseClass.firstClass;
        this.selectFirstCategory();
        this.listQuery.secondType = response.data.courseClass.secondClass;
        this.selectSecondCategory();
        this.listQuery.thirdType = response.data.courseClass.thirdClass;
      });
    } else {
      this.courseInstance = Object.assign({}, defaultCourseInstance);
    }
  },
  methods: {
    onSubmit(formName) {
      // let form  = this.$refs[formName];
      // 创建 FormData 对象
      let formData = new FormData();
      let formDataForEdit = new FormData();
      this.$refs[formName].validate(valid => {
        // if (this.img_path[0] == null || this.img_path[0] == "") {
        //   alert("请必须添加图片!");
        //   this.$message({
        //     message: "验证失败",
        //     type: "error",
        //     duration: 1000
        //   });
        //   return false;
        // }
        if (valid) {
          this.$confirm("是否提交数据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let obj = {
              courseOnlineContentList: this.onlineCourseList,
              courseParam: this.courseInstance
            };
            formData.append("courseTypeOnlineItem", JSON.stringify(obj));
            formData.append(
              "image",
              this.img_path[0] ? this.img_path[0].raw : ""
            );
            if (this.isEdit) {
              formDataForEdit.append(
                "courseParam",
                JSON.stringify(this.courseInstance)
              );
              formDataForEdit.append(
                "image",
                this.img_path[0] ? this.img_path[0].raw : ""
              );
              updateCourseInstance(this.$route.query.id, formDataForEdit).then(
                response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: "修改成功",
                    type: "success",
                    duration: 1000
                  });
                  this.$router.push({
                    path: "/course/instance",
                    query: { listQuery: this.$route.query.listQuery }
                  });
                }
              );
            } else {
              createCourseInstance(formData).then(response => {
                this.$refs[formName].resetFields();
                this.courseInstance = Object.assign({}, defaultCourseInstance);
                this.$message({
                  message: "提交成功",
                  type: "success",
                  duration: 1000
                });
                this.$router.push({
                  path: "/course/instance",
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
      this.courseInstance = Object.assign({}, defaultCourseInstance);
    },
    handleRemove(file, fileList) {
      // alert(fileList[0]);
      console.log(file, fileList);
    },
    handlePreview(file) {
      // alert(fileList[0]);
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
          arr.push(firstCategoryList[i].firstClass);
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
      this.thirdCategoryOptions = [];
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
          arr.push(secondCategoryList[i].secondClass);
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
          arr.push(thirdCategoryList[i].thirdClass);
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
        // alert(response.data.list[0].id);
        this.courseInstance.courseClassId = response.data.list[0].id;
      });
    },
    returnToStoreInformation() {
      // this.$router.push({ path: "/course/instance" });
      this.$router.push({
        path: "/course/instance",
        query: { listQuery: this.$route.query.listQuery }
      });
    },
    falseSubmit() {
      this.onlineCourseList.push({
        courseOnlinId: 0,
        id: 0,
        period: this.onlineCourseInfo.period,
        periodTitle: this.onlineCourseInfo.periodTitle,
        periodContent: this.onlineCourseInfo.periodContent
      });
      this.listSize = this.onlineCourseList.length;
      this.onlineCourseInfo = {
        period: null,
        periodTitle: null,
        periodContent: null
      };
    },
    pre() {
      if (this.listSize == this.onlineCourseList.length + 1) {
        this.listSize -= 1;
      }
      if (this.listSize != null && this.listSize != 0) {
        this.onlineCourseInfo.period = this.onlineCourseList[
          this.listSize - 1
        ].period;
        this.onlineCourseInfo.periodTitle = this.onlineCourseList[
          this.listSize - 1
        ].periodTitle;
        this.onlineCourseInfo.periodContent = this.onlineCourseList[
          this.listSize - 1
        ].periodContent;
        this.listSize = this.listSize - 1;
      } else {
        alert("前面没有了");
      }
    },
    next() {
      //alert(this.listSize)
      if (this.listSize == 0) {
        this.listSize += 1;
      }
      if (
        this.listSize != null &&
        this.listSize <= this.onlineCourseList.length
      ) {
        this.onlineCourseInfo.period = this.onlineCourseList[
          this.listSize - 1
        ].period;
        this.onlineCourseInfo.periodTitle = this.onlineCourseList[
          this.listSize - 1
        ].periodTitle;
        this.onlineCourseInfo.periodContent = this.onlineCourseList[
          this.listSize - 1
        ].periodContent;
        this.listSize = this.listSize + 1;
      } else {
        alert("后面没有了");
        this.onlineCourseInfo = {
          period: null,
          periodTitle: null,
          periodContent: null
        };
      }
    },
    handleFile() {},
    img_path_file(file, fileList) {
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
    },
    objectToFormData(obj, form, namespace) {
      const fd = form || new FormData();
      let formKey;

      for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
          let key = Array.isArray(obj) ? "[]" : `[${property}]`;
          if (namespace) {
            formKey = namespace + key;
          } else {
            formKey = property;
          }

          // if the property is an object, but not a File, use recursivity.
          if (
            typeof obj[property] === "object" &&
            !(obj[property] instanceof File)
          ) {
            alert("afadfa");
            this.objectToFormData(obj[property], fd, formKey);
            //objectToFormData();
          } else {
            // if it's a string or a File object
            fd.append(formKey, obj[property]);
          }
        }
      }

      return fd;
    }
  }
};
</script>
<style>
</style>


