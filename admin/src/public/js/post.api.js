import $ from "jquery";
import host from "../../config";
export function get_all_post(cb){
    $.ajax({
        url:host + "post/detail",
        type:"GET",
        success:function(data){
            cb && cb(data);
        }
    });
}
export function addPost(id,post,cb){
    $.ajax({
        url:host+"user/"+id+"/post",
        type:"POST",
        data:post,
        success:function(post){
            cb && cb(post);
        }
    });
}
export function deletePost(id,postsID,cb){
    $.ajax({
        url:host+"user/"+id+"/post/delete",
        type:"POST",
        data:{
            id:id,
            postsID:postsID
        },
        traditional: true,
        success:function(post){
            cb && cb(post);
        }
    });
}

export function editPost(id,postid,title,content,cb){
    $.ajax({
        url:host+"user/"+id+"/post/update",
        type:"POST",
        data:{
            id:id,
            postID:postid,
            title:title,
            content:content
        },
        traditional: true,
        success:function(e){
            cb && cb(e);
        }
    });
}

export function getPost(id,cb){
    $.ajax({
        url:host+"post/"+id,
        type:"GET",
        success:function(e){
            cb && cb(e);
        }
    });
}