/**
 * Created by Zoe on 2016/12/1.
 */
$(init);

var socket = io();
var STUDENT_MODULE="<a href='/{0}' class='student {3}' >{1}<div>{2}</div></a>";
var STUDENT_DETAIL="<tr><td>{0}</td> <td>{1}</td> <td>{2}</td><td>{3}</td><td><a href='/studentDelete/{0}' class='btn btn-primary' data-toggle='confirm' data-message='确认要删除吗'>删除</a></td></tr>";
var QUESTION_DETAIL="<tr><td>{0}</td> <td>{1}</td><td>{2}</td><td><a href='/questionDelete/{3}' class='btn btn-primary' data-toggle='confirm' data-message='确认要删除吗'>删除</a></td></tr>";
var urlGetQuestionList = "/getQuestionList";
var urlGetStudentList = "/getStudentList";
var urlSaveGrade = "/saveGrade";
var userId=$(".id").html();
var urlExportExcel = "/exportExcel";
var students = {};
students.idList = new Array();
students.nameList = new Array();
students.gradeList= new Array();
function init() {
    $('.login').hide();
    socketInit();
    $("body").on('click', '#questionBtn', addQuestion);
    $("body").on('click', '#studentBtn', addStudent);
    $("body").on('click', '#exit', doExit);
    $("body").on('click', '#startExam', startExam);
    $("body").on('click', '#saveGrade', saveGrade);
    $("body").on('click', '#excel', doExport);

    initStudentList();
    initQuestionList();
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
// function showStudent() {
//     $('.question-control').hide();
//     $('.user-control').toggle();
// }
// function showQuestion() {
//     $('.user-control').hide();
//     $('.question-control').toggle();
//
// }
// function showExam() {
//
// }
function saveGrade() {
    alert("saveGrade");
    var jsonData = JSON.stringify({
        "userId": userId,
        "grade": $("#grade").val()
    });
    postData(urlSaveGrade, jsonData,cbSaveGrade );
}
function cbSaveGrade(data) {
    if(data.code == 99) {
        console.log(data.msg);
    }
}
function initQuestionList() {
    var jsonData = JSON.stringify({});
    postData(urlGetQuestionList, jsonData, cbInitQuestion);
}
function cbInitQuestion(result) {
    var question;
    var questionList="";
    for(var i=0;i<result.length;i++){
        question = $.format(QUESTION_DETAIL,result[i].number,result[i].content,result[i].score,result[i]._id);
        questionList+=question;
    }
    $("#question-table").append(questionList);
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
    var DetailList="";
    var student,detail;
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

        detail= $.format(STUDENT_DETAIL,result[i]._id,result[i].number,result[i].username,result[i].grade);
        students.idList[i] = result[i].number;
        students.nameList[i] = result[i].username;
        students.gradeList[i] = result[i].grade;
        
        StudentList += student;
        DetailList += detail;

    }
   $(".admin").append(StudentList);
    $("#student-table").append(DetailList);
}
//导出EXCEL文件
function doExport() {
    var jsonData = JSON.stringify({
        "idList": students.idList,
        "nameList": students.nameList,
        "gradeList": students.gradeList
    });
    postData(urlExportExcel, jsonData, cbExportExcel);
}
function cbExportExcel(result) {
    alert(result);
}
function addQuestion() {
    var number = $("#num").val();
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
                location.href = '/questionAdmin';
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
                location.href = '/studentAdmin';
            }
        }
    })
}

