// General mathematical functions that are used during simulations
function TimeUntilEvent(Probability)
{
	// r=annual probability
	// p=random number between 0 and 1
	// p=r^t
	// p=e^(ln(r)t)
	// t=ln(p)/ln(r)
	return (Math.log(lcg.rand())/Math.log(1-Probability));
}

// Zero matrix
function ZeroMatrix(xsize, ysize){
	ReturnMatrix=[]
	ZeroVector=[];
	for (i=0; i<ysize; i++){
		ZeroVector[i]=0;
	}
	for (i=0; i<xsize; i++){
		ReturnMatrix[i]=ZeroVector.slice();//used to copy array, rather than copy a pointer to the array
	}
	return ReturnMatrix;
}






// Event vector
function EventVector(){
	this.Value=[];
	this.Time=[];
	this.NumberOfEvents=0;
}

EventVector.prototype.Set= function (Value, Time){
	if (this.NumberOfEvents>0){
		//Determine if the current time is prior the last time
		if (Time<=this.Time[this.NumberOfEvents-1]){//falls directly on that time, delete because we don't want zero time events
			//Determine where the current event would sit
			Current=this.Get(Time);
			if (Current.Time==Time){//falls directly on that time, delete because we don't want zero time events
				PosToDelete=Current.Pos;
			}else{
				PosToDelete=Current.Pos+1;
			}
			NumToDelete=this.NumberOfEvents-PosToDelete;
			//if there dates after this one, delete all future events 
			this.Value.splice(PosToDelete, NumToDelete);
			this.Time.splice(PosToDelete, NumToDelete);
			this.NumberOfEvents=PosToDelete;
		} 
	}
	//Add new items to the end of the array
	this.Value.push(Value);
	this.Time.push(Time);
	this.NumberOfEvents++;
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
		Current.Value=this.Value[this.NumberOfEvents-1];
		Current.Time=this.Time[this.NumberOfEvents-1];
		Current.Pos=this.NumberOfEvents-1;
		return Current;
	}
	else {//loop through all the middle places (the above should have ensured that there are at least 2 items in the array)
		for (var i=0; i<this.NumberOfEvents-1; i++){
			if (this.Time[i]<=Time&&Time<this.Time[i+1]){
				Current.Value=this.Value[i];
				Current.Time=this.Time[i];
				Current.Pos=i;
				return Current;
			}
		}
	}
}