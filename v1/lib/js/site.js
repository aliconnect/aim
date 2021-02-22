Aim.assign({
	createElementPage: function () {
		console.log('createElementPage', this.data);
		if (this.responseText && this.responseText[0] == '<') {
			with (colpage) {
				innerText = '';
				var doc = appendTag('iframe', { className: 'aco' }).contentWindow.document;
				doc.open();
				doc.write(this.responseText);
				doc.close();
			}
			return;
		}
		//if (!this.data.value) return;
		if (!this.get) return;

		var item = api[this.get.schema][this.get.id];
		//var item = api[this.data.schema][this.data.id];
		//console.log('CREATE PAGE', this.src, this.data, 'ITEM', item);
		if (Aim.Element.Selected) for (var i = 0, e; e = Aim.Element.Selected[i]; i++) e.removeAttribute('selected');
		if (item) {
			Aim.Element.Selected = document.getElementsByClassName(item.id);
			for (var i = 0, e; e = Aim.Element.Selected[i]; i++) e.setAttribute('selected', '');
			item.loaded = true;
			item.createElementPage();
		}
	},
	createElementList: function () {
		with (colpage) {
			innerText = '';
			this.data.value.forEach(Aim.createElementListRow);
		}
	},
	createElementListRow: function (item) {
		with (colpage.appendTag('div', { className: 'row header' })) {
			if (item.icon) appendTag('a', { className: 'images', href: item.href }).appendTag('img', { src: item.icon });
			with (appendTag('div', { className: 'col aco' })) {
				appendTag('h2').appendTag('a', { innerText: item.title, href: "#?schema=" + item.schema + "&id=" + item.id + "&select=*" });
				with (appendTag('div', { className: 'row path', style: 'top:-20px;' })) {
					if (item.startDT) appendTag('span', { className: 'startDT', innerText: date.localdate(item.startDT).toDateText() });
				}
				if (item.subject) appendTag('div', { className: 'subject', innerHTML: item.subject });
			}
		}
	},
	createElementHeader: function (item, i, rows, level) {
		console.log('level', level);
		with (item.elHeader = colpage.appendTag('div', { className: 'row header' })) {
			var iconsrc = item.iconsrc, href = "#?schema=" + item.schema + "&id=" + item.id + "&select=*";
			if (iconsrc) appendTag('a', { className: 'images', href: href }).appendTag('img', { src: iconsrc });
			with (appendTag('div', { className: 'col aco' })) {
				appendTag('h' + (item.level || rows.level)).appendTag('a', { innerText: item.title, href: href });
				with (appendTag('div', { className: 'row path', style: 'top:-20px;' })) {
					if (item.startDT) appendTag('span', { className: 'startDT', innerText: date.localdate(item.startDT).toDateText() });
				}
				if (item.subject) appendTag('div', { className: 'subject', innerHTML: item.subject });
				if (item.SalesPrice) appendTag('div', { className: 'SalesPrice', innerText: item.SalesPrice });
			}
		}
		return item.elHeader;
	},
	hour: new Date().toLocaleTimeString().split(':').shift(),
	api: {
		definitions: {
			Website: {
				createHomepage: function () {
					with (elBannerInner) {
						if (this.slides.length) {
							var l = this.slides.length;
							if (!aliconnect.browser || !aliconnect.browser.Version || aliconnect.browser.Version.ver[0] > 7) {
								var s = '0% {opacity: 0;animation-timing-function: ease-in;} ' + Math.round(1 / l * 20) + '% {opacity: 1;transform: scale(1.05);animation-timing-function: ease-out;} ' + Math.round(1 / l * 60) + '% {opacity: 1;transform: scale(1.1);} ' + Math.round(1 / l * 80) + '% {opacity: 1;} ' + Math.round(1 / l * 120) + '% {opacity: 0;transform: scale(1.1);} 100% { opacity: 0 }';
								Aim.cssRuleAdd('@keyframes imageAnimation', s);
								var s = '0% {opacity: 0;transform: translateX(200px);animation-timing-function: ease-out;} ' + Math.round(1 / l * 20) + '% {opacity: 1;transform: translateX(0px);animation-timing-function: ease-in;} ' + Math.round(1 / l * 60) + '% {opacity: 1;transform: translateX(0px);animation-timing-function: ease-in;} ' + Math.round(1 / l * 70) + '% {opacity: 1;transform: translateX(0px);}' + Math.round(1 / l * 90) + '% {opacity: 0;transform: translateX(-400px);animation-timing-function: ease-in;} 100% { opacity: 0;animation-timing-function: ease-in; }';
								Aim.cssRuleAdd('@keyframes titleAnimation', s);
								Aim.cssRuleAdd('.bannerimage', 'animation-duration:' + l + '0s');
								Aim.cssRuleAdd('.bannertext', 'white-space: pre;animation-duration:' + l + '0s');
							}
							else {
								Aim.cssRuleAdd('.bannerimage.idx0', 'opacity:1;');
								Aim.cssRuleAdd('.bannertext.idx0', 'opacity:1;');
							}

							for (var i = 0; i < this.slides.length; i++) {
								slide = this.slides[i];
								//console.log(slide);
								elBanner.appendTag('div', { className: 'bannerimage idx' + i });
								Aim.cssRuleAdd('.aimbanner .idx' + i, 'animation-delay: ' + i + '0s;');
								Aim.cssRuleAdd('.bannerimage.idx' + i, 'background-image:url("' + (slide.src.substr(0, 4) != 'http' ? document.location.protocol + '//aliconnect.nl' : '') + slide.src + '");');
								//console.log('content:"' + slidetext + '";');
								Aim.cssRuleAdd('.bannertext.idx' + i + '::after', 'content:"' + slide.title + '";');
							}
							for (var i = 0; i < this.slides.length; i++) { appendTag('div', { className: 'bannertext idx' + i }); }
						}
						if (this.bannerlogosrc) document.getElementById('elLogo').style.backgroundImage = 'url("https://aliconnect.nl' + this.bannerlogosrc + '")';
					}
				},
				createNavtop: function () {
					App.createTreelist(navtop, this.children);
				},
				createFooter: function () {
					if (!this.footer.children) return;



					//console.log("Footer Webpage", this.footer.Webpage);



					//this.footer.Webpage.sort(App.sort.idx);
					this.footer.Webpage.forEach(function (item) {
						//console.log(item);
						with (rowfooter.appendTag('div', { className: 'aco col' })) {
							appendTag('div', { innerHTML: item.title });
							appendTag('div', { className: 'aco', innerHTML: item.BodyHTML });
						}
					});
				},
			},
			item: {
				createElementPage: function () {
					if (!this.loaded) return this.loaded = Aim.load({ api: this.schema, get: { id: this.id, src: 1, master: 1, users: 1, select: '*' }, caller: this, callee: arguments.callee, onload: function () { this.callee.call(this.caller); } });
					colpage.innerText = '';
					colpage.appendTag('a', {
						innerText: '<', className: 'close', onclick: function () {
							Aim.URL.his({ id: 0 });
							colpage.innerText = '';
						}
					});
					this.level = 1;
					Aim.createElementHeader(this).className += ' page';
					console.log('item.createElementPage', this);
					if (this.BodyHTML) colpage.appendTag('div', { className: 'BodyHTML', innerHTML: this.BodyHTML });
					this.createElementSections();
					document.body.scrollTop = 0;
				},
				createElementSections: function () {
					//if (!this.childrenLoaded) return this.childrenLoaded = Aim.load({ api: this.schema, get: { id: this.id, child: 1 }, caller: this, callee: arguments.callee, onload: function () { this.callee.call(this.caller); } });
					if (!this.childrenLoaded) return this.childrenLoaded = Aim.load({
						//api: this.schema,
						get: {
							id: this.id,
							child: 5,
							select: "title,subject,files,filterfields,SalesPrice",
							filter: "(class='Webpage'+AND+level<2+OR+class='System')"
						}, onload: arguments.callee.bind(this)
					});
					var allChildren = [];
					items.level = 2;
					(AddAllChildren = function (item, i, items, level) {
						if (item.SalesPrice) allChildren.push(item);
						if (item.children.length) item.children.forEach(AddAllChildren);
					})(this);
					console.log('allChildren', allChildren);
					if (allChildren.length) {
						if (allChildren.length > 1) {
							colpage.innerText = '';
							Aim.collist.show(allChildren);//allChildren.forEach(Aim.createElementHeader, 2);
						}
					}
					else this.children.forEach(Aim.createElementHeader, 2);
					//this.elHeader.scrollIntoView();
				},
				createElementList: function (item, i) {
					if (i > 50) return;
					item = item || this;
					item.href = '#' + item.schema + '/' + item.id;
					with (elList.appendTag('li', { className: 'row' })) {
						if (item.icon) appendTag('a', { className: 'images', href: item.href }).appendTag('img', { src: item.icon });
						with (appendTag('div', { className: 'col aco' })) {
							appendTag('a', { innerText: item.title, href: item.href });
							with (appendTag('div', { className: 'row aco' })) {
								'subject,summary,startDT,schema'.split(',').forEach(function (name) {
									if (item[name]) appendTag('span', { className: '' + name, innerHTML: item[name] });
								});
								for (var name in item.values) {
									appendTag('span', { className: '' + name, innerHTML: getAttribute(item, name) });
								}
							}
						}
					}
				}
			},
		},
	},
	events: {
		init: function (event) {
			//console.log(site);
			Aim.load({
				get: 'itemsite' in window ? itemsite : { folder: "Website", select: "title,files,Slogans", q: "*", filter: "masterID=" + Aim.access.host.id }, onload: function (event) {
					console.log(this.src, this.data);
					itemsite = this.data.value.shift();
					Aim.load({
						get: { schema: "Website", id: itemsite.id, top: 0, child: 4, select: "title,idx", filter: "startDT+IS+NOT+NULL" }, onload: function () {
							//console.log(api.items[]);
							itemsite.slides = [];
							itemsite.slogans = itemsite.Slogans ? itemsite.Slogans.split("\n") : [];
							console.log(itemsite, itemsite.slogans, itemsite.files);
							if (itemsite.files) {
								for (var i = 0, slide; slide = itemsite.files[i + 2]; i++) itemsite.slides.push({ src: slide.src, title: itemsite.slogans[i] || '' });
							}
							itemsite.bannerlogosrc = itemsite.files && itemsite.files[1] ? itemsite.files[1].src : itemsite.files && itemsite.files[0] ? itemsite.files[0].src : '';
							itemsite.createHomepage();

							for (var i = 0; itemsite.footer = itemsite.children[i]; i++) if (itemsite.footer.title == 'Footer') {
								itemsite.children.splice(itemsite.children.indexOf(itemsite.footer), 1);
								Aim.load({ get: { folder: itemsite.footer.id, child: 1, select: "title,BodyHTML" }, onload: itemsite.createFooter.bind(itemsite) });
								break;
							}
							itemsite.createNavtop();
							console.log('itempage', window.itempage, get);
							var homepage = itemsite.children[0];
							//itempage = window.site && site.pageID ? { schema: "Webpage", id: site.pageID } : itemsite.children[0];
							//window.history.replaceState("page", "PAGINA", "/");
							//if (!window.get.q) Aim.URL.setitem(itempage);
							//Aim.URL.setitem(itempage);

							Aim.nav({ schema: get.schema || homepage.schema, id: get.id || homepage.id });
						}
					});
					document.getElementById('elApp').href = (document.location.host == 'localhost' ? '/' : document.location.protocol + '//aliconnect.nl/') + Aim.access.host.name + '/app/om/';
					if (document.getElementById('q')) q.onchange = function (event) {
						colpage.innerText = '';
						Aim.URL.set({ q: this.value, id: '' });
					}
				}
			});
		},
	},
});
//console.log('site loaded', api.definitions.item);




//if (Aim.beforeLoad) Aim.beforeLoad();
