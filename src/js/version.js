$(function(){
	try{
		version();
	}catch(e){
		//TODO handle the exception
	}
})


function version(){
	$(".version_page .v-text").html("一元街 v"+lData.version)
}
