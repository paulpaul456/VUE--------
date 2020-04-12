<template>
  <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分類</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片視圖區域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">
                        添加分類
                    </el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table :data="catelist" :columns="columns" 
                :selection-type="false" :expand-type="false" 
                show-index index-text="#" border class="treeTable">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error hi-red" style="color:red" v-else></i>
                </template>
                <!-- 排序 -->
                 <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一級</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt"  slot-scope="scope">
                    <el-button class="el-icon-edit" type="primary" size="mini" @click="editCateDialog(scope.row.cat_id)">编辑</el-button>
                    <el-button class="el-icon-delete" type="danger" size="mini" @click="deleteCate(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分頁區域 -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!--添加分類的對話框 -->
        <el-dialog
            title="提示"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClosed">
            <!-- 添加分類中的表單 -->
            <el-form ref="addCateFormRef" label-width="100px" :model="addCateForm"
                :rules="addCateFormRules">
                <el-form-item label="分類名稱" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>  
                <el-form-item label="父級分類">
                   <div class="block">
                        <span class="demonstration">hover 觸發子菜單</span>
                    <el-cascader 
                    expand-trigger="hover"    
                    :options="parentCateList"
                    :props="cascaderProps"
                    v-model="selectedKeys"
                    @change="parentCateChange"
                    change-on-select
                    clearable></el-cascader>
                    </div>
                </el-form-item>                            
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">確 定</el-button>
            </span>
        </el-dialog>

        <!-- 編輯分類的對話框 -->
         <el-dialog
            title="編輯分類"
            :visible.sync="editCateDialogVisible"
            width="50%"
            >
            <!-- 添加分類中的表單 -->
            <el-form ref="editCateFormRef" label-width="100px" :model="editCateForm"
                :rules="editCateFormRules">
                <el-form-item label="分類名稱" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>                 
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate">確 定</el-button>
            </span>
        </el-dialog>

  </div>
</template>

<script>
export default {
    data(){
        return{
             // 查詢條件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            //商品清單
            catelist:[],
            //總筆數
            total:0,
            //添加分類的對話框的顯示與否
            addCateDialogVisible:false,
            //編輯分類對話框
            editCateDialogVisible:false,
            //treetable每列的定義
            columns:[
                {
                    label:"分類名稱",
                    prop:'cat_name'
                },
                {
                    label:'是否有效',
                    type:'template',
                    template:'isok'
                },
                {
                    label:'是否有效',
                    type:'template',
                    template:'order'
                },
                {
                    label:'操作',
                    type:'template',
                    template:'opt'
                },
            
            ],
            //添加分類表單的資料
            addCateForm:{
                //分類名稱
                cat_name:'',
                //父級分類的ID
                cat_pid:0,
                //當前分類的等級 默認為1
                cat_level:0,
            },
            //編輯分類表單的資料
            editCateForm:{
                cat_name:'',
            },
            //表單驗證
            addCateFormRules:{
                cat_name:[
                    { required: true, message: '請輸入分類名稱', trigger: 'blur' },
                ]
            },
            editCateFormRules:{
                cat_name:[
                    { required: true, message: '請輸入分類名稱', trigger: 'blur' },
                ]
            },
         
            //添加分類時選擇的
            parentCateList:[],
            //設定Cascader的顯示對象
            cascaderProps:{
                value:'cat_id',//選中的值
                label:'cat_name',//看到的值
                children:'children',//父子間用哪個屬性連結
            },
            //選中的父級分類ID陣列
            selectedKeys:[],
            //編輯分類的ID
            editId:''
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
         async getCateList() {
            const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error('獲取商品分類失敗')
            console.log(res.data)
            this.catelist = res.data.result
            this.total = res.data.total
            console.log(this.catelist)
        },
        handleSizeChange(newSize){//改變每頁顯示幾筆
            this.queryInfo.pagesize=newSize
            this.getCateList()
        },
        handleCurrentChange(newPage){//改變目前頁面
             this.queryInfo.pagenum=newPage
             this.getCateList()
        },
        showAddCateDialog(){
            this.getParentCateList()
            this.addCateDialogVisible=true
            
        },
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', { params: { type: 2 } })//獲取前兩級的分類
            if (res.meta.status !== 200) return this.$message.error('獲取父級分類失敗')
            this.parentCateList = res.data
            console.log(this.parentCateList)
        },
        parentCateChange(){
            console.log(this.selectedKeys)
            if(this.selectedKeys.length>0){
                this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]//父級分類的ID
                this.addCateForm.cat_level=this.selectedKeys.length//當前分類的等級
                return
            }else{
                 this.addCateForm.cat_pid=0//父級分類的ID
                this.addCateForm.cat_level=0//當前分類的等級
            }
            console.log(this.addCateForm)
            
        },
        addCate(){//點擊後送出新增的分類
                this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('categories', this.addCateForm)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加分類失敗')
                }
                this.$message.success('添加分類成功')
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields()//清空表單的值而非DATA資料
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        },
        editCateDialog(id){//編輯分類的對話框
            this.editCateDialogVisible=true
            console.log(id)
            this.editId=id
        },
        editCate(){
            console.log(this.editCateForm)
                this.$refs.editCateFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put(`categories/${this.editId}`, {cat_name:this.editCateForm.cat_name})
                if (res.meta.status !== 200) {
                    return this.$message.error('編輯分類失敗')
                }
                this.$message.success('添加分類成功')
                this.getCateList()
                this.editCateDialogVisible = false
            })
        },
        async deleteCate(id){
            console.log(id)
        const confirmResult=await this.$confirm('確定刪除嗎', '警告', {
          confirmButtonText: '確定刪除',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        //確定返回CINFIRM 取消返回CANCEL
        console.log(confirmResult)
            if(confirmResult!=='confirm'){
                return this.$message.info('已取消')
            }
          const {data:res} =await this.$http.delete(`categories/${id}`)
            if(res.meta.status!=200){
                     this.$message.error('刪除用戶失敗')
                 }
                this.$message.success('刪除用戶成功')
                this.getCateList();
        }
    }
}
</script>

<style scoped>
.treeTable {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>