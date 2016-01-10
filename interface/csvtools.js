// This file requires papaparse.js to work
// The purpose of this file is to make it straight forward to open and extract information from CSV files. It is a wrapper for papaparse


function CSVFile(FileName){//file name in this instance is the URL
	var TempOpenCSVHolder=this;//A pointer to this file that can be called when the file is finished and ready to store
	this.CurrentlyLoading=true;

	console.log(FileName);
	if (typeof(RunningNodeJS)=='undefined'){
		console.log("Note that the global variable 'RunningNodeJS' is not currently set, which defaults behaviour to webpage javascript.. This means that this library uses httprequests, not the file system to open the files. To hide this, set 'RunningNodeJS' to true if using in node locally, or false if using on a webpage.");
		Papa.parse(FileName, {download: true, complete: function(PapaResults){TempOpenCSVHolder.Data=PapaResults.data;TempOpenCSVHolder.CurrentlyLoading=false;} });
	}
	else if (RunningNodeJS==false){
		Papa.parse(FileName, {download: true, complete: function(PapaResults){TempOpenCSVHolder.Data=PapaResults.data;TempOpenCSVHolder.CurrentlyLoading=false;} });
	}
	else{
		// Load the actual local file
		var fs=require('fs');
		var FileContents=fs.readFileSync(FileName, {encoding: 'utf8'});
		// Parse the file
		Papa.parse(FileContents, { complete: function(PapaResults, FileContents){TempOpenCSVHolder.Data=PapaResults.data;TempOpenCSVHolder.CurrentlyLoading=false;} });
	}
	//download informs Papa that it is an external CSV (http request), and the function is a handler to run when the file is ready

};

CSVFile.prototype.GetValues= function (y1, y2, x1, x2){//Changing to (row1, row2, column1, column2), as is expected in a CSV file
	//checking input is good
	if (x1>x2 || y1>y2 || x1<0 || y1<0 || this.IsNaturalNumber(x1)==false || this.IsNaturalNumber(x2)==false || this.IsNaturalNumber(y1)==false || this.IsNaturalNumber(y2)==false ){
		console.error("The range of values requested is invalid");
		throw "See above for error trace";
	}
	if (this.FileLength()<=y2){
		console.error("The y2 spefied is too long. Max value " +(this.FileLength()-1));
		throw "See above for error trace";
	}

	var ReturnArray=[];
	var newyindex=0;
	for (var yindex=y1; yindex<=y2; yindex++){
		ReturnArray[newyindex]=[];
		var newxindex=0;
		for (var xindex=x1; xindex<=x2; xindex++){
			if (typeof this.Data[yindex][xindex]==="undefined"){// If this value is bigger than the largest value of data
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

CSVFile.prototype.GetColumn= function (ColumnNum, StartRow, EndRow){//
	if (StartRow>EndRow || ColumnNum<0 || StartRow<0 || this.IsNaturalNumber(ColumnNum)==false || this.IsNaturalNumber(StartRow)==false || this.IsNaturalNumber(EndRow)==false){
		console.error("The range of values requested is invalid");
		throw "See above for error trace";
	}
	
	var TempVec=this.GetValues(StartRow, EndRow, ColumnNum, ColumnNum);
	
	//Refactor the vector into a proper vector
	var ReturnVec=[];
	for (var i=0; i<TempVec.length; i++ ){
		ReturnVec[i]=TempVec[i][0];
	}
	return ReturnVec;
};


CSVFile.prototype.GetRow= function (RowNum, StartColumn, EndColumn){//
	if (StartColumn>EndColumn || RowNum<0 || StartColumn<0 || this.IsNaturalNumber(RowNum)==false || this.IsNaturalNumber(StartColumn)==false || this.IsNaturalNumber(EndColumn)==false){
		console.error("The range of values requested is invalid");
		throw "See above for error trace";
	}
	
	var ReturnVec=this.GetValues(RowNum, RowNum, StartColumn, EndColumn);
	return ReturnVec[0];
};


CSVFile.prototype.GetText= function (y1, y2, x1, x2){
	//checking input is good
	if (x1>x2 || y1>y2 || x1<0 || y1<0 || this.IsNaturalNumber(x1)==false || this.IsNaturalNumber(x2)==false || this.IsNaturalNumber(y1)==false || this.IsNaturalNumber(y2)==false ){
		console.error("The range of values requested is invalid");
		throw "See above for error trace";
	}
	if (this.FileLength()<=y2){
		console.error("The y2 spefied is too long. Max value " +(this.FileLength()-1));
		throw "See above for error trace";
	}
	var ReturnArray=[];
	var newyindex=0;
	for (var yindex=y1; yindex<=y2; yindex++){
		ReturnArray[newyindex]=[];
		var newxindex=0;
		for (var xindex=x1; xindex<=x2; xindex++){
			if (typeof this.Data[yindex][xindex]==="undefined"){// If this value is bigger than the largest value of data
				ReturnArray[newyindex][newxindex]=NaN;
			}
			else{
				ReturnArray[newyindex][newxindex]=this.Data[yindex][xindex];
			}
			newxindex++;
		}
		newyindex++;
	}
	return ReturnArray;
	
};


CSVFile.prototype.GetColumnText= function (ColumnNum, StartRow, EndRow){//
	if (StartRow>EndRow || ColumnNum<0 || StartRow<0 || this.IsNaturalNumber(ColumnNum)==false || this.IsNaturalNumber(StartRow)==false || this.IsNaturalNumber(EndRow)==false){
		console.error("The range of values requested is invalid");
		throw "See above for error trace";
	}
	
	var TempVec=this.GetText(StartRow, EndRow, ColumnNum, ColumnNum);
	
	//Refactor the vector into a proper vector
	var ReturnVec=[];
	for (var i=0; i<TempVec.length; i++ ){
		ReturnVec[i]=TempVec[i][0];
	}
	return ReturnVec;
};


CSVFile.prototype.GetRowText= function (RowNum, StartColumn, EndColumn){//
	if (StartColumn>EndColumn || RowNum<0 || StartColumn<0 || this.IsNaturalNumber(RowNum)==false || this.IsNaturalNumber(StartColumn)==false || this.IsNaturalNumber(EndColumn)==false){
		console.error("The range of values requested is invalid");
		throw "See above for error trace";
	}
	
	var ReturnVec=this.GetText(RowNum, RowNum, StartColumn, EndColumn);
	return ReturnVec[0];
};








CSVFile.prototype.FileLength= function (){
	return this.Data.length;
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
};

function DownloadableCSV(InputData, FileName){
	if (typeof(FileName) != 'undefined'){
		this.FileName=FileName;
	}
	
	this.UnparseInput={};
	this.UnparseInput.fields=[];
	this.UnparseInput.data=[];
	var DataLengths=[];
	for (var A in InputData){
		this.UnparseInput.fields.push(A);	
		this.UnparseInput.data.push(InputData[A]);	
		if (typeof(InputData[A])=="object"){
			if (InputData[A]==null){
				DataLengths.push(1);
			}
			else if (typeof(InputData[A].length)!="undefined"){
				DataLengths.push(InputData[A].length);
			}
			else{
				DataLengths.push(1);
			}
		}
		else{
			DataLengths.push(1);
		}
		
	}
	
	var Index=SortIndex(DataLengths);
	
	Index=Index.reverse();
	this.UnparseInput.fields=Select(this.UnparseInput.fields, Index);
	this.UnparseInput.data=Select(this.UnparseInput.data, Index);
	this.UnparseInput.data=TransposeForCSV(this.UnparseInput.data);

	
	// // Specifying fields and data manually
// var csv = Papa.unparse({
	// fields: ["Column 1", "Column 2"],
	// data: [
		// ["foo", "bar"],
		// ["abc", "def"]
	// ]
// });
// http://papaparse.com/docs#json-to-csv
	
	
	
};

DownloadableCSV.prototype.Download=function(){
	var csv = Papa.unparse(this.UnparseInput);
	var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
	if (typeof(this.FileName) == 'undefined'){
		saveAs(blob, "data.csv");
	}
	else{
		saveAs(blob, this.FileName);
	}
};

function DownloadObjectAsCSV(Object, FileName){
	
	function TransposeForCSV(DataMatrix){
		// Below we check for the longest length, they should be the same length but just in case
		var VecLength=0;
		for (var A in DataMatrix){
			if (DataMatrix[A].length>VecLength){
				VecLength=DataMatrix[A].length;
			}
		}
		
		// transpose the matrix
		var TDataMatrix=[];
		for (var row=0; row<VecLength; row++){// each row of the CSVMatrix
			TDataMatrix[row]=[];
			for (var column=0; column<DataMatrix.length; column++){// each column
				if (typeof(DataMatrix[column][row])!="undefined"){
					TDataMatrix[row][column]=DataMatrix[column][row];
				}
				else{
					TDataMatrix[row][column]="";
				}
			}
		}
		return TDataMatrix;
	}	
	
	
	// This function is designed to take a relatively simply structured object with a label-array structure
	var StructureToParse={};
	StructureToParse.data=[];
	if (Object instanceof Array){
		StructureToParse.data=Object;
	}
	else {// label the columns with field name
		StructureToParse.fields=[];
		for (var FieldID in Object){
			StructureToParse.fields.push(FieldID);
			StructureToParse.data.push(Object[FieldID]);
		}
	}
	StructureToParse.data=TransposeForCSV(StructureToParse.data);
	var csv = Papa.unparse(StructureToParse);
	var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
	if (typeof(FileName) == 'undefined'){
		saveAs(blob, "data.csv");
	}
	else{
		saveAs(blob, FileName);
	}	
}
