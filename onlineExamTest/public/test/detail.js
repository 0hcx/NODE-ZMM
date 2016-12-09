// /**
//  * Created by Zoe on 2016/12/1.
//  */
$(init);
var urlGetAnswer="/getAnswer";
function init() {
    console.log("hh");
    getAnswer;
}
function getAnswer() {
    console.log("hh");
    var id=$('.id').html();
    var jsonData = JSON.stringify({
        data:id
    });
    postData(urlGetAnswer, jsonData,cbAnswerList);
}
//渲染好友列表
function cbAnswerList(result) {
    console.log(result);
}
