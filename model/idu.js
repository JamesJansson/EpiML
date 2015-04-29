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
	
	this.Sharing= new EventVector;
	this.Sharing.Set(0, this.Person.YearOfBirth);
	
	this.OST = new EventVector;
	this.OST.Set(0, this.Person.YearOfBirth);
	
	this.NSP = new EventVector;
	this.NSP.Set(0, this.Person.YearOfBirth);
	
	this.InjectingPartners=[];// 
	this.InjectingPartnersRegularSexual=[];
	this.InjectingPartnersCasualSexual=[];
}

IDUObject.prototype.StartInjecting= function (Time){
	// Risky injection. Determine 
		// if the persons will practice receptive sharing of injecting equipment 
		// when the will stop if they do.
		// who they are sharing with
	
	
	// Add the first date of injecting
	this.Use.Set(1, Time);
	
	// Add the transition to occasional user
	
	// Following entry, there is a probability associated with becoming a regular user, and following that exiting at a certain probability
	if (Rand.Value()<Param.IDU.BecomeRegularInjector.P){
		// Add time until occasional user
		this.Use.Set(2, Time+0.1);
	
		// Add the transition to regular user
		var TimeUntilStartingRegularUse=RegularInjectionTime.Time();
		var TimeOfRegularUse=Time+TimeUntilStartingRegularUse;
		this.Use.Set(3, TimeOfRegularUse);
		
		// Determine the use rate by people who use regularly
		console.error("The rate at which people use has not been set.");
		
		
		// Add the transition to former user
		var TimeUntilStoppingInjecting=TimeUntilEvent(Param.IDU.RateOfCesssation);
		var TimeOfStoppingInjecting=TimeOfRegularUse+TimeUntilStoppingInjecting;
		this.Use.Set(4, TimeOfStoppingInjecting);
		
		// Determine excess death due to drug use
		// From the date of regular usage to cease
		
		var TimeOfIDUDeath=TimeUntilEvent(Param.IDU.ExcessMortality);
		if (TimeOfIDUDeath<TimeOfStoppingInjecting){
			this.Person.Death.IDU=Time+TimeChosen+TimeUntilCease;
		}
	}
	else {
		// determine time until ceasing irregular use
		console.error("TimeOfStoppingInjecting has not been set.");
		this.Use.Set(4, TimeOfStoppingInjecting);
	}
	
	
	// Determine if the person is a sharer
	console.error("Determination of sharing has not been set.");
	// Determine when the person ceases sharing
	console.error("Determination of sharing cease has not been set.");
	
	
	
	
	
	// PWID additional mortality
	console.error("PWID additional mortality has not been set.");
}

IDUObject.prototype.StopInjecting= function (Time){
	console.error("In order to hard stop someone injecting (through interventions etc)");
	console.error("Excess mortality needs to be adjusted if it occurs between old injection date and new injection date.");
}


function RegularInjectionTimeObject(){//(RegularTimeP, RegularTimeT){
	// This function and the associated interface parts are an unfortunate example of how I haven't programmed and nice way to do arrays of parameters

	var PTime=Param.IDU.BecomeRegularInjector.PTime;//
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