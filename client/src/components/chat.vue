<template>
  <div class="chat">
      {{me.name}}和
      {{chat_friend.name}} id:{{chat_friend.id}}聊天
      <ul>
        <li v-for="(item,$index) in message" :key="$index">
          <span v-if="item.type == 'send'">{{item.user}}</span>
          <span v-else >{{item.friend}}</span>
          :{{item.text}}
        </li>
      </ul>
      <input type="text" v-model="text">
      <button @click="sendMessage">发送</button>
  </div>
</template>

<script>
import io from "../../../node_modules/socket.io-client/dist/socket.io";
import {mapState,mapGetters,mapActions,mapMutations} from "vuex";
export default {
  data(){
    return {
      text:"",
    }
  },
  methods: {
    ...mapActions(["get_message","send_message"]),
    sendMessage(){
      var socket = io.connect("http://localhost:3000/");
      socket.on("update", ()=>{
        this.get_message()
      });
      socket.emit("message",{friend:this.chat_friend.name,text:this.text,user:this.me.name,type:'send'});
      this.text="";
    }
  },
  computed: {
    ...mapState(["chat_friend","me","message"])
  },
  mounted () {
    var username = this.$route.query.username;
    this.get_message({user:this.me.name,friend:this.chat_friend.name});
  }
}
</script>

<style lang="less">

</style>
