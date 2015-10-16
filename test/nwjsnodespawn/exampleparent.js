// Run this code in the nw.js app or in the nw.js console. 
// Make sure that nwjsnode is in the nodemodules folder for nw.js AND the nodemodules folder in which the child is run from 
var NSJSNodeChildProcess=require('./test/nwjsnodespawn/nwjsnode.js').ChildProcess;
var FunctionToRun='./test/nwjsnodespawn/examplechild.js';
var TestChildProcess=new NSJSNodeChildProcess('./test/nwjsnodespawn/examplechild.js');

TestChildProcess.onmessage=function (Message){
	console.log("In parent: we received a message back ");
	console.log(Message);
}

// send something to the child to get it going
TestChildProcess.postMessage([99, 105, 66]);