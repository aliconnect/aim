
//console.log(Aim.origin, Aim.origin1);
//console.log('AIM', Aim.userID, Aim.client.domain.name, Aim.config, Aim.client, document.cookie);

Aim = window.Aim || {
	version: 'v1',
	config: {
		wss: {
			"hostname": "aliconnect.nl",
			"protocol": "wss",
			"port": 444,
			"url": "wss://aliconnect.nl:444"
		},
		origin: "https://aliconnect.nl"
	},
	host: "aliconnect",
	hostID: 2, client: { user: { id: 1 } }
};


//console.log(Aim.client);
//console.log('CLIENT',Aim.client,Aim.client.user);
//if (('auth' in Aim) && (!Aim.client.user || !Aim.client.user.id)) document.location.href = apiorigin + "/auth/?redirect_uri=" + document.location.href;
//console.log('LOCATION',Aim.js,document.location.protocol);
//if (!('console' in window)) console = { log: function () { } };
//if (!('Object' in window)) Object = {};
window.console = window.console || { log: function () { } };
window.Object = window.Object || {}
Object.assign = Object.assign || function (dest) {
	for (var i = 1, source; source = arguments[i]; i++) for (var name in source) dest[name] = source[name];
	return dest;
};
Object.values = Object.values || function (obj) {
	var arr = [];
	for (var name in obj) arr.push(obj[name]);
	return arr;
}
newEvent = function (name) {
	var event;
	if (typeof (Event) === 'function') {
		event = new Event(name);
	} else {
		event = document.createEvent('Event');
		event.initEvent(name, true, true);
	}
	return event;
}



var day = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
var days = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
var month = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
var today = vandaag = new Date();
vandaag.setHours(0, 0, 0, 0);


//alert(String(Aim.assign));

//console.log(Aim.client, Aim.access_token);
//var accessArray = Aim.access_token.split('.');





$a = function (target) { return target && target.tagName && Aim.Element[target.tagName] ? Object.assign(target, Aim.Element[target.tagName]) : Aim; };

Aim.assign = function () {
	var target = this, sources = Array.prototype.slice.call(arguments), objects = [];
	sources.forEach(function recurse(source) {
		if (objects.indexOf(source) != -1) return;
		objects.push(source);
		if (typeof source !== 'object') return source;
		for (var prop in source) {
			//if(prop=='values')console.log(prop);
			if (Object.prototype.toString.call(source[prop]) === '[object Object]') {
				if (!(prop in this)) this[prop] = source[prop]; else recurse.call(this[prop], source[prop]);
			}
			else {
				this[prop] = source[prop];
			}
		}
		if (source) {
			if (source.on) for (var eventName in source.on) window.addEventListener(eventName, source.on[eventName]);
			if (source.events) for (var eventName in source.events) window.addEventListener(eventName, source.events[eventName]);
		}
		return target;
	}, target);
	return target;
};
Aim.assign({
	access: Aim.client,//JSON.parse(atob(Aim.access_token.split('.')[1])),
	makeDateValue: function (value) {
		return value + (value.split(':').length == 2 ? ':00' : '') + 'Z';
	},
	//access, JSON.parse(atob(Aim.client.domain.id)),
	//access: JSON.parse(atob(Aim.access_token.split('.')[1])),
	//showcontextmenu: 1,
	//access: JSON.parse(atob(Aim.access_token.split('.')[1])),
	loglevel: 0,
	loglevel: 9,
	//config: {
	//	wss: {
	//		url: "wss://aliconnect.nl:444",
	//	}
	//},
	log: function (level) {
		if (level > Aim.loglevel) console.log.apply(Array.prototype.slice.call(arguments))
	},
	init: [],
	//his: [],
	root: (document.location.hostname == 'localhost' && Aim.local == 'api' ? '' : Aim.origin) + '/aim/' + Aim.version,
	api: Api = api = {
		fav: [],
		item: [],
		onload: function (row, i, rows) {
			if (!row || !row.id) return row;
			var item = api.item[row.id] = api.item[row.id] || Object.create(api.definitions.item, api.definitions.itemproperties);
			if (!item.schema && typeof row.schema == 'string' && row.schema) {
				(api[item.schema = row.schema] = api[row.schema] || [])[row.id] = item;
				//item.href = '#' + item.schema + '/' + item.id + '?select=*';
				item.assignschema();
			}
			item.values = item.values || row.values;
			item.loading = true;
			//console.log("ROWWW", row);
			//if (item.id) delete row.id;
			//console.log(item.id,row.id);

			//item.id = row.id;
			//delete row.id;
			Object.assign(item, row);
			item.loading = false;

			item.filterfields = item.filterfields || {
			};
			if (rows) rows[i] = item;
			item.items = item.children = item.children || [];

			//if (item.detailID) console.log(item.masterID,item.id,item.detailID);

			//if ([3564680, 3564681, 3564682, 3564683].indexOf(item.id) != -1) console.log(item.id, item.title, item.children);

			if (item.masterID) {
				var master = Aim.get({ id: item.masterID, children: [] });
				if (master.children.indexOf(item) == -1) {
					master.children.push(item);
				}
				//if ([3564680, 3564681, 3564682, 3564683].indexOf(item.masterID) != -1) console.log(item.id, item.title, item.masterID, master.title, master.children);
				if (!(item.schema in master)) Object.defineProperty(master, item.schema, {
					//get: this.getAttributeValue.bind(this, attributeName),
					get: function (className) {
						var a = [];
						this.children.forEach(function (child) { if (child.schema == className) a.push(child); });
						a.sort(App.sort.idx);
						return a;
					}.bind(master, item.schema),
					//set: this.setAttribute.bind(this, attributeName),
				});
				if (item.typical && !(item.typical in master)) Object.defineProperty(master, item.typical, {
					//get: this.getAttributeValue.bind(this, attributeName),
					get: function (className) {
						var a = [];
						this.children.forEach(function (child) { if (child.schema == className) a.push(child); });
						a.sort(App.sort.idx);
						return a;
					}.bind(master, item.typical),
					//set: this.setAttribute.bind(this, attributeName),
				});
			}
			if (rows && rows.get && rows.get.select == '*') item.selectall = true;
			item.refresh();
			return item;
		},
		definitions: definitions = Aim.definitions = {
		},
		item: items = [],
		find: function (classID) {
			for (var schemaname in api.definitions) if (api.definitions[schemaname] && api.definitions[schemaname].classID == classID) return schemaname;
		},

		getTitleAttributeName: function (schema) {

			if (typeof schema == 'string') schema = Aim.api.definitions[schema];
			//var schema = Aim.api.definitions[schemaName];
			schema.attributes = schema.attributes || schema.properties;
			for (var attributeName in schema.attributes) if (schema.attributes[attributeName].default) break;
			if (!attributeName) for (var attributeName in schema.attributes) if (schema.attributes[attributeName].kop === 0) break;
			//console.log('AAAAAAAAAAAAAAAAAA',attributeName, schema.properties[attributeName].kop, schema);
			//console.log(typeof schema, schema, attributeName);
			return attributeName;
		},

		//getTitleAttributeName: function (schema) {
		//	if (!schema) return;
		//	for (var attributeName in schema.properties) {
		//		if (schema.properties[attributeName].defaultvalue) break;
		//	}
		//	if (!attributeName) for (var attributeName in schema.properties) { if (schema.properties[attributeName].kop === 0) break; }
		//	//console.log('AAAAAAAAAAAAAAAAAA',attributeName, schema.properties[attributeName].kop, schema);
		//	return attributeName;
		//},
		mergeinto: function (newID, oldID) {
			//om drop action move into
			console.log('SAMENVOEGEN');
			Aim.load({
				api: 'item/' + newID + '/itemMerge',
				get: {
					oldID: oldID
				},
				//post: { exec: 'itemmerge', newID: targetdata.item.id, oldID: Aim.dragdata.item.id },
				onload: this.onload || function () {
					console.log(this.data);
				}
			});
		}

		//load: function (par) {
		//	var get = {};
		//	par.split(/\&/g).forEach(function (par) { par = par.split(/=/); get[par.shift()] = par.join('='); });
		//	Aim.load({ api: 'item', get: get, onload: App.onloadrows });
		//},
	},
	definitions: {
		item: {
			//id: null, title: '', subject: '', summary: '', createdDT:'',  startDT: '', endDT: '', finishDT: '', keyname: '',
			//values: {},
			id: null,
			assignschema: function () {
				Aim.assign.call(this, api.definitions.item, api.definitions[this.schema] || api.definitions[this.schema.toLowerCase()], this.typical && api.definitions[this.typical] ? api.definitions[this.typical] : null, this.masterID == this.srcID && api.definitions[this.name] ? api.definitions[this.name] : null);
				this.attributes = this.properties = this.properties || this.attributes;//Object.assign({}, this.properties, this.attributes);

				//console.log('assignschema', this.attributes);


				for (var attributeName in this.attributes) {
					this.attributes[attributeName].name = attributeName;
					if (!(attributeName in this)) Object.defineProperty(this, attributeName, {
						//get: this.getAttributeValue.bind(this, attributeName),
						get: this.getAttributeValue.bind(this, attributeName),
						set: this.setAttribute.bind(this, attributeName),
					});
				}
				this.filterfields = this.filterfields || this.getFilterfields() || {
				};
			},
			set: function (values, onload) {
				//console.log('SET',values);
				Aim.load({
					//msg: 'Set ' + this.title,
					//get: { id: this.detailID || this.id },
					put: {
						value: [{ schema: this.schema, id: this.detailID || this.id, values: values }]
					},
					item: this,
					onload: onload || function () {
						console.log('SET DONE', this.src, this.put, this.data);
						//if (this.item.id == get.id) this.item.reload();
					}
				});
				//for (var attributeName in values) {
				//	if (attributeName in this) this[attributeName] = values[attributeName];
				//	if (this.properties && (attributeName in this.properties)) this.values[attributeName] = values[attributeName];
				//	//if (attributeName in this) this[attributeName] = values[attributeName];
				//}
				this.refresh();
				this.show();


				//for (var attributeName in values) {
				//	if (this.properties && (attributeName in this.properties)) this.properties[attributeName].value = values[attributeName];
				//	if (attributeName in this) this[attributeName] = values[attributeName];
				//}
			},

			getrel: function (name, root) {
				if (!this[name]) return;
				if ('title' in this[name]) return this[name].getrel(name, root);
				this[name].title = '';
				//Aim.load({
				//	name: name, root: root, get: { schema: 'item', id: this[name].id, select: Aim.coltree.select }, onload: function (event) {
				//		var item = api.item[this.get.id];
				//		//console.log('REL LOADED', this.name, this.root.id, item.id, item[this.name]);
				//		this.root.write();
				//		item.getrel(this.name, this.root);
				//	}
				//});
			},
			//createField: function (attributeName) {
			//	//console.log(attributeName, this.attributes);
			//	//this.properties[attributeName].type = this.properties[attributeName].type || (this.properties[attributeName].classID ? 'selectitem' : this.properties[attributeName].options ? 'select' : 'text');
			//	//return Object.assign(Object.create({ name: attributeName, item: this }, Aim.attribute.properties), Aim.attribute.object, this.properties[attributeName], Aim.attribute.type[this.properties[attributeName].type]);
			//	return this.attributes[attributeName];
			//},
			//getKopText: function (kop, name) {
			//	//var kopName = ['title', 'subject', 'summary'];
			//	return this[name || ['title', 'subject', 'summary'][kop]];




			//	if (!this.values || !this.header || !this.header[kop]) return null;
			//	console.log('getKopText', this.header[kop]);
			//	var value = [];
			//	for (var i = 0, attributeName; attributeName = this.header[kop][i]; i++) {
			//		if (!this.values[attributeName]) return null;
			//		value.push(this.values[attributeName].value);
			//	}
			//	return value.join(' ');


			//	if (!this.selectall) return name ? this[name] : "";
			//	var a = [], value;
			//	for (var attributeName in this.attributes)
			//		//if (this.attributes[attributeName].kop == kop && (value = this.getAttributeValue(attributeName, true) || this.getAttributeDefault(attributeName) || this.getAttributeMaster(attributeName) || '')) {
			//		//	//console.log(attributeName,value);
			//		//	a.push((this.attributes[attributeName].prefix || '') + value + (this.attributes[attributeName].unit || '') + (this.attributes[attributeName].postfix || ''));
			//		//}
			//		if (this.attributes[attributeName].kop == kop && (value = this.getAttributeValue(attributeName, true))) {
			//			//console.log(attributeName,value);
			//			a.push((this.attributes[attributeName].prefix || "") + value + (this.attributes[attributeName].unit || "") + (this.attributes[attributeName].postfix || ""));
			//		}
			//	var retValue = a.join(" ");
			//	//if (name && retValue && this[name] != retValue) {
			//	//	//console.log('SET NEW KOP VALUE',name,this[name],retValue);




			//	//	//DEBUG this.setAttribute(name, retValue);
			//	//}
			//	//for (var attributeName in this.attributes) if (this.attributes[attributeName].kop == kop && (value = this.getAttribute(attributeName) )) a.push((this.attributes[attributeName].prefix || '') + value + (this.attributes[attributeName].unit || '') + (this.attributes[attributeName].postfix || ''));
			//	//console.log('getKopText', kop, name, a);
			//	return retValue || "";
			//},
			getFilterfields: function () {
				if (!this.values) return;
				var filterfields = {
				};
				for (var attributeName in this.attributes) {
					if (this.attributes[attributeName].filter) {
						var value = this.getAttribute(attributeName);
						if (value) filterfields[attributeName] = this.getAttributeValue(attributeName);
					}
				}

				filterfields.Schema = this.schema;
				if (this.typical) filterfields.Typical = this.typical;
				if (this.state) filterfields.State = this.state;
				delete filterfields.state;
				return filterfields;
			},
			//write: function () {
			//	document.body.appendTag('div', { innerText: 'DIT IS EEEN ITEM' });
			//},

			getHeader: function () {
				//return;
				var headerNames = ['title', 'subject', 'summary'], putHeader = {
				};
				if (!this.values || !this.header || !this.selectall) return;
				//console.log('getHeader', this.id, [this.title]);

				this.header.forEach(function (header, iHeader) {
					var value = [], headerName = headerNames[iHeader];
					console.log('getHeader', header, iHeader, headerName);
					for (var i = 0, attributeName; attributeName = header[i]; i++) {
						if (attributeName in this.values) value.push(this.values[attributeName].value);
					}
					value = value.join(' ');
					console.log(headerName, [value, this[headerName]]);
					if (value != this[headerName]) this[headerName] = putHeader[headerName] = value;
				}.bind(this));
				//console.log('getHeader', putHeader);
				return putHeader;
			},

			getAttribute: function (attributeName) {
				var prop = {
					modifiedDT: {
						get: function (attributeName) { return this.values && this.values[attributeName] ? this.values[attributeName].modifiedDT : null }.bind(this, attributeName),
					},
					value: {
						get: this.getAttributeValue.bind(this, attributeName),
					},
					itemID: {
						get: function (attributeName) { return this.values && this.values[attributeName] ? this.values[attributeName].itemID : null }.bind(this, attributeName),
					},
					displayvalue: {
						get: this.getAttributeValue.bind(this, attributeName, true),
					},
					defaultvalue: {
						get: this.getAttributeDefault.bind(this, attributeName),
					},
					mastervalue: {
						get: this.getAttributeMaster.bind(this, attributeName),
					},
					className: {
						get: function (attributeName) {
							var className = attributeName;
							if (this.values && this.values[attributeName]) {
								if (this.values[attributeName] && this.values[attributeName].valueSource)
									className += this.values[attributeName].valueSource != this.values[attributeName].value ? ' override' : ' default';
								if (this.lastvisitDT && this.values[attributeName].modifiedDT && new Date(this.values[attributeName].modifiedDT).valueOf() > new Date(this.lastvisitDT).valueOf()) className += ' modified';
							}
							return className;
						}.bind(this, attributeName),
					},
				}, prop = Object.create(this.attributes && this.attributes[attributeName] ? this.attributes[attributeName] : {}, prop);
				prop.type = prop.type || (prop.schema ? 'selectitem' : prop.options ? 'select' : 'text');
				prop.placeholder = prop.title || prop.placeholder || name;
				prop.item = this;
				return Object.assign(prop, prop.stereotype, Aim.attribute.type.text, Aim.attribute.type[prop.type]);
			},
			getAttributeValue: function (attributeName, view) {
				var value = null;
				if (this.values && (attributeName in this.values) && this.values[attributeName]) {
					//console.log("getAttributeValue1", this.id, this.title, attributeName, value);
					value = this.values[attributeName].itemID && api.items[this.values[attributeName].itemID] && "title" in api.items[this.values[attributeName].itemID]
						? api.items[this.values[attributeName].itemID].title
						: (typeof this.values[attributeName] == "object" ? this.values[attributeName].title || this.values[attributeName].value : this.values[attributeName]); //Aim.Object.getAttribute(this.values, attributeName);
				}
				//if (attributeName == 'Value') console.log("getAttributeValue2", this.id, this.title, attributeName, value);

				if (this.attributes && (attributeName in this.attributes)) {
					//value = "";
					var attribute = this.attributes[attributeName];
					//console.log('aa', value, attribute.idname);
					if (attribute.idname && !attribute.schema && attribute.idname != attributeName && attribute.idname in this) {
						//value = api.items[this[attribute.idname]] ? Aim.Object.getAttribute(api.items[this[attribute.idname]].title) : this[attribute.idname]; //MKAN
						value = this[attribute.idname]; //MKAN
					}
					//console.log('aa', value);

					if (attribute.calc) value = attribute.calc.call(this, value);
					if (view) {
						if (attribute.options && (value in attribute.options)) value = attribute.options[value].title || attribute.options[value];
						if (attribute.type == 'date') value = aDate(value).toDateText(1);
						if (attributeName == "Value" && this.Enum) value = this.Enum.split(",")[value];
					}
					//console.log('aa',value);
					if (attribute.display) value = attribute.display(value);
				}
				else if (attributeName in this) value = Aim.Object.getAttribute(this, attributeName);
				//if (attributeName == 'Value') console.log("getAttributeValue", this.id, this.title, attributeName, value, this.values[attributeName]?this.values[attributeName].value:'');
				return value;
			},
			getAttributeDefault: function (name, view, i) {
				if (i > 5) return;
				return this.source ? this.source.getAttributeValue(name, view) || this.source.getAttributeDefault(name, view, (i || 0) + 1) : '';
			},
			getAttributeMaster: function (name, view) {
				return '';//this.master ? this.master.getAttribute(name, view) || this.master.getAttributeMaster(name, view) : '';
			},


			refreshAttribute: function (attributeName) {

			},


			getPropertyAttributeName: function (propertyName) {
				for (var attributeName in this.attributes) if (this.attributes[attributeName].idname == propertyName) return attributeName;
			},


			//updateAttribute: function (attributeName, value, options) {
			//	if (value == this.getAttributeValue(attributeName)) return;
			//	this.setAttribute(attributeName, value, options);
			//},

			setAttribute: function (attributeName, value, options) {
				//options=options||{};
				//return;
				//console.log('setAttribute_1', this.id, attributeName, this[attributeName], this.getAttributeValue(attributeName), value);
				if ((value == this.getAttributeValue(attributeName)) && (!options || !options.post)) return;



				var attribute = this.attributes ? this.attributes[attributeName] : {}, item = {
					id: this.id, schema: this.schema, typical: this.typical, values: {}
				};
				this.values = this.values || {
				};
				value = String(value == undefined ? "" : value).trim();

				//console.log('setAttribute', this.id, attributeName, value, this.loading, options);


				//if (currentvalue == value ) return;

				item.values[attributeName] = this.values[attributeName] = this.values[attributeName] || {
				};
				this.values[attributeName].value = this.values[attributeName].value = value;

				//item.values.modifiedDT = this.values.modifiedDT = this.values.modifiedDT || {};
				//this.values.modifiedDT.value = this.values.modifiedDT.value = new Date().toLocaleDateString();

				//console.log('setAttribute1', this.id, this.title, attributeName, value);
				if (attribute) {
					if ('schema' in attribute) item.values[attributeName].schema = attribute.schema;
					if ('idname' in attribute) {
						item.values[attributeName].idname = attribute.idname;
						this[attribute.idname] = value;
					}
					if ('filter' in attribute) item.filterfields = this.filterfields = this.getFilterfields();
					//if ('kop' in attribute) Object.assign(item.values, this.getHeader());  //item.values[kopName[attribute.kop]] = { value: this[kopName[attribute.kop]] = this.getKopText(attribute.kop) };
					if (attribute.onchange) attribute.onchange.call(this);
				}
				Object.assign(item.values, this.getHeader());
				if (!value) delete item.values[attributeName].itemID;

				if (options) Object.assign(item.values[attributeName], options);

				if (this.loading) return;
				//console.log('setAttribute2', this.id, this.title, attributeName, value);


				//if (value && ['title', 'subject', 'summary'].indexOf(attributeName) != -1) this[attributeName] = value;




				this.refresh();
				item.setAttributeOptions = options;
				//console.log('setAttribute3', this.id, this.title, attributeName, value);
				this.setAttributeCount = (this.setAttributeCount || 0) + 1;
				Aim.setAttributeBuf = Aim.setAttributeBuf || [];
				Aim.setAttributeBuf.push(item);
				clearTimeout(Aim.setAttributeTO);
				Aim.setAttributeTO = setTimeout(function () {
					clearTimeout(Aim.setAttributeTO);
					//console.log('setAttributeTO', Aim.setAttributeBuf);
					var ids = {}, value = [];
					Aim.setAttributeBuf.forEach(function (row) {
						ids[row.id] = api.item[row.id];
						//console.log('ROW', JSON.stringify(row));
						var options = row.setAttributeOptions;
						delete row.setAttributeOptions;
						//console.log('OPTIONS', options, row);
						if (options && !('itemID' in options) && !options.post) return;
						//if (options && !('itemID' in options)) return;
						value.push(row);
					});
					for (var id in ids) api.item[id].refreshAttributes();
					var event = new Event('setAttribute');
					event.items = Aim.setAttributeBuf;
					window.dispatchEvent(event);

					if (!value.length) return;
					console.log('setAttributeTO', value);
					Aim.load({
						put: { value: value }, onload: function (event) {
							console.log('Aim.wss.send', this.put.value);

							Aim.wss.send({ value: this.put.value });
						}
					});
					Aim.setAttributeBuf = [];
				}, 50);
			},
			//setAttributes: function (values) {
			//	//if (prop.public) Aim.wss.send({ put: { value: items }, breadcast: true });
			//	Aim.load({
			//		api: 'item', put: { value: [{ id: this.id, values: values }] }, onload: function () {
			//			console.log(this.responseText);
			//		}
			//	});
			//},
			//createElement: function (attributeName) {
			//	console.log('createElement', attributeName, this.attributes[attributeName], this.values ? this.values[attributeName] : null);
			//	var el = document.createElement('span');
			//	el.innerText = this.values ? this.values[attributeName].value : '';
			//	return el;
			//},


			//if (window.aim && App.item) App.item.call(this);
			//if (window.app && OM.item) OM.item.call(this);
			//if (window.host && Host.item) Host.item.call(this);
			//console.log(this.id, this.title, this.masterID, this.master ? this.master.children : null);
			getChildren: function () {
				return this.detailID ? this.detail.children : this.children;
			},
			refreshAttributes: function () {
				var s = new Date();
				var attributes = {
					title: { displayvalue: this.title }, subject: { displayvalue: this.subject }, summary: { displayvalue: this.summary }, ModifiedDT: { displayvalue: this.modifiedDT = new Date().toISOString() }
				};
				if (this.values)
					for (var attributeName in this.values)
						if (!attributes[attributeName]) attributes[attributeName] = {
							value: this.values[attributeName].value, displayvalue: this.getAttribute(attributeName).displayvalue
						};
				//this.ModifiedDT = (this.values.ModifiedDT = this.values.ModifiedDT || {}).value =
				//this.modifiedDT = attributes.ModifiedDT = new Date().toISOString();
				for (var i = 0, e, c = document.getElementsByClassName(this.id) ; e = c[i]; i++) {

					//Aim.Alert.appendAlert({ id: 1, condition: 1, title: 'TEMP HOOG', created: new Date().toISOString(), categorie: 'Alert', ack: 0 });

					//if (row.attr) for (var name in row.attr) if (row.attr[name]) e.setAttribute(name, row.attr[name]); else e.removeAttribute(name);

					for (var attributeName in attributes) {


						//if (attributeName == 'ModifiedDT') console.log(attributeName, attributes[attributeName]);



						var displayvalue = attributes[attributeName].displayvalue, value = attributes[attributeName].value;//typeof attributes[attributeName] == 'object' ? attributes[attributeName].value : attributes[attributeName];


						//if (attributeName=='Value') console.log('hhhhhh', attributeName, displayvalue);


						displayvalue = String(displayvalue).split('-').length == 3 && String(displayvalue).split(':').length == 3 && new Date(displayvalue) !== "Invalid Date" && !isNaN(new Date(displayvalue)) ? new Date(displayvalue).toISOString().substr(0, 19).replace(/T/, ' ') : displayvalue;

						displayvalue = (isNaN(displayvalue) ? displayvalue : Math.round(displayvalue * 100) / 100);

						//if (attributeName == "CriticalFailure") console.log('REFESH', this.id, this.title, attributeName, e.getAttribute(attributeName), val);


						if (e.hasAttribute(attributeName) && e.getAttribute(attributeName) != value) {
							e.setAttribute(attributeName, value);
							e.setAttribute('modified', new Date().toLocaleString());
						}
						for (var i1 = 0, e1, c1 = e.getElementsByClassName(attributeName) ; e1 = c1[i1]; i1++) {
							if (e1.hasAttribute('checked')) {
								if (value) e1.setAttribute('checked', ''); else e1.removeAttribute('checked');
								e1.setAttribute('modified', new Date().toLocaleString());
							}
							else if ("value" in e1) {
								if (e1.value != value) {
									e1.value = value;
									e1.setAttribute('modified', new Date().toLocaleString());
								}
							}
							else if (e1.hasAttribute('value')) {
								if (e1.getAttribute('value') != value) {
									e1.setAttribute('value', value);
									e1.setAttribute('modified', new Date().toLocaleString());
								}
							}
							else if (['SPAN', 'DIV', 'TD'].indexOf(e1.tagName) != -1) {
								//if (attributeName == "CriticalFailure") console.log('REFESH', this.id, this.title, attributeName, e.getAttribute(attributeName), val);
								//
								//MKAN DIsplay value of value, probleem DMS
								//
								e1.innerHTML = displayvalue != undefined ? displayvalue : "";
								//

								e1.setAttribute('modified', new Date().toLocaleString());
							}
						}
					}
				}
				//console.log('Refreshed', new Date().valueOf() - s.valueOf() + 'ms');
				//Object.forEach(this.attributes, function (field, name) {
				//	for (var i = 0, e, c = document.getElementsByClassName(this.id) ; e = c[i]; i++) {
				//		//console.log(name,e);
				//		if (e.hasAttributes(name)) e.setAttribute(name, field.value);
				//		//for (var ia = 0, ea, ca = e.getElementsByClassName(name) ; ea = ca[ia]; ia++) Aim.Element.setAttribute(ea, field.value);
				//	}
				//	for (var i = 0, e, c = document.getElementsByClassName(this.id + name) ; e = c[i]; i++) Aim.Element.setAttribute(e, field.value);
				//	for (var i = 0, e, c = document.getElementsByClassName(this.id + name + field.value) ; e = c[i]; i++) if ('checked' in e) e.checked = true;
				//}.bind(this));
			},
			refresh: function (row) {
				//console.log('REFRESH ', this.id, this);

				if (this.finishDT) this.flag = 'done';
				else if (this.endDT) {
					this.daysLeft = Math.round((new Date(this.endDT) - vandaag) / 1000 / 60 / 60 / 24);
					this.flag =
						this.daysLeft > 14 ? 'afternextweek' :
						this.daysLeft > 7 ? 'nextweek' :
						this.daysLeft > 1 ? 'thisweek' :
						this.daysLeft > 0 ? 'tomorow' :
						this.daysLeft == 0 ? 'today' :
						'overdate';
					//console.log('DAYSLEFT', item.daysLeft, item.flag);
				}
				else this.flag = '';
				var deadline = {
					'done': 'Gereed',
					'overdate': 'Te laat',
					'today': 'Vandaag',
					'tomorow': 'Morgen',
					'thisweek': 'Deze week',
					'nextweek': 'Volgende week',
					'afternextweek': 'Later',
					'': 'Geen'
				}
				this.filterfields = this.filterfields || {
				};
				this.filterfields.Deadline = deadline[this.flag];
				this.filterfields.Bijlagen = this.hasAttach ? 'Ja' : 'Nee';
				this.filterfields.Status = this.state;
				this.filterfields.Schema = this.schema;





				//if (this.selectall) {
				//console.log(this.id,this.selectall);
				//if (!this.external)['title', 'subject', 'summary'].forEach(function (name, i) {
				//	//var nameValue = this[name] || "";
				//	var value = this.getKopText(i, name) || "";
				//	if (value && (this[name] || '') != value) {
				//		///console.log('REFRESH', this.id, name, this[name], '>', value);

				//		this.setAttribute(name, value);



				//		//if (!this[name + 'updated']) {
				//		//	this[name + 'updated'] = true;
				//		//	this.setAttribute(name, value);
				//		//}
				//	}
				//}.bind(this));
				//}
				//this.getHeader();
				if (this.elLvLi) this.elLvLi.rewrite();
				if (this.createTreenode) this.createTreenode();
				for (var i = 0, c = document.getElementsByClassName('checkvisible'), e; e = c[i]; i++) if (e.checkvisible) e.setAttribute('visible', e.checkvisible());


				//if (row) {
				//	if (row.schema && !this.attributes) {
				//		this.href = '#' + row.schema + '/' + this.id + '?select=*';
				//		(api[row.schema] = api[row.schema] || [])[this.id] = this;
				//		Object.assign(this, api.definitions[row.schema], api.definitions[row.typical]);
				//		if (this.allOf) Object.assign.apply(this, [this].concat(Array.prototype.slice.call(this.allOf)));
				//		this.attributes = {};
				//		for (var attributeName in this.properties) {
				//			this.properties[attributeName].type = this.properties[attributeName].type || (this.properties[attributeName].classID ? 'selectitem' : this.properties[attributeName].options ? 'select' : 'text');
				//			this.attributes[attributeName] = Object.assign(Object.create({ name: attributeName, item: this }, Aim.attribute.properties), Aim.attribute.object, this.properties[attributeName], Aim.attribute.type[this.properties[attributeName].type]);
				//		}
				//	}
				//	Object.assign(this, row);
				//}
				//if ('flagSet' in this) this.flagSet();
				//if (this.flag && this.filterfields) this.filterfields.Flag = this.flag;
				//this.cd = this.properties && this.properties.cd ? this.properties.cd.value : this.cd;
				//this.discount = this.cd || this.sd || 0;
				//this.pricedefault = this.discount == null ? null : this.cp;
				//this.price = this.discount == null ? null : Number(this.cp) * (100 - this.discount) / 100;
				//if (this.schema && this.write && this.id == get.id && !this.editing) this.write();
			}
		},
		itemproperties: {
			master: {
				get: function () { return this.masterID ? Aim.get({ id: this.masterID }) : null }
			},
			parent: {
				get: function () { return this.master }
			},
			index: {
				get: function () { return this.master ? this.master.children.indexOf(this) : -1 }
			},
			source: {
				get: function () { return this.srcID ? Aim.get({ id: this.srcID }) : null }
			},
			detail: {
				get: function () { return this.detailID ? Aim.get({ id: this.detailID }) : {} }
			},
			isClass: {
				get: function () { return Number(this.masterID) == Number(this.srcID); }
			},
			classTag: {
				get: function () { return (this.source && this.source.tag ? this.source.tag : '') + (this.tag || ''); }
			},
			classItemName: {
				get: function () { return (this.source && this.source.name ? this.source.name : '') + (this.name || ''); }
			},
			hasAttach: {
				get: function () { return this.files && this.files && this.files.length }
			},
			hasImage: {
				get: function () { return this.hasAttach && App.file.oisImg(this.files[0]) }
			},
			iconsrc: {
				get: function () {
					if (!this.files || !this.files.length) return '';
					for (var i = 0, f; f = this.files[i]; i++) if (App.file.oisImg(f)) break;
					if (f && f.src && f.src[0] == '/') f.src = 'https://aliconnect.nl' + f.src;//console.log(f.src);
					return f ? f.src : '';
				}
			},
			fav: {
				get: function () {
					return Aim.api.fav.indexOf(this.detailID || this.id) != -1;
				},
				set: function (value) {
					var fav = this.fav;
					if (value && !fav) Aim.api.fav.unshift(this.detailID || this.id);
					else if (!value && fav) Aim.api.fav.splice(Aim.api.fav.indexOf(this.detailID || this.id), 1);
					Aim.load({ api: 'fav', get: { id: this.detailID || this.id }, post: { fav: value } });
					for (var i = 0, e, c = document.getElementsByClassName(this.detailID || this.id) ; e = c[i]; i++) if (e.rewrite) e.rewrite();
				}
			},
			stateColor: {
				get: function () {
					return this.state && this.attributes && 'state' in this.attributes && 'options' in this.attributes.state && this.attributes.state.options[this.state] ? this.attributes.state.options[this.state].color : null;
					return this.masterID ? api.item[this.masterID] || Aim.get({ id: this.masterID }) : {
					}
				}
			},
			fullTag: {
				get: function () {
					var text = [this.classTag], item = this.master;
					while (item) {
						if (item.tag) text.unshift(item.classTag);
						item = item.master;
					}
					return text.join('.');
				}
			},
			fullName: {
				get: function () {
					var text = [this.classItemName], item = this.master;
					while (item) {
						if (item.tag) text.unshift(item.classItemName);
						item = item.master;
					}
					return text.join('_');
				}
			},
			titleText: {
				get: function () { return this.title || String(this.detail.title || '').trim(); }
			},
			subjectText: {
				get: function () { return this.subject || String(this.detail.subject || '').trim(); }
			},
			summaryText: {
				get: function () { return this.summary || String(this.detail.summary || '').trim(); }
			},
			//Title: { get: function () { return this.getKopText(0, 'title') || String(this.detail.subject || '').trim(); } },
			//Subject: { get: function () { return this.getKopText(1, 'subject') || String(this.detail.subject || '').trim(); } },
			//summaryText: { get: function () { return this.getKopText(2, 'summary') || String(this.detail.summary || '').trim(); } },
			tooltipText: {
				get: function () {
					var s = '';
					var fnames = 'keyname,name,fullName,tag,fullTag'.split(',');
					for (var i = 0, name; name = fnames[i]; i++) if (this[name]) s += name + ':' + this.getAttribute(name) + "\r\n";
					return s;
				}
			},
			typicalIdx: {
				get: function () {
					var idx = 0;
					for (var i = 0, item; item = this.master.children[i]; i++) {
						if ('selected' in item && item.selected == 0) continue;

						if (item.srcID == this.srcID) idx++;
						if (item == this) return idx;
					}
				}
			},
			modified: {
				get: function () {
					//console.log(this.title, this.modifiedDT, this.lastvisitDT, new Date(this.modifiedDT).valueOf(), new Date(this.lastvisitDT).valueOf());
					return !this.modifiedDT ? "" : (!this.lastvisitDT ? "new" : (new Date(this.modifiedDT).valueOf() > new Date(this.lastvisitDT).valueOf() ? "modified" : ""));
				},
			},
		},
	},
	Element: {
		FORM: {
			getValues: function () {
				var values = {};
				console.log(this, this.elements);
				Array.prototype.slice.call(this.elements).forEach(function (el, i, arr) { if (el.name && el.value) values[el.name] = el.value; });
				return values;
			}
		},
		onclick: function () {
			//console.log('CLICK', this, this.get, this.colName, this.itemID);
			//if (this.printable) OM.printdiv = this;
			if (this.hasAttribute('open')) {
				this.setAttribute('open', this.getAttribute('open') ^ 1);
				if (this.getAttribute('open') != 1) return;
				if (this.onopen && !this.loaded) this.loaded = this.onopen();
				var eTop = this;
				while (eTop) {
					if (eTop.open1) {
						var e = this;
						while (e) {
							if (e.open1) return;
							for (var i = 0, c = e.parentElement.children, ec; ec = c[i]; i++) if (ec.hasAttribute('open') && ec != e && ec != e.previousElementSibling) {
								ec.setAttribute('open', 0);
								console.log(e, ec, ec.hasAttribute('open'));
							}
							e = e.parentElement;
						}
					}
					eTop = eTop.parentElement;
				}
			}
			//console.log('CLICK', this.get);


			if (this.itemID) {
				//console.log('itemID');
				var item = api.items[this.itemID];
				if (item) document.location.href = '#' + item.schema + '/' + item.id + '?select=*';
				return false
				//OM.show({ id: this.itemID });
			}
			else if (this.set) {
				Aim.URL.set(this.set);
				return false
				//OM.show({ id: this.itemID });
			}
			else if (this.infoID) {
				//console.log('infoID');
				event.stopPropagation();
				Aim.get({ id: this.infoID }).showinfo();
				if (Aim.Element.PopupCard) {
					Aim.Element.PopupCard.parentElement.removeChild(Aim.Element.PopupCard); Aim.Element.PopupCard = null;
				}
				return false
			}
				//if (this.pnl)
				//if (this.par) {
				//	OM.show(this.par);
				//	event.stopPropagation();
				//	event.preventDefault();
				//	return false;
				//}
				//else if (this.colName) Aim.setfocus(this);
			else if (this.colName) {
				document.body.setAttribute('ca', this.colName);
				OM.colActive = this;
				OM.elColActive = this;
				Aim.printSource = this;
			}
			else if (this.elClose) this.elClose.parentElement.removeChild(this.elClose);
			else if (this.get) Aim.URL.set(typeof this.get == 'function' ? this.get() : this.get);


		},
		onchange: function (event) {
			console.log('ON CHANGE', this.item, [this.name, this.value, this.itemID, this.id]);
			if (this.item && this.name) {
				this.item.values = this.item.values || {
				};
				var attributeValue = this.item.values[this.name] = this.item.values[this.name] || {
				};
				//if (this.itemID) attributeValue.itemID = this.itemID;
				//console.log('onchange', this.item);

				if (this.hasAttribute("contenteditable")) this.value = this.innerHTML != "<p><br></p>" ? this.innerHTML : "";

				if (this.item.setAttribute) this.item.setAttribute(this.name, this.value, { itemID: this.itemID || '', schema: this.schema || '' });
				//console.log('ONCHANGE');
				//console.log(this.field.value);
				//console.log(this.value);
				//console.log(this.value == this.field.value);

				//if (this.field.value != this.value) this.field.value = this.value;
			}
			//console.log('CHANGED', this.value);
			//console.log('SET', this.item.id, this.name, this.value);
			//Aim.load({ api: 'item', put: { value: [{ id: this.item.id, values: { [this.name]: this.value } }] } });
		},
		setAttribute: function (e, value) {
			//e.removeAttribute('operating');
			if ('value' in e) e.value = value;
			else if (e.hasAttribute('value')) e.setAttribute('value', value);
			else if (e.innerHTML[0] != '<') e.innerText = value;
		},
		Pulldown: {
			loadmsg: 'Get items of class',
			autocomplete: 'off',
			//onblur: function () {
			//	console.log('BLUR EDIT SELECTITEM');
			//	if (this.el && this.el.parentElement) this.el.parentElement.removeChild(this.el);
			//	//if (this.onchange) this.onchange();
			//},
			onfocus: function () {
				this.el = this.parentElement.appendTag('div', { className: 'dropdown' });
				this.prevValue = this.value.trim().toLowerCase();
				//this.schemaname = Aim.Object.findFieldValue(api.definitions, 'classID', this.classID);
				//if (this.post.id) {
				//	var id_array = this.post.id.split(';');
				//	id_array.shift();
				//	this.post.classID = id_array.shift();
				//	this.post.keyID = id_array.shift();
				//	this.post.where = id_array.shift();
				//}
			},
			onselectdone: function (event) {
				clearTimeout(OM.toKeyup);
				clearTimeout(OM.toLoad);
				this.id = this.itemID = this.el.elSelected.id;
				this.prevValue = String(this.value = this.el.elSelected.value).trim().toLowerCase();
				//if (this.field) {
				//	this.field.itemID = this.id;
				//	//this.field.value = this.value;
				//}
				this.el.innerText = '';
				//console.log('onselectdone', this, this.onselect);
				if (this.onitemselect) this.onitemselect();
				Aim.Element.onchange.call(this, event);
				this.select();
			},
			showpd: function (rows) {
				this.rows = rows || this.rows;
				//console.log('SHOW PD', this.rows);
				//Aim.Element.Pulldown.el = Aim.Element.Pulldown.el || this.parentElement.appendTag('div', { className: 'dropdown' });
				//var rect = this.getBoundingClientRect();
				with (this.el) {
					innerText = '';
					//style.top = (rect.top + rect.height) + 'px';
					//style.width = (rect.width) + 'px';
					for (var i = 0, row; row = this.rows[i]; i++) {
						with (appendTag('div', { id: row.id, elInp: this, value: row.title || row.name })) {
							appendTag('div', { innerText: row.title || row.name });
							appendTag('small', { innerText: row.subject || '' });
							appendTag('small', { innerText: row.summary || '' });
							onclick = function (event) {
								event.preventDefault();
								event.stopPropagation();
								this.elInp.el.elSelected = this;
								this.elInp.onselectdone();
							};
						}
						//console.log(row);
					}
					//console.log(window.innerWidth, Aim.Element.Pulldown.el.clientWidth);
					//style.left = Math.min(rect.left, window.innerWidth - Aim.Element.Pulldown.el.clientWidth - 10) + 'px';
					this.el.elSelected = this.el.firstChild;
					if (this.el.elSelected) this.el.elSelected.setAttribute('selected', '');
				}
			},
			findlist: function (rows) {
				rows = api[this.schema];
				console.log('FINDLIST', rows);
				this.words = this.value.split(' ');
				this.rows = [];
				if (rows) rows.forEach(function (row, itemID) {
					//if (row.hostID != Aim.client.domain.id || !row.title) return;
					var title = row.title.toLowerCase();
					for (var i = 0, word; word = this.words[i]; i++) if (title.indexOf(word) == -1) return;
					this.rows.push(row);
				}, this);
				this.showpd();
			},
			load: function () {
				console.log('FIND LOAD >>>>>>', this.value, this.schema);
				Aim.load({
					el: this,
					activeElement: document.activeElement,
					//api: this.schemaname,
					get: Object.assign(this.get || {
					}, {
						schema: this.schema, select: 'title,subject,summary',
						q: (this.searchPre || '') + this.value.trim().toLowerCase() + (this.searchPost || ''),
						//search: 'name,keyname,title,subject,summary',
						filter: this.selectfilter || '',
						top: 20
					}, this.get || {}),
					//post: this.post,
					onload: function () {
						//console.log('LOADED', this.src, this.data);
						this.el.showpd(this.data.value);
					}
				});
			},
			onkeyup: function () {
				if (!this.value) this.el.innerText = '';
				this.itemID = null;
				//if (this.field) {
				//	this.field.itemID = this.itemID;
				//	this.field.value = this.value;
				//}
				if (this.prevValue == this.value.trim().toLowerCase()) return;
				this.prevValue = this.value.trim().toLowerCase();
				if (this.value) {
					OM.toKeyup = setTimeout(function () {
						this.rows = [];
						var words = this.value.split(' ');
						if (api[this.schema]) for (var itemID in api[this.schema]) {
							var row = api[this.schema][itemID];
							//if (row.hostID != Aim.client.domain.id || !row.title) return;
							var title = String(row.title).toLowerCase();
							for (var i = 0, notfound = true, word; (word = words[i]) && notfound; i++) {
								notfound = title.indexOf(word.toLowerCase()) == -1
							};
							//if (title.indexOf(word.toLowerCase()) != -1) { found = true; break; }
							if (!notfound) this.rows.push(row);
						};
						console.log('FINDLIST >>>>>>>', this.rows, this.rows.length);
						if (this.rows.length) return this.showpd(this.rows);
						clearTimeout(OM.toLoad);
						this.load();
						//console.log('FINDLIST >>>>>>>', rows, this.rows.length);

						//console.log('KEYUP', this.classID, this.schemaname);
						//if (!this.get.filter && !this.get.keyID) this.findlist();

					}.bind(this), 500);
					OM.toLoad = setTimeout(this.load.bind(this), 2000);
				}
			},
			onkeydown: function (event) {
				clearTimeout(OM.toKeyup);
				clearTimeout(OM.toLoad);

				this.itemID = null;
				var key = event.key;
				if (this.el.innerText != '' && key) {
					var key = key.replace('Arrow', '').replace('Escape', 'Esc');
					if (key == 'Up') {
						this.el.elSelected.removeAttribute('selected');
						if (this.el.elSelected.previousElementSibling) this.el.elSelected = this.el.elSelected.previousElementSibling;
						this.el.elSelected.setAttribute('selected', '');
						Aim.Element.scrollIntoView(this.el.elSelected);
						console.log('UP');
						event.preventDefault();
						return;
					}
					else if (key == 'Down') {
						this.el.elSelected.removeAttribute('selected');
						if (this.el.elSelected.nextElementSibling) this.el.elSelected = this.el.elSelected.nextElementSibling;
						this.el.elSelected.setAttribute('selected', '');
						Aim.Element.scrollIntoView(this.el.elSelected);
						console.log('DN');
						event.preventDefault();
						return;
					}
					else if (key == 'Esc') {
						this.el.innerText = '';
						event.stopPropagation();
						event.preventDefault();
						return;
					}
					else if (key == 'Enter') {
						event.stopPropagation();
						event.preventDefault();
						this.onselectdone();
						return false;
					}
				}
			},
		},
		popup: function (el) {
			if (!el.itemID) return;
			el.showcard = function () {
				//console.log('SHOWCARD',this.title,this);
				if (Aim.Element.PopupCard) {
					Aim.Element.PopupCard.parentElement.removeChild(Aim.Element.PopupCard); Aim.Element.PopupCard = null;
				}
				if (Aim.Element.hover) with (Aim.Element.PopupCard = Aim.Element.hover.appendTag('div', { className: 'pucard shadow col' })) {
					var rect = Aim.Element.hover.getBoundingClientRect();
					style.top = (rect.top + rect.height) + 'px';
					with (appendTag('div', { className: 'aco point', infoID: this.id, onclick: Aim.Element.onclick })) {
						appendTag('div', { className: 'kop0', innerText: this.title });
						appendTag('div', { className: 'kop1', innerText: this.subject });
						appendTag('div', { className: 'kop2', innerText: this.summary });
					}
					with (appendTag('div', { className: 'row btnbar' })) {
						if (this.properties) Object.entries(this.properties).forEach(function (aObject, i) {
							var attributeName = aObject.shift(), field = aObject.shift();
							//console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',field,i,attributeName);
							if (field.type == 'tel' && field.value) appendTag('a', { className: 'abtn icn phone', title: field.value, href: 'tel:' + field.value });
						});
						//appendTag('a', { className: 'abtn icn form r', href: '#id=' + this.itemID + '&lid=' + this.itemID, onclick: function (event) { event.stopPropagation(); } });
					}
				}
			}
			//el.onclick = Aim.Element.onclick;
			el.href = '#?' + Aim.URL.stringify({ schema: el.schema || 'item', id: el.itemID });
			el.onmouseenter = Aim.Element.onmouseenter;
			el.onmouseleave = Aim.Element.onmouseleave;
			return el;
		},
		onmouseenter: function () {
			if (this.showcard) {
				Aim.Element.hover = this;
				if (api.items[this.itemID] && api.items[this.itemID].title) this.showcard.call(api.items[this.itemID]);
				else Aim.load({ api: 'item', get: { id: this.itemID }, showcard: this.showcard, onload: function () { this.showcard.call(api.items[this.data.id]) } });
			}
		},
		onmouseleave: function () {
			if (this.showcard) {
				Aim.Element.hover = null;
				if (Aim.Element.PopupCard) {
					Aim.Element.PopupCard.parentElement.removeChild(Aim.Element.PopupCard); Aim.Element.PopupCard = null;
				}
			}
		},
		hasParent: function (el, elPar) {
			while (el && el != elPar) el = el.parentElement;
			return el;
		},
		open: function () {
			if (this.getAttribute('open') != undefined) this.setAttribute('open', 1);
		},
		close: function () {
			if (this.getAttribute('open') != undefined) this.setAttribute('open', 0);
		},
		setOpen: function (el) {
			//console.log("setOpen", Aim.cookie);
			el.setAttribute('open', Aim.cookie && Aim.cookie.foldersOpen && Aim.cookie.foldersOpen.indexOf(el.label) != -1 ? 1 : 0);
			el.onclick = function () {
				this.setAttribute('open', this.getAttribute('open') ^ 1);
				if (Number(this.getAttribute('open'))) Aim.foldersOpen.unshift(this.label); else if (Aim.foldersOpen) Aim.foldersOpen.splice(Aim.foldersOpen.indexOf(this.label), 1);
				document.cookie = 'foldersOpen=' + Aim.foldersOpen.join(',');
			};
		},
		scrollIntoView: function (el, cont) {
			//console.log('scrollIntoView',el,arguments.callee.caller);
			if (el) el.scrollIntoView({ block: "nearest", inline: "nearest" });
		},
	},
	Object: {
		getAttribute: function (obj, name) {
			//zoekt uit of een obj ook een object is, geeft terug title of value van object, anders object zelf.
			//if (name=='Betaald') console.log('LLLLLL', name, obj[name]);
			if (!obj || !name || !(name in obj) || !obj[name]) return "";
			if (typeof obj[name] != 'object') return obj[name];
			if ('value' in obj[name]) return value = obj[name].value;
			else if ('title' in obj[name]) var value = obj[name].title;
			else value = value || obj[name];
			if ('calc' in obj[name]) var value = obj[name].calc(value || '');
			return value;
			//return obj && name && (name in obj) && obj[name] ? (typeof obj[name] == 'object' ? ('value' in obj[name] ? obj[name].value : 'title' in obj[name] ? obj[name].title : '') : obj[name] || '') : "";
			//return obj && name && (name in obj) && obj[name] ? (typeof obj[name] == 'object' ? ('value' in obj[name] ? obj[name].value : 'title' in obj[name] ? obj[name].title : '') : obj[name] || '') : "";
		},
		stringify: function (par) {
			var s = '';
			for (var name in par) s += name + ':' + par[name].join(',') + ';';
			return s;
		},
		parse: function (s) {
			var a1 = decodeURIComponent(s).split(';');
			var par = {
			};
			for (var i = 0, a; a = a1[i]; i++) {
				var a2 = a.split(':');
				par[a2[0]] = a2[1].split(',');
			}
			return par;
		},
		toArray: function (o) {
			var a = [];
			for (var id in o) {
				o[id].id = o[id].id || id; a.push(o[id]);
			}
			return a;
		},
		toArray1: function (o) {
			var a = [];
			for (var id in o) {
				var obj = items.item.call(o[id]);
				//obj.fields = {};
				//for (var name in obj.values) obj.fields[name].value = obj.values[name];
				//obj.fields = obj.properties;
				//obj.name = obj.title;
				//obj.state = obj.properties.state;
				a.push(obj);
			}
			return a;
		},
		toArrayTitle: function (o, a) {
			for (var title in o) {
				var row = o[title];
				//console.log(title, row, a);
				row.title = row.title = row.name = title;
				a.push(row);
				if (row.items) Aim.Object.toArrayTitle(row.items, row.children = []);
			}
		},
		find: function (objlist, fn, t) {
			for (var name in objlist) if (fn.call(t, objlist[name])) return name;
		},
		findFieldValue: function (objlist, attributeName, value) {
			for (var name in objlist) {
				//console.log(attributeName, name, value, objlist[name][attributeName]);
				if (objlist[name] && objlist[name][attributeName] == value) return name;
			}
		},
	},
	Aliconnector: {
	},
	Document: {
		create: function (data) {
			console.log('DOC CREATE');
			if (!(data instanceof Event)) Object.assign(this, data);

			Aim.libraryShow.call(this, [
				libroot + '/js/document.js'
			]);
		},
	},
	Upload: {
		create: function (data) {
			if (!(data instanceof Event)) Object.assign(this, data);
			Aim.libraryShow.call(this, [
				libroot + '/js/xlsx.js',
				libroot + '/js/jszip.js',
				libroot + '/js/upload.js'
			]);
		},
	},
	Charts: Charts = {
		create: function (data) {
			if (!(data instanceof Event)) Object.assign(this, data);
			Aim.libraryShow.call(this, [
				apiorigin + '/inc/js/amcharts4/dist/script/core.js',
				apiorigin + '/inc/js/amcharts4/dist/script/charts.js',
				apiorigin + '/inc/js/amcharts4/dist/script/themes/animated.js',
				libroot + '/js/charts.js'
			]);
		},
	},
	Charts3: Charts3 = {
		create: function (data) {
			Aim.libraryShow.call(this, [
				apiorigin + '/inc/js/amcharts3/amcharts/amcharts.js',
				apiorigin + '/inc/js/amcharts3/amcharts/serial.js',
				apiorigin + '/inc/js/amcharts3/amcharts/pie.js',
			]);
		},
	},
	Go: Go = {
		create: function (data) {
			if (!(data instanceof Event)) Object.assign(this, data);
			Aim.libraryShow.call(this, [
				//apiorigin + '/inc/js/go/release/go.js',
				apiorigin + '/inc/js/go1/go.js',
				libroot + '/js/go.js'
			]);
		}
	},
	Calendar: Calendar = {
		create: function (el, data) {
			if (!(el instanceof Event)) Object.assign(this, { el: el, data: data });
			Aim.libraryShow.call(this, [
				libroot + '/js/calendar.js'
			]);
		}
	},
	Ganth: Ganth = {
		create: function (el, data) {
			console.log('Ganth Create');
			if (!(el instanceof Event)) Object.assign(this, { el: el, rows: data });
			Aim.libraryShow.call(this, [
				libroot + '/js/ganth.js'
			]);
		},
	},
	Three: Three = {
		create: function (el, id) {
			if (!(el instanceof Event)) {
				this.el = el;
				this.id = id;
			}
			console.log('THREE');
			Aim.libraryShow.call(this, [
				apiorigin + '/inc/js/three/build/three.js',
				apiorigin + '/inc/js/three/examples/js/libs/stats.min.js',
				apiorigin + '/inc/js/three/examples/js/controls/OrbitControls.js',
				apiorigin + '/inc/js/three/examples/js/renderers/Projector.js',
				libroot + '/js/three.js'
			]);
		},
	},
	Notification: {
		create: function (data) {
			Object.assign(this, data);
			with (popupmessage.el = popupmessage.appendTag('li', { className: 'row' })) {
				appendTag('button', { className: "abtn icn close abs", onclick: function () { popupmessage.removeChild(this) }.bind(popupmessage.el) });
				if (data.options.icon) appendTag('img', { src: data.options.icon });
				with (appendTag('div', { className: 'aco' })) {
					appendTag('header', { innerText: data.title });
					appendTag('div', { innerText: data.options.body });
				}
			}
			if (!("Notification" in window)) return console.log("This browser does not support desktop notification");
			if (Notification.permission === "granted") {
				var notification = new Notification(this.title, this.options);
				notification.onclick = function (event) {
					event.preventDefault(); // prevent the browser from focusing the Notification's tab
					console.log('Notify Click Options', this);
					window.focus();
					if (this.url) document.location.href = this.url;
				}.bind(this.options);
				notification.onerror = function (event) {
					console.log('Notify ERROR', this, event);
				}.bind(this.options);
				notification.onclose = function (event) {
					console.log('Notify CLOSE', this, event);
				}.bind(this.options);
				notification.onshow = function (event) {
					console.log('Notify SHOW', this, event);
				}.bind(this.options);
			}
			else if (Notification.permission !== 'denied' || Notification.permission === "default") {
				Notification.requestPermission(function (permission) {
					this.permission = permission;
					if (permission === "granted") {
						var notification = new Notification(this.title, this.options);
					}
				}.bind(this));
			}
		},
	},
	Alert: {
		appendAlert: function (alert) {
			/*
			Dit is een uitleg test
			gsdfgsdfgsd
			fgsdfg
			sdfgsd
			*/
			//console.log('Append Alert', alert);

			if (!document.getElementById('alertpanel')) return;
			if (!Aim.elAlertrow) {
				with (document.getElementById('alertpanel')) {
					Aim.elAlertsum = document.getElementById('alertsum') || appendTag('div', { className: 'col', id: 'alertsum' });
					Aim.elAlertrow = document.getElementById('alertrow') || appendTag('div', { className: 'col aco', id: 'alertrow' });
				}
			}
			if (!Aim.alerts[alert.id]) Aim.alerts[alert.id] = Aim.elAlertrow.appendTag('div', {
				className: alert.categorie, innerText: [alert.title, alert.created].join(' '),
				onchange: function (event) {
					//console.log('CHANGE', this);
					if ('condition' in this) this.setAttribute('condition', this.condition);
					if ('ack' in this) this.setAttribute('ack', this.ack);
					if (this.ack && !this.condition) {
						Aim.alerts[this.id] = null; Aim.elAlertrow.removeChild(this);
					}
				},
				onclick: function () {
					Aim.wss.send({ systemalert: { id: this.id, ack: this.ack = 1 } });
					this.onchange();
				}
			});
			Object.assign(Aim.alerts[alert.id], alert).onchange();
		}
	},
	attribute: {
		//create: function () { },
		type: {
			text: {
				createInput: function () {
					this.elInp = this.elEdit.appendTag('input', { attr: this.attr, className: 'ainp aco ' + this.name, type: this.type || '', value: this.value, item: this.item, name: this.name, titel: this.title, onchange: Aim.Element.onchange });
					for (var name in this) if (name in this.elInp) this.elInp[name] = this[name];
					this.elInp.placeholder = " ";

				},
				createSpan: function () {
					if (this.itemID) {
						this.elSpan = this.elView.appendTag('a', { schema: this.schema || 'item', itemID: this.itemID, innerHTML: this.value });
					}
					else {
						//var value = this.displayvalue;
						//defaultvalue = this.defaultvalue,
						//mastervalue = this.mastervalue,
						//className = 'aco pre wrap ' + this.name;
						//if (mastervalue) className += ' master';
						this.elSpan = this.elView.appendTag('span', {
							className: 'aco pre wrap ' + this.className,
							type: this.type || '',
							//titel: this.title,
							field: this,
							innerHTML: this.displayvalue,//value || defaultvalue || mastervalue,
							//title: (value && value != (defaultvalue || mastervalue)) ? (defaultvalue || mastervalue) : '',
						});
					}
					//console.log('createSPAN', this.name, this.value, this.item.id );
					//console.log(this.item.lastvisitDT, new Date(this.item.lastvisitDT).valueOf());
					//console.log(this.modifiedDT, new Date(this.modifiedDT).valueOf());

				},
				createEdit: function (name) {
					with (this.elEdit = document.body.appendTag('div', { className: 'row field ' + (this.type || 'text') })) {
						if (this.hidden) setAttribute('hidden', '');
						if (this.checkvisible && this.item) {
							this.elEdit.className += ' checkvisible'; this.elEdit.checkvisible = this.checkvisible.bind(this.item);
						}
						this.createInput(this);
						appendTag('label', { innerText: this.placeholder });
					}
					return this.elEdit;
				},
				createView: function (name) {
					with (this.elView = document.body.appendTag('div', { className: 'row prop ' + (this.type || 'text') })) {
						appendTag('label', { innerText: this.placeholder });
						this.createSpan(this);
					}
					return this.elView;
				},

			},

			radio: {
				createRadio: function (el) {
					//console.log('RADIOOOOOO',this);
					with (el = el.appendTag('div', { className: 'ainp row wrap ' + this.item.id + this.name })) {
						this.options = this.options || this.enum;
						for (var optionname in this.options) {
							var option = this.options[optionname];
							with (appendTag('span', { className: 'radiobtn' })) {
								var forID = this.item.id + this.name + optionname;
								console.log('SENDDDDDDD1111', this.operation);
								appendTag('input', {
									type: 'radio', item: this.item, className: forID, name: this.name, value: optionname, id: forID, checked: (optionname == this.value) ? 1 : 0, field: this, operation: this.operation, elProperty: el,
									onclick: !this.operation ? Aim.Element.onchange : function (event) {

										console.log('SENDDDDDDD', Aim.client.domain.id, this.item.id, this.name, this.value);

										var item = {
											id: this.item.id, schema: this.item.schema, typical: this.item.typical, operations: {}
										};
										item.operations[this.operation] = this.value.split(',');
										//Aim.wss.send({ to: [Aim.client.domain.id], value: [item] });
										//event.preventDefault();
										return false;
									}
								});
								with (appendTag('label', { attr: { for: forID } })) {
									with (appendTag('icon')) if (option.color) style.backgroundColor = option.color;
									appendTag('span', { innerText: option.title || option });
								}
							}
						}
						//with (appendTag('span', { className: 'radiobtn' })) {
						//	appendTag('input', { type: 'radio', name: this.name, value: '', id: this.name + 'clear', checked: (!this.value) ? 1 : 0, field: this, onchange: Aim.Element.onchange });
						//	with (appendTag('label', { attr: { for: this.name + 'clear' } })) {
						//		appendTag('icon').style.backgroundColor = '#ccc';
						//	}
						//}
					}
					return el;
				},
				createInput: function () {
					this.elEdit.className += ' fw';
					with (this.elInp = this.elEdit.appendTag('div', { className: 'ainp row wrap' })) {
						this.options = this.options || this.enum;
						for (var optionname in this.options) {
							var option = this.options[optionname];
							with (appendTag('span', { className: 'radiobtn' })) {
								appendTag('input', {
									type: 'radio', item: this.item, name: this.name, value: optionname, id: this.name + optionname, checked: (optionname == this.value) ? 1 : 0, onchange: Aim.Element.onchange
								});
								with (appendTag('label', { attr: { for: this.name + optionname } })) {
									with (appendTag('icon')) if (option.color) style.backgroundColor = option.color;
									appendTag('span', { innerText: option.title || option });
								}
							}
						}
						with (appendTag('span', { className: 'radiobtn' })) {
							appendTag('input', { type: 'radio', item: this.item, name: this.name, value: '', id: this.name + 'clear', checked: (!this.value) ? 1 : 0, onchange: Aim.Element.onchange });
							with (appendTag('label', { attr: { for: this.name + 'clear' } })) {
								appendTag('icon').style.backgroundColor = '#ccc';
							}
						}
					}
					//this.elEdit.appendTag('label', { innerText: this.placeholder });
				},
				createSpan: function (item) {
					//console.log('RADIO', this);
					this.elSpan = this.createRadio(this.elView);
					// if (this.operation) this.elSpan = this.createRadio(this.elView);
					// else this.elSpan = this.elView.appendTag('span', { className: 'aco pre wrap ' + this.item.id + this.name, type: this.type || '', titel: this.title, field: this, innerHTML: this.item.getAttribute(this.name, true) });
				},
			},
			meter: {
				createSpan: function (item) {
					this.elSpan = this.elView.appendTag('meter', { className: 'aco ' + this.name, titel: this.title, field: this, attr: this.attr, value: '' });
				},
			},
			check: {
				createInput: function () {
					this.elEdit.className += ' fw';
					var values = this.value.split(',');
					with (this.elInp = this.elEdit.appendTag('div', { className: 'ainp row wrap' })) {
						this.options = this.options || this.enum;
						for (var optionname in this.options) {
							var option = this.options[optionname];
							with (appendTag('span', { className: 'radiobtn check' })) {
								appendTag('input', {
									el: this.elInp, type: 'checkbox', id: this.name + optionname, value: optionname, checked: (values.indexOf(optionname) != -1) ? 1 : 0, onclick: function (event) {
										var c = this.elEdit.getElementsByTagName('input');
										var a = [];
										for (var i = 0, e; e = c[i]; i++) if (e.checked) a.push(e.value);
										this.elEdit.newvalue = a.join(',');
									}
								});
								with (appendTag('label', { attr: { for: this.name + optionname } })) {
									appendTag('icon').style.backgroundColor = option.color;
									appendTag('span', { innerText: option.title });
								}
							}
						}
					}
					//this.elEdit.appendTag('label', { innerText: this.placeholder });
				}
			},
			select: {
				createInput: function () {
					with (this.elInp = this.elEdit.appendTag('select', { className: 'ainp row aco', item: this.item, name: this.name, onchange: Aim.Element.onchange })) {
						if (Object.prototype.toString.call(this.options) === '[object Array]') {
							for (var i = 0, optionvalue; optionvalue = this.options[i]; i++)
								appendTag('option', { value: optionvalue, innerText: optionvalue });
						}
						else for (var optionname in this.options) {
							var option = this.options[optionname];
							appendTag('option', { value: optionname, innerText: option.title || option });
						}
						//this.elInp.value = 'pe';
						//console.log();
						this.elInp.value = this.value;
					}
				}
			},
			selectitem: {
				createInput: function () {
					with (this.elEdit) {
						className += ' search';
						console.log('selectitem', this, this.name);
						Object.assign(this.elInp = this.elEdit.appendTag('input', this), {
							className: 'ainp aco',
							//type: this.type || '',
							placeholder: ' ',
							//titel: this.title,
							//field: this,
							//name: this.name,
							schema: String(this.schema).split(';').shift(),
							post: {
								exec: 'itemItemsGet', id: ';' + this.schema
							},
							onchange: Aim.Element.onchange,

						}, Aim.Element.Pulldown);
						//this.elInp.onfocus = Aim.Element.Pulldown.onfocus;
						//this.elInp.parentElement.className += ' search';
						//Object.assign(this.elInp, this, Aim.Element.Pulldown);
					}
				}
			},
			checklist: {
				createInput: function () {
					with (this.elInp = this.elEdit.appendTag('select', {})) {
						for (var optionname in this.options) {
							appendTag('option', { value: optionname, innerText: this.options[optionname].title || optionname });
						}
					}
				},
			},
			address: {
				createInput: function () {
					with (this.elEdit) {
						this.elInp = appendTag('input', { className: 'ainp' }, { placeholder: "" });
						//appendTag('label', { innerText: "Voer hier het adres in" });
						var addressField = this;
						var fields = [
							{
								Street: {}, Number: {}, Add: {}
							},
							{
								PostalCode: {}, City: {}
							},
							{ Town: {}, State: {}, Country: {} },
						]
						fields.forEach(function (row) {
							with (this.elEdit.appendTag('div', { className: 'row wrap' })) {
								for (var name in row) {
									//var field = new Aim.attribute(this.item, this.name + name);
									//console.log(field);
									with (appendTag('span', { className: 'field' })) {
										addressField[name] = appendTag('input', {
											className: 'ainp', placeholder: '',
											//field: new Aim.attribute(this.item, this.name + name),
											onchange: Aim.Element.onchange
										});
										appendTag('label', { innerText: name });
									}
								}
							}
						}, this);
						//with (appendTag('div', { className: 'row wrap' })) {
						//	addressField.Street = appendTag('input',{ placeholder: 'Straat' });
						//	addressField.Number = appendTag('input', { placeholder: 'Nr', w: 50 });
						//	addressField.Add = appendTag('input', { placeholder: 'Add', w: 50 });
						//}
						//with (appendTag('div', { className: 'row wrap' })) {
						//	addressField.PostalCode = appendTag('input', { placeholder: 'PostalCode', w: 100 }); //appendTag('input', { className: 'ainp PostalCode', placeholder: 'Postcode' });
						//	addressField.City = appendTag('input', { placeholder: 'City' }); //appendTag('input', { className: 'ainp City aco', placeholder: 'Plaats' });
						//}
						//with (appendTag('div', { className: 'row wrap' })) {
						//	addressField.Town = appendTag('input', { placeholder: 'Town' }); //appendTag('input', { className: 'ainp Town', placeholder: 'Gemeente' });
						//	addressField.State = appendTag('input', { placeholder: 'State' }); //appendTag('input', { className: 'ainp State', placeholder: 'Provincie' });
						//	addressField.Country = appendTag('input', { placeholder: 'Country' }); //appendTag('input', { className: 'ainp Country aco', placeholder: 'Land' });
						//}
						addressField.autocomplete = new google.maps.places.Autocomplete(this.elInp, { types: ['geocode'] });
						this.elInp.placeholder = ' ';
						addressField.autocomplete.address = addressField;
						this.elInp.onkeydown = function (event) {
							if (event.key == 'Enter') { event.stopPropagation(); event.preventDefault(); }
						}
						addressField.autocomplete.addListener('place_changed', function (event) {
							var place = this.getPlace();
							this.properties = {
							};
							var adrescomp = {
							};
							if (place.address_components) for (var i = 0, comp; comp = place.address_components[i]; i++) {
								for (var j = 0, compname; compname = comp.types[j]; j++) {
									adrescomp[compname] = comp.long_name;
								}
							}
							console.log('GEO', this, this.address.location);

							//this.geolocatie = [place.geometry.location.lat(), place.geometry.location.lng()].join(',');
							var fields = {
								Street: adrescomp.route || adrescomp.sublocality_level_2 || adrescomp.sublocality,
								Number: adrescomp.street_number,
								PostalCode: adrescomp.postal_code,
								City: adrescomp.locality,
								Town: adrescomp.administrative_area_level_2 != adrescomp.locality ? adrescomp.administrative_area_level_2 : null,
								State: adrescomp.administrative_area_level_1,
								Country: adrescomp.country,
							}
							//console.log(fields);
							//for (var name in fields) this.address[name].field.value = this.address[name].value = fields.name || this.address[name].field.value;
							for (var name in fields) this.address[name].field.value = this.address[name].value = fields.name || this.address[name].field.value;
							if (this.address.location) {
								this.address.item.setAttribute('location', [place.geometry.location.lat(), place.geometry.location.lng()].join(','));
							}


							//this.address.Street.field.value = adrescomp.route || adrescomp.sublocality_level_2 || adrescomp.sublocality || this.address.Street.value;
							//this.address.Number.field.value = adrescomp.street_number || this.address.Number.field.value;
							//this.address.PostalCode.field.value = adrescomp.postal_code || this.address.PostalCode.field.value;
							//this.address.City.field.value = adrescomp.locality || this.address.City.field.value;
							//if (adrescomp.administrative_area_level_2 != adrescomp.locality) this.address.Town.field.value = adrescomp.administrative_area_level_2 || this.address.Town.field.value;
							//this.address.State.field.value = adrescomp.administrative_area_level_1 || this.address.State.field.value;
							//this.address.Country.field.value = adrescomp.country || this.address.Country.field.value;
							//if (this.address.location && this.address.parent[this.address.location] && this.address.parent[this.address.location].elInp) {
							//	this.address.parent[this.address.location].elInp.value = [place.geometry.location.lat(), place.geometry.location.lng()].join(',');
							//}
						});
						this.elInp = addressField[this.addressField];
					}
				},
			},
			textarea: {
				createInput: function () {
					this.elEdit.className = 'field col fw';
					this.elInp = this.elEdit.appendTag('textarea', { className: 'ainp', value: this.value, item: this.item, name: this.name, titel: this.title, placeholder: " ", onchange: Aim.Element.onchange });
					//this.elEdit.appendTag('label', { innerText: this.placeholder });
					this.elInp.onkeyup = function (event) {
						//if (this.offsetHeight < 300) {
						this.style.height = '0px';
						//this.style.height = Math.min(this.scrollHeight + 20, 300) + 'px';
						//console.log(this.scrollHeight);
						this.style.height = (this.scrollHeight + 24) + 'px';
						//}
					}
					this.elInp.onkeyup();
					//setTimeout(function (el) { this.elEdit.onkeyup(); }, 100, this.elInp);
				},
			},
			json: {
				createInput: function () {
					this.elEdit.className = 'field col fw';
					this.elInp = this.elEdit.appendTag('code').appendTag('textarea', { className: 'ainp oa', style: 'white-space:nowrap;', value: editor.json(this.value) });
					this.elInp.addEventListener('change', function () { try { JSON.parse(this.value, true) } catch (err) { alert('JSON format niet in orde;'); } });
					this.elEdit.appendTag('label', { innerText: this.placeholder });
					this.elInp.onkeyup = function (event) {
						if (this.style.height < 300) {
							this.style.height = 'auto';
							this.style.height = Math.min(this.scrollHeight + 20, 300) + 'px';
						}
					}
					setTimeout(function (el) { this.elEdit.onkeyup(); }, 100, this.elInp);
				},
			},
			div: {
				createInput: function () {
					this.elEdit.className = 'field col fw';
					this.elInp = this.elEdit.appendTag('div', { className: 'ainp doc-content', innerHTML: this.value, item: this.item, name: this.name, titel: this.title, placeholder: " ", onblur: Aim.Element.onchange, attr: { contenteditable: '' } });
					document.getElementById('ckeTop').innerText = '';
					//this.elInp.addEventListener('keydown', function (event) {
					//	if (event.key == "Enter") {
					//		sel = window.getSelection();
					//		range = sel.getRangeAt(0);
					//		range.deleteContents();
					//		range.insertNode(el=document.createTextNode("\r\n"));
					//		range.setStartAfter(el);
					//		sel.removeAllRanges();
					//		sel.addRange(range);

					//		console.log(event, this, sel);
					//		event.preventDefault();
					//		event.stopPropagation();
					//	}
					//}, true)
					CKEDITOR.inline(this.elInp, {
						////removePlugins: 'maximize,resize',
						extraPlugins: 'sharedspace', sharedSpaces: {
							top: 'ckeTop'
						}, on: {
							focus: function () {
								OM.elEdit.insertBefore(document.getElementById('ckeTop'), items.elEditBtnBar);
								document.getElementById('ckeTop').style = "position:absolute;margin:auto;left:0;right:0;z-index:100;";
							},
							blur: function (event) {
								document.body.appendChild(document.getElementById('ckeTop'));
								document.getElementById('ckeTop').style = "display:none;";
							},
							//keydown: function (event) {
							//	console.log(event);
							//}
						}
					});
				},
			},
			checkbox: {
				createInput: function () {
					this.elEdit.className = 'field col fw';
					with (this.elEdit.appendTag('span', { className: 'radiobtn' })) {
						this.elInp = appendTag('input', { type: 'checkbox', name: this.name, id: this.name + 'clear', checked: (this.value) ? 1 : 0 });
						with (appendTag('label', { attr: { for: this.name + 'clear' } })) {
							appendTag('icon').style.backgroundColor = '#ccc';
							appendTag('span', { innerText: this.title });
						}
					}
				},
			},
			file: {
				createInput: function () {
				},
			},
			date: {
				createInput: function () {
					this.elInp = this.elEdit.appendTag('input', { className: 'ainp aco', type: this.type || '', placeholder: '', titel: this.title, value: String(this.value).substr(0, 10), field: this, onchange: Aim.Element.onchange });
				},
			},
			email: {
			},
			tel: {
			},
			url: {
			},
			linkedin: {
			},
			skype: {
			},
			html: {
			},
		},
		//createInput: function () {
		//	this.elInp = this.elEdit.appendTag('input', { className: 'ainp aco ' + this.name, type: this.type || '', placeholder: '', titel: this.title, field: this, onchange: Aim.Element.onchange });
		//},
		//createSpan: function (item) {
		//	if (this.itemID) {
		//		this.elSpan = this.elView.appendTag('a', { schema: this.schema || 'item', itemID: this.itemID, innerHTML: this.value });
		//	}
		//	else {
		//		var value = this.displayvalue, defaultvalue = this.defaultvalue, mastervalue = this.mastervalue,
		//			className = 'aco pre wrap ' + this.item.id + this.name;
		//		if (mastervalue) className += ' master';
		//		if (defaultvalue) className += ' default';
		//		if (value && (defaultvalue || mastervalue)) {
		//			className += ' modified';
		//			if (value != (defaultvalue || mastervalue)) className += ' changed';
		//		}
		//		this.elSpan = this.elView.appendTag('span', {
		//			className: className,
		//			type: this.type || '',
		//			titel: this.title,
		//			field: this,
		//			innerHTML: value || defaultvalue || mastervalue || value,
		//			title: (value && value != (defaultvalue || mastervalue)) ? (defaultvalue || mastervalue) : '',
		//		});
		//	}
		//},
		//createEdit: function () {
		//	with (this.elEdit = document.body.appendTag('div', { className: 'row field ' + (this.type || 'text') })) {
		//		if (this.hidden) setAttribute('hidden', '');
		//		if (this.checkvisible && this.item) { this.elEdit.className += ' checkvisible'; this.elEdit.checkvisible = this.checkvisible.bind(this.item); }
		//		this.createInput(this);
		//		appendTag('label', { innerText: this.placeholder });
		//	}
		//	return this.elEdit;
		//},
		//createView: function () {
		//	with (this.elView = document.body.appendTag('div', { className: 'row prop ' + (this.type || 'text') })) {
		//		appendTag('label', { innerText: this.placeholder });
		//		this.createSpan(this);
		//	}
		//	return this.elView;
		//},
		//properties: {
		//	//itemID: {
		//	//	get: function () {
		//	//		return this.item.values && this.item.values[this.name] ? this.item.values[this.name].itemID : null;
		//	//	},
		//	//	set: function (value) {
		//	//		this.item.values = this.item.values || {};
		//	//		this.item.values[this.name] = this.item.values[this.name] || {};
		//	//		this.item.values[this.name].itemID = value;
		//	//	},
		//	//},
		//	//displayvalue: { get: function () { return this.item.getAttribute(this.name); }, },
		//	//defaultvalue: { get: function () { return this.item.getAttributeDefault(this.name); }, },
		//	//mastervalue: { get: function () { return this.item.getAttributeMaster(this.name); }, },




		//	//value: {
		//	//	get: function () {
		//	//		return this.item.getAttribute(this.name);
		//	//	},
		//	//	set: function (value) {
		//	//		if (typeof value == 'object' || Array.isArray(value)) return;
		//	//		//if ()
		//	//		//console.log('aaaaaaaaaaaaaaaa', this.item.getAttribute(this.name), value);
		//	//		if (this.item.getAttribute(this.name) != value) this.item.setAttribute(this.name, value);
		//	//	},
		//	//}
		//},
		//get: function (id, name) {
		//	var value = !api.items[id] ? '' : api.items[id].values && (name in api.items[id].values) ? api.items[id].values[name].title || api.items[id].values[name].value || api.items[id].values[name] || '' : '';
		//	console.log('get', id, name, value);
		//	return value;
		//},
	},
	functionSend: function () {
		if (this.arguments) {
			for (var i = 0, l = Math.max(arguments.length, this.arguments.length) ; i < arguments.length; i++) if (this.arguments[i] != arguments[i]) break;
			if (i >= l) return;
		}
		this.arguments = Array.prototype.slice.call(arguments);
		console.log('SEND TO DEVICE', this.id, this.schema, this.typical, this.functionname, this.arguments);
		//this.item[this.functionname].el.setAttribute('modifiedDT', Date.stamp());
		//this.item[this.functionname].el.innerText = this.arguments;
		var item = {
			id: this.id, schema: this.schema, typical: this.typical, operations: {}
		};
		item.operations[this.functionname] = this.arguments;
		Aim.wss.send({ to: [Aim.client.domain.id], value: [item] });
	},
	statemodelEval: function () {
		console.log('statemodelEval', this.statemodel);
		if (!this.statemodel) return;
		//this.istatemodel = this.istatemodel || 0;
		//this.istatemodel++;
		//console.log('statemodelEval', this.istatemodel);
		//this.istatemodel++;
		//console.log('statemodelEval', this.istatemodel);
		//if (this.istatemodel++ > 50) {
		////	console.log('MAX STATE ITTERATION');
		////	return;
		//}
		//console.log('state eval', this.state, this);
		for (var name in this.statemodel) {
			if (!this.state) return this.statemodelSet(name);
			//this.state = this.state || name;
			var state = this.statemodel[name];
			if (this.statemodel[name].trigger && this.statemodel[name].trigger[this.state] && this.statemodel[name].trigger[this.state].call(this))
				return this.statemodelSet(name);
		}
		if (this.statemodel[this.state].do) this.statemodel[this.state].do.call(this);
	},
	proxyItems: function (dataItems) {
		addref = function (item, ref) {
			if (Array.isArray(item[ref.typical])) { if (item[ref.typical].indexOf(ref) == -1) item[ref.typical].push(ref); }
			else if (item[ref.typical]) { if (item[ref.typical] != ref) item[ref.typical] = [item[ref.typical], ref]; }
			else item[ref.typical] = ref;
		}

		var proxyItems = [];
		//var def = EM.def[Aim.app];

		//if (def.init) this.data.value.forEach(def.init);

		dataItems.forEach(function (item) {
			//if ('selected' in item && item.selected == 0) return;
			item.linkAll = [];

			for (var name in item.operations)
				item[name] = ((item[item.operations[name].stereotype] = item[item.operations[name].stereotype] || {})[name] = item.operations[name])[Aim.app] || Aim.functionSend.bind({ functionname: name, id: item.id, schema: item.schema, typical: item.typical, item: item });
			for (var name in item.properties)
				item[name] = item.properties[name].type == "array" ? [] : item.properties[name].initvalue ? item.properties[name].initvalue : item[name];

			Object.assign(item, {
				statemodelSet: function (name) {
					console.log('set state', this.state, name);
					if (this.state == name) return;
					if (this.statemodel[this.state] && this.statemodel[this.state].exit) this.statemodel[this.state].exit.call(this);
					//if (!this.statemodel[name]) throw 'state does not exists: '+name;
					if (this.statemodel[name].entry) this.statemodel[name].entry.call(this);
					this.state = name;
					if (this.el && this.el.state) this.el.state.value = this.state;
				},
				statemodelEval: Aim.statemodelEval,
				timerSet: function (ms) {
					this.timerPassed = false;
					clearTimeout(this.to);
					this.to = setTimeout(function () {
						this.timerPassed = true;
						this.statemodelEval();
						this.timerPassed = false;
					}.bind(this), ms);
				},
			});
			api.item[item.id] = proxyItems[item.id] = Aim.itemProxy ? new Proxy(item, Aim.itemProxy) : item;
		});
		proxyItems.forEach(function (item) {
			//if ('selected' in item && item.selected == 0) return;
			//add all children to master.linkAll
			(function addToMaster(master) {
				if (!master || !master.linkAll) return;
				master.linkAll.push(this);
				addToMaster.call(this, master.master);
			}).call(item, item.master)
			//add all linkto to master.linkAll
			if (item.linkto) for (var id in item.linkto) if (item.linkto[id] == 'Link') {
				(function addToMaster(linkitem) {
					if (!this.linkAll) return;
					this.linkAll.push(linkitem);
					linkitem.children.forEach(addToMaster.bind(this));
				}).call(item, api.item[id]);
				console.log('Link', item);
			}
		});
		//add all linkAll as typical and schema, add all softwarefunctions to child software functions
		proxyItems.forEach(function (master) {
			//if ('selected' in master && master.selected == 0) return;
			master.linkAll.forEach(function (item) {
				if (!Number(item.id)) return;
				console.log(item.id, item, api.item[item.id]);
				item = api.item[item.id];
				if (!item.typical) return;
				addref(master, item);
				//if (Array.isArray(master[item.typical])) master[item.typical].push(item);
				//else if (master[item.typical]) master[item.typical] = [master[item.typical], item];
				//else master[item.typical] = item;
			})
			master.children.sort(function (a, b) { return a.idx > b.idx ? 1 : (a.idx < b.idx ? -1 : 0) });
			master.children.forEach(function (child) {
				child = api.item[child.id];
				if (Array.isArray(master[child.schema])) master[child.schema].push(child);
				else master[child.schema] = [child];

				(function drillsoftwarefunctions(child) {
					if (!Number(child.id)) return;
					child = api.item[child.id];
					if (child.schema == 'softwarefunction') {
						master.linkAll.forEach(function (item) {
							if (item.schema != 'softwarefunction' || !item.typical || item.master.id == child.id || item.id == child.id) return;
							addref(child, item);
							addref(item, child);
							//if (Array.isArray(child[item.typical])) child[item.typical].push(item); else if (child[item.typical]) child[item.typical] = [child[item.typical], item]; else child[item.typical] = item;
							//if (Array.isArray(item[child.typical])) item[child.typical].push(child); else if (item[child.typical]) item[child.typical] = [item[child.typical], child]; else item[child.typical] = child;
						})
						child.children.forEach(drillsoftwarefunctions);
					}
				})(child)
			})
		});
		return proxyItems;
	},
	requestfordata: function (par) {
		win = window.open('/auth/?prompt=login&client=' + Aim.client.client.id + '&scope=' + par.scope, 'requestfordata', 'width=600,height=800');
		//win = window.open('', 'requestfordata', 'width=600,height=800');

		//win.document.body.innerHTML = "HTML";

		//win.beforeunload = function () {
		//	console.log('LOADED', this);
		//	//if (document.getElementById('aimStatusMsg')) document.getElementById('aimStatusMsg').innerText = 'Window is geopend';
		//};
		//win.document.load = function () {
		//	console.log('LOADED', this);
		//	//if (document.getElementById('aimStatusMsg')) document.getElementById('aimStatusMsg').innerText = 'Window is geopend';
		//};
		if (document.getElementById('aimStatusMsg')) document.getElementById('aimStatusMsg').innerText = 'Login wordt geopend';
		//Aim.openwindows[this.url] = window.open(this.url, this.url, 'width=600,height=800,left=' + (event.screenX || 0) + ',top=' + (event.screenY || 0));
		//Aim.openwindows[this.url].name = this.url;
		//Aim.openwindows[this.url].onbeforeunload = function () { Aim.openwindows[this.name] = null };

	},
	createElement: function (par) {
		if (!par) throw 'no par';
		//console.log(par.tag);
		var tag = par.tag = par.tag || 'div', el = document.createElement(tag);
		if (tag == 'a' && par.itemID) Aim.Element.popup(el);
		if (tag == 'a' && par.get) par.href = '#?' + Aim.URL.stringify(par.get);
		if ('send' in par) par.onclick = par.onclick || function () {
			Aim.wss.send(this.send);
		};
		if ('open' in par) {
			(par.attr = par.attr || {}).open = par.open;
			par.onclick = par.onclick || Aim.Element.onclick;
		}

		if (par.event = par.event || par.on) for (var name in par.event) el.addEventListener(name, par.event[name]);
		delete par.event;
		if (par.attr) for (var name in par.attr) if (name && par.attr[name] != undefined) el.setAttribute(name, par.attr[name]);
		delete par.attr;
		for (var name in par) {
			try { el[name] = par[name]; } catch (err) { }
		}
		if (el.contextmenu && Aim.showcontextmenu) el.oncontextmenu = Aim.popup.show;
		if (el.rewrite) el.rewrite();
		if (el.popupmenu) {
			el.onclick = Aim.popup.show;
			el.appendTag('i', { className: 'ico-down' });
		}
		return el;
	},
	window: {
		Date: {
			maand: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
			stamp: function () {
				return new Date().toISOString().replace(/T|Z/g, ' ');
			},
			prototype: {
				monthDays: function () {
					var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
					return d.getDate();
				},
				getMaand: function () {
					return Date.maand[this.getMonth()];
				},
				getWeek: function () {
					var d = new Date(+this);
					d.setHours(0, 0, 0, 0);
					d.setDate(d.getDate() + 4 - (d.getDay() || 7));
					return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
				},
				getWeekday: function () {
					return (this.getDay() + 6) % 7;
				},
				toDateText: function (full) {
					var res = '';
					if (this) {
						var tToday = date.localdate();
						var dagen = (this.getTime() - tToday.getTime()) / 24 / 60 / 60 / 1000;
						var res = (!dagen ? 'Vandaag' : dagen == -1 ? 'Gisteren' : day[this.getDay()]) + ' ' + this.getDate() + ' ' + this.getMaand() + ' ' + this.getFullYear() + ', week ' + this.getWeek();
						//var t = this.toLocaleTimeString().substr(0, 5);
						//if (t != '00:00') res += ' ' + t;
					}
					return res;
				},
				toDateTimeText: function (full) {
					var res = this.toDateText();
					if (this.getHours() || this.getMinutes()) res += this.toLocaleTimeString().substr(0, 5);
				},
				toLocal: function () {
					this.setTime(this.getTime() - this.getTimezoneOffset() * 60 * 1000);
					return this;
				},
				toWeekDay: function () {
					return this.getFullYear() + '-' + this.getWeek() + ' ' + day[this.getDay()];
				},
				toString: function () {
					//return this.getDate() + ' ' + month[this.getMonth()] + ', ' + this.getFullYear();
				},
				toDateTimeStr: function (length) {
					//    return this.getDate().pad(2) + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getFullYear() + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
					var s = this.getFullYear() + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getDate().pad(2);
					if (this.getHours() != 0 && this.getMinutes() != 0 && this.getSeconds() != 0)
						s += ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2); + '.' + this.getMilliseconds().pad(3);
					return s.substring(0, length);
				},
				toDateTimeStringT: function () {
					//    return this.getDate().pad(2) + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getFullYear() + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
					return this.getFullYear() + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getDate().pad(2) + 'T' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
				},
				toShortStr: function () {
					return this.getDate().pad(2) + '-' + (this.getMonth() + 1).pad(2) + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2);
				},
				toLocalDBString: function () {
					this.setTime(this.getTime() - this.getTimezoneOffset() * 60 * 1000);
					return this.toISOString().replace(/T|Z/g, ' ');
				},
			}
		},
		Number: {
			prototype: {
				formatMoney: function (c, d, t) {
					var n = this,
							c = isNaN(c = Math.abs(c)) ? 2 : c,
							d = d == undefined ? "," : d,
							t = t == undefined ? "." : t,
							s = n < 0 ? "-" : "",
							i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
							j = (j = i.length) > 3 ? j % 3 : 0;
					return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
				},
				pad: function (size) {
					var s = String(this);
					while (s.length < (size || 2)) {
						s = "0" + s;
					}
					return s;
				},

			}
		},
		String: {
			prototype: {
				capitalize: function () {
					return this.charAt(0).toUpperCase() + this.slice(1);
				}
			}
		},
		Element: {
			prototype: {
				appendPar: function (par) {
					return this.appendChild(Aim.createElement(par));
				},
				appendTag: function (tag, par) {
					(par = par || {}).tag = tag;
					return this.appendPar(par);
				},
				appendTags: function (a) {
					for (var i = 0, child; child = a[i]; i++) {
						var ele = this.appendTag(child.tag || 'div', child);
						if (child.children) ele.appendTags(child.children);
					}
				},
				attrToggle: function (name) {
					if (this.getAttribute(name) != '') this.setAttribute(name, ''); else this.removeAttribute(name);
				},
				appendText: function (s) {
					this.appendChild(document.createTextNode(s));
					return this;
				},
				bringtofront: function () {
					this.parentElement.appendChild(this);
				},
				attrToggle: function (name) {
					if (this.getAttribute(name) != '') this.setAttribute(name, ''); else this.removeAttribute(name);
				},
			}
		},
		Object: {
			forEach: function (obj, fn) {
				if (!obj) return;
				var i = 0;
				for (var name in obj) {
					if (fn.apply(this, [obj[name], name, i++]) == false) return;
				}
			},
			forEachSorted: function (obj, fn) {
				if (!obj) return;
				var a = [], i = 0;
				for (var name in obj) a.push({ name: name, obj: obj[name], index: i++ });
				a.sort(function (a, b) { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0; });
				a.forEach(function (row, i) { fn.apply(this, [row.obj, row.name, row.index, i]); });
			},
		}
	},
	loadevents: [],
	createButtonbar: function (el, buttons) {
		el.className = "row top btnbar np";
		//console.log(el,buttons);
		for (var name in buttons) if (Object.values(buttons[name]).length && !buttons[name].hidden) buttons[name].el = el.appendTag('button', Object.assign({ onclick: Aim.Element.onclick }, buttons[name], { className: name + ' abtn icn ' + (buttons[name].className || '') }));
	},
	cache: {
	},
	get: function (row) {
		row = typeof row == 'object' ? row : {
			id: row
		};
		//var item = api.item[row.id] || api.onload(row);
		//if (item.schema && !item.values) {
		//	item.values={};
		//	Aim.load({
		//		api: item.schema, get: { id: item.id, src: 1, master: 1, users: 1, select: '*' }, onload: function () {
		//			console.log('LOADED');
		//		}
		//	});
		//}
		return api.item[row.id] || api.onload(row);
		//var item = api.item[row.id] = api.item[row.id] || Object.assign(Object.create(row, api.definitions.item.propertiesObject), api.definitions.item).create();
		//item.refresh(row);
		//return data ? data[i] = item : item;
	},
	statusbar: {
		message: function (message) {
			//console.log("new", message);
			if (!document.body) return;
			if (Aim.statusbar && !Aim.statusbar.container) Aim.statusbar.container = document.body.appendTag('div', { className: 'statusbar' });
			return Aim.statusbar.container.appendTag('span', { innerText: message, remove: function (event) { if (this.parentElement) this.parentElement.removeChild(this); } });
		},
		//consoleMessage: function () {
		//	var argumentsList = Array.prototype.slice.call(arguments);
		//	console.log.apply(this,argumentsList);
		//	return Aim.statusbar.appendMessage(argumentsList.join(" "));
		//},
		//removeMessage: function (el) {
		//	if (Aim.statusbar.elementMessage) Aim.statusbar.elementMessage.removeChild(el);
		//},
	},
	load: function (par) {
		//if (par.asrc) par.src = par.asrc;
		//else
		//console.log(par.get);
		//console.log('LOAD',par.src,par.api,apiorigin);
		//par.src = par.src ? ( (par.src.substr(0, 4) == 'http' || par.src[0] != '/') ? par.src : Aim.origin + par.src) : (par.api && par.api.indexOf('://') != -1 ? par.api : (par.get && par.get.origin ? par.get.origin : [Aim.origin, Aim.client.domain.name, Aim.version, 'api', par.api || ''].join('/')));
		//par.src = par.src ? ( (par.src.substr(0, 4) == 'http' || par.src[0] != '/') ? par.src : apiorigin + par.src) : (par.api && par.api.indexOf('://') != -1 ? par.api : (par.get && par.get.origin ? par.get.origin : [Aim.origin, Aim.client.domain.name, Aim.version, 'api', par.api || ''].join('/')));
		var src = par.src ? (par.src[0] == '/' ? apiorigin : "") + par.src : (apiorigin + "/" + Aim.client.domain.name + "/" + Aim.version + "/api/" + (par.api || ''));
		//console.log('qqqq',Aim.client.domain.name,Aim.version);
		//console.log('LOAD',par.src,par.api);
		//console.log('Aim.load', Aim.version, par.src, par, Aim.origin, Aim.client.domain.name, Aim.client.domain.name1);
		if (par.cache && Aim.cache[par.api]) {
			par.data = Aim.cache[par.api]; return par.onload ? par.onload.call(par) : null;
		}
		if (!src) throw "no src";
		par.put = par.put || par.data || par.input;
		var formdata = par.put ? JSON.stringify(par.put) : par.post ? new FormData() : null;
		for (var name in par.post) formdata.append(name, par.post[name] || '');
		if (this.err) this.err.innerText = '';
		if (this.msg) this.msg.innerText = '';



		var src = encodeURI(src + (par.get ? '?' + Aim.URL.stringify(par.get) : ''));
		//console.log('ggggggg', src, par.get, document.location);
		var xhr = new XMLHttpRequest();
		xhr.par = par;
		xhr.caller = arguments.callee.caller;
		if (document.getElementById("loadlog")) {
			xhr.elLoadlog = document.getElementById("loadlog").appendTag("div");
			xhr.elLoadlog.appendTag('span', { innerText: par.title });
			xhr.elLoadlog.appendTag('span', { innerText: new Date().toLocaleString() });
		}
		if (src[0] == ':') src = 'http' + src;
		xhr.open(par.method ? par.method : par.put ? 'put' : par.post ? 'post' : 'get', xhr.src = src, true);


		//xhr.withCredentials = true;


		if (par.header) for (var name in par.header) xhr.setRequestHeader(name, par.header[name]);
		//xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//xhr.setRequestHeader("User-Agent", "Aliconnect/ObjectManager");
		xhr.setRequestHeader("Authorization", "Bearer " + Aim.access_token);
		//xhr.setRequestHeader("Accept", "application/json");
		//xhr.setRequestHeader("client-request-id", Aim.makeGuid());
		//xhr.setRequestHeader("return-client-request-id", true);
		//xhr.setRequestHeader("X-AnchorMailbox", Aim.user.email);
		//if (par.method == 'POST') {
		//	xhr.setRequestHeader("Content-Type", 'application/json');
		//}
		//if (par.method == 'PATCH') {
		//	xhr.setRequestHeader("Content-Type", 'application/json');
		//}
		//if (par.put || document.location.origin == 'file://') xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		//xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		//xhr.setRequestHeader('Content-type', 'text/xml');
		//collist.innerText=par.src;
		//if (document.body && document.body.getAttribute) document.body.setAttribute('wait', xhr.wait = Number(document.body.getAttribute('wait')) + 1);
		//for (var name in par) if (par[name]) xhr[name] = par[name];
		xhr.elSbMsg = new Aim.statusbar.message(src.split('?').shift());
		if (par.get) {
			if (par.get.folder && window.collist) window.collist.setAttribute('wait', xhr.waitfolder = Number(window.collist.getAttribute('wait')) + 1);
			if (par.get.id && window.colpage) window.colpage.setAttribute('wait', xhr.waitpage = Number(window.colpage.getAttribute('wait')) + 1);
		};
		//console.log('Aim.load', xhr.src);
		xhr.addEventListener('load', function (event) {


			if (this.elLoadlog) this.elLoadlog.appendTag('span', { innerText: new Date().toLocaleString() });
			if (this.waitfolder) window.collist.setAttribute('wait', Number(window.collist.getAttribute('wait')) - 1);
			if (this.waitpage) window.colpage.setAttribute('wait', Number(window.colpage.getAttribute('wait')) - 1);
			if (this.elSbMsg) xhr.elSbMsg.remove();// Aim.statusbar.removeMessage(this.elSbMsg);
			if (this.responseText) {
				//collist.innerText=par.src;
				//console.log(this.responseText);
				event.par = this.par;
				if (['{', '[', '"'].indexOf(String(this.responseText).trim()[0]) != -1) {
					try {
						event.data = this.data = JSON.parse(this.responseText, true);
						Aim.cache[this.api] = this.data;
						if (this.data.errors && this.sender.err) {
							this.sender.err.appendTag('p', { innerText: this.data.errors[0].message.replace(/\[.*?\]/g, '') }); console.log(this.data.errors);
						}
						if (this.sender && this.sender.msg) {
							if (this.data.message) this.sender.msg.appendTag('p', { innerText: this.data.message }); else this.sender.msg.innerText = '';
						}
						if (this.data.err) alert(this.data.err + Aim.client.user.id);
						//console.log('Loaded', this.src, this.data);
						//console.log('Loaded', this.src, this.get);
						//return;


						//else if (this.api && Object.prototype.toString.call(this.data) === '[object Object]') {
						//console.log('data', this.data);
						//if (this.data.value)
						var value = this.data.value || [this.data];
						value.get = this.get;
						value.forEach(api.onload);
					} catch (err) {
						console.log('Load.err', this.src, this.getAllResponseHeaders(), this.caller, this.responseText);
					}
					//if (this.data.value && this.data.value.forEach) {
					//	this.data.value.get = this.get;
					//	this.data.value.forEach(api.onload);
					//}
					//console.log('LOAD', this.src, this.data, this.responseText);
					//else Aim.merge({ api: this.data });
					//}
					//console.log('Loaded', this.src, this.data);
				}
				else if (this.responseText[0] != "<") console.log(this.src, this.responseText, this.caller);
			}
		});
		Object.assign(xhr, par);
		xhr.sender = this;
		var path = xhr.src.split('//').pop().split('?').shift().split('/');
		path.shift(); path.shift(); path.shift();
		xhr.schema = path.shift();
		xhr.id = path.shift();
		if (!xhr.onload && api.definitions && api.definitions[xhr.schema]) {
			xhr.addEventListener('load', !isNaN(xhr.id) ? api.definitions[xhr.schema].onloadrow || App.onloadrow : api.definitions[xhr.schema].onloadrows || App.onloadrows);
		}
		//console.log(xhr.onload);
		//console.log('Load', xhr.src);
		//xhr.overrideMimeType("application/json");
		//console.log(formdata);

		//console.log('AAAAAAAAAAAAAAA',xhr.src);

		//return;
		xhr.send(formdata);
		return xhr;
	},
	loadscripts: function () {
		var src = this.scripts.shift();
		if (!src) return this.caller();
		console.log('loading', src);
		document.body.appendTag('script', { src: src, caller: this.caller || arguments.callee.caller, par: this.par, scripts: this.scripts, onload: Aim.loadscripts });
	},
	play: function (url) {
		return new Promise(function (resolve, reject) {   // return a promise
			var audio = new Audio(url);                     // create audio wo/ src
			audio.preload = "auto";                      // intend to play through
			audio.autoplay = true;                       // autoplay when loaded
			audio.onerror = reject;                      // on error, reject
			audio.onended = resolve;                     // when done, resolve
			//audio.src = url; // just for example
			console.log(audio);
		});
	},

	cssRuleAdd: function (selector, rules, index) {
		index = 0;
		Aim.stylesheet = Aim.stylesheet || document.head.appendTag('style').sheet;
		if ("insertRule" in Aim.stylesheet) Aim.stylesheet.insertRule(selector + "{" + rules + "}", index);
		else if ("addRule" in Aim.stylesheet) Aim.stylesheet.addRule(selector, rules, index);
	},
	appendHead: {
		css: function (sources, path) {
			for (var src; src = sources.shift() ;) { document.head.appendTag('link', { rel: 'stylesheet', href: path ? path + src + '.css' : src }); }
		},
		//js: function (sources, path) { sources.forEach(function (src) { document.head.appendTag('script', { type: 'text/javascript', charset: 'UTF-8', src: path ? path + src + '.js' : src, async: true, defer: true }); }) },
		js: function (sources, path) {
			for (var src; src = sources.shift() ;) { document.head.appendTag('script', { type: 'text/javascript', charset: 'UTF-8', src: path ? path + src + '.js' : src, defer: true }); }
		},
	},
	scripts: Object.assign([], {
		append: function (src) {
			this.push(src);
			if (!Aim.scripts.scr) this.load();
		},
		load: function () {
			while (Aim.scripts.scr = Aim.scripts.shift()) document.head.appendTag('script', { type: 'text/javascript', charset: 'UTF-8', src: Aim.scripts.scr, async: true, defer: true, onload: Aim.scripts.load });
		},
	}),
	//merge: function () {
	//	var sources = Array.prototype.slice.call(arguments), target = sources.shift(), objects = [];
	//	sources.forEach(function recurse(source) {
	//		if (objects.indexOf(source) != -1) return;
	//		objects.push(source);
	//		if (typeof source !== 'object') return source;
	//		for (var prop in source) {
	//			//if(prop=='values')console.log(prop);
	//			if (Object.prototype.toString.call(source[prop]) === '[object Object]') {
	//				if (!(prop in this)) this[prop] = source[prop]; else recurse.call(this[prop], source[prop]);
	//			}
	//			else {
	//				this[prop] = source[prop];
	//			}
	//		}
	//		return target;
	//	}, target);
	//	return target;
	//},
	//assign: Aim.assign = function (source) {
	//	Aim.merge(Aim, source);
	//	if (!('manual' in get)) if ('events' in source) for (var eventName in source.events) {
	//		if (eventName == 'load') Aim.loadevents.push(source.events[eventName]);//console.log('addevent',eventName);
	//		else window.addEventListener(eventName, source.events[eventName]);
	//	}
	//	// for (var prop in source) if (prop in window && window[prop] == source[prop]) {
	//	// 	if (!('manual' in get)) if ('events' in source[prop]) for (var eventName in source[prop].events) window.addEventListener(eventName, source[prop].events[eventName]);
	//	// 	Aim.merge(Aim, source[prop]);
	//	// }

	//	//for (var name in source) if (Aim[name]) Aim.merge(Aim[name], source[name]);
	//	//console.log('ADDDDDs', source, source.constructor.name);
	//	//for (var name in window) if (window[name] == source) console.log(name);

	//	//Aim.merge(Aim, source);
	//	//for (var name in source) {
	//	//window[name] = Aim[name];
	//	//}
	//},
	//setfocus: function (el) {
	//	//console.log('SETFOCUS', el.colName);
	//	if (el.colName) document.body.setAttribute('ca', el.colName);
	//	OM.colActive = el;
	//	OM.elColActive = el;
	//	OM.printdiv = el;
	//},

	//cookie: document.cookie ? '{"' + document.cookie.replace(/=/g, '":"').replace(/; /g, '","').replace(/\",/g, '",') + '"}' : {},

	//cookie: {
	//	set: function (name, value) {
	//		document.cookie = name + '=' + value;

	//	},
	//	get: function (name, defaultvalue) {
	//		//console.log(document.cookie);
	//		var acookie = (' ' + document.cookie).split(' ' + name + '=');
	//		return acookie.length == 2 ? acookie.pop().split(';').shift() : defaultvalue;
	//		//console.log('GET COOKIE', name, document.cookie.split(name + '=').pop().split(';').shift());
	//		//return document.cookie.split(name + '=').pop().split(';').shift();
	//		//console.log('GET COOKIE',name,document.cookie);
	//	}
	//},
	//stylesheet: (function () {visibility
	//	var style = document.createElement("style");
	//	style.appendChild(document.createTextNode(""));
	//	document.head.appendChild(style);
	//	return style.sheet;
	//})(),
	beforeLoad: function () {
		//console.log('beforeLoad', Aim.head);
		//if (Aim.head && Aim.head.css) Aim.appendHead.css(Aim.head.css);
		//if (Aim.head && Aim.head.js) Aim.scripts.append(Aim.head.js);
	},
	loadData: Object.assign([], {
		next: function () {
			if (this.par = this.shift()) return Aim.load(this.par);
			Aim.loadevents.forEach(function (fn) { fn(); });


			console.log('loadData', get.id, get.schema);


			//if (get.id && get.schema) Aim.URL.set({ id: get.id, schema: get.schema }, 2);
			//console.log('AAAAA', get.id, get.schema);
			//if (document.location.hash) Aim.nav(document.location.hash, 2);
		}
	}),
	//aliconnect: aliconnect,
	maps: {
		showonmap: function (href) {
			with (Listview.elOa) {
				innerText = '';
				this.mapel = appendTag('div', { className: 'googlemap', style: 'width:100%;height:100%;' });
				OM.map = new google.maps.Map(this.mapel, { zoom: 8 });
				bounds = new google.maps.LatLngBounds();
				geocoder = new google.maps.Geocoder();
				var address = decodeURI(href).split('/').pop();
				console.log(address);
				geocoder.geocode({
					'address': address
				}, function (results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						var marker = new google.maps.Marker({
							map: OM.map,
							position: results[0].geometry.location
						});
						bounds.extend(marker.getPosition());
						OM.map.fitBounds(bounds);
						google.maps.event.addListenerOnce(OM.map, 'bounds_changed', function () { this.setZoom(Math.min(10, this.getZoom())); });
					} else {
						console.log('Geocode was not successful for the following reason: ' + status);
					}
				});
			}
		},

		init: function () {
			//document.head.appendTag('script', { src: document.location.protocol+"//apis.google.com/js/platform.js", async: '', defer: '' });
			//document.head.appendTag('script', { src: document.location.protocol+"//maps.googleapis.com/maps/api/js?key=AIzaSyAKNir6jia2uSgmEoLFvrbcMztx-ao_Oys&libraries=places&callback=Aim.maps.init" });

			this.geocoder = new google.maps.Geocoder();
			this.latlng = new google.maps.LatLng(-34.397, 150.644);
			this.mapOptions = {
				zoom: 15,
				center: this.latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
		}
	},
	wss: {
		msgs: [],
		log: function () {
			//Array.prototype.slice.call(arguments)
			//var argumentsList = Array.prototype.slice.call(arguments);
			Aim.wss.elementStatus = Aim.wss.elementStatus || new Aim.statusbar.message("");
			var argumentsList = Array.prototype.slice.call(arguments);
			//if (!argumentsList.length) Aim.statusbar.removeMessage();
			Aim.wss.elementStatus.innerText = argumentsList.join(" ");
			//console.log.apply(this, argumentsList);
			//if (!('elMessengerLog' in Aim)) Aim.elMessengerLog = document.body.appendTag('div', { className: 'statusbar' });
			//Aim.elMessengerLog.innerText = msg;
			//console.log.call(this, Array.prototype.slice.call(arguments));
		},
		wss: {
			onopen: function (event) {
				Aim.wss.log("Websocket connected, send login", Aim.wss.url, Aim.client);
				console.log('Aim.wss.wss.onopen', Aim.client);
				Aim.wss.connected = true;
				Aim.wss.websocket.send(JSON.stringify({ access_token: Aim.access_token, login: Aim.client }));
				//if (Aim.on.onopen) Aim.on.onopen.forEach(function (fn) { fn.call(Aim.wss.websocket, event); });
			},
			onclose: function (event) {
				//Aim.wss.connected = false;
				window.dispatchEvent(newEvent('disconnect'));
				Aim.wss.log("Websocket close");
				console.log("Websocket close");
				//if (Aim.wss.sTo) clearTimeout(Aim.wss.sTo);
				Aim.wss.sTo = setTimeout(Aim.wss.connect, 5000);
				//Aim.on.onclose.forEach(function (fn) { fn.call(Aim.wss.websocket, event); });
			},
			onerror: function (event) {
				Aim.wss.log("Websocket error");
				console.log("Websocket error");
				//Aim.statusbar.appendMessage('Websocket error');
				//Aim.wss.log('Server Error');
				//console.log(event);
				window.dispatchEvent(newEvent('connecterror'));
				//Aim.on.onerror.forEach(function (fn) { fn.call(Aim.wss.websocket, event); });
			},
			onmessage: function (event) {
				var data = this.data = event.data[0] == '{' ? JSON.parse(event.data) : event.data;
				//console.log("Websocket connected");
				//console.log("Websocket message", data);
				if (this.data.access_token) {
					Aim.client = this.client = this.data.from;
					//console.log("wss client", Aim.client);
					window.dispatchEvent(Object.assign(newEvent('connect'), { data: this.data }));
					Aim.wss.sendbuf();
					return;
				}

				if (data.Notification) Aim.Notification.create(data.Notification);
				if (data.systemalert) Aim.Alert.appendAlert(data.systemalert);

				//console.log('WSS MESSAGE', this.data);
				if (this.data.value && Array.isArray(this.data.value)) this.data.value.forEach(function (row) {


					//if ([3562893, 3562891, 3562878, 3562876, 3549983].indexOf(row.id) != -1) { console.log('WSS MESAAGE CriticalFailure', row, row.values.CriticalFailure); }


					//TEST ATTR ALERT
					if (row.attr) {
						for (var i = 0, e, c = document.getElementsByClassName(row.id) ; e = c[i]; i++) {

							//Aim.Alert.appendAlert({ id: 1, condition: 1, title: 'TEMP HOOG', created: new Date().toISOString(), categorie: 'Alert', ack: 0 });

							if (row.attr) for (var name in row.attr) if (row.attr[name]) e.setAttribute(name, row.attr[name]); else e.removeAttribute(name);
							//if (row.attr) for (var name in row.attr) e.setAttribute(name, row.attr[name]); 
						}
					}
					//END TEST
					//return;

					if (!api.item[row.id]) return;
					if (row.values) {
						//console.log(row.values);
						//if (row.values.modifiedDT) console.log('modifiedDT', row.values.modifiedDT);
						//row.values.modifiedDT = new Date().toISOString();
						for (var attributeName in row.values) if (row.values[attributeName] != undefined) {

							//console.log('wss receive', row.id, attributeName, typeof row.values[attributeName], row.values[attributeName]);
							var value = typeof row.values[attributeName] == "object" ? row.values[attributeName].value : row.values[attributeName];

							//MKA
							//api.item[row.id].setAttribute(attributeName, value, {});


							if (api.item[row.id] && api.item[row.id].values && api.item[row.id].values[attributeName]) api.item[row.id].values[attributeName].value = value;
						}
						api.item[row.id].refreshAttributes();
					}
				});


				//Aim.on.onmessage.forEach(function (fn) { fn.call(Aim.wss.websocket, event, data); });
				event = newEvent('message');
				event.data = data;
				window.dispatchEvent(event);




				Aim.wss.elementStatus.remove();// = Aim.wss.log("");
				//return;

				//if (data.itemID && data.attributeName && ('value' in data)) {
				//	c = document.getElementsByName([data.itemID, data.attributeName].join('.'));
				//	for (var i = 0, e; e = c[i]; i++) e.setAttribute('value', data.value);
				//	var c = document.getElementsByClassName(data.itemID);
				//	for (var i = 0, e; e = c[i]; i++) e.setAttribute(data.attributeName, data.value);
				//	if (window.meshitems && window.meshapi.item[data.itemID] && data.attributeName == 'MeshColor') {
				//		window.meshapi.item[data.itemID].src.basiccolor = data.value;
				//		window.meshapi.item[data.itemID].colorSet(data.value);
				//	}
				//	if (window.meshitems && window.meshapi.item[data.itemID] && data.attributeName == 'err') {
				//		var c = OM.elErr.children;
				//		for (var i = 0, elErrRow; elErrRow = c[i]; i++) if (elErrRow.meshitem.src.itemID == data.itemID) break;
				//		if (elErrRow) {
				//			elErrRow.elEnd.innerText = (elErrRow.end = new Date()).toISOString().substr(11, 8);
				//			elErrRow.refresh();
				//		}
				//		else with (OM.elErr.insertBefore(elErrRow = OM.elErr.appendTag('div', { className: 'row err start', onclick: Aim.Element.onclick, itemID: data.itemID, meshitem: window.meshapi.item[data.itemID], start: new Date() }), OM.elErr.firstChild)) {
				//			appendTag('span', { className: 'icon' });
				//			appendTag('span', { className: '', innerText: window.meshapi.item[data.itemID].src.name });
				//			appendTag('span', { className: '', innerText: data.value });
				//			appendTag('span', { className: '', innerText: elErrRow.start.toISOString().substr(11, 8) });
				//			elErrRow.elAccept = appendTag('span', { className: '', innerText: '' });
				//			elErrRow.elEnd = appendTag('span', { className: '', innerText: '' });
				//			elErrRow.refresh = function () {
				//				if (this.end && this.accept) {
				//					this.meshitem.colorSet();
				//					OM.elErr.removeChild(this);
				//				}
				//				OM.elErrCont.style = OM.elErr.children.length ? '' : 'display:none;';
				//				window.onWindowResize();
				//			};
				//			elErrRow.refresh();
				//		}
				//	}
				//}



				//if (Aim.wss.onreceive) Aim.wss.onreceive.call(this, event);
			},
		},
		onload: function () {
			Aim.wss.elConsole = Aim.wss.elConsole || document.body.appendTag('div', { className: 'wsmessage' });
		},
		connect: function (data) {
			//console.log(Aim.wss);
			if (!Aim.wss) return;
			//console.log(Aim.wss, Aim.wss.url);
			Aim.wss.log("Websocket connecting", Aim.wss.url);
			//console.log('WSS Domain', Aim.client.domain);
			Aim.wss.websocket = Object.assign(new WebSocket(Aim.wss.url), Aim.wss.wss);
			if (data) Aim.wss.send(data);
			//try {
			//}
			//catch (error) {

			//}
		},
		//onload: function () {
		//    Aim.wss.elConsole = document.body.appendTag('div', { className: 'wsmessage' });
		//    //Aim.wss.connect();
		//},
		sendbufshift: function () {
			var data = Aim.wss.msgs.shift();
			if (!data) return false;
			//console.log('SEND', data);
			//data.to = data.to || [];
			//if (Aim.client.domain && data.to.indexOf(Aim.client.domain.id) == -1) data.to.push(Aim.client.domain.id);
			//Aim.wss.log('Sending data', data);
			Aim.wss.websocket.send(JSON.stringify(data));
		},
		sendbuf: function () {
			while (Aim.wss.msgs.length && !Aim.wss.hold) Aim.wss.sendbufshift();
			//for (var data; data = Aim.wss.msgs.shift() ;) {
			//	console.log('SEND', data);
			//	Aim.wss.log('Sending data', data);
			//	Aim.wss.websocket.send(JSON.stringify(data));
			//}
		},
		send: function (data) {
			//console.log(data);
			//data = data || {};
			//data.sender = data.sender || Aim.wss.sender;
			//data.to = data.to || Aim.wss.to;
			Aim.wss.msgs.push(data);
			if (!Aim.wss.websocket || Aim.wss.websocket.readyState != 1) return;
			Aim.wss.sendbuf();
		},
		initProperties: function () {
			var itemsInit = [];
			api.item.forEach(function (item) {
				var itemInit = null;
				for (var name in item.properties) if (item.properties[name].initRT) {
					(itemInit = itemInit || { id: item.id, values: [] }).values.push(name);
				}
				if (itemInit) itemsInit.push(itemInit);
			});
			console.log('itemsInit', itemsInit);
			Aim.wss.send({ to: [Aim.client.domain.id], init: itemsInit });
		}
	},
	libraryShow: function (script) {
		console.log(this);
		if (this.show) this.show();
		if (!('script' in this)) this.script = script;
		if (this.script.length) {
			document.head.appendTag('script', { type: 'text/javascript', charset: 'UTF-8', src: this.src = this.script.shift(), onload: arguments.callee.bind(this) });
			console.log(this.src);
		}
	},
	popupmenu: {
		className: 'col popup',
		enter: function (event) {
			console.log('ENTER');
			event.stopPropagation();
			if (this.elMenu.menuitemFocused) this.elMenu.menuitemFocused.removeAttribute('focus');
			this.elMenu.menuitemFocused = this;
			this.elMenu.menuitemFocused.setAttribute('focus', '');
			if (this.elMenu == Aim.popup) Aim.sub.innerText = '';
			if (this.menu) Aim.sub.show.call(this);
		},
		show: function (event) {
			var menu = Aim.sub;
			if (event) {
				event.preventDefault();
				event.stopPropagation();
				var menu = Aim.popup;
			}
			this.menu = this.popupmenu || this.contextmenu;
			if (this.popupmenu) this.right = 0;
			var pos = this.getBoundingClientRect();
			console.log('PUMENU', this.menu, menu, pos);
			with (menu) {
				innerText = '';
				for (var menuname in this.menu) {
					var menuitem = this.menu[menuname];
					//menuitem.item = this;
					//console.log('MENUITEM',menuitem);
					if (menuitem.hidden) continue;
					var a = appendTag('a', Object.assign({ className: 'row abtn icn ' + (menuitem.className || menuname), elMenu: menu, left: 5, menuitem: menuitem, popupmenu: menuitem.menu, item: this.item, onclick: menuitem.onclick || this.menu.onclick, onmouseenter: Aim.popup.enter }, menuitem));
					if (menuitem.href) a.href = menuitem.href;
					if (menuitem.color) a.appendTag('icon', {}).style.backgroundColor = menuitem.color;
					a.appendTag('div', { innerText: menuitem.title });
					if (menuitem.key) a.appendTag('span', { innerText: menuitem.key });
				};
				var top = pos.top;
				if ('right' in this) { var left = pos.right - clientWidth, top = pos.bottom; }
				else if ('left' in this) { var left = pos.right; }
				else {
					var left = event.clientX, top = event.clientY;
				}
				style.left = Math.max(0, left) + 'px';
				style.top = Math.min(top, document.body.clientHeight - clientHeight - 10) + 'px';
			}
		},
		close: function (event) {
			Aim.popup.innerText = '';
			Aim.sub.innerText = '';
		},
	},
	on: {
		//onload: [], onopen: [], onmessage: [], onclose: [], onerror: [], onconnect: [],
		//set load(fn) { this.onload.push(fn); },
		//set open(fn) { this.onopen.push(fn); },
		//set message(fn) { this.onmessage.push(fn); },
		//set close(fn) { this.onclose.push(fn); },
		//set error(fn) { this.onerror.push(fn); },
		//set connect(fn) { this.onconnect.push(fn); },
		message: function (event) {
			//console.log('message', event.data);
			var data = event.data;
			if (data.state && data.description && document.getElementById('aimStatusMsg'))
				document.getElementById('aimStatusMsg').innerText = data.description;

			switch (data.state) {
				case 'datatransfered':
					for (var name in data.values) {
						for (var c = document.getElementsByName(name), el, i = 0; el = c[i]; i++) el.value = data.values[name];

					}
					break;
			}
		},
		click: function (event) {
			//console.log('CLICK', event);

			if (Aim.popup) {
				Aim.popup.close();
				Aim.sub.close();
			}
			Aim.clickElement = event.target;
			Aim.clickPath = event.path || function (el) {
				var path = [];
				while (el) {
					path.push(el);
					el = el.parentElement;
				}
				return path;
			}(event.target);
			if (window.colpanel && Aim.clickPath.indexOf(colpanel) == -1) Aim.Panel.open();
			//alert(Aim.clickPath);
			for (var i = 0, el; el = Aim.clickPath[i]; i++) if (Aim.targetItem = el.item) break;
			if (Aim.targetItem && Aim.targetItem.focus) Aim.targetItem.focus(event);
		},
		keydown: function (event) {
			clearTimeout(Aim.keydownTimeout);
			clearTimeout(Aim.keyupTimeout);
			if (!Aim.keyControl && event.ctrlKey && event.key != 'Control') Aim.keyControl = event.code;
			event.keyValue = [event.ctrlKey ? 'Ctrl' : '', event.shiftKey ? 'Shift' : '', event.altKey ? 'Alt' : '', event.code].join('');
			if (document.activeElement != document.body) event.keyValue += 'Edit';
			Aim.keydownEvent = event;
			if (Aim.clickPath) for (var i = 0, el; el = Aim.clickPath[i]; i++) if (el.keydown && el.keydown[event.keyValue]) return el.keydown[event.keyValue].call(el, event);
		},
		keyup: function (event) {
			if (!Aim.keyControl && event.ctrlKey && event.key != 'Control') Aim.keyControl = event.code;
			event.keyValue = [event.ctrlKey ? 'Ctrl' : '', event.shiftKey ? 'Shift' : '', event.altKey ? 'Alt' : '', event.code].join('');
			if (document.activeElement != document.body) event.keyValue += 'Edit';

			//clearTimeout(Aim.keyupTimeout);

			//event.keyValue = [event.ctrlKey ? 'Ctrl' : '', event.shiftKey ? 'Shift' : '', event.altKey ? 'Alt' : '', event.code].join('');
			//console.log('UP', event.code, event.key, Aim.keyControl);
			if (event.key == 'Control') Aim.keyControl = null;
			if (Aim.clickPath) for (var i = 0, el; el = Aim.clickPath[i]; i++) if (el.keyup && el.keyup[event.keyValue]) return el.keyup[event.keyValue].call(el, event);

			//for (var el = Aim.clickElement; el; el = el.parentElement)
			//	if (el.keyup && el.keyup[event.keyValue]) {
			//		console.log('keyup', el.keyup[event.keyValue]);
			//		return el.keyup[event.keyValue].call(el, event);
			//	}
			//var key = event.key;
			//var keys = OM.keyup;
			//if (!event.code) return;
			//var key = event.code.replace('Arrow', '').replace('Escape', 'Esc');
			//if (OM.keyup[key]) OM.keyup[key](event);


			//if (key) {
			//	var key = key.replace(/Arrow/g, '');
			//	if (Aim.navtree && Aim.navtree.elFocus && Aim.navtree.elFocus.onkeyup) Aim.navtree.elFocus.onkeyup(event, key);
			//}
		},
		popstate: function (event) {
			//console.log('POPSTATE');
			Aim.nav(document.location.search + document.location.hash, 2);
			//event.preventDefault();
			//try {
			//	var data = document.location.search + document.location.hash, arr = data.split(/\?|\#/), uri = arr.shift(), searchdata = arr.shift(), hash = arr.shift(), hashdata = arr.shift();
			//	data = JSON.parse('{"' + searchdata.replace(/=/g, '":"').replace(/&/g, '","') + '"}');
			//	if (hashdata) {
			//		Object.assign(data, JSON.parse('{"' + hashdata.replace(/=/g, '":"').replace(/&/g, '","') + '"}'));
			//	}

			//	var search = "?" + JSON.stringify(data).replace(/,"/g, '&').replace(/":/g, '=').replace(/{|}|"/g, '').replace(/ /g, '+');

			//	console.log('popstate', document.location.search, document.location.hash, search);
			//	if (search == document.location.search) event.preventDefault();
			//	else Aim.nav(data, 2);
			//}
			//catch (err) {
			//	console.log('ERR popstate', data);
			//	return;
			//}





			//return;
			//if (Aim.hisHash != document.location.hash) Aim.URL.exec((Aim.hisHash = document.location.hash).substr(1), 1);
			//else Aim.URL.exec(document.location.search.substr(1), 2);
			//return true;
		},


	},
	URL: {
		his: function (get, hisaction) {
			//var search = Aim.URL.par(document.location.search.substr(1));
			//for (var name in get) {
			//	if (name && (search[name] = get[name]) && name != 'id' && name != 'title') document.body.setAttribute(name, search[name] = get[name]); else document.body.removeAttribute(name);
			//	if (!search[name]) delete search[name];
			//	if (!get[name]) delete get[name];
			//}
			//search = '?' + Aim.URL.stringify(window.get = search);
			//if (window.get.q && document.getElementById('q')) document.getElementById('q').value = window.get.q;
			//if (hisaction == 2) return;
			//if (hisaction == 1) { if (window.history.replaceState) window.history.replaceState('page', 'PAGINA', search); }
			//else if (window.history.pushState) window.history.pushState('page', 'PAGINA', search);
		},
		setitem: function (item) {
			this.set({ schema: item.schema, id: item.id });
		},
		set: function (get, hisaction) {
			console.log('URL.set>Aim.nav(get)', get);
			Aim.nav(get);
			return;


			//if (get.title == 'EWR archief 111') throw "no filter";
			//if (get.folder && (!get.q || get.q == '*')) get = Object.assign({ select: "masterID,typical,title,subject,summary,state,startDT,endDT,finishDT,files,filterfields,geolocatie,modifiedDT,lastvisitDT", title: '', child: '', q: '', filter: '', src: '', reload: '', master: '', users: '', refby: '', link: '' }, get);
			if (get.folder && (!get.q || get.q == '*')) get = Object.assign({ select: "", title: "", child: "", q: "", filter: "", src: '', reload: '', master: '', users: '', refby: '', link: '' }, get);

			//console.log('GO', get.filter);
			//console.log('GO', get.filter);
			if ((get.folder || get.q) && Aim.collist) Aim.collist.set(Object.assign(get, { schema: '', id: '' }));
				//var search = Aim.URL.par(document.location.search.substr(1));
				//console.log(search, document.location.search.substr(1));
				//for (var name in get) if (name && (search[name] = get[name]) && name != 'id') document.body.setAttribute(name, get[name]); else document.body.removeAttribute(name);
				//{
				//	if ('q' in get && !get.q) Listview.set(get);
				//	else Aim.load({ get: get, onload: Aim.createElementList });
				//}
				//return;
			else if (get.schema && get.id) {
				//console.log('LOAD ID', get.schema, get.id);
				if (!get.reload && (item = Aim.get({ schema: get.schema, id: get.id })).loaded) Aim.createElementPage.call({ get: get = { schema: get.schema, id: get.id }, data: { schema: item.schema, value: [item] } });
				else Aim.load({ get: get = { schema: get.schema, id: get.id, select: '*' }, onload: Aim.createElementPage });
				//else Aim.load({ get: { schema: get.schema, id: get.id, select: '*', src: 1, master: 1, users: 1, link: 1, refby: 1, }, onload: Aim.createElementPage });
			}
			this.his(get, hisaction);
		},
		exec: function (url, hisaction) {
			var path = url.split('?'), get = path.pop(), path = path.pop(), item;

			console.log('EXEC URL 1', url, path, get);

			if (get.indexOf('=') != -1) {
				Aim.URL.set(Aim.URL.par(get), hisaction);
				return false;
			}
			if (path) {
				//console.log('EXEC URL 2', url, path, get);
				for (var i = 0, obj = window, parent, ref = path.split(/\/|\./) ; obj[ref[i]]; i++) {
					parent = obj; obj = obj[ref[i]];
				}
				//var obj = Aim.URL.byref(path);
				//console.log('EXEC URL', obj, path, typeof obj);
				if (obj && typeof obj === 'function') {
					//console.log('EXEC URL 2', obj, get);
					obj.apply(parent, get ? get.split('&') : []);
					//Aim.hisHash = '';
					return false;
				}
				//return false;
			}
			var c = document.getElementsByName(url), e = c[0];
			if (e) return e.scrollIntoView();
		},
		byref: function (ref) {
			//console.log(Host.title);
			for (var i = 0, obj = window, ref = ref.split(/\/|\./) ; obj[ref[i]]; i++) obj = obj[ref[i]];
			return obj;
		},
		objbyref: function (ref, e) {
			//console.log(ref);
			var ref = ref.split('#').pop().split('?'), path = ref.shift().split(/\/|\./), e = e || window, p, name;
			//console.log(path);

			while ((name = path.shift()) && e) {
				p = e; e = e[name];
			}
			var pars = {}, search = ref.shift();
			if (search) search.split('&').forEach(function (par) {
				par = par.split('='); pars[par.shift()] = par.shift()
			});
			return {
				e: e, pars: pars, p: p
			};
		},
		//refget: function (ref, pars) {
		//	var obj = Aim.URL.objbyref(ref);
		//	//console.log('REFGET', ref, obj);
		//	if (typeof obj.e === 'function') return obj.e.call(obj.p, pars || obj.pars) || true;
		//	return obj.e;
		//},
		stringify: function (get) {
			return JSON.stringify(get).replace(/,"/g, '&').replace(/":/g, '=').replace(/{|}|"/g, '').replace(/ /g, '+');
		},
		parse: function (s) {
			s = s || document.location.href;
			try { s = decodeURI(s); } catch (err) {
			};
			var par = {
			};
			if (s.indexOf('?') == -1 && s.indexOf('#') == -1) return par;
			if (s.indexOf('?') == -1 && s.indexOf('#') != -1) var a = [s.split('#')[1]];
			else var a = s.split('?')[1].split('#');
			for (var i = 0, p; p = a[i]; i++) {
				var ap = p.split("&");
				for (var ip = 0; ip < ap.length; ip++) {
					var pair = ap[ip].split("=");
					var key = pair.shift();
					var val = pair.join('=');
					par[key] = (isNaN(val)) ? val : Number(val);
				}
			}
			return par;
		},
		par: function (ref) {
			var pars = {
			};
			ref.split('&').forEach(function (par) {
				if (!par) return;
				par = par.split('=');
				pars[par.shift()] = par.join('=');
			});
			return pars;
		},
	},
	nav: function (data, his) {
		if (typeof data == 'string') {
			//console.log(data);
			for (var i = 0, obj = window, name, parent, path = data.split('#').pop().split('?').shift().split(/\/|\./), par = data.split('?').pop().split('&') ; name = path[i]; i++) {
				parent = obj; obj = obj[name];
				if (obj && typeof obj === 'function') {
					console.log(name, par);
					obj.apply(parent, par);
					return false;
				}
			}




			try {
				var arr = data.split(/\?|\#/), uri = arr.shift(), searchdata = arr.shift(), hash = arr.shift(), hashdata = arr.shift();
				data = JSON.parse('{"' + searchdata.replace(/=/g, '":"').replace(/&/g, '","') + '"}');
				if (hashdata) Object.assign(data, JSON.parse('{"' + hashdata.replace(/=/g, '":"').replace(/&/g, '","') + '"}'));
				//console.log('NAV DATA', searchdata, hashdata);
				//return;
				//var hash = data.split('#').pop();
				//data = data.split('?').pop();
				//data = JSON.parse('{"' + data.replace(/=/g, '":"').replace(/&/g, '","') + '"}');
			}
			catch (err) {
				//console.log('NAV ERROR', data);
				//if (Aim.show && document.getElementById(data.substr(1))) Aim.show(data.substr(1));
				return;
			}
		}
		console.log('NAV', data);

		if (!this.navData) this.navData = {
		};
		var modData = {
		};
		for (var name in data) if (this.navData[name] != data[name]) modData[name] = this.navData[name] = data[name];
		get = this.navData;
		var search = "?" + Aim.URL.stringify(this.navData);

		//console.log('search', search, document.location.search);

		console.log('NAV modData', modData, Aim.collist);
		//if (JSON.stringify(modData) != "{}") return false;
		if (his == 2) { if (window.history.replaceState) window.history.replaceState('page', 'PAGINA', search); }
		else if (window.history.pushState) window.history.pushState('page', 'PAGINA', search);

		if (Object.values(modData).length || data.reload) {
			for (var name in modData) {
				if (modData[name] == null) document.body.removeAttribute(name);
				else document.body.setAttribute(name, decodeURI(modData[name]).replace(/\+/g), ' ');
				if (typeof Aim[name] == 'function') Aim[name].apply(Aim, modData[name].split(','))
			}


			if ((modData.folder || modData.q) && Aim.collist) Aim.collist.set(this.navData);
			if (data.schema || data.id) {
				if (!modData.reload && (item = Aim.get({ schema: modData.schema, id: modData.id })).loaded) Aim.createElementPage.call({ get: { schema: this.navData.schema, id: this.navData.id }, data: { schema: item.schema, value: [item] } });
				else Aim.load({ get: { schema: data.schema, id: data.id, select: '*' }, onload: Aim.createElementPage });
			}
			//var search = Aim.URL.par(document.location.search.substr(1));
			//for (var name in get) {
			//	if (name && (search[name] = get[name]) && name != 'id' && name != 'title') document.body.setAttribute(name, search[name] = get[name]); else document.body.removeAttribute(name);
			//	if (!search[name]) delete search[name];
			//	if (!get[name]) delete get[name];
			//}
			//search = '?' + Aim.URL.stringify(window.get = search);
			//if (window.get.q && document.getElementById('q')) document.getElementById('q').value = window.get.q;
			//if (hisaction == 2) return;
			//if (hisaction == 1) { if (window.history.replaceState) window.history.replaceState('page', 'PAGINA', search); }
			//else if (window.history.pushState) window.history.pushState('page', 'PAGINA', search);
		}

		//console.log('NAV', data, modData, this.navData);
		return true;
	},
	//events: {
	//	//hashchange: function (event) {
	//	//	console.log('HASH', document.location.href);
	//	//},
	//	//DOMContentLoaded: function (event) {
	//	//	//console.log('ready');
	//	//},
	//},
	properties: {
		cookie: {
			get: function () {
				//console.log('cookieget');
				return document.cookie ? JSON.parse('{"' + document.cookie.replace(/=/g, '":"').replace(/; /g, '","').replace(/\",/g, '",') + '"}') : {};
			}
		}
	},
	decodeId: decodeId = function (Id) {
		if (!Id) return {
		};
		var a = Id.split('.');
		return JSON.parse(atob(a[1] || a[0]));

	},
	client: {
		user: decodeId(Aim.userId),
		account: decodeId(Aim.accountId),
	},
	logout: function () {
		console.log('LOGOUT');
		document.location.href = '/aim/v1/api/auth/logout?redirect_uri=' + encodeURIComponent(document.location.href);
	}
});
Aim.assign.call(window, Aim.window);
//Aim.client.domain.id = Aim.client.domain.id1;
apiorigin = Aim.httpHost == 'localhost' && Aim.local == 'api' ? "http://localhost" : Aim.origin;
//apiorigin = Aim.ws.protocol + '://' + Aim.ws.hostname;

console.log('CLIENT', Aim.client, JSON.parse(atob(Aim.access_token.split('.')[1])));

//console.log(Aim);

libroot = apiorigin + "/aim/" + Aim.version + "/lib";
apiroot = apiorigin + "/" + Aim.client.domain.name + "/" + Aim.version + "/api/";

//console.log('APIROOT',apiroot);


get = Aim.URL.parse(document.location.href);
//Aim.client.device = Aim.device = { id: Aim.device.id = get.deviceID || Aim.device.id || '', uid: Aim.device.uid = get.deviceUID || Aim.device.uid || '' };




//Aim.assign({
//	events: Aim.events,
//});

//console.log('FAVICON', Aim.client.domain.name.favicon);
if (Aim.favicon) document.head.appendTag('link', { rel: "shortcut icon", type: "image/png", id: 'favicon', href: (Aim.favicon.substr(0, 4) != 'http' ? apiorigin : '') + Aim.favicon });


//if (Aim.style) Aim.appendHead.css(Aim.style.split(','), Aim.origin + '/lib/' + Aim.version + '/css/');
//if (Aim.theme) Aim.appendHead.css(Aim.theme.split(','), Aim.origin + '/theme/');

//if (Aim.libraries) Aim.libraries.split(',').forEach(function (src) { Aim.scripts.append(Aim.origin + '/lib/' + Aim.version + '/js/' + src + '.js'); });
//Aim.scripts.append(Aim.origin + '/schemas/default.js');
//if (Aim.schemas) Aim.schemas.split(',').forEach(function (src) { Aim.scripts.append(Aim.origin + '/schemas/' + src + '.js'); });
//Aim.appendHead.js(Aim.schemas ? ['default'].concat(Aim.schemas.split(',')) : ['default'], Aim.origin + '/schemas/');
//if ('manual' in get) Aim.scripts.append('../manual/js/doc.js');
//Aim.scripts.push(aliconnect.js);
//Aim.scripts.load();

//if (document.cookie) document.cookie.split('; ').forEach(function (cookie) { cookie = cookie.split('='); var name = cookie.shift(); Aim[name] = Aim[name] || decodeURIComponent(cookie.shift()) });
//console.log('Aim', Aim.user);

//try {
//	Aim.settings = Aim.settings ? JSON.parse(Aim.settings) : {};
//} catch (err) {
//}
Aim.foldersOpen = String(Aim.foldersOpen || '').split(',');
//console.log(Aim.auth);
//console.log(get);


//console.log(Aim.Array.intersection([1, 2, 3, 4], [3, 5]));
//console.log(Aim.root);
//console.log('CLIENT', Aim.client);

//if (('auth' in Aim) && (!Aim.client.user || !Aim.client.user.id)) document.location.href = apiorigin + "/auth/?redirect_uri=" + document.location.href;
//console.log('AUTH', Aim.client);

//console.log('LOAD AUTH');
//Aim.load({
//	src: 'http://localhost/aim/v1/api/auth/', onload: function () {
//		console.log('AUTH', this.responseText);
//	}
//})



//if (('auth' in Aim) && !Aim.client.account) {
//	Aim.load({
//		src: 'http://auth.localhost/aim/v1/api/auth/', onload: function () {
//			console.log('AUTH',this.responseText);
//		}
//	})

//	//document.location.href = apiorigin + "/auth/?prompt=login&redirect_uri=" + encodeURIComponent(document.location.href);
//}





//if ('auth' in Aim) {
//	//document.location.href = apiorigin + "/auth/?redirect_uri=" + document.location.href;
//	//alert('auth');
//	Aim.loadData.push({
//		src: apiroot + 'auth', onload: function () {
//			console.log("AUTH LOADED", this.src, this.data);
//			Aim.assign.call(Aim.client, this.data);
//			//console.log(this.src, Aim.client);
//			if (!Aim.client.account || !Aim.client.account.id) return document.location.href = apiorigin + "/auth/?redirect_uri=" + encodeURIComponent(document.location.href);
//			//Aim.loadevents.forEach(function (fn) { fn(); });
//			Aim.loadData.next();
//		}
//	});
//}
//console.log('fav' in Aim, Aim.fav);

if ('fav' in Aim) Aim.loadData.push({ src: apiroot + 'fav', onload: function () { Aim.api.fav = this.data || []; Aim.loadData.next(); } });
if ('his' in Aim) Aim.loadData.push({
	src: apiroot + 'his', onload: function () {
		Aim.his = this.data;
		//console.log('HIS', Aim.his);
		Aim.loadData.next();
	}
});


window.addEventListener('load', function (e) {
	if (!Aim.settings.cookie) {
		with (Aim.elementCookieOK = document.body.appendTag('div', { className: 'topmessage', innerText: 'Indien u gebruik maakt van deze site gaat u akkoord met onze cookie voorwaarden' })) {
			appendTag('button', {
				innerText: 'Akkoord', onclick: function (event) {
					console.log('click');
					Aim.load({
						api: 'settings', post: { cookie: 1 }, onload: function (event) {
							console.log('cookieok', this.data);
							Aim.settings = this.data;
							document.body.removeChild(Aim.elementCookieOK);
						}
					})

				}
			})
		};
	}

	//return;
	Aim = Object.create(Aim, Aim.properties);
	Aim.popup = Object.assign(document.body.appendTag('div'), Aim.popupmenu);
	Aim.sub = Object.assign(document.body.appendTag('div'), Aim.popupmenu);
	apiorigin = Aim.httpHost == 'localhost' && Aim.local == 'api' ? "http://localhost" : Aim.origin;
	libroot = apiorigin + "/aim/" + Aim.version + "/lib";
	apiroot = apiorigin + "/" + Aim.client.domain.name + "/" + Aim.version + "/api/";


	//console.log('start onload');
	//if (aliconnect.js) Aim.scripts.append(aliconnect.js);
	'NavTop,NavLeft,Tree,List,Page,Info,Footer,Logo,Banner'.split(',').forEach(function (name) { Aim['element' + name] = document.getElementById(name); })
	//for (var name in Aim) if (typeof Aim[name] == 'object') window[name] = Aim.merge(Aim[name], window[name], Host[name]);
	//for (var name in Aim) if (typeof Aim[name] == 'object') {
	//	if (window[name].events) for (var eventName in window[name].events) window.addEventListener(eventName, window[name].events[eventName]);
	//	if (window[name].events.load) window[name].events.load();
	//}
	//console.log('LOAD');
	//Aim.merge(window, Aim);//window[name] = Aim[name];
	api.items = api.item;
	//for (var name in Aim) {
	//	//Aim.merge(window, Aim[name]);//window[name] = Aim[name];
	//	if ('events' in Aim[name]) {
	//		for (var eventName in Aim[name].events) window.addEventListener(eventName, Aim[name].events[eventName]);
	//		if ('load' in Aim[name].events) Aim[name].events.load();
	//	}
	//}
	//if (Aim.libraries) Aim.libraries.forEach(function (library) { if (library in window && window[library].onload) window[library].onload(); });
	//if ('host' in window && Host.onload) Host.onload();
	//if (document.location.hash) Aim.hashchange(event);
	Aim.loadData.next();
	//if ('auth' in Aim) Aim.load({
	//	src: apiroot + 'auth', onload: function () {
	//		Aim.merge(Aim.client, this.data);
	//		//console.log(this.src, Aim.client);
	//		if (!Aim.client.account || !Aim.client.account.id) return document.location.href = apiorigin + "/auth/?redirect_uri=" + document.location.href;
	//		Aim.loadevents.forEach(function (fn) { fn(); });
	//	}
	//});
	//else Aim.loadevents.forEach(function (fn) { fn(); });
	//console.log('LOADGET', get);
	//if (get.folder) Aim.URL.set({ folder:get.folder, q:get.q, filter:get.filter }, 2);
	//console.log('Aim', Aim);
	//console.log('Eventlist', Aim.on);
	//Aim.on.onload.forEach(function (fn) { fn.call(Aim, event); });

	// var event;
	// if(typeof(Event) === 'function') {
	//     event = new Event('init');
	// }else{
	//     event = document.createEvent('Event');
	//     event.initEvent('init', true, true);
	// }
	//
	window.dispatchEvent(newEvent('init'));

	//window.dispatchEvent(new Event('init'));




	Aim.nav(document.location.search + document.location.hash, 2);
	//window.dispatchEvent(new Event('popstate'));
	//console.log('Aim', Aim.wss.connect);
	Aim.wss.connect();
	(checkdark = function () {
		var h = new Date().getHours(), dark = h >= 20 || h <= 7;
		//dark = Aim.dark ^ 1;
		//dark = 0;
		//console.log(dark, Aim.dark);
		if (Aim.dark != dark) {
			document.documentElement.className = document.documentElement.className.replace(/ dark/g, '');
			if (Aim.dark = dark) document.documentElement.className += ' dark';
		}
		setTimeout(checkdark, 5000);
	})();

	console.log('Aim', Aim);
}, true);

console.log('Aim', Aim);
if (Aim.head && Aim.head.css) Aim.appendHead.css(Aim.head.css);
if (Aim.head && Aim.head.js) Aim.scripts.append(Aim.head.js);


//text = "<bookstore><book>" +
//"<title>Everyday Italian</title>" +
//"<author>Giada De Laurentiis</author>" +
//"<year>2005</year>" +
//"</book></bookstore>";
//parser = new DOMParser();
//xmlDoc = parser.parseFromString(text, "text/xml");
//console.log('xmlDoc',xmlDoc.children);
