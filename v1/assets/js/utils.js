var utils = {
	clearCanvas : function () {
		context.clearRect(0, 0, canvas.width, canvas.height);
	},
	getSprite : function (attributes) {
		var sprite = {};

		if (typeof attributes.image === "undefined") {
			return sprite;
		}

		// _ Internal Functions

			sprite.getCentralPosition = function () {
				return {
					x : ((sprite.maxWidth - sprite.minWidth) / 2) - ((sprite.image.width / 2) / sprite.frames),
					y : ((sprite.maxHeight - sprite.minHeight) / 2) - sprite.height / 2,
				};
			};
			sprite.getPosition = function () {
				return sprite.position;
			}

			sprite.setPosition = function (x, y) {
				sprite.position.x = x || sprite.position.x;
				sprite.position.y = y || sprite.position.y;
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
		       		sprite.directions[sprite.direction].x + (sprite.frameIndex * sprite.width / sprite.frames),
		       		sprite.directions[sprite.direction].y,
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

		sprite.minWidth = attributes.minWidth || 0;
		sprite.maxWidth = attributes.maxWidth || sprite.context.canvas.width;
		sprite.minHeight = attributes.minHeight || 0;
		sprite.maxHeight = attributes.maxHeight || sprite.context.canvas.height;

		sprite.frames = attributes.frames || 1;
		sprite.speed = attributes.speed || 1;
		sprite.frameSpeed = attributes.frameSpeed || 10;

		sprite.frameIndex = 0;
		sprite.framesCounter = 0;

		sprite.direction = attributes.direction || "";
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
		}

		sprite.position = {};

		if (typeof attributes.position === "undefined") {
			sprite.position.x = sprite.getCentralPosition().x;
			sprite.position.y = sprite.getCentralPosition().y;
		} else {
			sprite.position.x = attributes.position.x || sprite.getCentralPosition().x;
			sprite.position.y = attributes.position.y || sprite.getCentralPosition().y;
		}

		return sprite;
	},
};