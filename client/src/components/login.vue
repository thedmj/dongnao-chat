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
            <el-button type="primary" @click="showRegister=true">注册</el-button>
        </el-form>
        <transition name="fade">
            <div class="register" v-if="showRegister">
                <el-form>
                    <el-form-item label="用户名" prop="username" >
                        <el-input v-model="r_username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pass" >
                        <el-input type="password" v-model="r_password"></el-input>
                    </el-form-item>
                    <el-form-item label="请再次输入密码" prop="pass" >
                        <el-input type="password" v-model="r_c_password"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称" prop="nickname" >
                        <el-input v-model="r_nickname"></el-input>
                    </el-form-item>
                    <div>
                        <el-button type="primary" @click="registerHandler">注册</el-button>
                    </div>
                    <div>
                        <el-button type="primary" @click="showRegister=false">返回</el-button>
                    </div>
                </el-form>
            </div>
        </transition>
        
    </div>
</template>

<script>
import io from "../../../node_modules/socket.io-client/dist/socket.io";
import {
    getCookie,
    setCookie,
    removeCookie
  } from "../public/js/cookies.api";
import $ from "jquery";
import {form,formItem,input,button,Message} from "element-ui";
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
        showRegister:false,
        r_username:"",
        r_password:"",
        r_c_password:"",
        r_nickname:"",
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
  props:["init"],
  mounted () {
    this.init.setInit("login_init");
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
      registerHandler(){                                               //注册
        var This = this;
        if(!this.r_username.match(/^[0-9a-zA-Z_]{6,12}$/)){
            alert("用户名不符合规范");
            return;
        }
        if(this.r_password != this.r_c_password){
            alert("密码不一致");
            return;
        }
        $.ajax({
            url:this.host+"checkusername",
            type:"post",
            data:{
                username:this.r_username,
                
            },
            success(res){
                if(res.status == 0){
                    $.ajax({
                        url:This.host+"register",
                        type:"post",
                        data:{
                            username:This.r_username,
                            password:This.r_password,
                            nickname:This.r_nickname
                        },
                        success(res){
                            This.showRegister = false;
                            Message({
                                message: '注册成功！请重新登录',
                                type: 'success'
                            });

                        }
                    });
                }
            }
        });
      },
      submit(){
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
                        This.set_socket(io.connect(This.host));
                        This.socket.emit("login", This.me);
                        This.socket.on("logout",()=>{
                            alert("别处登陆");
                            removeCookie("user");
                            This.$router.push("/login");
                            // This.socket.emit("logout",This.me.id);
                            This.set_me(null);
                            This.socket.close();
                            This.set_socket(null);
                            This.init.setInit();
                        });
                    }
                    document.removeEventListener("keydown",This.keydownHandler,false);
                    This.$router.push("/friends");
                }else if(res.status == 1){
                    Message.error("用户名活密码错误");
                }else{
                    Message.error("未知错误");
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
    .login{padding:20px;overflow: hidden;position: relative;width:100%;height:100%;box-sizing: border-box;;
        .demo-ruleForm{margin-top: 60px;}
        .register{position: absolute;left: 0;top:0;width:100%;height:100%;background: #fff;padding:10px;box-sizing: border-box;
            .el-button{width:100%;}
        }
    }
  
</style>
