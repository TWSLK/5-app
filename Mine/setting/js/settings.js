function ChangeHeadImg() {
	PickImg(function(path) {
		console.log('[INFO]UPLOAD: Get file ' + path);
		UploadImg(path, function(data) {
			console.log('[INFO]UPLOAD: Upload to ' + data["loc"]);
			CallAJAX('updateHeadImg', {
				'userHash': plus.storage.getItem("userHash"),
				'uHeadImgLoc': data["loc"]
			}, function success2(data2) {
				RefreshUserInfo(function(phoneNo) {
					drawPage();
				});
				console.log("Update head image done.");
			}, function error2() {
				console.log("Update head image failed.");
			});
		});
	});
}
