export const SFC_CODE_ESM = `<template>
  <VeChart :option="option" @click="testEvent" :chartType="chartType" />
</template>

<script>
import { ref } from 'vue'
import { VeChart } from 've-charts'

export default {
  components: {
    VeChart
  },
  setup () {
    const option = ref({
      title: {
          text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
          data:['销量']
      },
      xAxis: {
          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    })

    return {
      option,
      chartType: 've-chart',
      testEvent: val => console.log(val)
    }
  }
}
</script>

`
