<template>
  <div class="chat">
    <div class="chat-room" v-if="chat_friend.name">
      {{me.name}}和 {{chat_friend.name}} id:{{chat_friend.id}}聊天
      <ul>
        <li v-for="(item,$index) in message" :key="$index">
          <span>{{item.user.name}}</span>
          <!-- <avatar username="老宋"></avatar> -->
          :{{item.text}}
        </li>
      </ul>
      <input type="text" v-model="text">
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
  import {
    getCookie
  } from "../public/js/cookies.api";
  import io from "../../../node_modules/socket.io-client/dist/socket.io";
  import Avatar from 'vue-avatar/dist/Avatar'
  import {
    mapState,
    mapGetters,
    mapActions,
    mapMutations
  } from "vuex";
  export default {
    data() {
      return {
        text: ""
      }
    },
    methods: {
      ...mapMutations(["set_me","set_socket","set_chat_friend"]),
      ...mapActions(["get_message", "send_message", "getFriends"]),
      sendMessage() {
        
        this.socket.emit("message", {
          friend: {
            name: this.chat_friend.name,
            id: this.chat_friend.id
          },
          text: this.text,
          user: {
            name: this.me.nickname,
            id: this.me.id
          },
          type: 'send'
        });
        this.text = "";
      }
    },
    computed: {
      ...mapState(["chat_friend", "me", "message","socket"])
    },
    mounted() {
      var cookie_user = JSON.parse(getCookie("user"));
      this.set_me(cookie_user);
      this.getFriends(this.me.id);
      var friend_name = this.$route.query.username;
      var friend_id = this.$route.query.id;
      if (cookie_user && friend_name && friend_id) {
        // if(this.socket == null){
        //   this.set_socket(io.connect("http://localhost:3000/"));
        //   this.socket.emit("login", this.me);
        // }
        this.set_socket(io.connect("http://localhost:3000/"));
        this.socket.emit("login", this.me);
          this.socket.on("update", () => {
            this.get_message({
              user: this.me.nickname,
              friend: this.chat_friend.name
            });
          });
        if (this.$route.query.username) {
          var username = this.$route.query.username;
          this.set_chat_friend({
            name: friend_name,
            id:friend_id
          });
          this.get_message({
            user: this.me.nickname,
            friend: this.chat_friend.name
          });
        }
      } else {
        this.$router.push("/login");
      }
    },
    components: {
      Avatar
    }
  }

</script>

<style lang="less">


</style>
