<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="searchStoreEquipmentList()"
          type="primary"
          size="small"
        >筛选查询</el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="resetSearchConditions(),searchStoreEquipmentList()"
          size="small"
        >全部查询</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="请输入地区信息">
            <el-cascader size="medium" :options="options" v-model="selectedOptions" placeholder="请选择地区"  @change="getShopName()"></el-cascader>
          </el-form-item>
          <el-form-item label="输入门店名：">
            <el-select
              v-model="listQuery.shopName"
              placeholder="请选择类别"
              clearable
            >
              <el-option
                v-for="item in shopNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名：">
            <el-select
              v-model="listQuery.shopName"
              placeholder="请选择设备名"
              clearable
            >
              <el-option
                v-for="item in shopNameList"
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
      <span>门店设备列表</span>
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
        <el-table-column label="编号" align="center" width="100">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="门店名" align="center" width="100">
          <template slot-scope="scope">{{scope.row.shopName}}</template>
        </el-table-column>
        <!-- <el-table-column label="设备申请Id" align="center" width="120">
          <template slot-scope="scope">{{scope.row.applyDeviceId}}</template>
        </el-table-column>-->
        <el-table-column label="设备编号" align="center" width="130">
          <template slot-scope="scope">{{scope.row.deviceNumber}}</template>
        </el-table-column>
        <el-table-column label="设备名" align="center" width="100">
          <template slot-scope="scope">{{scope.row.deviceTypeName}}</template>
        </el-table-column>
        <el-table-column label="设备型号" align="center">
          <template slot-scope="scope">{{scope.row.modelNumber}}</template>
        </el-table-column>
        <el-table-column label="所属类别" align="center">
          <template slot-scope="scope">{{scope.row.threeCategory}}</template>
        </el-table-column>
        <el-table-column label="批准时间" align="center" width="160">
          <template slot-scope="scope">{{scope.row.agreeTime}}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">{{scope.row.remark}}</template>
        </el-table-column>
        <el-table-column label="是否收货" align="center">
          <template slot-scope="scope">{{scope.row.ifReceive == 0? '否':'是'}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deleteParam.shopDeviceid=scope.row.id,
            deleteParam.deviceID=scope.row.deviceTypeId,dialogVisible = true">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="选择状态" :visible.sync="dialogVisible" width="30%">
        <el-form :model="deleteParam" >
          <el-form-item label="回收途径" label-width='150px'>
            <el-select v-model="deleteParam.newSatus" placeholder="请选择活动区域">
              <el-option label="报废" value="2"></el-option>
              <el-option label="重新分配" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDelete(),dialogVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- <div class="batch-operate-container">
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
    </div> -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  fetchList,
  getStoreEquipmentById,
  deleteStoreEquipment,
  getShopNameByLocation
  // deleteEquipmentInstance,
  // batchDeleteEquipmentInstance,
  // getFirstCategory,
  // getSecondCategory,
  // getThirdCategory
} from "@/api/storeEquipment";

import { fetchList as getListByCategory,} from "@/api/equipmentType";
import { regionDataPlus, CodeToText } from "element-china-area-data";
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
      listQuery: {
        province: null,
        city: null,
        district: null,
        shopName: null,
        pageNum: 1,
        pageSize: 20
      },
      deleteParam:{
        shopDeviceid:null,
        deviceID:null,
        newSatus:null
      },
      list: [],
      firstCategoryOptions: [],
      secondCategoryOptions: [],
      thirdCategoryOptions: [],
      total: null,
      listLoading: false, //临时修改了一下
      multipleSelection: [],
      options: regionDataPlus, //全国的地理信息
      selectedOptions: [],
      dialogVisible:false,
      shopNameList:[]
    };
  },
  created() {
    this.getList();
    //this.getFirstCategoryList();
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
    //添加
    addEquipmentInstance() {
      this.$router.push({ path: "/equipment/addEquipmentInstance" });
    },
    //更新
    handleUpdate(index, row) {
      this.$router.push({
        path: "/equipment/updateEquipmentInstance",
        query: { id: row.id }
      });
    },
    //删除
    handleDelete() {
      this.$confirm("是否要删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteStoreEquipment(this.deleteParam).then(response => {
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
    searchEquipmentInstanceList() {
      alert(this.listQuery.keyword1);
      alert(this.listQuery.keyword2);
      alert(this.listQuery.keyword3);
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // //处理批量操作
    // handleBatchOperate() {
    //   console.log(this.multipleSelection);
    //   console.log("娅娅");
    //   if (this.multipleSelection < 1) {
    //     this.$message({
    //       message: "请选择一条记录",
    //       type: "warning",
    //       duration: 1000
    //     });
    //     return;
    //   }
    //   //用来判断是选中了哪个批量操作!!!!!!!!!!!!!（这个没有实现批量删除）
    //   let ids = [];
    //   for (let i = 0; i < this.multipleSelection.length; i++) {
    //     ids.push(this.multipleSelection[i].id);
    //   }
    //   console.log(ids);
    //   if (this.operateType === 0) {
    //     //删除
    //     // this.deleteHomeAdvertise(ids);
    //     //在这里重新写一个函数
    //     this.batchDeleteEquipmentInstance(ids);
    //   } else {
    //     this.$message({
    //       message: "请选择批量操作类型",
    //       type: "warning",
    //       duration: 1000
    //     });
    //   }
    // },
    // batchDeleteEquipmentInstance(ids) {
    //   this.$confirm("是否要删除?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(() => {
    //     //let params = new URLSearchParams();
    //     //params.append("ids", ids);
    //     batchDeleteEquipmentInstance(ids).then(response => {
    //       this.getList();
    //       this.$message({
    //         type: "success",
    //         message: "删除成功!"
    //       });
    //     });
    //   });
    // },
    getFirstCategoryList() {
      getFirstCategory().then(response => {
        this.firstCategoryOptions = response.data;
      });
    },
    //查询
    searchStoreEquipmentList() {
      if(this.listQuery.shopName == ""){
        this.listQuery.shopName = null
      }
      let length = this.selectedOptions.length;
      // alert(length);
      // alert(CodeToText[this.selectedOptions[0]]);
      if (CodeToText[this.selectedOptions[0]] == "全部") {
        this.listQuery.province=null
      } else {
        this.listQuery.province = CodeToText[this.selectedOptions[0]];
        //alert(this.listQuery.province)
        if (length === 2) {
          // this.listQuery.city=CodeToText[this.selectedOptions[1]];
          // this.listQuery.district=CodeToText[this.selectedOptions[2]];
          this.listQuery.city = null;
          this.listQuery.district = null;
        }
        if (length === 3) {
          this.listQuery.city = CodeToText[this.selectedOptions[1]];
          if (this.selectedOptions[2] == "") {
            this.listQuery.district = null;
          } else {
            this.listQuery.district = CodeToText[this.selectedOptions[2]];
          }
        }
        //alert(this.listQuery.city)
        //alert(this.listQuery.district)
      }
      this.listQuery.pageNum = 1;
      this.getListById();
    },
    getListById() {
      this.listLoading = true;
      //this.listLoading = false;
      getStoreEquipmentById(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
        this.totalPage = response.data.totalPage;
        this.pageSize = response.data.pageSize;
      });
    },
    //条件查询重置
    resetSearchConditions() {
      this.selectedOptions = [];
      this.listQuery.province = null;
      this.listQuery.city = null;
      this.listQuery.district = null;
      this.listQuery.shopName = null;
    },
    getShopName(){
      this.listQuery.shopName=null
      this.shopNameList = []
      let length = this.selectedOptions.length;
      if (CodeToText[this.selectedOptions[0]] == "全部") {
        this.listQuery.pageNum = 1;
        this.listQuery.province=null,
        this.getShopNameList()
      } else {
        this.listQuery.province = CodeToText[this.selectedOptions[0]];
        if (length === 2) {
          this.listQuery.city = null;
          this.listQuery.district = null;
        }
        if (length === 3) {
          this.listQuery.city = CodeToText[this.selectedOptions[1]];
          if (this.selectedOptions[2] == "") {
            this.listQuery.district = null;
          } else {
            this.listQuery.district = CodeToText[this.selectedOptions[2]];
          }
        }
        this.listQuery.pageNum = 1;
        this.getShopNameList()
      }

    },
    getShopNameList(){
      getShopNameByLocation(this.listQuery).then(
          response => {
            let list = response.data.list
            for(let i = 0;i<list.length;i++){
              this.shopNameList.push({label:list[i].shopName,value:list[i].shopName})
            }
          }
        );
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>