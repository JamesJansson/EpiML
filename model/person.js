function  PersonObject(Sex, YearOfBirth)
{
	this.Active=1;
	this.Alive=1;
	this.Sex=Sex;
	this.YearOfBirth=YearOfBirth;
	this.YearOfDeath=3E9;
	this.HCV = new HCVObject(0, 0);
}