var Intervention=[];// This is a global object that can be accessed by the simulation at any time it desires

Intervention[0]=new InterventionObject();

Intervention[0]=new InterventionObject();
Intervention[0].Name="No intervention";
Intervention[0].Function=function (Time){};

Intervention[1]=new InterventionObject();
Intervention[1].Name="100% Treatment";
Intervention[1].Function=function (Time){
	if (Time<2016){
		Param.HCV.Treatment.Sofosbuvir=0.0;
	}
	else{
		Param.HCV.Treatment.Sofosbuvir=0.10;
	}
};

Intervention[1]=new InterventionObject();
Intervention[1].Name="100% Treatment";
Intervention[1].Function=function (Time){
	if (Time<2016){
		SofosbuvirTreatmentDecider=function (Person){
			if (Person.HCV.Stage()>=3){
				return true;
			}
		};
	}
	else{
		SofosbuvirTreatmentDecider=function (Person){
			if (Person.HCV.Stage()>=1){
				return true;
			}
		};
	}
};



