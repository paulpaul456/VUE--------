<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>參數列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片視圖 -->
        <el-card>
             <el-alert title="注意: 只允許為第三級分類設置相關參數!" type="warning" show-icon :closable="false">                 
             </el-alert>
            <!--選擇商品分類區域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>選擇商品分類</span>
                    <!-- 選擇商品分類的選擇框 -->
                    <el-cascader 
                        expand-trigger="hover"    
                        :options="cateList"
                        :props="cateProps"
                        v-model="selectedCateKeys"
                        @change="handleChange"
                        change-on-select
                        clearable>
                    </el-cascader>
                </el-col>
            </el-row>
           <!-- 頁籤區域 -->
          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <!-- 添加參數的按鈕 -->
            <el-tab-pane label="動態參數" name="many">
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">
                    添加參數
                </el-button>
                <!-- 動態參數表格 -->
                <el-table :data="manyTableData" border stripe>
                    <!-- 展開行 -->
                    <el-table-column type="expand">
                          <template slot-scope="scope">
                                <!-- 循環渲染展開行 -->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(scope.row,i)">{{item}}</el-tag>
                                <!-- 输入文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="mini"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                    </el-table-column>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="靜態屬性" name="only">
                 <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">
                    添加屬性
                </el-button>
                  <!-- 靜態屬性表格 -->
                 <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循環渲染展開行 -->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(scope.row,i)">{{item}}</el-tag>
                                <!-- 输入文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="mini"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
            </el-tab-pane>
            
          </el-tabs>
        </el-card>
        <!-- 添加參數的對話框 -->
         <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">確 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改參數對話框 -->
        <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">確 定</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script>
export default {    
    data(){
        return{
            cateList:[],
            //選擇框對應的屬性
            cateProps:{
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover'
            },
            //選擇框綁定到的陣列
            selectedCateKeys:[],
            activeName:'many',//對應的頁籤
            manyTableData:[],//動態參數的數據
            onlyTableData:[],//靜態屬性的數據
            addDialogVisible:false,//控制添加參數對話框的顯示隱藏
            addForm:{
                attr_name:''
            },//添加參數的表單數據對象
            addFormRules:{
                attr_name:[
                    { required: true, message: '請輸入參數名稱', trigger: 'blur' },
                ]
            },
            // 修改对话框(显示/隐藏)
            editDialogVisible: false,
            // 修改的表单数据对象
            editForm: {},
            // 修改表单的验证规则对象
            editFormRules: {
                attr_name:[
                    { required: true, message: '請輸入參數名稱', trigger: 'blur' },
                ]
            },
         
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('獲取商品分類失敗')
            this.cateList = res.data
            console.log(this.cateList)
        },   
        handleChange(){//選擇框選擇時觸發
            this.getParamsData()
        },
        async getParamsData(){//獲取參數的列表數據
            if(this.selectedCateKeys.length!=3){//不是三級分類
                this.selectedCateKeys=[]
                this.manyTableData = []
                this.onlyTableData = []
                return;
           }
           console.log(this.selectedCateKeys)
           //以當前所選的ID以及當下為動態還靜態獲取對應數據
           const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
            if (res.meta.status !== 200) return this.$message.error('獲取參數列表失敗')
            console.log(res.data)
            res.data.forEach(item=>{
                item.attr_vals= item.attr_vals?item.attr_vals.split(' '):[]
                item.inputVisible=false;
                item.inputValue='';
            })
            if(this.activeName=='many'){
                this.manyTableData=res.data
            }else{
                this.onlyTableData=res.data
            }
            console.log(res.data)
        },

        handleTabClick(){
            this.getParamsData()
            console.log(this.activeName)
        },  
        addDialogClosed(){//對話框關閉時表單值清空
           this.$refs.addFormRef.resetFields()
        },
        addParams(){//按下確定添加參數
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid)return
                const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 201) return this.$message.error('添加参数失败')
                this.$message.success('添加参数成功')
                this.addDialogVisible = false
                this.getParamsData()
            })
        },
        async showEditDialog(attrId) {
            console.log(attrId+','+this.cateId)
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
                params: { attr_sel: this.activeName }
            })
            if (res.meta.status !== 200) return this.$message.error('獲取參數訊息失敗')
            console.log(res.data)
            this.editForm = res.data
            this.editDialogVisible = true
        },
        editDialogClosed(){//重製修改的表單
             this.$refs.editFormRef.resetFields()
        },
        // 點擊按鈕修改參數
        editParams() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                    attr_name: this.editForm.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 200) return this.$message.error('修改參數失敗')
                this.$message.success('修改参数成功')
                this.getParamsData()
                this.editDialogVisible = false
            })
        },
        // 根據ID刪除對應的參數
        async removeParams(attrId) {
            const confirmResult = await this.$confirm('永久删除該文件, 是否繼續?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
            const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
            if (res.meta.status !== 200) return this.$message.error('删除参數失敗')
            this.$message.success('删除参數成功')
            this.getParamsData()
        },
        handleInputConfirm(row){//輸入框失去焦點或是按下ENTER時觸發
            row.inputVisible=false;
              if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
            }
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue='';
            row.inputVisible=false;
             this.saveAttrVals(row)
        },
        showInput(row){
            row.inputVisible=true;
             this.$nextTick(_ => {//自動對焦文字框
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        async saveAttrVals(row) {
            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(' ')
            })
            if (res.meta.status !== 200) return this.$message.error('修改参數失敗')
            this.$message.success('修改参數成功')
        },
         // 刪除對應參數
        handleClose(row, i) {
            row.attr_vals.splice(i, 1)
            this.saveAttrVals(row)
        }
    },
    computed:{
      
        isBtnDisabled() {  // 如果按鈕需要禁用,返回true,否則返回false
            return this.selectedCateKeys.length !== 3
        },
          
        cateId() {// 當前選中的三級ID
            if (this.selectedCateKeys.length === 3) {
                return this.selectedCateKeys[2]
            }
            return null
        },
        titleText(){//對話框
            if(this.activeName==='many'){
                return '動態參數'
            }else{
                return '靜態屬性'
            }
        },
       
      
       
    }
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 10px 0;
}
.el-cascader {
    margin-left: 10px;
}
.el-tag {
    margin: 5px;
}
.input-new-tag {
    width: 120px;
}
</style>