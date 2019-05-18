<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="searchCourseInstanceList()"
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
          <!-- <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="listQuery.firstType" placeholder="品牌名称/关键字"></el-input>
          </el-form-item>-->
          <el-form-item label="一级类别：">
            <el-select
              v-model="listQuery.firstType"
              placeholder="请选择类别"
              @change="selectFirstCategory()"
            >
              <el-option
                v-for="item in firstCategoryOptions"
                :key="item.first_type"
                :label="item.label"
                :value="item.first_type"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="二级类别：">
            <el-select
              v-model="listQuery.secondType"
              placeholder="请选择类别"
              @change="selectSecondCategory()"
            >
              <el-option
                v-for="item in secondCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="三级类别：">
            <el-select v-model="listQuery.thirdType" placeholder="请选择类别">
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
      <span>数据列表</span>
      <el-button class="btn-add" @click="addCourseInstance()" size="mini">添加</el-button>
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
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="课程编号" align="center" width="100">
          <template slot-scope="scope">{{scope.row.courseNumber}}</template>
        </el-table-column>
        <el-table-column label="课程名" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <img style="height: 70px" :src="scope.row.picture">
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template slot-scope="scope">{{scope.row.courseContent}}</template>
        </el-table-column>
        <el-table-column label="特色" align="center" width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.specialState === 0" style="color: #37B328">特色</span>
            <span v-else style="color:red">非特色</span>
          </template>
        </el-table-column>
        <el-table-column label="课长" align="center" width="70">
          <template slot-scope="scope">{{scope.row.timesOfClass}}分钟</template>
        </el-table-column>
        <el-table-column label="课时" align="center" width="70">
          <template slot-scope="scope">{{scope.row.countsOfClass}}</template>
        </el-table-column>
        <el-table-column label="价格￥" align="center" width="70">
          <template slot-scope="scope">{{scope.row.price}}</template>
        </el-table-column>
        <el-table-column label="推荐指数" align="center" width="80">
          <template slot-scope="scope">{{scope.row.recommendationCoefficient}}</template>
        </el-table-column>
        <el-table-column label="类别编号" align="center" width="80">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>一级分类: {{ scope.row.courseType.firstType }}</p>
              <p>二级分类: {{ scope.row.courseType.secondType }}</p>
              <p>三级分类: {{ scope.row.courseType.thirdType }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text">{{ scope.row.courseType.id }}</el-button>
              </div>
            </el-popover>
          </template>
          <!-- <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">查看</el-button>
          </template>-->
        </el-table-column>
        <el-table-column label="线上/线下" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.online === 0" style="color: #37B328">线上</span>
            <span v-else style="color:red">线下</span>
          </template>
        </el-table-column>
        <el-table-column label="上架" align="center" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleUpdateStatus(scope.$index,scope.row)"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="简介" align="center" width="70">
          <!-- <template slot-scope="scope">{{scope.row.description}}</template> -->
          <template slot-scope="scope">
            <el-button type="text" @click="description=scope.row.description;open()">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="课程简介" :visible.sync="dialogVisible" width="30%">
        <span>
          <el-input type="textarea" v-model="this.description"></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">返 回</el-button>
        </span>
      </el-dialog>
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
  deleteCourseInstance,
  batchDeleteCourseInstance,
  getCourseInstance,
  updateStatus,
  getFirstCategory,
  getSecondCategory,
  getThirdCategory
} from "@/api/courseInstance";

import { fetchList as getListByCategory } from "@/api/courseType";
export default {
  name: "courseInstanceList",
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
      multipleSelection: [],
      dialogVisible: false,
      description: null
    };
  },
  created() {
    this.getList();
    this.getFirstCategoryList();
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
    addCourseInstance() {
      this.$router.push({ path: "/course/addCourseInstance" });
    },
    //更新
    handleUpdate(index, row) {
      this.$router.push({
        path: "/course/updateCourseInstance",
        query: { id: row.id }
      });
    },
    //修改状态
    handleUpdateStatus(index, row) {
      this.$confirm("是否要修改上架/下架状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateStatus(row.id, { status: row.status }).then(response => {
            this.getList();
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "已取消操作!"
          });
          this.getList();
        });
    },

    //删除
    handleDelete(index, row) {
      this.$confirm("是否要删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteCourseInstance(row.id).then(response => {
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
    searchCourseInstanceList() {
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
      console.log(ids);
      if (this.operateType === 0) {
        //删除
        // this.deleteHomeAdvertise(ids);
        //在这里重新写一个函数
        this.batchDeleteCourseInstance(ids);
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
          duration: 1000
        });
      }
    },
    batchDeleteCourseInstance(ids) {
      this.$confirm("是否要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //let params = new URLSearchParams();
        //params.append("ids", ids);
        batchDeleteCourseInstance(ids).then(response => {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
    getFirstCategoryList() {
      getFirstCategory().then(response => {
        this.firstCategoryOptions = response.data;
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
      this.listQuery.thirdType = null; //将上一次三级分类选中的结果置为空
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
    open() {
      this.$alert(this.description, "课程简介");
    },
    resetSearchConditions(){
      this.listQuery.firstType=null
      this.listQuery.secondType=null
      this.listQuery.thirdType=null
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>