import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import ElementUI from 'element-ui';
import './assets/font/iconfont.css';
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//引入NPROGRESS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(ElementUI)
Vue.use(VueQuillEditor)
//配置請求的路徑

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  NProgress.start()
  console.log(config)
  //HEADER添加Authorization屬性 這樣後端才知道登入與否決定權限 第一次時值為NULL
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})


//在response攔截器中隱藏進度條 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http=axios;
Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)
Vue.filter('dateFormat',function(originVal){
  const dt=new Date(originVal);
  const y=dt.getFullYear();
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')

  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
