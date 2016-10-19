$(function(){
	$.showIndicator();
	
	var imgUrl = $.getUrlParam("imgurl");
	
	if ($.getUrlParam("goodstype") == 2) {
		imgUrl = "img/help-chest.png";
		if ($("#p-goods-detail").find(".content").find("img").length > 0) {
			return;
		}
		$("#p-goods-detail").find(".content").append(
			'<img onload="loadFinish();" src="'+imgUrl+'" />'
		);
	}else{
		if ($("#p-goods-detail").find(".content").find("iframe").length > 0) {
			return;
		}
		
		$("#p-goods-detail").find(".content").append(
			'<iframe onload="loadFinish();" style="border:0;width:100%;height:100%;" src="'+imgUrl+'"></iframe>'
		);
	}
	
	
})

function loadFinish(){
	setTimeout(function(){
		$.hideIndicator();
	},500)
}
