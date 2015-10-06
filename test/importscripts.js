fs=require('fs');
vm=require('vm');

function importScripts(filename){
	var code = fs.readFileSync(filename, 'utf-8');
    vm.runInThisContext(code, filename);
}

exports.function=importScripts;