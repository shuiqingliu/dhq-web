<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="申请类型：">
            <el-select v-model="listQuery.typeId" placeholder="申请类型" clearable @change="searchApplyInstance()">
              <el-option
                v-for="item in applyOptions"
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
      <span>申请列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="equipmentTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="门店ID" align="center" width="150">
          <template slot-scope="scope">{{scope.row.typeId}}</template>
        </el-table-column>
        <el-table-column label="门店名" align="center" width="150">
          <template slot-scope="scope">{{scope.row.shopName}}</template>
        </el-table-column>
        <el-table-column label="信息" align="center">
          <template slot-scope="scope">{{scope.row.message}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleApply(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>

import {sysmsg} from "@/api/courseApply"
const defaultApply = {
  id: null,
  shopId: null,
  deviceTypeId: null,
  applyNum: null,
  applyReason: null,
  applyStatus: null,
  applyTime: null,
  resultDes: null
};
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
        typeId:null,
        // pageNum: 1,
        // pageSize: 15
      },
      list: [],
      applyOptions: [
        {
          value: "1",
          label: "课程申请",
        },
        {
          value: "2",
          label: "设备申请",
        },
        {
          value: "3",
          label: "维修申请"
        },
      ],
      total: null,
      listLoading: false, //临时修改了一下
      multipleSelection: [],
      dialogVisible: false,
      reason: null,
      applyId: null
    };
  },
  created() {
    this.getList();
    // this.getSecondCategoryList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      //this.listLoading = false;
      sysmsg(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        // this.total = response.data.total;
        // this.totalPage = response.data.totalPage;
        // this.pageSize = response.data.pageSize;
      });
    },
    //处理申请
    handleApply(index, row) {
      if(row.typeId === 1){
        this.$router.push({
        path: "/store/courseApply",//门店课程申请
      });
      }
      else if(row.typeId === 2){
        this.$router.push({
        path: "/store/equipmentApply",//门店设备申请
      });
      }else if(row.typeId == 3){
        this.$router.push({
        path: "/equipment/repair",//设备维修申请
      });
      }
      
    },
    //查询
    searchApplyInstance() {
      //this.listQuery.pageNum = 1;
      this.getList();
    },
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>