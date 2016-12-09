/**
 * Created by Zoe on 2016/11/24.
 */
$(init);
var socket = io();
function init() {
    $("body").on('click', '#loginBtn', doLogin);
    $("body").on('click', '#login', doDisplay);
}
function doDisplay() {
    $('.login-control').toggle();
}
function doLogin() {
    $.ajax({
        type: "POST",
        url: "/",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'usr': $("#usr").val(),
            'pwd': $("#pwd").val()
        }),
        success: function(result) {
            if (result.code == 99) {
                alert("登录失败");
            }
            else {
                $.cookie('username', result.data.username, {expires:30});
                $.cookie('password', result.data.password, {expires:30});
                $.cookie('id', result.data._id, {expires:30});
                $('.login-control').hide();
                socket.emit("online",result.data);
                doShow(result.data);
            }
        }
    })
}
function doShow(data) {
    if(data.type===1){
        location.href="/admin";
    }
    else {
        location.href="/exam";
    }
}

















