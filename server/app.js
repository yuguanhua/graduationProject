const express=  require('express')

const app = express()
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
//引入body-parser，获取post请求数据
const bodyParser = require('body-parser')

//配置body-parser
// const jsonParser = bodyParser.json()
// const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const port = 5000;

//deal (cookie,session)
(() => {
    app.use(cookieParser());
    let keyArr = [];
    for (let i = 0; i < 100000; i++) {
        keyArr[i] = "xsa_" + Math.random() * 100 + i;
    }
    app.use(cookieSession({
        name: "hc",
        keys: keyArr,
        // maxAge: 30 * 60 * 1000
        maxAge: 20*3600*1000
    }))
})();


const admin=  require('./router/admin')
const mobile=  require('./router/mobile')
//注册API路由
app.use('/api',admin)
app.use('/api',mobile)



app.listen(port,()=>{
console.log('服务器开启')
})


