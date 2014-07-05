


function  SimObject(SimSize)
{
	this.Infected=SimSize;
	this.Diagnosed=Diagnosed;
}










// General mathematical functions that are used during simulations

function TimeUntilEvent(Probability)
{
	// r=annual probability
	// p=random number between 0 and 1
	// p=r^t
	// p=e^(ln(r)t)
	// t=ln(p)/ln(r)
	
	return (Math.log(Math.random())/Math.log(Probability));
}

for (var i=1; i<10000; i++)
{
	console.log(TimeUntilEvent(0.3));
}