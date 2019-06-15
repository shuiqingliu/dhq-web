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
              @click="state = 1;listQuery.pageNum = 1;listQuery.pageSize = 10;getList()"
              size="mini">
              选择题
            </el-button>
            <el-button
              type="primary"
              class="btn-add"
              @click="state = 2;listQuery.pageNum = 1;listQuery.pageSize = 10;getList()"
              size="mini">
              填空题
            </el-button>
            <el-button
              type="primary"
              class="btn-add"
              @click="state = 3;listQuery.pageNum = 1;listQuery.pageSize = 10;getList()"
              size="mini">
              简答题
            </el-button>
        </div>
      
    </el-card>
    <el-card class="filter-container" shadow="never">
        <div>
          <!-- <i class="el-icon-collection-tag"></i> -->
          <!-- <span>biaoqian</span> -->
          
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" size="small" >
            <el-form-item>
              <el-tag type="success">{{nianji[$route.query.row.grade-1].label}}</el-tag>
              <el-tag type="success">{{$route.query.row.subject}}</el-tag>
              <el-tag type="success">{{$route.query.row.difficultyLevel}}题</el-tag>
              <el-tag type="success">{{$route.query.row.knowledgePoint}}</el-tag>
            </el-form-item>
            <el-form-item style="float:right">
              <el-button type="primary" @click="handleReturn" >返回</el-button>
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
           <template slot-scope="scope">{{timu_type[state-1]}}</template>
          </el-table-column>
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
                @click="edit = true;handleShow(scope.row)">详情
              </el-button>
              <el-button
              type="danger"
                size="mini"
                @click="edit = true;handleDelete(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 选择添加的试题类型 -->
        <!-- <el-dialog
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
        </el-dialog> -->
        <!-- 添加选择题 -->
        <el-dialog
          title="添加选择题"
          :visible.sync="selectQuesDialog"
          width="30%"
          >
          <el-form :model="selectForm" :rules="xuanzerules" label-width="100px"  ref="selectForm">
            <el-form-item label="试题内容：" prop="choiceContent" >
              <el-input v-model="selectForm.choiceContent"></el-input>
            </el-form-item>
            <el-form-item label="试题标题：" >
              <el-input v-model="selectForm.name"></el-input>
            </el-form-item>
            <el-form-item label="答案：">
              <el-input v-model="selectForm.choiceAnswer"></el-input>
            </el-form-item>
            <el-form-item label="选项一：" prop="firstchoice">
              <el-input v-model="selectForm.firstchoice"></el-input>
            </el-form-item>
            <el-form-item label="选项二：" prop="secondchoice">
              <el-input v-model="selectForm.secondchoice"></el-input>
            </el-form-item>
            <el-form-item label="选项三：">
              <el-input v-model="selectForm.thirdchoice"></el-input>
            </el-form-item>
            <el-form-item label="选项四：">
              <el-input v-model="selectForm.fourthchoice"></el-input>
            </el-form-item>
            <el-form-item label="分数：" prop="score">
              <el-input v-model="selectForm.score"></el-input>
            </el-form-item>
            <el-form-item label="科目：" prop="subject">
                <el-select v-model="selectForm.subject" placeholder="请选择科目">
                  <el-option
                    v-for="item in kemuOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属年级：" prop="grade">
                <el-select v-model="selectForm.grade" placeholder="请选择年级" :clearable="true">
                  <el-option
                    v-for="item in nianji"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="难度：" prop="difficultyLevel">
               <el-select v-model="selectForm.difficultyLevel" placeholder="请选择难度">
                  <el-option
                    v-for="item in difficultyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
            <el-form-item label="知识点：" prop="knowledgePoint">
              <el-input v-model="selectForm.knowledgePoint"></el-input>
            </el-form-item>
            <el-form-item>
              
            <el-button @click="selectQuesDialog = false">取 消</el-button>
            <el-button type="primary" @click=" selectAdd('selectForm')">确 定</el-button>
         
            </el-form-item>
          </el-form>
          
        </el-dialog>
        <!-- 添加填空题 -->
        <el-dialog
          title="提示"
          :visible.sync="tiankongQuesDialog"
          width="30%"
          >
           <el-form :model="tiankongForm" label-width="100px" :rules="tiankongrules" ref="tiankongForm">
            <el-form-item label="试题内容：" prop="fillContent">
              <el-input v-model="tiankongForm.fillContent"></el-input>
            </el-form-item>
            <el-form-item label="试题标题：">
              <el-input v-model="tiankongForm.name"></el-input>
            </el-form-item>
            <el-form-item label="答案：">
              <el-input v-model="tiankongForm.fillAnswer"></el-input>
            </el-form-item>
            <el-form-item label="分数：" prop="score">
              <el-input v-model="tiankongForm.score"></el-input>
            </el-form-item>
            <el-form-item label="科目：" prop="subject">
                <el-select v-model="tiankongForm.subject" placeholder="请选择科目">
                  <el-option
                    v-for="item in kemuOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属年级：" prop="grade">
                <el-select v-model="tiankongForm.grade" placeholder="请选择年级" :clearable="true">
                  <el-option
                    v-for="item in nianji"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="难度：" prop="difficultyLevel">
               <el-select v-model="tiankongForm.difficultyLevel" placeholder="请选择难度">
                  <el-option
                    v-for="item in difficultyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
            <el-form-item label="知识点：" prop="knowledgePoint">
              <el-input v-model="tiankongForm.knowledgePoint"></el-input>
            </el-form-item>
            <el-form-item>
<el-button @click="tiankongQuesDialog = false">取 消</el-button>
            <el-button type="primary" @click="tiankongAdd('tiankongForm')">确 定</el-button>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            
          </span>
        </el-dialog>

        <!-- 添加简答题 -->
        <el-dialog
          title="提示"
          :visible.sync="jiandaQuesDialog"
          width="30%"
          >
           <el-form :model="jiandaForm" label-width="100px" :rules="jiandarules" ref="jiandaForm">
            <el-form-item label="试题内容：" prop="answerContent">
              <el-input v-model="jiandaForm.answerContent" type="textarea" autosize></el-input>
            </el-form-item>
            <el-form-item label="试题标题：">
              <el-input v-model="jiandaForm.name"></el-input>
            </el-form-item>
            <el-form-item label="分数：" prop="score">
              <el-input v-model="jiandaForm.score"></el-input>
            </el-form-item>
            <el-form-item label="科目：" prop="subject">
                <el-select v-model="jiandaForm.subject" placeholder="请选择科目">
                  <el-option
                    v-for="item in kemuOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属年级：" prop="grade">
                <el-select v-model="jiandaForm.grade" placeholder="请选择年级" :clearable="true">
                  <el-option
                    v-for="item in nianji"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="难度：" prop="difficultyLevel">
               <el-select v-model="jiandaForm.difficultyLevel" placeholder="请选择难度">
                  <el-option
                    v-for="item in difficultyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
            <el-form-item label="知识点：" prop="knowledgePoint">
              <el-input v-model="jiandaForm.knowledgePoint"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="jiandaQuesDialog = false">取 消</el-button>
            <el-button type="primary" @click="jiandaAdd('jiandaForm')">确 定</el-button>
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
        
        xuanzerules:{
          choiceContent:[
            {required: true, message: '请输入试题内容！', trigger: 'blur' },
            
          ],
          firstchoice:[
            {required: true, message: '请至少给出两个选项！', trigger: 'blur' },
          ],
          secondchoice:[
            {required: true, message: '请至少给出两个选项！', trigger: 'blur' },
          ],
          score:[
            {required: true, message: '请输入该题分数', trigger: 'blur' },
          ],
          subject:[
            {required: true, message: '请选择对应学科', trigger: 'blur' },
            
          ],
          grade:[
            {type: 'integer',required: true, message: '请选择对应年级', trigger: 'blur' },
            
          ],
          difficultyLevel:[
            {required: true, message: '请选择该题难度', trigger: 'blur' },
            
          ],
          knowledgePoint:[
            {required: true, message: '请输入该题的知识点', trigger: 'blur' },
            
          ]

        },
        tiankongrules:{
          fillContent:[
            {required: true, message: '请输入试题内容！', trigger: 'blur' },
            
          ],
         
          score:[
            {required: true, message: '请输入该题分数', trigger: 'blur' },
          ],
          subject:[
            {required: true, message: '请选择对应学科', trigger: 'blur' },
            
          ],
          grade:[
            {type: 'integer',required: true, message: '请选择对应年级', trigger: 'blur' },
            
          ],
          difficultyLevel:[
            {required: true, message: '请选择该题难度', trigger: 'blur' },
            
          ],
          knowledgePoint:[
            {required: true, message: '请输入该题的知识点', trigger: 'blur' },
            
          ]

        },
        jiandarules:{
          answerContent:[
            {required: true, message: '请输入试题内容！', trigger: 'blur' },
            
          ],
         
          score:[
            {required: true, message: '请输入该题分数', trigger: 'blur' },
          ],
          subject:[
            {required: true, message: '请选择对应学科', trigger: 'blur' },
            
          ],
          grade:[
            {type: 'integer',required: true, message: '请选择对应年级', trigger: 'blur' },
            
          ],
          difficultyLevel:[
            {required: true, message: '请选择该题难度', trigger: 'blur' },
            
          ],
          knowledgePoint:[
            {required: true, message: '请输入该题的知识点', trigger: 'blur' },
            
          ]

        },
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
  
    created() {
      console.log(this.$route.query.row)
      //添加的时候默认添加到本组
      //选择初始化
      this.selectForm.grade = this.$route.query.row.grade;
      this.selectForm.difficultyLevel = this.$route.query.row.difficultyLevel
      this.selectForm.subject = this.$route.query.row.subject
      this.selectForm.knowledgePoint = this.$route.query.row.knowledgePoint
      //填空初始化
      this.tiankongForm.grade = this.$route.query.row.grade;
      this.tiankongForm.difficultyLevel = this.$route.query.row.difficultyLevel
      this.tiankongForm.subject = this.$route.query.row.subject
      this.tiankongForm.knowledgePoint = this.$route.query.row.knowledgePoint
      //简答初始化
      this.jiandaForm.grade = this.$route.query.row.grade;
      this.jiandaForm.difficultyLevel = this.$route.query.row.difficultyLevel
      this.jiandaForm.subject = this.$route.query.row.subject
      this.jiandaForm.knowledgePoint = this.$route.query.row.knowledgePoint

     this.listQuery.grade = this.$route.query.row.grade;
     this.listQuery.difficulty_level = this.$route.query.row.difficultyLevel;
     this.listQuery.subject = this.$route.query.row.subject;
     this.listQuery.knowledgePoint = this.$route.query.row.knowledgePoint;
     this.getList();
    },
    methods: {


      getList() {
        this.listLoading = false;

        if(this.state == 1){
          fetchList1(this.listQuery).then(response => {
            this.listLoading = true;
            // if(listQuery.knowledgePoint){
            // listQuery.knowledge_point = listQuery.knowledgePoint
            // }
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
      selectAdd(formName){
       this.$refs[formName].validate((valid)  =>{
          if(valid){
            console.log('验证成功！')
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
            this.selectQuesDialog = false;
          }

        });
      
        
      },
      tiankongAdd(formName){
       this.$refs[formName].validate((valid)  =>{
          if(valid){
            console.log('验证成功！')
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
            this.tiankongQuesDialog = false;
          }

        });
      
        
      },
       jiandaAdd(formName){
       this.$refs[formName].validate((valid)  =>{
          if(valid){
            console.log('验证成功！')
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
            this.jiandaQuesDialog = false;
          }

        });
      
        
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
        // this.selectForm = {
  
        // };
        // this.jiandaForm = {
     
        // };
        // this.tiankongForm = {
    
        // }
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
    },
    handleReturn(){
      this.$router.push({path: '/scale/timuCategory',  query: { listQuery: this.$route.query.listQuery}})
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
