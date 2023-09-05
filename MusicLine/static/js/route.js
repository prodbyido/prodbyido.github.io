// class:	Route
// ------------------------------------------------	
var Route = function(indPm, idColorPm, idNamePm, hexPm, tDurPm, arrPosPm) {
	this.m = m;
	// index number
	this.ind = indPm;
	// my base hex value
	this.hex = hexPm;
	// duration in minutes to travel my length
	this.tDurMin = tDurPm;
	this.tDurSec = this.tDurMin*60;
	// my current hex value
	this.hexCurr = this.hex;
	// store them as rgba color values for lerp
	this.col = hex2rgb(this.hex);
	// id name "red" "grey" etc
	this.idColor = idColorPm;
	this.idName = idNamePm;
	this.arrPos = arrPosPm;
	// array of cars
	this.arrCars = new Array();
	// counter of cars
	this.ctCars = 0;
	// array of my threads
	this.arrThreads = new Array();
	this.t1;
	// how long do I stay alive for after fully drawn - when at its slowest, and fastest
	this.tAlive0 = 4.5; this.tAlive1 = 2.5; this.tAlive = this.tAlive0;
	// same ratio for fade out time
	this.tFade0 = 18; this.tFade1 = 7.0; this.tFade = this.tFade0;
	// my total length
	this.len = 0;
	//
	this.isMidDraw = this.isExiting = false;
}

// init after we have all of our threads
Route.prototype.init = function() {
	// calculate the speed in px/sec for my route
	this.pxPerSec = this.len/this.tDurSec;
}

// update while dragging
Route.prototype.upd = function() {
	if (!this.isOn) return;
	// current time
	this.t1 = (new Date()).getTime()/1000;
	// are we exiting?
	if (this.isExiting) {
		this.updExit();
	} else if (this.isMidDraw) {
		// jsut let it keep drawing
	} else {
		// we're stable, see how long we've been here
		var elap = this.t1-this.tLinger0;
		// time to exit? and make sure we have enough routes alive
		if ((elap > this.tAlive) && (this.m.rtVis > this.m.rtVisMin)) this.startExit();
	}
	// update all threads
	for (var i = 0; i < this.arrThreads.length; i++) {
		this.arrThreads[i].upd();
	}
	var cr;
	// update all cars
	for (var i = 0; i < this.arrCars.length; i++) {
		// if that car is alive
		cr = this.arrCars[i];
		// update and redraw car
		cr.redraw(); cr.upd();
	}
}

// update during exit fadeout
Route.prototype.updExit = function() {
	var elap = this.t1-this.tExit;
	// done with fade?
	if (elap >= this.tFade) {
		this.exitDone();
	} else {
		// make it drop to this fade point very quickly - so 0.6 would mean it's 40% opacity
		var rLinger = 0.71;
		// in the first percent of the wait - in this many seconds jump to that fade
		var tLeap = 0.2;
		if (elap < tLeap) {
			// ratio of fade
			var rFade = elap/tLeap*rLinger;
		} else {
			var rFade = rLinger + (1-rLinger)*(elap-tLeap)/(this.tFade-tLeap);
		}
		// fade out to the background color
		this.colCurr = lerpColor(this.col, this.m.colBg, rFade);
		this.hexCurr = getColor(this.colCurr);
	}
}

// update while dragging
Route.prototype.addThread = function(thr) {
	this.arrThreads.push(thr);
}

// update while dragging
Route.prototype.addCar = function(isFwPm) {
	var c = new Car(this.m.cv1, this.hex, this.ctCars, isFwPm, this);
	this.ctCars++;
	this.arrCars.push(c);
}

// enter
Route.prototype.startEnter = function(isFwPm) {
	// tell all threads to run their enter init
	for (var i = 0; i < this.arrThreads.length; i++) {
		this.arrThreads[i].routeStartEnter();
	}
	this.isOn = true;
	this.isMidDraw = true;
	// reset to base hex
	this.hexCurr = this.hex;
	// bump counter of routes
	this.m.rtVis++;
	// add a car
	this.addCar(isFwPm);
}
// exit
Route.prototype.startExit = function() {
	this.tFade = lerp(this.tFade0, this.tFade1, this.m.ffRat);
	//console.log("will fade out for: " + this.tFade);	
	// store timer
	this.tExit = (new Date()).getTime()/1000;
	this.isExiting = true;
	// go through my threads and drop anyone who is grabbed
	for (var i = 0; i < this.arrThreads.length; i++) {
		if (this.arrThreads[i].carGrab != null) {
			this.arrThreads[i].drop();
		}
	}
	//
	this.m.rtVis--;
}
// exitDone
Route.prototype.exitDone = function() {
	this.isExiting = false;
	this.isOn = false;
}
// remove the first car which reached end
Route.prototype.carAtEnd = function() {
	// remove it from thea rray
	this.arrCars.shift();
	//
	this.isMidDraw = false;
	// store this as the start time for when we started the fade
	this.tLinger0 = (new Date()).getTime()/1000;
	// store how long I want to linger for
	this.tAlive = lerp(this.tAlive0, this.tAlive1, this.m.ffRat);
	//console.log("will linger for: " + this.tAlive);
}
// add to this length at init
Route.prototype.addToLength = function(n) {
	this.len += n;
}