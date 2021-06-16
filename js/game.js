// Copyright (c) 2021 by Dan Zen (https://codepen.io/danzen/pen/bKvybq)

const frame = new Frame("fulbito", 800, 600);
frame.on("ready", ()=>{ // ES6 Arrow Function - similar to function(){}
    zog("ready from ZIM Frame"); // logs in console (F12 - choose console)

    // often need below - so consider it part of the template
    let stage = frame.stage;
    let stageW = frame.width;
    let stageH = frame.height;
    frame.outerColor = "#555";
    frame.color = "#1b9b2a";

    // REFERENCES for ZIM at http://zimjs.com
    // see http://zimjs.com/learn.html for video and code tutorials
    // see http://zimjs.com/docs.html for documentation		
    // see https://www.youtube.com/watch?v=pUjHFptXspM for INTRO to ZIM
    // see https://www.youtube.com/watch?v=v7OT0YrDWiY for INTRO to CODE

    // CODE HERE
		var load = frame.loadAssets(["ball.png", "bottle.png"], "https://d309knd7es5f10.cloudfront.net/codepen/");
		load.on("complete", ()=>{
			
			// CREATE PHYSICS WORLD
			// call the ZIM physics helper class for the Box2D physics engine
			// can also set bounds (default the stage) and gravity (default 10)
			// see https://d309knd7es5f10.cloudfront.net/physics_1.0.js for Physics Details
			// and physics examples in ZIM BITS http://zimjs.com/bits.html
			const bounds = {x:0, y:-1000, width:stageW, height:stageH+1000}; // let ball go above the stage
			const physics = new Physics(frame, bounds);			
			
			// MAKE BALL
			// map canvas shapes (visible) to physics shapes (invisible)
			// canvas ball
			// Box2D objects are all center registration - Bitmaps are by default top left reg - so centerReg()
			const ball = frame.asset("ball.png").sca(.6).centerReg().cur(); 
			// physics ball (we add the Body suffix by convention)
			// restitution is how bouncy (higher the bouncier)
			// angular is angular damping (higher prevents spin)
			// there is also linear for linear damping and friction for um... friction
			// and there are more options - see https://d309knd7es5f10.cloudfront.net/physics_1.0.js
			const ballBody = physics.makeCircle({radius:ball.width/2, restitution:.6, angular:1}); 
			ballBody.x = ball.x;
			ballBody.y = ball.y;					
			physics.addMap(ballBody, ball);
						
			// MAKE SCORE LABEL
			var scoreLabel = new Label({
				text:0, 
				size:50,
				align:"right", 
				color:frame.white, 
				backgroundColor:frame.light
			}).pos(stageW-50, 30, stage, 0); // at level 0 under ball
			
			// PRESS ON BALL, KEEP SCORE and CHANGE COUNTRY
			// apply force to ball when pressed and keep count
			let score = 0;
			let min = 250;
			let max = 450;
			let ballEvent = ball.on("mousedown", (e)=>{	// assign event to variable to remove and add later
				scoreLabel.text = ++score; // pre-assignment iterator
				let upForce = -rand(min, max);
				let sideForce = (ballBody.x-e.stageX)/physics.scale * upForce/(-5);
				// first vector is the force, second vector is where to apply the force
				// this is a Box2D method (note they start with capital letters - sigh) 
				// so need to convert distance to meters based on physics scale
				ballBody.ApplyImpulse(new b2Vec2(sideForce, upForce), new b2Vec2(e.stageX/physics.scale, e.stageY/physics.scale));
				// swap contries
				countryLabel.animate({
					obj:{alpha:0},
					time:400,
					rewind:true,
					rewindCall:()=>{
						countryLabel.text = countries[++countryIndex%countries.length];		
						countryLabel.scaleTo(stage, 95, 70, "both");
					}
				});				
			});			
			
			// HANDLE HITTING GROUND and END GAME
			// Box2D seems to have no way to remove contact listeners so we use a check variable
			// that we set to true when the game is ended and we do not want to check for contact
			// when we restart the game, we set the endCheck to false
			var endCheck;
			ball.on("mousedown", ()=>{
				// We can use ZIM HitTests or find the height of the ball in a Ticker, etc. to end the game 
				// but here we use the Box2D contact listener system - a little awkward but gives solid results
				endCheck = false;
				let contactListener = new b2ContactListener();
				contactListener.BeginContact = function(e) { // gets automatically called every contact
					if (endCheck) return; // already ended
					// the event object gives us which two body FIXTURES are hitting for ALL hits
					// we then need to check if the bodies are the two we are insterested in 
					// the bottom border wall body is physics.borderBottom and the ball is ballBody
					if (
						(e.m_fixtureA.GetBody() == ballBody && e.m_fixtureB.GetBody() == physics.borderBottom) ||
						(e.m_fixtureA.GetBody() == physics.borderBottom && e.m_fixtureB.GetBody() == ballBody)
					) {
						// then ball is hitting bottom
						endCheck = true;
						ball.off("mousedown", ballEvent);
						ball.cur("default");
						countryLabel.text = "GAME OVER";		
						countryLabel.scaleTo(stage, 95, 70, "both");
						timeout(1000, ()=>{
							board.score(score);
							boardBacking.addTo();
							board.addTo();
						});						
					}
				}
				// set the contact listener on the world
				physics.world.SetContactListener(contactListener);
			}, null, true); // run only once!
			
			// MAKE BOTTLE TO PAUSE GAME			
			const bottle = frame.asset("bottle.png").sca(.4).centerReg().cur(); 
			const bottleBody = physics.makeRectangle({width:bottle.width, height:bottle.height, angular:.8});
			bottleBody.x = 70;
			bottleBody.y = 100;					
			physics.addMap(bottleBody, bottle);			
			// pause ball when press bottle and unpause when press off bottle
			bottle.on("mousedown", ()=>{
				ballBody.SetType(b2Body.b2_staticBody);
				stage.on("stagemousedown", ()=>{
					ballBody.SetType(b2Body.b2_dynamicBody); 
				}, null, true); // remove listener after it runs once
			});
			// drag the bottle
			physics.drag([bottleBody]); // pass in an array of bodies to drag or null to drag all dynamic bodies
			
			// MAKE CONTRIES
			const countries = shuffle(["RUSSIA", "BRAZIL", "IRAN", "JAPAN", "MEXICO", "BELGIUM", "SOUTH KOREA", "SAUDI ARABIA", "GERMANY", "ENGLAND", "SPAIN", "NIGERIA", "COSTA RICA", "POLAND", "EGYPT", "ICELAND", "SERBIA", "PORTUGAL", "FRANCE", "URUGUAY", "ARGENTINA", "COLOMBIA", "PANAMA", "SENEGAL", "MOROCCO", "TUNISIA", "SWITZERLAND", "CROATIA", "SWEDEN", "DENMARK", "AUSTRALIA", "PERU"]);			
			let countryIndex = 0;
			const countryLabel = new Label({
				text:countries[countryIndex],
				size:300,
				color:frame.white,
				align:"center",
				valign:"center",
			}).scaleTo(stage, 95, 70, "Both").centerReg(stage, 0);						
			
			// MAKE LEADER BOARD
			const boardBacking = new Rectangle(stageW, stageH, frame.white).alp(.8).addTo(stage);
			boardBacking.on("mousedown", ()=>{
				// this starts or restarts the game
				board.removeFrom();
				boardBacking.removeFrom();				
				ball.off("mousedown", ballEvent); // remove the ballEvent as we will add it again below
				ballEvent = ball.on("mousedown", ballEvent);
				// add the first press event to start the game
				ball.on("mousedown", ()=>{
					endCheck = false;
				}, null, true); // only run the first time				
				ball.cur();
				countryLabel.text = countries[countryIndex%countries.length];		
				countryLabel.scaleTo(stage, 95, 70, "both");
				scoreLabel.text = score = 0;
			});
			// LeaderBoard - see the game module (js file) and http://zimjs.com/leaderboard
			const board = new zim.LeaderBoard({
				title:"SOCCER UP",
				data:"X233C92Q"
			})
				.siz(null,stageH*.8)
				.center();
						
			// physics.debug(); // makes it so you can see physics bodies			
			
			// FOOTER
			// call remote script to make ZIM Foundation for Creative Coding icon
			createIcon(frame); 
						
		});	// end asset load
	
 }); // end of ready