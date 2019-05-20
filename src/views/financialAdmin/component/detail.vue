<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>查询条件</span>
        
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
         
           <el-form-item class="ml">
                    <span class="demonstration">请选择日期区间：</span>
                    <el-date-picker
                    v-model="dateValue"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    >
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
      <span>详细订单情况</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="storeInfoTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
         <el-table-column label="订单编号" align="center">
            <template slot-scope="scope">{{scope.row.orderCode}}</template>
          </el-table-column>
          <el-table-column label="用户名" align="center">
            <template slot-scope="scope">{{scope.row.userName}}</template>
          </el-table-column>
          <el-table-column label="订单价格" align="center">
            <template slot-scope="scope">{{scope.row.totalPrice}}</template>
          </el-table-column>
           <el-table-column label="支付时间" align="center">
            <template slot-scope="scope">{{scope.row.payTime}}</template>
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
import { getOnlineDetail, getOfflineDetail} from "@/api/financialAdmin";
import { regionDataPlus, CodeToText } from "element-china-area-data";   
import {getFormatDate} from '@/utils/getFormatString';
import {formatDate} from '@/utils/date'
export default {
  name: "offline",
  data() {
    return {
      dateValue: null,
      storeId: null,
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
    list: function (n,o) {
      console.log(n)
    }
  },

  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.shopID = this.$route.query.shopID
      getOfflineDetail(this.listQuery).then(response => {
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


