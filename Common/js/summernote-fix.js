/**
 * SummerNoteInit
 * 初始化summernote编辑器(配合summernote-fix.css).
 * 
 * @author dhc
 * @param JQEle
 * @param placeholder
 * @modified 2020/04/20
 */
function SummerNoteInit(JQEle, placeholder) {
	document.oncontextmenu = function(e) { // 关闭编辑器的长按系统自带的菜单
		e.preventDefault();
	};
	JQEle.summernote({
		placeholder: '' + placeholder,
		lang: 'zh-CN',
		tabsize: 4,
		minHeight: 200,
		shortcuts: false,
		toolbar: [
			['tools', ['style', 'bold', 'italic', 'underline', 'picture', 'ol']],//, 'paragraph']],
		]
	});

	$('.note-editor')[0].style.border = "0";
	$('.note-editor .note-statusbar')[0].style.display = "none";
	$('.note-editor .note-editable')[0].classList.add('EditArea');
	$('.note-editor .note-toolbar')[0].classList.add('note-editing-toolbar');
	$('*:not(.note-editor *)').on('focus', function() {
		$('.note-editor')[0].style.marginTop = "-10px";
		$('.note-editor .note-toolbar')[0].classList.remove('show');
	});
	$('.note-editable').on('focus', function() {
		$('.note-editor')[0].style.marginTop = "calc(var(--top) * 1px - 8px)";
		$('.note-editor .note-toolbar')[0].classList.add('show');
	});
}
