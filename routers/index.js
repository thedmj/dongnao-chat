var express = require("express");
var router = express.Router();
var userrouter = express.Router();
var postrouter = express.Router();
var commentrouter = express.Router();
var messagerouter = express.Router();
var model = require("../model");
const USER = model.User;
const POST = model.Post;
const COMMENT = model.Comment;
const CONNECT = model.connect;
var redis = model.redis;
var path = require("path");
var multer = require("multer");
var storage = multer.diskStorage({  
  destination: function (req, file, cb) {  
    cb(null, './public/upload');
  },  
  filename: function (req, file, cb) {  
    cb(null,Date.now() + file.originalname);
  }  
});
var upload = multer({ dest: "./public/upload",storage });

function isInByID(o,arr){
    var result = false;
    for(var i = 0;i<arr.length;i++){
        if(o){
            if(o.id == arr[i].id){
                result = i;
                break
            }
        }
    }
    return result;
}

//获取所有好友说说
userrouter.get("/:id/posts_detail",(req,res)=>{
    var id = req.params.id;
    var results={};
    CONNECT.query("SELECT * FROM posts LEFT JOIN comments ON posts.id = comments.postId LEFT JOIN users ON posts.userId = users.id WHERE posts.userId IN (SELECT relations.userId FROM relations WHERE relations.friendId = "+id+") OR posts.userId IN (SELECT relations.friendId FROM relations WHERE relations.userId = "+id+")").then(function(posts){
        var posts = posts[0];
        var result=[];
        for(var i=0;i<posts.length;i++){
            var index = isInByID(posts[i],result);
            if(index != false){
            }else{
                var p = {};
                p.comments=[];
                p.stars=[];
                p.id=posts[i].id;
                p.postsid = posts[i].postId;
                result.push(p);
            }
        }
        for(var i=0;i<posts.length;i++){
            var index = isInByID(posts[i],result);
            if(index !== false){
                result[index].comments.push(posts[i].content);
            }else{
            }
        }
        results.result = result;
        CONNECT.query("SELECT posts.id as postId,stars.userId as id,users.nickname FROM posts LEFT JOIN stars ON posts.id=stars.postId LEFT JOIN users ON stars.userId=users.id WHERE posts.userId IN (SELECT relations.userId FROM relations WHERE relations.friendId = "+id+") OR posts.userId IN (SELECT relations.friendId FROM relations WHERE relations.userId = "+id+")").then(function(stars){
            var stars = stars[0];
            
            console.log(results)
            for(var i=0;i<stars.length;i++){
                for(var j=0;j<results.result.length;j++){
                    console.log(stars[i].postId , results.result[j].postsid);
                    if(stars[i].postId == results.result[j].postsid){
                        // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
                        // console.log(results.result[j].stars)
                        results.result[j].stars.push(stars[i].nickname);
                    }
                }
            }
            res.send(results);
        });
        
    });
    
});

// /user路由
userrouter.get("/", function (req, res) {
    var offset = req.query.offset;
    var limit = req.query.limit;
    if (offset && limit) {
        USER.findAll({
            offset: offset * 1,
            limit: limit * 1
        }).then(function (users) {
            res.send(users);
        });
    } else {
        USER.findAll().then(function (users) {
            res.send(users);
        });
    }
});
userrouter.get("/:id", function (req, res) {
    USER.findById(req.params.id).then(function (user) {
        res.send(user);
    });
});
userrouter.get("/:id/post", function (req, res) {
    CONNECT.query("SELECT * FROM posts WHERE posts.userId = ? && posts.deleted = FALSE", {
        replacements: [req.params.id],
        model: POST
    }).then(function (post) {
        res.send(post);
    });
});
userrouter.get("/:id/friends", function (req, res) {
    CONNECT.query("SELECT * FROM users WHERE users.id IN (SELECT relations.userId FROM relations WHERE relations.friendId = ?) OR users.id IN (SELECT relations.friendId FROM relations WHERE relations.userId = ?)", {
        model: USER,
        replacements: [req.params.id, req.params.id]
    }).then(function (friends) {
        res.send(friends);
    })
});
userrouter.get("/:id/detail", function (req, res) {
    USER.findById(req.params.id).then(function (user) {
        CONNECT.query("SELECT * FROM posts WHERE posts.userId = ? && posts.deleted = FALSE", {
            replacements: [req.params.id],
            model: POST
        }).then(function (post) {
            user.dataValues.post = post;
            CONNECT.query("SELECT * FROM users WHERE users.id IN (SELECT relations.userId FROM relations WHERE relations.friendId = ?) OR users.id IN (SELECT relations.friendId FROM relations WHERE relations.userId = ?)", {
                model: USER,
                replacements: [req.params.id, req.params.id]
            }).then(function (friends) {
                user.dataValues.friends = friends;
                res.send(user);
            })
        });
    });
});

//删除朋友接口
userrouter.post("/:id/rf", function (req, res) {
    var id = req.body.id;
    var userid = req.body.userid;
    CONNECT.query("DELETE FROM relations WHERE (userId=" + id + " AND friendId=" + userid + ") OR (userId=" + userid + " AND friendId=" + id + ")").then(function (e) {
        res.send(e[0]);
    });
});
//增加朋友接口
userrouter.post("/:id/af", function (req, res) {
    var id = req.body.id;
    var userid = req.body.userid;
    CONNECT.query("INSERT INTO relations (createdAt, updatedAt,userId,friendId) VALUES (NOW(),NOW()," + id + "," + userid + ")").then(function (e) {
        res.send(e[0]);
    });
})


//增加文章接口
userrouter.post("/:id/post", (req, res) => {
    POST.create({
        userId: req.params.id,
        title: req.body.title,
        content: req.body.content,
        deleted: false
    }).then((item) => {
        res.send(item);
    });
});
//删除文章接口
userrouter.post("/:id/post/delete", (req, res) => {
    var ids = ""
    console.log(req.body)
    var postsID = req.body.postsID;
    for (var i = 0; i < postsID.length; i++) {
        ids += postsID[i] + ","
    }
    ids = ids.substring(0, ids.length - 1);
    CONNECT.query("UPDATE posts SET deleted = TRUE WHERE id IN (" + ids + ")").then((e) => {
        res.send(e[0]);
    });
})
//修改文章接口
userrouter.post("/:id/post/update", (req, res) => {
    var postID = req.body.postID;
    var title = req.body.title;
    var content = req.body.content;
    CONNECT.query("UPDATE posts SET title = '" + title + "',content = '" + content + "' WHERE id = " + postID).then((e) => {
        res.send(e[0]);
    });
})

//头像上传
userrouter.post("/:id/upload",upload.single('img'),(req,res)=>{
    console.log(req.file);
    var id = req.params.id;
    CONNECT.query("UPDATE users SET users.logo = '"+escape(req.file.filename)+"' WHERE id=" + id).then((e) => {
        res.send(e[0]);
    });
});


// /post路由


postrouter.get("/", function (req, res) {
    var offset = req.query.offset;
    var limit = req.query.limit;
    if (offset && limit) {
        POST.findAll({
            offset: offset * 1,
            limit: limit * 1
        }).then(function (posts) {
            res.send(posts);
        });
    } else {
        POST.findAll().then(function (posts) {
            res.send(posts);
        });
    }
});
postrouter.get("/detail", function (req, res) {
    CONNECT.query("SELECT\
    users.id as uid,\
    users.username,\
    users.nickname,\
    users.`password`,\
    users.logo,\
    users.createdAt as uct,\
    users.updatedAt as uut,\
    posts.id as pid,\
    posts.title,\
    posts.content,\
    posts.image,\
    posts.authorId,\
    posts.createdAt as pct,\
    posts.updatedAt as put,\
    posts.userId\
    FROM users\
    INNER JOIN posts ON posts.userId = users.id WHERE posts.deleted = FALSE")
        .then(function (result) {
            var r = result[0].map((o) => {
                return {
                    user: {
                        id: o.uid,
                        username: o.username,
                        nickname: o.nickname,
                        password: o.password,
                        logo: o.logo,
                        createdAt: o.uct,
                        updatedAt: o.uut
                    },
                    post: {
                        id: o.pid,
                        title: o.title,
                        content: o.content,
                        image: o.image,
                        authorId: o.authorId,
                        createdAt: o.pct,
                        updatedAt: o.put
                    }
                }
            });
            res.send(r);
        });
});

//获取文章详情
postrouter.get("/:id",(req,res)=>{
    var id = req.params.id;
    CONNECT.query("SELECT * FROM posts WHERE id="+id).then((post)=>{
        post=post[0];
        CONNECT.query("SELECT\
                    replies.id AS repliesid,\
                    replies.content AS repliescontent,\
                    replies.createdAt AS repliescreatedAt,\
                    comments.content AS commentscontent,\
                    comments.createdAt AS commentscreatedAt,\
                    comments.id AS commentsid,\
                    comments.userId AS commentsuserId,\
                    comments.postId,\
                    replies.commentId\
                    FROM\
                    comments\
                    LEFT JOIN replies ON comments.id = replies.commentId WHERE comments.postId="+id).then((comments)=>{
            var comments = comments[0];
            CONNECT.query("SELECT * FROM stars WHERE stars.postId="+id).then((stars)=>{
                stars=stars[0];
                res.send({
                    post:post,
                    comments:comments,
                    stars:stars
                });
            })
        });
    });
    
});

// /comment路由
commentrouter.get("/", function (req, res) {
    var offset = req.query.offset;
    var limit = req.query.limit;
    if (offset && limit) {
        COMMENT.findAll({
            offset: offset * 1,
            limit: limit * 1
        }).then(function (comment) {
            res.send(comment);
        });
    } else {
        COMMENT.findAll().then(function (comment) {
            res.send(comment);
        });
    }
})


//message路由
messagerouter.get("/", function (req, res) {
    var user = req.query.user;
    var friend = req.query.friend;
    console.log(user, friend);
    if (user && friend) {
        var key = user + "_" + friend;
        redis.lrange(key, 0, -1, function (err, data) {
            res.send(data);
        })
    }
})



router.use("/user", userrouter);
router.use("/post", postrouter);
router.use("/comment", commentrouter);
router.use("/message", messagerouter);
module.exports = router;