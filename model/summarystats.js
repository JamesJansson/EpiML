// This file contains functions that are designed to summarise information about individuals in the simulation. 
// There are two main types of summary stats:
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





console.log("Loading summarystats.js");

function SummaryStatistic(Settings, InputFunction){
	this.Name="";
	// A descriptive text entry about the statistic (optional)
	
	this.XLabel="Time";
	// A string that would be placed on the x axis of the graph (e.g. Year, Month, etc) (optional)
	
	this.YLabel="Value";
	// A string that would be placed on the y axis of the graph (e.g. Diagnoses, Infections, etc) (optional)
	
	this.Type="";
	// 'InstantaneousCount': how many people at time t have quality a (good for prevalence etc) (mandatory)
	// 'CountEvents': how many events between two times occur to each person. This value is added to an aggregate 
	// 'IndividualDistribution': used to report median, mean, and the distribution of individual characteristics. e.g. Age
	
	this.VectorFunction=false;
	// VectorFunction is a flag to indicate whether StatisticalFunction has arguments of (optional, defaults to non-vector function)
	// false: StatisticalFunction(Person, Time) and returns a single value at time or
	// true: StatisticalFunction(Person, StartTime, EndTime, StepSize)and returns a vector of values over the times specified
	// Setting this flag to true will allow the vector in summary statistic to to be filled by the function under inspection (e.g. EventVector) that could be a lot faster
	
	this.FunctionReturnsCategory=false;
	// FunctionReturnsCategory is a flag to indicate whether StatisticalFunction returns (optional, defaults to simple count)
	// true or false, or it returns an index
	// This flag can only be used with InstantaneousCount. 
	// It cannot be used with CountEvents or IndividualDistribution
	
	this.NumberOfCategories=1; 
	//(mandatory if FunctionReturnsCategory==true)
	
	this.CategoryLabel=[];
	// Used to store the text associated with the categorical numbers (optional)
	
	//this.Function; 
	// StatisticalFunction is user defined
	// If Type=='InstantaneousCount' it returns either a 0 or a 1 given a specific time
	// If Type=='CountEvents' it returns a number >= 0, and is given StartTime, EndTime
	// If Type=='IndividualDistribution' it returns any number 
	// If VectorFunction==true if returns a vector over the period stated
	
	this.StartTime=0;
	this.EndTime=1;
	this.StepSize=1;//set by default to 1
	
	
	this.TimeVector=[];
	
	
	
	
	
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
	
	//  Set the Type of statistic to be collected
	if (typeof Settings.Type === 'string'){
		this.Type=Settings.Type;
	}
	else{
		console.error("A Type must be specified. Types include: InstantaneousCount: how many people at time t have quality a (good for prevalence etc), CountEvents: how many events between two times occur to each person. This value is added to an aggregate, IndividualDistribution: used to report median, mean, and the distribution of individual characteristics. e.g. Age") ;
	}
	
	//Set whether the function will be a boolean operator or not.
	if (typeof Settings.VectorFunction === 'boolean'){
		this.VectorFunction=Settings.VectorFunction;
	}
	else if (typeof Settings.VectorFunction != 'undefined'){
		console.error("SummaryStatistic: VectorFunction must be a boolean operator");
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
				console.error("SummaryStatistic: If FunctionReturnsCategory is true, NumberOfCategories must be set to a whole number >1;")
			}
		}
	}
	else if (typeof Settings.FunctionReturnsCategory != 'undefined'){
		console.error("SummaryStatistic: FunctionReturnsCategory should have only a value of true or false");
	}
	
	// Set the function for the summary statistic
	if (typeof InputFunction === 'function'){
		this.Function=InputFunction;
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
	}
	else{
		console.error("SummaryStatistic: StartTime and EndTime must be set");
	}
	if (typeof Settings.StepSize === 'number'){
		this.StepSize=Settings.StepSize;
	}
	

}

SummaryStatistic.prototype.Run=function(Population){
	// Check that the settings line up
	

	
	// Set up the time vector
	var CurrentTimeStep=this.StartTime;
	this.NumberOfTimeSteps=Math.round((this.EndTime-this.StartTime)/this.StepSize)+1; //This is used to avoid rounding errors
	for (var TimeIndex=0; TimeIndex<this.NumberOfTimeSteps; TimeIndex++){
		this.TimeVector[TimeIndex]=CurrentTimeStep;
		CurrentTimeStep=CurrentTimeStep+this.StepSize;// Increment the time step
	}
	
	// if (typeof Function === 'object') {break into singular functions then run individually}
	// if (typeof Function === 'function') {just run it}
	
	// Inspect the individual statistics. Note that this type will have to inspect the value independently at each time step, to then take the average, etc. 
	if (this.Type.toLowerCase()=='individualdistribution'){
		this.IndividualDistribution(Population);
	}
	// Doing a simple count of the characteristic 
	else{
		// Set up the Count array
		if (this.FunctionReturnsCategory==false){// inspecting only a single category
			this.Count=ZeroArray(this.NumberOfTimeSteps);
			
			if (this.Type.toLowerCase()=='instantaneouscount'){
				this.InstantaneousCount(Population);
			}
			else if (this.Type.toLowerCase()=='countevents'){
				this.CountEvents(Population);
			}
		}
		else{ // If there are a number of categories
			this.Count=ZeroMatrix(this.NumberOfCategories, this.NumberOfTimeSteps);
			
			if (this.Type.toLowerCase()=='instantaneouscount'){
				this.InstantaneousCountCategorical(Population);
			}
			else if (this.Type.toLowerCase()=='countevents'){
				this.CountEventsCategorical(Population);
				console.error("The way this works has not been determined yet. Please do not use countevents and FunctionReturnsCategory together");
			}
		}
	}
}

SummaryStatistic.prototype.InstantaneousCount= function (Population){//Used to determine the number of people that satisfy a condition at a particular point in time
	for (var PersonIndex=0; PersonIndex<Population.length; PersonIndex++){
		for (var TimeIndex=0; TimeIndex<this.TimeVector.length; TimeIndex++){
			if (this.Function(Population[PersonIndex], this.TimeVector[TimeIndex])==true){
				this.Count[TimeIndex]++;
			}
		}
	}
}

SummaryStatistic.prototype.InstantaneousCountCategorical= function (Population){//Used to determine the number of people that satisfy a condition at a particular point in time
	var CategoryIndex;
	for (var PersonIndex=0; PersonIndex<Population.length; PersonIndex++){
		for (var TimeIndex=0; TimeIndex<this.TimeVector.length; TimeIndex++){
			CategoryIndex=this.Function(Population[PersonIndex], this.TimeVector[TimeIndex]);
			if (CategoryIndex>=0){//if it is not equal to NaN
				this.Count[CategoryIndex][TimeIndex]++;
			}
		}
	}
}






SummaryStatistic.prototype.CountEvents= function (Population){//Used to count how many times something happens over a number of finite periods
	
	// initialise vector with a zero vector
	this.Value=ZeroArray(NumberInVector);

	// for each time step
	var TimeStep=StartTime;
	for (var TimeStepIndex=0; TimeStepIndex<NumberInVector; TimeStepIndex++){
		// for each person
		for (var PIndex=0; PIndex<Population.length; PIndex++){
			//run the SelectionFunction (takes the person, start and endpoints). If you only one once, the count function should express itself as (count between 
			this.Value[TimeStepIndex]=this.Value[TimeStepIndex]+this.CountEventFunction(Population[PIndex], TimeStep, TimeStep+this.StepSize);
			
		}
		TimeStep=TimeStep+StepSize;// note that this may be a little off at the end (+/- 10^-6), but this should be OK for most statistical reporting
	}
	
	// In this function we may also want to count mean, median, IQR, 95% range, so temporarily holding on the value in an array may help
	
};




// ReportContinuous: ValueFunction returns a variable, which is continuous


	// can we make this an array of categorical value functions like []
	// MultiplePopulations
	// Single population
	// Events
	// First events
	// All events
	// Status


// Factor: multiply by a factor to accommodate for using a representative sample, for example
SummaryStatistic.prototype.Adjust= function (Multiplier){
	if (this.Type.toLowerCase()=='individualdistribution'){
		console.error("Values for individual distributions should not be factored. That is, they represent a per person measurement e.g. doctors visits per year. If we are using a representative sample, this figure should stay the same regardless.");
	}
	// for all of the counting functions
	this.Count=Multiply(this.Count, Multiplier);
}



//One summary statistic as a proportion of another?
function CalculateRate(Numerator, Denominator){
	RateSummaryStatistic=Numerator.slice();

// Check that the start and end years align, as well as the 
// Numerator
// Denominator
// e.g testing rate = test events/total users, active users?
// incidence rate = infection events/ total users
}



// Finally, a function that groups the results across multiple instances of the simulations to create 
function MultiSimSummaryStat(SummaryStatArray){
	var Result={};

	// Extract the general information from the first in the SummaryStatArray
	
	// load the results for storage
	/*if (MultipleCategories==false)
		for Simulationindex
			for TimeIndex{
				//Copy the data
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

console.log("Loaded summarystats.js");