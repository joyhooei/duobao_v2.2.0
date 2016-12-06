$(function(){
	try{
		signOut();
		settingLinkTo();
	}catch(e){
		//TODO handle the exception
	}
	
})

function signOut(){
	if (luanmingli.userId) {
		if ((window.sessionStorage.getItem("qktId") != null || $.getUrlParam("qktId") != null) && !window.sessionStorage.getItem("backurl") ) {
			return;
		}
		
		if (luanmingli.thirdId) {
			return;
		}
		
		$("#p-setting").find(".exit").show();
	}else{
		$("#p-setting").find(".exit").hide();
	}
	
	$("#p-setting").find(".exit").click(function(){
		try{
			QC.Login.signOut();
		}catch(e){
		}

		luanmingli.userId = "";
		
		$.alert("注销成功",function(){
			window.sessionStorage.setItem("qqSignOut","1");
			$.router.back();
			setTimeout(function(){
				var smcurrentState = window.sessionStorage.getItem("sm.router.currentState");
				var smmaxStateId = window.sessionStorage.getItem("sm.router.maxStateId");
				var channel = window.sessionStorage.getItem("channel");
				var skin = window.sessionStorage.getItem("skin");
				
				window.localStorage.clear();
				window.sessionStorage.clear();
				window.sessionStorage.setItem("sm.router.currentState",smcurrentState);
				window.sessionStorage.setItem("sm.router.maxStateId",smmaxStateId);
				window.sessionStorage.setItem("skin",skin);
				if (channel) {
					window.sessionStorage.setItem("channel",channel);
				}
				window.sessionStorage.setItem("qqSignOut","1");
			},200);
		});
	})
}
		

function settingLinkTo(){
	$(".j-helpcenter").click(function(){
		$.router.load("help.html");
	});
	
	$(".j-versioninfo").click(function(){
		$.router.load("version.html");
	});
}
