function  HCVObject(Infected, Diagnosed)
{
	this.Infected=Infected;
	this.Diagnosed=Diagnosed;
	//console.log(this.parentNode);
}

HCVObject.prototype.Age= function (Year){//using prototyping for speed
	return Year-this.YearOfBirth;
};