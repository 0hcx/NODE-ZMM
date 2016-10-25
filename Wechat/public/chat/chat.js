var socket;
var username;
var _id = $.cookie('id');
var fid;
var chatSession = [];
var _img = $.cookie('userThumb');

$(init);

function init() {
  initSocket();
  initFriendList();
  initEmoji();//emoji表情初始化
  $('body').on('click', '.addFriendBtn' , doAddFreind);
  $('body').on('click', '.wrapper-content .list li' , doChatSession);
  $('body').on('keydown', '#editArea' , doSend);
  $('body').on('click', '#emoji' , showEmoji);
  $('body').on('click', '#UploadBtn' , doUploadImage);

}
//初始化socketio
function initSocket() {
  socket = io();
  socket.emit('online', _id);

  // 监听消息
  socket.on('msg', function(uid, fid, msg) {
    var fromID = (_id == fid)?uid:fid;
    var message;
    console.log(_id );
    console.log(uid );
    console.log(fid );
    if (_id == fid) {
      console.log(uid+"消息"+fid );
      fImg = $('#'+uid).children('img').attr('src');
      message = $.format(TO_MSG,fImg, msg);

    } else {
      message = $.format(FROM_MSG, _img, msg);
      console.log("from");
    }
    $("#v"+fromID).append(message);
    $("#v"+fromID).scrollTop($("#v"+fromID)[0].scrollHeight);
  });
}




//初始化好友列表
function initFriendList() {
  console.log("init friend1");

  var jsonData = JSON.stringify({ 'uid': _id });
  postData(urlGetFriendList, jsonData, cbInitFreind);
}

//添加好友
function doAddFreind() {
  var jsonData = JSON.stringify({
      'fid': $(this).data('id'),
      'uid': _id
  });
    console.log(jsonData);
    postData(urlAddFriend, jsonData, cbAddFreind);
}

//渲染好友列表
function cbInitFreind(result) {
  console.log("init friend");
  var friendList = "";
  for(var i=0;i<result.length;i++){
    var friend = $.format(FRIEND_MODULE,result[i].fid.userThumb,result[i].fid._id,result[i].fid.username);
    friendList += friend;
  }
  $(".wrapper-content .list").empty();
  $(".wrapper-content .list").append(friendList);

  initOfflineMsg();
}

//显示添加好友的成功信息
function cbAddFreind(result) {
  console.log(result);
  if (result.code == 0) {
    notifyInfo("添加好友成功！")
  }else{
    notifyInfo("添加好友失败！")
  }
}

//计算sessionid
function calcuSessionId(uid,fid) {
  return (uid>fid)?(uid+fid):(fid+uid);
}
//新建会话过程
function doChatSession() {
  console.log("in");
  fid = $(this).attr("id");
  var sessionId = calcuSessionId(_id,fid);
  console.log(sessionId);
  //第一次点击的话，发送初始化SESSION消息
  if (chatSession.indexOf(sessionId) === -1) {
    chatSession.push(sessionId);
    socket.emit('join', sessionId);
  }
  //切换界面
  toggleChatView(fid);
  //修改离线消息
  console.log("outline");
  var count = parseInt($(this).children('.count').html());
  console.log(count);
  if ( count >0 ) {
    setOfflineMsg(fid);
  }
}

//切换聊天窗口
function toggleChatView(fid) {
  if ($("#v"+fid).length == 0) {
    $(".title_wrap .message-content").prepend('<div class="box-content" id="v'+fid+'"></div>');
  }
  $(".box-content").hide();
  $("#v"+fid).show();
}


//初始化离线消息
function initOfflineMsg() {
  console.log("come");
  var jsonData = JSON.stringify({ 'uid': _id });
  console.log("jsonData： "+ jsonData);
  console.log(jsonData);
  
  postData(urlGetOfflineMsg, jsonData, cbInitOfflineMsg);
}


//渲染离线消息列表
function cbInitOfflineMsg(result) {
  console.log("mimaia");
  console.log(result);
  for(var i=0;i<result.length;i++){
    var fid = result[i].from._id;
    var msg = $.format(TO_MSG, result[i].from.userThumb, result[i].msg);
    if ($("#v"+fid).length == 0) {
      $(".title_wrap .message-content").prepend('<div class="box-content" id="v'+fid+'"></div>');
    }
    $("#v"+fid).append(msg);
    var count = $("#"+fid).children('.count');
    console.log("before:"+count);
    count.html(parseInt(count.html())+1);
    console.log("after:"+count);
    count.show();
  }
  $(".box-content").hide();

}
//将离线消息的标志设为已读
function setOfflineMsg(fromId) {
  var jsonData = JSON.stringify({ 'uid': _id, 'fid':fromId });
  console.log(jsonData);
  postData(urlSetOfflineMsg, jsonData, cbResetOfflineMsg);
}

//隐藏离线消息数量
function cbResetOfflineMsg(result) {
  var fid = result.id;
  var count = $("#"+fid).children('.count');
  count.html('0');
  count.hide();
}
//发送消息给朋友
function doSend(e) {
  if (e.which  === 13) {
    e.preventDefault();
    var msg = $(this).val();
    console.log(msg);
    $(this).val('');
    socket.send(_id,fid,msg);
  }
}
function initEmoji() {
  var emojiContainer = document.getElementById('emojiWrapper'),
      docFragment = document.createDocumentFragment();
  for (var i = 1; i <=68; i++) {
    var emojiItem = document.createElement('img');
    emojiItem.src = '/emoji/' + i + '.gif';
    emojiItem.title = i;
    docFragment.appendChild(emojiItem);
  };
  emojiContainer.appendChild(docFragment);
}
function showEmoji() {
  var emojiwrapper = document.getElementById('emojiWrapper');
  emojiwrapper.style.display = 'block';
}
function doUploadImage() {
  var file = $("#sendImage")[0].files[0];
  var form = new FormData();
  form.append("file", file);
  $.ajax({
    url: "/uploadImg",
    type: "POST",
    data: form,
    async: true,
    processData: false,
    contentType: false,
    success: function(result) {
      startReq = false;
      if (result.code == 0) {
        var picUrl = $.format("![Alt text]({0})",result.data);
        console.log(picUrl);

        $("#editArea").insertAtCaret(picUrl);
        // $(".title_wrap .message-content").prepend('<img id="img">');
        // $("#img").attr("src",result.data);
        // $("#editArea").prepend('<img id="img">');
        // $("#img").attr("src",result.data);
        //$(".title_wrap .message-content").insertAtCaret(picUrl);
      }
    }
  });
}