function indexFixedTab(){if(2==indexFixedTabFlag){var e=2*parseInt($("html").css("font-size"));$(".a-tab-list").fixedTab({offset:e}),window.sessionStorage.setItem("indexFiedTop",$("#p-index .pull-to-refresh-layer").height()+$("#p-index .swiper-container").height()+$("#scrollInfo").height())}else setTimeout(function(){indexFixedTab()},100)}function cardHeight(){var e=$("#p-index .index_model .card-header .card-cover");e.height(.655817*e.width())}function scrollInfoFill(e){var i=0;$("#scrollWrapper").append('<div ontouchmove="javascript:event.preventDefault();" id="scrollInfo"><div class="scroll-image"></div><div class="scrolltestbar"><div class="scrolltext-box"></div></div></div>'),$.each(e.notiInfoList,function(e,n){$("<div class='scrolltext' style='color:#b0b0b0;'>恭喜<span class='a8'>"+n.nickName+"</span>"+n.luckyTime+"前获得<span style='color:#5d5d5d;'>"+n.goodsTitle+"</span></div>").appendTo($("#scrollInfo").find(".scrolltext-box")),i+=$(".scrolltext").eq(e).width()}),$(".scrolltext-box").width(i+30),$("#scrollInfo").width($(".scrolltext-box").width()-$("body").width());var n=null;if($.device.android&&!n){$(".scrolltext-box").css("height","100%").removeClass("scrolltext-box").addClass("scrolltext-box2");var t=0;n&&clearInterval(n),$("#scrollInfo").css("width","100%"),n=setInterval(function(){t+=1,$(".scrolltestbar").scrollLeft(t),$(".scrolltestbar").scrollLeft()>=$(".scrolltext-box2").width()-$("body").width()-5&&(t=0)},20)}indexFixedTabFlag+=1}function scrollInfo(){}function tabClick(){$(".a-tab-list").find("a").click(function(){$(this).hasClass("active")||(clickNoLoadmore=1,$(".pull-to-refresh-content").scrollTop(0),$(".i_load_more").html("加载更多&darr;"),$(".a-tab-list a").removeClass("active"),$(this).addClass("active"),$(".index-active").hide(),$("#index-active-"+$(this).index()).show(),tabSelect($(this).index(),1))})}function tabSelect(e,i){$("#index-active-"+e).find(".index_model").length>0&&null==window.sessionStorage.getItem("indexForceRefresh")||null!=window.sessionStorage.getItem("indexForceRefresh")&&window.sessionStorage.getItem("indexForceRefresh").indexOf(e)==-1||($("#index-active-"+e).find(".index_model").remove(),0==e?indexFillData(e,i,2):1==e?indexFillData(e,i,3):2==e&&indexFillData(e,i,1),indexBottomLoadmore())}function indexFillData(e,i,n,t){$.showIndicator(),$.ajax({type:"get",url:luanmingli.getUrl+"getTreasureList",data:{currentPage:i,order:n,v:luanmingli.srvVersion,type:1},async:!0,dataType:"json",success:function(n){if(!(i>n.totalPage)){if(luanmingli.indexTotalPage[e]=n.totalPage,$.each(n.treasureInfoList,function(i,n){appendData($("#index-active-"+e),n)}),null!=window.sessionStorage.getItem("indexForceRefresh")){var a=window.sessionStorage.getItem("indexForceRefresh").split(","),o=$.map(a,function(i){return i==e?null:i});0==o.length?window.sessionStorage.removeItem("indexForceRefresh"):window.sessionStorage.setItem("indexForceRefresh",o)}t&&t(),setTimeout(function(){n.totalPage>1&&$(".i_load_more").show(),$.hideIndicator()},200)}}})}function appendData(e,i){$(e).append('<div onclick="routerToDuobao('+i.treasureId+')" name="'+i.treasureId+'" class="index_model card"><div valign="bottom" class="card-header color-white no-border no-padding"><div class="card-cover" style="background:url('+i.goodsInfo.picUrl+') center center no-repeat;background-size:contain;"></div></div><div class="card-content"><div class="card-content-inner list_info"><div class="clearfix stage_info"><p class="stage_text"><span>'+i.goodsInfo.describe+'</span></p></div><div class="clearfix"><div class="schedule pull-left clearfix"><div class="schedule_bar"><div class="scheduling" style="width:'+i.participantCount/i.totalCount*100+'%;"></div></div><div class="pull-left"><p class="schedule_percent">'+i.totalCount+'</p><p>总需</p></div><div class="schedule_text2 pull-right"><p class="schedule_person">'+(i.totalCount-i.participantCount)+'</p><p>剩余</p></div></div><button class="global_button participate button pull-right">立即夺宝</button></div></div></div></div>')}function indexRefresh(){var e=$(".a-tab-list").find(".active").index();window.sessionStorage.setItem("indexForceRefresh",[e]),tabSelect(e,1),$(".i_load_more").html("加载更多&darr;"),window.sessionStorage.removeItem("indexLoadFinish")}function indexBottomLoadmore(){$(document).off("infinite","#p-index .infinite-scroll");var e=!1;$(document).on("infinite","#p-index .infinite-scroll",function(){if(!e){var i=$(".a-tab-list").find(".active").index(),n=$("#index-active-"+i).find(".index_model").length,t=Math.ceil(n/10);if(1==indexLoadFinish[i]){window.sessionStorage.setItem("indexLoadFinish",indexLoadFinish),$(".i_load_more").html("没有更多数据");var a=[];return void $.each($("#index-active-"+i).find(".index_model"),function(e,i){$.inArray($(i).attr("name"),a)<0?a.push($(i).attr("name")):$(i).remove()})}n<10||(e=!0,$.showIndicator(),setTimeout(function(){function a(){setTimeout(function(){$.hideIndicator(),$.toast("加载成功",1e3,"toast-80"),setTimeout(function(){e=!1},500)},100)}var o=Math.ceil(n/10)+1;if(o>luanmingli.indexTotalPage[i])return void setTimeout(function(){$.hideIndicator(),$.toast("没有更多数据",1e3,"toast-80"),$(".i_load_more").html("没有更多数据"),setTimeout(function(){e=!1},500),indexLoadFinish[i]=1},200);var o=t+1;0==i?indexFillData(i,o,2,a()):1==i?indexFillData(i,o,3,a()):2==i&&indexFillData(i,o,1,a())},100))}})}function barInfo(e){e&&($.each(e,function(i,n){$("#barInfoList").append('<li name="'+n.bannerType+'" class="list-li-all list-li-'+i+'" style="width:'+100/e.length+'%;"><i style="background:url('+n.webImage+') 0 0 no-repeat;background-size:contain;"></i><p>'+n.bannerName+"</p></li>")}),indexTopList())}function routerToDuobao(e){$.showIndicator(),$.router.load("duobao.html?treasureId="+e)}function homePageInfo(){$("#p-index .swiper-container .swiper-slide img").length>0?indexFixedTabFlag+=1:luanmingli.homePageInfo?(fillBanner(luanmingli.homePageInfo.bannerInfo),0==$("#scrollInfo").length&&scrollInfoFill(luanmingli.homePageInfo),barInfo(o.barInfo)):$.ajax({type:"post",url:luanmingli.getUrl+"getHomePageInfo",data:{v:luanmingli.srvVersion},async:!0,dataType:"json",success:function(e){0==e.stateCode?(luanmingli.homePageInfo=e,fillBanner(e.bannerInfo),0==$("#scrollInfo").length&&scrollInfoFill(e),barInfo(e.barInfo)):$.alert(e.message)}})}function bannerClickFuc(e){return/extract/.test(e)&&!luanmingli.userId?void $.alert("请先登陆",function(){$.router.load("personal.html")}):(/iframe.html?url=/.test(e)||(e="iframe.html?url="+e),void $.router.load(e))}function fillBanner(e){var i=luanmingli.calcTestUrl?"?test=1&userId="+luanmingli.userId+"&userKey="+window.localStorage.getItem("userKey")+"&from=web":"?userId="+luanmingli.userId+"&userKey="+window.localStorage.getItem("userKey")+"&from=web";$.each(e,function(e,n){/127.0.0.1/.test(window.location.href)?/register/.test(n.bannerUrl)?n.bannerUrl="http://127.0.0.1:8020/duobao_v"+luanmingli.version+"/other/activity/act-register.html?backurl=http://127.0.0.1:8020/duobao_v"+luanmingli.version+"/src/register.html":/recharge/.test(n.bannerUrl)?n.bannerUrl="http://127.0.0.1:8020/duobao_v"+luanmingli.version+"/other/activity/act-recharge.html?backurl=http://127.0.0.1:8020/duobao_v"+luanmingli.version+"/src/personal.html":/extract/.test(n.bannerUrl)?n.bannerUrl="http://127.0.0.1:8020/duobao_v"+luanmingli.version+"/other/html/extract.html"+i:/qun/.test(n.bannerUrl)&&(n.bannerUrl="http://127.0.0.1:8020/duobao_v"+luanmingli.version+"/other/activity/act-qun.html"):/register/.test(n.bannerUrl)?n.bannerUrl=n.bannerUrl+"?backurl="+luanmingli.bannerBackUrl:/recharge/.test(n.bannerUrl)?n.bannerUrl=n.bannerUrl+"?backurl="+luanmingli.bannerBackUrlRecharge:/extract/.test(n.bannerUrl)&&(n.bannerUrl=n.bannerUrl+i)}),$.each(e,function(e,i){$("#p-index .swiper-container .swiper-wrapper").append('<div class="swiper-slide"><a onclick="bannerClickFuc(\''+i.bannerUrl+'\')"><img src="'+i.webImage+'" alt=""></a></div>')}),_getScript("libs/msui-extend.min.js",function(){_getCss("libs/msui-extend.min.css",function(){$(".swiper-container").swiper({pagination:".swiper-pagination",slidesPerView:1,paginationClickable:!0,spaceBetween:0,centeredSlides:!0,autoplay:3e3,autoplayDisableOnInteraction:!1}),indexFixedTabFlag+=1})})}function indexTopList(){$(".index-top-list").find(".list-li-all").on("click",function(){var e=$(this).attr("name");1==e?$.router.load("share.html"):2==e?$.router.load("results.html",!1):4==e?$.alert("qq群号为：<span>21859967</span>"):$.alert("敬请期待……")})}$(function(){try{luanmingli.indexTotalPage=[],$(".alert-resiger-bonus .alert-close").click(function(){$(".alert-resiger-bonus").hide()}),$(".alert-resiger-bonus .alert-button").click(function(){var e="iframe.html?url=http://www.2333db.com/activity/act-register.html?backurl="+luanmingli.bannerBackUrl;/127.0.0.1/.test(window.location.href)&&(e="iframe.html?url=http://127.0.0.1:8020/duobao_v"+luanmingli.version+"/other/activity/act-recharge.html?backurl=http://127.0.0.1:8020/duobao_v"+luanmingli.version+"/src/register.html"),$.router.load(e)}),$(".save-to-desktop").find(".icon-close").click(function(){$(".save-to-desktop").hide()}),window.indexFixedTabFlag=0,homePageInfo(),$(".index-top-list").find(".list-li-all").length>0&&indexTopList(),tabClick(),tabSelect(0,1),dropRefresh("#p-index",indexRefresh),indexFixedTab()}catch(e){}});var clickNoLoadmore;if(window.sessionStorage.getItem("indexLoadFinish"))var indexLoadFinish=window.sessionStorage.getItem("indexLoadFinish").split(",");else var indexLoadFinish=new Array(3);