<template>
  <div class="app-container">
    <div class="un-handle-layout">
        <div class="layout-title">订单数据</div>
        <div class = "un-handle-content" style="font-size:14px">
            本页数据是根据昨日计算的,并非实时数据
            <el-button style="float: right; padding: 3px 0" type="text" @click="gotoDetail">查看详细订单数据</el-button>
        </div>
    </div>
  <div class="un-handle-layout">
      <div class="layout-title">昨日数据</div>
      <div class="un-handle-content">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="total-frame">
            <svg-icon icon-class="order" class="total-icon">
            </svg-icon>
            <div class="total-title">昨日订单总数</div>
            <div class="total-value">{{yesterDayData.orderOfflineCount}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame">
            <svg-icon icon-class="total-today" class="total-icon">
            </svg-icon>
            <div class="total-title">昨日销售总额</div>
            <div class="total-value">￥{{yesterDayData.orderOfflineDayIncome}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame">
            <svg-icon icon-class="total-yesterday" class="total-icon">
            </svg-icon>
            <div class="total-title">昨日利润</div>
            <div class="total-value">￥{{yesterDayData.orderOfflineDayProfit}}</div>
          </div>
        </el-col>
      </el-row>
      </div>
    </div>
       <div class="statistics-layout">
      <div class="layout-title">本月指标</div>
      <el-row>
        <el-col :span="4">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399;font-size: 14px">本月订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{monthData.orderOfflineMonthCount}}</div>
              <!-- <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div> -->
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">已付款</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{monthData.orderOfflineMonthPay}}</div>
              <!-- <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div> -->
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">待付款</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{monthData.orderOfflineMonthUnpay}}</div>
              <!-- <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div> -->
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">退款总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{monthData.orderOfflineMonthOutcome}}</div>
              <!-- <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div> -->
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">利润</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{monthData.orderOfflineDayProfit}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <!-- <el-date-picker
              style="float: right;z-index: 1"
              size="small"
              v-model="orderCountDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
              :picker-options="pickerOptions">
            </el-date-picker> -->
            <div>
              <ve-pie :data="chartData"></ve-pie>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
  </div>
</template>
<script>
import {getYesterdayData, getMonthData } from "@/api/financialAdmin";
import { regionDataPlus, CodeToText } from "element-china-area-data";   
import {str2Date} from '@/utils/date';

export default {
  name: "offline",
  data() {
    return {
      shop:{shopID:null},
      yesterDayData:{
        orderOfflineDay: "2019-05-18T16:00:00.000+0000",
        orderOfflineCount: 0,
        orderOfflineDayPay: 0,
        orderOfflineDayUnpay: 0,
        orderOfflineDayIncome: 0,
        orderOfflineDayOutCount: 0,
        orderOfflineDayOutcome: 0,
        orderOfflineDayProfit: 0,
      },
      monthData:{
        orderOfflineMonth: "2019-05-19T16:00:00.000+0000",
        orderOfflineMonthCount: 2,
        orderOfflineMonthPay: 1,
        orderOfflineMonthUnpay: 0,
        orderOfflineMonthIncome: 5901,
        orderOfflineMonthOutCount: 1,
        orderOfflineMonthOutcome: 1000,
        orderOfflineDayProfit: 4901,
      },
      chartData: {
          columns: ['订单指标', '访问用户'],
          rows: [
            { '订单指标': '已付款', '访问用户': 1393 },
            { '订单指标': '待付款', '访问用户': 3530 },
            { '订单指标': '退款数', '访问用户': 2923 },
         
          ]
        }
    };
  },
  created () {
  
    this.shop.shopID = this.$route.query.storeId
    getYesterdayData(this.shop).then(resp=>{
        this.yesterDayData = resp.data;

    })
    getMonthData(this.shop).then(resp=>{
        this.monthData = resp.data;
        this.chartData.rows = [
      { '订单指标': '已付款', '访问用户': this.monthData.orderOfflineMonthPay },
      { '订单指标': '待付款', '访问用户': this.monthData.orderOfflineMonthUnpay },
      { '订单指标': '退款数', '访问用户': this.monthData.orderOfflineMonthOutCount },
    ]
    })
    
  },
  methods: {
      gotoDetail(){
          this.$router.push({path:"/financialAdmin/orderDetail", query:{shopID:this.shop.shopID}})
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

 .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .address-layout {
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }
</style>


