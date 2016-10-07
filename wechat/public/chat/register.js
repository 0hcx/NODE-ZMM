$(init);

function init() {
   
    $("body").on('click', '#UploadBtn', doUpload);
    $("body").on('click', '#registerBtn', doRegister);
}
function doUpload() {
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
                console.log(result.data);
                var  src = result.data;
                $("#userThumb").attr("src",result.data);
            }
            else {
                console.log("fail");
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
            'username': $("#new-usr").val(),
            'telephone': $("#new-tel").val(),
            'password':$("#new-pwd").val(),
            'userThumb':$("#userThumb").attr("src")
        }),
        success: function(result) {
            if (result.code === 99) {
                $(".register-box-msg").text(result.msg);
                console.log("注册失敗！");
            } else {
                console.log("注册成功！");
                $.cookie('username', result.data.username, {expires:30});
                $.cookie('id', result.data._id, {expires:30});
                $.cookie('password',   result.data.password, {expires:30});
                $.cookie('telephone',   result.data.telephone, {expires:30});
                $.cookie('userThumb',   result.data.userThumb, {expires:30});
                location.href = "/login";
            }
        }
    })
}
