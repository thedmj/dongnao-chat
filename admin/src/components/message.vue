<template>
  <div class="message">
      <p v-if="user != '' && friend != ''">
        {{user}}和{{friend}}的聊天记录：
      </p>
      <ul>
        <li v-for="(item,index) in message" :key="index">{{item.user.name}}:{{item.text}}</li>
      </ul>
  </div>
</template>

<script>
import {getMessage} from "../public/js/message.api.js";
export default {
  data(){
    return {
      user:"",
      friend:"",
      message:[],
    }
  },
  methods:{

  },
  mounted(){
    var user = this.$route.query.user;
    var friend = this.$route.query.friend;
    getMessage(user,friend,(res)=>{
      this.message = res;
    })
  }
}
</script>

<style lang="less">

</style>
