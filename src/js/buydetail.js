$(function(){
	try{
		var treasureId = $.getUrlParam("treasureId"),
			name = $.getUrlParam("name"),
			phase = $.getUrlParam("phase"),
			time = $.getUrlParam("time"),
			lucky = $.getUrlParam("lucky"),
			count = $.getUrlParam("count");
		
		
		if ($("#p-buydetail").find(".content-text").length > 0 ) {
			return;
		}
		
		buyDetail(treasureId,name,phase,time,lucky,count);
		dropRefresh("#p-buydetail",buydetailRefresh);	//下拉刷新
	}catch(e){
		//TODO handle the exception
	}
	
})


function buyDetail(treasureId,name,phase,time,lucky,count){
	$("#p-buydetail").find(".a-content").find("*").remove();
	
	$.ajax({
		type:"post",
		url:luanmingli.getUrl+"getMyTreasureDetail",
		data:{
			userId : luanmingli.userId,
			treasureId : treasureId,
			v: luanmingli.srvVersion
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			buyDetailFillData(o,name,phase,time,lucky,count);
		}
	});
	
}


function buyDetailFillData(o,name,phase,time,lucky,count){
	$("#p-buydetail").find(".a-content").append(
		'<div class="buy-detail-hd">'+
			'<p>'+decodeURIComponent(name)+'</p>'+
			'<p>期号：第'+phase+'期</p>'+
			timeLucky(time,lucky)+
		'</div>'+
		'<p class="buy-detail-md">我已参与<span class="a8">'+count+'</span>人次，以下是所有夺宝记录</p>'+
		'<div class="buy-detail-bt list-block">'+
			'<ul class="a-detail-ul">'+
				'<li class="item-content title-text">'+
					'<div class="item-inner">'+
						'<div class="item-title">夺宝时间</div>'+
						'<div class="item-after"><span class="right-text">参与人次</span><span class="right-text">操作</span></div>'+
					'</div>'+
				'</li>'+
			'</ul>'+
		'</div>'
	);
	
	$.each(o.participantInfoList, function(i,n) {
		$("#p-buydetail").find(".a-detail-ul").append(
			'<li class="item-content content-text">'+
				'<div class="item-inner">'+
					'<div class="item-title">'+n.cmtTime+'</div>'+
					'<div class="item-after">'+
						'<span class="right-text"><span class="a8">'+n.buyCount+'</span>人次</span>'+
						'<span onclick="buyDetailShowAllLuckNum(\''+n.luckyNumber+'\');" class="right-text" style="color:#359df5;">查看号码</span>'+
					'</div>'+
				'</div>'+
			'</li>'
		);
	});
	
}

function timeLucky(time,lucky){
	if (!time || !lucky) {
		return "";
	}else{
		return '<p>揭晓时间：'+time+'</p>'+
				'<p>本期幸运号码：<span class="a8">'+lucky+'</span></p>'
	}
}


function buyDetailShowAllLuckNum(luckyNumber){
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
function buydetailRefresh(){
	var treasureId = $.getUrlParam("treasureId"),
			name = $.getUrlParam("name"),
			phase = $.getUrlParam("phase"),
			time = $.getUrlParam("time"),
			lucky = $.getUrlParam("lucky"),
			count = $.getUrlParam("count");
			
	buyDetail(treasureId,name,phase,time,lucky,count);
//	$.toast('刷新成功', 1000, 'toast-10');
}