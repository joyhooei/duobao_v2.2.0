$(function(){
	try{
		var treasureId = $.getUrlParam("treasureId");
		var goodtype = $.getUrlParam("goodtype");
		calc(treasureId,goodtype);
	}catch(e){
		//TODO handle the exception
	}
})


function calc(treasureId,goodtype){
	var test = lData.calcTestUrl;
	if (goodtype == 2) {
		$("#calc-iframe").attr("src","http://www.2333db.com/calc-second/index.html?treasureId="+treasureId+test);
	}else{
		$("#calc-iframe").attr("src","http://www.2333db.com/calc/index.html?treasureId="+treasureId+test);
	}
}
