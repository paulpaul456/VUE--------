<template>  
<el-container class="home-container">
    <!-- 頭部區域 -->
  <el-header>
      <div>
            <img class="avator" style="width:50px;height:50px" src="../assets/logo.png" alt=""/>
            <span>電商後台管理系統</span>
        </div>
      <el-button type="info" @click="logout">登出</el-button>
      </el-header>
  <el-container>
     <!-- 側邊攔 -->
    <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 側邊欄菜單區 -->
    <el-menu 
    :router="true" 
    :collapse-transition="false"
      :collapse="isCollapse"
      :unique-opened="true"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      :default-active="activePath">
      <!-- 第一層菜單 unique為單獨展開功能 router為將第二層的菜單改為路由模式 -->
    <el-submenu :index="item.id +''" v-for= "item in menulist" :key="item.id">
          <!-- index只能接受字串 -->
          <!-- 第一層菜單的模板 -->
        <template slot="title">
            <!-- 圖標 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 標題 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 第二層菜單 -->
       <el-menu-item 
       :index="'/'+subItem.path" 
       :key="subItem.id" 
       v-for="subItem in item.children"
        @click="saveNavState('/'+subItem.path)">
            <template slot="title">
            <!-- 圖標 -->
          <i class="el-icon-menu"></i>
          <!-- 標題 -->
          <span>{{subItem.authName}}</span>
        </template>
       </el-menu-item>
       
    </el-submenu>
      
    </el-menu>
    </el-aside>
     <!-- 主要內容 -->
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container></template>

<script>
export default {
    data(){
       return{
           menulist:[],
           iconsObj:{
               '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'   
           },
           isCollapse:false,
           activePath:'',
        }
    },
    created(){
        this.getMenuList()
        console.log(this.$router)
        this.activePath=window.sessionStorage.getItem('activePath')
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        async getMenuList(){
            const {data:res}=await this.$http.get('menus')
            console.log(res)
            if(res.meta.status!==200)return this.$message.error(res.meta.msg)
            this.menulist=res.data
        },
        //菜單的折疊與展開
        toggleCollapse(){
            this.isCollapse=!this.isCollapse
        },
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath=activePath
        }
    }
}
</script>

<style>
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0px;
    align-items: center;
    color: white;
    font-size: 20px;  

}
.el-menu{
    border-right: none;
}
.el-header div{
    display: flex;
    align-items: center;    
}
.el-header span{
    margin-left: 15px
    }
.el-aside{
    background-color: #333744
}
.el-main{
    background-color: #eaedf1
}
.home-container{
    height: 100%;
}
.iconfont {
    margin: 10px;
}
.toggle-button{
    background-color: #4A5064;
    text-align: center;
    font-size: 10px;
    line-height: 24px;
    color: white;
    letter-spacing: 0.2em;
    cursor:pointer;
}
</style>