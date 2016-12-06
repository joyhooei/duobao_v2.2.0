$(function() {
	try {
		if (window.sessionStorage.getItem("toActRegister")) {
			var toActRegisterTel = window.sessionStorage.getItem("toActRegister");
			window.sessionStorage.removeItem("toActRegister");
			if (/127.0.0.1/.test(window.location.href)) {
				$.router.load("iframe.html?url=http://127.0.0.1:8020/duobao_v2.1.0/other/src/act-register.html?telephone="+toActRegisterTel+"&backurl=http://127.0.0.1:8020/duobao_v2.1.0/src/personal.html");
			}else{
				$.router.load("iframe.html?url=http://www.2333db.com/activity/act-register.html?telephone="+toActRegisterTel+"&backurl="+luanmingli.bannerBackUrl);
			}
		}else{
			qqLogin();
		}
		
		if (!!window.sessionStorage.getItem("fromActRegister")) {
			$.router.load("register.html");
		}else{
			qqLogin();
		}
		
		telLogin();
		
		loginLinkTo();
	} catch (e) {
		//TODO handle the exception
	}
})

function telLogin() {
	var user = $("#p-login").find(".login_user");
	var psd = $("#p-login").find(".login_psd");

	if (window.sessionStorage.getItem("yzmtel") != null) {
		user.val(window.sessionStorage.getItem("yzmtel"));
	}

	user.focus(function() {
		user.removeClass("ipt-error");
		$(".ipt-error-text").remove();
	})
	psd.focus(function() {
		psd.removeClass("ipt-error");
		$(".ipt-error-text").remove();
	})

	if ($.getUrlParam("tel") != null) {
		user.val($.getUrlParam("tel"))
	}

	$(".j-login-button").click(function() {
		var telReg = /^(0|86|17951)?1\d{10}$/.test(user.val());
		if (!telReg) {
			if (user.hasClass("ipt-error")) {
				return;
			}
			user.addClass("ipt-error");
			$("<span class='ipt-error-text'>请输入正确的手机号</span>").insertAfter(user);
		}
		if (!psd.val()) {
			psd.addClass("ipt-error");
			$("<span class='ipt-error-text'>请输入密码</span>").insertAfter(psd);
		}

		if (telReg && psd.val()) {
			$.showIndicator();
			
			var telNum = user.val();
			var psdNum = CryptoJS.MD5(psd.val()).toString();

			$.ajax({
				type: "post",
				url: luanmingli.getUrl + "login",
				data: {
//					v: "2.0.0",
//					platform: 3,
//					phoneNum: telNum,
//					password: psdNum,
//					clientData: luanmingli.channel+"&" + luanmingli.version + "&3",
					v: luanmingli.srvVersion,
					content: encryptByDES(JSON.stringify({
						platform: 3,
						phoneNum: telNum,
						password: psdNum,
//						clientData: luanmingli.channel+"&" + luanmingli.version + "&3",
						channelid: luanmingli.channel,
						appversion: luanmingli.version,
						clienttype: 3,
						deviceId: 1
					}))
				},
				async: true,
				dataType: "json",
				success: function(o) {
					$.hideIndicator();
					console.log(o);
					if (o.stateCode == 0) {
						luanmingli.userId = o.userInfo.userId;
						luanmingli.userInfo = o.userInfo;
						window.localStorage.setItem("userId", o.userInfo.userId);
						window.localStorage.setItem("userInfo",JSON.stringify(o.userInfo));
						window.localStorage.setItem("userKey",o.userInfo.userKey);
						window.localStorage.setItem("mid",CryptoJS.MD5(o.userInfo.userId).toString());
						window.localStorage.setItem("loginSrv",luanmingli.getUrl);
						
						$.alert("登录成功", function() {
							$.showIndicator();
//							$.router.back();
//							$.router.back();
							window.history.go(-2)
						})
					} else if (o.stateCode == 3) {
						$.alert("账户不存在，请重试");
					} else if (o.stateCode == 10) {
						$.alert("密码错误，请重试");
					} else {
						$.alert(o.message);
					}
				}
			});
		}
	});

}


function qqLogin() {
	if ($.getUrlParam("r") != 1) {
		window.location.href = window.location.href+'?r=1'
	}
	
	QC.Login({
		btnId: "qqLoginBtn" //插入按钮的节点id
	});
	$("#qqLoginBtn img").attr("src", "img/qqlogin.png");
	$("#qqLoginBtn img").click(function() {
		var reUrl = luanmingli.qqLoginReUrl;
		if (/127.0.0.1/.test(window.location.href)) {
			reUrl = "www.2333db.com/callback/test-qc_back.v210.html";
		}
		
		window.location.href = 'https://graph.qq.com/oauth2.0/authorize?client_id=101285621&response_type=token&scope=get_user_info&redirect_uri=http%3A%2F%2F' + reUrl + '&display=mobile', 'oauth2Login_10517', 'height=525,width=585, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes'
		return false;
	});
	
}

function loginLinkTo(){
	$(".login-back").click(function(){
		$.router.back();
		$.router.back();
	});
	
	$("#p-login .linkto").click(function(){
		$.showIndicator();
		$.router.load("register.html")
	})
	
	$("#p-login .forget_text").click(function(){
		$.showIndicator();
		$.router.load("forget.html")
	})
}
