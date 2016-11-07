var browser = { //设备判断
	ua: navigator.userAgent.toLowerCase(),
	isAndroid: function() {
		return(/android/.test(browser.ua)) ? true : false;
	},
	isIos: function() {
		return(/iphone/.test(browser.ua)) ? true : false;
	},
	isWX: function() {
		return(/micromessenger/.test(browser.ua)) ? true : false;
	},
}

$.getUrlParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURIComponent(r[2]);
	return null;
}

$(function() {
	document.body.addEventListener('touchstart', function() {})

	$("#down-btn").click(function() {
		var url = $.getUrlParam("url");
		//如果存在url参数
		if (url) {
			if (browser.isWX()) {
				$(".f-overlay").show();
				$(".f-overlay .alert-text span").html(function(){
					if (browser.isIos()) {
						return "Safari";
					}else{
						return "浏览器";
					}
				});
				$(".f-overlay").click(function() {
					$(this).hide();
				})
			}else{
				window.location.href = url;
			}
		}else{
			if(browser.isAndroid()) {
				//安卓应用宝
				window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.doumob.treasure"; //安卓下载地址
			} else if(browser.isIos()) {
				//微信内
				if(browser.isWX()) {
					$(".f-overlay").show();
					$(".f-overlay").click(function() {
						$(this).hide();
					})
				} else {
					//苹果itunes商店
					window.location.href = "http://itunes.apple.com/us/app/huang-jin-duo-bao/id1144036041?l=zh&ls=1&mt=8"; //苹果下载地址
				}
			}else{
				window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.doumob.treasure"; //安卓下载地址
			}
		}
	})
})
