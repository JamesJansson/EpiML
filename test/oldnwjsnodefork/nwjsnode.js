// This function is designed to hand information 





function ConsoleSetup(){
	// the first thing that RunNodeNWJSConsole does is rename standard functions to hand data back to the nw.js console nicely.
	
	
	// Create an error function that displays trace information
	console.error=function(funinput){
		console.warn(funinput); 
		var stack = new Error().stack;
		console.warn(stack);
	};
	
	// Create a secondary name for the console.log 
	console.log2=console.log;
	
	// Respecify console log to be in the appropriate format
	console.log=function(funinput){
		if (typeof(funinput)==='function'||typeof(funinput)==='undefined'){
			console.log2(funinput);
		}
		try{
			// this is used to give a marker to the console on the side to know where to split
			console.log2(JSON.stringify(funinput)+"/end~output/");
		}
		catch (erroroutput){// don't handle, simply do the console.log
			console.error("Couldn't process console.log call");
		}
	};
}


function NWJSNodeInstance(Script){
	// in this area we need to specify additional arguments
	// e.g. max memory into args of fork('node', [args]);
	var ChildProcessOptions={};
	ChildProcessOptions.stdio=['ipc']; // turn on interprocess communications.
	
	// Fork the Child Process
	var spawn=require('child_process').spawn;
	this.Process = spawn(Script);
	
	// Set up listeners 
	
	this.Process.on('message', function(m) {
		// Receive results from child process
		console.log('received: ' + m);
	});
	
	
	// this.Process.stdout.on('data', function (stdout){
	// 	// Split function output
	// 	var Splitstdout=stdout.split("/end~output/");
	// 	for (var Count in Splitstdout){
	// 		try {console.log(JSON.parse(Splitstdout[Count]));}// try parsing as JSON
	// 		catch (errormessage){console.log(Splitstdout[Count]);}
	// 	}
	// });
	
	// this.Process.stderr.on('data', function (data) {
	// 	console.log('%c'+'There was an error: ' + data, 'color: #FF0000');
	// 	console.log('%c'+data, 'color: #FF0000');
	// });
	
	// 	
	
	
	//http://stackoverflow.com/questions/14332721/node-js-spawn-child-process-and-get-terminal-output-instantaneously 
};

NWJSNodeInstance.prototype.CallFunction =function (FunctionName, FunctionInput, CallBack){
	this.Process.send('CallFunction', 'ThisFunction');
};

NWJSNodeInstance.prototype.Messaging =function (){
	// this.Process.send('message', 'ThisFunction');
	this.Process.send( 'ThisFunction');
	
};

NWJSNodeInstance.prototype.Messaging2 =function (){
	// this.Process.send('message', 'ThisFunction');
	this.Process.send('message2', 'ThisFunction');
	
};




exports.ConsoleSetup=ConsoleSetup;
exports.ChildProcess=NWJSNodeInstance;


// usage

// NSWJSNodeChildProcess=require('./test/nwjsnode/nwjsnode.js').ChildProcess;
// Child=new NSWJSNodeChildProcess('./test/nwjsnode/child.js');


























// NWJSNodeInstance.prototype.stdoutHandler=function (stdout){
// 	// Split function output
// 	var Splitstdout=stdout.split("/end~output/");
// 	for (var Count in Splitstdout){
// 		try {console.log(JSON.parse(Splitstdout[Count]));}// try parsing as JSON
// 		catch (errormessage){console.log(Splitstdout[Count]);}
// 	}
// }




// NWJSNodeInstance.prototype.ConsoleHandler=function(error, stdout, stderr){
// 	// Do some processing to see if it is a variable that can be displayed
	
// 	// Split function output
// 	var Splitstdout=stdout.split("/end~output/");
	
	
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