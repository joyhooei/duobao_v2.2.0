var getUrl = "http://api.2333db.com/raiders/restWeb/";
//var getUrl = "http://www.7kuaitang.com:8081/raiders/restWeb/";


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


!function(){
	FZ(20, 360);
	getBonusData();
	getYZM();
	
	getBonsNoYZM();
	getBonus();
	
	if (!!window.sessionStorage.getItem("success")) {
		getBonusSuccess(window.sessionStorage.getItem("success"));
	}
}()

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

function getBonusData(){
	$.ajax({
		type:"post",
		url:getUrl + "getHongbaoList",
		data: {
			v: "2.1.0",
			hongbaoType: 102
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
					$("#j-bonus-box2").append(
						'<li class="clearfix">'+
							'<div class="text1">¥  <span>'+n.discount+'</span></div>'+
//							'<div class="text2">'+n.discription+'</div>'+
							'<div class="text2">'+
								'<p class="text21">'+n.hongbaoName+'</p>'+
								'<p>'+n.discription+'</p>'+
							'</div>'+
//							'<div class="text2">'+n.discription+'</div>'+
						'</li>'
					);
				});
			}else{
				alert(o.message);
			}
		}
	});
}

function getYZM(){
	$("#yzmBtn").click(function(){
		var user = $("#tel");
		
		if (!user.val()) {
			alert("请输入手机号码");
			return;
		}
		
		var telReg = /^(0|86|17951)?1\d{10}$/.test(user.val());
		if (!telReg) {
			alert("请输入正确的手机号码");
			return;
		}
		
		
		var timeNow = new Date().getTime();
		var timeYzm = window.sessionStorage.getItem("yzmtime");
		if (!!timeYzm && timeNow - timeYzm < 100*1000 ) {
			alert("请勿频繁发送");
		}else{
			$.getScript("actShareSrc/js/yzmDY.js",function(){
				yzmDY(user,"bind");
			})
		}
	});
}

function getBonus(){
	if (!!window.sessionStorage.getItem("yzmtel")) {
		$("#tel").val(window.sessionStorage.getItem("yzmtel"));
	}
	
	$("#getBonus").click(function(){
		
		if (!$("#tel").val()) {
			alert("请输入手机号");
			return;
		}
		
		if (!$("#yzmNum").val()) {
			alert("请输入验证码");
			return;
		}
		
		if ($("#tel").val() != window.sessionStorage.getItem("yzmtel")) {
			alert("请输入正确的手机号码");
			return;
		}
		
		if (!!window.sessionStorage.getItem("yzm") ) {
			if (window.sessionStorage.getItem("yzm") == $("#yzmNum").val()) {
				toRegister();
//				bonus($("#tel").val());
			}else{
				alert("验证码输入错误");
			}
		}else{
			alert("请重新发送验证码");
		}
	});
}

function toggleBox(status){
	if (status == 2) {
		$(".g-column-1").hide();
		$(".g-column-3 .m-yzm-box").hide();
		$(".g-column-3 .m-register-box").show();
		$(".g-column-3").addClass("g-column-4");
	}else if(status == 1) {
		$(".g-column-1").show();
		$(".g-column-3 .m-yzm-box").show();
		$(".g-column-3 .m-register-box").hide();
		$(".g-column-3").removeClass("g-column-4");
	}else if(status === 0) {
		$(".g-column-3 .m-step0").hide();
		$(".g-column-3 .m-yzm-box").show();
		$(".g-column-3").removeClass("step0");
	}
}


function bonus(tel){
	$.ajax({
		type:"post",
		url:getUrl+"receiveOldRed",
		data:{
			v: "2.1.0",
			content:encryptByDES(JSON.stringify({
				telephone: tel,
				prizeId: getUrlParam("prizeId")
			})),
//			telephone: tel,
//			prizeId: getUrlParam("prizeId")
		},
		dataType: "json",
		async:true,
		success:function(o){
			console.log(o);
			
			if (o.stateCode == 0) {
				window.sessionStorage.removeItem("yzm");
				window.sessionStorage.removeItem("yzmtel");
				window.sessionStorage.removeItem("yzmtime");
				
				getBonusSuccess(tel);
			}else if (o.stateCode == 11){
				alert("请先注册一元街，红包将直接发放到您的帐号");
				toggleBox(0);
			}else{
				alert(o.message);
			}
		},
	});
	
	
	
}

function toRegister(){
	//注册
	toggleBox(2);
	
	$("#register").click(function(){
		if (!$("#name").val()) {
			alert("请设置昵称");
			return;
		}
		
		if (!$("#pw1").val() || !$("#pw2").val()) {
			alert("请设置密码");
			return;
		}
		
		if ($("#pw1").val() && $("#pw2").val() && $("#pw1").val() != $("#pw2").val()) {
			alert("两次密码不一致");
			return;
		}
		
		var tel = $("#tel").val();
		var pwMD5 = CryptoJS.MD5($("#pw1").val()).toString();
		
		$.ajax({
			type:"post",
			url:getUrl+"register",
//			url:"http://192.168.28.114:8080/raiders/restWeb/register",
			data:{
				v: "2.1.0",
				content: encryptByDES(JSON.stringify({
					phoneNum : tel,
					password : pwMD5,
					nickName : $("#name").val(),
					channelid: "h5",
					appversion: "2.1.0",
					clienttype: 3,
					deviceId: "0"
				})),
			},
			dataType:"json",
			async:true,
			success:function(o){
				console.log(o);
				
				if (o.stateCode == 0) {
					bonus(tel);
					alert("注册成功");
				}else{
					alert(o.message);
				}
			}
		});
	});
}


function getBonusSuccess(tel){
	window.sessionStorage.setItem("success",tel);
	$(".g-column-1").show();
	$(".g-column-3").hide();
	$(".bonus-success").show();
	$(".a-bonus-seccess-tel").html(tel);
	$("#j-bonus-box").hide();
	$("#j-bonus-box2").show();
	$("#useBonus").click(function(){
		window.location.href = "http://www.2333db.com/share/download.html";
	});
}



function getBonsNoYZM(){
	if (!!window.sessionStorage.getItem("yzmtel")) {
		$("#tel").val(window.sessionStorage.getItem("yzmtel"));
	}
	
	$("#getBonusStep0").click(function(){
		if (!$("#tel0").val()) {
			alert("请输入手机号");
			return;
		}
		
		var telReg = /^(0|86|17951)?1\d{10}$/.test($("#tel0").val());
		if (!telReg) {
			alert("请输入正确的手机号码");
			return;
		}
		
		window.sessionStorage.setItem("yzmtel",$("#tel0").val())
		bonus($("#tel0").val());
	});
}
