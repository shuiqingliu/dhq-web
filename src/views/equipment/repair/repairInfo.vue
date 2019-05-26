<template>
  <div>
    <div>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-card class="form-container" shadow="never">
            <span>设备信息</span>
            <el-form :rules="rules" ref="storeInfoForm" label-width="150px">
            
              <el-form-item label="管理者：" prop="managerId">
                <el-input ></el-input>
              </el-form-item>
            </el-form>

            <el-form-item label="门店名字：" prop="shopType">
              <el-input ></el-input>
            </el-form-item>
          </el-card>
        </div>
        <div class="grid-content bg-purple">
          <el-card class="form-container" shadow="never">
            <span>设备信息</span>
            <el-form :rules="rules" ref="storeInfoForm" label-width="150px">
            
              <el-form-item label="管理者：" prop="managerId">
                <el-input ></el-input>
              </el-form-item>
            </el-form>

            <el-form-item label="门店名字：" prop="shopType">
              <el-input ></el-input>
            </el-form-item>
          </el-card>
        </div>
        <div>
          
        </div>
      </el-col>
    </el-row>
    </div>
  </div>
</template>
<script>
import {
  createStoreInfo,
  getStoreInfoById,
  updateStoreInfo
} from "@/api/storeInformation";
export default {
  name: "StoreInfoDetail",
  data() {
    return {
      storeInfo: {}
    };
  },
  created() {
    getStoreInfoById(this.$route.query.id).then(response => {
      this.storeInfo = response.data;
    });
  }
};
</script>




<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>