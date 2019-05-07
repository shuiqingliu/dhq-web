<template>
  <div class="app-container">
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
        <el-table-column label="设备编号" align="center" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="设备名" align="center" width="150">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="设备图片" align="center" width="150">
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
         <el-table-column label="设备类别" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>一级分类: {{ scope.row.deviceType.firstCategory }}</p>
              <p>二级分类: {{ scope.row.deviceType.secondCategory }}</p>
              <p>三级分类: {{ scope.row.deviceType.thirdCategory }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text" >{{scope.row.deviceType.id}}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="设备编号" align="center" width="80">
          <template slot-scope="scope">{{scope.row.deviceNumber}}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">{{scope.row.describtion}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="allocateDevice(scope.$index, scope.row)">分配设备</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
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
  getEquipmentInstanceByTypeId,
} from "@/api/equipmentInstance";

import {
  batchAllocateDevice
} from "@/api/equipmentApply";


import {fetchList as getListByCategory} from "@/api/equipmentType"
export default {
  name: "equipmentInstanceList",
  data() {
    return {
      operates: [
        {
          label: "批量分配",
          value: 0
        }
      ],
      operateType: null,
      listQuery: {
        type_id: null,
        pageNum: 1,
        pageSize: 5
      },
      list: [],
      total: null,
      listLoading: false, //临时修改了一下
      multipleSelection: [],
      //  query: { shopId: row.shopId,applyId: row.applyId,deviceTypeId : row.deviceTypeId}
      allocateDeviceParams:{
        shopID:null,//记录设备申请的门店Id
        applyID:null,//记录申请Id
        IDs:null//设备ids
      }
    };
  },
  created() {
    //将设备申请页面传递的数据保存起来。
    this.listQuery.type_id = this.$route.query.deviceTypeId

    this.allocateDeviceParams.shopID = this.$route.query.shopId;
    this.allocateDeviceParams.applyID = this.$route.query.applyId;

    this.getList();
   
  },
  methods: {
    getList() {
      this.listLoading = true;
      //this.listLoading = false;
       getEquipmentInstanceByTypeId(this.listQuery).then(response => {
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
    //单个分配设备(在这里为了省事，直接调用了批量分配设备的接口)
    allocateDevice(index, row) {
      this.allocateDeviceParams.IDs = row.id,
      this.batchAllocateDevice(this.allocateDeviceParams);
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
    //处理批量分配操作
    handleBatchOperate() {
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
      this.allocateDeviceParams.IDs = ids.join(',');
      if (this.operateType === 0) {
        //批量分配设备.参数分别为:门店Id,申请Id,设备ids
        this.batchAllocateDevice(this.allocateDeviceParams);
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
          duration: 1000
        });
      }
    },
    batchAllocateDevice(params) {
      this.$confirm("是否要分配?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //let params = new URLSearchParams();
        //params.append("ids", ids);
        batchAllocateDevice(params).then(response => {
          this.getList();
          this.$message({
            type: "success",
            message: "分配成功!"
          });
        });
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>