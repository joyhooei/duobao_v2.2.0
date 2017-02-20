$(function(){
	car.init();
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
	
	$.device = {
		ua : navigator.userAgent.toLowerCase(),
		isAndroid : function(){
			return (/android/.test($.device.ua)) ? true : false;
		},
		isIos : function(){
			return (/iphone/.test($.device.ua)) ? true : false;
		},
	}
	
	//加载新css文件
	var _getCss = function(href,callback){
		if ($("link[href='"+href+"']").length > 0) {
			callback();
			return;
		}
		var c = document.createElement("link");
		c.setAttribute("rel", "stylesheet");
		c.setAttribute("type", "text/css");
		c.setAttribute("href", href);
		document.getElementsByTagName("head")[0].appendChild(c);
		callback();
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
})(Zepto)

$.FZ(20,360);

var car = (function($){
	const config = {
		userId: $.getUrlParam('userId'),
		srvVersion: '2.3.0'
	};

	if ($.getUrlParam('test') == 1) {
		config.getUrl = "http://www.7kuaitang.com:8081/raiders/restWeb/";
	}else{
		config.getUrl = "http://api.2333db.com/raiders/restWeb/";
	}
	
	if ($.getUrlParam('origin') == 'web') {
		window.alert = window.parent.$.alert;
	}
	
	var fill = function(){
		$.loading.show();
		$.ajax({
			type:"post",
			url: config.getUrl+"getPersonGoods",
			data:{
				v: config.srvVersion
			},
			async:true,
			dataType: 'json',
			success(o) {
				console.log(o)
				
				if (o.stateCode == 0) {
					$.each(o.goodsList,function(i,n){
						$('.g-card-wrap').append(`
							<label class="m-card" for="choose${i}">
								<img src="${n.icon}" />
								<p><span>${n.describe}</span></p>
								<input value='${n.goodsId}' name="choose" id="choose${i}" type="checkbox" style="display: none;" />
								<div class="u-icon"></div>
							</label>
						`);
					});
				}else{
					alert(o.message);
				}
				$.loading.hide();
			}
		});
	}
	
	
	var start = function(){
		$('#start').on('click',function(){
			let ele = $('.g-card-wrap').find('input:checked');
			if (ele.length == 0) {
				alert('未选择');
			}else{
				let valArr = [];
				ele.each(function(i,n){
					valArr.push($(n).val());
				});
				let list = valArr.join(';');
				
				$.loading.show();
				$.ajax({
					type:"post",
					url: config.getUrl+"createPersonCar",
					data:{
						v: config.srvVersion, 
						content: encryptByDES(JSON.stringify({
							userId: config.userId
						}))
					},
					async:true,
					dataType: 'json',
					success(o){
						console.log(o);
						if (o.stateCode == 0) {
							let carId = o.car.carId;
							create(carId,list);
						}else{
							$.loading.hide();
							alert(o.message);
						}
					}
				});
			}
		});
	}
	
	var create = function(carId,list){
		$.ajax({
			type:"post",
			url:config.getUrl+"createPersonTreasure",
			data:{
				v: config.srvVersion,
				content: encryptByDES(JSON.stringify({
					userId: config.userId,
					carId: carId,
					goodsIdList: list
				}))
			},
			async:true,
			dataType:'json',
			success(o){
				console.log(o)
				if (o.stateCode == 0) {
					createSuccess(carId);
				}else{
					alert(o.message);
				}
				$.loading.hide();
			}
		});
	}
	
	var createSuccess = function(carId){
		if ($.getUrlParam('origin') == 'web') {
			window.parent.carCallBack(carId);
		}else{
			if ($.device.isIos()) {
				window.location.href = 'carshare://'+carId
			}else{
				window.callRegister.carshare(carId);
			}
		}
	}
	
	var init = function(){
		if (!$.getUrlParam('userId')) {
			alert('缺少参数userId');
			return;
		}
		
		fill();
		start();
	}
	return {
		init: init
	}
})(Zepto)


