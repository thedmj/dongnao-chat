import Vue from 'vue'
import Router from 'vue-router'
import friends from "../components/friends.vue";
import self from "../components/self.vue";
import posts from "../components/posts.vue";
import chat from "../components/chat.vue";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'friends',
      component: friends
    },
    {
      path: '/friends',
      name: 'friends',
      component: friends
    },
    {
      path: '/chat',
      name: 'chat',
      component: chat
    },
    {
      path: '/self',
      name: 'self',
      component: self
    },
    {
      path: '/posts',
      name: 'posts',
      component: posts
    }
  ]
})
