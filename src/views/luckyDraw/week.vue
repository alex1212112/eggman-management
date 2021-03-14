<template>
  <div class="app-container">
    <search
      :status-hidden="false"
      :status-list="statusList"
      :export-hidden="false"
      :export-model="'lucky'"
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
      <!--      <el-table-column label="奖品图片" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-image-->
      <!--            style="width: 50px; height: 50px"-->
      <!--            :src="scope.row.main_img"-->
      <!--            :fit="'fill'"-->
      <!--          />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="抽奖名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="特等奖红包" align="center">
        <template slot-scope="scope">
          {{ scope.row.fest_bonus }}
        </template>
      </el-table-column>
      <el-table-column label="一等奖红包" align="center">
        <template slot-scope="scope">
          {{ scope.row.first_bonus }}
        </template>
      </el-table-column>
      <el-table-column label="二等奖奖品名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.second_goods.name }}
        </template>
      </el-table-column>
      <el-table-column label="三等奖奖品名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.third_goods.name }}
        </template>
      </el-table-column>
      <el-table-column label="保证金" align="center">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="抽奖人数" align="center">
        <template slot-scope="scope">
          {{ scope.row.fest_count }}/{{ scope.row.first_count }}/{{ scope.row.second_count }}/{{ scope.row.third_count }}
        </template>
      </el-table-column>
      <el-table-column label="已开次数" align="center">
        <template slot-scope="scope">
          {{ scope.row.repeat - scope.row.surplus_repeat }}/{{ scope.row.repeat }}
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
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="primary" size="small" @click="copyInfo(scope.row, scope.$index)">复制信息</el-button>
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
      :title="dialogStatus === 'create' ? '添加抽奖' : dialogStatus === 'copy' ? '复制抽奖' : '编辑抽奖'"
      :visible.sync="dialogFormVisible"
      width="80%"
      @close="cancel"
    >
      <el-form
        :model="lucky"
      >
        <!--        <el-row style="margin-bottom: 20px">-->
        <!--          <el-col :span="24">-->
        <!--            <div class="box-center">-->
        <!--              <el-upload-->
        <!--                ref="upload"-->
        <!--                :action="uploadApi"-->
        <!--                class="avatar-uploader tex-center"-->
        <!--                name="file"-->
        <!--                :show-file-list="false"-->
        <!--                :on-success="handleAvatarSuccess"-->
        <!--                :headers="headers"-->
        <!--              >-->
        <!--                <img v-if="lucky.lucky_img" :src="lucky.lucky_img" class="avatar" style="width: 345px;height:175px;">-->
        <!--                <i v-else class="el-icon-plus avatar-uploader-icon" />-->
        <!--              </el-upload>-->
        <!--              <div class="text-center" style="margin-top:10px">-->
        <!--                上传抽奖封面图(像素:690 x 350)-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--        <el-row style="margin-bottom: 20px">-->
        <!--          <el-col :span="24">-->
        <!--            <div class="box-center">-->
        <!--              <el-upload-->
        <!--                ref="upload"-->
        <!--                :action="uploadApi"-->
        <!--                class="avatar-uploader tex-center"-->
        <!--                name="file"-->
        <!--                :show-file-list="false"-->
        <!--                :on-success="shareUploadAccess"-->
        <!--                :headers="headers"-->
        <!--              >-->
        <!--                <img v-if="lucky.share_img" :src="lucky.share_img" class="avatar" style="width: 375px;height:300px;">-->
        <!--                <i v-else class="el-icon-plus avatar-uploader-icon" />-->
        <!--              </el-upload>-->
        <!--              <div class="text-center" style="margin-top:10px">-->
        <!--                上传抽奖分享图(像素:750 x 600)-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="抽奖名称" :label-width="formLabelWidth">
              <el-input v-model="lucky.name" autocomplete="off" style="width: 195px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="保证金" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.amount" autocomplete="off" style="width: 195px;" :min="0" :step="1" :precision="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">特等奖设置</el-divider>
        <el-row style="margin-top: 20px">
          <el-col :span="24">
            <el-form-item label="特等奖中奖人数" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.fest_count" autocomplete="off" style="width: 195px;" :min="0" :step="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="特等奖现金红包" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.fest_bonus" autocomplete="off" style="width: 195px;" :min="0" :step="1" :precision="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">一等奖设置</el-divider>
        <el-row style="margin-top: 20px">
          <el-col :span="24">
            <el-form-item label="一等奖中奖人数" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.first_count" autocomplete="off" style="width: 195px;" :min="0" :step="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="一等奖现金红包" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.first_bonus" autocomplete="off" style="width: 195px;" :min="0" :step="1" :precision="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">二等奖设置</el-divider>
        <el-row style="margin-top: 20px">
          <el-col :span="24">
            <el-form-item label="二等奖中奖人数" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.second_count" autocomplete="off" style="width: 195px;" :min="0" :step="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="二等奖中奖价" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.second_price" autocomplete="off" style="width: 195px;" :min="0" :step="1" :precision="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <!--              <img v-if="lucky.main_img" :src="lucky.main_img" class="avatar">-->
            <el-button type="success" @click="selectGoods">选择奖品</el-button>
          </el-col>
        </el-row>
        <el-row v-if="lucky.second_goods.id" style="margin-bottom: 20px">
          <el-col :span="24">
            <el-tag type="">{{ lucky.second_goods.name }}</el-tag>
            <el-tag type="success">{{ lucky.second_goods.price }}</el-tag>
            <el-tag type="danger">{{ lucky.second_goods.low_price }}</el-tag>
          </el-col>
        </el-row>
        <el-divider content-position="center">三等奖设置</el-divider>
        <el-row style="margin-top: 20px">
          <el-col :span="24">
            <el-form-item label="三等奖中奖人数" :label-width="formLabelWidth">
              <el-input-number v-model="lucky.third_count" autocomplete="off" style="width: 195px;" :min="0" :step="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="三等奖中奖价" :label-width="formLabelWidth">
              <el-input-number v-model="thirdPrice" disabled autocomplete="off" style="width: 195px;" :min="0" :step="1" :precision="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <!--              <img v-if="lucky.main_img" :src="lucky.main_img" class="avatar">-->
            <el-button type="success" @click="selectGoodsThird">选择奖品</el-button>
          </el-col>
        </el-row>
        <el-row v-if="lucky.third_goods.id" style="margin-bottom: 20px">
          <el-col :span="24">
            <el-tag type="">{{ lucky.third_goods.name }}</el-tag>
            <el-tag type="success">{{ lucky.third_goods.price }}</el-tag>
            <el-tag type="danger">{{ lucky.third_goods.low_price }}</el-tag>
          </el-col>
        </el-row>
        <el-divider content-position="center">基础设置</el-divider>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="抽奖轮数" :label-width="formLabelWidth">
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
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="抽奖介绍" :label-width="formLabelWidth">
              <el-input v-model="lucky.desc" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'update' ? updateData() : createData()">确 定</el-button>
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
      title="选择奖品-单击奖品行选择二等奖奖品 "
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
      title="选择奖品-单击奖品行选择三等奖奖品 "
      :visible.sync="dialogSelectGoodsThird"
      class="text-center"
      center
      width="90%"
    >
      <goods
        ref="goodsCom3"
        :is-select="true"
        @select="selectRowGoodsThird"
      />
    </el-dialog>

    <el-dialog
      title="选择彩蛋-单击彩蛋行选择彩蛋 "
      :visible.sync="dialogSelectEggs"
      class="text-center"
      center
      width="90%"
    >
      <eggs
        ref="eggsCom"
        :is-select="true"
        @select="selectRowEggs"
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
import { getList, postAdd, putEdit, postOnline, postDown, postPause, postReplay } from '@/api/week'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import Goods from '@/views/goods/goods'
import Eggs from '@/views/egg/eggs'
import Draw from '@/views/luckyDraw/draw'
import { getToken } from '@/utils/auth'

export default {
  name: 'ManageTwo',
  components: { Pagination, Search, Goods, Draw, Eggs },
  props: {
    isSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadApi: 'https://api.caidan888.com/admin/v1/upload',
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
        end_time: '',
        sort: 'desc'
      },
      options: null,
      sellers: null,
      dialogTableVisible: false,
      dialogDraw: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogVisible: false,
      dialogSelectGoods: false,
      dialogSelectEggs: false,
      dialogSelectGoodsThird: false,
      info: '',
      funName: '',
      dialogStatus: 'create',
      lucky: {
        name: '',
        amount: '0.00',
        fest_count: 0,
        fest_bonus: '0.00',
        first_count: 0,
        first_bonus: '0.00',
        second_count: 0,
        second_price: '0.00',
        second_goods_id: 0,
        second_goods: {},
        third_count: 0,
        third_price: '0.00',
        third_goods_id: 0,
        third_goods: {},
        repeat: 0,
        online_at: '',
        desc: ''
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
    thirdPrice: {
      get: function() {
        return this.lucky.amount
      },
      set: function() {}
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    getList(eggs_id = 0) {
      this.listLoading = true
      if (eggs_id) {
        Object.assign(this.listQuery, { eggs_id: eggs_id })
      }
      console.log(this.listQuery)
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
        name: '',
        amount: '0.00',
        fest_count: 0,
        fest_bonus: '0.00',
        first_count: 0,
        first_bonus: '0.00',
        second_count: 0,
        second_price: '0.00',
        second_goods_id: 0,
        second_goods: {},
        third_count: 0,
        third_price: '0.00',
        third_goods_id: 0,
        third_goods: {},
        repeat: 0,
        online_at: '',
        desc: ''
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    createData() {
      this.lucky.third_price = this.lucky.amount
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
    copyInfo(item, _index) {
      this.dialogFormVisible = true
      this.dialogStatus = 'copy'
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
      this.lucky.third_price = this.lucky.amount
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
      this.lucky.lucky_img = res.data.url
      this.lucky.lucky_img_id = res.data.id
    },
    shareUploadAccess(res) {
      this.$loading().close()
      console.log(res)
      this.lucky.share_img = res.data.url
      this.lucky.share_img_id = res.data.id
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
    selectGoodsThird() {
      this.dialogSelectGoodsThird = true
      this.$nextTick(() => {
        this.$refs.goodsCom3.loadData()
      })
    },
    selectEggs() {
      this.dialogSelectEggs = true
      this.$nextTick(() => {
        this.$refs.eggsCom.loadData()
      })
    },
    selectRowGoods(row) {
      console.log(row)
      this.lucky.second_goods = row
      this.lucky.second_goods_id = row.id
      this.dialogSelectGoods = false
    },
    selectRowGoodsThird(row) {
      console.log(row)
      this.lucky.third_goods = row
      this.lucky.third_goods_id = row.id
      this.dialogSelectGoodsThird = false
    },
    selectRowEggs(row) {
      console.log(row)
      this.lucky.eggs = row
      this.lucky.eggs_id = row.id
      this.dialogSelectEggs = false
    },
    drawLog(row) {
      this.dialogDraw = true
      this.lucky = row
      this.$nextTick(() => {
        this.$refs.drawCom.loadData(row.id)
      })
    },
    pickTimeParts() {
      console.log(this.lucky.time_parts)
    },
    addTimeParts() {
      this.lucky.time_parts.push({ part: ['', ''] })
    },
    subTimeParts(index) {
      console.log(index)
      this.lucky.time_parts.splice(index, 1)
      console.log(this.lucky.time_parts)
    },
    loadData(eggs_id) {
      console.log(eggs_id)
      this.getList(eggs_id)
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
