$(function(){
	try{
		register2();
	}catch(e){
		//TODO handle the exception
	}
})


function register2(){
	var psd = $("#p-register2").find(".login_psd");
	var nick = $("#p-register2").find(".nickname");
	$("#p-register2").find(".button").click(function(){
		psd.each(function(i){
			if (!psd.eq(i).val()) {
				psd.eq(i).addClass("ipt-error");
				$("<span class='ipt-error-text'>请设置密码</span>").insertAfter(psd.eq(i));
			}
		})
		if (!nick.val()) {
			nick.addClass("ipt-error");
			$("<span class='ipt-error-text'>请设置昵称</span>").insertAfter(nick);
		}
		if (psd.eq(0).val()&&psd.eq(1).val()&&(psd.eq(0).val() != psd.eq(1).val())) {
			psd.addClass("ipt-error");
			$("<span class='ipt-error-text'>两次密码不一致</span>").insertAfter(psd);
		}

		if (nick.val()&&psd.eq(0).val()&&psd.eq(1).val()&&psd.eq(0).val()==psd.eq(1).val()) {
			var tel = $.getUrlParam("tel");
			var mmMd5 = CryptoJS.MD5(psd.eq(1).val()).toString();
			$.ajax({
				type:"post",
				url:luanmingli.getUrl+"register",
				data:{
					v: luanmingli.srvVersion,
					content: encryptByDES(JSON.stringify({
						phoneNum : tel,
						password : mmMd5,
						nickName : nick.val(),
						channelid: luanmingli.channel,
						appversion: luanmingli.version,
						clienttype: 3
					})),
				},
				dataType: "json",
				async:true,
				success:function(o){
					console.log(o);
					
					window.sessionStorage.removeItem("yzm");
					if (o.stateCode == 0) {
						
						$.alert("注册成功",function(){
							$.showIndicator();
//							window.sessionStorage.setItem("toActRegister",tel);
//							window.history.go(-2);

							luanmingli.userId = o.userInfo.userId;
							luanmingli.userInfo = o.userInfo;
							window.localStorage.setItem("userId", o.userInfo.userId);
							window.localStorage.setItem("userInfo",JSON.stringify(o.userInfo));
							window.localStorage.setItem("userKey",o.userInfo.userKey);
							window.localStorage.setItem("mid",CryptoJS.MD5(o.userInfo.userId).toString());
							window.localStorage.setItem("loginSrv",luanmingli.getUrl);
							
							$.router.load("personal.html");
						})
					}else if(o.stateCode == 9) {
						$.alert("账户已存在，请直接登录",function(){
							$.showIndicator();
							window.history.go(-2);
						});
					}else{
						$.alert(o.message);
					}
				}
			});
		}
	})
	psd.focus(function(){
		psd.removeClass("ipt-error");
		$(".ipt-error-text").remove();
	})
	nick.focus(function(){
		nick.removeClass("ipt-error");
		$(".ipt-error-text").remove();
	})
}
