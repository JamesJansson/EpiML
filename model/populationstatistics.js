// This file contains functions that are designed to summarise information about individuals in the simulation. 
// There are two main types of statistics:
// 1) Instantaneous count at that point in time e.g. total number of people currently infected with HCV on 1/6/2013
// 2) Total number of events that occur over a period e.g. the number of infections that occur over a period 2013=2016

// A summary stats call is structured as follows:
// 1) The name of the variable that you want to observe
// 2) The particular status of the variable you want to observe
// 3) The conditions on the person to be included. All people are included unless otherwise stated
// 3.1) An array of set values or
// 3.2) A range of values (inclusive)
// 4) The year that you want to observe it


 
// Example usage

/*
// Count of prevalent cases of HIV
Settings.Name="Currently Living With HIV";
Settings.XLabel="Year";
Settings.YLabel="Currently Living With HIV";
Settings.Type="InstantaneousCount";

Settings.Function= function (Individual, Time){
	if (Individual.HIVInfection<Time && Individual.Alive(Time)){
		return true; //count this individual
	}
	else{
		return false; //don't count this individual
	}
}

CurrentlyLivingWithHIV=new SummaryStatistic(Settings); //Create the summary statistic
CurrentlyLivingWithHIV.run(Population); //Population is an array individuals



// Count of prevalent cases into multiple categories
// A categorical function example might be to look at people with HIV above or below 50 years of age. 
// Define the function as below:

Settings.Function= function (Individual, Time){
	if (Individual.HIVInfection<Time && Individual.Alive(Time)){
		if (Individual.Age(Time)<50){
			return 0;// first category
		}
		else{//over 50
			return 1;// second category
		}
	}
	else{
		return NaN;// no category
	}
}
*/


function CountStatistic(Settings, InputFunction){
	this.Name="";
	// A descriptive text entry about the statistic (optional)
	
	this.XLabel="Time";
	// A string that would be placed on the x axis of the graph (e.g. Year, Month, etc) (optional)
	
	this.YLabel="Value";
	// A string that would be placed on the y axis of the graph (e.g. Diagnoses, Infections, etc) (optional)
	
	this.StatisticType="countstatistic"; // this is an indicator for the main program to use in case the object information gets stripped passing between workers
	
	this.CountType="";
	// 'Instantaneous': how many people at time t have quality a (good for prevalence etc) (mandatory)
	// 'Count': how many events between two times occur to each person. This value is added to an aggregate 
	
	
	this.VectorFunction=false;
	// VectorFunction is a flag to indicate whether Function has arguments of (optional, defaults to non-vector function)
	// false: Function(Person, Time) and returns a single value at time or
	// true: Function(Person, StartTime, EndTime, StepSize)and returns a vector of values over the times specified
	// Setting this flag to true will allow the vector in summary statistic to to be filled by the function under inspection (e.g. EventVector) that could be a lot faster
	
	this.MultipleCategories=false;
	// MultipleCategories is a flag to indicate whether Function returns (optional, defaults to simple count)
	// true or false, or it returns an index
	// This flag can only be used with InstantaneousCount. 
	// It cannot be used with CountEvents
	
	this.NumberOfCategories=1; 
	//(mandatory if MultipleCategories==true)
	
	this.CategoryLabel=[];
	// Used to store the text associated with the categorical numbers (optional)
	
	//this.Function; 
	// Function is user defined
	// If CountType=='Instantaneous' it returns either a 0 or a 1 given a specific time
	// If CountType=='Count' it returns a number >= 0, and is given StartTime, EndTime
	
	// If VectorFunction==true if returns a vector over the period stated
	

	
	
	this.Time=[];//the reference time for when the statistic was taken
	this.Count=[];//where the counts are stored
	
	// Set the settings
	if (typeof Settings.Name === 'string'){
		this.Name=Settings.Name;
	}
	if (typeof Settings.XLabel === 'string'){
		this.XLabel=Settings.XLabel;
	}
	if (typeof Settings.YLabel === 'string'){
		this.YLabel=Settings.YLabel;
	}
	
	//  Set the CountType of statistic to be collected
	if (typeof Settings.CountType === 'string'){
		this.CountType=Settings.CountType;
	}
	else{
		console.error("A CountType must be specified. CountTypes include: Instantaneous: how many people at time t have quality a (good for prevalence etc), Events: how many events between two times occur to each person. This value is added to an aggregate.") ;
	}
	
	//Set whether the function will be a boolean operator or not.
	if (typeof Settings.VectorFunction === 'boolean'){
		this.VectorFunction=Settings.VectorFunction;
	}
	else if (typeof Settings.VectorFunction != 'undefined'){
		console.error("CountStatistic: VectorFunction must be a boolean operator");
	}
	
	
	
	// Set the Category settings
	if (typeof Settings.MultipleCategories === 'boolean'){
		if (Settings.MultipleCategories==true){
			this.MultipleCategories=true;
			if (typeof Settings.NumberOfCategories === 'number'){
				this.NumberOfCategories=Settings.NumberOfCategories;
				if (typeof Settings.CategoryLabel === 'object'){
					this.CategoryLabel=Settings.CategoryLabel;
				}
			}
			else {
				console.error("CountStatistic: If MultipleCategories is true, NumberOfCategories must be set to a whole number >1;")
			}
		}
	}
	else if (typeof Settings.MultipleCategories != 'undefined'){
		console.error("CountStatistic: MultipleCategories should have only a value of true or false");
	}
	
	// Set the function for the summary statistic
	if (typeof InputFunction === 'function'){
		this.Function=InputFunction;
	}
	else{
		console.error("A function must be set that returns the value to be included in the statistic");
	}
	
	PopStatStepUpTime(Settings.Time, this);
}

CountStatistic.prototype.Run=function(Population){
	// Set up the Count array
	if (this.MultipleCategories==false){// inspecting only a single category
		
		
		if (this.CountType.toLowerCase()=='instantaneous'){
			this.Count=ZeroArray(this.NumberOfTimeSteps);
			this.InstantaneousCount(Population);
		}
		else if (this.CountType.toLowerCase()=='events'){
			this.Count=ZeroArray(this.NumberOfTimeSteps-1);
			this.CountEvents(Population);
		}
	}
	else{ // If there are a number of categories
		this.Count=ZeroMatrix(this.NumberOfCategories, this.NumberOfTimeSteps);
		
		if (this.CountType.toLowerCase()=='instantaneous'){
			this.InstantaneousCountCategorical(Population);
		}
		else if (this.CountType.toLowerCase()=='events'){
			console.error("Please do not use countevents and MultipleCategories together");
		}
	}

	// Destroy the function to make passing back to the main thread easy (the function can break parallelisation)
	this.Function=null;//The function seems to need to be destroyed before passing the results back to the main controller of the webworker
	
}

CountStatistic.prototype.InstantaneousCount= function (Population){//Used to determine the number of people that satisfy a condition at a particular point in time
	for (var PersonIndex=0; PersonIndex<Population.length; PersonIndex++){
		for (var TimeIndex=0; TimeIndex<this.Time.length; TimeIndex++){
			if (this.Function(Population[PersonIndex], this.Time[TimeIndex])==true){
				this.Count[TimeIndex]++;
			}
		}
	}
}

CountStatistic.prototype.InstantaneousCountCategorical= function (Population){//Used to determine the number of people that satisfy a condition at a particular point in time
	var CategoryIndex;
	for (var PersonIndex=0; PersonIndex<Population.length; PersonIndex++){
		for (var TimeIndex=0; TimeIndex<this.Time.length; TimeIndex++){
			CategoryIndex=this.Function(Population[PersonIndex], this.Time[TimeIndex]);
			if (CategoryIndex>=0){//if it is not equal to NaN
				this.Count[CategoryIndex][TimeIndex]++;
			}
		}
	}
}



CountStatistic.prototype.CountEvents= function (Population){//Used to count how many times something happens over a number of finite periods
	for (var PersonIndex=0; PersonIndex<Population.length; PersonIndex++){
		for (var TimeIndex=0; TimeIndex<this.Time.length-1; TimeIndex++){
			if (this.Function(Population[PersonIndex], this.Time[TimeIndex])==true){
				this.Count[TimeIndex]+=this.Function(Population[PersonIndex], this.Time[TimeIndex], this.Time[TimeIndex+1]);
			}
		}
	}
};




// Factor: multiply by a factor to accommodate for using a representative sample, for example
CountStatistic.prototype.Adjust= function (Multiplier){
	// for all of the counting functions
	this.Count=Multiply(this.Count, Multiplier);
}

function DownloadCountStatisticCSV(InputStat, FileName){
	// This function creates a formatted CSV that allows the data to be manipulated in a program like excel
	// List all the descriptors at the top
	// Identifier, Value
	var CSVMatrix=[];
	CSVMatrix[0]=["Name", InputStat.Name];
	CSVMatrix[1]=["XLabel", InputStat.XLabel];
	CSVMatrix[2]=["YLabel", InputStat.YLabel];
	CSVMatrix[3]=[""];// Blank line for looks
	
	CSVMatrix[4]=InputStat.CategoryLabel;
	CSVMatrix[4].unshift(InputStat.XLabel);
	var DataMatrix=InputStat.Count;
	DataMatrix.unshift(InputStat.Time); 
	
	TDataMatrix=TransposeForCSV(DataMatrix);
	
	// add this matrix to the CSV file
	CSVMatrix=CSVMatrix.concat(TDataMatrix);
	
	var csv = Papa.unparse(CSVMatrix);
	var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
	if (typeof(FileName) == 'undefined'){
		saveAs(blob, "data.csv");
	}
	else{
		saveAs(blob, FileName);
	}
}


//****************************************************************************************************
function PopStatStepUpTime(Time, ThisStatistic){
	// Set the times for the summary statistic
	// The user can set either
	// Settings.Time to a vector of times or
	// Settings.StartTime, Settings.EndTime and Settings.StepSize (optional)
	if (typeof Time != 'undefined'){ // if the user set the times individually
		if (typeof Time.length == 'undefined'){
			// This is where we set up the time using the timestep (i.e. if Time is not an array)
			
			// Check required input variables exist
			if (typeof Time.StartTime === 'number'){
				ThisStatistic.StartTime=Time.StartTime;
			}
			else{
				console.log(Time);
				console.error("CountStatistic: StartTime must be set");
				throw "Statistic cannot be calculated";
			}
			
			if (typeof Time.EndTime === 'number'){
				ThisStatistic.EndTime=Time.EndTime;
				if (ThisStatistic.EndTime<ThisStatistic.StartTime){
					console.error("End time cannot be before start time");
					throw "Statistic cannot be calculated";
				}
			}
			else{
				console.error("CountStatistic: StartTime and EndTime or Time[] must be set");
				throw "Statistic cannot be calculated";
			}
			
			ThisStatistic.StepSize=1;//set by default to 1
			if (typeof Time.StepSize === 'number'){
				ThisStatistic.StepSize=Time.StepSize;
			}
			// Set up the time vector
			var CurrentTimeStep=ThisStatistic.StartTime;
			ThisStatistic.NumberOfTimeSteps=Math.round((ThisStatistic.EndTime-ThisStatistic.StartTime)/ThisStatistic.StepSize)+1; //This is used to avoid rounding errors
			for (var TimeIndex=0; TimeIndex<ThisStatistic.NumberOfTimeSteps; TimeIndex++){
				ThisStatistic.Time[TimeIndex]=CurrentTimeStep;
				CurrentTimeStep=CurrentTimeStep+ThisStatistic.StepSize;// Increment the time step
			}
			
			
			
		}
		else{
			ThisStatistic.StartTime=Time[0];
			ThisStatistic.EndTime=Time[Settings.Time.length-1];
			ThisStatistic.Time=Time;
			ThisStatistic.NumberOfTimeSteps=Time.length;
		}
	}
	else{
		throw "Settings.Time should be set. Time can either be an array, OR can have Time.Start, Time.End, Time.Step ";
		
	}
}

//****************************************************************************************************

function SummaryStatistic(Settings, InputFunction){
	this.Name="";
	// A descriptive text entry about the statistic (optional)
	
	this.XLabel="Time";
	// A string that would be placed on the x axis of the graph (e.g. Year, Month, etc) (optional)
	
	this.YLabel="Value";
	// A string that would be placed on the y axis of the graph (e.g. Diagnoses, Infections, etc) (optional)
	
	this.StatisticType="summarystatistic"; // this is an indicator for the main program to use in case the object information gets stripped passing between workers
	
	
	this.VectorFunction=false;
	// VectorFunction is a flag to indicate whether Function has arguments of (optional, defaults to non-vector function)
	// false: Function(Person, Time) and returns a single value at time or
	// true: Function(Person, StartTime, EndTime, StepSize)and returns a vector of values over the times specified
	// Setting this flag to true will allow the vector in summary statistic to to be filled by the function under inspection (e.g. EventVector) that could be a lot faster
	
	//this.Function; 
	// Function is user defined
	// If VectorFunction==true if returns a vector over the period stated
	
	this.StartTime=0;
	this.EndTime=1;
	this.StepSize=1;//set by default to 1
	
	
	this.Time=[]; //the reference time for when the statistic was taken
	// A vector/table that stores the results for each eligible person until the simulation is ready to do calculations such as mean etc
	// this value should be deleted at the end of extraction, as it could get extremely large.
	
	this.N=[];
	this.Sum=[];
	this.Mean=[];
	this.Median=[];
	this.Upper95Percentile=[];
	this.Lower95Percentile=[];
	this.StandardDeviation=[];
	this.UpperQuartile=[];
	this.LowerQuartile=[];
	this.Max=[];
	this.Min=[];
	
	
	// Set the settings
	if (typeof Settings.Name === 'string'){
		this.Name=Settings.Name;
	}
	if (typeof Settings.XLabel === 'string'){
		this.XLabel=Settings.XLabel;
	}
	if (typeof Settings.YLabel === 'string'){
		this.YLabel=Settings.YLabel;
	}
	
	// Set the function for the summary statistic
	if (typeof InputFunction === 'function'){
		this.Function=InputFunction;
	}
	else{
		console.error("A function must be set that returns the value to be included in the statistic");
	}
	
	
	//Set whether the function will be a boolean operator or not.
	if (typeof Settings.VectorFunction === 'boolean'){
		console.error("VectorFunction is likely to be depreciated");
		this.VectorFunction=Settings.VectorFunction;
	}
	else if (typeof Settings.VectorFunction != 'undefined'){
		console.error("SummaryStatistic: VectorFunction must be set to true or false");
	}
	
	
	PopStatStepUpTime(Settings.Time, this);
	
	
	console.log(this.Time);
}

SummaryStatistic.prototype.Run=function(Population){
	var ValueStorage=[];
	// A vector/table that stores the results for each eligible person until the simulation is ready to do calculations such as mean etc
	// this value should be deleted at the end of extraction, as it could get extremely large.

	
	// Set up the time vector
	var CurrentTimeStep=this.StartTime;
	this.NumberOfTimeSteps=Math.round((this.EndTime-this.StartTime)/this.StepSize)+1; //This is used to avoid rounding errors
	for (var TimeIndex=0; TimeIndex<this.NumberOfTimeSteps; TimeIndex++){
		this.Time[TimeIndex]=CurrentTimeStep;
		CurrentTimeStep=CurrentTimeStep+this.StepSize;// Increment the time step
		ValueStorage[TimeIndex]=[];
	}
	

	
	// Determine if it is a vector returning function
	if (this.VectorFunction==false){
		var ReturnedResult;
		for (var PersonIndex=0; PersonIndex<Population.length; PersonIndex++){
			for (var TimeIndex=0; TimeIndex<this.Time.length; TimeIndex++){
				ReturnedResult=this.Function(Population[PersonIndex], this.Time[TimeIndex]);
				if (isNaN(ReturnedResult)){// using NaN to represent missing data
					// Do nothing
				}
				else{//Push the value to the end of the ValueStorage
					ValueStorage[TimeIndex].push(ReturnedResult);
				}
			}
		}
	}
	else{// using a vector function to return the result
		var ReturnedArray;
		var ReturnedResult;
		for (var PersonIndex=0; PersonIndex<Population.length; PersonIndex++){
			ReturnedArray=this.Function(Population[PersonIndex], this.Time[0], this.TimeStep);
			if (ReturnedArray.length!=TimeIndex.length){
				console.error("The returned array was not of the same length as the time vector");
			}
			for (var TimeIndex=0; TimeIndex<this.Time.length; TimeIndex++){
				ReturnedResult=ReturnedArray[TimeIndex];
				if (isNaN(ReturnedResult)){// using NaN to represent missing data
					// Do nothing
				}
				else{//Push the value to the end of the ValueStorage
					ValueStorage[TimeIndex].push(ReturnedResult);
				}
			}
		}
	}
			

	
	// Perform statistical analyses
	for (var TimeIndex=0; TimeIndex<this.Time.length; TimeIndex++){
		this.N[TimeIndex]=ValueStorage[TimeIndex].length;
		
		this.Sum[TimeIndex]=Sum(ValueStorage[TimeIndex]);
		this.Mean[TimeIndex]=Mean(ValueStorage[TimeIndex]);
		this.Median[TimeIndex]=Median(ValueStorage[TimeIndex]);
		this.Upper95Percentile[TimeIndex]=Percentile(ValueStorage[TimeIndex], 97.5);
		this.Lower95Percentile[TimeIndex]=Percentile(ValueStorage[TimeIndex], 2.5);
		this.StandardDeviation[TimeIndex]=SampleStandardDeviation(ValueStorage[TimeIndex]);
		this.UpperQuartile[TimeIndex]=Percentile(ValueStorage[TimeIndex], 75);
		this.LowerQuartile[TimeIndex]=Percentile(ValueStorage[TimeIndex], 25);
		this.Max[TimeIndex]=Max(ValueStorage[TimeIndex]);
		this.Min[TimeIndex]=Min(ValueStorage[TimeIndex]);
	}
		
	// Destroy the function to make passing back to the main thread easy (the function can break parallelisation)
	this.Function={};//The function seems to need to be destroyed before passing the results back to the main controller of the webworker
}




SummaryStatistic.prototype.Adjust= function (Multiplier){
	// for all of the counting functions
	this.N=Multiply(this.N, Multiplier);
}


function DownloadSummaryStatisticCSV(InputStat, FileName){
	// This function creates a formatted CSV that allows the data to be manipulated in a program like excel
	// List all the descriptors at the top
	// Identifier, Value
	var CSVMatrix=[];
	CSVMatrix[0]=["Name", InputStat.Name];
	CSVMatrix[1]=["XLabel", InputStat.XLabel];
	CSVMatrix[2]=["YLabel", InputStat.YLabel];
	CSVMatrix[3]=[""];// Blank line for looks
	
	CSVMatrix[4]=["Time", "N", "Mean", "Median", "StandardDeviation", "Lower95Percentile", "Upper95Percentile", "LowerQuartile", "UpperQuartile", "Min", "Max", "Sum"];
	var DataMatrix=[InputStat.Time, InputStat.N, InputStat.Mean, InputStat.Median, InputStat.StandardDeviation, InputStat.Lower95Percentile, InputStat.Upper95Percentile, InputStat.LowerQuartile, InputStat.UpperQuartile, InputStat.Min, InputStat.Max, InputStat.Sum];
	
	var TDataMatrix=TransposeForCSV(DataMatrix);
	
	// add this matrix to the CSV file
	CSVMatrix=CSVMatrix.concat(TDataMatrix);
	
	var csv = Papa.unparse(CSVMatrix);
	var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
	if (typeof(FileName) == 'undefined'){
		saveAs(blob, "data.csv");
	}
	else{
		saveAs(blob, FileName);
	}
}

function TransposeForCSV(DataMatrix){
	// Below we check for the longest length, they should be the same length but just in case
	var VecLength=0;
	for (var A in DataMatrix){
		if (DataMatrix[A].length>VecLength){
			VecLength=DataMatrix[A].length;
		}
	}
	
	// transpose the matrix
	var TDataMatrix=[];
	for (var row=0; row<VecLength; row++){// each row of the CSVMatrix
		TDataMatrix[row]=[];
		for (var column=0; column<DataMatrix.length; column++){// each column
			if (typeof(DataMatrix[column][row])!="undefined"){
				TDataMatrix[row][column]=DataMatrix[column][row];
			}
			else{
				TDataMatrix[row][column]="";
			}
		}
	}
	return TDataMatrix;
}





// ***********************************************************************************





//One summary statistic as a proportion of another?
function CalculateRate(Numerator, Denominator){
	//var Rate=Numerator.slice();
	
	
// Check that the start and end years align, as well as the 
// Numerator
// Denominator
// e.g testing rate = test events/total users, active users?
// incidence rate = infection events/ total users
	var Rate=Divide(Numerator, Denominator);
}


// ****************************************************************
// Finally, a function that groups the results across multiple instances of the simulations to create 

function SeparateResultsByIntervention(ResultsByIntervention){
	// Convert Result[Sim][Intervention][Statistic] to Result[Intervention][Sim][Statistic]
}


function ConverToResultsByStatistic(ResultBySimArray){
	// This works on simulations in which there is only one level (i.e. there isn't an intervention e.g. Result[Sim][Intervention][Statistic])
	
	var ReturnArray={};
	
	// look at the first simulation
	
	
	for (var ResultName in ResultBySimArray[0]){
		// sort into an array
		ReturnArray[ResultName]=[];
		for (var SimNum in ResultBySimArray){
			ReturnArray[ResultName][SimNum]=ResultBySimArray[SimNum][ResultName];
		}
		
		
		if (typeof(ResultBySimArray[0][ResultName].StatisticType)!="undefined"){
			
			
		}
	}
	
	return ReturnArray;
}


function TransposeArrObj(DataMatrix){// into obj-arr
	// transpose the matrix
	var TDataMatrix={};
	for (var Dim2 in DataMatrix[0]){// Dim2 is obj
		TDataMatrix[Dim2]=[];
		for (var Dim1 in DataMatrix){// Dim1 is arr
			TDataMatrix[Dim2][Dim1]=DataMatrix[Dim1][Dim2];
		}
	}
	return TDataMatrix;
}

function TransposeObjArr(DataMatrix){// into arr-obj
	// transpose the matrix
	var TDataMatrix=[];
	// Establish what the object contents are 
	var ObjIds=[];
	var ObjIdCount=-1;
	for (var Dim1 in DataMatrix){
		ObjIdCount++;
		ObjIds[ObjIdCount]=Dim1;
	}

	for (var Dim2 in DataMatrix[ObjIds[0]]){// Dim2 is arr
		TDataMatrix[Dim2]={};
		for (var Dim1 in DataMatrix){// Dim1 is obj
			TDataMatrix[Dim2][Dim1]=DataMatrix[Dim1][Dim2];
		}
	}
	return TDataMatrix;
}






function MultiSimCountStat(InputStatArray){
	"use strict";
	// Use the details of the first simulation to form the general properties of this aggregate statistic
	this.Name=InputStatArray[0].Name;
	this.XLabel=InputStatArray[0].XLabel;
	this.YLabel=InputStatArray[0].YLabel;
	this.StatisticType=InputStatArray[0].StatisticType; 
	this.CountType=InputStatArray[0].CountType; 
	this.MultipleCategories=InputStatArray[0].MultipleCategories;
	this.CategoryLabel=InputStatArray[0].CategoryLabel;
	this.NumberOfSimulations=InputStatArray.length;
	
	this.Time=InputStatArray[0].Time; 
	
	this.N=[];
	this.Sum=[];
	this.Mean=[];
	this.Median=[];
	this.Upper95Percentile=[];
	this.Lower95Percentile=[];
	this.StandardDeviation=[];
	this.UpperQuartile=[];
	this.LowerQuartile=[];
	this.Max=[];
	this.Min=[];
	
	if (this.MultipleCategories==false){
		console.log("got into MultiSimCountStat");
		
		// Data re-arranged to allow vector access to each Statistic.Data[Year][SimNum]
		this.Data=[];
		for (var TimeIndex in this.Time){
			this.Data[TimeIndex]=[];
			for (var SimIndex in InputStatArray){
				this.Data[TimeIndex][SimIndex]=InputStatArray[SimIndex].Count[TimeIndex];
			}
		}
		
		for (TimeIndex in this.Time){
			this.Sum[TimeIndex]=Sum(this.Data[TimeIndex]);
			this.Mean[TimeIndex]=Mean(this.Data[TimeIndex]);
			this.Median[TimeIndex]=Median(this.Data[TimeIndex]);
			this.Upper95Percentile[TimeIndex]=Percentile(this.Data[TimeIndex], 97.5);
			this.Lower95Percentile[TimeIndex]=Percentile(this.Data[TimeIndex], 2.5);
			this.StandardDeviation[TimeIndex]=SampleStandardDeviation(this.Data[TimeIndex]);
			this.UpperQuartile[TimeIndex]=Percentile(this.Data[TimeIndex], 75);
			this.LowerQuartile[TimeIndex]=Percentile(this.Data[TimeIndex], 25);
			this.Max[TimeIndex]=Max(this.Data[TimeIndex]);
			this.Min[TimeIndex]=Min(this.Data[TimeIndex]);
		}
	}
	else {
		// Data re-arranged to allow vector access to each Statistic.Data[Subcategory][Year][SimNum]
	}
}



function MultiSimSummaryStat(SummaryStatArray){
	var CombinedResult={};

	// Extract the general information from the first in the SummaryStatArray
	CombinedResult=SummaryStatArray[0];
	
	
	// load the results for storage
	/*if (MultipleCategories==false)
		for Simulationindex
			//Copy the data
			for TimeIndex{
				// for each category
				Result.StorageTable[TimeIndex][Simulationindex];
			}
			Result.Mean[TimeIndex]=Mean(Result.StorageTable[TimeIndex]);
			Result.Median[TimeIndex]=Median(Result.StorageTable[TimeIndex]);
			Result.Upper95[TimeIndex]=xxx(Result.StorageTable[TimeIndex]);
			Result.Lower95[TimeIndex]=xxx(Result.StorageTable[TimeIndex]);
			Result.UpperQuartile[TimeIndex]=xxx(Result.StorageTable[TimeIndex]);
			Result.LowerQuartile[TimeIndex]=xxx(Result.StorageTable[TimeIndex]);
			Result.Variance[TimeIndex]=xxx(Result.StorageTable[TimeIndex]);
		}
	}*/
//	else
//			else
//				for CategoryIndex
//					Result.StorageTable[CategoryIndex][TimeIndex][Simulationindex];
//	
//	for CategoryIndex
//		for TimeIndex
	// 
// Mean
// Median
// 95% bounds
// Max and min
// IQR
// SD/variance?
// Transform(for all elements of the table, transform using the function, e.g. log)
}





// 'IndividualDistribution': used to report median, mean, and the distribution of individual characteristics. e.g. Age
// If Type=='IndividualDistribution' it returns any number 
// , IndividualDistribution: used to report median, mean, and the distribution of individual characteristics. e.g. Age

//Test vector
/*
a=[7.279262743	,
21.75849476	,
27.38976594	,
28.16190719	,
29.30052305	,
31.75542032	,
31.91665781	,
40.26469084	,
36.63041615	,
37.23483779	,
39.715233	,
41.04434096	,
42.93079913	,
23.64497355	,
29.3669436	,
25.61807882	,
31.39867214	,
35.526402	,
35.09503094	,
37.85444819	,
40.19878829	,
40.20768384	,
62.51650824	,
13.94814014	,
18.26808	,
19.00959285	,
28.15853727	,
29.72594843	,
30.61393977	,
33.74790832	,
42.68187556	,
40.03647495	,
45.11652515	,
19.21883077	,
19.96451761	,
25.38414254	,
32.70617206	,
37.25799551	,
39.9260476	,
45.20154611	,
15.85866415	,
21.29168738	,
18.99185756	,
22.13289309	,
23.67014996	,
22.85186946	,
31.42664409	,
34.61265317	,
34.10870086	,
40.29740227	,
39.30484251	,
42.10273457	,
63.92230482	,
79.74404985	,
13.21259569	,
18.91255856	,
16.72501599	,
20.26521567	,
25.86284248	,
32.21733955	,
40.79855553	,
14.63730215	,
16.67045935	,
21.5591261	,
20.05428218	,
23.93187738	,
28.39129507	,
29.739285	,
35.88694178	,
14.90749376	,
15.70002098	,
7.310522846	,
7.232372588	,
17.43836417	,
21.09139135	,
35.59257128	,
26.31305923	,
11.50971501	,
17.43284535	,
25.76706437	,
37.74623535	,
42.54307131	,
29.93521251	,
39.87142878	,
44.96694817	,
10.09249221	,
27.74260654	,
30.12688445	,
41.77591818	,
9.289973072	,
26.00822645	,
34.24787521	,
16.75080406	,
25.87715986	,
30.90224755	,
25.06650673	,
10.58972428	,
14.1760538	,
25.06650673	,
25.38414254	,
25.61807882	,
25.76706437	,
25.83122484	,
25.86284248	,
25.87715986	,
26.00822645	,
26.2580618	,
26.31305923	,
27.38976594	,
27.42387269	,
27.48672319	,
27.74260654	,
28.15853727	,
28.16190719	,
28.33391639	,
28.39129507	,
29.30052305	,
29.3669436	,
29.72594843	,
29.739285	,
29.93521251	,
29.99871241	,
30.12688445	,
30.61393977	,
30.90224755	,
31.39867214	,
31.42664409	,
31.75542032	,
31.91665781	,
32.21733955	,
32.53186292	,
32.70236263	,
32.70617206	,
33.74790832	,
34.10870086	,
34.24787521	,
34.61265317	,
34.65985305	,
35.09503094	,
35.526402	,
35.59257128	,
35.88694178	,
36.63041615	,
36.85495569	,
37.1343834	,
37.23483779	,
37.25799551	,
37.74623535	,
37.85444819	,
39.23058578	,
39.30484251	,
39.715233	,
39.87142878	,
39.9260476	,
40.03647495	,
40.19878829	,
40.20768384	,
40.26469084	,
40.29740227	,
40.79855553	,
41.04434096	,
41.77591818	,
42.10273457	,
42.54307131	,
42.68187556	,
42.93079913	,
44.96694817	,
45.11652515	,
45.20154611	,
47.00511394	,
49.60022008	,
62.51650824	,
63.0013506	,
63.92230482	,
79.74404985	];
*/