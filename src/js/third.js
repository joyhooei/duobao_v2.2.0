//qktId=10513279&platform=20&nickname=山羊阿姨&tel=18686842201&userLogo=http://7kuaitang.oss-cn-hangzhou.aliyuncs.com/advert/images/1466592226254970d.jpg&candy=40&qktback=1&backurl=http://h5.7kuaitang.com/test/index.html?u=10513279
$(function(){
	try{
		luanmingli.third = {};
		
		thirdGetData();
		
		if (luanmingli.thirdId && !window.sessionStorage.getItem("trirdHaveLogin")) {
			thirdLogin();
		}
		
		if ($.whichPage("p-index")) {
			if (!window.sessionStorage.getItem("forceLinkToDetail")) {
				if (!!luanmingli.calcTestUrl) {
					$.router.load("duobao.html?treasureId=953&type=2");
				}else{
					$.router.load("duobao.html?treasureId=1376&type=2");
				}
			}
		}
		
		
		if($.whichPage("p-pay")){
			if (luanmingli.third.intype == 2 || $.getUrlParam("intype") == 2 || window.sessionStorage.getItem("intype") == 2 ) {
				thirdPay();
			}
		}
		
		thirdRefreshButton();
		
	}catch(e){
		//TODO handle the exception
	}
})


function thirdGetData(){
	if ($.getUrlParam("userId") != null && $.getUrlParam("token") != null ) {
		window.sessionStorage.setItem("thirdId",$.getUrlParam("userId"));
		window.sessionStorage.setItem("thirdToken",$.getUrlParam("token"));
		window.sessionStorage.setItem("thirdIntype",$.getUrlParam("intype"));
		window.sessionStorage.setItem("thirdPlatform",$.getUrlParam("platform"));
		window.sessionStorage.setItem("thirdNickname",decodeURIComponent($.getUrlParam("nickname")));
		window.sessionStorage.setItem("thirdTel",$.getUrlParam("tel"));
		window.sessionStorage.setItem("thirdUserLogo",$.getUrlParam("userLogo"));
		window.sessionStorage.setItem("thirdCurrency",decodeURIComponent($.getUrlParam("currency")));
		
		
		luanmingli.thirdId = $.getUrlParam("userId");
		luanmingli.third.token = $.getUrlParam("token");
		luanmingli.third.intype = $.getUrlParam("intype");
		luanmingli.third.platform = $.getUrlParam("platform");
		luanmingli.third.nickname = decodeURIComponent($.getUrlParam("nickname"));
		luanmingli.third.tel = $.getUrlParam("tel");
		luanmingli.third.userLogo = $.getUrlParam("userLogo");
		luanmingli.third.currency = decodeURIComponent($.getUrlParam("currency"));
	}else{
		luanmingli.thirdId = window.sessionStorage.getItem("thirdId");
		luanmingli.third.token = window.sessionStorage.getItem("thirdToken");
		luanmingli.third.intype = window.sessionStorage.getItem("thirdIntype");
		luanmingli.third.platform = window.sessionStorage.getItem("thirdPlatform");
		luanmingli.third.nickname = decodeURIComponent(window.sessionStorage.getItem("thirdNickname"));
		luanmingli.third.tel = window.sessionStorage.getItem("thirdTel");
		luanmingli.third.userLogo = window.sessionStorage.getItem("thirdUserLogo");
		luanmingli.third.currency = decodeURIComponent(window.sessionStorage.getItem("thirdCurrency"));
	}
	
}


function thirdLogin(){
	$.ajax({
		type:"get",
		url:luanmingli.getUrl+"saveAuthPlat",
		data:{
//			userId:luanmingli.thirdId,
//			token:luanmingli.third.token,
//			platform:luanmingli.third.platform,
//			nickname:luanmingli.third.nickname,
//			tel:luanmingli.third.tel,
//			userLogo:luanmingli.third.userLogo,
			v: luanmingli.srvVersion,
			content: encryptByDES(JSON.stringify({
				userId:luanmingli.thirdId,
				token:luanmingli.third.token,
				platform:luanmingli.third.platform,
				nickname:luanmingli.third.nickname,
				tel:luanmingli.third.tel,
				userLogo:luanmingli.third.userLogo

//				userId:224058,
//				token:8321476772905556,
//				platform:20,
//				nickname:1,
//				userLogo:"1"
			}))
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			if (o.stateCode == 0) {
				luanmingli.channel = o.userInfo.channelid;
				luanmingli.userId = o.userInfo.userId;
				luanmingli.userInfo = o.userInfo;
				window.localStorage.setItem("userId", o.userInfo.userId);
				window.localStorage.setItem("userInfo",JSON.stringify(o.userInfo));
				window.localStorage.setItem("userKey",o.userInfo.userKey);
				window.localStorage.setItem("mid",CryptoJS.MD5(o.userInfo.userId).toString());
				window.sessionStorage.setItem("trirdHaveLogin" , 1);
				window.sessionStorage.setItem("channel",o.userInfo.channelid);
			}else{
				$.alert(o.message);
			}
		}
	});
}

var thirdPayWayName = "积分"
//第三方渠道支付
function thirdPay(){
	var bonusId = function(){
		var hongbaoId = $(".p-bonus-ipt").attr("name");
		if (!!hongbaoId) {
			return hongbaoId;
		}else{
			return "0";
		}
	}
	
	$("#p-pay").find(".pay-third-box").show();
	
	if (luanmingli.third.currency != null && luanmingli.third.currency != "null" && luanmingli.third.currency) {
		$("#p-pay").find(".pay-third-box").find(".a-pay-third-way").html(luanmingli.third.currency+"支付");
		thirdPayWayName = luanmingli.third.currency;
	}
	
	
	$(".p-pay-button").click(function(){
		var payNum = $(".z_pay_money_left").html();
		if ($(".p_pay_way").find("input[type=radio]:checked").hasClass("third") && payNum != 0) {
			way = 21;
			var emptyPage = "http://www.2333db.com/pay.html";
			var callbackUrl = "&goodsDetailUrl="+emptyPage+"&paySuccessUrl="+emptyPage;
			
			var thirdPw;
//			$.prompt("请输入密码", function(value) {
//				thirdPw = "&password="+CryptoJS.MD5(value);

			if (luanmingli.third.currency != null && luanmingli.third.currency != "null" && luanmingli.third.currency) {
				$("#p-pay").find(".pay-third-box").find(".a-pay-third-way").html(luanmingli.third.currency+"支付");
				thirdPayWayName = luanmingli.third.currency;
			}



			$.confirm("是否确认使用"+thirdPayWayName+"支付？",function(){
				thirdPw = "";
				//全积分
				if (luanmingli.orderInfo.cost == payNum) {
//					candyPrePayUrl = luanmingli.getUrl+"prePay?v="+luanmingli.srvVersion+"&way="+way+"&orderId="+luanmingli.orderInfo.orderId+"&userId="+luanmingli.userId+"&secret="+luanmingli.orderInfo.secret+thirdPw;
					candyPrePayUrl = luanmingli.getUrl+"prePay?v="+luanmingli.srvVersion+"&content="+encodeURIComponent(encryptByDES(JSON.stringify({
						way: way,
						orderId: luanmingli.orderInfo.orderId,
						userId: luanmingli.userId,
						secret: luanmingli.orderInfo.secret,
						points: 0,
						hongbaoId: bonusId()
					})))
				//积分＋金币
				}else{
//					candyPrePayUrl = luanmingli.getUrl+"prePay?v="+luanmingli.srvVersion+"&way="+way+"&orderId="+luanmingli.orderInfo.orderId+"&userId="+luanmingli.userId+"&secret="+luanmingli.orderInfo.secret+"&points="+(luanmingli.orderInfo.cost-payNum) +thirdPw;
					candyPrePayUrl = luanmingli.getUrl+"prePay?v="+luanmingli.srvVersion+"&content="+encodeURIComponent(encryptByDES(JSON.stringify({
						way: way,
//						orderId: luanmingli.orderInfo.orderId,
//						userId: luanmingli.userId,
//						secret: luanmingli.orderInfo.secret,
//						points: (luanmingli.orderInfo.cost-payNum)
						way: way,
						orderId: luanmingli.orderInfo.orderId,
						userId: luanmingli.userId,
						secret: luanmingli.orderInfo.secret,
						points: $(".z_pay_gold").html(),
						hongbaoId: bonusId()
					})))
				}
				
				integralPay(candyPrePayUrl);
			})

//			})
			
			window.sessionStorage.setItem("paying",luanmingli.orderInfo.orderId);
		}
	});
}


function integralPay(prePayUrl){
	var payNum = $(".z_pay_money_left").html();
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
					$.router.load("pay-success.html")
				}else{
					if (thirdPayWayName != "积分" && /积分/.test(o.message)) {
						$.alert(o.message.replace(/积分/,thirdPayWayName+"余额"));
					}else{
						$.alert(o.message);
					}
				}
			},200)
		},
		error: function(){
			$.alert("请求服务器超时，请重试");
		}
	});
}




//app内刷新按钮
function thirdRefreshButton(){
	if ($.whichPage("p-receipt") || $.whichPage("p-bindtel") || $.whichPage("p-bonus")) {
		return;
	}
	
	if ( luanmingli.thirdId && !luanmingli.third.backUrl) {
		if ($(".qktback").length == 0){
			$('<a class="icon icon-refresh pull-right qktback" onclick="javascript:window.location.reload(true);" style="font-size:.8rem;"></a>').appendTo($(".page header"));
		}
	}
}

