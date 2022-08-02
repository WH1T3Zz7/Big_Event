//导入express
const express = require('express');
//创建服务器的实例对象
const app = express();
//导入验证数据的中间件
const joi = require('joi');
//导入配置文件
const config = require('./config')
//解析token的中间件
const expressJWT = require('express-jwt')
// 导入 cors 中间件
const cors = require('cors');
// 将 cors 注册为全局中间件
app.use(cors())

//配置解析表单数据的中间件,只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({ extended: false }));

//响应数据的中间件
app.use(function(req,res,next){
    //status = 0为成功； status = 1 为失败; 默认将status的值设置为1，方便处理失败的情况
    res.cc = function(err,status = 1){
        res.send({
            //状态
            status,
            //状态描述
            message:err instanceof Error ? err.message : err,
        });
    };
    next();
});

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))


//导入并注册用户路由模块
const userRouter = require('./router/user');
app.use('/api',userRouter);
//导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
//注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my',userinfoRouter)

//验证错误中间件
app.use(function (err,req,res,next){
    //数据验证失败
    if(err instanceof joi.ValidationError) return res.cc(err);
    //捕获身份验证失败的错误
    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    //未知错误
    res.cc(err);
});

//启动服务
app.listen(3007,function() {
    console.log('api server running server 127.0.0.1:3007');
})