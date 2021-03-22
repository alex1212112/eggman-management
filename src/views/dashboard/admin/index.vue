<template>
  <div class="dashboard-editor-container">
    <panel-group :user-count="result.user_count" :vip-count="result.vip_count" :total-income="result.total_income" :total-pay="result.total_pay" />

    <el-row style="background:#fff;margin-bottom:32px;">
      <div id="map" style="width:100%; height:800px;" />
    </el-row>

    <el-row :gutter="32">
      <!--      <el-col :xs="24" :sm="24" :lg="8">-->
      <!--        <div class="chart-wrapper">-->
      <!--          <raddar-chart />-->
      <!--        </div>-->
      <!--      </el-col>-->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :male-count="result.male_count" :female-count="result.female_count" :un-know-count="result.unKnow_count" :class-name="'pie'" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart :month="result.month" :wechat-mini="result.wechatMini" :wechat-app="result.wechatApp" :ali-pay="result.aliPay" :class-name="'bar'" />
        </div>
      </el-col>
    </el-row>

    <!--    <el-row :gutter="8">-->
    <!--      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">-->
    <!--        <transaction-table />-->
    <!--      </el-col>-->
    <!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
    <!--        <todo-list />-->
    <!--      </el-col>-->
    <!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
    <!--        <box-card />-->
    <!--      </el-col>-->
    <!--    </el-row>-->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
// import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'
import { getDashboardData } from '@/api/admin'
import { getToken } from '@/utils/auth'
import AMapLoader from '@amap/amap-jsapi-loader'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    // RaddarChart,
    PieChart,
    BarChart
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      result: {
        user_count: 0,
        vip_count: 0,
        total_income: '0.00',
        total_pay: '0.00',
        male_count: 0,
        female_count: 0,
        unKnow_count: 0,
        month: [],
        wechatMini: [],
        wechatApp: [],
        aliPay: [],
        month_income: []
      }
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
    AMapLoader.load({
      key: '8b4716ed27a9bcc7593c31064eb8479e', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      AMapUI: { // 是否加载 AMapUI，缺省不加载
        version: '1.1', // AMapUI 缺省 1.1
        plugins: [] // 需要加载的 AMapUI ui插件
      },
      Loca: { // 是否加载 Loca， 缺省不加载
        version: '1.3.2' // Loca 版本，缺省 1.3.2
      }
    }).then((AMap) => {
      const map = new AMap.Map('map', {
        mapStyle: 'amap://styles/grey',
        zoom: 4,
        center: [108.9082, 37.9452]
      })
      const layer = new window.Loca.PointLayer({
        map: map
      })
      // 传入原始数据
      layer.setData(this.result.register_address, {
        lnglat: 'center' // 指定坐标数据的来源，数据格式: 经度在前，纬度在后，数组格式。
      })
      // 配置样式
      layer.setOptions({
        style: {
          radius: 2, // 圆形半径，单位像素
          color: '#14B4C9', // 填充颜色
          borderWidth: 0.5, // 边框宽度
          borderColor: '#14B4C9' // 边框颜色
        }
      })
      layer.render()
    }).catch(e => {
      console.log(e)
    })
  },
  methods: {
    fetchData() {
      getDashboardData().then(res => {
        if (res.code === 200) {
          this.result = res.data
          this.result.month = res.data.month_income.map(item => {
            return item.date
          })
          this.result.wechatMini = res.data.month_income.map(item => {
            return parseFloat(item.wechat_mini)
          })
          this.result.wechatApp = res.data.month_income.map(item => {
            return parseFloat(item.wechat_app)
          })
          this.result.aliPay = res.data.month_income.map(item => {
            return parseFloat(item.aliPay)
          })
          console.log(this.result)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
