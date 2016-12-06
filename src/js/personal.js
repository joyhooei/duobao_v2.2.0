
var personal = {
	times : 1,
	loginOrNot : function(){
		$.showIndicator();
		if (luanmingli.userId == "") {
			setTimeout(function(){
				personal.times++;
				if ( personal.times == 10 ) {
					personal.times = 1;
					$.hideIndicator();
					personal.login();
					return;
				}
	//				$.hideIndicator();
				personal.loginOrNot();
			},100)
		}else{
			personal.times = 1;
			$.hideIndicator();
			personal.login();
			return;
		}
	},
	
	login : function(){
		if (luanmingli.userId) {
			$("#p-personal").find(".not_login").hide();
			$("#p-personal").find(".have_login").show();
			personal.haveLogin();
		}else{
			$("#p-personal").find(".have_login").hide();
			$("#p-personal").find(".not_login").show();
			personal.notLogin();
		}
	},
	
	//已登录
	haveLogin : function(){
		$("#balanceName").html(luanmingli.userInfo.nickName);
		$("#balanceSum").html(luanmingli.userInfo.detailInfo.points);
		
		$("#p-personal").find(".recharge-btn").click(function(){
			if (navigator.userAgent.indexOf("QQ") > -1 || navigator.userAgent.indexOf("MicroMessenger") > -1) {
				$.popup(
					'<div class="popup wxqq">' +
						'<div class="u-arrow"></div>'+
		                '<div class="u-alert">'+
		                    '<div class="alert-text">点击右上角按钮<br />选择“'+browserText()+'”<br />前往购买</div>'+
		                '</div>'+
					'</div>'
				)
				
				$(".wxqq").click(function(){
					$.closeModal(".wxqq")
				});
			}else{
				$.showIndicator();
				$.router.load("recharge.html");
			}
		})

	},

	//未登录
	notLogin : function(){
		$("#p-personal").find(".not_login").click(function(){
			$.showIndicator();
			window.sessionStorage.removeItem("qqSignOut");
			$.router.load("login.html");
		})
	},
}

function browserText(){
	if ($.device.ios){
		return "在Safari中打开";
	}else{
		return "在浏览器中打开";
	}
	
}


//第三方－－QQ登录
var QCsaveAuth = function(openId, nickName) {
	
	$.ajax({
		type:"get",
		url:luanmingli.getUrl+"saveAuth",
		data:{
//			platform : 1,
//			openId : openId,
//			nickName : nickName,
//			clientData : luanmingli.channel+"&"+luanmingli.version+"&1",
			
			v: luanmingli.srvVersion,
			content: encryptByDES(JSON.stringify({
				platform : 1,
				openId : openId,
				nickName : nickName,
//				clientData : luanmingli.channel+"&"+luanmingli.version+"&1"
				channelid: luanmingli.channel,
				appversion: luanmingli.version,
				clienttype: 3
			}))
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.stateCode == 8) {
				$.alert(o.message,function(){
					var pmtText;
					var pmt = function() {
						pmtText = prompt("请输入昵称");
						if (!pmtText) {
							pmt();
						}
					}
					pmt();
					QCsaveAuth(openId, pmtText);
				})
				
			}else{
				luanmingli.userId = o.userInfo.userId;
				luanmingli.userInfo = o.userInfo;
				window.localStorage.setItem("userId", o.userInfo.userId);
				window.localStorage.setItem("userInfo",JSON.stringify(o.userInfo));
				window.localStorage.setItem("userKey",o.userInfo.userKey);
				window.localStorage.setItem("mid",CryptoJS.MD5(o.userInfo.userId).toString());
				window.localStorage.setItem("loginSrv",luanmingli.getUrl);
		
				personal.loginOrNot();
			}
		},
	})
}



//qq登录回调
function getOpenId(){
	if ($.getUrlParam("access_token") != null && !luanmingli.userId && window.sessionStorage.getItem("qqSignOut") != 1 ) {
		$.ajax({
			type: "get",
			url: "https://graph.qq.com/oauth2.0/me",
			data: {
				"access_token": $.getUrlParam("access_token")
			},
			dataType: 'jsonp',
			jsonp: 'callback',
			async: false,
			jsonpCallback: "callback",
			callback:function(o){
				console.log(o)
			},
			success: function(o){
				var qqcb = o;

				console.log(o);
				$.ajax({
					type: "post",
					url: "http://h5.7kuaitang.com/data/data.php",
					data: {
						u: "https://graph.qq.com/user/get_user_info?access_token=" + $.getUrlParam("access_token") + "&oauth_consumer_key=" + o.client_id + "&openid=" + o.openid
					},
					async: false,
					dataType: "json",
					success: function(o) {
						console.log(o);
						var openId = qqcb.openid;
						var nickName = o.nickname;
						window.sessionStorage.setItem("openId", openId);
						window.sessionStorage.setItem("nickName", nickName);
						
			//			setTimeout(function() {
							QCsaveAuth(openId, nickName);
			//			}, 1000)
			
						if ($.whichPage("login_page")) {
							if (window.sessionStorage.getItem("loginFromPage") != null) {
								$.router.load(window.sessionStorage.getItem("loginFromPage"));
								window.sessionStorage.removeItem("loginFromPage");
							} else {
								window.location.href = "personal_page.html";
							}
						}
			
					}
				});
			}
		});
	}else if($.getUrlParam("access_token") != null && window.sessionStorage.getItem("openId") != null){
//		QCsaveAuth(window.sessionStorage.getItem("openId"),window.sessionStorage.getItem("nickName"))
	}
}


//QQ登录JSONP
//function callback(o){
//	var qqcb = o;
//
//	console.log(o)
//	$.ajax({
//		type:"post",
//		url:"http://h5.7kuaitang.com/data/data.php",
//		data:{u:"https://graph.qq.com/user/get_user_info?access_token="+$.getUrlParam("access_token")+"&oauth_consumer_key="+o.client_id+"&openid="+o.openid},
//		async:false,
//		dataType:"json",
//		success:function(o){
//			console.log(o)
//			var openId = qqcb.openid;
//			var nickName =o.nickname;
//			window.sessionStorage.setItem("openId", openId);
//			window.sessionStorage.setItem("nickName", nickName);
//
////			setTimeout(function(){
//				QCsaveAuth(openId, nickName);
////			},1000)
//
//			if ($.whichPage("login_page")) {
//				if (window.sessionStorage.getItem("loginFromPage") != null){
//					$.router.load(window.sessionStorage.getItem("loginFromPage"));
//					window.sessionStorage.removeItem("loginFromPage");
//				}else{
//					window.location.href = "personal_page.html";
//				}
//			}
//
//		},
//	});
//}



personal.linkTo = function(){
	$("#p-personal").find(".p-record").find(".record-list").click(function(){
		if (luanmingli.userId) {
			$.showIndicator();
			$.router.load("record.html?type="+$(this).index());
		}else{
			$.showIndicator();
			$.router.load("login.html");
		}
	});
	
	
	$(".j-perInfo").click(function(){
		$.showIndicator();
		$.router.load("perInfo.html");
	});
	
	$(".j-my-prize").click(function(){
		if (luanmingli.userId) {
			$.router.load("prize.html");
		}else{
			$.showIndicator();
			$.router.load("login.html");
		}
	});
	
	$(".j-my-share").click(function(){
		if (luanmingli.userId) {
			$.router.load("myshare.html");
		}else{
			$.showIndicator();
			$.router.load("login.html");
		}
	});
	
	$(".j-bonus").click(function(){
		if (!!luanmingli.userId) {
			$.router.load("bonus.html");
		}else{
			$.showIndicator();
			$.router.load("login.html");
		}
	});
	
	$(".j-setting").click(function(){
		$.showIndicator();
		$.router.load("setting.html");
	});
}


$(function(){
	if (window.sessionStorage.getItem("toCompletePerInfo") == 1) {
		window.sessionStorage.removeItem("toCompletePerInfo");
		$.router.load("perInfo.html");
	}
	
	if (window.sessionStorage.getItem("myshareForceRefresh") == 1) {
		$.router.load("myshare.html");
	}
	
	if (!!window.sessionStorage.getItem("fromActRecharge")) {
		if (!!luanmingli.userId) {
			if (!!luanmingli.userInfo.usertelephone) {
				$.router.load("recharge.html");
			}else{
				$.alert("请先绑定手机号",function(){
					window.sessionStorage.removeItem("fromActRecharge");
					$.router.load("perInfo.html");
				});
			}
		}else{
			$.alert("请先登录",function(){
				window.sessionStorage.removeItem("fromActRecharge");
				$.router.load("login.html");
			});
		}
	}
	
	if (!!window.sessionStorage.getItem("fromActRegister")) {
		if (!luanmingli.userId) {
			$.router.load("login.html");
		}else{
			$.alert('您已经是一元街老主顾啦～我们为您奉上"充值狂欢大礼包"',function(){
				window.sessionStorage.removeItem("fromActRegister");
			});
		}
	}
	
	getOpenId();
	
	
	if (luanmingli.userId){
		getUserInfo();
	}else{
		
	}
	window.sessionStorage.removeItem("pointsNum");
	
	
	if ($(".receipt-popup").length > 0) {
		$.closeModal(".receipt-popup");
	}
	
	
	personal.loginOrNot();
	personal.linkTo();
	
	window.sessionStorage.removeItem("recordTab");
})