document.title = 'CM';

Aim.add(CM = {
	setVar: setVar = function (par) {
		//wordt aangeroepen door external proces
		var field = fc.values[par.itemId]; //.value = par.value;
		if (!field) return;
		field.item.set(field.name, par.value);
	},
	messenger: {
		onreceive: function (event) {
			if (this.data.state == 'connected' && this.data.from.app == 'em') document.location.reload();
			if (this.data.value) this.data.value.forEach(function (row) {
				for (var name in row.operations) if (CM.items[row.id] && CM.items[row.id][name]) CM.items[row.id][name](row.operations[name]);
			});
		}
	},
	prefix: '.',
	ondataload: function () {
		CM.items = [];
		Aim.proxyItems(this.data.value);
		var itemClient = api.items[this.get.id];
		itemClient.getChildren().forEach(function (itemServer) {
			//console.log([itemServer.id, itemServer.title, itemServer.name, itemServer.keyname]);
			if ('opcConnect' in external) {
				external.opcConnect(itemServer.keyname);
				CM.prefix += 'main.';
			}
			itemServer.getChildren().forEach(function (itemFC) {
				typicalIdx = {};
				if (itemFC.keyname) itemFC.keyname = itemFC.keyname.split(' ').shift();
				//console.log([itemFC.id, itemFC.title, itemFC.name, itemFC.keyname]);
				(getData = function (item) {
					if (!item) return;
					if ('selected' in item && item.selected == 0) return;
					if (item.cm) {
						CM.items[item.id] = item;
						item.set = function (attributeName, value) {
							var item = { id: this.id, values: {} };
							this.el[attributeName].value = this[attributeName] = item.values[attributeName] = value;
							Aim.messenger.send({ to: [Aim.client.domain.id], value: [item] });
						};
						CM.items.push(item);
						var idx = typicalIdx[item.typical] = typicalIdx[item.typical] + 1 || 1;
						item.itemID = itemFC.keyname + CM.prefix + (item.shortname || item.name) + '_' + idx;
						item.el = Aim.panels.cm.el.appendTag('div', { innerText: item.id + ':' + item.itemID });
						if (item.statemodel) item.el.state = item.el.appendTag('div', { innerText: 'state' }).appendTag('input', { item: item });
						Object.forEach(item.operations, function (prop, name) {
							(item.el[name] = item.el.appendTag('div', { innerText: name }).appendTag('input', { name: name, item: item })).onchange = function () {
								this.item[this.name].apply(this.item, this.value.split(','));
							}
							var itemID = [item.itemID, name].join('.');

							if (prop.external && ('opcSetVar' in external)) external.opcSetVar(itemID);

							item[name] = function () {
								var arg = Array.prototype.slice.call(arguments);
								this.item.el[this.name].value = arg.join(',');

								if (this.prop.external && ('opcSet' in external))
									external.opcSet(this.itemID, arg.join(',')); // bij PLC next deze functie toevoegen
								else if (item.operations[this.name].cm)
									item.operations[this.name].cm.apply(item, arg);
							}.bind({ item: item, prop: prop, name: name, itemID: itemID });
						});
						Object.forEach(item.properties, function (prop, name) {
							if (item[name]) return;
							(item.el[name] = item.el.appendTag('div', { innerText: name }).appendTag('input', { name: name, item: item })).onchange = function () {
								this.item.set(this.name, this.value);
							}
							if (prop.external && ('opcSetVar' in external)) {
								var itemID = [item.itemID, name].join('.');
								fc.values[itemID] = Object.assign(item.el[name], { id: item.id, name: name, itemID: itemID });
								external.opcSetVar(itemID);
							}
						});
					}
					item.getChildren().forEach(getData);
				})(itemFC);
			});
		});
		CM.items.forEach(function (item) { if (item.statemodelEval) item.statemodelEval(); });
	},
	fc: fc = { values: {}, },
	panels: {
		cm: {
			title: 'Control Manager',
			init: function () { Aim.load({ get: { id: Aim.device.id, child: 8 }, onload: Aim.ondataload }); }
		},
	}
});
