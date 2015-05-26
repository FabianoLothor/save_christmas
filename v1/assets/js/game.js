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
					game.scene = "loading";
					game.status = "loading";
				break;
				case "loadded" :
					game.status = "setting";

					game.actions.configure();
				break;
				case "configured" :
					game.scene = "splash";
					game.status = "initialized";
				break;
				case "starting" :
					game.scene = "playing";
					game.status = "playing";

					game.actions.add.wizard();
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

				game.sprites["gift"] = utils.getSprite({
					image : images["gift"],
					context : context,

					frames : 1,

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

					position : {
						x : utils.getRandomInteger(-10, canvas.width - 20),
						y : utils.getRandomInteger(-10, canvas.height - 20),
					},
				});

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

				game.sprites["wizard"] = utils.getSprite({
					image : images["wizard"],
					context : context,

					height : 32,

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
						left : { x : 0, y : 33 },
						up : { x : 0, y : 97 },
						right : { x : 0, y : 65 },
						down : { x : 0, y : 0 },
					},
				});

				game.sprites["wizards"] = [];

			// Setting Sprites _

			game.status = "configured";
		},
		add : {
			wizard : function () {
				game.sprites["wizards"].push(game.sprites["wizard"]);

				game.sprites["wizards"].last().setPosition();
			},
		},
		update : {
			sprites : function () {
				// _ Updating Santa Claus Position

				switch (game.statusKeys.last()) {
					case 37 : game.sprites["santa_claus"].moveTo("left"); break;
					case 38 : game.sprites["santa_claus"].moveTo("up"); break;
					case 39 : game.sprites["santa_claus"].moveTo("right"); break;
					case 40 : game.sprites["santa_claus"].moveTo("down"); break;
				}

				// Updating Santa Claus Position _

				// _ Updating Wizards Positions

				

				// Updating Wizards Positions _

				// _ Checking colision beteween Santa Claus and Gift

				if (game.sprites["santa_claus"].checkColisionWith(game.sprites["gift"])) {
					game.sprites["gift"].setPosition(
						utils.getRandomInteger(game.sprites["gift"].limits.min.x, game.sprites["gift"].limits.max.x),
						utils.getRandomInteger(game.sprites["gift"].limits.min.y, game.sprites["gift"].limits.max.y)
					);

					game.actions.add.wizard();
				}

				// Checking colision beteween Santa Claus and Gift _
			},
		},
	},
	events : {
		updateStatusKeys : function (e) {
			if (game.status === "playing" && game.scene === "playing" && e.keyCode >= 37 && e.keyCode <= 40) {
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
					game.status = "starting";
				break;
			}
		},
		playing : function () {
			game.actions.update.sprites();

			game.sprites["santa_claus"].render();
			game.sprites["gift"].render();

			for(wizard in game.sprites["wizards"]) {
				if (typeof game.sprites["wizards"][wizard] !== "function") {
					game.sprites["wizards"][wizard].render();
				}
			}
		},
	}
};