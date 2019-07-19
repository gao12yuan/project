<template>
  <div ref="main"
       style="width: 600px;height:400px;"></div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'Echart',
  data () {
    return {
      myChart: null
    }
  },
  mounted () {
    this.getIm()
    this.loadData()
  },
  methods: {
    // 初始图标组件
    getIm () {
      this.myChart = echarts.init(this.$refs.main)
      this.myChart.setOption({
        title: {
          text: '异步数据加载示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: []
        }]
      })
    },
    // 更新图片数据
    async loadData () {
      try {
        const data = await
        this.$http({
          method: 'GET',
          url: 'http://localhost:3000/barData'
        })
        this.myChart.setOption({
          xAxis: {
            data: data.xAxisData
          },
          series: [{
            // 根据名字对应到相应的系列
            name: '销量',
            data: data.seriesData
          }]
        })
      } catch (err) {
        console.log(err)
        this.$message.error('更新图片失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
