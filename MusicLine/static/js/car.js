// class:	Car
// ------------------------------------------------	
var Car = function(cvPm, hexPm, indPm, isFwPm, routePm) {
	this.m = m;
	// index number
	this.ind = indPm;
	this.cv = cvPm;	
	// current origin point
	this.xo = this.m.xo;
	this.yo = this.m.yo;
	// radius 
	this.rad = 3;
	this.hex = hexPm;
	// which route am I connected to
	this.route = routePm;
	this.routeNum = this.route.ind;
	this.isDead = false;
	// as point objects
	this.pt0 = new Point();
	this.pt1 = new Point();
	// what speed (px/frame) can a car grab a thread
	this.spdGrab = 4;
	// am I going forwards? true
	this.isFw = isFwPm;
	// first run
	this.isFirstRun = true;
	// which thread do we want to start on - backwards?
	this.indThr = this.indThrStart = this.isFw ? 0 : this.route.arrThreads.length - 1;
	// place me on a thread thread am I currently on
	this.placeOnThread(this.route.arrThreads[this.indThrStart]);	
}

// redraw me
Car.prototype.redraw = function() {
	// origin point from canvas
	this.xo = this.m.xo;
	this.yo = this.m.yo;
	//
	this.cv.beginPath();
	this.cv.fillStyle = this.hex;
	this.cv.arc(this.xp1+this.xo, this.yp1+this.yo, this.rad, 0, Math.PI*2, false);
	this.cv.closePath();
	this.cv.fill();
}

// begin
Car.prototype.placeOnThread = function(thr) {
	// are we initializing it
	if (thr.ind == this.indThrStart) {
		// set my speed
		// increment counter
		this.m.carCt++;
		// my current speed magnitude (px per frame)
		this.spdBase = 0.005;
		// calculate how many pixels to go in each second
		// how long does route take to complete?
		this.pxPerSec = thr.route.pxPerSec;
	}
	
	this.thread = thr;
	thr.carStart(this);
	// figure out its angle - reverse it if going backwards
	this.ang = this.isFw ? this.thread.angOrig : this.thread.angOrig + Math.PI;
	// initialize position
	this.xpo0 = this.xp0 = this.xp1 = this.isFw ? this.thread.xpo0 : this.thread.xpo1;
	this.ypo0 = this.yp0 = this.yp1 = this.isFw ? this.thread.ypo0 : this.thread.ypo1;
	// save my sin and co-sin so we don't always recalculate
	this.cosAng = Math.cos(this.ang);
	this.sinAng = Math.sin(this.ang);
}


// update while dragging
Car.prototype.upd = function() {

	// how far we want to travel in this frame
	var hyp = this.pxPerSec*this.m.ff;
	// store that as my speed, how many px i'm going in this frame
	this.spd = hyp;
	// figure out my dx and dy to go at the right speed
	this.dx = this.cosAng*hyp;
	this.dy = this.sinAng*hyp;
	// update my position
	var xp1 = this.xp0 + this.dx;
	var yp1 = this.yp0 + this.dy;
	//
	var dxs = xp1-this.xpo0;
	var dys = yp1-this.ypo0;
	// distance from source point
	this.distThr = Math.sqrt(dxs*dxs+dys*dys);
	// how far along are we as ratio 0 to 1
	this.thrRat = this.distThr/this.thread.lenOrig;	
	// does that put us over 1?
	if (this.thrRat > 1) {
		// go to next thread
		if ((this.isFw && (this.indThr >= this.route.arrThreads.length-1)) || 
			(!this.isFw && (this.indThr <= 0))) {
			// no more threads, we're done
			if (!this.isDead) this.endOfRoute();
			// exit now
			return;
		} else {
			if (this.isFw) { this.indThr++; } else { this.indThr--; }
			// trigger completion from previous one
			this.thread.carDone(this);
			// add it to the new one
			this.placeOnThread(this.route.arrThreads[this.indThr]);
			// and exit now
			return;
		}
	} else {
		// 
		this.xp1 = xp1;
		this.yp1 = yp1;
		// update point objects
		this.pt0.x = this.xp0; this.pt0.y = this.yp0;
		this.pt1.x = this.xp1; this.pt1.y = this.yp1;
		// store previous position
		this.xp0 = this.xp1;
		this.yp0 = this.yp1;
		// tell my thread I moved
		this.thread.carMoved();
	}
	
	// if this is the first time running it, exit now - don't check threads
	if (this.isFirstRun) { this.isFirstRun = false; return; }
	
	// just go through the threads that we know this thread intersects with
	for (var i = 0; i < this.thread.arrIntersect.length; i++) {
		th = this.thread.arrIntersect[i];
		// don't check this route if it's not on - and if it's not the one i'm on
		if ((!th.route.isOn) || (!th.isVisible) || (th.route.isExiting) || (th.len < this.thLenIgnore) || isNaN(th.len)) { continue; }
		// find line intersection
		var pt = lineIntersect(this.pt0, this.pt1, th.pt0, th.pt1);
		// did we get a point?
		if (pt == null) continue;
		//
		xi = pt.x; yi = pt.y;
		// if it's not already grabbed, grab it
		if ((!th.isGrabbed) && (!isNaN(xi)) && (!isNaN(yi))) {
			// am I am going too fast, brush over it
			if (this.spd > this.spdGrab) {
				this.m.pluckThread(th, xi, yi, false, this);
			// else non-express, can grab
			} else {
				this.m.grabThread(th, xi, yi, false, this);
			}
		}
	}	
}

// update while dragging
Car.prototype.endOfRoute = function() {
	this.isDead = true;
	// am i still holding a thread? drop it
	if (this.thrGrab != null) {
		this.thrGrab.drop();
	}
	this.route.carAtEnd();
}
Car.prototype.getX = function() {
	return this.xp1;
}
Car.prototype.getY = function() {
	return this.yp1;
}


