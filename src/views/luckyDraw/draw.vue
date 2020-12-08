<template>
  <div class="app-container">
    <search
      :status-hidden="false"
      :status-list="statusList"
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
      <el-table-column align="center" label="开奖ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="抽奖ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.lucky_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.begin_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="预计结束" width="180">
        <template slot-scope="scope">
          {{ scope.row.end_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开奖时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.open_at }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? '' : scope.row.status === 2 ? 'warning' : scope.row.status === 3 ? 'success' : 'danger'"
            effect="dark"
          >
            {{ scope.row.status_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="奖品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.goods_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="warning" size="small" @click="info(scope.row, scope.$index)">开奖详情</el-button>
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
      :visible.sync="dialogInfo"
      class="text-center"
      center
      width="90%"
      :destroy-on-close="true"
      @close="dialogInfo = false;getList()"
    >
      <lucky-draw-info ref="infoCom" :lucky-draw-id="luckyDraw.id" />
    </el-dialog>
  </div>

</template>

<script>
import { getList } from '@/api/luckyDraw'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import LuckyDrawInfo from '@/components/LuckyDrawInfo'
import { getToken } from '@/utils/auth'

export default {
  name: 'Draw',
  components: { Pagination, Search, LuckyDrawInfo },
  props: {
    luckyId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      statusList: [{ id: 0, name: '全部' }, { id: 1, name: '抽奖中' }, { id: 2, name: '开奖中' }, { id: 3, name: '开奖成功' }, { id: 4, name: '开奖失败' }],
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
      dialogInfo: false,
      dialogStatus: 'create',
      luckyDraw: {
        id: 0
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
    info(item) {
      this.dialogInfo = true
      this.luckyDraw = item
      this.$nextTick(() => {
        this.$refs.infoCom.loadData(item.id)
      })
    },
    loadData(id) {
      this.listQuery.lucky_id = id
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
