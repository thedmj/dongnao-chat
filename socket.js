var express = require("express");
var app = express();
var redis = require("./model").redis;
var socketio = require("socket.io");
var http = require("http").createServer(app);
var io = socketio(http);
var CONNECT = require("./model").connect;
var client = {};

io.on("connection", function (socket) {
    socket.on("login", (user) => { //连接时保存下用户的socket连接
        client[user.id] = socket;
    });
    socket.on("logout",(id)=>{
        client[id] = null;
    });
    socket.on("clearunread",(o)=>{
        var key = o.userid + "_" +o.friendid ;
        console.log(key);
        redis.lrange(key,0,-1,(err,data)=>{
            console.log(data);
            for(let i=0;i<data.length;i++){
                data[i] = JSON.parse(data[i]);
                data[i].readed = true;
                data[i] = JSON.stringify(data[i]);
                redis.lset(key,i,data[i]);
            }
            socket.emit("clearAll");
        });
    })

    // socket.use((e,next)=>{     console.log(e);     next(); });
    socket.on("message", (data) => {
        redis.rpush(data.user.id + "_" + data.friend.id, JSON.stringify(Object.assign({}, data, {
            type: "send",
            readed: true
        }))); //发送者的记录
        redis.rpush(data.friend.id + "_" + data.user.id, JSON.stringify(Object.assign({}, data, {
            type: "receive",
            readed: false
        }))); //接受者的记录
        if (client[data.user.id]) { //发送者在线 触发更新
            client[data.user.id].emit("update");
        }
        if (client[data.friend.id]) { //接收者在线 触发更新 加上未读提示
            client[data.friend.id].emit("update");
            client[data.friend.id].emit("addUnread", data.user);
        } else {
            // redis.get(data.friend.id + "_offLine_num", (err, o) => {
            //     var key = data.friend.id + "_offLine_num";
            //     var list={};
            //     var o = JSON.parse(o);
            //     console.log("o ",o)
            //     if(o==null){
            //         o = {};
            //         o[key]={num:1}
            //     }else{
            //         if(o[key]){
            //             o[key].num++;
            //         }else{
            //             o[key]={num:1}
            //         }
            //     }
            //     console.log(o);
            //     redis.set(key,JSON.stringify(o));
            // })
        }
    });
    socket.on("friend_request", (user) => {
        CONNECT
            .query('INSERT INTO requests (fromId,toId,content,createdAt, updatedAt) VALUES (' + user.from.id + ',' + user.to.id + ',"",NOW(),NOW())')
            .then((result) => {
                if (result[0].affectedRows > 0) {
                    if (client[user.to.id]) {
                        client[user.to.id].emit("get_request", {
                            requestID: result[0].insertId,
                            from: user.from,
                            to: user.to
                        });
                    }
                }
            });
    });
    socket.on("wearefriend", (userid) => {
        if (client[userid]) {
            client[userid].emit("wearefriend");
        }
    })
});
module.exports = {
    express,
    app,
    http,
    io,
    client
};