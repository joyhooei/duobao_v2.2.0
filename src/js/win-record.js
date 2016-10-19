$(function(){
	if (/幸运码/.test($(".popup").html())) {
		$.closeModal(".popup");
	}
	
	
	var treasureId = $.getUrlParam("treasureId");
	
	try{
		if ($(".partner_model").attr("name") == treasureId) {
			return;
		}
		
		
		if ($("#p-win-record .partner_model").length > 0) {
			return;
		}
		
		$.showIndicator();
		
		$("#win-record-content-box").find("*").remove();
		winGetData(treasureId,1);
		
		dropRefresh("#p-win-record",winRecordRefresh);	//下拉刷新
		
		partnerBottomLoadmore();
		
	}catch(e){
		//TODO handle the exception
		console.log(e)
	}
})


var winRecordTotlePage;

//请求服务器
function winGetData(treasureId,curPage,callback){
	
	$.ajax({
		type:"get",
		url:lData.getUrl+"getPreviousLuckyUserList",
		data:{
			treasureId:treasureId,
			currentPage:curPage,
			v: lData.srvVersion
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			//无数据
			if (o.participantInfoList!=null && o.participantInfoList.length == 0 && o.totalPage == 0 ) {
				$("#p-partner").find(".content").append(
					'<div class="z_p_loadmore pull-load-more">暂无数据</div>'
				);
				return;
			}else if(o.participantInfoList==null){
				$("#p-win-record").find(".z_p_loadmore").html("没有更多数据");
				return;
			}
			
			
			winRecordTotlePage = o.totalPage;
			
			winRecordFillData(o);
			
			if ($(".z_p_loadmore").length == 0) {
				$("#p-win-record").find(".content").append(
					'<div class="z_p_loadmore pull-load-more">加载更多&darr;</div>'
				);
			}
			
			if (o.totalPage == 1) {
				$(".z_p_loadmore").remove();
			}
			
			if (!!callback) {
				callback();
			}
			setTimeout(function(){
				$.hideIndicator();
			},500);
		}
	});
}

if (/android/i.test(navigator.userAgent)) {
	
}


function winRecordFillData(o){
	$.each(o.participantInfoList, function(i,n) {
		$("#win-record-content-box").append(
			'<div class="card partner_model">'+
				'<div class="card-header">'+
					'<div>期号:<span class="z_pa_period">'+n.treasureInfo.phaseNumber+'</span><span class="z_lp_time_text"> （揭晓时间 </span><span class="z_pa_time">'+n.treasureInfo.lotteryTime+'</span>）</div>'+
				'</div>'+
				'<div class="card-header" onclick="winRecordLinkPartner(\''+n.treasureInfo.treasureId+'\')">'+
					'<div class="partner-info-left">'+
						'<div>'+
							'<span>幸运得主</span>'+
							'<span class="z_pa_name">'+n.userInfo.nickName+'</span>'+
						'</div>'+
						'<div>'+
						function(ip){
							if (ip) {
								return '<span>'+
											'<span class="z_pa_ip_text">'+ip.split("&")[0]+'</span>IP'+ 
										'</span>'+
										'<span class="z_pa_ip">'+ip.split("&")[1]+'</span>'
							}else{
								return '<span style="color:#b0b0b0;">旧版用户IP未获取</span>';
							}
						}(n.userInfo.ip)
						+'</div>'+
						'<div>'+
							'<span>幸运号码</span>'+
							'<span class="z_pa_lucky_num">'+n.luckCode+'</span>'+
						'</div>'+
						'<div>'+
							'<span>本期参与</span>'+
							'<span class="z_pa_num">'+n.buyCount+'</span>人次'+
						'</div>'+
					'</div>'+
					'<span class="icon icon-right pull-right"></span>'+
				'</div>'+
			'</div>'
		);
	});
}


function winRecordLinkPartner(treasureId){
	$.showIndicator();
	$.router.load("partner.html?treasureId="+treasureId);
}



//下拉刷新
function winRecordRefresh(){
	window.sessionStorage.setItem("winRecordForceRefresh",1);
	var treasureId = $.getUrlParam("treasureId");
	$("#win-record-content-box").find("*").remove();
	winGetData(treasureId,1);
//	$.toast('刷新成功', 1000, 'toast-10');
}


//上滑加载更多
function partnerBottomLoadmore(){
//	$(document).off('infinite', '#p-win-record .infinite-scroll');
	var curPage = Math.ceil($("#p-win-record").find(".partner_model").length/10);
	
	console.log(curPage)
	var loadMoreFlag = false;
	
	$(document).on('infinite', '#p-win-record .infinite-scroll',function() {
		var curPage = Math.ceil($("#p-win-record").find(".partner_model").length/10);
		if (loadMoreFlag) {
			return;
		}
		
		loadMoreFlag = true;
		$.showIndicator();
		
		setTimeout(function(){
			var treasureId = $.getUrlParam("treasureId");
			
			if (winRecordTotlePage && curPage >= winRecordTotlePage){
				setTimeout(function(){
					$.hideIndicator();
					$(".z_p_loadmore").html("没有更多数据");
					$.toast('没有更多数据', 1000, 'toast-80');
					loadMoreFlag = false;
				},200)
				return;
			}
			
			
			winGetData(treasureId,curPage+1,function(){
				setTimeout(function(){
					$.hideIndicator();
					$.toast('加载成功', 1000, 'toast-80');
					loadMoreFlag = false;
				},100)
			});
			
		},100)

	})
	
}