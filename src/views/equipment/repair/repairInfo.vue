<template>
  <div class="app-container">
    <el-card>
      <div style="margin-bottom:30px;">
        <i class="el-icon-tickets"></i>
        <span>维修状态</span>
      </div>
      <div>
      <el-steps :space="200" :active="statusList.length" finish-status="success">
        <el-step :title="item.value" v-for="item in statusList" :key="item.value"></el-step>
      </el-steps>
      </div>
    </el-card>

    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-tickets"></i>
        <span>设备信息</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" size="small" label-width="100px">
          <el-form-item label="设备名称：" style="80px">
            <el-input style="width: 203px" size="small" v-model="obj.deviceTypeName"></el-input>
          </el-form-item>
          <el-form-item label="设备编号：">
            <el-input style="width: 203px" size="small" v-model="obj.oldDeviceNumber"></el-input>
          </el-form-item>
          <el-form-item label="设备型号：">
            <el-input style="width: 203px" size="small" v-model="obj.modelNumber"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-tickets"></i>
        <span>报修信息</span>
      </div>
      <div>
        <el-form :inline="true" size="small" label-width="100px">
          <el-form-item label="报修单号：" style="80px">
            <el-input style="width: 203px" size="small" v-model="obj.maintainCode" readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="报障人：">
            <el-input style="width: 203px" size="small" v-model="obj.linkman" readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="时间：">
            <el-input style="width: 203px" size="small" v-model="obj.applyTime" readonly="true"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" size="small" label-width="100px">
          <el-form-item label="故障等级：">
            <el-input style="width: 203px" size="small" v-model="obj.falutLevel" readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="故障现象：">
            <el-input style="width: 203px" size="small" v-model="obj.description" readonly="true"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" size="small" label-width="100px">
          <el-form-item label="故障原因：">
            <el-input style="width: 500px" size="small" type="textarea" v-model="obj.applyReason" readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-tickets"></i>
        <span>维修信息</span>
      </div>
      <!-- <el-form :inline="true" size="small" label-width="100px">
          <el-form-item label="开始时间：">
            <el-input style="width: 300px" size="small" v-model="obj.maintainStartTime"></el-input>
          </el-form-item>
      </el-form>-->
      <div class="table-container">
        <el-table
          ref="equipmentTable"
          :data="list"
          style="width: 100%"
          v-loading="listLoading"
          border
        >
          <el-table-column label="开始时间" align="center" width="180">
            <template slot-scope="scope">{{scope.row.maintainStartTime}}</template>
          </el-table-column>
          <el-table-column label="结束时间" align="center" width="180">
            <template slot-scope="scope">{{scope.row.maintainEndTime}}</template>
          </el-table-column>
          <el-table-column label="处理人" align="center">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column label="更换配件名" align="center">
            <template slot-scope="scope">{{scope.row.exchangeDeviceName}}</template>
          </el-table-column>
          <el-table-column label="数目" align="center">
            <template slot-scope="scope">{{scope.row.countNumber}}</template>
          </el-table-column>
          <el-table-column label="故障原因分析" align="center">
            <template slot-scope="scope">{{scope.row.failureAnalysisResultEvaluation}}</template>
          </el-table-column>
          <el-table-column label="防止措施" align="center">
            <template slot-scope="scope">{{scope.row.preventiveMeasure}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-tickets"></i>
        <span>换货信息</span>
      </div>
      <div>
        <div class="table-container">
          <el-table
            ref="equipmentTable"
            :data="list"
            style="width: 100%"
            v-loading="listLoading"
            border
          >
            <el-table-column label="新设备编号" align="center">
              <template slot-scope="scope">{{scope.row.deviceDTO.deviceNumber}}</template>
            </el-table-column>
            <!-- <el-table-column label="设备型号" align="center">
              <template slot-scope="scope">{{scope.row.modelNumber}}</template>
            </el-table-column>-->
            <el-table-column label="换货人" align="center">
              <template slot-scope="scope">{{scope.row.username}}</template>
            </el-table-column>
            <!-- <el-table-column label="换货时间" align="center">
              <template slot-scope="scope">{{scope.row.exchangeTime}}</template>
            </el-table-column>-->
            <el-table-column label="物流单号" align="center">
              <template slot-scope="scope">{{scope.row.exchangeOrderNum}}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { fetchList, splitStatusChange } from "@/api/equipmentRepair";
export default {
  name: "StoreInfoDetail",
  data() {
    return {
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
        id: null,
        pageNum: 1,
        pageSize: 5
      },
      obj: {},
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
      faultLevelList: ["维修", "整机更换"],
      statusList: []
    };
  },
  created() {
    this.listQuery.id = this.$route.query.id;
    // this.splitStatusChange(this.$route.query.id)
    this.getList();
    this.getSplitStatusChange(this.listQuery.id);
  },
  methods: {
    getSplitStatusChange(id) {
      splitStatusChange(id).then(res => {
        let arr = [];
        //arr = [...new Set(res.data)];
        arr = res.data;
        for (let i = 0; i < arr.length; i++) {
          this.statusList.push({ label: arr[i], value: arr[i] });
        }
      });
    },
    getList() {
      this.listLoading = true;
      //this.listLoading = false;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.obj = response.data.list[0];

        this.obj.applyReason = this.applyReasonList[this.obj.applyReason];
        this.obj.falutLevel = this.faultLevelList[this.obj.falutLevel];
      });
    }
  }
};
</script>




<style>
</style>