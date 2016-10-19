var recordFlag,recordEle;

$(function(){
	if (/幸运码/.test($(".popup").html())) {
		$.closeModal(".popup");
	}
	
	if (window.sessionStorage.getItem("recordTab") != null ) {
		var recordType = window.sessionStorage.getItem("recordTab");
	}else{
		var recordType = $.getUrlParam("type");
	}
	
	getType(recordType);
	
	recordGetDataType(recordType);
	recordTabClick();
	
})

//点击不同按钮进入响应tab
function getType(type){
	$(".active").removeClass("active");
	$(".buttons-fixed").find("a").eq(type).addClass("active");
	$(".tabs").find(".tab").eq(type).addClass("active");
}

//tab点击切换
function recordTabClick(){
	$(".j-record-tab").find("a").click(function(){
		window.sessionStorage.setItem("recordTab",$(this).index());
		recordGetDataType($(this).index());
	});
}

function recordGetDataType(recordType) {
	//已开奖
	if (recordType == 2) {
		recordFlag = 1;
		recordEle = "#have-lottery";
	//未开奖
	}else if(recordType == 1) {
		recordFlag = 0;
		recordEle = "#not-lottery";
	}else if(recordType == 0) {
		recordFlag = -1;
		recordEle = "#all-lottery";
	}
	
	
	if (!window.sessionStorage.getItem("recordForceRefresh") && $(recordEle).find(".card").length > 0) {
		return;
	}else if (window.sessionStorage.getItem("recordForceRefresh")){
		var refreshIndex = window.sessionStorage.getItem("recordForceRefresh").split("&");
		if (refreshIndex.indexOf(recordType) == -1 && $(recordEle).find(".card").length > 0) {
			return;
		}
		var refreshLeftIndex = $.map(refreshIndex,function(n){
			return n == recordType ? null : n;
		})
		window.sessionStorage.setItem("recordForceRefresh",refreshLeftIndex.join("&"));
	}
	
	
	$.showIndicator();
	recordGetData(recordFlag,recordEle,1);
	
	dropRefresh('#p-record',recordRefresh);
	
	recordBottomLoadmore();
}

lData.recordTotlePage=[];

//请求数据
function recordGetData(flag,ele,curPage,callback){
	
	$.ajax({
		type:"post",
		url:lData.getUrl+"getTreasureRecordList",
		data:{
			userId : lData.userId,
			flag : flag,
			currentPage : curPage,
			v: lData.srvVersion
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			
			if (o.participantInfoList.length == 0) {
				$(ele).find(".cont").hide();
				$(ele).find(".z_not_record").show();
				$(ele).find(".now_participate").click(function(){
					$.router.load("index.html");
				});
			}else{
				lData.recordTotlePage[flag] = o.totalPage;
				$(ele).find(".cont").show();
				$(ele).find(".z_not_record").hide();
				if (curPage == 1) {
					$(ele).find(".card").remove();
				}
				$.each(o.participantInfoList, function(i,n) {
					recordFillData(n,flag,ele);
				});
			}
			
			if (!!callback) {
				callback();
			}
			
			setTimeout(function(){
				$.hideIndicator();
			},500)
		}
	});
}


//填充数据
function recordFillData(n,flag,ele){
	$(ele+" .cont").append(
		'<div onclick="recordToDuobaoOld('+n.treasureInfo.treasureId+');" class="card z_my_prize_model">'+
			'<div class="card-content">'+
				'<div class="list-block media-list">'+
					'<ul>'+
						'<li class="item-content clearfix">'+
							'<div style="background:url('+n.treasureInfo.goodsInfo.icon+') center center no-repeat;background-size:contain;" class="item-media prize_image"></div>'+
							'<div class="item-inner clearfix">'+
								'<div class="item-title-row">'+
									'<div class="item-title z_prize_title">'+n.treasureInfo.goodsInfo.describe+'</div>'+
								'</div>'+
								'<div class="item-subtitle z_prize_content">'+
									'<div class="record_finish_text">'+
										'<span>期号：第'+n.treasureInfo.phaseNumber+'期</span>'+
									'</div>'+
									'<div class="record_finish_text">'+
										'我已参与：'+
										'<span class="mi-prize-havebought">'+n.buyCount+'</span>'+
										'人次'+
										'<span onclick="recordToLotteryDetail('+n.treasureInfo.treasureId+',\''+encodeURIComponent(n.treasureInfo.goodsInfo.describe)+'\','+n.treasureInfo.phaseNumber+',\''+n.treasureInfo.lotteryTime+'\',\''+n.luckCode+'\','+n.buyCount+');" style="font-size:.7rem;margin-left:.4rem;padding:.3rem;color:#359df5;">查看详情</span>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</li>'+
					'</ul>'+
				'</div>'+
			'</div>'+
			recordFooterData(n,flag)+
		'</div>'
	);
}


//底部
function recordFooterData(n,flag){
	//已揭晓
//	if (flag == 1 || n.treasureInfo.status == 0) {
	if (n.treasureInfo.status == 0) {
		return '<div class="card-footer">'+
					'<span style="'+ucBrowserStyle0()+'">幸运得主：<span style="color:#359df5;">'+n.userInfo.nickName+'</span></span>'+
					'<div style="'+ucBrowserStyle()+'">'+
						'<span><span style="color:#da3651;">'+n.luckyBuyCount+'</span>人次</span>'+
						'<div onclick="recordToDuobaoNew('+n.treasureInfo.treasureId+',\''+n.treasureInfo.onSell+'\');" class="button">再次购买</div>'+
					'</div>'+
				'</div>'
	//未揭晓
	}else if (n.treasureInfo.status == 1) {
//		if (n.treasureInfo.totalCount == n.treasureInfo.participantCount) {
//			return '<div class="card-footer not-lottert-footer">'+
//						'<span class="record-schedule-box" style="color:#da3651;font-size:.6rem;">'+
//							'<span class="icon icon-clock" style="font-size:.7rem;"></span>'+
//							'&nbsp;即将揭晓&nbsp;&nbsp;正在计算，请稍后……'+
//						'</span>'+
//						'<span>'+
//							'<span onclick="recordToDuobaoNew('+n.treasureInfo.treasureId+');" class="button">再次购买</span>'+
//						'</span>'+
//					'</div>'
//		}else{
			return '<div class="card-footer not-lottert-footer">'+
						'<span class="record-schedule-box" style="'+ucBrowserStyle0()+'">'+
							'<p class="clearfix">'+
								'<span class="pull-left">总需'+n.treasureInfo.totalCount+'人次</span>'+
								'<span class="pull-right">剩余'+(n.treasureInfo.totalCount-n.treasureInfo.participantCount)+'人次</span>'+
							'</p>'+
							'<div class="record-schedule-outer">'+
								'<p style="width:'+(n.treasureInfo.participantCount/n.treasureInfo.totalCount*100)+'%;" class="record-schedule-inner"></p>'+
							'</div>'+
						'</span>'+
						'<span style="'+ucBrowserStyle()+'">'+
							'<span onclick="recordToDuobaoNew('+n.treasureInfo.treasureId+',\''+n.treasureInfo.onSell+'\');" class="button">追加</span>'+
						'</span>'+
					'</div>'
//		}
	}else if (n.treasureInfo.status == 2) {
		return '<div class="card-footer not-lottert-footer">'+
						'<span class="record-schedule-box" style="color:#da3651;font-size:.6rem;'+ucBrowserStyle0()+'">'+
							'<span class="icon icon-clock" style="font-size:.7rem;"></span>'+
							'&nbsp;即将揭晓&nbsp;&nbsp;正在计算，请稍后……'+
						'</span>'+
						'<span style="'+ucBrowserStyle()+'">'+
							'<span onclick="recordToDuobaoNew('+n.treasureInfo.treasureId+',\''+n.treasureInfo.onSell+'\');" class="button">再次购买</span>'+
						'</span>'+
					'</div>'
	}
}

function ucBrowserStyle0(){
	if (navigator.userAgent.indexOf('UCBrowser') > -1 || !supportCss3('justify-content')){
		return 'position:absolute;left:.75rem;top:.5rem;';
	}else{
		return "";
	}
}

function ucBrowserStyle(){
	if (navigator.userAgent.indexOf('UCBrowser') > -1 || !supportCss3('justify-content')){
		return 'position:absolute;right:.75rem;top:.5rem;';
	}else{
		return "";
	}
}

//所购买的详情
function recordToDuobaoOld(treasureId){
	$.showIndicator();
	$.router.load("duobao.html?treasureId="+treasureId);
}

//查看详情
function recordToLotteryDetail(treasureId,name,phase,time,lucky,count){
	event.stopPropagation();
	$.showIndicator();
	$.router.load("buydetail.html?treasureId="+treasureId+"&name="+name+"&phase="+phase+"&time="+time+"&lucky="+lucky+"&count="+count);
}

//再次购买
function recordToDuobaoNew(treasureId,onsell){
	event.stopPropagation();
//	if (!onsell || onsell == "null" || onsell == "undefined") {
//		$.alert("商品已下架，请选择其它商品");
//		return;
//	}
	if (onsell == 1) {
		$.showIndicator();
		$.router.load("duobao.html?treasureId="+treasureId+"&type=2");
	}else{
		$.alert("商品已下架，请选择其它商品");
	}
	
	
}


//下拉刷新
function recordRefresh(){
	recordGetData(recordFlag,recordEle,1);
//	$.toast('刷新成功', 1000, 'toast-10');
}


//上拉加载更多
function recordBottomLoadmore(){
	$(document).off('infinite', '#p-record .infinite-scroll');
//	console.log(curPage)
	var loadMoreFlag = false;
	
	$(document).on('infinite', '#p-record .infinite-scroll',function() {
		if (loadMoreFlag) {
			return;
		}
		
		if ($(recordEle).find(".card").length < 10) {
			return;
		}
		
		
		
		loadMoreFlag = true;
		$.showIndicator();
		
		setTimeout(function(){
			console.log(lData.recordTotlePage)
			var curPage = (Math.ceil($(recordEle).find(".card").length/10) + 1);
			if (curPage>lData.recordTotlePage[recordFlag]) {
				setTimeout(function(){
					$.hideIndicator();
					$.toast('没有更多数据', 1000, 'toast-80');
					loadMoreFlag = false;
				},200)
				return;
			}
			
			recordGetData(recordFlag,recordEle,curPage,function(){
				setTimeout(function(){
					$.hideIndicator();
					$.toast('加载成功', 1000, 'toast-80');
					loadMoreFlag = false;
				},100)
			});

			
		},100)

	})
}
