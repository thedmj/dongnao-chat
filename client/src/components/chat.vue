<template>
  <div class="chat">
      {{me.name}}和
      {{chat_friend.name}} id:{{chat_friend.id}}聊天
      <ul>
        <li v-for="(item,$index) in message" :key="$index">
          <span >{{item.user.name}}</span><avatar username="老宋"></avatar>
          :{{item.text}}
        </li>
      </ul>
      <input type="text" v-model="text">
      <button @click="sendMessage">发送</button>
  </div>
</template>

<script>
import io from "../../../node_modules/socket.io-client/dist/socket.io";
import Avatar from 'vue-avatar/dist/Avatar'
import {mapState,mapGetters,mapActions,mapMutations} from "vuex";
export default {
  data(){
    return {
      text:"",
      socket:null
    }
  },
  methods: {
    ...mapActions(["get_message","send_message"]),
    sendMessage(){
      this.socket.emit("message",{friend:{name:this.chat_friend.name,id:this.chat_friend.id},text:this.text,user:{name:this.me.name,id:this.me.id},type:'send'});
      this.text="";
    }
  },
  computed: {
    ...mapState(["chat_friend","me","message"])
  },
  mounted () {
    this.socket = io.connect("http://localhost:3000/");
    if(this.me){
      this.socket.emit("login",this.me);
      this.socket.on("update", ()=>{
        this.get_message({user:this.me.name,friend:this.chat_friend.name})
      });
      if(this.$route.query.username){
        var username = this.$route.query.username;
        this.get_message({user:this.me.name,friend:this.chat_friend.name});
        console.log(this.message)
      }
    }
  },
  components: {
    Avatar
  }
}
</script>

<style lang="less">

</style>
