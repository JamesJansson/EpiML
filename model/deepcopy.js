// Inspired by
// http://james.padolsey.com/javascript/deep-copying-of-objects-and-arrays/


function DeepCopyProto(obj) {// copies functions in addition to the data
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
	if (obj===null){// special case for null which thinks it is an object
		return obj;
	}
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
		
		if (typeof(obj.__proto__)=== 'object') {
			out.__proto__=obj.__proto__;
		}
        return out;
    }
    return obj;
}

function DeepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
	if (obj===null){// special case for null which thinks it is an object
		return obj;
	}
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
		
        return out;
    }
    return obj;
}