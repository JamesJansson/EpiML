function ExplodingObject(){
	//this.Explode();
}

ExplodingObject.prototype.a=function(c,d){
	return c*d;	
}


ExplodingObject.prototype.v=function(c,d){
	return c-d;	
}

ExplodingObject.prototype.Explode=function(SupressWarnings, OverwriteExistingGloablObjects){
	if (typeof(SupressWarnings)==="undefined"){
		SupressWarnings=false;
	}
	if (typeof(OverwriteExistingGloablObjects)==="undefined"){
		OverwriteExistingGloablObjects=true;
	}
	
	
	for (var Elements in this){
		if (Elements!='Explode'){
			console.log(this[Elements]);
			var ObjectAlreadyDefined=true;
			try {eval(Elements)}
			catch (e) {ObjectAlreadyDefined=false;}// there is no object called Elements so 
			
			var temp=this[Elements];
			if (ObjectAlreadyDefined && SupressWarnings==false){
				console.error("The variable "+ Elements+" is already defined. This is currently being overwritten.");
				if(OverwriteExistingGloablObjects){
					eval(Elements+"=temp;");
				}
			}
			else{
				eval(Elements+"=temp;");
			}
		}
	}
}

function woot(){
	console.log('woot!');
}

function yay(){
	console.log('yay!');
}

// define something here, e.g. M=new MObject();

exports.ExplodingObject=new ExplodingObject;

exports.global=global;