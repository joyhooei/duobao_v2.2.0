$(function(){
	flow.init();
})


var $ = (function($){
	$.FZ = function(a, b) {
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
	
	$.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return decodeURIComponent(r[2]);
		return null;
	};
	
	$.alert = function(text){
		if ($(".we-alert").length > 0) {
			$(".we-alert").remove();
		}
		$("body").append(
			'<div style="display: none;" class="we-alert">'+
			    '<div class="weui-mask"></div>'+
			    '<div class="weui-dialog">'+
			        '<div class="weui-dialog__bd">'+text+'</div>'+
			        '<div class="weui-dialog__ft">'+
			            '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default">确定</a>'+
			        '</div>'+
			    '</div>'+
			'</div>'
		);
		$(".we-alert").fadeIn(200);
		$(".we-alert .weui-dialog__btn").on("click",function(){
			$(".we-alert").fadeOut(200,function(){
				$(".we-alert").remove();
			});
		});
	}
	
	$.loading = {
		show: function(){
			$('body').append(
				'<div class="preloader-overlay">'+
					'<div class="preloader-indicator-modal">'+
						'<span class="preloader"></span>'+
					'</div>'+
				'</div>'
			);
		},
		hide: function(){
			setTimeout(function(){
				$('body').find('.preloader-overlay').remove();
			},100)
		}
	};
	
	return $;
})(jQuery)

$.FZ(20,360);


var flow = (function($){
	var serverUrl = "http://api.2333db.com/raiders/api/";
	if ($.getUrlParam("test") == 1) {
		serverUrl = "http://www.7kuaitang.com:8081/raiders/api/";
	}
	
	var bindClick = function(){
		$("#receive-btn").on("click",function(){
			var tel = $("#tel-ipt");
			if (!tel.val()) {
				$.alert("请输入手机号");
				return;
			}
			var reg = /^(0|86|17951)?1\d{10}$/;
			if (!reg.test(tel.val())) {
				$.alert("请输入正确的手机号码")
				return;
			}
			
			$.loading.show();
			request(tel.val());
		});
	}
	var request = function(tel){
		$.ajax({
			type:"get",
			url:serverUrl+"appendActive",
			data:{
				telephone: tel,
				activeNumber: 1001
			},
			dataType:"json",
			async:true,
			success:function(o){
				console.log(o);
				if (o.stateCode == 0) {
					$.alert("活动参加成功");
				}else if(o.stateCode == 302){
					$.alert("该手机号已参加过活动");
				}else{
					$.alert(o.message);
				}
				$.loading.hide();
			}
		});
	}
	
	var init = function(){
		bindClick();
	}
	return {
		init: init
	}
})(jQuery)

//http://localhost:8080/raiders/api/appendActive?telephone=18612206720&activeNumber=1001  加入活动
//http://localhost:8080/raiders/api/activeList?date=2016-11-24 按日获取参加活动的人
//http://localhost:8080/raiders/api/setActiveUsed?id=27 设置为已发放活动奖