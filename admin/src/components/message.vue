<template>
  <div class="message">
      <p v-if="user != '' && friend != ''">
        {{user}}和{{friend}}的聊天记录：
      </p>
      <ul>
        <li v-for="(text,i) in message" :key="i">{{text}}</li>
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
    getMessage(user,friend,(e)=>{
      this.message = e;
    })
  }
}
</script>

<style lang="less">

</style>
