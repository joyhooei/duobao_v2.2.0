function browserText(){return $.device.ios?"在Safari中打开":"在浏览器中打开"}function getOpenId(){null==$.getUrlParam("access_token")||luanmingli.userId||1==window.sessionStorage.getItem("qqSignOut")?null!=$.getUrlParam("access_token")&&null!=window.sessionStorage.getItem("openId"):$.ajax({type:"get",url:"https://graph.qq.com/oauth2.0/me",data:{access_token:$.getUrlParam("access_token")},dataType:"jsonp",jsonp:"callback",async:!1,jsonpCallback:"callback",callback:function(e){},success:function(e){var o=e;$.ajax({type:"post",url:"http://h5.7kuaitang.com/data/data.php",data:{u:"https://graph.qq.com/user/get_user_info?access_token="+$.getUrlParam("access_token")+"&oauth_consumer_key="+e.client_id+"&openid="+e.openid},async:!1,dataType:"json",success:function(e){var n=o.openid,t=e.nickname;window.sessionStorage.setItem("openId",n),window.sessionStorage.setItem("nickName",t),QCsaveAuth(n,t),$.whichPage("login_page")&&(null!=window.sessionStorage.getItem("loginFromPage")?($.router.load(window.sessionStorage.getItem("loginFromPage")),window.sessionStorage.removeItem("loginFromPage")):window.location.href="personal_page.html")}})}})}var personal={times:1,loginOrNot:function(){return $.showIndicator(),""!=luanmingli.userId?(personal.times=1,$.hideIndicator(),void personal.login()):void setTimeout(function(){return personal.times++,10==personal.times?(personal.times=1,$.hideIndicator(),void personal.login()):void personal.loginOrNot()},100)},login:function(){luanmingli.userId?($("#p-personal").find(".not_login").hide(),$("#p-personal").find(".have_login").show(),personal.haveLogin()):($("#p-personal").find(".have_login").hide(),$("#p-personal").find(".not_login").show(),personal.notLogin())},haveLogin:function(){$("#balanceName").html(luanmingli.userInfo.nickName),$("#balanceSum").html(luanmingli.userInfo.detailInfo.points),$("#p-personal").find(".recharge-btn").click(function(){navigator.userAgent.indexOf("QQ")>-1||navigator.userAgent.indexOf("MicroMessenger")>-1?($.popup('<div class="popup wxqq"><div class="u-arrow"></div><div class="u-alert"><div class="alert-text">点击右上角按钮<br />选择“'+browserText()+"”<br />前往购买</div></div></div>"),$(".wxqq").click(function(){$.closeModal(".wxqq")})):($.showIndicator(),$.router.load("recharge.html"))})},notLogin:function(){$("#p-personal").find(".not_login").click(function(){$.showIndicator(),window.sessionStorage.removeItem("qqSignOut"),$.router.load("login.html")})}},QCsaveAuth=function(e,o){$.ajax({type:"get",url:luanmingli.getUrl+"saveAuth",data:{v:luanmingli.srvVersion,content:encryptByDES(JSON.stringify({platform:1,openId:e,nickName:o,channelid:luanmingli.channel,appversion:luanmingli.version,clienttype:3}))},async:!0,dataType:"json",success:function(o){8==o.stateCode?$.alert(o.message,function(){var o,n=function(){o=prompt("请输入昵称"),o||n()};n(),QCsaveAuth(e,o)}):(luanmingli.userId=o.userInfo.userId,luanmingli.userInfo=o.userInfo,window.localStorage.setItem("userId",o.userInfo.userId),window.localStorage.setItem("userInfo",JSON.stringify(o.userInfo)),window.localStorage.setItem("userKey",o.userInfo.userKey),window.localStorage.setItem("mid",CryptoJS.MD5(o.userInfo.userId).toString()),window.localStorage.setItem("loginSrv",luanmingli.getUrl),personal.loginOrNot())}})};personal.linkTo=function(){$("#p-personal").find(".p-record").find(".record-list").click(function(){luanmingli.userId?($.showIndicator(),$.router.load("record.html?type="+$(this).index())):($.showIndicator(),$.router.load("login.html"))}),$(".j-perInfo").click(function(){$.showIndicator(),$.router.load("perInfo.html")}),$(".j-my-prize").click(function(){luanmingli.userId?$.router.load("prize.html"):($.showIndicator(),$.router.load("login.html"))}),$(".j-my-share").click(function(){luanmingli.userId?$.router.load("myshare.html"):($.showIndicator(),$.router.load("login.html"))}),$(".j-bonus").click(function(){luanmingli.userId?$.router.load("bonus.html"):($.showIndicator(),$.router.load("login.html"))}),$(".j-car").click(function(){$.showIndicator(),luanmingli.userId?$.router.load("mycar.html"):$.router.load("login.html")}),$(".j-setting").click(function(){$.showIndicator(),$.router.load("setting.html")})},$(function(){1==window.sessionStorage.getItem("toCompletePerInfo")&&(window.sessionStorage.removeItem("toCompletePerInfo"),$.router.load("perInfo.html")),1==window.sessionStorage.getItem("myshareForceRefresh")&&$.router.load("myshare.html"),window.sessionStorage.getItem("fromActRecharge")&&(luanmingli.userId?luanmingli.userInfo.usertelephone?$.router.load("recharge.html"):$.alert("请先绑定手机号",function(){window.sessionStorage.removeItem("fromActRecharge"),$.router.load("perInfo.html")}):$.alert("请先登录",function(){window.sessionStorage.removeItem("fromActRecharge"),$.router.load("login.html")})),window.sessionStorage.getItem("fromActRegister")&&(luanmingli.userId?$.alert('您已经是一元街老主顾啦～我们为您奉上"充值狂欢大礼包"',function(){window.sessionStorage.removeItem("fromActRegister")}):$.router.load("login.html")),getOpenId(),luanmingli.userId&&getUserInfo(),window.sessionStorage.removeItem("pointsNum"),$(".receipt-popup").length>0&&$.closeModal(".receipt-popup"),personal.loginOrNot(),personal.linkTo(),window.sessionStorage.removeItem("recordTab")});