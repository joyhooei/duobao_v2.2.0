$(function(){
	try{
		forget2();
	}catch(e){
		//TODO handle the exception
	}
})


function forget2(){
	var psd = $("#p-forget2").find(".login_psd");
	$("#p-forget2").find(".button").click(function(){
		psd.each(function(i){
			if (!psd.eq(i).val()) {
				psd.eq(i).addClass("ipt-error");
				$("<span class='ipt-error-text'>请设置密码</span>").insertAfter(psd.eq(i));
			}
		})
		if (psd.eq(0).val()&&psd.eq(1).val()&&(psd.eq(0).val() != psd.eq(1).val())) {
			psd.addClass("ipt-error");
			$("<span class='ipt-error-text'>两次密码不一致</span>").insertAfter(psd);
		}

		if (psd.eq(0).val()&&psd.eq(1).val()&&psd.eq(0).val()==psd.eq(1).val()) {
			var tel = $.getUrlParam("tel");
			var mmMd5 = CryptoJS.MD5(psd.eq(1).val()).toString();
			$.ajax({
				type:"post",
				url:luanmingli.getUrl+"resetPassword",
				data:{
//					phoneNum : tel,
//					password : mmMd5,
					v: luanmingli.srvVersion,
					content: encryptByDES(JSON.stringify({
						phoneNum : tel,
						password : mmMd5
					}))
				},
				dataType: "json",
				async:true,
				success:function(o){
					console.log(o);
					
					window.sessionStorage.removeItem("yzm");
					if (o.stateCode == 0) {
						$.alert("重置成功，请使用新密码登陆",function(){
							$.showIndicator();
							window.history.go(-2);
						})
					}else if(o.stateCode == 3) {
						$.alert("账户不存在，请重试");
					}else{
						$.alert(o.message);
					}
				}
			});
		}
	})
	psd.focus(function(){
		psd.removeClass("ipt-error");
		$(".ipt-error-text").remove();
	})
}
