$(init);

function init() {
    $("body").on('click', '#respondBtn', doRespond);

}
$('[data-toggle="select"]').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var cid = $this.data('cid');//主评论id，即comment-id
    var rid = $this.data('rid');//当前评论人id即to-id
//评论显示
    //判断input隐藏域是否有了
    if($('#cid').length > 0) {
        $('#cid').val(cid);//赋值
    }
    else {
        //插入的隐藏域
        $('<input>').attr({//传入对象，有多个键值对
            id: 'cid',
            type: 'hidden',
            value: cid
        }).appendTo('#commentForm');//插入表单
    }
//回复显示
        if($('#rid').length > 0) {
        $('#rid').val(rid);
    }
    else {
        $('<input>').attr({
            id: 'rid',
            type: 'hidden',
            value: rid
        }).appendTo('#commentForm');
    }
});
function doRespond() {
    $.ajax({
        type: "POST",
        url: "/addComment",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            'news': $("#news").val(),
            'content': $("#resContent").val(),
            'from': $.cookie('id'),
            'to': $("#rid").val(),
            'comment': $("#cid").val()
        }),
        success: function(result) {
            if (result.code == 99) {
                alert("出错");
            } else {
                alert("成功！");
                location.href = result.data._id;
            }
        }
    })
}