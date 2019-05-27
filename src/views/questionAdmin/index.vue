<template> 
  <div class="app-container">
    <el-card style="margin-bottom: 20px" shadow="never">
       <div>
          <i class="el-icon-search"></i>
          <span>选择要查看的试题类型</span>
        </div>
        <div style="margin-top:15px">
            <el-button
              type="primary"
              class="btn-add"
              @click="listQuery.knowledge_point ='';state = 1;getList()"
              size="mini">
              选择题
            </el-button>
            <el-button
              type="primary"
              class="btn-add"
              @click="listQuery.knowledge_point ='';state = 2;getList()"
              size="mini">
              填空题
            </el-button>
            <el-button
              type="primary"
              class="btn-add"
              @click="listQuery.knowledge_point ='';state = 3;getList()"
              size="mini">
              简答题
            </el-button>
        </div>
      
    </el-card>
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
            <el-form-item label="知识点：">
              <el-input style="width: 203px" v-model="listQuery.knowledgePoint" placeholder="试题关键字"></el-input>
            </el-form-item>
            <el-form-item label="难度：">
              <el-select v-model="listQuery.difficulty_level" placeholder="请选择难度" clearable="true">
                  <el-option
                    v-for="item in difficultyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
       
   
            <el-form-item label="所属科目：">
                <el-select v-model="listQuery.subject" placeholder="请选择科目" clearable="true">
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
        @click="edit=false;addQuestion()"
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
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column label="题目类型"  align="center">
           <el-tag type="success">{{type[state-1]}}</el-tag>
          </el-table-column>
          <el-table-column label="所属科目" align="center">
            <template slot-scope="scope">{{scope.row.subject}}</template>
          </el-table-column>
          <el-table-column label="知识点" align="center">
            <template slot-scope="scope">{{scope.row.knowledgePoint}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="edit = true;handleShow(scope.row)">查看
              </el-button>
              <el-button
                size="mini"
                @click="edit = true;handleUpdate(scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除
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
            <el-form-item label="试题标题：">
              <el-input v-model="selectForm.name"></el-input>
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
            <el-form-item label="试题标题：">
              <el-input v-model="tiankongForm.name"></el-input>
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
            <el-form-item label="试题标题：">
              <el-input v-model="jiandaForm.name"></el-input>
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
  import {getRoles,getUserRole,updateUserRole} from '@/api/role'
  import {addSelect, addSelect2, addTiankong,addTiankong2, addJianda, addJianda2,fetchList1,fetchList2,fetchList3, getQuestion1, getQuestion2, getQuestion3, del1, del2, del3} from '@/api/questionAdmin'
  export default {
    name: 'userlist',
    data() {
      return {
        edit: false,
        type:['选择题', '填空题', '简答题'],
        state:1,
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
          },
          {
            value: "政治",
            label: "政治",
          },
          {
            value: "历史",
            label: "历史",
          },
          {
            value: "地理",
            label: "地理",
          },
          {
            value: "物理",
            label: "物理",
          },
          {
            value: "化学",
            label: "化学",
          },
          {
            value: "生物",
            label: "生物",
          }
          
        ],
        difficultyOptions:[
          {
            value:"简单",
            label:"简单"
          },
          {
            value:"中等",
            label:"中等",
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
          knowledge_point:'',
          // grade: ,
          // difficulty_level:'',
          // subject:'', 
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
      // state: function(n,o){
      //   console.log(n)
      // }
      difficultyOptions: function(n,o){
        this.listQuery.difficulty_level = n;
        this.getList();
      },
      kemuOptions: function(n,o){
        this.listQuery.subject = n;
        this.getList();
      },
      "listQuery.knowledgePoint": function(n,o){
        this.listQuery.knowledge_point = n;
      }
    },
    created() {
      
     this.getList();
    },
    methods: {


      getList() {
        this.listLoading = false;

        if(this.state == 1){
          fetchList1(this.listQuery).then(response => {
            this.listLoading = true;
            
            this.list = response.data.list;
            this.total = response.data.total;
            
            this.totalPage = response.data.totalPage;
            this.pageSize = response.data.pageSize;
          });
        }else if(this.state ==2){
          fetchList2(this.listQuery).then(response => {
            this.listLoading = true;
            
            this.list = response.data.list;
            this.total = response.data.total;
            
            this.totalPage = response.data.totalPage;
            this.pageSize = response.data.pageSize;
          });

        }else if(this.state == 3){
          fetchList3(this.listQuery).then(response => {
            this.listLoading = true;
            
            this.list = response.data.list;
            this.total = response.data.total;
            
            this.totalPage = response.data.totalPage;
            this.pageSize = response.data.pageSize;
          });
          
        }
       
        
      },
      
      //添加填空题
      selectAdd(){
        if(this.edit == false){
          addSelect(this.selectForm).then( response => {
            this.$message({
                message: '添加成功！',
                type: 'success',
                duration: 1000
              });
              this.getList();
          })
        }else{
          addSelect2(this.selectForm).then( response => {
            this.$message({
                message: '添加成功！',
                type: 'success',
                duration: 1000
              });
              this.getList();
          })

        }
        
      },
      tiankongAdd(){
        if(this.edit == false){
          addTiankong(this.tiankongForm).then( response => {
            this.$message({
                message: '添加成功！',
                type: 'success',
                duration: 1000
              });
              this.getList();
          })
        }else{
          addTiankong2(this.tiankongForm).then( response => {
            this.$message({
                message: '添加成功！',
                type: 'success',
                duration: 1000
              });
              this.getList();
          })
        }

      },
      jiandaAdd(){
        if(this.edit == false){
           addJianda(this.jiandaForm).then( response => {
            this.$message({
                message: '添加成功！',
                type: 'success',
                duration: 1000
              });
              this.getList();
          })
        }else{
          addJianda2(this.jiandaForm).then( response => {
            this.$message({
                message: '添加成功！',
                type: 'success',
                duration: 1000
              });
              this.getList();
          })
        }
       
      },

      // handleDelete(index, row) {
      //   this.$confirm('是否要删除该用户？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     deleteUser(row.id).then(response => {
      //       this.$message({
      //         message: '删除成功',
      //         type: 'success',
      //         duration: 1000
      //       });
      //       //this.listQuery.pageNum = 1;
      //       this.getList();
      //     });
      //   });
      // },
     updateQuestion(){

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

        this.selectForm = {
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
        };
        this.jiandaForm = {
          difficultyLevel: "",
          fillAnswer: "",
          fillContent: "",
          fillId: 0,
          grade: 0,
          knowledgePoint: "",
          score: "",
          subject: ""
        };
        this.tiankongForm = {
          difficultyLevel: "",
          fillAnswer: "",
          fillContent: "",
          fillId: 0,
          grade: 0,
          knowledgePoint: "",
          score: "",
          subject: ""
        }
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
     },
     //查看
     handleShow(row){
       console.log(row)
       var id = 0;
       if(this.state == 1){
        id = row.choiceId;
         getQuestion1(id).then( response => {
            this.selectForm = response.data.list[0];
            this.selectQuesDialog = true;
         })
       }else if (this.state == 2){
         id = row.fillId;
          getQuestion2(id).then( response => {
            this.tiankongForm = response.data.list[0];
            this.tiankongQuesDialog = true;
          })

       }else if( this.state == 3){
         id = row.answerId;
          getQuestion3(id).then( response => {
            this.jiandaForm = response.data.list[0];
            this.jiandaQuesDialog = true;
          })
       }
     },
    //编辑
    handleUpdate(row){
       this.handleShow(row)
    },
    
    //删除
    handleDelete(row){
      var id = 0;
       this.$confirm('是否要删除该试题？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            if(this.state == 1){
              id = row.choiceId;
              del1(id).then(resp=>{
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration: 1000
                });
                this.getList()

              })
            }else if (this.state == 2){
              id = row.fillId;
              del2(id).then(resp=>{
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration: 1000
                });
                this.getList()
              })
            }else if( this.state == 3){
              id = row.answerId
              del3(id).then(resp=>{
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration: 1000
                });
                this.getList()

              })
            }
        })
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
