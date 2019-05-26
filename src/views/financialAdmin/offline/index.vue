<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>请先选择要查看的门店</span>
        
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="请输入地区信息">
            <el-cascader
              size="medium"
              :options="options"
              v-model="selectedOptions"
              @change="handleDistrictChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="门店：">
            <el-select v-model="storeId" placeholder="请选择门店">
              <el-option
                v-for="item in stores"
                :key="item.id"
                :label="item.shopName"
                :value="item.id"
                :change="handleStoreChange">
              </el-option>
            </el-select>
          </el-form-item>
          
           <el-form-item class="ml">
                    <span class="demonstration">请选择日期：</span>
                    <el-date-picker
                    v-model="dateValue"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                    </el-date-picker>
          </el-form-item>
          <el-form-item class="flr">
               <el-button type="primary" size="small" @click="handleSearch">确定</el-button>
                
          </el-form-item>
        </el-form>
       
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>本店财务情况</span>
    <el-button type="primary" class="flr" size="small" @click="gotoStastic">财务统计</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="storeInfoTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
         <el-table-column label="日期" align="center">
            <template slot-scope="scope">{{scope.row.time}}</template>
          </el-table-column>
          <el-table-column label="日流量" align="center">
            <template slot-scope="scope">{{scope.row.dayFlow}}</template>
          </el-table-column>
          <el-table-column label="反佣金率" align="center">
            <template slot-scope="scope">{{scope.row.returnRate}}</template>
          </el-table-column>
           <el-table-column label="收入" align="center">
            <template slot-scope="scope">{{scope.row.dayIncome}}</template>
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
import { fetchList, getStore} from "@/api/financialAdmin";
import { regionDataPlus, CodeToText } from "element-china-area-data";   
import {getFormatDate} from '@/utils/getFormatString';
import {formatDate} from '@/utils/date'
export default {
  name: "offline",
  data() {
    return {
      dateValue: '',
      storeId: null,
      listQuery2:{
        
      },
      listQuery: {
        shopID: 0,
        startDate:'2019-05-01',
        endDate:'2019-05-19',
        pageNum: 1,
        pageSize: 5
      },
      list: [],
      total: null,
      listLoading: false, //临时修改了一下
      multipleSelection: [],
      stores:[],
      options: regionDataPlus, //全国的地理信息
      selectedOptions: [],
      dialogVisible: false,
      description:null,
      pickerOptions:[]

    };
  },
  watch:{
    dateValue : function(ne, old){
      this.listQuery.startDate = getFormatDate(ne[0])
      this.listQuery.endDate = getFormatDate(ne[1])
      this.getList();
    },
    storeId: function(ne, ol){
      this.listQuery.shopID = ne;
    }
  },

  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
    
         this.list = response.data.list;
        // for(l in list){
        //   l.runConditionDate = getFormatDate(l.runConditionDate)
        // }
        this.total = response.data.total;
        this.totalPage = response.data.totalPage;
        this.pageSize = response.data.pageSize;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
   handleDistrictChange(){
      //将地区代码转换成中文
      let length = this.selectedOptions.length;
      this.listQuery2.province = CodeToText[this.selectedOptions[0]];
      if (length === 2) {
        this.listQuery2.city = null;
        this.listQuery2.district = null;
      }
      if (length === 3) {
        this.listQuery2.city = CodeToText[this.selectedOptions[1]];
        if (this.selectedOptions[2] == "") {
          this.listQuery2.district = null;
        } else {
          this.listQuery2.district = CodeToText[this.selectedOptions[2]];
        }
      }
      if( this.listQuery2.province == "全部"){
        this.listQuery2.province = null
      }
      this.stores = []
      this.storeId = null
      getStore(this.listQuery2).then(resp =>{
        this.stores = resp.data.list
      })
      console.log(this.listQuery2)
    //   this.getList();

   },
   handleStoreChange(){
       console.log(11)
   },
   gotoStastic(){
      if(this.storeId == null){
        this.$message({
              type: "error",
              message: "你还没选择一个门店呢！"
            });
        return
      }
       this.$router.push({path:"/financialAdmin/stastic", query:{online:false,storeId: this.storeId}})
   },
   handleSearch(){
     this.getList()
   }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.flr{
    float: right;
    margin-left: 20px;
}
.ml{
    margin-left: 29px;
}
</style>


