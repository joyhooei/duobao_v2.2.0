$(function(){
	
	try{
		window.sessionStorage.removeItem("awardCardRadioCardFinish");
		window.sessionStorage.removeItem("awardCardRadioGoldFinish");
		window.sessionStorage.removeItem("awardCardJdFinish");
		
		
		if (window.sessionStorage.getItem("prizeForceRefresh") == null && $("#p-prize").find(".z_my_prize_model").length > 0) {
			return;
		}
		
		if (window.sessionStorage.getItem("prizeForceRefresh") == 1) {
			prizeRefresh();
			window.sessionStorage.removeItem("prizeForceRefresh");
		}
		
		
//		$("#p-prize").find(".z_my_prize_model").remove();
		
//		$.showIndicator();
		prizeGetData(1);
		
		dropRefresh("#p-prize",prizeRefresh);	//下拉刷新
		prizeBottomLoadmore();
	}catch(e){
		//TODO handle the exception
	}
})

function prizeGetData(curPage,callback){
	$.showIndicator();
	
	$.ajax({
		type:"post",
		url:luanmingli.getUrl+"getMyPrize",
		data:{
			userId : luanmingli.userId,
			currentPage : curPage,
			v: luanmingli.srvVersion
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.stateCode == 0){
				if (o.prizeList.length == 0 && o.currentPage == 1) {
					noPrize();
				}else{
					if ($("#p-prize").find(".z_not_record").length > 0) {
						$("#p-prize").find(".z_not_record").remove();
					}
					
					luanmingli.prizeTotlePage = o.totalPage;
					
					window.sessionStorage.setItem("prize"+o.currentPage,JSON.stringify(o));
					
					havePrize(o);
				}
				window.sessionStorage.removeItem("prizeForceRefresh")
				
				if (!!callback) {
					callback();
				}
				
				setTimeout(function(){
					$.hideIndicator();
				},500)
			}else{
				$.alert(o.message);
			}
		}
	});
}



function noPrize(){
	if ($("#p-prize").find(".z_not_record").length > 0) {
		return;
	}
	
	$("#p-prize").find(".content").append(
		'<div class="content-block z_not_record">'+
			'<div class="no_record">您还没有获奖记录哦</div>'+
			'<button onclick="prizeBackhome();" class="global_button button now_participate">立即夺宝</button>'+
		'</div>'
	);
		
}


function prizeBackhome(){
	$.router.load("index.html");
}


function havePrize(o){
	$.each(o.prizeList, function(i,n) {
		$("#p-prize").find(".content").append(
			'<div onclick="prizeToDuobaoOld('+n.treasureId+');" class="card z_my_prize_model">'+
//			'<div onclick="prizeAward('+i+',this,'+n.goodstype+','+n.treasureId+');" class="card z_my_prize_model">'+
				'<div class="card-content">'+
					'<div class="list-block media-list">'+
						'<ul>'+
							'<li class="item-content clearfix">'+
								'<div class="item-media prize_image" style="background-image:url('+n.icon+');"></div>'+
								'<div class="item-inner clearfix">'+
									'<div class="item-title-row">'+
										'<div class="item-title z_prize_title">'+n.description+'</div>'+
									'</div>'+
									'<div class="item-subtitle z_prize_content">'+
										'<p>期号：'+n.phaseNumber+'</p>'+
										'<p>总需：'+n.totalCount+'人次</p>'+
										'<p>幸运号码：'+n.luckyCode+'</p>'+
										'<p>本期参与：'+n.buyCount+'人次'+
											'<span style="padding:.3rem;margin-left:.3rem;color:#359df5;" onclick="prizeToLotteryDetail('+n.treasureId+',\''+encodeURIComponent(n.description)+'\','+n.phaseNumber+',\''+n.lotteryTime+'\','+n.luckyCode+','+n.buyCount+')">查看详情</span>'+
										'</p>'+
										'<p>揭晓时间：'+n.lotteryTime+'</p>'+
									'</div>'+
								'</div>'+
							'</li>'+
						'</ul>'+
					'</div>'+
				'</div>'+
				'<div class="card-footer">'+
					'<span></span>'+
					'<span>'+
						'<span onclick="prizeAward('+i+',this,'+n.goodstype+','+n.treasureId+');" class="btn btn1 '+hasdoneClass(n.hasdone,n.goodstype,n.shared)+'">'+hasdoneText(n.hasdone,n.goodstype,n.shared)+'</span>'+
//						'<span onclick="shareButton(\''+n.treasureId+'\',\''+n.hasdone+'\',\''+n.shared+'\',\''+n.description+'\','+n.goodstype+');" class="btn btn1 '+hasdoneClass(n.hasdone,n.goodstype,n.shared)+'">'+hasdoneText(n.hasdone,n.goodstype,n.shared)+'</span>'+
//						'<span onclick="prizeShare();" class="btn btn2">分享</span>'+
					'</span>'+
				'</div>'+
			'</div>'
		);
	});
}


//function payUCbrowser(){
//	if (navigator.userAgent.indexOf('UCBrowser') > -1 || !supportCss3('justify-content')) {
//		return 'position:absolute;right:.75rem;top:.5rem;';
//	}else{
//		return "";
//	}
//}
	

//所购买的详情
function prizeToDuobaoOld(treasureId){
	$.router.load("duobao.html?treasureId="+treasureId);
}

//查看详情
function prizeToLotteryDetail(treasureId,name,phase,time,lucky,count){
	event.stopPropagation();
	$.router.load("buydetail.html?treasureId="+treasureId+"&name="+name+"&phase="+phase+"&time="+time+"&lucky="+lucky+"&count="+count);
}

//领奖按钮文字
function hasdoneText(hasdone,goodstype,shared){
	if (goodstype == 2 || goodstype == 202 || goodstype == 203) {
			return "奖品详情";
	}else{
		//领奖流程
		if (hasdone == 0) {
			return "确认收货地址";
		}else if(hasdone == 2) {
			return "等待商品派发";
		}else if(hasdone == 3) {
			return "确认收货";
		}else if(hasdone == 1) {
//				return "已签收";
			if (shared == 0) {
				//未晒单
				return "晒单";
			}else if (shared == 1) {
				//已晒单
				return "已晒单";
			}else if (shared == 2) {
				//已派发
				return "晒单金币已派发";
			}else if (shared == 3) {
				//未派发
//				return "晒单金币未派发";
				return "已晒单";
			}
			
			
		}
	}
}

//领奖文字样式
function hasdoneClass(hasdone,goodstype,shared){
	//领奖
//	if (hasdone == 2 || (hasdone == 1 && shared != 0) || (hasdone == 1 && (goodstype ==201 || goodstype == 202 || goodstype == 203))) {
	if (hasdone == 2 || (hasdone == 1 && shared != 0) ) {
		return "btn3";
	}else{
		return "";
	}
}

//领奖流程
function prizeAward(i,that,goodstype,treasureId){
	event.stopPropagation();
//	if (hasdone != 1) {
		//领奖
//		if (type == 2) {
////			$.router.load("duobao.html?treasureId="+treasureId+"&type=2");
//			return;
//		}
		
	//	if ($(that).hasClass("btn3")) {
	//		return;
	//	}
		
		var idx = Math.ceil($(that).parents(".z_my_prize_model").index()/10);
		var prizeArrObj = $.parseJSON(window.sessionStorage.getItem("prize"+idx));
		window.sessionStorage.setItem("prizeInfo",JSON.stringify(prizeArrObj.prizeList[i]))
		window.sessionStorage.setItem("prizeAddress",JSON.stringify(prizeArrObj.userAddressList))
		
		if (goodstype == 2) {
			$.router.load("award-point.html");
		}else if(goodstype == 202 || goodstype == 203){
			$.router.load("award-card.html",true);
		}else{
			$.router.load("award.html");
		}
//	}else{

//	}
}


//发布晒单
function shareButton(treasureId,hasdone,shared,goodsinfo,goodstype){
	if (hasdone == 1 && goodstype == 1) {
		event.stopPropagation();
		//晒单
		if (shared == 0) {
//		if (1){
			//未晒单
			$.router.load("share-help.html?treasureId="+treasureId+"&goodsinfo="+goodsinfo);
		}
	}
}


//分享
function prizeShare(){
	event.stopPropagation();
	$.alert("TODO")
}



//下拉刷新
function prizeRefresh(){
	luanmingli.prizeNomore = "";
	$("#p-prize").find(".z_my_prize_model").remove();
	prizeGetData(1);
//	$.toast('刷新成功', 1000, 'toast-10');
}


//上拉加载更多
function prizeBottomLoadmore(){
	$(document).off('infinite', '#p-prize .infinite-scroll');
	var loadMoreFlag = false;
	
	$(document).on('infinite', '#p-prize .infinite-scroll',function() {
		if (loadMoreFlag || luanmingli.prizeNomore) {
			return;
		}
		
		if ($("#p-prize").find(".content").find(".card").length < 10) {
			return;
		}
		
		
		
		loadMoreFlag = true;
		$.showIndicator();
		
		setTimeout(function(){
			var curPage = (Math.ceil($("#p-prize").find(".content").find(".card").length/10) + 1);
			if (curPage>luanmingli.prizeTotlePage) {
				setTimeout(function(){
					luanmingli.prizeNomore = true;
					$.hideIndicator();
					$.toast('没有更多数据', 1000, 'toast-80');
					loadMoreFlag = false;
				},200)
				return;
			}
			
			prizeGetData(curPage,function(){
				setTimeout(function(){
					$.hideIndicator();
					$.toast('加载成功', 1000, 'toast-80');
					loadMoreFlag = false;
				},100)
			});
			
		},100)

	})
}