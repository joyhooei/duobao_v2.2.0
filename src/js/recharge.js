$(function(){
	try{
		if (!!window.sessionStorage.getItem("fromActRecharge")) {
			window.sessionStorage.removeItem("fromActRecharge");
		}
		
		recharge();
		checkRecharge();
	}catch(e){
		//TODO handle the exception
	}
})



function recharge(){
	var chooseNum = $("#p-recharge").find(".choose-num").find(".button");
	chooseNum.click(function(){
		chooseNum.removeClass("choose-num-color");
		$(this).addClass("choose-num-color");
	})
	
	var choseWay = $("input[type=radio]:checked").attr("class");
	var way;
	if (choseWay == "wx"){
		way = 1;
	}else if(choseWay == "zfb"){
		way = 2;
	}
	
	$("#p-recharge").find(".recharge-button").click(function(){
		var choseNum = $("#p-recharge").find(".choose-num").find(".choose-num-color").html() || $("#p-recharge").find(".choose-num").find(".choose-num-color").val();
		if (!choseNum) {
			$.alert("请选择或输入充值金额");
		}else{
			if (/^[0-9]*$/.test(choseNum)) {
				preRecharge(way,choseNum);
			}else{
				$.alert("请输入正确的金额");
			}
		}
	});
}


function preRecharge(way,num){
	var emptyPage = "http://www.2333db.com/callback/callback_empty.html";
	if (lData.qktId || lData.thirdId || navigator.userAgent.indexOf("QQ") > -1) {
//		emptyPage = window.location.href+"?backId="+lData.orderInfo.treasureId;
		emptyPage = window.location.href;
	}
	
	var callBackUrl = "&goodsDetailUrl="+emptyPage+"&paySuccessUrl="+emptyPage;
	

//	var preChargeUrl = lData.getUrl+"preCharge?v="+lData.version+"&way=" + way + "&userId="+lData.userId + "&points="+num +callBackUrl;


	var preChargeUrl = lData.getUrl+"preCharge?v="+lData.version+"&content="+ encodeURIComponent(encryptByDES(JSON.stringify({
		way: way,
		userId: lData.userId,
		points: num,
		callBackUrl: emptyPage,
		paySuccessUrl: emptyPage
	})))

	console.log(preChargeUrl)
	
	zfbRecharge(preChargeUrl);
}

//请求支付宝
function zfbRecharge(preChargeUrl){
	window.sessionStorage.setItem("pointsNum",lData.userInfo.detailInfo.points);
	checkRecharge();
	
	if ((lData.qktId && !lData.qkt.backUrl) || lData.thirdId || navigator.userAgent.indexOf("QQ") > -1) {
		window.location.href = preChargeUrl;
	}else{
		window.open(preChargeUrl);
	}
}



//检查充值状态
function checkRecharge(){
	if (window.sessionStorage.getItem("pointsNum") != null ) {
		var pointsNum = window.sessionStorage.getItem("pointsNum");
//		alert_tips("是否已完成支付?","未完成","已完成",function(){
		$.confirm('是否已完成支付?', function () {
			$.showIndicator();
			
			setTimeout(function(){
				$.ajax({
					type:"post",
					url:lData.getUrl + "userDetail",
					data:{
						v: lData.srvVersion,
						content: encryptByDES(JSON.stringify({
							userId:window.localStorage.getItem("userId")
						}))
					},
					async:true,
					dataType:"json",
					success : function(o){
						console.log(o)
						if (o.userInfo.detailInfo.points > pointsNum) {
							window.sessionStorage.removeItem("pointsNum");
							$.router.load("recharge-success.html");
						}else{
							window.sessionStorage.removeItem("pointsNum");
							$.router.load("recharge-fail.html");
						}
					}
				});
			},200)

		})
	}
}

