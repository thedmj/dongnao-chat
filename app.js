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


var client={};
io.on("connection",function(socket){
    if(!client["ryan"]){
        client["ryan"]=socket;
    }
    socket.on("message",(data)=>{
        redis.rpush(data.user+"_"+data.friend,JSON.stringify(Object.assign({},data,{type:"send",read:true})));
        redis.rpush(data.friend+"_"+data.user,JSON.stringify(Object.assign({},data,{type:"receive",read:false})));
        if(client[data.user]){
            client[data.user].emit("update");
        }
        if(client[data.friend]){
            client[data.friend].emit("update");
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