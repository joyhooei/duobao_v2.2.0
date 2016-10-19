var FZ = function(a, b) {
	function getFZ() {
		var width = document.documentElement.clientWidth || document.body.clientWidth;
		var fontSize = (a / b) * width;
		return fontSize;
	};
	document.documentElement.style.fontSize = getFZ() + "px";
	window.onresize = function() {
		setTimeout(function() {
			document.documentElement.style.fontSize = getFZ() + "px";
		}, 100);
	};
};

FZ(20, 375);

$.getUrlParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURIComponent(r[2]);
	return null;
}

//var getUrl = "http://www.7kuaitang.com:8081/raiders/restWeb/";
var getUrl = "http://www.2333db.com/raiders/restWeb/";

if ($.getUrlParam("test") == 1) {
	getUrl = "http://www.7kuaitang.com:8081/raiders/restWeb/";
}

function lotteryCode(o) {
	if (o.lotteryCode == 0) {
		return "正在等待揭晓…";
	} else {
		if (o.lotteryCode.toString().length == 5) {
			return o.lotteryCode;
		} else {
			var code = o.lotteryCode;
			for (i = 0; i < 5 - o.lotteryCode.toString().length; i++) {
				code = "0" + code.toString();
			}
			return code;
		}
	}
}

var tId = $.getUrlParam("treasureId");
$.ajax({
	type: "post",
	url: getUrl + "getOpenInfo",
	data: {
		treasureId: tId
	},
	async: true,
	dataType: "json",
	success: function(o) {
		console.log(o);
		$(".a-calc-sum").html(o.sumsum);
		$(".a-calc-lottery").html(lotteryCode(o));
		$(".a-calc-lotteryId").html(o.lotteryId);
		$(".a-calc-luckyCode").html(o.luckyCode);

		$.each(o.openList, function(i, n) {
			$(".calc-resultList").find("tbody").append(
				'<tr class="calcRow">' +
				'<td class="calc-time">' +
				'<span>' + n.openTime + '  </span>' +
				'<i class="calc-arrow-transfer"></i>' +
				'<b class="calc-color-red">' + n.numberSum + '</b>' +
				'</td>' +
				'<td class="calc-user">' + n.nickName + '</td>' +
				'</tr>'
			);
		});
	}
});

$(".calc-A").find(".btn").click(function() {
	$(".calc-A-unfoldBtn").toggle();
	$(".calc-A-foldBtn").toggle();
	$(".calc-list").slideToggle(100);
});

$(".calc-B-btn").click(function(){
	window.location.href = "http://touch.lecai.com/#path=page%2Faward-result%2Flist/?agentId=106000&lotteryType=CQSSC";
})

$(".calc-question1").click(function(){
	$(".calc-overlay1").show();
	$(".calc-overlay1").click(function(){
		$(this).hide();
	});
});

$(".calc-question2").click(function(){
	$(".calc-overlay2").show();
	$(".calc-overlay2").click(function(){
		$(this).hide();
	});
});
