<template>
  <div class="app-container">
    <search
      :status-hidden="false"
      :status-list="statusList"
      @search="fetchData"
    />
    <el-row>
      <el-col>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-plus"
          @click="handlerCreate"
        >
          添加抽奖
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
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="奖品图片" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.main_img"
            :fit="'fill'"
          />
        </template>
      </el-table-column>
      <el-table-column label="奖品名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.goods_name }}
        </template>
      </el-table-column>
      <el-table-column label="原价" align="center">
        <template slot-scope="scope">
          {{ scope.row.raw_price }}
        </template>
      </el-table-column>
      <el-table-column label="中奖价" align="center">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="开奖人数" align="center">
        <template slot-scope="scope">
          {{ scope.row.done_count }}
        </template>
      </el-table-column>
      <el-table-column label="中奖人数" align="center">
        <template slot-scope="scope">
          {{ scope.row.select_count }}
        </template>
      </el-table-column>
      <el-table-column label="不中奖人数" align="center">
        <template slot-scope="scope">
          {{ scope.row.no_select_count }}
        </template>
      </el-table-column>
      <el-table-column label="已开期数" align="center">
        <template slot-scope="scope">
          {{ scope.row.access_count + scope.row.fail_count }}/{{ scope.row.repeat }}
        </template>
      </el-table-column>
      <el-table-column label="开奖成功次数" align="center">
        <template slot-scope="scope">
          {{ scope.row.access_count }}
        </template>
      </el-table-column>
      <el-table-column label="开奖失败次数" align="center">
        <template slot-scope="scope">
          {{ scope.row.fail_count }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 1 ? '' : scope.row.status === 2 ? 'success' : scope.row.status === 3 ? 'warning' : 'danger'"
            effect="dark"
          >
            {{ scope.row.status_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上线时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.online_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下线时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.down_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button v-if="scope.row.status === 1" type="primary" size="small" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button v-if="scope.row.status === 2" type="info" size="small" @click="pause(scope.row, scope.$index)">暂停</el-button>
            <el-button v-if="scope.row.status === 3" type="success" size="small" @click="replay(scope.row, scope.$index)">开启</el-button>
            <el-button v-if="scope.row.status === 1" type="success" size="small" @click="online(scope.row, scope.$index)">上线</el-button>
            <el-button v-if="scope.row.status === 2" type="danger" size="small" @click="down(scope.row, scope.$index)">下线</el-button>
            <el-button type="warning" size="small" @click="drawLog(scope.row, scope.$index)">开奖记录</el-button>
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
      :title="dialogStatus === 'create' ? '添加抽奖' : '编辑抽奖'"
      :visible.sync="dialogFormVisible"
      width="80%"
      @close="cancel"
    >
      <el-form
        :model="lucky"
      >
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <div class="box-center">
              <img v-if="lucky.main_img" :src="lucky.main_img" class="avatar">
              <el-button type="success" @click="selectGoods">选择奖品</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="奖品" :label-width="formLabelWidth">
              <el-input v-model="lucky.goods_name" autocomplete="off" style="width: 195px;" />
              <el-input v-model="lucky.goods_id" type="hidden" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="奖品原价" :label-width="formLabelWidth">
              <el-input v-model="lucky.raw_price" autocomplete="off" style="width: 195px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="中奖价格" :label-width="formLabelWidth">
              <el-input v-model="lucky.price" autocomplete="off" style="width: 195px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="开奖人数" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.done_count" autocomplete="off" style="width: 195px;" :min="1" :step="1" :max="10000" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="中奖人数" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.select_count" autocomplete="off" style="width: 195px;" :min="1" :step="1" :max="10000" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="不中奖人数" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.no_select_count" autocomplete="off" style="width: 195px;" :min="1" :step="1" :max="10000" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="参与红包" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.join_red_package" :precision="2" :step="1" :min="0.00" style="width: 195px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拉新红包" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.new_red_package" :precision="2" :step="1" :min="0.00" style="width: 195px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="运费价格" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.shipping_price" :precision="2" :step="1" :min="0.00" style="width: 195px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否包邮" :label-width="formLabelWidth">
              <el-switch
                v-model="lucky.is_free_shipping"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="截止时间（分）" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.minutes" autocomplete="off" style="width: 195px;" :min="1" :step="1" :max="10000" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="重复次数" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.repeat" autocomplete="off" style="width: 195px;" :min="1" :step="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="上线时间" :label-width="formLabelWidth">
              <el-date-picker
                v-model="lucky.online_at"
                type="datetime"
                placeholder="选择上线时间"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
              />
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
        确定要 {{ info }} 吗？
      </span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHintVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="postRequestData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="选择奖品-单击奖品行选择奖品 "
      :visible.sync="dialogSelectGoods"
      class="text-center"
      center
      width="90%"
    >
      <goods
        ref="goodsCom"
        :is-select="true"
        @select="selectRowGoods"
      />
    </el-dialog>

    <el-dialog
      title="开奖记录 "
      :visible.sync="dialogDraw"
      class="text-center"
      center
      width="90%"
      :destroy-on-close="true"
      @close="dialogDraw = false;getList()"
    >
      <draw ref="drawCom" :lucky-id="lucky.id" />
    </el-dialog>
  </div>

</template>

<script>
import { getList, postAdd, putEdit, postOnline, postDown, postPause, postReplay } from '@/api/lucky'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import Goods from '@/views/goods/goods'
import Draw from '@/views/luckyDraw/draw'
import { getToken } from '@/utils/auth'

export default {
  components: { Pagination, Search, Goods, Draw },
  data() {
    return {
      uploadApi: 'https://eggMan.memestech.com.cn/admin/v1/upload',
      statusList: [{ id: 0, name: '全部' }, { id: 1, name: '待上线' }, { id: 2, name: '进行中' }, { id: 3, name: '已暂停' }, { id: 4, name: '已下线' }],
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
        end_time: ''
      },
      options: null,
      sellers: null,
      dialogTableVisible: false,
      dialogDraw: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogVisible: false,
      dialogSelectGoods: false,
      info: '',
      funName: '',
      dialogStatus: 'create',
      lucky: {
        goods: {},
        goods_id: '',
        raw_price: '0.00',
        price: '0.00',
        done_count: 0,
        select_count: 0,
        no_select_count: 0,
        join_red_package: '0.00',
        new_red_package: '0.00',
        minutes: 0,
        repeat: 0,
        online_at: '',
        access_count: 0,
        fail_count: 0,
        is_free_shipping: 1,
        shipping_price: '6.00'
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
      this.lucky = {
        goods_name: '',
        main_img: '',
        goods_id: '',
        raw_price: '0.00',
        price: '0.00',
        done_count: 0,
        select_count: 0,
        no_select_count: 0,
        join_red_package: '0.00',
        new_red_package: '0.00',
        minutes: 0,
        repeat: 0,
        online_at: '',
        is_free_shipping: 1,
        shipping_price: '6.00'
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    createData() {
      postAdd(this.lucky).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    edit(item, _index) {
      console.log(item, _index)
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.lucky = item
    },
    online(item, _index) {
      this.dialogHintVisible = true
      this.lucky = item
      this.info = '上线'
      this.funName = 'onlineData'
    },
    down(item, _index) {
      this.dialogHintVisible = true
      this.lucky = item
      this.info = '下线'
      this.funName = 'downData'
    },
    pause(item, _index) {
      this.dialogHintVisible = true
      this.lucky = item
      this.info = '暂停'
      this.funName = 'pauseData'
    },
    replay(item, _index) {
      this.dialogHintVisible = true
      this.lucky = item
      this.info = '开启'
      this.funName = 'replayData'
    },
    postRequestData() {
      if (this.funName === 'onlineData') {
        postOnline(this.lucky).then(res => {
          if (res.code === 200) {
            this.dialogHintVisible = false
            this.getList()
          }
        })
      } else if (this.funName === 'downData') {
        postDown(this.lucky).then(res => {
          if (res.code === 200) {
            this.dialogHintVisible = false
            this.getList()
          }
        })
      } else if (this.funName === 'pauseData') {
        postPause(this.lucky).then(res => {
          if (res.code === 200) {
            this.dialogHintVisible = false
            this.getList()
          }
        })
      } else if (this.funName === 'replayData') {
        postReplay(this.lucky).then(res => {
          if (res.code === 200) {
            this.dialogHintVisible = false
            this.getList()
          }
        })
      }
    },
    updateData() {
      putEdit(this.lucky).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
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
    selectGoods() {
      this.dialogSelectGoods = true
      this.$nextTick(() => {
        this.$refs.goodsCom.loadData()
      })
    },
    selectRowGoods(row) {
      console.log(row)
      this.lucky.main_img = row.main_img
      this.lucky.goods_name = row.name
      this.lucky.goods_id = row.id
      this.lucky.raw_price = row.raw_price
      this.lucky.price = row.price
      this.dialogSelectGoods = false
    },
    drawLog(row) {
      this.dialogDraw = true
      this.lucky = row
      this.$nextTick(() => {
        this.$refs.drawCom.loadData(row.id)
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
