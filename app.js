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

io.on("connection",function(socket){
    io.emit("test","aaaaaa");
    socket.on("test",(data)=>{
        console.log(data);
    })
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