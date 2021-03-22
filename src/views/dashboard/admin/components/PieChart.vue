<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
    maleCount: {
      type: Number,
      default: 0
    },
    femaleCount: {
      type: Number,
      default: 0
    },
    unKnowCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null
    }
  },
  created() {
    console.log(this.femaleCount)
  },
  mounted() {
    console.log(this.femaleCount)
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch : {
    maleCount() {
      this.initChart()
    },
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['男', '女', '未知']
        },
        series: [
          {
            name: '注册用户男女比例',
            type: 'pie',
            roseType: 'radius',
            radius: [50, 95],
            center: ['50%', '48%'],
            data: [
              { value: this.maleCount, name: '男' },
              { value: this.femaleCount, name: '女' },
              { value: this.unKnowCount, name: '未知' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
