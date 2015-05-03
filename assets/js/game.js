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
			typeof sprites.santaClausUp !== "undefined" &&
			typeof sprites.santaClausRight !== "undefined" &&
			typeof sprites.santaClausDown !== "undefined" &&
			typeof sprites.santaClausLeft !== "undefined"
		) {
			Game.status = "splash";
		}
	},
	splash : function() {
		Game.status = "playing";
	},
	playing : function() {
		if(Game.santaClaus.status === "initial") {
			sprites.santaClausDown.render(
				settings.resolution.width / 2 - ((sprites.santaClausDown.width / 2) / sprites.santaClausDown.qntFrames),
    			settings.resolution.height / 2 - sprites.santaClausDown.height / 2
			);

			position = sprites.santaClausDown.getPosition();
			
			Game.santaClaus.updatePosition(position.width, position.height);

			Game.santaClaus.status = "stopped";
			Game.santaClaus.movementDirection = "down";
		} else {
			Game.santaClaus.updateMovement();
		}
	},
	santaClaus : {
		status : "initial",
		speed : 2,
		movementDirection : "",
		keys : [],
		updateMovement : function() {
			var position = {};

			switch (Game.santaClaus.keys.last()) {
				case 37 :
					Game.santaClaus.movementDirection = "left";

					position = sprites.santaClausLeft.getPosition();
					position.width -= 2;

					sprites.santaClausLeft.run(position.width, position.height);	
				break;
				case 38 :
					Game.santaClaus.movementDirection = "up";

					position = sprites.santaClausUp.getPosition();
					position.height -= 2;

					sprites.santaClausUp.run(position.width, position.height);
				break;
				case 39 :
					Game.santaClaus.movementDirection = "right";

					position = sprites.santaClausRight.getPosition();
					position.width += 2;

					sprites.santaClausRight.run(position.width, position.height);
				break;
				case 40 :
					Game.santaClaus.movementDirection = "down";

					position = sprites.santaClausDown.getPosition();
					position.height += 2;

					sprites.santaClausDown.run(position.width, position.height);
				break;
				default :
					Game.santaClaus.status = "stopped";

					switch (Game.santaClaus.movementDirection) {
						case "left": sprites.santaClausLeft.render(); break;
						case "up": sprites.santaClausUp.render(); break;
						case "right": sprites.santaClausRight.render(); break;
						case "down": sprites.santaClausDown.render(); break;
					}

					return;
				break;
			}

			Game.santaClaus.updatePosition(position.width, position.height);
		},
		updateKey : function(e) {
			if(Game.status === "playing" && e.keyCode >= 37 && e.keyCode <= 40) {
				switch (e.type) {
					case "keyup":
						Game.santaClaus.keys.splice(Game.santaClaus.keys.indexOf(e.keyCode), 1);
					break;
					case "keydown":
						if(Game.santaClaus.keys.indexOf(e.keyCode) === -1) {
							Game.santaClaus.keys.push(e.keyCode);

							Game.santaClaus.status = "walking";
						}
					break;
				}
			}
		},
		updatePosition : function(x, y) {
			sprites.santaClausUp.setPosition(x, y);
			sprites.santaClausRight.setPosition(x, y);
			sprites.santaClausDown.setPosition(x, y);
			sprites.santaClausLeft.setPosition(x, y);
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
	document.addEventListener("keydown", Game.santaClaus.updateKey);
	document.addEventListener("keyup", Game.santaClaus.updateKey);

	// Images
	var imgSantaClaus = new Image();
		imgSantaClaus.src = settings.imgPath + "santa_claus.png";
		imgSantaClaus.onload = function() {
			sprites["santaClausLeft"] = this.sprite({
				height : 36,
				heightCapture : 37,
				qntFrames : 3,
				speed : 15
			});

			sprites["santaClausUp"] = this.sprite({
				height : 36,
				heightCapture : 109,
				qntFrames : 3,
				speed : 15
			});

			sprites["santaClausRight"] = this.sprite({
				height : 36,
				heightCapture : 73,
				qntFrames : 3,
				speed : 15
			});

			sprites["santaClausDown"] = this.sprite({
				height : 36,
				qntFrames : 3,
				speed : 15
			});
		};

// JS Prototypes
Array.prototype.last = function(){
    return this[this.length - 1];
};

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