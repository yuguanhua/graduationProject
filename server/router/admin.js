const express = require('express')
const router = express.Router()
var moment = require('moment')
//引入body-parser，获取post请求数据
// const bodyParser = require('body-parser')

// //配置body-parser
// const jsonParser = bodyParser.json()
// const urlencodedParser = bodyParser.urlencoded({ extended: false })



//引入MySQL数据库中间件
var mysql      = require('mysql');
// 引入数据量工具类
var db=require('../config/db');

// var $sql=require('../config/sql');



//设置跨域访问
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

router.get('/test',(req,res)=>{
    res.json({msg:'123'})
})
router.post('/register', (req, res) => {

    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    // console.log(mObj)
    let regName = mObj.regName;
    let regPwd = mObj.regPwd;
    let role=mObj.regrole;
    let regPhone = mObj.regPhone;
    // console.log(role)
    // regPwd = common.md5(regPwd + common.MD5_SUFFXIE);
    const insUserInfo = `INSERT INTO user(role_id,user_name,user_pwd,user_phone) VALUES ('${role}','${regName}','${regPwd}','${regPhone}')`;
    // const inStudentInfo = `INSERT INTO user(role_id,user_name,user_pwd) VALUES ('${role}','${regName}','${regPwd}')`;
    delReg(insUserInfo, res);
});
/*igao
 *deal user register
 */
function delReg(insUserInfo, res) {
    db.query(insUserInfo, (err) => {
        if (err) {
            console.error(err);
            res.send({ 'msg': '服务器出错', 'status': 0 }).end();
        } else {
            res.send({ 'msg': '注册成功', 'status': 1 }).end();
        }
    })
};

/*igao
 *deal user register
 */
function studentReg(inStudentInfo, res) {
    db.query(inStudentInfo, (err) => {
        if (err) {
            console.error(err);
            res.send({ 'msg': '服务器出错', 'status': 0 }).end();
        } else {
            res.send({ 'msg': '注册成功', 'status': 1 }).end();
        }
    })
};



router.post('/login', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let username = mObj.loginName;
    let password =mObj.loginPwd;
    const selectUser = `SELECT * FROM user where user_name='${username}'`;
    db.query(selectUser, (err, data) => {
        if (err) {
            //console.log(err);
            res.send({ 'msg': '服务器出错', 'status': 0 }).end();
        } else {
            // console.log(selectUser)
            if (data.length == 0) {
                res.send({ 'msg': '该用户不存在', 'status': -1 }).end();
            } else {
                let dataw = data[0];
                //login sucess
                if (dataw.user_pwd === password) {
                    // save the session 
                    req.session['user_id'] = dataw.user_id;
                    dataw.msg = "登录成功";
                    dataw.status = 1;
                    res.send(dataw).end();
                } else {
                    res.send({ 'msg': '密码不正确', 'status': -2 }).end();
                }
            }
        }
    });
});
router.post('/logout', (req, res, next) => {
    req.session.username = ""; // 清除session
    req.session.password = "";
    res.end('{"success": "true"}');
})
    //get homePage datas
    //课程列表
router.get('/courselist', (req, res) => {
    let _this = this;
    // var current_page = 1; //默认为1
    // var num = 9; //一页条数
    // if (req.query.page) {
    //     current_page = parseInt(req.query.page);
    // }
    // var last_page = current_page - 1;
    // if (current_page <= 1) {
    //     last_page = 1;
    // }
    // var next_page = current_page + 1;
    // var getHomeStr=getHomeStr+num+'offset'+num*(current_page-1)
    const getHomeStr = `select c.course_id,c.course_name,c.course_total,c.course_time,c.course_grade,c.course_state,
    t.teacher_name,t.teacher_id from course c INNER JOIN teacher t ON t.teacher_id = c.teacher_id where course_state = 1`;
    getHomeDatas(getHomeStr, res);
    // last_page: last_page,
    // next_page: next_page,
    // current_page: current_page,
});
function getHomeDatas(getHomeStr, res) {
    db.query(getHomeStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                
                res.status(200).send(data);
            }
        }
    });
}
//删除课程
router.post('/delcourse', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
        
    }
    let course_id=mObj.course_id
    console.log(course_id)
    const adminStr = `update course set course_state = -1 where course_id ='${course_id}' `;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//修改课程信息
router.post('/upcourse', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
        
    }
    let course_id=mObj.course_id;
    let course_name=mObj.course_name;
    let course_state=mObj.course_state;
    let course_grade=mObj.course_grade;

    const adminStr = `update course set course_name = '${course_name}',course_state= '${course_state}',course_grade = '${course_grade}' where course_id ='${course_id}' `;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
// 查看学生所有课程
router.post('/stucourse', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
        
    }
    let user_id=mObj.user_id;
    // console.log(user_id)
    const adminStr = `select cc.course_id,c.course_name,c.course_term,c.course_year,c.course_time,c.course_grade,c.course_state,c.course_total,t.teacher_name 
    FROM class_course cc INNER JOIN course c ON cc.course_id = c.course_id
     INNER JOIN teacher t ON c.teacher_id = t.teacher_id
    where cc.class_id = (select s.class_id
     FROM student s where s.user_id = '${user_id}')`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//查询班级列表
router.get('/classlist', (req, res) => {
    const adminStr = `select * from class;`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
// 补充学生资料
router.post('/studentinfo', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let user_id = mObj.user_id;
    let class_id = mObj.class_id;
    let student_name = mObj.student_name;
    let student_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') ;
    const inStudentInfo = `INSERT INTO student(user_id,class_id,student_name,student_time) VALUES ('${user_id}','${class_id}','${student_name}','${student_time}')`;
    db.query(inStudentInfo, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
});
// 补充老师资料
router.post('/teacherinfo', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let user_id = mObj.user_id;
    // let class_id = mObj.class_id;
    let teacher_name = mObj.student_name;
    let teacher_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') ;
    const inStudentInfo = `INSERT INTO teacher(user_id,teacher_name,teacher_time) VALUES ('${user_id}','${teacher_name}','${teacher_time}')`;
    db.query(inStudentInfo, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
});


//问答列表
router.get('/issuelist', (req, res) => {
    const adminStr = `select * from issue i INNER JOIN student s ON s.student_id = i.student_id WHERE issue_del=1 order by i.issue_time desc;`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
// 查看问题issue详情
router.get('/issuedetail', (req, res) => {
    let issue_id = req.query.issue_id;
    // console.log(issue_id)
    const answerStr = `select u.*,a.* from answer a INNER JOIN user u ON a.user_id = u.user_id WHERE issue_id='${issue_id}'`;
    const issueStr = `select * from issue i INNER JOIN student s ON s.student_id = i.student_id WHERE issue_id='${issue_id}'`;
    let detailDatas = [];
    db.query(issueStr, (err, issueDatas) => {
        if (err) {
            console.error(err);
            res.status(500).send('database err').end();
        } else {
            // res.send(issueDatas)
            detailDatas.push(issueDatas);
            // console.log(issueDatas)
            db.query(answerStr, (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('database err').end();
                } else {
                    detailDatas.push(data);
                    res.send(detailDatas);
                    // console.log(detailDatas)
                }
            });
        }
    });
});

// 删除问答列表
router.post('/delissue', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let issue_id=mObj.issue_id
    console.log(issue_id)
    const adminStr = `update issue set issue_del = -1 where issue_id ='${issue_id}' `;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//模糊查询问答列表
router.post('/issdata', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let value = mObj.issue_title;
    const adminStr = `select * from issue i INNER JOIN student s ON s.student_id = i.student_id where issue_title like '%${value}%';`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
router.get('/addlist', (req, res) => {
    // let mObj = {};
    // for (let obj in req.body) {
    //     mObj = JSON.parse(obj);
        
    // }
    let user_id=req.query.user_id;
    // console.log(user_id)
    const adminStr = `select student_id from student WHERE user_id='${user_id}'`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
// 新增问答
router.post('/addswap', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let issue_title = mObj.issue_title;
    let issue_content = mObj.issue_content;
    let student_id = mObj.student_id;  
    let issue_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') 
    // const userstr=`select student_id from student WHERE user_id='${user_id}'`
const adminStr = `INSERT INTO issue (student_id,issue_content,issue_title,issue_time) VALUES ('${student_id}','${issue_content}','${issue_title}','${issue_time}')`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})



//查询成绩列表
router.get('/gradelist', (req, res) => {
    const adminStr = `select s.student_name,g.course_grades,c.course_name,g.grade_id
	from student s INNER JOIN grade g ON s.student_id = g.student_id
	LEFT JOIN course c ON g.course_id=c.course_id where grade_state=1`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//模糊查询成绩列表
router.post('/gradedata', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let student_name = mObj.student_name;
    let course_name =mObj.course_name;
    const adminStr = `select s.student_name,g.course_grades,c.course_name,g.grade_id
	from student s INNER JOIN grade g ON s.student_id = g.student_id
	LEFT JOIN course c ON g.course_id=c.course_id where (s.student_name like '%${student_name}%' or c.course_name like '%${course_name}%') and g.grade_state=1;`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//修改学生成绩信息
router.post('/updategrade', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let course_grades=mObj.course_grades;
    let grade_id=mObj.grade_id
    // console.log(course_grades)
    const adminStr = `update grade set course_grades= '${course_grades}' where grade_id ='${grade_id}' `;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
// 删除学生成绩
router.post('/delgrade', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj)
    }
    let grade_id=mObj.grade_id
    const adminStr = `update grade set grade_state = -1 where grade_id ='${grade_id}' `;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
// 新增学生成绩
router.post('/addgrade', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let student_id = mObj.student_id;
    let course_id = mObj.course_id;
    let course_grades = mObj.course_grades;   
const adminStr = `INSERT INTO grade (student_id,course_id,course_grades) VALUES ('${student_id}','${course_id}','${course_grades}')`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//查看答疑信息
router.get('/answerlist', (req, res) => {
    const adminStr = `select * from answer a INNER JOIN issue i ON a.issue_id = i.issue_id;`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//模糊查询答疑列表
router.post('/answerdata', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
        
    }
    // console.log(mObj)
    let value = mObj.adminname;
    const adminStr = `SELECT * from answer where role_id = 1 and user_name like '%${value}%';`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
// 新增答疑评论
router.post('/addanswer', (req, res) => {
    // let issue_id = req.query.issue_id;
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let user_id = mObj.user_id;
    let issue_id = mObj.issue_id;
    let answer_content = mObj.answer_content; 
    let answer_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')  
    console.log(issue_id)
    console.log(user_id)
    console.log(answer_content)
    console.log(answer_time)
const adminStr = `INSERT INTO answer (user_id,issue_id,answer_content,answer_time) VALUES ('${user_id}','${issue_id}','${answer_content}','${answer_time}')`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//查看通知列表
router.get('/informlist', (req, res) => {
    let user_id = req.query.user_id;
    // console.log(user_id)
    const adminStr = `select u.user_name,us.user_name, i.inform_id,i.inform_content,i.inform_time,i.inform_state from inform i inner join user u on 
    u.user_id = i.accept_id inner join user us on us.user_id = i.user_id
    where i.accept_id = '${user_id}' and i.inform_state!=0 order by i.inform_time desc;`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
// 查看通知详情
router.get('/informdetail', (req, res) => {
    let inform_id = req.query.inform_id;
    // console.log(issue_id)
    const informStr = `select u.*,i.* from inform i INNER JOIN user u ON i.user_id = u.user_id WHERE inform_id='${inform_id}'`;
   
    // let detailDatas = [];
    db.query(informStr, (err, informDatas) => {
        if (err) {
            console.error(err);
            res.status(500).send('database err').end();
        } else {
            res.send(informDatas)        
            // console.log(informDatas)
        }
    });
});
//读信息通知（标志为已读）
router.get('/readinform', (req, res) => {
    let inform_id=req.query.inform_id;
    // console.log(inform_id)
    const adminStr = `update inform set inform_state = -1 where inform_id ='${inform_id}' `;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})

//查询作业列表
router.get('/homeworklist', (req, res) => {
    const adminStr = `select c.course_name,h.homework_id,h.homework_content,cl.class_name from homework h INNER JOIN course c ON 
    h.course_id = c.course_id LEFT JOIN class cl ON cl.class_id=h.class_id`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})



//查询学生签到列表
router.get('/stuchecklist', (req, res) => {
    const adminStr = `select h.stucheck_id,h.stucheck_time,c.course_name,c.course_time,
    c.course_total,s.student_name,s.student_time,s.student_state from stucheck h INNER JOIN course c ON c.course_id = h.course_id
	LEFT JOIN student s ON h.student_id=s.student_id where stucheck_state=1`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//模糊查询学生签到列表
router.post('/stucheckdata', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let student_name = mObj.student_name;
    let course_name =mObj.course_name;
    const adminStr = `select h.stucheck_id,h.stucheck_time,c.course_name,c.course_time,
    c.course_total,s.student_name,s.student_time,s.student_state from stucheck h INNER JOIN course c ON c.course_id = h.course_id
	LEFT JOIN student s ON h.student_id=s.student_id where (c.course_name like '%${course_name}%' or s.student_name like '%${student_name}%') and stucheck_state=1`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
// 删除学生签到列表
router.post('/delstucheck', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj)
    }
    let stucheck_id=mObj.stucheck_id
    const adminStr = `update stucheck set stucheck_state = -1 where stucheck_id ='${stucheck_id}' `;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
// 新增学生签到（课程签到）
router.post('/addstucheck', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let student_id = mObj.student_id;
    let course_id = mObj.course_id;
    // let stucheck_time = new Date().getTime();
    var stucheck_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    console.log(stucheck_time)
    // console.log(course_id)

const adminStr = `INSERT INTO stucheck (course_id,student_id,stucheck_time) VALUES ('${course_id}','${student_id}','${stucheck_time}')`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
// 查找登录的是谁
router.post('/stulogin', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let user_id = mObj.user_id;
    const adminStr = `select s.student_id,s.student.name from user u INNER JOIN student s ON 
       s.user_id = '${user_id}'`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})




//查询教师考勤列表
router.get('/teachecklist', (req, res) => {
    const adminStr = `select t.teacheck_id,t.teacheck_time,t.teacheck_state,c.course_name,c.course_time,
    c.course_total,h.teacher_name,h.teacher_time,h.teacher_state from teacher_check t INNER JOIN course c ON c.course_id = t.course_id
	LEFT JOIN teacher h ON t.teacher_id=h.teacher_id where t.teacheck_state=1`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//模糊查询教师考勤列表
router.post('/teacheckdata', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
    }
    let teacher_name = mObj.teacher_name;
    let course_name =mObj.course_name;
    const adminStr = `select t.teacheck_id,t.teacheck_time,t.teacheck_state,c.course_name,c.course_time,
    c.course_total,h.teacher_name,h.teacher_time,h.teacher_state from teacher_check t INNER JOIN course c ON c.course_id = t.course_id
	LEFT JOIN teacher h ON t.teacher_id=h.teacher_id where (c.course_name like '%${course_name}%' or h.teacher_name like '%${teacher_name}%') and teacheck_state=1`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
// 删除教师考勤列表
router.post('/delteacheck', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj)
    }
    let teacheck_id=mObj.teacheck_id
    const adminStr = `update teacher_check set teacheck_state = -1 where teacheck_id ='${teacheck_id}' `;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})




// //查询教师签到列表
// router.get('/teachecklist', (req, res) => {
//     const adminStr = `select c.course_name,h.homework_id,h.homework_content from homework h INNER JOIN course c ON 
//     h.course_id = c.course_id`;
//     db.query(adminStr, (err, data) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('database err').end();
//         } else {
//             if (data.length == 0) {
//                 res.status(500).send('no datas').end();
//             } else {
//                 res.send(data);
//             }
//         }
//     });
// })


//查询管理员列表
router.get('/adminlist', (req, res) => {
    const adminStr = `SELECT * from user where role_id = 1 and user_state = 1;`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//模糊查询管理员列表
router.post('/admindata', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
        
    }
    // console.log(mObj)
    let value = mObj.adminname;
    const adminStr = `SELECT * from user where role_id = 1 and user_name like '%${value}%';`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//删除管理员
router.post('/deladmin', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
        
    }
    let user_id=mObj.user_id
    // console.log(user_id)
    const adminStr = `update user set user_state = -1 where user_id ='${user_id}' `;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//修改管理员信息
router.post('/updateadmin', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
        
    }
    let user_id=mObj.aid;
    let user_name=mObj.adname;
    let user_phone=mObj.adphone

    const adminStr = `update user set user_name = '${user_name}',user_phone= '${user_phone}' where user_id ='${user_id}' `;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//查询老师列表
router.get('/tealist', (req, res) => {
    const teaStr = `select * from teacher;`;
    db.query(teaStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//模糊查询老师列表
router.post('/teadata', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
        
    }
    // console.log(mObj)
    let value = mObj.teaname;
    const adminStr = `SELECT * from teacher where  teacher_name like '%${value}%';`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})

//修改老师信息
router.post('/updatetea', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
        
    }
    let teacher_id=mObj.teaid;
    let teacher_name=mObj.teaname;
    let teacher_state=mObj.teastate;
    // let teacher_time=mObj.time;
    // console.log(teacher_id)
    const adminStr = `update teacher set teacher_name = '${teacher_name}',teacher_state= '${teacher_state}' where teacher_id ='${teacher_id}' `;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//查询学生列表
router.get('/stulist', (req, res) => {
    const teaStr = `select * from student;`;
    db.query(teaStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})
//模糊查询学生列表
router.post('/studata', (req, res) => {
    let mObj = {};
    for (let obj in req.body) {
        mObj = JSON.parse(obj);
        
    }
    // console.log(mObj)
    let value = mObj.stuname;
    const adminStr = `SELECT * from student where student_name like '%${value}%';`;
    db.query(adminStr, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('database err').end();
        } else {
            if (data.length == 0) {
                res.status(500).send('no datas').end();
            } else {
                res.send(data);
            }
        }
    });
})

//修改管理员信息
// router.get('/adminlist', (req, res) => {
//     const adminStr = `SELECT * from user where role_id = 1;`;
//     db.query(adminStr, (err, data) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('database err').end();
//         } else {
//             if (data.length == 0) {
//                 res.status(500).send('no datas').end();
//             } else {
//                 res.send(data);
//             }
//         }
//     });
// })
module.exports=router