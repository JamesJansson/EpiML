function InterventionObject(InputFunction){
	if (typeof(InputFunction)=="function"){
		this.Code=InputFunction; // is what what you set the code to
		this.CodeText=this.Code+"";// this should convert the code to text
	}
	this.Data={}; // a data store that the intervention can access. 
	//For example, you may run multiple interventions, with treatment at 0.1, 0.2, 0.3. In that case you could set Data.TreatmentRate=0.1 etc and the code can access this.Data.TreatmentRate
	//Alternatively you could simply set and access this.TreatmentRate
}

InterventionObject.prototype.Run= function (Year) {
	if (typeof(this.Code)!="function"){
		eval("this.Code="+this.CodeText);
	}
	return this.Code(Year);
}