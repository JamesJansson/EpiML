
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