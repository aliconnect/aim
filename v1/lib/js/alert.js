Aim.assign({
	alerts: {},
	on: {
		//load: function (event) {
		//	console.log(this, event);
		//},
		message: function (event) {
			var data = event.data;
			if (data.systemalert) {
				console.log('ONMESSAGE ALERT', data);
				if (!document.getElementById('alertpanel')) return;
				if (!Aim.elAlertrow) {
					with (document.getElementById('alertpanel')) {
						Aim.elAlertsum = document.getElementById('alertsum') || appendTag('div', { className: 'col', id: 'alertsum' });
						Aim.elAlertrow = document.getElementById('alertrow') || appendTag('div', { className: 'col aco', id: 'alertrow' });
					}
				}
				if (!Aim.alerts[data.systemalert.id]) Aim.alerts[data.systemalert.id] = Aim.elAlertrow.appendTag('div', {
					className: data.systemalert.categorie, innerText: [data.systemalert.title, data.systemalert.created].join(' '),
					onchange: function (event) {
						console.log('CHANGE',this);
						if ('condition' in this) this.setAttribute('condition', this.condition);
						if ('ack' in this) this.setAttribute('ack', this.ack);
						if (this.ack && !this.condition) { Aim.alerts[this.id] = null; Aim.elAlertrow.removeChild(this); }
					},
					onclick: function () {
						Aim.wss.send({ systemalert: { id: this.id, ack: this.ack = 1 } });
						this.onchange();
					}
				});
				Object.assign(Aim.alerts[data.systemalert.id], data.systemalert).onchange();
			}


			return;

			if (data.itemID && data.attributeName && ('value' in data)) {
				c = document.getElementsByName([data.itemID, data.attributeName].join('.'));
				for (var i = 0, e; e = c[i]; i++) e.setAttribute('value', data.value);
				var c = document.getElementsByClassName(data.itemID);
				for (var i = 0, e; e = c[i]; i++) e.setAttribute(data.attributeName, data.value);
				if (window.meshitems && window.meshapi.item[data.itemID] && data.attributeName == 'MeshColor') {
					window.meshapi.item[data.itemID].src.basiccolor = data.value;
					window.meshapi.item[data.itemID].colorSet(data.value);
				}
				if (window.meshitems && window.meshapi.item[data.itemID] && data.attributeName == 'err') {
					var c = OM.elErr.children;
					for (var i = 0, elErrRow; elErrRow = c[i]; i++) if (elErrRow.meshitem.src.itemID == data.itemID) break;
					if (elErrRow) {
						elErrRow.elEnd.innerText = (elErrRow.end = new Date()).toISOString().substr(11, 8);
						elErrRow.refresh();
					}
					else with (OM.elErr.insertBefore(elErrRow = OM.elErr.appendTag('div', { className: 'row err start', onclick: Aim.Element.onclick, itemID: data.itemID, meshitem: window.meshapi.item[data.itemID], start: new Date() }), OM.elErr.firstChild)) {
						appendTag('span', { className: 'icon' });
						appendTag('span', { className: '', innerText: window.meshapi.item[data.itemID].src.name });
						appendTag('span', { className: '', innerText: data.value });
						appendTag('span', { className: '', innerText: elErrRow.start.toISOString().substr(11, 8) });
						elErrRow.elAccept = appendTag('span', { className: '', innerText: '' });
						elErrRow.elEnd = appendTag('span', { className: '', innerText: '' });
						elErrRow.refresh = function () {
							if (this.end && this.accept) {
								this.meshitem.colorSet();
								OM.elErr.removeChild(this);
							}
							OM.elErrCont.style = OM.elErr.children.length ? '' : 'display:none;';
							window.onWindowResize();
						};
						elErrRow.refresh();
					}
				}
			}
		}
	},
});
