$(document).ready(function()
{
    $(".username ul").hide();
    $(".username").click(function(){
        $(".username ul").show();
    });
    $(".username").mouseleave(function(){
        $(".username ul").hide();
    })
});/**
 * Created by Zoe on 2016/6/30.
 */
