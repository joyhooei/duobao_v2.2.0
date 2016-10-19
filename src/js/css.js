/*
 * 皮肤选择  
 * url中拼入 skin 参数
 * 可选value为   green
 * 加载相应css:common-${skin}.css
 * */



function getSkinParam(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURIComponent(r[2]);
	return null;
}

if (getSkinParam("skin")) {
	window.sessionStorage.setItem("skin",getSkinParam("skin"));
}


function cssRepeat(){
	var links = document.getElementsByTagName("link");
	for (var i = 0 ; i < links.length ; i++) {
		if (/common/.test(links[i].getAttribute("href"))) {
			return true;
		}
	}
}


function appendCss(cssName){
	var common = document.createElement("link");
	common.setAttribute("rel", "stylesheet");
	common.setAttribute("type", "text/css");
	var newDate = new Date().getTime();
	common.setAttribute("href", "css/"+cssName+".css?rev="+newDate);
	document.getElementsByTagName("head")[0].appendChild(common);
}



if (!cssRepeat()) {
	var skin = getSkinParam("skin") || window.sessionStorage.getItem("skin");
	if (skin && (skin == "green" || skin == "red") || skin=="blcak") {
		appendCss("common-"+skin);
	}else{
		appendCss("common");
	}
}
