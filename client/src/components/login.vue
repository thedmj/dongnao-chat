<template>
    <div class="login">
        <el-form :model="ruleForm2"  ref="ruleForm2" label-width="100px" class="demo-ruleForm" :label-position="'left'">
            <el-form-item label="用户名" prop="username">
                <el-input v-model.number="ruleForm2.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
            </el-form-item>
            
            <el-button type="primary" @click="submit">登录</el-button>
            <!-- <el-button @click="resetForm('ruleForm2')">重置</el-button> -->
        </el-form>
        <!-- <input type="text" v-model="username" ref="username">
        <input type="text" v-model="password" ref="password">
        <button @click="submit">登录</button> -->
    </div>
</template>

<script>
import io from "../../../node_modules/socket.io-client/dist/socket.io";
import{setCookie,getCookie} from "../public/js/cookies.api";
import $ from "jquery";
import {form,formItem,input,button} from "element-ui";
import {mapState,mapGetters,mapActions,mapMutations} from "vuex";
export default {
  data () {
      var checkUsername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } 
      };
      
      return {
        ruleForm2: {
          pass: '',
          username: ''
        },
        // rules2: {
        //   pass: [
        //     { validator: validatePass, trigger: 'blur' }
        //   ],
        //   username: [
        //     { validator: checkUsername, trigger: 'blur' }
        //   ]
        // }
      };
  },
  mounted () {
    var cookie_user =JSON.parse(getCookie("user"));
    if(cookie_user){
        this.$router.push("/friends");
    }else{
        this.set_me(null);
    }
    document.addEventListener("keydown",this.keydownHandler,false);
  },
  computed: {
    ...mapState(["friends","me","socket","host"])
  },
  methods: {
      ...mapMutations(["set_me","set_socket"]),
      keydownHandler(e){
        if(e && e.keyCode == 13){
          this.submit();
        }
      },
      submit(){
        console.log("submit")
        var This = this;
        var username = this.ruleForm2.username;
        var password = this.ruleForm2.pass;
        $.ajax({
            url:this.host+"login",
            data:{
                username,
                password
            },
            type:"post",
            success(res){
                if(res.status==0){
                    This.set_me(res);
                    setCookie("user",JSON.stringify(res),1);
                    if(!This.socket){

                    }
                    This.set_socket(io.connect(This.host));
                    document.removeEventListener("keydown",This.keydownHandler,false);
                    This.socket.emit("login", This.me);
                    This.$router.push("/friends");
                }
            }
        });
      }
  },
  components: {
      "el-form":form ,
      "el-form-item":formItem,
      "el-input":input,
      "el-button":button
  }
}
</script>

<style lang="less">
  .demo-ruleForm{margin-top: 60px;}
</style>
