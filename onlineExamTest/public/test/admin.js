/**
 * Created by Zoe on 2016/12/1.
 */
$(init);
var socket = io();
var STUDENT_MODULE="<a href='/admin/detail/{0}' id={0}' class='student {3}' >{1}<div>{2}</div></a>";
var urlGetStudentList = "/getStudentList";


function init() {
    $('.login').hide();
    socketInit();
    $("body").on('click', '#student', showStudent);
    $("body").on('click', '#question', showQuestion);
    $("body").on('click', '#examination', showExam);
    $("body").on('click', '#questionBtn', addQuestion);
    $("body").on('click', '#studentBtn', addStudent);
    $("body").on('click', '#exit', doExit);
    $("body").on('click', '#startExam', startExam);
    initStudentList();
}
function socketInit() {
    socket.on("reload", function (data) {
        console.log(data);
        initStudentList();
    });
}
function doExit() {
    var data=$("#id").html();
    socket.emit('offline',data);
}
function startExam() {
    socket.emit('start exam');
}
function showStudent() {
    $('.question-control').hide();
    $('.user-control').toggle();
}
function showQuestion() {
    $('.user-control').hide();
    $('.question-control').toggle();
    
}
function showExam() {

}
function initStudentList() {
    var jsonData = JSON.stringify({});
    postData(urlGetStudentList, jsonData, cbInitStudent);
}
//渲染好友列表
function cbInitStudent(result) {
    $(".admin").html("");
    console.log(result);
    var StudentList = "";
    var student;
    var offline = "statusGray";
    var online = "statusRed";
    var exam = "statusBlue";
    var submit = "statusGreen";
    for(var i=0;i<result.length;i++){
        switch (result[i].status){
            case 0://未上线

                 student = $.format(STUDENT_MODULE,result[i]._id,result[i].username,result[i].number,offline);
                break;
            case 1://上线
                 student = $.format(STUDENT_MODULE,result[i]._id,result[i].username,result[i].number,online);
                 break;
            case 2://作答
                  student = $.format(STUDENT_MODULE,result[i]._id,result[i].username,result[i].number,exam);
                break;
            case 3://完成
                 student = $.format(STUDENT_MODULE,result[i]._id,result[i].username,result[i].number,submit);
                break;
            default:
                console.log(result[i].status);
                student = $.format(STUDENT_MODULE,result[i]._id,result[i].username,result[i].number,submit);
                break;
        }
        StudentList += student;
    }
   $(".admin").append(StudentList);
}
function addQuestion() {
    var number = $("#num").val();
    console.log(number);
    console.log("xiaomingming");
    var content = $("#content").val();
    var answer= $('#answer').val();
    var score= $('#score').val();
    $.ajax({
        type: "POST",
        url: "/addQuestion",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'number': number,
            'content': content,
            'answer':answer,
            'score': score
        }),
        success: function(result) {
            if (result.code == 99) {
                alert(result.msg);
            } else {
                alert("添加成功！");
                location.href = '/admin';
            }
        }
    })
}
function addStudent() {
    var usr = $("#usr").val();
    var pwd = $("#pwd").val();
    var number= $('#number').val();
    $.ajax({
        type: "POST",
        url: "/addUser",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'usr': usr,
            'pwd': pwd,
            'type':0,
            'number': number
        }),
        success: function(result) {
            if (result.code == 99) {
                alert(result.msg);
            } else {
                alert("注册成功！");
                location.href = '/admin';
            }
        }
    })
}

