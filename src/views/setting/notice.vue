<template>
  <div class="app-container">
    <search
      :status-hidden="true"
      :export-hidden="true"
      :export-model="'eggs'"
      @search="fetchData"
    />
    <el-row>
      <el-col>
        <el-button
          v-if="!isSelect"
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-plus"
          @click="handlerCreate"
        >
          发送系统消息
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @current-change="selectCurrentRow"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="消息内容">
        <template slot-scope="scope">
          {{ scope.row.message }}
        </template>
      </el-table-column>
      <!--<el-table-column class-name="status-col" label="状态" width="110" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isSelect" align="center" label="操作" width="200">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="primary" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button type="danger" @click="del(scope.row, scope.$index)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      class="text-left"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />

    <el-dialog
      :title="dialogStatus === 'create' ? '发送系统消息' : '编辑系统消息'"
      :visible.sync="dialogFormVisible"
      width="80%"
      @close="cancel"
    >
      <el-form
        :model="notice"
      >
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="消息内容" :label-width="formLabelWidth">
              <el-input v-model="notice.message" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提醒 "
      :visible.sync="dialogHintVisible"
      class="text-center"
      center
      width="30%"
    >
      <span class="text-center">
        此操作会直接删除系统消息，可能会产生数据关联错误，确定删除吗？
      </span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHintVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="delData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getList, postAdd, putEdit, delItem } from '@/api/notice'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import { getToken } from '@/utils/auth'

export default {
  components: { Pagination, Search },
  props: {
    isSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadApi: 'https://api.caidan888.com/admin/v1/upload',
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
      dialogDetailLuckyTwo: false,
      dialogStatus: 'create',
      notice: {
        id: 0,
        message: ''
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
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.data
        this.listLoading = false
        this.switchLoading = false
      })
    },
    // switchUp(id) {
    //   this.switchLoading = true
    //   upCheck({ id: id }).then(res => {
    //     this.switchLoading = false
    //   })
    // },
    cancel() {
      this.dialogFormVisible = false
      this.getList()
    },
    fetchData(query) {
      this.listQuery = Object.assign(this.listQuery, query)
      console.log(this.listQuery)
      this.getList()
    },
    handlerCreate() {
      this.notice = {
        id: 0,
        message: ''
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    createData() {
      console.log(this.notice)
      postAdd(this.notice).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    edit(item, _index) {
      console.log(item, _index)
      this.dialogFormVisible = true
      this.dialogStatus = 'update'

      this.notice = item
    },
    del(item, _index) {
      this.dialogHintVisible = true
      this.notice = item
    },
    updateData() {
      putEdit(this.notice).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    delData() {
      delItem(this.notice).then(res => {
        if (res.code === 200) {
          this.dialogHintVisible = false
          this.getList()
        }
      })
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
