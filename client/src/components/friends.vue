<template>
  <div class="friends" >
      <h3>好友列表</h3>
      <ul>
        <li v-for="friend in friends" :key="friend.id" @click="chat(friend.nickname,friend.id)">
          <img :src="'http://localhost:3000/upload/'+friend.logo" alt="" width="60" height="60">
          {{friend.nickname}}
        </li>
      </ul>
  </div>
</template>

<script>
import {mapState,mapGetters,mapActions,mapMutations} from "vuex";
export default {
  methods: {
      ...mapActions(["getFriends"]),
      ...mapMutations(["set_chat_friend","setMe"]),
      chat(username,id){
        
        this.$router.push("/chat"+"?username="+username);
        this.set_chat_friend({name:username,id});
      }
  },
  computed: {
    ...mapState(["friends"])
  },
  mounted () {
    this.getFriends();
  }
}
</script>

<style lang="less">
  *{margin:0;padding:0;}
  ul{list-style: none;}
</style>
