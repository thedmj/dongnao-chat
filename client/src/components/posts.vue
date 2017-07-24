<template>
  <div class="posts">
    <ul>
      <li v-for="post in posts" :key="post.postid" class="post">
        <div class="post-item">
          <div class="img">
            <img :src="host+'upload/'+post.logo" alt="" >
          </div>
          <div class="content">
            <h3 class="nickname">{{post.friendname}}</h3>
            <h4>{{post.posttitle}}</h4>
            <p>{{post.postcontent}}</p>
            <div class="star" v-if="post.stars.length>0">
              <i v-for="(item,$index) in post.stars" :key="$index">{{item.stars_nickname}}  <span v-if="$index != post.stars.length-1">,</span></i>共{{post.stars.length}}个人觉得很赞
            </div>
            <div class="comment-item">
              <ul>
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
  </div>
</template>

<script>
  import {
    getCookie
  } from "../public/js/cookies.api";
  import {
    mapState,
    mapGetters,
    mapActions,
    mapMutations
  } from "vuex";
  export default {
    computed: {
      ...mapState(["posts","me","host"])
    },
    methods: {
      ...mapActions(["getPosts", "getFriends"]),
      ...mapMutations(["set_chat_friend", "set_me", "addUnread", "clearUnread", "set_socket"]),
    },
    mounted() {
      var cookie_user = JSON.parse(getCookie("user"));
      this.set_me(cookie_user);
      if (!cookie_user) {
        this.$router.push("/login");
      }
      console.log(cookie_user)
      if (this.me) {
        this.getPosts(this.me.id);
      }

    }
  }

</script>

<style lang="less">
  .posts{
    ul{
      li.post{margin-bottom: 16px;border-bottom: 1px solid #ccc;padding-bottom:6px;
        .post-item{display: flex;}
        .img{margin-right:10px; width:10%;
          img{width:100%;}
        }
        .content{text-align: left;width:90%;;
          .comment-item{word-wrap : break-word;background: #eee;font-size:14px;}
          .nickname{color:#1c95e2;}
        }
      }
    }
  }

</style>
