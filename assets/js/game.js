// Game Start
$(document).ready(function() {
	initialize();
});

function initialize() {
	Game.start();
	Game.play();
}

// Game
var Game = {
	status : "loading",
	points : 0,
	start : function() {
		canvas.height = settings.resolution.height;
		canvas.width = settings.resolution.width;

		Game.play();
	},
	play : function() {
		++frames;

		if(Game.status === "loading") {
			Game.loading();
		} else {
			Game.update();
		}

		window.requestAnimationFrame(Game.play);
	},
	update : function() {
		ctx.clearRect(0, 0, settings.resolution.width, settings.resolution.height);

		switch (Game.status) {
			case "splash" :
				Game.splash();
			break;
			case "playing" :
				Game.playing();
			break;
		}
	},
	loading : function() {
		if(
			typeof sprites.santaClauseUp !== "undefined" &&
			typeof sprites.santaClauseRight !== "undefined" &&
			typeof sprites.santaClauseDown !== "undefined" &&
			typeof sprites.santaClauseLeft !== "undefined"
		) {
			Game.status = "splash";
		}
	},
	splash : function() {
		Game.status = "playing";
	},
	playing : function() {
		if(Game.santaClause.status === "initial") {
			sprites.santaClauseRight.render(0, 175);

			position = sprites.santaClauseRight.getPosition();
			
			Game.santaClause.updatePosition(position.width, position.height);

			Game.santaClause.status = "stopped";
			Game.santaClause.movementDirection = "right";
		} else {
			Game.santaClause.updateMovement();
		}
	},
	santaClause : {
		status : "initial",
		movementDirection : "",
		keys : {
			37 : false,
			38 : false,
			39 : false,
			40 : false
		},
		updateMovement : function() {
			var position = {};

			if(Game.santaClause.keys[37]) {
				Game.santaClause.movementDirection = "left";

				position = sprites.santaClauseLeft.getPosition();
				--position.width;

				sprites.santaClauseLeft.run(position.width, position.height);
			} else if(Game.santaClause.keys[38]) {
				Game.santaClause.movementDirection = "up";

				position = sprites.santaClauseUp.getPosition();
				--position.height;

				sprites.santaClauseUp.run(position.width, position.height);
			} else if(Game.santaClause.keys[39]) {
				Game.santaClause.movementDirection = "right";

				position = sprites.santaClauseRight.getPosition();
				++position.width;

				sprites.santaClauseRight.run(position.width, position.height);
			} else if(Game.santaClause.keys[40]) {
				Game.santaClause.movementDirection = "down";

				position = sprites.santaClauseDown.getPosition();
				++position.height;

				sprites.santaClauseDown.run(position.width, position.height);
			} else {
				Game.santaClause.status = "stopped";

				switch (Game.santaClause.movementDirection) {
					case "left": sprites.santaClauseLeft.render(); break;
					case "up": sprites.santaClauseUp.render(); break;
					case "right": sprites.santaClauseRight.render(); break;
					case "down": sprites.santaClauseDown.render(); break;
				}

				return;
			}

			Game.santaClause.updatePosition(position.width, position.height);
		},
		updateKey : function(e) {
			if(Game.status === "playing" && e.keyCode >= 37 && e.keyCode <= 40) {
				switch (e.type) {
					case "keyup":
						Game.santaClause.keys[e.keyCode] = false;
					break;
					case "keydown":
						Game.santaClause.keys[e.keyCode] = true;

						Game.santaClause.status = "walking";
					break;
				}
			}
		},
		updatePosition : function(x, y) {
			sprites.santaClauseUp.setPosition(x, y);
			sprites.santaClauseRight.setPosition(x, y);
			sprites.santaClauseDown.setPosition(x, y);
			sprites.santaClauseLeft.setPosition(x, y);
		}
	}
};

// Game Vars
	// Statics
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var settings = {
		//debug : true,
		//lang : "pt_br",
		name : "Save Christmas",
		resolution : {
			width : 640,
			height : 480
		},
		imgPath : "assets/images/"
	};

	// Globals
	var frames = 0;
	var sprites = {};

	// Events
	document.addEventListener("keydown", Game.santaClause.updateKey);
	document.addEventListener("keyup", Game.santaClause.updateKey);

	// Images
	var imgSantaClause = new Image();
		imgSantaClause.src = settings.imgPath + "santa_clause.png";
		imgSantaClause.onload = function() {
			sprites["santaClauseUp"] = this.sprite({
				height : 36,
				heightCapture : 109,
				qntFrames : 3,
				speed : 10
			});

			sprites["santaClauseRight"] = this.sprite({
				height : 36,
				heightCapture : 73,
				qntFrames : 3,
				speed : 10
			});

			sprites["santaClauseDown"] = this.sprite({
				height : 36,
				qntFrames : 3,
				speed : 10
			});

			sprites["santaClauseLeft"] = this.sprite({
				height : 36,
				heightCapture : 37,
				qntFrames : 3,
				speed : 10
			});
		};

// JS Prototypes
Array.prototype.getRandom = function() {
	return this[Math.floor(Math.random() * this.length)];
};

Number.prototype.leftPad = function (length, padString){
    return Array(length - String(this).length + 1).join(padString || '0') + this;
}

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