// array of route data
// 0: hex value
// 1: string name for route
// 2: readable string name
// 3: int: how many minutes does the trip take
// 4: coordinates from SVG file
var arrData = [
	// this is the fs shuttle
	["#2AA85C", "fs-loc-green", "A Franklin Ave shuttle", 6,
		[[649.484,882.398],[607.484,840.398],[642.427,805.456],[642.428,805.456],[642.427,738]]
		// to franklin fulton
		// to prospect park
	],
	// this is the grand central shuttle - says 1 minute but make it more
	["#2AA85C", "sh-loc-mid-green", "A Grand Central shuttle", 4,
		[[167,430.5],[283,430.5]]
		// to grand central
		// to times square
	],
	["#2AA85C", "r-loc-green", "An R train", 56,
		// vector goes from bottom to top
		[[522.427,1048.641],[522.427,790.709],[508.728,777.01],[240.5,777.01],[240.5,473.764],[152,473.764],[152,366.514],[436,366.514],[436,256.01]]
		// to 71/continental ave or 36th
		// to 95th st
	],
	["#DB2C46", "q-loc-red", "A Q train", 60,
		// vector goes from bottom to top
		[[678.684,1043.693],[734.118,988.259],[369.369,623.51],[250.5,623.51],[250.5,463.764],[162,463.764],[162,371.502]]
		// to ditmars
		// to stillwell
	],
	["#FDB42A", "n-exp-yello", "An N train", 60,
		// vector goes from bottom to top
		[[674.471,1023.406],[634.074,983.01],[527.427,983.01],[527.427,788.639],[367.298,628.51],[245.5,628.51],[245.5,468.764],[157,468.764],[157,371.502 ]]
		// to ditmars
		// to stillwell
	],
	// Changed now to split, estimated
	["#AAEDFE", "m-exp-cyan", "An M train", 70,
		// vector goes bottom to top
		[[682.219,1047.229],[741.188,988.259],[524.94,772.01],[324.046,772.01],[324.046,581.013],[615.75,581.013],[681.006,515.756],[681.006,381.511 ]]
		// to metropolitan ave
		// to 71 continental
	],
	["#BCB59B", "l-gray", "An L train", 37,
		// vector goes from left to right
		[[82,513.51],[721,513.51],[721,621.51],[839.995,740.505],[839.995,808.73]]
		// to rockaway
		// to 8th ave
	],
	["#8A8785", "j-exp-gray", "A J train", 53,
		// vector goes lower left to upper right
		[[329.046,733],[329.046,586.013],[734.145,586.013],[791.006,529.151],[791.006,479.654],[980.107,290.553]]
		// to parsons-archer
		// to broad street
	],
	// Current G only takes 34 min but used to go further into queens - added another 15 min
	["#8BD898", "g-loc-teal", "A G train", 49,
		// vector goes from bottom to top
		[[631.405,930.845],[608.571,908.01],[469.25,908.01],[469.25,831.51],[528.929,831.51],[572.427,788.012],[572.427,680.928],[516.5,625],[516.5,307.01],[842,307.01]]
		// to court sq
		// to church ave
	],
	["#F2397C", "f-exp-pink", "An F train", 89,
		// goes from bottom to top
		[[675.148,1040.158],[704.398,1010.908],[606.5,913.01],[464.25,913.01],[464.25,697.193],[369,601.942],[369,561.013],[215.5,561.013],[215.5,396.514],[511.5,396.514],[511.5,302.01],[875,302.01],[980.107,196.903]]
		// to 179th st
		// to stillwell ave
	],
	// On vignelli it goes from forest hills queens to around world trade center area
	["#FD521F", "e-loc-orange", "An E train", 36,
		// vector goes from bottom left to to top right
		[[283.25,782.01],[235.5,782.01],[235.5,478.764],[147,478.764],[147,361.514],[521.5,361.514],[521.5,312.01],[842,312.01]]
		// to parsons-archer
		// to world trade center
	],
	// E on Vignelli is going all the way from queens to rockaway pk. Estimated 46+44 min = 90
	["#AAEDFE", "e-exp-cyan", "An E train", 90,
		// goes from bottom to top
		[[883.985,771.985],[986.72,669.251],[854.774,537.306],[795.57,596.51],[716,596.51],[716,658.58],[533.07,841.51],[454.25,841.51],[454.25,729.604],[432.156,707.51],[195.492,707.51],[195.492,533.51],[72,533.51],[72,391.514],[506.5,391.514],[506.5,297.01],[872.93,297.01],[976.572,193.367 ]]
		// to parsons-archer
		// to world trade center
	],
	["#FD521F", "d-exp-orange", "A D train", 91,
		// vector goes from top to bottom
		[[331.997,9.01],[297.497,9.01],[297.497,187.513],[82,187.513],[82,381.514],[210.5,381.514],[210.5,566.013],[326,566.013],[748.252,988.266],[685.754,1050.764 ]]
		// to stillwell st
		// to 205th st
	],
	["#2AA85C", "c-loc-green", "A C train", 28,
		// vector goes from top to bottom
		[[292.497,93.676],[292.497,182.513],[67,182.513],[67,538.51],[190.492,538.51],[190.492,662.087]]
		// to euclid ave
		// to 168th
	],
	["#8A8785", "b-exp-gray", "A B train", 68,
		// vector goes from top to bottom
		[[72,152.993],[72,386.514],[205.5,386.514],[205.5,571.013],[323.942,571.013],[517.428,764.498],[517.427,948.01],[535.434,948.01],[639.594,1052.17 ]]
		// brighton beach
		// to 145th
	],
	["#F2397C", "a-loc-pink", "An A local train", 32,
		// goes from top to bottom
		[[62,167.993],[62,543.51],[185.492,543.51],[185.492,662.087]]
		// to lefferts/mott
		// to 207th st
	],
	//
	["#3076EB", "a-exp-blue", "An A express train", 74,
		// goes from bottom to top
		[[988.603,396.408],[793.5,591.51],[711,591.51],[711,656.51],[531,836.51],[459.25,836.51],[459.25,727.533],[434.23,702.514],[200.492,702.51],[200.492,528.51],[77,528.51],[77,82.01 ]]
		// to 207th st
		// to lefferts/mott
	],
	// no longer active, no way to estimate - 45 seems fine
	["#3076EB", "k-loc-dead-blue", "A K train", 45,
		// vector goes from left to right
		[[220.5,401.514],[220.5,556.013],[323.07,556.013],[343.07,576.013],[773.09,576.013 ]]
		// run it every three minutes from 1am to 2am
		// run it every three minutes from 1am to 2am
	],
	["#77D0EC", "8-loc-dead-blue", "An 8 train", 23,
		[[363,201.01],[363,60.01],[421,60.01]]
		// run it every three minutes from 12am to 1am
		// run it every three minutes from 12am to 1am
	],
	["#F2BBA5", "7-loc-pink", "A 7 train", 38,
		// vector goes left to right
		[[167,435.5],[441,435.5],[441,347.01],[656,347.01],[852.5,150.51]]
		// to main street flushing
		// to times square queens
	],
	// trip was around 56 minutes, need to add 10 min for more stops
	["#FDB42A", "6-exp-yellow", "A 6 train", 66,
		// vector goes top to bottom
		[[594.833,28.51],[484.334,139.01],[484.334,216.01],[298.25,216.01],[298.25,874.01]]
		// 6 to brooklyn bridge
		// 6 and 6-exp - to pelham and 177th st
	],
	["#BCB59B", "5-exp-gray", "A 5 train", 54,
		// vector goes from top to bottom
		[[502,40.01],[431,111.01],[431,211.01],[293.25,211.01],[293.25,802.51],[520.084,802.51],[593.328,875.752],[718.027,751.053]]
		// to 180th St/Flatbush AVe
		// to Dyre Avenue
	],
	["#F2397C", "4-exp-pink", "A 4 train", 75,
		// vector goes from top to bottom
		[[257.5,96.51],[257.5,143.51],[288.25,174.26],[288.25,807.51],[518.014,807.51],[593.328,882.823],[670.535,805.615],[794.465,929.545 ]]
		// to utica/new lots
		// to woodlawn
	],
	["#77D0EC", "3-exp-blue", "A 3 train", 64,
		// goes from top to bottom
		[[187,193.01],[187,297.51],[17.5,297.51],[17.5,423.012],[137,423.012],[137,672.01],[364,672.01],[364,757.01],[404.097,757.01],[444.598,797.51],[522.156,797.51],[593.328,868.682],[667,795.01],[798,926.01]]
		// to new lots
		// to 148th/lennox
	],
	["#F3747E", "2-exp-pink", "A 2 train", 94.5,
		// goes from top to bottom
		[[426,13.51],[426,206.01],[192,206.01],[192,302.51],[22.5,302.51],[22.5,418.012],[142,418.012],[142,667.01],[369,667.01],[369,752.01],[406.166,752.01],[446.667,792.51],[524.227,792.51],[593.328,861.611],[823.845,631.095 ]]
		// to flatbush ave
		// to east 241st st
	],
	["#FD521F", "1-loc-orange", "A 1 train", 53,
		// goes from top to bottom
		[[136.497,13.51],[136.497,148.012],[12.5,148.012],[12.5,428.012],[132,428.012],[132,686.512],[282.499,837.011 ]]
		// To South Ferry
		// To 24nd St broadway
	]
];

// class:	Main
// ------------------------------------------------	
var Main = function() {

	// ----------------
	// variables
	// ----------------
	// show framerate for testing?
	this.showFR = false;
	// array of all threads, routes
	this.arrThreads = new Array();
	this.arrRoutes = new Array();
	// car counter
	this.carCt = 0;
	// how many strings grabbed
	this.grabbed = 0;
	//
	this.isMouseDown = false;
	// is the sound done loading?
	this.isAudioLd = false;
	// min and max speed, when to cap it - pixels per millisecond
	this.spdMin = 70; this.spdMax = 1500;
	// min max speed as a ratio
	this.rSpd = 0;
	// average speed over the past few frames
	this.rSpdAvg = 0;
	// how many frames to make average
	this.fAvg = 5;
	// frame rate averages
	this.frCurr = this.frAvg = this.frAvgStore = frameRate;
	this.frCt = 0;
	// how often to make average for framerate
	this.frAvgCt = 20;
	// user speed low limit where we can grab and hold string (as ratio)
	this.rSpdGrab = 0.4;
	// mouse position
	this.xp0; this.yp0;
	this.xp1; this.yp1;
	// store the origin for our world relative to canvas
	this.xo = this.yo = 0;
	// as point objects
	this.pt0 = new Point(); this.pt1 = new Point();
	// width of the bounding box to use as reference
	this.wBox = 1013; this.hBox = 1074;
	// how many total notes?
	this.notes = notes;
	// limit audio channels for Flash - manage manually, will stop previous playing
	// notes if we go over this - helps performance too
	this.chanLimit = 11;
	// stores how many notes currently playing
	this.chanInUse = 0;
	// array of channel sounds - [0] is what time it started playing, [1] the sound object
	this.arrChan = new Array(this.chanLimit);
	// timer variables
	this.t1 = this.t0 = this.tSpawn = (new Date()).getTime()/1000; 
	// polling interval for spawn (seconds)
	this.tPoll = 2.2;
	// minimum minute threshhold - if the train is within this many minutes of current time,
	// we let it slide and launch it - otherwise just wait
	this.tErrorMax = 5;
	// hour offset from GMT for New York
	this.hZoneOff = -4;
	// how many routes are currently visible
	this.rtVis = 0;
	// how many routes to keep visible minimum
	this.rtVisMin = 3;
	// how many routes to show maximum - lower it as we go faster
	this.rtVisMax0 = 8; this.rtVisMax1 = 5; this.rtVisMax = this.rtVisMax0;
	// default to non-night mode (time will check immediately)
	this.isNight = null;
	// background color for night mode and day mode
	this.hexBgNight = "#070707"; this.hexBgDay = "#FFFFFF";
	// what time do we switch to day mode? e.g. 7:00am = 420, 6:00pm = 1080
	this.tDay0 = 420; this.tDay1 = 1080;
	// initialize seconds counter
	this.tSec = null;
	this.strCaption = "";
	// maintain the current fake time in seconds - initialize to current time
	this.tWorldInit = this.tWorld = this.getTrueTime();
	// figure out my halfway point, 12 hours around
	this.tWorldHalf = ((this.tWorldInit/3600 + 12) % 24)*3600;
	// ff stores how many seconds to go in each frame. ff0 and ff1 are the range
	this.ff0 = 0.33; this.ff1 = 29;
	// stores where we are in the speed ratio
	this.ffRat = 0;
	// how fast to accelerate
	this.ffAcc = 0.0041;
	this.ff = this.ff0;
	// keep place in the master schedule array
	this.indSchedLast = 0;
	// how many total seconds have we travelled in the current loop
	this.tWorldAccum = 0;
	//
	this.isFirstRun = true;
	// ignore threads under this length
	this.thLenIgnore = 15;
	// initialize
	this.init();
}

// init
// ------------------------------------------------	
Main.prototype.init = function() {
	
	// Create Web Audio Context, future proofed for future browsers
	contextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);
	
	if (contextClass) {
		audioContext = new contextClass();
		audioContext.suspend()
	} else {
		// Web Audio API not available. Ask user to use a supported browser.
	}

	// create canvas
	var cvo1 = document.getElementById("cv-threads");
	var cv1 = cvo1.getContext("2d");
	this.cv1 = cv1; this.cvo1 = cvo1;
	// about link
	this.elmAbout = document.getElementById("about");
	this.elmStatus = document.getElementById("status");
	this.elmLoader = document.getElementById("loader");
	// initialize timer
	this.t0 = (new Date()).getTime()/1000;
	// update time once now
	this.updTime();
}

// build
// ------------------------------------------------	
Main.prototype.build = function() {
	this.setOrigin();
	var segs, arrCoords, str, hex, thrCt;
	var xm0, xm1, ym0, ym1;
	var idRoute, arrRoutePos, arrRouteTime, tDuration;
	var idLetter, idColor;
	// go through each color layer - red, pink, green...
	for (var i = 0; i < arrData.length; i++) {
		// stroke size value
		str = 3.5;
		hex = arrData[i][0];
		idColor = arrData[i][1];
		idName = arrData[i][2];
		tDuration = arrData[i][3];
		// how many lines sequences do we have in this color?
		arrRoutePos = arrData[i][4];
		thrCt = 0;
		// make route object
		var rt = new Route(i, idColor, idName, hex, tDuration, arrRoutePos);
		this.arrRoutes.push(rt);
		// go through this one's coordinates
		for (var j = 0; j < arrRoutePos.length-1; j++) {
			xm0 = arrRoutePos[j][0]; ym0 = arrRoutePos[j][1];
			xm1 = arrRoutePos[j+1][0]; ym1 = arrRoutePos[j+1][1];
			// create new thread
			var thr = new Thread(xm0, ym0, xm1, ym1, str, hex, thrCt, rt, this.cv1);
			// add my thread to route list
			rt.addThread(thr);
			// add it to big list of threads
			this.arrThreads.push(thr);
			thrCt++;
		}
		// now we have all threads, init the route's speed
		rt.init();
	}
	// store how many routes we have
	this.routes = this.arrRoutes.length;
	// update our bounding box
	this.updBounds();
}

// setOrigin
// ------------------------------------------------	
Main.prototype.setOrigin = function() {
	// center position on canvas
	var xCen = this.width*0.5;
	var yCen = this.height*0.5;
	//var yCen = this.height*0.3;
	// where to start and treat as our 0,0
	this.xo = xCen-this.wBox/2;
	this.yo = yCen-this.hBox/2;
}

// doneLoading
// ------------------------------------------------	
Main.prototype.doneLoading = function() {
	//
	this.isAudioLd = true;
	// hide the "loading audio text"
	this.elmLoader.style.display = 'none';
}

// begin
// ------------------------------------------------	
Main.prototype.begin = function() {
	// build
	this.build();
	// store current mouse pos
	this.xp0 = this.getUserX(); this.yp0 = this.getUserY();
}

// init
// ------------------------------------------------	
Main.prototype.rsize = function() {
	// make the canvas objects match window size
	this.width = this.cvo1.width = window.innerWidth;
	this.height = this.cvo1.height = window.innerHeight;
	// move the about ? box
	this.elmAbout.style.left = (this.width - 35) + "px";
	this.elmAbout.style.top = (this.height - 32) + "px";
	// move the status box
	this.elmStatus.style.left = "20px";
	this.elmStatus.style.top = (this.height - 35) + "px";
	// move the loader box
	this.elmLoader.style.left = (this.width - 160) + "px";
	this.elmLoader.style.top = (this.height - 28) + "px";
	// re-figure out the origin point
	this.setOrigin();
	// update our bounding box
	this.updBounds();	
}

// mouseDown
// ------------------------------------------------	
Main.prototype.mouseDown = function() {
	this.isMouseDown = true;
	// check instant grab - in case they pressed right on top of a thread
	this.checkInstantGrab();	
}

// mouseUpPlay
// ------------------------------------------------	
Main.prototype.mouseUp = function() {
	// stop updating
	this.isMouseDown = false;
	// if we currently have one
	if (this.isGrabbing()) {
		this.dropAll();
	}
}

// check instant grab if they clicked right on it
Main.prototype.checkInstantGrab = function() {
	var rt;
	//
	for (var r = 0; r < this.arrRoutes.length; r++) {

		rt = this.arrRoutes[r];
		// don't check this route if it's not on, or fading out
		if (!rt.isOn || rt.isExiting) { continue; }		
		// else continue...
		var xi; var yi; var th;
		// go through threads
		for (var i = 0; i < rt.arrThreads.length; i++) {
			th = rt.arrThreads[i];
			// if that thread is not on, it will skip it
			//if (!th.isVisible) { continue; }
			// don't check this route if it's not on - and if it's not the one i'm on
			if ((!th.route.isOn) || (!th.isVisible) || (th.route.isExiting) || (th.len < this.thLenIgnore) || isNaN(th.len)) { continue; }
			// else check it
			th.checkInstantGrab();
		}
	}}

// Main update loop every frame
// ------------------------------------------------	
Main.prototype.upd = function() {
	// update time
	this.updTime();
	// are we at a new minute? update to next minute in schedule
	if ((this.tWorldMin0 != this.tWorldMin) || this.isFirstRun) this.updSched();
	// add some margin around the edges to redraw when they are oscillating
	var xm = 50; var ym = 30;
	// clear big rectangle to redraw
	this.cv1.clearRect(this.xb0-xm, this.yb0-ym, (this.xb1-this.xb0)+xm*2, (this.yb1-this.yb0)+ym*2);
	// composite mode
	this.cv1.globalCompositeOperation = this.isNight ? "lighter" : "multiply";
	// update position
	this.updPos();
	// update play mode or normal mode?
	if (this.isMouseDown) { this.updMouseDown(); } else { this.updNorm(); }
	// update framerate counter?
	if (this.showFR) this.updFR();
	// go update all routes
	this.updRoutes();
	// update the lower left status text
	this.updStatus();
	// store current time
	this.t0 = this.t1;
	// 
	if (this.isFirstRun) this.isFirstRun = false;
}

// updRoutes
// ------------------------------------------------	
Main.prototype.updStatus = function() {
	var str;
	// are we loading audio?
	if (!this.isAudioLd) {
		var perc = Math.round(indNoteLd/notes*100);
		// str = "Loading sound ("+ perc + "%)";
		//str = "Loading sound ...";
		//this.elmLoader.innerHTML = "<span class=\"loading\">" + str + "</span>";
	}
		
	// new second?
	var hrs = this.tWorldHrs % 12; if (hrs == 0) hrs = 12;
	var suf = this.tWorldHrs >= 12 ? "pm" : "am";
	// alternate suffix based on minute
	//var col = (this.tWorldSec % 2 == 0) ? ":" : " ";
	var minPre = this.tWorldMin < 10 ? "0" : "";
	var secPre = this.tWorldSec < 10 ? "0" : "";
	//var strTime = hrs + ":" + minPre + this.tWorldMin + ":" + secPre + this.tWorldSec + " " + suf;
	var strTime = hrs + ":" + minPre + this.tWorldMin + " " + suf;
	if (this.rtSpawned != null) {
		strCaption = this.rtSpawned.idName + " is now departing.";
	} else {
		strCaption = "";
	}
	this.elmStatus.innerHTML = "<span class=\"time\">" + strTime + "</span> &nbsp; " + "<span class=\"caption\">" + strCaption + "</span> "
}

// update framerate counter
// ------------------------------------------------	
Main.prototype.updFR = function() {
	// update framerate
	this.frCurr = Math.round(1/(this.t1-this.t0)*100)/100;
	// average every few frames
	this.frAvg = Math.round(((this.frCurr/this.frAvgCt)+(this.frAvg*(this.frAvgCt-1)/this.frAvgCt))*100)/100;
	// store it?
	if (this.frCt % this.frAvgCt == 0) this.frAvgStore = this.frAvg;
	this.frCt++; this.redrawFR();	
}

// updRoutes
// ------------------------------------------------	
Main.prototype.updTime = function() {
	// current time
	this.dt = new Date();
	// seconds
	this.t1 = this.dt.getTime()/1000;
	// store current time
	this.tWorldSec0 = this.tWorldSec;
	this.tWorldMin0 = this.tWorldMin;
	// how much time has elapsed since last?
	var elap = this.t1-this.t0;
	// accelerate the time scale
	var ff1 = this.ff + this.ffAcc;
	// past max?
	if (ff1 > this.ff1) ff1 = this.ff1;
	// are we approaching the end of our loop?
	if (this.tWorldAccum >= SEC_IN_DAY-(this.ff1*15)) {
		// deaccelerate
		//this.ff = Math.floor(tOff/2);
		// deaccelerate towards our current time
		this.tTrue = this.getTrueTime();
		// how close are we? account for wrap-around case
		if (this.tWorld > this.tTrue) { var tOff = this.tTrue + SEC_IN_DAY - this.tWorld; }
		else { var tOff = this.tTrue - this.tWorld; }
		// if the next step will put us over, reset now.
		if (tOff < 10) {
			this.tWorldAccum = 0;
			// set to true time
			this.tWorld = this.tTrue;
			// reset to start rate
			this.ff = this.ff0;
			// else ease in towards the true time
		} else {
			// ease out - decreasing the multiplier to make it ease more slowly - increase for more dramatic
			this.ff = tOff*0.08;
		}
	// else keep accelerating
	} else {
		this.ff = ff1;
	}
	//console.log("this.ff : " + this.ff);
	// our speed as a ratio 0 to 1
	this.ffRat = (this.ff-this.ff0)/(this.ff1-this.ff0);
	// increment
	this.tWorld = (this.tWorld + this.ff) % SEC_IN_DAY;
	// store new values
	this.tWorldSec = Math.floor(this.tWorld % 60);
	this.tWorldMin = Math.floor(this.tWorld/60) % 60;
	this.tWorldHrs = Math.floor(this.tWorld/3600);
	// accumulative
	this.tWorldAccum += this.ff;
	// what is the current time in minutes for today (0 through 1440)
	this.tMinTot = Math.floor(this.tWorld/60);
	// new minute?
	if (this.tWorldMin != this.tWorldMin0) {
		// check if we should be in night mode
		this.checkNight();
	}
}

// getTrueTime
// returns true time in NYC in seconds
Main.prototype.getTrueTime = function() {
	
	var d = new Date();
	
	this.tTrueSec = d.getUTCSeconds();
	this.tTrueMin = d.getUTCMinutes();
	this.tTrueHrs = d.getUTCHours()+this.hZoneOff;
	if (this.tTrueHrs < 0) this.tTrueHrs += 24;
	
	return (((this.tTrueHrs*60)+this.tTrueMin)*60)+this.tTrueSec;
}

// check if we're in the right night/day mode
// ------------------------------------------------	
Main.prototype.checkNight = function() {
	if ((this.tMinTot >= this.tDay0) && (this.tMinTot <= this.tDay1)) {
		// change background color
		if ((this.isNight) || (this.isNight == null)) {
			this.isNight = false; this.setBg();
		}
	// else we should be in nighttime mode
	} else {
		if ((!this.isNight) || (this.isNight == null)) {
			this.isNight = true; this.setBg();
		}
	}
}

// updRoutes
// ------------------------------------------------	
Main.prototype.updSched = function() {
	// store this as the last time we spawned (even if we don't find one)
	this.tSpawn = this.t1;
	// what minute are we at?
	var arrTrig = arrSched[this.tMinTot];
	var indRoute, isFw, rt;
	//this.rtSpawned = null;
	// do we have any trains to trigger there?
	if (arrTrig == null) return;
	// start at a random point
	var k = Math.floor(Math.random()*(arrTrig.length-0.0001));
	// how many do we currently want to limit to
	this.rtVisMax = Math.round(lerp(this.rtVisMax0, this.rtVisMax1, this.ffRat));
	// else go through it
	for (var i = 0; i < arrTrig.length; i++) {
		// route index
		indRoute = arrTrig[k][0];
		// store it
		rt = this.arrRoutes[indRoute];
		// if it's already on, ignore it
		if (rt.isOn || (this.rtVis >= this.rtVisMax)) continue;
		// route direction (uptown/downtown)
		isFw = arrTrig[k][1] == 0 ? true : false;
		// trigger it
		rt.startEnter(isFw);
		//
		this.rtSpawned = rt;
		// break - only trigger one train from each
		break;
		// else we continue
		ct++;
		//
		//console.log("spawning : " + rt.idName + " : " + this.tMinTot + ": winner : going forward? " + isFw);
	}
}

// updRoutes
// ------------------------------------------------	
Main.prototype.updRoutes = function() {
	// temporary - redraw all threads
	for (var i = 0; i < this.arrRoutes.length; i++) { this.arrRoutes[i].upd(); }	
}

// updBoundingBox
// set bounding box
// ------------------------------------------------	
Main.prototype.updBounds = function() {
	var th, xp, yp, xpo, ypo;
	// make sure we have built the threads
	if (this.arrThreads.length == 0) { return; }
	// temporary - redraw all threads
	for (var i = 0; i < this.arrThreads.length; i++) {
		th = this.arrThreads[i];
		// check both points on the thread
		for (var j = 0; j < 2; j++) {
			xpo = j == 0 ? th.xp0 : th.xp1;
			ypo = j == 0 ? th.yp0 : th.yp1;
			// offset to coordinates
			xp = xpo + this.xo;
			yp = ypo + this.yo;
			//
			if (i == 0) {
				// initialize bound box this point
				this.xb0 = this.xb1 = xp;
				this.yb0 = this.yb1 = yp;
			} else {
				// compare values
				if (xp < this.xb0) { this.xb0 = xp; }
				if (xp > this.xb1) { this.xb1 = xp; }
				// compare y                        
				if (yp < this.yb0) { this.yb0 = yp; }
				if (yp > this.yb1) { this.yb1 = yp; }
			}
		}
	}
}

// updPos
// ------------------------------------------------	
Main.prototype.updPos = function() {
	// how much time has elapsed since last update?
	var elap = this.t1-this.t0;
	// reset the channels, nothing is playing anymore. Fixes bug where channel count doesn't go to zero
	if (((this.t1-this.tNote) > 0.7) && (this.chanInUse != 0)) this.chanInUse = 0;
	// get new position
	this.xp1 = this.getUserX(); this.yp1 = this.getUserY();
	// update point objects
	this.pt0.x = this.xp0; this.pt0.y = this.yp0;
	this.pt1.x = this.xp1; this.pt1.y = this.yp1;
	//  change in position
	var dx = this.xp1-this.xp0; var dy = this.yp1-this.yp0;
	// distance traveled
	this.dist = Math.sqrt(dx*dx + dy*dy);
	// current speed - pixels per second
	this.spd = this.dist/elap;
	// normalize it from 0 to 1
	this.rSpd = lim((this.spd-this.spdMin)/(this.spdMax-this.spdMin), 0, 1);
	// get average
	this.rSpdAvg = (this.rSpdAvg*(this.fAvg-1)/this.fAvg) + (this.rSpd*(1/this.fAvg));
	// store previous position
	this.xp0 = this.xp1; this.yp0 = this.yp1;
}

// updNorm
// ------------------------------------------------	
Main.prototype.updNorm = function() {
	// store current mouse pos
	this.xp0 = this.getUserX(); this.yp0 = this.getUserY();
}

// upd
// ------------------------------------------------	
Main.prototype.updMouseDown = function() {
	var rt;
	//
	for (var r = 0; r < this.arrRoutes.length; r++) {
		rt = this.arrRoutes[r];
		// don't check this route if it's not on, or fading out
		if (!rt.isOn || rt.isExiting) { continue; }		
		// else continue...
		var xi; var yi; var th;
		// go through threads
		for (var i = 0; i < rt.arrThreads.length; i++) {
			th = rt.arrThreads[i];
			// don't check this route if it's not on - and if it's not the one i'm on
			if ((!th.route.isOn) || (!th.isVisible) || (th.route.isExiting) || (th.len < this.thLenIgnore) || isNaN(th.len)) { continue; }
			// find line intersection
			var pt = lineIntersect(this.pt0, this.pt1, th.pt0, th.pt1);
			// did we get a point?
			if (pt == null) continue;
			//
			xi = pt.x; yi = pt.y;
			// if it's not already grabbed, grab it
			if (!th.isGrabbed) {
				// is the user moving too fast to allow grabbing of this string?
				if(this.getSpdAvg() <= this.rSpdGrab) {
					// grab new thread
					this.grabThread(th, xi, yi, true, null);
				} else {
					// brush over thread
					this.pluckThread(th, xi, yi, true, null);
				}
			}
		}
	}
}

// getSpd: returns my current speed as ratio 0 (slowest) to fastest (1)
Main.prototype.getSpd = function() {
	return this.rSpd;
}

// getSpdAvg: returns my recent average speed as ratio 0 (slowest) to fastest (1)
Main.prototype.getSpdAvg = function() {
	return this.rSpdAvg;
}		

// grabThread
// ------------------------------------------------	
Main.prototype.grabThread = function(th,xp,yp,byUser,car) {
	this.grabbed++;
	th.grab(xp,yp,byUser,car);
}

// pluckThread
// ------------------------------------------------	
Main.prototype.pluckThread = function(th,xp,yp,byUser,car) {
	th.pluck(xp,yp,byUser,car);
}

// dropThread
// ------------------------------------------------	
Main.prototype.dropThread = function(th) {
	this.grabbed--;
	th.drop();
}

// dropAll
// ------------------------------------------------	
Main.prototype.dropAll = function() {
	for (var i = 0; i < this.arrThreads.length; i++) {
		if (this.arrThreads[i].isGrabbed) this.arrThreads[i].drop();
	}
}

// clear loader
Main.prototype.clearFR = function() {
	this.cv1.clearRect(0, 0, 100, 60);
}
// redraw framerate
Main.prototype.redrawFR = function() {
	// clear rectangle just around it
	this.clearFR();
	this.cv1.fillStyle = "#999";
	this.cv1.font = "bold 13px sans-serif";
	this.cv1.fillText(this.frCurr, 10, 20);
	this.cv1.fillText(this.frAvgStore, 10, 40);
}
// is user currently grabbing a thread?
Main.prototype.isGrabbing = function() {
	return (this.grabbed > 0);
}
// get user position
Main.prototype.getUserX = function() {
	return mouseX-this.xo;
}
Main.prototype.getUserY = function() {
	return mouseY-this.yo;
}
// set background color
Main.prototype.setBg = function() {
	//
	this.hexBg = this.isNight ? this.hexBgNight : this.hexBgDay;
	this.colBg = hex2rgb(this.hexBg);
	// night mode? - make background black
	document.body.style.background = this.hexBg;
}

// ------------------------------------------------	
// initialize global variables
// ------------------------------------------------	
var canvas,
m, // main object
g,
rsize, // resize window function
frameRate = 30, // framerate for movie
mouseX = 0, mouseY = 0, // mouse position
pmouseX, pmouseY,
width, height,
mousePressed = false,
keyPressed = false,
mouseUp,
TWO_PI = Math.PI*2,
mouseDown,
mouseMoved,
mouseDragged,
keyUp,
frameCount = 0,
keyDown,
notes = 20, // how many notes
indNoteLd = 0, // which note are we on
arrBuffers, arrUrl, // array of audio buffers
draw;
	
// the Web Audio "context" object
var audioContext = null;		
	
var SEC_IN_DAY = 86400; // how many seconds in a day
var arrSnd = new Array(); // array of sound objects
var	arrTimeout = new Array(); // array of timeout's for each sound
// is it a mobile device?
var USER_AGENT = navigator.userAgent.toLowerCase();
	
// init for overall
function init() {
	// mouse actions
	document.addEventListener('mousemove', function (e) {
		pmouseX = mouseX; pmouseY = mouseY;
		mouseX = e.pageX; mouseY = e.pageY;
	}, false);
	document.addEventListener('mousedown', function (e) { 
		mousePressed = true;
		if (m.mouseDown != undefined) m.mouseDown(e);
		e.preventDefault();
	}, false);
	document.addEventListener('mouseup', function (e) { 
		mousePressed = false;
		if (m.mouseUp != undefined) m.mouseUp(e);
	}, false);

	// resize function
	rsize = function (e) {
		width = window.innerWidth;
		height = window.innerHeight;
		if (m != undefined) m.rsize();
	}
	window.addEventListener('resize', rsize, false);
	// invoke once now
	rsize();
	// initialize mouse position
	mouseX = width/2; mouseY = height/2;

	// create main object
	m = new Main();

	document.addEventListener("click", function(e) {
		document.getElementById("begin").classList.add("fade-out")
		// set draw loop
		setInterval(draw, frameRate);
		// invoke resize
		rsize();
		// begin
		m.begin();

		audioContext.resume()
	}, {once: true})

	// Load in the audio files.
	// Create array of audio buffers
	arrBuffers = new Array(notes);
	// Create array of URL's
	arrUrl = new Array(notes);
	var midiValue, pre;
	for (var i = 0; i < notes; i++) {
  		if (i < 10) pre = '0'; else pre = '';
		arrUrl[i] = ('audio/cello_' + pre + i + ".mp3");
	}
	bufferLoader = new BufferLoader(audioContext, arrUrl, finishedLoading);
	bufferLoader.load();	
	
}

// draw loop - just trigger main's update function
function draw() {
	m.upd();
}

function finishedFile(bufferPm) {
	bufferLoader.finishedFile(bufferPm);
};

// what to do when we're done loading sounds
function finishedLoading(bufferListPm) {
	arrBuffers = bufferListPm;
	m.doneLoading();
};


function playSound(pitchPm, volPm, panPm) {
	
	var ind = 0;
	var pos, rem0, rem1, obj;
	
	var n = pitchPm;
	
	var buffer = arrBuffers[n];
	var source = audioContext.createBufferSource();
	source.buffer = buffer;
	
	// Create a gain node.
	var gainNode = audioContext.createGain();
	source.connect(gainNode);
	gainNode.connect(audioContext.destination);
	// Set volume
	gainNode.gain.value = volPm;
		
	source.start();
	
	// store current time
	m.tNote = (new Date()).getTime()/1000;
	
}

// -------------------------------------------------------------
// Common: math functions
// -------------------------------------------------------------
// linear extrapolate color
var lerpColor = function(a, b, t) { 
	var c1 = lerp(a[0], b[0], t);
	var c2 = lerp(a[1], b[1], t);
	var c3 = lerp(a[2], b[2], t);
	var c4 = lerp(a[3], b[3], t);
	return [c1, c2, c3, c4];
}
// convert color
var getColor = function(color) {
	var r = Math.round(color[0]);
	var g = Math.round(color[1]);
	var b = Math.round(color[2]);
	return 'rgb('+r+','+g+','+b+')';
}
// Convert a hex value to its decimal value - the inputted hex must be in the
// format of a hex triplet - the kind we use for HTML colours. The function
// will return an array with three values.
function hex2rgb(hex) {
	if(hex.charAt(0) == "#") hex = hex.slice(1); //Remove the '#' char - if there is one.
	hex = hex.toUpperCase();
	var hex_alphabets = "0123456789ABCDEF";
	var value = new Array(3);
	var k = 0;
	var int1,int2;
	for(var i=0;i<6;i+=2) {
		int1 = hex_alphabets.indexOf(hex.charAt(i));
		int2 = hex_alphabets.indexOf(hex.charAt(i+1)); 
		value[k] = (int1 * 16) + int2;
		k++;
	}
	return(value);
}
// linear extrapolate
var lerp = function(a, b, t) {
	return a + (b-a)*t;
}
// limit to range
var lim = function(n, n0, n1) {
	if (n < n0) { return n0; } else if (n >= n1) { return n1; } else { return n; }
}
// normalize
var norm = function(a,a0,a1) {
	return (a-a0)/(a1-a0);
}
// Returns 1 or -1 sign of the number - returns 1 for 0
var sign = function(n) {
	if (n >= 0) { return 1 } else { return -1 };
}

// lim
// Returns intersection of segement AB and segment EF as Point
// 				Returns null if there is no intersection
// params:      Takes four Points, returns a Point object 
//---------------------------------------------------------------
var lineIntersect = function(A,B,E,F) {
	
    var ip, a1, a2, b1, b2, c1, c2;
	// calculate
    a1 = B.y-A.y; a2 = F.y-E.y;
	b1 = A.x-B.x; b2 = E.x-F.x;
    c1 = B.x*A.y - A.x*B.y; c2 = F.x*E.y - E.x*F.y;
	// det
    var det=a1*b2 - a2*b1;
	// if lines are parallel
    if (det == 0) { return null; }
	// find point of intersection
    var xip = (b1*c2 - b2*c1)/det;
    var yip = (a2*c1 - a1*c2)/det;
	// now check if that point is actually on both line segments using distance
    if (Math.pow(xip - B.x, 2) + Math.pow(yip - B.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2)) { return null; }
    if (Math.pow(xip - A.x, 2) + Math.pow(yip - A.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2)) { return null; }
    if (Math.pow(xip - F.x, 2) + Math.pow(yip - F.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2)) { return null; }
    if (Math.pow(xip - E.x, 2) + Math.pow(yip - E.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2)) { return null; }
	// else it's on both segments, return it
    return new Point(xip, yip);
}
// ------------------------------------------------
// class:			Point
// description:
// ------------------------------------------------
var Point = function(px,py) {
	this.x = px; this.y = py;
}

// ------------------------------------------------
// class:			Console debugging
// ------------------------------------------------
if (!window.console) console = {};
console.log = console.log || function(){};
console.warn = console.warn || function(){};
console.error = console.error || function(){};
console.info = console.info || function(){};