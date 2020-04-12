<template>
    <div>
       
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
      
        <el-card>
            <!-- 提示區域 -->
            <el-alert
                title="添加商品信息" type="info" center show-icon :closable="false">
            </el-alert>
            <!-- 步驟條 -->
            <el-steps :space="300" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品參數"></el-step>
                <el-step title="商品屬性"></el-step>
                <el-step title="商品圖片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFromRules" ref="addFromRef" label-width="100px" label-position="top">
                <!-- TAB欄 -->
                <el-tabs v-model="activeIndex" :tab-position="'left'"
                    :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名稱" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品價格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品數量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分類" prop="goods_cat">
                            <el-cascader
                            v-model="addForm.goods_cat"
                            :options="cateList"
                            :props="cateProps"
                            @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <!-- 複選框 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品屬性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品圖片" name="3">                        
                        <el-upload
                            :headers="headerObj"
                            :action="uploadURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            list-type="picture">
                            <el-button size="small" type="primary">點擊上傳</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce">
                        </quill-editor>
                        <el-button class="btnAdd" type="primary" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <el-dialog class="img_dialog" title="圖片預覽" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    data() {
        return {
            activeIndex: '0',
            // 添加商品的表單數據對象
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                // 商品所屬分類數組
                goods_cat: [],
                // 圖片數組
                pics: [],
                // 商品詳情描述
                goods_introduce: ''
            },
            addFromRules: {
                goods_name: [
                    { required: true, message: '請輸入商品名稱', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '請輸入商品價格', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '請輸入商品重量', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '請輸入商品數量', trigger: 'blur' }
                ],
                goods_cat: [
                    { required: true, message: '請選中商品分類', trigger: 'blur' }
                ]
            },
            // 商品分类列表
            cateList: [],
            cateProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children',
                expandTrigger: 'hover'
            },
            // 動態參數列表數據
            manyTableData: [],
            // 靜態屬性
            onlyTableData: [],
            // upload url
            uploadURL: 'https://www.liulongbin.top:8888/api/private/v1/upload',
            // HEADER要攜帶TOKEN才會通過 因為用來上傳的組件內建AJAX
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 預覽圖片
            previewPath: '',
            // 預覽圖片顯示與否
            previewVisible: false,
            url: 'https://renoblog.xyz/'
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 獲取所有商品分類
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('獲取分類數據失敗')
            this.cateList = res.data
        },
        // 級聯選擇器變化
        handleChange() {
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
            }
        },
        beforeTabLeave(actsiiveName, oldActiveName) {//基本訊息正確時才允許跳轉下一頁
            if (this.addForm.goods_cat.length !== 3 && oldActiveName === '0') {
                this.$message.error('請先選中商品分類')
                return false
            }
        },
        async tabClicked() {
            
            if (this.activeIndex === '1') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: { sel: 'many' }
                })
                if (res.meta.status !== 200) return this.$message.error('獲取動態參數列表失敗')
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                })
                this.manyTableData = res.data
            } else if (this.activeIndex === '2') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: { sel: 'only' }
                })
                if (res.meta.status !== 200) return this.$message.error('或去商品信息失敗')
                this.onlyTableData = res.data
            }
        },
        // 處理圖片預覽效果
        handlePreview(file) {
            this.previewPath = file.response.data.url
            this.previewVisible = true
        },
        // 移除圖片
        handleRemove(file) {
            const filePath = file.response.data.temp_path
            const i = this.addForm.pics.findIndex(x => x.pic === filePath)
            this.addForm.pics.splice(i, 1)
        },
        // 監聽圖片成功上傳事件
        handleSuccess(response) {
            
            const picInfo = { pic: response.data.tmp_path }
            this.addForm.pics.push(picInfo)
        },
        // 添加商品
        addGoods() {
            this.$refs.addFromRef.validate(async valid => {
                if (!valid) return this.$message.error('請填寫必要的選單項目')
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                // 商品名称必须唯一
                const { data: res } = await this.$http.post('goods', form)
                if (res.meta.status !== 201) return this.$message.error('添加商品失敗')
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
            })
        }
    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
            return null
        }
    }
}
</script>

<style lang="less" scoped>
.el-steps {
    margin: 20px 0;
}
.el-step__title {
    font-size: 13px;
}
.el-checkbox {
    margin-right: 10px !important;
}
.previewImg {
    width: 100%;
}
.btnAdd {
    margin-top: 15px;
}

</style>
