// Fullscreen.js
// Provides full screen functionality, particularly useful for making pictures and videos full screen

// All sub divs should use 100% of the space, such that when full screen occurs, the sub divs expand appropriately.

function GoFullScreen (RelevantElement){
var i = document.getElementById(RelevantElement);
 
// go full-screen
if (i.requestFullscreen) {
    i.requestFullscreen();
} else if (i.webkitRequestFullscreen) {
    i.webkitRequestFullscreen();
} else if (i.mozRequestFullScreen) {
    i.mozRequestFullScreen();
} else if (i.msRequestFullscreen) {
    i.msRequestFullscreen();
}
}