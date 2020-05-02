/**
 *  根据页面是否自加载(页面自己调用
 *    plus.webview.currentWebview().show()
 *  或
 *    DoShow()
 *  ), 产生两种打开页面的写法:
 *  一. 非自加载页面:
 *    使用plus.webview.open()             默认为右侧滑出
 *    使用plus.webview.create().show()    可以自定义打开效果
 *  二. 自加载页面:
 *    使用plus.webview.create()
 *  
 *  此js的所有函数必须带有root参数(即调用页相对根目录的位置),
 *  并以与该函数的功能关联性最大的页面的对应值作为默认值
 */

var RUN_MULTI_PAGES = false;

function haveRun(id) {
	if (plus.webview.all().indexOf(plus.webview.getWebviewById(id)) != -1)
		return true;
	return false;
}

function JumpToQues(quesId, root) {
	var wvid;
	if (RUN_MULTI_PAGES) {
		wvid = 'Ques-' + quesId;
	} else {
		wvid = 'Ques';
	}
	if (haveRun(wvid)) {
		plus.webview.getWebviewById(wvid).close('none', 0);
	}
	root = root ? root : "../";
	plus.webview.create(root + 'Question/question_detail/index.html', wvid, {}, {
		"quesId": quesId
	});
}

function JumpToLec(lecId, root) {
	var wvid;
	if (RUN_MULTI_PAGES) {
		wvid = 'Lec-' + lecId;
	} else {
		wvid = 'Lec';
	}
	if (haveRun(wvid)) {
		plus.webview.getWebviewById(wvid).close('none', 0);
	}
	root = root ? root : "../";
	plus.webview.create(root + 'Lecture/lecture_detail/index.html', wvid, {}, {
		"lecId": lecId
	});
}

function JumpToUserIndex(phoneNo, root) {
	var wvid = 'UserIndex-' + phoneNo;
	if (haveRun(wvid)) {
		plus.webview.getWebviewById(wvid).close('none', 0);
	}
	root = root ? root : "../../";
	plus.webview.create(
		root + 'Mine/user_index/userInfo.html',
		wvid,
		{},
		{ "phoneNo": phoneNo }
	);
}

function JumpToPersonalAnswer(root) {
	if (haveRun('Personal-Answer'))
		return;
	root = root ? root : "../../";
	mui.createWindow({
		id: 'Personal-Answer',
		url: root + 'Mine/personal_center/answer.html',
	});
}

function JumpToPersonalQuestion(root) {
	if (haveRun('Personal-Question'))
		return;
	root = root ? root : "../../";
	mui.createWindow({
		id: 'Personal-Question',
		url: root + 'Mine/personal_center/question.html',
	});
}

function JumpToPersonalFollow(root) {
	if (haveRun('Personal-Follow'))
		return;
	root = root ? root : "../../";
	mui.createWindow({
		id: 'Personal-Follow',
		url: root + 'Mine/personal_center/follow.html',
	});
}

function JumpToPersonalFans(root) {
	if (haveRun('Personal-Fans'))
		return;
	root = root ? root : "../../";
	mui.createWindow({
		id: 'Personal-Fans',
		url: root + 'Mine/personal_center/fans.html',
	});
}

function JumpToWallet(root) {
	root = root ? root : "../../";
	mui.toast('支付功能暂时关闭');
	/*
	mui.createWindow({
		id: 'Wallet',
		url: root + 'Mine/setting/wallet.html',
	});*/
}

function JumpToSetNick(lastNick, root) {
	if (haveRun('SetNick'))
		return;
	root = root ? root : "../../";
	mui.createWindow({
		id: 'SetNick',
		url: root + 'Mine/setting/nick.html',
		extras: { 'lastNick': lastNick }
	});
}

function JumpToSetCV(lastCV, root) {
	if (haveRun('SetCV'))
		return;
	root = root ? root : "../../";
	mui.createWindow({
		id: 'SetCV',
		url: root + 'Mine/setting/CV.html',
		extras: { 'lastCV': lastCV }
	});
}
function JumpToSetEdu(root) {
	if (haveRun('SetEdu'))
		return;
	root = root ? root : "../../";
	mui.createWindow({
		id: 'SetEdu',
		url: root + 'Mine/setting/edu/1.html',
	});
}

function JumpToSettings(root) {
	if (haveRun('Settings')) {
		plus.webview.getWebviewById('Settings').close('none', 0);
	}
	root = root ? root : "../../";
	plus.webview.create(root + 'Mine/setting/list.html', 'Settings');
}

function JumpToAbout(root) {
	if (haveRun('About'))
		return;
	root = root ? root : "../../";
	mui.openWindow({
		id: 'About',
		url: root + 'Mine/setting/about.html',
	});
}

function JumpToImgView(loc, root) {
	if (haveRun('ImgView'))
		return;
	root = root ? root : "../../";
	plus.webview.create(
		root + 'Common/img_view.html', // location
		'ImgView',                     // webview id
		{ scalable:true, background: 'transparent' },             // styles
		{"loc": loc}                   // extras
	);
}

function JumpToQuesAsk(root) {
	if (haveRun('QuesAsk'))
		return;
	root = root ? root : "../";
	plus.webview.create(
		root + 'Question/question-ask/1.html',
		'QuesAsk'
	);
}

function JumpToNewLec(root) {
	if (haveRun('NewLec'))
		return;
	root = root ? root : "../";
	plus.webview.create(
		root + 'Lecture/lecture_submit/1.html',
		'NewLec'
	);
}

function JumpToQuesScore(quesId, root) {
	if (haveRun('QuesScore'))
		return;
	root = root ? root : "../../";
	plus.webview.create(
		root + 'Question/question_score.html',
		'QuesScore',
		{},
		{ 'quesId': quesId }
	);
}