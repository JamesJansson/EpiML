// Mathtools
// Mathtools is the mathematicians' lazy library for javascript. The library operates on simple arrays.
// This library breaks a lot of the standards of javascript, but is intended to make for easily read code from a mathematician's perspective.
// This library copies code from jstat https://github.com/jstat/jstat
// Code is especially ripped from https://github.com/jstat/jstat/blob/master/src/vector.js
// As such, this library is licensed using the MIT license 

var MathToolsRunning=true;

// STATISTICAL FUNCTIONS

// Sum of an array or matrix
function Sum(arr) {
  var sum = 0;
  var i = arr.length;
  var tmp;
  while (--i >= 0){
	if (typeof arr[i] == 'object'){
		sum +=Sum(arr[i]);// look at all the sub elements
	} else if (typeof arr[i] == 'number'){
		sum += arr[i];
	}else{
		console.error("An error occured");throw "A non-array/non-number type was found using Sum.";
	}
  }
  return sum;
}

// Mean value of an array
function Mean(arr) {
  return Sum(arr) / arr.length;
}

// Median of an array
function Median(MInputVector){
	var VectorCopy=SortByValue(MInputVector);

	VecLength=VectorCopy.length;
	if ((VecLength%2)==1){//odd number of elements
		return VectorCopy[(VecLength-1)/2];//chose the middle value
	}
	else{
		return (VectorCopy[(VecLength)/2]+VectorCopy[(VecLength)/2-1])/2;
	}
}

// percentile of an array
function Percentile(MInputVector, PercentileValue){
	var VectorCopy=SortByValue(MInputVector);
	
	var Frac=PercentileValue/100;
	var LeftIndex=Math.floor((VectorCopy.length-1)*Frac);
	if (LeftIndex==VectorCopy.length-1){// if the percentile as close to 100% as error will allow
		return VectorCopy[LeftIndex];
	}
	
	if (VectorCopy[LeftIndex]==VectorCopy[LeftIndex+1]){// if there is no interpolation to be done
		return VectorCopy[LeftIndex];
	}
	
	// find the distance between the left and right position
	var DistanceBetween=1/(VectorCopy.length-1);
	var LeftDistance=DistanceBetween*LeftIndex;
	var Prop=(Frac-LeftDistance)/DistanceBetween;
	if (Prop<1e-12){// this is to avoid round off errors. For this to become a real problem, the array will have to occupy 4TB of RAM. Unlikely to be a problem before 2024
		Prop=0;
	}
	return VectorCopy[LeftIndex]*(1-Prop)+VectorCopy[LeftIndex+1]*Prop;
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


// sum of squared errors of prediction (SSE)
function SumSqErr(arr) {
  var meanval = Mean(arr);
  var sum = 0;
  var i = arr.length;
  var tmp;
  while (--i >= 0) {
    tmp = arr[i] - meanval;
    sum += tmp * tmp;
  }
  return sum;
};

function SampleVariance(arr){
	return SumSqErr(arr) / (arr.length - 1);
};

function SampleStandardDeviation(arr){//Sample Standard Deviation
	return Math.sqrt(SampleVariance(arr));
};

function PopulationVariance(arr){
	return SumSqErr(arr) / (arr.length);
};

function PopulationStandardDeviation(arr){//Sample Standard Deviation
	return Math.sqrt(PopulationVariance(arr));
};


function Variance(){
	console.error("Please either use SampleVariance or PopulationVariance")	
};

function StandardDeviation(){
	console.error("Please either use SampleStandardDeviation or PopulationStandardDeviation")	
};



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


// Histogram data
// Generates data that can be used in a histogram

function HistogramData(Data, BinBoundaries){// the BinBoundaries are inclusive of the lower bound, but not inclusive of the upper
	var HistData={};
	HistData.Data=Data.slice();//Copy the data into the object
	
	var NumBins=BinBoundaries.length-1;
	HistData.BinLower=[];//
	HistData.BinUpper=[];
	HistData.Count=[];

	for (var i=0; i<NumBins; i++){
		HistData.BinLower[i]=BinBoundaries[i];
		HistData.BinUpper[i]=BinBoundaries[i+1];
		HistData.Count[i]=0;
	}
	
	HistData.DataOutsideBoundaries=[];
	var PointsOutideBoundaries=0;

	for (var i=0; i<Data.length; i++){//each point in the data set
		//Check if the value is in the range
		var BinFound=false;
		if (Data[i]>=HistData.BinLower[0]){//if it is in this range, do the check
			var BinNum=0;
			while(BinNum<NumBins && BinFound==false){
				if (HistData.BinLower[BinNum]<=Data[i] && Data[i]<HistData.BinUpper[BinNum] ){// the item should be placed here
					BinFound=true;
					HistData.Count[BinNum]++;
				}
				BinNum++;
			}
		}
		if (BinFound==false){
			HistData.DataOutsideBoundaries[PointsOutideBoundaries]=Data[i];
			PointsOutideBoundaries++;
		}
	}

	return HistData;
}
	//TestHist=HistogramData([1.5, 1.0, 1.6, 0.5, 2.0, 2.5, 2.6, 2.6, 2.7, 3.1, 3.2, 6], [1, 2, 3, 4]); 
	//HistData.Width=
	//HistData.Height=Count/Width


// ARRAY FUNCTIONS

// Sort numerically
function SortByValue(MInputVector){//Sorts by numerical value, returns results
	var VectorCopy=MInputVector.slice();
	VectorCopy.sort(function(a, b) {return a - b;});
	
	return VectorCopy;
}

// Find the index of sorting an array numerically
function SortIndex(SNInputVector){
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
		IndexVector[i]=MultiVec[i][0];
	} 
	return IndexVector;
}




function ApplyIndex(AIInputVector, AIIndex){
	// Applies the index AIIndex to AIInputVector. Note that this function does not return the array, it simply operates on AIInputVector
	if (AIInputVector.length!=AIIndex.length){
		console.error("An error occured");throw("Arrays incorrect length");
	}
	//Back up the array
	var Temp= AIInputVector.slice();
	//Apply the array
	for (var i=0; i<AIInputVector.length; i++){
		if (AIIndex[i]>=AIInputVector.length){
			console.error("An error occured");throw("Index exceeds size of array.");
		}
		AIInputVector[i]=Temp[AIIndex[i]];
	}
}

function Select(InputVector, IndexToSelect){
	// Returns an array of the selected indices
	//Apply the array
	var ReturnArray=[];
	for (var i=0; i<IndexToSelect.length; i++){
		if (IndexToSelect[i]>=InputVector.length){
			console.error("An error occured");throw("Index exceeds size of array.");
		}
		ReturnArray[i]=InputVector[IndexToSelect[i]];
	}
	return ReturnArray;
}


//Create an array of values
function AscendingArray(StartValue, EndValue, IncrementBy){
	if (typeof(IncrementBy)==="undefined"){
		var IncrementBy=1;
	}
	
    var ReturnArray=[];

    for (var i=StartValue; i<=EndValue; i=i+IncrementBy){
        ReturnArray.push(i);
    }
    return ReturnArray;
}

//Create an array of zeros
function ZeroArray(Length){
    var ReturnArray=[];
	for (var i=0; i<Length; i++){
		ReturnArray[i]=0;
	}
    return ReturnArray;
}


// Zero matrix
function ZeroMatrix(xsize, ysize){
	var ReturnMatrix=[]
	var ZeroVector=[];
	for (var i=0; i<ysize; i++){
		ZeroVector[i]=0;
	}
	for (var i=0; i<xsize; i++){
		ReturnMatrix[i]=ZeroVector.slice();//used to copy array, rather than copy a pointer to the array
	}
	return ReturnMatrix;
}

// Array operations



function Multiply(A, B){
	if (typeof A === 'object' && typeof B === 'object'){
		return MultiplyArrayByArray(A, B);
	}
	else if (typeof A === 'number' && typeof B === 'object'){
		return MultiplyArrayByNumber(B, A);
	}
	else if (typeof A === 'object' && typeof B === 'number'){
		return MultiplyArrayByNumber(A, B);
	}
	else if (typeof A === 'number' && typeof B === 'number'){
		return A*B;
	}

	console.error("An error occured");throw("The input arguments to Multiply should be either two arrays of equal size or a number and an array");
}

function MultiplyArrayByArray(A, B){// Multiplies each element in A by the corresponding element in B
	var NewArray=[];
	if (typeof A === 'object' && typeof B === 'object'){
		if (A.length!=B.length){// if the arrays are the wrong length 
			console.error("An error occured");
			throw("The size and structure of the two objects being multiplied must be identical.");// send error
		}
		for (var key in A) {
			if (typeof A[key] != typeof B[key]){//If A and B are not the same, including if it is not defined
				console.error("An error occured");throw("The size and structure of the two objects being multiplied must be identical.");// send error
			}
			else if (typeof A[key] === 'number'){// and so is B[key]
				NewArray[key]=A[key]*B[key];
			}
			else if (typeof A[key] === 'object'){// and so is B[key]
				NewArray[key]=MultiplyArrayByArray(A[key], B[key]);
			}
			
		}
		return NewArray;
	}
	else{// if the inputs are not both arrays
		console.error("An error occured");throw("The inputs of MultiplyArrayByArray should both be arrays.");// send an error
	}
}

function MultiplyArrayByNumber(Arr, Num){// Multiplies each element in Arr by the number Num
	var NewArray=[];
	for (var key in Arr) {
		if (typeof Arr[key] === 'object'){// E.g. if it is an array of arrays, we want to multiply each element within the sub array
			NewArray[key]=MultiplyArrayByNumber(Arr[key], Num);
		}
		else if (typeof Arr[key] === 'number'){
			NewArray[key]=Arr[key]*Num;
		}
		else{// if it is a non-number type (e.g. text), return what was in the original object
			NewArray[key]=Arr[key];
		}
	}
	return NewArray;
}
// End multiply


///////Add !!!!
function Add(A, B){
	if (typeof A === 'object' && typeof B === 'object'){
		return AddArrayToArray(A, B);
	}
	else if (typeof A === 'number' && typeof B === 'object'){
		return AddArrayToNumber(B, A);
	}
	else if (typeof A === 'object' && typeof B === 'number'){
		return AddArrayToNumber(A, B);
	}
	else if (typeof A === 'number' && typeof B === 'number'){
		return A+B;
	}

	console.error("An error occured");throw("The input arguments to Add should be either two arrays of equal size or a number and an array");
}

function AddArrayToArray(A, B){// Adds each element in A by the corresponding element in B
	var NewArray=[];
	if (typeof A === 'object' && typeof B === 'object'){
		if (A.length!=B.length){// if the arrays are the wrong length 
			console.error("An error occured");
			throw("The size and structure of the two objects being addded must be identical.");// send error
		}
		for (var key in A) {
			if (typeof A[key] != typeof B[key]){//If A and B are not the same, including if it is not defined
				console.error("An error occured");throw("The size and structure of the two objects being addded must be identical.");// send error
			}
			else if (typeof A[key] === 'number'){// and so is B[key]
				NewArray[key]=A[key]+B[key];
			}
			else if (typeof A[key] === 'object'){// and so is B[key]
				NewArray[key]=AddArrayToArray(A[key], B[key]);
			}
			
		}
		return NewArray;
	}
	else{// if the inputs are not both arrays
		console.error("An error occured");throw("The inputs of AddArrayToArray should both be arrays.");// send an error
	}
}

function AddArrayToNumber(Arr, Num){// Adds each element in Arr with the number Num
	var NewArray=[];
	for (var key in Arr) {
		if (typeof Arr[key] === 'object'){// E.g. if it is an array of arrays, we want to add each element within the sub array
			NewArray[key]=AddArrayToNumber(Arr[key], Num);
		}
		else if (typeof Arr[key] === 'number'){
			NewArray[key]=Arr[key]+Num;
		}
		else{// if it is a non-number type (e.g. text), return what was in the original object
			NewArray[key]=Arr[key];
		}
	}
	return NewArray;
}

// End Add

// Start Minus

function Negate(Input){
	if (typeof Input === 'number'){
		return -Input;
	}
	else if (typeof Input === 'object'){
		var ReturnArray=[];
		for (var key in Input){
			ReturnArray[key]=Negate(Input[key]);
		}
		return ReturnArray;
	}
	else {
		return Input; // return whatever type was put in (e.g. string)
	}
}

function Minus(A, B){
	var BNeg=Negate(B);
	return Add(A, BNeg);
}

// end minus


function Reciprocal(Input){
	if (typeof Input === 'number'){
		return 1/Input;
	}
	else if (typeof Input === 'object'){
		var ReturnArray=[];
		for (var key in Input){
			ReturnArray[key]=Reciprocal(Input[key]);
		}
		return ReturnArray;
	}
	else {
		return Input; // return whatever type was put in (e.g. string)
	}
}



///////Divide
function Divide(A, B){
	if (typeof A === 'object' && typeof B === 'object'){
		return DivideArrayByArray(A, B);
	}
	else if (typeof A === 'number' && typeof B === 'object'){
		return DivideNumberByArray(A, B);
	}
	else if (typeof A === 'object' && typeof B === 'number'){
		return DivideArrayByNumber(A, B);
	}
	else if (typeof A === 'number' && typeof B === 'number'){
		return A/B;
	}

	console.error("An error occured");throw("The input arguments to Divide should be either two arrays of equal size or a number and an array");
}

function DivideArrayByArray(A, B){// Divides each element in A by the corresponding element in B
	var NewArray=[];
	if (typeof A === 'object' && typeof B === 'object'){
		if (A.length!=B.length){// if the arrays are the wrong length 
			console.error("An error occured");
			throw("The size and structure of the two objects being multiplied must be identical.");// send error
		}
		for (var key in A) {
			if (typeof A[key] != typeof B[key]){//If A and B are not the same, including if it is not defined
				console.error("An error occured");throw("The size and structure of the two objects being multiplied must be identical.");// send error
			}
			else if (typeof A[key] === 'number'){// and so is B[key]
				NewArray[key]=A[key]/B[key];
			}
			else if (typeof A[key] === 'object'){// and so is B[key]
				NewArray[key]=DivideArrayByArray(A[key], B[key]);
			}
			
		}
		return NewArray;
	}
	else{// if the inputs are not both arrays
		console.error("An error occured");throw("The inputs of DivideArrayByArray should both be arrays.");// send an error
	}
}

function DivideArrayByNumber(Arr, Num){// Divides each element in Arr by the number Num
	var NewArray=[];
	for (var key in Arr) {
		if (typeof Arr[key] === 'object'){// E.g. if it is an array of arrays, we want to Divide each element within the sub array
			NewArray[key]=DivideArrayByNumber(Arr[key], Num);
		}
		else if (typeof Arr[key] === 'number'){
			NewArray[key]=Arr[key]/Num;
		}
		else{// if it is a non-number type (e.g. text), return what was in the original object
			NewArray[key]=Arr[key];
		}
	}
	return NewArray;
}

function DivideNumberByArray(Num, Arr){// Divides num by each element in Arr 
	var NewArray=[];
	for (var key in Arr) {
		if (typeof Arr[key] === 'object'){// E.g. if it is an array of arrays, we want to Divide each element within the sub array
			NewArray[key]=DivideNumberByArray(Num, Arr[key]);
		}
		else if (typeof Arr[key] === 'number'){
			NewArray[key]=Num/Arr[key];
		}
		else{// if it is a non-number type (e.g. text), return what was in the original object
			NewArray[key]=Arr[key];
		}
	}
	return NewArray;
}

// End Divide



///////Pow
function Pow(A, B){
	if (typeof A === 'object' && typeof B === 'object'){
		return PowArrayByArray(A, B);
	}
	else if (typeof A === 'number' && typeof B === 'object'){
		return PowNumberByArray(A, B);
	}
	else if (typeof A === 'object' && typeof B === 'number'){
		return PowArrayByNumber(A, B);
	}
	else if (typeof A === 'number' && typeof B === 'number'){
		return Math.pow(A, B);
	}

	console.error("An error occured");throw("The input arguments to Pow should be either two arrays of equal size or a number and an array");
}

function PowArrayByArray(A, B){// Pows each element in A by the corresponding element in B
	var NewArray=[];
	if (typeof A === 'object' && typeof B === 'object'){
		if (A.length!=B.length){// if the arrays are the wrong length 
			console.error("An error occured");
			throw("The size and structure of the two objects being multiplied must be identical.");// send error
		}
		for (var key in A) {
			if (typeof A[key] != typeof B[key]){//If A and B are not the same, including if it is not defined
				console.error("An error occured");throw("The size and structure of the two objects being multiplied must be identical.");// send error
			}
			else if (typeof A[key] === 'number'){// and so is B[key]
				NewArray[key]=Math.pow(A[key], B[key]);
			}
			else if (typeof A[key] === 'object'){// and so is B[key]
				NewArray[key]=PowArrayByArray(A[key], B[key]);
			}
			
		}
		return NewArray;
	}
	else{// if the inputs are not both arrays
		console.error("An error occured");throw("The inputs of PowArrayByArray should both be arrays.");// send an error
	}
}

function PowArrayByNumber(Arr, Num){// Pows each element in Arr by the number Num
	var NewArray=[];
	for (var key in Arr) {
		if (typeof Arr[key] === 'object'){// E.g. if it is an array of arrays, we want to Pow each element within the sub array
			NewArray[key]=PowArrayByNumber(Arr[key], Num);
		}
		else if (typeof Arr[key] === 'number'){
			NewArray[key]=Math.pow(Arr[key], Num);
		}
		else{// if it is a non-number type (e.g. text), return what was in the original object
			NewArray[key]=Arr[key];
		}
	}
	return NewArray;
}

function PowNumberByArray(Num, Arr){// Pows num by each element in Arr 
	var NewArray=[];
	for (var key in Arr) {
		if (typeof Arr[key] === 'object'){// E.g. if it is an array of arrays, we want to Pow each element within the sub array
			NewArray[key]=PowNumberByArray(Num, Arr[key]);
		}
		else if (typeof Arr[key] === 'number'){
			NewArray[key]=Math.pow(Num, Arr[key]);
		}
		else{// if it is a non-number type (e.g. text), return what was in the original object
			NewArray[key]=Arr[key];
		}
	}
	return NewArray;
}

// End Pow








function Apply(FunctionToApply, Input){
	if (typeof Input === 'number' || typeof Input === 'boolean' ){
		return FunctionToApply(Input);
	}
	else if (typeof Input === 'object'){
		var ReturnArray=[];
		for (var key in Input){
			ReturnArray[key]=Apply(FunctionToApply, Input[key]);
		}
		return ReturnArray;
	}
	else {
		return Input; // return whatever type was put in (e.g. string)
	}
}

function Abs(Input){ return  Apply(Math.abs, Input);}
function Acos(Input){ return  Apply(Math.acos, Input);}
function Acosh(Input){ return  Apply(Math.acosh, Input);}
function Asin(Input){ return  Apply(Math.asin, Input);}
function Asinh(Input){ return  Apply(Math.asinh, Input);}
function Atan(Input){ return  Apply(Math.atan, Input);}
function Atan2(Input){ return  Apply(Math.atan2, Input);}
function Atanh(Input){ return  Apply(Math.atanh, Input);}
function Cbrt(Input){ return  Apply(Math.cbrt, Input);}
function Ceil(Input){ return  Apply(Math.ceil, Input);}
function Clz32(Input){ return  Apply(Math.clz32, Input);}
function Cos(Input){ return  Apply(Math.cos, Input);}
function Cosh(Input){ return  Apply(Math.cosh, Input);}
function Exp(Input){ return  Apply(Math.exp, Input);}
function Expm1(Input){ return  Apply(Math.expm1, Input);}
function Floor(Input){ return  Apply(Math.floor, Input);}
function Fround(Input){ return  Apply(Math.fround, Input);}
function Log(Input){ return  Apply(Math.log, Input);}
function Log1p(Input){ return  Apply(Math.log1p, Input);}
function Log2(Input){ return  Apply(Math.log2, Input);}
function Log10(Input){ return  Apply(Math.log10, Input);}
function Round(Input){ return  Apply(Math.round, Input);}
function Sign(Input){ return  Apply(Math.sign, Input);}
function Sin(Input){ return  Apply(Math.sin, Input);}
function Sinh(Input){ return  Apply(Math.sinh, Input);}
function Sqrt(Input){ return  Apply(Math.sqrt, Input);}
function Tan(Input){ return  Apply(Math.tan, Input);}
function Tanh(Input){ return  Apply(Math.tanh, Input);}
function Trunc(Input){ return  Apply(Math.trunc, Input);}
function Win(Input){ return  Apply(WinSingleProbability, Input);}



// abs: function abs() { [native code] }
// acos: function acos() { [native code] }
// acosh: function acosh() { [native code] }
// asin: function asin() { [native code] }
// asinh: function asinh() { [native code] }
// atan: function atan() { [native code] }
// atan2: function atan2() { [native code] }
// atanh: function atanh() { [native code] }
// cbrt: function cbrt() { [native code] }
// ceil: function ceil() { [native code] }
// clz32: function clz32() { [native code] }
// cos: function cos() { [native code] }
// cosh: function cosh() { [native code] }
// exp: function exp() { [native code] }
// expm1: function expm1() { [native code] }
// floor: function floor() { [native code] }
// fround: function fround() { [native code] }
// log: function log() { [native code] }
// log1p: function log1p() { [native code] }
// log2: function log2() { [native code] }
// log10: function log10() { [native code] }
// round: function round() { [native code] }
// sign: function sign() { [native code] }
// sin: function sin() { [native code] }
// sinh: function sinh() { [native code] }
// sqrt: function sqrt() { [native code] }
// tan: function tan() { [native code] }
// tanh: function tanh() { [native code] }
// trunc: function trunc() { [native code] }

// hypot: function hypot() { [native code] }// don't need
// imul: function imul() { [native code] }// don't need
// max: function max() { [native code] }// don't need
// min: function min() { [native code] }// don't need
// pow: function pow() { [native code] }// might want to write a custom script 
// random: function random() { [native code] }// don't need








// Testing code
// TestVal=2.1;
// TestArr=[];
// for (i=0; i<4; i++){
	// TestArr[i]=[];
	// for (j=0; j<3; j++){
		// TestArr[i][j]=[];
		// for (k=0; k<2; k++){
			// TestArr[i][j][k]=TestVal;
			// TestVal=TestVal+3.3;
		// }
	// }
// }


function CopyArray(Arr){
	console.error("Warning: CopyArray is not tested");
	return MultiplyArrayByNumber(Arr, 1);
}

// RANDOM FUNCTIONS

// Normal distribution function
// Note that in order to work, this function requires the random number generator lcgrand.js
function NormalRand(Mean, SD){
	// Create the distribution around zero
	// Using the Box-Muller transform
	var Z=Math.sqrt(-2*Math.log(Rand.Value()))*Math.cos(2*Math.PI*Rand.Value());
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
	var Result=0;
	for (var i=0; i<Num; i++){
		Result=Math.sqrt(-2*Math.log(Rand.Value()))*Math.cos(2*Math.PI*Rand.Value());
		// Using central limit theorem
		//Z[i]=lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()-6;
		//Z[i]=Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()-6;
		// Increase the deviation to the standard deviation specified amount, adjust such that the distribution is centred about the mean
		Z[i]=Mean+Result*SD;
	}
	//StopTime = new Date().getTime();
	//console.log(StopTime-StartTime);
	return Z;
}

function NormalRandArrayBounded(Mean, SD, Num, Min, Max, MaxTries){
	// Bounds the results ( to prevent Normal distributed numbers from having an incorrect result)
	// MaxTries is optional
	// This function stops after sampling for 100 times the initial Num value by default
	
	// Create the distribution around zero
	// Using the Box-Muller transform
	//StartTime = new Date().getTime();
	var Z=[];
	var Result=0;
	var i=0;
	var FoundVals=0;
	if (typeof(MaxTries)=="undefined"){
		var MaxTries=100*Num;
	}
	while ( i<MaxTries && FoundVals<Num){
		i++;
		Result=Math.sqrt(-2*Math.log(Rand.Value()))*Math.cos(2*Math.PI*Rand.Value());
		// Using central limit theorem
		//Z[i]=lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()+lcg.rand()-6;
		//Z[i]=Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()-6;
		// Increase the deviation to the standard deviation specified amount, adjust such that the distribution is centred about the mean
		Result=Mean+Result*SD;
		// Test if outside range specified
		if (!(Result<Min) && !(Result>Max)){// this expression should work if Min or Max are unset
			Z[FoundVals]=Result;
			FoundVals++;
		}
	}
	if (FoundVals<Num){
		console.error("An error occured");throw "Not enough values were found before time out. Try setting larger MaxTries";
	}
	//StopTime = new Date().getTime();
	//console.log(StopTime-StartTime);
	return Z;
}
// testing
// Mean=3;
// SD=2;
// Num=100;
// Min=NaN;
// Max=NaN;
// b=NormalRandArrayBounded(Mean, SD, Num, Min, Max);


function ExpDistributionRand(HalfLife){
	// This distribution can be used to save time when a constant probability process occurs
	// It differs from TimeUntilEvent where the annual probability is known.
	// The HalfLife is the time it takes half the population to have the event occur
	// Prop=1-Exp(-k*t)
	// Exp(-k*t)=1-Prop
	// t=-Log(1-Prop)/k AND k=-Log(1-Prop)/t
	// when Prop=0.5 and t=HalfLife
	// Log(1-Prop)=-0.6931471805599453// numerical value used for speed
	var k=0.6931471805599453/HalfLife;
	// to find a random time
	return -Log(1-Rand.Value())/k;
}

function ExpDistributionRandArray(HalfLife, Num){
	var ReturnArray=[];
	for (var i=0; i<Num; i++){
		ReturnArray[i]=ExpDistributionRand(HalfLife);
	}
	return ReturnArray;
}



function RandArray(Min, Max, Num){
	var Z=[];
	for (var i=0; i<Num; i++){
		Z[i]=Min+(Max-Min)*Rand.Value();
	}
	return Z;
}



function NormalRandFillUp(Mean, SD, Array){
	// Create the distribution around zero
	// Using the Box-Muller transform
	//StartTime = new Date().getTime();
	for (var i=0; i<Array.length; i++){
		Array[i]=Math.sqrt(-2*Math.log(Rand.Value()))*Math.cos(2*Math.PI*Rand.Value());
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
	var StartTime = new Date().getTime();
	var t=0;
	for (var i=0; i<10000000; i++){
		t=t+Math.random()-0.5;
	}
	var StopTime = new Date().getTime();
	console.log(StopTime-StartTime);
}


function WinSingleProbability(p){//Given a probability p of winning, return true or false. Note, no error checking occurs in this function
	if (Rand.Value()<p){
		return true;
	}
	return false;// didn't win.
}

// Determines the time between now and an event which occurs on a probabilistic basis
function TimeUntilEvent(PerTimeProbability){
	// r=per time probability
	// p=random number between 0 and 1
	// p=r^t
	// p=e^(ln(r)t)
	// t=ln(p)/ln(r)
	return (Math.log(Rand.Value())/Math.log(1-PerTimeProbability));
}




// Fisher–Yates shuffle
// This code is copied from : http://bost.ocks.org/mike/shuffle/
function Shuffle(inputarray) {
	var array=inputarray.slice();
	var m = array.length, t, i;
	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Rand.Value() * m--);
		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}


function Logistic(x){//
	return (1/(1+Math.exp(-x)));
}
function Logit(x){//inverse of logistic. Must take value on(0,1)
	return (-Math.log(1/x-1));
}

// 
function RandSelection(ArrayToSelectFrom, NumberToSelect){
	// This function is given an array and the number to select. Sample occurs WITHOUT replacement.
	// 
	// this function should work in two modes

	// mode 2, where the proportion of selections that need to occur are low
		// This uses an algortihm that is based on selecting, at random, a numerical index and making sure it isn't in the list. 
	// mode 1, where the proportion of selections that need to occur are high
		// This uses the shuffle algorithm
	
	if(NumberToSelect>ArrayToSelectFrom.length){
		console.error("Trace");
		throw "There are too few elements in the array to select from";
	}
	
	var ReturnArray;
	// if there are very few items to select
	if (NumberToSelect==1 || NumberToSelect<0.05*ArrayToSelectFrom.length){
		var ChosenIndicies=[];
		while (ChosenIndicies.length<NumberToSelect){
			var TempInt=Math.floor(ArrayToSelectFrom.length*Rand.Value());
			if (ChosenIndicies.indexOf(TempInt)<0){
				ChosenIndicies.push(TempInt);
			}
		}
		ReturnArray=Select(ArrayToSelectFrom, ChosenIndicies);
		return ReturnArray;
	}
	// if there are a large proportion of items to select
	else {
		var ShuffledArray=Shuffle(ArrayToSelectFrom);
		ReturnArray=ShuffledArray.slice(0,NumberToSelect);
		return ReturnArray;
	}
	// testing
	// var selectionvec=[];
	// for (var i=0; i<100; i++){
	// 	selectionvec.push(i);
	// }
	// RandSelection(selectionvec, 1)
	// RandSelection(selectionvec, 2)
	// RandSelection(selectionvec, 5)
	// RandSelection(selectionvec, 50)
	// RandSelection(selectionvec, 100)
}




// 
function RandSampleWeighted(Weights, Values){
	// Normalised weights
	var Total=Sum(Weights);
	var NormalisedWeights=Divide(Weights, Total);

	var Count=0;
	var ChosenValue=Rand.Value();
	var SelectedIndex=0;
	var ValueFound=false;
	while (ValueFound==false && SelectedIndex<Weights.length-1 ){// if it gets to the end, it must be the last element.
		Count+=NormalisedWeights[SelectedIndex];
		if (Count>ChosenValue){
			ValueFound=true;
		}
		else {
			SelectedIndex++;
		}
	}
	
	if (typeof(Values)==="undefined"){
		return SelectedIndex;
	}
	else{	
		if (Weights.length!=Values.length){
			console.error("An error occured");throw "The length of the weights and Values should be equal";
		}
		return Values[SelectedIndex];
	}
}

function RandSampleWeightedArray(Weights, n, Values){
	var ReturnArray=[];
	
	for (var Count=0; Count<n; Count++){
		if (typeof(Values)==="undefined"){
			ReturnArray[Count]=RandSampleWeighted(Weights);
		}
		else{
			ReturnArray[Count]=RandSampleWeighted(Weights,Values);
		}
	}
	return ReturnArray;
}


// The following section is not yet implemented
// function RandIntArray(Num, Min, Max){// this function is useful for selecting elements 
	// there are two ways to calculate this. 
	// selecting a small number of items from a broad range
	// selecting a large proportion of elements 
	
//	if (Num>Max-Min+1){
//		console.log("An error occured");throw("Number of selections cannot be greater than the available integers");
//	}	
//	return }





// Math.random is platform dependent, meaning we need to create or use a platform independent method 
// This topic is discussed here http://bocoup.com/weblog/random-numbers/
// The code below was found here https://gist.github.com/Protonk/5367430
// LCG is the standard method used in many C++ compilers http://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use 
		
// Linear congruential generator code found here:
// https://gist.github.com/Protonk/5367430

// Usage:
// Rand.SetSeed(34658437);
// RandomVariable=Rand.Value();


// Linear Congruential Generator
// Variant of a Lehman Generator 
var Rand = (function() {
  // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
      // m is basically chosen to be large (as it is the max period)
      // and for its relationships to a and c
  var m = 4294967296,
      // a - 1 should be divisible by m's prime factors
      a = 1664525,
      // c and m should be co-prime
      c = 1013904223,
      seed, z;
  return {
    SetSeed : function(seedval) {
      z = seed = seedval || Math.round(Math.random() * m);
    },
    GetSeed : function() {
      return seed;
    },
    Value : function() {
      // define the recurrence relationship
      z = (a * z + c) % m;
      // return a float in [0, 1) 
      // if z = m then z / m = 0 therefore (z % m) / m < 1 always
      return z / m;
    },
	Array : function(NumElements) {
	  var RandArray=[];
	  for (var Indexcount=0; Indexcount<NumElements; Indexcount++){
		  // define the recurrence relationship
		  z = (a * z + c) % m;
		  // return a float in [0, 1) 
		  // if z = m then z / m = 0 therefore (z % m) / m < 1 always
		  RandArray[Indexcount] = z / m;
	  }
	  return RandArray;
    }
  };
}());


Rand.SetSeed();//Here we set a standard seed, just in case we forget to in the code


//***********************************************************
function CloneObject(obj){
    return JSON.parse(JSON.stringify(obj));
}




//************************************************************
// Inspired by Tomas Zato http://stackoverflow.com/questions/7837456/comparing-two-arrays-in-javascript

function ArraysEqual (array1, array2) {
    // if the other array is a falsy value, return
    if (!array1)
        return false;
	if (!array2)
        return false;
		
    // compare lengths - can save a lot of time 
    if (array1.length != array2.length)
        return false;

    for (var i = 0, l=array1.length; i < l; i++) {
        // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if (!array1[i].equals(array2[i]))
                return false;       
        }           
        else if (array1[i] != array2[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
};  

