/**
 * Created by Zoe on 2016/12/1.
 */
$(init);
var QUESTION_MODULE="<div class='studentWrapper'><div class='sidebar'><button id='btn1' class='answerItem'>1</button><button id='btn2' class='answerItem'>2</button><button class='answerItem' id='btn3'>3</button><button class='answerItem' id='btn4'>4</button></ul></div><div class='answer-panel'><div class='que'>点击按钮选择相应的题目</div><textarea class='text ans'></textarea><a class='save'>保存</a></div></div>";
var urlGetQuestionList    = "/getQuestionList";
var urlSaveAnswer   = "/saveAnswer";
var urlUpdateStatus = "/updateStatus";
var questionList=new Array();
var id=new Array();
var contents=new Array();
var socket = io();
var i=0;
var userId=$("#id").html();

function init() {
    $('.login').remove();
    $("body").on('click', '#test', doTest);
    // $("body").on('click', '#myMessage', showMessage);
    $("body").on('click', '#exit', doExit);
    $("body").on('click', '.save', doSave);
    $("body").on('click', '#submit', doSubmit);
    socketInit();
}
function socketInit() {
    socket.on('start exam',function () {
        $("#test").show();
    })
}
function showMessage() {
    $('.message-control').toggle();
}
function doExit() {
    var data=$("#id").html();
    socket.emit('offline',data);
}
function doTest() {
    $("#submit").show();
    doUpdate(2);
    $(".waiting").remove();
    initQuestionList();
    console.log(questionList);
    $('body').append(QUESTION_MODULE);
    $("body").on('click', '#btn1', function () {
        i=0;showQuestion(0);
    });
    $("body").on('click', '#btn2', function () {
        i=1;showQuestion(1);
    });
    $("body").on('click', '#btn3', function () {
        i=2;showQuestion(2);
    });
    $("body").on('click', '#btn4', function () {
        i=3;showQuestion(3);
    });
}
function doUpdate(i) {
    var jsonData = JSON.stringify({
        "userId": userId,
        "status": i
    });
    //考试中
    postData(urlUpdateStatus, jsonData, null);
    socket.emit("update status");
}
function doSave() {
    var jsonData = JSON.stringify({
        "userId": userId,
        "questionId": id[i],
        "content": $(".ans").val()
    });
    contents[i]=$(".ans").val();
    console.log(id[i]+"  "+questionList[i]);
    postData(urlSaveAnswer, jsonData,cbSaveAnswer );
}
function cbSaveAnswer(data) {
    if(data.code == 99) {
        console.log(data.msg);
    }
}
function initQuestionList() {
    var jsonData = JSON.stringify({});
    postData(urlGetQuestionList, jsonData, cbInitQuestion);
}
function cbInitQuestion(result){
    for(var i=0;i<result.length;i++){
        questionList[i]= result[i].content;
        id[i]= result[i]._id;
    }
}
function showQuestion(i) {
    $(".ans").val(contents[i]);
    console.log(questionList[i]);
   $(".que").html(questionList[i]);
}
function doSubmit() {
    doUpdate(3);
}



