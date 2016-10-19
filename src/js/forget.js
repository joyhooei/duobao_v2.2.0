$(function(){
	forget();
})



function forget(){
	var user = $("#p-forget").find(".login_user");
	var psd = $("#p-forget").find(".login_psd");
	
	if (window.sessionStorage.getItem("yzmtel") != null) {
		user.val(window.sessionStorage.getItem("yzmtel"));
	}
	
	$("#p-forget").find(".get_yzm").click(function(){
		if ( (new Date().getTime() - cookie.getCookie("yzmtime")) /1000 < 100) {
			$.alert("请勿频繁发送");
			return;
		}

		var telReg = /^(0|86|17951)?1\d{10}$/.test(user.val());
		if (!telReg) {
			user.addClass("ipt-error");
			$("<span class='ipt-error-text'>请输入正确的手机号</span>").insertAfter(user);
		}else{
			_getScript("js/yzmDY.js",function(){
				yzmDY(user,"bind");
			})
		}
	})

	$("#p-forget").find(".linkto").click(function(){
		var telReg = /^(0|86|17951)?1\d{10}$/.test(user.val());
		if (!telReg) {
			if (user.hasClass("ipt-error").length > 0 ) {
				return;
			}
			user.addClass("ipt-error");
			$("<span class='ipt-error-text'>请输入正确的手机号</span>").insertAfter(user);
		}
		if (!psd.val()) {
			if (psd.hasClass("ipt-error").length > 0 ) {
				return;
			}
			psd.addClass("ipt-error");
			$("<span class='ipt-error-text'>请输入验证码</span>").insertAfter(psd);
		}
		if (telReg && psd.val()) {
			if (window.sessionStorage.getItem("yzm") == psd.val() && window.sessionStorage.getItem("yzmtel")== $(".login_user").val()) {
				$.showIndicator();
				$.router.load("forget2.html?tel="+user.val());
			}else if(window.sessionStorage.getItem("yzmtel") != $(".login_user").val()){
				if ($(".ipt-error").length == 0){
					user.addClass("ipt-error");
					$("<span class='ipt-error-text'>请输入正确的手机号</span>").insertAfter(user);
				}
			}else{
				if ($(".ipt-error").length == 0){
					psd.addClass("ipt-error");
					$("<span class='ipt-error-text'>验证码输入错误</span>").insertAfter(psd);
				}
			}
		}
	})
	user.focus(function(){
		user.removeClass("ipt-error");
		$(".ipt-error-text").remove();
	})
	psd.focus(function(){
		psd.removeClass("ipt-error");
		$(".ipt-error-text").remove();
	})
}
