const express = require('express')
const router = express.Router()


//引入MySQL数据库中间件
var mysql      = require('mysql');
// 引入数据量工具类
var db=require('../config/db');

//设置跨域访问
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
router.get('/test2',(req,res)=>{
    res.json({msg:'123'})
})

// router.get('/courselist', (req, res) => {
//     let _this = this;
//     const getHomeStr = `select c.course_id,c.course_name,c.course_total,c.course_time,c.course_grade,c.course_state,
//     t.teacher_name,t.teacher_id from course c INNER JOIN teacher t ON t.teacher_id = c.teacher_id where course_state = 1`;
//     db.query(getHomeStr, (err, data) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('database err').end();
//         } else {
//             if (data.length == 0) {
//                 res.status(500).send('no datas').end();
//             } else {
                
//                 res.status(200).send(data);
//             }
//         }
//     });
// });





module.exports=router