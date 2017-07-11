<template>
  <div class="post">
      <ul>
        <li v-for="post in posts" :key="post.postid">
          <h3>{{post.posttitle}}</h3>
          <p>{{post.postcontent}}</p>
        </li>
      </ul>
  </div>
</template>

<script>
import {mapActions,mapState} from "vuex";
export default {
  computed: {
    ...mapState(["posts"])
  },
  methods: {
    ...mapActions(["getPosts"])
  },
  mounted () {
    this.getPosts();
  }
}
</script>

<style lang="less">
  ul{list-style: none;text-align: left;
    li{margin-bottom: 30px;border-bottom: 1px solid #ccc;}
  }
</style>
