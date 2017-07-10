<template>
  <div class="post">
      posts
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

</style>
