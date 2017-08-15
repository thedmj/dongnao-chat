<template>
<div class="friends">
  <ul>
    <li v-for="friend in friends" :key="friend.id" @click="chat(friend.nickname,friend.id,friend.logo)">
      <el-badge :value="friend.unread" class="item">
        <img :src="host+'upload/'+friend.logo" alt="" width="90" height="90" v-if="friend.logo">
        <img :src="host+'upload/null.jpg'" alt="" width="90" height="90" v-if="!friend.logo">
      </el-badge>
      <div class="nickname">{{friend.nickname}}</div>
      <span class="delete" @click.stop="deleteHandler(friend.id,friend.nickname)">x</span>
    </li>
  </ul>
  <el-dialog title="删除好友" :visible.sync="dialogVisible" size="tiny">
    <span>你确定要删除好友{{deleteNickname}}？</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="deleteCancel">取 消</el-button>
    <el-button type="primary" @click="deleteSubmit">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
import $ from "jquery";
import {
  getCookie
} from "../public/js/cookies.api";
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from "vuex";
import io from "../../../node_modules/socket.io-client/dist/socket.io";
import {
  Badge,
  dialog,
  button
} from "element-ui";

export default {
  data() {
    return {
      dialogVisible: false,
      deleteID: null,
      deleteNickname:null
    }
  },
  props: ["init"],
  methods: {
    ...mapActions(["getFriends", "get_message", "clear_message"]),
    ...mapMutations(["set_chat_friend", "set_me", "addUnread", "clearUnread", "set_socket", "set_unread"]),
    deleteHandler(friendID,friendNickname) {
      this.deleteID = friendID;
      this.deleteNickname = friendNickname
      this.dialogVisible = true;
    },
    deleteSubmit() {
      var This = this;
      $.ajax({
        url: this.host + "user/" + this.me.id + "/rf",
        type: "post",
        data: {
          id: this.me.id,
          userid: this.deleteID
        },
        success(res) {
          if (res.affectedRows == 1) {
            This.deleteID = null;
            This.dialogVisible = false;
            This.getFriends(This.me.id).then((friends) => {
              for (let i = 0; i < friends.length; i++) {
                This.get_message({
                  userid: This.me.id,
                  friendid: friends[i].id
                }).then((message) => {
                  var num = 0;
                  for (let j = 0; j < message.data.length; j++) {
                    if (message.data[j].readed == false) {
                      num++;
                    }
                  }
                  This.set_unread({
                    id: message.friendID,
                    num
                  }) //设置未读消息数量
                  This.clear_message();
                })
              }
            });
          }
        }
      });
    },
    deleteCancel(){
      this.deleteID = null;
      this.dialogVisible = false;
    },
    chat(nickname, id, logo) {
      // console.log("friend: ",nickname,id,logo)
      this.$router.push("/chat" + "?nickname=" + nickname + "&id=" + id + "&logo=" + logo);
      // console.log("/chat" + "?nickname=" + nickname + "&id=" + id+"&logo="+logo)
      this.set_chat_friend({
        friend: {
          nickname,
          id,
          logo
        }
      });
      this.clear_message();
      // this.clearUnread(id)  //清空unread
    }

  },
  computed: {
    ...mapState(["friends", "me", "socket", "host"])
  },
  mounted() {
    var cookie_user = JSON.parse(getCookie("user"));
    if (!cookie_user) {
      this.$router.push("/login");
      this.set_me(null);
    } else {
      this.set_me(cookie_user);
      if (this.me) {
        this.getFriends(this.me.id).then((friends) => {
          for (let i = 0; i < friends.length; i++) {
            this.get_message({
              userid: this.me.id,
              friendid: friends[i].id
            }).then((message) => {
              var num = 0;
              // console.log(message)
              for (let j = 0; j < message.data.length; j++) {
                if (message.data[j].readed == false) {
                  num++;
                }
              }
              // console.log(message.friendID,num);
              // console.log(num)
              this.set_unread({
                id: message.friendID,
                num
              }) //设置未读消息数量
              this.clear_message();
            })
          }
        });
        if (!this.socket) {
          this.set_socket(io.connect(this.host));
          this.socket.emit("login", this.me);
        }
        this.socket.off("update");
        if (!this.init.friends_init) {
          // console.log("friends init")
          this.init.setInit("friends_init");
          this.socket.on("addUnread", (data) => {
            this.addUnread(data);
          });
          this.socket.on("get_request", (data) => { //在线时收到好友请求
            // console.log(data);
            // this.fetch_request_list(this.me.id);
            alert("你收到一个好友请求")
          });
        }

      }
    }

  },
  components: {
    "el-badge": Badge,
    "el-dialog": dialog,
    "el-button": button
  }
}
</script>

<style lang="less">
.friends {
  padding: 0 30px 0 30px;
  overflow: auto;
  ul {
    text-align: left;
    li {
      border-bottom: 1px solid #ccc;
      position: relative;
    }
    .delete {
      font-size: 22px;
      position: absolute;
      right: 0;
      top:50%;
      width:20px;
      height:20px;
      margin-top:-10px;
      text-align: center;
      line-height: 20px;
      border-radius: 50%;
      background: red;
      color:#fff; 
    }
  }
  .nickname {
    display: inline-block;
    font-size: 28px;
    vertical-align: middle;
  }
}
</style>
