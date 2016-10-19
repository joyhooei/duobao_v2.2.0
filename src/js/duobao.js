$(function(){
	if (/幸运码/.test($(".popup").html())) {
		$.closeModal(".popup");
	}
	
	window.pageVisible = 0;
//	pageVisibility.visibilitychange(function(){
//	    if (!this.hidden) {
//	    		if (pageVisible) {
//	    			return;
//	    		}
//	        var treasureId = $.getUrlParam("treasureId");
//			getDetail(treasureId);
//			window.pageVisible ++;
//	    }
//	})
	
	
	if (window.sessionStorage.getItem("paying")) {
		window.sessionStorage.removeItem("paying");
	}
	
	try{
		var treasureId = $.getUrlParam("treasureId");
		var type =1
		if ($.getUrlParam("type") == 2) {
			type = 2;
		}
		getDetail(treasureId,type);
		dropRefresh("#p-duobao",duobaoRefresh);	//下拉刷新
		
		setTimeout(function(){
			$.hideIndicator();
		},500)
	}catch(e){
		//TODO handle the exception
	}
})


function getDetail(treasureId,type){
	$.showIndicator();
	$.ajax({
		type:"get",
		url:lData.getUrl+"getTreasureDetail",
		data:{
			treasureId:treasureId,
			userId:lData.userId,
			type:type,
			v: lData.srvVersion
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.stateCode == 0) {
				window.sessionStorage.setItem("payGoodsType",o.treasureInfo.goodstype);
				
				//详情信息
				duobaoFillData(o);
				
				//往期揭晓
				if (o.previousPhaseNumber) {
					fillLastData(o);
				}
				
				//用户参与的人次、幸运码
				if (o.myLuckyNumber) {
					var luckNumSplit = o.myLuckyNumber.split("&");
					var luckNum = $.map(luckNumSplit, function(n) {
						return n ? n : null;
					});
					fillLuckyNum(luckNum);
				}
				
				//添加底栏
				fillButton(o);
			}else{
				$.alert(o.message);
			}
		}
	});
}


function duobaoFillData(o){
	$("#duobao-detail-data").find("*").remove();
	
	$("#duobao-detail-data").append(
		'<div valign="bottom" class="card-header color-white no-border no-padding">'+
			'<img class="z_d_image card-cover" src="'+o.treasureInfo.goodsInfo.picUrl+'" alt="">'+
		'</div>'+
		'<div class="card-content">'+
			'<div class="card-content-inner" id="db-goods-info">'+
				'<p class="title_name"><span class="z_prizeTitle">'+o.treasureInfo.goodsInfo.describe+'</span></p>'+
				scheduleInfo(o)+
			'</div>'+
		'</div>'+
		'<div class="card-footer d_detail_linkto" onclick="dbDetailLink(\''+o.treasureInfo.goodsInfo.detailUrl+'\','+o.treasureInfo.goodstype+');">'+
//			'<div class="d_link_text">商品详情</div>'+
			dbDetailText(o.treasureInfo.goodstype)+
			'<a class="icon icon-right pull-right"></a>'+
		'</div>'+
		'<div class="card-footer duobao_linkto" onclick="dbPartnerLink('+o.treasureInfo.treasureId+','+o.treasureInfo.participantCount+');">'+
			'<div class="d_link_text">本期参与者</div>'+
			'<a class="icon icon-right pull-right"></a>'+
		'</div>'
	);
}


function dbDetailText(goodstype){
	console.log(goodstype);
	if (goodstype == 2) {
		return '<div class="d_link_text">宝箱玩法</div>';
	}else{
		return '<div class="d_link_text">商品详情</div>';
	}
}


//进度信息 得奖信息
function scheduleInfo(o){
	if (o.treasureInfo.status == 1) {
		return '<span class="z_periodNum-box">期号：第<span class="z_periodNum">'+o.treasureInfo.phaseNumber+'</span>期</span>'+
				'<div class="duobao_schedule_bar d_schedule_bar">'+
					'<div class="duobao_scheduling d_scheduling" id="d_scheduling" style="width:'+(o.treasureInfo.participantCount/o.treasureInfo.totalCount*100)+'%;"></div>'+
				'</div>'+
//				'<p class="duobao_schedule_num clearfix">'+
//					'<span class="pull-left d_totle_person">'+o.treasureInfo.totalCount+'</span>'+
//					'<span class="pull-right d_left_person">'+(o.treasureInfo.totalCount-o.treasureInfo.participantCount)+'</span>'+
//				'</p>'+
				'<p class="clearfix" style="margin: .2rem 0 0 0;color: #5d5d5d;">'+
					'<span class="pull-left">总需'+o.treasureInfo.totalCount+'人次</span>'+
					'<span class="pull-right">剩余<span style="color:#359df5;">'+(o.treasureInfo.totalCount-o.treasureInfo.participantCount)+'</span></span>'+
				'</p>'
	}else{
		if (o.luckyUserOrder) {
			return '<div class="duobao-have-lottery">'+
						'<p>幸运得主：'+o.luckyUserName+'</p>'+
						'<p>用户ID：'+o.luckyUserOrder.userid+'</p>'+
						'<p>期号：第'+o.treasureInfo.phaseNumber+'期</p>'+
						'<p>本期参与：'+o.luckyUserOrder.buyCount+'人次</p>'+
						'<p>揭晓时间：'+o.treasureInfo.lotteryTime+'</p>'+
						'<p>幸运号码：<span style="font-size:1rem;">'+o.luckyUserOrder.luckCode+'</span></p>'+
						'<div onclick="linkToCalc('+o.treasureInfo.treasureId+','+o.treasureInfo.goodstype+');" class="button">计算详情</div>'+
					'</div>';
		}else{
			timeCutDown(o.treasureInfo.remainingTime);
			return '<div class="duobao-have-lottery">'+
						'<p>期号：第'+o.treasureInfo.phaseNumber+'期</p>'+
						'<p>揭晓时间：<span class="timeCutDown"><span></p>'+
						'<div onclick="linkToCalc('+o.treasureInfo.treasureId+','+o.treasureInfo.goodstype+');" class="button">计算详情</div>'+
					'</div>'
		}
	}
}

var CutDownTimer;
//开奖倒计时
function timeCutDown(time){
	if (CutDownTimer) {
		clearInterval(CutDownTimer);
	}
	CutDownTimer = setInterval(function(){
		time -= .01;
		var min = Math.floor(time/60) > 9 ? Math.floor(time/60) : "0"+Math.floor(time/60);
		var sec = Math.floor(time%60) > 9 ? Math.floor(time%60) : "0"+Math.floor(time%60);
		var milsec = (time%60 - Math.floor(time%60)).toString().substring(2,4);
		var currentTime = min+":"+sec+":"+milsec;
		$(".timeCutDown").html(currentTime);
		
		if (time <= 0) {
			clearInterval(CutDownTimer);
			var treasureId = $.getUrlParam("treasureId");
			getDetail(treasureId);
			window.sessionStorage.setItem("recordForceRefresh","0&1&2");
			window.sessionStorage.setItem("prizeForceRefresh","1");
			setTimeout(function(){
				$.hideIndicator();
			},500);
		}
	},10)
}

//跳转计算详情
function linkToCalc(treasureId,goodstype){
	if (goodstype == 2) {
		$.router.load("calc.html?treasureId="+treasureId+"&goodtype=2");
	}else{
		$.router.load("calc.html?treasureId="+treasureId);
	}
}


function fillLastData(o){
	$(".z_d_last").remove();
	
	$("#p-duobao").find(".content").append(
		'<div class="card z_d_last">'+
			'<div class="card-content">'+
				'<div class="card-content-inner clearfix">'+
					'<p class="d_last_luck pull-left">[第<span class="d_last_period">'+o.previousPhaseNumber+'</span>期]得主: <span class="d_last_name">'+o.previousLuckyUserName+'</span></p>'+
					'<div class="d_last_text pull-right">参与<span class="d_last_count">'+o.previousLuckyUserOrder.buyCount+'</span>人次</div>'+
				'</div>'+
			'</div>'+
			'<div onclick="dbWinRecordLink('+o.treasureInfo.treasureId+')" class="card-footer z_d_last_link" style="padding-left: 1rem;">'+
				'<div>往期揭晓</div>'+
				'<div class="icon icon-right pull-right"></div>'+
			'</div>'+
		'</div>'
	);
}

//底部购买tab
function fillButton(o){
	$(".z_db_box").remove();
	$(".content").removeClass("z-havelottery-bar-height");
	
	if (o.treasureInfo.status == 1) {
		$("#p-duobao").append(
			'<div class="z_db_box bar bar-footer">'+
				'<div class="card">'+
					'<div class="card-content">'+
						'<div class="row card-content-inner clearfix">'+
							'<div class="col-66 select_num pull-left">'+
								'<span onclick="dbNumMinus();" class="z_d_minus"><i class="d_minus"></i></span>'+
								'<span class="select_text">参与</span>'+
								'<input class="d_ipt_num" type="number" pattern="[0-9]*" value="'+o.treasureInfo.fewestCount+'" min="1" max="999"/>'+
								'<span class="select_text">人次</span>'+
								'<span onclick="dbNumPlus('+(o.treasureInfo.totalCount-o.treasureInfo.participantCount)+');" class="z_d_plus"><i class="d_plus"></i></span>'+
							'</div>'+
							'<div class="col-33 pull-right">'+
								'<button onclick="dbBuyButton('+o.treasureInfo.fewestCount+','+(o.treasureInfo.totalCount-o.treasureInfo.participantCount)+','+o.treasureInfo.treasureId+');" class="button global_button d_button">立即夺宝</button>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'
		);
	}else{
		if (o.isShow != 1 ) {
			$(".content").addClass("z-havelottery-bar-height");
			$("#p-duobao").append(
				'<div class="z-havelottery-bar z_db_box bar bar-footer">'+
					'<div class="card">'+
						'<div class="card-footer">'+
							'<span>商品已下架……</span>'+
						'</div>'+
					'</div>'+
				'</div>'
			)
		}else{
			$(".content").addClass("z-havelottery-bar-height");
			$("#p-duobao").append(
				'<div class="z-havelottery-bar z_db_box bar bar-footer">'+
					'<div class="card">'+
						'<div class="card-footer">'+
							'<span>新一期正在火热进行中……</span>'+
							'<span onclick="linkToNewDuobao('+o.treasureInfo.treasureId+');" class="btn">立即前往</span>'+
						'</div>'+
					'</div>'+
				'</div>'
			)
		}
	}
}

//前往新一期
function linkToNewDuobao(treasureId){
	$.router.load("duobao.html?treasureId="+treasureId+"&type=2");
}


function dbNumMinus(){
	var iptNum = $(".d_ipt_num").val()?$(".d_ipt_num").val():2;
	if (iptNum == 1) {
		return;
	}
	$(".d_ipt_num").val(iptNum-1);
}
function dbNumPlus(leftCount){
	var iptNum = $(".d_ipt_num").val()?parseInt($(".d_ipt_num").val()):0;
	if (iptNum == leftCount) {
		return;
	}
	$(".d_ipt_num").val(iptNum+1)
}


//立即购买按钮
function dbBuyButton(fewestCount,leftCount,treasureId){
	if (navigator.userAgent.indexOf("QQ") > -1 || navigator.userAgent.indexOf("MicroMessenger") > -1) {
		$.popup(
			'<div class="popup wxqq">' +
				'<div class="u-arrow"></div>'+
                '<div class="u-alert">'+
                    '<div class="alert-text">点击右上角按钮<br />选择“'+browserText()+'”<br />前往购买</div>'+
                '</div>'+
			'</div>'
		)
		
		$(".wxqq").click(function(){
			$.closeModal(".wxqq")
		});
		return;
	}
	
	
	if (!lData.userId) {
		$.router.load("login.html");
		return;
	}
	
	$.showIndicator();
	var iptNum = $(".d_ipt_num").val();
	if (!iptNum) {
		$.alert("请输入购买人次");
	}else{
		if (iptNum < fewestCount) {
			$.alert("请输入正确的购买人次");
		}else if (iptNum > leftCount) {
			$.alert("剩余人次不足，请重新输入");
		}else{
			dbSaveOrder(iptNum,treasureId);
		}
	}
}


function browserText(){
	if ($.device.ios){
		return "在Safari中打开";
	}else{
		return "在浏览器中打开";
	}
	
}


//提交订单
function dbSaveOrder(iptNum,treasureId){
	$.ajax({
		type:"post",
		url:lData.getUrl+"saveOrder",
		data:{
//			treasureId : treasureId,
////			userId : lData.userId,
//			userKey: window.localStorage.getItem("userKey"),
//			buyCount : iptNum,
			v: lData.srvVersion,
			content: encryptByDES(JSON.stringify({
				treasureId : treasureId,
				userKey: window.localStorage.getItem("userKey"),
				buyCount: iptNum,
				channelId: lData.channel
			}))
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.stateCode == 0) {
				window.sessionStorage.setItem("orderInfo",JSON.stringify(o.order));
				if (!!o.useHongbao) {
					window.sessionStorage.setItem("canUseBonus",JSON.stringify(o.useHongbao));
				}else{
					window.sessionStorage.removeItem("canUseBonus");
				}
				$.showIndicator();
				setTimeout(function(){
					$.router.load("pay.html");
				},200);
			}else{
				$.alert(o.message);
			}
		}
	});
}


//如果已购买本期 显示幸运码
function fillLuckyNum(luckyNum){
	$("#db-goods-info").append(
		'<div class="my-lucky-number">'+
			'<p>您已参与了：<span class="a8">'+luckyNum.length+'</span> 人次</p>'+
			'<div class="a-my-lucky-num clearfix">'+
				'<span>夺宝号码：</span>'+
			'</div>'+
		'</div>'
	);
	
	
	if (luckyNum.length <= 9) {
		$.each(luckyNum, function(i,n) {
			$(".a-my-lucky-num").append(
				'<span>'+n+'</span>'
			);
		});
	}else{
		$.each(luckyNum, function(i,n) {
			if (i <= 7) {
				$(".a-my-lucky-num").append(
					'<span>'+n+'</span>'
				);
			}
		});
		
		$(".a-my-lucky-num").append(
			'<span id="j-db-showAllLuckNum" style="color:#0684f3;">查看全部</span>'
		);
		$("#j-db-showAllLuckNum").click(function(){
			showAllLuckNum(luckyNum)
		})
	}
	
}


//显示全部幸运码
function showAllLuckNum(luckyNum){
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
		$.closeModal(".popup")
	})
}




//跳转
function dbDetailLink(href,goodstype){
	$.showIndicator();
	$.router.load("goods-detail.html?imgurl="+href+"&goodstype="+goodstype);
}

function dbPartnerLink(treasureId,participantCount){
	if (participantCount==0) {
		$.alert("本期暂无参与者");
		return;
	}
	$.showIndicator();
	$.router.load("partner.html?treasureId="+treasureId);
}
function dbWinRecordLink(treasureId){
	$.showIndicator();
	$.router.load("win-record.html?treasureId="+treasureId);
}



//下拉刷新
function duobaoRefresh(){
	window.sessionStorage.setItem("duobaoForceRefresh",1);
	var treasureId = $.getUrlParam("treasureId");
	var type = $.getUrlParam("type");
	if (!type) {
		type = 1;
	}
	getDetail(treasureId,type);
//	$.toast('刷新成功', 1000, 'toast-10');
}

