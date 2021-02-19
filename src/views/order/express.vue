<template>
  <div class="app-container">
    <search
      :status-hidden="false"
      :status-list="statusList"
      :export-hidden="false"
      :export-model="'expressOrder'"
      @search="fetchData"
    />
    <el-row style="margin-top: 10px;">
      <el-upload
        ref="upload"
        action="https://api.caidan888.com/admin/v1/upload/excel"
        :multiple="false"
        :headers="headers"
        :on-success="uploadExcel"
        name="file"
        :show-file-list="false"
      >
        <el-button type="success">批量发货<i class="el-icon-upload el-icon--right" /></el-button>
      </el-upload>
    </el-row>
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
      <el-table-column align="center" label="抽奖ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.lucky_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付金额" width="180">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开奖编号" width="180">
        <template slot-scope="scope">
          {{ scope.row.lucky_draw_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.goods_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="收货人" width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.phone">
            <el-tag>{{ scope.row.consignee }}</el-tag><el-tag type="info">{{ scope.row.phone }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="中奖人" width="180">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.nickname }}</el-tag><el-tag type="info">{{ scope.row.user_phone }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收货地址" width="180">
        <template slot-scope="scope">
          {{ scope.row.province }} {{ scope.row.city }} {{ scope.row.county }} {{ scope.row.detail_address }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? '' : scope.row.status === 2 ? 'warning' : scope.row.status === 3 ? 'success' : scope.row.status === 4 ? 'danger' : 'info'"
            effect="dark"
          >
            {{ scope.row.status_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="warning" size="small" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button v-if="scope.row.status === 1" type="primary" size="small" @click="express(scope.row, scope.$index)">发货</el-button>
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
      :title="'发货'"
      :visible.sync="dialogFormVisible"
      width="80%"
      @close="cancel"
    >
      <el-form
        :model="expressOrder"
      >
        <el-form-item label="快递名称" :label-width="formLabelWidth">
          <el-input v-model="expressOrder.express_name" style="width: 195px;" />
        </el-form-item>
        <el-form-item label="快递编号" :label-width="formLabelWidth">
          <el-input v-model="expressOrder.express_no" style="width: 195px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateData()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="'编辑收货地址'"
      :visible.sync="dialogEditVisible"
      width="80%"
      @close="cancel"
    >
      <el-form
        :model="expressOrder"
      >
        <!--        <el-form-item label="省/市/县" :label-width="formLabelWidth">-->
        <!--          <el-cascader-->
        <!--            v-model="expressOrder.area_code"-->
        <!--            :options="options"-->
        <!--            @change=""></el-cascader>-->
        <!--        </el-form-item>-->
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input v-model="expressOrder.detail_address" style="width: 195px;" />
        </el-form-item>
        <el-form-item label="收货人" :label-width="formLabelWidth">
          <el-input v-model="expressOrder.consignee" style="width: 195px;" />
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="expressOrder.phone" style="width: 195px;" />
        </el-form-item>
        <el-form-item label="快递名称" :label-width="formLabelWidth">
          <el-input v-model="expressOrder.express_name" style="width: 195px;" />
        </el-form-item>
        <el-form-item label="快递编号" :label-width="formLabelWidth">
          <el-input v-model="expressOrder.express_no" style="width: 195px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false;getList();">取 消</el-button>
        <el-button type="primary" @click="updateInfo()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getList, putEdit, putInfo } from '@/api/expressOrder'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import { getToken } from '@/utils/auth'

export default {
  name: 'Draw',
  components: { Pagination, Search },
  props: {
    luckyId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      statusList: [{ id: 0, name: '全部' }, { id: 1, name: '待发货' }, { id: 2, name: '待收货' }, { id: 3, name: '已签收' }, { id: 4, name: '已放弃' }],
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
      dialogEditVisible: false,
      dialogStatus: 'create',
      expressOrder: {
        id: 0,
        express_name: '',
        express_no: '',
        // area_code: 0,
        // province: '',
        // city: '',
        // county: '',
        detail_address: '',
        consignee: '',
        phone: ''
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
    express(item) {
      this.dialogFormVisible = true
      this.expressOrder = item
    },
    updateData() {
      putEdit(this.expressOrder).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    updateInfo() {
      putInfo(this.expressOrder).then(res => {
        if (res.code === 200) {
          this.dialogEditVisible = false
          this.getList()
        }
      })
    },
    edit(item) {
      this.expressOrder = item
      this.dialogEditVisible = true
    },
    uploadExcel(res) {
      if (res.code === 200) {
        this.$message({
          message: '批量发货成功',
          type: 'success'
        })
      } else {
        this.$message.error(res.message)
      }
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
