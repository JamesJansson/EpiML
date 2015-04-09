// Injecting drug use class: determines the level of injecting drug use of the individual

function IDUObject(PersonPointer){
	this.Person=PersonPointer;
	
	this.State=0;
	this.Use = new EventVector;
	this.Use.Set(0, this.Person.YearOfBirth);
	// IDU codes
	// 0: Never used
	// 1: Tried once
	// 2: Occasional user
	// 3: Regular user
	// 4: Former user
	
	this.UseRate = new EventVector;
	this.UseRate.Set(0, this.Person.YearOfBirth);
	// IDU codes
	// 0: Never used = 0
	// 1: Tried once = once on the date of trying
	// 2: Occasional user = once a month = <12
	// 3: Regular user = 12-365*3 
	// 4: Former user
	
	
	
	this.OST = new EventVector;
	this.OST.Set(0, this.Person.YearOfBirth);
	
	this.NSP = new EventVector;
	this.NSP.Set(0, this.Person.YearOfBirth);
	
	
}

IDUObject.prototype.StartInjecting= function (Time){
	// Add the first date of injecting
	this.Use.Set(1, Time);
	
	// Add the transition to occasional user
	//if (Rand.Value()<Param.IDU.BecomeRegularInjector.P){
		// this.Use.Set(2, Time+0.1);
		// Param.IDU.BecomeRegularInjector.Time
		// this.Use.Set(2, Time+TimeChosen);
	
	
		//var TimeUntilCease=TimeUntilEvent(Param.IDU.RateOfCesssation);
		// this.Use.Set(3, Time+TimeChosen+TimeUntilCease);
		
		// Add the transition to regular user
		
		// determine the use rate by people who use regularly
		
		// Add the transition to former user
	
	//}
	
	// Determine excess death due to drug use
	// From the date of regular usage to cease
	
	// var TimeOfDeath=TimeUntilEvent(Param.IDU.ExcessMortality)
	// if (TimeOfDeath<TimeUntilCease){
		// this.Person.Death.IDU=Time+TimeChosen+TimeUntilCease;
	//}
}




function RegularInjectionTimeObject(){//(RegularTimeP, RegularTimeT){
	// This function and the associated interface parts are an unfortunate example of how I haven't programmed and nice way to do arrays of parameters

	var PTime=Param.IDU.BecomeRegularInjector.PTime;//.LT10Years
	this.P=[];
	this.P[0]=PTime.LT1Week;
	this.P[1]=PTime.LT6Months;
	this.P[2]=PTime.LT1Year;
	this.P[3]=PTime.LT5Years;
	this.P[4]=PTime.LT10Years;
	
	// Normalise P to make it level 
	this.P=Divide(this.P, Sum(this.P));
	
	this.MaxTime=[];
	this.MaxTime[0]=7/52;
	this.MaxTime[1]=0.5;
	this.MaxTime[2]=1;
	this.MaxTime[3]=5;
	this.MaxTime[4]=10;
}

RegularInjectionTimeObject.prototype.Time=function(){
	var ProbToUse=Rand.Value();
	var CummulativeProb=this.P[0];
	if (ProbToUse<this.P[0]){
		return Rand.Value()*this.MaxTime[0];
	}
	for (var Count=1; Count<this.P.length-1; Count++){
		CummulativeProb+=this.P[Count];
		if (ProbToUse<CummulativeProb){
			return this.MaxTime[Count-1]+Rand.Value()*(this.MaxTime[Count]-this.MaxTime[Count-1]);
		}
	}
	return this.MaxTime[Count-1]+Rand.Value()*(this.MaxTime[Count]-this.MaxTime[Count-1]);
}