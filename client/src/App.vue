<template>
  <div id="app">
    <router-view ref="rv"></router-view>
    <button @click="logout">注销</button>
  </div>
</template>

<script>
  import {
    getCookie,
    removeCookie
  } from "./public/js/cookies.api";
  import {
    mapState,
    mapGetters,
    mapActions,
    mapMutations
  } from "vuex";
  export default {
    name: 'app',
    computed: {
      ...mapState(["me", "socket"])
    },
    mounted() {
      var cookie_user = JSON.parse(getCookie("user"));
      this.set_me(cookie_user);
      if (cookie_user.status != 0) {
        this.$router.push("/login");
      } else {
        // this.$router.push("/self");
        // if(this.$refs.rv){
        //   this.$refs.rv.getFriends(this.me.id);
        // }
      }
    },
    watch: {
      $route() {
        if (this.me == null) {
          this.$router.push("/login");
        }
      }
    },
    methods: {
      ...mapMutations(["set_me"]),
      logout() {
        removeCookie("user");
        this.$router.push("/login");
        this.socket.reconnect();
      }
    }
  }

</script>

<style lang="less">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

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
