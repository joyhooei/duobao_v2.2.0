$(function(){
	try{
		luanmingli.orderInfo = $.parseJSON(window.sessionStorage.getItem("orderInfo"));
		if (!!window.sessionStorage.getItem("canUseBonus")) {
			luanmingli.canUseBonus = $.parseJSON(window.sessionStorage.getItem("canUseBonus"));
		}else{
			luanmingli.canUseBonus = false;
		}
		
		if (navigator.userAgent.indexOf('UCBrowser') > -1 || !supportCss3('justify-content')) {
			$(".p_money_num").addClass("UC-pay");
			$(".p_pay_way").addClass("UC-pay");
		}
		
		payFillData();
		payBackButton();
		if (window.sessionStorage.getItem("paying") != null) {
			$.confirm('是否支付完成?', function() {
				checkPay();
			});
		}
	}catch(e){
		//TODO handle the exception
	}
})


function payBackButton(){
	$("#p-pay").find(".pay-back").click(function(){
		$.confirm('是否确定取消订单?', function() {
			deleteOrder();
		});
	});
}


function deleteOrder(){
	$.ajax({
		type:"post",
		url:luanmingli.getUrl+"deleteOrder",
		data:{
			_method : "delete",
//			orderId : luanmingli.orderInfo.orderId,
			v: luanmingli.srvVersion,
			content: encryptByDES(JSON.stringify({
				orderId : luanmingli.orderInfo.orderId
			}))
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.stateCode == 0) {
					$.router.back();
			}else{
				$.alert(o.message,function(){
					$.router.back();
				});
			}
		}
	});
}


function payFillData(){
	
	if (!!luanmingli.canUseBonus) {
		if (!!luanmingli.bonusUseCheckboxOld) {
			$(".bonus-right-box").html(luanmingli.bonusUseCheckboxOld);
		}
		
		$(".p-bonus-ipt").prop("checked",true);
		$(".p-bonus-ipt").attr("name",luanmingli.canUseBonus.userHongbaoId);
		$(".z_pay_bonus").html(luanmingli.canUseBonus.disCount);
		var bonusUsedNum = luanmingli.canUseBonus.disCount;
		
	}else{
		bonusUsedNum = 0;
		luanmingli.bonusUseCheckboxOld = $(".bonus-right-box").html();
		$(".bonus-right-box").html("暂无可用红包");
	}
	
	
	
	var cost = luanmingli.orderInfo.cost - bonusUsedNum;
	var havePoint = luanmingli.userInfo.detailInfo.points;
	
	var goldUsed = havePoint >= cost? cost : havePoint;
	
	if (havePoint == 0) {
		$(".p-gold-ipt").attr("disabled","disabled");
		$(".p-gold-ipt-icon").addClass("cannotCheckBG");
	}else{
		$(".p-gold-ipt").prop("checked",true);
	}
	
	$(".z_pay_money").html(luanmingli.orderInfo.cost);
	if (goldUsed < 0) {
		goldUsed = 0;
	}
	$(".z_pay_gold").html(goldUsed);
	var moneyLEFT = cost-goldUsed;
	if (moneyLEFT < 0 ) {
		moneyLEFT = 0;
	}
	$(".z_pay_money_left").html(moneyLEFT);
	
	if (cost-goldUsed == 0) {
		$(".p_checkbox").find(".icon-form-checkbox").addClass("cannotCheckBG");
		$(".p_checkbox").find(".item-inner").addClass("cannotCheckC");
		$(".p_checkbox").find("input").attr("disabled","disabled");
	}else{
		$(".p_checkbox").find(".icon-form-checkbox").removeClass("cannotCheckBG");
		$(".p_checkbox").find(".item-inner").removeClass("cannotCheckC");
		$(".p_checkbox").find("input").removeAttr("disabled","disabled");
	}
	
	var leftPayNum = cost-goldUsed;
	$(".p-gold-ipt-icon").click(function(){
		var cost = luanmingli.orderInfo.cost - bonusUsedNum;
		var havePoint = luanmingli.userInfo.detailInfo.points;
		
		var goldUsed = havePoint >= cost? cost : havePoint;
		
		
		if (havePoint == 0) {return;}
		
		var goldUsedNum;
		if ($(".p-gold-ipt").is(":checked")) {
			$(".p-gold-ipt").prop("checked",false);
			$(".p_checkbox").find(".icon-form-checkbox").removeClass("cannotCheckBG");
			$(".p_checkbox").find(".item-inner").removeClass("cannotCheckC");
			$(".p_checkbox").find("input").removeAttr("disabled");
			goldUsedNum = 0;
			leftPayNum = cost;
		}else{
			$(".p-gold-ipt").prop("checked",true);
				
			goldUsedNum = goldUsed;
			leftPayNum = cost - goldUsed;
			
			if (leftPayNum == 0) {
				$(".p_checkbox").find(".icon-form-checkbox").addClass("cannotCheckBG");
				$(".p_checkbox").find(".item-inner").addClass("cannotCheckC");
				$(".p_checkbox").find("input").attr("disabled","disabled");
			}
		}
		if (goldUsedNum < 0) {
			goldUsedNum = 0;
		}
		$(".z_pay_gold").html(goldUsedNum);
		if (leftPayNum < 0) {
			leftPayNum = 0;
		}
		$(".z_pay_money_left").html(leftPayNum);
		return false;
	});
	
	
	$(".p-pay-button").click(function(){
		if (!!luanmingli.canUseBonus && $(".p-bonus-ipt").is(":checked")) {
			bonusMoneyNum = luanmingli.canUseBonus.disCount;
			prePay(leftPayNum,bonusMoneyNum);
		}else{
			prePay(leftPayNum,0);
		}
	});
}

	


//预支付
function prePay(payNum,bonusMoneyNum){
	var way;
	var bonusId = function(){
		var hongbaoId = $(".p-bonus-ipt").attr("name");
		if (!!hongbaoId) {
			return hongbaoId;
		}else{
			return "0";
		}
	}
	//全金币
	if (payNum == 0) {
		way = 10;
		var pointUse = luanmingli.orderInfo.cost-bonusMoneyNum;
		if (pointUse< 0) {
			pointUse = 0;
		}
		$.ajax({
			type:"post",
			url:luanmingli.getUrl+"prePay",
			data:{
				v: luanmingli.srvVersion,
				content: encryptByDES(JSON.stringify({
					way : way,
					orderId : luanmingli.orderInfo.orderId,
					userId : luanmingli.userId,
					secret: luanmingli.orderInfo.secret,
					points: pointUse,
					channelId: luanmingli.channel,
					hongbaoId: bonusId()
				}))
			},
			async:true,
			dataType:"json",
			success:function(o){
				console.log(o);
				window.sessionStorage.setItem("paying",luanmingli.orderInfo.orderId);
				if (o.stateCode == 0) {
					checkPay();
				}else{
					$.alert(o.message);
				}
			}
		});
	}else{
	//其他支付方式
		if ($(".p_pay_way").find("input[type=radio]:checked").attr("class") == "zfb") {
			way = 2;
			var emptyPage = "http://www.2333db.com/callback/callback_empty.html";
			if (luanmingli.qktId || luanmingli.thirdId || navigator.userAgent.indexOf("QQ") > -1) {
				emptyPage = window.location.href+"?backId="+luanmingli.orderInfo.treasureId;
			}
			var callbackUrl = "&goodsDetailUrl="+emptyPage+"&paySuccessUrl="+emptyPage;
			//全支付宝
			if (luanmingli.orderInfo.cost == parseInt(payNum) + parseInt(bonusMoneyNum)) {
//				var zfbPrePayUrl = luanmingli.getUrl+"prePay?v="+luanmingli.srvVersion+"&way="+way+"&orderId="+luanmingli.orderInfo.orderId+"&userId="+luanmingli.userId  +callbackUrl;
				var zfbPrePayUrl = luanmingli.getUrl+"prePay?v="+luanmingli.srvVersion+"&content="+ encodeURIComponent(encryptByDES(JSON.stringify({
					way: way,
					orderId: luanmingli.orderInfo.orderId,
					userId: luanmingli.userId,
					secret: luanmingli.orderInfo.secret,
					points: 0,
					goodsDetailUrl: emptyPage,
					paySuccessUrl: emptyPage,
					hongbaoId: bonusId()
				})));
				if ((luanmingli.qktId && !luanmingli.qkt.backUrl) || luanmingli.thirdId || navigator.userAgent.indexOf("QQ") > -1) {
					window.location.href = zfbPrePayUrl;
				}else{
					window.open(zfbPrePayUrl);
				}
			//支付宝＋金币
			}else{
//				var zfbPointPrePayUrl = luanmingli.getUrl+"prePay?v="+luanmingli.srvVersion+"&way="+way+"&orderId="+luanmingli.orderInfo.orderId+"&userId="+luanmingli.userId+"&points="+payNum +callbackUrl;
				var zfbPointPrePayUrl = luanmingli.getUrl+"prePay?v="+luanmingli.srvVersion+"&content="+encodeURIComponent(encryptByDES(JSON.stringify({
					way: way,
					orderId: luanmingli.orderInfo.orderId,
					userId: luanmingli.userId,
					secret: luanmingli.orderInfo.secret,
					points: payNum,
					goodsDetailUrl: emptyPage,
					paySuccessUrl: emptyPage,
					hongbaoId: bonusId()
				})));
				if ((luanmingli.qktId && !luanmingli.qkt.backUrl) || luanmingli.thirdId || navigator.userAgent.indexOf("QQ") > -1) {
					window.location.href = zfbPointPrePayUrl;
				}else{
					window.open(zfbPointPrePayUrl);
				}
			}
			
			window.sessionStorage.setItem("paying",luanmingli.orderInfo.orderId);
			$.confirm('是否支付完成?', function() {
				checkPay();
			});
		}
	}
}


//检查支付状态
function checkPay(){
	var orderId = luanmingli.orderInfo.orderId;
	var secret = luanmingli.orderInfo.secret;
	$.ajax({
		type:"post",
		url:luanmingli.getUrl+"postPayInfo",
		data:{
//			orderId : orderId,
//			secret : secret,
			v: luanmingli.srvVersion,
			content: encryptByDES(JSON.stringify({
				orderId : orderId,
				secret : secret,
			}))
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			window.sessionStorage.removeItem("orderInfo");
			if (o && o.stateCode == 0){
				$.router.load("pay-success.html");
			}else{
				$.router.load("pay-fail.html");
			}
		}
	});
	
}
