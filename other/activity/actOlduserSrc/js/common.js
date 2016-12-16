$(function(){
	$.FZ(20, 375);
	
	olduser.init();
})

var config = {
	srvUrl: 'http://api.2333db.com/raiders/restWeb/', 
	srvUrlTest: 'http://www.7kuaitang.com:8081/raiders/restWeb/',
	downloadUrl: "http://a.app.qq.com/o/simple.jsp?pkgname=com.doumob.treasure&ckey=CK1348774636145"
};

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


var $ = (function($){
	$.windowHeightCount = 0;
	$.windowHeight = function(height){
		console.log(height);
		$(function(){
			var top = $("#j-tel-val").offset().top;
			if (height -top <= 20) {
				$(".m-title").width($(".m-title").width()-20);
				$(".m-title").height($(".m-title").height()-20/11.8*4.825);
				$(".g-header").find("img").width($(".g-header").find("img").width()-20);
				$.windowHeightCount += 1;
				if ($.windowHeightCount > 20) {
					return;
				}
				console.log($.windowHeightCount)
				$.windowHeight($(window).height());
			}
		})
		
	};
	$.FZ = function(a, b) {
		function getFZ() {
			var width = document.documentElement.clientWidth || document.body.clientWidth;
			var fontSize = (a / b) * width;
			$.windowHeight($(window).height());
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


var olduser = (function($){
	var srvUrl = config.srvUrl;
	if (!!$.getUrlParam("test")) {
		srvUrl = config.srvUrlTest;
	}
	
	var getData = function(){
		var receiveOldRedObj = $.parseJSON(window.sessionStorage.getItem("receiveOldRed"));
		var telStr = window.sessionStorage.getItem("tel")?window.sessionStorage.getItem("tel"):"";
		if (!!receiveOldRedObj) {
			getBonus(receiveOldRedObj,telStr);
		}else{
			bindClick();
		}
	}
	
	var bindClick = function(){
		var tel = $('#j-tel-val'),
			btn = $("#j-tel-btn");
		btn.on('click',function(){
			if (!tel.val()) {
				alert("请输入手机号");
				return;
			}
			
			var telReg = /^(0|86|17951)?1\d{10}$/;
			if (!telReg.test(tel.val())) {
				alert("请输入正确的手机号");
				return;
			}
			
			$.getScript("http://www.2333db.com/static/crypto-js.js",function(){
				request(tel.val());
			})
		});
	}
	
	var request = function(tel){
		$.loading.show();
		
		$.ajax({
			type:"post",
			url:srvUrl+"receiveOldRed",
			data:{
				v: "2.1.0",
				content:encryptByDES(JSON.stringify({
					telephone: tel
				})),
			},
			dataType: "json",
			async:true,
			success:function(o){
				console.log(o);
				if (o.stateCode == 0) {
					window.sessionStorage.setItem("receiveOldRed",JSON.stringify(o));
					window.sessionStorage.setItem("tel",tel);
					getBonus(o,tel);
				}else if(o.stateCode == 301){
					alert("新注册用户无法领取");
				}else{
					alert(o.message);
				}
				$.loading.hide();
			},
			error:function(){
				$.loading.hide();
				alert("服务器请求失败，请稍后再试");
			}
		})
	}
	
	var getBonus = function(o,tel){
		$('.g-column-1').hide();
		$('.g-column-2').show();
		
		$.each(o.hongbaoList, function(i,n) {
			$("#j-list").append(
				'<li>'+
					'<div class="m-left">'+
						'<p class="text-1">¥<span>'+n.disCount+'</span></p>'+
						'<p class="text-2">满'+n.usePoint+'元可用</p>'+
					'</div>'+
					'<div class="m-right">'+
						'<p class="text-3">'+
							'<span class="text-3-1">'+n.hongbaoName+'</span>'+
							'<span class="text-3-2">'+n.validity+'后过期</span>'+
						'</p>'+
					'</div>'+
				'</li>'
			);
		});
		
		if (!!tel) {
			$('.g-column-2 .m-text').append(
				'<p>红包已放入帐号：'+tel+'</p>'
			);
		}
	}
	
	var fixedTop = function(){
		$("#j-fixed-btn").on("click",function(){
			window.location.href = config.downloadUrl;
		});
	}
	
	var init = function(){
		getData();
		fixedTop();
//		getBonus('','18686842201');
	}
	
	return {
		init: init
	}
})(jQuery)


var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?df3d7bb8d960b034621cae461d2bb40e";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();