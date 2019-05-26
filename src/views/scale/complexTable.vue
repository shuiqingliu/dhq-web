<template>
  <div class="app-container">

    <el-card class="filter-container" shadow="never">
      <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
        
        </div>
          <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" size="small" label-width="140px" style="padding-left:60px">
            <el-form-item>
                 <el-input
                v-model="listQuery.scaleIndistinctName"
                placeholder="量表名称"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"
              />
              <el-select
                v-model="listQuery.scaleTypeName"
                placeholder="量表类型"
                clearable
                class="filter-item"
                style="width: 110px"
              >
                <el-option
                  v-for="item in scaleTypeOptions"
                  :key="item.key"
                  :label="item.key"
                  :value="item.key"
                />
              </el-select>
              <el-input
                v-model="listQuery.organizationName"
                placeholder="所属机构"
                style="width: 100px;"
                class="filter-item"
              />
              <el-input
                v-model="listQuery.creator"
                placeholder="创建人"
                style="width: 100px;"
                class="filter-item"
              />

              <el-select
                v-model="listQuery.scaleStatus"
                placeholder="量表状态"
                clearable
                class="filter-item"
                style="width: 110px"
              >
                <el-option
                  v-for="item in scaleStatusOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>

              <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="handleFilter"
              >
                查找
              </el-button>
              <el-button
                v-waves
                class="filter-item"
                style="margin-right: 100px;"
                type="primary"
                icon="el-icon-edit"
                @click="scaleCreate"
              >
                添加
              </el-button>
            </el-form-item>
          </el-form>
          </div>
  
    </el-card>
     <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>量表列表</span>
     
    </el-card>
<div class="table-container">
   <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      border
    >
      <el-table-column
        label="量表名称"
        width="330"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.scaleName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="量表类型"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag >
            {{ row.scaleTypeName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="所属机构"
        align="center"
      >
        <template slot-scope="{row}">
          <span>总部</span>
        </template>
      </el-table-column>

      <el-table-column
        label="创建人"
        align="center"
      >
        <template slot-scope="scope">
         <!-- <span>{{ scope.row.creatorId }}</span> -->
         <span>张三</span>
        </template>
      </el-table-column>
      <el-table-column
        label="修改日期"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.scaleModifyTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="量表状态"
        class-name="status-col"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.scaleState | statusFilter">
            {{ row.scaleState | stateFilter}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="330"
        class-name="small-padding fixed-width"
        align="center"
      >
        <template slot-scope="{row}">

<!--          查看-->
          <el-button
            v-if="row.scaleState == 1 || row.scaleState == 2 || row.scaleState == 3||row.scaleState==-1"
            type="primary"
            size="mini"
            @click="handleshow(row.scaleId)"
          >
            查看
          </el-button>

          <el-button
            v-if="row.scaleState == 0"
            type="primary"
            size="mini"
          >
            编辑
          </el-button>

          <!-- <el-button
            v-if="row.scaleState == -1"
            type="info"
            size="mini"
          >
            查看
          </el-button> -->

<!--          量表的状态信息 -1代表处于废除状态（审核通过的量表表示不再使用，对于未审核的量表表示审核未通过）-->
<!--          0代表处于编辑状态 1代表处于已提交未审核状态 2代表处于审核通过状态但只能提交者使用-->
<!--          3代表处于审核通过状态且所有人都可以使用-->
          <el-button
            v-if="row.scaleState == 2"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,3)"
          >
            发布
          </el-button>
          <el-button
            v-if="row.scaleState != 2"
            size="mini"
            type="info"
          >
            发布
          </el-button>
          <el-button
            v-if="row.scaleState == 1"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,2)"
          >
            审核
          </el-button>
          <el-button
            v-if="row.scaleState != 1"
            size="mini"
            type="info"
          >
            审核
          </el-button>
          <el-button
            v-if="row.scaleState!= -1 "
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,-1)"
          >
            废除
          </el-button>
          <el-button
            v-if="row.scaleState == -1 "
            size="mini"
            type="info"
          >
            废除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
</div>
 

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      title="查看量表"
      :visible.sync="dialogFormVisible"
      width="80%"
      :data="list"
    >

      <div>
        <div>
          <scale
          :scale-id="scaleId"
          ></scale>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogFormVisible = false"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="添加量表"
      :visible.sync="addNewScaleVisible"
      width="80%"
    >

      <!-- <div>

        <h3>{{newScale}}</h3>
      </div> -->

      <el-form
        ref="scaleForm"
        :rules="rules"
        :model="newScale"
        label-position="left"

        >
<!--        style="width: 2000px; margin-left:50px;"-->
        <el-form-item style="width: 500px" label="量表名称" prop="scaleName">
<!--          prop的名字对应rules中的项，而且必须与绑定的model中的属性名成对应-->
          <el-input v-model="newScale.scaleName" />
        </el-form-item>
        <el-form-item style="width: 500px" label="量表类型" prop="scaleType">
          <el-select clearable v-model="newScale.scaleType"  placeholder="Please select">
            <el-option v-for="item in scaleTypeOptions" :key="item.key" :label="item.key" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item  label="量表介绍" prop="scaleInfo">
          <el-input v-model="newScale.scaleInfo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item  label="量表指导语" prop="scaleInstruction">
          <el-input v-model="newScale.scaleInstruction" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item  v-if="addAgeLimitVisible === true">
              <el-button type="primary" @click="addAgeLimit">增加年龄限制</el-button>
              </el-form-item>
            <el-form-item  v-if="addAgeLimitVisible === false">
              <el-button type="info" >增加年龄限制</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item  v-if="addGenderLimitVisible === true">
              <el-button type="primary" @click="addGenderLimit">增加性别限制</el-button>
            </el-form-item>
            <el-form-item  v-if="addGenderLimitVisible === false">
              <el-button type="info" @click="addGenderLimit">增加性别限制</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item  v-if="addTimeLimitVisible === true">
              <el-button type="primary" @click="addTimeLimit">增加答题时间限制</el-button>
            </el-form-item>
            <el-form-item  v-if="addTimeLimitVisible === false">
              <el-button type="info" @click="addTimeLimit">增加答题时间限制</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item style="width: 500px" v-if="formAgeVisible === true" label="适用年龄" >
          <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item clearable prop="formAgeStart" >
              <el-input v-model="newScale.formAgeStart" />
            </el-form-item>
          </el-col>
          <el-col :span="1">至</el-col>
          <el-col :span="5">
            <el-form-item prop="formAgeEnd" >
              <el-input v-model="newScale.formAgeEnd" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button @click.prevent="removeAgeLimit">删除</el-button>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="width: 500px" v-if="formGenderVisible === true" label="适用性别" >
          <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item prop="formGender">
              <el-select clearable v-model="newScale.formGender" class="filter-item" placeholder="Please select">
                <el-option v-for="item in formGenderOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <el-button @click.prevent="removeGenderLimit">删除</el-button>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="width: 500px" v-if="formTimeVisible === true" label="答题时间" >
          <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="formTime" style="width: 100px">
                <el-input v-model="newScale.formTime" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button @click.prevent="removeTimeLimit">删除</el-button>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form-item>

        <!--题干-->
        <el-form-item
                      v-for="(evaluation, index) in newScale.evaluationList"
                      :label="'题目'+(index+1)"
                      :rules="rulesEvaluation"
                      :key="evaluation.evaluationId"
                      >
          <el-form-item  prop="stem" >
            <el-row :gutter="20">
            <el-col :span="8">
            <el-input placeholder="题干" v-model="evaluation.stem"></el-input>
            </el-col>
            <el-col :span="4">
              <el-select v-model="evaluation.evaluationType"
              placeholder="题目类型"
              clearable
              class="filter-item"
              >
                <el-option
                  v-for="item in evaluationOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button @click.prevent="removeEvaluation(evaluation)">删除</el-button>
            </el-col>
            <el-col :span="4">
              <el-button  type="primary" @click.prevent="addChoice(evaluation)">添加选项</el-button>
            </el-col>
            </el-row>
          </el-form-item>

<!--          选项-->
          <el-form-item
                        v-for="(choice, index) in evaluation.choiceList"
                        :label="'选项'+(index+1)"
                        :rules="rulesEvaluation"
                        :key="index"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item >
                  <el-input  placeholder="选项内容" v-model="choice.content"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item  >
                  <el-input   placeholder="分数" v-model="choice.score"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button @click.prevent="removeChoice(evaluation,choice)">删除</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form-item>
        <el-button  type="primary" @click="addEvaluation">添加测评项</el-button>

        <el-form-item></el-form-item>

<!--        得分解释-->
                <el-form-item
                  v-for="(scoreDescription, index) in newScale.scoreDescriptionList"
                  :label="'得分解释'+(index+1)"
                  :rules="rulesEvaluation"
                  :key="index"
                >
                  <el-form-item >
                    <el-row :gutter="20">
                      <el-col :span="5">
                        <el-input placeholder="得分解释起始分数" v-model="scoreDescription.startScore"></el-input>
                      </el-col>
                      <el-col :span="5">
                        <el-input placeholder="得分解释结束分数" v-model="scoreDescription.endScore"></el-input>
                      </el-col>
                      <el-col :span="6">
                        <el-switch
                          v-model="scoreDescription.personalWarningFlag"
                          active-text="开启预警"
                          active-value="1"
                          inactive-text="关闭预警"
                          inactive-value="0"
                        >
                        </el-switch>
                      </el-col>
                      <el-col :span="4">
                        <el-button @click.prevent="removeScoreDescription(scoreDescription)">删除</el-button>
                      </el-col>
                    </el-row>
                    <el-form-item  label=" 得分解释" >
                      <el-input v-model="scoreDescription.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
                    </el-form-item>
                  </el-form-item>
                </el-form-item>
                <el-button  type="primary" @click="addScoreDescription">添加得分解释</el-button>

        <!--因子-->
<!--        <el-form-item-->
<!--          v-for="(factor, index) in newScale.factorList"-->
<!--          :label="'因子'+(index+1)"-->
<!--          :rules="rulesEvaluation"-->
<!--        >-->
<!--          <el-form-item   >-->
<!--            <el-row :gutter="20">-->
<!--              <el-col :span="8">-->
<!--                <el-input placeholder="因子名称" v-model="factor.factorName"></el-input>-->
<!--              </el-col>-->
<!--              <el-col :span="4">-->
<!--                <el-input placeholder="因子缩写" v-model="factor.factorAbbr"></el-input>-->
<!--              </el-col>-->
<!--              <el-col :span="4">-->
<!--                <el-button @click.prevent="removeFactor(factor)">删除</el-button>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-form-item  label="因子介绍" >-->
<!--              <el-input v-model="factor.factorInfo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
<!--            </el-form-item>-->
<!--            <el-form-item  label="选择关联题目" >-->
<!--&lt;!&ndash;              <el-select clearable v-model="factor"  placeholder="Please select">&ndash;&gt;-->
<!--&lt;!&ndash;                <el-option v-for="item in scaleTypeOptions" :key="item.key" :label="item.key" :value="item.key" />&ndash;&gt;-->
<!--&lt;!&ndash;              </el-select>&ndash;&gt;-->
<!--            </el-form-item>-->
<!--          </el-form-item>-->
<!--        </el-form-item>-->
<!--        <el-button  type="primary" @click="addFactor">添加因子</el-button>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitScale()">
          提交
        </el-button>
        <el-button type="success" @click="saveScale()">
          保存
        </el-button>
        <el-button type="danger" @click="addNewScaleVisible=false">
          取消
        </el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { fetchList, updateScaleState, fetchPv, submitScale, updateArticle } from '@/api/scale'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import scale from './scale'
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]
//  scaleStatusOptions
const scaleStatusOptions = [
  { key: '3', display_name: '共有量表' },
  { key: '2', display_name: '私有量表' },
  { key: '1', display_name: '已提交' },
  { key: '0', display_name: '编辑中' },
  { key: '-1', display_name: '废除' }
]
const scaleTypeOptions = [
  { key: 'scaleType1', display_name: '类型1'},
  { key: 'scaleType2', display_name: '类型2'},
  { key: 'scaleType3', display_name: '类型3'},
]

const formGenderOptions = [
  { key: 'male', display_name: '男'},
  { key: 'female', display_name: '女'},
]

const evaluationOptions = [
  { key: '1', display_name: '选择题'},
  { key: '2', display_name: '填空题'},
  { key: '3', display_name: '简答题'}
]

// arr to obj ,such as { CN : "China", US : "USA" }
const scaleStatusKeyValue = scaleStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})


export default {
  name: 'ComplexTable',
  components: { Pagination, scale },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '3': 'success',
        '2': 'info',
        '1': 'info',
        '0': 'info',
        '-1': 'danger'
      }
      return statusMap[status]
    },
    stateFilter(status) {
      return scaleStatusKeyValue[status]
    },
    parseTime: parseTime
  },
  data() {
    return {
      tableKey: 0,
      evaluationKey: 2,
      list: null,
      addAgeLimitVisible: true,
      addGenderLimitVisible: true,
      addTimeLimitVisible: true,
      dialogFormVisible: false,
      addNewScaleVisible: false,
      addNewEvaluationVisible: false,
      formAgeVisible: false,
      formGenderVisible: false,
      formTimeVisible: false,
      newScale: null,
      total: 0,
      scaleId: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        scaleId: undefined,
        scaleIndistinctName: undefined,
        scaleTypeName: undefined,
        scaleStatus: undefined,
        organizationName: undefined,
        creator: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      scaleTypeOptions,
      scaleStatusOptions,
      formGenderOptions,
      evaluationOptions,
      scaleStatusOptions,
      calendarTypeOptions,
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 降序', key: '-id' }],
      statusOptions: ['published', 'draft', 'abolish'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        show: '查看',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        scaleType: [{ required: true, message: '量表类型必选', trigger: 'blur' }],
        scaleInfo: [{ required: true, message: '量表介绍必填', trigger: 'blur' }],
        scaleName: [{ required: true, message: '量表名称必填', trigger: 'blur' }],
        scaleInstruction: [{ required: true, message: '量表指导语必填', trigger: 'blur' }],
        formAgeStart: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        formAgeEnd: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        formGender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        formTime: [{ required: true, message: '答题时间必选', trigger: 'blur' }]
      },
      rulesEvaluation: {
        stem: [{ required: true, message: '题目题干必填', trigger: 'blur' }],
        choice: [{ required: true, message: '悬案想必填', trigger: 'blur' }]
  },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.resetScale()
  },
  methods: {
    //年龄限制
    addAgeLimit() {
      this.formAgeVisible = true
      this.addAgeLimitVisible = false
    },
    removeAgeLimit() {
      this.formAgeVisible = false
      this.addAgeLimitVisible = true
      this.newScale.formAgeStart=''
      this.newScale.formAgeEnd=''
    },
    //性别限制
    addGenderLimit() {
      this.formGenderVisible = true
      this.addGenderLimitVisible = false
    },
    removeGenderLimit() {
      this.formGenderVisible = false
      this.addGenderLimitVisible = true
      this.newScale.formGender=''
    },
    //时间限制
    addTimeLimit() {
      this.formTimeVisible = true
      this.addTimeLimitVisible = false
    },
    removeTimeLimit() {
      this.formTimeVisible = false
      this.addTimeLimitVisible = true
      this.newScale.formTime=''
    },
    //测评项
    addEvaluation() {
      this.newScale.evaluationList.push({
        evaluationId:'',
        evaluationType:'',
        stem:'',
        choiceList: []
      })
      for (let i = 0; i < this.newScale.evaluationList.length; i++) {
        var index = this.newScale.evaluationList[i].evaluationId = i+1;
      }
    },
    removeEvaluation(evaluation) {
      var index = this.newScale.evaluationList.indexOf(evaluation)
      if (index !== -1) {
        this.newScale.evaluationList.splice(index, 1)
        for (let i = 0; i < this.newScale.evaluationList.length; i++) {
           var index = this.newScale.evaluationList[i].evaluationId = i+1;
        }
      }
    },
    //选项
    addChoice(item) {
        item.choiceList.push({
          content:'',
          score:'',
          number:''
      })
      for (let i = 0; i < item.choiceList.length; i++) {
        var index = item.choiceList[i].number = i+1;
      }

    },
    removeChoice(evaluation,choice) {
      var index = evaluation.choiceList.indexOf(choice)
      if (index !== -1) {
        evaluation.choiceList.splice(index, 1)
      }
    },
    // 因子
    initialFactor() {
      this.newScale.factorList.push({
        factorId: 0,
        factorName: '默认因子',
        factorAbbr: '默认因子',
        factorInfo: '默认因子',
        scoreTransferFlag: 0,
        groupWarningThreshold: null,
        defaultFlag: 1,
        scoreDescriptionFlag: 0,
        referenceFactorFlag: 0,
      })
    },
    addFactor() {
      this.newScale.factorList.push({
        factorId: '',
        factorName: '',
        factorAbbr: '',
        factorInfo: '',
        scoreTransferFlag: 0,
        groupWarningThreshold: null,
        defaultFlag: 0,
        scoreDescriptionFlag: 0,
        referenceFactorFlag: 0,
      })
      for (let i = 0; i < this.newScale.factorList.length; i++) {
        var index = this.newScale.factorList[i].factorId = i;
      }
    },
    removeFactor(factor) {
      var index = this.newScale.factorList.indexOf(factor)
      if (index !== -1) {
        this.newScale.factorList.splice(index, 1)
        for (let i = 1; i < this.newScale.factorList.length; i++) {
          var index = this.newScale.factorList[i].factorId = i;
        }
      }
    },
    //得分解释
    addScoreDescription() {
      this.newScale.scoreDescriptionList.push({
        scoreDescriptionId: '',
        startScore: '',
        endScore: '',
        description: '',
        personalWarningFlag: '',
      })
      for (let i = 0; i < this.newScale.scoreDescriptionList.length; i++) {
        var index = this.newScale.scoreDescriptionList[i].scoreDescriptionId = i+1;
      }
    },
    removeScoreDescription(scoreDescription) {

      var index = this.newScale.scoreDescriptionList.indexOf(scoreDescription)
      if (index !== -1) {
        this.newScale.scoreDescriptionList.splice(index, 1)
        for (let i = 0; i < this.newScale.scoreDescriptionList.length; i++) {
          var index = this.newScale.scoreDescriptionList[i].scoreDescriptionId = i+1;
        }
      }
    },

    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
      // fetchList(this.query).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 500)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      updateScaleState(row.scaleId, status).then(() => {
        this.getList()
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleshow(scaleId) {
      this.dialogFormVisible = true
      this.scaleId = scaleId
      console.log(this.scaleId)
    },


    resetScale() {
      this.newScale = {
        scaleType: undefined,
        id: undefined,
        scaleName: undefined,
        scaleStatus: undefined,
        scaleInfo: undefined,
        scaleInstruction: undefined,
        createTime: undefined,
        modifyTime: undefined,
        formAgeStart: undefined,
        formAgeEnd: undefined,
        formGender: undefined,
        organizationId: undefined,
        formTime: undefined,
        creatorId: undefined,
        creatorName: undefined,
        evaluationList: [
          {
            evaluationId:1,
            evaluationType:'',
            stem:'',
            choiceList: []
          },
          {
            evaluationId:2,
            evaluationType:'',
            stem:'',
            choiceList: []
          }
        ],
        // factorList: [],
        scoreDescriptionList: []
      }
    },
    scaleCreate() {
      this.resetScale()
      this.newScale.createTime = new Date()
      this.addNewScaleVisible = true
      this.$nextTick(() => {
        this.$refs['scaleForm'].clearValidate()
      })
    },
    submitScale() {
      this.$refs['scaleForm'].validate((valid) => {
        if (valid) {
          this.newScale.scaleStatus = '1'
          this.newScale.organizationId = '1'
          this.newScale.creatorId = '1'
          this.newScale.creatorName = '张三'
          this.newScale.modifyTime = new Date(),
          submitScale(this.newScale).then(() => {
            this.addNewScaleVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    saveScale() {
      this.$refs['scaleForm'].validate((valid) => {
        if (valid) {
          this.newScale.scaleStatus = '0'
          this.newScale.modifyTime = new Date()
          submitScale(this.newScale).then(() => {
            this.addNewScaleVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
