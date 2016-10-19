$(function(){
	try{
		helpCenter();
	}catch(e){
		//TODO handle the exception
	}
})


function helpCenter(){
	if ($.device.ios) {
		$("#apple").show();
	}
	$(".list").click(function(){
		$(this).next(".drop-ct").toggle();
		$(this).find(".icon").toggleClass("icon-up")
	})
	$(".drop-ct").click(function(){
		$(this).hide();
		$(this).prev(".list").find(".icon").removeClass("icon-up");
	})
}
