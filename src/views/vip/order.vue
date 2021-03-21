<template>
  <div class="app-container">
    <search
      :status-hidden="false"
      :status-list="statusList"
      :export-hidden="false"
      :export-model="'realOrder'"
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
      <el-table-column align="center" label="订单编号" width="95">
        <template slot-scope="scope">
          {{ scope.row.order_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付单号" width="95">
        <template slot-scope="scope">
          {{ scope.row.pay_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付渠道" width="95">
        <template slot-scope="scope">
          <el-tag
            :type=" scope.row.pay_code === 'wechatMiniProgram' ? 'success' : scope.row.pay_code === 'aliPay' ? 'primary' : scope.row.pay_code === 'balance' ? 'warning' : scope.row.pay_code === 'wechatApp' ? 'info' : '' "
            effect="dark"
          >
            {{ scope.row.pay_code === 'wechatMiniProgram' ? '微信小程序' : scope.row.pay_code === 'aliPay' ? '支付宝' : scope.row.pay_code === 'balance' ? '余额' : scope.row.pay_code === 'wechatApp' ? '微信APP' : '' }}
          </el-tag>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" label="支付方式" width="180">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.method_name }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" label="支付金额" width="180">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户信息" width="180">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.nickname }}</el-tag><el-tag type="info">{{ scope.row.user_phone }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? '' : scope.row.status === 2 ? 'success' : scope.row.status === 3 ? 'warning' : 'danger'"
            effect="dark"
          >
            {{ scope.row.status_name }}
          </el-tag>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" label="操作" width="250">-->
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
import { getList } from '@/api/realOrder'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import { getToken } from '@/utils/auth'

export default {
  components: { Pagination, Search },
  props: {
    luckyId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      statusList: [{ id: 0, name: '全部' }, { id: 1, name: '待支付' }, { id: 2, name: '支付成功' }, { id: 3, name: '已取消' }],
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
        lucky_id: 0
      },
      options: null,
      sellers: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogVisible: false,
      dialogSelectGoods: false,
      dialogStatus: 'create',
      order: {
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
