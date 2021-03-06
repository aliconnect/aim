﻿Aim.add(EM = {
	client: { app: 'er' },
	messenger: {
		onreceive: function () {
			if (this.data.value) {
				//this.data.onload = function () { console.log(this);}
				Aim.load(this.data);
				this.data.value.forEach(function (row) {
					var item = api.item[row.id] = api.item[row.id] || {id:row.id};
					[row.values].forEach(function (props) {
						for (var name in props) item[name] = props[name];
					}.bind(this));
				}.bind(this));
			}
			if (this.data.init) {
				console.log('INIT', this.data.from);
				var items = [];
				this.data.init.forEach(function (row) {
					var item = { id: row.id, values: {} }
					row.values.forEach(function (name) {
						item.values[name] = (api.item[row.id] = api.item[row.id] || { id: row.id })[name];
					});
					items.push(item);
				});
				Aim.messenger.send({ to: [this.data.from.clientID], value: items });
			}
		}
	},
	events: {
		load: function () {
			Aim.messenger.connect();
			setInterval(function (event) { Aim.messenger.send({ to: [Aim.client.domain.id] }); }, 1000);
		}
	},
});
