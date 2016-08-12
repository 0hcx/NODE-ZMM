$(init);

function init() {
    var imgUrl = $.cookie('userThumb');
    $(".uig").attr("src",imgUrl);
    
    // var usr=$.cookie('username');
    // $(".aaa").attr("text",usr);
    // alert($.cookie("username"));
}