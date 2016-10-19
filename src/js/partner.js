$(function(){
	var treasureId = $.getUrlParam("treasureId");
	
	try{
		if ($(".partner_model").attr("name") == treasureId) {
			return;
		}
		$.showIndicator();
		getData(treasureId,1);
		
		dropRefresh("#p-partner",duobaoRefresh);	//下拉刷新
		
		
	}catch(e){
		//TODO handle the exception
		console.log(e)
	}
})


var partnerTotlePage;

//请求服务器
function getData(treasureId,curPage,removeFlag,callback){
	$.ajax({
		type:"get",
		url:lData.getUrl+"getCurrentPhaseParticipantList",
		data:{
			treasureId:treasureId,
			currentPage:curPage,
			v: lData.srvVersion
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (removeFlag) {
				$("#partner-content-box").find("*").remove();
			}
			
			//无数据
			if (o.participantInfoList.length == 0 && o.totalPage == 0) {
				if ($(".z_p_loadmore").length > 0) {
					return;
				}
				$("#p-partner").find(".content").append(
					'<div class="z_p_loadmore pull-load-more">暂无数据</div>'
				);
				return;
			}
			
			
			
			partnerTotlePage = o.totalPage;
			
			partnerFillData(o);
			
			
			if ($(".z_p_loadmore").length == 0) {
				$("#p-partner").find(".content").append(
					'<div class="z_p_loadmore pull-load-more">加载更多&darr;</div>'
				);
			}
			
			if (o.totalPage == 1) {
				$(".z_p_loadmore").remove();
			}
			
			if (!!callback) {
				callback();
			}
			
			partnerBottomLoadmore(o.currentPage);
			
			setTimeout(function(){
				$.hideIndicator();
			},500)
		}
	});
}



function partnerFillData(o){
	$.each(o.participantInfoList, function(i,n) {
		$("#partner-content-box").append(
			'<div class="card partner_model" name="'+n.treasureInfo.treasureId+'">'+
				'<div class="card-header">'+
					'<div style="margin-top: .2rem;width:100%;"><span class="z_pa_time_text">参与时间</span><span class="z_pa_time">'+n.partyTime+'</span></div>'+
				'</div>'+
				'<div onclick="pShowAllLuckNum(\''+n.luckyNumber+'\')" valign="bottom" class="card-header color-white z_into_luckyCode create-popup">'+
					'<div class="partner-info-left">'+
						'<div><span class="z_pa_name">'+n.userInfo.nickName+'</span>参与 <span class="z_pa_num">'+n.buyCount+'</span>人次</div>'+
						'<div style="margin-top: .2rem;">'+function(ip){if(ip){return '<span class="z_pa_ip_text">'+ip.split("&")[0]+'</span>IP <span class="z_pa_ip">'+ip.split("&")[1]+'</span>';}else{return '<span style="color:#b0b0b0;">旧版用户IP未获取</span>';}}(n.userInfo.ip)+'</div>'+
//						<span class="z_pa_ip_text">'+n.userInfo.ip.split("&")[0]+'</span>IP <span class="z_pa_ip">'+n.userInfo.ip.split("&")[1]+'</span>
					'</div>'+
					'<span class="icon icon-right pull-right"></span>'+
				'</div>'+
			'</div>'
		);
	});
}



function pShowAllLuckNum(luckyNumber){
	var luckyNum = luckyNumber.split("&");
	//动态生成幸运码页
	var popupHTML =
		'<div class="popup popup-luckycode close-popup">' +
			'<p class="text-center" style="margin-top:.6rem;margin-bottom:.3rem;color:#5d5d5d;">幸运码</p>' +
				'<div style="height:7.2rem;overflow:auto;">'+
					'<ul class="a-db-luckyNum-box row no-gutter list-block z_lucky_code text-center" style="list-style:none;margin:0;padding:0;color:#b0b0b0;">' +
					'</ul>' +
				'</div>'+
		'</div>'
	$.popup(popupHTML);

	$.each(luckyNum, function(i,n) {
		$("<li></li>", {
			"class": "col-25", //布局 每行3个
			text: n,
		}).appendTo(".a-db-luckyNum-box");
	});
	

	$(".popup-overlay").click(function() {
		$.closeModal(".popup");
	})
}



//下拉刷新
function duobaoRefresh(){
	$.showIndicator();
	window.sessionStorage.setItem("partnerForceRefresh",1);
	var treasureId = $.getUrlParam("treasureId");
//	$("#partner-content-box").find("*").remove();
	getData(treasureId,1,true);
//	setTimeout(function(){
//		$.hideIndicator();
//		$.toast('刷新成功', 1000, 'toast-10');
//	},500)
}


//上滑加载更多
function partnerBottomLoadmore(curPage){
	$(document).off('infinite', '#p-partner .infinite-scroll');
	console.log(curPage)
	var loadMoreFlag = false;
	
	$(document).on('infinite', '#p-partner .infinite-scroll',function() {
		if (loadMoreFlag) {
			return;
		}
		
		loadMoreFlag = true;
		$.showIndicator();
		
		setTimeout(function(){
			var treasureId = $.getUrlParam("treasureId");
			
			if (partnerTotlePage && curPage >= partnerTotlePage){
				setTimeout(function(){
					$.hideIndicator();
					$(".z_p_loadmore").html("没有更多数据");
					$.toast('没有更多数据', 1000, 'toast-80');
					loadMoreFlag = false;
				},200)
				return;
			}
			
			
			getData(treasureId,curPage+1,'',function(){
				setTimeout(function(){
					$.hideIndicator();
					$.toast('加载成功', 1000, 'toast-80');
					loadMoreFlag = false;
				},100)
			});
			
		},100)

	})
	
}