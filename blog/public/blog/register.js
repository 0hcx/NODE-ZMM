$(init);

function init() {
  $("body").on('click', '#registerBtn', doRegister);
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
      'adr':$("#new-address").val()
    }),
    success: function(result) {
      if (result.code === 99) {
        $(".register-box-msg").text(result.msg);
        console.log("注册失败！");
      } else {
        console.log("注册成功！");
        location.href = "/login";
      }
    }
  })
}
