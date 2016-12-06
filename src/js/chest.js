$(function(){
	try{
		chestFillData(1);	//tab对应的请求数据
		dropRefresh("#p-chest",chestRefresh);	//下拉刷新
	}catch(e){
		//TODO handle the exception
	}
})


//请求服务器
function chestFillData(curPage){
	//有缓存则利用缓存，不主动请求
	if ($(".chest_model").length > 0 && window.localStorage.getItem("chestForceRefresh") == null ){
		return;
	}
	$(".chest_model").remove();

	$.showIndicator();
	$.ajax({
		type:"get",
		url:luanmingli.getUrl+"getTreasureList",
		data:{
			"currentPage":curPage,
			"order":1,
			"type":2,
			v: luanmingli.srvVersion
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			if (curPage > o.totalPage) {
				return;
			}
			
			$.each(o.treasureInfoList, function(i,n) {
				appendData("#p-chest .content",n);
			});
			
			
			//强制刷新
			window.localStorage.removeItem("chestForceRefresh");
			
			setTimeout(function(){
				$.hideIndicator();
			},500)
		}
	});
	
}


//填充数据
function appendData(ele,n){
	$(ele).append(
		'<div onclick="routerToDuobao('+n.treasureId+')" class="chest_model card">'+
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



//下拉刷新
function chestRefresh(){
	$(".chest_model").remove();
	chestFillData(1);
//	$.toast('刷新成功', 1000, 'toast-10');
}




//跳转到夺宝页
function routerToDuobao(treasureId){
	$.showIndicator();
	$.router.load("duobao.html?treasureId="+treasureId);
}
