// This file holds the scripts that are run when buttons are pressed (to reduce the since of model.htm)

function SaveParameters(){
	ParamJSONString=JSON.stringify(Param);
	var blob = new Blob([ParamJSONString], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "parameters.json");
}