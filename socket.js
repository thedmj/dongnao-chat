var express = require("express");
var app = express();
var redis = require("./model").redis;
var socketio  = require("socket.io");
var http = require("http").createServer(app);
var io = socketio(http);
var CONNECT = require("./model").connect;
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
    socket.on("friend_request",(user)=>{
        CONNECT.query('INSERT INTO requests (fromId,toId,content,createdAt, updatedAt) VALUES ('+user.from.id+','+user.to.id+',"",NOW(),NOW())').then((result)=>{
            if(result[0].affectedRows>0){
                if(client[user.to.id]){
                    client[user.to.id].emit("get_request",{requestID:result[0].insertId,from:user.from,to:user.to});
                }
            }
            
        })
    })
});
module.exports = {
    express,app,http,io,client
};