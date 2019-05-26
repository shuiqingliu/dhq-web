<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="searchEquipmentTypeList()"
          type="primary"
          size="small"
        >查询结果</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <!-- <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="listQuery.keyword1" placeholder="品牌名称/关键字"></el-input>
          </el-form-item>-->
          <el-form-item label="设备名称：">
            <el-input v-model="listQuery.modelNumber" placeholder="请输入设备名称" size="small"></el-input>
          </el-form-item>

          <el-form-item label="维修单号：">
            <el-input v-model="listQuery.modelNumber" placeholder="请输入维修单号" size="small"></el-input>
          </el-form-item>

          <el-form-item label="设备型号：">
            <el-input v-model="listQuery.modelNumber" placeholder="请输入设备型号" size="small"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <!-- <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="listQuery.keyword1" placeholder="品牌名称/关键字"></el-input>
          </el-form-item>-->
          <el-form-item label="处理人：">
            <el-input v-model="listQuery.modelNumber" placeholder="请输入处理人" size="small"></el-input>
          </el-form-item>

          <el-form-item label="状态：">
            <el-select
              v-model="listQuery.deviceUseState"
              placeholder="请选择状态"
              clearable="true"
              style="width:178px"
            >
              <el-option label="待处理" value="0"></el-option>
              <el-option label="维修中" value="1"></el-option>
              <el-option label="已修改" value="2"></el-option>
              <el-option label="换货中" value="3"></el-option>
              <el-option label="已拒绝" value="4"></el-option>
              <el-option label="已解决" value="5"></el-option>
              <el-option label="已收货" value="6"></el-option>
              <el-option label="已换货" value="7"></el-option>
              <el-option label="维修失败" value="8"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="维修等级：">
            <el-select
              v-model="listQuery.deviceUseState"
              placeholder="请选择状态"
              clearable="true"
              style="width:178px"
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
      <el-button class="btn-add" @click="addEquipmentType()" size="mini">添加</el-button>
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
            <el-button
              type="text"
              @click="handleUpdate(scope.$index, scope.row)"
            >{{scope.row.oldDeviceNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="门店名字" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleUpdate(scope.$index, scope.row)"
            >{{scope.row.shopName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="center">
          <template slot-scope="scope">{{scope.row.linkman}}</template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
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
        </el-table-column> -->
        <el-table-column label="故障类型" align="center">
          <template slot-scope="scope">{{applyReasonList[scope.row.applyReason]}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleUpdate(scope.$index, scope.row)">维修</el-button>
            <el-button size="mini" type="warning" @click="handleDelete(scope.$index, scope.row)">换货</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">拒绝</el-button>
            <el-button size="mini" type="success" @click="handleDelete(scope.$index, scope.row)">分配</el-button>
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
// import {
//   fetchList,
//   deleteEquipmentType,
//   batchDeleteEquipmentType
// } from "@/api/equipmentType";
// import { fetchList as getListByCategory } from "@/api/equipmentType";
import { fetchList } from "@/api/equipmentRepair";

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
        pageNum: 1,
        pageSize: 5
      },
      dealStatusList: [
        "待处理",
        "维修中",
        "已修改",
        "换货中",
        "已拒绝",
        "已解决",
        "已收货",
        "已换货",
        "维修失败"
      ],
      applyReasonList:["操作失误","采购件质量问题","超期保养","工艺不合理","点检不到位","巡检不到位","电气故障","润滑不及时", "正常配件更换","其它"],
      total: null,
      listLoading: false //临时修改了一下
    };
  },
  created() {
    this.getList();
    this.getFirstCategoryList();
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
    getRepairInfo(index,row){
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
    //查询
    searchEquipmentTypeList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    batchDeleteEquipmentType(ids) {
      this.$confirm("是否要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //let params = new URLSearchParams();
        //params.append("ids", ids);
        batchDeleteEquipmentType(ids).then(response => {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>