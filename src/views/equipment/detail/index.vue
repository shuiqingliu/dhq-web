<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="searchEquipmentDetailList()"
          type="primary"
          size="small"
        >查询结果</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="设备使用状态：">
            <el-select v-model="listQuery.deviceUseState" placeholder="请选择状态" clearable="true">
              <el-option label="未分配" value="0"></el-option>
              <el-option label="已分配" value="1"></el-option>
              <el-option label="已报废" value="2"></el-option>
              <el-option label="维修中" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>设备实例列表</span>
      <el-button class="btn-add" @click="addEquipmentDetail()" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="equipmentTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="设备编号" align="center">
          <template slot-scope="scope">{{scope.row.deviceNumber}}</template>
        </el-table-column>
        <el-table-column label="生产日期" align="center">
          <template slot-scope="scope">{{scope.row.produceDate}}</template>
        </el-table-column>
        <el-table-column label="分配日期" align="center">
          <template slot-scope="scope">{{scope.row.agreeTime}}</template>
        </el-table-column>
        <el-table-column label="废弃日期" align="center">
          <template
            slot-scope="scope"
          >{{scope.row.abandonedTime == null? "暂无": scope.row.abandonedTime}}</template>
        </el-table-column>
        <el-table-column label="使用状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.deviceUseState === 0" style="color: #37B328">未分配</span>
            <span v-if="scope.row.deviceUseState === 1" style="color:#37B328">已分配</span>
            <span v-if="scope.row.deviceUseState === 2" style="color:red">已报废</span>
            <span v-if="scope.row.deviceUseState === 3" style="color:red">维修中</span>
          </template>
        </el-table-column>
        <el-table-column label="所属门店" align="center">
          <template slot-scope="scope">{{scope.row.shopName}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
              :disabled="a[scope.row.deviceUseState][0]"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              :disabled="a[scope.row.deviceUseState][1]"
            >删除</el-button>
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
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { fetchList, deleteEquipmentDetail } from "@/api/equipmentDetail";

export default {
  name: "equipmentDetailList",
  data() {
    return {
      operates: [
        {
          label: "批量删除",
          value: 0
        }
      ],
      name: "",
      operateType: null,
      listQuery: {
        deviceTypeId: null,
        deviceUseState: null,
        pageNum: 1,
        pageSize: 5
      },
      list: [
        {
          deviceNumber: "007",
          deviceTypeId: 88,
          produceDate: "2019-05-19",
          deviceUseState: "未使用"
        }
      ],
      firstCategoryOptions: [],
      secondCategoryOptions: [],
      thirdCategoryOptions: [],
      deviceTypeId: null,
      total: null,
      listLoading: false, //临时修改了一下
      a: {
        0: [false, false], //未分配
        1: [true, true], //已分配
        2: [true, true], //已报废
        3: [true, true] //维修中
      }
    };
  },
  created() {
    this.listQuery.deviceTypeId = this.$route.query.deviceTypeId;
    // this.listQuery.name = this.$route.query.name;
    this.getList();
    //this.name = this.$route.query.name;
  },
  methods: {
    getList() {
      //this.listLoading = true;
      //this.listLoading = false;
      fetchList(this.listQuery).then(response => {
        // this.listLoading = false;
        this.list = response.data.list;
        this.deviceTypeId = response.data.list[0].deviceTypeId;
        this.total = response.data.total;
        this.totalPage = response.data.totalPage;
        this.pageSize = response.data.pageSize;
      });
    },
    //添加
    addEquipmentDetail(index, row) {
      this.$router.push({
        path: "/equipment/addEquipmentDetail",
        query: { deviceTypeId: this.deviceTypeId }
      });
    },
    //更新
    handleUpdate(index, row) {
      this.$router.push({
        path: "/equipment/updateEquipmentDetail",
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
        deleteEquipmentDetail(row.id).then(response => {
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
    searchEquipmentDetailList() {
      this.listQuery.pageNum = 1;
      this.getList();
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>