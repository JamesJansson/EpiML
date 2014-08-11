// Mathtools
// Mathtools is the mathematicians' lazy library for javascript. The library operates on simple arrays.
// This library breaks a lot of the standards of javascript, but is intended to make for easily read code from a mathematician's perspective.
// This library copies code from jstat https://github.com/jstat/jstat
// Code is especially ripped from https://github.com/jstat/jstat/blob/master/src/vector.js
// As such, this library is licensed using the MIT license 

// Sum of an array
function Sum(arr) {
  var sum = 0;
  var i = arr.length;
  var tmp;
  while (--i >= 0)
    sum += arr[i];
  return sum;
}

// Mean value of an array
function Mean(arr) {
  return Sum(arr) / arr.length;
}

// Median of an array
function Median(MInputVector){
	VectorCopy=MInputVector.slice();
	SortNumerically(VectorCopy);
	VecLength=VectorCopy.length;
	if ((VecLength%2)==1){//odd number of elements
		return VectorCopy[(VecLength-1)/2];//chose the middle value
	}
	else{
		return (VectorCopy[(VecLength)/2]+VectorCopy[(VecLength)/2-1])/2;
	}
}

function CumSum(arr) {
  var len = arr.length;
  var sums = new Array(len);
  var i;
  sums[0] = arr[0];
  for (i = 1; i < len; i++)
    sums[i] = sums[i - 1] + arr[i];
  return sums;
}


// minimum value of an array
function Min(arr) {
  var low = arr[0];
  var i = 0;
  while (++i < arr.length)
    if (arr[i] < low)
      low = arr[i];
  return low;
}

// maximum value of an array
function Max(arr) {
  var high = arr[0];
  var i = 0;
  while (++i < arr.length)
    if (arr[i] > high)
      high = arr[i];
  return high;
}

/*
// sum of squared errors of prediction (SSE)
jStat.sumsqerr = function sumsqerr(arr) {
  var mean = jStat.mean(arr);
  var sum = 0;
  var i = arr.length;
  var tmp;
  while (--i >= 0) {
    tmp = arr[i] - mean;
    sum += tmp * tmp;
  }
  return sum;
};
*/


/*
// variance of an array
// flag indicates population vs sample
jStat.variance = function variance(arr, flag) {
  return jStat.sumsqerr(arr) / (arr.length - (flag ? 1 : 0));
};


// standard deviation of an array
// flag indicates population vs sample
jStat.stdev = function stdev(arr, flag) {
  return Math.sqrt(jStat.variance(arr, flag));
};*/

/*
// covariance of two arrays
jStat.covariance = function covariance(arr1, arr2) {
  var u = jStat.mean(arr1);
  var v = jStat.mean(arr2);
  var arr1Len = arr1.length;
  var sq_dev = new Array(arr1Len);
  var i;

  for (i = 0; i < arr1Len; i++)
    sq_dev[i] = (arr1[i] - u) * (arr2[i] - v);

  return jStat.sum(sq_dev) / (arr1Len - 1);
};


// (pearson's) population correlation coefficient, rho
jStat.corrcoeff = function corrcoeff(arr1, arr2) {
  return jStat.covariance(arr1, arr2) /
      jStat.stdev(arr1, 1) /
      jStat.stdev(arr2, 1);
};*/





// Sort numerically
function SortNumerically(SNInputVector){
	// this function sorts the vector as given and returns the index of sorting
	//SNInputVector.sort(function(a, b) {return a - b;});//this sorting mechanism does a simple numerical sort
	
	// The below is inspired from the lessons of this tutorial http://www.sitepoint.com/sophisticated-sorting-in-javascript/ 
	// Create a multidimensional vector
	var MultiVec=[];
	var i;
	for (i=0; i<SNInputVector.length; i++){
		MultiVec[i]=[];
		MultiVec[i][0]=i;// the index that will be sorted at the same time
		MultiVec[i][1]=SNInputVector[i];
	} 
	//Sort the structure
	MultiVec.sort(function(a, b) {return a[1] - b[1];});//this sorting mechanism does a simple numerical sort
	//Separate the structure
	var IndexVector=[];
	for (i=0; i<SNInputVector.length; i++){
		SNInputVector[i]=MultiVec[i][1];
		IndexVector[i]=MultiVec[i][0];
	} 
	
	return IndexVector;
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

//Create an array of zeros
function ZeroArray(Length){
    ReturnArray=[];
	for (i=0; i<Length; i++){
		ReturnArray[i]=0;
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





