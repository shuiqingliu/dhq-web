<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="searchStoreCourseList()"
          type="primary"
          size="small"
        >查询结果</el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="resetSearchConditions()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="shopParam" size="small" label-width="140px">
          <el-form-item label="省/直辖市：">
            <el-select
              v-model="shopParam.province"
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
            <el-select v-model="shopParam.city" placeholder="市/市辖区" @change="selectedCity()" style="width:140px">
              <el-option
                v-for="item in cityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="区/县">
            <el-select v-model="shopParam.district" placeholder="区/县" @change="selectedDistrict()" style="width:140px">
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
            <el-select v-model="shopParam.shopName" placeholder="请选择门店名" style="width:140px">
              <el-option
                v-for="item in shopOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @change="selectedShop()"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="特色课：">
            <el-select v-model="shopParam.specialState" placeholder="是否为特色课" style="width:140px" clearable="true">
              <el-option label="特色课" value="特色课"></el-option>
              <!-- <el-option label="非特色课" value="1"></el-option> -->
            </el-select>
          </el-form-item>

          <el-form-item label="开课：">
            <el-select v-model="shopParam.state" placeholder="是否开课" style="width:140px">
              <el-option label="正在开设的课程" value="生效"></el-option>
              <el-option label="已关闭的课程" value="废弃"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>门店课程列表</span>
      <el-button
        class="btn-add"
        @click="resetSearchConditions(),dialogVisible=true,getProvince(),getFirstCategoryList()"
        size="mini"
      >添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="courseTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column label="门店课程编号" align="center" width="120">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="门店名" align="center" width="100">
          <template slot-scope="scope">
            <el-button size="mini" @click="getDatail(scope.$index, scope.row)">{{scope.row.shopName}}</el-button>
            </template>
        </el-table-column>
        <el-table-column label="联系方式" align="center" width="150">
          <template slot-scope="scope">{{scope.row.shopPhone}}</template>
        </el-table-column>
        <el-table-column label="详细地址" align="center" width="100">
          <template slot-scope="scope">{{scope.row.shopLocationProvince}}</template>
        </el-table-column>
        <el-table-column label="课程名" align="center" width="100">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="课时" align="center">
          <template slot-scope="scope">{{scope.row.countsOfClass}}</template>
        </el-table-column>
        <el-table-column label="时长" align="center">
          <template slot-scope="scope">{{scope.row.timesOfClass}}分钟</template>
        </el-table-column>
        <el-table-column label="特色课" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.firstClass === '特色课'" style="color: #37B328">特色课</span>
            <span v-else style="color:red">非特色课</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <img style="height: 70px" :src="'http://10.103.250.120:2140/courseType/showImage?id='+scope.row.courseTypeId">
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="getDatail(scope.$index, scope.row)">查看详情</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <el-dialog
        title="添加门店课程"
        :visible.sync="dialogVisible"
        width="70%"
        :before-close="handleClose"
      >
        <div>
          <span>选择门店:</span>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="shopParam" size="small" label-width="100px">
            <el-form-item label="省/市/区：">
              <el-select
                v-model="shopParam.province"
                placeholder="省/直辖市"
                @change="selectedProvince()"
                style="width:120px"
              >
                <el-option
                  v-for="item in provinceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-select
                v-model="shopParam.city"
                placeholder="市"
                style="width:100px"
                @change="selectedCity()"
              >
                <el-option
                  v-for="item in cityOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="80px">
              <el-select
                v-model="shopParam.district"
                placeholder="区/县"
                style="width:100px"
                @change="selectedDistrict()"
              >
                <el-option
                  v-for="item in districtOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="门店名：" label-width="80px">
              <el-select
                v-model="shopParam.shopName"
                placeholder="门店名"
                style="width:100px"
                @change="selectedShop()"
              >
                <el-option
                  v-for="item in shopOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <hr>
        <div>
          <span>选择课程:</span>
        </div>

        <div style="margin-top: 15px">
          <el-form :inline="true" size="small" label-width="100px">
            <!-- <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="shopParam.firstType" placeholder="品牌名称/关键字"></el-input>
            </el-form-item>-->
            <el-form-item label="三级类别:">
              <el-select
                v-model="listQuery.firstType"
                placeholder="一级类别"
                style="width:100px"
                @change="selectFirstCategory()"
              >
                <el-option
                  v-for="item in firstCategoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-select
                v-model="listQuery.secondType"
                placeholder="二级类别"
                style="width:100px"
                @change="selectSecondCategory()"
              >
                <el-option
                  v-for="item in secondCategoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="80px">
              <el-select
                v-model="listQuery.thirdType"
                placeholder="三级类别"
                style="width:100px"
                @change="selectThirdCategory()"
              >
                <el-option
                  v-for="item in thirdCategoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="80px" label="线上/线下">
              <el-select
                v-model="listQuery.online"
                placeholder="线上/线下"
                style="width:100px"
                @change="selectedOnline()"
              >
                <el-option label="线上" value="0"></el-option>
                <el-option label="线下" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程名：" label-width="80px">
              <el-select v-model="addParam.courseTypeId" placeholder="课程名" style="width:100px">
                <el-option
                  v-for="item in courseOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <hr>
        <div style="margin-top: 15px">
          <el-form :inline="true" size="small" label-width="100px">
            <el-form-item label="课程价格：" label-width="100px">
              <el-input v-model="addParam.coursePrice" placeholder="请输入课程价格"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addShopCourse">添加门店课程</el-button>
          <el-button @click="resetSearchConditions(),dialogVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="shopParam.pageSize"
        :page-sizes="[10,15,20]"
        :current-page.sync="shopParam.pageNum"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  fetchList,
  getProvince,
  getCity,
  getDistrict,
  getShopName,
  getShopId,
  addShopCourse,
  deleteStoreCourse
} from "@/api/storeCourse";

import {
  fetchList as Fetch,
  fetchList as getListByCategory,
  deleteCourseType,
  batchDeleteCourseType
} from "@/api/courseType";

import { fetchList as courseInstanceFetch } from "@/api/courseInstance";
export default {
  name: "storeCourse",
  data() {
    return {
      operates: [
        {
          label: "批量删除",
          value: 0
        }
      ],
      operateType: null,
      shopParam: {
        province: null,
        city: null,
        district: null,
        shopName: null,
        state: "生效",
        specialState: null,
        pageNum: 1,
        pageSize: 20
      },
      listQuery: {
        firstType: null,
        secondType: null,
        thirdType: null,
        online: null,
        pageNum: 1,
        pageSize: 5
      },
      list: [],
      provinceOptions: [],
      cityOptions: [],
      districtOptions: [],
      shopOptions: [],
      firstCategoryOptions: [],
      secondCategoryOptions: [],
      thirdCategoryOptions: [],
      courseOptions: [],
      addParam: {
        shopId: null,
        courseTypeId: null,
        coursePrice:null
      },
      total: null,
      listLoading: false, //临时修改了一下
      multipleSelection: [],
      dialogVisible: false
    };
  },
  created() {
    this.getList();
    this.getProvince();
    // this.getSecondCategoryList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      //this.listLoading = false;
      fetchList(this.shopParam).then(response => {
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
    handleDelete(index, row) {
      this.$confirm("是否要删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteStoreCourse(row.id).then(response => {
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
      this.shopParam.pageNum = 1;
      this.shopParam.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.shopParam.pageNum = val;
      this.getList();
    },
    //添加
    addStoreCourse() {
      this.$router.push({ path: "/equipment/addEquipmentInstance" });
    },
    //处理批量操作
    handleBatchOperate() {
      console.log(this.multipleSelection);
      console.log("娅娅");
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
      console.log(ids);
      if (this.operateType === 0) {
        //删除
        // this.deleteHomeAdvertise(ids);
        //在这里重新写一个函数
        this.batchDeleteCourseInstance(ids);
      } else {
        this.$message({
          message: "请选择批量操作类型",
          type: "warning",
          duration: 1000
        });
      }
    },
    batchDeleteCourseInstance(ids) {
      this.$confirm("是否要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //let params = new URLSearchParams();
        //params.append("ids", ids);
        batchDeleteCourseInstance(ids).then(response => {
          this.getList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
    // getFirstCategoryList() {
    //   getFirstCategory().then(response => {
    //     this.firstCategoryOptions = response.data;
    //   });
    // },
    //条件查询重置
    resetSearchConditions() {
      this.shopParam.province = null;
      this.shopParam.city = null;
      this.shopParam.district = null;
      this.shopParam.shopName = null;
      this.shopParam.state = null;
      this.shopParam.specialState = null;
      this.cityOptions = [];
      this.districtOptions = [];
      this.shopOptions = [];
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          //resetSearchConditions();
          done();
        })
        .catch(_ => {});
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
      getCity(this.shopParam.province).then(response => {
        let cities = response.data;
        for (let i = 0; i < cities.length; i++) {
          this.cityOptions.push({ label: cities[i], value: cities[i] });
        }
      });
      (this.shopParam.city = null),
        (this.shopParam.district = null),
        (this.shopParam.shopName = null);
    },
    //选择城市以后
    selectedCity() {
      this.districtOptions = [];
      this.shopOptions = [];
      getDistrict(this.shopParam).then(response => {
        let districts = response.data;
        for (let i = 0; i < districts.length; i++) {
          this.districtOptions.push({
            label: districts[i],
            value: districts[i]
          });
        }
      });
      (this.shopParam.district = null), (this.shopParam.shopName = null);
    },
    //选择县区以后
    selectedDistrict() {
      this.shopOptions = [];
      getShopName(this.shopParam).then(response => {
        let shopNames = response.data;
        for (let i = 0; i < shopNames.length; i++) {
          this.shopOptions.push({ label: shopNames[i], value: shopNames[i] });
        }
      }),
        (this.shopParam.shopName = null);
    },
    //选取了门店以后
    selectedShop() {
      getShopId(this.shopParam).then(response => {
        this.addParam.shopId = response.data;
      });
    },
    //********************************************************************************************** */
    //自动获取一级列表。
    getFirstCategoryList() {
      getListByCategory({ pageNum: 1, pageSize: 100 }).then(response => {
        this.firstCategoryOptions = [];
        let firstCategoryList = response.data.list;
        let arr = [];
        for (let i = 0; i < firstCategoryList.length; i++) {
          arr.push(firstCategoryList[i].firstClass);
        }
        //去重
        arr = [...new Set(arr)];
        for (let i = 0; i < arr.length; i++) {
          this.firstCategoryOptions.push({ label: arr[i], value: arr[i] });
        }
      });
    },
    //选择一级列表以后
    selectFirstCategory() {
      this.secondCategoryOptions = [];
      this.thirdCategoryOptions = [];
      //加载二级列表
      getListByCategory({
        firstType: this.listQuery.firstType,
        secondType: null,
        thirdType: null,
        pageSize: 100
      }).then(response => {
        // this.firstCategoryOptions = [];
        let secondCategoryList = response.data.list;
        let arr = [];
        for (let i = 0; i < secondCategoryList.length; i++) {
          arr.push(secondCategoryList[i].secondClass);
        }
        //去重
        arr = [...new Set(arr)];
        //赋值
        for (let i = 0; i < arr.length; i++) {
          this.secondCategoryOptions.push({ label: arr[i], value: arr[i] });
        }
      });
      this.listQuery.secondType = null; //将上一次二级分类选中的结果置为空。
      this.listQuery.thirdType = null; //将上一次二级分类选中的结果置为空。
    },
    //选择二级列表以后
    selectSecondCategory() {
      this.thirdCategoryOptions = [];
      //加载二级列表
      getListByCategory({
        firstType: this.listQuery.firstType,
        secondType: this.listQuery.secondType,
        thirdType: null,
        pageSize: 100
      }).then(response => {
        // this.firstCategoryOptions = [];
        let thirdCategoryList = response.data.list;
        let arr = [];
        for (let i = 0; i < thirdCategoryList.length; i++) {
          arr.push(thirdCategoryList[i].thirdClass);
        }
        //去重
        arr = [...new Set(arr)];
        for (let i = 0; i < arr.length; i++) {
          this.thirdCategoryOptions.push({ label: arr[i], value: arr[i] });
        }
      });
      this.listQuery.thirdType = null; //将上一次三级分类选中的结果置为空。
    },

    selectThirdCategory() {
      this.listQuery.online = null;
    },

    selectedOnline() {
      this.addParam.courseTypeId = null;
      this.courseOptions = [];
      courseInstanceFetch(this.listQuery).then(response => {
        let arr1 = [];
        arr1 = response.data.list;
        for (let i = 0; i < arr1.length; i++) {
          this.courseOptions.push({ label: arr1[i].name, value: arr1[i].id });
        }
      });
    },
    //#########+++++++++++++++++++++++++++++++++++++++++++
    addShopCourse() {
      if (this.addParam.shopId != null && this.addParam.courseTypeId != null&&this.addParam.coursePrice != null) {
        addShopCourse(this.addParam).then(response => {
          this.$message({
            message: "提交成功",
            type: "success",
            duration: 1000
          });
        });
      } else {
        alert("请重新选择门店和课程或输入价格");
      }
    },
    searchStoreCourseList() {
      if(this.shopParam.specialState == ""){
        this.shopParam.specialState=null
      }
      this.getList();
    },
     getDatail(index, row) {
      this.$router.push({
        path: "/store/getStoreInfoDetail",
        query: { id: row.shopId }
      }); //!!!!!!!!注意（row.  后面跟具体的id）
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>