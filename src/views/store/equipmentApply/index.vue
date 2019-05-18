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
          <el-form-item label="申请状态：">
            <el-select v-model="listQuery.status" placeholder="请选择状态" clearable @change="searchEquipmentInstanceList()">
              <el-option
                v-for="item in firstCategoryOptions"
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
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" align="center" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="门店ID" align="center" width="150">
          <template slot-scope="scope">{{scope.row.shopId}}</template>
        </el-table-column>
        <el-table-column label="设备类型ID" align="center" width="100">
          <template slot-scope="scope">{{scope.row.deviceTypeId}}</template>
        </el-table-column>
        <el-table-column label="申请数量" align="center" width="100">
          <template slot-scope="scope">{{scope.row.applyNum}}</template>
        </el-table-column>
        <el-table-column label="申请原因" align="center" width="200">
          <template slot-scope="scope">{{scope.row.applyReason}}</template>
        </el-table-column>

        <el-table-column label="申请状态" align="center" width="80">
          <template slot-scope="scope">{{scope.row.applyStatus}}</template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" width="160">
          <template slot-scope="scope">{{scope.row.applyTimes}}</template>
        </el-table-column>
        <el-table-column label="处理结果" align="center">
          <template slot-scope="scope">{{scope.row.resultDes}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" >
          <template slot-scope="scope" v-if="scope.row.resultDes === null">
            <el-button size="mini" type="danger" @click="rejectApply(scope.$index, scope.row)">拒绝</el-button>
            <el-button size="mini" type="success" @click="handleApply(scope.$index, scope.row)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="拒绝原因" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <el-form>
          <el-form-item label-width="120">
            <el-input v-model="reason" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm(),dialogVisible = false">确 定</el-button>
        </div>
      </el-dialog>
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
  rejectDeviceApply
  // deleteEquipmentInstance,
  // batchDeleteEquipmentInstance,
  // getFirstCategory,
  // getSecondCategory,
  // getThirdCategory
} from "@/api/equipmentApply";

import { fetchList as getListByCategory } from "@/api/equipmentType";
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
        status:'待审核',
        pageNum: 1,
        pageSize: 5
      },
      list: [],
      firstCategoryOptions: [
        {
          value: "待审核",
          label: "待审核"
        },
        {
          value: "已同意",
          label: "已同意"
        },
        {
          value: "已拒绝",
          label: "已拒绝"
        },
        {
          value: "已发货",
          label: "已发货"
        }
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
    //拒绝申请
    rejectApply(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.reason = row.resultDes;
      this.applyId = row.id;
    },

    //确认
    handleDialogConfirm() {
      this.$confirm("确定要拒绝吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // rejectDeviceApply(this.applyId,this.reason).then(
        rejectDeviceApply(this.applyId, this.reason).then(response => {
          this.$message({
            message: "已拒绝",
            type: "success",
            duration: 1000
          });
          this.getList();
        });
      });
    },
    //处理申请
    handleApply(index, row) {
      this.$router.push({
        path: "/store/handleEquipmentApply",

        query: {
          shopId: row.shopId,
          applyId: row.id,
          deviceTypeId: row.deviceTypeId
        }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>