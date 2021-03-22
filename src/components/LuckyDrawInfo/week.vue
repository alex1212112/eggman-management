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
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week_id }}</span>
            </el-form-item>
            <el-form-item label="重复期数">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.repeat }} 期</span>
            </el-form-item>
            <el-form-item label="保证金">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.amount }}</span>
            </el-form-item>
            <el-form-item label="开奖人数">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.count }}</span>
            </el-form-item>
            <el-form-item label="特等奖人数">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.fest_count }}</span>
            </el-form-item>
            <el-form-item label="一等奖人数">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.first_count }}</span>
            </el-form-item>
            <el-form-item label="二等奖人数">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.second_count }}</span>
            </el-form-item>
            <el-form-item label="三等奖人数">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.third_count }}</span>
            </el-form-item>
            <el-form-item label="特等奖红包">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.fest_bonus }}</span>
            </el-form-item>
            <el-form-item label="一等奖红包">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.first_bonus }}</span>
            </el-form-item>
            <el-form-item label="二等奖奖品">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.second_goods.name }}</span>
            </el-form-item>
            <el-form-item label="二等奖金额">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.second_price }}</span>
            </el-form-item>
            <el-form-item label="三等奖奖品">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.third_goods.name }}</span>
            </el-form-item>
            <el-form-item label="三等奖金额">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.third_price }}</span>
            </el-form-item>
            <el-form-item label="上线时间">
              <span>{{ lucky_draw.lucky_week && lucky_draw.lucky_week.online_at }}</span>
            </el-form-item>
            <el-form-item label="下线时间">
              <span>{{ lucky_draw.lucky_week.down_at === null ? '未下线' : lucky_draw.lucky_week.down_at }}</span>
            </el-form-item>
            <el-form-item label="抽奖状态">
              <span>{{ lucky_draw.lucky_week.status === 1 ? '待上线' : lucky_draw.lucky_week.status === 2 ? '进行中' : lucky_draw.lucky_week.status === 3 ? '已暂停' : lucky_draw.lucky_week.status === 4 ? '已下线' : '' }}</span>
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
            <el-form-item label="开奖编号">
              <span>{{ lucky_draw.lucky_draw_no }}</span>
            </el-form-item>
            <el-form-item label="开始时间">
              <span>{{ lucky_draw.begin_at }}</span>
            </el-form-item>
            <el-form-item label="开奖时间">
              <span>{{ lucky_draw.open_at === null ? '未开奖' : lucky_draw.open_at }}</span>
            </el-form-item>
            <el-form-item label="开奖状态">
              <span>{{ lucky_draw.status === 1 ? '进行中' : lucky_draw.status === 2 ? '开奖中' : lucky_draw.status === 3 ? '开奖成功' : '' }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-card class="box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix" style="text-align: center">
            <el-tag type="danger" effect="dark">特等奖中奖信息</el-tag>
          </div>
          <el-table
            v-loading="selectListLoading"
            :data="festList"
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
            <el-table-column align="center" label="中奖红包">
              <template slot-scope="scope">
                {{ scope.row.fest_bonus }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="领奖方式">
              <template slot-scope="scope">
                <!--0未领奖 1红包奖 2领实物奖 3兑换蛋壳 4已放弃-->
                {{ scope.row.status === 0 ? '未领奖' : scope.row.status === 1 ? '红包奖' : scope.row.status === 2 ? '领实物奖' : scope.row.status === 3 ? '兑换蛋壳' : scope.row.status === 4 ? '已放弃' : '' }}
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
            <el-tag type="danger" effect="dark">一等奖中奖信息</el-tag>
          </div>
          <el-table
            v-loading="selectListLoading"
            :data="firstList"
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
            <el-table-column align="center" label="中奖红包">
              <template slot-scope="scope">
                {{ scope.row.first_bonus }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="领奖方式">
              <template slot-scope="scope">
                <!--0未领奖 1红包奖 2领实物奖 3兑换蛋壳 4已放弃-->
                {{ scope.row.status === 0 ? '未领奖' : scope.row.status === 1 ? '红包奖' : scope.row.status === 2 ? '领实物奖' : scope.row.status === 3 ? '兑换蛋壳' : scope.row.status === 4 ? '已放弃' : '' }}
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
            <el-tag type="danger" effect="dark">二等奖中奖信息</el-tag>
          </div>
          <el-table
            v-loading="noSelectListLoading"
            :data="secondList"
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
            <el-table-column align="center" label="二等奖奖品" width="95">
              <template slot-scope="scope">
                {{ scope.row.second_goods.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="奖品中奖价" width="95">
              <template slot-scope="scope">
                {{ scope.row.second_price }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="领奖方式">
              <template slot-scope="scope">
                <!--0未领奖 1红包奖 2领实物奖 3兑换蛋壳 4已放弃-->
                {{ scope.row.status === 0 ? '未领奖' : scope.row.status === 1 ? '红包奖' : scope.row.status === 2 ? '领实物奖' : scope.row.status === 3 ? '兑换蛋壳' : scope.row.status === 4 ? '已放弃' : '' }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="物流订单">
              <template v-if="scope.row.express_order" slot-scope="scope">
                订单状态 : {{ scope.row.express_order.status === 1 ? '待发货' : scope.row.express_order.status === 2 ? '待收货' : scope.row.express_order.status === 3 ? '已签收' : scope.row.express_order.status === 4 ? '已放弃' : scope.row.express_order.status === 5 ? '未完善' : '' }}<br>
                订单编号 : {{ scope.row.express_order.order_no }}<br>
                物流信息 : {{ scope.row.express_order.express_name }} - {{ scope.row.express_order.express_no }}<br>
                收货地址 : {{ scope.row.express_order.province }}{{ scope.row.express_order.city }}{{ scope.row.express_order.county }}{{ scope.row.express_order.detail_address }}<br>
                收货信息 : {{ scope.row.express_order.consignee }} | {{ scope.row.express_order.phone }}
                订单时间 : {{ scope.row.express_order.created_at }}
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
            <el-tag type="danger" effect="dark">三等奖中奖信息</el-tag>
          </div>
          <el-table
            v-loading="noSelectListLoading"
            :data="thirdList"
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
            <el-table-column align="center" label="二等奖奖品" width="95">
              <template slot-scope="scope">
                {{ scope.row.third_goods.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="奖品中奖价" width="95">
              <template slot-scope="scope">
                {{ scope.row.third_price }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="领奖方式">
              <template slot-scope="scope">
                <!--0未领奖 1红包奖 2领实物奖 3兑换蛋壳 4已放弃-->
                {{ scope.row.status === 0 ? '未领奖' : scope.row.status === 1 ? '红包奖' : scope.row.status === 2 ? '领实物奖' : scope.row.status === 3 ? '兑换蛋壳' : scope.row.status === 4 ? '已放弃' : '' }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="物流订单">
              <template v-if="scope.row.express_order" slot-scope="scope">
                订单状态 : {{ scope.row.express_order.status === 1 ? '待发货' : scope.row.express_order.status === 2 ? '待收货' : scope.row.express_order.status === 3 ? '已签收' : scope.row.express_order.status === 4 ? '已放弃' : scope.row.express_order.status === 5 ? '未完善' : '' }}<br>
                订单编号 : {{ scope.row.express_order.order_no }}<br>
                物流信息 : {{ scope.row.express_order.express_name }} - {{ scope.row.express_order.express_no }}<br>
                收货地址 : {{ scope.row.express_order.province }}{{ scope.row.express_order.city }}{{ scope.row.express_order.county }}{{ scope.row.express_order.detail_address }}<br>
                收货信息 : {{ scope.row.express_order.consignee }} | {{ scope.row.express_order.phone }}<br>
                订单时间 : {{ scope.row.express_order.created_at }}
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
import { getInfo } from '@/api/luckyDrawWeek'
import UserInfo from '@/components/UserInfo'

export default {
  name: 'LuckyDrawInfoWeek',
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
        lucky_week: {
          down_at: null,
          status: 0
        },
        goods: {
          name: ''
        }
      },
      festList: [],
      firstList: [],
      secondList: [],
      thirdList: [],
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
        this.festList = res.data.fest_list
        this.firstList = res.data.first_list
        this.secondList = res.data.second_list
        this.thirdList = res.data.third_list
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
