var t=require('./testsubworker.js');
var a= new Array(1000000);
// Idea from http://stackoverflow.com/questions/5171213/load-vanilla-javascript-libraries-into-node-js
var vm = require("vm");
var fs = require("fs");
var LoadJS=function(path) {
	var data = fs.readFileSync(path);
	vm.runInThisContext(data, path);
}

LoadJS('./testsubworker2.js');



process.on('uncaughtException', function(e){
    process.send(process.pid + ': ' + e);
})

process.on('message', function(m) {
	// Do work  (in this case just up-case the string
	process.send("Starting memory expansion");
	
	process.send(DoStuff2(10));
	
	var zz=new t.Foo('as');
	process.send(zz.fooBar());
	
	var b;
	for (var i=0; i<1000000; i++){
		if (i%10000==0){
		process.send("Process ID "+ m + " Memory allocated "+i);
		}
		a[i] = new Array(180);
		for (var j=0; j<180; j++){
			a[i][j]=Math.random();
		}
		b=t.DoStuff(3);
		process.send("a"+b);
	}
	
	
});

// Run the following to show the maximum memory capacity
// var cp = require('child_process');

// var child=[];

// for (sim=0; sim<4; sim++){
    // child[sim] = cp.fork('./testworker.js');

    // child[sim].on('message', function(m) {
	// console.log('received: ' + m);
	// });
    
     // child[sim].send(sim);//Send child process some work
// }


// Once you're done

// for (i=0; i<4; i++){child[i].kill()}
