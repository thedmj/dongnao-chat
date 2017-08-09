import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import user from "../components/user.vue"
import post from "../components/post.vue";
import postItem from "../components/postItem.vue";
import userItem from "../components/user-item.vue"
import message from "../components/message.vue";
import upload from "../components/upload.vue";

Vue.use(Router);

export default new Router({
  routes: [ 
    {
      path: '/user',
      name: '用户',
      component: user
    },
    {
      path: '/post',
      name: '说说',
      component: post
    },
    {
      path: '/post/:id',
      name: '说说详情',
      component: postItem,
      hidden:true
    },
    {
      path:"/user/:id",
      name:"用户详情",
      component:resolve => require(['../components/user-item.vue'], resolve),
      hidden:true
    },
    {
      path:"/message",
      name:"聊天记录",
      component:message,
      hidden:true
    },
    {
      path:"/user/:id/upload",
      name:"上传文件",
      component:upload
    },
  ]
})
