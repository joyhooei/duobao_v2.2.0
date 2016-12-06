$(function(){
	if (window.sessionStorage.getItem("paying") == null) {
//		$.router.load("index.html");
		window.sessionStorage.removeItem("paying");
	}
	window.sessionStorage.removeItem("paying");
	window.sessionStorage.removeItem("orderInfo");
	$("#p-pay-success").find(".p-backhome").click(function(){
		$.router.load("index.html");
	});
	
	
	
	window.sessionStorage.setItem("chestForceRefresh",1);
	window.sessionStorage.setItem("indexForceRefresh",[0,1,2]);
	window.sessionStorage.setItem("recordForceRefresh","0&1&2");
	
	
	if ($(".g-pays-overlay").length > 0) {
		$(".g-pays-overlay").remove();
	}
	
	if (window.sessionStorage.getItem("payGoodsType") == 2) {
		return;
	}
	
	checkAddress();
})


function checkAddress(){
	$.ajax({
		type:"post",
		url:luanmingli.getUrl+"addressManager",
		data:{
//			userId : luanmingli.userId,
//			way : 1,
			v: luanmingli.srvVersion,
			content: encryptByDES(JSON.stringify({
				userId : luanmingli.userId,
				way : 1
			}))
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.addlist.length == 0) {
				$("#p-pay-success").find(".content").append(
					'<div class="g-pays-overlay">'+
						'<div class="g-pays-wrap">'+
							'<img src="img/pay-success-phone.png"/>'+
							'<div class="text">您已支付成功，请完善您的个人信息以便您中奖后我们为您邮寄产品</div>'+
							'<div onclick="toCompletePerInfo();" class="button">完善个人信息</div>'+
						'</div>'+
					'</div>'
				);
			}
		}
	});
}

function toCompletePerInfo(){
	event.stopPropagation();
	window.sessionStorage.setItem("toCompletePerInfo",1);
	$.router.load("personal.html");
}

