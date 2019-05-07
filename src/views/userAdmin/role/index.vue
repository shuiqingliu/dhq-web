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
              <el-input style="width: 203px" v-model="listQuery.roleDescription" placeholder="角色名/关键字"></el-input>
            </el-form-item>
          </el-form>
        </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>角色列表</span>
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
        
        <!-- <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column> -->
        <el-table-column label="角色名" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="角色描述" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click = "handleUpdatePermissions(scope.row)" type="text">
            <!-- <el-button @click = "dialogTableVisible=true;userRole.roleId=scope.row.id" type="text"> -->
                修改权限
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
      <el-dialog title="权限修改" 
      :visible.sync="dialogTableVisible" 
      :before-close="handleClose"
      width="25%">
        
            <el-tree
              :data="permisisonTree"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[]"
              :default-checked-keys="[]"
              :props="defaultProps"
              v-model="permissionIDs"
              center=true
              ref="tree"
              >
            </el-tree>
        <el-form>
        <el-form-item class="mt20">
            <el-button type="primary" @click="handleAddRole">确定</el-button>
            <el-button @click="dialogTableVisible=false;roles=[];permissionIDs=[]">取消</el-button>
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

  import {updateUserRole,fetchRole,getPermissions,updateRolePermission, deleteRole, getPermisisonTree,getRolePermission} from '@/api/role'
  import {fmtTree} from '@/utils/utils' 
  export default {
    name: 'userlist',
    data() {
      return {
        permissionIDs: [],
        dialogTableVisible: false, 
        userRole:{
          roleId: 1,
          permissionIds:''
        },
        checkedIDs:[],
        //roles存储用户的权限数据(id)，例子：[1,3,4,1]
        roles:[],
        allrole:[],
        
        listQuery: {
          roleDescription: null,
          pageNum: 1,
          pageSize: 10
        },
        list: null,
        total: null,
        listLoading: true,
        multipleSelection: [],
        permisisonTree: [
          {
            id:0,
            label: 1,
            children: []
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    watch:{
      uid(ne, old){
        console.log(ne)
      },
      permisisonTree(ne, old){
        console.log(ne)
      }
    },
    created() {
      this.getRoleList();
      getPermisisonTree().then((resp)=>{
          var data = resp.data
          //console.log(resp.data)
          this.permisisonTree = fmtTree(data);
          // alert(1)
          console.log( this.permisisonTree)

      })
    },
    methods: {
      
      getRoleList() {
        this.listLoading = false;
        fetchRole(this.listQuery).then(response => {
          this.listLoading = true;
          
          this.list = response.data.list;
          this.total = response.data.total;
          
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
        
      },
     handleUpdatePermissions(row){
      this.dialogTableVisible=true
      this.userRole.roleId=row.id
      getRolePermission(row.id).then( resp => {
        var data = resp.data
        this.$refs.tree.setCheckedNodes(fmtTree(data))
      })
     },
      handleUpdate(index, row) {
        this.$router.push({path:'/userAdmin/updateRole', query: {id: row.id}})
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该角色？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var a = {ids:row.id}
          deleteRole(a).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getRoleList();
          });
        });
      },
     
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getRoleList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getRoleList();
      },
      searchUserList() {
        this.listQuery.pageNum = 1;
        this.getRoleList();
      },
      
      addUser() {
        this.$router.push({path: '/userAdmin/addRole'})
      },
      handleClose(done) {
        this.roles = [];
        done();
      },
      handleAddRole(){
        console.log(this.$refs.tree.getCheckedKeys())
        this.roles = this.$refs.tree.getCheckedKeys()
        if(this.roles.length == 0){
          this.$message({
            message: '角色权限不能为空！',
            type: 'error',
            duration: 1000
          });
          return;
        }
        this.userRole.permissionIds = this.roles.join(',');
        
        updateRolePermission(this.userRole).then(response=>{
          this.$message({
            message: '角色权限修改成功',
            type: 'success',
            duration: 1000
          });
          this.dialogTableVisible=false;
          this.getRoleList()
          this.roles = []
        })
      }
      
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.mt20{
  margin-top: 40px
}
</style>


