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
	
	this.FunctionReturnsCategory=false;
	// FunctionReturnsCategory is a flag to indicate whether Function returns (optional, defaults to simple count)
	// true or false, or it returns an index
	// This flag can only be used with InstantaneousCount. 
	// It cannot be used with CountEvents
	
	this.NumberOfCategories=1; 
	//(mandatory if FunctionReturnsCategory==true)
	
	this.CategoryLabel=[];
	// Used to store the text associated with the categorical numbers (optional)
	
	//this.Function; 
	// Function is user defined
	// If CountType=='Instantaneous' it returns either a 0 or a 1 given a specific time
	// If CountType=='Count' it returns a number >= 0, and is given StartTime, EndTime
	
	// If VectorFunction==true if returns a vector over the period stated
	
	this.StartTime=0;
	this.EndTime=1;
	this.StepSize=1;//set by default to 1
	
	
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
	if (typeof Settings.FunctionReturnsCategory === 'boolean'){
		if (Settings.FunctionReturnsCategory==true){
			this.FunctionReturnsCategory=true;
			if (typeof Settings.NumberOfCategories === 'number'){
				this.NumberOfCategories=Settings.NumberOfCategories;
				if (typeof Settings.CategoryLabel === 'object'){
					this.CategoryLabel=Settings.CategoryLabel;
				}
			}
			else {
				console.error("CountStatistic: If FunctionReturnsCategory is true, NumberOfCategories must be set to a whole number >1;")
			}
		}
	}
	else if (typeof Settings.FunctionReturnsCategory != 'undefined'){
		console.error("CountStatistic: FunctionReturnsCategory should have only a value of true or false");
	}
	
	// Set the function for the summary statistic
	if (typeof InputFunction === 'function'){
		this.Function=InputFunction;
	}
	else{
		console.error("A function must be set that returns the value to be included in the statistic");
	}
	
	// Set the times for the summary statistic
	if (typeof Settings.StartTime === 'number'){
		this.StartTime=Settings.StartTime;
	}
	else{
		console.error("CountStatistic: StartTime and EndTime must be set");
	}
	if (typeof Settings.EndTime === 'number'){
		this.EndTime=Settings.EndTime;
		if (this.EndTime<this.StartTime){
			console.error("End time cannot be before start time");
		}
	}
	else{
		console.error("CountStatistic: StartTime and EndTime must be set");
	}
	if (typeof Settings.StepSize === 'number'){
		this.StepSize=Settings.StepSize;
	}
	

}

CountStatistic.prototype.Run=function(Population){
	// Check that the settings line up
	
	// Set up the time vector
	var CurrentTimeStep=this.StartTime;
	this.NumberOfTimeSteps=Math.round((this.EndTime-this.StartTime)/this.StepSize)+1; //This is used to avoid rounding errors
	for (var TimeIndex=0; TimeIndex<this.NumberOfTimeSteps; TimeIndex++){
		this.Time[TimeIndex]=CurrentTimeStep;
		CurrentTimeStep=CurrentTimeStep+this.StepSize;// Increment the time step
	}
	

		// Set up the Count array
		if (this.FunctionReturnsCategory==false){// inspecting only a single category
			this.Count=ZeroArray(this.NumberOfTimeSteps);
			
			if (this.CountType.toLowerCase()=='instantaneous'){
				this.InstantaneousCount(Population);
			}
			else if (this.CountType.toLowerCase()=='events'){
				this.CountEvents(Population);
			}
		}
		else{ // If there are a number of categories
			this.Count=ZeroMatrix(this.NumberOfCategories, this.NumberOfTimeSteps);
			
			if (this.CountType.toLowerCase()=='instantaneous'){
				this.InstantaneousCountCategorical(Population);
			}
			else if (this.CountType.toLowerCase()=='events'){
				console.error("Please do not use countevents and FunctionReturnsCategory together");
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
	
	// initialise vector with a zero vector
	this.Count=ZeroArray(NumberInVector);

	// for each time step
	var TimeStep=StartTime;
	for (var TimeStepIndex=0; TimeStepIndex<NumberInVector; TimeStepIndex++){
		// for each person
		for (var PIndex=0; PIndex<Population.length; PIndex++){
			//run the SelectionFunction (takes the person, start and endpoints). If you only one once, the count function should express itself as (count between 
			this.Count[TimeStepIndex]=this.Count[TimeStepIndex]+this.Function(Population[PIndex], TimeStep, TimeStep+this.StepSize);
			
		}
		TimeStep=TimeStep+StepSize;// note that this may be a little off at the end (+/- 10^-6), but this should be OK for most statistical reporting
	}
};




// Factor: multiply by a factor to accommodate for using a representative sample, for example
CountStatistic.prototype.Adjust= function (Multiplier){
	// for all of the counting functions
	this.Count=Multiply(this.Count, Multiplier);
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
	
	
	//Set whether the function will be a boolean operator or not.
	if (typeof Settings.VectorFunction === 'boolean'){
		this.VectorFunction=Settings.VectorFunction;
	}
	else if (typeof Settings.VectorFunction != 'undefined'){
		console.error("SummaryStatistic: VectorFunction must be a boolean operator");
	}
	
	
	
	// Set the function for the summary statistic
	if (typeof InputFunction === 'function'){
		this.Function=InputFunction;
	}
	else{
		console.error("A function must be set that returns the value to be included in the statistic");
	}
	
	// Set the times for the summary statistic
	if (typeof Settings.StartTime === 'number'){
		this.StartTime=Settings.StartTime;
	}
	else{
		console.error("SummaryStatistic: StartTime and EndTime must be set");
	}
	if (typeof Settings.EndTime === 'number'){
		this.EndTime=Settings.EndTime;
		if (this.EndTime<this.StartTime){
			console.error("End time cannot be before start time");
		}
	}
	else{
		console.error("SummaryStatistic: StartTime and EndTime must be set");
	}
	if (typeof Settings.StepSize === 'number'){
		this.StepSize=Settings.StepSize;
	}
	

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


function DownloadSummaryStatisticCSV(SumStat, FileName){
	// This function creates a formatted CSV that allows the data to be manipulated in a program like excel
	// List all the descriptors at the top
	// Identifier, Value
	var CSVMatrix=[];
	CSVMatrix[0]=["Name", SumStat.Name];
	CSVMatrix[1]=["XLabel", SumStat.XLabel];
	CSVMatrix[2]=["YLabel", SumStat.YLabel];
	CSVMatrix[3]=[""];// Blank line for looks
	
	CSVMatrix[4]=["Time", "N", "Mean", "Median", "StandardDeviation", "Lower95Percentile", "Upper95Percentile", "LowerQuartile", "UpperQuartile", "Min", "Max", "Sum"];
	var DataMatrix=[SumStat.Time, SumStat.N, SumStat.Mean, SumStat.Median, SumStat.StandardDeviation, SumStat.Lower95Percentile, SumStat.Upper95Percentile, SumStat.LowerQuartile, SumStat.UpperQuartile, SumStat.Min, SumStat.Max, SumStat.Sum];
	
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

function TransposeForCSV(DataMatrix){
	// Below we check for the longest length, they should be the same length but just in case
	var VecLength=0;
	for (var A in DataMatrix){
		if (DataMatrix[A].length>VecLength){
			VecLength=DataMatrix[A].length;
		}
	}
	
	// transpose the matrix
	TDataMatrix=[];
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



