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
          <el-form-item label="省/直辖市：">
            <el-select
              v-model="listQuery.province"
              placeholder="省/直辖市"
              @change="selectedProvince()"
            >
              <el-option
                v-for="item in provinceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="市/市辖区">
            <el-select v-model="listQuery.city" placeholder="市/市辖区" @change="selectedCity()">
              <el-option
                v-for="item in cityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="区/县">
            <el-select v-model="listQuery.district" placeholder="区/县" @change="selectedDistrict()">
              <el-option
                v-for="item in districtOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="shopParam" size="small" label-width="140px">
          <el-form-item label="门店名：">
            <el-select v-model="listQuery.shopName" placeholder="请选择门店名">
              <el-option
                v-for="item in shopOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @change="selectedShop()"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item  label="处理状态">
              <el-select
                v-model="listQuery.online"
                placeholder="线上/线下"
                @change="selectedOnline()"
              >
                <el-option label="线上" value="0"></el-option>
                <el-option label="线下" value="1"></el-option>
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
        <el-table-column label="门店名" align="center" width="150">
          <template slot-scope="scope">{{scope.row.shopName}}</template>
        </el-table-column>
        <el-table-column label="课程名" align="center" width="100">
          <template slot-scope="scope">{{scope.row.courseName}}</template>
        </el-table-column>
        <el-table-column label="申请单价" align="center" width="100">
          <template slot-scope="scope">{{scope.row.applyPrice}}</template>
        </el-table-column>
        <el-table-column label="申请原因" align="center" width="100">
          <template slot-scope="scope">{{scope.row.applyReason}}</template>
        </el-table-column>
        <el-table-column label="申请人" align="center">
          <template slot-scope="scope">{{scope.row.applyPerson}}</template>
        </el-table-column>
        <el-table-column label="申请状态" align="center" width="120">
          <template slot-scope="scope">{{scope.row.applyStatus}}</template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" width="150">
          <template slot-scope="scope">{{scope.row.applyTime}}</template>
        </el-table-column>
        <el-table-column label="附件" align="center" width="100">
          <template slot-scope="scope">{{scope.row.attachmentUrl}}</template>
        </el-table-column>
        <!-- <el-table-column label="拒绝理由" align="center" >
          <template slot-scope="scope">{{scope.row.resultDes}}</template>
        </el-table-column>-->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
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
import { fetchList } from "@/api/courseApply";

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
        province: null,
        city: null,
        district: null,
        shopName: null,
        pageNum: 1,
        pageSize: 5
      },
      list: [],
      firstCategoryOptions: [],
      secondCategoryOptions: [],
      thirdCategoryOptions: [],
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
      // this.listLoading = true;
      this.listLoading = false;
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
      alert(this.listQuery.keyword1);
      alert(this.listQuery.keyword2);
      alert(this.listQuery.keyword3);
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
    //选择一级列表以后
    selectFirstCategory() {
      this.secondCategoryOptions = [];
      //加载二级列表
      getListByCategory({
        keyword1: this.listQuery.keyword1,
        keyword2: null,
        keyword3: null,
        pageSize: 100
      }).then(response => {
        // this.firstCategoryOptions = [];
        let secondCategoryList = response.data.list;
        let arr = [];
        for (let i = 0; i < secondCategoryList.length; i++) {
          arr.push(secondCategoryList[i].secondCategory);
        }
        //去重
        arr = [...new Set(arr)];
        //赋值
        for (let i = 0; i < arr.length; i++) {
          this.secondCategoryOptions.push({ label: arr[i], value: arr[i] });
        }
      });
      this.listQuery.keyword2 = null; //将上一次二级分类选中的结果置为空。
      this.listQuery.keyword3 = null; //将上一次三级分类选中的结果置为空。
    },
    //选择二级列表以后
    selectSecondCategory() {
      this.thirdCategoryOptions = [];
      //加载二级列表
      getListByCategory({
        keyword1: this.listQuery.keyword1,
        keyword2: this.listQuery.keyword2,
        keyword3: null,
        pageSize: 100
      }).then(response => {
        // this.firstCategoryOptions = [];
        let thirdCategoryList = response.data.list;
        let arr = [];
        for (let i = 0; i < thirdCategoryList.length; i++) {
          arr.push(thirdCategoryList[i].thirdCategory);
        }
        //去重
        arr = [...new Set(arr)];
        for (let i = 0; i < arr.length; i++) {
          this.thirdCategoryOptions.push({ label: arr[i], value: arr[i] });
        }
      });
      this.listQuery.keyword3 = null; //将上一次三级分类选中的结果置为空。
    },
    getSecondCategoryList() {
      fetchCategoryList({ pageNum: 1, pageSize: 100 }).then(response => {
        this.secondCategoryOptions = [];
        let secondCategoryList = response.data.list;
        let arr = [];
        for (let i = 0; i < secondCategoryList.length; i++) {
          arr.push(secondCategoryList[i].secondCategory);
        }
        //去重
        arr = [...new Set(arr)];
        for (let i = 0; i < arr.length; i++) {
          this.secondCategoryOptions.push({ label: arr[i], value: arr[i] });
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>