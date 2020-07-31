'use strict';

anxeb.vue.include.helper('browse', {
	file  : function () {
		return new Promise(function (resolve, reject) {
			let input = document.createElement('input');
			input.type = 'file';

			input.onchange = function () {
				if (this.files && this.files[0]) {
					let file = this.files[0];
					if (file) {
						resolve(file);
					} else {
						if (reject) {
							reject();
						}
					}
				}
			};
			input.click();
		});
	},
	image : function (params) {
		return new Promise(function (resolve, reject) {
			let input = document.createElement('input');
			input.type = 'file';

			input.onchange = function () {
				if (this.files && this.files[0]) {
					let file = this.files[0];

					if (file) {
						let reader = new FileReader();
						reader.onloadend = function () {
							let width = (params !== undefined ? params.width : null) || 800;
							let height = (params !== undefined ? params.height : null) || 800;

							let tempImg = new Image();
							tempImg.onload = function () {
								let maxWidth = width;
								let maxHeight = height;
								let tempW = tempImg.width;
								let tempH = tempImg.height;

								if (tempW > tempH) {
									if (tempW > maxWidth) {
										tempH *= maxWidth / tempW;
										tempW = maxWidth;
									}
								} else {
									if (tempH > maxHeight) {
										tempW *= maxHeight / tempH;
										tempH = maxHeight;
									}
								}

								let crop = 0;
								let canvas = document.createElement('canvas');
								canvas.width = tempW;
								canvas.height = tempH;
								let ctx = canvas.getContext('2d');
								ctx.drawImage(this, 0, crop, tempW, tempH - crop);

								canvas.toBlob(function (blob) {
									resolve({
										href : URL.createObjectURL(blob),
										data : canvas.toDataURL(file.type)
									});
								}, file.type);
							};
							tempImg.onerror = function (err) {
								if (reject) {
									reject(err)
								}
							};
							tempImg.src = reader.result;
						};
						reader.readAsDataURL(file);
					} else {
						if (reject) {
							reject();
						}
					}
				}
			};
			input.click();
		});
	}
});