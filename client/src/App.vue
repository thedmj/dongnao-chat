<template>
  <div id="app">
    <router-view ref="rv"></router-view>
  </div>
</template>

<script>
function getCookie(key) {
    var cookieArr = document.cookie.split('; ');
    for(var i = 0; i < cookieArr.length; i++) {
        var arr = cookieArr[i].split('=');
        if(arr[0] === key) {
            return arr[1];
        }
    }
    return false;
}
import {mapState,mapGetters,mapActions,mapMutations} from "vuex";
export default {
  name: 'app',
  computed: {
    ...mapState(["me"])
  },
  mounted () {
    console.log(this.me)
    var cookie_user =JSON.parse(getCookie("user"));
    this.set_me(cookie_user);
    console.log(this.me)
    if(cookie_user.status != 0){
      this.$router.push("/login");
    }else{
      console.log("app has cookie")
      this.$router.push("/friends");
      this.$refs.rv.getFriends();
    }
  },
  watch:{
    $route(){
      if(this.me == null){
        this.$router.push("/login");
      }
    }
  },
  methods: {
    ...mapMutations(["set_me"])
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
