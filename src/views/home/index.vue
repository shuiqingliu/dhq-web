
<template>
  <div class="app-container">
 
    <el-row :gutter="12">
       <el-col :span="6">
        <el-card shadow="hover" @click.native="showkc" class="blue" >
          课程统计
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" @click.native="showsb" class="blue">
          设备统计
        </el-card>
      </el-col>
      <el-col :span="6" >
        <el-card shadow="hover"  @click.native="showcw" class="blue">
          财务统计
        </el-card>
      </el-col>
      <el-col :span="6" >
        <el-card shadow="hover"  @click.native="showxsk" class="blue">
          线上课统计
        </el-card>
      </el-col>
    </el-row>
    <!-- 课程相关统计 -->
    <div class="kc mt30"  v-if="kc">
      <div class="un-handle-layout">
         <div class="layout-title">各省课程数据</div>
         <div class="un-handle-content" >
            <ve-map :data="kcdt" :settings="chartSettings"></ve-map>
         </div>
      </div>
      <div class="un-handle-layout">
         <div class="layout-title">课程销售情况</div>
         <div class="un-handle-content">
           <el-row :gutter="20">
             <el-col :span="8">
               <el-card shadow="hover">
                  <div class="top-10">
                      <span>课程销量排名</span>
                      <ve-bar :data="kcxl" ></ve-bar>
                  </div>
               </el-card>
               
             </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <span>地区课程数统计</span>
                <ve-pie :data="kcdq" style="margin-top:10px" ></ve-pie>         
              </el-card>
            </el-col>         
            <el-col :span="8">
              <el-card shadow="hover">
                <span>门店卖课排行</span>
                <ve-bar :data="kcmd" ></ve-bar>
              </el-card>
            </el-col>
           </el-row>
            
         </div>
      </div>

     <div class="un-handle-layout">
         <div class="layout-title">课程销售趋势图</div>
         <div class="un-handle-content">
             <ve-line :data="kcy" ></ve-line>
         </div>
      </div>
    </div>

    <!-- 设备统计 -->
    <div class="sb mt30" v-if="sb">
        <div class="un-handle-layout">
         <div class="layout-title">各省设备数据</div>
         <div class="un-handle-content" >
            <ve-map :data="sbdt" :settings="chartSettings"></ve-map>
         </div>
      </div>
      <div class="un-handle-layout">
         <div class="layout-title">设备使用情况</div>
         <div class="un-handle-content">
           <el-row :gutter="20">
             <el-col :span="8">
               <el-card shadow="hover">
                  <div class="top-10">
                      <span>设备销量排名</span>
                      <ve-bar :data="sbxl" ></ve-bar>
                  </div>
               </el-card>
               
             </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <span>地区设备统计</span>
                
                <ve-pie :data="sbdq" style="margin-top:10px"></ve-pie>         
              </el-card>
            </el-col>         
            <el-col :span="8">
              <el-card shadow="hover">
                <span>门店设备数排名</span>
                <ve-bar :data="sbmd" ></ve-bar>
              </el-card>
            </el-col>
           </el-row>
            
         </div>
      </div>

     <div class="un-handle-layout">
         <div class="layout-title">设备数趋势图</div>
         <div class="un-handle-content">
             <ve-line :data="sby" ></ve-line>
         </div>
      </div>
    </div>

    <!-- 财务统计 -->
    <div class="cw mt30" v-if="cw">
          <div class="un-handle-layout">
         <div class="layout-title">各省财务数据</div>
         <div class="un-handle-content" >
            <ve-map :data="cwdt" :settings="chartSettings"></ve-map>
         </div>
      </div>
      <div class="un-handle-layout">
         <div class="layout-title">利润统计</div>
         <div class="un-handle-content">
           <el-row :gutter="20">
            <el-col :span="12">
              <el-card shadow="hover">
                <span>地区利润统计</span>
                
                <ve-pie :data="cwdq" style="margin-top:10px"></ve-pie>         
              </el-card>
            </el-col>         
            <el-col :span="12">
              <el-card shadow="hover">
                <span>门店利润排名</span>
                <ve-bar :data="cwmd" ></ve-bar>
              </el-card>
            </el-col>
           </el-row>
            
         </div>
      </div>

     <div class="un-handle-layout">
         <div class="layout-title">每月利润图</div>
         <div class="un-handle-content">
             <ve-line :data="cwy" ></ve-line>
         </div>
      </div>
    </div>

    <!-- 线上课统计 -->
    <div class="xsk mt30" v-if="xsk">
          
      <div class="un-handle-layout">
         <div class="layout-title">线上课统计</div>
         <div class="un-handle-content">
           <el-row :gutter="20">
             <el-col :span="24">
               <el-card shadow="hover">
                  <div class="top-10">
                      <span>线上课程销量排名</span>
                      <ve-bar :data="xskxl" ></ve-bar>
                  </div>
               </el-card>
             </el-col>
           </el-row>
            
         </div>
      </div>

     <div class="un-handle-layout">
         <div class="layout-title">线上课销量趋势图</div>
         <div class="un-handle-content">
             <ve-line :data="xsky" ></ve-line>
         </div>
      </div>
    </div>

  </div>
</template>


<script>
import {KCXL, KCDQ, KCMD, SBDQ, SBQS, SBMD} from '@/api/stastic'
export default {
  data() {
    this.chartSettings = {
      mapGrid: {
        left: 100,
        right: 100,
        top: 10,
        bottom: 10
      }
    }
    return {
      //控制各个模块的显示
      kc: true,
      sb: false,
      cw: false,
      xsk: false,
      // 课程统计数据
      kcdt: {
        columns: ['位置', '课程数'],
        rows: [
          { '位置': '吉林', '税收': 123, '课程数': 123, '面积': 92134 },
          { '位置': '北京', '税收': 1223, '课程数': 2123, '面积': 29234 },
          { '位置': '上海', '税收': 2123, '课程数': 1243, '面积': 94234 },
          { '位置': '浙江', '税收': 4123, '课程数': 5123, '面积': 29234 }
        ]
      },
      kcxl: {
        columns: ['位置', '课程数'],
        rows: [
          { '位置': '吉林', '税收': 123, '课程数': 4121, '面积': 92134 },
          { '位置': '北京', '税收': 1223, '课程数': 2123, '面积': 29234 },
          { '位置': '上海', '税收': 2123, '课程数': 1243, '面积': 94234 },
          { '位置': '浙江', '税收': 4123, '课程数': 5123, '面积': 29234 }
        ]
      },
      kcdq:{},
      kcmd:{},
      kcy: {
        columns: ['月份', '课程数'],
        rows: [
          { '月份': '1月', '课程数': 4121},
          { '月份': '2月', '课程数': 1223},
          { '月份': '3月', '课程数': 2123},
          { '月份': '4月', '课程数': 4123 },
          { '月份': '5月', '课程数': 4123 },
          { '月份': '6月', '课程数': 4123 },
        ]
      },
      //设备统计数据
      sbdt: {},
      sbxl:{},
      sbdq:{},
      sbmd:{},
      sby:{}, 
      //财务统计数据
      cwdt:{},
      cwdq:{},
      cwmd:{},
      cwy:{},
      //线上课统计数据
      xskxl:{},
      xsky:{},
      listQuery:{},
      nian: 2019
    };
  },
  watch: {

  },
  created(){
    this.getData()
  },
  methods:{
    
    getData(){
      //课程数据获取
      var tmpdt = {
        columns: ['位置', '课程数'],
        rows: [
        
        ]
      }
      var tmpxl= {
        columns: ['课程名', '销量'],
        rows: [
        
        ]
      }
      var tmpmd = {
        columns: ['门店名', '课程销量'],
        rows: [
        
        ]
      }
      KCDQ(this.listQuery).then(response => {
      //  console.log(response)
        //console.log(response.data.list)
        response.data.list.forEach(v=>{
          // console.log(v)
          tmpdt.rows.push({ '位置': v.province.substring(0,v.province.length-1), '课程数': v.countOfCourse})
        })
        
        this.kcdt = tmpdt
        this.kcdq = tmpdt;
       // console.log(tmp)
      })
      KCXL(this.listQuery).then(response =>{
        

        for(var i = 0; i < 10 && i < response.data.list.length; i++){
          var v = response.data.list[i]
          tmpxl.rows.push({ '课程名': v.courseTypeName, '销量': v.courseCount})
        }
        
        tmpxl.rows.reverse()
        this.kcxl = tmpxl
      })
      KCMD(this.listQuery).then(response => {
        // console.log(response.data)
         for(var i = 0; i < 10 && i < response.data.list.length; i++){
          var v = response.data.list[i]
          tmpmd.rows.push({ '门店名': v.shopName, '课程销量': v.courseCount})
        }
        
        tmpmd.rows.reverse()
        this.kcmd = tmpmd   
      })
      //设备数据
      var dtsb = {
          columns: ['位置', '设备数'],
            rows: [
            
            ]
          }
      var xlsb = {
          columns: ['设备名', '销量'],
          rows: [
          
          ]
        }
      var mdsb  = {
          columns: ['门店名', '设备数量'],
          rows: [
          
          ]
        }
      SBDQ(this.listQuery).then(response => {
        // console.log(response.data.length)
         for(var i = 0; i < response.data.length; i++){
          var v = response.data[i]
          // console.log(v)
          dtsb.rows.push({ '位置': v.provinceName.substring(0,v.provinceName.length-1), '设备数': v.totalNumber})
        }
        this.sbdt = dtsb
        this.sbdq = dtsb
      })
       SBQS(this.listQuery).then(response =>{
        console.log(response)
        for(var i = 0; i < 10 && i < response.data.length; i++){
          var v = response.data[i]
          xlsb.rows.push({ '设备名': v.modelNumberAndName, '销量': v.totalNumber})
        }
        
        xlsb.rows.reverse()
        this.sbxl = xlsb
      })
      SBMD(this.listQuery).then(response => {
        // console.log(response.data)
         for(var i = 0; i < 10 && i < response.data.length; i++){
          var v = response.data[i]
          mdsb.rows.push({ '门店名': v.shopName, '设备数量': v.totalNumber})
        }
        
        mdsb.rows.reverse()
        this.sbmd = mdsb   
      })
    }
    ,
    handleClick(){
      // alert(1)
    },
    showkc(){
      this.kc = true
      this.sb = false
      this.cw = false
      this.xsk = false
    },
    showsb(){
      this.kc = false
      this.sb = true
      this.cw = false
      this.xsk = false
    },
    showcw(){
      this.kc = false
      this.sb = false
      this.cw = true
      this.xsk = false
    },
    showxsk(){
      this.kc = false
      this.sb = false
      this.cw = false
      this.xsk = true
    },

  }
}
</script>

<style>
  .mt30{
    margin-top:30px;
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
  .blue{
    background-color: #3399CC;

    color:#fff;
    text-align: center
  }
  .blue:hover{
    background-color: #336699;
    cursor: pointer;

  }
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