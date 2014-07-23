
function ToggleDisplay(SectionRef, ClassToToggle){
	if (SectionRef.parentNode.getElementsByClassName(ClassToToggle)[0].style.display=='none'){
		SectionRef.parentNode.getElementsByClassName(ClassToToggle)[0].style.display='';
	}
	else{
		SectionRef.parentNode.getElementsByClassName(ClassToToggle)[0].style.display='none';
	}

}