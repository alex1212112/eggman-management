<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search_value"
        placeholder="查询关键字"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left:20px"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加分包商
      </el-button>
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        Export
      </el-button>
      <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        style="margin-left:15px;"
        @change="tableKey = tableKey + 1"
      >
        reviewer
      </el-checkbox> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        :label="item.name"
        v-for="(item, index) in tableHead"
        :key="index"
        :width="width(item.key)"
        :align="align(item.key)"
      >
        <div v-if="!!item.children">
          <el-table-column
            :label="subItem.name"
            v-for="(subItem, subIndex) in item.children"
            :key="subIndex"
            :width="width(subItem.key)"
            :align="align(subItem.key)"
          >
            <template slot-scope="scope">
              <span v-if="showNormal(subItem)">{{
                subItem | itemFilter(scope.row, item)
              }}</span>
              <div class="item-cover" v-if="showCover(subItem)">
                <img :src="subItem | itemFilter(scope.row)" />
              </div>
              <el-switch
                v-if="showStatus(subItem)"
                :value="subItem | itemFilter(scope.row)"
                @change="status => changeStatus(scope.row, status)"
              >
              </el-switch>
              <el-link
                type="primary"
                v-if="showLink(subItem)"
                @click="showContent(scope)"
                >查看</el-link
              >
            </template>
          </el-table-column>
        </div>
        <template slot-scope="scope">
          <span v-if="showNormal(item)">{{
            item | itemFilter(scope.row)
          }}</span>
          <div class="item-cover" v-if="showCover(item)">
            <img :src="item | itemFilter(scope.row)" />
          </div>
          <el-switch
            v-if="showStatus(item)"
            :value="item | itemFilter(scope.row)"
            @change="status => changeStatus(scope.row, status)"
          >
          </el-switch>
          <el-link
            type="primary"
            v-if="showLink(item)"
            @click="showContent(scope)"
            >查看</el-link
          >
          <div class="operation-buttons" v-if="showOperation(item)">
            <el-button type="primary" @click="more(scope)">更多</el-button>
            <template>
              <el-popconfirm
                style="margin-left: 8px"
                title="确定删除该分包商吗？"
                @onConfirm="del(scope)"
              >
                <el-button type="danger" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
            <!-- <el-button type="danger" @click="del(scope)">删除</el-button> -->
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="dialogStatus === 'update' ? '编辑分包商' : '添加分包商'"
      :visible.sync="dialogFormVisible"
      fullscreen
    >
      <!-- <el-form
        ref="employeeForm"
        :rules="employeeRules"
        :model="employeeTemp"
        label-position="right"
        label-width="90px"
        style="width: 400px;"
        class="box-center"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="employeeTemp.phone" placeholder="员工手机号" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="employeeTemp.realName" placeholder="真实姓名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="employeeTemp.password" placeholder="密码" />
        </el-form-item> -->
      <!-- </el-form> -->
      <detail-form ref="detailForm" :item="editScope" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="
            dialogStatus === 'update'
              ? updateSubcontractor()
              : createSubcontractor()
          "
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  createSubcontractor,
  updateSubcontractor,
  removeSubcontractor
} from '@/api/subcontractor'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DetailForm from './components/DetailForm'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Department',
  components: { Pagination, DetailForm },
  directives: { waves },
  filters: {
    statusFilter(item) {
      return ''
    },
    itemFilter(item, row, parent) {
      if (parent) {
        return row[parent.key][item.key]
      }
      const k = item.key
      const v = row[k]
      if (k == 'uuid') {
        return v.toUpperCase()
      }
      if (k == 'is_check') {
        if (v == 0) {
          return false
        }
        return true
      }
      return v
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        search_value: ''
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      dialogEmployeeVisible: false,
      dialogEmployeeStatus: '',
      employeeTemp: {
        id: undefined,
        phone: '',
        realName: '',
        password: ''
      },
      employeeRules: {
        phone: [],
        realName: [],
        password: []
      },
      dialogDepartmentMemberVisible: false,
      departmentMemberTemp: {
        userId: ''
      },
      departmentMemberRules: {
        userId: []
      },
      dialogDepartmentVisible: false,
      editScope: null,
      subcontractoData: null
    }
  },
  computed: {
    departmentId() {
      const route = this.$route.path
      return route.split('/').pop()
    },
    tableData() {
      if (!this.list) {
        return []
      }
      const list = this.list.map(e => {
        if (e.contacts && e.contacts.length > 0) {
          e.contactsPreview = e.contacts[0]
        }
        return e
      })
      return list
      // return this.list
    },
    tableHead() {
      return [
        {
          name: '名称',
          key: 'name'
        },
        {
          name: '编号',
          key: 'id'
        },
        {
          name: '联系人',
          key: 'contactsPreview',
          children: [
            {
              name: '姓名',
              key: 'name'
            },
            {
              name: '职位',
              key: 'position'
            },
            {
              name: '手机号',
              key: 'phone'
            },
            {
              name: '邮箱',
              key: 'email'
            }
          ]
        },
        {
          name: '操作',
          key: 'operation'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const params = {
        ...this.listQuery
      }
      fetchList(params).then(response => {
        this.list = response.data.data
        this.total = response.data.total

        // Just to simulate the time of the request
        this.listLoading = false
        // setTimeout(() => {
        // }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },

    showOperation(item) {
      return item.key && item.key == 'operation'
    },
    showNormal(item) {
      return (
        item.key != 'operation' &&
        item.key != 'cover' &&
        item.key != 'is_check' &&
        item.key != 'content'
      )
    },
    showCover(item) {
      return item.key && item.key == 'cover'
    },
    showStatus(item) {
      return item.key && item.key == 'is_check'
    },
    showLink(item) {
      return item.key && item.key == 'content'
    },

    width(key) {
      if (key == 'content') {
        return '80'
      }
      if (key == 'cover') {
        return '280'
      }
      if (key == 'sort') {
        return '80'
      }
      if (key == 'is_check') {
        return '80'
      }
      return ''
    },
    align(key) {
      if (key == 'content') {
        return 'center'
      }
      if (key == 'cover') {
        return 'center'
      }
      if (key == 'is_check') {
        return 'center'
      }
      if (key == 'sort') {
        return 'center'
      }
      if (key == 'operation') {
        return 'center'
      }
      if (key == 'contactsPreview') {
        return 'center'
      }
      return ''
    },
    edit(scope) {
      this.handleUpdateEmployee(scope)
    },
    del(scope) {
      this.removeSubcontractor(scope)
    },
    more(scope) {
      this.handleEdit(scope)
    },
    resetTemp() {
      this.editScope = {
        row: {
          contacts: [],
          invoice: [],
          settle: [],
          name: ''
        }
      }
    },
    resetEmployeeTemp() {
      this.employeeTemp = {
        id: undefined,
        phone: '',
        realName: '',
        password: ''
      }
    },
    resetDepartmentTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    resetDemartmentMemberTemp() {
      this.departmentMemberTemp = {
        userId: ''
      }
    },
    handleEdit(scope) {
      this.resetTemp()
      this.editScope = scope
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['detailForm'].reloadData()
      })
    },
    createSubcontractor(data) {
      this.$refs['detailForm'].submitData(data => {
        this.realCreateSubcontractor(data)
      })
    },
    realCreateSubcontractor(data) {
      const params = {
        ...data
      }
      this.$loading()
      createSubcontractor(params)
        .then(res => {
          this.dialogEmployeeVisible = false
          this.$loading().close()
          if (!res) {
            this.$notify({
              title: '失败',
              message: '无响应',
              type: 'error',
              duration: 2000
            })
            return
          }
          if (res.code !== 200) {
            this.$notify({
              title: '失败',
              message: res.data.message || '操作失败',
              type: 'error',
              duration: 2000
            })
            return
          }
          this.getList()
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
        })
        .catch(e => {
          this.$loading().close()
          this.$notify({
            title: '失败',
            message: e.message || '网络错误',
            type: 'success',
            duration: 2000
          })
        })
    },
    updateSubcontractor() {
      this.$refs['detailForm'].submitData(data => {
        this.realUpdateSubcontractor(data)
      })
    },
    realUpdateSubcontractor(data) {
      const params = {
        id: this.editScope.row.id,
        ...data
      }
      this.$loading()
      updateSubcontractor(params)
        .then(res => {
          this.subcontractor = false
          this.$loading().close()
          if (!res) {
            this.$notify({
              title: '失败',
              message: '无数据返回',
              type: 'error',
              duration: 2000
            })
            return
          }
          if (res.code !== 200) {
            this.$notify({
              title: '失败',
              message: res.data.message || '操作失败',
              type: 'error',
              duration: 2000
            })
            return
          }
          this.getList()
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
        })
        .catch(e => {
          this.$loading().close()
          this.$notify({
            title: '失败',
            message: e.message || '网络错误',
            type: 'success',
            duration: 2000
          })
        })
    },
    removeSubcontractor(scope) {
      const params = {
        id: scope.row.id
      }
      this.$loading()
      removeSubcontractor(params)
        .then(res => {
          this.$loading().close()
          if (!res) {
            this.$notify({
              title: '失败',
              message: '无响应',
              type: 'error',
              duration: 2000
            })
            return
          }
          if (res.code !== 200) {
            this.$notify({
              title: '失败',
              message: res.data.message || '操作失败',
              type: 'error',
              duration: 2000
            })
            return
          }
          this.getList()
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
        .catch(e => {
          this.$loading().close()
          this.$notify({
            title: '失败',
            message: e.message || '网络错误',
            type: 'success',
            duration: 2000
          })
        })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['detailForm'].reloadData()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
