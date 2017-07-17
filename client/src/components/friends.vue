<template>
  <div class="friends">
    <h3>好友列表</h3>
    <ul>
      <li v-for="friend in friends" :key="friend.id" @click="chat(friend.nickname,friend.id)">
        <el-badge :value="friend.unread" class="item">
          <img :src="'http://localhost:3000/upload/'+friend.logo" alt="" width="60" height="60">
        </el-badge>
        {{friend.nickname}}{{friend.unread}}

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
        socket: null
      }
    },
    methods: {
      ...mapActions(["getFriends"]),
      ...mapMutations(["set_chat_friend", "set_me","addUnread"]),
      chat(username, id) {
        this.$router.push("/chat" + "?username=" + username);
        this.set_chat_friend({
          name: username,
          id
        });
      }
    },
    computed: {
      ...mapState(["friends", "me"])
    },
    mounted() {
      var cookie_user = JSON.parse(getCookie("user"));
      this.set_me(cookie_user);
      this.socket = io.connect("http://localhost:3000/");
      this.socket.emit("login", this.me);
      this.socket.on("addUnread", (data)=> {
        this.addUnread(data);
      });
      if (!cookie_user) {
        this.$router.push("/login");
      }
      if (this.me) {
        this.getFriends(this.me.id);
      }
    },
    components: {
      "el-badge": Badge
    }
  }

</script>

<style lang="less">
  * {
    margin: 0;
    padding: 0;
  }

  ul {
    list-style: none;
    .item {
      margin-top: 10px;
      margin-right: 40px;
    }
  }

</style>
