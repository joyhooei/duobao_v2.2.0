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
	try{
		if (recordType == 2) {
			var flag = 1,
				ele = "#have-lottery-content";
		}else if(recordType == 1) {
			var flag = 0,
				ele = "#not-lottery-content";
		}
		
		recordGetData(flag,ele);
		recordTabClick();
	}catch(e){
		//TODO handle the exception
	}
})


function getType(type){
	$(".active").removeClass("active");
	$(".buttons-fixed").find("a").eq(type).addClass("active");
	$(".tabs").find(".tab").eq(type).addClass("active");
}


function recordTabClick(){
	$(".j-record-tab").find("a").click(function(){
		window.sessionStorage.setItem("recordTab",$(this).index());
		recordGetDataType($(this).index());
	});
}

function recordGetDataType(type){
	if (type == 0) {
		
	}else if(type == 1) {
		var ele = "#not-lottery";
		recordGetData(0,ele);
	}else if (type == 2) {
		var ele = "#have-lottery";
		recordGetData(1,ele);
		dropRefresh("#have-lottery-content",record2Refresh);	//下拉刷新
	}
}

//请求数据
function recordGetData(flag,ele){
	if (window.sessionStorage.getItem("recordForceRefresh") == null && $(ele).find(".card").length > 0) {
		return;
	}
	
	$.ajax({
		type:"post",
		url:luanmingli.getUrl+"getTreasureRecordList",
		data:{
			userId : luanmingli.userId,
			flag : flag,
			v: luanmingli.srvVersion
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			
			if (o.participantInfoList.length != 0) {
				$(ele).find(".z_not_record").show();
				$(ele).find(".now_participate").click(function(){
					$.router.load("index.html");
				});
			}else{
				$(ele).find(".z_my_prize_model").remove();
				$.each(o.participantInfoList, function(i,n) {
					recordFillData(n,flag);
				});
			}
		}
	});
}

//填充数据
function recordFillData(n,flag){
	//已揭晓
	if (flag == 1) {
		var ele = "#have-lottery-content";
	//未揭晓
	}else if (flag == 0) {
		var ele = "#not-lottery-content";
	}
	$(ele+" .cont").append(
		'<div onclick="haveLotteryOld('+n.treasureInfo.treasureId+');" class="card z_my_prize_model">'+
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
										'<span onclick="haveLotteryDetail('+n.treasureInfo.treasureId+',\''+encodeURIComponent(n.treasureInfo.goodsInfo.describe)+'\','+n.treasureInfo.phaseNumber+',\''+n.treasureInfo.lotteryTime+'\','+n.luckCode+','+n.buyCount+');" style="font-size:.7rem;margin-left:.7rem;color:#359df5;">查看详情</span>'+
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
	if (flag == 1) {
		return '<div class="card-footer">'+
					'<span>幸运得主：<span style="color:#359df5;">'+n.userInfo.nickName+'</span></span>'+
					'<span>'+
						'<span><span style="color:#da3651;">'+n.luckyBuyCount+'</span>人次</span>'+
						'<span onclick="haveLotteryNewDuobao('+n.treasureInfo.treasureId+');" class="button">再次购买</span>'+
					'</span>'+
				'</div>'
	}else if (flag == 0) {
		return '<div class="card-footer not-lottert-footer">'+
					'<span class="record-schedule-box">'+
						'<p class="clearfix">'+
							'<span class="pull-left">总需'+n.treasureInfo.totalCount+'人次</span>'+
							'<span class="pull-right">剩余'+(n.treasureInfo.totalCount-n.treasureInfo.participantCount)+'人次</span>'+
						'</p>'+
						'<div class="record-schedule-outer">'+
							'<p style="width:'+(n.treasureInfo.participantCount/n.treasureInfo.totalCount*100)+'%;" class="record-schedule-inner"></p>'+
						'</div>'+
					'</span>'+
					'<span>'+
						'<span onclick="haveLotteryNewDuobao('+n.treasureInfo.treasureId+');" class="button">追加</span>'+
					'</span>'+
				'</div>'
	}
}


//购买期数的详情
function haveLotteryOld(treasureId){
	$.router.load("duobao.html?treasureId="+treasureId);
}

//查看详情
function haveLotteryDetail(treasureId,name,phase,time,lucky,count){
	event.stopPropagation();
	$.router.load("buydetail.html?treasureId="+treasureId+"&name="+name+"&phase="+phase+"&time="+time+"&lucky="+lucky+"&count="+count);
}

//再次购买
function haveLotteryNewDuobao(treasureId){
	event.stopPropagation();
	$.router.load("duobao.html?treasureId="+treasureId+"&type=2");
}

//已揭晓下拉刷新
function record2Refresh(){
	recordGetData(1);
//	$.toast('刷新成功', 1000, 'toast-10');
}
