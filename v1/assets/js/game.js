var game = {
	status : "initial",
	statusKeys : [],
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
			// _ Adding Listeners

				document.addEventListener("keydown", game.events.updateStatusKeys);
				document.addEventListener("keyup", game.events.updateStatusKeys);

			// Adding Listeners _

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
					speed : 3,
					frameSpeed : 7,

					limits : {
						min : {
							x : -10,
							y : -10,
						},
						max : {
							x : canvas.width - 20,
							y : canvas.height - 20,
						},
					},

					direction : "down",
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
		update : {
			characters : function () {
				switch (game.statusKeys.last()) {
					case 37 : game.sprites["santa_claus"].moveTo("left"); break;
					case 38 : game.sprites["santa_claus"].moveTo("up"); break;
					case 39 : game.sprites["santa_claus"].moveTo("right"); break;
					case 40 : game.sprites["santa_claus"].moveTo("down"); break;
				}
			},
		},
	},
	events : {
		updateStatusKeys : function (e) {
			if (game.status === "initialized" && game.scene === "playing" && e.keyCode >= 37 && e.keyCode <= 40) {
				switch (e.type) {
					case "keyup":
						game.statusKeys.splice(game.statusKeys.indexOf(e.keyCode), 1);
					break;
					case "keydown":
						if (game.statusKeys.indexOf(e.keyCode) === -1) {
							game.statusKeys.push(e.keyCode);
						}
					break;
				}
			}
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
			game.actions.update.characters();

			game.sprites["santa_claus"].render();
		},
	}
};