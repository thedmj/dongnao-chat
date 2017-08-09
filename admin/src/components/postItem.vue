<template>
  <div class="post-item">
    {{id}}
    <div class="content" v-if="allData!=null">
      <h2>标题：{{allData.post[0].title}}</h2>
      <h2>内容：{{allData.post[0].content}}</h2>
      <!--评论-->
      <el-table :data="allData.comments">
        <el-table-column
          prop="commentsid"
          label="id">
        </el-table-column>
        <el-table-column
          prop="commentscontent"
          label="内容">
        </el-table-column>
        <el-table-column
          prop="commentscreatedAt"
          label="评论时间">
        </el-table-column>
        <el-table-column
          prop="commentsuserId"
          label="评论者id">
        </el-table-column>
        <el-table-column
          prop="repliescontent"
          label="作者回复">
        </el-table-column>
      </el-table>
      <!--点赞-->
    <el-table :data="allData.stars">
        <el-table-column
          prop="id"
          label="id">
        </el-table-column>
        
        <el-table-column
          prop="createdAt"
          label="点赞时间">
        </el-table-column>
        <el-table-column
          prop="userId"
          label="点赞者id">
        </el-table-column>
      </el-table>
    </div>
    
  </div>
</template>

<script>
import {getPost} from "../public/js/post.api.js";
import {
    table,
    tableColumn,
    form,
    button,
    formItem,
    dialog,
    option,
    select,
    input
  } from "element-ui";
export default {
  data(){
      return {
        id:0,
        allData:null
      }
  },
  methods:{
    getData(){  
        getPost(this.id,(data)=>{
            console.log(data);
            this.allData = data;
        })
    }
  },
  mounted(){
    this.id = this.$route.params.id;
    this.getData();
  },
  components: {
      "el-table": table,
      "el-table-column": tableColumn,
      "el-form": form,
      "el-button": button,
      "el-form-item": formItem,
      "el-dialog": dialog,
      "el-select": select,
      "el-option": option,
      "el-input": input
    },
  watch:{
    $route(){
        this.id = this.$route.params.id;
        this.getData();
    }
  }
}
</script>

<style lang="less">

</style>
