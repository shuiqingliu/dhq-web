<template>
  <div class="app-container">
    <el-card class="form-container" shadow="never">
      <h1 class="tc">设备类别树形图</h1>

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
        <el-form ref="addEventForm" :model="addEventForm" :rules="addEventNodeRules">
          <el-form-item label="类别名称" prop="name">
            <el-input v-model="addEventForm.name" name="name"></el-input>
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
  queryDeviceClass
} from "@/api/equipmentType";
import { fetchList } from "@/api/equipmentType";
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
      addEventNodeRules: {
        name: [{ required: true, trigger: "blur", validator: validateName }]
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      addEventdialogVisible: false,
      addEventForm: {
          firstCategory:null,
          id: 0,
          secondCategory: null,
          thirdCategory: null
      }
    };
  },
  created() {
    this.getDeviceClass();
  },
  methods: {
    getDeviceClass() {
      fetchList().then(resp => {
        this.data = resp.data;
      });
    },
    // append(data){
    //     this.addEventdialogVisible = true
    //     this.addEventForm.pid  = data.id
    //     // console.log(data.pid)
    // },

    append(node,data) {
    this.addEventdialogVisible = true
     //console.log(node.parent.data.label);
     alert(node.data.label)
     //获取当前节点的值
     const son = node.data.label
     const f = node.parent.data.label
     //此时添加的一级类别
     if(f == null){
     }
     //const gf = node.parent.parent.label
     alert(f == null)
     //const gf = node.parent.data.label
      //alert(p == null || p == '')
    //   if(f == null){
    //       console.log("我是爷爷")
    //   }
      const newChild = {label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    addEventFormSubmitBtn(form) {
      // console.log(this.addEventForm)
      if (this.addEventForm.name && this.addEventForm.leader) {
        addInstitution(this.addEventForm).then(() => {
          this.addEventdialogVisible = false;
          this.$message({
            message: "添加成功",
            type: "success",
            duration: 1000
          });
          this.addEventForm = {};
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
      console.log(node.parent.data.label);
      console.log(node.parent.parent.data.label);
      console.log(node.data.label)
      this.$confirm("是否要删除该类别？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        data = { id: data.id };
        // data = JSON.stringify(data)
        delInstitution(data).then(() => {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        });
      });
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