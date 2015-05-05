var canvas, context, images;

$(document).ready(function() {
	loadResources();

	initialize();
});

function initialize() {
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');

	game.actions.start();
}

function loadResources() {
	images = {};

	for (extension in settings.resources.images) {
		for (index in settings.resources.images[extension]) {
			if (typeof settings.resources.images[extension][index] !== "function") {
				image = new Image();
				image.title = settings.resources.images[extension][index];
				image.src = settings.imgPath + settings.resources.images[extension][index] + "." + extension;
				image.onload = function() {
					images[this.title] = this;
				};
			}
		}
	}
}

function clearCanvas() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}