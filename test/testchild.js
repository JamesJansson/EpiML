// node-monkey
UseNodeMonkey=false;
if (UseNodeMonkey){
	
	require('node-monkey').start({host: "127.0.0.1", port:"50500"});
	
}

// Running the 
// var exec = require('child_process').exec;
// exec('node --debug ./test/testchild.js', function(error, stdout, stderr) {
    // //do some processing to see if it is a variable that can be displayed
    // console.log(stdout);
    // console.log('%c'+stderr, 'color: #FF0000');
    // if (error !== null) {
        // console.log('%c'+'exec error: '+error, 'color: #FF0000');
    // }
// });

/* 

var exec = require('child_process').exec;
exec('node --debug ./test/testchild.js', function(error, stdout, stderr) {
    // do some processing to see if it is a variable that can be displayed
    // console.log((stdout));
    //
	console.log(stdout[0]);
	try {console.log(JSON.parse(stdout));}
	catch (errormessage){console.log(stdout);}
    console.log('%c'+stderr, 'color: #FF0000');
    if (error !== null) {
        console.log('%c'+'exec error: '+error, 'color: #FF0000');
    }
}); 

*/

// allow error functions to display when they 
console.error=function(funinput){console.warn(funinput); stack = new Error().stack;console.warn(stack);};
//console.json=function(funinput){console.log(JSON.stringify(funinput));};
consolelog=console.log;
console.log=function(funinput){
	try{
		consolelog(JSON.stringify(funinput));
	}
	catch (erroroutput){// don't handle, simply do the console.log
		console.error("Couldn't process console.log call");
	}
};



// node-inspector
// node-inspector ?
// node --debug testchild.js
//

//npm install webkit-devtools-agent
//var agent = require('webkit-devtools-agent');
//agent.start()

console.log("Waiting");
setTimeout(DoThisStuff, 5000);



function DoThisStuff(){
	//console.error=function (ErrorVariable){console.trace(ErrorVariable)};
	console.log("Testing")


	function TestFunc1(){
		TestFunc2();
	}

	function TestFunc2(){
	   console.error("Error trace");
	   
	   console.trace("Regular trace");
	}



	a={};
	a.val=1;
	a.x=3;

	console.log(a);

	console.log(JSON.stringify(a));

	//console.json(a);
	
	console.log("Hello");
	//console.error("Testing the errorscript");
	TestFunc1();
	console.log("testing thrown");
	
	
	throw "Threw";
	
	
	setTimeout(function(){console.log("Just waiting")}, 5000);
}

