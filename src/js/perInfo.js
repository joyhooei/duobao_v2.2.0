$(function(){
	try{
		$.closeModal();
		perInfo();
	}catch(e){
		//TODO handle the exception
	}
})


function perInfo(){
	$(".a-perInfo-id").html(luanmingli.userId);
	
	var usertelephone = luanmingli.userInfo.usertelephone;
	if (!!usertelephone) {
		var telphoneArr = usertelephone.split("");
		telphoneArr.splice(3,5,"******");
		var tel = telphoneArr.join("");
		$(".phone-number").html(tel);
	}
	
	var nickname = luanmingli.userInfo.nickName;
	if (!!nickname) {
		$("#p-perInfo .nick-name").html(nickname);
	}
	
	$(".j-nickname-change").click(function(){
		$.showIndicator();
		$.router.load("nickname-change.html");
	});
	
	$(".j-perInfo-tel").click(function(){
		$.showIndicator();
		$.router.load("bindtel.html");
	});
	
	$(".j-receipt").click(function(){
		$.showIndicator();
		$.router.load("receipt.html");
	});
}
