<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>權限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-row>
            <el-col>
                <!-- 添加角色按鈕 -->
                <el-button type="primary" @click="addRoleVisible=true">添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 角色列表區域 -->
        <el-table :data="rolelist" border stripe>
            <!-- 角色權限共分三級 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                   <el-row :class="['bdbottom',i1==0?'bdtop':'',,'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                       <el-col :span="5">
                           <el-tag
                            closable
                            @close="removeRightById(scope.row,item1.id)"
                           >{{item1.authName}}</el-tag>
                           <i class="el-icon-caret-right"></i>
                         
                       </el-col>
                       <el-col :span="19">
                           <el-row :class="[i2 === 0? '':'bdtop','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                               <el-col :span="6">
                                     <el-tag
                                      closable
                                      @close="removeRightById(scope.row,item2.id)"
                                      type=success>{{item2.authName}}</el-tag>
                                       <i v-show="item2.children.length>0 ? true:false" class="el-icon-caret-right"></i>                                                                      
                                </el-col>
                                <el-col :span="18">
                                     <el-tag type="warning" 
                                     v-for="(item3) in item2.children" :key="item3.id" 
                                     closable
                                     @close="removeRightById(scope.row,item3.id)">
                                         {{item3.authName}}
                                     </el-tag>
                                     
                                </el-col>
                           </el-row>
                       </el-col>
                   </el-row>
<!-- 
                   <pre>
                       {{scope.row}}
                   </pre> -->
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名稱" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope"> 
                   <el-button size="mini" type="primary" icon="el-icon-edit" @click="openEditRoleVisible(scope.row.id)">編輯</el-button>
                   <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">刪除</el-button>
                   <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配權限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 分配權限的彈出視窗 -->
    <el-dialog
        title="提示"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="resetDefKeys"             >
        <el-tree :data="rightslist" :props="treeProps" show-checkbox :default-expand-all="true" :default-checked-keys="defKeys" node-key="id"  ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">確 定</el-button>
        </span>
    </el-dialog>
    <!-- 添加角色的視窗 -->
        <el-dialog
            title="添加角色"
            :visible.sync="addRoleVisible"
            width="50%"
            >
            <!-- 添加分類中的表單 -->
            <el-form ref="addRoleRef" label-width="100px" :model="addRoleForm"
                :rules="addRoleFormRules">
                <el-form-item label="角色名稱" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>     
                  <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>                   
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">確 定</el-button>
            </span>
        </el-dialog>
    <!-- 編輯角色的視窗 -->
         <el-dialog
            title="編輯角色"
            :visible.sync="editRoleVisible"
            width="50%"
            >
            <!-- 添加分類中的表單 -->
            <el-form ref="editRoleRef" label-width="100px" :model="editRoleForm"
                :rules="editRoleFormRules">
                <el-form-item label="角色名稱" prop="roleName">
                    <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>     
                  <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>                   
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">確 定</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
            //角色數據
            rolelist:[],
            //分配權限視窗的顯示與否
            setRightDialogVisible:false,
            //分配權限的資料
            rightslist:[],
            //樹型控見的屬性綁定對象
            treeProps:{
                label:'authName',//每層要綁定的權限屬性名
                children:'children'//下一層要綁定哪個屬性
            },
            //預設選中的ID值 因為node-key設定為ID
            defKeys:[105,116],
            //分配角色權限時角色的ID
            roleId:'',
            //添加角色的視窗顯示
            addRoleVisible:false,
            //添加角色的資料
            addRoleForm:{
                roleName:'',
                roleDesc:''
            },
            //添加角色驗證規則
            editRoleFormRules:{
                roleName:[
                     { required: true, message: '請輸入角色名稱', trigger: 'blur' },
                ],         

            },
           
            //編輯角色的視窗顯示
            editRoleVisible:false,
            //編輯角色的資料
            editRoleForm:{
                roleName:'',
                roleDesc:''
            },
            //編輯角色的驗證
               addRoleFormRules:{
                roleName:[
                     { required: true, message: '請輸入角色名稱', trigger: 'blur' },
                ],
                roleDesc:[
                     { required: true, message: '請輸入角色描述', trigger: 'blur' },
                ]

            },
            //要編輯的ID值
            editId:'',



          
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
       async getRolesList(){
          const {data:res}=await this.$http.get('roles')
          if(res.meta.status!==200){
              return this.$message.error('獲取角色數據失敗')
          }
          this.rolelist=res.data
          console.log(this.rolelist)
        },
        //根據ID刪除對應權限
       async removeRightById(role,rightId){
            //彈出提示給用戶
         const confirmResult=await this.$confirm('將刪除權限, 是否繼續?', '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
          }).catch(err=>err)

          if(confirmResult!=='confirm'){
              return this.$message.info('取消刪除')
              
          }
          const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status!==200){
                return this.$message.error('刪除失敗')
            }
            // this.getRolesList() 如果呼叫這個方法會整個畫面重新渲染 用下面的方式則不會
            role.children=res.data
        },
        async showSetRightDialog(role){//展示分配權限的視窗
            this.roleId=role.id
            const {data:res}=await this.$http.get('rights/tree')
                if(res.meta.status!==200){
                return this.$message.error('獲取權限失敗')
            }
           
            this.rightslist=res.data
            console.log(this.rightslist)

            this.getLeafKeys(role,this.defKeys)

            this.setRightDialogVisible=true
        },
        getLeafKeys(node,arr){//通過遞迴的方式 獲取所有第三級權限的ID
        console.log(node)
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item=>{
                this.getLeafKeys(item,arr)
            })
        },
        resetDefKeys(){//defKeys歸零
            this.defKeys=[]
        },
      async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
           console.log(keys)
           const idStr=keys.join(',')
           console.log(idStr)
       const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
            if (res.meta.status !== 200) return this.$message.error('分配权限失败')
            this.$message.success('分配权限成功')
            this.getRolesList()
            this.setRightDialogVisible = false

        },
        async addRole(){//添加角色
            console.log(this.addRoleForm)
            const {data:res}=await this.$http.post('roles',this.addRoleForm)
             if (res.meta.status !== 201) return this.$message.error('添加角色失敗')
            this.$message.success('添加角色成功')
            this.getRolesList()
            this.$refs.addRoleRef.resetFields()
            this.addRoleForm.roleName='',
            this.addRoleForm.roleDesc='',
            this.addRoleVisible = false
        },
         //打開編輯角色視窗並且設置ID值
        openEditRoleVisible(id){
            console.log(id)
            this.editId=id
            this.editRoleVisible=true
        },
        async editRole(){//編輯角色
            const {data:res}=await this.$http.put(`roles/${this.editId}`,this.editRoleForm)
             if (res.meta.status !== 200) return this.$message.error('編輯角色失敗')
            this.$message.success('編輯角色成功')
            this.getRolesList()
            this.$refs.editRoleRef.resetFields()
            this.editRoleForm.roleName='',
            this.editRoleForm.roleDesc='',
            this.editRoleVisible = false
        },
        //刪除角色
        async deleteRole(id){
        const confirmResult=await this.$confirm('確定刪除嗎', '警告', {
          confirmButtonText: '確定刪除',
          cancelButtonText: '取消',
          type: 'warning'
          }).catch(err=>err)
        //確定返回CINFIRM 取消返回CANCEL
            if(confirmResult!=='confirm'){
                return this.$message.info('已取消')
            }
          const {data:res} =await this.$http.delete(`roles/${id}`)
            if(res.meta.status!=200){
                     this.$message.error('刪除用戶失敗')
                 }
                this.$message.success('刪除用戶成功')
                this.getRolesList();
        }
    }
}
</script>

<style scoped>
.el-tag {
    margin: 8px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>