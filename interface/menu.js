
//Clean up tabs
ShowMenu(HomeContent)

function ShowMenu(ToShow){
	HideAllMainArea();
	ToShow.style.visibility = 'visible';
}

function HideAllMainArea(){
	nodes = MainArea.childNodes;
	for(var i=0; i<nodes.length; i++) {
		if (nodes[i].nodeName.toLowerCase() == 'div') {
			nodes[i].style.visibility = 'hidden';
		}
	}
}