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
              <el-option label="未维修" value="1"></el-option>
              <el-option label="已维修" value="2"></el-option>
              <el-option label="维修失败" value="8"></el-option>
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
        <el-table-column label="维修编号" align="center">
          <template slot-scope="scope">{{scope.row.maintainCode}}</template>
        </el-table-column>
        <el-table-column label="设备编号" align="center">
          <template slot-scope="scope">{{ scope.row.oldDeviceNumber }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
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
        <el-form-item label="更换配件名称" :label-width="formLabelWidth">
          <el-input v-model="repairForm.exchangeDeviceName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="更换配件数目" :label-width="formLabelWidth">
          <el-input v-model="repairForm.countNumber" auto-complete="off"></el-input>
        </el-form-item>
        <div class="block">
          <el-date-picker
            v-model="value3"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <el-form-item label="故障原因分析与结果评定" :label-width="formLabelWidth">
          <el-input v-model="repairForm.failureAnalysisResultEvaluation" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="改善措施" :label-width="formLabelWidth">
          <el-input v-model="repairForm.preventiveMeasure" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="维修人员处理方法" :label-width="formLabelWidth">
          <el-input v-model="repairForm.maintainDealFunction" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="repairSuccess()">维修成功</el-button>
        <el-button @click="dialogMaintainVisible = false">维修失败</el-button>
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
  maintainDevice
} from "@/api/equipmentRepair";
import { regionDataPlus, CodeToText } from "element-china-area-data";

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
        dealStatus: null,
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
        id: 1,
        exchangeDeviceName: null,
        countNumber: null,
        maintainStartTime: "2000-11-10 10:10:00",
        maintainEndTime: "2000-11-11 10:10:00",
        failureAnalysisResultEvaluation: null,
        preventiveMeasure: null,
        maintainDealFunction: null
      },
      options: regionDataPlus, //全国的地理信息
      listLoading: false, //临时修改了一下
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value4: ""
    };
  },
  created() {
    this.getList();
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
    repairSuccess() {
      this.$confirm("是否提交？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        maintainDevice(this.repairForm).then(response => {
          this.$message({
            message: "提交成功",
            type: "success",
            duration: 1000
          });
          this.getList();
        });
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>