<template>
  <div class="news_wrap">
    <div class="news_title">
      <h2>内容管理</h2>
    </div>
    <div class="news_l_title">
      <span>内容新增</span>
    </div>
    <el-form :inline="true" :model="content" class="demo-form-inline">
      <el-form-item label="内容标题">
        <el-input v-model="content.title" placeholder="请输入内容标题"/>
      </el-form-item>
      <el-form-item label="内容类型">
        <el-select v-model="content.typeId" placeholder="请选择内容类型">
          <el-option label="推出新课程" value="1"/>
          <el-option label="推出新设备" value="2"/>
       
        </el-select>
      </el-form-item>
      <el-form-item label="封面">
        <el-upload
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="fileList"
          :limit="1"
          name="file"
          class="upload-demo"
          action="http://60.205.167.19:8075/upload/pic2"
          :multiple="false"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
   
    </el-form>
    <div>
      <tinymce v-model="content.message" :height="300"></tinymce>
    </div>
    <div class="operate_div">
      <el-button type="primary" style="margin-right: 10px" @click="submit">提交</el-button>
      <el-button type="info" @click="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { add, update} from '@/api/news'
import { getNowFormatDate } from '@/utils/getFormatString'
// import { upload } from '@/api/upload'
export default {
  // name: 'NewsManagement',
  name: 'NewsAdd',
  components: { Tinymce },
  data() {
    return {
      fileList: [],
      newsPicture: '',
      content: {
        'id': 0,
        'message': '',
        'title': '',
        'typeId': '请选择一个类型',
        
      },
    }
  },
  created(){
    
    if(this.$route.query.row){
      console.log(this.$route.query.row)
      this.content = this.$route.query.row
      console.log(this.content)
    }
    
  },
  methods: {
    submit() {
      // this.content.newsReleaseTime = getNowFormatDate()
      console.log(this.content)
      // if (this.newsPicture !== '') {
      //   this.shopNews.newsPicture = this.newsPicture
      // }
      if(!this.$route.query.edit){
        console.log(this.content)
        add(this.content).then(res => {
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$router.go(-1)
          }
        }).catch(res =>{
          this.$message({
              message: "请选择一个类型！",
              type: 'error'
            })
        })
      }else{
        update(this.content,this.content.id).then(res => {
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$router.go(-1)
          }
        }).catch(res =>{
          this.$message({
              message: "请选择一个类型！",
              type: 'error'
            })
        })
      }
      
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleChange() {
      console.log('change')
    },
    handleSuccess(res) {
      console.log(res);
      this.content.coverId = res.data;
    },
    handleErr() {
      console.log('err')
      console.log(arguments)
    },
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>

<style scoped>
  .news_wrap{
    padding: 10px;
    text-align: center;
  }
  .news_title{
    margin-bottom: 10px;
    border-bottom: 1px solid #9b9b9b;
  }
  .news_l_title{
    text-align: left;
    margin: 5px 0 20px 0;
  }
  .operate_div{
    margin-top: 15px;
  }
</style>
