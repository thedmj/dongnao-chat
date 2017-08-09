<template>
  <div id="app">
    <div class="container" style="height:100%;">
      <el-row style="height:100%;">
        <el-col :xs="4" :sm="4" :md="2" :lg="2" style="height:100%;">
          <div class="slide">
            <div class="slide-menu">
              <div class="logo"></div>
              <el-menu class="el-menu-vertical-demo" theme="dark" :router="true" >
                <el-row :xs="24" :sm="24" :md="24" :lg="24">
                  <el-menu-item :key="route.name"  :index="route.path" v-if="!route.hidden" v-for="(route,index) in $router.options.routes">{{route.name}}</el-menu-item>
                </el-row>
              </el-menu>
            </div>
          </div>
        </el-col>
        <el-col :xs="20" :sm="20" :md="22" :lg="22" class="r-content">
          <div class="title">{{$route.name}}</div>
          <router-view></router-view>
        </el-col>
      </el-row>
    </div>


  </div>
</template>

<script>
  import {
    row,
    col,
    menu,
    menuItem,
    submenu,
    menuItemGroup
  } from "element-ui";
  export default {
    name: 'app',
    components: {
      "el-menu": menu,
      "el-menu-item": menuItem,
      "el-row": row,
      "el-col": col,
      "el-submenu": submenu,
      "el-menu-item-group": menuItemGroup
    },
    methods: {
      
    },
    data(){
      return {
        
      }
    },
    mounted(){
      
    }
  }

</script>

<style lang="less">
  * {
    margin: 0;
    padding: 0;
  }

  html,
  body {
    height: 100%;font-family: "microsoft yahei";
  }
  a{text-decoration: none;}

  #app {
    height: 100%;
    .container {
      height: 100%;
      .slide {
        width: 100%;
        height: 100%;
        position: relative;
        .logo{padding-left: 20px;height:60px;background: url('http://10.url.cn/eth/ajNVdqHZLLBicQQlK9NCricbo6wBJzL1D0uVFbBZczibxlXYLHxa4HSzXGDicYCIEnrKuGprcfSy1gw/') no-repeat;background-size: contain;background-position: 10px;}
      }
      .slide-menu {
        background: #324157;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
      }
      .r-content{height: 100%;
        .title{width:100%;height:60px;text-align: center;font-size: 30px;line-height: 60px;}
      }
    }
  }

</style>
