<template>
  <div class="friends">
    <h3>好友列表</h3>
    <ul>
      <li v-for="friend in friends" :key="friend.id" @click="chat(friend.nickname,friend.id,friend)">
        <el-badge :value="friend.unread" class="item">
          <img :src="'http://localhost:3000/upload/'+friend.logo" alt="" width="60" height="60">
        </el-badge>
        {{friend.nickname}}{{friend.unread}}

      </li>
    </ul>
  </div>
</template>

<script>
  import {getCookie} from "../public/js/cookies.api";
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
    methods: {
      ...mapActions(["getFriends"]),
      ...mapMutations(["set_chat_friend", "set_me","addUnread","clearUnread","set_socket"]),
      chat(username, id,friend) {
        this.$router.push("/chat" + "?username=" + username+"&id="+id);
        this.set_chat_friend({
          name: username,
          id
        });
        this.clearUnread(id)
      }
      
    },
    computed: {
      ...mapState(["friends", "me","socket"])
    },
    mounted() {
      var cookie_user = JSON.parse(getCookie("user"));
      this.set_me(cookie_user);
      
      if (!cookie_user) {
        this.$router.push("/login");
      }
      if (this.me) {
        this.getFriends(this.me.id);
        this.set_socket(io.connect("http://localhost:3000/"));
        this.socket.emit("login", this.me);
        this.socket.on("addUnread", (data)=> {
          this.addUnread(data);
        });
        this.socket.on("get_request",(data)=>{ //在线时收到好友请求
          console.log(data);
          // this.fetch_request_list(this.me.id);
          alert("你收到一个好友请求")
      });
      }
    },
    components: {
      "el-badge": Badge
    }
  }

</script>

<style lang="less">
  

</style>
