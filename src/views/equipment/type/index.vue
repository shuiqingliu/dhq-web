<template>
  <div class="app-container">
    <el-card class="form-container" shadow="never">
      <h1 class="tc">设备类别树形图</h1>

      <el-button type="text" size="mini" @click="() => appendFirst()" @click.stop>
        <i class="el-icon-plus"></i>
      </el-button>
      <el-tree :data="data" :props="defaultProps" node-key="id" default-expand-all>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(node,data)" @click.stop>
              <i class="el-icon-plus"></i>
            </el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)" @click.stop>
              <i class="el-icon-delete"></i>
            </el-button>
          </span>
        </span>
      </el-tree>
      <el-dialog
        title="新增类别"
        width="25%"
        class="add-event-dialog"
        :visible.sync="addEventdialogVisible"
        size="tiny"
        :before-close="handleClose"
      >
        <el-form ref="addEventForm" :model="addEventForm">
          <el-form-item label="类别名称" prop="name">
            <el-input v-model="deviceClassName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addEventFormCancleBtn('addEventForm')">取 消</el-button>
          <el-button type="primary" @click="addEventFormSubmitBtn('addEventForm')">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { fmtInsTree } from "@/utils/utils";
import {
  createEquipmentType,
  deleteEquipmentType,
  batchDeleteEquipmentType,
  queryDeviceClass,
  batchDeleteEquipmentClass
} from "@/api/equipmentType";
import { fetchListTree } from "@/api/equipmentType";
export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入正确的类别名！"));
      } else {
        callback();
      }
    };

    return {
      detail: {},
      data: [],
      detailDialog: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      addEventdialogVisible: false,
      addEventForm: {
        firstCategory: null,
        id: 0,
        secondCategory: null,
        thirdCategory: null
      },
      deviceClassName: null
    };
    flag:1
  },
  created() {
    this.getDeviceClass();
  },
  methods: {
    getDeviceClass() {
      fetchListTree().then(resp => {
        this.data = resp.data;
      });
    },

    append(node, data) {
      this.addEventdialogVisible = true;
      //alert("afasdf")
      //获取当前节点的值
      const son = node.data.label;
      const f = node.parent.data.label;
      //添加二级类别
      if (f == null) {//如果父亲节点为null的话，说明要添加二级类别
        console.log(this.deviceClassName);
        this.addEventForm.firstCategory = son
        this.flag = 2
      } else {//如果父亲节点不为null的话，
        console.log("dafdasf");
        const gf = node.parent.parent.data.label;
        if (gf == null) {//添加的是三级类别
        //alert("三级")
          this.addEventForm.firstCategory = f;
          this.addEventForm.secondCategory = son;
          this.flag = 3
        } else {//不添加
        this.addEventdialogVisible = false
          alert("目前没有四级类别")
        }
      }
    },
    appendFirst(){
      this.addEventdialogVisible = true;
    },
    addEventFormSubmitBtn() {
      if(this.flag === 2){
        this.addEventForm.secondCategory = this.deviceClassName
      }else if(this.flag === 3){
        this.addEventForm.thirdCategory = this.deviceClassName
      }else{
        this.addEventForm.firstCategory = this.deviceClassName
      }
      if (this.deviceClassName) {
        createEquipmentType(this.addEventForm).then(() => {
          this.addEventdialogVisible = false;
          this.$message({
            message: "添加成功",
            type: "success",
            duration: 1000
          });
          this.addEventForm = {};
          this.flag = 1
          this.getDeviceClass();
        });
      } else {
        this.$message({
          message: "类别名称不能为空！",
          type: "error",
          duration: 1000
        });
      }
    },
    handleClose(done) {
      this.addEventForm = {};
      done();
    },
    addEventFormCancleBtn(form) {
      this.addEventdialogVisible = false;
    },
    remove(node, data) {
      this.$confirm("是否要删除该类别？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {

        if(node.parent.label == null){//说明删除的是一级类别
      let first = node.label
      let ids = []
      this.batchMethod({keyword1:first})
      }else{//如果删除的不是一级类别
      if(node.parent.parent.label == null){//说明删除的二级类别
      this.batchMethod({keyword2:node.label,keyword1:node.parent.label})
      }else{
        this.batchMethod({keyword3:node.label,keyword2:node.parent.label,keyword1:node.parent.parent.label})
      }
      }
      });
    },
    batchMethod(params){
    batchDeleteEquipmentClass(params).then(resp => {
        this.getDeviceClass()
          this.$message({
            type: "success",
            message: "删除成功!"
          });
      })
  }
  }
};
</script>

<style lang="">
.tc {
  text-align: center;
  margin-bottom: 60px;
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