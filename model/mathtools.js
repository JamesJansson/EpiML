
// Sort numerically
function SortNumerically(SNInputVector){
	// this function sorts the vector as given and returns the index of sorting
	SNInputVector.sort(function(a, b) {return a - b;});
		//var b = a.slice();

}

function ApplyIndex(AIInputVector, AIIndex){
	// Applies the index AIIndex to AIInputVector. Note that this function does not return the index, it simply operates on AIInputVector
	if (AIInputVector.length!=AIIndex.length){
		console.error("Arrays incorrect length");
	}
	//Back up the array
	Temp= AIInputVector.slice();
	//Apply the array
	for (i=0; i<AIInputVector.length; i++){
		if (AIIndex[i]>=AIInputVector.length){
			console.error("Index exceeds size of array.");
		}
		AIInputVector[i]=Temp[AIIndex[i]];
	}
}



//Create an array of values
function AscendingArray(StartValue, EndValue, IncrementBy){
    ReturnArray=[];

    for (i=StartValue; i<=EndValue; i=i+IncrementBy){
        ReturnArray.push(i);
    }
    return ReturnArray;
}



// Zero matrix
function ZeroMatrix(xsize, ysize){
	ReturnMatrix=[]
	ZeroVector=[];
	for (i=0; i<ysize; i++){
		ZeroVector[i]=0;
	}
	for (i=0; i<xsize; i++){
		ReturnMatrix[i]=ZeroVector.slice();//used to copy array, rather than copy a pointer to the array
	}
	return ReturnMatrix;
}

// Array operations
function AddArrays(Array1, Array2){
	if (Array1.length!=Array2.length){
		error("Arrays are incorrect length");
	}
	ArrayResult=new Array(Array1.length);
	
	for (i=0; i<Array1.length;i++){
		ArrayResult[i]=Array1[i]+Array2[i];
	}
	return ArrayResult;
}

function MinusArrays(Array1, Array2){
	if (Array1.length!=Array2.length){
		error("Arrays are incorrect length");
	}
	ArrayResult=new Array(Array1.length);
	
	for (i=0; i<Array1.length;i++){
		ArrayResult[i]=Array1[i]-Array2[i];
	}
	return ArrayResult;
}

function MultiplyArrays(Array1, Array2){
	if (Array1.length!=Array2.length){
		error("Arrays are incorrect length");
	}
	ArrayResult=new Array(Array1.length);
	
	for (i=0; i<Array1.length;i++){
		ArrayResult[i]=Array1[i]*Array2[i];
	}
	return ArrayResult;
}

function DivideArrays(Array1, Array2){
	if (Array1.length!=Array2.length){
		error("Arrays are incorrect length");
	}
	ArrayResult=new Array(Array1.length);
	
	for (i=0; i<Array1.length;i++){
		ArrayResult[i]=Array1[i]/Array2[i];
	}
	return ArrayResult;
}

// Normal distribution function
// Note that in order to work, this function requires the random number generator lcgrand.js
function NormalRand(Mean, SD){
	// Create the distribution around zero
	// Using the Box-Muller transform
	Z=Math.sqrt(-2*Math.log(lcg.rand()))*Math.cos(2*Math.PI*lcg.rand());
	// Using central limit theorem
	//Z=lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()-6;
	//Z=Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()-6;
	// Increase the deviation to the standard deviation specified amount, adjust such that the distribution is centred about the mean
	Z=Mean+Z*SD;
	return Z;
}

function NormalRandArray(Mean, SD, Num){
	// Create the distribution around zero
	// Using the Box-Muller transform
	//StartTime = new Date().getTime();
	var Z=[];
	for (var i=0; i<Num; i++){
		Z[i]=Math.sqrt(-2*Math.log(lcg.rand()))*Math.cos(2*Math.PI*lcg.rand());
		// Using central limit theorem
		//Z[i]=lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()-6;
		//Z[i]=Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()-6;
		// Increase the deviation to the standard deviation specified amount, adjust such that the distribution is centred about the mean
		Z[i]=Mean+Z[i]*SD;
	}
	//StopTime = new Date().getTime();
	//console.log(StopTime-StartTime);
	return Z;
}

function NormalRandFillUp(Mean, SD, Array){
	// Create the distribution around zero
	// Using the Box-Muller transform
	//StartTime = new Date().getTime();
	for (var i=0; i<Array.length; i++){
		Array[i]=Math.sqrt(-2*Math.log(lcg.rand()))*Math.cos(2*Math.PI*lcg.rand());
		// Using central limit theorem
		//Z[i]=lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()-6;
		//Z[i]=Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()-6;
		// Increase the deviation to the standard deviation specified amount, adjust such that the distribution is centred about the mean
		Array[i]=Mean+Array[i]*SD;
	}
	//StopTime = new Date().getTime();
	//console.log(StopTime-StartTime);
}

function TestRandSpeed(){
	StartTime = new Date().getTime();
	t=0;
	for (var i=0; i<10000000; i++){
		t=t+Math.random()-0.5;
	}
	StopTime = new Date().getTime();
	console.log(StopTime-StartTime);
}


function Logistic(x){//
	return (1/(1+Math.exp(-x)));
}
function Logit(x){//inverse of logistic. Must take value on(0,1)
	return (-Math.log(1/x-1));
}





