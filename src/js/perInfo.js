$(function(){
	try{
		$.closeModal();
		perInfo();
	}catch(e){
		//TODO handle the exception
	}
})


function perInfo(){
	$(".a-perInfo-id").html(lData.userId);
	
	var usertelephone = lData.userInfo.usertelephone;
	if (usertelephone) {
		var telphoneArr = usertelephone.split("");
		telphoneArr.splice(3,5,"******");
		var tel = telphoneArr.join("");
		$(".phone-number").html(tel);
	}
	
	$(".j-perInfo-tel").click(function(){
		$.showIndicator();
		$.router.load("bindtel.html");
	});
	
	$(".j-receipt").click(function(){
		$.showIndicator();
		$.router.load("receipt.html");
	});
}
