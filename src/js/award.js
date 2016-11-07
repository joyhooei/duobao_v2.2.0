$(function(){
	try{
		$(".module4").remove();
		$(".module3").remove();
		$(".module2").remove();
		
		awardGetData();
		dropRefresh("#p-award",awardRefresh);	//下拉刷新
	}catch(e){
		//TODO handle the exception
	}
})

function awardGetData(){
	var awardObj = $.parseJSON(window.sessionStorage.getItem("prizeInfo"));
	
	awardStatus(awardObj);
}

function awardStatus(awardObj){
	var addObj = $.parseJSON(window.sessionStorage.getItem("prizeAddress"));
	var hasdone = awardObj.hasdone;
	
	console.log(addObj)
	console.log(awardObj)
	
	
	$(".j-address-button").find(".button").remove();
	$(".a-address-text").find("*").remove();
	$(".status-info-list").find(".active").removeClass("active");
	$(".j-confirm-box").find(".button").remove();
	$(".a-award-shiping").html("");
	$(".j-confirm-box").html("");
	
	awardFillData(awardObj);
	
	if (hasdone == 0) {
		$(".status-info-list").find(".item-content").eq(1).addClass("active");
		$(".j-address-button").html("");
		awardAddressButton(addObj);
	}else if (hasdone == 3) {
		$(".status-info-list").find(".item-content").eq(3).addClass("active");
		awardAddFillData(addObj,awardObj);
		awardShipFillData(awardObj);
		awardConfirmGet();
	}else if (hasdone == 1) {
		awardAddFillData(addObj,awardObj);
		awardShipFillData(awardObj);
		$(".j-confirm-box").html(awardObj.commiteTime);
		$(".status-info-list").find(".item-content").eq(4).addClass("active");
	}else if (hasdone == 2) {
		$(".status-info-list").find(".item-content").eq(2).addClass("active");
		$(".a-award-shiping").html("请等待……");
		awardAddFillData(addObj,awardObj);
	}
}

//商品详情
function awardFillData(n){
	$(".a-award-time").html(n.lotteryTime);
	
	if ($("#p-award").find(".module2").length > 0) {
		$("#p-award").find(".module2").remove();
	}
	
	$("#p-award").find(".module-first").after(
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
	
	if ($("#p-award").find(".module3").length > 0) {
		$("#p-award").find(".module3").remove();
	}
	
	$("#p-award").find(".module-first").after(
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
	
	if ($("#p-award").find(".module4").length > 0) {
		$("#p-award").find(".module4").remove();
	}
	
	$("#p-award").find(".module-first").after(
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
//				userId : lData.userId,
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
						status : 1
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


