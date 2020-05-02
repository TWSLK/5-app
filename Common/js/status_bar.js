/**
 * 在此填入每个webview在顶层时状态栏应当显示的颜色
 */
var StatusBarColors = {
	'Question': 'light',
	'Lecture': 'light',
	'Message': 'light',
	'Mine': 'dark',
	'UserIndex': 'dark',
	'ImgView': '000000',
	'Settings': 'light',
	'Ques': 'light',
	'QuesAsk': 'light',
	'SetEdu': 'light',
	'SetCV': 'light',
};
var InTrans = false;

//-----------------------------
//  通过根界面的循环调用实现状态栏颜色根据页面转变(见Index/index.html)
//-----------------------------
function StatusBar() {
	var wvid;
	try {
		wvid = plus.webview.getTopWebview().id;
	} catch (err) {
		return false;
	}

	var colorName = StatusBarColors[wvid.split('-')[0]];
	// 无法获取新颜色时退出
	if (colorName == null) {
		return false;
	}
	// 生成新旧颜色
	var lastColor, nowColor;
	if (colorName == "dark") {
		nowColor = str2Color("484848");
	} else if (colorName == "light") {
		nowColor = str2Color("FFFFFF");
	} else {
		nowColor = str2Color(colorName);
	}
	// lastColor = str2Color(plus.navigator.getStatusBarBackground().substr(1));
	if (nowColor == lastColor) {
		return;
	}
	// 锁定同时可操作的进程
	if (InTrans) {
		return;
	}
	InTrans = true;
	// 分解目标颜色
	var r1 = nowColor/ 65536 % 256;
	var g1 = nowColor / 256 % 256;
	var b1 = nowColor % 256;
	// 根据目标颜色深度判断文字颜色
	if (r1 + g1 + b1 <= 400) {
		plus.navigator.setStatusBarStyle("light");
	} else {
		plus.navigator.setStatusBarStyle("dark");
	}
	plus.navigator.setStatusBarBackground('#' + color2Str_2(nowColor));
	InTrans = false;
}

function str2Color(str) {
	return parseInt(str, 16);
}

function color2Str(colorR, colorG, colorB) {
	return color2Str_2(colorR * 65536 + colorG * 256 + colorB);
}

function color2Str_2(color) {
	var res = color.toString(16);
	for (var i = 0; res.length < 6; ++i)
		res = '0' + res;
	return res.substr(0, 6);
}
