import vue from "vue";
import vuex from "vuex";
import $ from "jquery";

vue.use(vuex);
let host = "http://localhost:3000/";
let username = "ryan";
let id = 1;
let get_friends = host+"user/"+id+"/friends";
let get_posts = host+"user/"+id+"/posts_detail";
console.log(get_friends);

export default new vuex.Store({
    state:{
        friends:[],
        posts:[],
        self:[],
        message:[]
    },
    getters: {
        
    },
    mutations:{
        settesttext(state,text){
            state.test = text;
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
        }


    }
});