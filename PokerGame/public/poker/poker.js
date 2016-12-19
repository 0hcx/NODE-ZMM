/**
 * Created by Zoe on 2016/11/8.
 */
var socket = io();
var INIT="INIT";
var WAITING="WAITING";
var DISCARD="DISCARD";
var GAMEOVER="GAMEOVER";

//出牌类型：单，对，连对，炸
var ONE = "ONE";
var TWO = "TWO";
var TWO_2 = "TWO_2";
var THREE = "THREE";
var THREE_2 = "THREE_2";
var THREE_3 = "THREE_3";
var FOUR = "FOUR";
var STRAIGHT = "STRAIGHT";
var ERROR = "ERROR";
var KING = "KING";
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
var htmlPoker="<div class='choose'><div class='oppo-usr'></div><div class='oppo-pokers'></div></div><div class='display'></div><div class='choose'><div class='user'><div class='usr'></div><button class='abandon'></button></div><div class='pokers'></div> <div class='button'> <button class='cancel'></button> <button class='no'></button> <button class='confirm'></button> </div></div>";
var htmlStart="<div class='menu'><button type='button' id='login'></button></div>";
var htmlCrowded="<h3 class='waiting'><h2>Cowded....</h2><h5>房间好挤呀，你暂时进不来</h5></div>";

$(init);

function init() {
    $("body").on("click", pkObj.init());
}
function socketInit() {
    socket.on('start poker', function (data) {
        doDiscard(data);
    });
    socket.on('receive poker',function (data,count) {
        doReceive(data,count);
    });
    socket.on('crowded',function () {
        doCrowded();
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
function doDiscard(data) {
    pkObj=data;
    $(".wrapper").html("");
    $(".wrapper").append(htmlPoker);
    yourPoker();
    myPoker(pkObj.data);
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
        //得到对方发来的牌
        var oppo_pokerList=new Array();
        if($(".display").children() !== null){
            $(".display").children().each(function(){
                oppo_pokerList.push(parseInt($(this).attr("data-value")));});
        }

        //得到自己的牌
        var pokerList=new Array();
        for(var i=0;i<27;i++){
            var index=".choose .poker"+i;
            if($(index).hasClass('select')){
                $(index).html();
                pokerList.push(parseInt($(index).attr("data-value")));
            }
        }
        if(getPokerType(pokerList).type===ERROR){
            console.log("error");
            alert("发的牌不和标准");
            doCancel();
        }
        //对方没有牌即自己首发or对方放弃 自己没有牌即表示放弃
        else if(oppo_pokerList.length===0||pokerList.length===0){
            doConfirm(pkObj);
        }
         //自己牌合乎标准
         else if(comparePoker(pokerList,oppo_pokerList)) {
            doConfirm(pkObj);
        }
        else{
            alert("发的牌不和标准");
            doCancel();
        }
    });
    //取消
    $(".cancel").click(function(){
        console.log("cancel");
        doCancel();
    });
    //不出
    $(".no").click(function(){
        $(".display .poker").remove();
        var sendMessage=$(".display").html();
        socket.emit('discard', pkObj, sendMessage);
        doCancel();
    });
    //退出游戏
        $(".abandon").click(function(){
        socket.emit('abandon', pkObj);
    })
}
function myPoker(data) {
    for(var i=0;i<27;i++){
        var x=data.pokers[i]%13*(-90);
        var y=parseInt(data.pokers[i]/13)*(-120);
        var left=x+"px";
        var top=y+"px";
        var count;
        //大王
        if(data.pokers[i]===52)
            count=17;
        //小王
        else if(data.pokers[i]===53)
            count=16;
        //A
        else if((data.pokers[i]+11)%13===11){
            count=14;
        }
        //2
        else if((data.pokers[i]+11)%13===12){
            count=15;
        }
        else {
            count=(data.pokers[i])%13+1;
        }
        var pokeri="poker"+i;
        var html = $("<button class='poker' data-value=''></button>").addClass(pokeri).attr("data-value", count);
        html.css({"background-position":left+" "+top});
        $(".pokers").append(html);
    }
}
function yourPoker() {
    for(var i=0;i<27;i++){
        var html = $("<button class='oppo-poker'></button>");
        html.css({"background-position":"-180px -480px"});
        $(".oppo-pokers").append(html);
    }
}
function doConfirm(pkObj) {
    var count=0;
    $(".display .poker").remove();
    for(var i=0;i<27;i++){
        var index=".poker"+i;
        if($(index).hasClass('select')){
            $(index).html();
            $(".display").append($(index));
            count++;
        }
    }
    var sendMessage=$(".display").html();
    pkObj.data.count-=count;
    socket.emit('discard', pkObj, sendMessage);
    $(".confirm").hide();
    $(".no").hide();
}
function doCancel() {
    for(var i=0;i<13;i++){
        var index=".choose .poker"+i;
        if($(index).hasClass('select')){
            $(index).removeClass('select');
            $(index).animate({top:"+=50px"});
        }
    }
}
function doReceive(data,after) {
    $(".confirm").show();
    $(".no").show();
     var before= $(".oppo-pokers").children().length;
    for(var i=before;i>after;i--){
        $(".oppo-pokers").children('.oppo-poker:last').remove();
    }
    if($(".display").children() != null){
        $(".display .poker").remove();
    }
    $(".display").append(data);
}
function getPokerType(pokerList) {
    var type = ONE;
    var n, m;
    if(pokerList.length===1){
        m=pokerList[0];
    }
    else {
        for (var i = 0; i < pokerList.length; i++) {
            n = pokerList[i];
            m = pokerList[i + 1];
            type = typeState(type, n, m);
        }
        if(type == TWO_2 || type == THREE_2 || type == THREE_3 || (type == STRAIGHT && pokerList.length < 5)) {
            type = ERROR;
        }
    }

    var result = {
        type: type,
        val: m,
        length: pokerList.length
    };
    return result;
}
function comparePoker(pokerList,oppo_pokerList) {
    var check = false;
    console.log("oppo_pokerList");
    console.log(oppo_pokerList);
    console.log("pokerList");
    console.log(pokerList);
    var data1 = getPokerType(oppo_pokerList); //对方的牌类型
    var data2 = getPokerType(pokerList);  //我的牌类型
    console.log("oppo_pokerList");
    console.log(data1);
    console.log("pokerList");
    console.log(data2);

    //1.类型相同的情况下再比较数组第一个元素大小;
    //2.4表示炸，对方不是炸，我出炸则check为true
    //3.天王炸
    if((data1.type == data2.type && (data1.length == data2.length) && pokerList[0] > oppo_pokerList[0]) || (data1.type != FOUR && data2.type == FOUR) || (data2.type == KING)) {
        check = true;
    }
    //check为true可出牌，否则不能出牌
    return check;
}
function typeState(type, n, m) {
    switch (type) {
        //单
        case ONE:
            if(n == m) {
                type = TWO;
            } else if(n == m +1 && m == 16) {
                type = KING;
            } else if(n == m + 1){
                type = STRAIGHT;
            } else {
                type = ERROR;
            }
            break;
        //对
        case TWO:
            if(n == m) {
                type = THREE;
            } else if(n == m + 1){
                type = TWO_2;
            } else {
                type = ERROR;
            }
            break;
        case TWO_2:
            if(n == m) {
                type = TWO;
            } else {
                type = ERROR;
            }
            break;
        case THREE:
            if(n == m) {
                type = FOUR;
            } else if(n == m + 1){
                type = THREE_2;
            } else {
                type = ERROR;
            }
            break;
        case THREE_2:
            if(n == m) {
                type = THREE_3;
            } else {
                type = ERROR;
            }
            break;
        case THREE_3:
            if(n == m) {
                type = THREE;
            } else {
                type = ERROR;
            }
            break;
        case STRAIGHT:
            if(n == m + 1) {
                type = STRAIGHT;
            } else {
                type = ERROR;
            }
            break;
        default:
            break
    }
    return type;
}
function doCrowded(){
    $(".wrapper").html("");
    $(".wrapper").append(htmlCrowded);
}