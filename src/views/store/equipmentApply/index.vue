<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <!-- <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="searchEquipmentInstanceList()"
          type="primary"
          size="small"
        >查询结果</el-button>
      </div> -->
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
        v-loading="listLoading"
        border
      >
        <el-table-column label="编号" align="center" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="门店名" align="center" width="110">
          <template slot-scope="scope">{{scope.row.shopName}}</template>
        </el-table-column>
        <el-table-column label="设备类别" align="center" width="200">
          <template slot-scope="scope">{{scope.row.className}}</template>
        </el-table-column>
        <el-table-column label="设备型号" align="center" width="100">
          <template slot-scope="scope">{{scope.row.modelNumber}}</template>
        </el-table-column>
        <el-table-column label="申请数量" align="center" width="100">
          <template slot-scope="scope">{{scope.row.applyNum}}</template>
        </el-table-column>
        <el-table-column label="申请原因" align="center" width="100">
          <template slot-scope="scope"  >
            <el-button type="text" @click="applyReasonDetail=scope.row.applyReason;open()">详情</el-button>
          </template>
        </el-table-column>

        <el-table-column label="申请状态" align="center" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.applyStatus === 0">待审核</span>
            <span v-if="scope.row.applyStatus === 1">已同意</span>
            <span v-if="scope.row.applyStatus === 2">已拒绝</span>
            <span v-if="scope.row.applyStatus === 3">已发货</span>
            <span v-if="scope.row.applyStatus === 4">部分收货</span>
            <span v-if="scope.row.applyStatus === 5">全部收货</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" width="160">
          <template slot-scope="scope">{{scope.row.applyTimes}}</template>
        </el-table-column>
        <el-table-column label="处理结果" align="center">
          <template slot-scope="scope">{{scope.row.resultDes}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" >
          <template slot-scope="scope" v-if="scope.row.resultDes == null || scope.row.resultDes == ''">
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
        :page-sizes="[15,25,30]"
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
        status:0,
        pageNum: 1,
        pageSize: 15
      },
      list: [],
      firstCategoryOptions: [
        {
          value: 0,
          label: "待审核",
        },
        {
          value: 1,
          label: "已同意",
        },
        {
          value: 2,
          label: "已拒绝"
        },
        {
          value: 3,
          label: "已发货"
        }
        ,
        {
          value: 4,
          label: "部分收货"
        }
        ,
        {
          value: 5,
          label: "全部收货"
        }
      ],
      total: null,
      listLoading: false, //临时修改了一下
      multipleSelection: [],
      dialogVisible: false,
      reason: null,
      applyId: null,
      applyReasonDetail:null
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
          applyId: row.id,
          shopId:row.shopId,
          deviceClassId:row.deviceClassId,
          modelNumber:row.modelNumber
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
    },
    open() {
      this.$alert(this.applyReasonDetail, "申请原因");
    },
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>