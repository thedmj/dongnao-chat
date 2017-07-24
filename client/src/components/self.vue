<template>
  <div class="self" v-if="me">
    <!-- 上传头像start -->
      
      <el-upload class="avatar-uploader" :class="'uploader'" :name="'img'" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="me.logo" :src="'http://localhost:3000/upload/'+me.logo" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      
    
    
    <!-- 上传头像end -->


    <!-- 搜索好友start -->
    <h1 class="name">{{me.nickname}}</h1></br>
    <el-button type="primary" size="large" @click="show_search" class="add_friend_btn">添加好友</el-button>
    <el-dialog title="搜索好友" :visible.sync="search_friend_visible" size="tiny" :class="'search_dialog'" :before-close="handleClose">

      <form action="">
        <el-input placeholder="请输入昵称，不输入则查找全部" icon="search" v-model="search_name" :on-icon-click="search">
        </el-input>
      </form>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <ul>
              <li v-for="user in search_friend_result" :key="user.id">
                <img :src="'http://localhost:3000/upload/'+user.logo" alt="" width="60" height="60">
                <h2>{{user.nickname}}</h2>
                <button @click="sendRequest(me,user)">申请好友</button>
              </li>
            </ul>
            <ul>
              <li v-for="user in search_friend_result" :key="user.id">
                <img :src="'http://localhost:3000/upload/'+user.logo" alt="" width="60" height="60">
                <h2>{{user.nickname}}</h2>
                <button @click="sendRequest(me,user)">申请好友</button>
              </li>
            </ul>
            <ul>
              <li v-for="user in search_friend_result" :key="user.id">
                <img :src="'http://localhost:3000/upload/'+user.logo" alt="" width="60" height="60">
                <h2>{{user.nickname}}</h2>
                <button @click="sendRequest(me,user)">申请好友</button>
              </li>
            </ul>
            <span slot="footer" class="dialog-footer">
            </span>
          </div>
        </div>
        <!-- Add Scroll Bar -->
        <div class="swiper-scrollbar"></div>
      </div>

    </el-dialog>


    <!-- 搜索好友end -->
    <div class="request">
      <ul class="get">
        <h5>收到好友申请：</h5>
        <li v-for="item in request_list.get" :key="item.id">
          r_id:{{item.r_id}} {{item.nickname}} id:{{item.u_id}}请求添加你为好友 respone:{{item.respone}}
          <div class="buttons" v-if="item.respone == null">
            <button @click="request_handle(item.u_id,item.r_id,'agree')">同意</button>
            <button @click="request_handle(item.u_id,item.r_id,'refuse')">拒绝</button>
          </div>
          <p v-else-if="item.respone == 1">
            已经同意了
          </p>
          <p v-else>
            已经拒绝了
          </p>

        </li>
      </ul>
      <ul class="send">
        <h5>已发送的好友请求：</h5>
        <li v-for="item in request_list.send" :key="item.id">
          <p v-if="item.respone == null">r_id:{{item.r_id}} 你请求{{item.nickname}} id:{{item.u_id}}为好友 等待对方验证</p>
          <p v-else-if="item.respone == 1">r_id:{{item.r_id}} 你请求{{item.nickname}} id:{{item.u_id}}为好友 对方接受了你的请求</p>
          <p v-else>r_id:{{item.r_id}} 你请求{{item.nickname}} id:{{item.u_id}}为好友 对方拒绝了你的请求</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import $ from "jquery";
  import Swiper from "swiper";
  import {
    getCookie,setCookie
  } from "../public/js/cookies.api";
  import io from "../../../node_modules/socket.io-client/dist/socket.io";
  import {
    mapState,
    mapGetters,
    mapActions,
    mapMutations
  } from "vuex";
  import {
    upload,
    button,
    dialog,
    input
  } from "element-ui";
  let host = "http://localhost:3000/";

  export default {
    data() {
      return {
        search_name: "",
        search_friend_result: [],
        action: "",
        search_friend_visible: false,
        swiper: null
      }
    },
    mounted() {
      var cookie_user = JSON.parse(getCookie("user"));
      this.set_me(cookie_user);
      if (!cookie_user) {
        console.log("no cookie")
        this.$router.push("/login");
      } else {
        // this.socket = io.connect("http://localhost:3000/");
        // this.socket.emit("login", this.me);
        var id = this.me.id;
        this.action = "http://localhost:3000/user/" + id + "/upload";
        this.set_socket(io.connect("http://localhost:3000/"));
        this.socket.emit("login", this.me);
        this.socket.on("get_request", (data) => { //在线时收到好友请求
          this.fetch_request_list(this.me.id);
          alert("你收到一个好友请求")
        });
        this.socket.on("request_result", (res) => { //对方验证请求后 看到结果
          this.fetch_request_list(this.me.id);
        });



      }
      this.fetch_request_list(this.me.id).then((data) => { //获取请求列表
        // console.log(data)
      });
    },
    methods: {
      ...mapActions(["getFriends", "search_friend", "fetch_request_list"]),
      ...mapMutations(["set_chat_friend", "set_me", "addUnread", "clearUnread", "set_socket"]),
      search() {
        var id = this.me.id;
        this.search_friend({
          name: this.search_name,
          id
        }).then((list) => {
          this.search_friend_result = list;
          this.$nextTick(() => {
            if(this.swiper){
              this.swiper.update();
              this.swiper.onResize(); 
            }else{
              this.swiper = new Swiper('.swiper-container', {
                  scrollbar: '.swiper-scrollbar',
                  direction: 'vertical',
                  slidesPerView: 'auto',
                  mousewheelControl: true,
                  freeMode: true,
                  roundLengths: true, //防止文字模糊
                });
            }
            
          })
        });
      },
      sendRequest(from, to) {
        this.socket.emit("friend_request", {
          from,
          to
        });
        this.fetch_request_list(this.me.id);
      },
      request_handle(id, request_id, type) { //同意
        var This = this;
        $.ajax({
          url: host + "user/" + id + "/af",
          type: "post",
          data: {
            id: this.me.id,
            userid: id,
            request_id,
            type: type
          },
          success(res) {
            // console.log(res);
            This.fetch_request_list(This.me.id); //成功后重新刷新请求列表
          }
        });
      },
      //图片上传
      handleAvatarSuccess(res, file) {
        // console.log(res,file);
        this.me.logo = res.logo;
        this.set_me(this.me);
        var res = {
          id:this.me.id,
          nickname:this.me.nickname,
          username:this.me.username,
          logo:this.me.logo,
          status:0
        }
        setCookie("user",JSON.stringify(res),1);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //搜索好友
      show_search() {
        this.search_friend_visible = true;
        
      },
      handleClose(done) {
        this.search_friend_visible = false;
      }
    },
    computed: {
      ...mapState(["friends", "me", "request_list", "socket"])
    },
    components: {
      "el-upload": upload,
      "el-button": button,
      "el-dialog": dialog,
      "el-input": input
    }
  }

</script>

<style lang="less">
  @import "../assets/css/swiper.min.css";
  .self{width:1000px;margin:auto;text-align: left;
    .uploader{
      text-align: left;
      display: inline-block;
      width:160px;
      height:160px;
      vertical-align: bottom;
      img{width:100%;height:100%; }
    }
    .name{display: inline-block;}
    .add_friend_btn{vertical-align: bottom;}
    .search_dialog{text-align: center;vertical-align: top;}

    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .swiper-container {
    width: 100%;
    height: 500px;
  }

  .swiper-slide {
    font-size: 18px;
    height: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 30px;
    font-size: 13px;
    font-family: microsoft yahei;
    line-height: 1.8;
  }
  }
  

</style>
