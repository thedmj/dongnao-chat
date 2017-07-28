import vue from "vue";
import vuex from "vuex";
import $ from "jquery";

vue.use(vuex);
// let host = "http://localhost:3000/"; //以后这里要改掉
// let host = "http://192.168.168.111:3000/";
let host = "http://115.159.106.78/";
// var id =1;
// let get_friends = host + "user/" + id + "/friends";
// let get_posts = host + "user/" + id + "/posts_detail";
let get_message = host + 'message';

export default new vuex.Store({
    state: {
        host,
        friends: [],
        posts: [],
        self: [],
        message: [],
        chat_friend: {
            name: "",
            id: ""
        },
        me: null,
        request_list:{
            get:[],
            send:[]
        },
        socket:null
    },
    getters: {},
    mutations: {
        set_me(state, o) {
            if(o != null){
                state.me = {};
                state.me.username = o.username;
                state.me.nickname = o.nickname;
                state.me.id = o.id;
                state.me.logo = o.logo;
            }else{
                state.me = null;
            }
        },
        set_chat_friend(state, friend) {
            state.chat_friend.name = friend.name;
            state.chat_friend.id = friend.id;
        },
        addUnread(state, data) {
            state.friends = state
                .friends
                .map((item) => {
                    if (item.id == data.id) {
                        item.unread++;
                    }
                    return item;
                });
        },
        clearUnread(state, id) {
            state
                .friends
                .map((item) => {
                    if (item.id === id) {
                        item.unread = 0;
                    }
                })
        },
        set_request_list(state,data){
            state.request_list = data;
        },
        set_socket(state,socket){
            state.socket = socket;
        },
        set_unread(state,data){
            state.friends.map((item)=>{
                if(item.id == data.id){
                    item.unread = data.num;
                }
                return item;
            })
        }
    },
    actions: {
        search_friend({state}, {name, id}) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: host + "user/" + id + "/search",
                    type: "get",
                    data: {
                        name,
                        id
                    },
                    success(res) {
                        var result = [];
                        res = res.map((user) => {
                            if (user.id != id) {
                                result.push(user);
                            }
                        });
                        resolve(result);
                    }
                });
            });
        },
        fetch_request_list({state,commit},id){
            return new Promise((resolve,reject)=>{
                $.ajax({
                    url:host+"user/"+id+"/request",
                    type:"get",
                    success(res){
                        commit("set_request_list",res);
                        resolve(res);
                    }
                });
            });
            
        },
        getFriends({state}, id) {
            return new Promise((resolve,reject)=>{
                $.ajax({
                    url: host + "user/" + id + "/friends",
                    type: "get",
                    success: function (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (!state.friends[i]) {
                                data[i].unread = 0;
                            } else {
                                data[i].unread = state.friends[i].unread;
                            }
                        }
                        state.friends = data;
                        resolve(data);
                    }
                });
            });
            
        },
        getPosts({state},id) {
            $.ajax({
                url: host + "user/" + id + "/posts_detail",
                success: function (data) {
                    console.log("posts",data);
                    state.posts = data;
                }
            });
        },
        get_message({state},data) {
            return new Promise((resolve,reject)=>{
                $.ajax({
                    url: get_message,
                    data: {
                        user: data.userid,
                        friend: data.friendid
                    },
                    success: function (result) {
                        for (var i = 0; i < result.length; i++) {
                            result[i] = JSON.parse(result[i]);
                        }
                        state.message = result;
                        resolve({data:result,friendID:data.friendid});
                    }
                });
            })
            
        },
        
    }
});