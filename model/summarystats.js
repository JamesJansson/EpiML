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

// e.g. Summary stats request structure
RecentTeenageHCVInfections=new StatRequest();
RecentTeenageHCVInfections.VariableName="";


// Continuous variable range, instantaneous value
RecentTeenageHCVInfections.FunctionChooserString[0] = "function (PersonUnderInspecion, Time){return PersonUnderInspecion.Age(Time);}";// this will be evaled on the other side of the webworker
RecentTeenageHCVInfections.Lower[0] = 25;
RecentTeenageHCVInfections.Upper[0] = 35;
// Categorical variable value, instantaneous value
RecentTeenageHCVInfections.FunctionChooserString[1] = "function (PersonUnderInspecion, Time){return PersonUnderInspecion.HCV.FibrosisStage(Time);};"
RecentTeenageHCVInfections.Values[0] = [];
RecentTeenageHCVInfections.Values[0][0] = 3;//If the fibrosis stages are either 3 or 4 (but nothing else 
RecentTeenageHCVInfections.Values[0][1] = 4;//

 
// Example usage


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

CurrentlyLivingWithHIV=new SummaryStatistic(Settings);
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








function SummaryStatistic(Settings, InputFunction){
	var Name;
	// A descriptive text entry about the statistic (optional)
	
	var XLabel="Time";
	// A string that would be placed on the x axis of the graph (e.g. Year, Month, etc) (optional)
	
	var YLabel="Value";
	// A string that would be placed on the y axis of the graph (e.g. Diagnoses, Infections, etc) (optional)
	
	var Type;
	// 'InstantaneousCount': how many people at time t have quality a (good for prevalence etc) (mandatory)
	// 'CountEvents': how many events between two times occur to each person. This value is added to an aggregate 
	// 'IndividualDistribution': used to report median, mean, and the distribution of individual characteristics. e.g. Age
	
	var VectorFunction=false;
	// VectorFunction is a flag to indicate whether StatisticalFunction has arguments of (optional, defaults to non-vector function)
	// false: StatisticalFunction(Person, Time) and returns a single value at time or
	// true: StatisticalFunction(Person, StartTime, EndTime, StepSize)and returns a vector of values over the times specified
	// Setting this flag to true will allow the vector in summary statistic to to be filled by the function under inspection (e.g. EventVector) that could be a lot faster
	
	var CategoricalFunction=false;
	// CategoricalFunction is a flag to indicate whether StatisticalFunction returns (optional, defaults to simple count)
	// true or false, or it returns an index
	// This flag can only be used with InstantaneousCount. 
	// It cannot be used with CountEvents or IndividualDistribution
	
	var NumberOfCategories; 
	//(mandatory if CategoricalFunction==true)
	
	var CategoryLabel=[];
	// Used to store the text associated with the categorical numbers (optional)
	
	var Function; 
	// StatisticalFunction is user defined
	// If Type=='InstantaneousCount' it returns either a 0 or a 1 given a specific time
	// If Type=='CountEvents' it returns a number >= 0, and is given StartTime, EndTime
	// If Type=='IndividualDistribution' it returns any number 
	// If VectorFunction==true if returns a vector over the period stated
	
	var StartTime;
	var EndTime;
	var StepSize=1;//set by default to 1
	var NumberOfTimeSteps;
	
	var TimeVector=[];
	
	
	
	
	
	// Set the settings
	if (typeof Settings.Name === 'string'){
		Name=Settings.Name;
	}
	if (typeof Settings.XLabel === 'string'){
		XLabel=Settings.XLabel;
	}
	if (typeof Settings.YLabel === 'string'){
		YLabel=Settings.YLabel;
	}
	
	//  Set the Type of statistic to be collected
	if (typeof Settings.Type === 'string'){
		Type=Settings.Type;
	}
	else{
		console.error("A Type must be specified. Types include: InstantaneousCount: how many people at time t have quality a (good for prevalence etc), CountEvents: how many events between two times occur to each person. This value is added to an aggregate, IndividualDistribution: used to report median, mean, and the distribution of individual characteristics. e.g. Age") ;
	}
	
	//Set whether the function will be a boolean operator or not.
	if (typeof Settings.VectorFunction === 'boolean'){
		VectorFunction=Settings.VectorFunction;
	}
	else if (typeof Settings.VectorFunction != 'undefined'){
		console.error("SummaryStatistic: VectorFunction must be a boolean operator");
	}
	
	
	
	// Set the Category settings
	if (typeof Settings.CategoricalFunction === 'boolean'){
		if (Settings.CategoricalFunction==true){
			CategoricalFunction=true;
			if (typeof Settings.NumberOfCategories === 'number'){
				NumberOfCategories=Settings.NumberOfCategories;
				if (typeof Settings.CategoryLabel === 'object'){
					CategoryLabel=Settings.CategoryLabel;
				}
			}
			else {
				console.error("SummaryStatistic: If CategoricalFunction is true, NumberOfCategories must be set to a whole number >1;")
			}
		}
	}
	else if (typeof Settings.CategoricalFunction != 'undefined'){
		console.error("SummaryStatistic: CategoricalFunction should have only a value of true or false");
	}
	
	// Set the function for the summary statistic
	if (typeof InputFunction === 'function'){
		Function=InputFunction;
	}
	
	// Set the times for the summary statistic
	if (typeof Settings.StartTime === 'number'){
		StartTime=Settings.StartTime;
	}
	else{
		console.error("SummaryStatistic: StartTime and EndTime must be set");
	}
	if (typeof Settings.EndTime === 'number'){
		EndTime=Settings.EndTime;
	}
	else{
		console.error("SummaryStatistic: StartTime and EndTime must be set");
	}
	if (typeof Settings.StepSize === 'number'){
		StepSize=Settings.StepSize;
	}
	

}

SummaryStatistic.prototype.Run=function(Population){
	// Check that the settings line up
	
	// Set up the time vector
	var CurrentTimeStep=this.StartTime;
	this.NumberOfTimeSteps=Math.round((this.EndTime-this.StartTime)/this.TimeStep)+1; //This is used to avoid rounding errors
	for (var TimeIndex; TimeIndex<this.NumberOfTimeSteps; TimeIndex++){
		TimeVector[TimeIndex]=CurrentTimeStep;
		CurrentTimeStep=CurrentTimeStep+this.TimeStep;// Increment the time step
	}
	
	// Inspect the individual statistics. Note that this type will have to inspect the value independently at each time step, to then take the average, etc. 
	if (this.SummaryStatisticType.toLowerCase()=='individualdistribution'){
		this.IndividualDistribution(Population);
	}
	// Doing a simple count of the characteristic 
	else{
		// Set up the Count array
		var this.Count;
		if (this.CategoricalFunction==false){// inspecting only a single category
			this.Count=ZeroArray(this.NumberOfTimeSteps);
			
			if (this.SummaryStatisticType.toLowerCase()=='instantaneouscount'){
				this.InstantaneousCount(Population);
			}
			else if (this.SummaryStatisticType.toLowerCase()=='countevents'){
				this.CountEvents(Population);
			}
		}
		else{ // If there are a number of categories
			this.Count=ZeroMatrix(this.NumberOfCategories, this.NumberOfTimeSteps);
			
			if (this.SummaryStatisticType.toLowerCase()=='instantaneouscount'){
				this.InstantaneousCountCategorical(Population);
			}
			else if (this.SummaryStatisticType.toLowerCase()=='countevents'){
				this.CountEventsCategorical(Population);
			}
		}
	}
}

SummaryStatistic.prototype.InstantaneousCount= function (Population){//Used to determine the number of people that satisfy a condition at a particular point in time
	for (var PersonIndex=0; PersonIndex<Population.length; PersonIndex++){
		for (var TimeIndex=0; TimeIndex<this.TimeVector.length; TimeIndex++){
			if (this.Function(Population[Personindex], this.TimeVector[TimeIndex])==true){
				this.Count[TimeIndex]++;
			}
		}
	}
}

SummaryStatistic.prototype.InstantaneousCountCategorical= function (Population){//Used to determine the number of people that satisfy a condition at a particular point in time
	var CategoryIndex
	for (var PersonIndex=0; PersonIndex<Population.length; PersonIndex++){
		for (var TimeIndex=0; TimeIndex<this.TimeVector.length; TimeIndex++){
			CategoryIndex=this.Function(Population[Personindex], this.TimeVector[TimeIndex]);
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

SummaryStatistic.prototype.Count= function (){// this is an instantaneous counting function, used to count things like prevalence
	// initialise Table with a zero matrix
	this.Table=

	// for each year

	
	return Year-this.YearOfBirth;
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





//One summary statistic as a proportion of another?
// Check that the start and end years align, as well as the 
// Numerator
// Denominator
// e.g testing rate = test events/total users, active users?
// incidence rate = infection events/ total users



function MultipleSummaryStatistics(){
	var SummaryStatisticType;
	var StatFunction;//
	var StateName;//e.g. HIV incidence
	
	var StartTime;
	var EndTime;
	var TimeStep;
	
	// This is created after all of the element are filled up
	var SummaryStat=[];
	
	var Table;//[StatIndex][yearindex]
}

MultipleSummaryStatistics.prototype.Run= function (Population){
	// for each specified summary stat
	// Set the time to the same time values
	SummaryStat=
	// run()
	
	// then create a single table
}

MultipleSummaryStatistics.prototype.CreateSingleTable= function (){// this is a separate function, because the suer may want to copy in the pre-run summary stat and simply create a single table for speed
	this.Table=[];
	
	
	//for each summary stat
	
		this.Table[i]=this.SummaryStat[i].Value;
		
	
}

// Finally, a function that groups the results across multiple instances of the simulations to create 
// Mean
// Median
// 95% bounds
// Max and min
// IQR
// SD/variance?
// Transform(for all elements of the table, transform using the function, e.g. log)
