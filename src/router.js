import Vue from 'vue'
import Router from 'vue-router'
//import Login from './components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')
//import Home from './components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Home.vue')
// import Welcome from './components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')

//import Users from './components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "users_rights_roles" */ './components/user/Users.vue')
//import Rights from './components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ './components/power/Rights.vue')
//import Roles from './components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ './components/power/Roles.vue')
//import Cate from './components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "cate_params_goodslist_goodsadd" */ './components/goods/Cate.vue')
//import Params from './components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "cate_params_goodslist_goodsadd" */ './components/goods/Params.vue')
//import GoodsList from './components/goods/List.vue'
const GoodsList = () => import(/* webpackChunkName: "cate_params_goodslist_goodsadd" */ './components/goods/List.vue')
//import Add from './components/goods/Add.vue'
const Add = () => import(/* webpackChunkName: "cate_params_goodslist_goodsadd" */ './components/goods/Add.vue')
//import Order from './components/order/Order.vue'
const Order = () => import(/* webpackChunkName: "order_report" */ './components/order/Order.vue')
//import Report from './components/report/Report.vue'
const Report = () => import(/* webpackChunkName: "order_report" */ './components/report/Report.vue')
Vue.use(Router)

const router= new Router({
  
  routes: [
    {
      path:'/',
      redirect:'/login'//如果是跳到不同路徑這樣寫
    },
    {
      path:'/login',
      component:Login,
    },
    {
      path:'/home',
      component:Home,
      redirect:'/welcome',//跳到子組件不用寫成/HOME/WELCOME 
      children:[
        {
          path:'/Welcome',
          component:Welcome
        },
        {
          path:'/users',
          component:Users,
        },
        {
          path:'/rights',
          component:Rights,
        },
        {
          path:'/roles',
          component:Roles,
        },
        {
          path:'/categories',
          component:Cate,
        },
        {
          path:'/params',
          component:Params,
        },
        {
          path:'/goods',
          component:GoodsList,
        }, 
        {
          path:'/goods/add',
          component:Add,
        },
        {
          path:'/orders',
          component:Order,
        },
        {
          path:'/reports',
          component:Report,
        },
      ]
    }
  ]
})
router.beforeEach((to,from,next)=>{
  //to是將要訪問的路徑
  //FROM代表從哪個路徑跳轉
  //NEXT為一個函數 表示通過套跳轉
  //next()通過 next('/login')強制挑轉設定的頁面
  if(to.path==='/login') return next()
  let tokenStr=window.sessionStorage.getItem('token')
   if(!tokenStr){
    return next('/login')
  }
  next()
})
export default router