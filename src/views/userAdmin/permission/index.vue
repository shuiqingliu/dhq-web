<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
            style="float: right"
            @click="searchUserList()"
            type="primary"
            size="small">
            查询结果
          </el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
            <el-form-item label="输入搜索：">
              <el-input style="width: 203px" v-model="listQuery.username" placeholder="品牌名称/关键字"></el-input>
            </el-form-item>
          </el-form>
        </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="addUser()"
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
        
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="所属角色" width="400" align="center">
           <template slot-scope="scope">
              <el-tag v-for="item in scope.row.roles" :key="item.id" type="success" class="ml10">{{item.name}}</el-tag>
              <el-button @click = "dialogTableVisible=true;userRole.userId=scope.row.id" type="text" class="flr">
                修改角色
              </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
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
      <el-dialog title="角色修改" 
      :visible.sync="dialogTableVisible" 
      width="30%"
      :before-close="handleClose">
        <el-form>
          <el-form-item label="请选择角色：">
            <el-checkbox-group v-model="roles" >
              <el-checkbox :label="role.id" v-for="role in allrole" :key="role.id" name="type">{{role.name}}</el-checkbox>
            </el-checkbox-group>
            
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAddRole">确定</el-button>
            <el-button @click="dialogTableVisible=false;roles=[]">取消</el-button>
          </el-form-item>
        </el-form>
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
  import {fetchList,  deleteUser} from '@/api/userAdmin'
  import {getRoles,getUserRole,updateUserRole} from '@/api/role'
  export default {
    name: 'userlist',
    data() {
      return {
        dialogTableVisible: false, 
        userRole:{
          userId: 1,
          roleIds:''
        },
        roles:[],
        allrole:[],
        lists:[{
          id: 1,
          name: 'admin',
          roles: ['超级管理员']
        },{
          id: 2,
          name: 'xialei',
          roles: ['维修工', '管道工']
        }],
        listQuery: {
          username: null,
          pageNum: 1,
          pageSize: 10
        },
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: [],
      }
    },
    watch:{
      uid(ne, old){
        console.log(ne)
      }
    },
    created() {
      this.getList();
      getRoles().then(response=>{
        this.allrole = response.data
      })
    },
    methods: {
      getList() {
        this.listLoading = false;
        fetchList(this.listQuery).then(response => {
          this.listLoading = true;
          
          this.list = response.data.list;
          this.total = response.data.total;
          
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
        
      },
     
      handleUpdate(index, row) {
        this.$router.push({path:'/userAdmin/updateUser', query: {id: row.id}})
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.listQuery.pageNum = 1;
            this.getList();
          });
        });
      },
     
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      searchUserList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      
      addUser() {
        this.$router.push({path: '/userAdmin/addUser'})
      },
      handleClose(done) {
        this.roles = [];
        done();
      },
      handleAddRole(){
        this.userRole.roleIds = this.roles.join(',');
        console.log(this.userRole)
        updateUserRole(this.userRole).then(response=>{
          this.$message({
            message: '角色修改成功',
            type: 'success',
            duration: 1000
          });
          this.dialogTableVisible=false;
          this.getList()
          this.roles = []
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>


</style>


