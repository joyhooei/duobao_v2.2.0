var requestInit = function(){
	results.init();
	dropRefresh("#p-results",results.refresh);	//下拉刷新
}


var results = (function($){
	var totlePage;
	
	var request = function(curpage,callback){
		$.ajax({
			type:"post",
			url:lData.getUrl+"getLotteryTreasure",
			data:{
				v: lData.srvVersion,
				currentPage: curpage
			},
			async:true,
			dataType:"json",
			success:function(o){
				console.log(o);
				if (o.stateCode == 0) {
					totalPage = o.totalPage;
					if (o.treasureList == 0) {
						
					}else{
						fillData(o);
						remaining();
						bottomLoadmore(o.currentPage);
						if (!!callback) {
							callback();
						}
					}
				}else{
					$.alert(o.message);
				}
			}
		});
		
		$.hideIndicator();
	}
	var fillData = function(o){
		$.each(o.treasureList,function(i,n){
			$("#p-results .results-list").append(
				'<li onclick="results.toDetail('+n.treasureId+')">'+
					'<div class="results-img" style="background:url('+n.picUrl+') center center no-repeat;background-size:contain;"></div>'+
					'<p class="results-title">'+n.goodsName+'</p>'+
					(function(n){
						if (n.opencode * 1000 > new Date().getTime()) {
							//正在揭晓
							return '<div class="results-1">'+
										'<p class="text-1">期号：第'+n.phaseNumber+'期</p>'+
										'<p class="text-2">即将揭晓</p>'+
										'<div class="text-3 remaining" name="'+n.remainingTime+'"></div>'+
									'</div>'
						}else{
							//已揭晓
							return '<div class="results-2">'+
										'<p class="text-1">期号：第'+n.phaseNumber+'期</p>'+
										'<p class="text-2">获得者：<span style="color: #359df5;">'+n.luckyUserName+'</span></p>'+
										'<p>参与人次：'+n.buyCount+'人次</p>'+
										'<p>幸运号码：<span style="color: #fb4748;">'+n.luckyCode+'</span></p>'+
										'<p>揭晓时间：'+(function(time){
											var t = time.split("-")[1]+"-"+time.split("-")[2];
											var t2 = t.split(":")[0]+":"+t.split(":")[1];
											return t2;
										})(n.lotteryTime)+'</p>'+
									'</div>'
						}
					})(n)+
				'</li>'
			)
		});
	}
	var toDetail = function(treasureId){
		$.router.load("duobao.html?treasureId="+treasureId);
	}
	
	var clearInt = function(){
//		var resultsRemainingCount = window.sessionStorage.getItem("resultsRemainingCount");
//		if (!!resultsRemainingCount) {
//			$.each(new Array(parseInt(resultsRemainingCount)+1), function(i,n) {
//				clearInterval(i);
//			});
//		}
		$.each(new Array(1000), function(i) {
			clearInterval(i);
		});
		$.each(new Array($(".remaining").length), function(i) {
			clearInterval(i);
		});
	}
	
	var refresh = function(){
		$.showIndicator();
		clearInt();
		$("#p-results").find(".results-list li").remove();
		setTimeout(function(){
			request(1);
		},200)
	}
	
	var bottomLoadmore = function(curPage){
		$(document).off('infinite', '#p-results .infinite-scroll');
		console.log(curPage)
		var loadMoreFlag = false;
		
		
		$(document).on('infinite', '#p-results .infinite-scroll',function() {
			if (loadMoreFlag) {
				return;
			}
			
			if ($(".results-list li").length < 10) {
				return;
			}
			
			loadMoreFlag = true;
			$.showIndicator();
			
			setTimeout(function(){
				var treasureId = $.getUrlParam("treasureId");
				
				if (totalPage && curPage >= totalPage){
					setTimeout(function(){
						$.hideIndicator();
						$(".z_p_loadmore").html("没有更多数据");
						$.toast('没有更多数据', 1000, 'toast-80');
						loadMoreFlag = false;
					},200)
					return;
				}
				
				
				request(curPage+1,function(){
					setTimeout(function(){
						$.hideIndicator();
						$.toast('加载成功', 1000, 'toast-80');
						loadMoreFlag = false;
					},100)
				});
				
			},100)
	
		})
		
	}
	
	var remaining = function(){
		$(".remaining").each(function(i,n){
//			window.sessionStorage.setItem("resultsRemainingCount",i);
			var format  = function(n, length) {
			    return (Array(length).join('0') + n).substr(-length);
			}

			var time = parseInt($(n).attr("name"));
			var time = time*100;
			var timer = setInterval(function(){
				time -= 1;
				var h = Math.floor(time/100/60/60)>9 ? Math.floor(time/100/60/60):"0"+Math.floor(time/100/60/60);
				var m = Math.floor((time/100-h*3600)/60)>9 ? Math.floor((time/100-h*3600)/60):"0"+Math.floor((time/100-h*3600)/60);
				var s = Math.floor(time/100%60)>9 ? Math.floor(time/100%60):"0"+Math.floor(time/100%60);
				var ms = format(Math.floor(time%1000),2);
				
				if (h == 0) {
					$(n).html(m + ":" + s + ":" +ms);
				}else{
					$(n).html(h + ":" + m + ":" + s + ":" +ms);
				}
				
				if (time <= 0) {
					clearInterval(this);
					$(n).html("获取中");
					setTimeout(function(){
						refresh();
					},1000)
				}
			},10)
		});
	}
	
	var init = function(){
		clearInt();
		$("#p-results").find(".results-list li").remove();
		$(document).off('infinite', '#p-results .infinite-scroll');
		request(1);
	}
	
	return {
		init: init,
		refresh: refresh,
		remaining: remaining,
		toDetail: toDetail
	};
})(Zepto)

$(function(){
	requestInit();
})

