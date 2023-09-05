// class:	BufferLoader
// ------------------------------------------------	
var BufferLoader = function(contextPm, arrUrlPm, functionFinishedPm) {
  // audio context
  this.context = contextPm;
  // array of file url paths
  this.arrUrl = arrUrlPm;
  // a function 
  this.functionFinished = functionFinishedPm;
  // array of buffers which I create
  this.arrBuffer = new Array();
  // which file are we on
  this.ind = 0;
}

// function:	init
// desc:
// ------------------------------------------------	
BufferLoader.prototype.load = function() {
  // start loading the first one
  this.loadFile(0);
  
}

// function:	loadFile
// ------------------------------------------------	
BufferLoader.prototype.loadFile = function(indPm) {
	var request = new XMLHttpRequest();
	var url = this.arrUrl[indPm];
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	var context = this.context;
	
	var onError = function() {
		// handle error
	};
	// Decode asynchronously
	request.onload = function() {
		// when it's done
		context.decodeAudioData(request.response, function(theBuffer) {
		  finishedFile(theBuffer);
		}, onError);
	};
	request.send();	
	
}

// function:	finishedFile
// ------------------------------------------------	
BufferLoader.prototype.finishedFile = function(bufferPm) {
  this.arrBuffer.push(bufferPm);
  // is that the last one?
  if (this.ind >= this.arrUrl.length - 1) {
    // done, call the finished function and return the array of buffers
    this.functionFinished(this.arrBuffer); 
  } else {
    this.ind++;
    // load the next one
    this.loadFile(this.ind);
  }
}