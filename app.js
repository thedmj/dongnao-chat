var express = require("express");
var app = express();
var router = require("./routers/index");
var cors = require("cors");
var bodyParser = require("body-parser");
var multer = require("multer");

// var model = require("./model");
// model.redis.lrange("list",0,10,(err,list)=>{
//     console.log(list);
// });
app.use(express.static("public"));
app.use(bodyParser({urlencoded:false,extended:false}));
app.use(bodyParser.json());
app.set("json spaces",4);
app.use(cors());
app.use(router);
app.listen(3000,function(){
    console.log("app start on port 3000");
});