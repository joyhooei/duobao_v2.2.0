//qktId=10513279&platform=20&nickname=山羊阿姨&tel=18686842201&userLogo=http://7kuaitang.oss-cn-hangzhou.aliyuncs.com/advert/images/1466592226254970d.jpg&candy=40&qktback=1&backurl=http://h5.7kuaitang.com/test/index.html?u=10513279

$(function(){
	try{
		luanmingli.qkt = {};
		
		qktGetData();
		if (luanmingli.qktId) {
			qktLogin(luanmingli.qkt.nickname||"" , $.getUrlParam("mmMD5")||"");
		}
		
		if ($.whichPage("qkt-register")) {
			qktRegister();
		}else if($.whichPage("p-setting")) {
			if (!window.sessionStorage.getItem("backurl")){
				$("#p-setting").find(".exit").hide();
			}
		}else if($.whichPage("qkt-bind")){
			qktBind();
		}else if($.whichPage("p-pay")){
			qktPay();
		}
		
		qktBackUrl();
		qktRefreshButton();
		
	}catch(e){
		//TODO handle the exception
	}
})


function qktGetData(){
	if ($.getUrlParam("qktId") != null) {
		window.sessionStorage.setItem("qktId",$.getUrlParam("qktId"));
		window.sessionStorage.setItem("qktPlatform",$.getUrlParam("platform"));
		window.sessionStorage.setItem("qktNickname",decodeURIComponent($.getUrlParam("nickname")));
		window.sessionStorage.setItem("qktTel",$.getUrlParam("tel"));
		window.sessionStorage.setItem("qktUserLogo",$.getUrlParam("userLogo"));
		window.sessionStorage.setItem("qktCandy",$.getUrlParam("candy"));
		
		luanmingli.qktId = $.getUrlParam("qktId");
		luanmingli.qkt.platform = $.getUrlParam("platform");
		luanmingli.qkt.nickname = decodeURIComponent($.getUrlParam("nickname"));
		luanmingli.qkt.tel = $.getUrlParam("tel");
		luanmingli.qkt.userLogo = $.getUrlParam("userLogo");
		luanmingli.qkt.candy = $.getUrlParam("candy");
	}else{
		luanmingli.qktId = window.sessionStorage.getItem("qktId");
		luanmingli.qkt.platform = window.sessionStorage.getItem("qktPlatform");
		luanmingli.qkt.nickname = decodeURIComponent(window.sessionStorage.getItem("qktNickname"));
		luanmingli.qkt.tel = window.sessionStorage.getItem("qktTel");
		luanmingli.qkt.userLogo = window.sessionStorage.getItem("qktUserLogo");
		luanmingli.qkt.candy = window.sessionStorage.getItem("qktCandy");
	}
	
}


function qktLogin(nickName,mmMD5){
	if (/^[\w\?%&=\-_\u0000-\u00FF]+$/.test(nickName) == false && /[^\u0000-\u00FF]/.test(nickName) == false){
		$.prompt("请设置夺宝昵称",function(value){
			window.sessionStorage.setItem("pressNickname",value)
			qktLogin(encodeURIComponent(value),mmMD5)
		},function(){
			qktLogin("(",mmMD5)
		});
		return;
	}

	$.ajax({
		type:"post",
		url:luanmingli.getUrl+"registe",
		data:{
//			phoneNum:luanmingli.qkt.tel,
//			password:mmMD5,
//			nickName:nickName,
////			clientData:"qikuaitang&"+luanmingli.version+"&3",
//			channelid: "qikuaitang",
//			appversion: luanmingli.version,
//			clienttype: 3,
//			userLogo:luanmingli.qkt.userLogo,
//			openId:luanmingli.qktId,
//			platform:3,
			v: luanmingli.srvVersion,
			content: encryptByDES(JSON.stringify({
				phoneNum:luanmingli.qkt.tel,
				password:mmMD5,
				nickName:nickName,
	//			clientData:"qikuaitang&"+luanmingli.version+"&3",
				channelid: "qikuaitang",
				appversion: luanmingli.version,
				clienttype: 3,
				userLogo:luanmingli.qkt.userLogo,
				openId:luanmingli.qktId,
				platform:3
			}))
		},
		async:true,
		success:function(o){
			console.log(o);
			if (o.stateCode == 8) {
				var pmtText;
				var pmt = function() {
					pmtText = prompt("请输入昵称");
					if (!pmtText) {
						pmt();
					}
				}
				pmt();
				qktLogin(pmtText);
				return;
			}else if(o.stateCode == 9){		//手机号注册过夺宝
				$.alert("您注册过夺宝，前往绑定帐号",function(){
					$.router.load("qkt-bind.html?tel="+luanmingli.qkt.tel);
				})

			}else if(o.stateCode == 0) {		//注册成功
				luanmingli.userId = o.userInfo.userId;
				luanmingli.userInfo = o.userInfo;
				window.localStorage.setItem("userId", o.userInfo.userId);
				window.localStorage.setItem("userInfo",JSON.stringify(o.userInfo));
				window.localStorage.setItem("userKey",o.userInfo.userKey);
				window.localStorage.setItem("mid",CryptoJS.MD5(o.userInfo.userId).toString());
				
				if ($.whichPage("qkt-register")) {
					var psd = $("#qkt-register").find(".login_psd");
					if (psd.eq(0).val()&&psd.eq(1).val()&&psd.eq(0).val()==psd.eq(1).val()) {
						$.alert("设置成功",function(){
							$.router.back();
						});
					}
				}
			}else if(o.stateCode == 14){		//夺宝新用户,需输入密码
				var param = window.location.href.split("?")[1];
				$.router.load("qkt-register.html?"+param);
			}else if(o.stateCode == 15){
				$.alert(o.message,function(){
					document.write("");
				})
			}else{
				$.alert(o.message);
			}

		}
	});
}


//夺宝新账户
function qktRegister(){
	$(".qkt-tel").html(luanmingli.qkt.tel);
	$(".qkt-nickname").html(decodeURIComponent(window.sessionStorage.getItem("qktNickname")));
	
	if (window.sessionStorage.getItem("pressNickname")!=null ) {
		$(".qkt-nickname").html(window.sessionStorage.getItem("pressNickname"));
	}
	
	var psd = $("#qkt-register").find(".login_psd");

	$("#qkt-register").find(".button").click(function(){
		psd.each(function(i){
			if (!psd.eq(i).val()) {
				psd.eq(i).addClass("ipt-error");
				$("<span class='ipt-error-text'>请设置密码</span>").insertAfter(psd.eq(i));
			}
		})
		if (psd.eq(0).val()&&psd.eq(1).val()&&(psd.eq(0).val() != psd.eq(1).val())) {
			psd.addClass("ipt-error");
			$("<span class='ipt-error-text'>两次密码不一致</span>").insertAfter(psd);
		}

		if (psd.eq(0).val()&&psd.eq(1).val()&&psd.eq(0).val()==psd.eq(1).val()) {
			var tel = $.getUrlParam("tel");
			var mmMd5 = CryptoJS.MD5(psd.eq(1).val()).toString();
			
			qktLogin(luanmingli.qkt.nickname,mmMd5);
		}
	})
	psd.focus(function(){
		psd.removeClass("ipt-error");
		$(".ipt-error-text").remove();
	})
}


//qkt绑定
function qktBind(){
	var tel = $.getUrlParam("tel");
	$(".qkt-bind-tel").html(tel);

	$("#qkt-bind .forget_text").click(function(){
		$.showIndicator();
		$.router.load("forget.html")
	})

	$("#qkt-bind").find(".button-bind").click(function(){
		var pswd = $("#qkt-bind").find(".login_psd").val();
		$.ajax({
			type:"post",
			url:luanmingli.getUrl+"login",
			data:{
//				platform:3,
//				phoneNum:tel,
//				password:CryptoJS.MD5(pswd).toString(),
//				clientData:"qikuaitang&"+luanmingli.version+"&3",
//				openId:luanmingli.qktId,
				v: luanmingli.srvVersion,
				content: encryptByDES(JSON.stringify({
					platform:3,
					phoneNum:tel,
					password:CryptoJS.MD5(pswd).toString(),
//					clientData:"qikuaitang&"+luanmingli.version+"&3",
					channelid: "qikuaitang",
					appversion: luanmingli.version,
					clienttype: 3,
					openId:luanmingli.qktId
				}))
			},
			async:true,
			success:function(o){
				console.log(o)
				if (o.stateCode == 0) {
					luanmingli.userId = o.userInfo.userId;
					luanmingli.userInfo = o.userInfo;
					window.localStorage.setItem("userId", o.userInfo.userId);
					window.localStorage.setItem("userInfo",JSON.stringify(o.userInfo));
					window.localStorage.setItem("userKey",o.userInfo.userKey);
					window.localStorage.setItem("mid",CryptoJS.MD5(o.userInfo.userId).toString());
					
					$.alert("绑定成功",function(){
						$.router.load("personal.html");
					})
				}else{
					$.alert("登录失败");
				}
			}
		});
	})
}




//糖块支付
function qktPay(){
	$("#p-pay").find(".pay-candy-box").show();
//	$(".candy-left").html(window.sessionStorage.getItem("qktCandy"));
	$(".candy-left").html(luanmingli.qkt.candy);
	$(".p-pay-button").click(function(){
		var payNum = $(".z_pay_money_left").html();
		if ($(".p_pay_way").find("input[type=radio]:checked").hasClass("candy") && payNum != 0) {
			way = 20;
			var emptyPage = "http://www.2333db.com/pay.html";
			if (luanmingli.qkt.backUrl) {
				emptyPage = "http://www.2333db.com/callback/callback_empty.html";
			}
			var callbackUrl = "&goodsDetailUrl="+emptyPage+"&paySuccessUrl="+emptyPage;
			
			
			var candyPw;
			$.prompt("请输入7块糖密码", function(value) {
				candyPw = "&password="+CryptoJS.MD5(value);
				//全糖块
				if (luanmingli.orderInfo.cost == payNum) {
					candyPrePayUrl = luanmingli.getUrl+"prePay?v="+luanmingli.srvVersion+"&way="+way+"&orderId="+luanmingli.orderInfo.orderId+"&userId="+luanmingli.userId+"&secret="+luanmingli.orderInfo.secret+candyPw;
				//糖块＋金币
				}else{
					candyPrePayUrl = luanmingli.getUrl+"prePay?v="+luanmingli.srvVersion+"&way="+way+"&orderId="+luanmingli.orderInfo.orderId+"&userId="+luanmingli.userId+"&secret="+luanmingli.orderInfo.secret+"&points="+(luanmingli.orderInfo.cost-payNum) +candyPw;
				}
				
				candyPay(candyPrePayUrl);

			})
			
			window.sessionStorage.setItem("paying",luanmingli.orderInfo.orderId);
		}
	});
}


function candyPay(prePayUrl){
	var candy = window.sessionStorage.getItem("qktCandy");
	var payNum = $(".z_pay_money_left").html();
	if (parseInt(candy) < parseInt(payNum) * 100) {
		$.alert("糖块不足，请重新选择支付方式");
	}else{
		console.log(prePayUrl)
		$.showIndicator();
		$.ajax({
			type:"post",
			url:prePayUrl,
			async:true,
			dataType:"json",
			success:function(o){
				console.log(o);
				setTimeout(function(){
					$.hideIndicator();
					if (o.stateCode == 0) {
						window.sessionStorage.setItem("qktCandy",(window.sessionStorage.getItem("qktCandy")-parseInt(payNum)*100));
						$.router.load("pay-success.html")
					}else{
						$.alert("支付失败，请重试");
//						$.router.load("pay-fail.html")
					}
				},200)
			}
		});
	}
}


//返回网页版
function qktBackUrl(){
	if ($.whichPage("p-receipt") || $.whichPage("p-bindtel")) {
		return;
	}
	
	if ($.getUrlParam("backurl") != null) {
		luanmingli.qkt.backUrl = $.getUrlParam("backurl");
		window.sessionStorage.setItem("backurl" , $.getUrlParam("backurl"));
	}else{
		if (window.sessionStorage.getItem("backurl") != null ) {
			luanmingli.qkt.backUrl = window.sessionStorage.getItem("backurl");
		}
	}
	
	
	if (luanmingli.qkt.backUrl) {
		if ($(".qktback").length == 0){
			$('<a class="icon pull-right qktback" href='+luanmingli.qkt.backUrl+' style="font-size:.6rem;">返回7块糖</a>').appendTo($(".page header"));
		}
	}
}


//app内刷新按钮
function qktRefreshButton(){
	if ($.whichPage("p-receipt") || $.whichPage("p-bindtel")) {
		return;
	}
	
	if ( luanmingli.qktId && !luanmingli.qkt.backUrl) {
		if ($(".qktback").length == 0){
			$('<a class="icon icon-refresh pull-right qktback" onclick="javascript:window.location.reload(true);" style="font-size:.8rem;"></a>').appendTo($(".page header"));
		}
	}
}
