function pFuncNav(item){
	if (item.hasClass("btnNoAction")) return;

	var currentSlide = item.parent().siblings(".pSlides").find(".pActive");
	var tmpSlide;
	
	switch (item.attr("nav-func")) {
		case 'begin':
			if (currentSlide.prev(".pSlide").length === 1)
				tmpSlide = currentSlide.parent().find(".pSlide").eq(0);
			break;
		case 'prev':
			if (currentSlide.prev(".pSlide").length === 1)
				tmpSlide = currentSlide.prev(".pSlide");
			break;
		case 'next':
			if (currentSlide.next(".pSlide").length === 1)
				tmpSlide = currentSlide.next(".pSlide");
			break;
		case 'end':
			if (currentSlide.next(".pSlide").length === 1)
				tmpSlide = currentSlide.parent().find(".pSlide").eq(-1);
			break;
		case 'numSlide': tmpSlide = currentSlide.parent().find(".pSlide").eq(item.attr("nav-num"));
	}
	
	if (tmpSlide !== undefined) {
		pItemAjax(currentSlide,tmpSlide);
	}
}

function testBtnActive(navigation) {
	var slideCountPrev = navigation.siblings(".pSlides").find(".pActive").prevAll(".pSlide").length;
	var slideCountNext = navigation.siblings(".pSlides").find(".pActive").nextAll(".pSlide").length;
	
	navigation.find(".navElem").removeClass("btnNoAction");
	navigation.find(".navElem[nav-num='"+slideCountPrev+"']").addClass("btnNoAction");
	if (slideCountPrev === 0 && slideCountNext === 0) navigation.find(".navElem").addClass("btnNoAction");
	if (slideCountPrev === 0) navigation.find(".pPrev").addClass("btnNoAction").siblings(".pBegin").addClass("btnNoAction");
	if (slideCountNext === 0) navigation.find(".pNext").addClass("btnNoAction").siblings(".pEnd").addClass("btnNoAction");
	console.log(slideCountPrev);
	console.log(slideCountNext);
}

function pItemAjax(currentSlide,tmpSlide) {
	if (!tmpSlide.hasClass('uploadedItem')) {
		currentSlide.parent().siblings(".pLoad").css({'display':'block'});
		$.ajax({
			type: 'POST',
			url: tmpSlide.attr("file-slide"), 
			success: function(data) {
				currentSlide.parent().siblings(".pLoad").css({'display':'none'});
				tmpSlide.html(data);
				tmpSlide.addClass('uploadedItem');
				animateSlide(currentSlide,tmpSlide);
			}
		});
	} else animateSlide(currentSlide,tmpSlide);
}

function animateSlide(currentSlide,tmpSlide) {
	currentSlide.stop().animate({'opacity': 0},100,function() {
		currentSlide.removeClass('pActive');
		tmpSlide.addClass('pActive');
		tmpSlide.stop().animate({'opacity': 1},200);
		testBtnActive(currentSlide.parent().siblings(".pNavigation"));
	});
}

function addSlideNum(slides) {
	var slideCount = slides.find(".pSlide").length;
	var num = 0;
	var htmlNum = "";
	slides.find(".pSlide").each(function() {
		htmlNum += "<div class='navElem pNavNumSlide' nav-func='numSlide' nav-num='"+(num++)+"' onclick='pFuncNav($(this))'>"+(num)+"</div>";
	});
	slides.siblings(".pNavigation").append("<br>"+htmlNum);
}

function startSlide() {
	$(document).find(".pSlide.pActive").each(function() {
		addSlideNum($(this).parent());
		pItemAjax($(this),$(this));
	});
}

$(document).ready(function() {
	startSlide();
});