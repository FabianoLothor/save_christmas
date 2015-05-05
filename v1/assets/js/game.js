var game = {
	scene : "loading",
	actions : {
		start : function() {
			game.actions.run();
		},
		run : function() {
			clearCanvas();

			game.scenes[game.scene]();

			window.requestAnimationFrame(game.actions.run);
		}
	},
	scenes : {
		loading : function() {
			for (extension in settings.resources.images) {
				for (index in settings.resources.images[extension]) {
					if (typeof settings.resources.images[extension][index] !== "function") {
						if(typeof images[settings.resources.images[extension][index]] === "undefined") {
							return;
						}
					}
				}
			}

			game.scene = "splash";
		},
		splash : function() {
			game.scene = "playing";
		},
		playing : function() {

		}
	}
};