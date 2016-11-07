$(function(){
	try{
		if ($("#award-card-pswd-description").length > 0) {
			$("#award-card-pswd-description").on("click",function(){
				if (/127.0.0.1/.test(window.location.href)) {
					var iframeParam = window.location.href.split("src/")[0] + "other/html/card-description.html";
					$.router.load("iframe.html?url="+iframeParam);
				}else{
					$.router.load("iframe.html?url=http://www.2333db.com/html/card-description.html");
				}
			});
		}
		
		
		$(".module4").remove();
		$(".module3").remove();
		$(".module2").remove();
		
		awardGetData();
		dropRefresh("#p-award-card",awardRefresh);	//下拉刷新
	}catch(e){
		//TODO handle the exception
	}
})

function awardGetData(){
	var awardObj = $.parseJSON(window.sessionStorage.getItem("prizeInfo"));
	awardStatus(awardObj);
}

function awardStatus(awardObj){
//	var addObj = $.parseJSON(window.sessionStorage.getItem("prizeAddress"));
	var hasdone = awardObj.hasdone;
	
//	console.log(addObj)
	console.log(awardObj)
	
	
	$(".j-address-button").find(".button").remove();
	$(".a-address-text").find("*").remove();
	$(".status-info-list").find(".active").removeClass("active");
	$(".j-confirm-box").find(".button").remove();
	$(".a-award-shiping").html("");
	$(".j-confirm-box").html("");
	
	awardFillData(awardObj);
	
	
	if (awardObj.hasdone == 1 ) {
		if ($(".j-card-finish-1 > div").length == 0) {
			alreadyFinish(awardObj);
		}
		return;
	}
	
	
	
	
	$(".status-info-list").find(".item-content").eq(1).addClass("active");
	
	
	if (awardObj.goodstype == 202) {
		$(".j-card-exchange-box .titletext").html("选择使用方式");
		$(".award-card-ul-box").show();
		$("#award-card-choose-way-btn").click(function(){
			window.sessionStorage.setItem("prizeForceRefresh",1);
			var checkedId = $(".j-card-exchange-way input[name='awardCardRadio']:checked").attr("id");
			if (checkedId == "awardCardRadio-1") {
				$.confirm("确定兑换卡号卡密？",function(){
					window.sessionStorage.setItem("prizeForceRefresh",1);
					awardCardRadioCard(awardObj);
				});
			}else if(checkedId == "awardCardRadio-2") {
				$.confirm("确定兑换等额金币？",function(){
					window.sessionStorage.setItem("prizeForceRefresh",1);
					awardCardRadioGold(awardObj);
				});
			}
		});
	}else if(awardObj.goodstype == 203){
		$(".j-card-exchange-box .titletext").html("确认领奖夺宝账号");
		$(".award-card-jd-box").show();
		$("#award-card-choose-way-btn").click(function(){
			window.sessionStorage.setItem("prizeForceRefresh",1);
			awardCardJd(awardObj);
		})
	}
	
	
	if (!!window.sessionStorage.getItem("awardCardRadioCardFinish")) {
		awardCardRadioCardFinish($.parseJSON(window.sessionStorage.getItem("awardCardRadioCardFinish")));
	}
	
	if (!!window.sessionStorage.getItem("awardCardRadioGoldFinish")) {
		awardCardRadioGoldFinish($.parseJSON(window.sessionStorage.getItem("awardCardRadioGoldFinish")));
	}
	
	if (!!window.sessionStorage.getItem("awardCardJdFinish")) {
		awardCardJdFinish($.parseJSON(window.sessionStorage.getItem("awardCardJdFinish")));
	}
	
	
	
//	if (hasdone == 0) {
//		$(".status-info-list").find(".item-content").eq(1).addClass("active");
//		$(".j-address-button").html("");
//		awardAddressButton(addObj);
//	}else if (hasdone == 3) {
//		$(".status-info-list").find(".item-content").eq(3).addClass("active");
//		awardAddFillData(addObj,awardObj);
//		awardShipFillData(awardObj);
//		awardConfirmGet();
//	}else if (hasdone == 1) {
//		awardAddFillData(addObj,awardObj);
//		awardShipFillData(awardObj);
//		$(".j-confirm-box").html(awardObj.commiteTime);
//		$(".status-info-list").find(".item-content").eq(4).addClass("active");
//	}else if (hasdone == 2) {
//		$(".status-info-list").find(".item-content").eq(2).addClass("active");
//		$(".a-award-shiping").html("请等待……");
//		awardAddFillData(addObj,awardObj);
//	}
}


//选择兑换卡密
function awardCardRadioCard(awardObj){
	$.showIndicator();
	$.ajax({
		type:"post",
		url:lData.getUrl+"exchangeCard",
		data:{
			v:lData.srvVersion,
			content:encryptByDES(JSON.stringify({
				userKey: window.localStorage.getItem("userKey"),
				optType: 2,
				treasureId: awardObj.treasureId
			}))
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.stateCode == 0) {
				window.sessionStorage.setItem("awardCardRadioCardFinish",JSON.stringify(o));
				awardCardRadioCardFinish(o);
			}else{
				$.alert(o.message);
			}
			$.hideIndicator();
		}
	});
	
}

//选择兑换卡密成功
function awardCardRadioCardFinish(o){
//	$(".j-card-exchange-time").html(timeNowFormat(new Date())); 
	$(".j-card-exchange-time").html(o.card.getCardTime); 
	$(".award-card-ul-box").hide();
	$(".award-card-button-box").hide();
	$(".award-card-choose-finish-1").show();
	$(".j-card-finish").show();
	$(".j-card-finish-1").show();
	if ($(".j-card-finish-1 > div").length == 0) {
		$(".j-card-finish-1").append(
			'<div>卡号：<span>'+o.card.cardNum+'</span></div>'+
			'<div>密码：<span>'+o.card.cardPwd+'</span></div>'
		);
	}
	$(".j-card-finish-1-info").show();
	$(".status-info-list").find(".active").removeClass("active");
	$(".j-card-finish-box .titletext").html("卡号/卡密 派发成功");	
//	$(".j-card-finish-time").html(timeNowFormat(new Date()));
	$(".j-card-finish-time").html(o.card.getCardTime); 
	$("#award-card-pswd-description").on("click",function(){
		if (/127.0.0.1/.test(window.location.href)) {
			var iframeParam = window.location.href.split("src/")[0] + "other/html/card-description.html";
			$.router.load("iframe.html?url="+iframeParam);
		}else{
			$.router.load("iframe.html?url=http://www.2333db.com/html/card-description.html");
		}
	});
}


//选择兑换金币
function awardCardRadioGold(awardObj){
	$.showIndicator();
	$.ajax({
		type:"post",
		url:lData.getUrl+"exchangeCard",
		data:{
			v:lData.srvVersion,
			content:encryptByDES(JSON.stringify({
				userKey: window.localStorage.getItem("userKey"),
				optType: 1,
				treasureId: awardObj.treasureId
			}))
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.stateCode == 0) {
//				$.ajax({
//					type:"post",
//					url:lData.getUrl+"userDetail",
//					data:{
//						v: lData.srvVersion,
//						content: encryptByDES(JSON.stringify({
//							userId:lData.userId
//						}))
//					},
//					async:false,
//					dataType:"json",
//					success:function(oo){
//						console.log(oo);
//						if (oo.stateCode == 0) {
//							var pointNum = oo.userInfo.detailInfo.points-lData.userInfo.detailInfo.points;
//							window.sessionStorage.setItem("awardCardRadioGoldNum",pointNum);
//							awardCardRadioGoldFinish(pointNum);
//							
//							lData.userInfo = oo.userInfo;
//							window.localStorage.setItem("userInfo",JSON.stringify(oo.userInfo));
//						}else{
//							$.alert(oo.message);
//						}
//						$.hideIndicator();
//					}
//				})
				
				window.sessionStorage.setItem("awardCardRadioGoldFinish",JSON.stringify(o));
				awardCardRadioGoldFinish(o);
			}else{
				$.alert(o.message);
			}
			$.hideIndicator();
		}
	})
	
}

//选择兑换金币完成
function awardCardRadioGoldFinish(o){
//	$(".j-card-exchange-time").html(timeNowFormat(new Date()));
	$(".j-card-exchange-time").html(o.card.getCardTime);
	$(".award-card-ul-box").hide();
	$(".award-card-button-box").hide();
	$(".award-card-choose-finish-2").show();
	$(".j-card-finish").show();
	$(".j-card-finish-2").show();
	$(".j-card-finish-2").append(
		'<div>您已兑换'+o.card.cardValue+'金币</div>'+
		'<div>请到个人页账户余额中查看</div>'
	);
	$(".status-info-list").find(".active").removeClass("active");
	$(".j-card-finish-box .titletext").html("金币派发成功");
//	$(".j-card-finish-time").html(timeNowFormat(new Date()));
	$(".j-card-finish-time").html(o.card.getCardTime);
}


//领取京东卡
function awardCardJd(awardObj){
	if (!$(".award-card-jd-ipt").val()) {
		$.alert("请输入手机号");
		return;
	}
	var telReg = /^(0|86|17951)?1\d{10}$/.test($(".award-card-jd-ipt").val());
	if (!telReg) {
		$.alert("请输入正确的手机号");
		return;
	}
	
	$.confirm("确定派发到该夺宝账号？",function(){
		window.sessionStorage.setItem("prizeForceRefresh",1);
		$.showIndicator();
		$.ajax({
			type:"post",
			url:lData.getUrl+"exchangeCard",
			data:{
				v:lData.srvVersion,
				content:encryptByDES(JSON.stringify({
					userKey: window.localStorage.getItem("userKey"),
					optType: 3,
					treasureId: awardObj.treasureId,
					telephone: $(".award-card-jd-ipt").val()
				}))
			},
			async:true,
			dataType:"json",
			success:function(o){
				console.log(o);
				
				if (o.stateCode == 0) {
					window.sessionStorage.setItem("awardCardJdFinish",JSON.stringify(o));
					awardCardJdFinish(o);
				}else{
					$.alert(o.message);
				}
				$.hideIndicator();
			}
		})
		
	});
}


//领取京东卡完成
function awardCardJdFinish(o){
//	$(".j-card-exchange-time").html(timeNowFormat(new Date()));
	$(".j-card-exchange-time").html(o.card.getCardTime);
	$(".award-card-jd-box").hide();
	$(".award-card-button-box").hide();
	$(".status-info-list").find(".active").removeClass("active");
	$(".j-card-finish-box .titletext").html("卡号/卡密派发成功");
//	$(".j-card-finish-time").html(timeNowFormat(new Date()));
	$(".j-card-finish-time").html(o.card.getCardTime);
	$(".j-card-finish").show();
	$(".j-card-finish-3").show();
}



//当前时间格式化
function timeNowFormat(time){
	var year = time.getFullYear();
	var month = time.getMonth() >= 9 ? (parseInt(time.getMonth())+1) : "0" + (parseInt(time.getMonth())+1)
	var day = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();
	var hour = time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
	var min = time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes();
	var sec = time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds();
	return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}


function alreadyFinish(awardObj){
	$.showIndicator();
	$.ajax({
		type:"post",
		url:lData.getUrl+"exchangeCard",
		data:{
			v:lData.srvVersion,
			content:encryptByDES(JSON.stringify({
				userKey: window.localStorage.getItem("userKey"),
				optType: 4,
				treasureId: awardObj.treasureId,
			}))
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.stateCode == 0 ) {
				if (awardObj.goodstype == 202 && !!o.card) {
					if (!o.card.cardValue) {
						awardCardRadioCardFinish(o);
					}else{
						awardCardRadioGoldFinish(o);
					}
				}else if(awardObj.goodstype == 203) {
					awardCardJdFinish(o);
				}
			}else{
				$.alert(o.message);
			}
			$.hideIndicator();
		}
	})
}



//商品详情
function awardFillData(n){
	$(".a-award-time").html(n.lotteryTime);
	
	if ($("#p-award-card").find(".module2").length > 0) {
		$("#p-award-card").find(".module2").remove();
	}
	
	$("#p-award-card").find(".module-first").after(
		'<div class="module2 card z_my_prize_model">'+
			'<div class="card-content">'+
				'<div class="list-block media-list">'+
					'<ul>'+
						'<li>'+
							'<div class="item-content">'+
								'<div class="item-inner">'+
            							'<div class="item-title label">商品信息</div>'+
            						'</div>'+
							'</div>'+
						'</li>'+
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
									'<p>本期参与：'+n.buyCount+'人次</p>'+
									'<p>揭晓时间：'+n.lotteryTime+'</p>'+
								'</div>'+
							'</div>'+
						'</li>'+
					'</ul>'+
				'</div>'+
			'</div>'+
		'</div>'
	);
}


function awardAddFillData(n,o){
	
	$(".j-address-button").html(o.addressTime);
	
	if ($("#p-award-card").find(".module3").length > 0) {
		$("#p-award-card").find(".module3").remove();
	}
	
	$("#p-award-card").find(".module-first").after(
		'<div class="module3 module1">'+
			'<div class="list-title">地址信息</div>'+
			'<div class="list-block">'+
				'<ul class="status-info-list">'+
					'<li class="item-content">'+
						'<div class="item-inner">'+
							'<div class="item-title">'+
								'<span>'+o.name+'</span><span class="pull-right" style="padding-right:.65rem;">'+o.telephone+'</span>'+
								'<p style="white-space:normal;">'+o.address+'</p>'+
							'</div>'+
						'</div>'+
					'</li>'+
				'</ul>'+
			'</div>'+
		'</div>'
	);
}


//物流信息
function awardShipFillData(n){
	$(".a-award-shiping").html(n.expressTime);
	
	if ($("#p-award-card").find(".module4").length > 0) {
		$("#p-award-card").find(".module4").remove();
	}
	
	$("#p-award-card").find(".module-first").after(
		'<div class="module4 module1">'+
			'<div class="list-title">物流信息</div>'+
			'<div class="list-block">'+
				'<ul class="status-info-list">'+
					'<li class="item-content">'+
						'<div class="item-inner">'+
							'<div class="item-title">'+
								'<p>物流公司：'+n.expressComputer+'</p>'+
								'<p>运单号码：'+n.chargeId+'</p>'+
							'</div>'+
						'</div>'+
					'</li>'+
				'</ul>'+
			'</div>'+
		'</div>'
	);
}


//地址 按钮
function awardAddressButton(o){
	$(".j-address-button").find(".button").remove();
	$(".a-address-text").find("*").remove();
	
	if (o.length == 0) {
		$(".j-address-button").append(
			'<div onclick="awardEditAdd(\'\',\'\',\'\',\'\',2);" class="insert button">新增地址</div>'
		);
	}else{
		$(".j-address-button").append(
			'<div onclick="awardChoose();" class="choose button">确认</div>'+
			'<div onclick="awardOther();" class="other button">使用其他</div>'
		);
		
		
		var isdefaultArr = 0;
		$.each(o, function(i,n) {
			if (n.isDefault == 1) {
				awardAddressFill(n)
			}else{
				isdefaultArr += 1;
			}
		});
		if (isdefaultArr == o.length) {
			awardAddressFill(o[0]);
		}
	}
}

//填入地址
function awardAddressFill(add){
	$(".a-address-text").find("*").remove();
	
	lData.awardAddId = add.id;
	
	$(".a-address-text").append(
		'<span>'+add.name+'</span>'+
		'<span style="position:absolute;right:.5rem;top:.25rem;">'+add.telephone+'</span>'+
		'<div>'+awardChoseAddPlus(add)+'</div>'
	);
}


//具体地址
function awardChoseAddPlus(add){
	if (add.address1) {
		if (add.address4) {
			return add.address1+add.address2+add.address3+add.address4+add.address;
		}else{
			return add.address1+add.address2+add.address3+add.address;
		}
	}else{
		return add.address;
	}
}


//地址 确认提交
function awardChoose(){
	$.confirm("确认提交收货地址吗？",function(){
		var treasureId = $.parseJSON(window.sessionStorage.getItem("prizeInfo")).treasureId;
		$.ajax({
			type:"post",
			url:lData.getUrl+"changePrizeStatus",
			data:{
//				userKey: window.localStorage.getItem("userKey"),
//				treasureId : treasureId,
//				status : 2,
//				addressId : lData.awardAddId,
				v: lData.srvVersion,
				content:encryptByDES(JSON.stringify({
					userKey: window.localStorage.getItem("userKey"),
					treasureId : treasureId,
					status : 2,
					addressId : lData.awardAddId
				}))
			},
			async:true,
			dataType:"json",
			success:function(o){
				console.log(o);
				var obj = o.prize;
				
				
				var awardObj = $.parseJSON(window.sessionStorage.getItem("prizeInfo"));
				if (obj.treasureId == 0) {
					obj.treasureId = awardObj.treasureId;
				}
				if (obj.totalCount == 0) {
					obj.totalCount = awardObj.totalCount;
				}
				if (obj.phaseNumber == 0) {
					obj.phaseNumber = awardObj.phaseNumber;
				}
				if (!obj.icon) {
					obj.icon = awardObj.icon;
				}
				
				$.showIndicator();
				window.sessionStorage.setItem("prizeInfo",JSON.stringify(obj));
				
				window.sessionStorage.setItem("prizeForceRefresh",1);
				
				setTimeout(function(){
					awardStatus(obj);
					$.hideIndicator();
				},500);
			}
		})
	})
}


//地址 选择其他
function awardOther(type){
	$.closeModal(".receipt-popup");
	
	if (type == 2) {
		return;
	}
	
	$.popup(
		'<div class="popup award-popup">' +
			'<header class="bar bar-nav c_header">'+
				'<a onclick="awardOtherCancel();" class="icon pull-left">取消</a>'+
				'<h1 class="title">选择地址</h1>'+
				'<a onclick="awardEditAdd();" class="j-receipt-insert pull-right">添加地址</a>'+
			'</header>'+
			'<div class="list-block">'+
				'<ul class="award-popup-list" style="margin-top:2.2rem;">'+
				'</ul>'+
			'</div>'+
		'</div>'
	);
	
	var addObj = $.parseJSON(window.sessionStorage.getItem("prizeAddress"));
	$.each(addObj, function(i,n) {
		$(".award-popup-list").append(
			'<li class="item-content">'+
				function(id){
					if (id == lData.awardAddId) {
						return '<div class="item-media"><i class="icon icon-check" style="color:#da3651;font-size:1rem;font-weight:bold;"></i></div>';
					}else{
						return "";
					}
				}(n.id)+
				'<div onclick="awardAddressChose('+i+');" class="item-inner">'+
					'<div class="item-title">'+
						'<span>'+n.name+'</span><span style="margin-left:1rem;">'+n.telephone+'</span>'+
						'<p style="margin:0;">'+awardChoseAddPlus(n)+'</p>'+
					'</div>'+
					'<div onclick="awardEditAdd('+n.id+',\''+n.name+'\','+n.telephone+',\''+n.address+'\',1,'+n.code1+','+n.code2+','+n.code3+','+n.code4+',\''+n.address1+'\',\''+n.address2+'\',\''+n.address3+'\',\''+n.address4+'\');" class="item-after"><i class="icon icon-edit d5"></i></div>'+
				'</div>'+
			'</li>'
		);
		
	});
	
}


//选择地址取消 刷新地址text
function awardOtherCancel(){
	$.closeModal(".award-popup");
	var addObj = $.parseJSON(window.sessionStorage.getItem("prizeAddress"));
	$.each(addObj, function(i,n) {
		if (n.id == lData.awardAddId) {
			awardAddressFill(addObj[i]);
		}
	});
}


//选择收货地址
function awardAddressChose(i){
	$.showIndicator();
	setTimeout(function(){
		$.closeModal(".award-popup");
		var addObj = $.parseJSON(window.sessionStorage.getItem("prizeAddress"));
		awardAddressFill(addObj[i]);
		$.hideIndicator();
	},500);
}

//地址编辑 新增
function awardEditAdd(id,name,tel,address,type,code1,code2,code3,code4,address1,address2,address3,address4){
	event.stopPropagation();
	
	var idVal = id?id:"''";
	var nameVal = name?name:"";
	var telVal = tel?tel:"";
	var addressVal = address?address:"";
	
	$.popup(
		'<div class="popup receipt-popup">' +
			'<header class="bar bar-nav c_header">'+
				'<a class="icon pull-left" onclick="awardOther('+type+');">取消</a>'+
				'<h1 class="title">'+(function(id){return id?"修改":"新增";})(id)+'收货地址</h1>'+
				'<a class="icon pull-right" onclick="awardAddEditSave('+idVal+','+type+');">保存</a>' +
			'</header>'+
			'<div class="content">'+
				'<div class="list-block">'+
				    '<ul>' +
						'<li class="item-content">' +
							'<input class="receipt-name" type="text" placeholder="收货人姓名" value="'+nameVal+'" />' +
						'</li>' +
						'<li class="item-content">' +
							'<input class="receipt-tel" type="text" placeholder="手机号码" value="'+telVal+'" />' +
						'</li>' +
						'<li class="item-content u-address-choose">' +
							'<span>所在地区</span>'+
							'<input type="text" id="picker" readonly />'+
							'<a class="icon icon-right"></a>'+
						'</li>' +
						'<li class="item-content">' +
							'<textarea class="receipt-address" type="text" placeholder="详细地址 （街道、楼牌号等）">'+addressVal+'</textarea>' +
						'</li>' +
					'</ul>' +
				'</div>' +
			'</div>' +
		'</div>'
	,true);
	
	
	if (code1 && code1 != "null" && code1 != "undefined") {
		$("#picker").attr("data-lv1",code1);
		$("#picker").attr("data-lv2",code2);
		$("#picker").attr("data-lv3",code3);
		if (code4) {
			$("#picker").attr("data-lv4",code4);
		}else{
			$("#picker").removeAttr("data-lv4");
		}
	}
	
	if (address1 && address1 != "undefined" && address1 != "null") {
		if (address4 && address4 != "undefined" && address4 != "null") {
			$("#picker").val(address1+address2+address3+address4);
			$("#picker").val(address1+address2+address3+address4);
			$("#picker").attr("data-lvname1",address1);
			$("#picker").attr("data-lvname2",address2);
			$("#picker").attr("data-lvname3",address3);
			$("#picker").attr("data-lvname4",address4);
		}else{
			$("#picker").val(address1+address2+address3);
			$("#picker").val(address1+address2+address3+address4);
			$("#picker").attr("data-lvname1",address1);
			$("#picker").attr("data-lvname2",address2);
			$("#picker").attr("data-lvname3",address3);
		}
	}else{
		$("#picker").val("");
		$(".receipt-address").val("");
	}
	
	
	_getScript("js/address-picker.js",function(){
		addPicker();
	})
}






//编辑地址保存
function awardAddEditSave(id,type){
	var name = $(".receipt-name");
	var tel = $(".receipt-tel");
	var address = $(".receipt-address");
	
	var telReg = /^(0|86|17951)?1\d{10}$/.test(tel.val());
	if (!name.val()) {
		$.toast("收货人姓名不能未空",1000);
		return;
	}
	if (!telReg) {
		$.toast("请输入正确的手机号码",1000);
		return;
	}
	if (!$("#picker").val()) {
		$.toast("请选择地址",1000);
		return;
	}
	if (!address.val()) {
		$.toast("详细地址不能未空",1000);
		return;
	}
	
	
	if (name.val() && telReg && address.val()) {
		if (id) {
			receiptUpdate(id,name.val(),tel.val(),address.val());
		}else{
			receiptInsert(name.val(),tel.val(),address.val(),type);
		}
	}
}


//编辑地址
function receiptUpdate(id,name,tel,address){
	$.ajax({
		type:"get",
		url:lData.getUrl+"addressManager",
		data:{
//			userId : lData.userId,
//			way : 3,
//			addressId : id ,
//			address : address,
//			telephone : tel,
//			name : name,
//			v: lData.srvVersion,
//			code1: $("#picker").attr("data-lv1"),
//			code2: $("#picker").attr("data-lv2"),
//			code3: $("#picker").attr("data-lv3"),
//			code4: $("#picker").attr("data-lv4")?$("#picker").attr("data-lv4"):"0",
//			address1: $("#picker").attr("data-lvname1"),
//			address2: $("#picker").attr("data-lvname2"),
//			address3: $("#picker").attr("data-lvname3"),
//			address4: $("#picker").attr("data-lvname4")?$("#picker").attr("data-lvname4"):""
			
			v: lData.srvVersion,
			content: encryptByDES(JSON.stringify({
				userId : lData.userId,
				way : 3,
				addressId : id ,
				address : address,
				telephone : tel,
				name : name,
				code1: $("#picker").attr("data-lv1"),
				code2: $("#picker").attr("data-lv2"),
				code3: $("#picker").attr("data-lv3"),
				code4: $("#picker").attr("data-lv4")?$("#picker").attr("data-lv4"):"0",
				address1: $("#picker").attr("data-lvname1"),
				address2: $("#picker").attr("data-lvname2"),
				address3: $("#picker").attr("data-lvname3"),
				address4: $("#picker").attr("data-lvname4")?$("#picker").attr("data-lvname4"):""
			}))
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.stateCode == 0) {
				$.showIndicator();
				setTimeout(function(){
					$.closeModal(".receipt-popup");
					window.sessionStorage.setItem("prizeAddress",JSON.stringify(o.addlist));
					awardOther();
					$.hideIndicator();
				},500)
			}
		}
	});
}


//新增
function receiptInsert(name,tel,address,type){
	$.ajax({
		type:"get",
		url:lData.getUrl+"addressManager",
		data:{
//			userId : lData.userId,
//			way : 2,
//			address : address,
//			telephone : tel,
//			name : name,
//			v: lData.srvVersion,
//			code1: $("#picker").attr("data-lv1"),
//			code2: $("#picker").attr("data-lv2"),
//			code3: $("#picker").attr("data-lv3"),
//			code4: $("#picker").attr("data-lv4")?$("#picker").attr("data-lv4"):"0",
//			address1: $("#picker").attr("data-lvname1"),
//			address2: $("#picker").attr("data-lvname2"),
//			address3: $("#picker").attr("data-lvname3"),
//			address4: $("#picker").attr("data-lvname4")?$("#picker").attr("data-lvname4"):""
			
			v: lData.srvVersion,
			content: encryptByDES(JSON.stringify({
				userId : lData.userId,
				way : 2,
				address : address,
				telephone : tel,
				name : name,
				code1: $("#picker").attr("data-lv1"),
				code2: $("#picker").attr("data-lv2"),
				code3: $("#picker").attr("data-lv3"),
				code4: $("#picker").attr("data-lv4")?$("#picker").attr("data-lv4"):"0",
				address1: $("#picker").attr("data-lvname1"),
				address2: $("#picker").attr("data-lvname2"),
				address3: $("#picker").attr("data-lvname3"),
				address4: $("#picker").attr("data-lvname4")?$("#picker").attr("data-lvname4"):""
			}))
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.stateCode == 0) {
				$.showIndicator();
				setTimeout(function(){
					$.closeModal(".receipt-popup");
					window.sessionStorage.setItem("prizeAddress",JSON.stringify(o.addlist));
					$.hideIndicator();
					if (type == 2) {
						var awardObj = $.parseJSON(window.sessionStorage.getItem("prizeInfo"));
						awardStatus(awardObj);
						return;
					}
					awardOther();
					
				},500)
			}
		}
	});
}






//确认收货
function awardConfirmGet(){
	if ($('.j-confirm-get').length > 0) {
		return;
	}
	
	$('.j-confirm-box').append(
		'<div onclick="awardConfirmGetBtn(this);" class="button j-confirm-get">确认收货</div>'
	);
	
	var awardObj = $.parseJSON(window.sessionStorage.getItem("prizeInfo"));
	if (awardObj.hasdone != 3) {
		$(".j-confirm-get").css("background-color","#b0b0b0")
	}
}

//确认收货
function awardConfirmGetBtn(that){
	var awardObj = $.parseJSON(window.sessionStorage.getItem("prizeInfo"));
	if (awardObj.hasdone == 3) {
		$.confirm("是否确认收货？",function(){
			var treasureId = $.parseJSON(window.sessionStorage.getItem("prizeInfo")).treasureId;
			$.ajax({
				type:"post",
				url:lData.getUrl+"changePrizeStatus",
				data:{
//					userId : lData.userId,
//					userKey: window.localStorage.getItem("userKey"),
//					treasureId : treasureId,
//					status : 1,
					v: lData.srvVersion,
					content:encryptByDES(JSON.stringify({
						userKey: window.localStorage.getItem("userKey"),
						treasureId : treasureId,
						status : 1,
					}))
				},
				async:true,
				dataType:"json",
				success:function(o){
					console.log(o);
					
					var obj = o.prize;
				
				
					var awardObj = $.parseJSON(window.sessionStorage.getItem("prizeInfo"));
					if (obj.treasureId == 0) {
						obj.treasureId = awardObj.treasureId;
					}
					if (obj.totalCount == 0) {
						obj.totalCount = awardObj.totalCount;
					}
					if (obj.phaseNumber == 0) {
						obj.phaseNumber = awardObj.phaseNumber;
					}
					if (!obj.icon) {
						obj.icon = awardObj.icon;
					}
					
					$.showIndicator();
					window.sessionStorage.setItem("prizeInfo",JSON.stringify(obj));
					
					window.sessionStorage.setItem("prizeForceRefresh",1);
					
					setTimeout(function(){
						awardStatus(obj);
						$.hideIndicator();
					},500);
				}
			})
		});
	}else{
		
	}
	
	
}



//下拉刷新
function awardRefresh(){
	awardGetData()
//	setTimeout(function(){
//		$.toast('刷新成功', 1000, 'toast-10');
//		$.hideIndicator();
//	})
}


