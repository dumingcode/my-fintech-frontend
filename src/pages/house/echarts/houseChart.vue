<template>
  <div style="width:100%;height:100%;" id="house_deal_con"></div>
</template>

<script>
import echarts from 'echarts'
export default {
    name: 'houseChart',
    props: ['statisticData'],
    data () {
        return {
            labelOption: {
                normal: {
                    show: true,
                    position: 'insideBottom',
                    distance: 15,
                    align: 'left',
                    verticalAlign: 'middle',
                    rotate: 90,
                    formatter: '{name|{a}}',
                    fontSize: 16,
                    rich: {
                        name: {
                            textBorderColor: '#fff'
                        }
                    }
                }
            }
        }
    },
    mounted () {
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    },
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: ['2016', '2017', '2018', '2019']
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    axisPointer: {
                        type: 'shadow'
                    },
                    data: [
                        '1月',
                        '2月',
                        '3月',
                        '4月',
                        '5月',
                        '6月',
                        '7月',
                        '8月',
                        '9月',
                        '10月',
                        '11月',
                        '12月'
                    ]
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '住宅成交量'
                }
            ],
            series: [
                {
                    name: '2016',
                    type: 'line',
                    barGap: 0,
                    label: this.labelOption,
                    data: this.statisticData['2016']
                },
                {
                    name: '2017',
                    type: 'bar',
                    barGap: 0,
                    label: this.labelOption,
                    data: this.statisticData['2017']
                },
                {
                    name: '2018',
                    type: 'bar',
                    barGap: 0,
                    label: this.labelOption,
                    data: this.statisticData['2018']
                },
                {
                    name: '2019',
                    type: 'bar',
                    barGap: 0,
                    label: this.labelOption,
                    data: this.statisticData['2019']
                }
            ]
        }
        const serviceRequestCharts = echarts.init(
            document.getElementById('house_deal_con')
        )
        serviceRequestCharts.setOption(option)

        window.addEventListener('resize', function () {
            serviceRequestCharts.resize()
        })
    }
}
</script>