// This file holds the scripts that are run when buttons are pressed (to reduce the since of model.htm)

function SaveParameters(){
	var ParamJSONString=JSON.stringify(Param, null, 4);//gives 4 spaces between elements
	var blob = new Blob([ParamJSONString], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "parameters.json");
}