$(function(){
	try{
		$.showIndicator();
		imageShow();
		imageRelease();
		textArea();
	}catch(e){
		//TODO handle the exception
	}
})

//输入框字数限制
var textLengthLimit = 80;

function imageShow(){
	if ($(".showstatus-not").length == 0 && $(".showstatus-ing").length == 0) {
		$(".a-share-send-goodsinfo").html($.getUrlParam("goodsinfo"));
		$(".img-wrap").append(
			'<input id="image-ipt" onchange="readAsDataURL();" type="file" multiple capture="camera" style="display:block;opacity:0;height:0;" />'+
			'<div class="showstatus-not clearfix">'+
				'<label for="image-ipt" >'+
					'<img src="img/addpicture.png" />'+
				'</label>'+
				'<p>快来晒出你收到的包裹和奖品吧～</p>'+
			'</div>'
		);
	}
	
	setTimeout(function(){
		$.hideIndicator();
	},500);
}




var imageArr = [];
//var fileArr = [];
function readAsDataURL() {
	var file = [];
	$.each($("#image-ipt")[0].files, function(i,n) {
		file.push(n);
	});
	
	if (file == 0) {
		return;
	}
	
	if ($(".showstatus-ing").length == 0) {
		$(".img-wrap").append(
			'<div class="showstatus-ing clearfix"></div>'
		);
	}
	
	$.each(file, function(i,n) {
		console.log(file)
		if(!/image\/\w+/.test(n.type)) {
			$.alert("请选择正确的图片格式");
			return;
		}else{
			var reader = new FileReader();
			reader.readAsDataURL(n);
			reader.onload = function(e) {
				$(".showstatus-not").remove();
				if (imageArr.indexOf(e.target.result) > -1 ) {
					$.alert("请勿重复选择图片")
				}else{
					if (imageArr.length == 3) {
						$.alert("最多选择三张图片");
					}else{
						
						compression(e.target.result,400,function(m){
							imageArr.push(m);
//							fileArr.push(n);
							
							
							if (i+1 == file.length) {
								insertImg(imageArr);
							}
						});
						
//						imageArr.push(e.target.result);
//						fileArr.push(n);
					}
				}
				
				
			}
		}
	});
}

function compression(src,w,cbk){
	var _canvas = document.createElement('canvas');
	var tImg = new Image();
	tImg.onload = function() {
		var maxKB = 40000;
		
		var maxLength = maxKB/.75;
		var widthOld = tImg.width;
		var heightOld = tImg.height;
		
		console.log(w)
		var widthNew = w;
		var heightNew = w/widthOld*heightOld; 
		
		tImg.width = widthNew;
		tImg.height = heightNew;
		
		_canvas.width = widthNew;
		_canvas.height = heightNew;
		
		var _context = _canvas.getContext('2d');
		_context.clearRect(0, 0, widthNew, heightNew);
		
		if (widthOld > heightOld) {
			_canvas.width = heightNew;
			_canvas.height = widthNew;
			_context.translate(heightNew/2,widthNew/2);
			_context.rotate(90*Math.PI/180);
			_context.translate(-widthNew/2,-heightNew/2);
//			console.log(heightNew)
//			console.log(widthNew)
//			console.log(tImg.width)
//			console.log(tImg.height)
			_context.drawImage(tImg,0,0,widthNew,heightNew); 
		}else{
			_context.drawImage(tImg, 0, 0, widthNew, heightNew); 
		}
		
		_context.restore();
		var type = 'image/png';
		
		var newSrc = _canvas.toDataURL(type)
		console.log(newSrc.length)
		if (newSrc.length >= maxLength && w > 100) {
//			console.log("src"+src.length);
//			console.log("newsrc"+newSrc.length);
//			console.log(widthOld+";old;"+heightOld)
//			console.log(tImg.width+";now;"+tImg.height)
			
			var ww = Math.floor(Math.sqrt(w*w*(maxLength)/newSrc.length));
			compression(src,ww,cbk)
			return;
		}
		
		cbk(newSrc);
	};
	tImg.src = src;
}



function insertImg(imgArr){
	if (imgArr.length == 0) {
		$(".showstatus-ing").remove();
		if ($(".showstatus-not").length == 0 ) {
			$(".img-wrap").append(
				'<div class="showstatus-not clearfix">'+
					'<label for="image-ipt" >'+
						'<img src="img/addpicture.png" />'+
					'</label>'+
					'<p>快来晒出你收到的包裹和奖品吧～</p>'+
				'</div>'
			);
		}
		return;
	}
	
	$(".showstatus-ing").find(".checking-img").remove();
	$.each(imgArr, function(i,n) {
		$(".showstatus-ing").append(
			'<div class="checking-img">'+
//				'<img src="' + n +'" />'+
				'<div style="width:5.5rem;height:5.5rem;background:url('+n+') center center no-repeat;background-size:cover;"></div>'+
				'<i onclick="deleteImg(this);" class="delete-icon"></i>'+
			'</div>'
		);
	});
	
	
	if (imgArr.length < 3) {
		$.each(new Array(3-imgArr.length), function(i,n) {
			$(".showstatus-ing").append(
				'<label class="checking-img" for="image-ipt">'+
					'<img src="img/addpicture.png" />'+
				'<label>'
			);
		});
	}
	
	$("#image-ipt")[0].outerHTML=$("#image-ipt")[0].outerHTML
}


function deleteImg(that){
	imageArr.splice($(that).parent().index(),1);
//	fileArr.splice($(that).parent().index(),1);
	insertImg(imageArr)
}

var upLoadFlag;
function imageRelease(){
	$(".release-btn").on('click',function(){
		if (upLoadFlag) {
			return;
		}
		
//		$.each(fileArr, function(i,n) {
//			console.log(n.name)
//		});
		
		
//		if (fileArr.length == 0) {
//			$.alert("请选择图片");
//			return;
//		}
		if (imageArr.length == 0) {
			$.alert("请选择图片");
			return;
		}
		
		if ($("#textArea").val().length < 10) {
			$.alert("不能少于10个字");
			return;
		}
		
		if ($("#textArea").val().length > textLengthLimit ) {
			$.alert("不能超过"+textLengthLimit+"个字");
			return;
		}
		
		
		var specialReg = /^[\u4E00-\u9FA5\w\d\,\.\/\?\<\>\;\:\'\"\\\|\[\]\{\}\=\+\-\_\)\(\*\&\^\%\$\#\@\!\，\。\／\《\》\？\；\‘\：\“\、\｜\［\］\｛\｝\＝\＋\－\—\）\（\＊\&\…\％\¥\＃\@\！\｀\～\`\~]+$/;
		if (!specialReg.test($("#textArea").val())) {
			var textArr = $("#textArea").val().split("");
			var specialArr = [];
			$.each(textArr, function(i,n) {
				if (!specialReg.test(n)) {
					if ($.inArray(n,specialArr) == -1){
						specialArr.push(n);
					}
				}
			});
			var specialText = specialArr.join(",");
			
			$.alert("非法字符："+specialText+"<br />请重新输入");
			return;
		}
		
		
		upLoadImageToOwn();
	});
}


//上传图片
function upLoadImageToOwn(){
	upLoadFlag = true;
	
	$.showPreloader('上传中');
	
	var FileController = lData.getUrl+"addShareOrder";
//	var FileController = "http://192.168.0.197:8080/raiders/restWeb/addShareOrder";
	
	var form = new FormData();
	form.append("userId", lData.userId);
	form.append("treasureId", $.getUrlParam("treasureId"));
	form.append("shareContent", $("#textArea").val());
	form.append("v",lData.srvVersion);
	
//	$.each(fileArr, function(i,n) {
//		form.append("file", n);
//	});

	$.each(imageArr, function(i,n) {
		form.append("image"+(i+1), n);
	});

	
	var xhr = new XMLHttpRequest();
	xhr.open("post", FileController, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			setTimeout(function(){
				$.hidePreloader();
			},400)
		 	var status = xhr.status;
		 	if(status >= 200 && status < 300) {
		 		var o = $.parseJSON(xhr.response);
		 		if (o.stateCode == 0) {
		 			window.sessionStorage.setItem("myshareForceRefresh",1);
		 			window.sessionStorage.setItem("prizeForceRefresh",1);
		 			
		 			window.sessionStorage.removeItem("shareFailed");
		 			
		 			$.alert("晒单成功",function(){
		 				upLoadFlag = false;
			 			window.history.go(-3);
			 		});
		 		}else{
		 			$.alert(o.message,function(){
			 			window.sessionStorage.setItem("shareFailed",$("#textArea").val());
			 			window.location.reload(true);
			 		});
		 		}
		 		
		 	} else {
		 		$.alert("上传失败，请刷新重试",function(){
		 			window.sessionStorage.setItem("shareFailed",$("#textArea").val());
		 			window.location.reload(true);
		 		});
		 	}
		 }
	};
	
	xhr.send(form);
}


function textArea(){
	if (window.sessionStorage.getItem("shareFailed")) {
		$("#textArea").val(window.sessionStorage.getItem("shareFailed"));
	}
	
	
	$("#textArea").on("keyup",function(){
		var textVal = $("#textArea").val();
		if (textVal.length > textLengthLimit) {
			if ($(".text-over").length == 0){
				$(".img-wrap").append(
					'<span class="text-over"></span>'
				);
			}
			$(".text-over").html(textLengthLimit-textVal.length);
		}else{
			$(".text-over").remove();
		}
	});
}
