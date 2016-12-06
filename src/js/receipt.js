$(function(){
	try{
		receiptSelect();
		receiptLinkTo();
	}catch(e){
		//TODO handle the exception
	}
})


//查询
function receiptSelect(){
	$.ajax({
		type:"post",
		url:luanmingli.getUrl+"addressManager",
		data:{
//			userId : luanmingli.userId,
//			way : 1,
			v: luanmingli.srvVersion,
			content: encryptByDES(JSON.stringify({
				userId : luanmingli.userId,
				way : 1
			}))
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.addlist.length == 0) {
				receiptPopup();
			}else{
				receiptFilldata(o);
			}
		}
	});
}


//填入已有地址数据
function receiptFilldata(o){
	if ($(".receipt-list").length > 0) {
		$(".receipt-list").remove();
	}
	
	$.each(o.addlist, function(i,n) {
		$("#p-receipt").find(".content").append(
			'<div class="card receipt-list">'+
				'<div class="card-content">'+
					'<div class="card-content-inner">'+
						'<p>'+
							'<span>'+n.name+'</span>'+
							'<span class="test2">'+n.telephone+'</span>'+
						'</p>'+
						'<p>'+
							(function(address1,address2,address3,address4,address){
								if (address1 && address1 != "undefined" && address1 != "null") {
									if (address4 && address4 != "undefined" && address4 != "null") {
										return address1+address2+address3+address4+address;
									}else{
										return address1+address2+address3+address;
									}
								}else{
									return address;
								}
							})(n.address1,n.address2,n.address3,n.address4,n.address)+
						'</p>'+
//						'<p>'+n.address1+n.address2+n.address3+n.address4+n.address+'</p>'+
					'</div>'+
				'</div>'+
				'<div class="card-footer">'+
					
				'<label onclick="setDefaultAddress('+n.id+',this);" class="receipt-radio label-checkbox item-content">'+
					'<input '+defaultAddress(n.isDefault)+' type="radio" name="defaule-address">'+
					'<div class="item-media"><i class="icon icon-form-checkbox"></i></div>'+
					'<div class="radio-text">设为默认地址</div>'+
				'</label>'+
					
					'<div onclick="receiptPopup('+n.id+',\''+n.name+'\','+n.telephone+',\''+n.address+'\','+n.code1+','+n.code2+','+n.code3+','+n.code4+',\''+n.address1+'\',\''+n.address2+'\',\''+n.address3+'\',\''+n.address4+'\');" class="button button-dark" style="position: absolute;right: 5rem;">编辑地址</div>'+
					'<div onclick="receiptDelete('+n.id+',this);" class="button button-dark" style="position: absolute;right: .75rem;">删除地址</div>'+
				'</div>'+
			'</div>'
		);
	});
	
}

//function receiptPageAddVal(a){
//	alert(a)
//}

//默认地址
function defaultAddress(isDefault){
	if (isDefault == 1) {
		return "checked=checked";
	}
}

//设置默认地址
function setDefaultAddress(addId,that){
	if ($(that).parent().find("input:checked").length > 0) {
		return;
	}
	
	$.showIndicator();
	setTimeout(function(){
		$.ajax({
			type:"post",
			url:luanmingli.getUrl+"addressManager",
			data:{
//				userId : luanmingli.userId,
//				way : 5,
//				addressId : addId,
//				v: luanmingli.srvVersion
				
				v: luanmingli.srvVersion,
				content: encryptByDES(JSON.stringify({
					userId : luanmingli.userId,
					way : 5,
					addressId : addId,
				}))
			},
			async:true,
			dataType:"json",
			success:function(o){
				console.log(o);
				if (o.stateCode == 0) {
					$.toast('设置成功', 1000);
				}else{
					$.alert(o.message);
				}
				$.hideIndicator();
			}
		});
	},200)
}


function receiptPopup(id,name,tel,address,code1,code2,code3,code4,address1,address2,address3,address4){
	var idVal = id?id:"";
	var nameVal = name?name:"";
	var telVal = tel?tel:"";
	var addressVal = address?address:"";
	
	$.popup(
		'<div class="popup receipt-popup">' +
			'<header class="bar bar-nav c_header">'+
				'<a class="icon pull-left close-popup"  style="font-size:.8rem;">取消</a>'+
				'<h1 class="title">'+(function(id){return id?"编辑":"新增";})(id)+'收货地址</h1>'+
				'<a class="icon pull-right" onclick="receiptSave('+idVal+');">保存</a>' +
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
//				'<div class="button" onclick="receiptSave('+idVal+');">保存</div>' +
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
			$("#picker").attr("data-lvname1",address1);
			$("#picker").attr("data-lvname2",address2);
			$("#picker").attr("data-lvname3",address3);
			$("#picker").attr("data-lvname4",address4);
		}else{
			$("#picker").val(address1+address2+address3);
			$("#picker").attr("data-lvname1",address1);
			$("#picker").attr("data-lvname2",address2);
			$("#picker").attr("data-lvname3",address3);
		}
	}else{
		$("#picker").val("");
		$(".receipt-address").val("");
	}
	
	
	//地址选择
//	addPicker();

	_getScript("js/address-picker.js",function(){
		addPicker();
	})
}

//新增地址保存
function receiptSave(id){
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
			receiptInsert(name.val(),tel.val(),address.val());
		}
	}
}


//新增
function receiptInsert(name,tel,address){
	$.ajax({
		type:"get",
		url:luanmingli.getUrl+"addressManager",
		data:{
//			userId : luanmingli.userId,
//			way : 2,
//			address : address,
//			telephone : tel,
//			name : name,
//			v: luanmingli.srvVersion,
//			code1: $("#picker").attr("data-lv1"),
//			code2: $("#picker").attr("data-lv2"),
//			code3: $("#picker").attr("data-lv3"),
//			code4: $("#picker").attr("data-lv4")?$("#picker").attr("data-lv4"):"0",
//			address1: $("#picker").attr("data-lvname1"),
//			address2: $("#picker").attr("data-lvname2"),
//			address3: $("#picker").attr("data-lvname3"),
//			address4: $("#picker").attr("data-lvname4")?$("#picker").attr("data-lvname4"):""
			
			v: luanmingli.srvVersion,
			content: encryptByDES(JSON.stringify({
				userId : luanmingli.userId,
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
				$.closeModal(".receipt-popup");
				receiptFilldata(o);
			}else{
				$.alert(o.message);
			}
		}
	});
}


//删除地址
function receiptDelete(addId,that){
	$.confirm('是否确认删除?',
		function() {
			$.ajax({
				type:"post",
				url:luanmingli.getUrl+"addressManager",
				data:{
//					userId : luanmingli.userId,
//					way : 4,
//					addressId : addId,
//					v: luanmingli.srvVersion
					
					v: luanmingli.srvVersion,
					content: encryptByDES(JSON.stringify({
						userId : luanmingli.userId,
						way : 4,
						addressId : addId
					}))
				},
				async:true,
				dataType:"json",
				success:function(o){
					console.log(o);
					
					if (o.stateCode == 0) {
						$(that).parents(".card").remove();
						if ($(".receipt-list").length == 0) {
							window.sessionStorage.removeItem("prizeAddress");
						}
					}else{
						$.alert(o.message);
					}
				}
			});
		}
	);
	
}


//编辑地址
function receiptUpdate(id,name,tel,address){
	$.ajax({
		type:"get",
		url:luanmingli.getUrl+"addressManager",
		data:{
//			userId : luanmingli.userId,
//			way : 3,
//			addressId : id ,
//			address : address,
//			telephone : tel,
//			name : name.toString(),
//			v: luanmingli.srvVersion,
//			code1: $("#picker").attr("data-lv1"),
//			code2: $("#picker").attr("data-lv2"),
//			code3: $("#picker").attr("data-lv3"),
//			code4: $("#picker").attr("data-lv4")?$("#picker").attr("data-lv4"):"0",
//			address1: $("#picker").attr("data-lvname1"),
//			address2: $("#picker").attr("data-lvname2"),
//			address3: $("#picker").attr("data-lvname3"),
//			address4: $("#picker").attr("data-lvname4")?$("#picker").attr("data-lvname4"):""
			
			v: luanmingli.srvVersion,
			content: encryptByDES(JSON.stringify({
				userId : luanmingli.userId,
				way : 3,
				addressId : id ,
				address : address,
				telephone : tel,
				name : name.toString(),
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
				$.closeModal(".receipt-popup");
				receiptFilldata(o);
			}
		}
	});
}
	


function receiptLinkTo(){
	//添加地址按钮
	$(".j-receipt-insert").click(function(){
		receiptPopup();
	});
}



////地址选择
//function addPicker(){
//
//	$("#picker").click(function(){
//		$.popup(
//			'<div onclick="popAddChooseClose();" class="popup popup-addChoose-overlay">' +
//				'<div class="popup-addChoose">'+
//					'<div class="header">'+
//						'<p>所在地区</p>'+
//						'<span class="u-icon-close pull-right"></span>'+
//					'</div>'+
//					'<div class="select">'+
//						'<span onclick="backChooseLevel(this);" class="active">请选择</span>'+
////						'<span class="active">1</span>'+
//					'</div>'+
//					'<div class="choose-box-wrap">'+
//						'<div class="choose-box">'+
//							addressLevel1()+
//						'</div>'+
//						'<div class="choose-box">'+
//						'</div>'+
//						'<div class="choose-box">'+
//						'</div>'+
//						'<div class="choose-box">'+
//						'</div>'+
//					'</div>'+
//				'</div>' +
//			'</div>'
//		,true);
//	})
//
//}
//
//function popAddChooseClose(){
//	event.stopPropagation();
//	$.closeModal(".popup-addChoose-overlay")
//}
//	
//function chooseDetailAdd(that){
//	event.stopPropagation();
//	var _this = that;
//	$(_this).parent().find(".add-choose-active").removeClass("add-choose-active");
//	$(_this).parent().find(".add-choose-icon").remove();
//	
//	$.showIndicator();
//	$(_this).addClass("add-choose-active");
//	$(_this).html($(_this).html()+'<i class="icon icon-check add-choose-icon"></i>');
//	
//	setTimeout(function(){
//		//选择完增加到tab
//		$(".popup-addChoose .select span:last-child").html($(_this).text());
//		
//		//增加到tab 样式    active当前选择
//		$(".popup-addChoose .select span.active").removeClass("active");
//		$(".popup-addChoose .select").append(
//			'<span onclick="backChooseLevel(this);" class="active">请选择</span>'
//		);
//		
//		//对应tab展示相应content
//		$(".choose-box-wrap .choose-box").hide();
//		$(".choose-box-wrap .choose-box").eq($(".popup-addChoose .select span.active").index()).show();
//		
//		//请求下一级地址
//		var lv =$(".popup-addChoose .select span.active").index() + 1;
//		var pcode = $(_this).attr("name");
//		$(".choose-box-wrap").find(".choose-box").eq($(_this).parents(".choose-box").index()+1).append(
//			addressLevel2(lv,pcode)
//		);
//	},50)
//}
//	
//
////1级地址
//var addLV1 = {"message":"操作成功","addressCodeList":[{"addressName":"北京","addressCode":1,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"上海","addressCode":2,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"天津","addressCode":3,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"重庆","addressCode":4,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"河北","addressCode":5,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"山西","addressCode":6,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"河南","addressCode":7,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"辽宁","addressCode":8,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"吉林","addressCode":9,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"黑龙江","addressCode":10,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"内蒙古","addressCode":11,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"江苏","addressCode":12,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"山东","addressCode":13,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"安徽","addressCode":14,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"浙江","addressCode":15,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"福建","addressCode":16,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"湖北","addressCode":17,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"湖南","addressCode":18,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"广东","addressCode":19,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"广西","addressCode":20,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"江西","addressCode":21,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"四川","addressCode":22,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"海南","addressCode":23,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"贵州","addressCode":24,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"云南","addressCode":25,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"西藏","addressCode":26,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"陕西","addressCode":27,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"甘肃","addressCode":28,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"青海","addressCode":29,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"宁夏","addressCode":30,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"新疆","addressCode":31,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"台湾","addressCode":32,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"香港","addressCode":42,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"澳门","addressCode":43,"addreeeLevel":null,"parentCode":0,"hasChild":1}],"stateCode":0};
//
//
////一级地址
//function addressLevel1(){
//	var addList = "";
//	$.each(addLV1.addressCodeList, function(i,n) {
//		addList += '<p onclick="chooseDetailAdd(this);" name='+n.addressCode+'>'+n.addressName+'</p>'
//	});
//	return addList;
//}
//
////二级地址
//function addressLevel2(lv,code){
//	var addList = "";
//	$.ajax({
//		type:"get",
//		url:luanmingli.getUrl+"getAddressCodes",
//		data:{
//			addressLevel: lv,
//			parentCode: code
//		},
//		async:false,
//		dataType:"json",
//		success:function(o){
//			console.log(o);
//			if (o.stateCode == 0) {
//				$.each(o.addressCodeList, function(i,n) {
//					if (n.hasChild == 1) {
//						addList += '<p onclick="chooseDetailAdd(this);" name='+n.addressCode+'>'+n.addressName+'</p>'
//					}else{
//						addList += '<p onclick="chooseFinish(\''+n.addressName+'\');" name='+n.addressCode+'>'+n.addressName+'</p>'
//					}
//				});
//				
//			}else{
//				$.alert(o.message);
//			}
//			$.hideIndicator();
//		}
//	});
//	return addList;
//}
//
////选择完成
//function chooseFinish(addname){
//	event.stopPropagation();
//	var choseHTML = "";
//	$.each($(".popup-addChoose .select span"), function(i,n) {
//		if (/选择/.test($(n).html())) {
//			choseHTML += addname;
//		}else{
//			choseHTML += $(n).html();
//		}
//	});
//	
//	$.closeModal(".popup-addChoose-overlay");
//	$("#picker").val(choseHTML);
//	
//	
//	pickerScroll();
//}
//
//function backChooseLevel(that){
//	event.stopPropagation();
//	var _this = that;
//	
//	$(".choose-box-wrap .choose-box").hide();
//	$(".choose-box-wrap .choose-box").eq($(_this).index()).show();
//	$(".choose-box-wrap .choose-box").eq($(_this).index()).nextAll().find("p").remove();
//	
//	$(_this).addClass("active");
//	$(_this).nextAll().remove();
//	
//}
//
//
//
//function pickerScroll(){
//	if ($("#picker")[0].scrollWidth > $("#picker").width() && $("#picker").length > 0 ) {
//		var speed = 1;
//		var a = 0;
//		var timer = setInterval(function(){
//			a += speed;
//			$("#picker").scrollLeft(a);
//			if ($("#picker")[0].scrollLeft + $("#picker").width() >= $("#picker")[0].scrollWidth || $("#picker")[0].scrollLeft <= 0) {
//				speed = -speed;
//			}
//		},30);
//	}
//}
