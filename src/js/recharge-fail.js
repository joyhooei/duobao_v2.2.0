$(function(){
	
	window.sessionStorage.removeItem("pointsNum");
	$("#p-recharge-fail").find(".p-backhome").click(function(){
		$.router.load("personal.html");
	});
	
})
