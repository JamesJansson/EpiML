function ParameterClass(ParameterID, CategoryID, 

this.ParameterID=ParameterID;
this.CategoryID=CategoryID;

this.MedianEstimate=
this.StandardError=
this.
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
		logmedian=Math.log(this.MedianEstimate);
		//calculate
		Math.random//NOTE!!! Math.random is platform dependent, meaning we need to create or use a platform independent method 
		//discussed here http://bocoup.com/weblog/random-numbers/
		//some code here https://gist.github.com/Protonk/5367430
		//Linear congruential generator
		
		
		//http://stackoverflow.com/questions/20160827/when-generating-normally-distributed-random-values-what-is-the-most-efficient-w 
		// To get approximately normally distributed random numbers, add 12 rands, minus 6, divide 
		//
		
		// Possibly the best method will be to use the ziggurat algorithm
		//https://github.com/jamesbloomer/node-ziggurat/blob/master/index.js
		
		
		
		//delog
	}	
	
	
}

