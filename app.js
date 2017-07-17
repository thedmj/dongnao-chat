var express = require("express");
var app = express();
var router = require("./routers/index");
var cors = require("cors");
var bodyParser = require("body-parser");
var multer = require("multer");
var socketio  = require("socket.io");
var http = require("http").createServer(app);
var io = socketio(http);
var path = require("path");
var redis = require("./model").redis;
var cookieParser = require("cookie-parser");

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
var client={};
io.on("connection",function(socket){
    socket.on("login",(user)=>{ //连接时保存下用户的socket连接
        client[user.id] = socket;
    });
    // socket.use((e,next)=>{
    //     console.log(e);
    //     next();
    // });
    socket.on("message",(data)=>{
        redis.rpush(data.user.id+"_"+data.friend.id,JSON.stringify(Object.assign({},data,{type:"send",read:true})));
        redis.rpush(data.friend.id+"_"+data.user.id,JSON.stringify(Object.assign({},data,{type:"receive",read:false})));
        if(client[data.user.id]){
            client[data.user.id].emit("update");
        }
        if(client[data.friend.id]){
            client[data.friend.id].emit("update");
            client[data.friend.id].emit("addUnread",data.user);
        }
    });
    

});



app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser({urlencoded:false,extended:false}));
app.use(bodyParser.json());
app.set("json spaces",4);
app.use(cors());
app.use(router);
http.listen(3000,function(){
    console.log("app start on port 3000");
});