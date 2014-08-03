// This file requires papaparse.js to work
// The purpose of this file is to make it straight forward to open and extract information from CSV files. It is a wrapper for papaparse

function CSVFile(FileName){//file name in this instance is the URL
	var TempOpenCSVHolder=this;


	Papa.parse(FileName, {download: true, complete: function(PapaResults){TempOpenCSVHolder.Data=PapaResults;} });
	//download informs Papa that it is an external CSV (http request), and the function is a handler to run when the file is ready
	

}

CSVFile.prototype.GetValues= function (x1, y1, x2, y2){//using prototyping for speed
	this.Something=1; 
	console.log("Finished");
	console.log(PapaResults); 
	TempOpenCSVHolder=PapaResults.data;
};



