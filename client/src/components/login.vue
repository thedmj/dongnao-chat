<template>
    <div class="login">
        <input type="text" v-model="username" ref="username">
        <input type="text" v-model="password" ref="password">
        <button @click="submit">登录</button>
    </div>
</template>

<script>
import io from "../../../node_modules/socket.io-client/dist/socket.io";
import{setCookie,getCookie} from "../public/js/cookies.api";
import $ from "jquery";
import {mapState,mapGetters,mapActions,mapMutations} from "vuex";
export default {
  data () {
      return {
          username:"",
          password:""
      }
  },
  mounted () {
    var cookie_user =JSON.parse(getCookie("user"));
    if(cookie_user){
        this.$router.push("/friends");
    }
  },
  computed: {
    ...mapState(["friends","me","socket","host"])
  },
  methods: {
      ...mapMutations(["set_me","set_socket"]),
      submit(){
        var This = this;
        var username = this.$refs.username.value;
        var password = this.$refs.password.value;
        $.ajax({
            url:this.host+"login",
            data:{
                username,
                password
            },
            type:"post",
            success(res){
                if(res.status==0){
                    This.set_me(res);
                    setCookie("user",JSON.stringify(res),1);
                    This.set_socket(io.connect(this.host));
                    This.socket.emit("login", This.me);
                    This.$router.push("/friends");
                }
            }
        });
      }
  }
}
</script>

<style lang="less">

</style>
