function ParameterClass(CategoryID, ParameterID){

this.CategoryID=CategoryID;//e.g. HCV
this.ParameterID=ParameterID;// e.g. HCCProbability


this.MedianEstimate=
this.StandardError=
this.
this.distributionType=
//0: uniform
//1: normal
//2: exponential
//3: lognormal
//4: logitnormal   // used for probability distributions (on [0,1]). Note sigma<1 to avoid strange edge effects
//5: Poisson
//6: sqrnormal

//optimisedsample//used in a case where the parameters is unknown and an algorithm decides the 

this.Upper95Range=
this.Lower95Range=

this.NumberOfSamples
this.Val=[];//

//These variables are used to describe what the variables are and where they are from 
this.Description=[];//
this.URL=[];//An array of URLs that are sources for the parameter in question [Link] Jansson et al., 2003, Title of paper
this.URLText=[];//Text to be displayed in lieu of the 
}

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
		logmedian=Math.log(this.MedianEstimate);
		//calculate
		Math.random
		//some code here https://gist.github.com/Protonk/5367430
		//Linear congruential generator
		
		
		//http://stackoverflow.com/questions/20160827/when-generating-normally-distributed-random-values-what-is-the-most-efficient-w 
		// To get approximately normally distributed random numbers, add 12 rands, minus 6, divide 
		//
		
		
		
		
		
		//delog
	}	
	
	
}

