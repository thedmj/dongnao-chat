<template>
  <div id="app">
    <div class="container">
      <div class="slide">
        <div class="slide-menu">
          <div class="logo"></div>
          <el-menu class="el-menu-vertical-demo" theme="dark" :router="true">
            <el-menu-item :key="route.name" :index="route.path" v-if="!route.hidden" v-for="(route,index) in $router.options.routes">{{route.name}}</el-menu-item>
          </el-menu>
        </div>
      </div>

      <div class="r-content">
        <div class="title">{{$route.name}}</div>
        <router-view></router-view>
      </div>



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
    data() {
      return {

      }
    },
    mounted() {

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
    height: 100%;
    font-family: "microsoft yahei";
  }

  a {
    text-decoration: none;
  }

  #app {
    height: 100%;
    .container {
      display: flex;
      min-height: 100%;
      .slide {
        width: 110px;
        position: relative;
        flex-shrink: 0;
        .logo {
          padding-left: 20px;
          height: 60px;
          background: url('http://10.url.cn/eth/ajNVdqHZLLBicQQlK9NCricbo6wBJzL1D0uVFbBZczibxlXYLHxa4HSzXGDicYCIEnrKuGprcfSy1gw/') no-repeat;
          background-size: contain;
          background-position: 10px;
        }
      }
      .slide-menu {
        background: #324157;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
      }
      .r-content {
        height: auto;
        width: 100%;
        background: #fff;
        ;
        width: 100%;
        .title {
          width: 100%;
          height: 60px;
          text-align: center;
          font-size: 30px;
          line-height: 60px;
        }
      }
    }
  }

</style>
