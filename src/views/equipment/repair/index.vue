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
        <el-form :inline="true" :model="listQuery" size="small">
          <el-form-item label="设备类型名称：">
            <el-input
              v-model="listQuery.deviceTypeName"
              placeholder="请输入设备类型名称"
              size="small"
              style="width:150px"
            ></el-input>
          </el-form-item>

          <el-form-item label="设备型号：">
            <el-input
              v-model="listQuery.modelNumber"
              placeholder="请输入设备型号"
              size="small"
              style="width:150px"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              v-model="listQuery.dealStatus"
              placeholder="请选择状态"
              style="width:150px"
              clearable="true"
            >
              <el-option
                v-for="item in dealStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="维修等级：">
            <el-select
              v-model="listQuery.faultLevel"
              placeholder="请选择维修等级"
              style="width:150px"
              clearable="true"
            >
              <el-option label="维修" value="0"></el-option>
              <el-option label="整机更换" value="1"></el-option>
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
        <el-table-column label="门店名字" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>省/直辖市: {{ scope.row.shopLocationProvince }}</p>
              <p>市: {{ scope.row.shopLocationCity }}</p>
              <p>区/县: {{ scope.row.shopLocationDistrict }}</p>
              <p>详细地址: {{ scope.row.shopLocationDetail }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text">{{ scope.row.shopName }}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="center">
          <template slot-scope="scope">{{scope.row.linkman}}</template>
        </el-table-column>
        <el-table-column label="联系电话" align="center" width="120">
          <template slot-scope="scope">{{scope.row.contactPhone}}</template>
        </el-table-column>
        <el-table-column label="维修等级" align="center">
          <template slot-scope="scope">{{scope.row.falutLevel === 0?"维修":"整机更换"}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <!-- <template>aaaa</template> -->
          <template slot-scope="scope">{{dealStatusList[scope.row.dealStatus]}}</template>
        </el-table-column>
        <!-- <el-table-column label="处理人" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>-->
        <el-table-column label="故障类型" align="center">
          <template slot-scope="scope">{{applyReasonList[scope.row.applyReason]}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="maintainId = scope.row.id;searchMaintainPeople(),dialogMaintainVisible = true"
            >维修</el-button>
            <el-button
              size="mini"
              type="warning"
              @click="maintainId = scope.row.id,dialogExchangeVisible=true"
            >换货</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="maintainId = scope.row.id;dialogRefuseVisible = true"
            >拒绝</el-button>
            <el-button
              size="mini"
              type="success"
              @click="maintainId = scope.row.id;exchangeManagerId = scope.row.exchangeManagerId;
              dialogDistributionVisible = true;searchDeviceList(scope.row.modelNumber)"
            >分配</el-button>
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
    <el-dialog title="维修人员列表" :visible.sync="dialogMaintainVisible">
      <el-cascader size="medium" :options="options" v-model="selectedOptions"></el-cascader>
      <el-button type="primary" @click="searchMaintainPeople()">查询维修人员</el-button>
      <el-table :data="gridData">
        <el-table-column property="id" label="ID" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="150"></el-table-column>
        <el-table-column property="phone" label="电话" width="150"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="allocateMaintenanceMan(maintainId, scope.row.id)"
            >确定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="maintainHandleSizeChange"
        @current-change="maintainHandleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listMaintainManagerQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listMaintainManagerQuery.pageNum"
        :total="maintainTotal"
      ></el-pagination>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogExchangeVisible" width="30%">
      <span>是否同意换货？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogExchangeVisible = false">取 消</el-button>
        <el-button type="primary" @click="exchangeGoods();dialogExchangeVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="拒绝原因" :visible.sync="dialogRefuseVisible" width="30%">
      <el-form>
        <el-form-item label-width="120">
          <el-input v-model="refuseReason" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRefuseVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRefuseApply(),dialogRefuseVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设备列表" :visible.sync="dialogDistributionVisible">
      <el-table :data="deviceData">
        <el-table-column property="id" label="设备ID" width="150"></el-table-column>
        <el-table-column property="deviceNumber" label="设备编号" width="150"></el-table-column>
        <el-table-column property="deviceUseState" label="状态" width="150"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="newDeviceId = scope.row.id;dialogWuLiuVisible = true;"
            >分配</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="dialogWuLiuVisible" width="30%">
      <el-form>
        <!-- <el-form-item label-width="120" label="设备编号">
          <el-input v-model="refuseReason"></el-input>
        </el-form-item>-->
        <el-form-item label-width="120" label="物流编号">
          <el-input v-model="wuLiuNumber"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogWuLiuVisible = false">取 消</el-button>
        <el-button type="primary" @click="allocateDevice(),dialogWuLiuVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  getMaintainManagerList,
  agreeDeviceMaintainApply,
  refuseApply,
  agreeDeviceChangingApply,
  agreeDeviceChangedApply
} from "@/api/equipmentRepair";
import { listByModelNumber } from "@/api/equipmentDetail";
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
        dealStatus: 0,
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
      dealStatusOptions: [
        { label: "待处理", value: 0 },
        { label: "维修中", value: 1 },
        { label: "已维修", value: 2 },
        { label: "换货中", value: 3 },
        { label: "已拒绝", value: 4 },
        { label: "已解决", value: 5 },
        { label: "已收货", value: 6 },
        { label: "已换货", value: 7 },
        { label: "维修失败", value: 8 }
      ],
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
      dialogRefuseVisible: false,
      dialogExchangeVisible: false,
      dialogDistributionVisible: false,
      dialogWuLiuVisible: false,
      selectedOptions: [],
      refuseReason: null,
      maintainId: null,
      wuLiuNumber: null,
      newDeviceId: null,
      exchangeManagerId: null,
      options: regionDataPlus, //全国的地理信息
      listLoading: false //临时修改了一下
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
      if (this.listQuery.faultLevel == "") {
        this.listQuery.faultLevel = null;
      }
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
    //处理改变分页
    maintainHandleSizeChange(val) {
      this.listMaintainManagerQuery.pageNum = 1;
      this.listMaintainManagerQuery.pageSize = val;
      this.getMaintain();
    },
    maintainHandleCurrentChange(val) {
      this.listMaintainManagerQuery.pageNum = val;
      this.getMaintain();
    },
    searchMaintainPeople() {
      let length = this.selectedOptions.length;
      this.listMaintainManagerQuery.province =
        CodeToText[this.selectedOptions[0]];
      //alert(this.listQuery.province)
      if (length === 1) {
        this.listMaintainManagerQuery.province = null;
      }
      if (length === 2) {
        // this.listQuery.city=CodeToText[this.selectedOptions[1]];
        // this.listQuery.district=CodeToText[this.selectedOptions[2]];
        this.listMaintainManagerQuery.city = null;
        this.listMaintainManagerQuery.district = null;
      }
      if (length === 3) {
        this.listMaintainManagerQuery.city =
          CodeToText[this.selectedOptions[1]];
        if (this.selectedOptions[2] == "") {
          this.listMaintainManagerQuery.district = null;
        } else {
          this.listMaintainManagerQuery.district =
            CodeToText[this.selectedOptions[2]];
        }
      }
      this.listMaintainManagerQuery.pageNum = 1;
      this.getMaintain();
    },
    getMaintain() {
      getMaintainManagerList(this.listMaintainManagerQuery).then(response => {
        this.gridData = response.data.list;
        this.maintainTotal = response.data.total;
        this.totalPage = response.data.totalPage;
        this.pageSize = response.data.pageSize;
      });
    },
    allocateMaintenanceMan(maintainId, personId) {
      this.$confirm("确定要分配维修人员吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        agreeDeviceMaintainApply(maintainId, personId).then(response => {
          this.$message({
            message: "分配成功",
            type: "success",
            duration: 1000
          });
          this.getMaintain();
        });
      });
    },
    //换货
    exchangeGoods() {
      this.$confirm("确定要换货吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //alert(this.maintainId)
        // rejectDeviceApply(this.applyId,this.reason).then(
        agreeDeviceChangingApply(this.maintainId).then(response => {
          this.$message({
            message: "已换货",
            type: "success",
            duration: 1000
          });
          this.getMaintain();
        });
      });
    },
    //拒绝
    handleRefuseApply() {
      this.$confirm("确定要拒绝吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // rejectDeviceApply(this.applyId,this.reason).then(
        refuseApply(this.maintainId, this.refuseReason).then(response => {
          this.$message({
            message: "已拒绝",
            type: "success",
            duration: 1000
          });
          this.getMaintain();
        });
      });
    },
    searchDeviceList(modelNumber) {
      listByModelNumber({
        modelNumber: modelNumber,
        pageSize: 100,
        pageNum: 1
      }).then(response => {
        this.deviceData = response.data.list;
        for (let i = 0; i < this.deviceData.length; i++) {
          //thirdCategoryList[i].thirdType);
          if (this.deviceData[i].deviceUseState === 0) {
            this.deviceData[i].deviceUseState = "未分配";
          }
        }
      });
    },
    allocateDevice() {
      agreeDeviceChangedApply({
        id: this.maintainId,
        exchangeManagerId: this.$store.state.user.id,
        newDeviceId: this.newDeviceId,
        exchangeOrderNumber: this.wuLiuNumber
      }).then(response => {
        this.$message({
          message: "已分配成功",
          type: "success",
          duration: 1000
        });
      });
      this.getMaintain();
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>