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
      <!-- <el-select
        v-model="listQuery.importance"
        placeholder="Imp"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option
          v-for="item in importanceOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select> -->
      <!-- <el-select
        v-model="listQuery.type"
        placeholder="Type"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name + '(' + item.key + ')'"
          :value="item.key"
        />
      </el-select> -->
      <!-- <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select> -->
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
        @click="handleCreateDepartment"
      >
        添加部门
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleUpdateDepartmentMember"
      >
        添加部门成员
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreateEmployee"
      >
        添加公司员工
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
            <el-button type="primary" @click="edit(scope)">编辑</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="Type" prop="type">
          <el-select
            v-model="temp.type"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker
            v-model="temp.timestamp"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select
            v-model="temp.status"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate
            v-model="temp.importance"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :max="3"
            style="margin-top:8px;"
          />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input
            v-model="temp.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="添加员工" :visible.sync="dialogEmployeeVisible">
      <el-form
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
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEmployeeVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createEmployee">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogDepartmentMemberVisible"
      title="添加部门成员"
    >
      <el-form
        ref="departmentMemberForm"
        :rules="departmentMemberRules"
        :model="departmentMemberTemp"
        label-position="right"
        label-width="90px"
        style="width: 400px;"
        class="box-center"
      >
        <el-form-item label="员工姓名" prop="userId">
          <el-input
            v-model="departmentMemberTemp.userId"
            placeholder="员工姓名"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEmployeeVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateDepartmentUser">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDepartmentVisible" title="添加部门">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDepartmentVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDepartmentUser, updateDepartmentUser } from '@/api/department'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(item) {
      return ''
    },
    itemFilter(item, row) {
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
      employeeTemp: {
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
      dialogDepartmentVisible: false
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
      // if (this.list.length == 0 || Object.keys(this.formStruct).length == 0) {
      //   return []
      // }
      const list = this.list.map(e => e.user)
      return list
      // return this.list
    },
    tableHead() {
      return [
        {
          name: '姓名',
          key: 'real_name'
        },
        {
          name: '手机号',
          key: 'phone'
        },
        {
          name: '工号',
          key: 'id'
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
        department_id: this.departmentId,
        ...this.listQuery
      }
      fetchDepartmentUser(params).then(response => {
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
    },
    resetTemp() {
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
    resetEmployeeTemp() {
      this.employeeTemp = {
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
    handleCreateEmployee() {
      this.resetEmployeeTemp()
      // this.dialogStatus = 'create'
      this.dialogEmployeeVisible = true
      this.$nextTick(() => {
        this.$refs['employeeForm'].clearValidate()
      })
    },
    handleCreateDepartment() {
      this.resetDepartmentTemp()
      this.dialogStatus = 'create'
      this.dialogDepartmentVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdateDepartmentMember() {
      this.resetDemartmentMemberTemp()
      // this.dialogStatus = 'create'
      this.dialogDepartmentMemberVisible = true
      this.$nextTick(() => {
        this.$refs['departmentMemberForm'].clearValidate()
      })
    },
    createDepartment() {},
    updateDepartmentUser() {
      this.$refs['departmentMemberForm'].validate(valid => {
        if (valid) {
          const params = {
            user_id: this.departmentMemberTemp.userId,
            department_id: this.departmentId
          }
          this.$loading()
          updateDepartmentUser(params)
            .then(res => {
              this.dialogDepartmentMemberVisible = false
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
        }
      })
    },
    createEmployee() {
      this.$refs['employeeForm'].validate(valid => {
        if (valid) {
          const params = {
            phone: this.employeeTemp.phone,
            real_name: this.employeeTemp.realName,
            password: this.employeeTemp.password
          }
          this.$loading()
          this.$store
            .dispatch('user/createUser', params)
            .then(res => {
              this.dialogEmployeeVisible = false
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
        }
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
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
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
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
