$(function(){
	try{
		lData.indexTotalPage = [];
		
		
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
		$(".save-to-desktop").find(".icon-close").click(function() {
			$(".save-to-desktop").hide();
		});
		
		
		
		window.indexFixedTabFlag = 0;
//		if (!timerTextInfo) {
			scrollInfo();		//滚动中奖信息
//		}

		swiperBanner();
		
		
		tabClick();		//tab点击排序
		tabSelect(0,1);	//tab对应的请求数据
		
		dropRefresh("#p-index",indexRefresh);	//下拉刷新
//		bottomLoadmore();	//上滑加载更多


		indexFixedTab();
	}catch(e){
		//TODO handle the exception
	}
})

//a.sort(function(a,b){
//          return a.a < b.a ? 1 : -1;
//      });


function indexFixedTab(){
	if (indexFixedTabFlag == 2) {
//		if (window.sessionStorage.getItem("indexFiedTop")) {
//			return;
//		}
		var indexOffset = 2* parseInt($("html").css("font-size"));
		$('.a-tab-list').fixedTab({offset:indexOffset});

		window.sessionStorage.setItem("indexFiedTop",$("#p-index .pull-to-refresh-layer").height()+$("#p-index .swiper-container").height()+$("#scrollInfo").height());
	}else{
		setTimeout(function(){
			indexFixedTab();
		},100);
	}
	
	
}



function cardHeight(){
	var images = $("#p-index .index_model .card-header .card-cover");
	console.log(images)
	images.height(images.width()*0.655817);
}




//var timerTextInfo = null;
//中奖信息
function scrollInfo(){
	if ($("#scrollInfo").length == 0) {
		$.get(lData.getUrl + "getLuckyInfo?v="+lData.version, function(o) {
			console.log(o)
			var scrolltextWidth = 0;
			$("<div ontouchmove='javascript:event.preventDefault();' id='scrollInfo'><div class='scroll-image'></div><div class='scrolltestbar'><div class='scrolltext-box'></div></div</div>").insertAfter($("#p-index .swiper-container"));
			$.each(o.notiInfoList, function(i) {
				$("<div class='scrolltext' style='color:#b0b0b0;'>" +
					"恭喜" +
					"<span class='a8'>" + o.notiInfoList[i].nickName + "</span>" +
					o.notiInfoList[i].luckyTime + "前获得" +
					"<span style='color:#5d5d5d;'>" + o.notiInfoList[i].goodsTitle + "</span>" +
					"</div>"
				).appendTo($("#scrollInfo").find(".scrolltext-box"));
				scrolltextWidth += $(".scrolltext").eq(i).width();
			});
			$(".scrolltext-box").width(scrolltextWidth + 30);
			$("#scrollInfo").width($(".scrolltext-box").width()-$("body").width());
			
			
			indexFixedTabFlag += 1;

//			var sl = 0;
//			if (timerTextInfo) {
//				clearInterval(timerTextInfo)
//			}
//			timerTextInfo = setInterval(function() {
//				sl += 1;
//				$(".scrolltestbar").scrollLeft(sl);
//				if ($(".scrolltestbar").scrollLeft() >= $(".scrolltext-box").width() - $("body").width() - 5) {
//					sl = 0;
//				}
//			}, 20)

		})
	}else{
		indexFixedTabFlag += 1;
	}
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
			v: lData.srvVersion
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
//	$.toast('刷新成功', 1000, 'toast-10');
}


//上滑加载更多
//function bottomLoadmore(){
//	var loadMoreFlag = false;
//	$(document).on('infinite', '#p-index .infinite-scroll',function() {
//		var acIdx = $(".a-tab-list").find(".active").index();
//		
//		if ($("#index-active-"+acIdx).height() < $("body").height()) {
//			return;
//		}
//		
//		
//		if (clickNoLoadmore) {
//			setTimeout(function(){clickNoLoadmore = 0;},500)
//			return;
//		}
//		
//		
//		var indexCurrentPage = Math.ceil($("#index-active-"+acIdx).find(".index_model").length / 10);
//		if (loadMoreFlag) {
//			return;
//		}
//		
//		if (indexCurrentPage >= lData.totalPage) {
//			loadMoreFlag = true;
//			if (lData.totalPage == 1) {
//				return;
//			}
//			$.toast('没有更多数据', 1000, 'toast-80');
//			$(".i_load_more").html("没有更多数据");
//			setTimeout(function(){
//				loadMoreFlag = false;
//			},2000)
//			return;
//		}
//		loadMoreFlag = true;
//		$.showIndicator();
//		
//		setTimeout(function(){
//			var acIdx = $(".a-tab-list").find(".active").index();
//			var curPage = indexCurrentPage+1;
//			if (acIdx == 0) {
//				indexFillData(acIdx,curPage,2);
//			}else if(acIdx == 1){
//				indexFillData(acIdx,curPage,3);
//			}else if(acIdx == 2){
//				indexFillData(acIdx,curPage,1);
//			}
//			$.hideIndicator();
//			$.toast('加载成功', 1000, 'toast-80');
//			loadMoreFlag = false;
//		},2000)
//
//	})
//	
//}

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
					loadMoreFlag = false;
					indexLoadFinish[acIdx] = 1;
				},200)
				return;
			}
			
			function indexToastLoadmore(){
				setTimeout(function(){
					$.hideIndicator();
					$.toast('加载成功', 1000, 'toast-80');
					loadMoreFlag = false;
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






//跳转到夺宝页
function routerToDuobao(treasureId){
	$.showIndicator();
	$.router.load("duobao.html?treasureId="+treasureId);
}



function swiperBanner(){
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
//		
//		}
		fillBanner();
	}
}


function fillBanner(bannerInfo){
//	$.each(bannerInfo, function(i,n) {
//		$("#p-index .swiper-container .swiper-wrapper").append(
//			'<div class="swiper-slide"><img src="'+n.webImage+'" alt=""></div>'
//		);
//	});

	var bannerInfoLocal = [{
//		bannerUrl: "http://www.2333db.com/activity/act-register.html?backurl="+lData.bannerBackUrl,
		bannerUrl: "iframe.html?url=http://www.2333db.com/activity/act-register.html?backurl="+lData.bannerBackUrl,
		webImage: "img/banner-register.jpg"
	},{
//		bannerUrl: "http://www.2333db.com/activity/act-recharge.html?backurl="+lData.bannerBackUrl,
		bannerUrl: "iframe.html?url=http://www.2333db.com/activity/act-recharge.html?backurl="+lData.bannerBackUrlRecharge,
		webImage: "img/banner-recharge.jpg"
	}]
	
	if (/127.0.0.1/.test(window.location.href)) {
		bannerInfoLocal[0].bannerUrl = "iframe.html?url=http://127.0.0.1:8020/duobao_v2.1.0/other/src/act-register.html?backurl=http://127.0.0.1:8020/duobao_v2.1.0/src/register.html";
		bannerInfoLocal[1].bannerUrl = "iframe.html?url=http://127.0.0.1:8020/duobao_v2.1.0/other/src/act-recharge.html?backurl=http://127.0.0.1:8020/duobao_v2.1.0/src/personal.html";
	}
	
	$.each(bannerInfoLocal, function(i,n) {
		$("#p-index .swiper-container .swiper-wrapper").append(
			'<div class="swiper-slide">'+
				'<a onclick="javascript:$.router.load(\''+n.bannerUrl+'\');">'+
					'<img src="'+n.webImage+'" alt="">'+
				'</a>'+
			'</div>'
		);
	});
	
	_getScript("libs/msui-extend.min.js",function(){
		_getCss("libs/msui-extend.min.css",function(){
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
