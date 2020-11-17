<template>
  <div class="detail-form">
    <div class="detail-body">
      <el-form
        ref="form"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px;"
        class="box-center"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="合同名称" />
        </el-form-item>
        <el-form-item label="编号" prop="contract_no">
          <el-input v-model="temp.contract_no" placeholder="合同编号" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" @change="handleTypeFilter">
            <el-option
              v-for="i in typeOptions"
              :key="i.key"
              :label="i.label"
              :value="i.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" @change="handleStatusFilter">
            <el-option
              v-for="i in statusOptions"
              :key="i.key"
              :label="i.label"
              :value="i.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分包商" prop="subcontractor_name">
          <!-- <el-input
            v-model="temp.subcontractor_id"
            placeholder="输入分包商关键字"
          /> -->
          <el-autocomplete
            v-model="temp.subcontractor_name"
            class="inline-input"
            :fetch-suggestions="querySearchSubcontractor"
            placeholder="输入分包商关键字"
            :trigger-on-focus="false"
            @select="handleSelectSubcontractor"
          />
        </el-form-item>
        <el-form-item label="项目" prop="project_id">
          <el-input v-model="temp.project_id" placeholder="合同项目" />
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="temp.amount" placeholder="合同金额" />
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="temp.desc" placeholder="合同备注" />
        </el-form-item>
        <el-form-item label="电子版(未盖章)" prop="init_id">
          <!-- <el-input v-model="temp.init_id" placeholder="合同电子版" /> -->
          <el-upload
            action="https://pms.memestech.com.cn/api/v1/upload"
            :on-change="fileDocChanged"
            :file-list="fileListDoc"
            :on-success="fileDocUploadSuccess"
            :multiple="false"
            :headers="headers"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="正式版(已盖章)" prop="archive_id">
          <el-upload
            action="https://pms.memestech.com.cn/api/v1/upload"
            :on-change="filePaperChanged"
            :file-list="fileListPaper"
            :on-success="filePaperUploadSuccess"
            :multiple="false"
            :headers="headers"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <detail-section
        key="1"
        ref="section1"
        title="收付款计划"
        :fields="reviewFields"
        :data-list="reviewUsersData"
      />
    </div>
  </div>
</template>

<script>
import DetailSection from './DetailSection'
import { fetchAll as fetchAllSubcontractor } from '@/api/subcontractor'
import { getToken } from '@/utils/auth'

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
        type: '',
        status: '',
        subcontractor_id: '',
        subcontractor_name: '',
        init_id: '',
        archive_id: ''
      },
      rules: {},
      syncCount: 2,
      review_usrs: null,
      banks: null,
      copy_users: null,
      listSubcontractor: [],
      typeOptions: [
        {
          key: '1',
          label: '项目合同'
        },
        {
          key: '2',
          label: '分包合同'
        }
      ],
      statusOptions: [
        {
          key: '1',
          label: '已开合同'
        },
        {
          key: '4',
          label: '已归档'
        }
      ],
      fileListDoc: [],
      fileListPaper: []
    }
  },
  computed: {
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`
      }
    },
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
        this.temp.subcontractor_id = this.item && this.item.row.subcontractor_id
        this.$refs['section1'].reloadData()
      })
    },
    commitData(fn) {
      const data = {
        name: this.temp.name,
        type: this.temp.type,
        subcontractor_id: this.temp.subcontractor_id,
        archive_id: this.temp.archive_id,
        init_id: this.temp.init_id,
        review_users: this.review_users,
        copy_users: this.copy_users
      }
      fn(data)
    },
    submitData(fn) {
      this.count = 1
      this.$refs['section1'].submitData(data => {
        this.review_users = data
        this.count--
        if (this.count === 0) {
          this.commitData(fn)
        }
      })
    },
    querySearchSubcontractor(queryString, cb) {
      const params = { search_value: queryString }
      fetchAllSubcontractor(params)
        .then(res => {
          if (!res) {
            cb([])
            return
          }
          if (res.data) {
            const list = res.data.filter(e => {
              e.value = e.name
              return e
            })
            cb(list)
            return
          }
          cb([])
        })
        .catch(e => {})
    },
    handleSelectSubcontractor(e) {
      this.temp.subcontractor_id = e.id
      this.temp.subcontractor_name = e.name
    },
    handleTypeFilter(item) {},
    fileDocChanged(file, fileList) {},
    filePaperChanged(file, fileList) {},
    fileDocUploadSuccess(response, file, fileList) {
      this.temp.init_id = response.data.id
      this.fileListDoc = [file]
    },
    filePaperUploadSuccess(response, file, fileList) {
      this.temp.archive_id = response.data.id
      this.fileListPaper = [file]
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
  .el-autocomplete {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
</style>
