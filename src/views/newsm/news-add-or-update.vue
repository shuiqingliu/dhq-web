<template>
  <div class="news_wrap">
    <div class="news_title">
      <h2>新闻管理</h2>
    </div>
    <div class="news_l_title">
      <span>新闻修改</span>
    </div>
    <el-form :inline="true" :model="shopNews" class="demo-form-inline">
      <el-form-item label="新闻标题">
        <el-input v-model="shopNews.newsName" placeholder="新闻标题新闻标题"/>
      </el-form-item>
      <el-form-item label="新闻类型">
        <el-select v-model="shopNews.newsType" placeholder="新闻类型">
          <!--<el-option label="区域一" value="shanghai"/>-->
          <!--<el-option label="区域二" value="beijing"/>-->
          <!--<el-option label="string" value="shanghai"/>-->
          <!--<el-option label="knows" value="beijing"/>-->
          <!--<el-option label="string" value="string"/>-->
          <!--<el-option label="knows" value="knows"/>-->
          <el-option label="语文新闻" value="语文新闻"/>
          <el-option label="数学新闻" value="数学新闻"/>
        </el-select>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="shopNews.newWriter" placeholder="新闻标题新闻标题"/>
      </el-form-item>
      <el-form-item label="封面">
        <el-upload
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="fileList"
          name="test"
          class="upload-demo"
          action="http://10.103.241.66:8085/upload/pic"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div>
      <tinymce v-model="shopNews.newsContent" :height="300"/>
    </div>
    <div class="operate_div">
      <el-button type="primary" style="margin-right: 10px" @click="submit">提交修改</el-button>
      <el-button type="info" @click="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { update } from '@/api/news'
export default {
  // name: 'NewsManagement',
  name: 'NewsAdd',
  components: { Tinymce },
  data() {
    return {
      fileList: [],
      content: {
        'id': 0,
        'message': '',
        'title': '',
        'typeId': 0,
        
      },
      newsPicture: ''
    }
  },
  mounted() {
    this.shopNews = this.$route.params
    // eslint-disable-next-line eqeqeq
    if (this.shopNews.newsPicture != '') {
      this.fileList = [{
        name: 'pic',
        url: 'http://' + this.shopNews.newsPicture
      }]
    }
  },
  methods: {
    submit() {
      if (this.newsPicture !== '') {
        this.shopNews.newsPicture = this.newsPicture
      }
      update(this.shopNews).then(res => {
        if (res.code === 200) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.$router.go(-1)
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleSuccess(res) {
      this.newsPicture = res.data
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
