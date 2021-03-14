<template>
  <div class="app-container">
    <search
      :status-hidden="false"
      :status-list="statusList"
      :export-hidden="false"
      :export-model="'log'"
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
      <el-table-column align="center" label="头像" width="95">
        <template slot-scope="scope">
          <el-avatar :size="50" :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" width="95">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="发生项目">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.attribute === 'point' ? 'primary' : scope.row.attribute === 'balance' ? 'warning' : scope.row.attribute === 'red_balance' ? 'info' : ''"
            effect="dark"
          >
            {{ scope.row.attribute === 'point' ? '积分' : scope.row.attribute === 'balance' ? '余额' : scope.row.attribute === 'red_balance' ? '红包余额' : scope.row.attribute === 'fragments' ? '蛋壳' : '' }}
          </el-tag>

        </template>
      </el-table-column>
      <el-table-column align="center" label="发生类型">
        <template slot-scope="scope">
          {{ scope.row.type_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="变动前">
        <template slot-scope="scope">
          {{ scope.row.before_value }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="变动值">
        <template slot-scope="scope">
          <el-tag
            style="border: 0;"
            :color="scope.row.value > 0 ? '#303133' : scope.row.value < 0 ? '#F56C6C' : '' "
            effect="dark"
            :hit="false"
          >
            {{ scope.row.value }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="变动后">
        <template slot-scope="scope">
          {{ scope.row.after_value }}
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" label="支付方式" width="180">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.method_name }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" label="发生时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
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
      <!--      <el-table-column align="center" label="操作" width="95">-->
      <!--        <template slot-scope="scope">-->
      <!--          <div class="operation-buttons">-->
      <!--            <el-button v-if="scope.row.status === 1" type="primary" size="small" @click="express(scope.row, scope.$index)">发货</el-button>-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total > 0"
      class="text-left"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />
  </div>

</template>

<script>
import { getList, getTypeList } from '@/api/log'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import { getToken } from '@/utils/auth'

export default {
  name: 'UserLog',
  components: { Pagination, Search },
  props: {
    userId: {
      type: Number,
      default: 0
    },
    attrType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      statusList: [],
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
        end_time: '',
        lucky_id: 0,
        user_id: 0,
        attr_type: ''
      },
      options: null,
      sellers: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogVisible: false,
      dialogSelectGoods: false,
      dialogStatus: 'create',
      lucky: {
        goods: {},
        goods_id: '',
        raw_price: '0.00',
        price: '0.00',
        done_count: 0,
        select_count: 0,
        no_select_count: 0,
        join_red_package: '0.00',
        new_red_package: '0.00',
        minutes: 0,
        repeat: 0,
        online_at: '',
        access_count: 0,
        fail_count: 0
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
  created() {
    this.getTypeList()
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    getTypeList() {
      getTypeList().then(res => {
        this.statusList = res.data
      })
    },
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
    loadData(user_id, attr_type) {
      this.userId = user_id
      this.attrType = attr_type
      this.fetchData({ user_id: this.userId, attr_type: this.attrType })
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
