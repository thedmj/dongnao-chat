export function setCookie(name,value,iday){
　　var odate=new Date();
　　odate.setDate(odate.getDate()+iday);
　　document.cookie=name+"="+value+";expires="+odate;
}
export function getCookie(key) {
    var cookieArr = document.cookie.split('; ');
    for(var i = 0; i < cookieArr.length; i++) {
        var arr = cookieArr[i].split('=');
        if(arr[0] === key) {
            return arr[1];
        }
    }
    return false;
}
export function removeCookie(key) {
    setCookie(key, '', -1);//这里只需要把Cookie保质期退回一天便可以删除
}