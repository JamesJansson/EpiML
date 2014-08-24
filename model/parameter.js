


//CreateNewVariable

function ParameterClass(ParameterID){


this.ParameterID=ParameterID;// e.g. LFHCCProbability
this.InterfaceID=NaN;// e.g. HCV_LFHCCProbability
// Note that GroupName is primarily used for interface design. It is updated at load to represent the true structure of the objects in which it resides, so it cannot be relied upon to be consistent between builds.
this.GroupName=NaN;//e.g. HCV, or in the case of it being a struct of a struct, Param.HCV
//GroupName+'.'+ParameterID gives the full name that the function can call. 

this.DistributionType="uniform";
//0: uniform
//1: normal
//2: exponential
//3: lognormal
//4: logitnormal   // used for probability distributions (on [0,1]). Note sigma<1 to avoid strange edge effects
//5: poisson
//6: sqrnormal
//7: optimisedsample //used in a case where the parameters is unknown and an algorithm decides the sample chosen based on the outcome of an optimisation routine

this.MedianEstimate=NaN;
this.StandardError=NaN;
this.LowerBound=NaN;//used for uniform distributions
this.UpperBound=NaN;//used for uniform distributions



this.Upper95Range=NaN;// These values are calculated on the fly by the program, and are displayed in the interface
this.Lower95Range=NaN;

this.NumberOfSamples=NaN;
this.Val=[];//This is the array of the samples

//These variables are used to describe what the variables are and where they are from 
this.Description=[];//
this.RefText=[];//Text to be displayed in lieu of the 
this.URL=[];//An array of URLs that are sources for the parameter in question [Link] Jansson et al., 2013, Title of paper

}

//Load the parameter from text
	//or maybe simply bind a JSON object
	
ParameterClass.prototype.Name= function (){
	return (this.GroupName+'.'+this.ParameterID);
}	
	
ParameterClass.prototype.UpdateTypeDisplay= function (){
	// Set up the name and parameter type
	var ParameterHTML=""+
	"<input type='text' name='ParameterID' value='" + this.ParameterID + "'>\n"+ 
	"<select id='DistributionType'  onchange='"+this.Name()+".DistributionType=this.value;"+this.Name()+".UpdateTypeDisplay();'>\n"+//change the type, then redisplay
	"	<option value='uniform'>Uniform</option>\n"+
	"	<option value='normal'>Normal</option>\n"+
	"	<option value='exponential'>Exponential</option>\n"+
	"	<option value='lognormal'>Log Normal</option>\n"+
	"</select>\n ";
	
	if (this.DistributionType=="uniform"){
		ParameterHTML=ParameterHTML+"Lower Bound <input type='text' name='LowerBound' value='" + this.LowerBound + " '>\n"+
		" Upper Bound <input type='text' name='UpperBound' value='" + this.UpperBound + " '>\n";
	}
	
	
	
	//
	//		
	//		
	//			
	//		Median <input type="text" name="Median"> 
	//		SD <input type="text" name="SD"> 
	//		<a onClick="ToggleDisplay(this, 'ParamInfoBox');">+ More info</a>
	//		<div class="ParamInfoBox" style="display: none;"> Some info to display </div>
	// 
	
	//
	ParameterHTML=ParameterHTML+
		"<a onClick=\"ToggleDisplay(this, 'ParamInfoBox');\">+ More info</a>\n"+
		"<div class='ParamInfoBox' style='display: none;'>\n"+
		"<p>Description</p>"+
		"<textarea name='Description' cols='100' rows='5'>"+this.Description+"</textarea>";
	//For each of the references, add a link, a box for the title, and the link
	// 
	//Add a "add ref button"
	//
	
	//Close off the references div
	ParameterHTML=ParameterHTML+"</div>";
	
	// Set the parameter
	document.getElementById(this.InterfaceID).innerHTML=ParameterHTML;
	document.getElementById(this.InterfaceID).DistributionType.value=this.DistributionType;
}
	
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
	
	if (this.distributionType=="lognormal"){
		//log
		logmedian=Math.log(this.MedianEstimate);
		//calculate
		Rand.Value();
		//some code here https://gist.github.com/Protonk/5367430
		//Linear congruential generator
		
		
		//http://stackoverflow.com/questions/20160827/when-generating-normally-distributed-random-values-what-is-the-most-efficient-w 
		// To get approximately normally distributed random numbers, add 12 rands, minus 6, divide 
		//
		
		
		
		
		
		//delog
	}	
	
	
}

//**************************************************************************************************************************
// From this point, the code is no longer dealing with individual parameters, but with displaying groups of parameters in a page

function BuildParameterPage(ParamGroup, ParamGroupDivId, GroupName){

	//Firstly, ensure that each of the parameters in the group have the proper GroupName e.g. Param.HIV
	//This allows the object to be able to write code that allows it to execute itself, e.g. Param.HIV.CalculateAndDisplayMedian()
	for (var key in ParamGroup) {// Code inspired by http://stackoverflow.com/questions/208016/how-to-list-the-properties-of-a-javascript-object
		if (ParamGroup.hasOwnProperty(key)) {
			ParamGroup[key].GroupName=GroupName;
		}
	}


	var BuildText="";
	for (var key in ParamGroup) {// Code inspired by http://stackoverflow.com/questions/208016/how-to-list-the-properties-of-a-javascript-object
		if (ParamGroup.hasOwnProperty(key)) {
			//maybe also check here that the parameter is not an array, other wise use a different function 
			ParamGroup[key].InterfaceID=ParamGroupDivId+key;
			BuildText=BuildText+"                <form class=\"ParamContainer\" id=\""+ParamGroup[key].InterfaceID+"\"></form>\n";
		}
	}
	
	//This next section is very naughty, because it breaks the div by setting the inner HTML. It will probably break.
	BuildText=BuildText+"<div class='SolidButton' onClick='AddNewParameter("+GroupName+", \""+ParamGroupDivId+"\"); '>Add parameter</div>"
	
	document.getElementById(ParamGroupDivId).innerHTML = BuildText;
	
	//Load each of the holders with the parameters that should be held
	for (var key in ParamGroup) {
		if (ParamGroup.hasOwnProperty(key)) {
			//Update display of parameter
			console.log(key);
			ParamGroup[key].UpdateTypeDisplay();
		}
	}
}


function AddNewParameter(ParamGroup, ParamGroupDivId){
	//Count number of current 
	var NumParams=1;
	for (var key in ParamGroup) {
		NumParams++;
	}
	var ParamName="NewParam"+NumParams;//The new parameter will be called e.g. NewParam12
	ParamGroup[ParamName]=new ParameterClass(ParamName);
	// Name the interface
	ParamGroup[ParamName].InterfaceID=ParamGroupDivId+ParamName;
	document.getElementById(ParamGroupDivId).innerHTML = document.getElementById(ParamGroupDivId).innerHTML + ParamGroup[ParamName].InterfaceID;
	
}


//   create a new 'form' element 

// Renaming a key for an object
//if (old_key !== new_key) {
//    Object.defineProperty(o, new_key, Object.getOwnPropertyDescriptor(o, old_key));
//    delete o[old_key];
//}
