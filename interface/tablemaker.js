
function MakeTableHTML(InputMatrix){
TableHTML="<table>";

for (i=0; i<InputMatrix.length; i++){
	TableHTML+="<tr>";
	for (j=0; j<InputMatrix[i].length; j++){
		TableHTML+="<td>"+ InputMatrix[i][j]+"</td>";
	}
	TableHTML+="</tr>";
}

TableHTML+= "</table>";
return TableHTML;
}