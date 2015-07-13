// This library requires mathtools.js to work

function ParameterClass(ParameterID, ArrayName, ArrayNumber, InterfaceHolder, NumberOfSamples){// InterfacePrefix
	this.ParameterID=ParameterID;// e.g. HCV.LFHCCProbability
	this.ArrayName=ArrayName;
	this.ArrayNumber=ArrayNumber;
	this.InterfaceID=[];
	
	this.SetInterfaceID(InterfaceHolder);// e.g. HCV.LFHCCProbability
	

	
	this.DistributionType="normal";
	
	//0: normal
	//1: lognormal
	//2: uniform
	//3: optimisedsample //used in a case where the parameters is unknown and an algorithm decides the sample chosen based on the outcome of an optimisation routine
	
	// The following are used for inside the simulations
	//4: exponential
	//5: logitnormal   // used for probability distributions (on [0,1]). Note sigma<1 to avoid strange edge effects
	//6: poisson
	//7: sqrnormal
	
	
	this.Median=NaN;
	this.StandardError=NaN;
	
	this.Upper95Range=NaN;// These values are calculated on the fly by the program, and are displayed in the interface
	this.Lower95Range=NaN;
	this.CalculatedMedian=NaN;
	
	this.NumberOfSamples=NumberOfSamples;
	this.Val=[];//This is the array of the samples
	
	this.MinValue="";// These values are used to put a bound on the values, e.g. many values must not be less than zero.
	this.MaxValue="";
	
	//The Description is used to describe what the variables are and where they are from including URLs and any other calculation
	this.Description=[];//
}

ParameterClass.prototype.SetInterfaceID= function (InterfaceHolder){
	this.InterfaceID=InterfaceHolder+"_"+this.ArrayNumber;
};



//Load the parameter from text
	//or maybe simply bind a JSON object
ParameterClass.prototype.Load= function (InputStructure){
	for (var Key in this){
		if (typeof(InputStructure[Key])!='undefined'){
			this[Key]=InputStructure[Key];
		}
	}
	// Check if there are problems
	if (this.ParameterID===""){
		console.error("Error trace here.");
		throw "ParameterID is not set";
	} 
};


	
ParameterClass.prototype.Name= function (){
	return (this.ArrayName+'['+this.ArrayNumber+']');
};
	
ParameterClass.prototype.UpdateTypeDisplay= function (){
	// Determine estimated value of the mean, IQR and 95% range of the parameters
	this.CalculateUncertaintyBounds();
	
	var ParameterHTML="";
	// Draw the expand and save buttons
	ParameterHTML+="<a onClick=\"ToggleDisplay(this, 'ParamInfoBox');\" style='background-color: #acf;'>[+]</a>\n"+"&nbsp;"+
		"<a  onClick='"+this.Name()+".SaveButtonPressed();' style='background-color: #acf;'>Save</a>  \n";
	
	
	
	
	// Set up the name and parameter type
	ParameterHTML+="<input type='text' name='ParameterID' value='" + this.ParameterID + "' style='width:250px;'>\n"+ 
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
		ParameterHTML+="Min <input type='text' name='MinValue' value='" + this.MinValue + " '>\n"+
		" Max <input type='text' name='MaxValue' value='" + this.MaxValue + " '>\n";
	}
	else if (this.DistributionType=="optimisedsample"){
		ParameterHTML+="Min <input type='text' name='MinValue' value='" + this.MinValue + " '>\n"+
		" Max <input type='text' name='MaxValue' value='" + this.MaxValue + " '>\n";
	}
	
	

	
	// This information exists for all parameters
	ParameterHTML+="<div class='ParamInfoBox' style='display: none;'>\n";
	if (this.DistributionType=="normal" || this.DistributionType=="lognormal"){
		ParameterHTML+="<p>\n"+
		"    Hard distribution bounds: Min <input type='text' name='MinValue' value='" + this.MinValue + " '>\n"+
		"    Max <input type='text' name='MaxValue' value='" + this.MaxValue + " '>\n"+
		"</p>\n";
	}
		
	ParameterHTML+="<p>\n"+
		"    Median <input type='text' name='' value='" + this.CalculatedMedian + " '>\n"+
		"    Lower 95%CI <input type='text' name='' value='" + this.Lower95Range + " '>\n"+
		"    Upper 95%CI <input type='text' name='' value='" + this.Upper95Range + " '>\n"+
		"</p>\n"+
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
};

ParameterClass.prototype.SaveButtonPressed=function(){
	this.Save();
	this.RunUpdateFunction();
};

ParameterClass.prototype.Save=function(){
	// Go through each of the possible elements
	var FieldsList=[];
	
	var FieldNames=['ParameterID',
					'DistributionType',
					'Median',
					'StandardError',
					'Upper95Range',
					'Lower95Range',
					'MinValue',
					'MaxValue',
					'Description'];
					
					
	var FieldTypes=['text',
					'text',
					'number',
					'number',
					'number',
					'number',
					'number',
					'number',
					'text'];
					
					
	// See if it exists
	var ParamElement = document.getElementById(this.InterfaceID);
	// if it exists, set to the value in the Param
	for (var Field in FieldNames){
		if (typeof(ParamElement[FieldNames[Field]])!='undefined'){
			if (FieldTypes[Field]=='number'){
				if (!ParamElement[FieldNames[Field]].value.localeCompare("") || !ParamElement[FieldNames[Field]].value.localeCompare(" ")){
					ParamElement[FieldNames[Field]].value="NaN";
				}
				this[FieldNames[Field]]=Number(ParamElement[FieldNames[Field]].value);

				
				// Special case for min and max values
				if (isNaN(this[FieldNames[Field]])&& (FieldNames[Field]=='MinValue' || FieldNames[Field]=='MaxValue')){
					this[FieldNames[Field]]="";
				}
			}
			else{
				this[FieldNames[Field]]=ParamElement[FieldNames[Field]].value;
			}
		}
	
	}
	
	
	// if the name in the display is different to the name in the 
	
	// if the name changes, update the InterfaceID
	// DetermineInterfaceID(this.Name);
	
	
	this.UpdateTypeDisplay();
};
	
	
	
	
//Load the parameter from interface
	//This requires that the 
//Save this interface as 


ParameterClass.prototype.CalculateUncertaintyBounds= function (){
	if (this.DistributionType=="normal"){
		this.CalculatedMedian=this.Median;
		this.Upper95Range=this.Median+1.96*this.StandardError;
		this.Lower95Range=this.Median-1.96*this.StandardError;
	} 
	else if (this.DistributionType=="lognormal"){
		this.CalculatedMedian=this.Median;
		//log
		var LogMedian=Log(this.Median);
		//calculate //delog
		this.Upper95Range=Exp(LogMedian+1.96*this.StandardError);
		this.Lower95Range=Exp(LogMedian-1.96*this.StandardError);
	}
	else if(this.DistributionType=="uniform"){
		this.CalculatedMedian=(this.MinValue+this.MaxValue)/2;
		this.Lower95Range=this.MinValue+0.05*(this.MaxValue-this.MinValue);
		this.Upper95Range=this.MinValue+0.95*(this.MaxValue-this.MinValue);
	}
	else if(this.DistributionType=="optimisedsample"){
		if (this.Val.length>0){
			this.CalculatedMedian=Median(this.Val);
			this.Lower95Range=Percentile(this.Val, 5);
			this.Upper95Range=Percentile(this.Val, 95);
		}
	}
};

ParameterClass.prototype.CreateDistribution= function (){
	var EmptyString="";
	var RunBounded=false;
	
	var Min, Max;
	if (!EmptyString.localeCompare(this.MinValue)){
		Min=NaN;
	}
	else{
		Min=this.MinValue;
		RunBounded=true;
	}
	if (!EmptyString.localeCompare(this.MaxValue)){
		Max=NaN;
	}
	else{
		Max=this.MaxValue;
		RunBounded=true;
	}
	
	try {
		if (this.DistributionType=="normal"){
			if (RunBounded==false){ // if both bounds are set to empty strings
				this.Val=NormalRandArray(this.Median, this.StandardError, this.NumberOfSamples);
			}
			else{
				if (Max<Min){
					console.error("An error occurred here"+this.ParameterID);
					throw "Min should be smaller than Max";
				}
				this.Val=NormalRandArrayBounded(this.Median, this.StandardError, this.NumberOfSamples, Min, Max);
			}
		}
		if (this.DistributionType=="lognormal"){
			var LogMedian=Log(this.Median);
			
			if (RunBounded==false){ // if both bounds are set to empty strings
				this.Val=NormalRandArray(LogMedian, this.StandardError, this.NumberOfSamples);
			}
			else{
				if (Min<0 ||Max<0){
					console.error("An error occurred here"+this.ParameterID);
					throw "Min and Max cannot be negative";
				}
				if (Max<Min){
					console.error("An error occurred in "+this.ParameterID);
					throw "Min should be smaller than Max";
				}
				//We need to treat the Min specially, in case it is zero
				if (Min==0){
					var LogMin=-1.7976931348623157e+308;
				}else{
					var LogMin=Log(Min);
				}
				var LogMax=Log(Max);
				
				console.log("Median: "+LogMedian+" "+LogMin+" "+LogMax+this.ParameterID);
				
				
				this.Val=NormalRandArrayBounded(LogMedian, this.StandardError, this.NumberOfSamples, LogMin, LogMax);
			}
			
			this.Val=Exp(this.Val);// transform back
		}
		if (this.DistributionType=="uniform"){
			this.Val=RandArray(this.MinValue, this.MaxValue, this.NumberOfSamples);
		}
		if (this.DistributionType=="optimisedsample"){
			this.Val=[];
		}
	}
	catch(err) {
		console.error(err);
		throw "In parameter "+ this.ParameterID;
	}	
};







//**************************************************************************************************************************
// From this point, the code is no longer dealing with individual parameters, but with displaying groups of parameters in a page

function ParameterPage(ParamArray, ParamArrayName, PageName, InterfaceHolder, FileName, NumberOfSamples){
	// Note that Param is passed as a pointer, and hence any changes internal to here affect the entire page
	this.ParamArray=ParamArray;
	this.ParamArrayName=ParamArrayName;
	this.PageName=PageName;
	
	this.InterfaceHolder=InterfaceHolder;
	
	this.NumberOfSamples=NumberOfSamples;
	
	this.FileName=FileName;
	
	
	// for each element in the ParamArray, set the InterfaceID
	for (var key in this.ParamArray){
		this.ParamArray[key].SetInterfaceID(InterfaceHolder);
	}
}


ParameterPage.prototype.Build= function (){

	var BuildText="<div>";
	
	//This next section is very naughty, because it breaks the div by setting the inner HTML. It will probably break.
	BuildText=BuildText+"<div class='SolidButton' style='float:left;' onClick='"+this.PageName+".AddNewParameter(); '>Add parameter</div>";
	BuildText=BuildText+"<div class='SolidButton' style='float:right;' onClick='"+this.PageName+".SaveParameters(); '>Save to file</div></div>"
	
	BuildText=BuildText+"<div id='"+this.PageName+"NewParamBox' style='border-style:solid; border-color: #ffaaaa; position:relative; clear:both;'> </div>";
	
	
	for (var key in this.ParamArray) {// Code inspired by http://stackoverflow.com/questions/208016/how-to-list-the-properties-of-a-javascript-object
		//if (this.ParamArray.hasOwnProperty(key)) {
		//	this.ParamArray[key].InterfaceID=ParamGroupDivId+key;
			BuildText=BuildText+"                <form class=\"ParamContainer\" id=\""+this.ParamArray[key].InterfaceID+"\"></form>\n";
		//}
	}
	


	
	// Set the inner text to the Build text
	document.getElementById(this.InterfaceHolder).innerHTML = BuildText;
	
	//Load each of the holders with the parameters that should be held
	for (var key in this.ParamArray) {
		if (this.ParamArray.hasOwnProperty(key)) {
			//Update display of parameter
			this.ParamArray[key].UpdateTypeDisplay();
		}
	}
};


ParameterPage.prototype.AddNewParameter= function(){
	var ArrayNumber=this.ParamArray.length;
	var ParamName="NewParameter"+ArrayNumber;//The new parameter will be called e.g. NewParam12
	this.ParamArray[ArrayNumber]=new ParameterClass(ParamName, this.ParamArrayName, ArrayNumber, this.InterfaceHolder, this.NumberOfSamples)
	
	// Create the HTML that will be added to the interface
	var HTMLToAdd="\n                <form class=\"ParamContainer\" id=\""+this.ParamArray[ArrayNumber].InterfaceID+"\"></form>";
	var NewParameterHolderName=this.PageName+"NewParamBox";
	
	document.getElementById(NewParameterHolderName).innerHTML = document.getElementById(NewParameterHolderName).innerHTML + HTMLToAdd;
	for (Key in this.ParamArray){
		this.ParamArray[Key].UpdateTypeDisplay();//Update all parameters because changing the HTML forces it to a normal distr. option.
	}
};



ParameterPage.prototype.SaveParameters= function(OptionalFileName){
	// Press save on all the buttons
	for (Key in this.ParamArray){
		this.ParamArray[Key].Save();//Update all parameters because changing the HTML forces it to a normal distr. option.
	}
	
	// Sort the Parameters by ID
	function compare(a,b) {
	  if (a.ParameterID < b.ParameterID)
		 return -1;
	  if (a.ParameterID > b.ParameterID)
		return 1;
	  return 0;
	}
	this.ParamArray.sort(compare);
	
	//Update the array positions
	this.UpdateArrayPositions();
	this.Build();
	
	
	var ParamJSONString=JSON.stringify(this.ParamArray, null, 4);//gives 4 spaces between elements
	var blob = new Blob([ParamJSONString], {type: "text/plain;charset=utf-8"});
	
	var FileName;
	if (typeof(OptionalFileName)=="undefined"){
		FileName=this.FileName;
	}
	else{
		FileName=OptionalFileName;
	}
	
	fs.writeFile(FileName, ParamJSONString , function(err) {
		if(err) {
			alert("There was an error writing to the "+FileName+ " file. See console for details.");
			console.log(err);
		}
	});
};

ParameterPage.prototype.UpdateArrayPositions= function(){
	for (Key in this.ParamArray){
		this.ParamArray[Key].ArrayNumber=Key;
		this.ParamArray[Key].SetInterfaceID(this.InterfaceHolder);
	}
};







function ParameterGroup(GroupName, NumberOfSamples, ParameterFileName){
	this.Name=GroupName;
	this.ParamArray=[];
	this.Page;
	// e.g. ParameterFileName="./data/parameters.json";
	this.FileName=ParameterFileName;
	this.NumberOfSamples=NumberOfSamples;
	this.RecalculateTimestamp=0;
	
	this.UpdateFunction=[];// an array of functions that are called when the Parameter group is updated. 
	// called by this.RunUpdateFunction();
	// add functions by using this.AddUpdateFunction(FunctionPointer)
	// called in the function this.UpdateFunction[i](this);
	// this gives the function called all the data in the Parameter group
}


ParameterGroup.prototype.Load=function(ParameterFileName){
	if (typeof(ParameterFileName)=="undefined"){
		if (typeof(this.FileName)=="undefined"){
			console.error("Error trace");
			throw "The file is not yet specified. Please either load a file using .Load(ParameterFileName), or set a file name manually by setting .FileName=ParameterFileName. e.g. ParameterFileName='./data/parameters.json'";
		}
		else {
			ParameterFileName=this.FileName;
		}
	}
	//else// ParameterFileName=ParameterFileName
	
	
	try {
		var ParamStruct=fs.readFileSync(ParameterFileName, 'utf8');
	}
	catch(err){
		console.error("The file " + ParameterFileName+" could not be loaded. Error: ");
		console.error(err);
		throw "Stopping LoadParameters";
	}
	
	
	//Parse the JSON
	 var ParsedStruct= JSON.parse(ParamStruct);
	
	// Check for problems

	
	var Param=[];
	// Parse into each subgroup
	for (var Key in ParsedStruct){
		// Create a new parameter for each value in the group
		//(ParameterID, ArrayName, ArrayNumber, InterfaceHolder, NumberOfSamples)
		Param[Key]=new ParameterClass("", "", Key, "", 1);// ParameterID, ArrayName, ArrayNumber, InterfaceHolder, NumberOfSamples
		Param[Key].Load(ParsedStruct[Key]);
		// Generate interfaceholder
	}
	
	this.ParamArray=Param;
	
	
};


ParameterGroup.prototype.Save=function(ParameterFileName){
	this.Page.SaveParameters(ParameterFileName);
};



ParameterGroup.prototype.CreateParameterPage=function(DivNameForParameterInfo){
	if (typeof(this.FileName)=="undefined"){
		console.error("Error trace");
		throw "The file is not yet specified. Please either load a file using .Load(ParameterFileName), or set a file name manually by setting .FileName=ParameterFileName. e.g. ParameterFileName='./data/parameters.json'";
	}
	// ParameterPage(ParamArray, ParamArrayName, PageName, InterfaceHolder, FileName, NumberOfSamples)
	this.Page=new ParameterPage(this.ParamArray, this.Name+".ParamArray", this.Name+".Page", DivNameForParameterInfo, this.FileName, this.NumberOfSamples);
	this.Page.Build();
};


ParameterGroup.prototype.Recalculate=function(NumberOfSamples){
	this.RecalculateTimestamp=new Date().getTime();
	
	
	this.NumberOfSamples=NumberOfSamples;
	this.Page.NumberOfSamples=NumberOfSamples;
	for (var ParamCount in this.ParamArray){
		this.ParamArray[ParamCount].NumberOfSamples=NumberOfSamples;
		this.ParamArray[ParamCount].CreateDistribution();
	}
};


// The following code takes an array of parameters with samples in each, and splits it into an array of parameter set objects that can be passed to individual simulations
ParameterGroup.prototype.ParameterSplit=function(){
	var ParamObject=[];
	for (var SimCount=0; SimCount<this.NumberOfSamples; SimCount++){
		ParamObject[SimCount]={};
		for (var ParamCount in this.ParamArray){
			var ParamName=this.ParamArray[ParamCount].ParameterID;
			var ValueToStore=this.ParamArray[ParamCount].Val[SimCount];
			
			// This takes the current ParamName, and adds it to the structure ParamObject[SimCount]
			this.__ParameterSplitByPeriod(ParamObject[SimCount], ParamName, ValueToStore);
			// If there is an underscore in the name
		}
	}
	return ParamObject;
};

ParameterGroup.prototype.__ParameterSplitByPeriod=function(ParamObject, ParamName, Value){
	// If there is no underscore in the name
	if(ParamName.indexOf('.') == -1){
		ParamObject[ParamName]=Value;// return the value of the param to store
	}
	else{
		//Split off the first part
		var FirstPart=ParamName.substr(0,ParamName.indexOf('.'));
		var SecondPart=ParamName.substr(ParamName.indexOf('.')+1);
		
		if (typeof(ParamObject[FirstPart])==="number"){
			console.error("Error trace");
			throw "There is a problem with defining the object, which could mean that a parameter group is called the same thing as a parameter";
		}
		if (typeof(ParamObject[FirstPart])==="undefined"){
			// Create the subelement
			ParamObject[FirstPart]={};
		}
		
		this.__ParameterSplitByPeriod(ParamObject[FirstPart], SecondPart, Value);
	}
	// There is no return, because under javascript, the modifications made to ParamObject should be maintained as it is passed back through the recursions
};

ParameterGroup.prototype.AddUpdateFunction=function(FunctionPointer){
	this.UpdateFunction.push(FunctionPointer);
};

ParameterGroup.prototype.RunUpdateFunction=function(){
	for (var i in this.UpdateFunction){
		this.UpdateFunction[i](this);
	}
};










ParameterGroup.prototype.CreateOptimisationStructure=function(ArrayOfParamNameToOptimise){
	var OptimisationObject=[];
	
	for (var OptKey in ArrayOfParamNameToOptimise){
		// find the relevant parameter name in the array
		var Found=false;
		for (var ThisParamKey in this.ParamArray){//inefficient, but not worth optimising
			console.log(this.ParamArray[ThisParamKey]);
			if (this.ParamArray[ThisParamKey].ParameterID==ArrayOfParamNameToOptimise[OptKey]){
				Found=true;
				if (this.ParamArray[ThisParamKey].DistributionType!="optimisedsample"){
					console.error(this.ParamArray[ThisParamKey]);
					throw "The parameter "+this.ParamArray[ThisParamKey]+" is not an optimisedsample parameter";
				}
				
				OptimisationObject[OptKey]={};
				OptimisationObject[OptKey].Name=ArrayOfParamNameToOptimise[OptKey];
				OptimisationObject[OptKey].MinValue=this.ParamArray[ThisParamKey].MinValue;
				OptimisationObject[OptKey].MaxValue=this.ParamArray[ThisParamKey].MaxValue;
				// OptimisationObject[OptKey].StartValue=this.ParamArray[ThisParamKey].StartValue;
			}
		}
		if (Found==false){
			console.error("Error trace");
			throw "The parameter "+ArrayOfParamNameToOptimise[OptKey]+" was not found.";
		}
	}
	
	return OptimisationObject;
};

ParameterGroup.prototype.AddOptimisationResults= function(ArrayOfOptimisedParam){
	
	
	// update the interface to show the mean and 95% ranges, be lazy and update the whole thing
	
};

// var PGroup= new ParameterGroup("PGroup");
// PGroup.Load("./data/parameters.json")
// PGroup.CreateParameterPage("OtherContent");





// testing
function ParameterSplitTest(){
	console.error("This function is to be used for testing purposes only");
	// Create the parameters
	TestParam=[];//global 
	TestParam[0]=new ParameterClass("JJJ", "empty");
	TestParam[0].DistributionType="normal";
	TestParam[0].Median=5;
	TestParam[0].StandardError=2;
	TestParam[0].NumberOfSamples=100;
	TestParam[0].CreateDistribution();
	
	TestParam[1]=new ParameterClass("KKK.Subjjj", "empty");
	TestParam[1].DistributionType="uniform";
	TestParam[1].MinValue=10;
	TestParam[1].MaxValue=20;
	TestParam[1].NumberOfSamples=100;
	TestParam[1].CreateDistribution();
	
	TestParam[2]=new ParameterClass("KKK.Subkkk", "empty");
	TestParam[2].DistributionType="lognormal";
	TestParam[2].Median=21;
	TestParam[2].StandardError=0.17;
	TestParam[2].NumberOfSamples=100;
	TestParam[2].CreateDistribution();
	
	TestParam[3]=new ParameterClass("AAA.1", "empty");
	TestParam[3].DistributionType="lognormal";
	TestParam[3].Median=21;
	TestParam[3].StandardError=0.17;
	TestParam[3].NumberOfSamples=100;
	TestParam[3].CreateDistribution();
	
	TestParam[4]=new ParameterClass("AAA.2", "empty");
	TestParam[4].DistributionType="lognormal";
	TestParam[4].Median=100;
	TestParam[4].StandardError=0.17;
	TestParam[4].NumberOfSamples=100;
	TestParam[4].CreateDistribution();
	
	TestSplitParam=ParameterSplit(TestParam, 100);
	
	console.log(TestSplitParam);
}