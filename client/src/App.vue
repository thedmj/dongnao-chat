<template>
  <div id="app">
    <button @click="logout">注销</button>
    <router-view ref="rv"></router-view>
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
          // this.$router.push("/login");
        }
      }
    },
    methods: {
      ...mapMutations(["set_me"]),
      logout() {
        removeCookie("user");
        this.$router.push("/login");
      }
    }
  }

</script>

<style lang="less">
  html,body{width:100%;height:100%;}
  html{font-size:625%;}
  body{background: #ccc;}
  #app {box-sizing: border-box;padding:30px;font-size:0.12rem;overflow: auto;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    max-width: 7.5rem;
    height: 100%;
    margin: auto;
    background: #fff;
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
