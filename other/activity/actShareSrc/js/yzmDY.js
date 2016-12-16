function yzmDY(user,modelType){
	var modelID = "SMS_10386058";
	var modelName = "注册验证";
	
	if (modelType == "bind") {
		modelID = "SMS_10386062";
		modelName = "身份验证";
	}
	
	//时间戳
	var datee = new Date();
	var month = (datee.getMonth()+1)>9?(datee.getMonth()+1):"0"+(datee.getMonth()+1);
	var dat = datee.getDate()>9?datee.getDate():"0"+datee.getDate();
	var hour = datee.getHours()>9?datee.getHours():"0"+datee.getHours();
	var minu = datee.getMinutes()>9?datee.getMinutes():"0"+datee.getMinutes();
	var sec = datee.getSeconds()>9?datee.getSeconds():"0"+datee.getSeconds();

	//时间戳sign
	var timestamp = datee.getFullYear()+"-"+month+"-"+dat+" "+hour+":"+minu+":"+sec;
	//时间戳encode
	var timestamp2 = datee.getFullYear()+"-"+month+"-"+dat+"+"+hour+"%3A"+minu+"%3A"+sec;

	//验证码
	var code = Math.random().toString().substring(2,6);

	//签名
	var data1 = "app_key=23384437&force_sensitive_param_fuzzy=true&format=json&method=alibaba.aliqin.fc.sms.num.send&partner_id=top-apitools&rec_num="+user.val()+"&sign_method=md5&sms_free_sign_name="+modelName+""+
					"&sms_param={'code':'"+code+"','product':'一元街'}&sms_template_code="+modelID+"&sms_type=normal&timestamp="+timestamp+"&v=2.0";
	var signStr = data1.split("&").join("").split("=").join("");
	var sign = "7b89322b3f280995175728677e32b823"+signStr+"7b89322b3f280995175728677e32b823";
	var sign5 = CryptoJS.MD5(sign).toString().toUpperCase();

	//请求参数
	var data2 = "app_key=23384437&force_sensitive_param_fuzzy=true&format=json&method=alibaba.aliqin.fc.sms.num.send"+
					"&partner_id=top-apitools&rec_num="+user.val()+"&sign_method=md5&sms_free_sign_name="+encodeURIComponent(modelName)+""+
					"&sms_param=%7B%27code%27%3A%27"+code+"%27%2C%27product%27%3A%27%E4%B8%80%E5%85%83%E8%A1%97%27%7D&sms_template_code="+modelID+"&sms_type=normal&timestamp="+timestamp2+"&v=2.0";
	var data = "http://gw.api.taobao.com/router/rest?" + data2 +"&sign="+sign5;

	$.ajax({
		type:"post",
		url:"http://h5.7kuaitang.com/data/data.php",
		data:{u:data},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.error_response) {
				$.alert(o.error_response.sub_msg);
				return;
			}
			$.alert("验证码发送成功",function(){
				window.sessionStorage.setItem("yzm",code);
				window.sessionStorage.setItem("yzmtel",user.val());
				cookie.setCookie("yzmtime",new Date().getTime(),"s100")
			});

		}
	});
}