document.head.appendTag('script', { type: "text/javascript", charset: "UTF-8", src: '/aim/v1/lib/js/cm.js' });
document.head.appendTag('script', { type: "text/javascript", charset: "UTF-8", src: '/inc/js/jquery-3.3.1.min.js' });
document.title = 'CM PLCNext';

Aim.add(CM = {
	plcnextPath : "https://" + location.host + "/_pxc_api/api/variables/",  // IP Adress of Controller
	external : external = {
		opcSet : function( itemID , arg ) {
			var writeData = { pathPrefix: "Arp.Plc.Eclr/", variables: [{ path: itemID, value: arg, valueType: "Constant" }] };
			jQuery.ajax({
				type: "PUT",
				url: CM.plcnextPath,
				data: JSON.stringify(writeData),
				headers: { Accept: "application/json", "Content-Type": "application/json" },
				success: function addCell() { console.log("Send"); },
				error: function (request, status, error) { console.log(request.responseText); }
			});
		}
	},
	ReadVariable: function () {
		// Read 1 variabele and send to message server
		if (!row = varlist.shift()) setTimeout(CM.ReadAllVariable, 250);
		//var HMIReadList = "&paths=" + property.readName;
		data.length = 0; // get rid of the data from the last query
		// issue the data request
		$.ajax({
			type: "GET",
			url: CM.plcnextPath + "?pathPrefix=Arp.Plc.Eclr/&paths=" + row.item.itemID + '.' + row.name,
			done: function (data, status, jqXHR) {
				console.log('DATA RECEIVED FROM PLC', data.variables[0].value);
				if (row.item[row.name] != data.variables[0].value) row.item.set(row.name,data.variables[0].value);
				CM.ReadVariable(); //Read next variable
			},
			fail: function (jqXHR, status, errorThrown) {
				console.log("CreateSession Error: " + errorThrown);
				console.log("Status: " + status);
				console.dir(jqXHR);
			},
		});
	},
	ReadAllVariable: function () {
		//Function for reading ALL variables
		varlist = [];
		for (var id in CM.items)
			for (var name in CM.items[id].properties)
				if (CM.items[id].properties[name].external)
					varlist.push({item: CM.items[id], name:name, prop: CM.items[id].properties[name] });
		//Start reading first item in variable list
		CM.ReadVariable();
	},
	onload: function () {
		CM.ReadAllVariable();
	},
});
