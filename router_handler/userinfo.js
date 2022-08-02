const { result } = require('@hapi/joi/lib/base');
const db = require('../db/index');
const router = require('../router/user');
const bcrypt = require('bcryptjs')

//获取用户基本信息的处理函数
exports.getUserInfo = function(req,res){
    // 导入数据库操作模块
    const db = require('../db/index');
    // 根据用户的 id，查询用户的基本信息
    // 注意：为了防止用户的密码泄露，需要排除 password 字段
    const sqlStr = 'select id, username,nickname,email,user_pic from ev_users where id=?';
    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    db.query(sqlStr,req.user.id,function(err,results){
        //1.执行SQL语句失败
        if(err) return res.cc(err);
        
        //2.执行SQL语句成功，但是查询到的数据条数不等于1
        if(results.length !== 1) return res.cc('获取用户信息失败！');

        //3.将用户信息相应给客户端
        res.send({
            status:0,
            message:'获取用户基本信息成功！',
            data:results[0],
        });
    });
};

<<<<<<< HEAD
//更新用户基本信息的处理函数1
=======
//更新用户基本信息的处理函数
>>>>>>> 3eb87f8d2a0a71f713399cb48162c31e4be518f9
exports.updateUserInfo = function(req,res){
    const sqlStr = 'update ev_users set ? where id=?'
    db.query(sqlStr,[req.body,req.body.id],function(err,results){
        //执行SQL语句失败
        if(err) return res.cc(err);
        //执行SQL语句成功,但影响行数不为1
        if(results.affectedRows !== 1) return res.cc('修改用户基本信息失败！');

        //修改用户信息成功
        return res.cc('修改用户基本信息成功！',0);
    });
};

//重置密码的处理函数
exports.updatePassword = function(req,res){
    //定义根据ID查询用户数据的SQL语句
    const sqlStr = 'select * from ev_users where id=?';
    //执行SQL语句查询用户是否存在
    db.query(sqlStr,req.user.id,function(err,results){
        //执行SQL语句失败
        if(err) return res.cc(err);
        //检查指定id的用户是否存在
        if(results.length !== 1) return res.cc('用户不存在！')
        // 在头部区域导入 bcryptjs 后，
        // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
        // compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
        //判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd,result[0].password);
        if(!compareResult) return res.cc('原密码错误！')
        //定义更新用户密码的SQl语句
        const sqlStr = 'update ev_users set password=? where id=?'
        //对新密码进行bcrypt加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd,10);
        //执行SQL语句，根据id更新用户的密码
        db.query(sqlStr,[newPwd,req.user.id],(err,result))
    });
};