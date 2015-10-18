// Fullscreen.js
// Provides full screen functionality, particularly useful for making pictures and videos full screen

// All sub divs should use 100% of the space, such that when full screen occurs, the sub divs expand appropriately.
// This function is based on the answer provided by Drew Noakes here: http://stackoverflow.com/questions/7836204/chrome-fullscreen-api

function ToggleFullScreen(ElementID)
{
    if (isFullScreen())
        ExitFullScreen();
    else
        EnterFullScreen (ElementID);
}

function isFullScreen()
{
    return (document.fullScreenElement && document.fullScreenElement !== null)
         || document.mozFullScreen
         || document.webkitIsFullScreen;
}

function EnterFullScreen (ElementID){
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




function ExitFullScreen()
{
    if (document.exitFullscreen)
        document.exitFullscreen();
    else if (document.msExitFullscreen)
        document.msExitFullscreen();
    else if (document.mozCancelFullScreen)
        document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen)
        document.webkitExitFullscreen();
}




