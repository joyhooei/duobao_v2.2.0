$(function(){
	$("#iframe").attr("src",window.location.href.split("?url=")[1] || window.location.href.split("&url=")[1]);
	
	$("#p-iframe .iframe-back").click(function(){
		event.preventDefault();
		if (sessionStorage.getItem("sm.router.maxStateId") <= 1) {
			$.router.load("index.html");
		}else{
			$.router.back();
		}
	});
	
	if (!!/extract/.test(window.location.href)) {
		
	}
})


function actRegisterBtn(url){
	if (!luanmingli.userId) {
		$.router.load(url);
	}else{
		$.alert('您已经是一元街老主顾啦～我们为您奉上"充值狂欢大礼包"',function(){
			window.sessionStorage.removeItem("fromActRegister");
		});
	}
}

function actRechargeBtn(url){
	$.router.load(url);
}

function actRegisterSuccessBtn(url){
	$.router.load("index.html");
}


var carCallBack = function(carId){
	$.alert('创建成功,车牌号:'+carId,function(){
		$.router.back();
	});
}


if (!!$.getUrlParam('name')) {
	if (!!luanmingli.calcTestUrl) {
		$('header .title').html($.getUrlParam('name')+('（测试版）'));
	}else{
		$('header .title').html($.getUrlParam('name'));
	}
}
