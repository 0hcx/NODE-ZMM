$(document).ready(function () {
    //获取键盘上所有的数字和符号
    var keyBords=document.querySelectorAll(".row span");
    var keyBord = null;
    var preKey="";
    //status
    var P1=1;
    var P2=2;
    var P3=3;
    var status=P1;
    var contents="";//显示在express上面的
    var content="";//真正计算的
    var content3="";//p3
    var content2="";
    // var symbol = {"+":"+","-":"-","×":"*","÷":"/","%":"%","=":"="};
    for(var i=0;i<keyBords.length;i++){
        keyBord = keyBords[i];
        keyBord.onclick = function() {
          var number = this.innerHTML;
          clickNumber(number);
        }
    }
    function clickNumber(number){
        //p1
        if((number>0&&number<9)&&status==P1){
            status=P1;
            contents+=number;
            $("#express").text(contents);
        }
        //p2
        else if((number=="+"||number=="-"||number=="*"||number=="/")&&(status==P1||status==P2)){
            //容错
            if(preKey=="+"||preKey=="-"||preKey=="*"||preKey=="/"){
                // contents=contents.slice(0,-1);
                contents=contents.substring(0,contents.length-1);
                contents+=number;
                content2=number;

            }
                else{
                    status=P2;
                    contents+=number;
                    content2=number;
                }
            $("#express").text(contents);
        }
        else if((number>0&&number<9)&&status==P2){
            status=P3;
            content2+=number;
            contents+=number;
            $("#express").text(contents);
        }
        //四则运算
        else if(status==P3&&(number=="+"||number=="-"||number=="*"||number=="/")){
            status=P2;
            contents+=number;
            $("#express").text(contents);
        }
        else if(number=="CE"){
            contents="";
            content2="";
            content3="";
            preKey="";
            $("#express").text(0);
            $("#show").text(0);
            status=P1;
        }
        else if(number=="="){
            //等号循环
            if(preKey=="="){
                contents+=content2;
                contents+=content3;
                $("#show").text(eval(contents));
            }
            else{
                if(preKey=="+"||preKey=="-"||preKey=="*"||preKey=="/"){
                        contents=contents.substring(0,contents.length-1);
                    }
                    var result=eval(contents);
                     $("#show").text(result);
            }
        }
        preKey = number;
    }
})