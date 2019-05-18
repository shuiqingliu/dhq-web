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
            <el-select v-model="listQuery.keyword1" placeholder="请选择类别" clearable @change="selectFirstCategory()">
              <el-option
                v-for="item in firstCategoryOptions"
                :key="item.first_category"
                :label="item.label"
                :value="item.first_category"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="二级类别：">
            <el-select v-model="listQuery.keyword2" placeholder="请选择类别" clearable @change="selectSecondCategory()">
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
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>设备实例列表</span>
      <el-button class="btn-add" @click="addEquipmentInstance()" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="equipmentTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <!-- <el-table-column label="设备编号" align="center" width="100">
          <template slot-scope="scope">{{scope.row.deviceNumber}}</template>
        </el-table-column> -->
        <el-table-column label="设备名" align="center" width="150">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="设备型号" align="center" width="100">
          <template slot-scope="scope">{{scope.row.modelNumber}}</template>
        </el-table-column>
        <el-table-column label="图片" align="center" width="150">
          <template slot-scope="scope">{{scope.row.picture}}</template>
        </el-table-column>
        <el-table-column label="单价" align="center" width="100">
          <template slot-scope="scope">{{scope.row.price}}</template>
        </el-table-column>
        <el-table-column label="生产日期" align="center">
          <template slot-scope="scope">{{scope.row.produceDate}}</template>
        </el-table-column>
        <el-table-column label="使用年限" align="center" width="80">
          <template slot-scope="scope">{{scope.row.useYear}}</template>
        </el-table-column>
         <el-table-column label="类别ID" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>一级分类: {{ scope.row.deviceType.firstCategory }}</p>
              <p>二级分类: {{ scope.row.deviceType.secondCategory }}</p>
              <p>三级分类: {{ scope.row.deviceType.thirdCategory }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" >{{ scope.row.deviceType.id}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="是否分配" align="center" width="80">
          <template slot-scope="scope">{{scope.row.deviceUseState}}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">{{scope.row.describtion}}</template>
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
  deleteEquipmentInstance,
  batchDeleteEquipmentInstance,
  getFirstCategory,
  getSecondCategory,
  getThirdCategory
} from "@/api/equipmentInstance";

import {fetchList as getListByCategory} from "@/api/equipmentType"
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
    addEquipmentInstance() {
      this.$router.push({ path: "/equipment/addEquipmentInstance" });
    },
    //更新
    handleUpdate(index, row) {
      this.$router.push({
        path: "/equipment/updateEquipmentInstance",
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
        this.batchDeleteEquipmentInstance(ids);
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
          duration: 1000
        });
      }
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
      getFirstCategory().then(
        response => {
          this.firstCategoryOptions = response.data;
        }
      )
    },
    //选择一级列表以后
    selectFirstCategory(){
      this.secondCategoryOptions = [];
        //加载二级列表
        getListByCategory({keyword1 : this.listQuery.keyword1,keyword2:null,keyword3:null,pageSize:100}).then(response => {
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
        })
        this.listQuery.keyword2 = null;//将上一次二级分类选中的结果置为空。
        this.listQuery.keyword3 = null;//将上一次三级分类选中的结果置为空。
    },
    //选择二级列表以后
    selectSecondCategory(){
      this.thirdCategoryOptions = [];
        //加载二级列表
        getListByCategory({keyword1 : this.listQuery.keyword1,keyword2:this.listQuery.keyword2,keyword3:null,pageSize:100}).then(response => {
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
        })
        this.listQuery.keyword3 = null;//将上一次三级分类选中的结果置为空。
    },
    getSecondCategoryList() {
      fetchCategoryList({ pageNum: 1, pageSize: 100 }).then(response => {
        this.secondCategoryOptions = [];
        let secondCategoryList = response.data.list;
        let arr = [];
        for (let i = 0; i < secondCategoryList.length; i++) {
          arr.push(secondCategoryList[i].secondCategory);
        }
        //去重
        arr = [...new Set(arr)];
        for (let i = 0; i < arr.length; i++) {
          this.secondCategoryOptions.push({ label: arr[i], value: arr[i] });
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>