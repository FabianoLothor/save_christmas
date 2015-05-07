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
				x : context.canvas.width / 2 - ((sprite.image.width / 2) / sprite.frames),
				y : context.canvas.height / 2 - sprite.image.height / 2,
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

		sprite.moveTo = function (direction) {
			switch (direction) {
				case "left" :
					sprite.setPosition(
						sprite.getPosition().x - sprite.speed,
						sprite.getPosition().y
					);
				break;
				case "up" :
					sprite.setPosition(
						sprite.getPosition().x,
						sprite.getPosition().y - sprite.speed
					);
				break;
				case "right" :
					sprite.setPosition(
						sprite.getPosition().x + sprite.speed,
						sprite.getPosition().y
					);
				break;
				case "down" :
					sprite.setPosition(
						sprite.getPosition().x,
						sprite.getPosition().y + sprite.speed
					);
				break;
			}
		};

		// Internal Functions _

		sprite.context = attributes.context;

		sprite.image = attributes.image;

		sprite.width = attributes.width || attributes.image.width;
		sprite.height = attributes.height || attributes.image.height;

		sprite.frames = attributes.frames || 1;
		sprite.speed = attributes.speed || 1;
		sprite.frameSpeed = attributes.speed || 10;

		sprite.frameIndex = 0;
		sprite.framesCounter = 0;

		sprite.position = {};

		if (typeof attributes.position === "undefined") {
			sprite.position.x = sprite.getCentralPosition().x;
			sprite.position.y = sprite.getCentralPosition().y;
		} else {
			sprite.position.x = attributes.position.x || sprite.getCentralPosition().x;
			sprite.position.y = attributes.position.y || sprite.getCentralPosition().y;
		}

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

		return sprite;
	},
};
/*
Image.prototype.sprite = function(attr) {
	var sprite = {
		context : ctx,
		img : this,

	    width : attr.width || this.width,
	    height : attr.height || this.height,

		widthCapture : attr.widthCapture || 0,
		heightCapture : attr.heightCapture || 0,
		widthPosition : attr.widthPosition || 0,
		heightPosition : attr.heightPosition || 0,

		minWidthPosition : attr.minWidthPosition || -10,
		minHeightPosition : attr.minHeightPosition || -10,
		maxWidthPosition : attr.maxWidthPosition || (settings.resolution.width - 10),
		maxHeightPosition : attr.maxHeightPosition || (settings.resolution.height - 10),

		qntFrames : attr.qntFrames || 1,
		speed : attr.speed || 0,
		loop : attr.loop || true,
		
		frameIndex : 0,
	    framesCount : 0,

	    getPosition : function() {
	    	return {
	    		width : sprite.widthPosition,
	    		height : sprite.heightPosition
	    	};
	    },

	    setPosition : function(x, y) {
	    	if(x < sprite.minWidthPosition) {
	    		x = sprite.minWidthPosition;
	    	}

	    	if(x > sprite.maxWidthPosition) {
	    		x = sprite.maxWidthPosition
	    	}

	    	if(y < sprite.minHeightPosition) {
	    		y = sprite.minHeightPosition;
	    	}

	    	if(y > sprite.maxHeightPosition) {
	    		y = sprite.maxHeightPosition
	    	}

	    	sprite.widthPosition = x || 0;
    		sprite.heightPosition = y || 0;
	    },

	    render : function(x, y) {
	    	sprite.setPosition(x || sprite.widthPosition, y || sprite.heightPosition);

	        sprite.context.drawImage(
	   			sprite.img,
	       		sprite.widthCapture + (sprite.frameIndex * sprite.width / sprite.qntFrames),
	       		sprite.heightCapture,
	       		sprite.width / sprite.qntFrames,
	       		sprite.height,
	       		sprite.widthPosition,
	   			sprite.heightPosition,
	       		sprite.width / sprite.qntFrames,
	       		sprite.height
			);
	    },

	    run : function(x, y) {
	    	sprite.render(x, y);

	        sprite.framesCount += 1;
				
	        if (sprite.framesCount > sprite.speed) {
	            sprite.framesCount = 0;

	            if (sprite.frameIndex < sprite.qntFrames - 1) {
	                sprite.frameIndex += 1;
	            } else if (sprite.loop) {
	                sprite.frameIndex = 0;
	            }	
	        }
	    },

	    stop : function () {
	    	sprite.loop = false;
	    }
	};

    return sprite;
}
*/