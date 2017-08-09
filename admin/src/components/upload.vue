<template>
  <div class="upload">
      <form :action="action" method="post" enctype="multipart/form-data">
        <input type="file" name="file">
        <button type="submit" >点击上传</button>
      </form>
  </div>
</template>

<script>
export default {
  data(){
    return {
      action:""
    }
  },
  mounted(){
    var id = this.$route.params.id;
    this.action = "http://localhost:3000/user/"+id+"/upload";
  }
}
</script>

<style lang="less">

</style>
