var utils = {
	clearCanvas : function () {
		context.clearRect(0, 0, canvas.width, canvas.height);
	},
	getRandomInteger : function (min, max) {
		return Math.floor(Math.random() * ((max + 1) - min)) + min;
	},
	getSprite : function (attributes) {
		var sprite = {};

		if (typeof attributes.image === "undefined") {
			return sprite;
		}

		// _ Internal Functions

			sprite.checkColisionWith = function (other_sprite) {
				if (sprite.position.x < other_sprite.position.x + (other_sprite.width / other_sprite.frames)  && (sprite.width / sprite.frames) + sprite.position.x > other_sprite.position.x &&
					sprite.position.y < other_sprite.position.y + other_sprite.height && sprite.height + sprite.position.y > other_sprite.position.y
				) { return true; } return false;
			}

			sprite.getCentralPosition = function () {
				return {
					x : ((sprite.limits.max.x - sprite.limits.min.x) / 2) - ((sprite.image.width / 2) / sprite.frames),
					y : ((sprite.limits.max.y - sprite.limits.min.y) / 2) - sprite.height / 2,
				};
			};

			sprite.getPosition = function () {
				return sprite.position;
			};

			sprite.setPosition = function (x, y) {
				if (x < sprite.limits.min.x) {
		    		x = sprite.limits.min.x;
		    	}

		    	if (x > sprite.limits.max.x) {
		    		x = sprite.limits.max.x;
		    	}

		    	if (y < sprite.limits.min.y) {
		    		y = sprite.limits.min.y;
		    	}

		    	if (y > sprite.limits.max.y) {
		    		y = sprite.limits.max.y;
		    	}

				sprite.position.x = x;
				sprite.position.y = y;
			};

			sprite.getDirectionValues = function (direction) {
				return sprite.directions[direction];
			};

			sprite.move = function () {
				sprite.framesCounter += 1;
				
		        if (sprite.framesCounter > sprite.frameSpeed) {
		            sprite.framesCounter = 0;

		            if (sprite.frameIndex < sprite.frames - 1) {
		                sprite.frameIndex += 1;
		            } else {
		                sprite.frameIndex = 0;
		            }	
		        }
			};

			sprite.moveTo = function (direction) {
				switch (direction) {
					case "left" :
						sprite.direction = "left";
						sprite.setPosition(
							sprite.getPosition().x - sprite.speed,
							sprite.getPosition().y
						);
					break;
					case "up" :
						sprite.direction = "up";
						sprite.setPosition(
							sprite.getPosition().x,
							sprite.getPosition().y - sprite.speed
						);
					break;
					case "right" :
						sprite.direction = "right";
						sprite.setPosition(
							sprite.getPosition().x + sprite.speed,
							sprite.getPosition().y
						);
					break;
					case "down" :
						sprite.direction = "down";
						sprite.setPosition(
							sprite.getPosition().x,
							sprite.getPosition().y + sprite.speed
						);
					break;
				}

				sprite.move();
			};

			sprite.render = function () {
				sprite.context.drawImage(
		   			sprite.image,
		       		sprite.directions[sprite.direction] === false ? 0 : sprite.directions[sprite.direction].x + (sprite.frameIndex * sprite.width / sprite.frames),
		       		sprite.directions[sprite.direction] === false ? 0 : sprite.directions[sprite.direction].y,
		       		sprite.width / sprite.frames,
		       		sprite.height,
		       		sprite.getPosition().x,
		   			sprite.getPosition().y,
		       		sprite.width / sprite.frames,
		       		sprite.height
				);
			};

		// Internal Functions _

		sprite.context = attributes.context;

		sprite.image = attributes.image;

		sprite.width = attributes.width || attributes.image.width;
		sprite.height = attributes.height || attributes.image.height;

		sprite.frames = attributes.frames || 1;
		sprite.speed = attributes.speed || 1;
		sprite.frameSpeed = attributes.frameSpeed || 10;

		sprite.frameIndex = 0;
		sprite.framesCounter = 0;

		sprite.limits = {};
		sprite.limits = {
			min : {
				x : 0,
				y : 0,
			},
			max : {
				x : sprite.context.canvas.width,
				y : sprite.context.canvas.height,
			},
		};

		if (typeof attributes.limits !== "undefined") {
			if (typeof attributes.limits.min !== "undefined") {
				sprite.limits.min.x = attributes.limits.min.x || 0;
				sprite.limits.min.y = attributes.limits.min.y || 0;
			}

			if (typeof attributes.limits.max !== "undefined") {
				sprite.limits.max.x = attributes.limits.max.x || sprite.context.canvas.width;
				sprite.limits.max.y = attributes.limits.max.y || sprite.context.canvas.height;
			}
		}

		sprite.direction = attributes.direction || "none";
		sprite.directions = {};

		if (typeof attributes.directions !== "undefined") {
			if (typeof attributes.directions.left === "undefined") {
				sprite.directions.left = false;
			} else {
				sprite.directions.left = {
					x : attributes.directions.left.x,
					y : attributes.directions.left.y,
				};
			}

			if (typeof attributes.directions.up === "undefined") {
				sprite.directions.up = false;
			} else {
				sprite.directions.up = {
					x : attributes.directions.up.x,
					y : attributes.directions.up.y,
				};
			}

			if (typeof attributes.directions.right === "undefined") {
				sprite.directions.right = false;
			} else {
				sprite.directions.right = {
					x : attributes.directions.right.x,
					y : attributes.directions.right.y,
				};
			}

			if (typeof attributes.directions.down === "undefined") {
				sprite.directions.down = false;
			} else {
				sprite.directions.down = {
					x : attributes.directions.down.x,
					y : attributes.directions.down.y,
				};
			}
		} else {
			sprite.directions.none = false;
		}

		sprite.position = {};

		if (typeof attributes.position === "undefined") {
			sprite.setPosition(
				sprite.getCentralPosition().x,
				sprite.getCentralPosition().y
			);
		} else {
			sprite.position.x = attributes.position.x;
			sprite.position.y = attributes.position.y;
		}

		return sprite;
	},
};