var NSJSNodeChildProcess=require('./test/nwjsnodespawn/nwjsnode.js').ChildProcess;

var TestChildProcess=new NSJSNodeChildProcess('./test/nwjsnodespawn/child.js');


TestChildProcess.Messaging2()