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


$(function(){
	$.init();
	$.destroyPullToRefresh(".pull-to-refresh-content");
	
	info.init();
	
//	extract.init();
})

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


var Zepto = (function($){
	$.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return decodeURIComponent(r[2]);
		return null;
	};
	$.getScript = function(url, callback, tag) {
		$("script[src='" + url + "']").remove();
	
		if (tag == undefined) {
			tag = 'head';
		}
		var head = document.getElementsByTagName(tag)[0],
			js = document.createElement('script');
		js.setAttribute('type', 'text/javascript');
		js.setAttribute('src', url);
		head.appendChild(js);
		//执行回调
		var callbackFn = function() {
			if (typeof callback === 'function') {
				callback();
			}
		};
		if (document.all) { //IE
			js.onreadystatechange = function() {
				if (js.readyState == 'loaded' || js.readyState == 'complete') {
					callbackFn();
				}
			}
		} else {
			js.onload = function() {
				callbackFn();
			}
		}
	}
	$.copyBtn = function(str,type){
		var str = str.replace(/[^a-z\d]/ig,"");
		if ($.getUrlParam("from") != "web") {
			if (!!$.device.android) {
				if (type == 1) {
					var typeText = "卡号复制成功";
				}else if(type ==2){
					var typeText = "卡密复制成功";
				}else{
					var typeText = "";
				}
				window.callRegister.copySecretKey(str,typeText);
			}else{
				window.location.href = "copy://"+str;
			}
		}
	}
	return $;
})(Zepto)



var extract = (function($){
	var serverUrl = "http://api.2333db.com/raiders/restWeb/getCardList";
//	var serverUrl = "http://www.7kuaitang.com:8081/raiders/restWeb/getCardList";
	
	var srvVersion = "2.1.0";
	
	if ($.getUrlParam("test")) {
		serverUrl = "http://www.7kuaitang.com:8081/raiders/restWeb/getCardList";
	}
	
	
	var bind = function(tel){
//		if (!!window.sessionStorage.getItem("extractContentTel") && !!window.sessionStorage.getItem("extractContentPwd")) {
//			request(window.sessionStorage.getItem("extractContentTel"),window.sessionStorage.getItem("extractContentPwd"),1);
//		}
		
		if (!!tel && tel != "null" && tel != "undefined") {
			$("#ipt-id").val(tel);
		}
		
		$.destroyPullToRefresh(".pull-to-refresh-content");
		$("#btn-card").on("click",function(){
			var telReg = /^(0|86|17951)?1\d{10}$/.test($("#ipt-id").val());
			if (!$("#ipt-id").val()) {
				$.alert("请输入夺宝帐号");
				return;
			}
			
			if (!$("#ipt-pswd").val()) {
				$.alert("请输入夺宝密码");
				return;
			}
			
			if (!telReg) {
				$.alert("请输入正确的夺宝帐号");
				return;
			}
			
				
//			request($("#ipt-id").val(),CryptoJS.MD5($("#ipt-pswd").val()).toString(),1);
			request(1);
		});
	}
	
	var request = function(curPage,callback){
		$.showIndicator();
        
		$.ajax({
			type:"post",
			url:serverUrl,
			data:{
				v: srvVersion,
				content: encryptByDES(JSON.stringify({
					userId: $.getUrlParam("userId"),
					telephone: $("#ipt-id").val(),
					password: CryptoJS.MD5($("#ipt-pswd").val()).toString(),
					currentPage:curPage
				}))
			},
			dataType:"json",
			async:true,
			success:function(o){
				console.log(o);
				setTimeout(function(){
					if (o.stateCode == 0) {
//						window.sessionStorage.setItem("extractContentTel",tel);
//						window.sessionStorage.setItem("extractContentPwd",pwd);
						$(".g-wrapper-1").hide();
						if (o.cardList.length == 0) {
							$(".g-wrapper-3").show();
						}else{
							$(".g-wrapper-2").show();
							$.initPullToRefresh(".pull-to-refresh-content");
							extractBottomLoad(o);
							pullRefresh();
							fillCard(o.cardList);
						}
					}else{
						$.alert(o.message);
					}
					
					setTimeout(function(){
						if (!!callback) {
							callback();
						}
						$.hideIndicator();
					},100);
				},100)
			}
		});
	}
	
	var extractBottomLoad = function(o){
		window.sessionStorage.setItem("extractCur",o.currentPage);
		window.sessionStorage.setItem("extractTot",o.totalPage);
		loadBottom();
	}
	
	var fillCard = function(cardList){
		console.log(cardList);
		
		$.each(cardList, function(i,n) {
			if (n.changeType == 3) {
				$("#m-card-box").append(
					'<li class="m-card">'+
						'<div class="m-top clearfix">'+
							'<i class="m-image"></i>'+
							'<div class="m-title">'+
								'<p class="m-title-1">'+n.cardName+'</p>'+
								'<p class="m-title-2">期号：'+n.phaseNumber+'</p>'+
							'</div>'+
						'</div>'+
						'<div class="m-bottom">'+
							'<p class="m-text1">卡号：'+n.cardNum+'<span class="copy" onclick="$.copyBtn(\''+n.cardNum+'\',1)">复制</span></p>'+
							'<p class="m-text2">卡密：'+n.cardPwd+'<span class="copy" onclick="$.copyBtn(\''+n.cardPwd+'\',2)">复制</span></p>'+
						'</div>'+
					'</li>'
				);
			}
		});
		
		if ($.getUrlParam("from") == "web") {
			$(".copy").hide();
		}
	}
	
	var pullRefresh = function(){
		$(document).off('refresh', '.pull-to-refresh-content');
		$(document).on('refresh', '.pull-to-refresh-content',function(e) {
			$.showIndicator();
			setTimeout(function(){
				$(".m-card").remove();
//				request(window.sessionStorage.getItem("extractContentTel"),window.sessionStorage.getItem("extractContentPwd"),1);
				request(1,function(){
					$.toast('刷新成功', 1000, 'toast-10');
				});
				$.pullToRefreshDone('.pull-to-refresh-content');
			},100);
		})
	}
	
	var loadBottom = function(){
		$(document).off('infinite', '.infinite-scroll-bottom');
		
		var loading = false;
		
		$(document).on('infinite', '.infinite-scroll-bottom',function() {
			if (loading) {
				return;
			}

			loading = true;

			setTimeout(function() {
				loading = false;
				var cur = window.sessionStorage.getItem("extractCur");
				var tot = window.sessionStorage.getItem("extractTot");
				
				if (cur >= tot) {
					$.toast('没有更多数据', 1000, 'toast-80');
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').remove();
				}else{
					request((parseInt(cur)+1));
					$.toast('加载成功', 1000, 'toast-80');
				}

//				$.refreshScroller();
			}, 100);
		});
	}
	
	var init = function(tel){
		bind(tel);
//		pullRefresh();
//		if ($(".g-wrapper-1").css("display") != "none")
//			$.destroyPullToRefresh(".content")
	}
	
	return {
		init: init,
		request: request
	}
})(Zepto)




var info = (function($){
	var serverUrl = "http://api.2333db.com/raiders/restWeb/";
//	var serverUrl = "http://www.7kuaitang.com:8081/raiders/restWeb/";
	var srvVersion = "2.1.0";
	if ($.getUrlParam("test")) {
		serverUrl = "http://www.7kuaitang.com:8081/raiders/restWeb/";
	}
	var userId = $.getUrlParam("userId");
	var userKey = $.getUrlParam("userKey");
	
	var getUserInfo = function(){
		$.ajax({
			type:"post",
			url:serverUrl+"userDetail",
			data:{
				v: srvVersion,
				content: encryptByDES(JSON.stringify({
					userId: userId
				}))
			},
			async:false,
			dataType:"json",
			success:function(o){
				console.log(o);
				if (o.stateCode == 0) {
					var userStatus = o.userStatus;
					if (userStatus == 0) {
						//有手机号和密码
						extract.init();
					}else if(userStatus == 1) {
						//没有密码
						var tel = o.userInfo.usertelephone;
						popup(tel);
					}else if(userStatus == 2) {
						//没有手机号
						popup("");
					}
					
				}else{
					$.alert(o.message);
				}
			},
			error: function(){
				$.alert("请求服务器超时，请稍后再试");
			}
		})
	}
	
	//验证码倒计时
	function bindTelYZMCutDown(time){
		time = parseInt(time);
		if (isNaN(time)) {
			time = -1;
		}
		var timer = setInterval(function(){
			time -= 1;
			$(".getYZM").html(time+"s后重新发送");
			if (time <= 0) {
				clearInterval(timer);
				$(".getYZM").html("获取验证码");
			}
		},1000);
	}
	
	
	var popup = function(tel){
		$.popup(
			'<div class="popup-extract popup">'+
				'<div class="content-block">'+
					'<div class="form-box">'+
						'<span class="getYZM" style="display:none;">获取验证码</span>'+
						'<input class="tel-ipt" type="tel" placeholder="请输入手机号" value="'+tel+'">'+
						'<input class="yzm-ipt" type="number" placeholder="请输入验证码" style="display:none;">'+
						'<input class="pwd-ipt" type="password" placeholder="设置密码">'+
						'<div class="btn" id="bind-tel-btn">确定</div>'+
					'</div>'+
				'</div>'+
			'</div>'
		);
		
		if (!tel) {
			$(".getYZM").show();
			$(".yzm-ipt").show();
			
			if (!!window.sessionStorage.getItem("yzmtel")) {
				$(".tel-ipt").val(window.sessionStorage.getItem("yzmtel"));
			}
		}
		
		
		
		$(".getYZM").on("click",function(){
			if (!!window.sessionStorage.getItem("yzmtime") && (new Date().getTime() - window.sessionStorage.getItem("yzmtime")) /1000 < 100) {
				$.alert("请勿频繁发送");
				return;
			}
			
			if (!$(".tel-ipt").val()) {
				$.alert("请输入手机号码");
				return;
			}
			
			var telReg = /^(0|86|17951)?1\d{10}$/.test($(".tel-ipt").val());
			if (!telReg) {
				$.alert("请输入正确的电话号码");
			}else{
				$.getScript("extractSrc/js/yzmDY.js",function(){
					yzmDY($(".tel-ipt"),"bind");
					bindTelYZMCutDown(100);
				})
			}
		});
		
		$("#bind-tel-btn").on("click",function(){
			if (!!tel && tel != $(".tel-ipt").val()) {
				$.alert("请输入正确的手机号码");
				return;
			}
			
			if (!$(".tel-ipt").val()) {
				$.alert("请输入手机号");
				return;
			}
			
			if (!tel) {
				if (!$(".yzm-ipt").val()) {
					$.alert("请输入验证码");
					return;
				}
				if ($(".tel-ipt").val() != window.sessionStorage.getItem("yzmtel")) {
					$.alert("请输入正确的手机号码");
					return;
				}
				if ($(".yzm-ipt").val() != window.sessionStorage.getItem("yzm")) {
					$.alert("验证码输入错误");
					return;
				}
			}
			
			if (!$(".pwd-ipt").val()) {
				$.alert("请输入密码");
				return;
			}
			
			var telReg = /^(0|86|17951)?1\d{10}$/.test($(".tel-ipt").val());
			if (!telReg) {
				$.alert("请输入正确的手机号");
				return;
			}
			
			bindTel($(".tel-ipt").val(),$(".pwd-ipt").val());
		});
	}
	
	var bindTel = function(tel,pwd){
		$.ajax({
			type:"post",
			url:serverUrl+"resetTelephone",
			data:{
				v: srvVersion,
				content: encryptByDES(JSON.stringify({
//					userId : userId,
					userKey: userKey,
					telephone : tel,
					password: CryptoJS.MD5(pwd).toString()
				}))
			},
			async:true,
			dataType:"json",
			success:function(o){
				console.log(o);
				if (o.stateCode == 0) {
					if (!!tel) {
						var alertText = "密码设置成功";
					}else{
						var alertText = "绑定手机号、设置密码成功";
					}
					
					window.sessionStorage.removeItem("yzm");
					window.sessionStorage.removeItem("yzmtel");
					window.sessionStorage.removeItem("yzmtime");
					
					$.alert(alertText,function(){
						$.closeModal(".popup");
						$("#ipt-pswd").val(pwd);
						extract.init(tel);
						extract.request(1);
					});
				}else{
					$.alert(o.message);
				}
			}
		});
	}
	
	
	var init = function(){
		bindTelYZMCutDown((parseInt(window.sessionStorage.getItem("yzmtime")) + 100000 - new Date().getTime()) / 1000);
		getUserInfo();
	}
	
	return {
		init: init
	}
})(window.Zepto)