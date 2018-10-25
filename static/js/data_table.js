

/* function customFilter(data, filterParams){
    //data - the data for the row being filtered
    //filterParams - params object passed to the filter

    return data.name == "bob" && data.height < filterParams.height; //must return a boolean, true if it passes the filter.
}

table.setFilter(customFilter, {height:3});
 */


//create Tabulator on DOM element with id "superfund-table"
  var table = new Tabulator("#superfund-table", {
 	height:600, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
 	layout:"fitColumns", //fit columns to width of table (optional)
	responsiveLayout:"hide",
 	columns:[ //Define Table Columns
	 	{title:"Site Name", field:"name"},
	 	{title:"Address", field:"address", align:"left"},
	 	{title:"City", field:"city", align:"left", headerFilter:true},
	 	{title:"State", field:"state", align:"left", headerFilter:true},
	 	{title:"Zip Code", field:"xzip", align:"left", headerFilter:true},
	 	{title:"HRS Score", field:"hrs_score", align:"right", sorter:"number"},
 	],
 	//rowClick:function(e, row){ //trigger an alert message when the row is clicked
 	//	alert("Row " + row.getData().id + " Clicked!!!!");
 	//},
});
  

d3.json("/superfund_sites", function(data) {
    //load sample data into the table
   table.setData(data);
  
});
