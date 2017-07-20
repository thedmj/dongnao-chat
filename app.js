var express = require("./socket").express;
var app = require("./socket").app;
var http = require("./socket").http;
var router = require("./routers/index");
var cors = require("cors");
var bodyParser = require("body-parser");
var multer = require("multer");
var path = require("path");
var cookieParser = require("cookie-parser");

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser({urlencoded:false,extended:false}));
app.use(bodyParser.json());
app.set("json spaces",4);
app.use(cors());
app.use(router);
http.listen(3000,function(){
    console.log("app start on port 3000");
});