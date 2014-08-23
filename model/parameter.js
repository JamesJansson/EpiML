


//CreateNewVariable

function ParameterClass(){

this.CategoryID=NaN;//e.g. HCV
this.ParameterID=NaN;// e.g. LFHCCProbability
this.InterfaceID=NaN;// e.g. HCV_LFHCCProbability

this.MedianEstimate=NaN;
this.StandardError=NaN;
this.LowerRange=NaN;//used for normal distributions
this.UpperRange=NaN;//used for normal distributions

this.DistributionType=NaN;
//0: uniform
//1: normal
//2: exponential
//3: lognormal
//4: logitnormal   // used for probability distributions (on [0,1]). Note sigma<1 to avoid strange edge effects
//5: Poisson
//6: sqrnormal

//optimisedsample //used in a case where the parameters is unknown and an algorithm decides the 

this.Upper95Range=NaN;
this.Lower95Range=NaN;

this.NumberOfSamples=NaN;
this.Val=[];//

//These variables are used to describe what the variables are and where they are from 
this.Description=[];//
this.RefText=[];//Text to be displayed in lieu of the 
this.URL=[];//An array of URLs that are sources for the parameter in question [Link] Jansson et al., 2013, Title of paper

}

//Load the parameter from text
	//or maybe simply bind a JSON object
	

	//
	//document.getElementById()
	//.SetInnerHTML
	//
	//		<input type="text" name="paramname" value="F0F1"> 
	//		<select name="DistributionType" onchange=";">
	//			<option value="Normal">Normal</option>
	//			<option value="LogNormal">Log Normal</option>
	//			<option value="NormalProbability">Normal Probability</option>
	//		</select>
	//		Median <input type="text" name="Median"> 
	//		SD <input type="text" name="SD"> 
	//		<a onClick="ToggleDisplay(this, 'ParamInfoBox');">+ More info</a>
	//		<div class="ParamInfoBox" style="display: none;"> Some info to display </div>
	// 
	
//Load the parameter from interface
	//This requires that the 
//Save this interface as 


ParameterClass.prototype.CalculateUncertaintyBounds= function (){
	if (this.DistributionType=="normal"){
		this.Upper95Range=this.MedianEstimate+1.96*this.StandardError;
		this.Lower95Range=this.MedianEstimate-1.96*this.StandardError;
	} 
	else if (this.DistributionType=="lognormal"){
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
		Rand.Value
		//some code here https://gist.github.com/Protonk/5367430
		//Linear congruential generator
		
		
		//http://stackoverflow.com/questions/20160827/when-generating-normally-distributed-random-values-what-is-the-most-efficient-w 
		// To get approximately normally distributed random numbers, add 12 rands, minus 6, divide 
		//
		
		
		
		
		
		//delog
	}	
	
	
}

