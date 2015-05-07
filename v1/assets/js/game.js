var game = {
	status : "initial",
	scene : "",
	sprites : {},
	actions : {
		start : function () {
			game.actions.run();
		},
		run : function () {
			utils.clearCanvas();

			game.actions.check();
			game.scenes[game.scene]();

			window.requestAnimationFrame(game.actions.run);
		},
		check : function () {
			switch (game.status) {
				case "initial" :
					game.status = "loading";
					game.scene = "loading";
				break;
				case "loadded" :
					game.status = "setting";
					game.actions.configure();
				break;
				case "configured" :
					game.status = "initialized";
					game.scene = "splash";
				break;
			}
		},
		configure : function () {
			// _ Setting Canvas

			canvas.width = settings.resolution.width;
			canvas.height = settings.resolution.height;

			// Setting Canvas _

			// _ Setting Sprites

			game.sprites["santa_claus"] = utils.getSprite({
				image : images["santa_claus"],
				context : context,

				height : 36,

				frames : 3,
				speed : 2,
				frameSpeed : 15,

				directions : {
					left : { x : 0, y : 37 },
					up : { x : 0, y : 109 },
					right : { x : 0, y : 73 },
					down : { x : 0, y : 0 },
				},
			});

			// Setting Sprites _

			game.status = "configured";
		},
	},
	scenes : {
		loading : function () {
			switch (game.status) {
				case "loading" :
					for (extension in settings.resources.images) {
						for (index in settings.resources.images[extension]) {
							if (typeof settings.resources.images[extension][index] !== "function") {
								if (typeof images[settings.resources.images[extension][index]] === "undefined") {
									return;
								}
							}
						}
					}

					game.status = "loadded";
				break;
			}
		},
		splash : function () {
			switch (game.status) {
				case "initialized" :
					game.scene = "playing";
				break;
			}
		},
		playing : function () {

		},
	}
};