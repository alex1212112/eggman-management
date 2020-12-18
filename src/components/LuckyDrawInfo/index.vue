<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card class="box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix" style="text-align: center">
            <el-tag type="danger" effect="dark">抽奖信息</el-tag>
          </div>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="抽奖 ID">
              <span>{{ lucky_draw.lucky && lucky_draw.lucky_id }}</span>
            </el-form-item>
            <el-form-item label="每期时间">
              <span>{{ lucky_draw.lucky && lucky_draw.lucky.minutes }} 分钟</span>
            </el-form-item>
            <el-form-item label="重复期数">
              <span>{{ lucky_draw.lucky && lucky_draw.lucky.repeat }} 期</span>
            </el-form-item>
            <el-form-item label="开奖人数">
              <span>{{ lucky_draw.lucky && lucky_draw.lucky.done_count }}</span>
            </el-form-item>
            <el-form-item label="中奖人数">
              <span>{{ lucky_draw.lucky && lucky_draw.lucky.select_count }}</span>
            </el-form-item>
            <el-form-item label="未中奖人数">
              <span>{{ lucky_draw.lucky && lucky_draw.lucky.no_select_count }}</span>
            </el-form-item>
            <el-form-item label="参与红包">
              <span>{{ lucky_draw.lucky && lucky_draw.lucky.join_red_package }}</span>
            </el-form-item>
            <el-form-item label="拉新红包">
              <span>{{ lucky_draw.lucky && lucky_draw.lucky.new_red_package }}</span>
            </el-form-item>
            <el-form-item label="上线时间">
              <span>{{ lucky_draw.lucky && lucky_draw.lucky.online_at }}</span>
            </el-form-item>
            <el-form-item label="下线时间">
              <span>{{ lucky_draw.lucky.down_at === null ? '未下线' : lucky_draw.lucky.down_at }}</span>
            </el-form-item>
            <el-form-item label="抽奖状态">
              <span>{{ lucky_draw.lucky.status === 1 ? '待上线' : lucky_draw.lucky.status === 2 ? '进行中' : lucky_draw.lucky.status === 3 ? '已暂停' : lucky_draw.lucky.status === 4 ? '已下线' : '' }}</span>
            </el-form-item>
            <el-form-item label="商品名称">
              <span>{{ lucky_draw.goods.name }}</span>
            </el-form-item>
            <el-form-item label="中奖价">
              <span>{{ lucky_draw.lucky.price }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-card class="box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix" style="text-align: center">
            <el-tag type="danger" effect="dark">开奖信息</el-tag>
          </div>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="开奖 ID">
              <span>{{ lucky_draw.id }}</span>
            </el-form-item>
            <el-form-item label="开始时间">
              <span>{{ lucky_draw.begin_at }}</span>
            </el-form-item>
            <el-form-item label="失败时间">
              <span>{{ lucky_draw.end_at }}</span>
            </el-form-item>
            <el-form-item label="开奖时间">
              <span>{{ lucky_draw.open_at === null ? '未开奖' : lucky_draw.open_at }}</span>
            </el-form-item>
            <el-form-item label="开奖状态">
              <span>{{ lucky_draw.status === 1 ? '进行中' : lucky_draw.status === 2 ? '开奖中' : lucky_draw.status === 3 ? '开奖成功' : lucky_draw.status === 4 ? '开奖失败' : '' }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-card class="box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix" style="text-align: center">
            <el-tag type="danger" effect="dark">中奖信息</el-tag>
          </div>
          <el-table
            v-loading="selectListLoading"
            :data="selectList"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="头像" width="95">
              <template slot-scope="scope">
                <el-avatar :size="50" :src="scope.row.user.avatar" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="用户信息">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.user.nickname }}</el-tag><el-tag type="info">{{ scope.row.user.phone }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="不中奖权重" width="95">
              <template slot-scope="scope">
                {{ scope.row.not_hit_weight }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="物流订单">
              <template slot-scope="scope">
                订单状态 : {{ scope.row.express_order.status === 1 ? '待发货' : scope.row.express_order.status === 2 ? '待收货' : scope.row.express_order.status === 3 ? '已签收' : scope.row.express_order.status === 4 ? '已放弃' : scope.row.express_order.status === 5 ? '未完善' : '' }}<br>
                订单编号 : {{ scope.row.express_order.order_no }}<br>
                物流信息 : {{ scope.row.express_order.express_name }} - {{ scope.row.express_order.express_no }}<br>
                收货地址 : {{ scope.row.express_order.province }}{{ scope.row.express_order.city }}{{ scope.row.express_order.county }}{{ scope.row.express_order.detail_address }}<br>
                收货信息 : {{ scope.row.express_order.consignee }} | {{ scope.row.express_order.phone }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="订单时间">
              <template slot-scope="scope">
                {{ scope.row.express_order.created_at }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <div class="operation-buttons">
                  <el-button type="warning" size="small" @click="userInfo(scope.row, scope.$index)">查看用户信息</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-card class="box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix" style="text-align: center">
            <el-tag type="danger" effect="dark">未中奖信息</el-tag>
          </div>
          <el-table
            v-loading="noSelectListLoading"
            :data="noSelectList"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="头像" width="95">
              <template slot-scope="scope">
                <el-avatar :size="50" :src="scope.row.user.avatar" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="用户信息">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.user.nickname }}</el-tag><el-tag type="info">{{ scope.row.user.phone }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="不中奖权重" width="95">
              <template slot-scope="scope">
                {{ scope.row.not_hit_weight }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="退款余额">
              <template slot-scope="scope">
                {{ scope.row.lucky.price }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="参与红包">
              <template slot-scope="scope">
                {{ scope.row.join_red_package }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <div class="operation-buttons">
                  <el-button type="warning" size="small" @click="userInfo(scope.row, scope.$index)">用户详情</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-card class="box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix" style="text-align: center">
            <el-tag type="danger" effect="dark">参与人员</el-tag>
          </div>
          <el-table
            v-loading="noSelectListLoading"
            :data="otherList"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="头像" width="95">
              <template slot-scope="scope">
                <el-avatar :size="50" :src="scope.row.user.avatar" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="用户信息">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.user.nickname }}</el-tag><el-tag type="info">{{ scope.row.user.phone }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <div class="operation-buttons">
                  <el-button type="warning" size="small" @click="userInfo(scope.row, scope.$index)">用户详情</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="查看详情 "
      :visible.sync="dialogUserInfo"
      class="text-center"
      center
      width="90%"
      :destroy-on-close="true"
      @close="dialogUserInfo = false;fetchData()"
    >
      <user-info ref="userInfoCom" :user-id="user_id" />
    </el-dialog>
  </div>
</template>
<script>
import { getInfo } from '@/api/luckyDraw'
import UserInfo from '@/components/UserInfo'

export default {
  name: 'LuckyDrawInfo',
  components: { UserInfo },
  props: {
    luckyDrawId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selectListLoading: true,
      noSelectListLoading: true,
      dialogUserInfo: false,
      user_id: 0,
      lucky_draw: {
        lucky: {
          down_at: null,
          status: 0
        },
        goods: {
          name: ''
        }
      },
      selectList: [],
      noSelectList: [],
      otherList: []
    }
  },
  computed: {
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getInfo(this.luckyDrawId).then(res => {
        this.selectListLoading = false
        this.noSelectListLoading = false
        this.lucky_draw = res.data.lucky_draw
        this.selectList = res.data.select_list
        this.noSelectList = res.data.no_select_list
        this.otherList = res.data.other_list
      })
    },
    loadData(id) {
      this.luckyDrawId = id
      this.fetchData()
    },
    userInfo(item) {
      this.dialogUserInfo = true
      this.user_id = item.user.id
      this.$nextTick(() => {
        this.$refs.userInfoCom.loadData(item.user.id)
      })
    }
  }
}
</script>
<style>
.exportHidden {
  display: none;
}
.searchHidden {
  display: none;
}
.addHidden {
  display: none;
}
.statusHidden {
  display: none;
}
.dateHidden {
  display: none;
}

</style>
