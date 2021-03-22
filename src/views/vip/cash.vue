<template>
  <div class="app-container">
    <search
      :status-hidden="false"
      :status-list="statusList"
      :export-hidden="true"
      :export-model="'vipCash'"
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
      <!--      <el-table-column align="center" label="用户头像" width="95">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-avatar :size="50" :src="scope.row.avatar" />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" label="用户昵称" width="95">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.nickname }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" label="提现单号" width="180">
        <template slot-scope="scope">
          {{ scope.row.cash_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现类型" width="95">
        <template slot-scope="scope">
          <!--          <el-tag-->
          <!--            :type="scope.row.cash_way === 'wechat' ? 'success' : scope.row.cash_way === 'alipay' ? '' : 'danger'"-->
          <!--            effect="dark"-->
          <!--          >-->
          <!--            {{ scope.row.cash_way === 'wechat' ? '微信' : scope.row.cash_way === 'alipay' ? '支付宝' : '' }}-->
          <!--          </el-tag>-->
          {{ scope.row.type_name }}
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" label="支付方式" width="180">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.method_name }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" label="提现金额" width="95">
        <template slot-scope="scope">
          {{ scope.row.cash_amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="服务费" width="95">
        <template slot-scope="scope">
          {{ scope.row.service_fee }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际提现金额" width="95">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="真实姓名" width="95">
        <template slot-scope="scope">
          {{ scope.row.user_real.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.user_bank.bank_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行卡号" width="180">
        <template slot-scope="scope">
          {{ scope.row.user_bank.bank_card }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.operate_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请提现时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? '' : scope.row.status === 2 ? 'success' : scope.row.status === 3 ? 'danger' : 'warning'"
            effect="dark"
          >
            {{ scope.row.status_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="95">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button v-if="scope.row.status === 1" type="primary" size="small" @click="cashEdit(scope.row, scope.$index)">提现</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="提醒 "
      :visible.sync="dialogHintVisible"
      class="text-center"
      center
      width="30%"
    >
      <span class="text-center">
        确认给该用户已打款吗？
      </span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHintVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="cashData()">
          确定
        </el-button>
      </div>
    </el-dialog>

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
import { getList, putEdit } from '@/api/vipCash'
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
      statusList: [{ id: 0, name: '全部' }, { id: 1, name: '提现中' }, { id: 2, name: '提现成功' }],
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
      cash: {
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
    cashEdit(item, index) {
      this.dialogHintVisible = true
      this.cash = item
    },
    cashData() {
      putEdit(this.cash).then(res => {
        if (res.code === 200) {
          this.dialogHintVisible = false
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
