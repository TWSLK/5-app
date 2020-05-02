//_url 地址后缀    例：www.hao123.com/student     地址后缀为student
//myvalue传输内容    分为JSON和字符串   JSON需要转换为JSON对象上传
//_callback		传回的字符串名称为data
//_mytype代表传的数据类型分为json和string 在数据字典里有标识
var _ip = "http://120.78.67.48:8888";
var _timeout; // ajax超时判断
var xmlhttp;  // ajax对象
function _gyajax(_url, _myvalue, _mytype, _callback) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			clearTimeout(_timeout);
			var data = xmlhttp.responseText;
			_callback(data);
		}
	}
	console.log(_myvalue);
	xmlhttp.open("post", _ip+"/tools/" + _url,true);
	if(_mytype == "json")
		xmlhttp.setRequestHeader("content-type", "application/json");
	else
		xmlhttp.setRequestHeader("Content-type", "text/plain");
	_timeout =setTimeout("_timeOut()",3000);
	xmlhttp.send(_myvalue);
}

function _timeOut()
	{
		clearTimeout(_timeout);
		xmlhttp.abort();
		alert("请检查网络连接");
	}

function _ddDate2String(_date) {
	var stringTime = [_date.getMonth() + 1, _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds()]
	for(var i = 0; i < 5; i++)
		stringTime[i] = stringTime[i] < 10 ? '0' + stringTime[i] : stringTime[i]
	return _date.getFullYear().toString() + stringTime[0] + stringTime[1] + stringTime[2] + stringTime[3] + stringTime[4];
}

function _ddString2Date(_dateString) {
	var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
	var formatedString = _dateString.replace(pattern, '$1/$2/$3 $4:$5:$6');
	return(new Date(formatedString));
}

function _back() {
	//<a class="mui-action-back" id="_on_back"></a>
	var _on_back = document.getElementById("_on_back");
	_on_back.style.left = allwidth * 0.044 + "px";
	_on_back.style.top = allwidth * 0.02 + "px";
	_on_back.style.width =allwidth *0.5 + "px";
	_on_back.style.height = allwidth * 0.0417 + "px";
	_on_back.style.position="absolute"; 
	var absoluteLoc = window.location.href.replace(/www\/.*$/g, "/www"); 
	_on_back.innerHTML='<img src="' + absoluteLoc + '/Common/img/ChevronLeft.png" id="_on_back_img" />';
	var _on_back_img = document.getElementById("_on_back_img");
	_on_back_img.style.height = allwidth * 0.0417 + "px";
	_on_back_img.style.width = allwidth * 0.026 + "px";
	//_on_back_img.style.
	
}  
function _back_white() {
	//<a class="mui-action-back" id="_on_back"></a>
	var _on_back = document.getElementById("_on_back_white");
	_on_back.style.left = allwidth * 0.044 + "px";
	_on_back.style.top = allwidth * 0.02 + "px";
	_on_back.style.width =allwidth *0.5 + "px";
	_on_back.style.height = allwidth * 0.0417 + "px";
	_on_back.style.position="absolute"; 
	var absoluteLoc = window.location.href.replace(/www\/.*$/g, "/www"); 
	_on_back.innerHTML='<img src="' + absoluteLoc + '/Common/img/white_back.png" id="_on_back_img" />';
	var _on_back_img = document.getElementById("_on_back_img");
	_on_back_img.style.height = allwidth * 0.0417 + "px";
	_on_back_img.style.width = allwidth * 0.026 + "px";
	//_on_back_img.style.
	
} 
