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
        me:{name:"ryan",id:1}
    },
    getters: {
        
    },
    mutations:{
        setMe(state,o){
            state.me.name=o.name;
            state.me.id=o.id;
        },
        set_chat_friend(state,friend){
            state.chat_friend.name = friend.name;
            state.chat_friend.id = friend.id;
        }
    },
    actions:{
        getFriends({state}){
            $.ajax({
                url:get_friends,
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
                data:{user:state.me.name,friend:state.chat_friend.name},
                success:function(data){
                    // var data = JSON.parse(data);
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
        set_me({commit},o){
            commit("setMe",o);
        }


    }
});