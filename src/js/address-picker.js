//地址选择
function addPicker(){

	$("#picker").click(function(){
		$.popup(
			'<div onclick="popAddChooseClose();" class="popup popup-addChoose-overlay">' +
				'<div onclick="popClickNoAct();" class="popup-addChoose">'+
					'<div class="header">'+
						'<p>所在地区</p>'+
						'<span onclick="popAddChooseClose();" class="u-icon-close pull-right"></span>'+
					'</div>'+
					'<div class="select">'+
						'<span onclick="backChooseLevel(this);" class="active">请选择</span>'+
//						'<span class="active">1</span>'+
					'</div>'+
					'<div class="choose-box-wrap">'+
						'<div class="choose-box">'+
							addressLevel1()+
						'</div>'+
						'<div class="choose-box">'+
						'</div>'+
						'<div class="choose-box">'+
						'</div>'+
						'<div class="choose-box">'+
						'</div>'+
					'</div>'+
				'</div>' +
			'</div>'
		,true);
	})

}

function popAddChooseClose(){
	event.stopPropagation();
	$.closeModal(".popup-addChoose-overlay")
}

function popClickNoAct(){
	event.stopPropagation();
	return;
}

	
function chooseDetailAdd(that){
	event.stopPropagation();
	var _this = that;
	$(_this).parent().find(".add-choose-active").removeClass("add-choose-active");
	$(_this).parent().find(".add-choose-icon").remove();
	
	$.showIndicator();
	$(_this).addClass("add-choose-active");
	$(_this).html($(_this).html()+'<i class="icon icon-check add-choose-icon"></i>');
	
	setTimeout(function(){
		//选择完增加到tab
		$(".popup-addChoose .select span:last-child").html($(_this).text());
		$(".popup-addChoose .select span:last-child").attr("name",$(_this).attr("name"));
		
		//增加到tab 样式    active当前选择
		$(".popup-addChoose .select span.active").removeClass("active");
		$(".popup-addChoose .select").append(
			'<span onclick="backChooseLevel(this);" class="active">请选择</span>'
		);
		
		//对应tab展示相应content
		$(".choose-box-wrap .choose-box").hide();
		$(".choose-box-wrap .choose-box").eq($(".popup-addChoose .select span.active").index()).show();
		
		//请求下一级地址
		var lv =$(".popup-addChoose .select span.active").index() + 1;
		var pcode = $(_this).attr("name");
		$(".choose-box-wrap").find(".choose-box").eq($(_this).parents(".choose-box").index()+1).append(
			addressLevel2(lv,pcode)
		);
	},50)
}
	

//1级地址
var addLV1 = {"message":"操作成功","addressCodeList":[{"addressName":"北京","addressCode":1,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"上海","addressCode":2,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"天津","addressCode":3,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"重庆","addressCode":4,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"河北","addressCode":5,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"山西","addressCode":6,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"河南","addressCode":7,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"辽宁","addressCode":8,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"吉林","addressCode":9,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"黑龙江","addressCode":10,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"内蒙古","addressCode":11,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"江苏","addressCode":12,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"山东","addressCode":13,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"安徽","addressCode":14,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"浙江","addressCode":15,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"福建","addressCode":16,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"湖北","addressCode":17,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"湖南","addressCode":18,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"广东","addressCode":19,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"广西","addressCode":20,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"江西","addressCode":21,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"四川","addressCode":22,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"海南","addressCode":23,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"贵州","addressCode":24,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"云南","addressCode":25,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"西藏","addressCode":26,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"陕西","addressCode":27,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"甘肃","addressCode":28,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"青海","addressCode":29,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"宁夏","addressCode":30,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"新疆","addressCode":31,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"台湾","addressCode":32,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"香港","addressCode":42,"addreeeLevel":null,"parentCode":0,"hasChild":1},{"addressName":"澳门","addressCode":43,"addreeeLevel":null,"parentCode":0,"hasChild":1}],"stateCode":0};


//一级地址
function addressLevel1(){
	var addList = "";
	$.each(addLV1.addressCodeList, function(i,n) {
		addList += '<p onclick="chooseDetailAdd(this);" name='+n.addressCode+'>'+n.addressName+'</p>'
	});
	return addList;
}

//二级地址
function addressLevel2(lv,code){
	var addList = "";
	$.ajax({
		type:"get",
		url:luanmingli.getUrl+"getAddressCodes",
		data:{
			addressLevel: lv,
			parentCode: code,
			v: luanmingli.srvVersion
		},
		async:false,
		dataType:"json",
		success:function(o){
			console.log(o);
			if (o.stateCode == 0) {
				$.each(o.addressCodeList, function(i,n) {
					if (n.hasChild == 1) {
						addList += '<p onclick="chooseDetailAdd(this);" name='+n.addressCode+'>'+n.addressName+'</p>'
					}else{
						addList += '<p onclick="chooseFinish(\''+n.addressName+'\',this);" name='+n.addressCode+'>'+n.addressName+'</p>'
					}
				});
				
			}else{
				$.alert(o.message);
			}
			$.hideIndicator();
		}
	});
	return addList;
}

//选择完成
function chooseFinish(addname,that){
	event.stopPropagation();
	
	var _this = that;
	$(_this).addClass("add-choose-active");
	$(_this).html($(_this).html()+'<i class="icon icon-check add-choose-icon"></i>');
	
	setTimeout(function(){
		var choseHTML = "";
		$.each($(".popup-addChoose .select span"), function(i,n) {
			if (/选择/.test($(n).html())) {
				choseHTML += addname;
			}else{
				choseHTML += $(n).html();
			}
		});
		
		$.closeModal(".popup-addChoose-overlay");
		
		$("#picker").removeAttr("data-lv4");
		$("#picker").removeAttr("data-lvname4");
		$("#picker").val(choseHTML);
		
		$.each($(".popup-addChoose .select span"),function(i,n){
			$("#picker").attr("data-lv"+(i+1),$(n).attr("name"));
			$("#picker").attr("data-lvname"+(i+1),$(n).text());
		});
		$("#picker").attr("data-lv"+parseInt($(".popup-addChoose .select span").length),$(_this).attr("name"));
		$("#picker").attr("data-lvname"+parseInt($(".popup-addChoose .select span").length),$(_this).text());
		
		
		pickerScroll();
	},50)
	
}

function backChooseLevel(that){
	event.stopPropagation();
	var _this = that;
	
	$(".choose-box-wrap .choose-box").hide();
	$(".choose-box-wrap .choose-box").eq($(_this).index()).show();
	$(".choose-box-wrap .choose-box").eq($(_this).index()).nextAll().find("p").remove();
	
	$(_this).addClass("active");
	$(_this).nextAll().remove();
	
}



function pickerScroll(){
	if ($("#picker")[0].scrollWidth > $("#picker").width() && $("#picker").length > 0 ) {
		var speed = 1;
		var a = 0;
		var timer = setInterval(function(){
			a += speed;
			$("#picker").scrollLeft(a);
			if ($("#picker")[0].scrollLeft + $("#picker").width() >= $("#picker")[0].scrollWidth || $("#picker")[0].scrollLeft <= 0) {
				speed = -speed;
			}
		},30);
	}
}
