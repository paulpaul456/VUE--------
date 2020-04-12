<template>
  <div class="login_container">
      登陸組件
      <!-- 頭像區域 -->
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
        <!-- 登陸表單區域 -->
        <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" label-width="0px" class="login_form">
            <!-- 用戶名 -->
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
            <!-- 密碼 -->
             <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
            </el-form-item>
            <!-- 按鈕區域 -->
            <el-form-item  class="btns">
                <el-button type="primary" @click="login">登陸</el-button>
                <el-button type="info" @click="reset">重製</el-button>
            </el-form-item>
        </el-form>
        
        </div>
    
     </div>
</template>

<script>
export default {
    data(){
        return {
            loginForm:{
                username:'admin',
                password:'123456',
            },
            // 表單驗證規則
            loginFormRules:{
                username:[
                     { required: true, message: '請輸入登錄名稱', trigger: 'blur' },
                        { min: 3, max: 10, message: '3 到 10 個字', trigger: 'blur' },
                ],
                password:[
                       { required: true, message: '請輸入登錄密碼', trigger: 'blur' },
                        { min: 3, max: 10, message: '3 到 10 個字', trigger: 'blur' },
                ],
            }
        }
    },
    methods:{
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();//refs可獲取refs裡面的參數
        },
        reset(){//帳號密碼重置
            this.resetLoginForm();
            this.loginForm.username='';
            this.loginForm.password=''
        },
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
                if(!valid) return;
               const {data:res} = await this.$http.post('login', this.loginForm)
               console.log(res)
                if (res.meta.status !== 200) return this.$message.error('登陸失敗')
                this.$message.success('登陸成功')
                
                // 1. 將登錄成功之後的token,保存到客戶端的sessionStorage中
                // 1.1 項目中除了登錄之外的其他API接口,必須在登錄之後才能訪問
                // 1.2 token只應在當前網站打開期間生效,所以將token保存到sessionStorage中
                window.sessionStorage.setItem('token',res.data.token)//儲存TOKEN到STORAGE
                console.log(this.$router)
                this.$router.push('/home')
              
            })
        }
    }

}
</script>

<style lang="less" scoped>

.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%)
}
.avatar_box{
height: 130px;
width:130px;
border:1px solid #eee;
border-radius: 50%;
padding:10px;
box-shadow: 0 0 10px #ddd;
position: absolute;
left: 50%;
transform: translate(-50%,-50%);
background-color: #fff;
img{
    width:100%;
    height: 100%;
    border-radius: 50%;    
    background-color: #eee
    }
}
.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding:0 20px;
    box-sizing: border-box;
    text-align: center;
    
   
}
</style>