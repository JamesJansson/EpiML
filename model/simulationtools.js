// General mathematical functions that are used during simulations

// Determines the time between now and an event which occurs on a probabilistic basis
function TimeUntilEvent(Probability){
	// r=annual probability
	// p=random number between 0 and 1
	// p=r^t
	// p=e^(ln(r)t)
	// t=ln(p)/ln(r)
	return (Math.log(Rand.Value())/Math.log(1-Probability));
}





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
		Current.Value=NaN;
		Current.Time=NaN;
		Current.Pos=NaN;// indicates thar there are no future events
		return Current;
	}
	else {//loop through all the middle places (the above should have ensured that there are at least 2 items in the array)
		for (var i=0; i<this.NumberOfEvents-1; i++){
			if (Time<this.Time[i]){
				Current.Value=this.ValueVec[i];
				Current.Time=this.Time[i];
				Current.Pos=i;
				return Current;
			}
		}
	}






	var Current=this.Get(Time);
	
	//if it is the last
	if (Current.Pos==this.NumberOfEvents-1){
		return NaN;
	}
	// return the next one
	return this.ValueVec[Current.Pos+1];
};





EventVector.prototype.CountEvents= function (EventValue, Time1, Time2){
	// Counts the number of times the event happens in the period [Year1, Year2)
	

};



//DurationOf(EventValue, WhenToStop(i.e. death))
// Determines the total amount of time spent in this status


