<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="searchCourseTypeList()"
          type="primary"
          size="small"
        >查询结果</el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="resetSearchConditions()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="一级类别：">
            <el-select v-model="listQuery.firstType" placeholder="请选择类别"  @change="selectFirstCategory()" style="width:150px">
              <el-option
                v-for="item in firstCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级类别：">
            <el-select v-model="listQuery.secondType" placeholder="请选择类别"  @change="selectSecondCategory()" style="width:150px">
              <el-option
                v-for="item in secondCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="三级类别：">
            <el-select v-model="listQuery.thirdType" placeholder="请选择类别" style="width:150px">
              <el-option
                v-for="item in thirdCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>课程类别列表</span>
      <el-button class="btn-add" @click="addCourseType()" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="courseTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="一级类别" align="center">
          <template slot-scope="scope">{{scope.row.firstClass}}</template>
        </el-table-column>
        <el-table-column label="二级类别" align="center">
          <template slot-scope="scope">{{scope.row.secondClass}}</template>
        </el-table-column>
        <el-table-column label="三级类别" align="center">
          <template slot-scope="scope">{{scope.row.thirdClass}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small"
      >确定</el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  fetchList,
  deleteCourseType,
  batchDeleteCourseType,
  //getFirstCategory,
  // getSecondCategory,
  // getThirdCategory
} from "@/api/courseType";

import {fetchList as getListByCategory} from "@/api/courseType"
export default {
  name: "courseTypeList",
  data() {
    return {
      operates: [
        {
          label: "批量删除",
          value: 0
        }
      ],
      operateType: null,
      listQuery: {
        firstType: null,
        secondType: null,
        thirdType: null,
        pageNum: 1,
        pageSize: 5
      },
      list: [],
      firstCategoryOptions: [],
      secondCategoryOptions: [],
      thirdCategoryOptions: [],
      total: null,
      listLoading: false, //临时修改了一下
      multipleSelection: []
    };
  },
  created() {
    this.getList();
    this.getFirstCategoryList();
    // this.getSecondCategoryList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      //this.listLoading = false;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
        this.totalPage = response.data.totalPage;
        this.pageSize = response.data.pageSize;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //添加
    addCourseType() {
      this.$router.push({ path: "/course/addCourseType" });
    },
    //更新
    handleUpdate(index, row) {
      this.$router.push({
        path: "/course/updateCourseType",
        query: { id: row.id }
      });
    },
    //删除
    handleDelete(index, row) {
      this.$confirm("是否要删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteCourseType(row.id).then(response => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000
          });
          this.getList();
        });
      });
    },
    //处理改变分页
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    //查询
    searchCourseTypeList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    //处理批量操作
    handleBatchOperate() {
      console.log(this.multipleSelection);
      console.log("娅娅");
      if (this.multipleSelection < 1) {
        this.$message({
          message: "请选择一条记录",
          type: "warning",
          duration: 1000
        });
        return;
      }
      //用来判断是选中了哪个批量操作!!!!!!!!!!!!!（这个没有实现批量删除）
      let ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
      }
      console.log(ids)
      if (this.operateType === 0) {
        //删除
        // this.deleteHomeAdvertise(ids);
        //在这里重新写一个函数
        this.batchDeleteCourseType(ids.join('%2C'));
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
          duration: 1000
        });
      }
    },
    batchDeleteCourseType(ids) {
      this.$confirm("是否要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //let params = new URLSearchParams();
        //params.append("ids", ids);
        batchDeleteCourseType(ids).then(response => {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
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
    selectFirstCategory(){
      this.secondCategoryOptions = [];
      this.thirdCategoryOptions = [];
        //加载二级列表
        getListByCategory({firstType : this.listQuery.firstType,secondType:null,thirdType:null,pageSize:100}).then(response => {
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
        })
        this.listQuery.secondType = null;//将上一次二级分类选中的结果置为空。
        this.listQuery.thirdType = null;//将上一次二级分类选中的结果置为空。
    },
    //选择二级列表以后
    selectSecondCategory(){
      this.thirdCategoryOptions = [];
        //加载二级列表
        getListByCategory({firstType : this.listQuery.firstType,secondType:this.listQuery.secondType,thirdType:null,pageSize:100}).then(response => {
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
        })
        this.listQuery.thirdType = null;//将上一次三级分类选中的结果置为空。
    },
    //条件重置
    resetSearchConditions(){
      this.listQuery.firstType=null
      this.listQuery.secondType=null
      this.listQuery.thirdType=null
      this.secondCategoryOptions = []
      this.thirdCategoryOptions = []
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>