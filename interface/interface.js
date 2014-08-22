//Set up the interface
// for each subgroup
//   put data in <div id="HCVParams">
//	 for each parameter in each subgroup
// Code inspired by http://stackoverflow.com/questions/208016/how-to-list-the-properties-of-a-javascript-object
function DisplayParameters(ParamGroup, ParamGroupDivName){
	BuildText="";
	for (var key in ParamGroup) {
		if (ParamGroup.hasOwnProperty(key)) {
			//maybe also check here that the parameter is not an array, other wise use a different function 
			console.log(ParamGroup[key]);
			//
			BuildText=BuildText+"                <form class=\"ParamContainer\" id=\""+ParamGroup[key].InterfaceID+"\"></form>\n";
		}
	}
	console.log(BuildText);
}


//   create a new 'form' element 

// Renaming a key for an object
//if (old_key !== new_key) {
//    Object.defineProperty(o, new_key, Object.getOwnPropertyDescriptor(o, old_key));
//    delete o[old_key];
//}