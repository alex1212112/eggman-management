<template>
  <div class="com-detail-section">
    <label class="section-title"> {{ title }} </label>
    <el-divider></el-divider>
    <div class="buttons">
      <el-button icon="el-icon-plus" type="primary" @click="addContactRow"
        >新增</el-button
      >
    </div>
    <div class="table-container">
      <el-table
        :key="tableKey"
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
            <!-- <span v-if="showNormal(item)">{{
                item | itemFilter(scope.row)
              }}</span> -->
            <div v-if="showNormal(item)">
              <el-input
                v-model="scope.row[item.key]"
                placeholder="请输入"
              ></el-input>
            </div>
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
              <!-- <el-button type="primary" @click="edit(scope)">编辑</el-button> -->
              <template>
                <el-popconfirm
                  style="margin-left: 8px"
                  title="确定删除该数据吗？"
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailSection',
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
    }
  },
  props: {
    title: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    dataList: {
      type: Array,
      required: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tableKey: 0,
      list: []
    }
  },
  computed: {
    tableData() {
      return this.list
    },
    tableHead() {
      return this.fields
    }
  },
  mounted() {
    if (this.list.length === 0) {
      const item = this.contactRowFields()
      this.list.push(item)
    }
  },
  methods: {
    reloadData() {
      this.list = [...this.dataList]
      if (this.list.length === 0) {
        const item = this.contactRowFields()
        this.list.push(item)
      }
    },
    submitData(fn) {
      if (fn) {
        const list = this.list.filter(e => {
          return this.fields.some(item => !!e[item.key])
        })
        fn(list)
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    contactRowFields() {
      const ob = {}
      for (const item of this.fields) {
        ob[item.key] = null
      }
      return ob
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    addContactRow() {
      this.list = [...this.list, this.contactRowFields()]
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
    del(scope) {
      this.list.splice(scope.$index, 1)
    }
  }
}
</script>

<style lang="scss">
.table-container {
  margin-top: 10px;
}
</style>
