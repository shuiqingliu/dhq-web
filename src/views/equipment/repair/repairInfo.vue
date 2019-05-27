<template>
  <div class="app-container">
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
            <el-input style="width: 203px" size="small" v-model="obj.maintainCode"></el-input>
          </el-form-item>
          <el-form-item label="报障人：">
            <el-input style="width: 203px" size="small" v-model="obj.linkman"></el-input>
          </el-form-item>
          <el-form-item label="时间：">
            <el-input style="width: 203px" size="small" v-model="obj.applyTime"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" size="small" label-width="100px">
          <el-form-item label="故障等级：">
            <el-input style="width: 203px" size="small" v-model="obj.falutLevel"></el-input>
          </el-form-item>
          <el-form-item label="故障现象：">
            <el-input style="width: 203px" size="small" v-model="obj.description"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" size="small" label-width="100px">
          <el-form-item label="故障原因：">
            <el-input style="width: 500px" size="small" type="textarea" v-model="obj.applyReason"></el-input>
          </el-form-item>
        </el-form>

        <el-form :inline="true" size="small" label-width="100px">
          <el-form-item label="处理时间：">
            <el-input style="width: 300px" size="small" v-model="obj.dealTime"></el-input>
          </el-form-item>
          <el-form-item label="处理人：">
            <el-input style="width: 150px" size="small"></el-input>
          </el-form-item>
          <el-form-item label="操作：">
            <el-input style="width: 150px" size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <div>
        <i class="el-icon-tickets"></i>
        <span>状态改变</span>
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
            <el-table-column label="设备型号" align="center">
              <template slot-scope="scope">{{scope.row.modelNumber}}</template>
            </el-table-column>
            <el-table-column label="换货人" align="center">
              <template slot-scope="scope">{{scope.row.username}}</template>
            </el-table-column>
            <el-table-column label="换货时间" align="center">
              <template slot-scope="scope">{{scope.row.exchangeTime}}</template>
            </el-table-column>
            <el-table-column label="物流单号" align="center">
              <template slot-scope="scope">{{scope.row.exchangeOrderNum}}</template>
            </el-table-column>
          </el-table>
        </div>
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
            <el-table-column label="设备型号" align="center">
              <template slot-scope="scope">{{scope.row.modelNumber}}</template>
            </el-table-column>
            <el-table-column label="换货人" align="center">
              <template slot-scope="scope">{{scope.row.username}}</template>
            </el-table-column>
            <el-table-column label="换货时间" align="center">
              <template slot-scope="scope">{{scope.row.exchangeTime}}</template>
            </el-table-column>
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
import { fetchList } from "@/api/equipmentRepair";
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
      list:[],
      applyReasonList:["操作失误","采购件质量问题","超期保养","工艺不合理","点检不到位","巡检不到位","电气故障","润滑不及时", "正常配件更换","其它"],
      faultLevelList:["维修","整机更换"],
   };
  },
  created() {
    this.listQuery.id = this.$route.query.id;
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      //this.listLoading = false;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.obj = response.data.list[0];

        this.obj.applyReason =  this.applyReasonList[this.obj.applyReason];
        this.obj.falutLevel = this.faultLevelList[this.obj.falutLevel]
      });
    }
  }
};
</script>




<style>
</style>