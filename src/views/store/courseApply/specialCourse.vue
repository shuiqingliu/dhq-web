<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="searchApplyList()" type="primary" size="small">筛选查询</el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="resetSearchConditions(),searchApplyList()"
          size="small"
        >查询全部未处理申请</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="省/直辖市：">
            <el-select
              v-model="listQuery.province"
              placeholder="省/直辖市"
              @change="selectedProvince()"
              style="width:140px"
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
            <el-select
              v-model="listQuery.city"
              placeholder="市/市辖区"
              @change="selectedCity()"
              style="width:140px"
            >
              <el-option
                v-for="item in cityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="区/县">
            <el-select
              v-model="listQuery.district"
              placeholder="区/县"
              @change="selectedDistrict()"
              style="width:140px"
            >
              <el-option
                v-for="item in districtOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="门店名：">
            <el-select v-model="listQuery.shopName" placeholder="请选择门店名" style="width:140px">
              <el-option
                v-for="item in shopOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理状态：">
            <el-select v-model="listQuery.applyStatus" placeholder="请选择状态" style="width:140px">
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
        <el-table-column label="门店名" align="center" width="130">
          <template slot-scope="scope">{{scope.row.shopName}}</template>
        </el-table-column>
        <el-table-column label="课程名" align="center" width="100">
          <template slot-scope="scope">{{scope.row.courseName}}</template>
        </el-table-column>
        <el-table-column label="课程描述" align="center" width="80">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="时长" align="center" width="80">
          <template slot-scope="scope">{{scope.row.timesOfClass}}</template>
        </el-table-column>
        <el-table-column label="课程数" align="center" width="80">
          <template slot-scope="scope">{{scope.row.countsOfClass}}</template>
        </el-table-column>
        <el-table-column label="附件" align="center" width="80">
          
          <template slot-scope="scope">
            <a class="download" :href="scope.row.attachment" download="下载">
            <i
                class="el-icon-download"
                v-if="scope.row.attachment != null && scope.row.attachment != ''"
              ></i>
              <i
                class="el-icon-minus"
                v-if="scope.row.attachment == null || scope.row.attachment == ''"
              ></i>
            </a>
          </template>
        </el-table-column>
        <el-table-column label="申请价格" align="center" width="80">
          <template slot-scope="scope">{{scope.row.applyPrice}}</template>
        </el-table-column>
        <el-table-column label="课程内容" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="courseContent=scope.row.courseContent;open()">详情</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="申请原因" align="center" width="110">
          <template slot-scope="scope">{{scope.row.applyReason}}</template>
        </el-table-column>
        <el-table-column label="申请人" align="center" width="100">
          <template slot-scope="scope">{{scope.row.applyPerson}}</template>
        </el-table-column>-->
        <el-table-column label="申请状态" align="center" width="100">
          <template slot-scope="scope">{{applyStatusList[scope.row.applyStatus]}}</template>
        </el-table-column>
        <el-table-column label="总部意见" align="center">
          <template slot-scope="scope">{{scope.row.headOpinion}}</template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" width="155">
          <template slot-scope="scope">{{scope.row.applyTime}}</template>
        </el-table-column>

        <!-- <el-table-column label="拒绝理由" align="center" >
          <template slot-scope="scope">{{scope.row.remark}}</template>
        </el-table-column>-->
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="agree(scope.$index, scope.row)"
              :disabled="a[scope.row.applyStatus][1]"
            >同意</el-button>

            <el-button
              size="mini"
              type="danger"
              @click="rejectApply(scope.$index, scope.row)"
              :disabled="a[scope.row.applyStatus][0]"
            >拒绝</el-button>

            <!-- <el-button
              size="mini"
              type="info"
               @click="rejectReason=scope.row.remark;open()"
               :disabled="a[scope.row.applyStatus][2]"
            >拒绝原因</el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="拒绝原因"
        :visible.sync="rejectDialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <el-form>
          <el-form-item label-width="120" label="拒绝理由">
            <el-input v-model="headOpinion" type="textarea" style="width:300px"></el-input>
          </el-form-item>
        </el-form>
        <!-- <el-form>
          <el-form-item label-width="120" label="拒绝理由">
            <el-input v-model="reason" type="textarea" style="width:300px"></el-input>
          </el-form-item>
        </el-form> -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="rejectDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm(),rejectDialogVisible = false">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="同意"
        :visible.sync="agreeDialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <!-- <el-form>
          <el-form-item label-width="120" label="课程类型编号">
            <el-input v-model="courseTypeNumber" style="width:300px"></el-input>
          </el-form-item>
        </el-form> -->
        <el-form>
          <el-form-item label-width="120" label="总部意见">
            <el-input v-model="headOpinion" type="textarea" style="width:300px"></el-input>
          </el-form-item>
        </el-form>
        <!-- <el-form>
          <el-form-item label-width="120" label="总部建议">
            <el-input v-model="reason" type="textarea" style="width:300px"></el-input>
          </el-form-item>
        </el-form> -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="agreeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleApply(),agreeDialogVisible = false">确 定</el-button>
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
import { fetchList, agreeApply, rejectApply } from "@/api/specialCourseApply";
import {
  getProvince,
  getCity,
  getDistrict,
  getShopName,
  getShopId,
  addShopCourse,
  deleteStoreCourse
} from "@/api/storeCourse";

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
        applyStatus: 1,
        pageNum: 1,
        pageSize: 5
      },
      list: [],
      provinceOptions: [],
      cityOptions: [],
      districtOptions: [],
      shopOptions: [],
      total: null,
      listLoading: false, //临时修改了一下
      multipleSelection: [],
      rejectDialogVisible: false,
      agreeDialogVisible: false,
      reason: null,
      applyId: null,
      // rejectReason:null,
      courseTypeNumber: null,
      dealStatusOptions: [
        { label: "总部未处理", value: 1 },
        { label: "总部审核通过", value: 3 },
        { label: "总部审核不通过", value: 4 }
      ],
      applyStatusList: {
        1: "未审核",
        3: "通过",
        4: "未通过"
      },
      a: {
        1: [false, false, true], //总部未处理
        3: [true, true, true], //总部审核通过
        4: [true, true, false] //总部审核不通过
      },
      ordinaryCourse: true,
      specialCourse: false,
      courseContent: null,
      headOpinion:null
    };
  },
  created() {
    this.getList();
    this.getProvince();
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
    //拒绝申请
    rejectApply(index, row) {
      this.rejectDialogVisible = true;
      //this.reason = row.remark;
      this.applyId = row.id;
    },
    //同意申请
    agree(index, row) {
      this.agreeDialogVisible = true;
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
        rejectApply({
          id: this.applyId,
          remark: this.reason,
          headOpinion: this.headOpinion
        }).then(response => {
          this.getList();
          this.$message({
            message: "已拒绝",
            type: "success",
            duration: 1000
          });
        });
      });
    },
    //确认同意申请
    handleApply() {
      this.$confirm("确定同意申请吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        agreeApply({
          id: this.applyId,
          remark: this.reason,
          headOpinion: this.headOpinion,
          courseTypeNumber: this.courseTypeNumber
        }).then(response => {
          this.getList();
          this.$message({
            message: "已同意",
            type: "success",
            duration: 1000
          });
        });
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
    searchApplyList() {
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
    //获取已开设学能通门店的省份;
    getProvince() {
      getProvince().then(response => {
        // this.list = response.data.list;
        // this.total = response.data.total;
        // this.totalPage = response.data.totalPage;
        // this.pageSize = response.data.pageSize;
        this.provinceOptions = [];
        let provinces = response.data;
        for (let i = 0; i < provinces.length; i++) {
          this.provinceOptions.push({
            label: provinces[i],
            value: provinces[i]
          });
        }
      });
    },

    //选择完省份以后
    selectedProvince() {
      this.cityOptions = [];
      this.districtOptions = [];
      this.shopOptions = [];
      getCity(this.listQuery.province).then(response => {
        let cities = response.data;
        for (let i = 0; i < cities.length; i++) {
          this.cityOptions.push({ label: cities[i], value: cities[i] });
        }
      });
      (this.listQuery.city = null),
        (this.listQuery.district = null),
        (this.listQuery.shopName = null);
    },
    //选择城市以后
    selectedCity() {
      this.districtOptions = [];
      this.shopOptions = [];
      getDistrict(this.listQuery).then(response => {
        let districts = response.data;
        for (let i = 0; i < districts.length; i++) {
          this.districtOptions.push({
            label: districts[i],
            value: districts[i]
          });
        }
      });
      (this.listQuery.district = null), (this.listQuery.shopName = null);
    },
    //选择县区以后
    selectedDistrict() {
      this.shopOptions = [];
      getShopName(this.listQuery).then(response => {
        let shopNames = response.data;
        for (let i = 0; i < shopNames.length; i++) {
          this.shopOptions.push({ label: shopNames[i], value: shopNames[i] });
        }
      }),
        (this.listQuery.shopName = null);
    },
    // open() {
    //   this.$alert(this.rejectReason, "拒绝原因");
    // },
    open() {
      this.$alert(this.courseContent, "课程内容");
    },
    resetSearchConditions() {
      this.listQuery.province = null;
      this.listQuery.city = null;
      this.listQuery.district = null;
      this.listQuery.shopName = null;
      this.listQuery.applyStatus = 1;
      this.cityOptions = [];
      this.districtOptions = [];
      this.shopOptions = [];
    },
    setNull(){
      this.headOpinion=null
      this.reason=null
      this.remark=null
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>