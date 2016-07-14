$(init);
function init() {
  var msg = $(".box-msg").text();
  if (msg!=="") {
    alert(msg);
    alert("kiyomi");
    notifyInfo(msg);
    $(".box-msg").text("");
  }
    else{
      notifyInfo("hiahia");
  }
}
