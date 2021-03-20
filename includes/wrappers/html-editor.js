'use strict';

anxeb.vue.include.component('html-editor', function (helpers) {
	let _editor;

	return {
		vendors   : [
			'https://cdn.jsdelivr.net/npm/suneditor@latest/dist/suneditor.min.js',
			'https://cdn.jsdelivr.net/npm/suneditor@latest/src/lang/es.js',
			'https://cdn.jsdelivr.net/npm/suneditor@latest/dist/css/suneditor.min.css'
		],
		template  : '/wrappers/html-editor.vue',
		props     : ['value', 'height', 'gallery-url'],
		inject    : ['page', 'log', 'modal', 'dialogs'],
		created   : function () {
			this.html = this.value;
			this.sync();
		},
		updated   : function () {
			this.html = this.value;
			this.sync();
		},
		destroyed : function () {
			if (_editor) {
				_editor.destroy();
				_editor = null;
			}
		},
		mounted   : async function () {
			let _self = this;
			if (_editor == null) {
				let textarea = $(_self.$refs.textarea).get(0);

				_editor = window.SUNEDITOR.create(textarea, {
					height           : 'auto',
					value            : _self.html || '',
					fullScreenOffset : 300,
					popupDisplay     : 'local',
					iframe           : true,
					imageFileInput   : true,
					videoFileInput   : false,
					audioFileInput   : false,
					imageGalleryUrl  : _self.galleryUrl,
					lang             : SUNEDITOR_LANG['es'],
					buttonList       : [
						['bold', 'underline', 'italic', 'strike'],
						['font', 'fontSize', 'formatBlock'],
						['fontColor', 'hiliteColor', 'textStyle'],
						['removeFormat', 'paragraphStyle', 'blockquote'],
						['outdent', 'indent'],
						['align', 'horizontalRule', 'list', 'lineHeight'],
						_self.galleryUrl != null ? ['table', 'link', 'imageGallery', 'image', 'video', 'audio', 'codeView'] : ['table', 'link', 'image', 'video', 'audio', 'codeView']
					]
				});

				_editor.onChange = function (e, core) {
					_self.html = _editor.getContents();
					_self.$emit('input', _self.html);
				};
			}
		},
		methods   : {
			sync : function () {
				if (_editor != null) {
					let $value = this.html || '';
					let current = _editor.getContents();

					if (current !== $value) {
						_editor.setContents($value);
					}
				}
			}
		},
		watch     : {
			value : function (value) {
				if (this.html !== value) {
					this.html = value;
					this.sync();
				}
			}
		},
		data      : function () {
			return {
				html : null
			}
		}
	}
})
;