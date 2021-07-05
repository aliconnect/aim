//console.log('MOBILE aliconnect', aliconnect);
Aim.assign({
	Mobile: Mobile = {
		createElementList: function () {
			//console.log(this, this.src, this.api, this.data.value);
			var rows = this.data.value;
			with (Aim.activeList.el) {
				innerText = '';
				onscroll = function () {
					Aim.settings[this.id + '_scrollTop'] = this.scrollTop;
					App.setDelayed();
				}
				rows.forEach(function (row, i, rows) {
					//console.log(row,api.items[row.id]);
					//rows.el.appendTag('li', { className: 'col', val: App.accentsTidy(row.title) }).appendTag('a', { className: 'row aco', href: '#'+row.schema+'?id=' + row.id }).appendTag('div', { className: 'col aco' }).appendTag('div', { title: row.getAttribute('title'), innerHTML: row.getAttribute('innerHTML') || row.getAttribute('title') });
					appendTag('li', { className: 'col', val: App.accentsTidy(row.title) }).appendTag('a', {
						className: 'row aco', href: '#' + row.schema + '?id=' + row.id }).appendTag('div', { className: 'col aco' }).appendTag('div', { title: row.getAttribute('title'), innerHTML: row.titleText });
				});
				if (Aim.settings[id + '_scrollTop']) scrollTop = Aim.settings[id + '_scrollTop'];
			}
		},
		events: {
			load: function () {
				colpage = elPage = document.getElementById('elPage');
				document.getElementById('elTop').onsubmit = function(event){
					event.preventDefault();
					console.log(Aim.activeList);
					//elPage.innerText='ssss';
					//document.location.href = '#?id=&folder=' + Aim.activeSchema.name + '&q=' + (Aim.activeSchema.searchValue = elSearch.value);
					Aim.load({ get: { folder: Aim.activeList.schema.name, q: Aim.activeList.searchValue = Aim.Element.InputSearch.value }, onload: Mobile.createElementList });
					Aim.Element.InputSearch.select();
					return false;
				};
				Aim.Element.InputSearch = document.getElementById('elSearch');
				//(Aim.Element.InputSearch = document.getElementById('elSearch')).onchange = function () {
				//	//elPage.innerText='ssss';
				//	//console.log(Aim.activeSchema);
				//	//document.location.href = '#?id=&folder=' + Aim.activeSchema.name + '&q=' + (Aim.activeSchema.searchValue = this.value);
				//}
				var schema;
				console.log(Aim.api.definitions);
				if (Aim.Element.List = document.getElementById('elList'))
					for (var name in Aim.api.definitions)
						if ((schema = Aim.api.definitions[name]) && (schema.name = name) && schema.apps && ('mobile' in schema.apps)) {
							//Aim.activeSchema = Aim.activeSchema || schema;
							var el=document.getElementById('elBottom').appendTag('a', {
								schema: schema,
								id: 'btn_' + name,
								className: 'a-icon-' + (schema.className || name),
								//href: '#Mobile.list?' + name,
								el: Aim.Element.List[name] = document.getElementById('elList').appendTag('ul', { id: name + '_list', className: 'col aco' }),
								onclick: function () {
									Aim.activeList=this;
									//collist = this.el;
									//window.get.folder = 'contact';
									Aim.Element.InputSearch.value = Aim.active.searchValue || '';
									for (var i = 0, c = this.el.parentElement.getElementsByTagName('UL') ; e = c[i]; i++) e.style.display = (e == this.el ? '' : 'none');
									for (var i = 0, c = this.parentElement.children; e = c[i]; i++) if (e == this) e.setAttribute('focus', ''); else e.removeAttribute('focus');
									Aim.Element.InputSearch.select();
								},
							});
							el.appendTag('div', { innerText: name });
							Aim.activeList=Aim.activeList||el;
							//collist = collist || Aim.Element.List[name];
						};
				//collist.innerText=Aim.host+Aim.test;

				Aim.Element.InputSearch.focus();
				Aim.Element.InputSearch.select();
			},
		},
		item: function (id) {
			Aim.load({
				api: api.item[id].schema, get: { id: id, select: "*" }, onload: function () {
					console.log(this.data);
					api.item[this.get.id].write();
				}
			});
		},
		auth: true,
		host: document.location.pathname.substr(1).split('/').shift(),
	},
});
if (Aim.beforeLoad) Aim.beforeLoad();
Aim.host=Aim.host1;
//console.log(Mobile in window);
