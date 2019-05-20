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
              <el-input style="width: 203px" v-model="listQuery.username" placeholder="用户名/关键字"></el-input>
            </el-form-item>
          </el-form>
        </div>
    </el-card>
    
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>用户列表</span>
      <el-button
        class="btn-add"
        @click="addUser()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <el-row>
      <el-col :span="6" height="100%">
        <el-card class="table-container br"  shadow="never">
           <el-tree 
               
                :data="data" 
                
                node-key="id"
                default-expand-all
                @click="handleNodeClick(node)"
                >
                 <span class="custom-tree-node" @click="handleNodeClick(node)" @click.stop slot-scope="{ node}" width="100%">
                    <span>{{ node.label }}</span>
                    <el-button
                    type="text"
                    size="mini"
                    >
                      <span><i class="el-icon-search"></i></span>
                    </el-button>
                    
                </span>
                </el-tree>
        </el-card>
      </el-col>
      <el-col :span="18">
      <div class="table-container">
        <el-table ref="userTable"
                  :data="list"
                  style="width: 100%"
                  v-loading="!listLoading"
                  border>
          
          <el-table-column label="用户名" align="center">
            <template slot-scope="scope">{{scope.row.username}}</template>
          </el-table-column>
          <el-table-column label="所属角色" width="400" align="center">
            <template slot-scope="scope">
                <el-tag v-for="item in scope.row.roles" :key="item.id" type="success" class="ml10">{{item.description}}</el-tag>
                <el-button @click = "handleChangeRole(scope.row)" type="text" class="flr">
                  修改角色
                </el-button>
            </template>
          </el-table-column>
          <el-table-column label="所属机构" align="center">
            <template slot-scope="scope">{{scope.row.organizationName}}</template>
          </el-table-column>
          <el-table-column label="所在地址" align="center">
            <template slot-scope="scope">{{scope.row.address}}</template>
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
              <br/>
              <el-checkbox-group v-model="roles">
                <el-checkbox :label="role.id" v-for="role in allrole" :key="role.id" name="type" >{{role.description}}</el-checkbox>
              </el-checkbox-group>
              
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAddRole">确定</el-button>
              <el-button @click="dialogTableVisible=false;roles=[]">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      </el-col>
    </el-row>
   
    
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
  import {fetchList,  deleteUser, getUserByOrgnization} from '@/api/userAdmin'
  import {getRoles,getUserRole,updateUserRole} from '@/api/role'

  import {fmtInsTree} from '@/utils/utils' 
import {getInstitutions, addInstitution, delInstitution} from '@/api/institution'
  export default {
    name: 'userlist',
    data() {
      return {
        data:[]
        ,
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
        listQuery2: {
          id: 0,
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
      },
      roles(ne,old){
        console.log(ne)
      }
    },
    created() {
      this.getIns();
      this.getList();
      getRoles().then(response=>{
        this.allrole = response.data
      })
    },
    methods: {
       getIns(){
            getInstitutions().then( resp => {
                this.data = fmtInsTree(resp.data)
                // console.log(this.data)
            })
        },
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
      
      handleChangeRole(row){
        this.dialogTableVisible=true;
        this.userRole.userId=row.id;
        this.roles = [];
        for(var i = 0; i < row.roles.length;i++){
          this.roles.push(row.roles[i].id)
        }
        
      },
      handleUpdate(index, row) {
        this.$router.push({path:'/userAdmin/updateUser', query: {id: row.id}})
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该用户？', '提示', {
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
            //this.listQuery.pageNum = 1;
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
      },
      handleNodeClick(node){
      // console.log(node)
      this.listQuery2.id = node.data.id
       this.listLoading = false;
        getUserByOrgnization(this.listQuery2).then(response => {
          this.listLoading = true;
          
          this.list = response.data.list;
          this.total = response.data.total;
          
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.br{
  border: none;
  
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
