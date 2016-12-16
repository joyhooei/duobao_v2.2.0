$(function(){
	bonusFillData();
	bonusExplanation();
})

var _vds = _vds || [];
(function(){
	_vds.push(['setAccountId', 'bdd0f83d74ae607c']);

	(function() {
		var vds = document.createElement('script');
		vds.type='text/javascript';
		vds.async = true;
		vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(vds, s);
	})();
})();

var getUrlParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURIComponent(r[2]);
	return null;
};

var lData = {
	getUrl: "http://api.2333db.com/raiders/restWeb/",
//	getUrl: "http://www.7kuaitang.com:8081/raiders/restWeb/",
	srvVersion: "2.1.0",
	userId: getUrlParam("userId")
}


function bonusFillData(){
	$.ajax({
		type:"post",
		url:lData.getUrl + "getUserHongbaoList",
		data: {
			v: lData.srvVersion,
			userId: lData.userId
		},
		dataType: "json",
		async:true,
		success: function(o){
			console.log(o)
			
			if (o.stateCode == 0) {
				$("#bonustab1").find(".card").remove();
				$("#bonustab2").find(".card").remove();
				$("#p-bonus").find(".no-bonus").remove();
				
				var toExpireCount = 0;
				var timeNow = new Date().getTime();
				$.each(o.hongbaoList,function(i,n){
					if (n.endTime - timeNow < 24*60*60*1000 && n.status == 0) {
						toExpireCount += 1;
					}
					
					var endTime = function(endTime){
						var time = new Date(endTime);
						var year = time.getFullYear();
						var month = time.getMonth()+1 < 10 ? '0'+(time.getMonth()+1) : (time.getMonth()+1);
						var day = time.getDate() < 10 ? '0'+time.getDate():time.getDate();
						return year + "-" + month + "-" +day;
					}
					
					
					if (n.status == 0) {
						//正常
						$("#bonustab1").append(
							'<div class="card bonus-card">'+ 
								'<div class="card-content clearfix">'+
									'<div class="card-money pull-left">'+
										'<p class="text1">¥<span class="a-bonus-money">'+n.disCount+'</span></p>'+
										'<p class="text2">满'+n.usePoint+'元使用</p>'+
									'</div>'+
									'<div class="card-time pull-left">'+
										'<div class="card-time-left">'+
											'<p class="text1">'+n.hongbaoName+'</p>'+
											'<p class="text2">'+n.validity+'后过期</p>'+
										'</div>'+
										'<div class="card-time-right">可使用</div>'+
									'</div>'+
								'</div>'+
							'</div>'
						);
					}else if (n.status == 1) {
						//已使用
						$("#bonustab2").append(
							'<div class="card bonus-card bonus-used-card">'+
								'<div class="card-content clearfix">'+
									'<div class="card-money pull-left">'+
										'<p class="text1">¥<span class="a-bonus-money">'+n.disCount+'</span></p>'+
										'<p class="text2">满'+n.usePoint+'元使用</p>'+
									'</div>'+
									'<div class="card-time pull-left">'+
										'<div class="card-time-left">'+
											'<p class="text1">'+n.hongbaoName+'</p>'+
											'<p class="text2">有效期至'+endTime(n.endTime)+'</p>'+
										'</div>'+
										'<div class="card-time-right">已使用</div>'+
									'</div>'+
								'</div>'+
							'</div>'
						);
					}else if (n.status == 2) {
						//过期红包
						
						$("#bonustab1").append(
							'<div class="card bonus-card bonus-expired-card">'+ 
								'<div class="card-content clearfix">'+
									'<div class="card-money pull-left">'+
										'<p class="text1">¥<span class="a-bonus-money">'+n.disCount+'</span></p>'+
										'<p class="text2">满'+n.usePoint+'元使用</p>'+
									'</div>'+
									'<div class="card-time pull-left">'+
										'<div class="card-time-left">'+
											'<p class="text1">'+n.hongbaoName+'</p>'+
											'<p class="text2">有效期至'+endTime(n.endTime)+'</p>'+
										'</div>'+
										'<div class="card-time-right">已过期</div>'+
									'</div>'+
								'</div>'+
							'</div>'
						);
					}else if (n.status == 3) {
						function startTime(time){
							var startTime = new Date(time);
							var nowTime = new Date();
							if (time - nowTime.getTime() > 24*60*60*1000) {
								return startTime.getDate() - nowTime.getDate() + "天";
							}else{
								return parseInt(startTime.getHours()) + 24 - nowTime.getHours() + "小时";
							}
						}
						//待生效
						$("#bonustab1").append(
							'<div class="card bonus-card bonus-toEffective-card">'+ 
								'<div class="card-content clearfix">'+
									'<div class="card-money pull-left">'+
										'<p class="text1">¥<span class="a-bonus-money">'+n.disCount+'</span></p>'+
										'<p class="text2">满'+n.usePoint+'元使用</p>'+
									'</div>'+
									'<div class="card-time pull-left">'+
										'<div class="card-time-left">'+
											'<p class="text1">'+n.hongbaoName+'</p>'+
											'<p class="text2">'+startTime(n.startTime)+'后生效</p>'+
										'</div>'+
										'<div class="card-time-right">待生效</div>'+
									'</div>'+
								'</div>'+
							'</div>'
						);
					}
				})
				
				$("#p-bonus .j-notuse .a-deadline").show();
				$("#p-bonus .j-notuse .a-deadline").html('有<span style="color:#f24957;">'+toExpireCount+'</span>个红包即将到期');
				
				
				if ($("#bonustab1").find(".card").length == 0) {
					$("#p-bonus .j-notuse .a-deadline").hide();
					
					$("#bonustab1").append(
						'<div class="no-bonus">'+
							'<p>您当前没有红包哦</p>'+
							'<p>快去夺宝得红包吧</p>'+
						'</div>'
					);
				}
				
				if ($("#bonustab2").find(".card").length == 0) {
					$("#bonustab2").append(
						'<div class="no-bonus">'+
							'<p>您当前没有红包哦</p>'+
							'<p>快去夺宝得红包吧</p>'+
						'</div>'
					);
				}
				
			}else{
				$.alert(o.message);
			}
			
		}
	});
	
}

function bonusExplanation(){
	$("#p-bonus").find(".explanation").click(function(){
		$.router.load("bonus-help.html");
	});
}



