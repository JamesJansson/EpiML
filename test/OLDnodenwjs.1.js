function RunNodeNWJSConsole(){
	// This function is designed to hand information 
	
	
	// Error functions display trace information
	console.error=function(funinput){console.warn(funinput); stack = new Error().stack;console.warn(stack);};
	
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


function NodeNWJSInstance(Script){
	this.child = require('child_process').exec(Script); 
}



NodeNWJSInstance.prototype.ConsoleHandler=function(error, stdout, stderr){
	// Do some processing to see if it is a variable that can be displayed
	
	// Split function output
	var Splitstdout=stdout.split("/end~output/");
	
	
	for (var Count in Splitstdout){
		try {console.log(JSON.parse(Splitstdout[Count]));}// try parsing as JSON
		catch (errormessage){console.log(Splitstdout[Count]);}
	}
	
    console.log('%c'+stderr, 'color: #FF0000');
    if (error !== null) {
        console.log('%c'+'exec error: '+error, 'color: #FF0000');
    }
}

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