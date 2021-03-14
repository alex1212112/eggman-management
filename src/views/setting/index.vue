<template>
  <div class="app-container">
    <el-form
      :model="setting"
    >
      <el-row style="margin-bottom: 20px">
        <el-col :span="12">
          <el-form-item label="新人奖励抽奖券">
            <el-input v-model="setting.first_gift" autocomplete="off" style="width: 195px;" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="每日赠送抽奖券">
            <el-input v-model="setting.every_day_gift" autocomplete="off" style="width: 195px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <el-col :span="12">
          <el-form-item label="抽奖券过期时间(天)">
            <el-input v-model="setting.ticket_expire" autocomplete="off" style="width: 195px;" />
          </el-form-item>
        </el-col>
        <!--        <el-col :span="12">-->
        <!--          <el-form-item label="每日赠送抽奖券">-->
        <!--            <el-input v-model="setting.every_day_gift" autocomplete="off" style="width: 195px;" />-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
      </el-row>
      <!--      <el-row>-->
      <!--        <el-col :span="24">-->
      <!--          <el-form-item label="首页Banner设置">-->
      <!--            <ad-->
      <!--              ref="newIndexBanner"-->
      <!--              :upload-api="uploadApi"-->
      <!--              :banner="setting.indexBanner"-->
      <!--            />-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <!--      <el-row>-->
      <!--        <el-col :span="24">-->
      <!--          <el-form-item label="拼手速Banner设置">-->
      <!--            <ad-->
      <!--              ref="newRushBanner"-->
      <!--              :upload-api="uploadApi"-->
      <!--              :banner="setting.rushBanner"-->
      <!--            />-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确 定</el-button>
    </div>
  </div>

</template>

<script>
import { postAdd, get } from '@/api/setting'
import { getToken } from '@/utils/auth'
// import Ad from '@/components/Ad'

export default {
  // components: { Ad },
  data() {
    return {
      uploadApi: 'https://qlhbfm.caidan888.com/admin/v1/upload',
      switchLoading: true,
      selectRow: {},
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        search_value: '',
        status: null,
        start_time: '',
        end_time: ''
      },
      options: null,
      sellers: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogVisible: false,
      dialogStatus: 'create',
      setting: {
        first_gift: 15,
        every_day_gift: 5,
        ticket_expire: 365
      },
      tag: '',
      formLabelWidth: '120px'
    }
  },
  computed: {
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    cancel() {

    },
    fetchData() {
      get().then(res => {
        if (res.code === 200) {
          this.setting = Object.assign(this.setting, res.data)
        }
      })
      console.log(this.setting)
    },
    createData() {
      // this.goods.introduction_imgs = this.goods.introduction_imgs.map(img => {
      //   return img.upload_id
      // })
      // this.goods.info_imgs = this.goods.info_imgs.map(img => {
      //   return img.upload_id
      // })
      // console.log(this.goods)
      // this.setting.indexBanner = this.$refs.newIndexBanner.banner
      // this.setting.rushBanner = this.$refs.newRushBanner.banner
      postAdd(this.setting).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '恭喜你，设置成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.message)
        }
      })
    },
    edit(item, _index) {
      console.log(item, _index)
      this.dialogFormVisible = true
      this.dialogStatus = 'update'

      this.goods = item
      this.fetchCategories()
    },
    del(item, _index) {
      this.dialogHintVisible = true
      this.goods = item
    },
    handleAvatarSuccess(res) {
      this.$loading().close()
      console.log(res)
      this.goods.main_img = res.data.url
      this.goods.main_upload_id = res.data.id
    },
    handleChange(val) {
      this.goods.category_id = val
    },
    imgArrAdd(res, file) {
      if (res.code === 200) {
        this.goods.introduction_imgs.push({ upload_id: res.data.id, url: res.data.url })
      }
      console.log(file)
      console.log(this.goods.introduction_imgs)
    },
    imgArrAddInfo(res, file) {
      if (res.code === 200) {
        this.goods.info_imgs.push({ upload_id: res.data.id, url: res.data.url })
      }
      console.log(file)
      console.log(this.goods.info_imgs)
    },
    imgArrRemove(file) {
      console.log(file)
      this.goods.introduction_imgs = this.goods.introduction_imgs.filter(ele => {
        return file.upload_id !== ele.upload_id
      })
      console.log(this.goods.introduction_imgs)
    },
    imgArrRemoveInfo(file) {
      console.log(file)
      this.goods.info_imgs = this.goods.info_imgs.filter(ele => {
        return file.upload_id !== ele.upload_id
      })
      console.log(this.goods.info_imgs)
    },
    selectCurrentRow(row) {
      this.$emit('select', row)
    },
    loadData() {
      this.getList()
    }

  }
}
</script>
<style lang="scss">
.box-center {
  margin: 0 auto;
  display: table;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader .el-upload .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    // width: 178px;
    height: 178px;
    display: block;
    object-fit: cover;
  }
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
