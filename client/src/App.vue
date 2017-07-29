<template>
  <div id="app">
    <div class="title">{{$route.name}}</div>
    <div class="content">
      <router-view ref="rv"></router-view>
    </div>
    <div class="menu" v-if="me">
      <el-menu theme="dark" :default-active="'1'" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="friends">朋友</el-menu-item>
        <el-menu-item index="posts">朋友圈</el-menu-item>
        <el-menu-item index="self">我</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import{Menu,MenuItem,} from "element-ui";
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
      if(cookie_user){
        this.set_me(cookie_user);
      }
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
        this.set_me(null);
      },
      handleSelect(index){
        this.$router.push("/"+index);
      }
    },
    components: {
      "el-menu":Menu,
      "el-menu-item":MenuItem
    }
  }

</script>

<style lang="less">
  html,body{width:100%;height:100%;}
  html{font-size:625%;}
  body{background: #ccc;}
  @media screen and (max-width: 750px){
    #app{width:100%;}
  }
  #app {box-sizing: border-box;font-size:0.12rem;overflow: auto;position: relative;background:#f5f5f5;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    
    max-width: 7.5rem;
    height: 100%;
    margin: auto;
    background: #fff;
    .title{height:60px;line-height: 60px;background: #000;color:#fff;position: absolute;left: 0;top:0;width:100%;font-size: 16px;z-index: 9;}
    .content{position: absolute;top:60px;bottom:60px;overflow: auto;box-sizing: border-box;width:100%;}
    .menu{position: absolute;left: 0;bottom: 0;width: 100%;z-index:9;
      ul{display: flex;
        li{flex-grow:1;}
      }
    }
  }
  .clearfix{display:inline-block;
      &:after{content: '';display: block;height:0;clear:both;}
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
