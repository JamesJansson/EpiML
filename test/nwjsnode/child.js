process.stdin.resume();

require('nwjsnode.js').ConsoleSetup();

// 
console.log("Test this");

// set up the listeners

process.on('message', function(m) {
  // Do work  (in this case just up-case the string
  m = m.toUpperCase();

  // Pass results back to parent process
  process.send(m.toUpperCase(m));
});

process.send({ foo: 'bar' });