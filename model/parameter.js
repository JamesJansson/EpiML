function ParameterClass

this.MedianEstimate=
this.StandardError=
this.distributionType=
//normal
//lognormal
//sqrnormal
//uniform
//optimisedsample//used in a case where the parameters is unknown and an algorithm decides the 

this.Upper95Range=
this.Lower95Range=

this.NumberOfSamples
this.val=[];


ParameterClass.prototype.CalculateUncertaintyBounds= function (){
	if (this.distributionType=="normal"){
		this.Upper95Range=this.MedianEstimate+1.96*this.StandardError;
		this.Lower95Range=this.MedianEstimate-1.96*this.StandardError;
	} 
	else if (this.distributionType=="lognormal"){
		//log
		//calculate
		//delog
	}
	
}

ParameterClass.prototype.CreateDistribution= function (){
	
	else if (this.distributionType=="lognormal"){
		//log
		//calculate
		//delog
	}	
	
	
}

