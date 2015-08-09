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
	// 0: Never used = 0 per year
	// 1: Tried once = once on the date of trying
	// 2: Occasional user = once a month = <12 per year
	// 3: Regular user = 12-365*3 per year
	// 4: Former user = 0 per year
	
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
	
	// Determine whether the person is a sharing user or not
	// IDU.SharingPriorToNSP
	if (Rand.Value()<Param.IDU.SharingPriorToNSP){
		this.Sharing.Set(1, Time);
	}
	
	// Add the transition to occasional user
	
	// Following entry, there is a probability associated with becoming a regular user, and following that exiting at a certain probability
	if (Rand.Value()<Param.IDU.BecomeRegularInjector.P){
		
	
		// Add the transition to regular user
		var TimeUntilStartingRegularUse=RegularInjectionTime.Time();
		var TimeOfRegularUse=Time+TimeUntilStartingRegularUse;
		this.Use.Set(3, TimeOfRegularUse);
		
		// Add the transition to NSP user
		var TimeUntilStartNSP=TimeUntilEvent(Param.IDU.NSP.P);
		this.NSP.Set(1, TimeUntilStartNSP+TimeOfRegularUse);// Stop NSP attendance below- should ensure this event only happens before 
		
		
		// Determine the use rate by people who use regularly
		
		
		
		// Add the transition to former user
		var TimeUntilStoppingInjecting=TimeUntilEvent(Param.IDU.RateOfCessation);
		
		
		var TimeOfStoppingInjecting=TimeOfRegularUse+TimeUntilStoppingInjecting;
		this.Use.Set(4, TimeOfStoppingInjecting);
		// Stop NSP attendance- note, adding this should delete future events
		this.NSP.Set(0, TimeOfStoppingInjecting);
		
		
		if (false){//Rand.Value()<0.05){
			console.log("   ");
			console.log("TimeUntilStartingRegularUse: "+TimeUntilStartingRegularUse);
			console.log("TimeOfRegularUse: "+TimeOfRegularUse);
			console.log("TimeUntilStoppingInjecting: "+TimeUntilStoppingInjecting);
			console.log("Param.IDU.RateOfCessation: "+Param.IDU.RateOfCessation);
			console.log(this.Use.Time);
			console.log(this.Use.ValueVec);
		}
		
		
		
		// Determine excess death due to drug use
		// From the date of regular usage to cease
		var ExcessMortality;
		if (this.Person.Sex==0){
			ExcessMortality=Param.IDU.ExcessMortality.Male;		
		}
		if (this.Person.Sex==1){
			ExcessMortality=Param.IDU.ExcessMortality.Female;		
		}
		var TimeOfIDUDeath=Time+TimeUntilEvent(ExcessMortality);
		if (TimeOfIDUDeath<TimeOfStoppingInjecting){//if time of drug related death occurs prior to 
			this.Person.Death.IDU=TimeOfIDUDeath;
		}
	}
	else {
		// determine time until ceasing irregular use
		//var TimeOfStoppingInjecting=TimeUntilEvent(Param.IDU.RateOfCeasingIrregularUse);
		// Add time until occasional user
		this.Use.Set(2, Time+Param.StepSize);
		var TimeOfStoppingInjecting=Time+1;
		this.Use.Set(4, Time+TimeOfStoppingInjecting);
	}
	
	// Determine if the person is a sharer
	// Determine when the person ceases sharing
	// PWID additional mortality
	
	
};

IDUObject.prototype.StopInjecting= function (Time){
	console.error("This function is used to hard stop someone injecting (through interventions etc)");
	console.error("Excess mortality needs to be adjusted if it occurs between old injection date and new injection date.");
};

IDUObject.prototype.CurrentlyInjecting= function (Time){
	if (this.Person.Alive(Time)){
		var UseValue=this.Use.Value(Time);
		if (UseValue>0 && UseValue<4){
			return true;
		}
	}
	return false;
};

IDUObject.prototype.InjectingDuration= function (){
	var InjectStartTime=this.Use.FirstTimeOf(1);
	var InjectStopTime=this.Use.FirstTimeOf(4);
	return InjectStopTime-InjectStartTime;
};

IDUObject.prototype.EverInjectedAtTime= function (Time){
	if (this.Person.Alive(Time)){
		var FirstUseTime=this.Use.FirstTimeOf(1);
		if (isNaN(FirstUseTime)){
			return false;
		}
		else{
			if (FirstUseTime<Time){
				return true;
			}
			else {
				return false;
			}
		} 
	}
	return false;
};

// This is the function that determines if a person is a recent injector or not
IDUObject.prototype.InjectedBetween= function (Time1, Time2){
	// First step is to determine if the person is a current injector at time 1
	if (this.CurrentlyInjecting(Time1)==true || this.CurrentlyInjecting(Time2)==true ){
		// console.log(this.Use.Value(Time1));
		// console.log(this.Use.Value(Time2));
		return true;
	}
	var InjectingChanges=this.Use.EventsBetween(Time1, Time2);
	
	for (var ICCount in InjectingChanges){
		// console.log(InjectingChanges[ICCount].Value);
		if (InjectingChanges[ICCount].Value>0 && InjectingChanges[ICCount].Value<4){
			return true;
		}
	}
	// if no injecting events found
	return false;
};







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
};