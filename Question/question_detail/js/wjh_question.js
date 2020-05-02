var userHash;
var current;
var phoneNo;
var quesId;
var reward;
var theQues;
var theAns;
var isQuestioner = false;
var isAnswerer = false;
var InRefresh = false;

window.addEventListener("load", init);
window.addEventListener("Refresh", RefreshPage);

function RefreshPage() {
	id("QuesContent").style.opacity = 0;
	id("FooterBox").style.opacity = 0;
	setTimeout(function(thisWindow) {
		thisWindow.location.reload();
	}, 500, window);
}

function init() {
	mui.init();
	mui.plusReady(function() {
		GetStatusTop();
		DoWait();
		userHash = plus.storage.getItem("userHash");
		current = plus.webview.currentWebview();
		quesId = current.quesId;
		fetchQuestion();
		setTimeout(function() {
			if (isWaiting) {
				mui.alert("请检查网络连接!", "错误");
				DontWait();
				current.close();
			}
		}, 3000);
	});
}

function drawEnd() {
	InitScroll(RefreshPage);
	DoShow(plus.webview.currentWebview());
}

/**
 * 从服务器获取问题数据和状态
 * 根据问题状态填充页面并删减UI元素（主要是按钮）
 */
function fetchQuestion() {
	DoWait();
	// 获取问题数据以及状态
	CallAJAX("getQues", {
			"userHash": userHash,
			"quesId": quesId
		},
		function(data) {
			InRefresh = false;
			if (data["res"] != "ok")
				return;
			theQues = data["ques"];
			RefreshUserInfo(function(phoneNo1) {
				phoneNo = phoneNo1
				isQuestioner = (phoneNo == data["ques"]["quesQueserId"]);
				isAnswerer = (phoneNo == data["ques"]["quesAnserId"]);
				showQuesCard(data["ques"]);
				showStatus(data["ques"]["quesStatus"], data["ques"]["quesScored"]);
			});
		});
}

/**
 * 根据返回的数据去填充问题描述的标题、标签、问题描述、悬赏金额、浏览数
 * @param {*} ques 服务器返回问题数据
 */
function showQuesCard(ques) {
	id("QuesTitle").innerText = ques["quesTitle"];
	id("HeadImg").src = _ServerLoc + ques["quesQueserHeadImgLoc"];
	id("UserName").innerText = ques["quesQueserNick"];
	reward = ques["quesReward"];
	if (ques["quesReward"] != 0) {
		id("Reward").innerText = ques["quesReward"];
	} else {
		id("Reward").innerText = "无";
		id("Reward").style.backgroundColor = "#999";
	}
	id('UserInfo').addEventListener('click', function() {
		JumpToUserIndex(ques["quesQueserId"], "../../");
	});
	// 更新标签（最多显示三个标签）
	for (let i = 0; i < ques.quesTags.length && i < 3; i++) {
		if (ques.quesTags[i].trim() == "")
			continue;
		let tag = document.createElement("div");
		tag.innerText = ques.quesTags[i];
		id("Tags").appendChild(tag);
	}
	id("QuesText").innerHTML = ques["quesText"];
	id("QuesLooked").innerText = ques["quesLookedCnt"] + " 浏览";
	id("QuesContent").style.opacity = 1;
}

/**
 * 根据问题状态更新状态栏和UI界面
 * @param {*} status 服务器返回问题状态，字段含义参照文档
 */
function showStatus(status, scored) {
	// 更新状态栏
	let showMsg = "";
	if (status === 0) {
		showMsg = "正在招募作答者";
	} else if (status === 1) {
		showMsg = "正在等待解答";
	} else if (status === 2) {
		showMsg = "正在解答中";
	} else if (status === 3) {
		showMsg = "已关闭";
	} else if (status === 4) {
		showMsg = "已结束";
	}
	id("StatusLine").innerText = showMsg;

	if (isQuestioner || isAnswerer) {
		if (isQuestioner && status == 0) {
			getAppls();
		}
	} else {
		if (status != 0) {
			mui.toast("您当前处于旁观模式");
		}
	}
	if (status >= 1) {
		getAnswers();
	} else {
		drawEnd();
	}
	showBtns(status);
	if (status == 4 && !scored && isQuestioner) {
		JumpToQuesScore(quesId);
	}
}

/**
 * 根据问题状态和isQuestioner删除顶部用户信息和底部按钮
 * @param {*} status 问题状态
 */
function showBtns(status) {
	id("LikeBtn").onclick = like;
	id("ApplyBtn").onclick = apply4Ans;
	id("AcceptBtn").onclick = accept;
	id("ReplyBtn").onclick = reply;
	// 提问者视角
	if (isQuestioner) {
		//id("UserInfo").parentNode.removeChild(id("UserInfo"));
		id("LikeBtn").style.display = "inline-flex";
		switch (status) {
			case 0:
				break;
			case 1:
				break;
			case 2:
				id("AcceptBtn").style.display = "inline-flex";
				id("ReplyBtn").style.display = "inline-flex";
				break;
			case 3:
				id("AcceptBtn").style.display = "inline-flex";
				id("AcceptBtn").classList.add("Btn_mute");
				break;
			case 4:
				break;
			default:
		}
	}
	// 回答者视角
	else if (isAnswerer) {
		id("LikeBtn").style.display = "inline-flex";
		switch (status) {
			case 0:
				id("ApplyBtn").style.display = "inline-flex";
				break;
			case 1:
				id("ReplyBtn").style.display = "inline-flex";
				break;
			case 2:
				id("ReplyBtn").style.display = "inline-flex";
				break;
			case 3:
				break;
			case 4:
				break;
			default:
		}
	}
	// 旁观者视角
	else {
		id("LikeBtn").style.display = "inline-flex";
		switch (status) {
			case 0:
				id("ApplyBtn").style.display = "inline-flex";
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
			case 4:
				break;
			default:
		}
	}
	id("FooterBox").style.opacity = 1;
}

/**
 * 从服务器获取问答日志
 */
function getAnswers() {
	CallAJAX("getQuesLog", {
			userHash: userHash,
			quesId: quesId
		},
		function(data) {
			drawEnd();
			if (data["res"] != "ok")
				return;
			id("QuesAns").innerHTML = "";
			theAns = data["quesLogs"];
			for (let i = 0; i < data["quesLogs"].length; i++) {
				setTimeout(function() {
					showAnswer(data["quesLogs"][i]);
				}, 20 * i);
			}
		}, function() {
			drawEnd();
		});
}

/**
 * 从隐藏的功能区复制一份答案展示card，根据服务器返回的数据填充答案展示卡并添加到QuesAns中
 * @param {*} quesLog 单个答案数据
 */
function showAnswer(quesLog) {
	// 展示每个答案
	let card = qs("#HiddenSection > .Ans_card").cloneNode(true);
	card.children[0].children[0].src = _ServerLoc + quesLog["quesLogUserHeadImgLoc"];
	card.children[0].children[0].addEventListener('click', function() {
		JumpToUserIndex(quesLog["quesLogUserId"]);
	});
	// 用户名
	card.children[0].children[1].innerText = quesLog["quesLogUserNick"];
	// 答题时间
	card.children[0].children[2].innerText = String2Date(quesLog["quesLogT"], true);
	// 答案
	card.children[1].innerText = quesLog["quesLogText"];
	id("QuesAns").appendChild(card);
}

/**
 * 从服务器获取抢答者信息并展示抢答者信息
 */
function getAppls() {
	CallAJAX("getAppls", {
			userHash: userHash,
			quesId: quesId
		},
		function(data) {
			drawEnd();
			if (data["res"] != "ok" || data["appls"] == null)
				return;
			id("QuesAns").innerHTML = "";
			for (let i = 0; i < data["appls"].length; i++)
				showAppl(data["appls"][i]);
		}, function() {
			drawEnd();
		});
}

/**
 * 展示抢答者信息
 * @param {} appl 单个抢答者信息
 */
function showAppl(appl) {
	let card = qs("#HiddenSection > .Appl_card").cloneNode(true);
	card.children[0].src = _ServerLoc + appl["applyUserHeadImgLoc"];
	card.children[0].addEventListener('click', function() {
		JumpToUserIndex(appl["applyUserId"], "../../");
	});
	// 指定
	card.children[1].addEventListener("click", () => {
		assign(appl["applyUserId"]);
	});
	// 用户名
	card.children[2].innerText = appl.applyUserNick;
	card.children[2].addEventListener('click', function() {
		JumpToUserIndex(appl["applyUserId"], "../../");
	});
	// 评分
	// 信息
	document.getElementById("QuesAns").appendChild(card);
}

/**
 * 抢答按钮回调函数，往服务器发送抢答请求
 */
function apply4Ans() {
	CallAJAX("apply4Ans", {
			userHash: userHash,
			quesId: quesId
		},
		function(res) {
			if (res.res != "ok") {
				plus.nativeUI.toast("您不能多次抢答,请耐心等待提问者指定");
			} else {
				plus.nativeUI.toast("抢答成功,请耐心等待提问者指定");
			}
			id('ApplyBtn').classList.add('Btn_mute');
			id('ApplyBtn').onclick = null;
		},
		function() {
			mui.alert("不能抢答……", "错误");
		});
}

/**
 * 指定按钮回调函数
 * @applId 指定用户Id
 */
function assign(applId) {
	CallAJAX("assign", {
			userHash: userHash,
			quesId: quesId,
			assign2UserId: applId
		},
		function(data) {
			if (data["res"] === "ok") {
				mui.toast("已指定回答者, 请耐心等待解答");
				plus.webview.currentWebview().hide();
				location.reload();
			}
		});
}

function accept() {
	CallAJAX("closeQues", {
			userHash: userHash,
			quesId: quesId,
		},
		function(data) {
			if (data["res"] === "ok") {
				mui.toast("回答已被采纳, 问题已结束");
				plus.webview.currentWebview().hide();
				location.reload();
			}
		});
}

function like() {
	CallAJAX("likeQues", {
			userHash: userHash,
			quesId: quesId,
		},
		function(data) {
			if (data["res"] != "ok")
				return;
			id('LikeBtn').classList.add('Btn_mute');
			id('LikeBtn').onclick = null;
		});
}

function reply() {
	var lastLog;
	var i = -1;
	for (i = theAns.length - 1; i >= 0; i--)
		if (theAns[i]["quesLogUserId"] != phoneNo)
			break;
	if (i != -1) {
		lastLog = {
			"quesLogText": theAns[i]["quesLogText"],
			"uHeadImgLoc": theAns[i]["quesLogUserHeadImgLoc"],
			"uNick": theAns[i]["quesLogUserNick"]
		};
	} else {
		lastLog = {
			"quesLogText": theQues["quesText"],
			"uHeadImgLoc": theQues["quesQueserHeadImgLoc"],
			"uNick": theQues["quesQueserNick"]
		};
	}
	plus.webview.create(
		'reply.html',
		'Reply', {}, {
			"quesId": quesId,
			"lastLog": lastLog
		}
	);
}

// 缩写方法
function id(idName) {
	return document.getElementById(idName);
}

function qs(selector) {
	return document.querySelector(selector);
}

function qsa(selector) {
	return document.querySelectorAll(selector)
}
