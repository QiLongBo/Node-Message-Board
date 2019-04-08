
var template = require('art-template');
var fs = require('fs');
var http  = require('http');
var url = require('url');
//引入时间 ---- 需要导包 npm install silly-datetime
var sd = require('silly-datetime');


var server = http.createServer();
var messages =[
    {
     name:'Code',
     msg:'Computer',
     dataTime:'2019-4-8 21:22:11'
    },
    {
        name:'Code2',
        msg:'Computer',
        dataTime:'2019-4-8 21:22:11'
    },
    {
        name:'Code3',
        msg:'Computer',
        dataTime:'2019-4-8 21:22:11'
    }

    
]

//1.创建 Server
var server = http.createServer();
//2.监听Server的request
server.on('request',function(req,res){

    var parseObj = url.parse(req.url,true);
    var pathname = parseObj.pathname;
    
    if(pathname==='/'){
        fs.readFile('./views/index.html',function(err,data){
            if(err){
                res.end('404 Not Found');
            }

            var htmlStr = template.render(data.toString(),{
                messages:messages
            })

            res.end(htmlStr);
        })      
    }else if(pathname==='/post'){
        fs.readFile('./views/post.html',function(err,data){
            if(err){
                res.end('404 Not Found');
            }
            res.setHeader('Content-type','text/html;charset=utf-8');
            res.end(data);
        })
    }else if(pathname.indexOf('/public/')===0){
        fs.readFile('.'+ pathname,function (err,data){
            if(err){
                res.end('404 Not Found');
            }
            res.end(data);
        });
    }else if(pathname==='/pinglun'){

        //一次请求对应一次响应，响应结束 请求也就结束
        //res.end(JSON.stringify(parseObj.query));
        // console.log('shoudao',parseObj.query)
        var add = parseObj.query;
        var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm');
        add.dataTime = time;
        
        //服务器临时储存 //接下来重定向
        messages.push(add);

        //通过服务器让客户端重定向
        //状态码设置为 302为重定向
            //->statusCode
        //响应头中Location 向哪儿重定向
        //    ->setHeader
        res.statusCode = 302;
        //重定向
        res.setHeader('Location','/');
        //结束响应
        res.end();
    }else{
        res.setHeader('Content-type','text/html;charset=utf-8');
        res.end("<h1>抱歉，您访问的页面失联了</h1>");
    }
});
//3.绑定端口号
server.listen(3000,function(){
    console.log('服务器启动了');
})