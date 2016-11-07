var FZ = function(a, b) {
	function getFZ() {
		var width = document.documentElement.clientWidth || document.body.clientWidth;
		var fontSize = (a / b) * width;
		return fontSize;
	};
	document.documentElement.style.fontSize = getFZ() + "px";
	window.onresize = function() {
		setTimeout(function() {
			document.documentElement.style.fontSize = getFZ() + "px";
		}, 100);
	};
};

FZ(20, 360);

$.ajax({
	type:"post",
	url:"http://api.2333db.com/raiders/restWeb/getHongbaoList",		//正式网
//	url:"http://www.7kuaitang.com:8081/raiders/restWeb/getHongbaoList",		//测试网
	data: {
		v: "2.1.0",
		hongbaoType: 101
	},
	dataType:"json",
	async:true,
	success: function(o){
		console.log(o)
		
		if (o.stateCode == 0) {
			$.each(o.hongbaoList, function(i,n) {
				$("#j-bonus-box").append(
					'<li class="clearfix">'+
						'<div class="text1">¥  <span>'+n.discount+'</span></div>'+
						'<div class="text2">'+n.discription+'</div>'+
					'</li>'
				);
			});
		}else{
			alert(o.message);
		}
	}
});


var getUrlParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURIComponent(r[2]);
	return null;
};

$("#rechargeBtn").on("click",function(){
	if (!!getUrlParam("backurl")) {
		window.parent.actRechargeBtn(getUrlParam("backurl"));
		window.sessionStorage.setItem("fromActRecharge",1);
	}else{
		var ua = navigator.userAgent.toLowerCase();
		if (/iphone/.test(ua)) {
			window.location.href = "hongbaorecharge://";
		}else if (/android/.test(ua)){
			callRegister.callRechargeActivity();
		}else{
			window.location.href = "http://www.2333db.com/share/download.html";
		}
	}
});
