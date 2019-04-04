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
            size="small">
            查询结果
          </el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
            <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="品牌名称/关键字"></el-input>
            </el-form-item>
          </el-form>
        </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="addStoreInfo()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="storeInfoTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="门店编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.shopId}}</template>
        </el-table-column>
        <el-table-column label="管理者编号" width="150" align="center">
          <template slot-scope="scope">{{scope.row.managerId}}</template>
        </el-table-column>
        <el-table-column label="门店名字" width="150" align="center">
          <template slot-scope="scope">{{scope.row.shopName}}</template>
        </el-table-column>
        <!-- <el-table-column label="门店描述" width="100" align="center">
          <template slot-scope="scope">{{scope.row.shopDesc}}</template>
        </el-table-column> -->
         <el-table-column label="省份" width="150" align="center">
          <template slot-scope="scope">{{scope.row.shopLocationProvince}}</template>
        </el-table-column>
         <el-table-column label="市" width="150" align="center">
          <template slot-scope="scope">{{scope.row.shopLocationCity}}</template>
        </el-table-column>
         <el-table-column label="区县" width="150" align="center">
          <template slot-scope="scope">{{scope.row.shopLocationDistrict}}</template>
        </el-table-column>
        <el-table-column label="门店大小" width="100" align="center">
          <template slot-scope="scope">{{scope.row.shopSize}}</template>
        </el-table-column>
         <!-- <el-table-column label="详细地址" width="100" align="center">
          <template slot-scope="scope">{{scope.row.shopLocationDetail}}</template>
        </el-table-column>
         <el-table-column label="员工数量"  align="center">
          <template slot-scope="scope">{{scope.row.employeeNum}}</template>
        </el-table-column> -->
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">详情
            </el-button>
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作666">
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
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {fetchList, updateShowStatus, updateFactoryStatus, deleteBrand} from '@/api/brand'

  export default {
    name: 'storeInfoList',
    data() {
      return {
        operates: [
          {
            label: "批量删除",
            value: "0"
          }
        ],
        operateType: null,
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 5
        },
        list: [{
          employeeNum: 23,
          managerId: 110,
          shopDesc: '北邮店' ,
          shopId: 0,
          shopLocationCity:  '北京市' ,
          shopLocationDetail:  '北京邮电大学' ,
          shopLocationDistrict:  '海淀区' ,
          shopLocationProvince:  '北京市' ,
          shopName:  '学能通' ,
          shopPhone:  12589 ,
          shopSize: 234,
          shopType:  'math' 
        }],
        total: null,
        listLoading: false,//临时修改了一下
        multipleSelection: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        //this.listLoading = true;
        this.listLoading = false;
        fetchList(this.listQuery).then(response => {
          this.listLoading = true;
          this.list = response.data.list;
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //更新
      handleUpdate(index, row) {
        this.$router.push({path: '/store/updateStoreInfo', query: {id: row.id}})
      },
      //删除
      handleDelete(index, row) {
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBrand(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
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
      searchStoreInfoList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      //处理批量操作
      handleBatchOperate() {
        console.log(this.multipleSelection);
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        //用来判断是选中了哪个批量操作!!!!!!!!!!!!!（这个没有实现批量删除）
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        if(this.operateType===0){
          //删除
         // this.deleteHomeAdvertise(ids);
         //在这里重新写一个函数
        }else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
        }
      },
      addStoreInfo() {
        this.$router.push({path: '/store/addStoreInfo'})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>


</style>


