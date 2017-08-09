import $ from "jquery";
import host from "../../config";
export function get_all_user(cb){
    $.ajax({
        url:host + "user",
        type:"GET",
        success:function(data){
            cb && cb(data);
        }
    });
}
export function detail(id,cb){
    $.ajax({
        url:host +"user/"+id+"/detail",
        type:"GET",
        success:function(data){
            cb && cb(data);
        }
    });
}
export function removeFriend(id,userid,cb){
    $.ajax({
        url:host+"user/"+id+"/rf",
        type:"POST",
        data:{
            id:id,
            userid:userid
        },
        success:function(data){
            cb && cb(data);
        }
    });
}
export function addFriend(id,userid,cb){
    $.ajax({
        url:host+"user/"+id+"/af",
        type:"POST",
        data:{
            id:id,
            userid:userid
        },
        success:function(data){
            cb && cb(data);
        }
    });
}