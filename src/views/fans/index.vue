<template>
  <div>
    <div ref="main"
         style="width: 600px;height:400px;"></div>
    <EChart></EChart>
  </div>

</template>
<script>
import echarts from 'echarts'
import EChart from './temponents/echart'
export default {
  name: 'fans',
  components: {
    EChart
  },
  data () {
    return {}
  },
  mounted () {
    this.getEchart()
  },
  methods: {
    getEchart () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.main)
      myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
