$(function(){
	try{
		version();
	}catch(e){
		//TODO handle the exception
	}
})


function version(){
	$(".version_page .v-text").html("黄金夺宝 v"+lData.version)
}
