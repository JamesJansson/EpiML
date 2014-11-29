// Fullscreen.js
// Provides full screen functionality, particularly useful for making pictures and videos full screen

// All sub divs should use 100% of the space, such that when full screen occurs, the sub divs expand appropriately.

function GoFullScreen (ElementID){
	var i = document.getElementById(ElementID);
	 
	// go full-screen
	if (typeof(i.requestFullscreen) != "undefined") {
		i.requestFullscreen();
	} else if (typeof(i.webkitRequestFullscreen) != "undefined") {
		i.webkitRequestFullscreen();
	} else if (typeof(i.mozRequestFullScreen) != "undefined") {
		i.mozRequestFullScreen();
	} else if (typeof(i.msRequestFullscreen) != "undefined") {
		i.msRequestFullscreen();
	}
}





