// process.stdin.resume();

require('./nwjsnode.js').ConsoleSetup();

// // 
// console.log("Test this");

// // set up the listeners

// process.on('message', function(m) {
//   // Do work  (in this case just up-case the string
//   m = m.toUpperCase();

//   // Pass results back to parent process
//   process.send(m.toUpperCase(m));
// });

// process.send({ foo: 'bar' });

// Unpause the stdin stream:
//process.stdin.resume();

// Listen for incoming data:
process.on('message', function (MessageString) {
    var Message=JSON.parse(MessageString);
    
    console.log(Message);
    
    //if (Message.Instruction=='RunFunction'){}
    
    
    console.error('Received data: ' + MessageString);
    
    console.log('Received data log: ' + MessageString);
    
    console.log([12, 3, 5]);
    
    process.send(MessageString.toUpperCase());
    
});






// process.on('message', function(m) {
//   // Do work  (in this case just up-case the string
//   m = m.toUpperCase();
//   //console.log("YAY");

//   // Pass results back to parent process
//   process.send(m);
// });


// process.on('message', function(m, otherdata) {
//   if (m==='message'){
//     // Do work  (in this case just up-case the string
//     otherdata = otherdata.toUpperCase();
//     process.send(otherdata);
//   }
//   if (m==='message2'){
//     otherdata='yabba dabba do '+otherdata;
//     process.send(otherdata);
//   }

// });