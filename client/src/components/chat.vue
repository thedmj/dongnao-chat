<template>
  <div class="chat">
      chat
  </div>
</template>

<script>
import io from "../../../node_modules/socket.io-client/dist/socket.io";
export default {
  
  mounted () {
    console.log("chat");
    var socket = io.connect("http://localhost:3000/");
    socket.on("test",function(data){
      console.log(data);
    });
    socket.emit("test","hello");
  }
}
</script>

<style lang="less">

</style>
