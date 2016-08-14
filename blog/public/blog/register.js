$(init);

function init() {
  var socket = io();
  socket.on('uploadProgress' , function(percent){
    console.log(percent);
    $(".pg-bar").progressbar( "option", "value", parseInt(percent));
    $(".pg-info").text( percent + '%');
  });
  $("#registerform").validate({
    errorLabelContainer: "#errorMsg",
    onfocusout:false,//触发方式,默认为true
    wrapper:"span",
    submitHandler:function(form) {
      doRegister();  //验证注册
    }
  });
  $(".pg-bar").progressbar({value: 0});
  $(".pg-bar").progressbar( "option", "max", 100 );
  $("body").on('click', '#UploadBtn', doUpload);
  $("body").on('change', '#uploadFile', preUpload);
  // $("body").on('click', '#registerBtn', doRegister);
}
function preUpload() {
  $("#UploadBtn").removeClass('disabled');
}

// function doUpload() {
//   $(".pg-wrapper").show();
//   var file = $("#uploadFile")[0].files[0];
//   var form = new FormData();
//   form.append("file", file);
//
//   $.ajax({
//     url: "/admin/uploadImg",
//     type: "POST",
//     data: form,
//     async: true,
//     processData: false,
//     contentType: false,
//     success: function(result) {
//       startReq = false;
//       if (result.code === 0) {
//       //  var picUrl = $.format("![Alt text]({0})",result.data)
//         $("#userThumb").attr("src",result.data);
//       //  $(".pg-wrapper").hide();
//         // console.log(result.data);
//       }
//     }
//   });
// }
function doUpload() {
  $(".pg-wrapper").show();
  var file = $("#uploadFile")[0].files[0];
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
      if (result.code === 0) {
        $("#userThumb").attr("src",result.data);
        $(".pg-wrapper").hide();
      }
    }
  });
}
function doRegister() {
  $.ajax({
    type: "POST",
    url: "/register",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      'usr': $("#new-usr").val(),
      'pwd': $("#new-pwd").val(),
      'email':$("#new-email").val(),
      'adr':$("#new-address").val(),
      'userThumb':$("#userThumb").attr("src")
    }),
    success: function(result) {
      if (result.code === 99) {
        $(".register-box-msg").text(result.msg);
        console.log("注册失败！");
      } else {
        console.log("注册成功！");
        $.cookie('username', result.data.username, {expires:30});
        $.cookie('password', result.data.password, {expires:30});
        $.cookie('id', result.data._id, {expires:30});
        $.cookie('userThumb',   result.data.userThumb, {expires:30});
        location.href = "/login";
      }
    }
  })
}
