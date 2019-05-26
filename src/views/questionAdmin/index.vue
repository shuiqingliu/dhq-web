<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
            style="float: right;margin-top:100px"
            @click="searchUserList()"
            
            type="primary"
            size="small">
            搜索
          </el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
            <el-form-item label="试题内容：">
              <el-input style="width: 203px" v-model="listQuery.username" placeholder="试题关键字"></el-input>
            </el-form-item>
            <el-form-item label="难度：">
              <el-select v-model="jiandaForm.difficultyLevel" placeholder="请选择难度">
                  <el-option
                    v-for="item in difficultyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型：">
              <el-input style="width: 203px" v-model="listQuery.username" placeholder="用户名/关键字"></el-input>
            </el-form-item>
   
            <el-form-item label="所属科目：">
                <el-select v-model="jiandaForm.subject" placeholder="请选择科目">
                  <el-option
                    v-for="item in kemuOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-form>
        </div>
    </el-card>
    
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>试题列表</span>
      <el-button
        class="btn-add"
        @click="addQuestion()"
        size="mini">
        添加试题
      </el-button>
    </el-card>


      <div class="table-container">
        <el-table ref="userTable"
                  :data="list"
                  style="width: 100%"
                  v-loading="!listLoading"
                  
                  border>
          
          <el-table-column label="题目标题" align="center">
            <template slot-scope="scope">{{scope.row.username}}</template>
          </el-table-column>
          <el-table-column label="题目类型" width="400" align="center">
            <template slot-scope="scope">
                <el-tag v-for="item in scope.row.roles" :key="item.id" type="success" class="ml10">{{item.description}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="题目难度" align="center">
            <template slot-scope="scope">{{scope.row.organizationName}}</template>
          </el-table-column>
          <el-table-column label="知识点" align="center">
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

        <!-- 选择添加的试题类型 -->
        <el-dialog
          title="请选择要添加的试题种类"
          :visible.sync="addQuesDialog"
          width="19%"
          :before-close="handleClose">
          
          <el-form class="tac">
            <el-form-item >
              <el-button type="primary" @click="handleAddXuanze">选择题</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAddTiankong">填空题</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAddJianda">简答题</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 添加选择题 -->
        <el-dialog
          title="添加选择题"
          :visible.sync="selectQuesDialog"
          width="30%"
          :before-close="handleClose">
          <el-form :model="selectForm" label-width="100px">
            <el-form-item label="试题内容：">
              <el-input v-model="selectForm.choiceContent"></el-input>
            </el-form-item>
            <el-form-item label="答案：">
              <el-input v-model="selectForm.choiceAnswer"></el-input>
            </el-form-item>
            
            <el-form-item label="选项一：">
              <el-input v-model="selectForm.firstchoice"></el-input>
            </el-form-item>
            <el-form-item label="选项二：">
              <el-input v-model="selectForm.secondchoice"></el-input>
            </el-form-item>
            <el-form-item label="选项三：">
              <el-input v-model="selectForm.thirdchoice"></el-input>
            </el-form-item>
            <el-form-item label="选项四：">
              <el-input v-model="selectForm.fourthchoice"></el-input>
            </el-form-item>
            <el-form-item label="分数：">
              <el-input v-model="selectForm.score"></el-input>
            </el-form-item>
            <el-form-item label="科目：">
                <el-select v-model="selectForm.subject" placeholder="请选择科目">
                  <el-option
                    v-for="item in kemuOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="难度：">
               <el-select v-model="selectForm.difficultyLevel" placeholder="请选择难度">
                  <el-option
                    v-for="item in difficultyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
            <el-form-item label="知识点：">
              <el-input v-model="selectForm.knowledgePoint"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="selectQuesDialog = false">取 消</el-button>
            <el-button type="primary" @click="selectQuesDialog = false; selectAdd()">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 添加填空题 -->
        <el-dialog
          title="提示"
          :visible.sync="tiankongQuesDialog"
          width="30%"
          :before-close="handleClose">
           <el-form :model="tiankongForm" label-width="100px">
            <el-form-item label="试题内容：">
              <el-input v-model="tiankongForm.fillContent"></el-input>
            </el-form-item>
            <el-form-item label="答案：">
              <el-input v-model="tiankongForm.fillAnswer"></el-input>
            </el-form-item>
            <el-form-item label="分数：">
              <el-input v-model="tiankongForm.score"></el-input>
            </el-form-item>
            <el-form-item label="科目：">
                <el-select v-model="tiankongForm.subject" placeholder="请选择科目">
                  <el-option
                    v-for="item in kemuOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="难度：">
               <el-select v-model="tiankongForm.difficultyLevel" placeholder="请选择难度">
                  <el-option
                    v-for="item in difficultyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
            <el-form-item label="知识点：">
              <el-input v-model="tiankongForm.knowledgePoint"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="tiankongQuesDialog = false">取 消</el-button>
            <el-button type="primary" @click="tiankongQuesDialog = false; tiankongAdd()">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 添加简答题 -->
        <el-dialog
          title="提示"
          :visible.sync="jiandaQuesDialog"
          width="30%"
          :before-close="handleClose">
           <el-form :model="jiandaForm" label-width="100px">
            <el-form-item label="试题内容：">
              <el-input v-model="jiandaForm.answerContent" type="textarea" autosize></el-input>
            </el-form-item>
            <el-form-item label="分数：">
              <el-input v-model="jiandaForm.score"></el-input>
            </el-form-item>
            <el-form-item label="科目：">
                <el-select v-model="jiandaForm.subject" placeholder="请选择科目">
                  <el-option
                    v-for="item in kemuOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="难度：">
               <el-select v-model="jiandaForm.difficultyLevel" placeholder="请选择难度">
                  <el-option
                    v-for="item in difficultyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
            <el-form-item label="知识点：">
              <el-input v-model="jiandaForm.knowledgePoint"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="jiandaQuesDialog = false">取 消</el-button>
            <el-button type="primary" @click="jiandaQuesDialog = false; jiandaAdd()">确 定</el-button>
          </span>
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
  import {fetchList,  deleteUser, getUserByOrgnization} from '@/api/userAdmin'
  import {getRoles,getUserRole,updateUserRole} from '@/api/role'
  import {addSelect, addTiankong, addJianda} from '@/api/questionAdmin'
  export default {
    name: 'userlist',
    data() {
      return {
        kemuOptions:[
          {
            value:"语文",
            label:"语文"
          },
          {
            value:"数学",
            label:"数学",
          },
          {
            value: "英语",
            label: "英语"
          }
        ],
        difficultyOptions:[
          {
            value:"简单",
            label:"简单"
          },
          {
            value:"较难",
            label:"较难",
          },
          {
            value: "困难",
            label: "困难"
          }
        ],
        addQuesDialog : false,
        selectQuesDialog: false,
        tiankongQuesDialog: false,
        jiandaQuesDialog: false,
        dialogTableVisible: false, 
        userRole:{
          userId: 1,
          roleIds:''
        },
        selectForm:{
          choiceAnswer: "",
          choiceContent: "",
          choiceId: 0,
          difficultyLevel: "",
          firstchoice: "",
          fourthchoice: "",
          grade: 0,
          knowledgePoint: "",
          score: "",
          secondchoice: "",
          subject: "",
          thirdchoice: ""
        },
        tiankongForm:{
          difficultyLevel: "",
          fillAnswer: "",
          fillContent: "",
          fillId: 0,
          grade: 0,
          knowledgePoint: "",
          score: "",
          subject: ""
        },
        jiandaForm:{
          answerContent: "",
          answerId: 0,
          difficultyLevel: "",
          grade: 0,
          knowledgePoint: "",
          questionAnswer: "",
          score: "",
          subject: ""
        },
        lists:[],
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

      }
    },
    watch:{

    },
    created() {
      this.getList();
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
      
      //添加填空题
      selectAdd(){
        addSelect(this.selectForm).then( response => {
          this.$message({
              message: '添加成功！',
              type: 'success',
              duration: 1000
            });
            this.getList();
        })
      },
      tiankongAdd(){
        addTiankong(this.tiankongForm).then( response => {
          this.$message({
              message: '添加成功！',
              type: 'success',
              duration: 1000
            });
            this.getList();
        })
      },
      jiandaAdd(){
        addJianda(this.jiandaForm).then( response => {
          this.$message({
              message: '添加成功！',
              type: 'success',
              duration: 1000
            });
            this.getList();
        })
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
      
     addQuestion(){
        this.addQuesDialog = true;
     },
     handleAddXuanze(){
      this.addQuesDialog = false;
      this.selectQuesDialog = true;
     },
     handleAddTiankong(){
      this.addQuesDialog = false;
      this.tiankongQuesDialog = true;
     },
     handleAddJianda(){
      this.addQuesDialog = false;
      this.jiandaQuesDialog = true;
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
.tac{
  text-align: center;
}
</style>
