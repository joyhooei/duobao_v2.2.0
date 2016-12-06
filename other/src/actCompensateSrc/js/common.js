$(function(){
	actCompensate.init();
})

var $ = (function($){
	$.FZ = function(a, b) {
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
	
	$.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return decodeURIComponent(r[2]);
		return null;
	};
	
	
	//弱弹窗  @内容  @～行数 @～宽度(60%) @～时间(3000) @～元素(body)
	$.toast = function(text,line,width,t,ele){
		var context = ele == null ? $('body') : $(ele);
	    var message = text; 
	    var time = t == null ? 3000 : t;
	    
	    $("#toastMessage").remove();
	    var toastEle = $(
	    		'<div id="toastMessage">'+text+'</div>'
	   	).appendTo(context);
	   	var width = !!width ? width:"60%";
	   	var height = !!line ? parseInt(line)*16+"px":toastEle.height()+"px";
	    toastEle.css({
	    		boxSizing: "content-box",
	    		position: 'absolute',
	    		top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			margin: 'auto',
			padding:"10px",
			width:width,
			height:height,
			lineHeight:"16px",
			zIndex: 99999,
			backgroundColor: 'black',
			color: 'white',
			fontSize: '16px',
			borderRadius: '5px',
			textAlign: "center",
			wordBreak: "break-all"
	    }).hide().fadeIn(time/2).fadeOut(time/2);
	    setTimeout(function(){
			$("#toastMessage").remove();			    	
	    },time)
	}
	
	return $;
})(jQuery)

$.FZ(20,360);

var actCompensate = (function($){
	var flag = false;
	var init = function(){
		$(".m-btn").on("click",function(){
			if (flag) {
				return;
			}
			$(".g-notice").show();
			$("body").animate({
				scrollTop: $('.g-wrapper').height()
			},function(){
				$(".g-notice .m-text").fadeIn();
				flag = true;
			})
		});
	}
	return {
		init: init
	}
})(jQuery)

