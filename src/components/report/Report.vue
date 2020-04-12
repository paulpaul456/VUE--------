<template>
    <div>
        <!-- 麵包屑導航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
            <el-breadcrumb-item>數據統計</el-breadcrumb-item>
            <el-breadcrumb-item>數據報表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片視圖 -->
        <el-card>
            <!-- 2.放置區域 -->
            <div id="main" style="width: 1200px;height:600px"></div>
        </el-card>
    </div>
</template>

<script>
// 1.導入 echarts
import echarts from 'echarts'
import _ from 'lodash'

export default {
    data() {
        return {
            // 需要合併的數據
            options: {
                title: {
                    text: '用戶來源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                        backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        }
    },
    // 必須在頁面上的DOM都渲染完畢再來初始化圖表
    async mounted() {
       
        var myChart = echarts.init(document.getElementById('main'))
        const { data: res } = await this.$http.get('reports/type/1')
        if (res.meta.status !== 200) return this.$messgae.error('獲取折線圖數據失敗')
        // 使用lodash的MERGE方法合併對象
        console.log(res.data)
        console.log(this.options)
        const result = _.merge(res.data, this.options)
        console.log(result)
        myChart.setOption(result)
     
    }
}
</script>
