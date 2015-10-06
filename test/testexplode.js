function ExplodingObject(){
	//this.Explode();
}

ExplodingObject.prototype.Explode=function(SupressWarnings, OverwriteExistingGloablObjects){
	if (typeof(SupressWarnings)==="undefined"){
		SupressWarnings=false;
	}
	
	for (var Elements in this){
		if (Elements!='Explode'){
			console.log(this[Elements]);
			if (false){
				console.log(1);
			}
			var ObjectAlreadyDefined=true;
			try {eval(Elements)}
			catch (e) {ObjectAlreadyDefined=false;}// there is no object called Elements so 
			
			if (ObjectAlreadyDefined && SupressWarnings==false){
				console.error("The variable "+ Elements+" is already defined. This is currently being overwritten.");
			}
			var temp=this[Elements];
			eval(Elements+"=temp;");
		}
	}
}

ExplodingObject.prototype.a=function(c,d){
	return c*d;	
}


ExplodingObject.prototype.v=function(c,d){
	return c-d;	
}