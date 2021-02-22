console.log('aliconnect EM v0.2');
em = { definitions: {} };
devices = {};
lfv = {};

//Aim.client.app = Aim.app;

//console.log('EM', Aim.client, aliconnect);
//get = (function (search) { return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) { return key === "" ? value : decodeURIComponent(value) }) : {} })(location.search.substring(1))
Aim.add(EM = {
	devices: [], msgBuffer: [], deviceUID: {}, msgs: [], toItems: [], key: Aim.key, senddata: {},
	clients: {},
	client: { ap: 'gui' },
	Gui: {
		scale: 1
	},
	definitions: {
	},
	writeMsg: function (id, msg) {
		if (api.items[id] && api.items[id].elMsg) api.items[id].elMsg.innerText = msg;
	},
	msgSend: function (data, send) {
		Aim.messenger.send({ msg: data });
	},
	exec: function (item) {
		console.log('SEND TO LFV', arguments.callee.caller.name);

		//Aim.messenger.send({ to: Object.assign({ app: 'fc' }, Aim.messenger.to), msg: { item: { [item.id]: { method: { [arguments.callee.caller.name]: arguments.callee.caller.arguments } } } } });
	},
	onitemchange: function (item) {
		if (!Aim.run) return;
		(function masteronchange(item) {
			if (!item) return;
			//console.log(functionname, master);
			//console.log(functionname, master);
			//if (this.softwarefunction) this.softwarefunction.forEach(function (mFunction) {
			//	if (Array.isArray(mFunction[functionname])) mFunction[functionname].push(item);
			//	else if (mFunction[functionname]) mFunction[functionname] = [mFunction[functionname], item];
			//	else mFunction[functionname] = item;
			//	//console.log(mFunction);
			//});
			if (item.autonoom_proces) for (var attributeName in item.autonoom_proces) if (item.autonoom_proces[attributeName].actie) item.autonoom_proces[attributeName].actie.call(item);

			//try {
			//	item.operations[attributeName].actie.call(item);
			//}
			//catch (err) {
			//	console.log('ERROR',err);
			//}
			//console.log(item.id, item.title, item);
			if (item.properties) for (var attributeName in item.properties) if (item.properties[attributeName].get) item[attributeName] = item.properties[attributeName].get.call(item);

			//try {
			//	item.properties[attributeName].get.call(item);
			//}
			//catch (err) {
			//	console.log('ERROR', err);
			//}



			if (item.master && item.master.master && item.master.master.softwarefunction) item.master.master.softwarefunction.forEach(masteronchange);
		})(item)

		//this.el[prop.name]



	},
	items: [],

	signalering: function (configuratie) {
		this.conditiewaarde = false;
		//statuswaarde: "",//is gelijk aan resultaat configuratie status
		this.bevestigd = false;
		this.onderdrukt = false;
		this.tijd = null;
		this.notitie = "";
		this.Bevestig = function () {
			if (this.bevestiging_nodig == ja) this.bevestigd = ja;
		}
		this.SelecteerCameraEnBevestigDirect = function () {
			if (this.bevestiging_nodig == ja && this.camera_koppeling == ja) {
				this.sf_camera.SetPreset(this.preset);
				this.bf_cctv.sf_detailkanaal.SelecteerCamera(this.sf_camera);
				this.bevestigd = ja;
			}
		}
		this.Notitie = function (notitie) {
			this.notitie = notitie;
		}
		this.HandStartOnderdrukken = function () {
			this.hand_onderdrukt = ja;
		}
		this.HandStopOnderdrukken = function () {
			this.hand_onderdrukt = nee;
		}
		this.RichtCameraVoor = function () {
			if (this.camera_koppeling == ja && this.bevestiging_nodig == ja) this.sf_camera.RichtPresetVoor(this.preset)
		}
		return this;
	},
	signaleringen: [],
	createElementSystem: function (item, i, rows) {
		if (!item) return;
		if ('selected' in item && item.selected == 0) return;
		item.elIndexItem = Aim.Document.createIndexListItem(rows.list, item.title, item.id);
		item.elIndexItem.header.appendTag('a', { innerText: item.typical, href: '#' + item.typical });
		with (Aim.Document.elBody) {
			with (appendTag('table')) {
				with (appendTag('tr')) {
					appendTag('th', { innerText: 'id:' });
					appendTag('td', { innerText: item.id });
				}
				if (item.typical) with (appendTag('tr')) {
					appendTag('th', { innerText: 'Typical:' });
					appendTag('td', { innerText: item.typical });
				}
			}
		}
		var fn = item;
		[item.attributes].forEach(function (props) {
			for (var propname in props) if (props[propname].stereotype) (item[props[propname].stereotype] = item[props[propname].stereotype] || {})[propname] = props[propname];
		});
		[item.operations].forEach(function (props) {
			for (var propname in props) {
				//console.log(propname, props[propname][Aim.client.app]);
				if (props[propname].stereotype && props[propname][Aim.client.app]) {
					item[propname] = (item[props[propname].stereotype] = item[props[propname].stereotype] || {})[propname] = props[propname][Aim.client.app];
					//console.log('>>>>>>>>>>>>>>>>>>>>', propname, item[propname]);
				}
			}
		});
		for (var typename in Aim.stereotype) if (item[typename]) {
			var h3 = Aim.Document.createIndexListItem(item.elIndexItem.list, Aim.stereotype[typename].label, item.name + typename);
			with (Aim.Document.elBody.appendTag('table')) {
				Object.forEach(fn[typename], function (prop, propname) {
					prop.name = propname;
					with (appendTag('tr')) {
						appendTag('th').appendTag('a', { innerText: prop.name, href: '#' + [fn.name, prop.name].join('.') });
						with (prop.el = appendTag('td')) {
							var field = item[prop.name];
							if (field) {
								if (Array.isArray(field)) with (appendTag('ol')) field.forEach(function (obj) {
									appendTag('li').appendTag('a', { innerText: obj.id + ':' + obj.name, href: '#' + obj.id });
								});
								else if (item[prop.name].id) {
									appendTag('a', { innerText: item[prop.name].id + ':' + item[prop.name].title.value, href: '#' + item[prop.name].id });
								}
								else {
									if (typeof item[prop.name] == 'function') item[prop.name].el = appendTag('span');
									else appendTag('span', { innerText: item[prop.name], attr: { modifiedDT: Date.stamp() } });
								}
							}
						}
					}
				}.bind(fn));
			}
		}
		var config = {};
		if (item.children && item.children.length) {
			item.children.sort(function (a, b) { return a.idx > b.idx ? 1 : a.idx < b.idx ? -1 : 0; });
			item.children.list = item.elIndexItem.list;
			item.children.forEach(arguments.callee);
		}
	},
	itemsLinkAll: function (object, proxy) {

		addref = function (item, ref) {
			if (Array.isArray(item[ref.typical])) {
				if (item[ref.typical].indexOf(ref) == -1) item[ref.typical].push(ref);
			}
			else if (item[ref.typical]) {
				if (item[ref.typical] != ref) item[ref.typical] = [item[ref.typical], ref];
			}
			else item[ref.typical] = ref;
		}

		EM.items.forEach(function (item) {
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
		EM.items.forEach(function (master) {
			master.linkAll.forEach(function (item) {
				item = api.item[item.id];
				if (!item.typical) return;
				addref(master, item);
				//if (Array.isArray(master[item.typical])) master[item.typical].push(item);
				//else if (master[item.typical]) master[item.typical] = [master[item.typical], item];
				//else master[item.typical] = item;
			})
			master.children.forEach(function (child) {
				child = api.item[child.id];
				if (Array.isArray(master[child.schema])) master[child.schema].push(child);
				else master[child.schema] = [child];

				(function drillsoftwarefunctions(child) {
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


	},
	createBody: function (item) {
		Aim.Document.create({
			el: document.body, root: item, onload: function () {
				this.ulIndex = this.elIndex.appendTag('ul', { level: 1 });
				EM.createElementSystem(this.root, 0, { list: this.ulIndex });
				Aim.run = true;
				//Aim.messenger.connect();
				//EM.onitemchange(api.items[this.data.id]);

				//console.log('JAAAAAAAAAAAAAAAAA');
			}
		});
	},
	itemProxy: {
		get: function (item, name, proxy) {
			if (item.operations && item.operations[name]) {
				var operationName = [item.id, item.typical, name].join('.');
				if (EM.operationName != operationName) {
					EM.operationName = operationName;
					console.log('operation', operationName);
				}
			}
			try {
				if (item.properties && item.properties[name] && item.properties[name].conditie) {
					var conditie = item.properties[name].conditie.call(proxy);
					console.log('conditie', [item.id, item.typical, name].join('.'), '=', conditie);
					if (!conditie) return 'ongeldig';
				}
				if (item.properties && item.properties[name] && item.properties[name].get) {
					var get = item.properties[name].get.call(proxy);
					var getName = [item.id, item.typical, name].join('.');
					if (EM.getName != getName) {
						EM.getName = getName;
						console.log('get', getName, '=', get);
					}
					return get;
				}
			}
			catch (err) {
				console.log('ERROR:', item, name, err);
				return String(err);
			}
			// for (var groupname in groups) {
			// 	if (item[groupname] && name in item[groupname]) {
			// 		try {
			// 			if (item[groupname][name].get) return item[groupname][name].get.call(proxy);
			// 			if (item[groupname][name].conditie) return item[groupname][name].conditie.call(proxy);
			// 			if (item[groupname][name].waarde) return item[groupname][name].waarde.call(proxy);
			// 		}
			// 		catch (err) {
			// 			//console.log(err);
			// 			return String(err);
			// 		}
			// 	}
			// }
			return item.values && item.values[name] ? item.values[name] : item[name];
		},
		set: function (item, name, value, proxy) {
			if (item[name] == value) return;
			if (item.attributes && (name in item.attributes) && item.attributes[name].el) {
				item.attributes[name].el.setAttribute('modifiedDT', Date.stamp());
				item.attributes[name].el.innerText = value;
				Aim.messenger.send({
					to: [Aim.client.domain.id],
					value: [{ id: item.id, schema: item.schema, typical: item.typical, values: { [name]: value } }]
				});
			}
			item[name] = value;
			if (!Aim.messenger.hold) EM.onitemchange(proxy);
			return true;
		},
	},
	onload: function () {
		console.log(this.src,this.data);
		EM.items = Aim.proxyItems(this.data.value);
		if (Aim.dataonload) return Aim.dataonload.call(this);
		Aim.createBody(EM.items[this.get.id]);

		console.log('ROOT', this.get.id, EM.items[this.get.id]);



		Aim.messenger.initProperties();
		setInterval(function (event) { Aim.messenger.send({ to: [Aim.client.domain.id], hb: 1 }); }, 1000);


	},
	on: {
		message: function (event, data) {
			if (data.value) data.value.forEach(function (row) {
				// START DMS
				if (!row.values) return;

				var item = Aim.api.item[row.id] = Aim.api.item[row.id] || row;
				console.log('ONMESSAGE', row.id, Aim.api.item[row.id]);



				for (var attributeName in row.values) {
					if (attributeName == 'value') {
						Aim.api.item.forEach(function (item) {
							if (item.detailID == row.id) {
								console.log('DETAIL FROM', item.master.id, item.name, row.values[attributeName]);
								item.master.setAttribute(item.name, row.values[attributeName]);
							}
						});
					}


					//var prop = item.attributes[attributeName];
					//console.log(attributeName, row.values[attributeName], prop);

				}
				return;
				// END DMS

				var item = api.item[row.id];
				if (!item) return;
				(EM.devices[data.from.deviceID] = EM.devices[data.from.deviceID] || []).push(item);
				if (row.values) for (var attributeName in row.values) item[attributeName] = row.values[attributeName];
				if (row.operations) for (var name in row.operations) {
					if (!item[name]) continue;
					if (item[name].el) {
						item[name].el.setAttribute('modifiedDT', Date.stamp());
						item[name].el.innerText = row.operations[name];
					}
					item[name].apply(item, row.operations[name]);
				}
			});



			if (data.state == 'disconnected' && data.from.deviceID && EM.devices[data.from.deviceID]) {
				EM.devices[data.from.deviceID].forEach(function (item) {
					Object.assign(item, { observeerbaar: 'nee', bestuurbaar: 'nee', storingen: ['STORING_COMMUNICATIE_UITGEVALLEN'], reden_niet_bestuurbaar: ['storing'] });
				});
				EM.devices[data.from.deviceID] = [];
			}
		},
		load: function () {
			console.log(Aim);
			var types = {}, swObjecten = [];
			//console.log('UUUUUUUUUUUUUUUUUUUUUUUUU');
			Aim.load({ get: { id: Aim.client.system.id, child: 8, src: 10, link: 10, refby: 10, select: '*', selectall: '', filter: 'ISNULL(selected,1)=1' }, onload: EM.onload });
			//return;
			//Aim.Document.create({ el: document.body, par: { get: { id: Aim.client.domain.id, child: 8, src: 10, link: 10, refby: 10, select: '*', selectall: '' }, onload: EM.onload } });
		},
	},
	events: {
		keydown: function (event) {
			if (event.key == 'h') {
				Aim.messenger.hold = true;
				console.log('Aim.messenger.hold', Aim.messenger.hold);
			}
			if (event.key == 'c') {
				Aim.messenger.hold = false;
				console.log('Aim.messenger.hold', Aim.messenger.hold);
				Aim.messenger.sendbuf();
			}
			if (event.key == 's') {
				console.log('Aim.messenger.sendbufshift');
				Aim.messenger.sendbufshift();
			}
		}
	},
});
