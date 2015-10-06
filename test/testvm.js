if (typeof(importScripts)=='undefined'){
	importScripts=require('./importScripts.js').function;
}


importScripts('./mathtools.js')

var b=Add(3,4);

console.log(b);

t=Select([2, 5, 1, 10], [20]);

console.log(t);
