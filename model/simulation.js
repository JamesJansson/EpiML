


function  SimObject(SimSize)
{
	this.Infected=SimSize;
	this.Diagnosed=Diagnosed;
	
	//intervention start
		//keep simulating as normal until this date
	//intervention instructions
		//at this date, change the parameters accordingly
	//optimisation
}










// General mathematical functions that are used during simulations

function TimeUntilEvent(Probability)
{
	// r=annual probability
	// p=random number between 0 and 1
	// p=r^t
	// p=e^(ln(r)t)
	// t=ln(p)/ln(r)
	
	return (Math.log(Math.random())/Math.log(1-Probability));
}

