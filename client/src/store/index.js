import vue from "vue";
import vuex from "vuex";
import $ from "jquery";

vue.use(vuex);
let host = "http://localhost:3000/";
let username = "ryan";
let id = 1;
let get_friends = host+"user/"+id+"/friends";
let get_posts = host+"user/"+id+"/posts_detail";
let get_message = host+'message';
console.log(get_friends);
console.log(get_message)

export default new vuex.Store({
    state:{
        friends:[],
        posts:[],
        self:[],
        message:[],
        chat_friend:{
            name:"",
            id:""
        },
        me:null
    },
    getters: {
        
    },
    mutations:{
        set_me(state,o){
            state.me={};
            state.me.username = o.username;
            state.me.name=o.nickname;
            state.me.id=o.id;
        },
        set_chat_friend(state,friend){
            state.chat_friend.name = friend.name;
            state.chat_friend.id = friend.id;
        }
    },
    actions:{
        getFriends({state},id){
            $.ajax({
                url:host+"user/"+id+"/friends",
                type:"get",
                success:function(data){
                    state.friends=data;
                }
            });
        },
        getPosts({state}){
            $.ajax({
                url:get_posts,
                success:function(data){
                    state.posts = data; 
                }
            });
        },
        get_message({state}){
            $.ajax({
                url:get_message,
                data:{user:state.me.id,friend:state.chat_friend.id},
                success:function(data){
                    for(var i=0;i<data.length;i++){
                        data[i] = JSON.parse(data[i]);
                    }
                    console.log(data);
                    state.message = data;
                }
            });
        },
        send_message({state}){
            
        },
        


    }
});