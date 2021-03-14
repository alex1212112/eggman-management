<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card class="box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix" style="text-align: center">
            <el-tag type="danger" effect="dark">基本信息</el-tag>
          </div>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户头像">
              <el-avatar :size="50" :src="user.avatar" />
            </el-form-item>
            <el-form-item label="微信昵称">
              <span>{{ user.nickname }}</span>
            </el-form-item>
            <el-form-item label="手机号">
              <span>{{ user.phone }}</span>
            </el-form-item>
            <el-form-item label="注册时间">
              <span>{{ user.created_at }}</span>
            </el-form-item>
            <el-form-item label="地区">
              <span>{{ user.province }}/{{ user.city }}/{{ user.county }}</span>
            </el-form-item>
            <el-form-item label="生日">
              <span>{{ user.birthday }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ user.gender === 1 ? '男' : user.gender === 2 ? '女' : '未知' }}</span>
            </el-form-item>
            <el-form-item label="推荐人">
              <div v-if="user.parent">
                <el-avatar :size="50" :src="user.parent.avatar" />
                <el-tag>{{ user.parent.nickname }}</el-tag>
                <el-tag type="info">{{ user.parent.phone }}</el-tag>
              </div>
              <div v-else>
                暂无
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-card class="box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix" style="text-align: center">
            <el-tag type="danger" effect="dark">资产信息</el-tag>
          </div>
          <el-row>
            <el-col :span="12">
              <el-card :body-style=" {textAlign: 'center'} ">
                <div slot="header" class="clearfix" style="text-align: center">
                  <span>账户余额</span>
                </div>
                <div>{{ user.balance }}</div>
                <el-link type="primary" style="margin-top: 20px" @click="userLog(user.id,'balance')">查看明细</el-link>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card :body-style=" {textAlign: 'center'} ">
                <div slot="header" class="clearfix" style="text-align: center">
                  <span>蛋壳</span>
                </div>
                <div>{{ user.fragments }}</div>
                <el-link type="primary" style="margin-top: 20px" @click="userLog(user.id,'fragments')">查看明细</el-link>
              </el-card>
            </el-col>
            <!--            <el-col :span="8">-->
            <!--              <el-card :body-style=" {textAlign: 'center'} ">-->
            <!--                <div slot="header" class="clearfix" style="text-align: center">-->
            <!--                  <span>积分</span>-->
            <!--                </div>-->
            <!--                <div>{{ user.point }}</div>-->
            <!--                <el-link type="primary" style="margin-top: 20px" @click="userLog(user.id,'point')">查看明细</el-link>-->
            <!--              </el-card>-->
            <!--            </el-col>-->
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-card class="box-card" style="margin-top: 10px;">
          <div slot="header" class="clearfix" style="text-align: center">
            <el-tag type="danger" effect="dark">抽奖记录</el-tag>
          </div>
          <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="抽奖ID" width="95">
              <template slot-scope="scope">
                {{ scope.row.lucky_two_id }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="开奖ID" width="95">
              <template slot-scope="scope">
                {{ scope.row.lucky_draw_two_id }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="开奖编号" width="95">
              <template slot-scope="scope">
                {{ scope.row.lucky_draw.lucky_draw_no }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="抽奖保证金">
              <template slot-scope="scope">
                {{ scope.row.lucky.amount }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="参与时间">
              <template slot-scope="scope">
                {{ scope.row.created_at }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="开始时间">
              <template slot-scope="scope">
                {{ scope.row.lucky_draw.begin_at }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="开奖时间">
              <template slot-scope="scope">
                {{ scope.row.lucky_draw.open_at }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="中奖状态">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.level === 0 ? 'info' : scope.row.level === 1 ? 'success' : scope.row.level === 2 ? 'warning' : scope.row.level === 3 ? 'danger' : '' "
                  effect="dark"
                >
                  {{ scope.row.level === 0 ? '待开奖' : scope.row.level === 1 ? '一等奖' : scope.row.level === 2 ? '二等奖' : scope.row.level === 3 ? '三等奖' : '' }}
                </el-tag>

              </template>
            </el-table-column>
            <el-table-column align="center" label="领奖方式">
              <template slot-scope="scope">
                <!--0未领奖 1红包奖 2领实物奖 3兑换蛋壳 4已放弃-->
                {{ scope.row.status === 0 ? '未领奖' : scope.row.status === 1 ? '红包奖' : scope.row.status === 2 ? '领实物奖' : scope.row.status === 3 ? '兑换蛋壳' : scope.row.status === 4 ? '已放弃' : '' }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="物流订单">
              <template slot-scope="scope">
                <div v-if="scope.row.express_order">
                  订单状态 : {{ scope.row.express_order.status === 1 ? '待发货' : scope.row.express_order.status === 2 ? '待收货' : scope.row.express_order.status === 3 ? '已签收' : scope.row.express_order.status === 4 ? '已放弃' : scope.row.express_order.status === 5 ? '未完善' : '' }}<br>
                  订单编号 : {{ scope.row.express_order.order_no }}<br>
                  物流信息 : {{ scope.row.express_order.express_name }} - {{ scope.row.express_order.express_no }}<br>
                  收货地址 : {{ scope.row.express_order.province }}{{ scope.row.express_order.city }}{{ scope.row.express_order.county }}{{ scope.row.express_order.detail_address }}<br>
                  收货信息 : {{ scope.row.express_order.consignee }} | {{ scope.row.express_order.phone }}<br>
                  订单时间 : {{ scope.row.express_order.created_at }}
                </div>
                <div v-else>
                  {{ '' }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="查看明细 "
      :visible.sync="dialogLog"
      class="text-center"
      center
      width="90%"
      :destroy-on-close="true"
      @close="dialogLog = false;fetchData()"
    >
      <user-log ref="logCom" :user-id="user_id" :attr-type="attr_type" />
    </el-dialog>
  </div>
</template>
<script>
import { getInfo } from '@/api/wechatUser'
import UserLog from '@/views/other/log'

export default {
  name: 'UserInfo',
  components: { UserLog },
  props: {
    userId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      listLoading: true,
      dialogLog: false,
      user: {

      },
      list: [],
      user_id: 0,
      attr_type: ''
    }
  },
  computed: {
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getInfo(this.userId).then(res => {
        this.listLoading = false
        this.user = res.data
        this.list = res.data.lucky_draw_user_two
      })
    },
    loadData(id) {
      this.userId = id
      this.fetchData()
    },
    userLog(userId, attrType) {
      this.user_id = userId
      this.attr_type = attrType
      this.dialogLog = true
      this.$nextTick(() => {
        this.$refs.logCom.loadData(userId, attrType)
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
