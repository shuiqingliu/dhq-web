<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="searchDeviceMaintainList()"
          type="primary"
          size="small"
        >查询结果</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="设备型号：">
            <el-input v-model="listQuery.modelNumber" placeholder="请输入设备型号" size="small"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="listQuery.dealStatus" placeholder="请选择状态" style="width:178px">
              <el-option
                v-for="item in dealStatusOptions"
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
      <span>设备维修列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="equipmentTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <!-- <el-table-column label="维修编号" align="center">
          <template slot-scope="scope">{{scope.row.maintainCode}}</template>
        </el-table-column>
        <el-table-column label="设备编号" align="center">
          <template slot-scope="scope">{{ scope.row.oldDeviceNumber }}</template>
        </el-table-column>-->
        <el-table-column label="维修编号" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getRepairInfo(scope.$index, scope.row)"
            >{{scope.row.maintainCode}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="设备编号" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>编号: {{ scope.row.oldDeviceNumber }}</p>
              <p>型号: {{ scope.row.modelNumber }}</p>
              <p>设备类型: {{ scope.row.deviceTypeName }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text">{{ scope.row.oldDeviceNumber }}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="设备名-型号" align="center" width="170">
          <template slot-scope="scope">{{scope.row.deviceTypeName}}-{{scope.row.modelNumber}}</template>
        </el-table-column>
        <el-table-column label="维修人员" align="center" width="80">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" width="170">
          <template slot-scope="scope">{{scope.row.applyTime}}</template>
        </el-table-column>
        <el-table-column label="预计截止日期" align="center" width="150">
          <template slot-scope="scope">{{getTime(scope.row.applyTime)}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">{{dealStatusList[scope.row.dealStatus]}}</template>
        </el-table-column>
        <el-table-column label="故障类型" align="center">
          <template slot-scope="scope">{{applyReasonList[scope.row.applyReason]}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="maintainId = scope.row.id,dialogMaintainVisible = true"
              :disabled="a[scope.row.dealStatus]"
            >维修</el-button>
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
    <el-dialog title="维修信息" :visible.sync="dialogMaintainVisible">
      <el-form :model="repairForm">
        <el-form-item label="更换配件名称">
          <el-input v-model="repairForm.exchangeDeviceName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="更换配件数目">
          <el-input v-model="repairForm.countNumber" auto-complete="off"></el-input>
        </el-form-item>
        <div class="block">
          <span>起始时间:</span>
          <el-date-picker
            v-model="value1"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
          <span>至</span>
          <el-date-picker
            v-model="value2"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </div>
        <el-form-item label="故障原因分析与结果评定">
          <el-input v-model="repairForm.failureAnalysisResultEvaluation" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="改善措施">
          <el-input v-model="repairForm.preventiveMeasure" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="维修人员处理方法">
          <el-input v-model="repairForm.maintainDealFunction" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="repairSuccess()">维修成功</el-button>
        <el-button @click="repairFaild()">维修失败</el-button>
        <el-button @click="dialogMaintainVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  // getMaintainManagerList,
  // agreeDeviceMaintainApply,
  // refuseApply,
  // agreeDeviceChangingApply,
  maintainDevice,
  maintainFailure
} from "@/api/equipmentRepair";
import { regionDataPlus, CodeToText } from "element-china-area-data";
import { getUserRole } from "@/api/role";
export default {
  name: "equipmentTypeList",
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
        shopLocationProvince: null,
        shopLocationCity: null,
        shopLocationDistrict: null,
        shopName: null,
        dealStatus: 1,
        maintainManagerId: null,
        exchangeManagerId: null,
        firstCategory: null,
        secondCategory: null,
        thirdCategory: null,
        modelNumber: null,
        deviceTypeName: null,
        faultLevel: null,
        id: null,
        pageNum: 1,
        pageSize: 5
      },
      dealStatusOptions: [
        { value: 1, label: "维修中" },
        { value: 2, label: "已维修" },
        { value: 8, label: "维修失败" }
      ],
      listMaintainManagerQuery: {
        province: null,
        city: null,
        distinct: null,
        pageNum: 1,
        pageSize: 5
      },
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      deviceData: [
        {
          id: "bupt20190505",
          status: "未分配"
        }
      ],
      dealStatusList: [
        "待处理",
        "维修中",
        "已维修",
        "换货中",
        "已拒绝",
        "已解决",
        "已收货",
        "已换货",
        "维修失败"
      ],
      // a:[true,false,false],
      a: {
        1: false, //维修中
        2: true, //已维修
        8: true //维修失败
      },
      list: [],
      applyReasonList: [
        "操作失误",
        "采购件质量问题",
        "超期保养",
        "工艺不合理",
        "点检不到位",
        "巡检不到位",
        "电气故障",
        "润滑不及时",
        "正常配件更换",
        "其它"
      ],
      total: null,
      maintainTotal: null,
      dialogMaintainVisible: false,
      selectedOptions: [],
      refuseReason: null,
      maintainId: null,
      repairForm: {
        id: null,
        exchangeDeviceName: null,
        countNumber: null,
        maintainStartTime: null,
        maintainEndTime: null,
        failureAnalysisResultEvaluation: null,
        preventiveMeasure: null,
        maintainDealFunction: null
      },
      options: regionDataPlus, //全国的地理信息
      listLoading: false, //临时修改了一下
      value1: "",
      value2: "",
      adminDesc: null
    };
  },
  created() {
    
    this.getRole(this.$store.state.user.id)
   // this.getList();
  },
  methods: {
    getRole(id){
      getUserRole(id).then(response => {
      this.adminDesc = response.data[0].description;
      if (this.adminDesc === "系统管理员") {
        this.getList()
      }else{
        this.listQuery.maintainManagerId = this.$store.state.user.id;
        this.getList()
      }
    });
    },
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
    searchDeviceMaintainList() {
      this.getList();
    },
    //添加
    addEquipmentType() {
      this.$router.push({ path: "/equipment/addEquipmentType" });
    },
    //更新
    handleUpdate(index, row) {
      this.$router.push({
        path: "/equipment/updateEquipmentType",
        query: { id: row.id }
      });
    },
    getRepairInfo(index, row) {
      this.$router.push({
        path: "/equipment/equipmentRepairInfo",
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
        deleteEquipmentType(row.id).then(response => {
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
    //维修成功
    repairSuccess() {
      this.repairForm.maintainStartTime = this.value1;
      this.repairForm.maintainEndTime = this.value2;
      this.repairForm.id = this.maintainId;

      this.$confirm("是否提交？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        maintainDevice(this.repairForm).then(response => {
          this.dialogMaintainVisible = false;
          this.$message({
            message: "提交成功",
            type: "success",
            duration: 1000
          });
          this.getList();
        });
      });
    },
    //维修失败
    repairFaild() {
      this.repairForm.maintainStartTime = this.value1;
      this.repairForm.maintainEndTime = this.value2;
      this.repairForm.id = this.maintainId;

      this.$confirm("是否提交？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        maintainFailure(this.repairForm).then(response => {
          this.dialogMaintainVisible = false;
          this.$message({
            message: "提交成功",
            type: "success",
            duration: 1000
          });
          this.getList();
        });
      });
    },
    getTime(date) {
      var d = new Date(date);
      d.setDate(d.getDate() + 5);
      var m = d.getMonth() + 1;
      return (
        d.getFullYear() +
        "-" +
        m +
        "-" +
        d.getDate() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds()
      );
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>