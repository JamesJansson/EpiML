function pjhvlkjhflkdsjhflakfj(a){
	console.error("yeah");
	return a*2;	
}

//exports.aaa=function(g){return pjhvlkjhflkdsjhflakfj(g);}
// console.log("this");
// for (var Count in this){
// 	console.log(this[Count]);
// }
// console.log("thisend");
// console.log(pjhvlkjhflkdsjhflakfj)


//exports.value=42;
//exports.global=global;

//bbb=require("./test/testmodule");


module.exports = function(){ 
	this.aaasum = function(a,b){ return a+b};
	this.aaamultiply = function(a,b){return a*b};
//etc
}// http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files