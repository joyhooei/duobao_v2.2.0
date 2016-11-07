//qktId=10513279&platform=20&nickname=山羊阿姨&tel=18686842201&userLogo=http://7kuaitang.oss-cn-hangzhou.aliyuncs.com/advert/images/1466592226254970d.jpg&candy=40&qktback=1&backurl=http://h5.7kuaitang.com/test/index.html?u=10513279
$(function(){
	try{
		lData.third = {};
		
		thirdGetData();
		
		if (lData.thirdId && !window.sessionStorage.getItem("trirdHaveLogin")) {
			thirdLogin();
		}
		
		if ($.whichPage("p-index")) {
			if (!window.sessionStorage.getItem("forceLinkToDetail")) {
				if (!!lData.calcTestUrl) {
					$.router.load("duobao.html?treasureId=953&type=2");
				}else{
					$.router.load("duobao.html?treasureId=1376&type=2");
				}
			}
		}
		
		
		if($.whichPage("p-pay")){
			if (lData.third.intype == 2 || $.getUrlParam("intype") == 2 || window.sessionStorage.getItem("intype") == 2 ) {
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
		
		
		lData.thirdId = $.getUrlParam("userId");
		lData.third.token = $.getUrlParam("token");
		lData.third.intype = $.getUrlParam("intype");
		lData.third.platform = $.getUrlParam("platform");
		lData.third.nickname = decodeURIComponent($.getUrlParam("nickname"));
		lData.third.tel = $.getUrlParam("tel");
		lData.third.userLogo = $.getUrlParam("userLogo");
		lData.third.currency = decodeURIComponent($.getUrlParam("currency"));
	}else{
		lData.thirdId = window.sessionStorage.getItem("thirdId");
		lData.third.token = window.sessionStorage.getItem("thirdToken");
		lData.third.intype = window.sessionStorage.getItem("thirdIntype");
		lData.third.platform = window.sessionStorage.getItem("thirdPlatform");
		lData.third.nickname = decodeURIComponent(window.sessionStorage.getItem("thirdNickname"));
		lData.third.tel = window.sessionStorage.getItem("thirdTel");
		lData.third.userLogo = window.sessionStorage.getItem("thirdUserLogo");
		lData.third.currency = decodeURIComponent(window.sessionStorage.getItem("thirdCurrency"));
	}
	
}


function thirdLogin(){
	$.ajax({
		type:"get",
		url:lData.getUrl+"saveAuthPlat",
		data:{
//			userId:lData.thirdId,
//			token:lData.third.token,
//			platform:lData.third.platform,
//			nickname:lData.third.nickname,
//			tel:lData.third.tel,
//			userLogo:lData.third.userLogo,
			v: lData.srvVersion,
			content: encryptByDES(JSON.stringify({
				userId:lData.thirdId,
				token:lData.third.token,
				platform:lData.third.platform,
				nickname:lData.third.nickname,
				tel:lData.third.tel,
				userLogo:lData.third.userLogo

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
				lData.channel = o.userInfo.channelid;
				lData.userId = o.userInfo.userId;
				lData.userInfo = o.userInfo;
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
	
	if (lData.third.currency != null && lData.third.currency != "null" && lData.third.currency) {
		$("#p-pay").find(".pay-third-box").find(".a-pay-third-way").html(lData.third.currency+"支付");
		thirdPayWayName = lData.third.currency;
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

			if (lData.third.currency != null && lData.third.currency != "null" && lData.third.currency) {
				$("#p-pay").find(".pay-third-box").find(".a-pay-third-way").html(lData.third.currency+"支付");
				thirdPayWayName = lData.third.currency;
			}



			$.confirm("是否确认使用"+thirdPayWayName+"支付？",function(){
				thirdPw = "";
				//全积分
				if (lData.orderInfo.cost == payNum) {
//					candyPrePayUrl = lData.getUrl+"prePay?v="+lData.srvVersion+"&way="+way+"&orderId="+lData.orderInfo.orderId+"&userId="+lData.userId+"&secret="+lData.orderInfo.secret+thirdPw;
					candyPrePayUrl = lData.getUrl+"prePay?v="+lData.srvVersion+"&content="+encodeURIComponent(encryptByDES(JSON.stringify({
						way: way,
						orderId: lData.orderInfo.orderId,
						userId: lData.userId,
						secret: lData.orderInfo.secret,
						points: 0,
						hongbaoId: bonusId()
					})))
				//积分＋金币
				}else{
//					candyPrePayUrl = lData.getUrl+"prePay?v="+lData.srvVersion+"&way="+way+"&orderId="+lData.orderInfo.orderId+"&userId="+lData.userId+"&secret="+lData.orderInfo.secret+"&points="+(lData.orderInfo.cost-payNum) +thirdPw;
					candyPrePayUrl = lData.getUrl+"prePay?v="+lData.srvVersion+"&content="+encodeURIComponent(encryptByDES(JSON.stringify({
						way: way,
//						orderId: lData.orderInfo.orderId,
//						userId: lData.userId,
//						secret: lData.orderInfo.secret,
//						points: (lData.orderInfo.cost-payNum)
						way: way,
						orderId: lData.orderInfo.orderId,
						userId: lData.userId,
						secret: lData.orderInfo.secret,
						points: $(".z_pay_gold").html(),
						hongbaoId: bonusId()
					})))
				}
				
				integralPay(candyPrePayUrl);
			})

//			})
			
			window.sessionStorage.setItem("paying",lData.orderInfo.orderId);
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
	
	if ( lData.thirdId && !lData.third.backUrl) {
		if ($(".qktback").length == 0){
			$('<a class="icon icon-refresh pull-right qktback" onclick="javascript:window.location.reload(true);" style="font-size:.8rem;"></a>').appendTo($(".page header"));
		}
	}
}
