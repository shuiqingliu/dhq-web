<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.scaleIndistinctName"
        clearable
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
        placeholder="创建机构"
        style="width: 100px;"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="listQuery.creatorName"
        placeholder="创建人"
        style="width: 100px;"
        class="filter-item"
        clearable
      />

      <el-select
        v-model="listQuery.scaleStatus"
        placeholder="量表状态"
        clearable
        class="filter-item"
        style="width: 110px"
      >
        <el-option
          v-for="item in scaleStateOptions"
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
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
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
        label="创建机构"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag >
            {{ row.organizationName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="创建人"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag >
            {{ row.creatorName }}
          </el-tag>
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
            v-if="row.scaleState == 1 || row.scaleState == 2 || row.scaleState == 3"
            type="primary"
            size="mini"
            @click="handleShow(row.scaleId)"
          >
            查看
          </el-button>
<!--          <el-button-->
<!--            v-if="!(row.scaleState == 1 || row.scaleState == 2 || row.scaleState == 3 || row.scaleState == 0 || row.scaleState == -10 )"-->
<!--            type="info"-->
<!--            size="mini"-->
<!--          >-->
<!--            查看-->
<!--          </el-button>-->
          <!--编辑-->
          <el-button
            v-if="row.scaleState == 0"
            size="mini"
            type="success"
            @click="editScale(row.scaleId)"
          >
            编辑
          </el-button>
<!--          <el-button-->
<!--            v-if="row.scaleState < 0 "-->
<!--            size="mini"-->
<!--            type="info"-->
<!--          >-->
<!--            编辑-->
<!--          </el-button>-->

<!--          量表的状态信息 -1代表处于废除状态（审核通过的量表表示不再使用，对于未审核的量表表示审核未通过）-->
<!--          0代表处于编辑状态 1代表处于已提交未审核状态 2代表处于审核通过状态但只能提交者使用-->
<!--          3代表处于审核通过状态且所有人都可以使用-->
<!--          发布-->
          <el-button
            v-if="row.scaleState == 2"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,3)"
          >
            发布
          </el-button>
<!--          <el-button-->
<!--            v-if="row.scaleState != 2"-->
<!--            size="mini"-->
<!--            type="info"-->
<!--          >-->
<!--            发布-->
<!--          </el-button>-->
<!--          审核-->
          <el-button
            v-if="row.scaleState == 1"
            size="mini"
            type="success"
            @click="handleModifyStatus(row,2)"
          >
            审核
          </el-button>
<!--          <el-button-->
<!--            v-if="row.scaleState != 1"-->
<!--            size="mini"-->
<!--            type="info"-->
<!--          >-->
<!--            审核-->
<!--          </el-button>-->
<!--          废除-->
          <el-button
            v-if="row.scaleState == 0 "
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,-10)"
          >
            废除
          </el-button>
          <el-button
            v-if="row.scaleState == 1 "
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,-9)"
          >
            废除
          </el-button>
          <el-button
            v-if="row.scaleState == 2 "
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,-8)"
          >
            废除
          </el-button>
          <el-button
            v-if="row.scaleState == 3 "
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,-7)"
          >
            废除
          </el-button>
<!--          恢复-->
          <el-button
            v-if="row.scaleState == -1 "
            size="mini"
            type="success"
            @click="handleModifyStatus(row,1)"
          >
            恢复
          </el-button>
          <el-button
            v-if="row.scaleState == -10 "
            size="mini"
            type="success"
            @click="handleModifyStatus(row,0)"
          >
            恢复
          </el-button>
          <el-button
            v-if="row.scaleState == -9 "
            size="mini"
            type="success"
            @click="handleModifyStatus(row,1)"
          >
            恢复
          </el-button>
          <el-button
            v-if="row.scaleState == -8 "
            size="mini"
            type="success"
            @click="handleModifyStatus(row,2)"
          >
            恢复
          </el-button>
          <el-button
            v-if="row.scaleState == -7 "
            size="mini"
            type="success"
            @click="handleModifyStatus(row,3)"
          >
            恢复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!--查看量表-->
    <el-dialog
      title="查看量表"
      :visible.sync="dialogFormVisible"
      width="80%"
    >

      <div>
          <scale
            :scale-id="scaleId"
          ></scale>
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
    <!--添加量表-->
    <el-dialog
      title="添加量表"
      :visible.sync="addNewScaleVisible"
      width="80%"
    >
      <div>
        <newScale
          :deleted-scale-id="deleteScaleId" :close-scale="closeScale">
        </newScale>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList, updateScaleState} from '@/api/scale';
  import waves from '@/directive/waves'; // Waves directive
  import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
  import scale from './scale';
  import newScale from './newScale';

  const scaleStatusOptions = [
  { key: '3', display_name: '共有量表' },
  { key: '2', display_name: '私有量表' },
  { key: '1', display_name: '已提交' },
  { key: '0', display_name: '编辑中' },
  { key: '-1', display_name: '废除' },
  { key: '-10', display_name: '废除' },
  { key: '-9', display_name: '废除' },
  { key: '-8', display_name: '废除' },
  { key: '-7', display_name: '废除' },
];
  const scaleStateOptions = [
    { key: '3', display_name: '共有量表' },
    { key: '2', display_name: '私有量表' },
    { key: '1', display_name: '已提交' },
    { key: '0', display_name: '编辑中' },
    { key: '-1', display_name: '废除' },

  ];
  const scaleTypeOptions = [
  { key: 'scaleType1', display_name: '类型1'},
  { key: 'scaleType2', display_name: '类型2'},
  { key: 'scaleType3', display_name: '类型3'},
];
  const scaleStatusKeyValue = scaleStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {});


  export default {
  name: 'ComplexTable',
  components: { Pagination, scale, newScale },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '3': 'success',
        '2': 'info',
        '1': 'info',
        '0': 'info',
        '-1': 'danger',
        '-10': 'danger',
        '-9': 'danger',
        '-8': 'danger',
        '-7': 'danger',
      }
      return statusMap[status]
    },
    stateFilter(status) {
      return scaleStatusKeyValue[status]
    }
  },
  data() {
      return {
        addNewScaleVisible: false,
        dialogFormVisible: false,
        deleteScaleId: null,
        list: null,
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
          sort: '+id',
          importance: undefined,
          title: undefined,
          type: undefined,
        },
        scaleTypeOptions,
        scaleStatusOptions,
        scaleStateOptions,
        sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 降序', key: '-id' }],
      }
    },
  created() {
      this.info();
      this.getList();
      // this.resetScale();
      this.deleteScaleId=null;
    },
  methods: {
      //初始化量表机构和创建人信息
      info() {
        this.listQuery.organizationId = 0
        this.listQuery.organizationName = null
        this.listQuery.creatorId = 0
        this.listQuery.creatorName = null
      },
      //获取量表列表
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.scaleConciseInfoEntityList;
          this.total = response.data.total;
          this.listLoading = false
        })
      },
      //根据条件筛选量表
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      //修改量表状态
      handleModifyStatus(row, status) {
        updateScaleState(row.scaleId, status).then(() => {
          this.getList()
        })
      },
      //排序 暂时未用到
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      //排序 暂时未用到
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      //查看量表
      handleShow(scaleId) {
        this.dialogFormVisible = true;
        this.scaleId = scaleId;
      },
      //触发添加页面
      scaleCreate() {
        this.addNewScaleVisible = true;
        this.deleteScaleId = null;
      },
      //触发编辑量表，赋予量表id
      editScale(scaleId) {
        this.addNewScaleVisible = true;
        this.deleteScaleId = scaleId;
      },
      //关闭添加和编辑量表页面
      closeScale() {
        this.addNewScaleVisible = false;
        this.getList();
      }
    }
}
</script>

<style>
</style>
