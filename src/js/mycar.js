var mycar = (function($){
	var totlePage;
	
	var chestFillData = function(curPage,cb){
		if (curPage == 1) {
			if ($(".chest_model").length > 0 && window.localStorage.getItem("chestForceRefresh") == null ){
				return;
			}
			$(".chest_model").remove();
		}
	
		$.showIndicator();
		
		if (!!$.getUrlParam('carId')) {
			var carData = {
				currentPage:curPage,
				v: luanmingli.srvVersion,
				carId: $.getUrlParam('carId')
			}
		}else{
			var carData = {
				currentPage:curPage,
				v: luanmingli.srvVersion,
				userId: luanmingli.userId
			}
		}
		
		
		$.ajax({
			type:"get",
			url:luanmingli.getUrl+"getTreasureList",
			data: carData,
			async:true,
			dataType:"json",
			success:function(o){
				if (o.stateCode == 0) {
					console.log(o);
					if (o.totalPage == 0 && o.treasureInfoList.length == 0) {
						$.alert('请输入正确的车牌号',function(){
							$.router.back();
						});
					}
					
					if (o.treasureInfoList.length == 0) {
						$.alert('暂无商品',function(){
							$.router.back();
						});
					}
					
					
					if (curPage > o.totalPage) {
						return;
					}
					
					$.each(o.treasureInfoList, function(i,n) {
						appendData("#p-mycar .content",n);
					});
					
					totlePage = o.totalPage;
					bottomLoadmore(o.currentPage);
					if (!!cb) {
						cb();
					}
					
					setTimeout(function(){
						$.hideIndicator();
					},500)
				}else if(o.stateCode == 3){
					$.alert('请输入正确的车牌号',function(){
						$.router.back();
					});
				}else{
					$.alert(o.message);
				}
			}
		});
	}
	
	var appendData = function(ele,n){
		$(ele).append(
			'<div onclick="mycar.routerToDuobao('+n.treasureId+')" class="chest_model card">'+
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
		$.showIndicator();
		$.router.load("duobao.html?treasureId="+treasureId);
	}
	
	
	var loadMoreFlag = false;
	//上滑加载更多
	function bottomLoadmore(curPage){
		$(document).off('infinite', '#p-mycar .infinite-scroll');
		
		$(document).on('infinite', '#p-mycar .infinite-scroll',function() {
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
	
	var bind = function(){
		$('.j-car-record').click(function(){
			$.router.load('car-record.html');
		});
	}
	
	
	var init = function(){
		chestFillData(1);	//tab对应的请求数据
		dropRefresh("#p-mycar",chestRefresh);	//下拉刷新
		bind();
	}
	return {
		init: init,
		routerToDuobao: routerToDuobao
	}
})(Zepto)


mycar.init();
