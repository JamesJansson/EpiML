// This file requires papaparse.js to work
// The purpose of this file is to make it straight forward to open and extract information from CSV files. It is a wrapper for papaparse

var CSVFileNumberLoading=0;

function CSVFile(FileName){//file name in this instance is the URL
	var TempOpenCSVHolder=this;

	CSVFileNumberLoading++;
	Papa.parse(FileName, {download: true, complete: function(PapaResults){TempOpenCSVHolder.Data=PapaResults.data;CSVFileNumberLoading--;} });
	//download informs Papa that it is an external CSV (http request), and the function is a handler to run when the file is ready
	

}

CSVFile.prototype.GetValues= function (x1, y1, x2, y2){
	//checking input is good
	if (x1>x2 || y1>y2 || x1<0 || y1<0 || this.IsNaturalNumber(x1)==false || this.IsNaturalNumber(x2)==false || this.IsNaturalNumber(y1)==false || this.IsNaturalNumber(y2)==false ){
		console.error("The range of values requested is invalid");
	}
	
	ReturnArray=[];
	newyindex=0;
	for (yindex=y1; yindex<=y2; yindex++){
		ReturnArray[newyindex]=[];
		newxindex=0;
		for (xindex=x1; xindex<=x2; xindex++){
			if (typeof this.Data[yindex][xindex]==="undefined"){
				ReturnArray[newyindex][newxindex]=NaN;
			}
			else{
				ReturnArray[newyindex][newxindex]=Number(this.Data[yindex][xindex]);
			}
			newxindex++;
		}
		newyindex++;
	}
	return ReturnArray;
};

console.log("To do: make column reader in csv tools");
console.log("To do: make row reader in csv tools");



CSVFile.prototype.Entries= function (x1, y1, x2, y2){
	//checking input is good
	if (x1>x2 || y1>y2 || x1<0 || y1<0 || this.IsNaturalNumber(x1)==false || this.IsNaturalNumber(x2)==false || this.IsNaturalNumber(y1)==false || this.IsNaturalNumber(y2)==false ){
		console.error("The range of values requested is invalid");
	}
	
	//for (
	
};





CSVFile.prototype.IsNaturalNumber = function (value){
	if (Math.floor(value) == value){
		return true;
	}
	else{
		return false;
	}
	
	//var NaturalNumberRegex = /^(0|([1-9]\d*))$/;
	//return NaturalNumberRegex.test(StringToTest);
}

