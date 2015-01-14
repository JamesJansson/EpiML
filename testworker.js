
var a= new Array(1000000);

process.on('message', function(m) {
	// Do work  (in this case just up-case the string
	process.send("Starting memory expansion");
	
	for (var i=0; i<1000000; i++){
		if (i%10000==0){
		process.send("Process ID "+ m + " Memory allocated "+i);
		}
		a[i] = new Array(200);
		for (var j=0; j<200; j++){
			a[i][j]=Math.random();
		}
	}

});

// Run the following to show the maximum memory capacity
// var cp = require('child_process');

// var child=[];

// for (sim=0; sim<4; sim++){
     // child[sim] = cp.fork('./testworker.js');

     // child[sim].on('message', function(m) {
	// Receive results from child process
  // console.log('received: ' + m);
// });
    // Send child process some work
     // child[sim].send(sim);
// }


// Once you're done

// for (i=0; i<4; i++){child[i].kill()}
