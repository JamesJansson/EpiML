// process.stdin.resume();// Unpause the stdin stream:
require('nwjsnode').ConsoleSetup();

// Listen for incoming data:
process.on('message', function (Message) {
    console.log("Inside the child process");
    console.log("Raw (Message) recieved");
    console.log(Message);
    console.log("typeof(Message): "+typeof(Message));
    
    console.log("Sending back an object");
    var ObjectToReturn={};
    ObjectToReturn.a="This is a string";
    ObjectToReturn.number=2564;
    ObjectToReturn.array=2564;
    console.log(ObjectToReturn);
    
    
    
    ObjectToReturn.bigarray=[];
    
    for (var i=0; i<10000; i++){
        //console.log(i);
        ObjectToReturn.bigarray.push(Math.random());
    }
    ObjectToReturn.fun=function(){return 67;};
    
    console.log(ObjectToReturn);// tested up to 1 000 000
    
    // Note here that the process.send is in the return
    // This is to stop the process.on from exiting
    // before all data is sent back. This is a little bit of a
    // hack but necessary
    return process.send(ObjectToReturn);
});