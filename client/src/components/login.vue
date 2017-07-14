<template>
    <div class="login">
        <input type="text" v-model="username" ref="username">
        <input type="text" v-model="password" ref="password">
        <button @click="submit">登录</button>
    </div>
</template>

<script>
function setcookie(name,value,iday){
　　var odate=new Date();
　　odate.setDate(odate.getDate()+iday);
　　document.cookie=name+"="+value+";expires="+odate;
}
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
function removeCookie(key) {
    setCookie(key, '', -1);//这里只需要把Cookie保质期退回一天便可以删除
}
import $ from "jquery";
import {mapState,mapGetters,mapActions,mapMutations} from "vuex";
export default {
  data () {
      return {
          username:"",
          password:""
      }
  },
  methods: {
      ...mapMutations(["set_me"]),
      submit(){
        var This = this;
        var username = this.$refs.username.value;
        var password = this.$refs.password.value;
        $.ajax({
            url:"http://localhost:3000/login",
            data:{
                username,
                password
            },
            type:"post",
            success(res){
                if(res.status==0){
                    This.set_me(res);
                    setcookie("user",JSON.stringify(res),60000);
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
