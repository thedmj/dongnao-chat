const Sequelize = require('sequelize');
const sequelize = new Sequelize('dongnao', 'root', 'root');
var r = require("redis"),
    redis = r.createClient();

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    nickname: Sequelize.STRING,
    password: Sequelize.STRING,
    logo: Sequelize.STRING
});

const Post = sequelize.define("post", {
    title: Sequelize.STRING,
    content: Sequelize.STRING,
    image: Sequelize.STRING,
    authorId: Sequelize.STRING,
    deleted:Sequelize.BOOLEAN
});
Post.belongsTo(User);

const Comment = sequelize.define("comment", {content: Sequelize.STRING});
const Star = sequelize.define("star", {});
Comment.belongsTo(User);
Comment.belongsTo(Post);
Star.belongsTo(User);
Star.belongsTo(Post);

const Reply = sequelize.define("reply", {content: Sequelize.STRING});
Reply.belongsTo(Comment);

const Request = sequelize.define("request",{
    content:Sequelize.STRING,
    respone:Sequelize.STRING,
    read:Sequelize.BOOLEAN
});
Request.belongsTo(User,{as:"from"});
Request.belongsTo(User,{as:"to"});

const Relation = sequelize.define("relation",{
    
});
User.belongsToMany(User,{as:"friend",through:Relation})



sequelize.sync();
module.exports = {
    User,
    Post,
    Comment,
    Star,
    Reply,
    "connect":sequelize,
    redis
}