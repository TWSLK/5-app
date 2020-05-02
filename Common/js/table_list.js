function InitScroll(upCallback, downCallback, pullid) {
	var wrapper = mui('.mui-scroll-wrapper');
	pullid = pullid ? pullid : '#Pull'
	wrapper.scroll({
		scrollY: true,
		indicators: false,
		bounce: true
	});
	wrapper[0].addEventListener('scrollend', function(e) {
		if(e.detail.y == e.detail.maxScrollY) {
			//滚动到底
			if (typeof downCallback === 'function')
				downCallback();
		}
		if(e.detail.y == 0) {
			//滚动到顶
			if (typeof upCallback === 'function')
				upCallback();
		}
		if(e.detail.y < e.detail.maxScrollY) {
			scrollTo(0, 0);
		}
	});
}