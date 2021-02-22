// sdfgs
Aim.add({
	Upload: Upload = {
		encode_col: function (col) { var s = ""; for (++col; col; col = Math.floor((col - 1) / 26)) s = String.fromCharCode(((col - 1) % 26) + 65) + s; return s; },
		log: function (msg) {
			Aim.Upload.elMessage.appendTag('div', { innerHTML: new Date().toLocaleString() + ': ' + msg });
		},
		modified: function (keyname,attributeName,value,oldvalue) {
			with (Aim.Upload.elLog.appendTag('tr')){
				appendTag('td',{innerText:Upload.keyname!=keyname?Upload.keyname=keyname:''});
				appendTag('td',{innerText:attributeName||''});
				appendTag('td',{innerHTML:(value||'')+'<br>'+( oldvalue||'')});
			}
		},
		show: function () {
			console.log('UPLOAD SHOW', this, this.onshow);
			//this.config = Host.upload;
			with (this.elInfoLog = (this.el||document.body).appendTag('div', { className: 'infopopup' })) {
				appendTag('button', { className: 'icn close abs', onclick: function () { document.body.removeChild(this.elInfoLog); } });
				Aim.Upload.elProgressbar = appendTag('div').appendTag('progress');
				Aim.Upload.elProgressbar.max = 0;
				Aim.Upload.elInpUpload = appendTag('div').appendTag('input', { type: 'file', id: 'getfile', onchange: this.onchange.bind(this) });
				Aim.Upload.elMessage = appendTag('div');
				Aim.Upload.elLog = Aim.Upload.elLog || appendTag('table');
			}
			if(this.onshow)this.onshow();else Aim.Upload.elInpUpload.click();
		},
		postrows: function (rows) {
			if (!rows.length) {
				this.log('Upload Done');
				if (Aim.Upload.callback) Aim.Upload.callback();
				return
			}
			var row = rows.shift();
			row.find = 1;
			console.log(row);
			Aim.load({
				rows: rows, get: { schema:row.schema, reindex:1 }, put: { value: [row] }, onload: function (event) {
					console.log('PUT', this.get, this.put, this.responseText);
					Aim.Upload.elProgressbar.value++;
					Aim.Upload.postrows(this.rows);
				}
			});
		},
		syncschema: function (schemaname, schema) {
			if (!schema.krows) return;
			console.log('SYNC DATA 1', schema.dbrows);
			if (!schema.dbrows) {
				this.log('Loading data', schema);
				//this.schemaname = schemaname;
				//this.uploadschema = schema;
				return Aim.load({
					schemaname: schemaname,
					uploadschema: schema,
					api: schemaname,
					get: { top: 0, sync: 1, select: 'keyID,keyname,name,state,title,subject,summary,filterfields,' + schema.properties, filter: schema.filter ? schema.filter : "" },
					onload: function (event) {
						event.par.uploadschema.dbrows = event.data.value;
						console.log('SYNC DATA', event.par.src, event.par.uploadschema.dbrows);
						this.log(event.par);
						this.syncschema(event.par.schemaname, event.par.uploadschema);
					}.bind(this)
				});
			}
			this.log('Compare data');
			var definition = api.definitions[schemaname], dbrows = schema.urows = {};//, logHTML = this.logHTML = '<table>';
			schema.urows = [];
			schema.dbrows.forEach(function (row, id) {
				dbrows[row.key = row.keyID || row.keyname || row.name] = row;
				//console.log(row.key);
				if (schema.deletemissing && !schema.krows[row.key]) {
					schema.urows.push({ id: row.id, keyname: row.keyname || '', keyID: row.keyID || '', schema: row.schema, deletedDT: schema.deletedDT || '', finishDT: schema.finishDT || '' });
					this.modified(row.key||row.id, 'Verwijderd');
				}
			}.bind(this));
			//console.log('UROWS', schema.krows, dbrows);
			for (var keyname in schema.krows) {
				var row = schema.krows[keyname], urow = null, rowHTML = '', dbrow = dbrows[keyname] = dbrows[keyname] || {};

				//return;
				//console.log(definition.properties);
				schema.properties.forEach(function (attributeName) {
					if (!(attributeName in row)) return; //bestaat de attributeName niet in de ingelezen excel data dan overslaan
					var prop = definition.properties[attributeName], dbvalue = dbrow[attributeName] || '', rowvalue = String(row[attributeName] || '').trim();
					//console.log([attributeName, dbvalue, rowvalue, prop, !prop || dbvalue == rowvalue || (!dbvalue && !rowvalue)]);

					if (!prop || dbvalue == rowvalue || (!dbvalue && !rowvalue)) return;
					urow = urow || { schema: schemaname, finishDT: null, keyID: row.keyID || '', keyname: row.keyname || '', values: {} };
					urow.values[attributeName] = { value: dbrow[attributeName] = rowvalue };
					if (prop && prop.schema) urow.values[attributeName].schema = prop.schema;
					this.modified(keyname, attributeName,rowvalue,dbvalue||'[null]');
				}.bind(this));

				var item = Object.create(api.definitions.item, api.definitions.itemproperties);
				item.values = row;
				item.schema = schemaname;
				item.assignschema();
				//api.value.assignschema.call(item);

				if (!(row.title = item.getKopText(0))) continue;
				row.subject = item.getKopText(1);
				row.summary = item.getKopText(2);
				row.filterfields = item.getFilterfields();
				'title,subject,summary'.split(',').forEach(function (attributeName) { dbrow[attributeName]=dbrow[attributeName]?String(dbrow[attributeName]):"";});
				'title,subject,summary,filterfields'.split(',').forEach(function (attributeName) {
					//console.log(attributeName, dbrow[attributeName], row[attributeName]);
					//var a=dbrow[attributeName],b=row[attributeName];
					if (JSON.stringify(dbrow[attributeName]) != JSON.stringify(row[attributeName])) {
						urow = urow || { schema: schemaname, finishDT: null, keyID: row.keyID || '', keyname: row.keyname || '', values: {} };
						urow[attributeName] = row[attributeName];
						this.modified(keyname+'*', attributeName, JSON.stringify(row[attributeName]), JSON.stringify(dbrow[attributeName]));
					}
				}.bind(this));

				if (urow) {
					if (dbrow) urow.id = dbrow.id;
					schema.urows.push(urow);
				}
			};
			Aim.Upload.elProgressbar.max = schema.urows.length;
			Aim.Upload.elProgressbar.value = 0;
			console.log('DBROWS', dbrows);
			console.log('KROWS', schema.krows);
			console.log('UROWS', schema.urows);
			//if (urows.length) Aim.load({
			//    api: 'mail', post: { msg: JSON.stringify({ FromName: "MOBA aliconnect service", Subject: "Wijzigingen iLog import " + this.schemaname, msgs: [{ content: "<ul>" + logHTML + "</ul>" }], to: "max.van.kampen@moba.net", write: 1 }) }, onload: function () {
			//        elInfo.appendTag('div', { innerHTML: this.responseText });
			//    }
			//});
			if (schema.beforeUpload && !schema.beforeUpload.call(schema)) return;
			this.postrows(schema.urows);
		},
		fileonload: function (event) {
			Aim.Upload.log('Processing file');
			var data = event.target.result;
			var ext = this.filename.split('.').pop().toLowerCase();
			if (ext == 'json') {
				Aim.load({
					api: "build", put: JSON.parse(data), onload: function (event) {
						console.log(this.responseText);
					}
				});
				return;
			}

			var uploadext = Aim.Upload[ext];
			//console.log('upload', data[0], Aim.Upload, this.config, uploadext, ext);
			if (Aim.Upload.analyse) if (Aim.Upload.analyse(data)) return;
			if (!uploadext) return Aim.Upload.log('no upload ext');



			if (ext.substr(0, 3) == 'xls') {
				var workbook = XLSX.read(data, { type: 'binary' });
				//console.log('workbook', workbook);
				for (var sheetname in workbook.Sheets) if (uploadext[sheetname]) {
					//console.log('upload sheet', sheetname);
					var sheet = uploadext[sheetname];
					var wbsheet = workbook.Sheets[sheetname];
					var cols = sheet.cols;
					var ref = wbsheet['!ref'].split(':').pop();
					var irows = Number(ref.match(/\d+/g));
					var scols = String(ref.match(/[A-Z]+/g));
					var rows = [];
					//console.log(irows, scols);
					for (var r = sheet.firstrow, v; r <= irows; r++) {
						var row = {};
						for (var c = 0; c < 1000; c++) {
							var cn = Aim.Upload.encode_col(c);
							if (wbsheet[cn + r]) {
								var val = (wbsheet[cn + r].t == 'n' && wbsheet[cn + r].w && wbsheet[cn + r].v != wbsheet[cn + r].w) ? (wbsheet[cn + r].v ? new Date((wbsheet[cn + r].v - 25569) * 24 * 60 * 60 * 1000).toISOString().substr(0, 10) : null) : wbsheet[cn + r].w;
								row[cols[c] || cn] = String(val).trim();
							}
							if (cn == scols) break;
						}
						if (sheet.fixrow) if (!sheet.fixrow(row)) continue;
						rows.push(row);
					}
					for (var schemaname in sheet.schemas) {
						var schema = sheet.schemas[schemaname];
						schema.rows = rows;
						schema.krows = {};
						rows.forEach(function (row) {
							if (schema.fixrow) schema.fixrow(row);
							if (!row.keyID && !row.keyname) {
								this.logHTML += '<p>Key missing: ' + JSON.stringify(row) + '</p>';
								return;
							}
							//if (schema.krows[row.keyID || row.keyname]) return;
							var krow = schema.krows[row.keyID || row.keyname] = schema.krows[row.keyID || row.keyname] || { keyID: row.keyID, keyname: row.keyname, row: row };
							schema.properties.forEach(function (property) { if (row[property] && row[property] != 'null') krow[property] = row[property]; });
						});
						if (schema.beforeSync && !schema.beforeSync()) return;
						Aim.Upload.syncschema(schemaname, schema);
					}
				}
			}
		},
		loadlocal: function (path, fname) {
			fname=decodeURI(fname);
			Aim.Upload.elMessage.innerText = 'File: '+fname;
			this.log('Loading local file');
			console.log('loading File:',path+fname);
			//this.log(external.readfilearray("C:/Data/test.txt"));
			var content = '', result = external.readfilearray(path+fname);
			result = result.split("\r\n");
			this.log(result.length);
			//return;
			for (var i = 0, c; c = result[i]; i++) content += String.fromCharCode(c);
			//this.log(content);
			Aim.Upload.fileonload.call({ filename: fname }, { target: { result: content } });






			//upload.fileonload.call({ filename: 'CSP Lijst.xlsx' }, { target: { result: data } });
			//return;


			// var xhr = new XMLHttpRequest();
			// xhr.responseType = "arraybuffer";
			// //		var fn = '\\\\W2003dc.moba-bv.local\\algemeen\\Alg_data\\Wijzigingen\\CSP Lijst.xlsx';
			// //		var fn = 'file://C:/Users/maxva/Alicon/MOBA - Documenten/aliconnect/Bestanden/CSP Lijst.xlsx';
			// xhr.open('get', path + fname, true);
			// xhr.fname = fname;
			// xhr.onload = function () {
			// 	console.log('LOADED');
			// 	var arraybuffer = this.response, data = new Uint8Array(arraybuffer), arr = new Array();
			// 	for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
			// 	var bstr = arr.join("");
			// 	console.log(this.fname,Aim.Upload);
			// 	Aim.Upload.fileonload.call({ filename: this.fname }, { target: { result: bstr } });
			// }
			// xhr.send();

		},
		onchange: function (event) {
			Aim.Upload.elMessage.innerText = '';
			this.log('Loading file');
			this.logHTML = '';

			var files = event.target.files;
			var f = files[0];
			if (!f) return;
			var reader = new FileReader();
			this.filename = f.name;
			reader.onerror = function (ex) { console.log(ex); };
			reader.readAsBinaryString(f);
			reader.onload = Aim.Upload.fileonload.bind(this);
		}
	}
});
