/**
 * Created by Zoe on 2016/11/8.
 */
var socket = io();
INIT=0;
WAITING=1;
DISCARD=2;
GAMEOVER=3;

var fid="";
var id="";
var pkObj = {
    data:{
        status:INIT,
        count:27,
        pokers:[]
    },
    from:id,
    to: fid,
    success:0,
    init:function (){
        if(pkObj.data.status===INIT){
            $("#login").click(doInit);
        }
        socketInit();
    }
};

var htmlWait = "<h3 class='waiting'><h2>Waiting....</h2><h5>正在为你寻找小伙伴</h5></div>";
var htmlPoker="<div class='choose'><div class='oppo-usr'></div><div class='oppo-pokers'></div></div><div class='display'></div><div class='choose'><div class='user'><div class='usr'></div><button class='abandon'></button></div><div class='pokers'></div> <div class='button'> <button class='cancel'></button> <button class='confirm'></button> </div></div>";
var htmlStart="<div class='menu'><button type='button' id='login'></button></div>";
$(init);

function init() {
    $("body").on("click", pkObj.init());
}
function socketInit() {
    socket.on('start poker', function (data) {
        doDiscard(data);
    });
    socket.on('receive poker',function (data,count) {
        doRecieve(data,count);
        console.log(data);
    });
    socket.on('game over',function (data) {
        if(data===1)
        {
            alert("you win！");
        }
        else if(data===2){
            alert("you lose！");
        }
        else if(data===3){
            alert("你放弃啦！");
            //回到初始页面
            $(".wrapper").html("");
            $(".wrapper").append(htmlStart);
            $("#login").click(doInit);
            pkObj.data.status=INIT;
        }
        else{
            alert("对方落荒而逃，恭喜你，不战而胜！");
        }
    })
}
function doInit() {
    //获得唯一的id
    var id = new Date().getTime()+""+Math.floor(Math.random()*11+1);
    pkObj.from=id;
    var obj=pkObj;
    //发送添加用户事件
    socket.emit("add user",obj);
    $(".wrapper").html("");
    $(".wrapper").append(htmlWait);
}
//发牌
function doDiscard(data) {
    pkObj=data;
    console.log(pkObj);
    $(".wrapper").html("");
    $(".wrapper").append(htmlPoker);
    for(var i=0;i<27;i++){
        var html = $("<button class='oppo-poker'></button>");
        html.css({"background-position":"-180px -480px"});
        $(".oppo-pokers").append(html);
    }
    for(var i=0;i<27;i++){
        var x=pkObj.data.pokers[i]%13*(-90);
        var y=parseInt(pkObj.data.pokers[i]/13)*(-120);
        var left=x+"px";
        var top=y+"px";
        var pokeri="poker"+i;
        var html = $("<button class='poker'></button>").addClass(pokeri);
        console.log(html);
        html.css({"background-position":left+" "+top});
        $(".pokers").append(html);
    }
    $(".poker").click(function(){
        if($(this).hasClass("select")){
            $(this).removeClass("select");
            $(this).animate({top:"+=50px"});
        }
        else{
            $(this).addClass("select");
            $(this).animate({top:"-=50px"});
        }
    });
    //发牌
    $(".confirm").click(function(){
        if($(".display").children() != null){
            $(".display .poker").remove();
        }
        var j=0;
        for(var i=0;i<27;i++){
            var index=".poker"+i;
            if($(index).hasClass('select')){
                $(".display").append($(index));
                j++;
            }
        }
        pkObj.data.count-=j;
        var sendMessage=$(".display").html();
        socket.emit('discard', pkObj,sendMessage);
        //把发牌按钮隐藏
        $(".confirm").hide();
        console.log("hide");
    });
    //取消
    $(".cancel").click(function(){
        for(var i=0;i<13;i++){
            var index=".poker"+i;
            if($(index).hasClass('select')){
                $(index).removeClass('select');
                $(index).animate({top:"+=50px"});
            }
        }
    });
    //退出游戏
    $(".abandon").click(function(){
        socket.emit('abandon', pkObj);
    })
}
//接收对方发来的牌
function doRecieve(data,after) {
    $(".confirm").show();
    console.log("show");
    console.log("other count"+after);
     var before= $(".oppo-pokers").children().length;
    console.log("before count"+before);
    for(var i=before;i>after;i--){
        $(".oppo-pokers").children('.oppo-poker:last').remove();
    }
    if($(".display").children() != null){
        $(".display .poker").remove();
    }
    $(".display").append(data);
}