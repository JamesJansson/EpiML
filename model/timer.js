// Timers functions
function RecordingTimer(Name){
	this.TimerStart;
	this.TimerFinish;
	this.CurrentTime=0;
	this.Increase=0;
	this.TotalTime=0;
	
	if (typeof(Name)!="undefined"){
		this.Name=Name;
	}
	else {
		this.Name="Unnamed RecordingTimer";
	}
};

RecordingTimer.prototype.Start= function (){
	this.TimerStart = new Date().getTime() / 1000;
};

RecordingTimer.prototype.Stop= function (){
	this.TimerStop = new Date().getTime() / 1000;
	var Current=this.TimerStop-this.TimerStart;
	this.Increase=(Current-this.CurrentTime)/this.CurrentTime;
	this.CurrentTime=Current;
	this.TotalTime+=Current;
};

RecordingTimer.prototype.Display= function (){
	console.log("" + this.Name + " Total time: " + this.TotalTime + " Most recent time: " + this.CurrentTime + " Increase in time: " + Math.round(this.Increase*100) +"%" );
};
	
	
// Example usage
// var FunctionTimer=new RecordingTimer("FunctionTimer");
// for (var i=0; i<100; i++){
// 	SomeOtherFunction();// We don't want to time this element
// 	FunctionTimer.Start();
// 	FunctionYouWantToTime();
// 	FunctionTimer.Stop();
// 	FunctionTimer.Display();
// }
	