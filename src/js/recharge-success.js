$(function(){
	
	window.sessionStorage.removeItem("pointsNum");
	$("#p-recharge-success").find(".p-backhome").click(function(){
		$.router.load("personal.html");
	});
	
	checkBonus();
})

function checkBonus(){
	$.ajax({
		type:"post",
		url:lData.getUrl+"userDetail",
		data:{
			v: lData.srvVersion,
			content: encryptByDES(JSON.stringify({
				userId:window.localStorage.getItem("userId")
			}))
		},
		async:false,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			var bonusList = o.userInfo.hongbaoList;
			var oldBonusList = $.parseJSON(window.sessionStorage.getItem("bunusList"));
			
			var oldBonusId = [];
			$.each(oldBonusList, function(i,n) {
				oldBonusId.push(o.hongbaoId);
			});
			
			var newBonusList = [];
			if (bonusList.length > oldBonusList.length) {
				$.map(bonusList, function(n) {
					if ($.inArray(n.hongbaoId,oldBonusId) == -1){
						newBonusList.push(n);
					}
				});
			}
			
			alertMsg(newBonusList);
		}
	});
}

function alertMsg(newBonusList){
	if (newBonusList.length == 0) {
		return;
	}
	var o = newBonusList[0]; 
	console.log(o);
	
	$("#p-recharge-success").append(
		'<div class="r-s-overlay">'+
			'<div class="r-s-close"></div>'+
			'<div class="r-s-ct">'+
				'<div class="r-s-bonus">'+
					'<div class="r-s-left">¥ <span>'+o.disCount+'</span></div>'+
					'<div class="r-s-right">'+
						'<p class="text1">'+o.hongbaoName+'</p>'+
						'<p class="text2">满'+o.usePoint+'元可用</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'
	);
	
	$(".r-s-close").click(function(){
		$(".r-s-overlay").remove();
	});
}
