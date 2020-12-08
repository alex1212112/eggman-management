<template>
  <div class="app-container">
    <search
      :status-hidden="true"
      @search="fetchData"
    />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" width="95">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像" width="95">
        <template slot-scope="scope">
          <el-avatar :size="50" :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="总余额">
        <template slot-scope="scope">
          {{ (parseFloat(scope.row.balance) + parseFloat(scope.row.red_balance)).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="余额">
        <template slot-scope="scope">
          {{ scope.row.balance }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="红包余额">
        <template slot-scope="scope">
          {{ scope.row.red_balance }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="积分">
        <template slot-scope="scope">
          {{ scope.row.point }}
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
      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="warning" size="small" @click="userInfo(scope.row, scope.$index)">用户详情</el-button>
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
      title="查看详情 "
      :visible.sync="dialogUserInfo"
      class="text-center"
      center
      width="90%"
      :destroy-on-close="true"
      @close="dialogUserInfo = false;getList()"
    >
      <user-info ref="userInfoCom" :user-id="user.id" />
    </el-dialog>
  </div>

</template>

<script>
import { getList } from '@/api/wechatUser'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import UserInfo from '@/components/UserInfo'
import { getToken } from '@/utils/auth'

export default {
  components: { Pagination, Search, UserInfo },
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
      dialogSelectGoods: false,
      dialogUserInfo: false,
      dialogStatus: 'create',
      user: {
        id: 0,
        phone: '',
        nickname: '',
        avatar: '',
        balance: '0.00',
        red_balance: '0.00',
        created_at: '',
        point: 0
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
    cancel() {
      this.dialogFormVisible = false
      this.getList()
    },
    fetchData(query) {
      this.listQuery = Object.assign(this.listQuery, query)
      this.listQuery.lucky_id = this.luckyId
      console.log(this.listQuery)
      this.getList()
    },
    userInfo(item) {
      this.dialogUserInfo = true
      this.user = item
      this.$nextTick(() => {
        this.$refs.userInfoCom.loadData(item.id)
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
