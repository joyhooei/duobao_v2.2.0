var car = (function($){
	var bind = function(){
		$('#getin-car').on('click',function(){
			$.prompt('请输入车牌号',function(val){
				if (val) {
					$.router.load('mycar.html?carId='+val);
				}else{
					$.alert('请输入车牌号');
				}
			});
		});
		
		$('#create-car').on('click',function(){
			$.confirm('开车即可拿到商品价值5%的返利',function(){
				if (!!luanmingli.userId) {
					if (/127.0.0.1/.test(window.location.href)) {
						if (!!luanmingli.calcTestUrl) {
							var iframeParam = window.location.href.split("src/")[0] + "other/html/car.html?test=1&origin=web&userId="+luanmingli.userId;
							$.router.load("iframe.html?name="+encodeURIComponent('开车')+"&url="+iframeParam);
						}else{
							var iframeParam = window.location.href.split("src/")[0] + "other/html/car.html?origin=web&userId="+luanmingli.userId;
							$.router.load("iframe.html?name="+encodeURIComponent('开车')+"&url="+iframeParam);
						}
					}else{
						if (!!luanmingli.calcTestUrl) {
							$.router.load("iframe.html?url=http://www.2333db.com/html/car.html?name="+encodeURIComponent('开车')+"&test=1&origin=web&userId="+luanmingli.userId);
						}else{
							$.router.load("iframe.html?url=http://www.2333db.com/html/car.html?name="+encodeURIComponent('开车')+"&origin=web&userId="+luanmingli.userId);
						}
					}
				}else{
					$.alert('请先登录',function(){
						$.router.load('login.html');
					});
				}
			})
		});
		
		$('.car-help').click(function(){
			$.router.load('car-help.html');
		});
	}
	
	var init = function(){
		bind();
	}
	return {
		init: init,
	}
})(Zepto)


car.init();
