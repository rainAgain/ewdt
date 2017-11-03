import Main from '../views/Main'

const Home = r => require.ensure([], () => r(require('../views/home/Home')), 'js/home')
const Serve = r => require.ensure([], () => r(require('../views/serve/Serve')), 'js/serve')
const Auto = r => require.ensure([], () => r(require('../views/auto/Auto')), 'js/auto')
const Config = r => require.ensure([], () => r(require('../views/config/Config')), 'js/config')
const Example = r => require.ensure([], () => r(require('../views/example/Example')), 'js/example')

export default [{
    path: '/',
    component: Main,
    children: [
        {path: '', redirect: '/home'},//地址为空时跳转home页面
        {path: 'home', name: 'home', component: Home},//主页
        {path: 'serve', name: 'serve', component: Serve},//启动服务器
        {path: 'auto', name: 'auto', component: Auto},  //一键生成
        {path: 'config', name: 'config', component: Config},  //配置页
        
        {path: 'example', name: 'example', component: Example}//栗子
    ]
}]
