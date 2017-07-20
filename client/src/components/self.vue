<template>
  <div class="self" v-if="me">
    <img :src="'http://localhost:3000/upload/'+me.logo" alt="" width="60" height="60">
    <h1>{{me.name}}</h1>
    <form action="">
      <input type="text" v-model="search_name">
      <button type="button" @click="search(search_name)">搜索</button>
    </form>
    <ul>
      <li v-for="user in search_friend_result" :key="user.id">
        <img :src="'http://localhost:3000/upload/'+user.logo" alt="" width="60" height="60">
        <h2>{{user.nickname}}</h2>
        <button @click="sendRequest(me,user)">申请好友</button>
      </li>
    </ul>
    <div class="request">
      <ul class="get">
        <h5>收到好友申请：</h5>
        <li v-for="item in request_list.get" :key="item.id">
          r_id:{{item.r_id}} {{item.nickname}} id:{{item.u_id}}请求添加你为好友 respone:{{item.respone}}
          <div class="buttons" v-if="item.respone == null">
            <button @click="request_handle(item.u_id,item.r_id,'agree')">同意</button>
            <button @click="request_handle(item.u_id,item.r_id,'refuse')">拒绝</button>
          </div>
          <p v-else-if="item.respone == 1">
            已经同意了
          </p>
          <p v-else>
            已经拒绝了
          </p>
          
        </li>
      </ul>
      <ul class="send">
        <h5>已发送的好友请求：</h5>
        <li v-for="item in request_list.send" :key="item.id">
          <p v-if="item.respone == null">r_id:{{item.r_id}} 你请求{{item.nickname}} id:{{item.u_id}}为好友 等待对方验证</p>
          <p v-else-if="item.respone == 1">r_id:{{item.r_id}} 你请求{{item.nickname}} id:{{item.u_id}}为好友  对方接受了你的请求</p>
          <p v-else>r_id:{{item.r_id}} 你请求{{item.nickname}} id:{{item.u_id}}为好友  对方拒绝了你的请求</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import {getCookie} from "../public/js/cookies.api";
import io from "../../../node_modules/socket.io-client/dist/socket.io";
import {
    mapState,
    mapGetters,
    mapActions,
    mapMutations
  } from "vuex";
  let host = "http://localhost:3000/";

export default {
  data () {
    return {
      search_name:"",
      search_friend_result:[]
    }
  },
  mounted () {
    var cookie_user = JSON.parse(getCookie("user"));
    this.set_me(cookie_user);
    if(!cookie_user){
      this.$router.push("/login");
    }else{
      // this.socket = io.connect("http://localhost:3000/");
      // this.socket.emit("login", this.me);
      this.set_socket(io.connect("http://localhost:3000/"));
      this.socket.emit("login", this.me);
      this.socket.on("get_request",(data)=>{ //在线时收到好友请求
          this.fetch_request_list(this.me.id);
          alert("你收到一个好友请求")
      });
      this.socket.on("request_result",(res)=>{ //对方验证请求后 看到结果
        this.fetch_request_list(this.me.id);
      })
    }
    this.fetch_request_list(this.me.id).then((data)=>{ //获取请求列表
      // console.log(data)
    });
  },
  methods: {
      ...mapActions(["getFriends","search_friend","fetch_request_list"]),
      ...mapMutations(["set_chat_friend", "set_me","addUnread","clearUnread","set_socket"]),
      search(name){
        var id = this.me.id;
        this.search_friend({name,id}).then((list)=>{
          this.search_friend_result = list;
        });
      },
      sendRequest(from,to){
        this.socket.emit("friend_request",{from,to});
      },
      request_handle(id,request_id,type){ //同意
        var This = this;
        $.ajax({
          url:host + "user/" + id + "/af",
          type:"post",
          data:{id:this.me.id,userid:id,request_id,type:type},
          success(res){
            // console.log(res);
            This.fetch_request_list(This.me.id); //成功后重新刷新请求列表
          }
        });
      },
      
    },
  computed: {
    ...mapState(["friends", "me","request_list","socket"])
  },
}
</script>

<style lang="less">

</style>
