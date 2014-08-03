// This file requires papaparse.js to work
// The purpose of this file is to make it straight forward to open and extract information from CSV files. It is a wrapper for papaparse

function CSVFile(FileName){//file name in this instance is the URL
	var TempOpenCSVHolder;
	this.Data=[];
	//Papa.parse(FileName, {download: true, complete: function(PapaResults) {console.log("Finished");console.log(PapaResults); TempOpenCSVHolder=PapaResults.data;}});//download informs Papa that it is an external CSV (http request), and the function
	Papa.parse(FileName, {download: true, complete: function(PapaResults)(this.RecieveData(PapaResults);) });//download informs Papa that it is an external CSV (http request), and the function
	

	this.results=TempOpenCSVHolder;
}

CSVFile.prototype.RecieveData= function (PapaResults){//using prototyping for speed
	this.Something=1; 
	console.log("Finished");
	console.log(PapaResults); 
	TempOpenCSVHolder=PapaResults.data;
};


//function GetValues(String){
	//convert text to  


//};

