<template>
  <div class="post">
    <ul>
      <li v-for="post in posts" :key="post.postid">
        <img :src="'http://localhost:3000/upload/'+post.logo" alt="" width=60 height=60>
        <h3>{{post.posttitle}}</h3>
        <p>{{post.postcontent}}</p>
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
      ...mapState(["posts","me"])
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
  .post{

  }

</style>
