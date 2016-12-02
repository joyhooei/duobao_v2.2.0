$(function(){
	flowList.init();
})


var flowList = (function($){
	var serverUrl1 = "http://api.2333db.com/raiders/api/";
	var serverUrl2 = "http://www.7kuaitang.com:8081/raiders/api/";
	var serverUrl = serverUrl1;
	
	var serverName = function(){
		$("#serverName").html("正式网");
		
		$("#ser1").on("click",function(){
			$("#serverName").html("正式网");
			serverUrl = serverUrl1;
		});
		$("#ser2").on("click",function(){
			$("#serverName").html("测试网");
			serverUrl = serverUrl2;
		});
	}
	
	var bindClick = function(){
		$("#my97").on("click",WdatePicker);
		$("#search-btn").on("click",function(){
			if (!$("#my97").val()) {
				alert("请先选择日期");
				return;
			}
			request($("#my97").val());
		})
	}
	var request = function(time){
		console.log(time);
		$.ajax({
			type:"get",
			url:serverUrl+"activeList",
			data:{
				date: time
			},
			dataType:"json",
			async:true,
			success:function(o){
				console.log(o);
				$("#list > div").remove();
				if (o.length == 0) {
					if ($("#list").find(".nomore").length > 0) {
						$("#list").find(".nomore").remove();
					}
					$("#list").append(
						'<p class="nomore">未查询到数据</p>'
					);
				}else{
					$("#list").find(".nomore").remove();
					fillData(o);
				}
			}
		});
	}
	var fillData = function(o){
		$.each(o, function(i,n) {
			$("#list").append(
				'<div>'+
					'<span>'+n.appendNumber+'</span>'+
					'<button class="delete" name="'+n.id+'">删除此条记录</button>'+
				'</div>'
			);
		});
		
		$(".delete").on("click",function(){
			var id = $(this).attr("name");
			var that = this;
			$.ajax({
				type:"get",
				url:serverUrl+"setActiveUsed",
				data:{
					id: id
				},
				dataType:"json",
				async:true,
				success:function(o){
					console.log(o)
					if (o.stateCode == 0) {
						$(that).parent().remove();
					}else{
						alert(o.message);
					}
				}
			});
		})
	}
	
	var init = function(){
		serverName();
		bindClick();
	}
	
	return {
		init: init
	}
})(jQuery)
