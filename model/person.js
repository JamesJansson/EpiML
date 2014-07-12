function  PersonObject()//(Sex, YearOfBirth)
{
	YearOfBirth=1985;
	Sex=1;
	
	this.Active=1;
	this.Alive=1;
	this.Sex=Sex;
	this.YearOfBirth=YearOfBirth;
	this.YearOfDeath=3E9;
	this.HCV = new HCVObject(YearOfBirth);
	
	//this.HIV
	//this.QALY
	
	//Simulate general mortality

}

PersonObject.prototype.Age= function (Year){//using prototyping for speed
	return Year-this.YearOfBirth;
};
