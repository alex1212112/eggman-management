<template>
  <div class="app-container">
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
      <el-table-column align="center" label="任务名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务类型">
        <template slot-scope="scope">
          {{ scope.row.repeat === 'daily' ? '每日' : '累计' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="达标次数">
        <template slot-scope="scope">
          {{ scope.row.need_count }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="奖励对象">
        <template slot-scope="scope">
          {{ scope.row.attribute === 'balance' ? '余额' : scope.row.attribute === 'point' ? '积分' : scope.row.attribute === 'red_balance' ? '红包余额' : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="奖励值">
        <template slot-scope="scope">
          {{ scope.row.reward }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="primary" size="small" @click="edit(scope.row, scope.$index)">编辑</el-button>
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
      :title="'编辑任务'"
      :visible.sync="dialogFormVisible"
      width="80%"
      @close="cancel"
    >
      <el-form
        :model="task"
      >
        <el-form-item label="任务名称" :label-width="formLabelWidth">
          <el-input v-model="task.name" style="width: 195px;" />
        </el-form-item>
        <el-form-item label="任务类型" :label-width="formLabelWidth">
          <el-radio v-model="task.repeat" label="daily">每日</el-radio>
          <el-radio v-model="task.repeat" label="once">累计</el-radio>
        </el-form-item>
        <el-form-item label="达标次数" :label-width="formLabelWidth">
          <el-input-number v-model="task.need_count" :precision="0" :step="1" :min="0" style="width: 195px;" />
        </el-form-item>
        <el-form-item label="奖励对象" :label-width="formLabelWidth">
          <el-radio v-model="task.attribute" label="point">积分</el-radio>
          <el-radio v-model="task.attribute" label="balance">余额</el-radio>
          <el-radio v-model="task.attribute" label="red_balance">红包余额</el-radio>
        </el-form-item>
        <el-form-item label="奖励值" :label-width="formLabelWidth">
          <el-input-number v-model="task.reward" :precision="0" :step="1" :min="0" style="width: 195px;" />
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
import { getList, putEdit } from '@/api/task'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getToken } from '@/utils/auth'

export default {
  components: { Pagination },
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
      task: {
        id: 0,
        name: '',
        need_count: 0,
        reward: 0,
        attribute: '',
        repeat: ''
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
    edit(row) {
      this.dialogFormVisible = true
      this.task = row
    },
    updateData() {
      putEdit(this.task).then(res => {
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
