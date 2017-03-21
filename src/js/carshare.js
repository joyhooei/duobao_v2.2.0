var carshare = (function($){
	var totlePage;
	
	if (!$.getUrlParam('carId')) {
		$.alert('车牌号有误');
		return;
	}
	
	var chestFillData = function(curPage,cb){
		if (curPage == 1) {
			if ($(".chest_model").length > 0 && window.localStorage.getItem("chestForceRefresh") == null ){
				return;
			}
			$(".chest_model").remove();
		}
	
		$.showIndicator();
		$.ajax({
			type:"get",
			url:luanmingli.getUrl+"getTreasureList",
			data:{
				currentPage:curPage,
				v: luanmingli.srvVersion,
				carId: $.getUrlParam('carId')
			},
			async:true,
			dataType:"json",
			success:function(o){
				console.log(o);
				if (o.totalPage == 0 && o.treasureInfoList.length == 0) {
					$.alert('请输入正确的车牌号',function(){
						$.router.back();
					});
				}
				
				if (curPage > o.totalPage) {
					return;
				}
				
				$.each(o.treasureInfoList, function(i,n) {
					appendData("#p-carshare .content",n);
				});
				
				totlePage = o.totalPage;
				bottomLoadmore(o.currentPage);
				if (!!cb) {
					cb();
				}
				
				setTimeout(function(){
					$.hideIndicator();
				},500)
			}
		});
	}
	
	var appendData = function(ele,n){
		$(ele).append(
			'<div onclick="carshare.routerToDuobao('+n.treasureId+')" class="chest_model card">'+
				'<div valign="bottom" class="card-header color-white no-border no-padding">'+
					'<img class="card-cover" src='+n.goodsInfo.picUrl+' alt="">'+
				'</div>'+
				'<div class="card-content">'+
					'<div class="card-content-inner list_info">'+
						'<div class="clearfix stage_info">'+
							'<p class="stage_text">'+
								'<span>'+n.goodsInfo.describe+'</span>'+
							'</p>'+
						'</div>'+
						'<div class="clearfix">'+
							'<div class="schedule pull-left clearfix">'+
								'<div class="schedule_bar">'+
									'<div class="scheduling" style="width:'+n.participantCount/n.totalCount*100+'%;"></div>'+
								'</div>'+
								'<div class="pull-left">'+
									'<p class="schedule_percent">'+n.totalCount+'</p>'+
									'<p>总需</p>'+
								'</div>'+
								'<div class="schedule_text2 pull-right">'+
									'<p class="schedule_person">'+(n.totalCount-n.participantCount)+'</p>'+
									'<p>剩余</p>'+
								'</div>'+
							'</div>'+
							'<button class="global_button participate button pull-right">立即夺宝</button>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'
		)
	}
	
	var chestRefresh = function(){
		$(".chest_model").remove();
		chestFillData(1);
	}
	
	//跳转到夺宝页
	var routerToDuobao = function(treasureId){
		if (origin()) {
			return;
		}
		
		$.showIndicator();
		$.router.load("duobao.html?treasureId="+treasureId);
	}
	
	
	var loadMoreFlag = false;
	//上滑加载更多
	function bottomLoadmore(curPage){
		$(document).off('infinite', '#p-carshare .infinite-scroll');
		
		if (totlePage == 1) {
			return;
		}
		
		$(document).on('infinite', '#p-carshare .infinite-scroll',function() {
			if (loadMoreFlag) {
				return;
			}
			
			loadMoreFlag = true;
			$.showIndicator();
			
			setTimeout(function(){
				if (totlePage && curPage >= totlePage){
					setTimeout(function(){
						$.hideIndicator();
						$.toast('没有更多数据', 1000, 'toast-80');
						setTimeout(function(){
							loadMoreFlag = false;
						},1000);
					},200)
					return;
				}
				
				
				chestFillData(curPage+1,function(){
					setTimeout(function(){
						$.hideIndicator();
						$.toast('加载成功', 1000, 'toast-80');
						loadMoreFlag = false;
					},100)
				});
				
			},100)
	
		})
	}
	
	
	//判断来源，微信／qq返回true 弹出提示
	var origin = function(){
		var returnText = false;
		var browserText = function(){
			if ($.device.ios){
				return "在Safari中打开";
			}else{
				return "在浏览器中打开";
			}
			
		}
		
		if (navigator.userAgent.indexOf("QQ") > -1 || navigator.userAgent.indexOf("MicroMessenger") > -1) {
			$.popup(
				'<div class="popup wxqq">' +
					'<div class="u-arrow"></div>'+
	                '<div class="u-alert">'+
	                    '<div class="alert-text">点击右上角按钮<br />选择“'+browserText()+'”<br />前往购买</div>'+
	                '</div>'+
				'</div>'
			)
			
			$(".wxqq").click(function(){
				$.closeModal(".wxqq")
			});
			returnText = true;;
		}
		return returnText;
	}
	var bind = function(){
		$('.car-down-btn').click(function(){
			if (origin()) {
				return;
			}
			
			if ($.device.ios) {
				window.location.href = "https://itunes.apple.com/us/app/huang-jin-duo-bao/id1144036041?l=zh&ls=1&mt=8"; //苹果下载地址
			}else{
//				window.location.href = "http://doumob.oss-cn-hangzhou.aliyuncs.com/cps/hjdb_v"+version+"_"+chennel+".apk"; //安卓下载地址
				window.location.href = "http://alicdn.2333db.com/apk/yyj-2.4.3-fenxiang_312250.apk";
			}
		});
	}
	
	var fill = function(){
		var num = $.getUrlParam('carId');
		$('.a-car-num').html(num);
	}
	
	
	var init = function(){
		bind();
		chestFillData(1);	//tab对应的请求数据
		dropRefresh("#p-carshare",chestRefresh);	//下拉刷新
		fill();
	}
	return {
		init: init,
		routerToDuobao: routerToDuobao
	}
})(Zepto)


carshare.init();
