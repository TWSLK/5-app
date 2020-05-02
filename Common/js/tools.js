var _ServerLoc = "http://120.78.67.48:8888";
var isWaiting = false;

function GetStatusTop() {
	var statusbarHeight = parseInt(plus.storage.getItem('statusbarHeight'));
	try {
		TAG('header')[0].style.height = TAG('header')[0].offsetHeight + statusbarHeight + 'px';
		var headerElem = document.querySelectorAll('header #Title, header .BTN');
		for (var i = 0; i < headerElem.length; ++i)
			headerElem[i].style.top = statusbarHeight + 'px';
		TAG('header')[0].style.opacity = '1';
		CLASS('Content')[0].style.top = TAG('header')[0].offsetHeight + 'px';
		CLASS('Content')[0].style.display = 'block';
		CLASS('Content')[0].style.opacity = '1';
	} catch (error) {

	}
}


function ID(id) {
	return document.getElementById(id);
}

function TAG(tag) {
	return document.getElementsByTagName(tag);
}

function CLASS(cls) {
	return document.getElementsByClassName(cls);
}

function QUERY(qry) {
	return document.querySelectorAll(qry);
}

function CallAJAX(loc, data, success, error, contentType) {
	contentType = contentType ? contentType : "application/json";
	mui.ajax(_ServerLoc + "/tools/" + loc, {
		data: data,
		dataType: 'json', //服务器返回json格式数据
		type: "post", //HTTP请求类型
		timeout: 8000, //超时时间设置为8秒；
		headers: {
			'Content-Type': contentType
		},
		success: function(data) {
			if (data["res"] == 0) {
				mui.alert("您的账号已在其他设备登录过, 请确认账号安全后重新登录!", "账号异常");
				plus.runtime.restart();
			} else {
				if (typeof success === 'function')
					success(data);
			}
		},
		error: function(xhr, type, errorThrown) {
			if (typeof error === 'function')
				error();
			else
				mui.toast("请检查网络连接, 或稍后重试");
		}
	});
}

function checkUpdate(callback, error) {
	var now = plus.storage.getItem('version'); //plus.runtime.version;
	mui.ajax(_ServerLoc + "/checkUpdate/latest", {
		dataType: "json",
		success: function(data) {
			DontWait();
			//data = JSON.parse(data);
			console.log(now + "  " + data["version"]);
			var latest = data["version"];
			if (now == latest) {
				callback();
				return;
			}
			mui.confirm(
				"更新内容：\n" + data["context"],
				"发现新版本(" + data["version"] + ")",
				["确认", "取消"],
				function(e) {
					if (e.index == 1) {
						mui.toast('请及时更新程序哟');
					} else {
						switch (plus.os.name) {
							case "Android":
								plus.runtime.openURL(_ServerLoc + data["loc"][0]);
								break;
							case "iOS":
								plus.runtime.openURL(data["loc"][1]);
								break;
						}
					}
					plus.runtime.quit();
				});
		},
		error: function() {
			console.log("?");
			error();
		}
	});
}

function ReLogin(showConfirm) {
	showConfirm = showConfirm ? showConfirm : false;
	var doReLogin = function() {
		plus.storage.setItem("userHash", "NULL");
		plus.runtime.restart();
	}
	if (showConfirm) {
		mui.confirm(
			'您确定要退出登录吗? 这将退出您当前的账号', // message
			'退出登录', // title
			['确认', '取消'], // button
			function(e) { // callback
				if (e.index == 0)
					doReLogin();
			});
	} else {
		doReLogin();
	}
}

function RefreshUserInfo(callback) {
	var PhoneNo;
	var UserHash = plus.storage.getItem("userHash");
	//AJAX: phoneNo用于接下来的通信
	CallAJAX("getPhoneNoByUserHash", UserHash, function(data) { // success函数
		if (data["res"] != "ok")
			return;
		PhoneNo = data["phoneNo"];
		//AJAX: 通过phoneNo获取当前用户的所有信息
		CallAJAX("getUserInfo", {
			"phoneNo": PhoneNo,
			"infoReqs": "all"
		}, function(data2) { // success函数
			if (data2["res"] != "ok")
				return;
			//AJAX: 通过用户的eduId获取学校和院系名称
			CallAJAX("getEduDetail", {
				'eduId': data2["userInfo"]["uEduId"],
			}, function(data3) {
				if (data3["res"] != "ok")
					return;
				data2["userInfo"]["uEduSchoolName"] = data3["eduDetail"][0];
				data2["userInfo"]["uEduDeptName"] = data3["eduDetail"][1];
				//更新全局存储"UserInfo"并填充页面信息
				plus.storage.setItem("userInfo", JSON.stringify(data2["userInfo"]));
				callback(PhoneNo);
			});
		});
	});
}

function ThisClose() {
	mui.fire(plus.webview.currentWebview().opener(), 'refresh', {});
	plus.webview.currentWebview().close();
}

function ThisHide() {
	mui.fire(plus.webview.currentWebview().opener(), 'refresh', {});
	plus.webview.currentWebview().hide();
}

function ThisBack() {
	if (plus.webview.currentWebview().canBack())
		mui.back();
	else
		ThisClose();
}

function DoShow(view, action, time) {
	action = action ? action : "fade-in";
	time = time ? time : 150;
	view.show(action, time);
	DontWait();
}

function DoWait(timeout) {
	timeout = timeout ? timeout : 500;
	isWaiting = true;
	setTimeout(function() {
		if (isWaiting == true)
			plus.nativeUI.showWaiting();
	}, timeout);
}

function DontWait() {
	isWaiting = false;
	plus.nativeUI.closeWaiting();
}

function Date2String(date) {
	var stringTime = [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
	for (var i = 0; i < 5; i++)
		stringTime[i] = stringTime[i] < 10 ? '0' + stringTime[i] : stringTime[i]
	return date.getFullYear().toString() + stringTime[0] + stringTime[1] + stringTime[2] + stringTime[3] + stringTime[4];
}

function String2Date(dateString, isFmt) {
	isFmt = isFmt ? isFmt : false;
	var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
	var formatedString = dateString.replace(pattern, '$1/$2/$3 $4:$5:$6');
	if (isFmt)
		return formatedString;
	else
		return (new Date(formatedString));
}

function PickImg(callback) {
	plus.gallery.pick(callback, function(e) {
		console.log("Pick image canceled.");
	}, {
		filter: "image"
	});
}

function UploadImg(imgSrc, callback) {
	plus.io.resolveLocalFileSystemURL(imgSrc, function(entry) {
		entry.file(function(file) {
			var reader = new plus.io.FileReader();
			reader.onloadend = function(e) {
				//let imgData = e.target.result;
				//alert(e.target.result);
				GetBase64Image(e.target.result, function(imgData) {
					CallAJAX('upload', {
						'userHash': plus.storage.getItem('userHash'),
						'resource': imgData.split(',').pop(),
						'type': ['img', imgSrc.split('.').pop().toLowerCase()]
					}, function success(data) {
						callback(data);
					}, function error() {
						//alert('failed while uploading');
						console.log("Upload image failed.");
					});
				}, true, 500);
			};
			reader.readAsDataURL(file);
		});
	});
}

//压缩图片转成base64 
function GetBase64Image(imgSrc, callback, forceSquare, compress) {
	forceSquare = forceSquare ? forceSquare : false;
	compress = compress ? compress : 300;
	var img = new Image();
	img.crossOrigin = 'Anonymous';
	img.src = imgSrc;
	img.onload = function() {
		var canvas = document.createElement("canvas");
		var width = img.width;
		var height = img.height;
		if (forceSquare) {
			width = compress;
			height = compress;
		} else {
			if (width > height) {
				if (width > compress) {
					height = Math.round(height *= compress / width);
					width = compress;
				}
			} else {
				if (height > compress) {
					width = Math.round(width *= compress / height);
				}
				height = compress;
			}
		}
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, width, height);
		var imgExt = imgSrc.split('.').pop().toLowerCase();
		var imgData = canvas.toDataURL('image/' + imgExt);
		callback(imgData); //回调函数获取Base64编码
		canvas = null;
	};
}

/**
 *  返回值
 *    'min': 字数不够
 *    'max': 字数超限
 *    'fit': 字数合适
 */
function CheckLength_inner(text, maxlen, minlen) {
	minlen = minlen ? minlen : 1;
	text = text.replace(/(^s*)|(s*$)/g, "").trim();
	if (text.length > maxlen) {
		return 'max';
	} else if (text.length < minlen) {
		return 'min';
	} else {
		return 'fit';
	}
}

function CheckLength(name, text, maxlen, minlen) {
	var res = CheckLength_inner(text, maxlen, minlen);
	if (res == 'max') {
		plus.nativeUI.alert(name + '字数最长为' + maxlen + ', 请检查!', '字数超限');
		return false;
	} else if (res == 'min') {
		plus.nativeUI.alert(name + '字数最短为' + minlen + ', 请检查!', '字数不够');
		return false;
	} else {
		return true;
	}
}

function DoFollow(phoneNo, callback) {
	var tUserHash = plus.storage.getItem('userHash');
	CallAJAX('doFollow', {
		'userHash': tUserHash,
		'followeeId': phoneNo,
	}, callback);
}
