function InterventionObject(){
	this.Name="";
	this.Data;
	this.RunFunction=function(Time){};
	this.ResetFunction=function(){};// undo any of the changes that were made by RunFunction. Don't do anything if unset
}

// example usage:
// Intervention[1]=new InterventionObject();
// Intervention[1].Name="Increase Treatment";
// Intervention[1].RunFunction=function (Time){
	// if (Time<2014){
		// Param.HCV.Treatment=1000;
	// }
	// else{
		// Param.HCV.Treatment=1000+0.1*Time;
	// }
// }	






