$(init);

function init() {
    var imgUrl = $.cookie('userThumb');
    $(".uig").attr("src",imgUrl);
}
