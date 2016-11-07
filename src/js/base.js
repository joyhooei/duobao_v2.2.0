var FZ = function(a, b) {
	function getFZ() {
		var width = document.documentElement.clientWidth || document.body.clientWidth;
		var fontSize = (a / b) * width;
		return fontSize;
	}
	document.documentElement.style.fontSize = getFZ() + "px";
	window.onresize = function() {
		setTimeout(function() {
			document.documentElement.style.fontSize = getFZ() + "px";
		}, 100);
	};
	document.body.scrollTop = 1;
};

FZ(20, 375);

//判断是否支持storage
var storageTest = function(storage){
    if(!!storage){
        try {
            storage.setItem("key", "value");
            storage.removeItem("key");
            return true;
        } catch(e){
            return false;
        }
    }else{
        return false;
    }
}

//判断iphone是否是无痕浏览模式
if (!storageTest(window.localStorage)){
	$.alert("请关闭Safari的无痕浏览模式");
}


//获取文件名中的参数
$.getUrlParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURIComponent(r[2]);
	return null;
};

//cookie操作
var cookie = {
	setCookie: function(name, value, time) {
		var strsec = cookie.getsec(time);
		var exp = new Date();
		exp.setTime(exp.getTime() + strsec * 1);
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	},
	getsec: function(str) {
		var str1 = str.substring(1, str.length) * 1;
		var str2 = str.substring(0, 1);
		if (str2 == "s") {
			return str1 * 1000;
		} else if (str2 == "m") {
			return str1 * 60 * 1000;
		} else if (str2 == "h") {
			return str1 * 60 * 60 * 1000;
		} else if (str2 == "d") {
			return str1 * 24 * 60 * 60 * 1000;
		}
	},
	getCookie: function(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

		if (arr = document.cookie.match(reg))
			return (arr[2]);
		else
			return null;
	},
	delCookie: function(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = cookie.getCookie(name);
		if (cval != null)
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	},

	error_warming: function(info) {
		if (judge.isNull(info))
			info = "网络错误 请重新打开";
		var error_info = '<div class="web_loading cf"><p>' + info + '</p><p><img src="' + href.img.errorWarming + '" alt=""/></p></div>';
		$(' .wrap').html(error_info);
	}
};

//带clear参数，清除所有本地数据及登录信息
if ($.getUrlParam("clear") == 1) {
	window.localStorage.clear();
	window.sessionStorage.clear();
	cookie.delCookie("orderIdPay");
	try {
		QC.Login.signOut();
	} catch (e) {
		//TODO handle the exception
	}
}

//判断页面在前台后台
var pageVisibility = (function() {
	var prefixSupport, keyWithPrefix = function(prefix, key) {
		if (prefix !== "") {
			// 首字母大写
			return prefix + key.slice(0, 1).toUpperCase() + key.slice(1);
		}
		return key;
	};
	var isPageVisibilitySupport = (function() {
		var support = false;
		if (typeof window.screenX === "number") {
			["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
				if (support == false && document[keyWithPrefix(prefix, "hidden")] != undefined) {
					prefixSupport = prefix;
					support = true;
				}
			});
		}
		return support;
	})();

	var isHidden = function() {
		if (isPageVisibilitySupport) {
			return document[keyWithPrefix(prefixSupport, "hidden")];
		}
		return undefined;
	};

	var visibilityState = function() {
		if (isPageVisibilitySupport) {
			return document[keyWithPrefix(prefixSupport, "visibilityState")];
		}
		return undefined;
	};

	return {
		hidden: isHidden(),
		visibilityState: visibilityState(),
		visibilitychange: function(fn, usecapture) {
			usecapture = undefined || false;
			if (isPageVisibilitySupport && typeof fn === "function") {
				return document.addEventListener(prefixSupport + "visibilitychange", function(evt) {
					this.hidden = isHidden();
					this.visibilityState = visibilityState();
					fn.call(this, evt);
				}.bind(this), usecapture);
			}
			return undefined;
		}
	};
})(undefined);

//判断浏览器类型
var browser = {
	ua: navigator.userAgent.toLowerCase(),
	isAndroid: function() {
		return (/android/.test(browser.ua)) ? true : false;
	},
}

//移除原js文件并重新加载运行
var _getScript = function(url, callback, tag) {
	$("script[src='" + url + "']").remove();

	if (tag == undefined) {
		tag = 'head';
	}
	var head = document.getElementsByTagName(tag)[0],
		js = document.createElement('script');
	js.setAttribute('type', 'text/javascript');
	js.setAttribute('src', url);
	head.appendChild(js);
	//执行回调
	var callbackFn = function() {
		if (typeof callback === 'function') {
			callback();
		}
	};
	if (document.all) { //IE
		js.onreadystatechange = function() {
			if (js.readyState == 'loaded' || js.readyState == 'complete') {
				callbackFn();
			}
		}
	} else {
		js.onload = function() {
			callbackFn();
		}
	}
}


//如果使用的是zepto，就添加扩展函数
if (Zepto) {
	$.getScript = _getScript;
}

//加载新js文件
function _getJs(src,callback){
	if ($("script[src*='"+src+"']").length > 0) {
		callback();
	}else{
		_getScript(src,function(){
			callback();
		})
	}
}

//加载新css文件
function _getCss(href,callback){
	if ($("link[href='"+href+"']").length > 0) {
		callback();
		return;
	}
	var swiperCss = document.createElement("link");
	swiperCss.setAttribute("rel", "stylesheet");
	swiperCss.setAttribute("type", "text/css");
	swiperCss.setAttribute("href", href);
	document.getElementsByTagName("head")[0].appendChild(swiperCss);
	callback();
}


//判断当前页面 page的 id   （主页 p-index）
$.whichPage = function(page) {
	return $("#"+page).length>0?true:false; 
	//根据url判断页面
//	var reg = new RegExp(page);
//	var r = reg.test(window.location.href);
//	return r;
}

//下拉刷新函数
function dropRefresh(ele,callback){
	//先解绑，防止重复调用
	$(document).off('refresh', ele+' .pull-to-refresh-content');
	
	$(document).on('refresh', ele+' .pull-to-refresh-content', function(e) {
		$.showIndicator();
		setTimeout(function(){
			callback();
			$.pullToRefreshDone('.pull-to-refresh-content');
			
			setTimeout(function(){
				$.hideIndicator();
				$.toast('刷新成功', 1000, 'toast-10');
			},200)
		},200)
	})
}

//判断是否支持css3
function supportCss3(style) {
	var prefix = ['webkit', 'Moz', 'ms', 'o'],
		i,
		humpString = [],
		htmlStyle = document.documentElement.style,
		_toHumb = function(string) {
			return string.replace(/-(\w)/g, function($0, $1) {
				return $1.toUpperCase();
			});
		};

	for(i in prefix)
		humpString.push(_toHumb(prefix[i] + '-' + style));

	humpString.push(_toHumb(style));

	for(i in humpString)
		if(humpString[i] in htmlStyle) return true;

	return false;
}

//全局基础方法
var baseFuc = {
	//ajax请求错误，点击刷新
	stateCode: function(o, stateCode) { //json对象，成功状态码
		if (o.stateCode != stateCode) {
			$.alert(o.message + ",点击确定刷新页面", function() {
				window.location = location;
			})
		}
	},
	
	//右滑返回
	swipe : function(){
		_getJs("libs/touch.js",function(){
			touch.on('.content', 'swiperight', function(ev) {
				ev.preventDefault();
				if ($.whichPage("p-index") || $.whichPage("p-chest") || $.whichPage("p-personal")) {
					return;
				}
				$.router.back();
			});
		})
	}

}


//强制注销
function forceSignOut(){
	try{
		QC.Login.signOut();
	}catch(e){
	}

	lData.userId = "";
	
	var channel = window.sessionStorage.getItem("channel");
	var skin = window.sessionStorage.getItem("skin");
	
	window.localStorage.clear();
	window.sessionStorage.clear();
	
	//保留channel、skin参数
	if (channel) {
		window.sessionStorage.setItem("channel",channel);
	}
	window.sessionStorage.setItem("skin",skin);
	//防止重复调用
	window.sessionStorage.setItem("forceSignOutFlag",1);
	window.location.href = "personal.html";
}

function callback(o) {
	if (lData.userId) {
		return;
	}
//	var qqcb = o;
//
//	console.log(o);
//	$.ajax({
//		type: "post",
//		url: "http://h5.7kuaitang.com/data/data.php",
//		data: {
//			u: "https://graph.qq.com/user/get_user_info?access_token=" + $.getUrlParam("access_token") + "&oauth_consumer_key=" + o.client_id + "&openid=" + o.openid
//		},
//		async: false,
//		dataType: "json",
//		success: function(o) {
//			console.log(o);
//			var openId = qqcb.openid;
//			var nickName = o.nickname;
//			window.sessionStorage.setItem("openId", openId);
//			window.sessionStorage.setItem("nickName", nickName);
//			
////			setTimeout(function() {
//				QCsaveAuth(openId, nickName);
////			}, 1000)
//
//			if ($.whichPage("login_page")) {
//				if (window.sessionStorage.getItem("loginFromPage") != null) {
//					$.router.load(window.sessionStorage.getItem("loginFromPage"));
//					window.sessionStorage.removeItem("loginFromPage");
//				} else {
//					window.location.href = "personal_page.html";
//				}
//			}
//
//		}
//	});
}

//ios提示保存到桌面
function saveToDesktop() {
	if (!$.device.ios || $.getUrlParam("platform") == 20 || navigator.standalone || window.sessionStorage.getItem("qktId") || $.getUrlParam("qktId") || navigator.userAgent.indexOf("QQ") > -1 || navigator.userAgent.indexOf("MicroMessenger") > -1 || $.getUrlParam("token") || window.sessionStorage.getItem("thirdId") ) {
		$(".save-to-desktop").hide();
		return;
	}
	if (window.sessionStorage.getItem("saveToDesktop") != 1) {
		$(".save-to-desktop").show()

		window.sessionStorage.setItem("saveToDesktop", 1);
		
		alertRegisterBonus("show");
	} else {
		$(".save-to-desktop").hide();
		
		alertRegisterBonus("hide");
	}
}

//弹出注册领红包遮罩层
function alertRegisterBonus(status){
	if (status == "show") {
		if (!lData.userId) {
			$(".alert-resiger-bonus").show();
		}
	}else if(status == "hide") {
		$(".alert-resiger-bonus").hide();
	}
}

//ajax全局设置
$.ajaxSettings.error = function(e,f){
	console.log(event.target);
	if (/graph.qq/.test(event.target.src)) {
		return;
	}
	$.alert("请求服务器超时，请重试",function(){
		$.hideIndicator();
	});
};


//传入数据
var lData = {
	userId: "",		//用户ID
	version: "2.2.0",	//客户端版本号
	srvVersion: "2.1.0",		//服务端版本号
	channel: "h5",		//channel ID
	jsVersion: CryptoJS.MD5("1101").toString(),    //先加载的js文件版本号
	
	//正式网
	getUrl: "http://api.2333db.com/raiders/restWeb/",
	qqLoginReUrl: "www.2333db.com/callback/qc_back.html",	//2333db.com
	calcTestUrl: "",
	bannerBackUrl: "http://www.2333db.com/duobao/register.html",
	bannerBackUrlRecharge: "http://www.2333db.com/duobao/personal.html",
		
	//测试网
//	getUrl: "http://www.7kuaitang.com:8081/raiders/restWeb/",
//	qqLoginReUrl: "www.2333db.com/callback/qc_back2.html",		// 2333db.com/test/
//	calcTestUrl: "&test=1",
//	bannerBackUrl: "http://www.2333db.com/test/register.html",
//	bannerBackUrlRecharge: "http://www.2333db.com/test/personal.html",

	test : function(){
		if (/（/.test($("h1.title").html())){
			return;
		}
		$("h1.title").html($("h1.title").html()+"（测试版）");
	}
}

//参数中带有channelID，则相应改变lData.channel
if ($.getUrlParam("channel")) {
	lData.channel = $.getUrlParam("channel");
	window.sessionStorage.setItem("channel",$.getUrlParam("channel"));
}else{
	if (window.sessionStorage.getItem("channel")) {
		lData.channel = window.sessionStorage.getItem("channel");
	}
}

if (/iphone|ipad/i.test(navigator.userAgent)) {
	window.localStorage.href = "groupmoney://buttonclick";
}

//判断userId相关是否状态正常，不正常则强制注销
if (window.localStorage.getItem("userId") != null && window.localStorage.getItem("userInfo") != null && window.localStorage.getItem("userInfo") != 'undefined') {
	if (window.localStorage.getItem("userId")&&CryptoJS.MD5(window.localStorage.getItem("userId")).toString() == window.localStorage.getItem("mid")) { 
		lData.userId = window.localStorage.getItem("userId");
		lData.userInfo = $.parseJSON(window.localStorage.getItem("userInfo"));
	}else{
		forceSignOut();
	}
}else{
//	getUserInfo();
}


//获取用户信息
function getUserInfo(){
	if (window.localStorage.getItem("userId")&&CryptoJS.MD5(window.localStorage.getItem("userId")).toString() == window.localStorage.getItem("mid")) {
		$.ajax({
			type:"post",
			url:lData.getUrl+"userDetail",
			data:{
				v: lData.srvVersion,
				content: encryptByDES(JSON.stringify({
					userId:window.localStorage.getItem("userId")
				}))
			},
			async:false,
			dataType:"json",
			success:function(o){
				console.log(o);
				if (o.stateCode == 0) {
					lData.userInfo = o.userInfo;
					
					window.localStorage.setItem("userInfo",JSON.stringify(o.userInfo));
					window.sessionStorage.setItem("bunusList",JSON.stringify(o.userInfo.hongbaoList));
					
					//强制更新剩余金币数目
					if ($("#balanceSum").length > 0) {
						$("#balanceSum").html(o.userInfo.detailInfo.points);
					}
					
					//红包数目
					var bonusNumber = 0;
					$.each(o.userInfo.hongbaoList, function(i,n) {
						if (n.status == 0 || n.status == 3) {
							bonusNumber += 1;
						}
					});
					
					if ($("#a-bonus-count > span").length == 0) {
						$("#a-bonus-count").prepend(
							'<span style="line-height: 1.2rem;padding-right: .5rem;font-size: .7rem;color: #b0b0b0;"><span class="count" style="color: #f24957;">'+bonusNumber+'</span> 个</span>'
						);
					}else{
						$("#a-bonus-count .count").html(bonusNumber);
					}
					
					//判断是否有充值送红包活动
					if (o.hasActivity == 1) {
						if ($("#recharge-bonus-haveornot .haveornot-text").length == 0) {
							$("#recharge-bonus-haveornot").prepend(
								'<span class="haveornot-text" style="line-height: 1.4rem;padding-right: .5rem;font-size: .7rem;color: #f24957;">送红包</span>'
							);
						}
					}else{
						$("#recharge-bonus-haveornot .haveornot-text").remove();
					}
					
					//判断是否绑定了手机号
					if (!o.userInfo.usertelephone) {
						if ($(".j-perInfo").find(".item-after > span").length == 0) {
							$(".j-perInfo").find(".item-after").prepend(
								'<span style="line-height:1.45rem;padding-right:.5rem;font-size:.7rem;color:#b0b0b0;">未完善</span>'
							);
						}
					}else{
						$(".j-perInfo").find(".item-after > span").remove();
					}
				}else{
					$.alert(o.message,function(){
						forceSignOut();
					});
				}
			},
		});
		
	}else{
		forceSignOut();
	}
}



//百度统计
var _hmt = _hmt || [];
function bdhm(){
	var hm = document.createElement("script");
	hm.src = "//hm.baidu.com/hm.js?fb86b39e6dd3593f60f69218a8b815a5";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
}

//vds统计
function vdshm(){
	var _vds = _vds || [];
	window._vds = _vds;
	(function(){
		_vds.push(['setAccountId', 'bdd0f83d74ae607c']);
		_vds.push(['setCS1', 'channel', lData.channel]);
		_vds.push(['setCS2', 'version', lData.version]);

		(function() {
			var vds = document.createElement('script');
			vds.type='text/javascript';
			vds.async = true;
			vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(vds, s);
		})();
	})();
}

//初始化
function init(){
	window.sessionStorage.removeItem("indexForceRefresh");
	window.sessionStorage.removeItem("indexLoadFinish");
	window.sessionStorage.removeItem("duobaoRefresh");
	//msui初始化
	$.init();
}


$(function(){
	init();
	
	//调用保存到桌面函数
	saveToDesktop();
	
//	正式网调用百度统计
	if (!lData.calcTestUrl && !/127.0.0.1/.test(window.location.href)) {
		bdhm();
		vdshm();
	}

})

//各页面注册时触发
$(document).on("pageInit", function(e, pageId, $page) {
	//加入telphone=no meta标签
	if ($("meta[content='telephone=no']").length == 0) {
		$("meta[content=black]").after('<meta name="format-detection" content="telephone=no" />');
	}
	
	//若userId状态不正常，强制注销
	if (pageId != "p-personal") {
		if (window.localStorage.getItem("userId")&&CryptoJS.MD5(window.localStorage.getItem("userId")).toString() != window.localStorage.getItem("mid")) {
			forceSignOut();
		}
	}else{
		if (window.sessionStorage.getItem("forceSignOutFlag")) {
			$.alert("出现问题了～请重新登陆");
			window.sessionStorage.removeItem("forceSignOutFlag");
		}
	}
	
	//nav点击，根据name值跳转
	if (pageId == "p-index"||"p-chest"||"p-personal" || "p-share" ) {
		$(".a-nav-bottom").find(".tab-item").click(function(){
			if (!$(this).hasClass("active")){
				$.router.load($(this).attr("name"));
			}
		})
	}
	
	//7块糖相关js
	if (window.sessionStorage.getItem("qktId") != null || $.getUrlParam("qktId") != null) {
		baseFuc.swipe();
		_getScript("js/qkt.js?rev="+lData.jsVersion);
	}
	
	//第三方渠道相关js
	if ((window.sessionStorage.getItem("thirdId") != null && window.sessionStorage.getItem("thirdToken") != null ) || ($.getUrlParam("token") != null && $.getUrlParam("userId") != null )) {
		_getScript("js/third.js?rev="+lData.jsVersion);
	}
	
	//七块糖注册、绑定等页面无相应页面js文件
	if (/qkt/.test(pageId)) {
		return;
	}
	
	//加载对应页面js
	_getScript("js/"+ pageId.substring(2) + ".js?rev="+lData.jsVersion);
	
	//测试网调用标题栏加测试文字
	if (!!lData.calcTestUrl) {
		lData.test();
	}
});
 



//安卓webview返回键 七块糖
function qktAndroidBackFuc(){
	if ($.whichPage("p-index") || $.whichPage("p-chest") || $.whichPage("p-personal") || $.whichPage("p-share")) {
		window.jsToJava.javaMethod(true);
	}else{
		$.router.back();
		window.jsToJava.javaMethod(false);
	}
}


//安卓webview返回 抢红包
function duobaoBackFuc(){
	if ($.whichPage("p-index") || $.whichPage("p-chest") || $.whichPage("p-personal") || $.whichPage("p-share")) {
		window.duoBaoCallBack.finish();
	}else{
		$.router.back();
	}
}
