<template>
  <div class="hello">
    <el-button>aaa</el-button>
  </div>
</template>

<script>
import {button} from "element-ui";

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components:{
    "el-button":button
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
