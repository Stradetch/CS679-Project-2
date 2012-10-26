//Documentation stuff here
function start() {
	//RequestAnimationFrame code from flocking demo
	var reqFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function FrameRequestCallback */callback, /* DOMElement Element */element) {
            window.setTimeout(callback, 1000 / frameRate);
        };
    theCanvas = document.getElementById("canvas");
    theContext = theCanvas.getContext("2d");
    
    //world created with 0 gravity, and sleep is disabled
    world = new b2World(new b2Vec2(0,0),false);
    //properties of objects
    bdef = new b2BodyDef;
    bdef.allowSleep = false;
    bdef.type = b2Body.b2_dynamicBody
    fdef = new b2FixtureDef;
    fdef.density = ddensity;
    fdef.friction = dfriction;
    fdef.restitution = drestitution;
    fdef.shape = new b2CircleShape(1.0);
    jdef = new b2WeldJointDef;
    

    function cull(a, b) {//sorting function, puts stuff tagged for removal at end to be popped, as used in Swarm Survival Game
        if (a.remove) { return 1; }
        else if (b.remove) { return -1; }
        else { return 0; }
    }
    
    window.addEventListener("keydown", function (e) {	//keyboard detection function as used in Swarm Survival Game
        if (!(e.keyCode in keysDown)) {
            //firstKeyHit(e.keyCode);
        }
        keysDown[e.keyCode] = true;

    }, false);
    window.addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);
    
    var mouseDown, click;
    document.addEventListener("mousedown", function(e) {click = true; mouseDown = true;}, false);
    document.addEventListener("mousemove", function(e) {mousex = (e.clientX - theCanvas.offsetLeft) / scale; mousey = (e.clientY - theCanvas.offsetTop) / scale;}, false);
    document.addEventListener("mouseup", function() {mouseDown = false;}, false);
    
    
    
    var grabbed = [];
    var mousexo = 0;
    var mouseyo = 0;
    var mousext = 0;
    var mouseyt = 0;
    var aabb = new b2AABB;
    var ready = false;
    var grabRadius = 2;
    var launchMult = 2000;
    var launchMax = 500;
    
    function listen() {//account for effects of EventListeners
    	if(click) {
    		mousexo = mousex;
    		mouseyo = mousey;
    		aabb.lowerBound = new b2Vec2(mousexo-grabRadius,mouseyo-grabRadius);
    		aabb.upperBound = new b2Vec2(mousexo+grabRadius,mouseyo+grabRadius);
    		ready = true;
    		click = false;
    	} else if(mouseDown) {
    		theContext.strokeStyle = "#55FFFF";
    		theContext.beginPath();
    		theContext.arc(mousexo*10,mouseyo*10,grabRadius*10,0,Math.PI*2,true);
    		theContext.stroke();
    		theContext.moveTo(mousexo*10,mouseyo*10);
    		theContext.lineTo(mousex*10,mousey*10);
    		theContext.stroke();
    	} else if(ready) {
    		world.QueryAABB(throwScan, aabb);
    		ready = false;
    	}
    }
    function throwScan(fixture) {
    	obj = fixture.GetBody().GetUserData();
    	if(obj.type == crateType && Math.sqrt(Math.pow(obj.body.GetPosition().x-mousexo,2)+Math.pow(obj.body.GetPosition().y-mouseyo,2)) <= grabRadius + 0.5) {
    		obj.ctrForce(new b2Vec2((mousex-mousexo)*launchMult,(mousey-mouseyo)*launchMult));
    	}
    	return true;
    }

    
    var collider = new b2ContactListener;
    collider.BeginContact = function(contact) {}
    collider.EndContact = function(contact) {}
    collider.PostSolve = function(contact, impulse) {
    	b1 = contact.GetFixtureA().GetBody().GetUserData();
    	b2 = contact.GetFixtureB().GetBody().GetUserData();
    	if(b1.type == playerShieldType) {damage(b1,b2,impulse);}
    	else if(b2.type == playerShieldType) {damage(b2,b1,impulse);}
    }
    collider.PreSolve = function(contact, oldManifold) {}
    this.world.SetContactListener(collider);
    
    /*
    //TODO: DEMO CODE
    objectList.push(makeObject(crateType, 80, 39, 0, [1,1]));
   	objectList.push(makeObject(crateType, -1000, 30, Math.random(), [1,1]));
   	objectList.push(makeObject(crateType, 80, 40, 0, [1,1]));
   	objectList.push(makeObject(crateType, 80, 41, 0, [1,1]));
   	objectList.push(makeObject(crateType, 81, 39, 0, [1,1]));
   	objectList.push(makeObject(crateType, 81, 40, 0, [1,1]));
   	objectList.push(makeObject(crateType, 81, 41, 0, [1,1]));
    stuffList.push(makeWeld(objectList[0].body,objectList[2].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[0].body,objectList[4].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[4].body,objectList[5].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[5].body,objectList[6].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[2].body,objectList[5].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[2].body,objectList[3].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[3].body,objectList[6].body,true,200+Math.random()*300));
    for(i = 0; i < 40; i++) {
    }
    crateStack(160, 40, 0, -5000, 0, 0, 1, 1, 2, 2, 50, 50, 0);
    crateStack(0, 40, 0, 0, 0, 0, 1, 1, 2, 2, 50, 50, 0);
   	//objectList[1].effect = railDriverEffect;
   	objectList[1].data = new b2Vec2(100,0);
   	//objectList[0].effect = stasisEffect;
   	//objectList[0].timer = 60;
    objectList[1].body.SetLinearVelocity(new b2Vec2(400+Math.random()*500,(Math.random()-0.5)*40));
    objectList[1].body.SetAngularVelocity((Math.random()-0.5)*60);
    //TODO: END OF DEMO CODE
    */
    
    
         
    Player.init();
    
         var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(theContext);
			debugDraw.SetDrawScale(scale);
			debugDraw.SetFillAlpha(10);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit/* | b2DebugDraw.e_jointBit*/);
			world.SetDebugDraw(debugDraw);
    function update() {
    	theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
    	Player.action();
    	world.Step(1/frameRate, 10, 10);	//advance physics engine
    	for(i = 0; i < objectList.length; i++) {
    		objectList[i].action();
    		if(purgeFlag) {
    			objectList.sort(cull);
    			objectList.pop();
    			purgeFlag = false;
    		}
    	}
    	for(i = 0; i < stuffList.length; i++) {
    		stuffList[i].action();
    		if(purgeFlag) {
    			stuffList.sort(cull);
    			stuffList.pop();
    			purgeFlag = false;
    		}
    	}
    	world.ClearForces();
    	world.DrawDebugData();
    	listen();
    	for(i = 0; i < objectList.length; i++) {
    		//objectList[i].draw();
    	}
    	Player.draw();
    	//TODO: Click stuff
    	runEvents();
    	reqFrame(update);	//set up another iteration
    }
    update();
}
