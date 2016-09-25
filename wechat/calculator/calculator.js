var content = '';//显示的内容
var contents = [];//记录用户操作的键
var last = 100;//上一次的键
var dotindex = -1; //记录上一次点的索引
//10:+ 11:- 12:* 13:. 14:÷ 15:del 88:CE 99:=
function onSpanClick($obj, $express,$show) {
    var value = parseInt($obj.attr("data-value"));
    var signal = $obj.text().trim();
    var len = contents.length;
    //获取记录中的最后一次操作
    var arrend = contents[len - 1];
    if (last === 99) {
        if (value < 10) {
            contents = [];
            len = 0;
        }else if(value===13){
            return; 
        }
    }
    //倒数第2次和倒数第1次是/0
    if (arrend == 0 && contents[len - 2] == 14) {
        if (value > 9 && value < 15 && value !== 13) { //不能点击符号 但是可以选小数点
            return;
        }
    }
    //当前点击的是符号,如果上次点的是符号或者记录中的最后一条是符号
    if (value <= 14 && value >= 10) {
        if (len === 0) {
            if (value !== 10 && value !== 11) {
                return;
            }
        }
        //如果点的是. 则要判断上一个操作符到目前数组长度的位置是否含有.
        if (value === 13) {
            if (dotindex !== -1) {
                var temp = contents.slice(dotindex + 1);
                var flag = temp.some(function (x) {
                    return x > 9;
                });
                if (!flag) {
                    return;
                }
                flag = temp = null;
            } else {
                if (contents.indexOf(13) > -1) {
                    return;
                }
            }
            dotindex = len;
        }
    }
    last = value;
    switch (value) {
            //c
        case 88:
            content = '';
            contents = [];
            dotindex = -1;
            last = 100;
            $express.text(content);
            $show.text(content);
            break;
            //ce
        case 87:
            content = '';
            contents = [];
            dotindex = -1;
            last = 100;
            $express.text(content);
            $show.text(content);
            break;
        case 15:
            //backspace 
            content = content.substring(0, content.length - 1);
            //如果被删的是点 查询之前的记录中是否含有
            if (contents.pop() === 13) {
                dotindex = contents.lastIndexOf(13);
            }
            if (contents.length === 0) {
                contents = [];
                content = '';
                dotindex = -1;
                last = 15;
            }
             $express.text(content);
            break;
        case 99:// 输入等号 希望实现叠加但是失败了
            // var index = len;
            // var flag = 0;
            // if(contents[index-1] === 99 && len !== 0){
            //     for(; index > 0 ; index--){
            //         if(contents[index] === 10 || contents[index] === 11||contents[index] === 12||contents[index] === 14)
            //            {flag=contents[index];break;}
            //     } 
            //     if(flag !== 0){
            //         le=len-index-1;
            //         contents[len-1] = flag;
            //         for(var i=0;i<le;i++){
            //             contents.push(contents[index++]);}
            //         // contents[len-1] = flag;
            //         // var temp = contents.splice(index, len - 1);
            //         // for(var i = temp[0];i < temp.length;i++){
            //         //     contents.push(i);
            //         // }
            //     }
            // }
            var res = plus(contents) - 0;
            log("result:" + res);
            content = res.toFixed(2);
            contents = [res - 0];
            // contents[len-1]=99;
            dotindex = -1;
            last = 99;
            $show.text(content);
            break;
        default:
            //数字、符号拼接
            //只有数字和运算符的键才存进进来
            //容错!!!!
            if(value <= 14 && value >= 10 && arrend <= 14 && arrend >= 10){
                contents[len-1] = value;
            }
            else if (value < 15) {
                contents.push(value);
            }
            log(signal);
            content = content + "" + signal;
            $express.text(content);
    }
    //界面显示
   
}
//日志显示
function log(text) {
    var log = $("#log");
    var children = log.children();
    //控制界面显示15条记录
    if (children.length > 15) {
        children.eq(0).remove();
    }
    var c = "<span  style='display:block;'>" + text + "</span>";
    log.append(c);
}
/**
 * 实现加法
 */
function plus(arr) {
    //first 取出第一个+-的前面的位置
    var i = -1;
    var flag = null;
    for (var index = 0; index < arr.length; index++) {
        var cur = arr[index];
        if (cur === 10) {
            i = index;
            flag = true;
            break;
        } else if (cur === 11) {
            i = index;
            flag = false;
            break;
        }
    }
    //如果没有找到符号 说明都是数字或者带小数点
    if (i === -1) {
        return muti(arr, 0);
    }
    //取出第一部分
    var temp = arr.splice(0, index);
    arr.shift();
    var res = muti(temp);
    //对剩余部分进行递归 flag为false代表本次符号是-,因此剩余的+-需要变符号
    if (flag) {
        return res + arguments.callee(arr);
    } else {
        arr.forEach(function (e, id) {
            if (e === 10) {
                arr[id] = 11;
            } else if (e === 11) {
                arr[id] = 10;
            }
        });
        return res - arguments.callee(arr);
    }

}
/**
 * 乘除法
 */
var muti = function muti(arr, sign) {
    var flag = null;
    var i = -1;
    for (var index = 0; index < arr.length; index++) {
        var element = arr[index];
        if (element === 12) {
            flag = true;
            i = index;
            break;
        } else if (element === 14) {
            flag = false;
            i = index;
            break;
        }

    }
    //如果没有运算符 就返回后面数字
    if (i === -1) {
        //如果后面已经空了
        if (arr.length === 0) {
            return sign;
        }
        //出现小数点的时候 只能手动来拼接了
        var r = '';
        for (var j = 0, l = arr.length; j < l; j++) {
            if (arr[j] === 13) {
                arr[j] = '.';
            }
            r = r + "" + arr[j];
        }
        return r - 0;
    }
    var n = arr.splice(0, i).join('') - 0;
    arr.shift();
    if (n === 0) {
        return 0;
    }
    if (flag) {
        return n * arguments.callee(arr, 1);
    } else {
        //减法的时候 后面的运算都要反过来 负负得正!
        arr.forEach(function (e, id) {
            if (e === 12) {
                arr[id] = 14;
            } else if (e === 14) {
                arr[id] = 12;
            }
        });
        return n / arguments.callee(arr, 1);
    }
}
