<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tree
        ref="tree"
        v-loading="loading"
        :data="data"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
        :props="defaultProps"
        @node-contextmenu="showOperation"
        @check="needParentGet"
      />
    </div>

    <div class="buttons">
      <el-button type="primary" @click="addCategory">添加分类</el-button>
      <el-button :disabled="editDisable" @click="editCategory">编辑分类</el-button>
      <el-button type="danger" @click="deleteCategory">删除分类</el-button>
    </div>

    <el-dialog
      :title="dialogStatus === 'create' ? '添加分类' : '编辑分类'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="category"
      >
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="category.name" autocomplete="off" />
        </el-form-item>
        <!--<el-form-item label="商户LOGO" :label-width="formLabelWidth">-->
        <!--<el-input v-model="seller.logo" autocomplete="off"></el-input>-->
        <!--</el-form-item>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false; getList()">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提醒 "
      :visible.sync="dialogHintVisible"
      class="text-center"
      center
      width="30%"
    >
      <span class="text-center">
        此操作会直接删除分类，可能造成数据不匹配，确定删除吗？
      </span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHintVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="delData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList, putEdit, delItem, postAdd
} from '@/api/mallCategory'

// const calendarTypeOptions = [
//   { key: 'CN', display_name: 'China' },
//   { key: 'US', display_name: 'USA' },
//   { key: 'JP', display_name: 'Japan' },
//   { key: 'EU', display_name: 'Eurozone' }
// ]

// // arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  data() {
    return {
      data: [],
      loading: false,
      dialogStatus: 'create',
      dialogFormVisible: false,
      dialogHintVisible: false,
      formLabelWidth: '120px',
      editDisable: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      category: {
        id: '',
        name: '',
        parent_id: 0
      },
      needParentId: 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    addCategory() {
      console.log(this.needParentId)
      this.category = {}
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    editCategory() {
      console.log(this.needParentId)
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
    },
    deleteCategory() {
      this.dialogHintVisible = true
    },
    getList() {
      this.loading = true
      this.needParentId = 0
      getList().then(res => {
        console.log(res)
        this.data = res.data
        this.loading = false
      })
    },
    showOperation(evn, row, node, comp) {
      console.log(row, node, comp)
    },
    needParentGet(item, check) {
      if (check.checkedNodes.length > 0) {
        this.needParentId = item.id
        this.category = item
        this.editDisable = false
      } else {
        this.needParentId = 0
        this.editDisable = true
      }
    },
    createData() {
      this.category.parent_id = this.needParentId
      postAdd(this.category).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    updateData() {
      putEdit(this.category).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    delData() {
      delItem(this.category).then(res => {
        if (res.code === 200) {
          this.dialogHintVisible = false
          this.getList()
        }
      })
    }
  }
}
</script>
