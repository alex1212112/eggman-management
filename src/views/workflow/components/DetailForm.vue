<template>
  <div class="detail-form">
    <div class="detail-body">
      <el-form
        ref="form"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px;"
        class="box-center"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="工作流名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="temp.type" placeholder="工作流类型" />
        </el-form-item>
      </el-form>
      <detail-section
        key="1"
        ref="section1"
        title="审核人员"
        :fields="reviewFields"
        :data-list="reviewUsersData"
      />
      <detail-section
        key="2"
        ref="section2"
        title="抄送人员"
        :fields="copyFields"
        :data-list="copyUsersData"
        style="margin-top: 40px"
      />
    </div>
  </div>
</template>

<script>
import DetailSection from './DetailSection'
export default {
  name: 'DetailForm',
  components: {
    DetailSection
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      temp: {
        name: '',
        type: ''
      },
      rules: {},
      syncCount: 2,
      review_usrs: null,
      banks: null,
      copy_users: null
    }
  },
  computed: {
    reviewFields() {
      return [
        {
          name: '姓名',
          key: 'user_real_name'
        },
        {
          name: '职位',
          key: 'position'
        },
        {
          name: '工号',
          key: 'user_id'
        },
        {
          name: '操作',
          key: 'operation'
        }
      ]
    },
    copyFields() {
      return [
        {
          name: '姓名',
          key: 'user_real_name'
        },
        {
          name: '职位',
          key: 'position'
        },
        {
          name: '工号',
          key: 'user_id'
        },
        {
          name: '操作',
          key: 'operation'
        }
      ]
    },
    reviewUsersData() {
      return (this.item && this.item.row.review_users) || []
    },
    copyUsersData() {
      return (this.item && this.item.row.copy_users) || []
    }
  },
  methods: {
    reloadData() {
      this.$nextTick(() => {
        this.temp.name = this.item && this.item.row.name
        this.temp.type = this.item && this.item.row.type
        this.$refs['section1'].reloadData()
        this.$refs['section2'].reloadData()
      })
    },
    commitData(fn) {
      const data = {
        name: this.temp.name,
        type: this.temp.type,
        review_users: this.review_users,
        copy_users: this.copy_users
      }
      fn(data)
    },
    submitData(fn) {
      this.count = 2
      this.$refs['section1'].submitData(data => {
        this.review_users = data
        this.count--
        if (this.count === 0) {
          this.commitData(fn)
        }
      })
      this.$refs['section2'].submitData(data => {
        this.copy_users = data
        this.count--
        if (this.count === 0) {
          this.commitData(fn)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.detail-form {
  width: 100%;
  height: calc(100vh - 180px);
  position: relative;
  overflow: auto;
  .detail-body {
    width: 60%;
    margin: 0 auto;
    // overflow: auto;
  }
}
</style>
