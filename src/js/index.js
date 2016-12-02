$(function(){
	try{
		//服务器数据页数数组，0、1、2分别对应第1、2、3个tab
		lData.indexTotalPage = [];
		
		//弹出的红包活动事件
		$(".alert-resiger-bonus .alert-close").click(function(){
			$(".alert-resiger-bonus").hide();
		});
		$(".alert-resiger-bonus .alert-button").click(function(){
			var alertRegisterUrl = "iframe.html?url=http://www.2333db.com/activity/act-register.html?backurl="+lData.bannerBackUrl
			if (/127.0.0.1/.test(window.location.href)) {
				alertRegisterUrl = "iframe.html?url=http://127.0.0.1:8020/duobao_v2.1.0/other/src/act-recharge.html?backurl=http://127.0.0.1:8020/duobao_v2.1.0/src/register.html";
			}
			$.router.load(alertRegisterUrl);
		});
		
		//弹出的保存到桌面事件
		$(".save-to-desktop").find(".icon-close").click(function() {
			$(".save-to-desktop").hide();
		});
		
		//tab是否处于fixed状态flag
		window.indexFixedTabFlag = 0;
		
		//调用加载banner、中奖信息、bar信息
		homePageInfo();
		
		if ($(".index-top-list").find(".list-li-all").length > 0) {
			indexTopList();
		}
	
		
		//调用首页信息滚动事件
//		scrollInfo();		//滚动中奖信息
		
		//banner下方list点击事件
//		indexTopList();
		
		//tab点击排序
		tabClick();
		
		//tab对应的请求数据
		tabSelect(0,1);
		
		//下拉刷新
		dropRefresh("#p-index",indexRefresh);
//		bottomLoadmore();	//上滑加载更多

		//调用tab fixed相关事件
		indexFixedTab();
	}catch(e){
		//TODO handle the exception
	}
})

//判断tab是否处于fixed
//相应修改了msui源码！！！
function indexFixedTab(){
	if (indexFixedTabFlag == 2) {
		var indexOffset = 2* parseInt($("html").css("font-size"));
		
		$('.a-tab-list').fixedTab({offset:indexOffset});

		window.sessionStorage.setItem("indexFiedTop",$("#p-index .pull-to-refresh-layer").height()+$("#p-index .swiper-container").height()+$("#scrollInfo").height());
	}else{
		setTimeout(function(){
			indexFixedTab();
		},100);
	}
	
	
}

//确定图片高度，防止图片加载失败，样式错误
function cardHeight(){
	var images = $("#p-index .index_model .card-header .card-cover");
	console.log(images)
	images.height(images.width()*0.655817);
}


function scrollInfoFill(o){
	var scrolltextWidth = 0;
	$("#scrollWrapper").append(
		'<div ontouchmove="javascript:event.preventDefault();" id="scrollInfo">'+
			'<div class="scroll-image"></div>'+
			'<div class="scrolltestbar">'+
				'<div class="scrolltext-box"></div>'+
			'</div>'+
		'</div>'
	);
	$.each(o.notiInfoList, function(i,n) {
		$("<div class='scrolltext' style='color:#b0b0b0;'>" +
			"恭喜" +
			"<span class='a8'>" + n.nickName + "</span>" +
			n.luckyTime + "前获得" +
			"<span style='color:#5d5d5d;'>" + n.goodsTitle + "</span>" +
			"</div>"
		).appendTo($("#scrollInfo").find(".scrolltext-box"));
		scrolltextWidth += $(".scrolltext").eq(i).width();
	});
	$(".scrolltext-box").width(scrolltextWidth + 30);
	$("#scrollInfo").width($(".scrolltext-box").width()-$("body").width());
	
	
	
	var timerTextInfo = null;
	if (!!$.device.android && !timerTextInfo) {
		$(".scrolltext-box").css("height","100%").removeClass("scrolltext-box").addClass("scrolltext-box2");;
		var sl = 0;
		if (timerTextInfo) {
			clearInterval(timerTextInfo)
		}
		$("#scrollInfo").css("width","100%");
		timerTextInfo = setInterval(function() {
			sl += 1;
			$(".scrolltestbar").scrollLeft(sl);
			if ($(".scrolltestbar").scrollLeft() >= $(".scrolltext-box2").width() - $("body").width() - 5) {
				sl = 0;
			}
		}, 20)
	}
	
	
	indexFixedTabFlag += 1;
}



//var timerTextInfo = null;
//中奖信息
function scrollInfo(){
//	if ($("#scrollInfo").length == 0) {
//		if (!!lData.homePageInfo) {
//			scrollInfoFill(lData.homePageInfo);
//		}else{
//			$.ajax({
//				type:"get",
//				url:lData.getUrl+"getLuckyInfo",
//				data:{
//					v: lData.srvVersion
//				},
//				async:true,
//				success: function(o){
//					scrollInfoFill(o)
//				}
//			})
//		}
//	}else{
//		indexFixedTabFlag += 1;
//	}
}



var clickNoLoadmore;
//tab点击排序
function tabClick(){
	$(".a-tab-list").find("a").click(function(){
		if (!$(this).hasClass("active")) {
//			$(document).off('infinite', '#p-index .infinite-scroll');
			
			clickNoLoadmore = 1;
			$(".pull-to-refresh-content").scrollTop(0);
			
			$(".i_load_more").html("加载更多&darr;");
			
			$(".a-tab-list a").removeClass("active");
			$(this).addClass("active");
			$(".index-active").hide();
			$("#index-active-"+$(this).index()).show();
			
			
			tabSelect($(this).index(),1);
		}
	})
}

//不同tab对应请求
function tabSelect(acIdx,curPage){
	//有缓存则利用缓存，不主动请求
	if ($("#index-active-"+acIdx).find(".index_model").length > 0 && window.sessionStorage.getItem("indexForceRefresh") == null) {
		return;
	}else if (window.sessionStorage.getItem("indexForceRefresh") != null){
		if (window.sessionStorage.getItem("indexForceRefresh").indexOf(acIdx) == -1) {
			return;
		}
	}
	
//	lData.indexTotalPage[acIdx] = 0;
	//不同tab栏加载相应数据
	$("#index-active-"+acIdx).find(".index_model").remove();
	if (acIdx == 0) {
		indexFillData(acIdx,curPage,2);
	}else if(acIdx == 1){
		indexFillData(acIdx,curPage,3);
	}else if(acIdx == 2){
		indexFillData(acIdx,curPage,1);
	}
	
	indexBottomLoadmore()
}


//请求服务器
function indexFillData(acIdx,curPage,idx,callback){
	$.showIndicator();
	$.ajax({
		type:"get",
		url:lData.getUrl+"getTreasureList",
		data:{
			"currentPage":curPage,
			"order":idx,
			v: lData.srvVersion,
			type: 1
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			if (curPage > o.totalPage) {
				return;
			}
			
			lData.indexTotalPage[acIdx] = o.totalPage
			
			$.each(o.treasureInfoList, function(i,n) {
				appendData($("#index-active-"+acIdx),n);
			});
			
			
			//强制刷新
			if (window.sessionStorage.getItem("indexForceRefresh") != null) {
				var indexForceRefresh = window.sessionStorage.getItem("indexForceRefresh").split(",");
				var leftFroceRefresh = $.map(indexForceRefresh, function(n) {
					return n == acIdx ? null : n;
				});
				if (leftFroceRefresh.length == 0){
					window.sessionStorage.removeItem("indexForceRefresh");
				}else{
					//设置强制刷新 tabindex数组
					window.sessionStorage.setItem("indexForceRefresh",leftFroceRefresh);
				}
			}
			
			
			if (!!callback) {
				callback();
			}
			
			setTimeout(function(){
				if (o.totalPage > 1) {
					$(".i_load_more").show();
				}
				$.hideIndicator();
			},200)
		}
	});
	
}


//填充数据
function appendData(ele,n){
	$(ele).append(
		'<div onclick="routerToDuobao('+n.treasureId+')" name="'+n.treasureId+'" class="index_model card">'+
			'<div valign="bottom" class="card-header color-white no-border no-padding">'+
//				'<img class="card-cover" src=\"'+n.goodsInfo.picUrl+'\" >'+
				'<div class="card-cover" style="background:url('+n.goodsInfo.picUrl+') center center no-repeat;background-size:contain;"></div>'+
			'</div>'+
			'<div class="card-content">'+
				'<div class="card-content-inner list_info">'+
					'<div class="clearfix stage_info">'+
						'<p class="stage_text">'+
//							'[<span>'+n.phaseNumber+'</span>期]'+
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
function indexRefresh(){
	var acIdx = $(".a-tab-list").find(".active").index();
	window.sessionStorage.setItem("indexForceRefresh",[acIdx]);
	tabSelect(acIdx,1);
	$(".i_load_more").html("加载更多&darr;");
	window.sessionStorage.removeItem("indexLoadFinish");
}



if (window.sessionStorage.getItem("indexLoadFinish")) {
	var indexLoadFinish = window.sessionStorage.getItem("indexLoadFinish").split(",");
}else{
	var indexLoadFinish = new Array(3);
}

//上拉加载更多
function indexBottomLoadmore(){
	$(document).off('infinite', '#p-index .infinite-scroll');
//	console.log(curPage)
	var loadMoreFlag = false;
	
	$(document).on('infinite', '#p-index .infinite-scroll',function() {
		if (loadMoreFlag) {
			return;
		}
		
		
		var acIdx = $(".a-tab-list").find(".active").index();
		var indexCurrentPageLength = $("#index-active-"+acIdx).find(".index_model").length;
		var indexCurrentPage = Math.ceil(indexCurrentPageLength/10);
		
		if (indexLoadFinish[acIdx] == 1) {
			window.sessionStorage.setItem("indexLoadFinish",indexLoadFinish)
			$(".i_load_more").html("没有更多数据");
			var cardName = [];
			$.each($("#index-active-"+acIdx).find(".index_model"), function(i,n) {
				if ($.inArray($(n).attr("name"),cardName) < 0) {
					cardName.push($(n).attr("name"));
					console.log(cardName)
				}else{
					console.log(n)
					$(n).remove();
				}
			});
			
			return;
		}
		
		
		if (indexCurrentPageLength < 10) {
			return;
		}
		
		
		
		loadMoreFlag = true;
		$.showIndicator();
		
		setTimeout(function(){
			var curPage = (Math.ceil(indexCurrentPageLength/10) + 1);
			if (curPage>lData.indexTotalPage[acIdx]) {
				setTimeout(function(){
					$.hideIndicator();
					$.toast('没有更多数据', 1000, 'toast-80');
					$(".i_load_more").html("没有更多数据");
					setTimeout(function(){
						loadMoreFlag = false;
					},500);
					indexLoadFinish[acIdx] = 1;
				},200)
				return;
			}
			
			function indexToastLoadmore(){
				setTimeout(function(){
					$.hideIndicator();
					$.toast('加载成功', 1000, 'toast-80');
					setTimeout(function(){
						loadMoreFlag = false;
					},500);
				},100)
			}
			
			
			var curPage = indexCurrentPage+1;
			if (acIdx == 0) {
				indexFillData(acIdx,curPage,2,indexToastLoadmore());
			}else if(acIdx == 1){
				indexFillData(acIdx,curPage,3,indexToastLoadmore());
			}else if(acIdx == 2){
				indexFillData(acIdx,curPage,1,indexToastLoadmore());
			}

			
		},100)

	})
}



//barInfo
function barInfo(barInfo){
	if (!barInfo) {
		return;
	}
	
	$.each(barInfo,function(i,n){
		$("#barInfoList").append(
			'<li name="'+n.bannerType+'" class="list-li-all list-li-'+i+'" style="width:'+100/barInfo.length+'%;">'+
				'<i style="background:url('+n.webImage+') 0 0 no-repeat;background-size:contain;"></i>'+
				'<p>'+n.bannerName+'</p>'+
			'</li>'
		);
	});
	
	indexTopList();
}


//跳转到夺宝页
function routerToDuobao(treasureId){
	$.showIndicator();
	$.router.load("duobao.html?treasureId="+treasureId);
}



function homePageInfo(){
	if ($("#p-index .swiper-container .swiper-slide img").length > 0) {
		indexFixedTabFlag += 1;
	}else{
//		if (window.sessionStorage.getItem("bannerInfo")) {
//			var bannerInfo = $.parseJSON(window.sessionStorage.getItem("bannerInfo"));
//			fillBanner(bannerInfo);
//		}else{
//			$.ajax({
//				type:"post",
//				url:lData.getUrl + "getBannerInfo",
//				data: {
//					v: lData.srvVersion
//				},
//				async:true,
//				dataType: "json",
//				success: function(o){
//					console.log(o);
//					if (o.stateCode == 0) {
//						window.sessionStorage.setItem("bannerInfo",JSON.stringify(o.bannerInfo));
//						fillBanner(o.bannerInfo);
//					}else{
//						$.alert(o.message);
//					}
//				}
//			});
//		}

		if (!!lData.homePageInfo) {
			fillBanner(lData.homePageInfo.bannerInfo);
			if ($("#scrollInfo").length == 0) {
				scrollInfoFill(lData.homePageInfo);
			}
			barInfo(o.barInfo);
		}else{
			$.ajax({
				type:"post",
				url:lData.getUrl + "getHomePageInfo",
				data: {
					v: lData.srvVersion
				},
				async:true,
				dataType: "json",
				success: function(o){
					console.log(o);
					if (o.stateCode == 0) {
						lData.homePageInfo = o;
						fillBanner(o.bannerInfo);
						if ($("#scrollInfo").length == 0) {
							scrollInfoFill(o);
						}
						barInfo(o.barInfo);
					}else{
						$.alert(o.message);
					}
				}
			});
		}
	}
}



//banner点击跳转
function bannerClickFuc(bannerUrl){
	if (!!/extract/.test(bannerUrl)) {
		if (!lData.userId) {
			$.alert("请先登陆",function(){
				$.router.load("personal.html");
			});
			return;
		}
	}
	if (!/iframe.html?url=/.test(bannerUrl)) {
		bannerUrl = "iframe.html?url="+bannerUrl;
	}
	$.router.load(bannerUrl);
}


//banner图
function fillBanner(bannerInfo){
//	$.each(bannerInfo, function(i,n) {
//		$("#p-index .swiper-container .swiper-wrapper").append(
//			'<div class="swiper-slide"><img src="'+n.webImage+'" alt=""></div>'
//		);
//	});
	
	var extractUrl = (!!lData.calcTestUrl) ? "?test=1&userId="+lData.userId+"&userKey="+window.localStorage.getItem("userKey")+"&from=web" : "?userId="+lData.userId+"&userKey="+window.localStorage.getItem("userKey")+"&from=web";
	
	//banner数据 数组
//	var bannerInfoLocal = [{
////		bannerUrl: "http://www.2333db.com/activity/act-register.html?backurl="+lData.bannerBackUrl,
//		bannerUrl: "iframe.html?url=http://www.2333db.com/activity/act-register.html?backurl="+lData.bannerBackUrl,
//		webImage: "img/banner-register.jpg"
//	},{
////		bannerUrl: "http://www.2333db.com/activity/act-recharge.html?backurl="+lData.bannerBackUrl,
//		bannerUrl: "iframe.html?url=http://www.2333db.com/activity/act-recharge.html?backurl="+lData.bannerBackUrlRecharge,
//		webImage: "img/banner-recharge.jpg"
//	},{
//		bannerUrl: "iframe.html?url=http://www.2333db.com/html/extract.html"+extractUrl,
//		webImage: "img/banner-card.jpg"
//	}
////	,{
////		bannerUrl: "iframe.html?url=http://www.2333db.com/activity/act-qun.html",
////		webImage: "img/banner-qun.png"
////	}
//	]
	
//	//若本地测试加载相应本地数据
//	if (/127.0.0.1/.test(window.location.href)) {
//		bannerInfoLocal[0].bannerUrl = "iframe.html?url=http://127.0.0.1:8020/duobao_v"+lData.version+"/other/src/act-register.html?backurl=http://127.0.0.1:8020/duobao_v"+lData.version+"/src/register.html";
//		bannerInfoLocal[1].bannerUrl = "iframe.html?url=http://127.0.0.1:8020/duobao_v"+lData.version+"/other/src/act-recharge.html?backurl=http://127.0.0.1:8020/duobao_v"+lData.version+"/src/personal.html";
//		bannerInfoLocal[2].bannerUrl = "iframe.html?url=http://127.0.0.1:8020/duobao_v"+lData.version+"/other/html/extract.html"+extractUrl;
////		bannerInfoLocal[3].bannerUrl = "iframe.html?url=http://127.0.0.1:8020/duobao_v"+lData.version+"/other/src/act-qun.html";
//	}
	
	
	
	
	console.log(bannerInfo)
	//getBanner
	$.each(bannerInfo, function(i,n) {
		if (!/127.0.0.1/.test(window.location.href)) {
			if (!!/register/.test(n.bannerUrl)) {
				n.bannerUrl = n.bannerUrl+"?backurl="+lData.bannerBackUrl;
			}else if(!!/recharge/.test(n.bannerUrl)){
				n.bannerUrl = n.bannerUrl+"?backurl="+lData.bannerBackUrlRecharge;
			}else if(!!/extract/.test(n.bannerUrl)) {
				n.bannerUrl = n.bannerUrl+extractUrl;
			}
		}else{
			if (!!/register/.test(n.bannerUrl)) {
				n.bannerUrl = "http://127.0.0.1:8020/duobao_v"+lData.version+"/other/src/act-register.html?backurl=http://127.0.0.1:8020/duobao_v"+lData.version+"/src/register.html";
			}else if(!!/recharge/.test(n.bannerUrl)){
				n.bannerUrl = "http://127.0.0.1:8020/duobao_v"+lData.version+"/other/src/act-recharge.html?backurl=http://127.0.0.1:8020/duobao_v"+lData.version+"/src/personal.html";
			}else if(!!/extract/.test(n.bannerUrl)) {
				n.bannerUrl = "http://127.0.0.1:8020/duobao_v"+lData.version+"/other/html/extract.html"+extractUrl;
			}else if(!!/qun/.test(n.bannerUrl)) {
				n.bannerUrl = "http://127.0.0.1:8020/duobao_v"+lData.version+"/other/src/act-qun.html";
			}
		}
	});
	
	
	//填充banner数据数组到相应banner
//	$.each(bannerInfoLocal, function(i,n) {
	$.each(bannerInfo, function(i,n) {
		$("#p-index .swiper-container .swiper-wrapper").append(
			'<div class="swiper-slide">'+
				'<a onclick="bannerClickFuc(\''+n.bannerUrl+'\')">'+
					'<img src="'+n.webImage+'" alt="">'+
				'</a>'+
			'</div>'
		);
	});
	
	//加载msui-extend的js、css
	_getScript("libs/msui-extend.min.js",function(){
		_getCss("libs/msui-extend.min.css",function(){
			//调用msui中swiper
			$(".swiper-container").swiper({
				pagination: '.swiper-pagination',
				slidesPerView: 1,
				paginationClickable: true,
				spaceBetween: 0,
				centeredSlides: true,
				autoplay: 3000,
				autoplayDisableOnInteraction: false
			})
			
			indexFixedTabFlag += 1;
		})
		
	})
}


function indexTopList(){
	$(".index-top-list").find(".list-li-all").on('click',function(){
		var bannerType = $(this).attr("name");
		if (bannerType == 1) {
			$.router.load("share.html");
		}else if(bannerType == 2) {
			$.router.load("results.html",false);
		}else if(bannerType == 4){
			$.alert("qq群号为：<span>21859967</span>");
		}else{
			$.alert("TODO");
		}
		
	});
}
