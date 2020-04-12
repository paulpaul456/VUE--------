<template>
<div>
    <h3>用戶列表組件</h3>    
    <!-- 用戶列表區域 -->
    <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用戶</el-button>
                </el-col>
    </el-row>
    <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
         <el-table-column label="信箱" prop="email"></el-table-column>
          <el-table-column label="電話" prop="mobile"></el-table-column>
           <el-table-column label="腳色" prop="role_name"></el-table-column>
           <el-table-column label="狀態">                    
               <template slot-scope="scope">                
                <el-switch
                @change="userStateChanged(scope.row)"
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949">
                </el-switch>
               </template>
           </el-table-column>
           <el-table-column label="操作" width="180px" >
               <template slot-scope="scope">            
                                 
                  <el-tooltip class="item" effect="dark" content="編輯" placement="top" :enterable="false">
                         <el-button  @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
                    </el-tooltip>
                     
                  <el-tooltip class="item" effect="dark" content="刪除" placement="top" :enterable="false">
                          <el-button  @click="removeUserById(scope.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                    </el-tooltip>
                 
                  <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                    </el-tooltip>
               </template>
           </el-table-column>
    </el-table>
    <!-- 分頁區域 -->
    <!-- sizechange為變換每100頁時觸發 CURRENTCHANGE為改變頁數時觸發 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 以下為添加用戶的對話框 -->
    <el-dialog
        title="添加用戶"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
        <!-- 內容主體 -->
       <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用戶名" prop="username">
             <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
             <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="信箱" prop="email">
             <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手機" prop="mobile">
             <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
       </el-form>
        <!-- 底部區域 -->
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取消</el-button>
    <el-button @click="addUser" type="primary">確定</el-button>
    </span>
    </el-dialog>
    <!-- 以下為修改用戶對話框 -->
    <el-dialog
         title="修改用戶"
        :visible.sync="editDialogVisible"
         width="50%"
         @close="editDialogClosed"
        >
       <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="用戶名">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
            </el-form-item>
              <el-form-item label="信箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
            </el-form-item>
              <el-form-item label="手機" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
       </el-form>
         <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">確定</el-button>
        </span>
    </el-dialog>

    <!-- 替用戶分配角色的對話框 -->
    <el-dialog
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="50%"
   @close="setRoleDialogClosed"
  >
  <div>
      <p>當前的用戶:{{userInfo.username}}</p>
      <p>當前的角色:{{userInfo.role_name}}</p>
      <p>新分配的角色:
        <el-select v-model="selectedRoleId" placeholder="選擇要分配的角色">
             <el-option
                 v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
            :value="item.id">
             </el-option>
         </el-select>
      </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">確定</el-button>
  </span>
</el-dialog>
</div>  
</template>

<script>
export default {
    data(){
        var checkEmail=(rule, value,cb)=>{//驗證信箱的規則
            const regEmail= /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if(regEmail.test(value)){
                console.log(cb)
                return cb()
            }
            cb(new Error('請輸入正確的信箱格式'))
        }
        var checkMobile=(rule,value,cb)=>{//驗證手機號碼規則
            const regMobile=/^09[0-9]{8}$/;
            if(regMobile.test(value)){
                return cb()
            }
            cb(new Error('請輸入正確的手機格式'))
        }
        return{
            queryInfo:{
                query:'',
                //當前頁數
                pagenum:1,
                //每頁顯示多少筆資料 
                pagesize:2
            },
            userlist:[],
            total:0,
            //控制添加用戶對話框的顯示與隱藏
            addDialogVisible:false,
            //修改用戶對話剛的顯示
            editDialogVisible:false,
            //分配用戶的角色對話框顯示
            setRoleDialogVisible:false,
            //編輯單一用戶訊息
            editForm:{

            },
            //添加用戶的表單數據
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            //表單驗證規則
            addFormRules:{
                username:[
                    { required: true, message: '請輸入用戶名稱', trigger: 'blur' },
                    {min:3,max:10,message:'長度為3-10',trigger:'blur'}
                ],
                password:[
                     { required: true, message: '請輸入密碼', trigger: 'blur' },
                    {min:6,max:15,message:'長度為6-15',trigger:'blur'}
                ],
                email:[
                     { required: true, message: '請輸入信箱', trigger: 'blur' },
                     {validator:checkEmail,tigger:'blur'}//這裡的CHECKEMAIL不用THIS拿是因為都在DATA這個FUNCTION裡面
                   
                ],
                mobile:[
                      { required: true, message: '請輸入手機', trigger: 'blur' },
                       {validator:checkMobile,tigger:'blur'}
                   
                ]
            },
            //表單修改規則
            editFormRules:{
                email:[
                      { required: true, message: '請輸入信箱', trigger: 'blur' },
                      {validator:checkEmail,tigger:'blur'}
                ],
                mobile:[
                      { required: true, message: '請輸入手機', trigger: 'blur' },
                       {validator:checkMobile,tigger:'blur'}
                   
                ]
            },
            //用戶被分配角色時提供的資料
            userInfo:{},
            //所有角色的數據列表
            rolesList:[],
            //分配角色時選擇的角色
            selectedRoleId:'',

        }
    },
    created(){
        this.getUserList()
    },
    methods:{
       async getUserList(){
           const {data:res}=await this.$http.get('users',{params:this.queryInfo})
           console.log(res)
           if(res.meta.status!=200){
               return this.$message.error('獲取用戶列表失敗')
           }
           this.userlist=res.data.users
           this.total=res.data.total
           console.log(this.userlist+','+this.total)
        },
        handleSizeChange(newSize){
            console.log(newSize)
            this.queryInfo.pagesize=newSize;
            this.getUserList()
        },
        handleCurrentChange(newPage){
            console.log(newPage)
              this.queryInfo.pagenum=newPage;
              this.getUserList()

        },
        async userStateChanged(userinfo){//監聽SWITCH的變化
        const {data:res}=  await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if(res.meta.status!==200){
            userinfo.mg_state=!userinfo.mg_state//更新失敗則需要把DATA裡的值恢復
            return this.$message.error('更新狀態失敗')
         }
         this.$message.success('更新用戶狀態成功')
        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        addUser(){//增加用戶
             this.$refs.addFormRef.validate(async valid=>{
                 console.log(valid)
                 if(!valid)return
                 const {data:res}= await this.$http.post('users',this.addForm)
                 if(res.meta.status!=201){
                     this.$message.error('添加用戶失敗')
                 }
                 this.$message.success('添加用戶成功')
                 this.addDialogVisible=false;
                 this.getUserList();
             })
        },
        async showEditDialog(id){//獲取將要編輯之用戶資料
        console.log(id)
        const {data:res}=await this.$http.get(`users/${id}`)
        if(res.meta.status!==200){
            return this.$message.error('查詢用戶失敗')
        }
        this.editForm=res.data
        console.log(this.editForm)
        this.editDialogVisible=true
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        editUserInfo(){//修改用戶訊息並且提交
             this.$refs.editFormRef.validate(async valid=>{
                 console.log(valid)
                 if(!valid)return
                 const {data:res}= await this.$http.put(`users/${this.editForm.id}`,this.editForm)
                 if(res.meta.status!=201){
                     this.$message.error('編輯用戶失敗')
                 }
                 this.$message.success('編輯用戶成功')
                 this.editDialogVisible=false;
                 this.getUserList();
             })
        },
        //刪除用戶
        async removeUserById(id){
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
          const {data:res} =await this.$http.delete(`users/${id}`)
            if(res.meta.status!=201){
                     this.$message.error('刪除用戶失敗')
                 }
                this.$message.success('刪除用戶成功')
                this.getUserList();
        },
        //展示分配用戶角色的對話框
        async setRole(userInfo){
            this.setRoleDialogVisible=true
            this.userInfo=userInfo
            console.log(userInfo)
            console.log(this.userlist)
            //展示對話框之前獲取角色列表
          const {data:res}=await this.$http.get('roles')
            if(res.meta.status!=200){
                     this.$message.error('刪除角色列表失敗')
                 }
            this.rolesList=res.data
            console.log(this.rolesList)
        },
        //點擊按鈕設定新的角色
      async saveRoleInfo() {
           console.log(this.selectedRoleId)
           console.log(this.userInfo.id)
         
            if (!this.selectedRoleId) return this.$message.error('請選擇要分配的角色')
            const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
                rid: this.selectedRoleId
            })
            console.log(res)
            if (res.meta.status !== 200) return this.$message.error('分配角色失败')
            this.$message.success('分配角色成功')
            this.getUserList()
            this.setRoleDialogVisible = false
        },
        setRoleDialogClosed(){
             this.selectedRoleId = ''
            this.userinfo = {}
        }
    }
}
</script>

<style scoped>

</style>