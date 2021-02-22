console.log('GANTH LOADED');
//document.head.appendTag('link', { rel: 'stylesheet', href: Aim.libroot + '/css/ganth.css' });
dw = 24;
Aim.assign({
	Ganth: {
		show: function () {
			console.log(this);
			this.el.innerText = '';
			console.log('ROWS', this.rows);
			this.resetview(this.rows);

			this.rows.forEach(this.writerow, this);

			while (this.startDT.getDay()) this.startDT.setDate(this.startDT.getDate() - 1);
			this.startDT.setDate(this.startDT.getDate() + 1);
			this.bars.forEach(function (elBar) {
				var bar = elBar.bar;
				bar.left = this.left(bar.sdt);
				bar.right = this.left(bar.edt);
				elBar.style.left = (bar.left) + 'px';
				elBar.style.width = (bar.right - bar.left + 24) + 'px';
			}.bind(this));
			this.elGanth.style.width = ((this.endDT.valueOf() - this.startDT.valueOf()) / 3600000) + 'px';
			this.closeview();
		},

		left: function (dt) {
			return (dt.valueOf() - date.date(Ganth.startDT).valueOf()) / 3600000;
		},
		goToday: function () {
			Ganth.elGanth.parentElement.scrollLeft = Ganth.left(new Date()) - 200;
		},
		//css: document.body.appendTag('link', { href: '/lib/v1/css/Ganth.css', rel: 'stylesheet' }),
		closeview: function () {
			with (elGanthTop) {
				dDag = date.localdate(Ganth.startDT);
				console.log(Ganth.startDT);
				with (elGanthTop2) {
					while (dDag <= Ganth.endDT) {
						appendTag('span', { style: 'width:' + (7 * dw) + 'px', innerText: 'w' + dDag.getWeek() });
						dDag.setDate(dDag.getDate() + 7);
					}
					Ganth.endDT = dDag;
				}
				dDag = date.localdate(Ganth.startDT);
				with (elGanthTop3) {
					while (dDag < Ganth.endDT) {
						appendTag('span', { style: 'width:' + dw + 'px', className: 'd d' + dDag.getDay(), innerText: dDag.getDate() });
						dDag.setDate(dDag.getDate() + 1);
					}
				}
				dDag = date.localdate(Ganth.startDT);
				with (elGanthTop1) {
					var v, iDate = 0;
					while (dDag < Ganth.endDT) {
						if (v != dDag.getMonth() + 1) {
							var mdays = dDag.monthDays();
							if (!v) mdays -= Ganth.startDT.getDate() - 1;
							appendTag('span', { style: 'width:' + (mdays * dw) + 'px', innerText: v = (1900 + dDag.getYear()) + '-' + (dDag.getMonth() + 1) });
						}
						iDate += dDag.getDate() + mdays;
						dDag.setDate(dDag.getDate() + mdays);
						dDag.setDate(1);
					}
				}
			}
			Ganth.startDT = date.localdate(Ganth.startDT);
			//elGanth.style = 'width:' + ((Ganth.endDT - Ganth.startDT) / 60 / 60 / 1000) + 'px;top:60px;';
			var elToday = Ganth.elGanth.appendTag('span', { className: 'today', attr: { time: date.local().toISOString() }, style: 'left:' + Ganth.left(date.local()) + 'px' });
			console.log();
			Ganth.goToday(elToday);

		},
		resetview: function (rows) {
			//el.innerText = '';
			//this.el = el.appendTag('div', { className: 'grid col aco oa' });
			with (this.el) {
				innerText = '';
				Aim.createButtonbar(appendTag('div'), {
					today: { onclick: Ganth.goToday },
					close: { className: 'r', onclick: function () { this.el.parentElement.removeChild(this.el); }.bind(this) }
				});
				//with (appendTag('div', { className: 'btnbar row bar top bgDark' })) {
				//	//appendTag('button', { className: 'abtn a-icon-filter', onclick: pecapplan.filter });
				//	appendTag('button', { className: 'abtn a-icon-calendar_today', onclick: Ganth.goToday });
				//	appendTag('a', { href: '#', className: 'abtn a-icon-close r', onclick: function () { var p = this.parentElement.parentElement.parentElement; p.parentElement.removeChild(p); } });
				//}
				//with (elPlanning = appendTag('div', { className: 'row aco planGanth' })) {
				with (appendTag('div', { className: 'row folders' })) {
					Ganth.elList = appendTag('ul', { className: 'col aco ganthrows ganthlist', onscroll: function () { Ganth.elGanth.style.top = (-this.scrollTop + 60) + 'px'; }, style: 'padding-top:60px;overflow: scroll;' });
					with (appendTag('table', { className: 'topfixed', style: 'width:100%;' })) {
						appendTag('tr').appendTag('td');
					}
				}
				with (appendTag('div', { className: 'col aco', style: 'overflow-x:scroll;overflow-y:hidden;', onwheel: function (event) { this.scrollLeft -= event.deltaY; } })) {
					Ganth.elGanth = appendTag('ul', { className: 'col ganthrows ganthchart', style: 'top:60px;' });
					with (elGanthTop = appendTag('div', { className: 'topfixed' })) {
						elGanthTop1 = appendTag('div', { className: 'Ganthh' });
						elGanthTop2 = appendTag('div', { className: 'Ganthh' });
						elGanthTop3 = appendTag('div', { className: 'Ganthh' });
					}
				}
				//}
			}
			Ganth.startDT = new Date(); Ganth.endDT = new Date();
			Ganth.bars = [];

			return;
			if (plandata.pln) {
				for (var d in plandata.pln) {
					d = date.localdate(d);
					elGanth.appendTag('span', {
						className: 'free', style: Ganthstyle(d, date.localdate(d.valueOf() + 3600000 * 24))
					});
				}
			}
		},
		writerow: function (row) {
			row.bars = row.bars || [];
			if (row.startDT && row.endDT) row.bars.push({ startDT: row.startDT, endDT: row.endDT, title: row.title, style: 'background-color:blue;' });

			//console.log('ROW', row);
			//if (row.parent) var nextSibling = row.parent.elList.nextElementSibling;
			var elGanth = this.elGanth.appendTag('li', { className: (row.state || '') + (row.children && row.children.length ? ' sum ' : '') });
			with (elGanth.appendTag('div', { className: 'tr tot rgl', onclick: function () { Aim.URL.set({ schema: row.schema, id: row.id }); }, })) {
				//row.bars = row.bars || [{ startDT: row.startDT, endDT: row.endDT, title: row.title, style: 'background:red;' }];
				//row.bars.push(row.bargroup = { className: 'bar group' });
				row.bars.forEach(function (bar) {
					Ganth.bars.push(bar.el = appendTag('div', { bar: bar, className: bar.className || 'bar', innerText: bar.title || '', style: [row.style || '', bar.style || ''].join(' ') }));
					bar.sdt = date.localdate(bar.startDT);
					bar.edt = date.localdate(bar.endDT);
					//Ganth.barup(row.parent, bar);
					if (Ganth.startDT.valueOf() > bar.sdt.valueOf()) Ganth.startDT = date.localdate(bar.sdt);
					if (Ganth.endDT.valueOf() < bar.edt.valueOf()) Ganth.endDT = date.localdate(bar.edt);
				});
			}
			var text = [row.title || row.id, row.subject, row.summary].join(', ').replace("\r\n", '');//.replace(row.parent ? row.parent.title : '', '');
			(row.elList = this.elList.appendTag('li', { className: row.className + ' ' + (row.state || ''), elGanth: elGanth, attr: row.children && row.children.length ? { open: 0 } : null })).appendTag('div', {
				innerText: text,
				title: [row.title || row.id, row.subject, row.summary, row.hint].join("\r\n"),
				className: 'tr tot rgl',
				style: row.style || '', parent: row, attr: { level: row.level = row.level || 1 },
				elGanth: elGanth, onclick: App.toggleopen,
				onclick: function () { Aim.URL.set({ schema: row.schema, id: row.id }); },
				onopen: !row.children ? null : function (openstate) {
					//console.log(this,this.elGanth);
					//var parent = this.parent;
					this.elGanth.setAttribute('open', this.parentElement.getAttribute('open'));

					//parent.bargroup.el.scrollIntoView();
					//parent.ul = { elList: parent.elList.appendTag('ul'), elGanth: parent.elGanth.appendTag('ul') };
					//parent.children.forEach(function (row) { if (!row.elList) Ganth.writerow.call(parent.ul, row); });
				}
			});//.click();
			var parent = row;
			//if (parent.id == '2752892-320') console.log(parent.id, parent);
			if (parent.children && parent.children.length) {
				parent.ul = { elList: parent.elList.appendTag('ul'), elGanth: parent.elList.elGanth.appendTag('ul') };
				parent.children.forEach(function (child) {
					child.parent = parent;
					Ganth.writerow.call(parent.ul, child);
					parent.warning = parent.warning || child.warning;
					if (child.warning) { parent.elList.setAttribute('warning', ''); }
				});
			}


		},
	}
});
