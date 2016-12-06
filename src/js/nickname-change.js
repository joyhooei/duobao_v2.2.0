function nickChangeInit(){
	nickChange.init();
}	

var nickChange = (function($){
	var init = function(){
		placeholder();
		btnClick();
	}
	
	var ipt = $("#nickname-change-ipt");
	var btn = $("#p-nickname-change .j-change-button");
	var placeholder = function(){
		ipt.attr("placeholder",luanmingli.userInfo.nickName);
	}
	var btnClick = function(){
		btn.on("click",function(){
			if (ipt.val().length > 8) {
				$.alert("昵称过长，请重新输入");
				return;
			}
			var reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
			if (!reg.test(ipt.val())) {
				$.alert("只能输入数字、英文、汉字");
				return;
			}
			request();
		});
	}
	var request = function(){
		$.ajax({
			type:"get",
			url:luanmingli.getUrl+"resetNickName",
			data:{
				v: luanmingli.srvVersion,
				content: encryptByDES(JSON.stringify({
					userKey: window.localStorage.getItem("userKey"),
					nickName : ipt.val()
				}))
			},
			async:true,
			dataType:'json',
			success:function(o){
				console.log(o)
				if (o.userStatus == 0) {
					$.alert("昵称修改成功",function(){
						window.history.go(-2);
					});
				}else{
					$.alert(o.message);
				}
			}
		});
	}
	
	return {
		init: init
	}
})(Zepto)


$(function(){
	nickChangeInit();
})
