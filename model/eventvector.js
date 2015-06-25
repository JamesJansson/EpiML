// General mathematical functions that are used during simulations







// Event vector
// The event vector allows "Discrete event simulation" as a means to limit the processing power and memory needed, while still being able to extract data in an efficient manner.
function EventVector(){
	this.ValueVec=[];
	this.Time=[];
	this.NumberOfEvents=0;
}

EventVector.prototype.Set= function (InputValue, Time){
	this.DeleteFutureEvents(Time);
	//Add new items to the end of the array
	this.ValueVec.push(InputValue);
	this.Time.push(Time);
	this.NumberOfEvents++;
};

EventVector.prototype.DeleteFutureEvents= function (Time){
	if (this.NumberOfEvents>0){
		//Determine if the current time is prior the last time
		if (Time<=this.Time[this.NumberOfEvents-1]){//falls directly on that time, delete because we don't want zero time events
			//Determine where the current event would sit
			var Current=this.Get(Time);
			if (Current.Time==Time){//falls directly on that time, delete because we don't want zero time events
				PosToDelete=Current.Pos;
			}else{
				PosToDelete=Current.Pos+1;
			}
			NumToDelete=this.NumberOfEvents-PosToDelete;
			//if there dates after this one, delete all future events 
			this.ValueVec.splice(PosToDelete, NumToDelete);
			this.Time.splice(PosToDelete, NumToDelete);
			this.NumberOfEvents=PosToDelete;
		} 
	}
};


EventVector.prototype.Get= function (Time){
	//Current.Value=Value at this time
	//Current.Time=Time when this value first started
	//Current.Pos=Position in the array that this time occurred
	var Current={};
	if (this.NumberOfEvents==0){// if no times are set
		Current.Value=Number.NaN;
		Current.Time=Number.NaN;
		Current.Pos=Number.NaN;
		return Current;
	}
	else if (Time<this.Time[0]){ // if before the first one is set 
		Current.Value=Number.NaN;
		Current.Time=Number.NaN;
		Current.Pos=-1;//note the negative position indicates the position relative to the zeroth index (i.e. this event occurs prior to i=0)
		return Current;
	}
	else if (this.Time[this.NumberOfEvents-1]<=Time){ // if after the last time
		Current.Value=this.ValueVec[this.NumberOfEvents-1];
		Current.Time=this.Time[this.NumberOfEvents-1];
		Current.Pos=this.NumberOfEvents-1;
		return Current;
	}
	else {//loop through all the middle places (the above should have ensured that there are at least 2 items in the array)
		for (var i=0; i<this.NumberOfEvents-1; i++){
			if (this.Time[i]<=Time&&Time<this.Time[i+1]){
				Current.Value=this.ValueVec[i];
				Current.Time=this.Time[i];
				Current.Pos=i;
				return Current;
			}
		}
	}
};

EventVector.prototype.Value= function (Time){

	if (this.NumberOfEvents==0){// if no times are set
		return Number.NaN;
	}
	else if (Time<this.Time[0]){ // if before the first one is set 
		return Number.NaN;
	}
	else if (this.Time[this.NumberOfEvents-1]<=Time){ // if after the last time. Checking this first will be much more efficient
		return this.ValueVec[this.NumberOfEvents-1];
	}
	else {//loop through all the middle places (the above should have ensured that there are at least 2 items in the array)
		for (var i=0; i<this.NumberOfEvents-1; i++){
			if (this.Time[i]<=Time&&Time<this.Time[i+1]){
				return this.ValueVec[i];
			}
		}
	}
};



EventVector.prototype.GetRange= function (Time1, Time2, StepSize){
	// This function returns the value of the variable from Time1 to Time2 with time between determined by StepSize
	//Note that this algorithm is pretty inefficient. We'll need to vectorise this 
	
	console.error("this is highly inefficient and should not be used. Instead, convert to an event counting/displying function");
	
	var ReturnVec=[];
	tCount=0;
	for (var t=Time1; t<Time2; StepSize){
		ReturnVec[tcount]=this.Value(t);
		tCount++;
	}
	ReturnVec[tcount]=this.Value(Time2);// Note that this value is here to avoid rounding error

	return ReturnVec;
};

// (Value, Time1, Time2, StepSize) 
// Return a 0 or 1, depending on whether this value is true or not
// ValueByTimeVec=this.GetRange(Time1, Time2, StepSize);
// for each element of ValueByTimeVec
// if the value is the same in that point
// Set that element to true, else false

EventVector.prototype.TimeOf= function (EventValue){
	//Returns a vector of the time of all the events that match that description.
	// for each element of the vector
	// if the event matches
	// add time to the return vector
	var DatesThisEventOccurred=[];
	for (var i=0; i<this.ValueVec.length; i++){
		if (EventValue==this.ValueVec[i]){
			DatesThisEventOccurred.push(this.Time[i]);
		}
	}
	return DatesThisEventOccurred;
};

EventVector.prototype.FirstTimeOf= function (EventValue){
	for (var i=0; i<this.ValueVec.length; i++){
		if (EventValue==this.ValueVec[i]){
			return this.Time[i];
		}
	}
	return NaN;
};



EventVector.prototype.Next= function (Time){
	var Current={};
	if (this.NumberOfEvents==0){// if no times are set
		Current.Value=Number.NaN;
		Current.Time=Number.NaN;
		Current.Pos=Number.NaN;
		return Current;
	}
	else if (this.Time[this.NumberOfEvents-1]<=Time){ // if after the last time
		// Note that this is non-inclusive
		Current.Value=NaN;
		Current.Time=NaN;
		Current.Pos=NaN;// indicates thar there are no future events
		return Current;
	}
	else {//loop through all the middle places (the above should have ensured that there are at least 2 items in the array)
		for (var i=0; i<this.NumberOfEvents; i++){
			if (Time<this.Time[i]){
				Current.Value=this.ValueVec[i];
				Current.Time=this.Time[i];
				Current.Pos=i;
				return Current;
			}
		}
	}

	// if an element is not fount, return a NaN result
	Current.Value=Number.NaN;
	Current.Time=Number.NaN;
	Current.Pos=Number.NaN;
	return Current;
};

// a=new EventVector();
// a.Set(0, 1985);
// a.Set(10, 1990);
// a.Set(20, 1997);
// a.Set(30, 2003);
// a.Set(40, 2007);
// a.Set(50, 2010);
// b=a.Next(1)
// b=a.Next(1980)
// b=a.Next(1985)
// b=a.Next(2009)
// b=a.Next(2010)


EventVector.prototype.EventsBetween= function (Time1, Time2){
	// Note that this function only returns values between
	// It is left side inclusive, so if there is an event '22' at 2010, b=a.EventsBetween(2010, 2011); gives b[0].Value=22
	// It does not count events priot to Time1, so if there is an event '22' at 2010 and so if there is an event '11' at 1999, b=a.EventsBetween(2010, 2011); gives b[0].Value=22, not 11
	
	if (Time1>Time2){
		console.error("Error trace");
		throw "An error occured in determining events. See error trace above";
	}
	
	var Current=[];
	var EventCount=-1;
	if (this.NumberOfEvents==0){// if no times are set
		return Current;
	}
	else if (this.Time[this.NumberOfEvents-1]<Time1){ // if after the start time
		return Current;
	}
	else {//loop through all the middle places (the above should have ensured that there are at least 2 items in the array)
		for (var i=0; i<this.NumberOfEvents && this.Time[i]<Time2; i++){// this is a rare example of the double for loop condition. Care needs to be taken that the period is inclusive. That is, i++ is different to ++i
			if (Time1<=this.Time[i] && this.Time[i]<Time2){
				EventCount++;
				Current[EventCount]={};
				
				Current[EventCount].Value=this.ValueVec[i];
				Current[EventCount].Time=this.Time[i];
				Current[EventCount].Pos=i;
			}
		}
	}

	// if an element is not fount, return an empty vector
	return Current;
};

//a=new EventVector();
//a.Set(0, 1985);
//a.Set(10, 1990);
//a.Set(20, 1997);
//a.Set(30, 2003);
//a.Set(40, 2007);
//a.Set(50, 2010);
// b=a.EventsBetween(1990, 1986);
// b=a.EventsBetween(1970, 1986);
// b=a.EventsBetween(1970, 1971);
// b=a.EventsBetween(1970, 2011);
// b=a.EventsBetween(2010, 2011);
// b=a.EventsBetween(2011, 2012);


EventVector.prototype.CountEvents= function (EventValue, Time1, Time2){
	// Counts the number of times the event happens in the period [Year1, Year2)
	console.error("This function is not yet implemented.");

};



//DurationOf(EventValue, WhenToStop(i.e. death))
// Determines the total amount of time spent in this status


