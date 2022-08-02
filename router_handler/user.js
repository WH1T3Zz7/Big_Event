/*
    在这里定义和用户相关的路由处理函数，供/router/user.js 模块进行调用
*/
//导入数据库:
const db = require('../db/index')
//导入bcryptjs
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
//导入配置文件
const config = require('../config');

//注册用户的处理函数
exports.regUser = function(req,res){
    //判断用户名与密码是否为空
    const userinfo = req.body;
    // console.log(userinfo);
    // if(!userinfo.username || !userinfo.password){
    //     return res.cc('输入的格式有误，请重新输入！')
    // }
    //执行SQL语句并根据结果判断用户名是否被占用:
    //定义SQL语句:
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr,userinfo.username,function(err,results){
        //执行SQL语句失败
        if(err){
            return res.cc('查询用户失败，请重新输入！');
        }
            //用户名被占用
        if(results.length > 0){
            return res.cc('用户名被占用,请更换其他用户名!');
        }
        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password,10);
        const sqlStr = 'insert into ev_users set ?'
        db.query(sqlStr,{username:userinfo.username,password:userinfo.password},function(err,results){
            //执行SQL语句失败
            if(err) return res.cc(err);
            //SQL语句执行成功，但影响行数不为1
            if(results.affectedRows !== 1){
                return res.cc('注册用户失败,请稍后再试！')
            };
            res.cc('注册成功！')
            // console.log(userinfo.password);
        });
    });
};

<<<<<<< HEAD
//登录的处理函数1
=======
//登录的处理函数
>>>>>>> 3eb87f8d2a0a71f713399cb48162c31e4be518f9
exports.login = (req,res) => {
    const userinfo = req.body;
    const sqlStr = 'select * from ev_users where username=?';
    db.query(sqlStr,userinfo.username,function(err,results){
        //执行SQL语句失败
        if(err) return res.cc(err);
        //执行SQL语句成功，但是查询到数据不等于1
        if(results.length !== 1) return res.cc('登录失败！');
        //判断用户输入的登录密码是否和数据库中的密码一致
        //拿着用户输入的密码，和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password,results[0].password);
        //如果对比的结果等于False,则证明用户输入的密码错误
        if(!compareResult){
            console.log(compareResult);
            return res.cc('登录失败！')
        };
<<<<<<< HEAD
        //登录成功，生成 Token 字符串1
=======
        //登录成功，生成 Token 字符串
>>>>>>> 3eb87f8d2a0a71f713399cb48162c31e4be518f9
        //剔除密码和头像的值剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
        const user = {...results[0],password:'',user_pic:''};
        //生成ToKen字符串
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{
            expiresIn:'10h',    //有效期为10个小时
        });
        res.send({
            status:0,
            message:'登录成功!',
            //为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token:'Bearer ' + tokenStr,
        })
    });
};