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
	var Splitstdout=stdout.split("/end~output/");
	
	
	for (var Count in Splitstdout){
		try {console.log(JSON.parse(Splitstdout[Count]));}// try parsing as JSON
		catch (errormessage){console.log(Splitstdout[Count]);}
	}
	
    console.log('%c'+stderr, 'color: #FF0000');
    if (error !== null) {
        console.log('%c'+'exec error: '+error, 'color: #FF0000');
    }
}); 

*/

// allow error functions to display when they 
console.error=function(funinput){console.warn(funinput); stack = new Error().stack;console.warn(stack);};
//console.json=function(funinput){console.log(JSON.stringify(funinput));};
console.log2=console.log;
console.log=function(funinput){
	if (typeof(funinput)==='function'||typeof(funinput)==='undefined'){
		console.log2(funinput);
	}
	try{
		// if the string needs to be properly escaped
		// var str = "Visit Microsoft!";
		//str.replace("Microsoft", "W3Schools");
		
		console.log2(JSON.stringify(funinput)+"/end~output/");// this is used to give a marker to the console on the side to know where to split
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
setTimeout(DoThisStuff, 2000);



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

	b=[];
	for (i=0;i<1000;i++){
		b.push(i);
	}
	console.log(b);
	
	
	//console.json(a);
	
	console.log("Hello");
	//console.error("Testing the errorscript");
	TestFunc1();
	console.log("testing \n thrown");
	
	
	//throw "Threw";
	
	
	setTimeout(function(){console.log("Just waiting")}, 5000);
	
	return 0;
}

