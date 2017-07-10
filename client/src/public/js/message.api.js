import $ from "jquery";
import host from "../../config";
export function getMessage(user,friend,cb){
    $.ajax({
        url:host+"message",
        data:{
            user:user,
            friend:friend,
        },
        type:"GET",
        success:function(e){
            cb && cb(e);
        }
    });
}