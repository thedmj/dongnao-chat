<template>
<div class="posts">
  <div class="list">
    <ul>
    <li v-for="(post,$index) in postList" :key="post.postid" class="post">
      <div class="post-item">
        <div class="img">
          <img :src="host+'upload/'+post.logo" alt="" v-if="post.logo">
          <img :src="host+'upload/null.jpg'" alt="" v-if="!post.logo">
        </div>
        <div class="post-content">
          <h3 class="nickname">{{post.friendname}}</h3>
          <h4>{{post.posttitle}}</h4>
          <p>{{post.postcontent}}</p>
          <div class="star" v-if="post.stars.length>0">
            <i v-for="(item,$index) in post.stars" :key="$index">{{item.stars_nickname}}  <span v-if="$index != post.stars.length-1">,</span></i>共{{post.stars.length}}个人觉得很赞
          </div>
          <!-- 点赞 评论 按钮组 start -->
          <div class="comment-item">
            <div class="btn" @click="open($index,post.postid)" v-if="post.authID != me.id"><span></span><span></span></div>
            <transition name="open">
              <div class="btn-menu" v-if="post.open">
                <ul class="menu">
                  <li @click="sendStart(post.postid,me.id)" v-if="post.allowStar">赞</li>
                  <li @click="deleteStar(post.postid,me.id)" v-if="!post.allowStar">取消点赞</li>
                  <li @click="openComment($index,post.postid)">评论</li>
                </ul>
              </div>
            </transition>
            <ul @click="showCommentMessage=false">
              <li v-for="item in post.comment" :key="item.comments_id">
                <div v-if="item.content != null" @click="reply(post,item)" :data-commentid="item.comments_id">
                  <span class="nickname">{{item.comment_user_nickname}}</span>:{{item.content}}
                </div>
                <p v-if="item.r_content"><span class="nickname">{{post.friendname}}</span>回复<span class="nickname">{{item.comment_user_nickname}}</span>:{{item.r_content}}</p>
              </li>
            </ul>
          </div>
          <!-- 点赞 评论 按钮组 end -->
        </div>

      </div>
    </li>
  </ul>
  </div>
  
  <!-- 评论输入框start -->
  <transition name="fade">
    <div class="comment-message-wrapper" v-if="showCommentMessage">
      <div class="out" @click="showCommentMessage=false"></div>
      <div class="comment-message-box">
        <el-input class="comment-input" v-model="commentText"></el-input>
        <el-button class="comment-submit" @click="sendComment(activePostID)">提交</el-button>
      </div>
    </div>
  </transition>
  <!-- 评论输入框end -->
  <!-- 回复输入框start -->
  <transition name="fade">
    <div class="comment-message-wrapper" v-if="showReplyMessage">
      <div class="out" @click="showReplyMessage=false"></div>
      <div class="comment-message-box">
        <el-input class="comment-input" v-model="replyText"></el-input>
        <el-button class="comment-submit" @click="sendReply(activeCommentID)">回复</el-button>
      </div>
    </div>
  </transition>
  <!-- 回复输入框end -->

  <!-- post发表页start -->
    <div class="add-post-page" v-if="showAddPost">
      <div class="post-box">
        <p>标题：</p>
        <el-input class="title-input" v-model="postTitle"></el-input>
        <p>内容：</p>
        <el-input class="content-input" v-model="postContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        <el-button class="comment-submit" @click="closePost" type="warning">取消</el-button>
        <el-button class="comment-submit" @click="submitPost" type="info">发布</el-button>
      </div>
      
    </div>
  <!-- post发表也end -->
</div>
</template>

<script>
import Vue from "vue";
import $ from "jquery";
import {
  input,
  button
} from "element-ui";
import {
  getCookie
} from "../public/js/cookies.api";
import io from "../../../node_modules/socket.io-client/dist/socket.io";
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from "vuex";
export default {
  computed: {
    ...mapState(["posts", "me", "host", "socket","showAddPost"]),
    postList() {
      return this.posts.map((item) => {
        Vue.set(item, "open", false);
        Vue.set(item, "allowStar", true);
        return item;
      })
    }
  },
  props: ["init"],
  data() {
    return {
      showCommentMessage: false,
      activePostID: null,
      activeCommentID: null,
      commentText: "",
      showReplyMessage: false,
      replyText: "",
      postTitle:"",
      postContent:""
    }
  },
  methods: {
    ...mapActions(["getPosts", "getFriends"]),
    ...mapMutations(["set_chat_friend", "set_me", "addUnread", "clearUnread", "set_socket","set_showAddPost"]),
    open(index, postid) {
      var This = this;
      $.ajax({
        url: this.host + "checkStar",
        type: "post",
        data: {
          userid: this.me.id,
          postid
        },
        success(res) {
          //判断能否点赞
          if (res.allowStar == true) {
            This.posts[index].allowStar = true;
          } else {
            This.posts[index].allowStar = false;
          }
          //控制显示
          for (let i = 0; i < This.posts.length; i++) {
            if (i == index) {
              This.posts[index].open = !This.posts[index].open;
            } else {
              This.posts[i].open = false;
            }
          }
        }
      });
    },
    openComment(index, postid) {
      this.postList[index].open = false;
      this.showCommentMessage = true;
      this.activePostID = postid;
    },
    sendComment(postid) {
      var This = this;
      var text = this.commentText;
      if (text != "") {
        $.ajax({
          url: this.host + "sendComment",
          type: "post",
          data: {
            userid: this.me.id,
            postid: postid,
            text: text
          },
          success(res) {
            if (res.affectedRows == 1) {
              This.activePostID = null;
              This.commentText = "";
              This.showCommentMessage = false;
              This.getPosts(This.me.id);
            }
          }
        });
      }

    },
    sendStart(postid, userid) {
      var This = this;
      $.ajax({
        url: this.host + "sendStar",
        type: "post",
        data: {
          userid,
          postid
        },
        success(res) {
          if (res.status == 0) {
            This.getPosts(This.me.id);
          }
        }
      });
    },
    deleteStar(postid, userid) {
      var This = this;
      $.ajax({
        url: this.host + "deleteStar",
        type: "post",
        data: {
          postid,
          userid
        },
        success(res) {
          if (res.status == 0) {
            This.getPosts(This.me.id);
          }
        }
      });
    },
    reply(post, item) {
      var id = item.comments_id;
      if (post.authID != this.me.id || item.r_content != null) {
        return;
      }
      this.showReplyMessage = true;
      this.activeCommentID = id;
    },
    sendReply() {
      var This = this;
      var text = this.replyText;
      if (text != "") {
        $.ajax({
          url: this.host + "sendReply",
          type: "post",
          data: {
            commentid: this.activeCommentID,
            text: this.replyText
          },
          success(res) {
            if (res.status == 0) {
              This.activePostID = null;
              This.replyText = "";
              This.showReplyMessage = false;
              This.getPosts(This.me.id);
            }
          }
        });
      }

    },
    closePost(){
      this.set_showAddPost(false);
    },
    submitPost(){
      var This = this;
      $.ajax({
        url:this.host+"addPost",
        data:{
          userid:this.me.id,
          title:this.postTitle,
          content:this.postContent
        },
        type:"post",
        success(res){
          console.log(res);
          This.getPosts(This.me.id);
          This.set_showAddPost(false);
        }
      });
    },
  },
  mounted() {
    this.init.setInit("posts_init");
    var cookie_user = JSON.parse(getCookie("user"));

    if (!cookie_user) {
      this.$router.push("/login");
      this.set_me(null);
    } else {
      this.set_me(cookie_user);
      if (this.me) {
        this.getPosts(this.me.id);
        if (!this.socket) {

        }
        if (!this.socket) {
          this.set_socket(io.connect(this.host));
          this.socket.emit("login", this.me);
        }

      }
    }


  },
  components: {
    "el-input": input,
    "el-button": button
  }
}
</script>

<style lang="less">
.posts {
  position: absolute;left: 0;top:0;bottom: 0;
  padding: 10px 10px 0 10px;
  width:100%;
  box-sizing: border-box;
  overflow: hidden;
  .list{width:100%;height:100%;overflow: auto;}
  .add-post-page{width:100%;height:100%;position: fixed;left: 0;top: 0;background: rgba(0,0,0,0.7);
    .post-box{width:90%;margin: auto;margin-top: 160px;
      p{font-size: 16px;color:#fff;text-align: left;margin-bottom: 6px;}
      .title-input{margin-bottom: 30px;}
      .content-input{margin-bottom: 30px;}
    }
  }
  ul {
    li.post {
      margin-bottom: 16px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 6px;
      .post-item {
        display: flex;
      }
      .img {
        margin-right: 10px;
        width: 20%;
        img {
          width: 100%;
        }
      }
      .post-content {
        text-align: left;
        width: 90%;
        ;
        position: relative;
        ;
        .comment-item {
          word-wrap: break-word;
          background: #eee;
          font-size: 14px;
          position: relative;
          .btn {
            width: 26px;
            height: 16px;
            background: #999;
            position: absolute;
            right: 0;
            top: -45px;
            border-radius: 2px;
            ;
            span:nth-child(1) {
              position: absolute;
              background: #fff;
              ;
              left: 0;
              top: 0;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              left: 5px;
              top: 6px;
            }
            span:nth-child(2) {
              position: absolute;
              background: #fff;
              ;
              left: 0;
              top: 0;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              left: 15px;
              top: 6px;
            }
          }
          .btn-menu {
            position: absolute;
            top: -36px;
            right: 30px;
            background: rgba(0, 0, 0, 0.7);
            width: 136px;
            height: 30px;
            transform-origin: right;
            border-radius: 6px;
            .menu {
              display: flex;
              li {
                flex-grow: 1;
                text-align: center;
                height: 30px;
                line-height: 30px;
                width: 45px;
                color: #fff;
              }
            }
          }
        }
        .nickname {
          color: #1c95e2;
        }
      }
    }
  }
  .comment-message-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    .out {
      position: relative;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
    }
    .comment-message-box {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 36px;
      z-index: 9;
      display: flex;
      .comment-input {
        height: 100%;
      }
      .comment-submit {
        height: 100%;
      }
    }
  }
}

.open-enter-active,
.open-leave-active {
  transition: all .3s
}

.open-enter,
.open-leave-to {
  transform: scaleX(0); // opacity: 0;
}
</style>
