// process.stdin.resume();

// require('nwjsnode.js').ConsoleSetup();

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



process.on('message', function(m) {
  // Do work  (in this case just up-case the string
  m = m.toUpperCase();
  console.log("YAY");

  // Pass results back to parent process
  process.send(m);
});


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