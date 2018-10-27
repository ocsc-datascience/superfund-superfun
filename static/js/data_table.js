//create Tabulator on DOM element with id "superfund-table"
  var table = new Tabulator("#superfund-table", {
 	//height:500, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
	//height:"100%",
	pagination:"local", //enable local pagination.
    paginationSize:15, // rows per page (default = 10)
	layout:"fitColumns", //fit columns to width of table (optional)
	responsiveLayout:"hide",
 	columns:[ //Define Table Columns
		{title:"Site ID", field:"id", width:80, align:"right", sorter:"number"},
		{title:"Site Name", field:"name"},
	 	{title:"Address", field:"address", align:"left"},
	 	{title:"City", field:"city", align:"left", headerFilter:true},
	 	{title:"State", field:"state", align:"left", headerFilter:true, width:100},
	 	{title:"Zip Code", field:"xzip", align:"left", headerFilter:true, width:120},
	 	{title:"HRS Score", field:"hrs_score", align:"right", sorter:"number", width:120},
 	],
});


$("#tabulator-controls  button[name=download]").on("click", function(){
   	table.download("csv", "SuperFundSites.csv");
});


d3.json("/superfund_sites", function(data) {
    //load sample data into the table
   table.setData(data);
  
});
