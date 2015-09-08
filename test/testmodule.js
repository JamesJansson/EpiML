function pjhvlkjhflkdsjhflakfj(a){
	console.error("yeah");
	return a*2;	
}

exports.aaa=function(g){return pjhvlkjhflkdsjhflakfj(g);}
console.log("this");
for (var Count in global){
	console.log(global[Count]);
}
console.log("thisend");
console.log(pjhvlkjhflkdsjhflakfj)


exports.value=42;
exports.global=global;

//bbb=require("./test/testmodule");