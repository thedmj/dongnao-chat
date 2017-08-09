<template>
  <div class="user">
    <el-table :data="data" stripe style="width: 100%" @row-click="rowClick">
      
      <el-table-column type="index"  label="序号" width="160">
      </el-table-column>
      <el-table-column prop="id" label="id" >
      </el-table-column>
      <el-table-column prop="username" label="用户名" >
      </el-table-column>
      <el-table-column prop="nickname" label="用户昵称">
      </el-table-column>
      <el-table-column prop="logo" label="用户头像">
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column prop="updatedAt" label="最后更新时间"></el-table-column>
    </el-table>
  </div>

</template>

<script>
  import moment from "moment";
  import {
    table,
    tableColumn
  } from "element-ui";
  import {
    get_all_user
  } from "../public/js/user.api.js";
  export default {
    data() {
      return {
        list: []
      }
    },
    computed: {
      data() {
        this.list.map((o) => {
          o.createdAt = moment(o.createdAt).format("YYYY-MM-DD");
          o.updatedAt = moment(o.updatedAt).format("YYYY-MM-DD");

        });
        return this.list;
      }
    },
    components: {
      "el-table": table,
      "el-table-column": tableColumn
    },
    mounted() {
      get_all_user((data) => {
        console.log(data);
        for(var i=0;i<data.length;i++){
          data[i].logo = unescape(data[i].logo);
          console.log(data[i].logo);
        }
        this.list = data;
      });
      
    },
    methods:{
      rowClick(	row, event, column){
        this.$router.push("/user/"+row.id);
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
