<template>
  <div class="chat" ref="chat">
    <div class="chat-room"  ref="chatRoom">
      <!-- {{me.name}}和 {{chat_friend.name}} id:{{chat_friend.id}}聊天 -->
      <ul class="message-list" v-if="chat_friend.name">
        <li v-for="(item,$index) in message" :key="$index" :class="{send:item.type =='send',receive:item.type=='receive'}">
          <avatar :src="host+'upload/'+chat_friend.logo" :username="chat_friend.name" :size="70"  v-if="item.type=='receive'&&chat_friend.logo!='null'" class="avatar"></avatar>
          <avatar :src="host+'upload/null.jpg'" :username="chat_friend.name" :size="70"  v-if="item.type=='receive'&&chat_friend.logo=='null'" class="avatar"></avatar>
          <avatar :src="host+'upload/'+me.logo" :username="me.nickname" :size="70"  v-if="item.type=='send'&&me.logo" class="avatar"></avatar>
          <avatar :src="host+'upload/null.jpg'" :username="me.nickname" :size="70"  v-if="item.type=='send'&&!me.logo" class="avatar"></avatar>
          <div class="text">
            {{item.text}}
          </div>
        </li>
      </ul>

    </div>
    <div class="input-box">
      <el-input type="text" v-model="text"></el-input>
      <el-button @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import {
  getCookie
} from "../public/js/cookies.api";
import { input, button, Message } from "element-ui";
import io from "../../../node_modules/socket.io-client/dist/socket.io";
import Avatar from 'vue-avatar/dist/Avatar.vue';
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from "vuex";
export default {
  data() {
    return {
      text: "",
      chatRoom:null,
    }
  },
  methods: {
    ...mapMutations(["set_me", "set_socket", "set_chat_friend", "clearUnread"]),
    ...mapActions(["get_message", "send_message", "getFriends", "clear_unread"]),
    sendMessage() {
      if (this.text == "") {
        Message.error("不能发送空消息");
        return;
      }                                                       //发送消息
      this.socket.emit("message", {
        friend: {
          name: this.chat_friend.name,
          id: this.chat_friend.id,
          logo: this.chat_friend.logo
        },
        text: this.text,
        user: {
          name: this.me.nickname,
          id: this.me.id,
          logo: this.me.logo
        },
        sendTime: (new Date()).valueOf(),
        readed: false,
        type: 'send'
      });
      this.text = "";
    },
    updateHandle(){
      console.log(this.$refs)
        this.get_message({
          userid: this.me.id,
          friendid: this.chat_friend.id
        }).then(() => {
          this.$nextTick(()=>{
            // var chatRoom = $(".chat .chat-room").eq(0)[0];
            // chatRoom.scrollTop = chatRoom.scrollHeight;
            this.$refs.chatRoom.scrollTop = this.$refs.chatRoom.scrollHeight;
          });
        });
        if(this.$route.path=="/chat"){
          this.socket.emit("clearunread", {
            userid: this.me.id,
            friendid: this.chat_friend.id
          });
        }
    }
  },
  computed: {
    ...mapState(["chat_friend", "me", "message", "socket", "host"])
  },
  props: ["init"],
  mounted() {
    console.log("chat")
    var cookie_user = JSON.parse(getCookie("user"));
    this.set_me(cookie_user);
    this.getFriends(this.me.id);
    var friend_name = this.$route.query.nickname;
    var friend_id = this.$route.query.id;
    var friend_logo = this.$route.query.logo;
    if (cookie_user && friend_name && friend_id) {
      // if(this.socket == null){
      //   this.set_socket(io.connect("http://localhost:3000/"));
      //   this.socket.emit("login", this.me);
      // }
      if (!this.socket) {
        this.set_socket(io.connect(this.host));
        this.socket.emit("login", this.me);
      }
      if (!this.init.chat_init) {
        this.init.setInit("chat_init");

      }
      this.socket.off("update");
      this.socket.on("update", this.updateHandle);
      if (!friend_logo) {
        friend_logo = "";
      }
      this.set_chat_friend({
        friend: {
          nickname: friend_name,
          id: friend_id,
          logo: friend_logo
        }
      });
      this.get_message({
        userid: this.me.id,
        friendid: this.chat_friend.id
      }).then(() => {
        this.$nextTick(()=>{
          this.$refs.chatRoom.scrollTop = this.$refs.chatRoom.scrollHeight;
        });
      });
    } else {
      this.$router.push("/login");
    }
    this.socket.emit("clearunread", {
      userid: this.me.id,
      friendid: this.chat_friend.id
    });
    this.socket.on("clearAll", () => {
      // alert("clear");
    })
  },
  components: {
    Avatar,
    "el-input": input,
    "el-button": button
  }
}

</script>

<style lang="less">
.chat {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0 30px 0 30px;
  box-sizing: border-box;
  background: #f5f5f5;
  .chat-room {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 36px;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 10px 0 10px;
    box-sizing: border-box;
    .message-list {
      li {
        display: flex;
        min-height: 70px;
        margin-bottom: 10px;
        .avatar {background-size: contain !important;}
        .text {
          align-self: center;
          font-size: 16px;
          padding: 10px;
          border-radius: 6px;
          max-width: 90%;
          width:auto;
          word-break: break-all;
          text-align: left;
        }
      }
      .receive {
        flex-direction: row;
        .text {
          background: #fff;
          margin-left: 6px;
        }
      }
      .send {
        flex-direction: row-reverse;
        .text {
          background: #9eea6a;
          margin-right: 6px;
        }
      }
    }
  }
  .input-box {
    display: flex;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>
