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
      <el-form-item label="设备型号：" prop="modelNumber"> 
        <el-input v-model="equipmentInstance.modelNumber"></el-input>
      </el-form-item>
      <el-form-item label="设备名：" prop="name">
        <el-input v-model="equipmentInstance.name"></el-input>
      </el-form-item>
      <el-form-item label="单价：" prop="price">
        <el-input v-model="equipmentInstance.price"></el-input>
      </el-form-item>
      <el-form-item label="使用年限：" prop="useYear">
        <el-input v-model="equipmentInstance.useYear"></el-input>
      </el-form-item>
      <el-form-item label="图片:">
        <single-upload v-model="equipmentInstance.picture"></single-upload>
      </el-form-item>
      <el-form-item label="选择类别：">
        <el-select
          v-model="listQuery.keyword1"
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
          v-model="listQuery.keyword2"
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
          v-model="listQuery.keyword3"
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
      <el-form-item label="备注：">
        <el-input v-model="equipmentInstance.description" type="textarea" placeholder="请输入内容"></el-input>
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
import {fetchList as getListByCategory} from "@/api/equipmentType";
import SingleUpload from "@/components/Upload/singleUpload";
//默认信息
const defaultEquipmentInstance = {
  id: 123,
  modelNumber: "note3",
  name: "小米",
  price: 8888,
  useYear: 10,
  picture: "http:",
  description: "hahah",
  deviceClassId:16,
};
export default {
  name: "EquipmentInstanceDetail",
  components: { SingleUpload },
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
        modelNumber:[{ required: true, message: "请输入设备型号", trigger: "blur" }],
        name:[{ required: true, message: "请输入设备名", trigger: "blur" }],
        price: [{ required: true, message: "请输入单价", trigger: "blur" }],
        useYear: [
          { required: true, message: "请输入使用年限", trigger: "blur" }
        ],
        deviceClassId: [
          { required: true, message: "请输入设备所属类别", trigger: "blur" }
        ]
      },
      dialogVisible: false,
      firstCategoryOptions: [],
      secondCategoryOptions: [],
      thirdCategoryOptions: [],
      listQuery: {
        keyword1: null,
        keyword2: null,
        keyword3: null,
        pageNum: 1,
        pageSize: 100
      },
    };
  },
  created() {
    this.getFirstCategoryList();
    if (this.isEdit) {
      getEquipmentInstance(this.$route.query.id).then(response => {
        //this.equipmentInstance = response.data;

        this.equipmentInstance = response.data;
        this.equipmentInstance.typeId = response.data.deviceClass.id;
        this.listQuery.keyword1 = response.data.deviceClass.firstCategory;
        this.selectFirstCategory();
        this.listQuery.keyword2 = response.data.deviceClass.secondCategory;
        this.selectSecondCategory();
        this.listQuery.keyword3 = response.data.deviceClass.thirdCategory;
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
   getFirstCategoryList() {
      getListByCategory({ pageNum: 1, pageSize: 100 }).then(response => {
        this.firstCategoryOptions = [];
        let firstCategoryList = response.data.list;
        let arr = [];
        for (let i = 0; i < firstCategoryList.length; i++) {
          arr.push(firstCategoryList[i].firstCategory);
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
        keyword1: this.listQuery.keyword1,
        keyword2: null,
        keyword3: null,
        pageSize: 100
      }).then(response => {
        // this.firstCategoryOptions = [];
        let secondCategoryList = response.data.list;
        let arr = [];
        for (let i = 0; i < secondCategoryList.length; i++) {
          arr.push(secondCategoryList[i].secondCategory);
        }
        //去重
        arr = [...new Set(arr)];
        //赋值
        for (let i = 0; i < arr.length; i++) {
          this.secondCategoryOptions.push({ label: arr[i], value: arr[i] });
        }
      });
      this.listQuery.keyword2 = null; //将上一次二级分类选中的结果置为空。
      this.listQuery.keyword3 = null; //将上一次二级分类选中的结果置为空。
    },
    //选择二级列表以后
    selectSecondCategory() {
      this.thirdCategoryOptions = [];
      //加载三级列表
      getListByCategory({
        keyword1: this.listQuery.keyword1,
        keyword2: this.listQuery.keyword2,
        keyword3: null,
        pageSize: 100
      }).then(response => {
        // this.firstCategoryOptions = [];
        let thirdCategoryList = response.data.list;
        let arr = [];
        for (let i = 0; i < thirdCategoryList.length; i++) {
          arr.push(thirdCategoryList[i].thirdCategory);
        }
        //去重
        arr = [...new Set(arr)];
        for (let i = 0; i < arr.length; i++) {
          this.thirdCategoryOptions.push({ label: arr[i], value: arr[i] });
        }
      });
      this.listQuery.keyword3 = null; //将上一次三级分类选中的结果置为空。
    },
    selectThirdCategory() {
      getListByCategory(this.listQuery).then(response => {
        //alert(response.data.list[0].id);
        this.equipmentInstance.deviceClassId = response.data.list[0].id;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.equipmentInstance = Object.assign({}, defaultEquipmentInstance);
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


