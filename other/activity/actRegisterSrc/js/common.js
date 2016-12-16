
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

var _vds = _vds || [];
(function(){
	_vds.push(['setAccountId', 'bdd0f83d74ae607c']);

	(function() {
		var vds = document.createElement('script');
		vds.type='text/javascript';
		vds.async = true;
		vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(vds, s);
	})();
})();

var getUrlParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURIComponent(r[2]);
	return null;
};

//var getUrl = "http://www.7kuaitang.com:8081/raiders/restWeb/getHongbaoList";
var getUrl = "http://api.2333db.com/raiders/restWeb/getHongbaoList";	//正式网


	$.ajax({
		type:"post",
		url:getUrl,		//测试网
		data: {
			v: "2.1.0",
			hongbaoType: 100
		},
		dataType:"json",
		async:true,
		success: function(o){
			console.log(o)
			
			if (o.stateCode == 0) {
				if (!!getUrlParam("telephone")) {
					$("#registerBtn").hide();
					
					$.each(o.hongbaoList, function(i,n) {
						$("#j-bonus-box").append(
							'<div class="card bonus-card">'+ 
								'<div class="card-content clearfix">'+
									'<div class="card-money pull-left">'+
										'<p class="text1">¥<span class="a-bonus-money">'+n.discount+'</span></p>'+
										'<p class="text2">满'+n.usePoint+'元使用</p>'+
									'</div>'+
									'<div class="card-time pull-left">'+
										'<div class="card-time-left">'+
											'<p class="text1">'+n.hongbaoName+'</p>'+
											'<p class="text2">'+n.validDay+'天后过期</p>'+
										'</div>'+
										'<div class="card-time-right">可使用</div>'+
									'</div>'+
								'</div>'+
							'</div>'
						);
					});
					
					$(".m-title").addClass("m-title2");
					
					$(".g-header").css("margin-bottom",".75rem");
					
					$(".g-column-1").prepend(
						'<div class="u-button u-button2" id="registerSuccessBtn">立即使用</div>'+
						'<p class="m-bonus-success-text">红包已放入帐号：'+getUrlParam("telephone")+'</p>'
					);
					
					$("#registerSuccessBtn").click(function(){
						if (!!getUrlParam("backurl")) {
							window.parent.actRegisterSuccessBtn(getUrlParam("backurl"));
							window.sessionStorage.setItem("fromActRegisterSuccess",1);
						}else{
							var ua = navigator.userAgent.toLowerCase();
							if (/iphone/.test(ua)) {
								window.location.href = "hongbaoregistersuccess://";
							}else if (/android/.test(ua)){
								window.callRegister.finishThis();
							}else{
								window.location.href = "http://www.2333db.com/share/download.html";
							}
						}
					});
					
//						registerSuccess(getUrlParam("telephone"));
				}else{
					$.each(o.hongbaoList, function(i,n) {
						$("#j-bonus-box").append(
							'<li>'+
								'<div class="text">'+
									'<p class="text-1">¥ <span>'+n.discount+'</span></p>'+
									'<p class="text-2">'+
										function(n){
											if (n.usePoint == 0) {
												return n.discription;
											}else{
												return '满'+n.usePoint+'元可用';
											}
										}(n)+
									'</p>'+
								'</div>'+
							'</li>'
						);
					});
				}
			}else{
				alert(o.message);
			}
		}
	});



$("#registerBtn").on("click",function(){
	if (!!getUrlParam("backurl")) {
		window.parent.actRegisterBtn(getUrlParam("backurl"));
//		window.location.href = getUrlParam("backurl");
		window.sessionStorage.setItem("fromActRegister",1);
	}else{
		var ua = navigator.userAgent.toLowerCase();
		if (/iphone/.test(ua)) {
			window.location.href = "hongbaoregister://";
		}else if (/android/.test(ua)){
			window.callRegister.callRegisterActivity();
		}else{
			window.location.href = "http://www.2333db.com/share/download.html";
		}
	}
});


function registerSuccess(tel){
	
}
