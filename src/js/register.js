$(function(){
	try{
		if (!!window.sessionStorage.getItem("fromActRegister")) {
			window.sessionStorage.removeItem("fromActRegister");
		}
		
		register();
	}catch(e){
		//TODO handle the exception
	}
})



function register(){
	var user = $("#p-register").find(".login_user");
	var psd = $("#p-register").find(".login_psd");
	
	if (window.sessionStorage.getItem("yzmtel") != null) {
		user.val(window.sessionStorage.getItem("yzmtel"));
	}
	
	$("#p-register").find(".get_yzm").click(function(){
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
				yzmDY(user);
			})
		}
	})

	$("#p-register").find(".linkto").click(function(){
		var telReg = /^(0|86|17951)?1\d{10}$/.test(user.val());
		if (!telReg) {
			user.addClass("ipt-error");
			$("<span class='ipt-error-text'>请输入正确的手机号</span>").insertAfter(user);
		}
		if (!psd.val()) {
			psd.addClass("ipt-error");
			$("<span class='ipt-error-text'>请输入验证码</span>").insertAfter(psd);
		}
		if (telReg && psd.val()) {
			if (window.sessionStorage.getItem("yzm") == psd.val() && window.sessionStorage.getItem("yzmtel")== $(".login_user").val()) {
				$.showIndicator();
				$.router.load("register2.html?tel="+user.val());
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
