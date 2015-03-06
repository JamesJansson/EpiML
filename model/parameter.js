// This library requires mathtools.js to work

function ParameterClass(ParameterID, GroupName){// InterfacePrefix


this.ParameterID=ParameterID;// e.g. LFHCCProbability
this.InterfaceID="";// e.g. HCV_LFHCCProbability
// Note that GroupName is primarily used for interface design. It is updated at load to represent the true structure of the objects in which it resides, so it cannot be relied upon to be consistent between builds.
this.GroupName="";//e.g. HCV, or in the case of it being a struct of a struct, Param.HCV
//GroupName+'.'+ParameterID gives the full name that the function can call. 

this.DistributionType="uniform";
//0: uniform
//1: normal
//2: lognormal
//3: optimisedsample //used in a case where the parameters is unknown and an algorithm decides the sample chosen based on the outcome of an optimisation routine

// The following are used for inside the simulations
//4: exponential
//5: logitnormal   // used for probability distributions (on [0,1]). Note sigma<1 to avoid strange edge effects
//6: poisson
//7: sqrnormal


this.Median=NaN;
this.StandardError=NaN;
this.LowerBound=NaN;//used for uniform distributions
this.UpperBound=NaN;//used for uniform distributions



this.Upper95Range=NaN;// These values are calculated on the fly by the program, and are displayed in the interface
this.Lower95Range=NaN;

this.NumberOfSamples=NaN;
this.Val=[];//This is the array of the samples

this.MinValue="";// These values are used to put a bound on the values, e.g. many values must not be less than zero.
this.MaxValue="";

//The Description is used to describe what the variables are and where they are from including URLs and any other calculation
this.Description=[];//
}

//Load the parameter from text
	//or maybe simply bind a JSON object
ParameterClass.prototype.Load= function (InputStructure){
	for (var Key in this){
		if (typeof(InputStructure[Key])!='undefined'){
			this[key]=InputStructure[Key];
		}
	}
}	


	
ParameterClass.prototype.Name= function (){
	return (this.GroupName+'.'+this.ParameterID);
}	
	
ParameterClass.prototype.UpdateTypeDisplay= function (){
	// Set up the name and parameter type
	var ParameterHTML=""+
	"<input type='text' name='ParameterID' value='" + this.ParameterID + "'>\n"+ 
	"<select name='DistributionType'  onchange='"+this.Name()+".DistributionType=this.value;"+this.Name()+".UpdateTypeDisplay();'>\n"+//change the type, then redisplay
	
	"	<option value='normal'>Normal</option>\n"+
	"	<option value='lognormal'>Log Normal</option>\n"+
	"	<option value='uniform'>Uniform</option>\n"+
	"	<option value='optimisedsample'>Optimised Sample</option>\n"+
	
	"</select>\n ";
	
	
	if (this.DistributionType=="normal"){
		ParameterHTML+="Median <input type='text' name='Median' value='" + this.Median + " '>\n"+
		" Standard error <input type='text' name='StandardError' value='" + this.StandardError + " '>\n";
	}
	else if (this.DistributionType=="lognormal"){
		ParameterHTML+="Median <input type='text' name='Median' value='" + this.Median + " '>\n"+
		" Standard error of log <input type='text' name='StandardError' value='" + this.StandardError + " '>\n";
	}
	else if (this.DistributionType=="uniform"){
		ParameterHTML+="Lower Bound <input type='text' name='LowerBound' value='" + this.LowerBound + " '>\n"+
		" Upper Bound <input type='text' name='UpperBound' value='" + this.UpperBound + " '>\n";
	}
	else if (this.DistributionType=="optimisedsample"){
		ParameterHTML+="Lower Bound <input type='text' name='LowerBound' value='" + this.LowerBound + " '>\n"+
		" Upper Bound <input type='text' name='UpperBound' value='" + this.UpperBound + " '>\n";
	}
	
	
	
	// onchange="Settings.NumberOfSimulations=Number(this.value);SaveSettings();"
	// onchange="ID.Change(this.Name, this.value)";
	// in the function Number(this.value); SaveParameterFile();
	
	
	//
	//		
	//		
	//			
	//		Median <input type="text" name="Median"> 
	//		SD <input type="text" name="SD"> 
	//		<a onClick="ToggleDisplay(this, 'ParamInfoBox');">+ More info</a>
	//		<div class="ParamInfoBox" style="display: none;"> Some info to display </div>
	// 
	
	// Determine estimated value of the mean, IQR and 95% range of the parameters
	this.CalculateUncertaintyBounds();
	// Display this information to the user
	
	// Save button
		// When pressed, 
		// Get the values from all the fields
		// save the value to Param
		// Save Param
	
	// This information exists for all parameters
	ParameterHTML=ParameterHTML+
		"<a  onClick='"+this.Name()+".Save();' style='background-color: #acf;'> Save</a>  \n"+
		"<a onClick=\"ToggleDisplay(this, 'ParamInfoBox');\" style='background-color: #acf;'> + More info </a>\n"+
		"<div class='ParamInfoBox' style='display: none;'>\n"+
		"<p>\n"+
		"    Median <input type='text' name='' value='" + this.Median + " '>\n"+
		"    Lower 95%CI <input type='text' name='' value='" + this.Lower95Range + " '>\n"+
		"    Upper 95%CI <input type='text' name='' value='" + this.Upper95Range + " '>\n"+
		"    <p>Description</p>"+
		"    <textarea name='Description' cols='100' rows='5'>"+this.Description+"</textarea>";
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
	
ParameterClass.prototype.Save=function(){
	console.log("Button pressing works");

	// Go through each of the possible elements
	var FieldNames=['ParameterID',
					'InterfaceID',
					'DistributionType',
					'Median',
					'StandardError',
					'LowerBound',
					'UpperBound',
					'Upper95Range',
					'Lower95Range',
					'MinValue',
					'MaxValue',
					'Description'];
	// See if it exists
	var ParamElement = document.getElementById(this.InterfaceID);
	// if it exists, set to the value in the Param
	for (var Field in FieldNames){
		console.log(FieldNames[Field]);
		if (typeof(ParamElement[FieldNames[Field]])!='undefined'){
			this[FieldNames[Field]]=ParamElement[FieldNames[Field]].value;
			
			console.log(this[FieldNames[Field]]);
		}
	
	}
	
	console.error('Need to convert to numbers before this will work. Spaces making your life tough');
	
	
	
	
	// if the name in the display is different to the name in the 
	
	// if the name changes, update the InterfaceID
	var OldId=this.InterfaceID;
	// DetermineInterfaceID(this.Name);
	
	
	this.UpdateTypeDisplay();
}	
	
	
	
	
//Load the parameter from interface
	//This requires that the 
//Save this interface as 


ParameterClass.prototype.CalculateUncertaintyBounds= function (){
	if (this.DistributionType=="normal"){
		this.Upper95Range=this.Median+1.96*this.StandardError;
		this.Lower95Range=this.Median-1.96*this.StandardError;
	} 
	else if (this.DistributionType=="lognormal"){
		//log
		var LogMean=Log(this.Median);
		//calculate //delog
		this.Upper95Range=Exp(LogMean+1.96*this.StandardError);
		this.Lower95Range=Exp(LogMean-1.96*this.StandardError);
	}
}

ParameterClass.prototype.CreateDistribution= function (){
	
	if (this.distributionType=="lognormal"){
		//log
		var logmedian=Math.log(this.Median);
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
	BuildText=BuildText+"<div class='SolidButton' onClick='AddNewParameter("+GroupName+", \""+GroupName+"\", \""+ParamGroupDivId+"\"); '>Add parameter</div>"
	BuildText=BuildText+"<p>Unsaved parameters <\p>";
	document.getElementById(ParamGroupDivId).innerHTML = BuildText;
	
	//Load each of the holders with the parameters that should be held
	for (var key in ParamGroup) {
		if (ParamGroup.hasOwnProperty(key)) {
			//Update display of parameter
			ParamGroup[key].UpdateTypeDisplay();
		}
	}
}


function AddNewParameter(ParamGroup, GroupName, ParamGroupDivId){
	//Count number of current 
	var NumParams=1;
	for (var key in ParamGroup) {
		NumParams++;
	}
	var ParamName="NewParam"+NumParams;//The new parameter will be called e.g. NewParam12
	ParamGroup[ParamName]=new ParameterClass(ParamName);
	// Add the GroupName
	ParamGroup[ParamName].GroupName=GroupName;
	
	
	// Name the interface
	ParamGroup[ParamName].InterfaceID=ParamGroupDivId+ParamName;
	HTMLToAdd="\n                <form class=\"ParamContainer\" id=\""+ParamGroup[ParamName].InterfaceID+"\"></form>";
	document.getElementById(ParamGroupDivId).innerHTML = document.getElementById(ParamGroupDivId).innerHTML + HTMLToAdd;
	
	console.log(ParamGroup[ParamName].Name());
	console.log(ParamGroup[ParamName].GroupName);
	
	ParamGroup[ParamName].UpdateTypeDisplay();
}


//   create a new 'form' element 

// Renaming a key for an object
//if (old_key !== new_key) {
//    Object.defineProperty(o, new_key, Object.getOwnPropertyDescriptor(o, old_key));
//    delete o[old_key];
//}


// Load parameters from a file
function LoadParameters(ParameterFileName){
	// Open the file	
	var ParamStruct=fs.readFileSync("./model/parameters.json", 'utf8');
	console.log(ParamStruct);
	
	console.error("Note that file error handling has not yet been implemented. Maybe use a try/catch system. Determine how to use readFileSync properly to ensure that the lack of the file is handled properly.");
	var ParamStruct=fs.readFileSync("./model/parameters.json", 'utf8', function (err, data) {
		console.log("1");
		if (err){
			console.error("The file " + ParameterFileName+" could not be loaded. Error: ");
			console.error(err);
			var ParsedStruct={};
			ParsedStruct.ParamLoadingError=err;
			return ParsedStruct;
		}
		else{
			// Parse the JSON
			var ParsedStruct= JSON.parse(data);
			return ParsedStruct;
		}
	});
	console.log(ParamStruct);
	// Check for error
	if (typeof(ParamStruct.ParamLoadingError)!='undefined'){
		return ParamStruct;
	}
	
	// Check for problems
	
	
	var Param={};
	// Parse into each subgroup
	for (var Key in ParamStruct){
		// Create a new parameter for each value in the group
		Param[Key]={};
		for (var Key2 in ParamStruct[Key]){
			Param[Key][Key2]=new ParameterClass(Key2);
			Param[Key][Key2].Load(ParamStruct[Key][Key2]);
		}
	}
	return Param;
}


// Save parameters to file
