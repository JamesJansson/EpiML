
function MakeTableHTML(InputMatrix){
TableHTML="<table>";
for (j=0; j<InputMatrix[0].length; j++){
	TableHTML+="<tr>";
	for (i=0; i<InputMatrix.length; i++){
		TableHTML+="<td>"+ InputMatrix[i][j]+"</td>";
	}
	TableHTML+="</tr>";
}

TableHTML+= "</table>";
return TableHTML;
}