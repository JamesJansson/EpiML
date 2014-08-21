// ToggleDisplay is used to show or hide the first child element of the parent of SectionRef
// Essentially, SectionRef->ParentOfSectionRef->FirstChildOfParentRefCalledClassToToggle
function ToggleDisplay(SectionRef, ClassToToggle){
	if (SectionRef.parentNode.getElementsByClassName(ClassToToggle)[0].style.display=='none'){
		SectionRef.parentNode.getElementsByClassName(ClassToToggle)[0].style.display='';
	}
	else{
		SectionRef.parentNode.getElementsByClassName(ClassToToggle)[0].style.display='none';
	}

}


//Update parameter display (used when loading the parameters from file or after optimisation)



//Load parameter value into the Param holder for use in the simulation