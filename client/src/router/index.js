import Vue from 'vue'
import Router from 'vue-router'
import friends from "../components/friends.vue";
import self from "../components/self.vue";
import posts from "../components/posts.vue";
import chat from "../components/chat.vue";
import login from "../components/login.vue";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/login',
      name: '登录',
      component: login
    },
    {
      path: '/friends',
      name: '朋友',
      component: friends
    },
    {
      path: '/chat',
      name: '聊天',
      component: chat
    },
    {
      path: '/self',
      name: '我',
      component: self
    },
    {
      path: '/posts',
      name: '朋友圈',
      component: posts
    }
  ]
})
