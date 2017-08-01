<template>
  <div class="posts">
    <ul>
      <li v-for="(post,$index) in postList" :key="post.postid" class="post">
        <div class="post-item">
          <div class="img">
            <img :src="host+'upload/'+post.logo" alt="" >
          </div>
          <div class="post-content">
            <h3 class="nickname">{{post.friendname}}</h3>
            <h4>{{post.posttitle}}</h4>
            <p>{{post.postcontent}}</p>
            <div class="star" v-if="post.stars.length>0">
              <i v-for="(item,$index) in post.stars" :key="$index">{{item.stars_nickname}}  <span v-if="$index != post.stars.length-1">,</span></i>共{{post.stars.length}}个人觉得很赞
            </div>
            <div class="comment-item">
              <div class="btn" @click="open($index)" v-if="post.authID != me.id"><span></span><span></span></div>
              <transition name="open">
                <div class="btn-menu" v-if="post.open" >
                  <ul class="menu">
                    <li @click="sendStart(post.postid,me.id)">{{me.id}}赞{{post.postid}}</li>
                    <li @click="sendComment()">{{me.id}}评论{{post.comments_id}}</li>
                  </ul>
                </div>
              </transition>
              
              <ul @click="showCommentMessage=false">
                <li v-for="item in post.comment" :key="item.id">
                  <p v-if="item.content != null">
                    {{item.comment_user_nickname}}:{{item.content}}
                  </p>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
        
        
        <!-- <h3>{{post.posttitle}}</h3> -->
        <!-- <p>{{post.postcontent}}</p> -->
      </li>
    </ul>
    
    <div class="comment-message-wrapper" v-if="showCommentMessage" @click="showCommentMessage=false">
      <div class="comment-message-box">
        <el-input class="comment-input"></el-input>
        <el-button class="comment-submit">提交</el-button>
      </div>
      
    </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import {input,button} from "element-ui";
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
      ...mapState(["posts","me","host","socket"]),
      postList(){
        return this.posts.map((item)=>{
          Vue.set(item,"open",false);
          return item;
        })
      }
    },
    props:["init"],
    data () {
      return {
        showCommentMessage:false
      }
    },
    methods: {
      ...mapActions(["getPosts", "getFriends"]),
      ...mapMutations(["set_chat_friend", "set_me", "addUnread", "clearUnread", "set_socket"]),
      open(index){
        for(let i=0;i<this.posts.length;i++){
          if(i == index){
            this.posts[index].open = !this.posts[index].open;
          }else{
            this.posts[i].open = false;
          }
        }
      },
      sendComment(){
        this.showCommentMessage = true;
      },
    },
    mounted() {
      this.init.setInit("posts_init");
      var cookie_user = JSON.parse(getCookie("user"));
      
      if (!cookie_user) {
        this.$router.push("/login");
        this.set_me(null);
      }else{
        this.set_me(cookie_user);
        if (this.me) {
          this.getPosts(this.me.id);
          if(!this.socket){
            
          }
          if(!this.socket){
            this.set_socket(io.connect(this.host));
            this.socket.emit("login", this.me);
          }
          
        }
      }
      

    },
    components: {
      "el-input":input,
      "el-button":button
    }
  }

</script>

<style lang="less">
  .posts{padding:10px 10px 0 10px;overflow: auto;
    ul{
      li.post{margin-bottom: 16px;border-bottom: 1px solid #ccc;padding-bottom:6px;
        .post-item{display: flex;}
        .img{margin-right:10px; width:20%;
          img{width:100%;}
        }
        .post-content{text-align: left;width:90%;;position:relative;;
          .comment-item{word-wrap : break-word;background: #eee;font-size:14px;position: relative;
            .btn{width:26px;height:16px;background: #999;position: absolute;right: 0;top:-30px;border-radius: 2px;;
              span:nth-child(1){position:absolute;background: #fff;;left: 0;top: 0;width:6px;height:6px;border-radius: 50%;left: 5px;top:6px;}
              span:nth-child(2){position:absolute;background: #fff;;left: 0;top: 0;width:6px;height:6px;border-radius: 50%;left: 15px;top:6px;}
            }
            .btn-menu{position: absolute;top: -36px;right:30px;background: #333;width:90px;height:30px;transform-origin: right;border-radius: 6px;
              .menu{display: flex;
                li{flex-grow:1;text-align: center;height:30px;line-height: 30px;width:45px;color:#fff;}
              }
            }
          }
          .nickname{color:#1c95e2;}
          
        }
      }
    }
    .comment-message-wrapper{width:100%;height:100%;position: fixed;left: 0;top:0;
      .comment-message-box{position: absolute;bottom: 60px;width:100%;height:30px;z-index: 9;display: flex;
        .comment-input{height:100%;}
        .comment-submit{height:100%;}
      }
      
    }
  }
.open-enter-active, .open-leave-active {
  transition: all .3s
}
.open-enter, .open-leave-to {
  transform: scaleX(0);
  // opacity: 0;
}
</style>
