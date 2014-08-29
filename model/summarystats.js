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




function SummaryStatistic(Type){
	var SummaryStaisticName;
	
	var SummaryStatisticType;
	// text
	// Count Instantaneous
	// CountEvents
	// Continuous
	

	var CountEventFunction;
	var CountFunction;
	
	var CategoricalValueFunction;
	
	var SelectionFunction;
	var SelectionFunctionArray=[];
	var StartTime;
	var StopTime;
	var StepSize=1;//set by default to 1
	
	var TimeVector=[];
	var Value=[];
	var LabelVector=[];
	
	
	
	
}

SummaryStatistic.prototype.Run=function(Population){
	if (this.SummaryStatisticType.toLowerCase()=='count'){
		this.Count(Population)
	}
	if (this.SummaryStatisticType.toLowerCase()=='countevents'){
		this.CountEvents(Population)
	}
	if (this.SummaryStatisticType.toLowerCase()=='continous'){
		this.CountEvents(Population)
	}
}

SummaryStatistic.prototype.CountEvents= function (Population){//Used to count how many times something happens over a number of finite periods
	NumberInVector=Math.round((this.StopTime-this.StartTime)/this.StepSize)+1; //This is used to avoid rounding errors

	// initialise vector with a zero vector
	this.Value=ZeroVector(NumberInVector);

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


// Adjust: multiply by a factor to accommodate for using a representative sample, for example





//One summary statistic as a proportion of another?
// Check that the start and end years align, as well as the 
// Numerator
// Denominator
// e.g testing rate = test events/total users, active users?
// incidence rate = infection events/ total users



function MultipleSummaryStatistics(){
	var SummaryStat=[];
	
	var Table;
}

MultipleSummaryStatistics.prototype.Run= function (Population){
	// for each specified summary stat, run()
	
	// then create a single table
}

MultipleSummaryStatistics.prototype.CreateSingleTable= function (){// this is a separate function, because the suer may want to copy in the pre-run summary stat and simply create a single table for speed
	this.Table=[];
	//for each summary stat
		this.Table[i]=
}

// Finally, a function that groups the results across multiple instances of the simulations

