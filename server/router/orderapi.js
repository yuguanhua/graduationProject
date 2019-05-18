const express = require('express')
const router = express.Router()
//引入body-parser，获取post请求数据
const bodyParser = require('body-parser')

//配置body-parser
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })



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

router.get('/test',(req,res)=>{
    res.json({msg:'123'})
})

//收银员注册：
//注册查询
function regs(name){
    return new Promise((resolve,reject)=>{
       
        db.query('select * from user where username=?',name,(data,filed)=>{
         //   console.log(data)
            resolve(data)
        })
    })
}
//存入数据库
function regStr(name){
    return new Promise((resolve,reject)=>{
        db.query('insert into user(username,password,mail) values(?,?,?)',name,function(data,field){
            resolve(data)
        })
    })
}
//注册请求
router.post('/register',(req,res)=>{
    let jsn=JSON.parse(req.query.listStr)
    let num=[]
        num.push(jsn.userName)
        num.push(jsn.userPasswords)
        num.push(jsn.userMail)
    let abc=[]
        abc.push(jsn.userName)    
        async function strR(){
           // 
            let s9=await regs(abc)
            console.log(s9.length)
            if(s9.length==1){
                res.json({'code':1})
            }else{
                let s9=await regStr(num)
                res.json({'code':0})
            }   
        }         
      strR()   
})
//登录验证
router.post('/loading',(req,res)=>{
    let jsn=JSON.parse(req.query.listStr)
    let num=[]
        num.push(jsn.userName)
        async function strR(){
            // 
             let s9=await regs(num)
           //  console.log(s9.password)
             if(s9.length==0){
                res.json({'code':1})
             }else{
                if(s9[0].password==jsn.userPasswords){
                    
                    res.json({'code':0})
                }else{
                    res.json({'code':2})
                }
             }
        }
        strR()
})
//添加文字分类
router.post('/newclass',(req,res)=>{
   let arr=[]
        arr.push(req.query.fenlei)
   new Promise((resolve,reject)=>{
        db.query('select * from class where fenlei=?',arr,function(res,field){
            resolve(res)
            })
        }).then(data=>{
            if(data.length==0){
                db.query('insert into class(fenlei) values(?)',arr,function(res,field){
                    //console.log('添加成功')
                   return Promise.resolve()
                })   
            }else{
                    //console.log('添加失败')
                    return Promise.reject('添加失败')
            }
        }).then(data=>{
            if(!data){
                db.query('select * from class order by id desc',[],function(rest,field){
                    //console.log(rest)
                    let str={}
                        str.code=0;
                        str.data=rest
                    res.json(str)
                    })
            }
            
        }).catch(err=>{
                let str={}
                    str.code=1;
                    str.data='添加失败'
                res.json(str)
        })

})

//查询分类：
router.post('/class',(req,res)=>{
   
        db.query('select * from class order by id desc',[],function(data,field){
                res.json(data)
                //console.log(data)
            })
            
})
//商品信息修改：
router.post('/changes',(req,res)=>{
    let str=JSON.parse(req.query.listStr)
        let arrs=[]
            
            arrs.push(str.listClass)
            arrs.push(str.listMoney)
            arrs.push(str.listName)
            arrs.push(str.id)
            console.log(arrs)
            db.query('update lists set listClass=?,listMoney=?,listName=? where id=?',arrs,function(data,field){
                res.json({'code':0})
            })
            
})
//商品信息删除：
router.post('/dalate',(req,res)=>{
    let str=JSON.parse(req.query.listStr)
        let arrs=[]
            
            arrs.push(str)
           
            db.query('delete from lists where id=?',arrs,function(data,field){
                res.json({'code':0})
            })
            
})
//分类信息删除
function dele(arrs){
    return new Promise((resolve,reject)=>{
        db.query('delete from class where id=?',arrs,function(data,field){
            resolve(data)
        })
    })
}
function delelist(arrs){
    return new Promise((resolve,reject)=>{
        db.query('delete from lists where listClass=?',arrs,function(data,field){
            resolve(data)
        })
    })
}
router.post('/dalateclass',(req,res)=>{
    let str=JSON.parse(req.query.listStr)
        let arrs=[]
            arrs.push(str.id)

        let attr=[]
            attr.push(str.fenlei)

        async function alls(){
                let s1=await dele(arrs)
                let s2=await delelist(attr)
               // console.log(s2)
                res.json({'code':0})
        }
        alls()
           
            
            
})

//商品分页查询函数：
function listStrs(a,b){  //查询前a条
    return new Promise((resolve,reject)=>{
        let num=[]
            num.push(a)
            num.push(b)
        db.query('select * from lists order by id desc limit ?,?',num,function(data,field){
            resolve(data)  
        })
    })
}
function listPage(){  //查询共多少条
    return new Promise((resolve,reject)=>{
       
        db.query('select count(*) from lists',[],function(data,field){
            resolve(data)  
        })
    })
}
//添加商品：
router.post('/list',(req,res)=>{
        let str=[]
        let jsons=JSON.parse(req.query.listStr)

        for(let i in jsons){
            str.push(jsons[i])
        }
        //console.log(str)
        new Promise((resolve,reject)=>{
            db.query('insert into lists(listName,listMoney,listClass) values(?,?,?)',str,function(data,field){
                resolve()  
                })
        }).then(data=>{
            db.query('select * from lists order by id desc limit 7',[],function(data,field){
                    res.json(data)  
                })
        })       
})

//查询商品列表：
router.post('/listarr',(req,res)=>{
    //console.log('查询')
  /*  db.query('select * from lists order by id desc limit 3',[],function(data,field){
        res.json(data)
        //console.log(data)
    })
    */

    async function all(){
        let s1=await listStrs(0,7)
        let s2=await listPage()
        let lis={}
            lis.num=s2
            lis.str=s1
        res.json(lis)
    }
    all()
})

//商品分页点击获取事件：
router.post('/listpage',(req,res)=>{
    let num=req.query.nums*7
    async function all(){
        let s1=await listStrs(num,7)
        
        let lis={}
            
            lis.str=s1
        res.json(lis)
    }
    all()
})

//首页获取商品信息：
router.post('/indexshop',(req,res)=>{
    db.query('select * from lists order by id desc',[],function(data,field){
        res.json(data)
        //console.log(data)
    })
})

//商品订单信息存储：
router.post('/menuall',(req,res)=>{
        let menu=JSON.parse(req.query.menus)
        let arr=[]
            arr.push(JSON.stringify(menu.all))
            arr.push(menu.price)
            arr.push(menu.class)
            arr.push(menu.date)
            arr.push(menu.marks)
            arr.push(menu.state)
            console.log(arr)
       db.query('insert into menus(contents,price,class,times,marks,state) values(?,?,?,?,?,?)',arr,function(data,field){
           res.json({'code':0})
        })
     
   // console.log(arr)
   // res.json({'code':0})
})

//获取挂单类菜单信息

//1、分页查询函数

function arrearsStarts(a,b,c){  //查询前a条 b:起始数据 c: 查询几条 a: 查询类型
    return new Promise((resolve,reject)=>{
        let num=[]
            num.push(a)
            num.push(b)
            num.push(c)
        db.query('select * from menus where class=? order by id desc limit ?,?',num,function(data,field){
            resolve(data)  
        })
    })
}
//2、查询一共几条数据
function arrearsNum(a){  //查询前a条
    return new Promise((resolve,reject)=>{
        let num=[]
            num.push(a)
 
        db.query('select count(*) from menus where class=?',num,function(data,field){
            resolve(data)  
        })
    })
}

router.post('/arrears',(req,res)=>{
 /*   db.query('select * from menus where class=?',['2'],function(data,field){
        res.json(data)
    })
*/      let querys=JSON.parse(req.query.menus)
        //    console.log(querys.a)
        async function all(){
            let s1=await arrearsStarts(querys.a,querys.b,querys.c)
            let s2=await arrearsNum(querys.a)

            let jsons={}
                jsons.numbers=s2
                jsons.texts=s1
                res.json(jsons)
        }
        all()
})

router.post('/applys',(req,res)=>{  //改变状态
    let num=[]
        num.push(req.query.class)
        num.push(req.query.menus)
        console.log(num)
        db.query('update menus set class=? where id=?',num,function(data,field){
            res.json({'code':0})
         })
   // res.json({'code':1})
})


//订单查询：

//1、分页查询函数

function recordStarts(a,b){  //查询前a条 a:起始数据 b: 查询几条
    return new Promise((resolve,reject)=>{
        let num=[]
            num.push(a)
            num.push(b)
         
        db.query('select * from menus order by id desc limit ?,?',num,function(data,field){
            resolve(data)  
        })
    })
}
//2、查询一共几条数据
function recordNum(){  //查询前a条
    return new Promise((resolve,reject)=>{
        let num=[]
       
 
        db.query('select count(*) from menus',num,function(data,field){
            resolve(data)  
        })
    })
}

router.post('/records',(req,res)=>{
    /*   db.query('select * from menus where class=?',['2'],function(data,field){
           res.json(data)
       })
   */      let querys=JSON.parse(req.query.menus)
           //    console.log(querys.a)
           async function all(){
               let s1=await recordStarts(querys.a,querys.b)
               let s2=await recordNum()
   
               let jsons={}
                   jsons.numbers=s2
                   jsons.texts=s1
                   res.json(jsons)
           }
           all()
   })

   //小程序订单提交请求
   router.get('/program',(req,res)=>{   
              let y=JSON.parse(req.query.y)
                let x=req.query.x
                let numall=[]
                    numall.push(y.number)
                    numall.push(y.money)
                    
                    numall.push(x)
                    res.json({'code':1})
                    console.log(numall)
            // db.query('insert into program(number,money,centent) values(?,?,?)',numall,function(data,field){
              
          //   })
                
              
   })
module.exports=router