$(function(){
	transfer.init();
})

var $ = (function($){
	$.FZ = function(a, b) {
		function getFZ() {
			var width = document.documentElement.clientWidth || document.body.clientWidth;
			if (width > 375) {
				width = 375;
			}
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
	
	$.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return decodeURIComponent(r[2]);
		return null;
	};
	
	return $;
})(jQuery)

$.FZ(20,375);

var transfer = (function($){
	var bind = function(){
		$(".close").on("click",function(){
			$(".g-header").fadeOut("fast");
		});
		$(".btn").on("click",download);
		$(".m-img").on("click",download);
	}
	
	var downUrl = function(){
		if (!!$.getUrlParam('u')) {
			return $.getUrlParam('u');
		}else{
			return "http://a.app.qq.com/o/simple.jsp?pkgname=com.doumob.treasure&ckey=CK1350652468102";
		}
	}
	
	var download = function(){
//		if (/iPhone|iPad/.test(navigator.userAgent)) {
//			window.location.href = "http://itunes.apple.com/us/app/huang-jin-duo-bao/id1144036041?l=zh&ls=1&mt=8";
//		}else{
//			window.location.href = "http://alicdn.2333db.com/apk/hjdb2.0.1_344715.apk";
//		}
		window.location.href = downUrl();
	}
	
	var init = function(){
		bind();
	}
	return {
		init: init
	}
})(jQuery)

