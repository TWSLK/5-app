function InitRtxt(txtDOM, root) {
	root = root ? root : "../../";
	var imgs = txtDOM.getElementsByTagName('img');
	for (let i = 0; i < imgs.length; ++i) {
		imgs[i].onclick = function() {
			JumpToImgView(imgs[i].src, root);
		}
	}
}