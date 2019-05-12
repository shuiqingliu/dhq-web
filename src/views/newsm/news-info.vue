<template>
  <div class="new_info_wrapper">
    <div class="news_title">
      <h2>新闻管理</h2>
    </div>
    <div class="news_info_title">
      <h2>{{ newsData.newsName }}</h2>
    </div>
    <div class="news_content_wrapper">
      <div class="news_left_menu">
        <div class="news_time_show">
          <p>{{ newsData.year }}</p>
          <p>{{ newsData.month }}/{{ newsData.days }}</p>
          <p>{{ `${newsData.hours}:${newsData.min}:${newsData.sec}` }}</p>
        </div>
      </div>
      <div class="news_right_content">
        <div v-if="newsData.newsPicture.length > 0" class="news_image_box">
          <img :src="newsData.newsPicture" width="300px" height="300px" alt="">
          <p class="image_text" style="color:#c1c1c1">{{ newsData.newsImageText }}</p>
        </div>
        <div class="news_content" v-html="newsData.newsContent"/>
      </div>
    </div>
    <p class="return_button" @click="$router.back()">返回</p>
  </div>
</template>

<script>
export default {
  name: 'NewsInfo',
  data() {
    return {
      newsData: {
        'id': 2,
        'newsName': '这个是新闻标题',
        'newsContent': '百度新闻是包含海量资讯的新闻服务平台,真实反映每时每刻的新闻热点。您可以搜索新闻事件、热点话题、人物动态、产品资讯等,快速了解它们的最新进展。',
        'newsPicture': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556129125176&di=98c35307543068b7fb70fcef1e9f867e&imgtype=0&src=http%3A%2F%2Fwww.cctvguanggao.com%2FUploadFiles%2FFCK%2F2018-12%2F20181205X02FR0XT6R.jpg',
        newsImageText: '这里就是描述文字这里就是描述文字',
        year: 2019,
        month: 12,
        days: 19,
        hours: 12,
        min: 22,
        sec: 22,
        'newsReleaseTime': '2019-04-23T16:07:06.000+0000',
        'newsType': 'string',
        'pageViewNum': 0,
        'newWriter': 'string',
        'shopId': 1
      }
    }
  },
  mounted() {
    this.newsData = this.$route.params
  }
}
</script>

<style scoped>
  .news_info_wrapper{
    padding: 10px;
    text-align: center;
  }
  .news_title{
    margin-bottom: 10px;
    border-bottom: 1px solid #9b9b9b;
  }
  .news_title h2{
    color: #8b8b8b;
    font-size: 30px;
    text-align:center;
  }

  .news_info_title h2{
    text-align: center;
  }

  .news_content_wrapper{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width:70%;
    margin: 0 auto;
  }
  .news_time_show{
    text-align: center;
  }

  .news_left_menu{
    width:15%;
  }
.news_right_content{
  width:83%;
  text-align: left;
}

  .news_image_box{
    text-align: center;
  }

  .return_button{
    width:80px;
    height:40px;
    font-size:18px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    color:#fff;
    background: #1e6abc;
    display: block;
    margin: 0 auto;
  }

</style>
