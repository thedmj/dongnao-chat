<template>
  <div class="friends">
    <ul>
      <li v-for="friend in friends" :key="friend.id" @click="chat(friend.nickname,friend.id,friend.logo)">
        <el-badge :value="friend.unread" class="item">
          <img :src="host+'upload/'+friend.logo" alt="" width="90" height="90">
        </el-badge>
        <div class="nickname">{{friend.nickname}}</div>
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
  import io from "../../../node_modules/socket.io-client/dist/socket.io";
  import {
    Badge
  } from "element-ui";

  export default {
    data() {
      return {

      }
    },
    props:["init"],
    methods: {
      ...mapActions(["getFriends","get_message","clear_message"]),
      ...mapMutations(["set_chat_friend", "set_me", "addUnread", "clearUnread", "set_socket","set_unread"]),
      chat(nickname, id, logo) {
        // console.log("friend: ",nickname,id,logo)
        this.$router.push("/chat" + "?nickname=" + nickname + "&id=" + id+"&logo="+logo);
        // console.log("/chat" + "?nickname=" + nickname + "&id=" + id+"&logo="+logo)
        this.set_chat_friend({
          friend:{
            nickname,
            id,
            logo
          }
        });
        // this.clearUnread(id)  //清空unread
      }

    },
    computed: {
      ...mapState(["friends", "me", "socket", "host"])
    },
    mounted() {
      
      console.log("friend")
      var cookie_user = JSON.parse(getCookie("user"));

      if (!cookie_user) {
        this.$router.push("/login");
        this.set_me(null);
      } else {
        this.set_me(cookie_user);
      if (this.me) {
        this.getFriends(this.me.id).then((friends)=>{
          for(let i=0;i<friends.length;i++){
            this.get_message({
              userid: this.me.id,
              friendid: friends[i].id
            }).then((message)=>{
              var num =0;
              // console.log(message)
              for(let j=0;j<message.data.length;j++){
                if(message.data[j].readed == false){
                  num++;
                }
              }
              // console.log(message.friendID,num);
              console.log(num)
              this.set_unread({id:message.friendID,num}) //设置未读消息数量
              this.clear_message();
            })
          }
        });
        if(!this.socket){
          this.set_socket(io.connect(this.host));
          this.socket.emit("login", this.me);
        }
        if(!this.init.friends_init){
          console.log("friends init")
          this.init.setInit("friends_init");
          this.socket.on("addUnread", (data) => {
            this.addUnread(data);
          });
          this.socket.on("get_request", (data) => { //在线时收到好友请求
            // console.log(data);
            // this.fetch_request_list(this.me.id);
            alert("你收到一个好友请求")
          });
        }
        
      }
      }
      
    },
    components: {
      "el-badge": Badge
    }
  }

</script>

<style lang="less">

.friends{padding:0 30px 0 30px;overflow: auto;
  ul{text-align: left;
    li{border-bottom: 1px solid #ccc;}
  }
  .nickname{display: inline-block;font-size: 28px;vertical-align: middle;}
}
</style>
