// class:	Thread
// param:   cvPm: canvas object
// ------------------------------------------------	
var Thread = function(xp0Pm, yp0Pm, xp1Pm, yp1Pm, strPm, hexPm, indPm, routePm, cvPm) {

	// start and end position
	this.xpo0 = this.xp0 = xp0Pm; this.ypo0 = this.yp0 = yp0Pm;
	this.xpo1 = this.xp1 = xp1Pm; this.ypo1 = this.yp1 = yp1Pm;
	// stores current origin
	this.xo; this.yo;
	// current start/end point objects - moves with car
	this.pt0; this.pt1;
	// permanent start/end point objects
	this.pto0 = new Point(this.xpo0, this.ypo0);
	this.pto1 = new Point(this.xpo1, this.ypo1);
	// my permanent midpoint
	this.xMid; this.yMid;		
	// the position of my swinging pendulum point (midpoint)
	this.xc; this.yc;
	// my grabbed point by user
	this.xg; this.yg; this.xgi; this.ygi;
	this.xg1; this.yg1;
	this.xg0; this.yg0;
	// drarwing point
	this.xd; this.yd;
	// store permanent dx, dy
	this.dx; this.dy;
	// ratio for curvature. Make this around 0.5 or higher
	this.rBezier = 0.45;
	// distance we can pull perpendicularly from middle pt of string (as ratio length)
	// (amplitude of wave)
	this.rDistMax = 0.15;
	// minimum distance to force string to move, when you brush it
	this.rDistMin = 0.01;
	// max amplitude of wave when oscillating (as ratio of length)
	this.rAmpMax = 0.072;
	// minimum distance to move (px), amplitude, so if you brush it it always shows movement
	this.ampPxMin = 12;
	// maximum pixel distance to move, amplitude
	this.ampPxMax = 33;
	// minimum pan (ratio -1 to 1)
	this.pan0 = -1; this.pan1 = 1;
	// frequency of oscillation - this is the increment per frame for t value.
	// higher gives higher frequency
	this.freq0 = 0.5; // frequency for long strings
	this.freq1 = 2.5; // frequency for short strings
	this.freq;
	// amplitude dampening - how quickly it dampens to nothing - ratio 0 to 1
	this.ampDamp0 = 0.95;
	this.ampDamp1 = 0.87;
	this.ampDamp;
	// length where we cap it highest/lowest pitch (px)
	// our longest thread is 658, shortest is 19
	this.len0 = 30; this.len1 = 650;
	// temporary distance variables
	this.distMax; this.distPerp;
	// how close do we have to be to instantly grab a thread - perpendicular distance (px)
	this.distInstantPerp = 6;
	// stores ratio from 0 to 1 where user has grabbed along the string
	this.rGrab; this.rHalf;
	// my main angle
	this.ang;
	// my perpendicular angle
	this.angPerp;
	// total length of this thread (when unstretched)
	this.len;
	// how much are we stretched, as a ratio from 0 (straight line) to 1 (max elastic)
	this.rStretch = 0;
	// my route object that I belong to
	this.route = routePm;
	
	// temporary variables
	this.dx0; this.dy0; this.dx1; this.dy1; this.dist0; this.dist1;
	this.dxBez0; this.dyBez0; this.dxBez1; this.dyBez1;
	
	// my index number within the route sequence
	this.ind = indPm;
	// stroke, hex
	this.str0 = 1; this.str1 = 4;
	//this.str = Math.round(this.str0 + rStrPm*(this.str1-this.str0));
	this.str = strPm;
	// hex value
	
	this.hex = hexPm;
		
	// frame counter
	this.ctGrab = 0; this.t = 0;
	// current amplitude
	this.amp; this.ampMax;
	// current stretch strength as ratio
	this.rStrength;
	
	// what time to start in the sound object to get the right now
	this.t0Snd;
	// what time to stop in the sound object
	this.t1Snd;
	// my pitch index (0, 1, 2...) - and as ratio
	this.pitchInd; this.rPitch;
	// lowest and highest volume for notes triggered by user
	this.vol0 = 0.3; this.vol1 = 0.5;
	// lowest and highest volume for cars
	this.vol0Car = 0.2; this.vol1Car = 0.55;
	// is update on
	this.isUpdOn = false;
	// oscillation direction
	this.oscDir;
	
	// currently grabbed
	this.isGrabbed = false;
	// currently oscillating
	this.isOsc = false;
	// was just dropped
	this.isFirstOsc = false;
	// is being drawn by a car
	this.isMidDraw = false;	
	// not drawn yet
	this.isVisible = false;
	// the car moving along me
	this.car = null;
	// car that is grabbing me
	this.carGrab = null;

	
	this.isFirstRun = true;
	// store array of which threads this one intersects with
	this.arrIntersect = new Array();
	this.didInitIntersect = false;
	
	// ------------

	this.init();
}

// init
// ------------------------------------------------	
Thread.prototype.init = function() {
	
	// link to main
	this.m = m;
	// update my position to initialize
	this.updPos();
	// update sound
	this.setSound();
	
	// canvas
	//this.cv = cvPm;
	this.cv = this.m.cv1;
	
}

// updPos
// ------------------------------------------------	
Thread.prototype.updPos = function() {
	
	// set it to my original position (unless it's a non-resizable one)
	// else it will just default the stationary initial values
	if (this.car != null) {
		// is it going forward? set my end position based on the car
		if (this.car.isFw) { this.xp1 = this.car.xp1; this.yp1 = this.car.yp1; }
		// else going backwards, set my source position at the car
		else { this.xp0 = this.car.xp1; this.yp0 = this.car.yp1; }
		// weird bug - the first time we run it with the first thread, it breaks
		if (isNaN(this.xp1)) { return; }
	}
	
	// point object
	this.pt0 = new Point(this.xp0, this.yp0);
	this.pt1 = new Point(this.xp1, this.yp1);
	//
	this.dx = this.xp1-this.xp0;
	this.dy = this.yp1-this.yp0;
	// store midpoint
	this.xMid = this.xp0 + this.dx*0.5;
	this.yMid = this.yp0 + this.dy*0.5;
	
	// store angle
	this.ang = Math.atan2(this.dy, this.dx);
	//
	this.angPerp = Math.PI/2 - this.ang;
	// set new length
	this.len = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
	//console.log(this.route.idName + " : " + this.ind + " : " + this.len);
	// set my pitch
	if (this.len > this.len1) { this.rPitch = 0; }
	else if (this.len < this.len0) { this.rPitch = 1; }
	else { this.rPitch = 1-norm(this.len, this.len0, this.len1); }
	// initially set pendulum to midpoint
	this.xc = this.xMid; this.yc = this.yMid;
	
	// store max distance we can pull from middle of string perpendicularly
	this.distMax = this.rDistMax*this.len;
	//
	if (this.distMax > this.ampPxMax) {
		this.distMax = this.ampPxMax;
	} else if (this.distMax < this.ampPxMin) {
		this.distMax = this.ampPxMin;
	}
	// set my oscillation frequency
	this.freq = lerp(this.freq0, this.freq1, this.rPitch);
	this.ampDamp = lerp(this.ampDamp0, this.ampDamp1, this.rPitch);
	// set my maximum amplitude
	this.ampMax = this.rAmpMax*this.len;
	if (this.ampMax < this.ampPxMin) {
		this.ampMax = this.ampPxMin;
	} else if (this.ampMax > this.ampPxMax) {
		this.ampMax = this.ampPxMax;
	}
	// first time running?
	if (this.isFirstRun) {
		// store these values because they will change
		this.lenOrig = this.len;
		this.angOrig = this.ang;
		// add to route
		this.route.addToLength(this.len);
		this.isFirstRun = false;
	}
}


// setSound
// ------------------------------------------------	
Thread.prototype.setSound = function() {
	// my pitch ind (0, 1, 2, 3...)
	this.pitchInd = Math.floor(this.rPitch*(this.m.notes-0.0001));
	// corresponding notes to enter into the search box
	this.arrNoteStr = ["do","re","mi","fa","so","la","ti"];
	// do re mi
	this.pitchStr = this.arrNoteStr[this.pitchInd % this.arrNoteStr.length];
}

// redraw
// ------------------------------------------------	
Thread.prototype.redraw = function() {
	
	// current origin point
	this.xo = this.m.xo;
	this.yo = this.m.yo;

	// weird bug - the first time we run it with the first thread, it breaks
	if (isNaN(this.xp1)) { return; }
	
	// grabbed mode (or on the first osc after being dropped)
	if (this.isGrabbed || this.isFirstOsc) {
		this.xd = this.xg; this.yd = this.yg;
	// oscillating freely mode
	} else {
		this.xd = this.xc; this.yd = this.yc;
	}
	
	if (isNaN(this.xd)) { return; }
	
	// ---------------
	this.dx0 = this.xd-this.xp0; this.dy0 = this.yd-this.yp0;
	this.dx1 = this.xp1-this.xd; this.dy1 = this.yp1-this.yd;
	// distance
	this.dist0 = Math.sqrt(this.dx0*this.dx0 + this.dy0*this.dy0);
	this.dist1 = Math.sqrt(this.dx1*this.dx1 + this.dy1*this.dy1);
	
	this.cv.beginPath();
	this.cv.lineCap = "round";
	this.cv.strokeStyle = this.route.hexCurr; // set to route's color
	this.cv.lineWidth = this.str;
	
	// move to the center pendulum point
	this.dxBez0 = this.rBezier*this.dist0*Math.cos(this.ang)
	this.dyBez0 = this.rBezier*this.dist0*Math.sin(this.ang)			
	// move to the center pendulum point
	this.dxBez1 = this.rBezier*this.dist1*Math.cos(this.ang)
	this.dyBez1 = this.rBezier*this.dist1*Math.sin(this.ang)			
	// move to start point
	this.cv.moveTo(this.xp0+this.xo, this.yp0+this.yo);
	// Draw bezier curve
  this.cv.bezierCurveTo(
    this.xd - this.dxBez0 + this.xo,
    this.yd - this.dyBez0 + this.yo,
    this.xd + this.dxBez1 + this.xo,
    this.yd + this.dyBez1 + this.yo,
    this.xp1 + this.xo,
    this.yp1 + this.yo
  );
	
	// close path
	this.cv.stroke();
	this.cv.closePath();
}

// upd
// ------------------------------------------------	
Thread.prototype.upd = function() {
	// is thread currently grabbed
	if (this.isGrabbed) {
		this.updGrab();
	// is thread currently oscillating
	} else if (this.isOsc) {
		this.updOsc();
	}
	if (this.isVisible) {
		// redraw me
		this.redraw();
	}
}

// updOsc
// ------------------------------------------------	
Thread.prototype.updOsc = function() {
	
	// ease it back to the zero line first
	if (this.isFirstOsc) {
		var ease = 0.8;
		var dxg = this.xg1 - this.xg;
		var dyg = this.yg1 - this.yg;
		//
		this.xg += dxg*ease;
		this.yg += dyg*ease;
		// have we arrived?
		if ((Math.abs(dxg) < 2) && (Math.abs(dyg) < 2)) {
			// initialize
			this.t = 0; this.oscDir = 1;
			this.isFirstOsc = false;
			// which direction it has been going in
			var sx0 = sign(dxg);
			var sx1 = sign(Math.sin(this.ang));
			// reverse the initial oscillation direction if needed
			if (sx0 != sx1) { this.oscDir *= -1; }
		}
	}
	else {
		// increment counter
		this.t += this.freq*this.oscDir;
		//t += 0.5*oscDir;
		// make c oscillate between 0 and 1 with sin 
		var c = Math.sin(this.t);
		// dampen the amplitude
		this.amp *= this.ampDamp;
		//
		this.xc = this.xMid + c*Math.sin(this.ang)*this.amp;
		this.yc = this.yMid - c*Math.cos(this.ang)*this.amp;
		// if amplitude is below mimum, cut it
		if (this.amp < 0.5) {
			this.amp = 0; 
			//switchUpd("off");
			this.isOsc = false;
		}
	}
	
	//this.redraw();
}

// Update mode while grabbed
// ------------------------------------------------	
Thread.prototype.updGrab = function() {
	
	// get current mouse position
	// grabbed by car?
	if (this.carGrab != null) {
		var xu = this.carGrab.xp1; var yu = this.carGrab.yp1;
	// else grabbed by user
	} else {
		var xu = this.m.getUserX(); var yu = this.m.getUserY(); 
	}
	// how far away is it from the line
	var dxu = xu-this.xp0; var dyu = yu-this.yp0;
	// angle
	var ang0 = Math.atan2(dyu,dxu); var ang1 = this.ang-ang0;
	// direct distance 
	var hyp = Math.sqrt(dxu*dxu + dyu*dyu);
	// perpendicular distance
	this.distPerp = hyp*Math.sin(ang1);
	// distance parallel along the line
	var distPara = hyp*Math.cos(ang1);
	// how far as a ratio from 0 to 1 are we on the line
	this.rGrab = lim(distPara/this.len, 0, 1);
	// normalize it to increase to 1 at the halfway point
	if (this.rGrab <= 0.5) { this.rHalf = this.rGrab/0.5; } else { this.rHalf = 1-(this.rGrab-0.5)/0.5; }
	// what distance can we pull the string at this point?
	var distMaxAllow = this.distMax*this.rHalf;
	// set the current stretch strength
	this.rStrength = lim(Math.abs(this.distPerp)/this.distMax, 0, 1);

	// has the user's point pulled too far?
	if (Math.abs(this.distPerp) > distMaxAllow) {
		this.m.dropThread(this);
	} else {
		// that grabbed point is ok, allow it
		this.xg = xu; this.yg = yu;
	}
	//
	this.ctGrab++;
	//this.redraw();	
}

// Get perpendicular distance from user's cursor
// ------------------------------------------------	
Thread.prototype.checkInstantGrab = function() {
	// make sure it's not already grabbed
	if (this.isGrabbed) return;
	// get current mouse position
	var xu = this.m.getUserX(); var yu = this.m.getUserY(); 
	// how far away is it from the line
	var dxu = xu-this.xp0; var dyu = yu-this.yp0;
	// angle
	var ang0 = Math.atan2(dyu,dxu); var ang1 = this.ang-ang0;
	// direct distance 
	var hyp = Math.sqrt(dxu*dxu + dyu*dyu);
	// perpendicular distance
	this.distPerp = hyp*Math.sin(ang1);
	// distance parallel along the line
	var distPara = hyp*Math.cos(ang1);
	// how far as a ratio from 0 to 1 are we on the line
	this.rGrab = distPara/this.len;
	// are we close enough to warrant an instant grab?
	if ((Math.abs(this.distPerp) < this.distInstantPerp) && (this.rGrab > 0) && (this.rGrab < 1)) {
		this.m.grabThread(this, xu, yu, true, null);
	}
}

// Update mode while sound is on
// ------------------------------------------------	
Thread.prototype.stopNote = function() {
	this.auObj.pause();
}

// brush over this string in one frame
// ------------------------------------------------	
Thread.prototype.pluck = function(xp, yp, byUser, car) {
	// store as initial position
	this.xgi = this.xg = xp; this.ygi = this.yg = yp;
	// if it was triggered by a train
	if (byUser) {
		// user's current mouse position
		var xu = this.m.getUserX(); var yu = this.m.getUserY();
		var spd = this.m.getSpdAvg()
	} else {
		var xu = car.getX(); var yu = car.getY();
		var spd = 0.1; // just make speed a midpoint
	}
	// how far away is it from the line
	var dxu = xu-this.xp0; var dyu = yu-this.yp0;			
	// use our current xg and yg, that's where the user intersected the string
	var dxg = this.xgi-this.xp0; var dyg = this.ygi-this.yp0;
	var hyp = Math.sqrt(dxu*dxu + dyu*dyu);
	// as ratio 0 to 1
	this.rGrab = lim(hyp/this.len, 0, 1);
	// normalize it to increase to 1 at the halfway point
	if (this.rGrab <= 0.5) { this.rHalf = this.rGrab/0.5; } else { this.rHalf = 1-(this.rGrab-0.5)/0.5; }					
	var distMaxAllow = this.distMax*this.rHalf;
	// how far do we want it to pull? Base on user's speed
	this.distPerp = (1-spd)*distMaxAllow;
	// set new strength
	this.rStrength = lim(Math.abs(this.distPerp)/this.distMax, 0, 1);
	// less than minimum? (always vibrate string a little bit)
	if (this.distPerp < this.ampPxMin) this.distPerp = this.ampPxMin;
	// set it
	this.xg = this.xgi + this.distPerp*Math.cos(this.angPerp);
	this.yg = this.ygi + this.distPerp*Math.sin(this.angPerp);
	
	
	// ------------------
	// reset me to the center point
	this.xc = this.xMid; this.yc = this.yMid;
	// already oscillating?
	if (this.isOsc) {
		// already oscillating - boost the oscillation strength just a bit
		this.rStrength = lim((this.rStrength*0.5) + (this.amp/this.ampMax), 0, 1);
		// set new amplitude
		this.amp = this.rStrength*this.ampMax;				
	// not oscillating - start oscillating now
	} else {
		// store current amplitude based on strength
		this.amp = this.rStrength*this.ampMax;
		// start oscillating
		this.startOsc();
	}
	var vol;
	// calculate volume
	if (byUser) {
		vol = lerp(this.vol0, this.vol1, this.rStrength);
	// it's a car
	} else {
		vol = lerp(this.vol0Car, this.vol1Car, this.rStrength);			
	}
	// set pan based on x position
	var panRat = lerp(this.pan0, this.pan1, lim(xu/this.m.width, 0, 1));
	
	// play note
	this.playNote(vol, panRat);
}

// grab this string and hold it
// ------------------------------------------------	
Thread.prototype.grab = function(xp, yp, byUser, car) {
	if (byUser) {
		//
		this.carGrab = null;
	} else {
		// store car that is grabbing me, and link me to the car
		this.carGrab = car; this.carGrab.thrGrab = this;
		// grabbed by car
		//console.log(this.route.ind + ", " + this.ind + ": grabbed by car : " + car.ind);
	}
	// store as initial position
	this.xgi = this.xg = xp; this.ygi = this.yg = yp;
	// start counter			
	this.ctGrab = 0;
	this.isGrabbed = true;
	// update once now
	this.updGrab();	
}

// drop
// ------------------------------------------------	
Thread.prototype.drop = function() {
	//
	this.isGrabbed = false;
	// reset me
	this.xc = this.xMid; this.yc = this.yMid;
	// store current amplitude based on strength
	this.amp = this.rStrength*this.ampMax;
	// play note - is it by a car?
	if (this.carGrab != null) {
		var vol = lerp(this.vol0Car, this.vol1Car, this.rStrength);
		this.carGrab.thrGrab = null;
		this.carGrab = null;
	// else use normal user volume limits
	} else {
		var vol = lerp(this.vol0, this.vol1, this.rStrength);
	}
	// set pan based on x position
	var posRat = lim((this.xg+this.xo)/this.m.width, 0, 1);
	// set panning ratio -1 to 1
	var pan = lerp(this.pan0, this.pan1, posRat);
	//
	this.playNote(vol, pan);
	// start oscillation
	this.startOsc();	
}

// startOsc
// ------------------------------------------------	
Thread.prototype.startOsc = function() {
	// where does the grabbed point want to return to
	this.xg1 = this.xp0 + this.rGrab*this.dx;
	this.yg1 = this.yp0 + this.rGrab*this.dy;			
	// store start position
	this.xg0 = this.xg; this.yg0 = this.yg;			
	// counter
	t = 0;
	// we are on our first cycle of oscillation
	this.isFirstOsc = this.isOsc = true;			
}

// playNote
// ------------------------------------------------	
Thread.prototype.playNote = function(vol, pan) {
	// normalize pan to -1 to 1
	playSound(this.pitchInd, vol, pan);
}

// setStretch
// ------------------------------------------------	
Thread.prototype.setStretch = function(r) {
	var hyp = this.r*this.distMax;
	this.xc = this.xMid + this.hyp*Math.cos(this.angPerp);
	this.yc = this.yMid + this.hyp*Math.sin(this.angPerp);
}

// ------------------------------------------------	
Thread.prototype.routeStartEnter = function() {
	// initially not visible
	this.isVisible = false;
}

// carMoved
// ------------------------------------------------	
Thread.prototype.carMoved = function() {
	this.updPos();
	this.setSound();
}
// carStart
// ------------------------------------------------	
Thread.prototype.carStart = function(cr) {
	
	// i am being drawn
	this.car = cr;
	this.isVisible = true;
	this.isMidDraw = true;
	// update position now
	this.updPos();
	// are we mid oscillation
	if (this.isOsc) {
		// stop the oscillation
	}
	// have I figured out which threads I intersect with?
	if (!this.didInitIntersect) {
		this.initIntersect();
	}
}

// initIntersect
// ------------------------------------------------	
Thread.prototype.initIntersect = function() {
	this.didInitIntersect = true;
	// 
	// go through routes
	for (var r = 0; r < this.m.arrRoutes.length; r++) {
		rt = this.m.arrRoutes[r];
		// don't check the route that I'm on, no need
		if (this.route.ind == rt.ind) { continue; }
		// else continue...
		var xi; var yi; var th;
		// go through threads
		for (var i = 0; i < rt.arrThreads.length; i++) {
			th = rt.arrThreads[i];
			// find line intersection
			var pt = lineIntersect(this.pto0, this.pto1, th.pto0, th.pto1);
			// did we get a point?
			if (pt == null) continue;
			// else what is our intersection
			xi = pt.x; yi = pt.y;
			// if it's not already grabbed, grab it
			if ((!isNaN(xi)) && (!isNaN(yi))) {
				// add that thread
				this.arrIntersect.push(th);
			}			
		}
	}	
}

// carDone
// ------------------------------------------------	
Thread.prototype.carDone = function(cr) {
	this.car = null;
	this.isMidDraw = false;
	// we're finished drawing, set position to the original end point
	this.xp1 = this.xpo1; this.yp1 = this.ypo1;
	this.xp0 = this.xpo0; this.yp0 = this.ypo0;
	// update pos one last time
	this.updPos();
	this.setSound();
}

// temp
Thread.prototype.setMarked = function() {
	this.hex = "#000000";
}