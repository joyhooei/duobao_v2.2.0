$(function(){
	try{
		if (lData.userInfo.usertelephone) {
			$("#p-bindtel").find("h1.title").html("修改手机号");
		}else{
			$("#p-bindtel").find("h1.title").html("添加手机号");
		}
		
		bindTelGetYZM();
		
		var leftTime = 100 - Math.ceil((new Date().getTime() - cookie.getCookie("yzmtime")) /1000);
		if (leftTime > 0 && cookie.getCookie("yzmtime")) {
			bindTelYZMCutDown(leftTime);
		}else{
			$("#p-bindtel").find(".get_yzm").html("获取验证码");
		}
	}catch(e){
		//TODO handle the exception
	}
})


function bindTelGetYZM(){
	var user = $("#p-bindtel").find(".j-bindtel-tel");
	var psd = $("#p-bindtel").find(".j-bindtel-yzm");
	
	if (window.sessionStorage.getItem("yzmtel") != null) {
		user.val(window.sessionStorage.getItem("yzmtel"));
	}
	
	$("#p-bindtel").find(".get_yzm").click(function(){
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
				bindTelYZMCutDown(100);
			})
		}
	})
	
	$("#p-bindtel").find(".j-bind-button").click(function(){
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
			if (window.sessionStorage.getItem("yzm") == psd.val() && window.sessionStorage.getItem("yzmtel")== user.val()) {
				$.showIndicator();
				
				bindTelBind(user.val());
			}else if(window.sessionStorage.getItem("yzmtel") != user.val() && window.sessionStorage.getItem("yzmtel") != null){
				if ($(".ipt-error").length == 0){
					user.addClass("ipt-error");
					$("<span class='ipt-error-text'>请输入正确的手机号</span>").insertAfter(user);
				}
			}else{
//				if ($(".ipt-error").length == 0){
//					psd.addClass("ipt-error");
//					$("<span class='ipt-error-text'>验证码输入错误</span>").insertAfter(psd);
//				}
				$.alert("验证码输入错误");
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

function bindTelBind(tel){
	$.showIndicator();
	$.ajax({
		type:"post",
		url:lData.getUrl+"resetTelephone",
		data:{
//			userId : lData.userId,
//			telephone : tel,
			v: lData.srvVersion,
			content: encryptByDES(JSON.stringify({
				userId : lData.userId,
				telephone : tel
			}))
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			if (o.stateCode == 0) {
				lData.userInfo = o.userInfo;
				setTimeout(function(){
					$.hideIndicator();
					$.alert("设置成功",function(){
						$.router.back();
					})
				},200)
			}
		}
	});
}


//验证码倒计时
function bindTelYZMCutDown(time){
	var timer = setInterval(function(){
		time -= 1;
		$("#p-bindtel").find(".get_yzm").html(time+"s后重新发送");
		if (time <= 0) {
			clearInterval(timer);
			$("#p-bindtel").find(".get_yzm").html("获取验证码");
		}
	},1000);
}
