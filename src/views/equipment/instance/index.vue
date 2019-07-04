<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="searchEquipmentInstanceList()"
          type="primary"
          size="small"
        >查询结果</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <!-- <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="listQuery.keyword1" placeholder="品牌名称/关键字"></el-input>
          </el-form-item>-->
          <el-form-item label="一级类别：">
            <el-select
              v-model="listQuery.keyword1"
              placeholder="请选择类别"
              clearable
              @change="selectFirstCategory()"
            >
              <el-option
                v-for="item in firstCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="二级类别：">
            <el-select
              v-model="listQuery.keyword2"
              placeholder="请选择类别"
              clearable
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
            <el-select v-model="listQuery.keyword3" placeholder="请选择类别" clearable>
              <el-option
                v-for="item in thirdCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="输入店名：">
            <el-input
              style="width: 203px"
              v-model="listQuery.modelNumber"
              placeholder="设备型号"
              size="small"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>设备类型列表</span>
      <el-button class="btn-add" @click="addEquipmentInstance()" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="equipmentTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="编号" align="center" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="设备型号" align="center" width="100">
          <template slot-scope="scope">{{scope.row.modelNumber}}</template>
        </el-table-column>
        <el-table-column label="设备名" align="center" width="100">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="所属类别" align="center">
          <template
            slot-scope="scope"
          >{{scope.row.firstCategory}}-{{scope.row.secondCategory}}-{{scope.row.thirdCategory}}</template>
        </el-table-column>
        <el-table-column label="图片" align="center" width="120">
          <template slot-scope="scope">
            <!-- <img style="height: 70px" :src="scope.row.picture"> -->
            <img alt= "暂无图片" style="height: 70px" :src="'http://60.205.167.19:8075/deviceType/showImage?id='+scope.row.id">
          </template>
        </el-table-column>
        <el-table-column label="单价￥" align="center" width="80">
          <template slot-scope="scope">{{scope.row.price}}</template>
        </el-table-column>
        <el-table-column label="使用年限" align="center" width="80">
          <template slot-scope="scope">{{scope.row.useYear}}</template>
        </el-table-column>
        <el-table-column label="库存" align="center" width="80">
          <template slot-scope="scope">{{scope.row.stock}}</template>
        </el-table-column>
        <el-table-column label="备注" align="center" width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="description=scope.row.description;open()">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="getEquipmentDetail(scope.$index, scope.row)"
            >查看实例</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { fetchList, deleteEquipmentInstance } from "@/api/equipmentInstance";

import { fetchList as getListByCategory } from "@/api/equipmentType";
export default {
  name: "equipmentInstanceList",
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
        keyword1: null,
        keyword2: null,
        keyword3: null,
        modelNumber: null,
        pageNum: 1,
        pageSize: 10
      },
      list: [
        // {
        //   id: 123,
        //   modelNumber: "note3",
        //   name: "小米",
        //   price: 8888,
        //   useYear: 10,
        //   stock: 56,
        //   picture: "http:",
        //   description: "hahah",
        //   firstCategory: "可移动",
        //   secondCategory: "电子",
        //   thirdCategory: "学能知识相关"
        // }
      ],
      firstCategoryOptions: [],
      secondCategoryOptions: [],
      thirdCategoryOptions: [],
      total: null,
      description: null,
      listLoading: false //临时修改了一下
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
      if(this.$route.query.listQuery){
        this.listQuery = this.$route.query.listQuery
      }
      fetchList(this.listQuery).then(response => {
         this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
        this.totalPage = response.data.totalPage;
        this.pageSize = response.data.pageSize;
      });
    },
    //添加
    addEquipmentInstance() {
      this.$router.push({ path: "/equipment/addEquipmentInstance",query: {listQuery:this.listQuery}});
    },
    //更新
    handleUpdate(index, row) {
      this.$router.push({
        path: "/equipment/updateEquipmentInstance",
        query: { id: row.id,listQuery:this.listQuery}
      });
    },
    //删除
    handleDelete(index, row) {
      this.$confirm("是否要删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteEquipmentInstance(row.id).then(response => {
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
    searchEquipmentInstanceList() {
      if(this.listQuery.keyword1 == ''){
        this.listQuery.keyword1 = null
      }
      if(this.listQuery.keyword2 == ''){
        this.listQuery.keyword2 = null
      }
      if(this.listQuery.keyword3 == ''){
        this.listQuery.keyword3 = null
      }
      this.listQuery.pageNum = 1;
      this.getList();
    },
    batchDeleteEquipmentInstance(ids) {
      this.$confirm("是否要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //let params = new URLSearchParams();
        //params.append("ids", ids);
        batchDeleteEquipmentInstance(ids).then(response => {
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
          if(secondCategoryList[i].secondCategory != null){
            arr.push(secondCategoryList[i].secondCategory);
          }
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
          if(thirdCategoryList[i].thirdCategory != null){
            arr.push(thirdCategoryList[i].thirdCategory);
          }
        }
        //去重
        arr = [...new Set(arr)];
        for (let i = 0; i < arr.length; i++) {
          this.thirdCategoryOptions.push({ label: arr[i], value: arr[i] });
        }
      });
      this.listQuery.keyword3 = null; //将上一次三级分类选中的结果置为空。
    },
    getEquipmentDetail(index, row) {
      this.$router.push({
        path: "/equipment/equipmentDetail",
        query: { deviceTypeId: row.id,listQuery:this.listQuery}
      });
    },
    open() {
      this.$alert(this.description, "课程简介");
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>