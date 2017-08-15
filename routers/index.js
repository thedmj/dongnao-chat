var express = require("express");
var router = express.Router();
var userrouter = express.Router();
var postrouter = express.Router();
var commentrouter = express.Router();
var messagerouter = express.Router();
var model = require("../model");
var client = require("../socket").client;



const USER = model.User;
const POST = model.Post;
const COMMENT = model.Comment;
const CONNECT = model.connect;
var redis = model.redis;
var path = require("path");
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/upload');
    },
    filename: function(req, file, cb) {
        cb(null, decodeURI(Date.now() + ".jpg"));
    }
});
var upload = multer({ dest: "./public/upload", storage });

function getIndex(o, arrs, key) {
    var index = -1;
    for (var i = 0; i < arrs.length; i++) {
        if (o[key] == arrs[i][key]) {
            index = i;
            break;
        }
    }
    return index;
}



function mergResult(results) {
    var r = [];
    for (var i = 0; i < results.length; i++) { //遍历寻找postid是否重复 未重复增加一项 重复修改commentcontent
        var result = results[i];
        var index = getIndex(result, r, "postid");
        if (index == -1) {
            var o = {
                postid: result.postid,
                comments_id: result.comments_id,
                posttitle: result.posttitle,
                postcontent: result.postcontent,
                comment: [{ content: result.commentcontent, r_content: result.r_content, auth_id: result.comments_u_id, comment_user_nickname: result.comment_user_nickname, comments_id: result.comments_id }],
                stars: result.stars_u_id ? [{ stars_u_id: result.stars_u_id, stars_nickname: result.stars_nickname }] : [],
                friendname: result.friendname,
                logo: result.logo,
                authID: result.userId
            };
            r.push(o);
        } else {
            var comments_index = getIndex(result, r[index].comment, "comments_id")
            if (comments_index == -1) {
                r[index].comment.push({ content: result.commentcontent, r_content: result.r_content, auth_id: result.comments_u_id, comment_user_nickname: result.comment_user_nickname, comments_id: result.comments_id });
            }
            var stars_idex = getIndex(result, r[index].stars, "stars_u_id")
            if (stars_idex == -1) {
                if (result.stars_u_id != null) {
                    r[index].stars.push({ stars_u_id: result.stars_u_id, stars_nickname: result.stars_nickname });
                }

            }
        }
    }
    return r;
}

//获取所有好友说说
userrouter.get("/:id/posts_detail", (req, res) => {
    var id = req.params.id;
    CONNECT.query("SELECT replies.content AS r_content,posts.userId,users.logo AS logo,posts.id AS postid,posts.title AS posttitle,posts.content AS postcontent,posts.createdAt AS postcreated,s_u.id AS stars_u_id,c_u.id as comments_id,comment_user_nickname,c_u.userId as comments_u_id,c_u.content AS commentcontent,users.nickname AS friendname,stars_nickname FROM posts \
                    LEFT JOIN (SELECT comments.id,comments.content,comments.createdAt AS comments_ca,comments.createdAt,comments.postId,comments.userId,users.nickname AS comment_user_nickname FROM comments LEFT JOIN users ON comments.userId = users.id) AS c_u ON posts.id = c_u.postId \
                    LEFT JOIN users ON posts.userId = users.id \
                    LEFT JOIN replies ON c_u.id = replies.commentId \
                    LEFT JOIN (SELECT stars.userId,users.nickname AS stars_nickname,stars.postId,users.id FROM stars LEFT JOIN users ON stars.userId = users.id) AS s_u ON posts.id=s_u.postId WHERE posts.userId IN (SELECT relations.userId FROM relations WHERE relations.friendId = " + id + ") OR posts.userId IN (SELECT relations.friendId FROM relations WHERE relations.userId = " + id + ") OR posts.userId=" + id + " ORDER BY postid DESC;").then(function(result) {
        res.send(mergResult(result[0]))
    });

});

// /user路由
userrouter.get("/", function(req, res) {
    var offset = req.query.offset;
    var limit = req.query.limit;
    if (offset && limit) {
        USER.findAll({
            offset: offset * 1,
            limit: limit * 1
        }).then(function(users) {
            res.send(users);
        });
    } else {
        USER.findAll().then(function(users) {
            res.send(users);
        });
    }
});
userrouter.get("/:id", function(req, res) {
    USER.findById(req.params.id).then(function(user) {
        res.send(user);
    });
});
userrouter.get("/:id/post", function(req, res) {
    CONNECT.query("SELECT * FROM posts WHERE posts.userId = ? && posts.deleted = FALSE", {
        replacements: [req.params.id],
        model: POST
    }).then(function(post) {
        res.send(post);
    });
});
userrouter.get("/:id/friends", function(req, res) {
    CONNECT.query("SELECT * FROM users WHERE users.id IN (SELECT relations.userId FROM relations WHERE relations.friendId = ?) OR users.id IN (SELECT relations.friendId FROM relations WHERE relations.userId = ?)", {
        model: USER,
        replacements: [req.params.id, req.params.id]
    }).then(function(friends) {
        res.send(friends);
    })
});
userrouter.get("/:id/detail", function(req, res) {
    USER.findById(req.params.id).then(function(user) {
        CONNECT.query("SELECT * FROM posts WHERE posts.userId = ? && posts.deleted = FALSE", {
            replacements: [req.params.id],
            model: POST
        }).then(function(post) {
            user.dataValues.post = post;
            CONNECT.query("SELECT * FROM users WHERE users.id IN (SELECT relations.userId FROM relations WHERE relations.friendId = ?) OR users.id IN (SELECT relations.friendId FROM relations WHERE relations.userId = ?)", {
                model: USER,
                replacements: [req.params.id, req.params.id]
            }).then(function(friends) {
                user.dataValues.friends = friends;
                res.send(user);
            })
        });
    });
});
//搜索好友
userrouter.get("/:id/search", (req, res) => {
    var name = req.query.name;
    var sql = "SELECT users.id,users.nickname,users.logo FROM users";
    if (name != "") {
        sql = 'SELECT users.id,users.nickname,users.logo FROM users WHERE users.nickname LIKE "%' + name + '%"';
    }
    CONNECT.query(sql).then((result) => {
        res.send(result[0]);
    });
});
//获取好友请求
userrouter.get("/:id/request", (req, res) => {
    var id = req.params.id;
    CONNECT.query('SELECT requests.id as r_id,requests.createdAt,requests.respone,users.id as u_id,nickname,logo,content FROM requests  LEFT JOIN users ON requests.fromId = users.id WHERE toId = ' + id).then((get_result) => {
        CONNECT.query('SELECT requests.id as r_id,requests.createdAt,requests.respone,users.id as u_id,nickname,logo,content FROM requests  LEFT JOIN users ON requests.toId = users.id WHERE fromId = ' + id).then((send_result) => {
            res.send({
                get: get_result[0],
                send: send_result[0]
            });
        })

    })
});

//删除朋友接口
userrouter.post("/:id/rf", function(req, res) {
    var id = req.body.id;
    var userid = req.body.userid;
    CONNECT.query("DELETE FROM relations WHERE (userId=" + id + " AND friendId=" + userid + ") OR (userId=" + userid + " AND friendId=" + id + ")").then(function(r) {
        res.send(r[0]);
    });
});
//增加朋友接口
userrouter.post("/:id/af", function(req, res) {
    var id = req.body.id; //处理请求者的id
    var userid = req.body.userid; //发起请求者的id
    var request_id = req.body.request_id;
    var type = req.body.type || "agree";
    if (type == "agree") { //同意好友请求
        CONNECT.query("INSERT INTO relations (createdAt, updatedAt,userId,friendId) VALUES (NOW(),NOW()," + id + "," + userid + ")").then(function(data) {
            if (request_id) {
                CONNECT.query("UPDATE requests SET respone = 1 WHERE id=" + request_id).then((result) => {
                    if (client[userid]) {
                        client[userid].emit("request_result", { status: 1, message: "对方同意了你的请求" })
                    }
                    res.send({ message: "添加成功", r_id: request_id });
                });
            } else {
                if (client[userid]) {

                    client[userid].emit("request_result", { status: 1, message: "对方同意了你的请求" })
                }
                res.send({ message: "添加成功", r_id: request_id });
            }
        }).catch((err) => {
            if (request_id) {
                CONNECT.query("UPDATE requests SET respone = 1 WHERE id=" + request_id).then((result) => {
                    if (client[userid]) {
                        client[userid].emit("request_result", { status: 1, message: "对方同意了你的请求虽然你们已经是好友了" })
                    }
                    res.send({ message: "重复添加好友", r_id: request_id });
                });
            } else {
                if (client[userid]) {
                    client[userid].emit("request_result", { status: 1, message: "对方同意了你的请求虽然你们已经是好友了" })
                }
                res.send({ message: "重复添加好友", r_id: request_id });
            }
        });
    } else { //拒绝好友请求
        CONNECT.query("UPDATE requests SET respone = 0 WHERE id=" + request_id).then((result) => {
            if (client[userid]) {
                client[userid].emit("request_result", { status: 0, message: "对方拒绝了你的请求" })
            }
            res.send({ message: "你拒绝了请求", r_id: request_id });
        })
    }

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
userrouter.post("/:id/upload", upload.single('img'), (req, res) => {
    var id = req.params.id;
    console.log(req.file.filename, escape(req.file.filename))
    CONNECT.query("UPDATE users SET users.logo = '" + req.file.filename + "' WHERE id=" + id).then((data) => {
        data[0].logo = req.file.filename;
        res.send(data[0]);
    });
});


// /post路由


postrouter.get("/", function(req, res) {
    var offset = req.query.offset;
    var limit = req.query.limit;
    if (offset && limit) {
        POST.findAll({
            offset: offset * 1,
            limit: limit * 1
        }).then(function(posts) {
            res.send(posts);
        });
    } else {
        POST.findAll().then(function(posts) {
            res.send(posts);
        });
    }
});
postrouter.get("/detail", function(req, res) {
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
        .then(function(result) {
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
postrouter.get("/:id", (req, res) => {
    var id = req.params.id;
    CONNECT.query("SELECT * FROM posts WHERE id=" + id).then((post) => {
        post = post[0];
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
                    LEFT JOIN replies ON comments.id = replies.commentId WHERE comments.postId=" + id).then((comments) => {
            var comments = comments[0];
            CONNECT.query("SELECT * FROM stars WHERE stars.postId=" + id).then((stars) => {
                stars = stars[0];
                res.send({
                    post: post,
                    comments: comments,
                    stars: stars
                });
            })
        });
    });

});

// 获取comment路由
commentrouter.get("/", function(req, res) {
    var offset = req.query.offset;
    var limit = req.query.limit;
    if (offset && limit) {
        COMMENT.findAll({
            offset: offset * 1,
            limit: limit * 1
        }).then(function(comment) {
            res.send(comment);
        });
    } else {
        COMMENT.findAll().then(function(comment) {
            res.send(comment);
        });
    }
})


//message路由
messagerouter.get("/", function(req, res) {
    var user = req.query.user;
    var friend = req.query.friend;
    if (user && friend) {
        var key = user + "_" + friend;
        redis.lrange(key, -50, -1, function(err, data) {
            res.send(data);
        })
    }
})





// router.get("/",(req,res)=>{
//     res.render("login.html");
// });
router.use("/user", userrouter);
router.use("/post", postrouter);
router.use("/comment", commentrouter);
router.use("/message", messagerouter);
router.post("/login", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    CONNECT.query("SELECT users.username,users.nickname,users.id,users.logo FROM users WHERE username = '" + username + "' AND password = '" + password + "'").then((result) => {
        if (result[0].length > 0) {
            // var nickname = result[0].nickname;
            // res.cookie("user",{username:username,nickname},{maxAge:60000});
            var result = Object.assign({}, result[0][0], { status: 0, desc: "登录成功" });
            res.send(result);
        } else {
            res.send({ status: 1, desc: "用户名或密码错误" });
        }
    })
});
//提交评论
router.post("/sendComment", (req, res) => {
    var userid = req.body.userid;
    var postid = req.body.postid;
    var text = req.body.text;
    CONNECT.query("INSERT INTO comments (createdAt, updatedAt,userId,postId,content) VALUES (NOW(),NOW()," + userid + "," + postid + ",'" + text + "');").then((result) => {
        console.log(result[0]);
        res.send(result[0]);
    })
});
//点赞
router.post("/sendStar", (req, res) => {
    var userid = req.body.userid;
    var postid = req.body.postid;
    CONNECT.query("SELECT * FROM stars WHERE userId = " + userid + " AND postId = " + postid).then((result) => {
        if (result[0].length == 0) {
            CONNECT.query("INSERT INTO stars (createdAt, updatedAt,userId,postId) VALUES (NOW(),NOW()," + userid + "," + postid + ")").then((r) => {
                if (r[0].affectedRows == 1) {
                    res.send({ status: 0, message: "点赞成功" });
                } else {
                    res.send({ status: 2, message: "数据库存入错误" });
                }
            });
        } else {
            res.send({ status: 1, message: "已经赞过了" });
        }
    })
});
//删除点赞
router.post("/deleteStar", (req, res) => {
    var userid = req.body.userid;
    var postid = req.body.postid;
    CONNECT.query("DELETE FROM stars WHERE stars.userId = " + userid + " AND stars.postId = " + postid + ";").then((r) => {
        if (r[0].affectedRows == 1) {
            res.send({ status: 0, message: "取消点赞" });
        } else {
            res.send({ status: 1, message: "数据库错误" });
        }

    });
});

//检查点赞
router.post("/checkStar", (req, res) => {
    var userid = req.body.userid;
    var postid = req.body.postid;
    CONNECT.query("SELECT * FROM stars WHERE userId = " + userid + " AND postId = " + postid).then((result) => {
        if (result[0].length == 0) {
            res.send({ allowStar: true });
        } else {
            res.send({ allowStar: false });
        }
    });
});
//回复评论
router.post("/sendReply", (req, res) => {
    var userid = req.body.userid;
    var commentid = req.body.commentid;
    var text = req.body.text;
    CONNECT.query("INSERT INTO replies (createdAt, updatedAt,commentId,content) VALUES (NOW(),NOW()," + commentid + ",'" + text + "');").then((r) => {
        if (r[0].affectedRows == 1) {
            res.send({ status: 0, message: "回复成功" });
        } else {
            res.send({ status: 1, message: "数据库存入错误" });
        }
    });
});
//检查用户名
router.post("/checkusername", (req, res) => {
    var username = req.body.username;
    CONNECT.query("SELECT * FROM users WHERE username = '" + username + "';").then((r) => {
        if (r[0].length == 0) {
            res.send({ status: 0, message: "用户名可以使用" });
        } else {
            res.send({ status: 1, message: "用户名已被注册" });
        }
    });
});
//添加用户
router.post("/register", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var nickname = req.body.nickname;
    CONNECT.query("INSERT INTO users (username,password,nickname,createdAt, updatedAt) VALUES ('" + username + "','" + password + "','" + nickname + "',NOW(),NOW());").then((r) => {
        if (r[0].affectedRows == 1) {
            res.send({ status: 0, message: "注册成功" });
        }
    });
});
//添加post
router.post("/addPost", (req, res) => {
    var userid = req.body.userid;
    var title = req.body.title;
    var content = req.body.content;
    CONNECT.query("INSERT INTO posts (createdAt, updatedAt,userId,title,content,deleted) VALUES (NOW(),NOW()," + userid + ",'" + title + "','" + content + "',0);").then((r) => {
        if (r[0].affectedRows == 1) {
            res.send({ status: 0, message: "发布成功" });
        }
    });
});

module.exports = router;