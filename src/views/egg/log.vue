<template>
  <div class="app-container">
    <search
      :status-hidden="false"
      :status-list="statusList"
      :export-hidden="true"
      :export-model="'expressOrder'"
      @search="fetchData"
    />
    <el-row style="margin-top: 10px;">
      <el-col :span="4">
        <el-button type="primary" @click="eggPost">补发</el-button>
      </el-col>
      <el-col :span="4">
        <!--        <el-upload-->
        <!--          ref="upload"-->
        <!--          action="https://api.caidan888.com/admin/v2/upload/egg"-->
        <!--          :multiple="false"-->
        <!--          :headers="headers"-->
        <!--          :on-success="uploadExcel"-->
        <!--          name="file"-->
        <!--          :show-file-list="false"-->
        <!--        >-->
        <!--          <el-button type="success">批量补发<i class="el-icon-upload el-icon&#45;&#45;right" /></el-button>-->
        <!--        </el-upload>-->
      </el-col>
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
      <el-table-column align="center" label="订单时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户ID" width="180">
        <template slot-scope="scope">
          {{ scope.row.user_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户信息" width="180">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.nickname }}</el-tag><el-tag type="info">{{ scope.row.user_phone }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <!--          <el-tag-->
          <!--            :type="scope.row.status === 1 ? '' : scope.row.status === 2 ? 'warning' : scope.row.status === 3 ? 'success' : scope.row.status === 4 ? 'danger' : 'info'"-->
          <!--            effect="dark"-->
          <!--          >-->
          {{ scope.row.type_name }}
          <!--          </el-tag>-->
        </template>
      </el-table-column>
      <el-table-column align="center" label="彩蛋名称" width="180">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.eggs.name }}</el-tag> 彩蛋
        </template>
      </el-table-column>
      <el-table-column align="center" label="变动数量" width="180">
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
      <el-table-column align="center" label="变动信息" width="180">
        <template slot-scope="scope">
          {{ scope.row.info }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button v-if="scope.row.type === 1" type="primary" size="small" @click="detail(scope.row, scope.$index)">查看详情</el-button>
            <el-button v-if="scope.row.type === 3" type="primary" size="small" @click="expire(scope.row, scope.$index)">查看详情</el-button>
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
      :title="'获得详情'"
      :visible.sync="dialogGetVisible"
      width="50%"
      @close="cancel"
    >
      <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="用户头像">
          <el-avatar :size="50" :src="log.user.avatar" />
        </el-form-item>
        <el-form-item label="微信昵称">
          <span>{{ log.user.nickname }}</span>
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{ log.user.phone }}</span>
        </el-form-item>
        <el-form-item label="彩蛋ID">
          <span>{{ log.eggs.id }}</span>
        </el-form-item>
        <el-form-item label="开奖ID">
          <span>{{ log.lucky_draw_user_two.lucky_draw_two_id }}</span>
        </el-form-item>
        <el-form-item label="抽奖ID">
          <span>{{ log.lucky_draw_user_two.lucky_two_id }}</span>
        </el-form-item>
        <el-form-item label="获得时间">
          <span>{{ log.created_at }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="'失效详情'"
      :visible.sync="dialogExpireVisible"
      width="50%"
      @close="cancel"
    >
      <el-table
        v-loading="listLoading"
        :data="expire_list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="抽奖ID" width="95">
          <template slot-scope="scope">
            {{ scope.row.lucky_draw_user_two.lucky_two_id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="开奖ID" width="95">
          <template slot-scope="scope">
            {{ scope.row.lucky_draw_user_two.lucky_draw_two_id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="获得时间">
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :title="'补发'"
      :visible.sync="dialogFormVisible"
      width="80%"
      @close="cancel"
    >
      <el-form
        :model="egg"
      >
        <el-form-item label="用户ID" :label-width="formLabelWidth">
          <el-input v-model="egg.user_id" style="width: 195px;" />
        </el-form-item>
        <el-form-item label="彩蛋ID" :label-width="formLabelWidth">
          <el-input v-model="egg.eggs_id" style="width: 195px;" />
        </el-form-item>
        <el-form-item label="补发数量" :label-width="formLabelWidth">
          <el-input-number v-model="egg.value" autocomplete="off" style="width: 195px;" :min="1" :step="1" :max="10000" />
        </el-form-item>
        <el-form-item label="信息" :label-width="formLabelWidth">
          <el-input v-model="egg.info" style="width: 195px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getList, putEdit, putInfo } from '@/api/eggLog'
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
      statusList: [{ id: 0, name: '全部' }, { id: 1, name: '获得彩蛋' }, { id: 2, name: '达成条件' }, { id: 3, name: '彩蛋失效' }, { id: 4, name: '系统补发' }],
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
      dialogGetVisible: false,
      dialogExpireVisible: false,
      dialogSelectGoods: false,
      dialogEditVisible: false,
      dialogStatus: 'create',
      expire_list: [],
      log: {
        user: {
          avatar: '',
          id: 0,
          nickname: '',
          phone: ''
        },
        eggs: {
          id: 0
        },
        lucky_draw_user_two: {
          lucky_two_id: 0,
          lucky_draw_two_id: 0
        }
      },
      egg: {
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
      this.dialogGetVisible = false
      this.dialogExpireVisible = false
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
      putEdit(this.egg).then(res => {
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
    },
    detail(item, index) {
      this.log = item
      this.dialogGetVisible = true
    },
    expire(item, index) {
      this.expire_list = item.expire_list
      this.dialogExpireVisible = true
    },
    eggPost() {
      this.egg = {}
      this.dialogFormVisible = true
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
