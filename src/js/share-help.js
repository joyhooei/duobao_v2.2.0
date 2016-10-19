$(function(){
	try{
		shareHelpBorder();
		shareHelpLink();
	}catch(e){
		//TODO handle the exception
	}
})



function shareHelpBorder(){
	var h = 0;
	var h2 = $(".text-box .ball3-ct").offset().top +$(".text-box .ball3-ct").height()/2 + - $(".text-box .text1").offset().top
	var timer = setInterval(function(){
		h += 10;
		$(".p-share-help .text-border").height(h);
		if (h >= h2) {
			clearInterval(timer);
		}
	},10);
	
}


function shareHelpLink(){
	$(".share-send-btn").click(function(){
		var treasureId = $.getUrlParam("treasureId");
		$.router.load("share-send.html?treasureId="+treasureId+"&goodsinfo="+$.getUrlParam("goodsinfo"),true);
	});
}
