//Set up the interface
// for each subgroup
//   put data in <div id="HCVParams">
//	 for each parameter in each subgroup

function LoadParameterPages(ParamGroup, ParamGroupDivId){
	var BuildText="";
	for (var key in ParamGroup) {// Code inspired by http://stackoverflow.com/questions/208016/how-to-list-the-properties-of-a-javascript-object
		if (ParamGroup.hasOwnProperty(key)) {
			//maybe also check here that the parameter is not an array, other wise use a different function 
			ParamGroup[key].InterfaceID=ParamGroupDivId+key;
			BuildText=BuildText+"                <form class=\"ParamContainer\" id=\""+ParamGroup[key].InterfaceID+"\"></form>\n";
		}
	}
	document.getElementById(ParamGroupDivId).innerHTML = BuildText;
	
	//Load each of the holders with the parameters that should be held
	for (var key in ParamGroup) {
		if (ParamGroup.hasOwnProperty(key)) {
			//Update display of parameter
			//ParamGroup[key].UpdateDisplay();
		}
	}
}


function AddNewParameter(ParamGroup, ParamGroupDivId){
	


}



//   create a new 'form' element 

// Renaming a key for an object
//if (old_key !== new_key) {
//    Object.defineProperty(o, new_key, Object.getOwnPropertyDescriptor(o, old_key));
//    delete o[old_key];
//}