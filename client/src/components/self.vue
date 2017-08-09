<template>
  <div class="self" v-if="me" v-loading="loading">
    <!-- 上传头像start -->
    <div class="header">
      <el-upload class="avatar-uploader" :class="'uploader'" :name="'img'" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload" :on-progress="uploadProgress">
        <img v-if="me.logo" :src="host+'upload/'+me.logo" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div class="user-info">
        <h1 class="nickname">昵称：{{me.nickname}}</h1>
        </br>
        <h2 class="username">用户名：{{me.username}}</h2>
      </div>
    </div>
    <!-- 退出按钮start -->
    <div class="logout-wrapper">
      <el-button class="logout_btn" type="danger" size="large" @click="logout">登 出</el-button>
    </div>
    <!-- 退出按钮end -->
    <div class="add_friend_btn_wrapper">
      <el-button type="primary" size="large" @click="showSlideBox = true" class="add_friend_btn">添加好友</el-button>
    </div>

    <!-- 上传头像end -->


    <!-- 搜索好友start -->


    <!-- <el-dialog title="搜索好友" :visible.sync="search_friend_visible" size="tiny" :class="'search_dialog'" :before-close="handleClose">
      
    </el-dialog> -->
    <transition name="fade">
      <div class="slide-box" v-show="showSlideBox">
        <form action="">
          <el-input placeholder="请输入昵称，不输入则查找全部" icon="search" v-model="search_name" :on-icon-click="search">
          </el-input>
        </form>
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <ul>
                <li v-for="user in search_friend_result" :key="user.id" class="friend-item">
                  <img :src="host+'upload/'+user.logo" alt="" width="70" height="70" v-if="user.logo">
                  <img :src="host+'upload/null.jpg'" alt="" width="70" height="70" v-if="!user.logo">
                  <div class="right">
                    <h2>{{user.nickname}}</h2>
                    <el-button type="primary" size="small" @click="sendRequest(me,user)">申请好友</el-button>
                  </div>
                </li>

                <!-- <li v-for="user in search_friend_result" :key="user.id" class="friend-item">
                  <img :src="host+'upload/'+user.logo" alt="" width="70" height="70">
                  <div class="right">
                    <h2>{{user.nickname}}</h2>
                    <el-button type="primary" size="small" @click="sendRequest(me,user)">申请好友</el-button>
                  </div>
                </li>

                <li v-for="user in search_friend_result" :key="user.id" class="friend-item">
                  <img :src="host+'upload/'+user.logo" alt="" width="70" height="70">
                  <div class="right">
                    <h2>{{user.nickname}}</h2>
                    <el-button type="primary" size="small" @click="sendRequest(me,user)">申请好友</el-button>
                  </div>
                </li> -->
              </ul>
              <span slot="footer" class="dialog-footer">
            </span>
            </div>
          </div>

          <div class="swiper-scrollbar"></div>
        </div>
        <div class="back-btn-wrapper">
          <el-button type="primary" size="large" @click="showSlideBox=false" class="back-btn">返回</el-button>
        </div>
      </div>
    </transition>



    <!-- 搜索好友end -->



    <!-- 查看请求start -->
    <div class="request">
      <el-collapse @change="collapse_handleChange">
        <el-collapse-item name="get">
          <template slot="title">
            <el-badge :value="num_get_request" class="item">
              你收到的请求
            </el-badge>
          </template>
          <ul class="get">
            <h5>收到好友申请：</h5>
            <li v-for="item in request_list.get" :key="item.id" class="request-item">
              {{item.nickname}} 请求添加你为好友
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
        </el-collapse-item>
        <el-collapse-item name="send">
          <template slot="title">
            <el-badge :value="num_send_request" class="item">
              你发出的请求
            </el-badge>
          </template>
          <ul class="send">
            <h5>已发送的好友请求：</h5>
            <li v-for="item in request_list.send" :key="item.id">
              <p v-if="item.respone == null">r_id:{{item.r_id}} 你请求{{item.nickname}} id:{{item.u_id}}为好友 等待对方验证</p>
              <p v-else-if="item.respone == 1">r_id:{{item.r_id}} 你请求{{item.nickname}} id:{{item.u_id}}为好友 对方接受了你的请求</p>
              <p v-else>r_id:{{item.r_id}} 你请求{{item.nickname}} id:{{item.u_id}}为好友 对方拒绝了你的请求</p>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>


    </div>
    <!-- 查看请求end -->

    
  </div>
</template>

<script>
  import $ from "jquery";
  import Swiper from "swiper";
  import {
    getCookie,
    setCookie,
    removeCookie
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
    input,
    collapse,
    collapseItem,
    badge,
    Message,
    
  } from "element-ui";

  export default {
    data() {
      return {
        search_name: "",
        search_friend_result: [],
        action: "",
        search_friend_visible: false,
        swiper: null,
        num_send_request: 0,
        showSlideBox: false,
        loading:false
      }
    },
    props:["init"],
    mounted() {
      console.log(getCookie("user"))
      var cookie_user = JSON.parse(getCookie("user"));

      if (!cookie_user) {
        this.$router.push("/login");
        this.set_me(null);
      } else {
        this.set_me(cookie_user);
        var id = this.me.id;
        this.action = this.host + "user/" + id + "/upload";
        this.getFriends(this.me.id);
        if(!this.socket){
          this.set_socket(io.connect(this.host));
          this.socket.emit("login", this.me);
        }
        if(!this.init.self_init){
          this.init.setInit("self_init");
          this.socket.on("get_request", (data) => { //在线时收到好友请求
            this.fetch_request_list(this.me.id);
            alert("你收到一个好友请求")
          });
          this.socket.on("request_result", (res) => { //对方验证请求后 看到结果
            this.fetch_request_list(this.me.id);
          });
          this.socket.on("wearefriend", () => {
            alert("收到啦");
            this.num_send_request++;
          });
        }
        
        this.fetch_request_list(this.me.id).then((data) => { //获取请求列表
          // console.log(data)
        });


      }

    },
    methods: {
      ...mapActions(["getFriends", "search_friend", "fetch_request_list"]),
      ...mapMutations(["set_chat_friend", "set_me", "addUnread", "clearUnread", "set_socket","set_friends","set_posts"]),
      search() {
        var id = this.me.id;
        this.search_friend({
          name: this.search_name,
          id
        }).then((list) => {
          this.search_friend_result = list;
          this.$nextTick(() => {
            if (this.swiper) {
              this.swiper.update();
              this.swiper.onResize();
            } else {
              this.swiper = new Swiper('.swiper-container', {
                scrollbar: '.swiper-scrollbar',
                direction: 'vertical',
                slidesPerView: 'auto',
                mousewheelControl: true,
                freeMode: true,
                roundLengths: true, //防止文字模糊
                scrollbarHide:false,
              });
            }

          })
        });
      },
      sendRequest(from, to) {
        var isFriend = false
        for (var i = 0; i < this.friends.length; i++) {
          if (this.friends[i].id == to.id) {
            isFriend = true;
            break;
          }
        }
        if (!isFriend) {
          this.socket.emit("friend_request", {
            from,
            to
          });
          this.fetch_request_list(this.me.id);
          Message({
            message: '成功发出请求',
            type: 'success'
          });
        } else {
          Message.error('你们已经是好友了，请不要重复添加。');
        }

      },
      request_handle(id, request_id, type) { //同意或拒绝
        var This = this;
        $.ajax({
          url: this.host + "user/" + id + "/af",
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
            This.socket.emit("wearefriend", id);
          }
        });
      },
      //图片上传
      handleAvatarSuccess(res, file) {
        console.log(res,file);
        this.me.logo = res.logo;
        var result = {
          id: this.me.id,
          nickname: this.me.nickname,
          username: this.me.username,
          logo: this.me.logo,
          status: 0
        }
         this.set_me(result);
        setCookie("user", JSON.stringify(result), 1);
        this.loading = false;
      },
      beforeAvatarUpload(file) {
        console.log(file.type)
        const isIMG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isIMG) {
          Message.error('上传头像图片只能是 JPG | PNG 格式!');
        }
        if (!isLt2M) {
          Message.error('上传头像图片大小不能超过 2MB!');
        }
        return isIMG && isLt2M;
      },
      uploadProgress(){
        this.loading = true;
      },
      //搜索好友
      show_search() {
        this.search_friend_visible = true;
      },
      handleClose(done) {
        this.search_friend_visible = false;
      },
      collapse_handleChange(activeNames) {
        // console.log(activeNames);
        // console.log(activeNames.indexOf("send"));
        if (activeNames.indexOf("send") >= 0) {
          this.num_send_request = 0;
        }
      },
      logout() {
        removeCookie("user");
        this.$router.push("/login");
        this.socket.emit("logout",this.me.id);
        this.socket.close();
        this.set_socket(null);
        this.set_me(null);
        this.set_friends([]);
        this.set_chat_friend(null);
        this.set_posts([]);
        this.init.setInit();
      },
    },
    computed: {
      ...mapState(["friends", "me", "request_list", "socket", "host"]),
      // num_send_request(){
      //   var num =0;
      //   this.request_list.send.map((o)=>{
      //     if(o.respone == null){
      //       num ++;
      //     }
      //   });
      //   return num;
      // },
      num_get_request() {
        var num = 0;
        this.request_list.get.map((o) => {
          if (o.respone == null) {
            num++;
          }
        });
        return num;
      }
    },
    components: {
      "el-upload": upload,
      "el-button": button,
      "el-dialog": dialog,
      "el-input": input,
      "el-collapse": collapse,
      "el-collapse-item": collapseItem,
      "el-badge": badge
    }
  }

</script>

<style lang="less">
  @import "../assets/css/swiper.min.css";
  // @media screen and (max-width: 960px) {
  //     .el-dialog.el-dialog--tiny{width:70%;}
  // }
  // @media screen and (max-width: 400px) {
  //     .el-dialog.el-dialog--tiny{width:70%;}
  //     .self{
  //       .search_dialog{
  //         .friend-item{
  //           .right{padding-left: 0;}
  //         }
  //       }
  //     }
  // }
  .self {
    width: 100%;
    height:100%;
    overflow: auto;
    margin: auto;
    text-align: left;
    padding:0 10px 0 10px;
    box-sizing: border-box;
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .uploader {
      text-align: left;
      display: inline-block;
      width: 160px;
      flex-shrink: 0;
      height: 160px;
      vertical-align: bottom;
      .el-upload.el-upload--text{width:100%;height:100%;}
      img {
        width: 100%;
        height: 100%;
      }
    }
    .user-info {
      margin-left: 6px;
      align-self: center;
      width: 190px;
      .nickname {
        font-size: 0.16rem;
      }
      .username {
        color: #999;
        font-size: 0.16rem;
      }
    }
    .add_friend_btn_wrapper {}
    .add_friend_btn {
      vertical-align: bottom;
      width: 100%;
      margin-top: 30px;
    }
    .slide-box {
      z-index: 1;
      text-align: center;
      vertical-align: top;
      .search_friend_box {
        padding: 30px;
      }
      .friend-item {
        margin-bottom: 10px;
      }
      .right {
        display: inline-block;
        vertical-align: top;
        padding-left: 30px;
      }
    }
    .el-dialog.el-dialog--tiny {
      height: 60%;
      overflow: hidden;
    }

    .slide-box {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top:0;
      bottom: 60px;
      background: #fff;
      overflow: hidden;
      padding: 30px;
      // padding-top:90px;
      box-sizing: border-box;
      // transform: translate3d(0,100%,0);
      .back-btn-wrapper {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 60px;
        .back-btn {
          width: 100%;
          height: 100%;
        }
      }
    }
    .request {
      .request-item {
        border-bottom: 1px solid #ccc;
      }
    }
    .logout-wrapper {
      .logout_btn {
        width: 100%;
      }
    }

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
      width: 100%;
      height: 100%;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .swiper-container {
      position: absolute;
      left: 0;
      top: 90px;
      bottom: 60px;
      width: 100%;
      overflow: hidden;
    }

    .swiper-slide {
      font-size: 18px;
      height: auto;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      font-size: 13px;
      font-family: microsoft yahei;
      line-height: 1.8;
    }
  }
  
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
