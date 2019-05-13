<template> 
  <div class="app-container">
    
    <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
            style="float: right"
            @click="searchContentList()"
            type="primary"
            size="small">
            查询结果
          </el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
            <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="listQuery.title" placeholder="标题"></el-input>
            </el-form-item>
          </el-form>
        </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>内容列表</span>
      <el-button
        class="btn-add"
        @click="addContent()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="userTable"
                :data="list"
                style="width: 100%"
                v-loading="!listLoading"
                border>
        
        <!-- <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column> -->
        <el-table-column label="内容类型" align="center">
          <template slot-scope="scope">{{scope.row.typeId}}</template>
        </el-table-column>
        <el-table-column label="内容标题" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
       
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="dialogView=true;getContent(scope.row.title, scope.row.message)"
            >
            预览
            </el-button>
            <!-- <el-button
              size="mini"
              @click="handleUpdate(scope.row)">编辑
            </el-button> -->
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="内容预览" 
      :visible.sync="dialogView" 
     
      width="80%">
        <h1>{{content.title}}</h1>
        <br>
        <div v-html="content.message"></div>
      
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
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>

  import {getList,del, showContent} from '@/api/news'
  // import {fmtTree} from '@/utils/utils' 
  export default {
    name: 'News',
    data() {
      return {
        content: {
          title: '',
          message: ''
        },
        dialogView:false,
        listQuery: {
          title: null,
          pageNum: 1,
          pageSize: 10
        },
        list: null,
        total: null,
        listLoading: true,
       
      }
    },
    watch:{

    },
    created() {
      this.getContentList();
    },
    methods: {
      getContent(title, message){
        this.content.title = title
        this.content.message = message
      },
      getContentList() {
        this.listLoading = false;
        getList(this.listQuery).then(response => {
          this.listLoading = true;
          
          this.list = response.data.list;
          this.total = response.data.total;
          
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
        
      },

      handleDelete(index, row) {
        this.$confirm('是否要删除该条内容？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var a = {ids:row.id}
          del(a).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getContentList();
          });
        });
      },
     
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getContentList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getContentList();
      },
      searchContentList() {
        this.listQuery.pageNum = 1;
        this.getContentList();
      },
      
      addContent() {
        this.$router.push({path: './news-add'})
      },
      handleUpdate(row){
        this.$router.push({name: 'news-add-or-update',
        params: row})
      }
     
      
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.mt20{
  margin-top: 40px
}
</style>


