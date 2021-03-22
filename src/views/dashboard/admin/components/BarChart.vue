<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    month: {
      type: Array,
      default: Array
    },
    wechatMini: {
      type: Array,
      default: Array
    },
    wechatApp: {
      type: Array,
      default: Array
    },
    aliPay: {
      type: Array,
      default: Array
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    console.log(this.month)
    this.$nextTick(() => {
      this.initChart()
    })
    // this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.month,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '小程序支付',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.wechatMini,
          animationDuration
        }, {
          name: '微信APP支付',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.wechatApp,
          animationDuration
        }, {
          name: '支付宝支付',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.aliPay,
          animationDuration
        }]
      })
    }
  }
}
</script>
