$(function(){
	
	$("#iframe").attr("src",$.getUrlParam("url"));
})


function actRegisterBtn(url){
	if (!lData.userId) {
		$.router.load(url);
	}else{
		$.alert('您已经是黄金夺宝老主顾啦～我们为您奉上"充值狂欢大礼包"',function(){
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
