<template> 
  <div class="app-container">
    
    <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
         
        </div>
        <div style="margin-top:15px">
<el-form :inline="true" :model="listQuery" size="small" >
            <el-form-item >
              <el-input style="width: 203px" v-model="listQuery.knowledgePoint" placeholder="知识点关键字"></el-input>
            </el-form-item>
            <el-form-item >
              <el-select v-model="listQuery.difficulty_level" placeholder="请选择难度" :clearable="true">
                  <el-option
                    v-for="item in difficultyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
       
            <el-form-item>
                <el-select v-model="listQuery.grade" placeholder="请选择年级" :clearable="true">
                  <el-option
                    v-for="item in nianji"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="listQuery.subject" placeholder="请选择科目" :clearable="true">
                  <el-option
                    v-for="item in kemuOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
               <el-button
           
            @click="searchUserList()"
            
            type="primary"
            size="small">
            搜索
          </el-button>
            </el-form-item>
          </el-form>
        </div>
        
    </el-card>
    
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>试题列表</span>
     
  
    </el-card>


      <div class="table-container">
        <el-table ref="userTable"
                  :data="list"
                  style="width: 100%"
                  v-loading="!listLoading"
                  
                  border>
          
    
          <el-table-column label="年级" align="center">
            <template slot-scope="scope">{{nianji[scope.row.grade-1].label}}</template>
          </el-table-column>
          
          <el-table-column label="知识点" align="center">
            <template slot-scope="scope">{{scope.row.knowledgePoint}}</template>
          </el-table-column>
          <el-table-column label="科目" align="center">
            <template slot-scope="scope">{{scope.row.subject}}</template>
          </el-table-column>
          <el-table-column label="难度" align="center">
            <template slot-scope="scope">{{scope.row.difficultyLevel}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" >
            <template slot-scope="scope">
              <el-button
              type="primary"
                size="mini"
                @click="$router.push({path:'/scale/questionAdmin', query:{row:scope.row}})">查看
              </el-button>
              
            </template>
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
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>

  import {fetchZhishidian,addSelect, addSelect2, addTiankong,addTiankong2, addJianda, addJianda2,fetchList1,fetchList2,fetchList3, getQuestion1, getQuestion2, getQuestion3, del1, del2, del3} from '@/api/questionAdmin'
  export default {
    name: 'userlist',
    data() {
      return {
        edit: false,
        timu_type:['选择题', '填空题', '简答题'],
        state:1,
        nianji:[
          {
            value: 1,
            label: "小学一年级"
          },
          {
            value: 2,
            label: "小学二年级"
          },
          {
            value: 3,
            label: "小学三年级"
          },
          {
            value: 4,
            label: "小学四年级"
          },
          {
            value: 5,
            label: "小学五年级"
          },
          {
            value: 6,
            label: "小学六年级"
          },
          {
            value: 7,
            label: "初中一年级"
          },
          {
            value: 8,
            label: "初中二年级"
          },
          {
            value: 9,
            label: "初中三年级"
          },
           {
            value: 10,
            label: "高中一年级"
          },
           {
            value: 11,
            label: "高中二年级"
          },
           {
            value: 12,
            label: "高中三年级"
          },
        ],

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
          grade: null,
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
      
          pageNum: 1,
          pageSize: 10
        },
      
        list: null,
        total: null,
        listLoading: true,

      }
    },
    // watch:{
    //   // state: function(n,o){
    //   //   console.log(n)
    //   // }
    //   difficultyOptions: function(n,o){
    //     this.listQuery.difficulty_level = n;
    //     this.getList();
    //   },
    //   kemuOptions: function(n,o){
    //     this.listQuery.subject = n;
    //     this.getList();
    //   },
    //   "listQuery.knowledgePoint": function(n,o){
    //     this.listQuery.knowledge_point = n;
    //   }
    // },
    created() {
    
     this.getList();
    },
    methods: {
      getList() {
        this.listLoading = false;
        fetchZhishidian(this.listQuery).then(response => {
         
            this.listLoading = true;
            // if(listQuery.knowledgePoint){
            // listQuery.knowledge_point = listQuery.knowledgePoint
            // }
            this.list = response.data.list;
            this.total = response.data.total;
            
            this.totalPage = response.data.totalPage;
            this.pageSize = response.data.pageSize;
          });
        
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
        
        if(this.state == 1){
          this.selectQuesDialog = true;
        }else if(this.state == 2){
          this.tiankongQuesDialog = true;
        }else{
          this.jiandaQuesDialog = true;
        }
        this.selectForm = {
  
        };
        this.jiandaForm = {
     
        };
        this.tiankongForm = {
    
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
