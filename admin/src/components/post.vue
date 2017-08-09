<template>
  <div class="post">
      <el-table :data="data" stripe style="width: 100%" @row-click="rowClick">
        <el-table-column prop="id" label="id" width="180">
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column prop="content" label="内容">
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间"></el-table-column>
        <el-table-column prop="updatedAt" label="最后更新时间"></el-table-column>
        <el-table-column prop="nickname" label="作者"></el-table-column>
      </el-table>
  </div>
</template>

<script>
import moment from "moment";
import {
    table,
    tableColumn
  } from "element-ui";
import {get_all_post} from "../public/js/post.api.js";
export default {
  data () {
    return {
      list:[]
    }
  },
  computed:{
    data(){
      var list = this.list;
      var data = list.map((o)=>{
        return {
          id:o.post.id,
          title:o.post.title,
          content:o.post.content,
          createdAt:moment(o.post.createdAt).format("YYYY-MM-DD"),
          updatedAt:moment(o.post.updatedAt).format("YYYY-MM-DD"),
          nickname:o.user.nickname
        }
      });
      return data;
    }
  },
  components:{
    "el-table": table,
    "el-table-column": tableColumn
  },
  mounted(){
    get_all_post((data)=>{
      this.list = data;
    });
  },
  methods:{
    rowClick(row){
      this.$router.push("/post/"+row.id+"/");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
