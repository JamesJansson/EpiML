// if (typeof(importScripts)=='undefined'){
// 	importScripts=require('./importScripts.js').importScripts;
// }

importScripts=require('./importScripts.js').importScripts;
include=require('./importScripts.js').include;


importScripts('importscriptsmathlibrary.js');
//importScripts('importscriptsrecursive.js');// 




var b=Add(3,4);
console.log(b);
var c=Minus(3,4);
console.log(c);

MathSendConsoleLog("Test1");
MathSendConsoleError("Test2");
MathSendThrow("Test3");
