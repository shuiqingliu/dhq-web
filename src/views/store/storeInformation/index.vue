<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="searchStoreInfoList()"
          type="primary"
          size="small"
        >查询结果</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="请输入地区信息">
            <el-cascader
              size="medium"
              :options="options"
              v-model="selectedOptions"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="输入店名：">
            <el-input
              style="width: 203px"
              v-model="listQuery.shopName"
              placeholder="门店名字"
              size="medium"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>门店信息列表</span>
      <el-button class="btn-add" @click="addStoreInfo()" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="storeInfoTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="门店编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="负责人" width="100" align="center">
          <template slot-scope="scope">{{scope.row.managerId}}</template>
        </el-table-column>
        <el-table-column label="门店名字" width="170" align="center">
          <template slot-scope="scope">{{scope.row.shopName}}</template>
        </el-table-column>
        <el-table-column label="门店类型" width="100" align="center">
          <template slot-scope="scope">{{scope.row.shopType}}</template>
        </el-table-column>
        <!-- <el-table-column label="门店描述" width="100" align="center">
          <template slot-scope="scope">{{scope.row.shopDesc}}</template>
        </el-table-column>-->
        <el-table-column label="门店大小" width="100" align="center">
          <template slot-scope="scope">{{scope.row.shopSize}}</template>
        </el-table-column>
        <el-table-column label="员工数量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.employeeNum}}</template>
        </el-table-column>
        <el-table-column label="省市区" width="100" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>省: {{ scope.row.shopLocationProvince }}</p>
              <p>市: {{ scope.row.shopLocationCity }}</p>
              <p>区: {{ scope.row.shopLocationDistrict }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button type="text">{{ scope.row.shopLocationProvince }}</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="电话" width="120" align="center">
          <template slot-scope="scope">{{scope.row.shopPhone}}</template>
        </el-table-column>
        <el-table-column label="详细地址" align="center">
          <template slot-scope="scope">{{scope.row.shopLocationDetail}}</template>
        </el-table-column>
         <el-table-column label="备注" align="center" width="80">
          <!-- <template slot-scope="scope">{{scope.row.description}}</template> -->
          <template slot-scope="scope">
            <el-button type="text" @click="description=scope.row.shopDesc;open()">备注</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="mini" @click="getDatail(scope.$index, scope.row)">详情</el-button> -->
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="备注详情" :visible.sync="dialogVisible" width="30%">
        <span>
          <el-input type="textarea" v-model="this.description"></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">返 回</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
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
import { fetchList, deleteStoreInfo ,batchDeleteStoreInfo} from "@/api/storeInformation";
import { regionDataPlus, CodeToText } from "element-china-area-data";
export default {
  name: "storeInfoList",
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
        shopName: null,
        province: null,
        city: null,
        district: null,
        pageNum: 1,
        pageSize: 5
      },
      list: [
        {
          employeeNum: 23,
          managerId: 110,
          shopDesc: "北邮店",
          shopId: 0,
          shopLocationCity: "北京市",
          shopLocationDetail: "北京邮电大学",
          shopLocationDistrict: "海淀区",
          shopLocationProvince: "北京市",
          shopName: "学能通",
          shopPhone: 12589,
          shopSize: 234,
          shopType: "math"
        }
      ],
      total: null,
      listLoading: false, //临时修改了一下
      multipleSelection: [],
      options: regionDataPlus, //全国的地理信息
      selectedOptions: [],
      dialogVisible: false,
      description:null
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //获取一条记录的详情
    getDatail(index, row) {
      this.$router.push({
        path: "/store/getStoreInfoDetail",
        query: { id: row.id }
      }); //!!!!!!!!注意（row.  后面跟具体的id）
    },
    //更新
    handleUpdate(index, row) {
      this.$router.push({
        path: "/store/updateStoreInfo",
        query: { id: row.id}
      }); //!!!!!!!!注意（row.  后面跟具体的id）
    },
    //删除
    handleDelete(index, row) {
      this.$confirm("是否要删除该门店信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteStoreInfo(row.id).then(response => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000
          });
          this.getList();
        });
      });6
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
    searchStoreInfoList() {
      let length = this.selectedOptions.length;
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
      this.listQuery.pageNum = 1;
      this.getList();
    },
    //处理批量操作
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
      if (this.operateType === 0) {
        //删除
        this.batchDeleteStoreInfo(ids.join(','));
        //在这里重新写一个函数
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
          duration: 1000
        });
      }
    },
    batchDeleteStoreInfo(ids) {

      this.$confirm("是否要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //let params = new URLSearchParams();
        //params.append("ids", ids);
        batchDeleteStoreInfo(ids).then(response => {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
    addStoreInfo() {
      this.$router.push({ path: "/store/addStoreInfo" });
    },
    open() {
      this.$alert(this.description, "备注详情");
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>


