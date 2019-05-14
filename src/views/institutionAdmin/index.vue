<template>
    <div class="app-container">
        <el-card class="form-container" shadow="never">
            <h1 class="tc">总部机构示意图</h1>
           
              
                <el-tree 
                :data="data" 
                :props="defaultProps"
                node-key="id"
                default-expand-all
                
                >
                 <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                    <el-button
                        type="text"
                        size="mini"
                        @click="() => append(data)" @click.stop>
                        <i class="el-icon-plus"></i>
                    </el-button>
                    <el-button
                        type="text"
                        size="mini"
                        @click="() => remove(node, data)" @click.stop>
                        <i class="el-icon-delete"></i>
                    </el-button>
                    </span>
                </span>
                </el-tree>
                 <el-dialog
                    title="新增机构"
                    width="25%"
                    class="add-event-dialog"
                    :visible.sync="addEventdialogVisible"
                    size="tiny"
                    :before-close="handleClose"
                    >
                    <el-form ref="addEventForm" :model="addEventForm" :rules="addEventNodeRules">
                        <el-form-item label="机构名称" prop="name" >
                        <el-input v-model="addEventForm.name" name="name"></el-input>
                        </el-form-item>
                        <el-form-item label="机构领导" prop="leader">
                        <el-input v-model="addEventForm.leader" name="leader"></el-input>
                        </el-form-item>
                        <el-form-item label="机构描述" prop="description">
                        <el-input v-model="addEventForm.description" name="description"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer" >
                        <el-button @click="addEventFormCancleBtn('addEventForm')">取 消</el-button>
                        <el-button type="primary" @click="addEventFormSubmitBtn('addEventForm')">确 定</el-button>
                    </span>
                </el-dialog>

        </el-card>
    </div>
</template>
<script>
import {fmtInsTree} from '@/utils/utils' 
import {getInstitutions, addInstitution, delInstitution} from '@/api/institution'
export default {
    data(){
        const validateName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入正确的机构名！'))
        } else {
          callback()
        }
        };
        const validateLeader = (rule, value, callback) => {
            if (value.length < 1) {
            callback(new Error('请输入机构的领导！'))
            } else {
            callback()
            }
        };
        return {
        data: [],
            addEventNodeRules:{
                name: [{required: true, trigger: 'blur',validator: validateName}],
                leader: [{required: true, trigger: 'blur', validator: validateLeader}]
            },
            defaultProps: {
            children: 'children',
            label: 'label'
            },
            addEventdialogVisible: false,
            addEventForm:{
                createTime: "2019-05-07T07:06:13.579Z",
                description: "",
                id: 0,
                isLeaf: true,
                leader: "",
                name: "",
                number: 1,
                pid: 0
            }
        }
    },
    created(){
       this.getIns()
    },
    methods:{
        getIns(){
            getInstitutions().then( resp => {
                this.data = fmtInsTree(resp.data)
                // console.log(this.data)
            })
        },
        append(data){
            this.addEventdialogVisible = true
            this.addEventForm.pid  = data.id
            // console.log(data.pid)
        },
        addEventFormSubmitBtn(form){
            // console.log(this.addEventForm)
            if(this.addEventForm.name && this.addEventForm.leader){
                addInstitution(this.addEventForm).then(()=>{
                this.addEventdialogVisible = false
                this.$message({
                        message: '添加成功',
                        type: 'success',
                        duration: 1000
                    });
                this.addEventForm = {}
                this.getIns()
            })
            }else{
                this.$message({
                        message: '机构名称或者机构领导不能为空！',
                        type: 'error',
                        duration: 1000
                    });
            }
            
            
        },
        handleClose(done){
            this.addEventForm = {}
            done()
        },
        addEventFormCancleBtn(form){
            this.addEventdialogVisible = false
        },
        remove(node, data){
           
            this.$confirm('是否要删除该机构？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                data = {id:data.id}
                // data = JSON.stringify(data)
                delInstitution(data).then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.getIns()
                })
            });
            
        }
        
    }
    
}
</script>

<style lang="">
    .tc{
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