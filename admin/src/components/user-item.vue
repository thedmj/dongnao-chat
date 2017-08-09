<template>
  <div class="user-item" v-show="user.id">
    <h1>{{user.username}}</h1>

    <img :src="userImage" alt="" width="60" v-if="user.logo">
    <!--文章-->
    <el-form>
      <el-form-item>
        <el-button @click="addPost.visible=true" type="info">添加文章</el-button>
        <el-button @click="editShow" :disabled="this.postSelection.length==1?false:true">编辑</el-button>
        <el-button @click="postDelete" :disabled="this.postSelection.length>0?false:true" type="danger">删除</el-button>
        <div>
          <el-button @click="clearnSelection">取消选择</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-table :data="user.post" stripe ref="posttable" @select="selectHandle" @select-all="selectHandle">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="title" label="标题">
      </el-table-column>
      <el-table-column prop="content" label="内容">
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间">
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间">
      </el-table-column>
      <el-table-column>
        <template scope="scope">
          <el-button type="text" size="small" @click="editShow($event,scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="postDelete($event,scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--好友-->

    <!--好友选择列表-->
    <el-select v-model="selectUser" placeholder="请选择" v-if="showSelectFriend">
      <el-option v-for="u in allUsers" :key="u.id" :label="u.nickname" :value="u.id" v-if="!isFriend(u.id)">
      </el-option>
    </el-select>

    <el-form>
      <el-form-item>
        <el-button @click="showSelectFriend = !showSelectFriend">{{showSelectFriend?"取消":"添加好友"}}</el-button>
        <el-button @click="addFriendClick(selectUser)" v-if="showSelectFriend">确认</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="user.friends" stripe>
      <el-table-column prop="id" label="好友id">
      </el-table-column>
      <el-table-column prop="nickname" label="好友名称">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="text" size="small" @click="showMessage(scope.row.username)">查看聊天记录</el-button>
          <el-button type="text" size="small" @click="deleteFriendClick(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--增加文章对话框-->
    <el-dialog title="添加文章" :visible.sync="addPost.visible">
      <el-form>
        <el-form-item label="标题">
          <el-input auto-complete="off" v-model="addPost.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input auto-complete="off" v-model="addPost.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPost.visible = false">取 消</el-button>
        <el-button type="primary" @click="addPostHandle">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑文章对话框-->
    <el-dialog title="编辑文章" :visible.sync="editPost.visible">
      <el-form>
        <el-form-item label="标题">
          <el-input auto-complete="off" v-model="editPost.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input auto-complete="off" v-model="editPost.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPost.visible = false">取 消</el-button>
        <el-button type="primary" @click="editPostHandle">确 定</el-button>
      </div>
    </el-dialog>
    <!--删除好友对话框-->
    <el-dialog title="删除好友" :visible.sync="dialogDeleteFriend" size="tiny">
      <span>你确定要删除你的好友？此操作将不能回复！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteFriend = false">取 消</el-button>
        <el-button type="primary" @click="deleteFriend(deleteFriendScope)">确 定</el-button>
      </span>
    </el-dialog>
    <!--上传组件-->
    <el-upload
      :name="'img'"
      class="upload-demo"
      ref="upload"
      :multiple="false"
      :action="action"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :auto-upload="false"
      :on-change="handleChange"
      list-type="picture"
      :on-success="onUploadSuccess">
      <el-button slot="trigger" size="small" type="primary" :disabled="this.fileList.length >1">选取</el-button>
      <el-button size="small" type="success" @click="submitUpload">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>

    
  </div>




</template>
<script>
  import $ from "jquery";
  import {
    detail,
    get_all_user,
    removeFriend,
    addFriend
  } from "../public/js/user.api.js";
  import {
    addPost,
    deletePost,
    editPost
  } from "../public/js/post.api.js";
  import {
    table,
    tableColumn,
    form,
    button,
    formItem,
    dialog,
    option,
    select,
    input,
    upload
  } from "element-ui";
  export default {
    data() {
      return {
        action:"",
        addPost: {
          visible: false,
          title: "",
          content: ""
        },
        user: {},
        selectUser: "",
        allUsers: [],
        showSelectFriend: false,
        postSelection: [],
        editPost: {
          visible: false,
          title: "",
          content: ""
        },
        dialogDeleteFriend: false,
        deleteFriendScope: null,
        addFriendID: 0,
        fileList:[]
      }
    },
    computed: {
      userImage(){
       return "http://localhost:3000/upload/"+unescape(this.user.logo);
      }
    },
    mounted() {
      var id = this.$route.params.id;
      this.action = "http://localhost:3000/user/"+id+"/upload";
      detail(id, (user) => {
        this.user = user;
      });
      get_all_user((users) => {
        this.allUsers = users;
      });
    },
    components: {
      "el-table": table,
      "el-table-column": tableColumn,
      "el-form": form,
      "el-button": button,
      "el-form-item": formItem,
      "el-dialog": dialog,
      "el-select": select,
      "el-option": option,
      "el-input": input,
      "el-upload": upload
    },
    methods: {
      addPostHandle() {
        addPost(this.$route.params.id, this.addPost, (item) => {
          this.user.post.push(item);
          this.addPost = {
            visible: false,
            title: "",
            content: ""
          }
        });
      },
      isFriend(id) {
        var result = false;
        this.user.friends.forEach((friend) => {
          if (friend.id == id) {
            result = true;
            return false;
          }
        });
        if (this.user.id == id) {
          result = true;
        }
        return result;
      },
      deleteFriend(e) { //删除好友
        var myid = this.$route.params.id;
        var userid = e.row.id;
        removeFriend(myid, userid, (data) => {
          if (data.affectedRows == 1) {
            detail(this.$route.params.id, (user) => {
              this.user = user;
              this.dialogDeleteFriend = false;
            });
          }
        });
      },
      deleteFriendClick(scope) { //删除好友点击
        this.deleteFriendScope = scope;
        this.dialogDeleteFriend = true;
      },
      clearnSelection() {
        this.$refs.posttable.clearSelection();
        this.postSelection = [];
      },
      selectHandle(selection, row) {
        this.postSelection = selection;
      },
      postDelete(event, postid) {
        var This = this;
        var id = this.$route.params.id;
        var postids = [];
        if (id) {
          postids.push(postid);
        } else {
          for (var i = 0; i < this.postSelection.length; i++) {
            postids.push(this.postSelection[i].id);
          }
        }

        if (postids.length == 0) return;
        deletePost(id, postids, function (e) {
          detail(This.$route.params.id, (user) => {
            This.user = user;
          });
        })

      },
      editShow(event, row) {
        this.editPost.visible = true;
        if (row) {
          this.editPost.id = row.id;
          this.editPost.title = row.title;
          this.editPost.content = row.content;
        } else {
          this.editPost.id = this.postSelection[0].id;
          this.editPost.title = this.postSelection[0].title;
          this.editPost.content = this.postSelection[0].content;
        }
      },
      editPostHandle() {
        var This = this;
        editPost(this.$route.params.id, this.editPost.id, this.editPost.title, this.editPost.content, function (
          e) {
          detail(This.$route.params.id, (user) => {
            This.user = user;
            This.editPost.visible = false;
          });
        })
      },
      addFriendClick(userid) {
        var This = this;
        var id = this.$route.params.id;
        addFriend(id, userid, (data) => {
          detail(This.$route.params.id, (user) => {
            This.user = user;
            This.showSelectFriend = false;
          });
        })
      },
      showMessage(name) {
        this.$router.push("/message?user=" + this.user.username + "&friend=" + name);
      },
      handleRemove(file, fileList) {
        fileList.splice(0,1);
      },
      handlePreview(file) {
        // console.log(file);
      },
      handleChange(file, fileList){
        $(".upload-demo input").val("");
        if(fileList.length>1){
          fileList.splice(0,1);
        }
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      onUploadSuccess(response, file, fileList){
        var id = this.$route.params.id;
        detail(id, (user) => {
          this.user = user;
          fileList.splice(0,1);
        });
      }
    }
  }

</script>
<style lang="less">
  .upload-demo{width:300px;}

</style>
