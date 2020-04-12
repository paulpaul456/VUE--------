<template>
    <div>
        <!-- 面包屑導航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>訂单管理</el-breadcrumb-item>
            <el-breadcrumb-item>訂单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片視圖 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="請输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 订单列表数据 -->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="訂單編號" prop="order_number"></el-table-column>
                <el-table-column label="訂單價格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否發貨" prop="is_send"></el-table-column>
                <el-table-column label="下單時間" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分頁區域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 修改地址对话框 -->
        <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="addressDialogClosed">
            <el-form :model="addressForm" :rules="addressFormRules"
                ref="addressFormRef" label-width="100px">
                <el-form-item label="省市區/縣" prop="address1">
                    <el-cascader :props="{ expandTrigger: 'hover' }" :options="cityData" v-model="addressForm.address1">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="詳細地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDialogVisible = false">確 定</el-button>
            </span>
        </el-dialog>
        <!-- 展示物流进度对话框 -->
        <el-dialog title="物流進度" :visible.sync="progressVisible" width="50%">
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in progressInfo"
                :key="index" :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata'
export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            orderList: [],
            // 控制修改地址對話框的顯示隱藏
            editDialogVisible: false,
            addressForm: {
                address1: [],
                address2: ''
            },
            addressFormRules: {
                address1: [
                    { required: true, message: '請輸入省市區', trigger: 'blur' }
                ],
                address2: [
                    { required: true, message: '請填寫詳細地址', trigger: 'blur' }
                ]
            },
            cityData,
            progressVisible: false,
            progressInfo: []
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        async getOrderList() {
            const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error('獲取訂單數據失敗')
            this.total = res.data.total
            this.orderList = res.data.goods
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        // 展示修改地址对话框
        showBox() {
            this.editDialogVisible = true
        },
        // 修改地址对话框关闭
        addressDialogClosed() {
            this.$refs.addressFormRef.resetFields()
        },
        async showProgressBox() {
            const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
            if (res.meta.status !== 200) return this.$message.error('獲取物流進度失敗')
            this.progressInfo = res.data
            this.progressVisible = true
        }
    }
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>
