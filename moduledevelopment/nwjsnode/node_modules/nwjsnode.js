// This module is designed to be an analogue for a webworker under nw.js
// It allows data to be communicated easily to the child process and for output (such as errors, throws and console.logs)
// to be displayed in the console in a similar way as one would expect under 

// NSWJSNodeChildProcess=require('nwjsnode').ChildProcess;
// Child=new NSWJSNodeChildProcess('./child.js');




function ConsoleSetup(){
	// This function is to be run first in the child process
	// NWJSNode.ConsoleSetup renames standard functions to hand data back to the nw.js console nicely.
	
	// Create an error function that displays trace information
	console.error=function(errordisplayed){
		var stack = new Error().stack;
		console.warn(errordisplayed +"\n"+stack);
	};
	
	// Create a secondary name for the console.log 
	console.log2=console.log;
	
	// Respecify console log to be in the appropriate format
	console.log=function(funinput){
		if (typeof(funinput)==='function'){
			console.log2('"'+funinput+'"');
		}
		else if (typeof(funinput)==='undefined'){
			console.log2('"undefined"');
		}
		else{
			try{
				// this is used to give a marker to the console on the side to know where to split
				console.log2(JSON.stringify(DeepCopyData(funinput))+"\~nwjsnodeendoutput");
			}
			catch (erroroutput){// don't handle, simply do the console.log
				console.error("Couldn't process console.log call");
			}
		}
	};
}

// Inspired by
// http://james.padolsey.com/javascript/deep-copying-of-objects-and-arrays/

function DeepCopyData(obj) {// copies non-function data only
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
	if (obj===null){// special case for null which thinks it is an object
		return obj;
	}
    if (typeof obj === 'object') {
        var out = {};
        for (var i in obj ) {
            if (typeof obj[i] !== 'function') {
                out[i] = arguments.callee(obj[i]);
            }
        }
        return out;
    }
    return obj;
}



function NWJSNodeInstance(Script){
	// in this area we need to specify additional arguments
	// e.g. max memory into args of fork('node', [args]);
	var ChildProcessOptions={};
	ChildProcessOptions.stdio=['ipc']; // turn on interprocess communications.
	
	// Spawn the Child Process
	var spawn=require('child_process').spawn;
	this.Process = spawn('node', [Script], ChildProcessOptions);
	
	this.onmessage;
	
	
	var NWJSNodeInstancePointer=this;
	// Set up listeners 
	this.Process.on('message', function(m) {
		// Receive results from child process
		if (typeof(NWJSNodeInstancePointer.onmessage)=='undefined'){
			console.log('%c'+'Message function not set up. Received: \n ' + m, 'color: #FF0000');
		}
		else {
			NWJSNodeInstancePointer.onmessage(m);
		}
	});
	
	
	this.Process.stdout.on('data', function (stdout){
		// Convert output to human readable for
		var asciistdout=stdout.asciiSlice();
		
		// Split function output
		var Splitstdout=asciistdout.split("\~nwjsnodeendoutput");
		for (var Count in Splitstdout){
			try {// try parsing as JSON (to display as object)
				console.log(JSON.parse(Splitstdout[Count]));
			}
			catch (errormessage){//don't do anything
				//console.log("Error trying to display stdout from nwjsnode chld process \n"+errormessage+'\n'+Splitstdout[Count]);
			}
		}
	});
	
	this.Process.stderr.on('data', function (data) {
		console.log('%c'+ data, 'color: #FF0000');
		///console.log('%c'+data, 'color: #FF0000');
	});
	
	// 	http://stackoverflow.com/questions/14332721/node-js-spawn-child-process-and-get-terminal-output-instantaneously
};

NWJSNodeInstance.prototype.postMessage =function (Message){
	// the message should be in the form of a structure that cna be converted to JSON
	this.Process.send(Message);
};

NWJSNodeInstance.prototype.terminate =function (){
	this.Process.kill('SIGKILL');// hard kill the process
};

NWJSNodeInstance.prototype.CallFunction =function (FunctionName, FunctionInput, CallBack){
	this.Process.send('CallFunction', 'ThisFunction');
};






exports.ConsoleSetup=ConsoleSetup;
exports.ChildProcess=NWJSNodeInstance;


// NWJSNodeInstance.prototype.Messaging =function (){
// 	// this.Process.send('message', 'ThisFunction');
// 	this.Process.send( 'ThisFunction');
	
// };

// NWJSNodeInstance.prototype.Messaging2 =function (){
// 	// this.Process.send('message', 'ThisFunction');
// 	var c={};
// 	c.a=3;
// 	c.b=4;
// 	console.log(JSON.stringify(c))
// 	this.Process.send(JSON.stringify(c));	
// };

// usage



























// NWJSNodeInstance.prototype.stdoutHandler=function (stdout){
// 	// Split function output
// 	var Splitstdout=stdout.split("\~nwjsnodeendoutput");
// 	for (var Count in Splitstdout){
// 		try {console.log(JSON.parse(Splitstdout[Count]));}// try parsing as JSON
// 		catch (errormessage){console.log(Splitstdout[Count]);}
// 	}
// }




// NWJSNodeInstance.prototype.ConsoleHandler=function(error, stdout, stderr){
// 	// Do some processing to see if it is a variable that can be displayed
	
// 	// Split function output
// 	var Splitstdout=stdout.split("\~nwjsnodeendoutput");
	
	
// 	for (var Count in Splitstdout){
// 		try {console.log(JSON.parse(Splitstdout[Count]));}// try parsing as JSON
// 		catch (errormessage){console.log(Splitstdout[Count]);}
// 	}
	
//     console.log('%c'+stderr, 'color: #FF0000');
//     if (error !== null) {
//         console.log('%c'+'exec error: '+error, 'color: #FF0000');
//     }
// }




//var spawn = require('child_process').spawn;
// var child = spawn('node', ['./test/testchild.js'])
// child.stdout.on('data', function (data) {
//     console.log('We received a reply: ' + data);
// });
// // Send data to the child process via its stdin stream
// child.stdin.write("Hello there!");

// // Listen for any response from the child:
// child.stdout.on('data', function (data) {
//     console.log('We received a reply: ' + data);
// });

// // Listen for any errors:
// child.stderr.on('data', function (data) {
//     console.log('There was an error: ' + data);
// });


//In child.js:

// // Unpause the stdin stream:
// process.stdin.resume();

// // Listen for incoming data:
// process.stdin.on('data', function (data) {
//     console.log('Received data: ' + data);
// });

// http://www.graemeboy.com/node-child-processes