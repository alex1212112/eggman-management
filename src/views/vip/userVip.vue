<template>
  <div class="app-container">
    <search
      :status-hidden="true"
      :export-hidden="true"
      :export-model="'userVip'"
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
          添加根会员
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
      <el-table-column align="center" label="用户ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.user_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" width="95">
        <template slot-scope="scope">
          {{ scope.row.user.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像" width="95">
        <template slot-scope="scope">
          <el-avatar :size="50" :src="scope.row.user.avatar" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机">
        <template slot-scope="scope">
          {{ scope.row.user.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="VIP">
        <template slot-scope="scope">
          <div v-if="scope.row.vip">
            {{ scope.row.vip.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="SVIP">
        <template slot-scope="scope">
          <div v-if="scope.row.svip">
            {{ scope.row.svip.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邀请码">
        <template slot-scope="scope">
          {{ scope.row.id_code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="推荐人">
        <template slot-scope="scope">
          <div v-if="scope.row.parent">
            <el-tag>{{ scope.row.parent.nickname }}</el-tag><el-tag type="info">{{ scope.row.parent.phone }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <!--      <el-table-column label="状态" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tag-->
      <!--            :type="scope.row.status === 1 ? '' : scope.row.status === 2 ? 'warning' : scope.row.status === 3 ? 'success' : 'danger'"-->
      <!--            effect="dark"-->
      <!--          >-->
      <!--            {{ scope.row.status_name }}-->
      <!--          </el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" label="会员时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="info" size="small" @click="userChildren(scope.row, scope.$index)">查看下级</el-button>
            <el-button type="warning" size="small" @click="edit(scope.row, scope.$index)">调整SVIP等级</el-button>
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
      title="查看下级 "
      :visible.sync="dialogUserChildren"
      class="text-center"
      center
      width="90%"
      :destroy-on-close="true"
      @close="dialogUserChildren = false;getList()"
    >
      <user-vip ref="userVipCom" :parent-user-id="userVip.user_id" :is-select="true" />
    </el-dialog>

    <el-dialog
      :title="dialogStatus === 'create' ? '添加会员' : '编辑会员'"
      :visible.sync="dialogFormVisible"
      width="80%"
      @close="cancel"
    >
      <el-form
        :model="userVip"
      >
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="选择用户" :label-width="formLabelWidth">
              <el-button type="success" @click="selectUser">选择用户</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="用户ID" :label-width="formLabelWidth">
              <el-input v-model="userVip.user_id" autocomplete="off" style="width: 250px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="SVIP等级" :label-width="formLabelWidth">
              <el-select v-model="userVip.svip_level" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.level"
                />
              </el-select>
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
      title="选择用户-单击用户行选择用户 "
      :visible.sync="dialogSelectUser"
      class="text-center"
      center
      width="90%"
    >
      <user
        ref="userCom"
        :is-select="true"
        @select="selectRowUser"
      />
    </el-dialog>
  </div>

</template>

<script>
import { getAll } from '@/api/svip'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import User from '@/views/user/user'
import UserVip from '@/views/vip/userVip'
import { getToken } from '@/utils/auth'
import { postAdd, getList, putEdit } from '@/api/userVip'

export default {
  name: 'UserVip',
  components: { Pagination, Search, UserVip, User },
  props: {
    isSelect: {
      type: Boolean,
      default: false
    },
    parentUserId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      switchLoading: true,
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
      dialogSelectUser: false,
      dialogUserChildren: false,
      dialogStatus: 'create',
      userVip: {
        id: 0,
        user_id: 0,
        svip_level: ''
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
    this.getOption()
  },
  methods: {
    getList() {
      this.listLoading = true
      Object.assign(this.listQuery, { parent_user_id: this.parentUserId })
      getList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.data
        this.listLoading = false
        this.switchLoading = false
      })
    },
    cancel() {
      this.dialogFormVisible = false
      this.getList()
    },
    getOption() {
      getAll().then(res => {
        this.options = res.data
      })
    },
    fetchData(query) {
      this.listQuery = Object.assign(this.listQuery, query)
      console.log(this.listQuery)
      this.getList()
    },
    userChildren(item) {
      this.dialogUserChildren = true
      this.userVip = item
      this.$nextTick(() => {
        this.$refs.userVipCom.loadData()
      })
    },
    selectCurrentRow(row) {
      this.$emit('select', row)
    },
    loadData() {
      this.getList()
    },
    selectUser() {
      this.dialogSelectUser = true
      this.$nextTick(() => {
        this.$refs.userCom.loadData()
      })
    },
    selectRowUser(row) {
      console.log(row)
      this.userVip.user_id = row.id
      this.dialogSelectUser = false
    },
    handlerCreate() {
      this.userVip = {
        id: 0,
        user_id: 0,
        svip_level: ''
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    createData() {
      console.log(this.userVip)
      postAdd(this.userVip).then(res => {
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

      this.userVip = item
      if (this.userVip.svip_level === 0) {
        this.userVip.svip_level = ''
      }
    },
    updateData() {
      putEdit(this.userVip).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
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
