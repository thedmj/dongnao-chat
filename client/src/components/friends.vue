<template>
  <div class="friends" >
      <h3>好友列表</h3>
      <ul>
        <li v-for="friend in friends" :key="friend.id" @click="chat(friend.nickname)">
          <img :src="'http://localhost:3000/upload/'+friend.logo" alt="" width="60" height="60">
          {{friend.nickname}}
        </li>
      </ul>
  </div>
</template>

<script>
import {mapState,mapGetters,mapActions} from "vuex";
export default {
  methods: {
      ...mapActions(["getFriends"]),
      chat(username){
        this.$router.push("/chat"+"?username="+username)
      }
  },
  computed: {
    ...mapState(["friends"])
    // ...mapState({test:function(state){
    //   return state.test
    // }})
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
