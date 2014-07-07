
function MakeTableHTML(InputMatrix, ColumnHeading, RowLabel){
TableHTML="<table>";

TableHTML+="<tr>";
TableHTML+="<td></td>";//Add a space at the top
for (i=0; i<ColumnHeading.length; i++){
	TableHTML+="<td><b>"+ InputMatrix[i][j]+"</b></td>";
}
TableHTML+="</tr>";

for (j=0; j<InputMatrix[0].length; j++){
	TableHTML+="<tr>";
	TableHTML+="<td><b>"+ RowLabel[j]+"</b></td>";
	for (i=0; i<InputMatrix.length; i++){
		TableHTML+="<td>"+ InputMatrix[i][j]+"</td>";
	}
	TableHTML+="</tr>";
}

TableHTML+= "</table>";
return TableHTML;
}