<template>
  <div class="app-container">
    <search
      :status-hidden="true"
      :export-hidden="true"
      :export-model="'eggs'"
      @search="fetchData"
    />
    <el-row>
      <el-col>
        <el-button
          v-if="!isSelect"
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-plus"
          @click="handlerCreate"
        >
          添加区域代理
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @current-change="selectCurrentRow"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="用户ID">
        <template slot-scope="scope">
          {{ scope.row.user_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像" width="95">
        <template slot-scope="scope">
          <el-avatar :size="50" :src="scope.row.user.avatar" />
        </template>
      </el-table-column>
      <el-table-column label="用户手机">
        <template slot-scope="scope">
          {{ scope.row.user.phone }}
        </template>
      </el-table-column>
      <el-table-column label="省">
        <template slot-scope="scope">
          {{ scope.row.province }}
        </template>
      </el-table-column>
      <el-table-column label="市">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="区/县">
        <template slot-scope="scope">
          {{ scope.row.district }}
        </template>
      </el-table-column>
      <el-table-column label="代理等级">
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? '区/县级代理' : scope.row.level === 2 ? '市级代理' : '省级代理' }}
        </template>
      </el-table-column>
      <el-table-column label="分红比例">
        <template slot-scope="scope">
          {{ scope.row.ratio }}%
        </template>
      </el-table-column>
      <el-table-column label="绑定用户数">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="累计参与次数">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <!--<el-table-column class-name="status-col" label="状态" width="110" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isSelect" align="center" label="操作" width="200">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="primary" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button type="danger" @click="del(scope.row, scope.$index)">删除</el-button>
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
      :title="dialogStatus === 'create' ? '添加区域代理' : '编辑区域代理'"
      :visible.sync="dialogFormVisible"
      width="80%"
      @close="cancel"
    >
      <el-form
        :model="agent"
      >
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="选择用户" :label-width="formLabelWidth">
              <el-button type="success" @click="selectUser">选择用户</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="用户ID" :label-width="formLabelWidth">
              <el-input v-model="agent.user_id" autocomplete="off" style="width: 250px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="选择区域" :label-width="formLabelWidth">
              <el-cascader v-model="agent.adCodes" :props="{ checkStrictly: true }" :options="provinceOptions" placeholder="请选择地址" style="width: 250px;" @change="selectAddress" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="代理类型" :label-width="formLabelWidth">
              <el-radio-group v-model="agent.level" @change="setRatio">
                <el-radio :label="1">区/县级代理</el-radio>
                <el-radio :label="2">市级代理</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="区域分红(%)" :label-width="formLabelWidth">
              <el-input-number v-model="agent.ratio" :precision="3" :step="0.1" :min="0" style="width: 250px;" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
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
        此操作会直接删除区域代理，可能会产生数据关联错误，确定删除吗？
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

    <el-dialog
      title="选择用户-单击用户行选择用户 "
      :visible.sync="dialogSelectUser"
      class="text-center"
      center
      width="90%"
    >
      <user
        ref="userCom"
        :is-select="true"
        @select="selectRowUser"
      />
    </el-dialog>
  </div>

</template>

<script>
import { getList, postAdd, putEdit, delItem } from '@/api/agent'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import { getToken } from '@/utils/auth'
import User from '@/views/user/user'
import area from '@/area'

export default {
  components: { Pagination, Search, User },
  props: {
    isSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadApi: 'https://api.caidan888.com/admin/v1/upload',
      switchLoading: true,
      selectRow: {},
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        search_value: '',
        status: null,
        start_time: '',
        end_time: ''
      },
      options: null,
      sellers: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogVisible: false,
      dialogDetailLuckyTwo: false,
      dialogSelectUser: false,
      dialogStatus: 'create',
      agent: {
        id: 0,
        user_id: 0,
        province: '',
        province_code: 0,
        city: '',
        city_code: 0,
        district: '',
        district_code: 0,
        level: 0,
        ratio: '0.000',
        adCodes: []
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
    },
    areaOptions() {
      return {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const nodes = []
          let childList = {}
          if (node.level === 1) {
            childList = area.city_list
          } else if (node.level === 2) {
            childList = area.county_list
          }
          Object.keys(childList).forEach((key) => {
            if (node.level === 1) {
              if (key.substring(0, 2) === node.value.substring(0, 2)) {
                nodes.push({
                  value: key,
                  label: childList[key],
                  leaf: node.level >= 2
                })
              }
            } else if (node.level === 2) {
              if (key.substring(0, 4) === node.value.substring(0, 4)) {
                nodes.push({
                  value: key,
                  label: childList[key],
                  leaf: node.level >= 2
                })
              }
            }
          })
          // 通过调用resolve将子节点数据返回，通知组件数据加载完成
          resolve(nodes)
        }
      }
    },
    provinceOptions() {
      const opt = []
      Object.keys(area.province_list).forEach((key) => {
        const cityList = []
        Object.keys(area.city_list).forEach((city) => {
          if (city.substring(0, 2) === key.substring(0, 2)) {
            const countyList = []
            Object.keys(area.county_list).forEach((county) => {
              if (county.substring(0, 4) === city.substring(0, 4)) {
                countyList.push({
                  // value: { level: 3, name: area.county_list[county], code: county },
                  value: county,
                  label: area.county_list[county]
                })
              }
            })
            cityList.push({
              // value: { level: 2, name: area.city_list[city], code: city },
              value: city,
              label: area.city_list[city],
              children: countyList
            })
          }
        })
        opt.push({
          // value: { level: 1, name: area.province_list[key], code: key },
          value: key,
          label: area.province_list[key],
          children: cityList
        })
      })
      return opt
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
    // switchUp(id) {
    //   this.switchLoading = true
    //   upCheck({ id: id }).then(res => {
    //     this.switchLoading = false
    //   })
    // },
    cancel() {
      this.dialogFormVisible = false
      this.getList()
    },
    fetchData(query) {
      this.listQuery = Object.assign(this.listQuery, query)
      console.log(this.listQuery)
      this.getList()
    },
    handlerCreate() {
      this.agent = {
        id: 0,
        user_id: 0,
        province: '',
        province_code: 0,
        city: '',
        city_code: 0,
        district: '',
        district_code: 0,
        level: 0,
        ratio: '0.000',
        adCodes: []
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    createData() {
      postAdd(this.agent).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    edit(item, _index) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'

      this.agent = item
      // this.agent.adCodes = [
      //   { level: 1, name: item.province, code: item.province_code.toString() },
      //   { level: 2, name: item.city, code: item.city_code.toString() },
      //   { level: 3, name: item.district, code: item.district_code.toString() }
      // ]
      this.agent.adCodes = [item.province_code.toString()]
      if (item.city_code !== 0) {
        this.agent.adCodes.push(item.city_code.toString())
      }
      if (item.district_code !== 0) {
        this.agent.adCodes.push(item.district_code.toString())
      }
      console.log(this.agent, _index)
    },
    del(item, _index) {
      this.dialogHintVisible = true
      this.agent = item
    },
    updateData() {
      putEdit(this.agent).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    delData() {
      delItem(this.agent).then(res => {
        if (res.code === 200) {
          this.dialogHintVisible = false
          this.getList()
        }
      })
    },
    handleAvatarSuccess(res) {
      this.$loading().close()
      console.log(res)
      this.goods.main_img = res.data.url
      this.goods.main_upload_id = res.data.id
    },
    handleChange(val) {
      this.goods.category_id = val
    },
    imgArrAdd(res, file) {
      if (res.code === 200) {
        this.goods.introduction_imgs.push({ upload_id: res.data.id, url: res.data.url })
      }
      console.log(file)
      console.log(this.goods.introduction_imgs)
    },
    imgArrAddInfo(res, file) {
      if (res.code === 200) {
        this.goods.info_imgs.push({ upload_id: res.data.id, url: res.data.url })
      }
      console.log(file)
      console.log(this.goods.info_imgs)
    },
    imgArrRemove(file) {
      console.log(file)
      this.goods.introduction_imgs = this.goods.introduction_imgs.filter(ele => {
        return file.upload_id !== ele.upload_id
      })
      console.log(this.goods.introduction_imgs)
    },
    imgArrRemoveInfo(file) {
      console.log(file)
      this.goods.info_imgs = this.goods.info_imgs.filter(ele => {
        return file.upload_id !== ele.upload_id
      })
      console.log(this.goods.info_imgs)
    },
    selectCurrentRow(row) {
      this.$emit('select', row)
    },
    selectRowUser(row) {
      console.log(row)
      this.agent.user_id = row.id
      this.dialogSelectUser = false
    },
    loadData() {
      this.getList()
    },
    selectUser() {
      this.dialogSelectUser = true
      this.$nextTick(() => {
        this.$refs.userCom.loadData()
      })
    },
    setRatio(label) {
      if (label === 1) {
        this.agent.ratio = '0.375'
      } else {
        this.agent.ratio = '0.125'
      }
    },
    selectAddress(item) {
      const code = item[item.length - 1]
      if (item.length === 1) {
        this.agent.province_code = code
        this.agent.province = area.province_list[code]
        this.agent.city_code = ''
        this.agent.city = ''
        this.agent.district_code = ''
        this.agent.district = ''
      } else if (item.length === 2) {
        this.agent.province_code = code.substring(0, 2) + '0000'
        this.agent.province = area.province_list[code.substring(0, 2) + '0000']
        this.agent.city_code = code
        this.agent.city = area.city_list[code]
        this.agent.district_code = ''
        this.agent.district = ''
      } else if (item.length === 3) {
        this.agent.province_code = code.substring(0, 2) + '0000'
        this.agent.province = area.province_list[code.substring(0, 2) + '0000']
        this.agent.city_code = code.substring(0, 4) + '00'
        this.agent.city = area.city_list[code.substring(0, 4) + '00']
        this.agent.district_code = code
        this.agent.district = area.county_list[code]
      }
      console.log(this.agent)
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
