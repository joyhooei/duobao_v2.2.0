$(function(){
	try{
		if ($("#p-myshare").find(".list").length > 0 && !window.sessionStorage.getItem("myshareForceRefresh")) {
			return;
		}
		if (window.sessionStorage.getItem("myshareForceRefresh") == 1) {
			$("#p-myshare").find(".list").remove();
			window.sessionStorage.removeItem("myshareForceRefresh");
		}
		
		myShareGetData(1);
		
		dropRefresh("#p-myshare",myShareRefresh);	//下拉刷新
	}catch(e){
		//TODO handle the exception
	}
})


function myShareGetData(curPage){
	
	$.showIndicator();
	$.ajax({
		type:"post",
		url:luanmingli.getUrl+"getShareOrder",
		data:{
			currentPage : curPage,
			userId : luanmingli.userId,
			v: luanmingli.srvVersion
		},
		async:true,
		dataType:"json",
		success:function(o){
			console.log(o);
			
			if (o.stateCode == 0) {
				if (o.shareOrderList.length == 0) {
					if ($(".no-share").length == 0) {
						$("#p-myshare").find(".content").append(
							'<div class="no-share">'+
								'<div class="content-block z_not_record">'+
									'<div class="no_record">您还没有晒单记录哦</div>'+
									'<a class="back global_button button now_participate" style="line-height: 2.4rem;">返回</a>'+
								'</div>'+
							'</div>'
						);
					}
				}else{
					$.each(o.shareOrderList, function(i,n) {
						$("#p-myshare").find(".content").append(
							'<div onclick="goThisDuobao('+n.treasureId+');" class="list card">'+
								//'<div class="hd-image"></div>'+ //头像
								'<div>'+
									'<div class="head">'+
										'<p class="text2">'+n.sharedContent+'</p>'+
									'</div>'+
									'<div class="image-box clearfix">'+
										imageBoxSrc(n)+
									'</div>'+
									'<div class="info">'+
										'<p class="text1">'+n.goodsName+'</p>'+
										'<p class="text2">期号:第'+n.phaseNumber+'期&nbsp;本期参与<span class="text-orange">'+n.buyCount+'</span>人次／总需<span class="text-orange">'+n.totalCount+'</span>人次</p>'+
									'</div>'+
									'<div class="foot">'+
										'<span class="text">'+n.commitTime+'</span>'+
										'<span onclick="goNewDuobao('+n.treasureId+',\''+n.onSell+'\');" class="button">再次购买</span>'+
									'</div>'+
								'</div>'+
							'</div>'
						);
						
					});
					
					$(".div-image").height($(".div-image").width());
					
					myshareTotlePage = o.totalPage;
					myshareBottomLoadmore(o.currentPage);
				}
			}else{
				$.alert(o.message);
			}
			
			
			setTimeout(function(){
				$.hideIndicator();
			},500);
		}
	});
}


function imageBoxSrc(n){
	var imagesArr = n.imagesThumb.split(",");
	var reImage = "";
	$.each(imagesArr, function(ii,nn) {
		if (nn) {
//			reImage += '<div class="div-image" style="background:url('+nn+') center center no-repeat;background-size:cover;"></div>';
			reImage += '<div onclick="openPhotoBrowser(\''+n.images+'\',this,\''+n.sharedContent+'\');" class="div-image" style="background:url('+nn+') center center no-repeat;background-size:cover;"></div>';
		}
	});
	return reImage;
}


function goThisDuobao(treasureId){
	event.stopPropagation();
	$.router.load("duobao.html?treasureId="+treasureId);
}

function goNewDuobao(treasureId,onsell){
	event.stopPropagation();
	if (onsell == 1) {
		$.router.load("duobao.html?treasureId="+treasureId+"&type=2");
	}else{
		$.alert("商品已下架");
	}
	
	
}


//下拉刷新
function myShareRefresh(){
	$("#p-myshare").find(".list").remove();
	myShareGetData(1);
}


//上滑加载更多
function myshareBottomLoadmore(curPage){
	if (curPage > myshareTotlePage || myshareTotlePage == 1) {
		return;
	}
	
	$(document).off('infinite', '#p-myshare .infinite-scroll');
	var loadMoreFlag = false;
	
	$(document).on('infinite', '#p-myshare .infinite-scroll',function() {
		if (loadMoreFlag) {
			return;
		}
		
		
		loadMoreFlag = true;
		$.showIndicator();
		
		setTimeout(function(){
			
			if (myshareTotlePage && curPage >= myshareTotlePage){
				setTimeout(function(){
					$.hideIndicator();
					$.toast('没有更多数据', 1000, 'toast-80');
					loadMoreFlag = false;
					$(document).off('infinite', '#p-myshare .infinite-scroll');
				},200)
				return;
			}
			
			
			myShareGetData(curPage+1);
			setTimeout(function(){
				$.hideIndicator();
				$.toast('加载成功', 1000, 'toast-80');
				loadMoreFlag = false;
			},200)
		},200)

	})
	
}



//查看大图
function openPhotoBrowser(images,that,sharedContent){
	event.stopPropagation();
	var imgArr = images.split(",");
	var dataPhotos = new Array();
	$.each(imgArr,function(i,n){
		dataPhotos.push({
			url : n,
			caption: sharedContent
		})
	})
	
	_getCss("libs/msui-extend.min.css",function(){
		_getJs("libs/msui-extend.min.js",function(){
			$.photoBrowser({
				photos: dataPhotos,
//				theme: "dark",
				type: 'popup'
			}).open($(that).index());
			$(".popup.photo-browser-popup .bar-nav").addClass("c_header");
		});
	});

}