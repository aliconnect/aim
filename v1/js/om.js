Aim.assign(OM = {
	definitions: {
		item: {
			editclose: function (event) {
				if (event) return this.item.editclose();
				delete Aim.navtree.elFocus;
				this.editing = false;
				//this.loaded = false;
				document.getElementById('ckeTop').style = "display:none;";
				document.body.appendChild(document.getElementById('ckeTop'));
				if (OM.elEdit && OM.elEdit.parentElement == colpage) colpage.removeChild(OM.elEdit);
				if (OM.elCover) OM.el.removeChild(OM.elCover);
				this.write();
				//if (OM.elPc) OM.elPc.innerText = '';
			},
			edit: function () {
				Aim.navtree.editing = this.editing = true;
				//Aim.navtree.editItem = this;
				this.editTitle = this.elInp.innerText || "";
				if (this.treeTitleAttributeName) this.editTitle = this[this.treeTitleAttributeName];
				//for (var attributeName in this.attributes) if (this.attributes[attributeName].default) {
				//	this.editTitle = this.getAttribute(attributeName).value || "";
				//	break;
				//}

				this.elInp.innerText = "";
				Aim.navtree.elInp = this.elEditInp = this.elInp.appendTag('input', {
					className: 'aco',
					item: this,
					initValue: this.editTitle,
					value: this.editTitle,
					onblur: function (event) {
						console.log("BLUR EDIT", Aim.navtree.editing, Aim.navtree.elInp.value, Aim.navtree.elInp.initValue);
						if (Aim.navtree.editing && Aim.navtree.elInp.value != Aim.navtree.elInp.initValue) {
							Aim.navtree.editing = false;
							var par = {};
							//for (var name in this.item.attributes) if (this.item.attributes[name].default) break;
							//if (!name) for (var name in this.item.attributes) if (this.item.attributes[name].kop == 0) break;
							console.log("BLUR EDIT SET", this.item.treeTitleAttributeName, this.value);
							this.item.setAttribute(this.item.treeTitleAttributeName || 'title', this.value);
							Aim.navtree.editcancel();
							this.item.select();
						}
					},
					onkeypress: function (event) { if (event.key === 'Enter') this.onblur(event); }
				});
				this.elEditInp.focus();
				this.elEditInp.select();
			},
			open: function (event) {
				//console.log('item.open', this.id, this.title, arguments.callee.caller);

				if (this.item) return this.item.open();
				//console.log('OPEN', this.id, this.title, this.masterID);
				this.opened = 1;
				//if (!('masterID' in this)) return Aim.load({ get: { id: this.id }, masterID: this.masterID = null, onload: arguments.callee.bind(this) })
				//if (this.master) this.master.open();
				if (!this.treeLoad) return Aim.load({ get: { folder: this.id, child: 1, select: Aim.config.coltree.select, filter: Aim.config.coltree.filter }, treeLoad: this.treeLoad = true, onload: arguments.callee.bind(this) });
				if (this.onloaditems) {
					this.onloaditems();
					this.onloaditems = null;
				}
				this.reindex();
				//if (this.elUl && this.elUl.lastChild) this.elUl.lastChild.scrollIntoViewIfNeeded({ block: "end", inline: "end" });
				//if (this.elDiv) this.elDiv.scrollIntoViewIfNeeded({ block: "start", inline: "start" });

				//if (this.elUl && this.elUl.lastChild) this.elUl.lastChild.scrollIntoViewIfNeeded(false);
				//if (this.elDiv) this.elDiv.scrollIntoViewIfNeeded(false);

				if (OM.appendChildPar) {
					Aim.navtree.itemFocus.appendChild(null, OM.appendChildPar);
					OM.appendChildPar = null;
				}
			},
			close: function (event) {
				var item = this.item || this;
				if (item.opened) item.elLi.setAttribute('open', item.opened = 0);
			},
			focus: function (event) {
				if (!event) event = window.event;
				//Aim.setfocus(navtree);
				//console.log('FOCUS', Aim.navtree, Aim.navtree);
				if (Aim.navtree.itemFocus && Aim.navtree.itemFocus.elLi) {
					Aim.navtree.itemFocus.elLi.removeAttribute('focus');
					OM.selitems.push(Aim.navtree.itemFocus);
				}
				OM.selitems.forEach(function (e) { if (!e.elLi.getAttribute('checked')) e.elLi.removeAttribute('checked'); });

				Aim.targetItem = OM.selectEndItem = Aim.navtree.itemFocus = Aim.navtree.itemFocus = this;

				Aim.Element.scrollIntoView(Aim.navtree.itemFocus.elDiv);


				if (Aim.navtree.itemFocus.elLi) {
					Aim.navtree.itemFocus.elLi.setAttribute('focus', '');
					if (event.shiftKey) {
						OM.selitems = [this];
						var c = navtree.getElementsByTagName('li');
						var selactive = 0;
						for (var i = 0, e; e = c[i]; i++) {
							if (e.item == OM.selectStartItem) { selactive ^= 1; if (OM.selitems.indexOf(e.item) == -1) OM.selitems.push(e.item); }
							if (e.item == OM.selectEndItem) { selactive ^= 1; if (OM.selitems.indexOf(e.item) == -1) OM.selitems.push(e.item); }
							if (selactive && OM.selitems.indexOf(e.item) == -1) OM.selitems.push(e.item);
						}
						OM.selitems.forEach(function (e) { e.elLi.setAttribute('checked', ''); });
					}
					else if (event.ctrlKey) {
						OM.selitems.push(this);
						OM.selitems.forEach(function (e) { e.elLi.setAttribute('checked', ''); });
					}
					else {
						OM.selitems = [this];
						OM.selectStartItem = OM.selectEndItem;
					}
				}
			},
			select: function (event) {
				var item = this.item || this;
				item.focus();
				if (get.folder == item.id) return Aim.URL.setitem(item);
				Aim.URL.set({ schema: item.schema, id: item.id });
				Aim.URL.set({ folder: item.id, child: 1, filter: "finishDT+IS+NULL", q: '*', title: item.title });

				//if (Listview.get.id != item.id) Listview.set({ folder: item.schema, id: item.id, select: "title,subject,summary", filter: "finishDT+IS+NULL", child: 1, q: '*', title: item.title });
				//else Aim.URL.set({ schema: item.schema, id: item.id });
				//Aim.URL.set({ folder: item.schema, id: item.id, select: "title,subject,summary", filter: "finishDT+IS+NULL", child: 1 });

				//return;
				//if (this.listLoad) return Aim.createElementList.call({ data: { value: this.children } });
				//this.listLoad = true;
				//Aim.load({
				//	api: this.schema || 'item', get: {
				//		id: this.id, child: 1, select: "title,subject,summary", filter: "finishDT+IS+NULL",
				//	}, onload: Aim.createElementList
				//});
			},
			createTreenode: function () {
				if (this.elDiv) with (this.elDiv) {
					if ('selected' in this) this.elLi.setAttribute('sel', this.selected);
					//if (this == Aim.pageItem) {
					//	//setAttribute('selected', '');
					//	Aim.Element.scrollIntoView(this.elLi);//.scrollIntoViewIfNeeded({ block: "start", inline: "start" });
					//}
					innerText = '';
					with (appendTag('sym')) for (var i = 0; i < 3; i++) appendTag('i');
					appendTag('open', { item: this, onclick: this.elDiv.ondblclick });
					if (this.groupname) setAttribute('groupname', this.groupname);
					this.elInp = appendTag('span', {
						className: 'title aco icn ' + (this.className || this.schema),
						innerText: this.title,
						//title: this.tooltipText,
						item: this,
						ondblclick: function (event) {
							event.stopPropagation();
							console.log('TOGGLE SELECT');
							this.elLi.setAttribute('sel', this.selected ^= 1);
							this.set({ selected: this.selected });
						}.bind(this),
					});
					if (this.typical && this.srcID && this.srcID != this.masterID) this.elInp.appendTag('a', {
						className: 'typical', innerText: this.typical,
						//href: '#id=' + this.srcID,
						//onclick: function (event) {
						//	//console.log('stopPropagation');
						//	event.stopPropagation();
						//}
					});
					if (this.detailID) appendTag('ico', { className: 'icn hyperlink' });
					if (this.srcID) appendTag('ico', { className: 'icn ' + (this.isClass ? 'typical' : this.inheritedID ? 'inherit' : 'source') });
					//if (this.inheritID) appendTag('ico', { className: 'inherit' });
					if (this.activeCnt || (this.values && this.endDT && !this.finishDT)) {
						appendTag('ico', { className: 'icn flag ' + (this.endDT && !this.finishDT ? 'task' : '') });
					}
				}
			},
			appendTo: function (elUl) {
				if (elUl && elUl.parentElement) {
					if (this.elLi) return elUl.appendChild(this.elLi);
					with (this.elLi = elUl.appendTag('li', { item: this })) {
						if (this.hasChildren) setAttribute('open', 0);
						this.elDiv = appendTag('div', {
							className: ['row', this.reltype, this.id, this.srcID == this.masterID ? 'derived' : ''].join(' '),
							item: this,
							isClass: this.isClass,
							onclick: function (event) {
								//code voor het selecteren van meerdere items in de tv
								if (event.shiftKey) {
									var c = Aim.navtree.el.getElementsByTagName('li');
									for (var i = 0, e; e = c[i]; i++) {
										if (e == Aim.navtree.itemFocus.elLi) Aim.navtree.selstart = i;
										else if (e.item == this.item) Aim.navtree.selend = i;
									}
									//Aim.navtree.showsel(Aim.navtree.selend);
								}
								else if (event.ctrlKey) {
									Aim.navtree.itemFocus.elLi.setAttribute('copysel', '');
									this.parentElement.setAttribute('copysel', '');
								}
								else {
									this.item.select();
								}
							},
							ondblclick: this.toggle,
							contextmenu: Aim.popupmenuitems(this),
							draggable: true,
							write: this.createTreenode.bind(this),
						});
						this.elUl = appendTag('ul');
					}
					this.elDiv.write();
				}
			},

			init: function () {
			},

			//refresh: function () {
			//	//console.log('PLACEID', this.properties.placeid);
			//	//if (this.properties.placeid && this.properties.placeid.value) {
			//	//    Aim.load({
			//	//        msg: 'Loading placeid ' + (this.name || this.id), src: "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyAKNir6jia2uSgmEoLFvrbcMztx-ao_Oys&placeid=" + this.properties.placeid.value, item: this, onload: function (event) {
			//	//            console.log('PLACEID', this.responseText);
			//	//        }
			//	//    });
			//	//}

			//	App.listitem.call(this);
			//},
			fieldDefault: function () {
				for (var attributeName in this.properties) { if (this.properties[attributeName].default) break; }
				if (!attributeName) for (var attributeName in this.properties) { if (this.properties[attributeName].kop === 0) break; }
				return this.properties[attributeName];
			},
			getTitleAttributeName: function () {
				return this.treeTitleAttributeName ? this[this.treeTitleAttributeName] : "Unknown treeTitleAttributeName";
				//for (var attributeName in this.attributes) { if (this.attributes[attributeName].default) break; }
				//if (!attributeName) for (var attributeName in this.attributes) { if (this.attributes[attributeName].kop === 0) break; }
				//return attributeName;
			},
			favToggle: function (event) { (this.item || this).fav ^= 1; },
			showinfo: function () {
				//this.load(function () {
				with (Aim.Element.info) {
					innerText = '';
					this.WriteHeader(appendTag('div', { className: 'row header' }));
					with (appendTag('div', { className: 'row btnbar' })) {
						appendTag('a', {
							className: 'abtn icn form r', onclick: Aim.Element.onclick, par: { id: this.itemID, lid: this.itemID }, onclick: function (event) {
								console.log('show ifo');
								event.stopPropagation();
								Aim.Element.info.innerText = '';
							}
						});
					}
					var elDetails = appendTag('div', { className: 'details' });
					elDetails.appendTag('div', { className: 'name', innerText: this.title });
					this.writedetails(elDetails);
				}
				//});
			},
			submit: function (event) {
				if (event) {
					event.preventDefault();
					return this.item.submit();
				}
				//console.log('SUBMIT', this, this.elUsers.innerText, this.oldusers);
				var item = { id: this.id };
				//console.log(this.oldusers, this.elUsers.innerText);
				if (this.oldusers != this.elUsers.innerText) {
					var users = (this.link = this.link || {}).users = [];
					item.userlist = {};
					for (var i = 0, e, c = this.elUsers.getElementsByTagName('a') ; e = c[i]; i++) if (e.id) users.push(item.userlist[e.innerText] = e.id);// || e.getAttribute('itemID') || '';
				}
				//console.log('SUBMIT ITEM', item);
				//console.log('item.submit', document.activeElement);
				this.editclose();
				setTimeout(function (item) {
					//console.log(item);
					//return;
					Aim.load({
						api: 'item', put: { value: [item] }, get: { reindex: 1 }, onload: function () {
							//console.log('USERS POST', this.responseText, this.put);
						}
					});
				}, 10, item);
			},
			post: function (postfields) {
				setItems([{ id: this.id, schema: this.schema, values: postfields }], true);
			},
			networkdiagram: function (event) {
				Aim.load({
					api: 'network', get: { id: this.item.id }, item: this.item, onload: function () {
						console.log(this.src, this.data);
						new Aim.graph(collist.appendTag('div', { className: 'slidepanel col bgd oa pu', }), this.data);
						//if (!Aim.graph.init()) return;
						//Aim.graph(collist.appendTag('div', { className: 'slidepanel col bgd oa pu', }), this.data);
					}
				});
			},
			model3d: function (event) {
				console.log('MODEL 3d', this.id, this, this.item);
				Three.create(collist.appendTag('div', { className: 'col pu aco bgd' }), this.id);
			},
			model2d: function (event) {
				console.log('MODEL 2d', this.id, this, this.item);
				Aim.load({
					api: "model2d", get: { masterID: this.id }, onload: function (event) {
						with (collist) {
							innerText = '';
							var btns = {
								filter: { title: 'Lijst filteren', onclick: function (event) { OM.show({ flt: get.flt ^= 1 }); } },
							}
							Aim.createButtonbar(appendTag('div'), this.btns);
							var ondrop = function (event) {
								console.log(event, this, event.clientX, event.clientY);
								event.stopPropagation();
								var childItem = Aim.dragdata.item;
								with (this.newTag = this.appendTag('div', { title: childItem.title, className: 'symbol icn ' + childItem.schema + " " + childItem.typical + " " + (childItem.name || childItem.title) + " " + childItem.id, item: childItem, id: childItem.id, attr: { Value: 1 } })) {
									style.top = (event.offsetY - 25) + 'px';
									style.left = (event.offsetX - 25) + 'px';
								}
								var children = [];
								Aim.load({ api: "model2d", get: { id: this.id, }, put: { masterID: this.id, childID: childItem.id, offsetTop: this.newTag.offsetTop, offsetLeft: this.newTag.offsetLeft } });
								return false;
							}
							with (this.elContent = appendTag('div', { className: "row aco model2d", id: this.get.masterID, ondrop: ondrop })) {
								this.data.forEach(function (row) {
									var childItem = api.item[row.id];
									with (appendTag('div', { title: row.title, className: 'symbol icn ' + row.schema + " " + row.typical + " " + (childItem.name || childItem.title) + " " + row.id, id: row.id, attr: { Value: childItem.Value }, onclick: Aim.Element.onclick, set: { schema: row.schema, id: row.id } })) {
										style.top = (row.offsetTop) + 'px';
										style.left = (row.offsetLeft) + 'px';
									}
								});

							}
						}
					}
				});

			},
			setShop: function () {
				Aim.clientID = this.item.itemID;
				shop.init();
			},
			toggle: function (event) {
				if (event) {
					//console.log('toggle');
					event.stopPropagation();
					return this.item.toggle();
				}
				if (!this.opened) this.open(); else if (this.items.length) this.elLi.setAttribute('open', this.opened = 0);
			},
			appendChild: function (itemBefore, item, sourceItem, noedit) {
				item = item || {};
				item.masterID = this.detailID || this.id;
				if (sourceItem) {
					item.schema = sourceItem.schema;
					item.userID = 0;
					item.srcID = sourceItem.id;
				}
				item.idx = itemBefore ? this.items.indexOf(itemBefore) + 1 : this.items.length;
				//console.log();
				this.items.forEach(function (row, i) { row.idx = i < item.idx ? i : i + 1; });
				console.log('post', item);
				Aim.load({
					method: 'post', input: item, master: this, itemBefore: itemBefore, noedit: noedit, onload: function () {
						console.log('POST RESPONSE', this.responseText);
						//console.log('ADDED', this.src, this.put, this.data, this.responseText);
						var id = this.data.value.shift().id;
						var item = Aim.get(id), elBefore = (this.itemBefore) ? this.itemBefore.elLi.nextElementSibling : null;//this.master.elUl.firstChild;
						item.selectall = true;
						item.master.children.sort(function (a, b) { return a.idx > b.idx ? 1 : a.idx < b.idx ? -1 : 0; });
						//console.log('ADDED', item.idx, item.master.items.indexOf(item));

						if (item.master.elLi) item.master.elLi.setAttribute('open', item.master.opened = 1);
						item.appendTo(item.master.elUl);
						//console.log(this.master);//MAXJE
						//this.master.elUl.insertBefore(item.elLi, elBefore);
						//this.master.children.sort(function (a, b) { return a.idx > b.idx ? 1 : a.idx < b.idx ? -1 : 0; });
						for (var i = 0, child; child = item.master.children[i]; i++) { item.master.elUl.appendChild(child.elLi); }

						//this.master.items.length = 0;
						//for (var i = 0, e; e = c[i]; i++) { e.item.idx = i; this.master.items.push(e.item); }
						//item.select();
						if (this.noedit) return Aim.URL.set({ schema: item.schema, id: item.id });
						item.focus();
						item.edit();
					}
				});
			},
			movetoidx: function (master, idx, noput) {
				if (Number(master)) master = api.items[master];

				//console.log('MOVE TO IDX', this.id, this.idx, idx, master.id);
				if (this.master) {
					this.master.children.splice(this.index, 1);
					this.master.children.forEach(function (row, i) { row.idx = i });
				}
				var set = {};
				if (this.master != master) {
					if (this.isClass && master.isClass) {
						this.srcID = master.id;
					}
					else if (this.isClass && !master.isClass) {
						if (confirm("Class '" + this.title + "' moved into object '" + master.title + "', do you want to instantiate?")) return this.copytoidx(master, idx);
						if (confirm("Make '" + this.title + "' a derived class from '" + master.title + "'?")) set.srcID = master.id;
						else if (!confirm("Continue move?")) return;
					}
					else if (!this.isClass && master.isClass) {
						if (confirm("Object '" + this.title + "' moved into class '" + master.title + "', make this an inherited?")) set.srcID = master.id;
						//else if (!confirm("Continue move?")) return;
					}
				}
				this.masterID = master.id;
				//if(set.srcID)this.srcID=set.srcID;
				if (idx != undefined) this.master.children.splice(idx, 0, this); else this.master.children.push(this);
				this.idx = this.master.children.indexOf(this);



				if (this.elDiv) this.elDiv.write();
				var item = { id: this.id, idx: this.idx || 0, masterID: this.masterID, srcID: this.srcID, values: {} };

				if (this.isClass) {
					this.srcID = this.masterID;
					for (var name in this.attributes) {
						if (name == 'srcID' || this.attributes[name].idname == 'srcID') item.values[name] = { itemID: item.srcID, value: api.item[item.srcID].title };
					}
				}



				for (var name in this.attributes) {
					if (name == 'masterID' || this.attributes[name].idname == 'masterID') item.values[name] = { itemID: item.masterID, value: api.item[item.masterID].title };
					//if (set.srcID && (name == 'srcID' || this.attributes[name].idname == 'srcID')) item.values[name] = { itemID: item.srcID, value: api.item[item.srcID].title };
				}
				//console.log('MOVE TO IDX', item);


				//if (this.elLi) {
				//	//var rect = this.elLi.getBoundingClientRect();
				//	//console.log('MOVE RECT', rect);
				//	//this.focus();
				//	//this.elLi.scrollIntoView();
				//}

				if (noput) return this.master.open();
				//console.log(Aim.wss);
				Aim.wss.send({ value: [{ id: this.id, operations: { movetoidx: [master.id, idx, true] } }] });
				this.master.open();
				Aim.load({
					api: this.schema, item: this, put: { value: [item] }, onload: function () {
						//console.log('MOVETO RESPONSE', this.src, this.put, this.data);
						//this.item.master.open();
					}
				});
				Aim.Element.scrollIntoView(this.elDiv);//.scrollIntoViewIfNeeded({ block: "start", inline: "start" });
			},
			copytoidx: function (master, idx) {
				console.log('COPY TO', master, idx);
				master.appendChild(null, { srcID: this.detailID || this.id });
				this.master.reindex();
			},
			ident: function (event) {
				if (this.elLi.previousElementSibling) {
					this.idx = 9999999;
					var master = this.elLi.previousElementSibling.item;
					this.movetoidx(master);
					console.log('ident', this.elLi);
				}
			},
			unident: function (event) {
				if (!this.master || !this.master.master) return;
				this.movetoidx(this.master.master, this.master.idx + 1);
			},
			moveup: function () {
				//console.log('MOVE UP', this.id, this.title, this.idx, this.index, this.master.children.length);
				if (this.master && this.idx > 0) this.movetoidx(this.master, this.idx - 1);
			},
			movedown: function () {
				//console.log('MOVE DOWN', this.id, this.title, this.idx, this.index, this.master.children.length);
				if (this.master && this.idx < this.master.children.length - 1) this.movetoidx(this.master, this.master.children.indexOf(this) + 1);
			},

			setAttr: function (row) {
				row.id = this.id;
				Aim.load({
					msg: 'SetAttr ' + this.title,
					api: 'item',
					post: { row: JSON.stringify(row) },
					item: this,
					onload: function () { console.log(this.responseText); }
				});
			},
			selectitemcheckchildren: function (value) {
				if (isnull(this.selected, false) !== false) {
					this.selectcnt = 0;
					for (var i = 0, e; e = this.api.item[i]; i++) if (e.selected) this.selectcnt += 1;
					if (this.selectcnt) this.selectitemset(1);
					else this.selectitemset(0);
					if (this.parent && this.parent.selectitemcheckchildren) this.parent.selectitemcheckchildren();
				}
			},
			selectitemset: function (value) {
				if (this.groupname) {
					var c = this.elLi.parentElement.children;
					for (var i = 0, e; e = c[i]; i++) if (e.item.groupname == this.groupname && e.item.selected) {
						e.setAttribute('sel', 0);
						e.item.selected = 0;
						e.item.set({ selected: e.item.selected });
						e.item.close();
					}
				}
				var a = [];
				var ia = [];
				e = this.elLi;
				if (value) {
					while (e.item) {
						a.push(e);
						e = e.parentElement.parentElement;
					}
				}
				else
					a.push(e);
				var c = this.elLi.getElementsByTagName('LI');
				for (var i = 0, e; e = c[i]; i++) a.push(e);
				for (var i = 0, e; e = a[i]; i++) {
					e.item.selected = value;
					e.setAttribute('sel', value);
				}
				this.set({ selected: value });
			},
			selectitem: function (event) {
				if (event) {
					//console.log('selectitem stopPropagation');
					event.stopPropagation();
					return this.item.selectitem();
				}
				this.selectitemset(this.elLi.getAttribute('sel') ^ 1);

			},
		},
		task: {
			usertasks: {
				onload: function () {
					return;
					//console.log(api.task, App.cache['task/usertasks'].task);
					this.items = Aim.Object.toArray1(App.cache['task/usertasks'].task);
					this.items.forEach(function (row) {
						if (row.lastvisitDT) row.lastvisitDT = new Date(row.lastvisitDT);
						if (row.values) {
							if (row.endDT) row.endDT = new Date(row.endDT);
							if (row.startDT) row.startDT = new Date(row.startDT);
						}
						//pnl.task.data.push(row);
					});
					this.items.sort(function (a, b) {
						var sortkeys = { lastvisitDT: -1, state: 1, endDT: 1, startDT: 1 };
						for (var fname in sortkeys) {
							if (a[fname] > b[fname]) return sortkeys[fname];
							else if (a[fname] < b[fname]) return -sortkeys[fname];
						}
					});
					OM.listitems.call(this.items);
					//console.log(this.items);
					this.OM.show();

				}
			}
		}
	},

	mod: {},
	navleft: {
		createElementList: function (el, items) {
			Object.forEach(items, function (item, name) {
				//console.log(item);
				item.el = Object.assign(item.el = el.appendTag('li'), { elDiv: item.el.appendTag('a', Object.assign(item, { className: 'abtn icn ' + (item.className || name), innerText: item.title || name, onclick: Aim.Element.onclick })), elUl: item.el.appendTag('ul') });
				if (item.items) {
					item.el.elDiv.setAttribute('open', 0);
					this.createElementList.call(this, item.el.elUl, item.items);
				}
			}.bind(this));
		},
		create: function (el) {
			//console.log(this, el);
			this.el = el;
			el.className += ' navleft';
			//document.getElementById().style.maxWidth
			el.style.maxWidth = Aim.cookie[el.id + '.width'] || '200px';
			//console.log(Aim.OM);
			this.items.Meer = { className: "folder", get get() { return { tv: get.tv ? null : 2, lv: 1, id: null, brd: null } } };
			var s = '';
			with (this.elTop = el.appendTag('ul')) {
				appendTag('li', { className: 'row btnbar menusmall' }).appendTag('a', {
					className: 'abtn icn menu', onclick: function () {
						this.el.setAttribute('small', this.el.getAttribute('small') ^ 1);
						if (window.onWindowResize) window.onWindowResize();
					}.bind(this)
				});
				return this.createElementList(this.elTop, this.items);
			}
		},
	},
	focus: null, action: {}, ai: {}, selitems: [], pucard: null, classitems: [], copy: [], par: {}, mousemovetimer: null, selectStartItem: null, selectEndItem: null, elActive: null, search: document.location.search, hashchanged: false,
	clipitems: [],
	docview: null, bagquant: {}, field: {}, windowshare: null, lastScrollTop: 0, menus: {}, page: {}, browser: {},
	listpanel: function () {
		this.elContainer = collist.appendTag('div', { className: 'listpanel' });
		with (this.elContainer) {
			this.el = appendTag('div', { className: 'col aco' });
			this.elBtns = appendTag('div', { className: 'row top btns' });
			this.elBtns.appendTag('a', { el: this.elContainer, className: 'abtn close', onclick: function () { collist.removeChild(this.el) } });
		}
	},
	seperator: function () {
		this.start = function (event) {
			if (event.which == 1) {
				event.stopPropagation();
				event.preventDefault();
				window.getSelection().removeAllRanges();
				if (!event) event = window.event;
				this.el = this.hasAttribute('right') ? this.nextElementSibling : this.previousElementSibling;
				var rect = this.getBoundingClientRect();
				this.offsetMouse = event.clientX - rect.left;
				this.startLeft = this.offsetLeft;
				this.setAttribute('active', '');
				elResize = this;
				elResize.style.left = '0px';
				document.addEventListener("mouseup", this.checkmouseup, true);
				document.addEventListener("mousemove", this.doresizeelement, true);
			}
		};
		this.doresizeelement = function (event) {
			window.getSelection().removeAllRanges();
			elResize.style.left = (event.clientX - elResize.startLeft - elResize.offsetMouse) + 'px';
		};
		this.checkmouseup = function (event) {
			document.removeEventListener("mousemove", elResize.doresizeelement, true);
			document.removeEventListener("mouseup", elResize.checkmouseup, true);
			elResize.el.style.maxWidth = elResize.hasAttribute('right') ?
				(elResize.el.offsetWidth + elResize.startLeft - elResize.offsetLeft) + 'px' :
				(elResize.el.offsetWidth - elResize.startLeft + elResize.offsetLeft) + 'px';
			document.cookie = elResize.el.id + '.width=' + elResize.el.style.maxWidth;
			elResize.style.left = 0;
			elResize.removeAttribute('active');
			elResize = null;
		};
		this.addEventListener("mousedown", this.start);
		this.className += ' seperator noselect';
	},
	showmsg: function (e, msg) {
		e.onblur = e.onkeydown = function () { elInpInfo.innerText = ''; };
		e.parentElement.removeAttribute('hidden');
		elInpInfo.innerText = '';
		var rect = e.getBoundingClientRect();
		if (rect.top == 0) {
			e.parentElement.parentElement.firstChild.click();
			var rect = e.getBoundingClientRect();
		}
		elInpInfo.style.left = rect.left + 'px';
		elInpInfo.style.maxWidth = rect.width + 'px';
		elInpInfo.style.top = (rect.top + rect.height + 5) + 'px';
		elInpInfo.appendTag('div', { innerText: msg });
		Aim.Element.scrollIntoView(e);//.scrollIntoView();
		e.select();
		e.focus();
		return false;
	},
	start: function () {
		//alert('Start');
		Aim.load({
			api: 'account/start', onload: function () {
				console.log(this.data);
			}
		})
	},
	selection: {
		//get cliplist() {
		//	var a = [];
		//	for (var i = 0, item; item = OM.clipitems[i]; i++) a.push({ id: item.id });
		//	return a;
		//},
		cancel: function (event) {
			//items.selaction = null;
			//for (var i = 0, item; item = OM.selapi.item[i]; i++) {
			//    item.checked = 0;
			//    if (item.elLvLi) item.elLvLi.removeAttribute('checked');
			//    if (item.elLi) item.elLi.removeAttribute('checked');
			//}
			//OM.selitems = [];
			//OM.selitems = [];
			//var c = document.getElementsByTagName('li');
			//for (var i = 0, e; e = c[i]; i++) {
			//    if (e.item && e.getAttribute('checked') != undefined) {
			//        e.removeAttribute('checked');
			//    }
			//}
			console.log(OM.clipitems);

			OM.clipitems.forEach(function (item) { item.elLi.removeAttribute('checked'); });
			OM.clipitems = [];
			OM.selitems.forEach(function (item) { item.elLi.removeAttribute('checked'); });
			OM.selitems = [Aim.navtree.itemFocus];
			OM.selectStartItem = null;

		},
		//copyToClipboard(event) {
		//	var data = { value: [] };
		//	for (var i = 0, item; item = OM.clipitems[i]; i++) data.value.push({ id: item.id });
		//	event.clipboardData.setData('application/json', JSON.stringify(data));
		//	//event.clipboardData.setData('text/plain', 'MAX PLAIN');
		//	//event.clipboardData.setData('text/html', '<b>MAX HTML</b>');

		//	Aim.hiddeninput.value = ' ';
		//	Aim.hiddeninput.focus();
		//	Aim.hiddeninput.select();
		//	event.preventDefault();

		//},
		//copy: function (event) {
		//	OM.clipitems.forEach(function (e) { e.elLi.removeAttribute('checked'); });
		//	OM.clipitems = [];
		//	OM.selitems.forEach(function (e) { OM.clipitems.push(e); e.elLi.setAttribute('checked', 'COPY'); });
		//	OM.selection.copyToClipboard(event);
		//},
		//cut: function (event) {
		//	OM.clipitems.forEach(function (e) { e.elLi.removeAttribute('checked'); });
		//	OM.clipitems = [];
		//	OM.selitems.forEach(function (e) { OM.clipitems.push(e); e.elLi.setAttribute('checked', 'CUT'); });
		//	OM.selection.copyToClipboard(event);
		//},
		paste: function (event) {
		},
		link: function () {
			for (var i = 0, o; o = OM.selapi.item[i]; i++) {
				console.log(o);
			}
		},
		delete: function () {
			for (var i = 0, o; o = OM.selapi.item[i]; i++) {
				console.log(o);
			}
		},
	},
	Frame: {
		show: function (src) {
			src = src.src || src;
			with (OM.elFrame = colpage.appendTag('div', { className: 'col aco iframe' })) {
				with (appendTag('div', { className: 'row top' })) {
					appendTag('button', { className: 'abtn icn r print', onclick: function (event) { event.stopPropagation(); OM.elIFrame.contentWindow.print(); } });
					appendTag('button', { className: 'abtn icn close', onclick: function (event) { event.stopPropagation(); colpage.removeChild(OM.elFrame); } });
				}
				OM.elIFrame = appendTag('iframe', { className: 'aco', src: src });
			}
		},
	},
	search: {
		getItems: function (q, classID) {
			this.length = 0;
			var sourceitems = classID ? OM.classapi.item[classID] : items;
			//if (!sourceitems) return false;
			var words = q ? q.trim().toLowerCase().split(' ') : '';
			if (sourceitems && sourceitems.length) sourceitems.forEach(function (row, itemID) {
				if (row.searchname) {
					var cnt = 0;
					for (var i = 0, word; word = words[i]; i++) if (row.searchname.indexOf(word) != -1) cnt++;
					if (cnt == words.length) this.push(row);
				}
			}, this);
			this.q = q;
			return true;//listitems;
		},
	},
	setactivestate: function (activestate) {
		//console.log('setactivestate', activestate);
		//var data = { activestate: activestate, accountID: Aim.client.account.id, userID: Aim.client.user.id, to: [Aim.key] };
		//fieldset(Aim.client.user.id, 'state', activestate, true);
		//fieldset(Aim.client.account.id, 'state', activestate, true);


		return;

		Aim.wss.send({
			//broadcast: true,
			//to: { host: Aim.client.domain.id },
			value: [{ id: Aim.client.user.id, values: { state: activestate } }, { id: Aim.client.account.id, values: { state: activestate } }]
		});

		//Aim.wss.send(data);
		//Aim.wss.send({ a: 'set', id: Aim.client.account.id, name: 'online', value: false });
		//Aim.wss.send({ a: 'blur' });
		//clearTimeout(msg.to);
		//Aim.load({
		//    api: 'window/blur/' + aliconnect.deviceUID,
		//    //post: { exec: 'onblur', deviceUID: aliconnect.deviceUID, },
		//    onload: function () {
		//        //console.log('onblur done', this.post);
		//    }
		//});
	},
	scrollimage: function () {
		//console.log(this);
		var srcs = this.srcs.split(',');
		this.idx = this.idx + 1 || 0;
		if (this.idx >= srcs.length) this.idx = 0;
		this.src = srcs[this.idx];
		if (srcs.length > 0) setTimeout(function (img) { OM.scrollimage.call(img) }, 5000, this);
	},

	share: function (url) {
		url = this.url || url;
		OM.windowshare = window.open(url, 'share', 'titlebar=no,location=no,width=700,height=500');
		return false;
	},
	onloadItems: function (event) {
		//console.log('onloadItems', this.src, this.data, this.get, this.post);
		//console.log('LOADITEMS', this.src, this.data);

		if (this.get) {
			if (this.get.schema) {
				this.data = Aim.Object.toArray(this.data[this.get.schema]);
				var schema = api.definitions[this.get.schema];
				if (schema) {
					if (schema.header) this.data.forEach(function (row) { for (var hname in schema.header) { var a = []; schema.header[hname].forEach(function (fname) { a.push(row.values[fname]); }); row[hname] = a.join(' '); } });
					if (schema.sort) this.data.sort(schema.sort);
					if (schema.filternames) this.data.forEach(function (row) { row.filterfields = {}; schema.filternames.forEach(function (fname) { if (row.values[fname]) { row.filterfields[fname] = row.values[fname] } }) });
				}
			}
			//console.log('ONLOADITEMS', this.data);
			this.item.children.q = this.get.q;
		}
		if (this.data) {
			var rows = [];
			for (var schemaname in this.data) for (var id in this.data[schemaname])
				if (typeof this.data[schemaname][id] == 'object') rows.push(this.data[schemaname][id]);
			//console.log('ROWS', rows);
			//var rows = Aim.Object.toArray(this.data.item);
			for (var i = 0, item; item = rows[i]; i++) {
				item.parent = this.item;
				if ('idx' in item) item.idx = Number(item.idx);
				if (!api.item[item.id]) api.item[item.id] = Aim.get(item);
				else {
					//if (!api.item[item.id].appendTo) OM.item.call(api.item[item.id]);
					for (var name in item) {
						//api.item[item.id][name] = api.item[item.id][name] != undefined ? api.item[item.id][name] : item[name];
						api.item[item.id][name] = item[name];
					}
				}
				//console.log(api.item[item.id]);
				if (api.item[item.id].refresh) api.item[item.id].refresh();
			}
			if (this.item) {
				this.item.children = this.item.children || [];
				this.item.children.length = 0;
				for (var i = 0, item; item = rows[i]; i++) {
					if (!Number(this.item.id) || item.masterID == this.item.id) this.item.children.push(api.item[item.id]);
					//console.log(api.item[item.id]);
				}
				if (!this.item.children.sortlist) OM.listitems.call(this.item.children);
				this.item.children.sort(this.item.children.sortlist);
				if (Number(this.get.id)) this.item.reindex();
				if (this.item.onloaditems) {
					this.item.onloaditems();
					this.item.onloaditems = null;
				}

				//console.log('ONLOADITEMS', this.src, this.data, this.item, this.item.opened, this.item.children, this.item.children.length);
				//this.data.value.forEach(function (row) { console.log(row.title); });

				if (this.item.children.length) {
					//console.log('ONLOADITEMS', this.item, this.item.opened, this.item.children, this.item.children.length);

					if (this.item.opened) this.item.open();
					else if (this.item.elLi) this.item.elLi.setAttribute('open', this.item.opened = this.item.opened || 0);
				}
				else {
					if (this.item.elLi) this.item.elLi.removeAttribute('open');
					if (this.item.opened) OM.show({ id: this.item.id });
					this.item.opened = 0;
				}


				if (this.item.id == get.lid) {//this.item.loadlist) {
					this.item.list();
					//MKAN if (get.id == get.lid && this.item.children[0]) OM.show({ id: this.item.children[0].id });
				}
				if (this.item.writeitems) this.item.writeitems();
				if (OM.appendChildPar) {
					this.item.appendChild(null, OM.appendChildPar);
					OM.appendChildPar = null;
				}
			}
		}
	},
	auth: auth = {
		user: {},
		init: function (elLoginButton) {
			auth.el = document.body.appendTag('div', { className: 'puform row' });
			auth.btn = elLoginButton;
			auth.refresh();
		},
		//refresh: function () {
		//	if (!elLogin) return;
		//	//if (Aim.navtree) Aim.navtree.innerText = '';
		//	OM.el.removeAttribute('loggedin');
		//	elLogin.innerText = '';
		//	//for (var name in aliconnect.user.configHost) aim[name] = aliconnect.user.configHost[name];
		//	if (Aim.client.user.id) {
		//		OM.el.setAttribute('loggedin', '');
		//		//Aim.OM.menu = Aim.OM.menu || {}
		//		//Aim.OM.menu.items = Aim.OM.menu.items || App.menu;
		//		//if (Aim.OM.menu.items) Aim.OM.menu.items.Start.items.Meer = { className: "folder", get: { "tv": 2, "lv": 1 } };
		//		//if (aliconnect.user.mse) mse.init();

		//		//elLogin.innerText = Aim.accountName || Aim.client.user.name ;
		//		//OM.shop.init();
		//		Aim.wss.send({ exec: 'uionline' });
		//		setInterval(function (event) { if (document.hasFocus()) Aim.wss.send({ ui: 'active' }); }, 30000);
		//		if (new Date(Aim.contractDT ? Aim.contractDT : null) < new Date(Aim.contractPublishDT)) {
		//			//alert('Nieuwe overeenkomst');
		//			document.body.appendTag('div', {
		//				className: 'contractaccept', innerText: 'Ik accepteer de gebruikersovereenkomst', onclick: function () {
		//					Aim.get({ id: Aim.client.user.id }).set({ contractDt: new Date().toISOString().substr(0, 19) });
		//					this.parentElement.removeChild(this);
		//				}
		//			});
		//		}
		//	}
		//	//Aim.wss.init({ deviceUID: aliconnect.deviceUID, hostName: Aim.client.domain.name, ip: App.user ? aliconnect.user.ip : null, userName: App.user ? Aim.accountName : null, UserID: App.user ? Aim.client.user.id : null },

		//	//);
		//},
		//connectmse: function () { with (auth.cleanPanel('Connect Micrososft Exchange')) { } },
		//connectfacebook: function () { with (auth.cleanPanel('Connect Facebook')) { } },
		//connectlinkedin: function () { with (auth.cleanPanel('Connect Linkedin')) { } },
		//apparaten: function () { with (auth.cleanPanel('Connect Facebook')) { } },
		loginload: function (event) {
			if (this.data) {
				if (this.data.errmsg) {
					var a = this.data.errmsg.split(':');
					var pnlname = a.shift();
					var msg = a.shift() || '';
					//alert(pnlname);
					if (pnl[pnlname]) {
						pnl.show(pnl[pnlname]);
						console.log('DATA LOGIN', this.data);
						//pnl[a[0]].elEmail.value = this.data.ToEmail;
						aliconnect.user.email = this.data.ToEmail;
						aliconnect.user.signincode = this.data.signincode;
						//if (pnl[a[0]].form.elements.email) pnl[a[0]].form.elements.email.value = this.data.ToEmail;
						//if (pnl[a[0]].form.elements.signincode) pnl[a[0]].form.elements.signincode.value = this.data.signincode;
						pnl[pnlname].elInfo.innerText = msg;
						return;
					}
				}
				if (this.data.id || this.data.name == 'AuthPasswordUpdated') {
					//MKAN
					console.log('POSTSSSSSSSS', this.post);
					if (this.post.password || this.post.password1) return location.href = '/?id=' + get.id;
				}
			}
			else {
				alert(this.responseText);
				console.log('POSTSSSSSSSS', this.responseText);
			}
		},
		fieldverify: function (event) {
			console.log('VERIFY');
			for (var i = 0, e; e = this.form.elements[i]; i++) {
				if (e.msg) {
					var msgs = e.msg();
					for (var msg in msgs) if (msgs[msg]) {
						e.focus(); e.select();
						console.log('MSG');
						return OM.showmsg(e, msg);
					}
				}
				else if (e.required && !e.value) {
					this.form.ok = e.ok = false;
					console.log('REQ');
					return OM.showmsg(e, 'Dit veld invullen');
				}
			}
			console.log('VERIFY DONE');
		},
		cancel: function () {
			auth.el.innerText = '';
			OM.show({ auth: null });
		},
		keyloggin: function (keycode) {
			console.log('KEY LOGGIN', keycode);
			Aim.load({
				api: 'auth/keyloggin/' + keycode,
				//post: { exec: 'keyloggin', keycode: keycode },
				onload: function () {
					console.log(this.data);
				}
			});
		},
	},
	shop: {
		data: {},
		init: function () {
			Aim.load({
				api: 'shop/bag/' + (aliconnect.user.clientID || Aim.client.account.id),
				onload: this.onload
			});
		},
		onload: function () {
			shop.data = this.data.bag;
			shop.items = this.data.items;
			if (shop.items) for (var i = 0, item; item = shop.api.item[i]; i++) {
				if (!api.item[item.id]) api.item[item.id] = Aim.get(item);
				api.item[item.id].refresh();
			}
			shop.refresh();
		},
		refresh: function () {
			var quant = 0;
			Object.entries(shop.data).forEach(function (row, i, itemID) { quant += Number(row.quant); });
			msg.setcnt(shop.elBtn, quant);
			if (Aim.clientID) {
				if (!shop.elClient && shop.elBtn) shop.elClient = shop.elBtn.appendTag('span');
				if (api.item[Aim.clientID] && shop.elClient) shop.elClient.innerText = api.item[Aim.clientID].name;
			}

			if (pnl.shop.elUl) with (pnl.shop.elUl) {
				innerText = '';
				Object.entries(shop.data).forEach(function (quant, i, id) {
					//console.log(quant, i, id);
					row = api.item[id];
					with (appendTag('li', { className: 'row' })) {
						appendTag('div', {});
						with (appendTag('div', { className: 'col aco' })) {
							appendTag('div', { className: 'kop0', innerText: row.title });
							appendTag('div', { className: 'kop2', innerText: row.subject });
							appendTag('div', { className: 'kop2', innerText: row.summary });
							appendTag('input', {
								id: row.id, type: 'text', value: shop.data[row.id].extra, onchange: function () {
									Aim.load({
										msg: 'Update text order line',
										api: 'shop/bag/update/' + (aliconnect.user.clientID || Aim.client.account.id),
										post: {
											extra: this.value,
											itemID: this.id
										},
										onload: function () {
											console.log(this.responseText);
										}
									});
								}
							});
						}
						row.writeprice(appendTag('div'));
					}
				});
			}
		},
		order: function () {
			Aim.load({
				msg: 'Order product',
				api: 'shop/bag/order',
				post: {
					exec: 'shopbag', a: !Aim.clientID ? 'purchaseorder' : 'createorder',
					//ClientID: Aim.clientID || Aim.client.account.id,
					userID: Aim.client.user.id, hostID: Aim.client.domain.id
				}, onload: function () {
					console.log('ORDER FINISH', this.post, this.responseText);
					shop.init();
					OM.show({ apnl: 'orderdone' });
				}
			});
		},
		add: function (id, quant) {
			console.log(id, quant);
			Aim.load({
				api: 'shop/bag/add',
				msg: 'Add product', post: {
					exec: 'shopbag', a: 'add',
					//ClientID: Aim.clientID || Aim.client.account.id,
					userID: Aim.client.user.id, accountID: Aim.client.account.id, itemID: id, quant: quant
				}, onload: function () {
					//console.log(this.responseText);
					shop.init();
				}
			});
			console.log(shop.data);
			for (var i = 0; i <= 1; i++) {
				var elBag = api.item[id].elBagCnt[i];
				if (elBag) elBag.value = quant;
			}
		},
	},
	editor: editor = {
		//escapeHtml: function (unsafe) {
		//	return unsafe
		//			 .replace(/&/g, "&amp;")
		//			 .replace(/</g, "&lt;")
		//			 .replace(/>/g, "&gt;")
		//			 .replace(/"/g, "&quot;")
		//			 .replace(/'/g, "&#039;");
		//},

		//hightlightSyntax: function () {
		//	var me = $('.editor');
		//	var content = me.val();
		//	var codeHolder = $('code');
		//	var escaped = escapeHtml(content);
		//	codeHolder.html(escaped);
		//	$('.syntax-highight').each(function (i, block) { hljs.highlightBlock(block); });
		//},

		onkeydown: function (e) {
			if (e.ctrlKey && e.key == 's') {
				e.stopPropagation();
				e.preventDefault();
				if (this.owner.type) {
					if (this.owner.type == "json") try { JSON.parse(this.value, true) } catch (err) { alert('JSON format niet in orde;'); throw 'illegal JSON format'; }
					this.value = editor[this.owner.type](this.value);
				}
				return;
				Aim.load({
					post: { exec: this.owner.name, value: this.value, id: get.id, hostID: Aim.client.domain.id, userID: Aim.client.user.id, accountID: Aim.client.account.id },
					owner: this,
					onload: function () {
						console.log(this.responseText);
					}
				});
			}
		},
		onload: function () {
			OM.show({ apnl: 0 });
			console.log(this);
			return;
			Aim.load({
				post: { exec: this.name, id: get.id, hostID: Aim.client.domain.id, userID: Aim.client.user.id, accountID: Aim.client.account.id },
				owner: this,
				onload: function (event) {
					console.log(this, this.responseText);
					colpage.innerText = '';
					with (collist) {
						innerText = '';
						with (appendTag('div', { className: 'editor aco', style: 'height:100%;width:100%;' })) {
							var el = appendTag('textarea', { spellcheck: false, value: this.responseText, owner: this.owner, onkeydown: editor.onkeydown });
							if (this.owner.type) el.value = editor[this.owner.type](el.value);
							//appendTag('pre').appendTag('code', { className: 'html' });
						}
					}
				}
			});
		},
		json: function (txt) {
			return;
			//var ar = txt;//.split("\n");
			//var ident = 0;
			//lines = [];
			//ar.forEach(function (r, i) {
			//	//r = r.replace(/ /g, '').trim();
			//	r = r.replace(/: /g, ':').replace(/, "/g, ',"').replace(/{ /g, '{').replace(/ }/g, '}').replace(/\[ /g, '[').replace(/\ ]/g, ']').replace(/  /g, " ").replace(/  /g, " ").replace(/\} /g, '}').trim();
			//	var idx = (r.match(/{/g) || []).length + (r.match(/\[/g) || []).length - (r.match(/}/g) || []).length - (r.match(/\]/g) || []).length;
			//	if (idx < 0) ident += idx;
			//	lines.push('                              '.substr(0, ident * 2) + r);
			//	if (idx > 0) ident += idx;
			//});
			//return lines.join("\n");
		},
		css: function (txt) {
			var ar = txt.split("\n");
			var ident = 0;
			lines = [];
			ar.forEach(function (r, i) {
				r = r.replace(/;/g, '; ').replace(/>/g, ' > ').replace(/' > '/g, "'>'").replace(/{/g, ' { ').replace(/}/g, ' }').replace(/} /g, '}').replace(/  /g, " ").replace(/  /g, " ").trim();
				var idx = (r.match(/{/g) || []).length - (r.match(/}/g) || []).length;
				if (idx < 0) ident += idx;
				lines.push('                              '.substr(0, ident * 2) + r);
				if (idx > 0) ident += idx;
			});
			return lines.join("\n");
		},
	},
	doc: {
		onload: function () {
			console.log('DOCVIEW', this.src, this.responseText, this.data);
			if (this.data) return OM.doc.view(this.data, this.menuitem);
			//dfgsdfgsdf gsdf gsdfg sdfgsdfg sdfgs d
			//dgdsfgsdfgsdfgsdfgsdfgs


			//console.log('DOCVIEW ITEM www', this.responseText);






			return OM.doc.html.write.call(this, this.responseText);
			//if (this.responseText[0] == '<') return OM.doc.html.write(this.responseText);
			//if (this.responseText[0] == '[') return OM.doc.array.write(this.responseText);
		},
		view: function (data, menuitem) {
			console.log('PPP', data, items, collist);

			writechapter = function (row, level, ul) {
				if (!row) return;
				with (Listview.elOa) {
					appendTag('a', { name: 'docview' + row.id });
					appendTag('h' + level, { innerHTML: row.title });
					appendTag('div', { innerHTML: row.body });
				}
				with (ul.appendTag('li', { open: 0 })) {
					with (appendTag('div', { className: 'row' })) {
						appendTag('open', { onclick: function (event) { this.parentElement.parentElement.setAttribute('open', this.parentElement.parentElement.getAttribute('open') ^ 1); } });
						appendTag('a', { href: '#docview' + row.id, innerHTML: row.title, onclick: function (event) { event.stopPropagation(); } });
						//appendTag('a', {  innerHTML: row.name, onlcik: function (event) { event.preventDefault(); event.stopPropagation(); } });
					}
					if (row.items) {
						ul = appendTag('ul');
						for (var i = 0, child; child = row.api.item[i]; i++) writechapter(child, level + 1, ul);
					}
				}
			}
			//HOE VERDER ????? MVK, is nu html write. Code op 1 plek.
			//OM.doc.html.write();

			//with (collist) {
			//    innerText = '';
			//    onclick = function (event) {
			//        OM.printdiv = Listview.elOa;
			//        event.stopPropagation();
			//    }
			//    with (Listview.elTop = appendTag('div', { className: "row top btnbar", })) {
			//        //with (Listview.elbtnBar = appendTag('div', { className: 'btnbar aco' })) {
			//        //appendTag('button', { className: "abtn icn r print", onclick: function () { OM.printiframe(Listview.elOa); } });
			//        appendTag('button', { className: "abtn icn pdf", onclick: OM.doc.pdf.onload });
			//        appendTag('button', {
			//            className: "abtn icn popout", onclick: function () {
			//                alert('popout');
			//            }
			//        });
			//        //if (wordapi) appendTag('button', { className: "abtn icn download", title: "Tekst overnemen in Word", onclick: function () { MSW.writepos(Listview.elOa.innerText); } });
			//        //else
			//        appendTag('button', { className: "abtn icn download", title: "Download als MS-Word document", menuitem: menuitem, onclick: OM.doc.msword.onload });
			//        //console.log('LLLLLLLLL', menuitem)
			//        appendTag('button', {
			//            className: 'abtn icn pdf', title: 'PDF', onclick: function () {
			//                Listview.elContent.innerText = '';
			//                with (Listview.elContent.appendTag('iframe', { style: 'width:100%;height:100%;background:#aaa;color:white;' })) {
			//                    contentWindow.document.open();
			//                    contentWindow.document.write('Generating document, please wait...');
			//                    contentWindow.document.close();
			//                    src = menuitem.src + '?pdf&id=' + menuitem.id;
			//                }
			//            }
			//        });

			//        appendTag('button', { className: 'abtn icn close r', title: 'Sluiten', onclick: function () { Listview.items.refilter(); } });
			//        //}
			//    }
			//    with (Listview.elContent = appendTag('div', { className: "row aco", attr: { style: 'height:250px' } })) {
			//        Listview.elFilter = appendTag('div', { className: "col atv noselect", }).appendTag('ul', { className: "liopen", }).appendTag('li').appendTag('ul');
			//        with (Listview.elOa = appendTag('div', { className: "col aco oa doc" })) {
			//            writechapter(data, 0, Listview.elFilter);
			//        }
			//    }
			//    OM.printdiv = Listview.elOa;
			//}
		},
		html: {
			write: function (html) {
				//var s = this.responseText;
				for (var attributeName in this.item.attributes) {
					//console.log(attributeName, '[' + attributeName.toUpperCase() + ']', this.item.attributes[attributeName].value);
					//console.log(this.responseText.split('[' + attributeName.toUpperCase() + ']'));
					html = html.split('[' + attributeName.toUpperCase() + ']').join(this.item.attributes[attributeName].value);
				}
				//console.log('DOCVIEW', s );

				with (collist) {
					innerText = '';

					onclick = function (event) {
						OM.printdiv = Listview.elOa;
						event.stopPropagation();
					};

					with (Listview.elTop = appendTag('div', { className: "row top btnbar np", })) {
						//with (Listview.elbtnBar = appendTag('div', { className: 'btnbar aco' })) {
						//appendTag('button', { className: "abtn icn r print", onclick: function () { OM.printiframe(Listview.elOa); } });
						appendTag('a', { className: "abtn icn msword", href: this.src.replace('.html', '.doc') });
						//appendTag('a', { className: "abtn icn pdf", href: this.src.replace('.html', '.pdf') });
						appendTag('button', {
							className: 'abtn icn pdf', title: 'PDF', src: this.src.replace('.html', '.pdf'),
							onclick: function () {
								Listview.elContent.innerText = '';
								with (Listview.elContent.appendTag('iframe', { style: 'width:100%;height:100%;background:#aaa;color:white;' })) {
									contentWindow.document.open();
									contentWindow.document.write('Generating document, please wait...');
									contentWindow.document.close();
									src = this.src; //menuitem.src + '?pdf&id=' + menuitem.id;
								}
							}
						});
						appendTag('a', { className: "abtn icn popout", target: 'doc', href: this.src });

						appendTag('a', {
							className: "abtn icn msword", onclick: function () {
								OM.doc.msword.make(Listview.elOa.innerHTML);
							}
						});
						//appendTag('a', { className: "abtn icn pdf", href: this.src.replace('.html', '.pdf') });

						//appendTag('button', {
						//    className: "abtn icn pdf", onclick: function () {
						//        var e = Listview.elOa;
						//        if (!OM.elPrintDiv) OM.elPrintDiv = document.body.appendTag('div', {});
						//        OM.elPrintDiv.className = e.className + ' printablediv';
						//        OM.elPrintDiv.innerHTML = '<link href="/api/' + Aim.version + '/css/doc.css" rel="stylesheet" />' + e.innerHTML;

						//        var pdf = new jsPDF('p', 'pt', 'letter'), source = OM.elPrintDiv, specialElementHandlers = {
						//            '#bypassme': function (element, renderer) {
						//                return true
						//            },
						//            '.hide': function (element, renderer) {
						//                return true
						//            }
						//        }


						//        margins = { top: 80, bottom: 60, left: 40, width: 522 };
						//        pdf.fromHTML(
						//            source // HTML string or DOM elem ref.
						//            , margins.left // x coord
						//            , margins.top // y coord
						//            , {
						//                'width': margins.width // max width of content on PDF
						//                , 'elementHandlers': specialElementHandlers
						//            },
						//            function (dispose) {
						//                // dispose: object with X, Y of the last line add to the PDF
						//                //          this allow the insertion of new lines after html
						//                //pdf.output('datauri');//.save('Test.pdf');
						//                var blob = pdf.output("blob");
						//                window.open(URL.createObjectURL(blob));
						//            },
						//            margins
						//        )
						//    }
						//});
						appendTag('button', { className: 'abtn icn close r', title: 'Sluiten', onclick: function () { Listview.items.refilter(); } });
						//}
					}
					with (Listview.elContent = appendTag('div', { className: "row aco", attr: { style: 'height:250px' } })) {
						Listview.elFilter = appendTag('div', { className: "col atv noselect np", }).appendTag('ul', { className: "liopen", }).appendTag('li').appendTag('ul');

						OM.printdiv = Listview.elOa = appendTag('div', {
							className: "col aco oa doc", innerHTML: html, title: this.menuitem.title, item: this.item, onscroll: function () {
								var c = Listview.elFilter.getElementsByTagName('LI');
								var elFocus = null, elPrev = null;
								for (var i = 0, e; e = c[i]; i++) {
									if (e.h.offsetTop - 25 >= Listview.elOa.scrollTop) elFocus = elFocus || elPrev || e;
									elPrev = e;
									if (e.hasAttribute('open')) e.setAttribute('open', 0);
									e.removeAttribute('focus');
								}
								elFocus = elFocus || elPrev || e;
								if (!elFocus) return;
								elFocus.setAttribute('focus', 1);
								while (elFocus.h) {
									if (elFocus.hasAttribute('open')) elFocus.setAttribute('open', 1);
									elFocus = elFocus.parentElement.parentElement;
								}
							}
						});

						var c = Listview.elOa.getElementsByTagName('H1');
						//for (var i = 0, e; e = c[i]; i++) if (e.tagName == 'DIV') break;
						//c[0].parentElement;
						var elFirstChapter = null;
						var ul = [null, Listview.elFilter];
						//var hs = [];
						if (!c[0]) return;
						var c = c[0].parentElement.children;
						console.log(c);
						for (var i = 0, e; e = c[i]; i++) {
							if (['H1', 'H2', 'H3'].indexOf(e.tagName) != -1) {
								//console.log(e, e.previousElementSibling)
								if (ul[Number(e.tagName[1])]) ul[Number(e.tagName[1])].parentElement.setAttribute('open', 1);
								var eName = e.previousElementSibling || {};
								//if (!eName.id && !eName.name) continue;
								//if (!elFirstChapter) elFirstChapter = e;
								//hs[i] = e;

								//with (ulIndex[e.tagName[1]]) {
								//    appendTag('li').appendTag('a', { href: '#docview' + i, innerText: e.innerText });
								//    //ulIndex[Number(e.tagName[1]) + 1] = appendTag('ul');

								//}

								with (e.li = ul[e.tagName[1]].appendTag('li', { h: e })) {
									with (appendTag('div', { className: 'row' })) {
										appendTag('open', { onclick: function (event) { this.parentElement.parentElement.setAttribute('open', this.parentElement.parentElement.getAttribute('open') ^ 1); } });
										appendTag('a', { href: '#' + (eName.id || e.name), innerText: e.innerText, onclick: function (event) { event.stopPropagation(); } });
										//appendTag('a', {  innerHTML: row.name, onlcik: function (event) { event.preventDefault(); event.stopPropagation(); } });
									}
									ul[Number(e.tagName[1]) + 1] = appendTag('ul');

								}
							}
						}


						return;
						//var elIndex = appendTag('ul', { className: 'index' });
						var elFirstChapter = null;
						var ul = [null, Listview.elFilter];
						var elIndex = Listview.elOa.appendTag('div', { className: 'pba' });
						elIndex.appendTag('h0', { innerText: this.menuitem.title });
						//this.item.writedetails(elIndex,1);
						with (elIndex) {
							with (appendTag('table', { className: 'pba' })) {
								//for (var name in this.item.attributes) if (this.item.attributes[name].value || this.item.attributes[name].defaultvalue) {
								//    with (appendTag('tr')){
								//        appendTag('td', { innerText: this.item.attributes[name].placeholder || name });
								//        appendTag('td', { innerHTML: this.item.attributes[name].value || this.item.attributes[name].defaultvalue });
								//    }
								//}
								appendTag('div', { className: 'kop0', innerText: Aim.printheader.kop0 || '' });
								appendTag('div', { className: 'kop1', innerText: Aim.printheader.kop1 || '' });
								appendTag('div', { className: 'kop2', innerText: OM.printdiv.title || '' });
								appendTag('div', { className: 'kop2', innerText: Aim.printheader.kop2 || '' });
							}
						}
						elIndex.appendTag('h0', { className: 'pbb', innerText: 'Index' });
						var ulIndex = [null, elIndex.appendTag('ul', { className: 'docindex' })];
						//Listview.elOa.insertBefore(Listview.elOa.appendTag('Title', { innerText: 'Index' }), Listview.elOa.firstChild);
						var hs = [];
						var c = Listview.elOa.getElementsByTagName('H1');
						//for (var i = 0, e; e = c[i]; i++) if (e.tagName == 'DIV') break;
						OM.printdiv = c[0].parentElement;
						var c = OM.printdiv.children;
						console.log(c);
						for (var i = 0, e; e = c[i]; i++) {
							if (['H1', 'H2', 'H3'].indexOf(e.tagName) != -1) {
								if (!elFirstChapter) elFirstChapter = e;
								hs[i] = e;
								if (ul[Number(e.tagName[1])]) ul[Number(e.tagName[1])].parentElement.setAttribute('open', 1);

								with (ulIndex[e.tagName[1]]) {
									appendTag('li').appendTag('a', { href: '#docview' + i, innerText: e.innerText });
									ulIndex[Number(e.tagName[1]) + 1] = appendTag('ul');

								}

								with (e.li = ul[e.tagName[1]].appendTag('li', { h: e })) {
									with (appendTag('div', { className: 'row' })) {
										appendTag('open', { onclick: function (event) { this.parentElement.parentElement.setAttribute('open', this.parentElement.parentElement.getAttribute('open') ^ 1); } });
										appendTag('a', { href: '#docview' + i, innerText: e.innerText, onclick: function (event) { event.stopPropagation(); } });
										//appendTag('a', {  innerHTML: row.name, onlcik: function (event) { event.preventDefault(); event.stopPropagation(); } });
									}
									ul[Number(e.tagName[1]) + 1] = appendTag('ul');

								}
							}
						}

						//if (elFirstChapter) OM.printdiv.insertBefore(elIndex, elFirstChapter);
					}
					//console.log(hs);
					//hs.forEach(function (e, i) {
					//    //console.log(e);
					//    //Listview.elOa.appendTag('a', { name: '#docview' + i });
					//    OM.printdiv.insertBefore(OM.printdiv.appendTag('a', { name: 'docview' + i }), e);
					//});


					Listview.elOa.onscroll();
				}
			}
		},
		pdf: {
			onload: function () {
				var e = Listview.elOa;
				if (!OM.elPrintDiv) OM.elPrintDiv = document.body.appendTag('div', {});
				OM.elPrintDiv.className = e.className + ' printablediv';
				OM.elPrintDiv.innerHTML = '<link href="/api/' + Aim.version + '/css/doc.css" rel="stylesheet" />' + e.innerHTML;

				var pdf = new jsPDF('p', 'pt', 'letter'), source = OM.elPrintDiv, specialElementHandlers = {
					'#bypassme': function (element, renderer) {
						return true
					},
					'.hide': function (element, renderer) {
						return true
					}
				};


				margins = {
					top: 80,
					bottom: 60,
					left: 40,
					width: 522
				};
				pdf.fromHTML(
					source // HTML string or DOM elem ref.
					, margins.left // x coord
					, margins.top // y coord
					, {
						'width': margins.width // max width of content on PDF
						, 'elementHandlers': specialElementHandlers
					},
					function (dispose) {
						// dispose: object with X, Y of the last line add to the PDF
						//          this allow the insertion of new lines after html
						//pdf.output('datauri');//.save('Test.pdf');
						var blob = pdf.output("blob");
						window.open(URL.createObjectURL(blob));
					},
					margins
				)
			}
		},
		printfile: function (par) {
			par.onload = function () {
				if (!OM.elPrint) OM.elPrint = document.body.appendTag('iframe', { className: 'none', onload: function () { this.focus(); this.contentWindow.print(); } });
				OM.elPrint.contentWindow.document.open();
				OM.elPrint.contentWindow.document.write(this.responseText);
				OM.elPrint.contentWindow.document.close();
			};
			par.nojson = 1;
			Aim.load(par);
			//console.log(par);
		},
		//printdiv: function (e) {
		//    //console.log('PRINT', e, e.innerHTML);
		//    if (!OM.elPrintDiv) OM.elPrintDiv = document.body.appendTag('div', {});
		//    OM.elPrintDiv.className = e.className + ' printablediv';
		//    OM.elPrintDiv.innerHTML = e.innerHTML;
		//    window.print();
		//},
		printiframe: function (e) {
			//console.log('PRINT', e, e.innerHTML);
			if (!OM.elPrint) OM.elPrint = document.body.appendTag('iframe', { style: 'position:absolute;z-index:-10;', onload: function () { this.focus(); this.contentWindow.print(); } });
			OM.elPrint.contentWindow.document.open();
			OM.elPrint.contentWindow.document.write('<head><link href="/api/' + Aim.version + '/css/doc.css" rel="stylesheet" /></head><body><div>' + e.innerHTML + '</div></body>');
			OM.elPrint.contentWindow.document.body.className = e.className;
			OM.elPrint.contentWindow.document.close();
		},
		printThis: function () {
			Aim.load({ msg: 'Print this', src: this.src + document.location.search, onload: OM.rpt.onload });
		},
		rpt: {
			load: function () {
				var a = [];
				for (var i = 0, row; row = Listview.api.item[i]; i++) if (!row.hidden) a.push(row.id.split('.')[0]);
				var alid = get.lid.split('.');
				Aim.load({ msg: 'Repport', nojson: true, post: { ids: JSON.stringify(a) }, src: (alid[1]) ? '/aim/rpt/' + alid[0] + '_' + alid[1] + '_lv.php' + document.location.search : '/aim/rpt/' + document.location.search, onload: OM.rpt.onload });
			},
			onload: function () {
				if (!OM.elPrint) OM.elPrint = document.body.appendTag('iframe', { className: 'none', onload: function () { this.focus(); this.contentWindow.print(); } });
				OM.elPrint.contentWindow.document.open();
				OM.elPrint.contentWindow.document.write(this.responseText);
				OM.elPrint.contentWindow.document.close();
			},
		},
	},
	setting: {
		keybuf: '',
		keyTimeStamp: 0,
	},
	li: {
		el: null,
		make: function (innerHTML) {
			if (!li.el) li.el = document.body.appendTag('div', { innerHTML: innerHTML });
			else li.el.innerHTML = innerHTML;
		}
	},
	panel: {
		freedraw: function () {
			with (elCam = OM.el.appendTag('div', { className: 'signat col' })) {

				with (appendTag('div', { className: 'row top w' })) {
					appendTag('button', {
						className: 'r abtn icn clear', onclick: function () {
							signaturePad.clear();
						}
					});
					appendTag('button', {
						className: 'abtn icn save', item: this.item, onclick: function () {
							//App.files.fileUpload(this.item, canvas.toDataURL("image/png"), this.item.elFilesInp, { name: 'draw.png' });
							App.files.fileUpload(this.item, { name: 'draw.png' }, canvas.toDataURL("image/png"));
						}
					});
					appendTag('button', { className: "abtn icn close", elClose: elCam, onclick: Aim.Element.onclick });
				};
				canvas = appendTag('canvas', { className: 'aco', style: 'background:white;', width: 640, height: 480 });
			}
			//function resizeCanvas() {
			//    var ratio = Math.max(window.devicePixelRatio || 1, 1);
			//    canvas.width = canvas.offsetWidth * ratio;
			//    canvas.height = canvas.offsetHeight * ratio;
			//    canvas.getContext("2d").scale(ratio, ratio);
			//}

			//window.onresize = resizeCanvas;
			//resizeCanvas();

			if (window.SignaturePad) signaturePad = new SignaturePad(canvas);
			else document.body.appendTag('script', { src: '/lib/js/draw.js' });
		},
		camera: function () {
			with (elCam = OM.el.appendTag('div', { className: 'cam col' })) {
				with (appendTag('div', { className: 'row top w' })) {
					appendTag('button', {
						className: 'abtn icn r save', item: this.item, onclick: function () {
							//console.log(this.item);
							if (!this.item.snap) this.item.elFoto.click();
							//App.files.fileUpload(this.item, elCam.canvas.toDataURL("image/png"), this.item.elFilesInp, { name: 'photo.png' });
							App.files.fileUpload(this.item, { name: 'photo.png' }, elCam.canvas.toDataURL("image/png"));
							//items.onloadFile(canvas.toDataURL("image/png"), this.item.attributes.elFilesInp.elImages);
						}
					});
					appendTag('button', {
						className: "abtn icn close", onclick: function (event) {
							elCam.video.pause();
							elCam.video.src = '';
							startvideo = false;
							if (localstream) localstream.getTracks()[0].stop();
							//console.log("Vid off");
							elCam.parentElement.removeChild(elCam);
						}
					});
				}

				with (appendTag('div', { className: 'aco' })) {
					elCam.video = appendTag('video', { autoplay: true, className: 'aco' });
					elCam.canvas = appendTag('canvas', { width: 640, height: 480 });
					if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
						navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
							try {
								elCam.video.srcObject = stream;
							} catch (error) {
								elCam.video.src = window.URL.createObjectURL(stream);
							}
							localstream = stream;
							elCam.video.play();
						});
					}
					this.item.elFoto = appendTag('img', {
						item: this.item, width: 640, height: 480,
						onclick: function (event) {
							if (!this.item.snap) {
								this.item.elFoto.style.backgroundColor = 'black';
								var context = elCam.canvas.getContext("2d");
								context.drawImage(video, 0, 0, 640, 480);
								this.item.elFoto.src = elCam.canvas.toDataURL("image/png");
								this.item.snap = true;
							}
							else {
								this.item.snap = false;
								this.item.elFoto.src = '';
								this.item.elFoto.style.backgroundColor = '';
							}
						}
					});

				}
			}
		},
	},
	player: {
		onscroll: function () {
			if (this.images && this.images[0]) for (var i1 = 0, elImages; elImages = this.images[i1]; i1++) {
				var files = elImages.files;
				if (files && files.images && files.images[files.slideIdx]) {
					if (checkVisible(files.images[files.slideIdx])) files.images[files.slideIdx].show();
					if (files.images[files.slideIdx].pause) {
						if (checkVisibleAll(files.images[files.slideIdx])) {
							if (!items.player.elPlaying) {



								player.elPlaying = files.images[files.slideIdx];
								OM.player.elPlaying.play();
							}
						}
						else
							files.images[files.slideIdx].pause();
					}
				}
			}
		},
		init: function () {
			this.images = colpage.getElementsByClassName('images');
			for (var i1 = 0, elImages; elImages = this.images[i1]; i1++) {
				var files = elImages.files;
				elImages.appendTag('div', { className: 'btr prev', files: files, onclick: function () { this.files.slide(-1); } });
				elImages.appendTag('div', { className: 'btr next', files: files, onclick: function () { this.files.slide(1); } });
				if (files) {
					files.images = files.el.getElementsByClassName('aImage');
					files.slideIdx = 0;
					files.slide();
				}
			}
		},
		play: function (elPrev) {
			var c = colpage.getElementsByTagName('video');
			if (!elPrev) var start = true;
			for (var i = 0, e; e = c[i]; i++) {
				if (start && checkVisibleAll(e)) return e.play();
				if (e == elPrev) var start = true;
			}
		},
		pause: function () {

		},
	},
	keydown: {
		Escape: function (event) {
			//console.log(Aim.popup, Aim.sub, document.activeElement, Aim.pageItem);
			if (Aim.popup.innerText || Aim.sub.innerText) {
				Aim.popup.innerText = '';
				Aim.sub.innerText = '';
				return;
			}
			if (ImageSlider && ImageSlider.el && ImageSlider.el.show && ImageSlider.el.innerText) return ImageSlider.Out();
			if (Aim.navtree.editing) {
				Aim.navtree.elInp.value = Aim.navtree.elInp.initValue;
				Aim.navtree.editcancel();
				return;
			}
			if (OM.selitems.length) return OM.selection.cancel();

			if (OM.par.apnl) return OM.show({ apnl: 0 });
			if (Aim.pageItem && Aim.pageItem.editing) return Aim.pageItem.editclose();
			delete Aim.navtree.elFocus;
			//Aim.navtree.unselectcopy();
			if (colpage.innerText) return colpage.close();
			if (get.tv) return OM.show({ tv: 0 });
		},
		pv: {
			EscEdit: function (event) {
				if (Aim.pageItem && Aim.pageItem.editing) {
					event.preventDefault();
					Aim.pageItem.editclose();
				}
			},
			F2: function (event) {
				console.log('F2', colpage.btns);
				colpage.btns.edit.onclick();
			},
			UpShiftAlt: function (event) {
				var field = document.activeElement.field;
				if (field.aid) {
					var el = field.el;
					if (el.previousElementSibling) {
						el.parentElement.insertBefore(el, el.previousElementSibling);
						field.elInp.focus();
					}
				}
				event.preventDefault();
			},
			Up: function (event) {
				if (document.activeElement.tagName != 'DIV' && document.activeElement.field && document.activeElement.field.el.previousElementSibling) {
					document.activeElement.field.el.previousElementSibling.field.elInp.focus();
					event.preventDefault();
				}
				event.preventDefault();
			},
			Down: function (event) {
				if (document.activeElement.tagName != 'DIV' && document.activeElement.field && document.activeElement.field.el.nextElementSibling) {
					document.activeElement.field.el.nextElementSibling.field.elInp.focus();
					event.preventDefault();
				}
			},
			DownShiftAlt: function (event) {
				var field = document.activeElement.field;
				if (field.aid) {
					var el = field.el;
					if (el.nextElementSibling) {
						el.parentElement.insertBefore(el, el.nextElementSibling.nextElementSibling);
						field.elInp.focus();
					}
				}
			},
		},
		//tv: {		},
		//lv: {		},
		//CtrlKeyP: function () {
		//	//if (!) document.body.appendTag('div', { className: 'divprint' ,innerHTML:colpage.innerHTML});
		//	//event.preventDefault();

		//},
		ShiftShift: function () {
			Aim.navtree.selstart = null;
		},
		CtrlKeySEdit: function (event) {
			if (Aim.pageItem && Aim.pageItem.editing) {
				event.preventDefault();
				//if (document.activeElement && document.activeElement.onblur) document.activeElement.onblur();
				//if (document.activeElement && document.activeElement.onchange) document.activeElement.onchange();
				//Aim.pageItem.btnSave.focus();
				Aim.pageItem.btnSave.click();
			}
		},
		CtrlKeyZ: function (event) {
			OM.undo();
		},
		//KeyCCtrl: function (event) {
		//    return OM.selection.copy();
		//},
	},

	config: {
		coltree: {
			select: "title,typical,state,hasChildren,idx,srcID,inheritedID,selected,detailID,createdDT,startDT,endDT,finishDT",
			//select:"",
			title: "",
			tv: "",
			lv: "",
			reload: "",
			schema: "",
			filter: "finishDT+IS+NULL"
		}
	},
	start: function () {
		console.log('START');
		Aim.dashboard({
			tasks: {
				title: 'Taken', items: {
					active: {
						title: 'Actieve taken',
					},
				}
			},
			tasks1: {
				title: 'Taken', items: {
					active: {
						title: 'Actieve taken',
					},
				}
			},
			tasks2: {
				title: 'Taken', items: {
					active: {
						title: 'Actieve taken',
					},
				}
			},
			tasks3: {
				title: 'Taken', items: {
					active: {
						title: 'Actieve taken',
					},
				}
			},
		})
	},
	dashboard1: function (data) {
		console.log('DASHBORD>>>>>>>', this, data);
		//if (this.elDbv) return OM.elBrd.appendChild(this.elDbv);
		this.items = data;
		adbItems = [];
		with (this.collist = OM.elBrd.appendTag('div', { className: 'col aco start aimitems' })) {
			with (appendTag('div', { className: 'row' })) {
				for (var menuname in this.items) {
					//if (Aim.OM.menu.hostitems.indexOf(menuname) != -1) {
					var menuitem = this.api.item[menuname];
					if (menuitem) {
						//console.log('DB menuitem', menuitem);
						with (menuitem.elTegel = appendTag('div', { className: 'col card' })) {
							var ela = appendTag('div', { className: 'row bgd' }).appendTag('div', {
								name: menuname,
								className: 'row aco abtn icn ' + menuitem.className, innerText: menuitem.title || menuname, menuitem: menuitem,
								//href: '#' + Aim.URL.stringify(menuitem.get || { bv: menuname }),
								par: menuitem.get || { bv: menuname },
								onclick: function (event) { OM.show(this.par); return false; }
							});
							if (menuitem.classID) {
								ela.href += this.id;
								Aim.load({
									post: { exec: 'dashborditems', classID: menuitem.classID, id: this.id }, menuitem: menuitem, onload: function () {
										//console.log('MENUITEMDATA', this.data);
										for (var i = 0, row; row = this.data.set[0][i]; i++) {
											menuitem.elTegel.appendTag('div', { className: 'row bgd' }).appendTag('div', {
												name: itemname, className: 'row aco abtn icn ',
												innerText: row.title + ' (' + row.count + ')',
												par: { dbv: 0, lid: ";1130;;state='" + row.title + "';;;" + this.post.id },
												onclick: function (event) { OM.show(this.par); return false; }
												//href: "#dbv=0&lid=;1130;;state='" + row.name + "';;;" + this.post.id

											});//'#q=0&search=0&lid=' + item.lid });
										}
									}
								});
							}
							for (var itemname in menuitem.items) {
								var item = menuitem.children[itemname];
								if (item.lid) {
									var lid = get.id;
									item.elLink = appendTag('div', { className: 'row bgd' }).appendTag('diva', {
										name: itemname, className: 'row aco abtn icn ' + item.className, innerText: item.title || itemname, menuitem: item,
										//href: '#q=&dbv=0&lid=' + lid,
										par: { q: 0, dbv: 0, lid: lid },
										onclick: function (event) { OM.show(this.par); return false; }

									});//'#q=0&search=0&lid=' + item.lid });
									if (item.sum) {
										Aim.load({
											msg: 'Dashboard', elLink: item.elLink, post: { exec: 'itemItemsGet', id: lid, sum: 1 }, onload: function () {
												this.elLink.innerText += ' (' + this.data.sum + ')';
											}
										});
									}
								}
							}
						}
					}
					//}
				}
				for (var i = 0; i < 4; i++) appendTag('div', { className: 'itemrow ghost' });

			}
		}
	},
	dashboard: function (menuitems) {
		console.log('DASHBORD>>>>>>>', menuitems);
		collist.innerText = '';
		with (collist) {
			console.log('DASHBORD>>>>>>>', menuitems);
			with (appendTag('div', { className: 'row top btnbar' })) {
			}
			with (appendTag('div', { className: 'row aco dashboard' })) {
				console.log('DASHBORD>>>>>>>', menuitems);
				for (var menuname in menuitems) if (menu = menuitems[menuname]) {
					console.log('DASHBORD>>>>>>>', menuitems);
					console.log(menuname, menuitems);
					with (appendTag('div', { className: 'col card' })) {
						appendTag('div', { className: 'row top', innerText: menu.title || menuname });
						for (var itemname in menu) if (subitem = menuitems[menuname][itemname]) {
							with (appendTag('div', { className: 'row cardrow' })) {
								appendTag('span', { innerText: subitem.title || menuname });
							}
						}
					}
				}
				for (var i = 0; i < 4; i++) appendTag('div', { className: 'col card ghost' });
			}
		}
	},
	tileboard: function (menuname) {
		if (menuname) return (Aim.OM.menu.api.item[menuname]) ? OM.tileboard.call(Aim.OM.menu.api.item[menuname]) : null;
		if (this.el) return OM.elBrd.appendChild(this.el);
		with (this.el = OM.elBrd.appendTag('div', { className: 'col aco start aimitems' })) {
			with (appendTag('div', { className: 'row' })) {
				for (var menuname in this.items) {
					var menuitem = this.api.item[menuname];
					if (menuitem) {
						with (menuitem.elTegel = appendTag('div', { className: 'col card' })) {
							menuitem.get = menuitem.get || { bv: menuname };
							appendTag('div', { className: 'row bgd' }).appendTag('a', {
								name: menuname, className: 'row aco abtn icn ' + menuitem.className, innerText: menuitem.title, menuitem: menuitem,
								par: menuitem.get,
								onclick: Aim.Element.onclick,
								//href: '#' + Aim.URL.stringify(menuitem.get || { bv: menuname })
							});
							if (menuitem.showbody) menuitem.showbody();
							for (var itemname in menuitem.items) {
								var item = Aim.OM.menu.api.item[itemname];
								if (item) {
									item.elLink = appendTag('div', { className: 'row bgd' }).appendTag('a', {
										name: itemname, className: 'row aco abtn icn ' + item.className, innerText: item.title, menuitem: item,
										//par: { mn: this.name },
										par: item.get,
										onclick: Aim.Element.onclick,
										//href: '#' + Aim.URL.stringify({ mn: itemname })
									});
									if (item.showtitle) item.showtitle();
								}
							}
						}
					}
				}
				for (var i = 0; i < 4; i++) appendTag('div', { className: 'card ghost' });
			}
		}
	},
	/*
	openpath: {
		ids: [],
		push: function (id) {
			if (this.ids.indexOf(id) == -1) this.ids.push(id);
			this.open();
		},
		open: function () {
			console.log('openpath', this.ids.join(','));
			for (var i = 0, id ; id = this.ids[i]; i++) {
				var item = Aim.api.item[id];
				if (!('masterID' in item)) return Aim.load({
					get: { id }, onload: function () {
						console.log('openpath.load', this.data);
						if (this.data.masterID) Aim.openpath.push(this.data.masterID);

					}
				})
				console.log('openpath.item', item);
				return;
				//if (row.elDiv && !row.opened) {
				if (!item.opened) {
					this.ids.splice(i, 1);
					item.open();
				}
			}
		}
	},
	*/
	Account: {
		createPage: function () {
			Aim.load({
				api: 'account', onload: function (event) {
					var data = this.data;
					console.log(data);
					with (collist) {
						innerText = '';
						with (appendTag('div', { className: 'col aco treepage showopen', open1: 0 })) {
							appendTag('h1', { className: 'open', innerText: 'Uw gegevens', open: 0 });
							with (appendTag('div')) {
								appendTag('h2', { className: 'open', innerText: 'Profiel', open: 1 });
								with (appendTag('div')) {
									appendTag('div', { innerText: 'Afbeelding' });
									with (appendTag('div')) {
										appendTag('label', { innerText: 'Naam' });
										console.log(data);
										appendTag('span', { innerText: data.user.title });
									}
									with (appendTag('div')) {
										appendTag('label', { innerText: 'Primair email adres' });
										appendTag('span', { innerText: data.user.email });
									}
									with (appendTag('div')) {
										appendTag('label', { innerText: 'Geboortedatum' });
										appendTag('span', { innerText: data.user.Birthday });
									}
									with (appendTag('div')) {
										appendTag('label', { innerText: 'Land/regio' });
										appendTag('span', { innerText: data.user.HomeAddressCountry });
									}
								}
								appendTag('h2', { className: 'open', innerText: 'Contactgegevens', open: 0 });
								with (appendTag('div')) {
									appendTag('h3', { innerText: 'E-mail' });

									appendTag('div', { innerText: 'Deze e-mailadressen zijn aan uw Aliconnect-account gekoppeld' });
									data.user.alias.forEach(function (email) {
										with (appendTag('div')) {
											appendTag('span', { innerText: email + (email == data.user.email ? ' (primair alias)' : '') });
											appendTag('a', { innerText: 'Verwijderen', style: 'float:right' });
										}
									});

									appendTag('div').appendTag('a', {
										innerText: 'E-mailadres toevoegen', onclick: function () {
											colpage.innerText = '';
											with (colpage.appendTag('div', { style: 'background:white;color:black;padding:20px;' })) {
												appendTag('h1', { innerText: 'Een e-mailadres toevoegen' });
												appendTag('div', { innerText: 'Je account kan meerdere aliassen hebben en met elke alias kun je je aanmelden bij alle apparaten en services waarvoor je een Aliconnect-account gebruikt. Voor alle aliassen wordt hetzelfde wachtwoord gebruikt. ' }).appendTag('a', { innerText: 'Meer informatie over accountaliassen.' });
												appendTag('div', { className: 'row' }).appendTag('input', { className: 'aco', placeholder: 'E-mailadres' });
												appendTag('div', { className: 'row' }).appendTag('input', { className: 'aco', placeholder: 'Beveiligingscode' });
												with (appendTag('div', { className: 'row' })) {
													appendTag('button', { className: 'aco', innerText: 'Volgende' });
													appendTag('button', { className: 'aco', innerText: 'Annuleren' });
												}
											}
										}
									});

									appendTag('h3', { innerText: 'Telefoon' });
									appendTag('div', { innerText: 'Deze telefoonnummers zijn aan uw Aliconnect-account gekoppeld' });
									data.user.phones.forEach(function (number) {
										with (appendTag('div')) {
											appendTag('span', { innerText: number + (number == data.user.HomePhones1 ? ' (primair nummer)' : '') });
											appendTag('a', { innerText: 'Verwijderen', style: 'float:right' });
										}
									});

									appendTag('div').appendTag('a', {
										innerText: 'Telefoonnummer toevoegen', onclick: function () {
											colpage.innerText = '';
											with (colpage.appendTag('div', { style: 'background:white;color:black;padding:20px;' })) {
												appendTag('h1', { innerText: 'Een telefoonnummer toevoegen' });
												with (appendTag('div')) {
													appendTag('div', { innerText: 'Je account kan meerdere telefoonnummers hebben voor bevestigingen.' }).appendTag('a', { innerText: 'Meer informatie over telefoonnummers.' });
													appendTag('div', { className: 'row' }).appendTag('input', { className: 'aco', placeholder: 'Telefoonnummer' });
													appendTag('div', { className: 'row' }).appendTag('input', { className: 'aco', placeholder: 'Beveiligingscode' });
													with (appendTag('div', { className: 'row' })) {
														appendTag('button', { className: 'aco', innerText: 'Volgende' });
														appendTag('button', { className: 'aco', innerText: 'Annuleren' });
													}
												}
											}
										}
									});

									appendTag('div').appendTag('a', { innerText: 'Geen wachtwoorden gebruiken maar wel uw account beveiligen' });

									var h = appendTag('h3', {
										innerText: 'Contactpersonen', open: 0, onopen: function () {
											return Aim.load({
												api: 'account/contacts', onload: function (event) {
													console.log(event.data);
													with (this.el) {
														innerText = '';
														event.data.contacts.forEach(function (row) {
															with (appendTag('div')) {
																appendTag('span', { className: 'icn ' + (row.groupName ? ' account' : 'contact'), innerText: [row.hostName, row.accountName, row.domain].join(', ') + (row.groupName ? ' (' + row.groupName + ')' : '') });
																appendTag('a', { innerText: 'Verwijderen', style: 'float:right' });
															}
														});
													}
												}.bind(this)
											});
										}
									});
									with (appendTag('div')) {
										appendTag('div', { innerText: 'Hieronder vindt u een overzicht van alle contactpersonen die gekoppeld zijn aan uw account' });
										h.el = appendTag('div', { innerText: 'Gegevens worden opgehaald. Ogenblik geduld.' });
									}
								}
							}

							appendTag('h1', { className: 'open', innerText: 'Privacy', open: 0 });
							with (appendTag('div')) {
								appendTag('h2', { className: 'open', innerText: 'Overzicht', open: 1 });
								with (appendTag('div')) {
									appendTag('div', { innerText: 'Bij Aliconnect zijn wij van mening dat privacy begint met u te laten bepalen welke hulpmiddelen en informatie u gebruikt om doordachte keuzes te maken. Deze website is de plek waar u uw privacyinstellingen voor de Aliconnect-producten en -services die u gebruikt, kunt beheren en waar u de gegevens kunt bekijken en wissen die door Aliconnect in de cloud worden opgeslagen. Gedetailleerde informatie over weergeven en wijzigen van uw privacy-instellingen, toegang tot gegevens in onze producten en opvragen van gegevens die hier niet beschikbaar zijn, vindt u op aliconnect.nl.' });
									appendTag('h3', { innerText: 'Browsegeschiedenis', open: 0 });
									with (appendTag('div')) {

									}
									appendTag('h3', { innerText: 'Zoekgeschiedenis', open: 0 });
									with (appendTag('div')) {

									}
									appendTag('h3', { innerText: 'Gegevens over activiteiten in producten en services', open: 0 });
									with (appendTag('div')) {

									}
								}
								appendTag('h2', { className: 'open', innerText: 'Uw gegevens downloaden', open: 0 });
								with (appendTag('div')) {
									appendTag('p', { innerText: 'Hier kunt u een kopie downloaden van de gegevens die worden gebruikt voor het afficient presneteren van gegevens binnen de applicaties.' });
									appendTag('p', { innerText: 'Gedownloade archieven bevatten mogelijk gevoelige inhoud, zoals uw zoekgeschiedenis en andere informatie over persoonlijke gegevens. Download het archief niet naar een openbare computer of een andere locatie waar anderen het mogelijk kunnen openen.' });
									appendTag('div').appendTag('a', { innerText: 'Nieuw archief maken' });
								}
								appendTag('h2', { className: 'open', innerText: 'Meer informatie over de inspanningen van Aliconnect met betrekking tot privacy', open: 0 });
								with (appendTag('div')) {
									appendTag('div').appendTag('a', { innerText: 'Onze houding ten opzichte van privacy' });
									appendTag('div').appendTag('a', { innerText: 'Privacyverklaring' });
									appendTag('div').appendTag('a', { innerText: 'Informatieaanvragen van de overheid' });
								}
							}
							appendTag('h1', { className: 'open', innerText: 'Beveiliging', open: 0 });
							with (appendTag('div')) {
								appendTag('div', { innerText: 'Maak uw account veiliger.' });

								appendTag('h2', { innerText: 'Uw wachtwoord wijzigen' });
								appendTag('div', { className: 'icn Permissions' });
								appendTag('div', { innerText: 'Maar uw wachtwoord sterker of wijzig het als u denkt dat iemand het kent.' });
								appendTag('div').appendTag('a', {
									innerText: 'Wachtwoord wijzigen', onclick: function () {
										colpage.innerText = '';
										with (colpage.appendTag('div', { style: 'background:white;color:black;padding:20px;' })) {
											appendTag('h1', { innerText: 'Wachtwoord wijzigen' });
											appendTag('div', { innerText: 'Huidig wachtwoord' });
											appendTag('div', { className: 'row' }).appendTag('input', { className: 'aco', placeholder: 'Huidig wachtwoord' });
											appendTag('div').appendTag('a', { innerText: 'Wachtwoord vergeten?' });

											appendTag('div').appendTag('b', { innerText: 'Nieuw wachtwoord' });
											appendTag('div', { className: 'row' }).appendTag('input', { className: 'aco', placeholder: 'Nieuw wachtwoord' });
											appendTag('div', { innerText: 'Minimaal 8 tekens, hoofdlettergevoelig' });

											appendTag('div').appendTag('b', { innerText: 'Wachtwoord opnieuw invoeren' });
											appendTag('div', { className: 'row' }).appendTag('input', { className: 'aco', placeholder: 'Wachtwoord opnieuw invoeren' });
											with (appendTag('div', { className: 'row' })) {
												appendTag('button', { className: 'aco', innerText: 'Opslaan' });
												appendTag('button', { className: 'aco', innerText: 'Annuleren' });
											}
										}
									}
								});

								appendTag('h2', { innerText: 'Uw beveiligingsgegevens wijzigen' });
								appendTag('div', { className: 'icn BlockContact' });
								appendTag('div', { innerText: 'Controleer of uw gegevens actueel zijn. Op deze manier kunt u uw identiteit bewijzen voor het geval u uw wachtwoord vergeet.' });
								appendTag('div').appendTag('a', {
									innerText: 'gegevens bijwerken', onclick: function () {
										colpage.innerText = '';
										with (colpage.appendTag('div', { style: 'background:white;color:black;padding:20px;' })) {
											appendTag('h1', { innerText: 'Beveiligingsinstellingen' });
											with (appendTag('div')) {
												appendTag('div', { innerText: 'Wanneer je je identiteit moet bewijzen of wanneer je account wordt gewijzigd, gebruiken we je beveiligingsgegevens om contact met je op te nemen.' });
												appendTag('div', { innerText: data.user.HomePhones1 }).appendTag('a', { innerText: 'Verwijderen', style: 'float:right;' });

												with (appendTag('div')) {
													appendTag('a', {
														innerText: 'Beveiligingsgegevens toevoegen', onclick: function () {
															colpage.innerText = '';
															with (colpage.appendTag('div', { style: 'background:white;color:black;padding:20px;' })) {
																appendTag('h1', { innerText: 'Beveiligingsgegevens' });
																with (appendTag('div')) {
																	appendTag('div').appendTag('input', { placeholder: 'Vraag' });
																	appendTag('div').appendTag('input', { placeholder: 'Antwoord' });
																}
																with (appendTag('div')) {
																	appendTag('div').appendTag('input', { placeholder: 'Vraag' });
																	appendTag('div').appendTag('input', { placeholder: 'Antwoord' });
																}
																with (appendTag('div')) {
																	appendTag('div').appendTag('input', { placeholder: 'Vraag' });
																	appendTag('div').appendTag('input', { placeholder: 'Antwoord' });
																}
															}
														}
													});
												}
											}
										}
									}
								});

								//appendTag('div').appendTag('a', { innerText: 'Meldingsopties wijzigen' });
								appendTag('h3', { innerText: 'Waar kunnen we contact met je opnemen over niet-essentiële accountmeldingen?', open: 0 });
								with (appendTag('div')) {
									appendTag('div', { innerText: 'Als we denken dat er mogelijk een probleem is met je account, laten we je dit weten via al je beveiligingsgegevens.' });
									appendTag('div', { innerText: 'Schakel hieronder een selectievakje uit zodat we alleen meldingen verzenden als ze essentieel zijn.' });
									with (appendTag('div')) {
										appendTag('input', { type: 'checkbox' });
										appendTag('span', { innerText: data.user.HomePhones1 });
									}
									appendTag('div', { innerText: 'Opmerking: u kunt u niet afmelden bij meldingen bij uw primaire alias (' + data.user.email + '). Klik hier om uw beveiligingsgegevens te controleren of bij te werken.' });
								}
								appendTag('h2', { innerText: 'Recente activiteit controleren', open: 0 });
								appendTag('div', { className: 'icn History' });
								appendTag('div', { innerText: 'Controleer wanneer en waar u zich hebt aangemeld en laat ons weten als u iets ongewoons opmerkt.' });
								//appendTag('div').appendTag('a', { innerText: 'activiteit controleren' });
								with (appendTag('div')) {
								}
							}
							appendTag('h1', { innerText: 'Betalen en factureren', open: 0 });
							with (appendTag('div')) {
								appendTag('h2', { innerText: 'Adresboek', open: 0 });
								with (appendTag('div')) {

									appendTag('h3', { innerText: 'Voorkeursgegevens voor facturering', open: 1 });
									with (appendTag('div')) {
										appendTag('div', { innerText: 'Waar u uw factureringsgegevens wilt ontvangen' });

										appendTag('h4', { innerText: 'Adres' });

										appendTag('div').appendTag('b', { innerText: data.user.title });
										appendTag('div', { innerText: [data.user.HomeAddressStreet, data.user.HomeAddressNumber, data.user.HomeAddressAdd].join(' ') });
										appendTag('div', { innerText: data.user.HomeAddressPostalCode });
										appendTag('div', { innerText: data.user.HomeAddressTown });
										appendTag('div', { innerText: data.user.HomeAddressState });
										appendTag('div', { innerText: data.user.HomeAddressCountry });
										appendTag('div', { innerText: data.user.HomePhones0 });
										appendTag('div', { innerText: data.user.HomePhones1 });
										//Instellen als uw voorkeursadres voor facturering en verzending
										var editaddress = function () {
											colpage.innerText = '';
											with (colpage.appendTag('div', { style: 'background:white;color:black;padding:20px;' })) {
												appendTag('h1', { innerText: 'Adresgegevens' });

											}
										};
										appendTag('div').appendTag('a', { innerText: 'Bewerken', onclick: editaddress });
										appendTag('div').appendTag('a', { innerText: 'Verwijderen' });

										appendTag('h4', { innerText: 'E-mail' });
										appendTag('div', { innerText: data.user.email });

										appendTag('div').appendTag('a', { innerText: 'Bewerken' });
									}
									appendTag('h3', { innerText: 'Voorkeursgegevens voor verzending', open: 1 });
									with (appendTag('div')) {
										appendTag('div', { innerText: 'Het wordt opgestuurd naar dit adres, tenzij u een ander adres opgeeft' });

										appendTag('h4', { innerText: 'Adres' });

										appendTag('div').appendTag('b', { innerText: data.company.title });
										appendTag('div', { innerText: [data.company.BusinessAddressStreet, data.company.BusinessAddressNumber, data.company.BusinessAddressAdd].join(' ') });
										appendTag('div', { innerText: data.company.BusinessAddressPostalCode });
										appendTag('div', { innerText: data.company.BusinessAddressTown });
										appendTag('div', { innerText: data.company.BusinessAddressState });
										appendTag('div', { innerText: data.company.BusinessAddressCountry });
										//Instellen als uw voorkeursadres voor facturering en verzending
										appendTag('div').appendTag('a', { innerText: 'Bewerken', onclick: editaddress });
										appendTag('div').appendTag('a', { innerText: 'Verwijderen' });
									}
									appendTag('h3', { innerText: 'Overige adressen', open: 0 });
									with (appendTag('div')) {
										appendTag('h4', { innerText: 'Adres' });

										appendTag('div').appendTag('b', { innerText: data.company.title });
										appendTag('div', { innerText: [data.company.OtherAddressStreet, data.company.OtherAddressNumber, data.company.OtherAddressAdd].join(' ') });
										appendTag('div', { innerText: data.company.OtherAddressPostalCode });
										appendTag('div', { innerText: data.company.OtherAddressTown });
										appendTag('div', { innerText: data.company.OtherAddressState });
										appendTag('div', { innerText: data.company.OtherAddressCountry });
										//Instellen als uw voorkeursadres voor facturering en verzending
										appendTag('div').appendTag('a', { innerText: 'Bewerken', onclick: editaddress });
										appendTag('div').appendTag('a', { innerText: 'Verwijderen' });

										appendTag('div').appendTag('a', { innerText: 'Een nieuw adres toevoegen', onclick: editaddress });
									}
								}
								appendTag('h2', { innerText: 'Betalingsopties', open: 0 });
								with (appendTag('div')) {

									appendTag('div', { innerText: 'credicard' });
									appendTag('div', { innerText: 'paypal' });
									appendTag('div', { innerText: 'ideal' });
									appendTag('div', { innerText: 'bank' });
								}
							}
							appendTag('h1', { innerText: 'Apparaten', open: 0, });
							//h.el = appendTag('div');
							with (appendTag('div')) {
								var h = appendTag('h2', {
									innerText: 'Overzicht', open: 0, onopen: function (event) {
										Aim.load({
											api: 'account/devices', onload: function (event) {
												event.data.devices.forEach(function (row) {
													with (this.el.appendTag('div')) {
														appendTag('span', { className: 'icn device', innerHTML: [row.uid, row.startDT].join('<br>') });
														if (row.startDT) appendTag('a', { innerText: 'Uitloggen', style: 'float:right' });
														appendTag('a', { innerText: 'Verwijderen', style: 'float:right' });
													}
												}.bind(this))
											}.bind(this)
										});
									}
								});
								h.el = appendTag('div');
							}
							//appendTag('h1', { innerText: 'Domeinen', open: 0});
							//with (appendTag('div')) {
							//	appendTag('h2', { innerText: 'Overzicht', open: 1});
							//}
						}
					}

				}
			});
		}
	},
	client: {
		app: { id: 3310968, uid: 'BC336B11-769A-4960-B0EB-AE2FCFE940F3' },
	},
	navtree: {
		init: function () {
			//console.log('navtree init');
			this.style.maxWidth = Aim.cookie[this.id + '.width'] || '200px';
			Aim.createButtonbar(navtree.appendTag('div'), { close: { title: 'Sluit formulier', className: 'r', get: { lv: 1, id: null, brd: null, tv: null } } });
			Aim.get(Aim.client.domain.id).elUl = this.appendTag('ul', { className: 'col aco oa' });
			return this;
		},
		//assign: function (el) {
		//	el.style.maxWidth = Aim.cookie[el.id + '.width'] || '200px';
		//	Object.assign(this.el = el, {
		//		colName: 'tv',
		//		onmousedown: Aim.Element.onclick,
		//	});
		//	var btns = {
		//		close: {
		//			title: 'Sluit formulier', className: 'r', get: function () { return { tv: get.tv ? 0 : 2, lv: 1, id: 0, brd: 0 } },
		//		},
		//	};
		//	Aim.createButtonbar(navtree.appendTag('div'), btns);
		//},
		editcancel: function (event) {
			if (Aim.navtree.editing) {
				Aim.navtree.editing = false;
				//Aim.navtree.editItem = null;
				Aim.navtree.itemFocus.elDiv.write();
			}
		},
		keydown: {
			F2: function (event) {
				Aim.navtree.itemFocus.edit();
			},
			Insert: function () {
				console.log('keys.tv.Insert', { focus: Aim.navtree.itemFocus });
				event.preventDefault();
				var master = Aim.navtree.itemFocus;
				if (master) {// && Aim.navtree.itemFocus.class.childClasses && Aim.navtree.itemFocus.class.childClasses[0]) {
					var par = {
						//classID: master.childClasses ? master.childClasses[0] : master.classID,
						schema: master.childClasses ? master.childClasses[0] : master.schema,
						srcID: master.isClass ? master.id : null,
						values: {},
					};

					//if (master.isClass) par.srcID = master.id;
					//if ()
					//else if (master.srcID)

					//var schemaname = api.find(par.classID);
					console.log('PAR', par);
					par.values[api.getTitleAttributeName(par.schema)] = par.schema;


					//if (Aim.navtree.itemFocus.srcID == Aim.navtree.itemFocus.srcID) par.srcID = par.masterID = Aim.navtree.itemFocus.id;

					//OM.appendChildPar = par;
					//Aim.navtree.itemFocus.open();

					master.appendChild(null, par);

				}
			},
			Enter: function () {
				//console.log('keys.tv.Enter1', Aim.navtree.itemFocus.title, OM.select.title, Aim.navtree.itemFocus.master.title, { focus: Aim.navtree.itemFocus, select: OM.select });
				console.log('keys.tv.Enter1', Aim.navtree.itemFocus != App.select, { focus: Aim.navtree.itemFocus, select: App.select });
				if (Aim.navtree.itemFocus != App.select) return Aim.navtree.itemFocus.write();
				var focus = Aim.navtree.itemFocus, master = focus.master, par = { schema: focus.schema };//, schemaname = par.schema;
				if (focus.isClass) par.srcID = par.masterID = master.id;
				par.values = {};
				par.values[api.getTitleAttributeName(par.schema)] = par.schema;
				console.log('keys.tv.Enter2', Aim.navtree.itemFocus.title, App.select.title, Aim.navtree.itemFocus.master.title, { focus: Aim.navtree.itemFocus, select: App.select });
				Aim.navtree.itemFocus.master.appendChild(focus, par);
			},
			Space: function (event) {

				Aim.navtree.itemFocus.select();
				//Aim.navtree.itemFocus.select();

				//OM.show({ id: Aim.navtree.itemFocus.id, lid: Aim.navtree.itemFocus.id });
				event.preventDefault();
			},
			//Tab: function (event) {
			//	OM.show({ lid: Aim.navtree.itemFocus.listId });
			//	event.preventDefault();
			//},
			CtrlEnter: function () {
				Aim.navtree.itemFocus.master.appendChild(
					Aim.navtree.itemFocus, {
						clone: 1,
						//select: api.item[Aim.navtree.itemFocus.srcID].selected,
						srcID: Aim.navtree.itemFocus.srcID,
						classID: Aim.navtree.itemFocus.classID,
						title: Aim.navtree.itemFocus.title,
					}, null, 1);
			},
			CtrlShiftEnter: function () {
				Aim.navtree.itemFocus.master.appendChild(Aim.navtree.itemFocus, { clone: 1, select: api.item[Aim.navtree.itemFocus.id].selected, srcID: Aim.navtree.itemFocus.id, classID: Aim.navtree.itemFocus.classID, name: Aim.navtree.itemFocus.title });
			},
			CtrlDelete: function () {
				Aim.navtree.itemFocus.delete();
			},
			CtrlBackspace: function () {
				Aim.navtree.itemFocus.delete();
			},
			ArrowUp: ArrowUp = function (e) {
				e.preventDefault();
				if (!Aim.navtree.itemFocus) return;
				for (var i = 0, el, c = this.getElementsByTagName('li') ; el = c[i]; i++) if (el == Aim.navtree.itemFocus.elLi) break;
				while ((el = c[--i]) && el.offsetParent === null);
				if (el) el.item.focus(e);
			},
			ArrowDown: ArrowDown = function (event) {
				event.preventDefault();
				if (!Aim.navtree.itemFocus) return;
				for (var i = 0, el, c = Aim.navtree.getElementsByTagName('li') ; el = c[i]; i++) if (el == Aim.navtree.itemFocus.elLi) break;
				while ((el = c[++i]) && el.offsetParent === null);
				if (el) el.item.focus(event);
			},
			ShiftArrowUp: ArrowUp,
			ShiftArrowDown: ArrowDown,
			ArrowLeft: function (event) {
				if (Aim.navtree.itemFocus.opened) Aim.navtree.itemFocus.close();
				else if (Aim.navtree.itemFocus.master) Aim.navtree.itemFocus.master.focus();
			},
			ArrowRight: function (event) {
				if (!Aim.navtree.itemFocus) return;
				if (!Aim.navtree.itemFocus.opened) return Aim.navtree.itemFocus.open();
				navtree.keydown.ArrowDown(event);
				Aim.navtree.itemFocus.select();
			},
			//ShiftArrowUp: function (event) { this.keydown.ArrowUp(event); },
			//ShiftArrowDown: function (event) {
			//	OM.keysdown.tv.Down(event);

			//	//var c = Aim.navtree.getElementsByTagName('li');
			//	//for (var i = 0, e; e = c[i]; i++) if (e == Aim.navtree.itemFocus.elLi) break;
			//	//if (!items.tv.selstart) Aim.navtree.selstart = i;
			//	//while ((e = c[++i]) && e.offsetParent === null);
			//	//items.tv.showsel(i);
			//	//if (e) e.item.focus(event);
			//},
			ShiftAltArrowLeft: function (event) { Aim.navtree.itemFocus.unident(); },
			ShiftAltArrowRight: function (event) { Aim.navtree.itemFocus.ident(); },
			ShiftAltArrowDown: function (event) {
				event.preventDefault();
				Aim.navtree.itemFocus.movedown();
			},
			ShiftAltArrowUp: function (event) {
				event.preventDefault();
				Aim.navtree.itemFocus.moveup();
			},
			CtrlKeyK: function (event) { event.preventDefault(); },
		}
	},
	Panel: Panel = {
		open: function (name) {
			console.log('OPEN', name);
			colpanel.removeAttribute('show');
			//document.body.setAttribute("pnl", name || '');
			if (!name || name == Aim.Panel.name) return Aim.Panel.name = '';
			Aim.Panel.name = name;

			with (colpanel) {
				innerText = '';
				//appendTag('a', { className: 'abtn icn close abs', href: '#Panel.open?' });
				appendTag('a', { className: 'abtn icn close abs', href: '#Panel.open?' });
			}
			this.panels[name]();
			colpanel.setAttribute('show', '');
		},
		panels: {
			account: function () {
				with (colpanel) {
					appendTag('div', { className: 'title', innerText: Aim.client.user.name });
					with (appendTag('ul')) {
						appendTag('li').appendTag('a', { className: 'row', innerText: 'Persoonlijke gegevens', get: { schema: 'account', id: Aim.client.user.id } });
						appendTag('li').appendTag('a', { className: 'row', innerText: 'Account gegevens', get: { schema: 'contact', id: Aim.client.account.id } });
						appendTag('li').appendTag('a', { className: 'row', innerText: 'Account beheer', href: '#Aim/Account/createPage?' });
						appendTag('li').appendTag('a', {
							className: 'row', innerText: 'Mijn account verwijderen', href: '#', onclick: function () {
								if (confirm('Are you sure you want to remove your aliconnect account?')) {
									document.location.href = (document.location.host == 'localhost' ? '' : document.location.protocol + '//aliconnect.nl') + '/auth/remove?redirect_uri=' + document.location.href;
								} else {
									// Do nothing!
								}
								return false;
							}
						});
						//if (!Aim.client.user.mseAccount)
						appendTag('li').appendTag('a', { className: 'row', innerText: 'Connect Outlook', href: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=code&client_id=24622611-2311-4791-947c-5c1d1b086d6c&redirect_uri=https://aliconnect.nl/aim/v1/api/mse.php&state=" + [Aim.client.domain.name].join("+") + "&prompt=login&scope=openid offline_access profile email https://outlook.office.com/mail.readwrite https://outlook.office.com/calendars.readwrite https://outlook.office.com/contacts.readwrite https://outlook.office.com/people.read" });
						appendTag('li').appendTag('a', { className: 'row', innerText: 'Configure mobile', href: "#Panel.open?changemobile", });
						appendTag('li').appendTag('a', { className: 'row', innerText: 'Uitloggen', href: '#Aim.logout' });
					}
				}
			},
			config: function () {
				with (colpanel) {
					appendTag('div', { className: 'title', innerText: 'Instellingen' });
					with (appendTag('ul')) {
						if (App.panels) for (var i = 0, panelname; panelname = App.panels[i]; i++) appendTag('li').appendTag('a', { className: 'row', innerText: pnl[panelname].title, href: '#apnl=' + panelname });
						appendTag('li').appendTag('a', {
							className: 'row', innerText: 'Toevoegen mail vanuit outlook', onclick: function (event) {
								Aim.wss.send({ to: { deviceUID: Aim.deviceUID }, msg: { external: 'mailimport' } });
								return false;
							}
						});
						appendTag('li').appendTag('a', {
							className: 'row', innerText: 'Toevoegen contacten vanuit outlook', onclick: function (event) {
								Aim.wss.send({ to: { deviceUID: Aim.deviceUID }, msg: { external: 'contactimport' } });
								return false;
							}
						});
						if (Aim.Upload) appendTag('li').appendTag('a', { className: 'row', innerText: 'Upload datafile', onclick: function () { Aim.Upload.create(collist.appendTag('div', { className: 'row abs upload' }), this.items) }.bind(this) }),
						appendTag('li').appendTag('a', {
							className: 'row', innerText: 'Get User device UID for aliconnect service', onclick: function (event) {
								copyText = document.body.appendTag('input', { value: Aim.deviceUID });
								copyText.select();
								document.execCommand("Copy");
								document.body.removeChild(copyText);
								alert('Plak (Ctrl+V) de code in het veld "User device UID" van uw aliconnector app');
							}
						});
					}
				}
			},
			help: function () {
				with (colpanel) {
					appendTag('div', { className: 'title', innerText: 'Help' });
					appendTag('input', { placeholder: 'Laat weten wat u wilt doen?', title: 'Laat weten wat u wilt doen?', required: true, autocomplete: "off" });
					with (appendTag('div', { className: 'cap col' })) {
						//appendTag('div', { innerText: '© 2017 Alicon Systems BV' });
						with (appendTag('div', { className: 'row' })) {
							appendTag('a', { innerText: 'Voorwaarden', href: document.location.protocol + '//aliconnect.nl/?id=466590&n=Meer&wv=1', target: 'voorwaarden', style: 'margin-right:20px;' });
							appendTag('a', { innerText: 'Privacy en cookies', href: document.location.protocol + '//aliconnect.nl/?id=466591&n=Meer&wv=1', target: 'voorwaarden', });
						}
					}
				}
			},
			changepassword: function () {
				with (colpanel) {
					appendTag('div', { className: 'title', innerText: 'Wachtwoord wijzigen' });
					this.elTitle.appendTag('div').appendTag('img', { src: logofile, style: 'max-width:200px;margin:20px 0;' });
					this.elTitle.appendTag('div', { innerText: 'Wachtwoord wijzigen' });
					with (this.form) {
						appendField({ label: 'Email', className: 'none', required: true, attr: { autocomplet: 'username', }, name: 'username', value: aliconnect.user.email });
						appendField({ name: 'password', placeholder: 'Huidig wachtwoord', type: 'password', required: true, msg: function () { return { 'Huidig wachtwoord invullen': !this.value }; } }).focus();
						appendTag('div').appendTag('input', { placeholder: 'Beveiligingscode', required: true });
						appendField({ name: 'password1', placeholder: 'Nieuw wachtwoord', type: 'password', required: true, msg: function () { return { 'Nieuw wachtwoord minimaal 6 karakters': this.value.length < 6 }; } });
						appendField({ name: 'password2', placeholder: 'Herhaal uw nieuwe wachtwoord', type: 'password', required: true, msg: function () { return { 'Wachtwoord 2 komt niet overeen': this.value != this.form.password1.value }; } });
						with (appendTag('div', { className: 'row abtns' })) {
							appendTag('button', { type: 'button', innerText: 'Terug', className: 'abtn icn', onclick: function () { pnl.show(pnl.login); } });
							appendTag('button', { type: 'submit', innerText: 'Volgende', className: 'abtn icn', name: 'auth', value: 'changepassword', default: true });
						}
					}
				}
			},
			changemobile: function () {
				with (colpanel) {
					appendTag('div', { className: 'title', innerText: 'Mobiel nummer wijzigen' });
					this.elMsg = appendTag('div', { innerText: 'Voer uw mobiel nummer in en druk de knop verzend.' });
					this.elMobile = appendTag('input', { placeholder: 'Mobiel nummer (incl landcode bv +31612345678)', required: true });
					this.elCode = appendTag('input', { placeholder: 'Beveiligingscode', required: true, style: 'display:none;' });
					this.elVerzend = appendTag('button', {
						innerText: 'Verzend', className: 'abtn send', onclick: function () {
							Aim.load({
								api: 'mobilephone', put: { number: this.elMobile.value.replace(/ |\(|\)|-|_|\+/g, ''), code: this.elCode.value }, onload: function (event) {
									console.log('data', event.data);
									switch (event.data.state) {
										case 'wrongcode':
											this.elMsg.innerText = "Deze code is verkeerd. Vraag een nieuwe code aan.";
											this.elMobile.style.display = 'none';
											this.elCode.style.display = '';
											return;
										case 'send':
											this.elMsg.innerText = "Voer de op uw mobile ontvangen beveiligingscode in en druk de knop verzend.";
											this.elMobile.style.display = 'none';
											this.elCode.style.display = '';
											return;
										case 'done':
											this.elMsg.innerText = "Uw nummer is aangepast.";
											this.elMobile.style.display = this.elCode.style.display = this.elVerzend.style.display = 'none';
											return;
									}
								}.bind(this)
							})
						}.bind(this)
					});
				}
			},
			addemail: function () {
				with (colpanel) {
					appendTag('div', { className: 'title', innerText: 'Email toevoegen' });
					appendTag('div', { innerText: 'Voer uw email adres in en druk enter.' });
					appendTag('div').appendTag('input', { placeholder: 'Email adres', required: true, onchange: function () { } });
					appendTag('div').appendTag('input', { placeholder: 'Beveiligingscode', required: true, onchange: function () { } });
					appendTag('div').appendTag('button', { innerText: 'Back' });
				}
			},
			messages: function () {
				//Aim.URL.set({ folder: item.id, select: "title,subject,summary,state,startDT,files,filterfields", filter: "finishDT+IS+NULL", child: 1, q: '*', title: item.title });
				with (colpanel) {
					appendTag('div', { className: 'title', innerText: 'Berichten' });

				}
			},
			tasks: function () {
				//Aim.URL.set({ folder: 'task', select: "title,subject,summary,state,startDT,files,filterfields", filter: "finishDT+IS+NULL", q: '*', title: item.title });
				with (colpanel) {
					appendTag('div', { className: 'title', innerText: 'Taken' });
					if (Aim.cache['task/usertasks']) with (appendTag('ul')) {
						innerText = '';
						console.log('TASKS>>>', Aim.cache['task/usertasks']);
						var tasks = Aim.Object.toArray(Aim.cache['task/usertasks'].task);
						tasks.forEach(function (row) {
							//console.log(row, api.item[row.id], api.item[row.id] && api.item[row.id].fields && api.item[row.id].fields.finishDT ? api.item[row.id].fields.finishDT.value : null);
							var onclick = function (event) {
								pnl.task.data.splice(pnl.task.data.indexOf(this.row), 1);
								pnl.task.data.unshift(this.row);//.copyWithin(0, pnl.task.data.indexOf(this.row));
								OM.show({ id: this.row.id, bv: 0, apnl: 0 });
								Aim.load({
									api: 'task/activate', post: { id: this.row.id }, onload: function () {
										console.log('TASK ACTIVATED', this.responseText);
									}
								});
							};
							with (appendTag('li').appendTag('a', { className: 'col', row: row, onclick: onclick })) {
								appendTag('div', { innerText: row.title });
								appendTag('div', { innerText: row.subject });
								appendTag('div', { innerText: row.summary });
							}
						});
						msg.setcnt(pnl.task.btn, pnl.task.data.length);
					}
				}
			},
		},
	},
	updateList: [],
	undo: function () {
		console.log('UNDO', Aim.updateList);
		if (this.undoData = Aim.updateList.shift()) {
			this.undoData.value.reverse().forEach(function (row) {
				if (row.eventType == 'paste') row.eventType = 'cut';
				else if (row.eventType == 'cut') row.eventType = 'paste';
			});
			this.undoData.from = true;
			OM.update(this.undoData, true);
		}
	},
	//copyToClipboard(event) {
	//	var data = { value: [] };
	//	for (var i = 0, item; item = OM.clipitems[i]; i++) data.value.push({ id: item.id });
	//	event.clipboardData.setData('application/json', JSON.stringify(data));
	//	//event.clipboardData.setData('text/plain', 'MAX PLAIN');
	//	//event.clipboardData.setData('text/html', '<b>MAX HTML</b>');
	//	Aim.hiddeninput.value = ' ';
	//	Aim.hiddeninput.focus();
	//	Aim.hiddeninput.select();
	//	event.preventDefault();
	//},

	update: function (data, targetItem, eventType) {
		//if (!data || !targetItem) return false;
		if (!data) return false;
		if (typeof data == 'string') data = JSON.parse(data);
		if (data.value) {
			//var updateAction = '';
			if (!data.from) Aim.updateList.unshift(data); // Add data to update history list
			data.value.forEach(function (row, i, rows) {
				var item = Aim.get(row.id);
				row.eventType = row.eventType || eventType;
				//console.log("UPDATE", eventType, row.eventType, row, targetItem, item);
				if (!item) return;

				switch (eventType || row.eventType) {
					case 'copy':
						targetItem.appendChild(null, { schema: item.schema, title: item.title, userID: 0, srcID: item.id }, null, true);
						break;
					case 'link':
						//console.log('LINK', item);
						targetItem.appendChild(null, { schema: item.schema, title: item.title, detailID: item.id }, null, true);
						break;
					case 'cut':
						//console.log('CUT', row.masterID, item.masterID);
						if (row.masterID != item.masterID) {
							console.log('NO CUT', row.masterID, item.masterID);
							return;
						}
						if (item.master && item.master.children && item.master.children.length) {
							item.master.children.splice(item.master.children.indexOf(item), 1);
							item.master.children.forEach(function (item, i) { item.idx = i });
						}
						if (item.elLi) item.elLi.parentElement.removeChild(item.elLi);
						if (item.elLvLi && item.elLvLi.parentElement) item.elLvLi.parentElement.removeChild(item.elLvLi);

						if (targetItem) {
							//console.log('MOVE TO');

							if (targetItem.masterID == targetItem.srcID) {
								//target isClass en verplaatsen: ITEM wordt afgeleid van nieuwe CLASS
								//item.masterID = item.srcID = row.srcID = row.masterID = targetItem.id;
								console.log('MOVE TO CLASS', targetItem, item.srcID = row.srcID = item.masterID = row.masterID = row[item.getPropertyAttributeName('masterID')] = targetItem.id, item.master);
								var propertyAttributeName = item.getPropertyAttributeName('srcID');
								if (propertyAttributeName) row[propertyAttributeName] = { itemID: row.srcID };
								var propertyAttributeName = item.getPropertyAttributeName('masterID');
								if (propertyAttributeName) row[propertyAttributeName] = { itemID: row.masterID };
							}
							else {
								console.log('MOVE TO', targetItem.elLI, item.masterID = row.masterID = row[item.getPropertyAttributeName('masterID')] = targetItem.id, item.master);
							}

							////Item isClass en target !isClass, dus verplaatsen en ITEM wordt afgeleid van nieuwe CLASS
							//if (row.masterID == row.srcID && targetItem.masterID != targetItem.srcID && eventType=="paste") item.masterID = item.srcID = row.srcID = row.masterID = targetItem.id;
							//item.masterID = targetItem.id;
							if (item.master) {
								item.master.children.push(item);
								if (item.master.elUl) item.appendTo(item.master.elUl);
							}
						}
						break;
						//case 'paste':
						//	if (row.masterID) {
						//		item.masterID = row.masterID;
						//		if (item.master) {
						//			if (row.masterID == row.srcID && item.master.masterID == item.master.srcID);
						//			if (row.masterID == row.srcID && item.master.masterID == item.master.srcID);

						//			item.master.children.push(item);
						//			if (item.master.elUl) item.appendTo(item.master.elUl);
						//		}
						//	}
						//	break;
					default:
						break;
				}
			});

			//console.log('UPDATE', data);
			//return true;
			if (!data.from) Aim.wss.send(Object.assign({ post: 1, to: { host: Aim.client.domain.id } }, data));
			return true;
		}
	},
	navtreeSelitems: function () {
		//var items = [];
		OM.selitems.forEach(function (e) { OM.clipitems.push(e); e.elLi.setAttribute('checked', event.type); });
	},
	on: {
		init: function () {
			//Aim.load({
			//	origin: document.location.protocol + '//aliconnect.nl', get: { folder: 'contacts', select: 'DisplayName,EmailAddresses,MobilePhone1', top: 2000 }, onload: function () {
			//		console.log('MSE', this.src, this.data);
			//		if (!this.data) return;
			//		//var contacts = Aim.Object.toArray(this.data.contacts);
			//		OM.contactsEmail = {};
			//		this.data.value.forEach(function (row) {
			//			if (row.values && row.values.EmailAddresses) row.values.EmailAddresses.forEach(function (email) {
			//				if (email.Address) OM.contactsEmail[email.Address.toLowerCase()] = row;
			//			});
			//		});
			//		//console.log('OM.init.onload', this.src, OM.contactsEmail);
			//	}
			//})
			today = aDate();
			today.setHours(0, 0, 0, 0);
			var a = navigator.userAgent.split('/');
			var name;
			for (var i = 0, n; n = a[i]; i++) {
				var p = n.split(' ');
				var e = {};
				if (a[i + 1]) name = p.pop();
				e.ver = p.shift();
				if (e.ver) e.ver = e.ver.split('.');
				e.add = p.join(' ');
			}
			if (document.getElementById('header')) { var p = document.getElementById('header').nextElementSibling; p.parentElement.removeChild(p); };
			with (OM.el = document.body) {
				className += ' ' + Aim.version;
				with (navtop) {
					appendTag('a', { title: 'Naar webpagina', className: 'abtn icn btnapp Webpage br', href: '/' + Aim.client.domain.name + '/app/site/' });
					appendTag('b', { innerText: Aim.client.domain.name.toUpperCase() + ' Object Manager' });
					OM.elInputZoek = appendTag('input', {
						className: "search aco", required: '', name: 'q', items: [], autocomplete: 'off', placeholder: 'zoeken', onchange: function () {
							console.log(this.value);
							Aim.URL.set({ q: this.value });
							//Listview.items = [];
							//Listview.set({ q: this.value });
							this.select();
						}
					});
					Listview.items = OM.elInputZoek.items;
					appendTag('a', { title: 'Zoeken', className: "abtn icn search fr", });
					appendTag('span', { className: 'r' });
					Aim.Element.btnMsg = appendTag('a', { className: 'abtn icn userbtn btnapp msg bl cnt', onclick: Aim.Element.onclick, href: "#Panel.open?messages", });
					Aim.Element.btnTaks = appendTag('a', { className: 'abtn icn userbtn btnapp task bl cnt', onclick: Aim.Element.onclick, href: "#Panel.open?tasks", });
					//Aim.Element.btnMsg = appendTag('a', { className: 'abtn icn userbtn btnapp msg bl cnt', onclick: function () { Aim.URL.set({ folder: 'item', modified: 1 }); } });
					//console.log('MESSAGE CHECK');
					//Aim.Element.btnTask = appendTag('a', { title: 'Actieve taken', className: 'abtn icn userbtn btnapp task bl cnt', onclick: function () { Aim.URL.set({ folder: '', filter: 'endDT+IS+NOT+NULL+AND+finishDT+IS+NULL+AND+ownerID=' + Aim.client.user.id, id: '', order: '', child: '', select: '' }); } });
					appendTag('a', { title: 'Instellingen', className: 'abtn icn userbtn btnapp config bl', onclick: Aim.Element.onclick, href: "#Panel.open?config", });
					appendTag('a', { title: 'Hulp', className: 'abtn icn userbtn btnapp help bl', href: "#Panel.open?help", });
					elLogin = appendTag('a', { title: 'Account gegevens', className: 'abtn icn account bl ' + Aim.client.user.id, innerText: String(Aim.client.user.name).replace(/\+/g, ' '), href: "#Panel.open?account", }).appendTag('span');
					Aim.load({
						title: 'Persoonlijke berichten', api: 'message/check', onload: function () {
							//console.log('Messages', this.data);
							//Aim.Element.btnTaks.setAttribute('cnt', this.data.count);
							//Aim.Element.btnTaks.appendTag('span', { className: 'cnt', innerText: this.data.count });
						}
					});

					//console.log("AAAAAAAAAAA", Aim.client.user.id);

					//Aim.load({
					//	get: { filter: 'endDT+IS+NOT+NULL+AND+finishDT+IS+NULL+AND+ownerID=' + Aim.userID, count: 1 }, onload: function (event) {
					//		console.log('TASK', this.src, this.data);
					//		Aim.Element.btnTask.setAttribute('cnt', this.data.count);
					//		//Aim.Element.btnTaks.appendTag('span', { className: 'cnt', innerText: this.data.count });
					//	}
					//});

				}
				//OM.elMenu = navleft;//appendTag('div', { userhint: 'Dit is het menu. Hierkunt u bepalen wat u gaat doen.', className: "col amn amenu noselect np" });
				for (var i = 0, e, c = document.getElementsByClassName('seperator') ; e = c[i]; i++) OM.seperator.call(e);

				//Aim.navtree.assign(Aim.get(Aim.client.domain.id).elLi = navtree);
				//console.log('lllllllllllllll', Aim.client.domain.id, Aim.client.domain.id1);
				(Aim.get(Aim.client.domain.id).elLi = Aim.navtree = Object.assign(document.getElementById('navtree'), Aim.navtree)).init();
				Listview = Aim.collist = Object.assign(document.getElementById('collist'), Aim.collist);

				//Aim.get(Aim.client.domain.id).elUl = Aim.navtree.el.appendTag('ul', { className: 'col aco oa' });


				Aim.get(Aim.client.domain.id).open();

				//console.log(Aim.client.domain.id,Aim.get(Aim.client.domain.id));
				//OM.seperator.call(appendTag('div', { className: "noselect" }));
				//Aim.collist.assign(collist);
				//Object.assign(OM.elBrd = colboard, { col: OM.brd, onmousedown: Aim.Element.onclick, });
				//OM.seperator.call(appendTag('div', { className: 'right noselect', right: true }));
				Object.assign(ImageSlider.elSrc = colpage = elPage = colpage, {
					colName: 'pv',
					//style: 'max-width:' + Aim.cookie['colpage.width'] || '700px',
					//style: 'flex-basis:700px;',
					onmousedown: Aim.Element.onclick,
					close: function (event) {
						colpage.innerText = '';
						if (window.onWindowResize) window.onWindowResize();
					},
				});
				colpage.style.maxWidth = Aim.cookie['colpage.width'] || '700px';
				//if (document.getElementById('baseframe')) appendChild(document.getElementById('baseframe'));
				//Aim.Element.iv = appendTag('div', { className: "col aiv noselect oa" });
				Aim.Element.info = colinfo;//appendTag('div', { className: "col ainf" });
				//msg.init();
				with (OM.elErrCont = appendTag('div', { className: 'col err none' })) {
					with (appendTag('div', { className: 'row err hdr' })) {
						appendTag('span', { className: '', innerText: '' });
						appendTag('span', { className: '', innerText: 'System' });
						appendTag('span', { className: 'aco', innerText: 'Message' });
						appendTag('span', { className: 'time', innerText: 'Start' });
						appendTag('span', { className: 'time', innerText: 'Accept' });
						appendTag('span', { className: 'time', innerText: 'End' });
					}
					OM.elErr = appendTag('div', { className: 'col oa' });
				}
				elInpInfo = document.body.appendTag('div', { className: 'inputinfo shadow' });
				window.dispatchEvent(new Event('resize'));
			}
			//Aim.elStatusbar = document.body.appendTag('div', { className: 'statusbar' });
			window.ext = (typeof external != 'undefined' && typeof external.ipSend != 'undefined');

			//OM.auth.refresh();
			//if (!document.location.search) document.location.href = '#id=' + Aim.clientaccountID;
			OM.setactivestate(document.hasFocus() ? 'focus' : 'online');
			//Aim.load({
			//	msg: 'Takenlijst',
			//	api: 'task/usertasks',
			//	onload: function () {
			//		//console.log('TASKS', this.src, this.data, api.task, aim);
			//		//return;
			//		pnl.task.data = this.data.value;
			//		pnl.task.data.forEach(function (row, id) {
			//			//row.id = id;
			//			if (row.lastvisitDT) row.lastvisitDT = new Date(row.lastvisitDT);
			//			if (row.values) {
			//				if (row.endDT) row.endDT = new Date(row.endDT);
			//				if (row.startDT) row.startDT = new Date(row.startDT);
			//			}
			//			//pnl.task.data.push(row);
			//		});
			//		pnl.task.data.sort(function (a, b) {
			//			var sortkeys = { lastvisitDT: -1, state: 1, endDT: 1, startDT: 1 };
			//			for (var fname in sortkeys) {
			//				if (a[fname] > b[fname]) return sortkeys[fname];
			//				else if (a[fname] < b[fname]) return -sortkeys[fname];
			//			}
			//		});
			//		msg.setcnt(pnl.task.btn, pnl.task.data.length);
			//	},
			//});
			//console.log(Aim);
			Aim.navleft.create(navleft);
			//Aim.OM.menu.init();
			//Aim.api.fav = [];
			//Aim.URL.exec(document.location.search.substr(1),2);
			//if (document.location.hash) Aim.URL.exec(document.location.hash.substr(1));
			//console.log('OM LOAD DONE');
			//Aim.load({
			//	get: { folder: "item", select: "id,title,subject,summary,fav", filter: "id+IN(SELECT+id+FROM+om.itemFav)", }, onload: function () {
			//		console.log('FAV', this.src, this.data);
			//	}
			//});
			//Aim.load({
			//	api: "fav", onload: function () {
			//		Aim.fav = this.data;
			//		console.log('FAV',Aim.fav);
			//	}
			//});
			//Aim.load({
			//	folder: "item", select: "id,title", filter: "id+IN(SELECT+id+FROM+om.itemFav)", onload: function () {
			//		console.log('FAV', this.data);
			//	}
			//});

			//return;
			//if (Aim.client.account.id) Aim.get({ id: ';his' }).loadItems();
			//items.userloaded();

			Aim.hiddeninput = document.body.appendTag('input', { style: 'display:none;' });

		},
		message: function (event) {
			//console.log('message', event.data);
			if (event.data) OM.update(event.data);
			var data = event.data;
			if (data.value)


				//console.log('ONMESSAGE OM',this,event);
				//console.log('onreceive', this.data);
				//if (data.Notification) Aim.Notification.create(data.Notification);
				if (data.state && data.from.app == 'aliconnector' && data.from.ip == Aim.client.ip) {
					//console.log('CONNECT');
					document.body.setAttribute('aliconnector', Aim.Aliconnector.state = data.state);
					// if (data.state=='disconnected') {
					// 	Aim.hasConnector=false;
					// 	//document.body.style.color='red';
					// }
					if (data.state == 'connected') {
						//Aim.hasConnector=true;

						//document.body.style.color='green';
						if (!data.ack) Aim.wss.send({ to: { client: data.from.client }, state: 'connected', ack: 1 });
						if (data.from.device != Aim.client.device.id) {
							//alert('SYNC ALICONNECT DEVICE_ID');
							Aim.wss.send({ to: { client: data.from.client }, device: Aim.client.device });
							//console.log('CONNECT ALICONNECTOR',senddata);
						}
					}
				}


			//{
			//	console.log('Notification', data.Notification);
			//	OM.Notification.Notify(data.Notification.title, data.Notification.options);
			//	//{
			//	//	body: "Bericht geplaatst door " + data.get.from,
			//	//	url: "https://aliconnect.nl/tms/app/om/#id=" + data.get.id,
			//	//	//url: "https://aliconnect.nl/moba/app?lid=;2101;;finishDT+IS+NULL&q=*&n=EWR&id=2776611&pv=1",
			//	//	//icon: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
			//	//	//image: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
			//	//	data: data,
			//	//});
			//}
			//if (data.value) data.value.forEach(function (item) {

			//});

			//console.log('OnReceive', data);
			//console.log(data);
			//if (data.supportmessage) Aim.Notification.create(data.supportmessage);
			if (data.reload) document.location.href = document.location.href;
			if (data.app == 'aliconnector') {
				if (!msg) return;
				Aim.aliconnector = msg;
				console.log('aliconnector', msg);
				if (msg.state == 'connected') {
					Aim.wss.send({ to: { deviceUID: Aim.deviceUID }, msg: { userName: Aim.accountName || Aim.client.user.name, userUID: Aim.userUID } });
					//Notify("EWR 4292 Updated", {
					//    body: "TL20 on packing lanes before CP12",
					//    url: "https://aliconnect.nl/moba/app?lid=;2101;;finishDT+IS+NULL&q=*&n=EWR&id=2776611&pv=1",
					//    icon: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
					//    //image: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
					//});
					//Notify('fdsgsdfgsdfgs');
				}
				if (msg.state) {
					//Aim.wss.send({ broadcast: true, msg: { id: Aim.client.user.id, uid: Aim.userUID, state: msg.state } });
					//document.body.setAttribute('aliconnector', msg.state);
				}
				//{
				//    document.body.setAttribute('aliconnector', 'online');
				//}
				//return;
				//if (Aim.aliconnector.state == 'init') Aim.wss.send({ to: { deviceUID: Aim.deviceUID }, msg: { userName: Aim.accountName } });
				//clearTimeout(OM.toaliconnector);
				//OM.toaliconnector = setTimeout(function () { document.body.setAttribute('aliconnector', Aim.aliconnector.state = 'offline'); }, 40000);
				//console.log('ONLINE SERVICE', data);
				//document.body.setAttribute('aliconnector', 'online');
			}

			//if (msg.post && msg.post.item && api.item[msg.post.item.id]) {
			//    var item = api.item[msg.post.item.id];
			//    console.log(document.location.href);
			//    //Notify(item.title, {
			//    //    body: "Modified by user",
			//    //    icon: item.files && item.files[0] ? "https://aliconnect.nl" + item.files[0].src : null,//"https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
			//    //    //image: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
			//    //    data: { id: item.id, url: document.location.href },
			//    //});
			//}




			if (data.editfiledone) {
				var c = document.getElementsByName(data.editfiledone);
				for (var i = 0, e; e = c[i]; i++) e.setAttribute('state', '');
			}
			if (data.editfile) {
				data.editfile = data.editfile.split('/').pop();
				var c = document.getElementsByName(data.editfile);
				for (var i = 0, e; e = c[i]; i++) e.setAttribute('state', 'editing');
			}


			//if (api.item[data.id]) OM.itemSetAttribute(data.id, data.name, data.value);


			//if (msg.items) itemset(msg.items);//for (var id in msg.items) if (api.item[id]) { msg.api.item[id].id = id; itemset(msg.api.item[id]); }

			//if (data.activestate) {
			//    OM.itemSetAttribute(data.userID, 'activestate', data.activestate);
			//    OM.itemSetAttribute(data.accountID, 'activestate', data.activestate);
			//    //if (api.item[data.userID]) {
			//    //    api.item[data.userID].guistate = data.guistate;
			//    //    var c = document.getElementsByName('state' + data.accountID);
			//    //}
			//    //if (api.item[data.accountID]) api.item[data.accountID].guistate = data.guistate;
			//    //for (var i = 0, e; e = c[i]; i++) e.setAttribute('state', 'online');
			//    //if (api.item[data.accountID]) api.item[data.accountID].onlinestate = 'online';
			//}
			//if (data.a == 'blur') {
			//    var c = document.getElementsByName('state' + data.accountID);
			//    for (var i = 0, e; e = c[i]; i++) e.setAttribute('state', 'offline');
			//    if (api.item[data.accountID]) api.item[data.accountID].onlinestate = 'offline';
			//}



			if (data.alert) alert(data.alert);


			//if (data.deviceUID == Aim.deviceUID) {
			return;
			//}
			if (data.a == 'submit' && api.item[data.id] && api.item[data.id].modifiedDT != data.modifiedDT) {
				//console.log('SUBMIT', data.id);
				//if (data.hostID == Aim.client.domain.id) {
				//console.log('SUBMIT', data, Aim.client.domain.id, get.id, data.id);
				if (get.id == data.id) api.item[data.id].reload();
				else if (api.item[data.id]) api.item[data.id].loaded = false;
				msg.check();
				//}
			}
		},
		unload: function () {
			OM.setactivestate('offline');
		},
		beforeunload: function () {
			if (Aim.openwindows) for (var name in Aim.openwindows) { Aim.openwindows[name].close(); }
		},
		beforeprint: function () {
			//var e = Listview.elOa;
			console.log('BEFORE PRINT'); //items.printiframe(Listview.elOa);
			if (!Aim.printElement) Aim.printElement = document.body.appendTag('div', { className: 'doc-content printablediv' }); //document.body.appendTag('table', { className: 'printablediv', style: 'width:100%;' });
			//OM.elPrintDiv.innerHTML = OM.printdiv.innerHTML;

			with (Aim.printElement) {
				console.log(Aim.printSource, Aim.printHeader);
				innerText = '';
				if (!Aim.printHeader) return innerHTML = Aim.printSource.innerHTML;
				with (appendTag('table', { className: 'border', style: 'width:100%;' })) {
					//with (appendTag('thead').appendTag('tr').appendTag('th').appendTag('div', { style: 'display:table;table-layout:fixed;width:100%;' }).appendTag('div', { style: 'display:table-row;' })) {
					//    appendTag('div', { style: 'display:table-cell;width:35mm;padding:10px;border-bottom:solid 1px #ccc;vertical-align:middle;' }).appendTag('img', { src: App.files && App.files[1] ? App.files[1].src : '' });
					//    with (appendTag('div', { style: 'display:table-cell;padding:10px;border-bottom:solid 1px #ccc;vertical-align:top;' })) {
					//        if (Aim.printheader) {
					//            appendTag('div', { className: 'kop0', innerText: Aim.printheader.kop0 || '' });
					//            appendTag('div', { className: 'kop1', innerText: Aim.printheader.kop1 || '' });
					//            appendTag('div', { className: 'kop2', innerText: OM.printdiv ? OM.printdiv.title : Aim.printheader.kop2 || '' });
					//        }
					//    }
					//}
					appendTag('thead').appendTag('tr').appendTag('th', { innnerHTML: Aim.printHeader.innerHTML });
					appendTag('tbody').appendTag('tr').appendTag('td', { className: 'doc', innerHTML: Aim.printSource.innerHTML });
					with (appendTag('tfoot').appendTag('tr').appendTag('th').appendTag('div')) {
						appendTag('span', { style: 'float:right;', innerText: 'Printed: ' + new Date().toLocaleString() + ' by ' + Aim.accountName });
					}
				}
			}
		},
		afterprint: function () {
			//var e = Listview.elOa;
			//console.log('BEFORE PRINT'); //items.printiframe(Listview.elOa);


			//if (OM.elPrintDiv) OM.elPrintDiv.innerText = '';
		},
		focus: function () {
			//console.log('FOCUS');
			setTimeout(function () { OM.setactivestate('focus'); }, 100);

			////if (!App.user) return;
			//var data = { activestate: 'focus', accountID: Aim.client.account.id, userID: Aim.client.user.id, to: [Aim.key] };
			//OM.itemSetAttribute(data.userID, 'activestate', data.activestate);
			//OM.itemSetAttribute(data.accountID, 'activestate', data.activestate);
			//Aim.wss.send(data);

			////console.log('onfocus start');
			////msg.check(true); HOEFT NIET GEBEURD VIA EVENT RT SERVER
			//Aim.load({
			//    api: 'window/focus/' + aliconnect.deviceUID,
			//    //post: { exec: 'onfocus', deviceUID: App.user ? aliconnect.deviceUID : '', },
			//    onload: function () {
			//        //console.log('onfocus done', this.post, this.responseText);
			//        //if (App.user && Aim.client.user.id && this.data.UserID != Aim.client.user.id) OM.show({ wv: 1, apnl: 'login' });//document.location.href = '?wv=1&apnl=login';
			//    }
			//});
		},
		blur: function () {
			//console.log('BLUR');
			OM.setactivestate('online');
			//if (!App.user) return;
		},
		keydown: function (event) {
			//clearTimeout(Aim.keydownTimeout);
			//clearTimeout(Aim.keyupTimeout);
			//console.log('DOWN', event.code, event.key);

			//if (!Aim.keyControl && event.ctrlKey && event.key != 'Control') Aim.keyControl = event.code;


			//event.prevKeyValue = Aim.prevKeyValue;
			//event.keyValue = [event.ctrlKey ? 'Ctrl' : '', event.shiftKey ? 'Shift' : '', event.altKey ? 'Alt' : '', event.code].join('');
			//if (document.activeElement != document.body) event.keyValue += 'Edit';
			//Aim.keydownEvent = event;

			//console.log('keydown', Aim.keyControl, event.keyValue, Aim.clickElement);

			//for (var el = Aim.clickElement; el; el = el.parentElement) if (el.keydown && el.keydown[event.keyValue]) return el.keydown[event.keyValue].call(el, event);
			if (Aim.keydown[event.keyValue]) Aim.keydown[event.keyValue](event);
			//Aim.prevKeyValue = event.keyValue;



			return;

			var keys = OM.keydown;
			//console.log(event);
			clearTimeout(OM.timeoutKeydown);
			var key = event.code;
			if (key) {
				var keyevent = null;
				var key = key.replace('Arrow', '').replace('Escape', 'Esc');
				if (event.timeStamp > OM.setting.keyTimeStamp + 100) OM.setting.keybuf = '';
				OM.setting.keyTimeStamp = event.timeStamp;

				if (key == 'Enter') {
					//console.log('KKK', OM.setting.keybuf);
					if (OM.setting.keybuf.length == 10 && !isNaN(OM.setting.keybuf)) return auth.keyloggin(OM.setting.keybuf);
					OM.setting.keybuf = OM.setting.keybuf.split('CapsLockCapsLock');
					if (OM.setting.keybuf[1]) {
						bc = OM.setting.keybuf.pop();
						console.log(bc);
						OM.elInputZoek.value = bc;
						OM.formfind.onsubmit();
					};
					OM.setting.keybuf = '';
				} else {
					OM.setting.keybuf += event.key;
				}

				if (event.shiftKey) key += 'Shift';
				if (event.ctrlKey) key += 'Ctrl';
				if (event.altKey) key += 'Alt';
				if (keys[key]) return keys[key](event);

				if (document.activeElement != document.body) key += 'Edit';

				if (keyevent = keys[key]) return keyevent(event);

				if (keys[key]) return keys[key](event);

				//key += document.body.getAttribute('ca');
				if (OM.keyboardto) clearTimeout(OM.keyboardto);
				if (document.body) {
					if (!document.body.getAttribute('ca')) return;
					if (keys[document.body.getAttribute('ca')] && (keyevent = keys[document.body.getAttribute('ca')][key])) return keyevent(event);
				}


				var inputs = ['input', 'select', 'button', 'textarea'];
				if (document.activeElement && inputs.indexOf(document.activeElement.tagName.toLowerCase()) !== -1) return;

				if (event.altKey || event.shiftKey || event.ctrlKey) return;

				if (event.keyCode == 32 || (event.keyCode > 40 && event.keyCode <= 127)) {
					//console.log(event, event.keyCode, event.key);
					OM.keyboardto = setTimeout(function () {
						if (document.body.getAttribute('ca') == 'lv') {
							if (Listview.items) {
								console.log('LV key', Listview.items);
								for (var i = 0, item; item = Listview.api.item[i]; i++) if (item.title.toLowerCase().indexOf(Aim.keyboardbuffer) != -1) {
									//OM.show({ id: item.detailID || item.id });
									OM.show({ id: item.id });
									break;
								}
							}
						}
						Aim.keyboardbuffer = '';
					}, 700);
					Aim.keyboardbuffer += String(event.key).toLowerCase();
					if (Aim.navtree.el.contains(Aim.clickElement)) {
						var c = Aim.navtree.getElementsByTagName('LI');
						for (var i = 0, e; e = c[i]; i++) if (String(e.item.title).toLowerCase().indexOf(Aim.keyboardbuffer) != -1) break;
						if (e) e.item.focus();
					}
					if (document.body.getAttribute('ca') == 'lvfilter') {
						var c = Listview.elFilter.getElementsByTagName('LABEL');
						for (var i = 0, e; e = c[i]; i++) if (e.innerText.toLowerCase().indexOf(Aim.keyboardbuffer) != -1) break;
						//console.log('KB', Aim.keyboardbuffer, e);
						if (e) {
							if (Listview.elFilterFocus) Listview.elFilterFocus.parentElement.removeAttribute('focus');
							Listview.elFilterFocus = e;
							Listview.elFilterFocus.parentElement.setAttribute('focus', '');
							Aim.Element.scrollIntoView(e);//.scrollIntoView({ block: "center", inline: "center" });
						}
					}
				}
				//var keyevent = OM.keys[document.body.getAttribute('ca')][key];
				//console.log(document.body.getAttribute('ca'), key, document.activeElement);
				//console.log(key);
				//if (OM.colActive == Aim.navtree) key += 'Tv';
				//else if (OM.colActive == Listview) key += 'Lv';
				//else if (OM.colActive == OM.pv) key += 'Pv';
				//console.log(key);
			}
		},
		scroll: function (event) {
			var st = window.pageYOffset || document.documentElement.scrollTop;
			var scrolldir = st > 50 && st > OM.lastScrollTop ? 'down' : 'up';
			if (OM.el) OM.el.setAttribute('scroll', scrolldir);
			OM.lastScrollTop = st;
			if (Aim.Element.iv) {
				if (window.toscroll) clearTimeout(window.toscroll);
				toscroll = setTimeout(function () {
					var e = Aim.Element.iv, ot = 0;
					while (e = e.parentElement) ot += e.offsetTop;
					//console.log(ot);
					for (var i = 0, elHFocus, elNext; elNext = hapi.item[i]; i++) {
						if (elNext.offsetTop > st - ot) break;
						elHFocus = elNext;
					}
					elHFocus = elHFocus || elNext;


					var c = Aim.Element.iv.getElementsByTagName('LI');
					//console.log(c);
					//var elFocus = null, elPrev = null;
					for (var i = 0, e; e = c[i]; i++) {
						//if (e.h.offsetTop - 25 >= st) elFocus = elFocus || elPrev || e;
						//elPrev = e;
						if (e.hasAttribute('open')) e.setAttribute('open', 0);
						e.removeAttribute('focus');
					}

					//console.log(elHFocus.innerText, elHFocus.elLi);
					Aim.Element.iv.style.paddingTop = Math.max(0, st - ot + 50) + 'px';
					if (elHFocus) {
						elPar = elFocus = elHFocus.elLi;
						//console.log('FOCUS', elHFocus.innerText, elHFocus.elLi, elPar.innerText);
						//var otf = elFocus.offsetTop;
						//elFocus = elFocus || elPrev || e;
						elFocus.setAttribute('focus', 1);
						while (elPar.h) {
							//console.log('FOCUS', elPar.innerText, elPar.offsetTop, elPar.tagName);
							//otf += elPar.offsetTop + 30;
							if (elPar.hasAttribute('open')) elPar.setAttribute('open', 1);
							elPar = elPar.parentElement.previousElementSibling;
						}
						//console.log('go');
						//while ((elFocus = elFocus.parentElement) && elFocus != Aim.Element.iv.firstChild) {
						//    console.log(elFocus.offsetTop);
						//    otf += elFocus.offsetTop;
						//}
						console.log('TOTAL', Aim.Element.iv.firstChild.getBoundingClientRect().top, elFocus.getBoundingClientRect().top);

						//console.log(elPar.innerText, elPar.offsetTop);
						//otf += elPar.offsetTop;


						//elFocus.scrollIntoView({ block: "nearest", inline: "nearest" });
						//var br = Aim.Element.iv.getBoundingClientRect();
						//var bre = elFocus.getBoundingClientRect();
						if (scrolldir == 'down') Aim.Element.iv.style.paddingTop = (st - ot - elFocus.getBoundingClientRect().top + Aim.Element.iv.firstChild.getBoundingClientRect().top + 50) + 'px';
						//else Aim.Element.iv.style.paddingTop = (st - ot + 50) + 'px';
						//console.log(st, bre.top, elHFocus.offsetTop);
					}
				}, 300);

			}


			OM.player.onscroll();
			//console.log(document.documentElement.clientHeight, Aim.Element.iv.clientHeight, Aim.Element.iv.firstChild.clientHeight, document.documentElement.clientHeight);
			//Aim.Element.iv.style.paddingTop = Math.min(Aim.Element.iv.clientHeight - Aim.Element.iv.firstChild.clientHeight - 300, Math.max(0, document.documentElement.scrollTop - 300)) + 'px';

		},
		resize: function (event) {
			if (document.body.clientWidth < 400 && document.body.clientWidth < document.body.clientHeight) document.body.setAttribute('device', device = 'phone');
			else if (document.body.clientHeight < 400 && document.body.clientWidth > document.body.clientHeight) document.body.setAttribute('device', device = 'phonewide');
			else if (document.body.clientWidth < 800 && document.body.clientWidth < document.body.clientHeight) document.body.setAttribute('device', device = 'tablet');
			else if (document.body.clientHeight < 800 && document.body.clientWidth > document.body.clientHeight) document.body.setAttribute('device', device = 'tabletwide');
			else document.body.setAttribute('device', device = 'pc');
		},
		click: function (event) {
			console.log('OM CLICK', event);

			//if (Aim.popup) {
			//	Aim.popup.close();
			//	Aim.sub.close();
			//}
			//Aim.clickElement = event.target;
			//Aim.clickPath = event.path;
			//for (var i = 0, el; el = Aim.clickPath[i]; i++) if (Aim.targetItem = el.item) break;
			//if (Aim.targetItem && Aim.targetItem.focus) Aim.targetItem.focus(event);
			return;


			var el = Aim.clickElement = event.target;
			while (el && !el.item) el = el.parentElement;
			if (!el) return;
			Aim.targetItem = el.item;
			console.log('itemClicked', Aim.clickElement, Aim.targetItem.id, Aim.targetItem.title, Aim.targetItem, event);

			if (msg.newItem) msg.write();

			//OM.play('/wav/Windows Notify Email.wav').then(function () { console.log('PLAYING'); }, function () { console.log('NOT PLAYING'); });





			OM.activeElement = event.path ? event.path.shift() : event.target;
			if (OM.activeElement.item && OM.activeElement.item.focus) OM.activeElement.item.focus(event);//app.selection.cancel();
			//Aim.Element.Pulldown.el.innerText = '';
		},
		dragenter: function (event) {
			//console.log('DRAG ENTER',this,event);
		},
		dragleave: function (event) {
			//console.log('DRAG LEAVE', this, event);
			//if (dragElement) dragElement.removeAttribute('dragtarget');
		},
		dragover: function (event) {
			event.stopPropagation();
			event.preventDefault();
			event.dataTransfer.dropEffect = 'none';
			//console.log(event);
			//if (dragElement && dragElement.tagName='')
			if (OM.dropDisplayElement) OM.dropDisplayElement.removeAttribute('dropElement');
			for (var i = 0; OM.dropDisplayElement = event.path[i]; i++) if (OM.dropDisplayElement.draggable) break;
			if (OM.dropDisplayElement) {
				var rect = OM.dropDisplayElement.getBoundingClientRect();
				//console.log('dropElement', event);
				OM.dropDisplayElement.setAttribute('dropElement', event.clientY < rect.top + 5 ? 'before' : event.clientY > rect.bottom - 5 ? 'after' : '');
			}

			targetdata = { e: event.target, action: 'move' };
			while (targetdata.e && !targetdata.item) {
				targetdata.ofile = targetdata.ofile || targetdata.e.ofile;
				targetdata.item = targetdata.item || targetdata.e.item;
				targetdata.filesParent = targetdata.e.filesWrite ? targetdata.e : targetdata.filesParent;//targetdata.filesParent || targetdata.e.filesParent;
				targetdata.e = targetdata.e.parentElement;
			}

			if (Aim.dragdata && Aim.dragdata.item == targetdata.item) return false;
			if (targetdata.item && (!Aim.dragdata || Aim.dragdata.item || Aim.dragdata.ofile)) {
				targetdata.action =
					event.shiftKey && event.ctrlKey && !event.altKey ? 'link' :
					!event.shiftKey && event.ctrlKey && !event.altKey ? 'copy' :
					event.shiftKey && !event.ctrlKey && event.altKey ? 'move into' :
					'move';
			}
			event.dataTransfer.dropEffect = targetdata.action.split(' ').shift();

			//for (var i = 0, dropElement; dropElement = event.path[i]; i++) if (dropElement.item || dropElement.ofile) break;


			//if (Aim.dragdata.ofile && targetdata.item || event.shiftKey) return event.dataTransfer.dropEffect = 'move';
			//console.log(event);
			//p = event.target;
			//while (p && !p.item) p = p.parentElement;
			//if (p) {
			//    if (Aim.dragdata.item && p.item.id == Aim.dragdata.item.id) return false;
			//    if (event.ctrlKey || !Aim.dragdata.item) event.dataTransfer.dropEffect = 'copy';
			//    else event.dataTransfer.dropEffect = 'move';
			//}
			//if (event.shiftKey) event.dataTransfer.dropEffect = 'move';


			//if (field.classID) {
			//    field.elInp.ondragover = function (event) {
			//        if (Aim.dragdata.item && Aim.dragdata.item.classID == this.field.classID) {
			//            event.stopPropagation();
			//            event.preventDefault();
			//            event.dataTransfer.dropEffect = 'link';
			//            return false;
			//        }
			//    };
			//    field.elInp.ondrop = function (event) {
			//        event.stopPropagation();
			//        event.preventDefault();
			//        this.value = Aim.dragdata.item.title;
			//        this.itemID = Aim.dragdata.item.itemID;
			//    };
			//}

			//this.itemlinkOndragover = function (event) {
			//    if (Aim.dragdata.item && this.classID == Aim.dragdata.item.classID) {
			//        event.stopPropagation();
			//        event.preventDefault();
			//        event.dataTransfer.dropEffect = 'link';
			//        return false;
			//    }
			//};
			//this.itemlinkOndrop = function (event) {
			//    event.stopPropagation();
			//    event.preventDefault();
			//    text = event.dataTransfer.getData("text");
			//    if (text[0] == '{') {
			//        data = JSON.parse(text);
			//        if (data.id && data.classID && data.classID == this.classID) {
			//            sourceItem = api.item[data.id];
			//            Listview.writeitem(this.getElementsByTagName('ul')[0].appendTag('li'), sourceItem);
			//        }
			//    }
			//    return false;
			//}

		},
		copy: doCopyCut = function (event) {
			//console.log(event.target);
			console.log(Aim.clickElement, Aim.navtree.contains(Aim.clickElement), event.targetItem, event.type, event, OM.elColActive, Aim.navtree);


			if (Aim.navtree.contains(Aim.clickElement)) {
				OM.clipitems.forEach(function (item) { item.elLi.removeAttribute('checked'); });
				OM.clipitems = [];
				OM.selitems.forEach(function (item) { OM.clipitems.push(item); item.elLi.setAttribute('checked', event.type); });

				var data = { value: [] };
				for (var i = 0, item; item = OM.clipitems[i]; i++) data.value.push({ id: item.id, hostID: item.hostID, srcID: item.srcID, classID: item.classID, masterID: item.masterID, idx: item.idx, eventType: event.type });
				event.clipboardData.setData('application/json', JSON.stringify(data));
				event.preventDefault();
			}
			//	//event.clipboardData.setData('text/plain', 'MAX PLAIN');
			//	//event.clipboardData.setData('text/html', '<b>MAX HTML</b>');
		},
		cut: doCopyCut,
		//function (event) {
		//	console.log('CUT', event, OM.elColActive, Aim.navtree.el);
		//	if (OM.elColActive == Aim.navtree.el) {
		//		OM.clipitems.forEach(function (e) { e.elLi.removeAttribute('checked'); });
		//		OM.clipitems = [];
		//		OM.selitems.forEach(function (e) { OM.clipitems.push(e); e.elLi.setAttribute('checked', event.type); });
		//		event.clipboardData.setData('application/json', JSON.stringify(OM.selection.cliplist));
		//	}
		//},
		dragstart: function (event) {
			console.log('dragstart', event);

			//event.dataTransfer.setData("text", JSON.stringify({ id: this.item.id, classID: this.item.classID, class: this.item.class, name: this.item.title }));
			Aim.dragdata = { event: event, target: event.target, e: event.target };
			while (Aim.dragdata.e && !Aim.dragdata.item) {
				Aim.dragdata.ofile = Aim.dragdata.ofile || Aim.dragdata.e.ofile;
				Aim.dragdata.item = Aim.dragdata.item || Aim.dragdata.e.item;
				Aim.dragdata.e = Aim.dragdata.e.parentElement;
			}
			//var data = { dragstart: { ofile: Aim.dragdata.ofile, id: Aim.dragdata.item ? Aim.dragdata.item.id : null} };
			//if (Aim.dragdata.ofile) data.ofile = Aim.dragdata.ofile;
			//console.log('dragstart',event.dataTransfer.items,Aim.dragdata);

			//var items= navtree.contains(event.target)? 
			event.dataTransfer.setData("application/json", JSON.stringify(Aim.dragTransferData = { value: [{ id: Aim.dragdata.item ? Aim.dragdata.item.id : null, ofile: Aim.dragdata.ofile, masterID: Aim.dragdata.item.masterID }] }));

			//if (Aim.dragdata.item) {
			//	//event.dataTransfer.items.add("GROET MAXJE", "text/plain");
			//	//event.dataTransfer.items.add("<p>GROET <b>MAX</b></p>", "text/html");
			//	//event.dataTransfer.items.add('{"naam":"max"}', "application/json");
			//	//event.dataTransfer.items.add('{"naam":"max"}', "File");
			//	//event.dataTransfer.items.add('https://aliconnect.nl', "text/uri-list");
			//}





			//console.log('DRAG START TARGET', event.target, Aim.dragdata, event.ctrlKey);
		},
		dragend: function (event) {
			//console.log('dragend', event);
			var outside = event.screenX > window.screenX + window.outerWidth || event.screenX < window.screenX || event.screenY > window.screenY + window.outerHeight || event.screenY < window.screenY;
			if (Aim.dragdata.target.url) {
				if (outside) {
					window.open(Aim.dragdata.target.url, '_blank', 'width=640,height=480,left=' + (event.screenX || 0) + ',top=' + (event.screenY || 0));
					//console.log(event, Aim.dragdata, event.ctrlKey);
					if (Aim.dragdata.target.container) Aim.dragdata.target.container.parentElement.removeChild(Aim.dragdata.target.container);
				}
				return;
			}

			for (var target = event.target; target && !target.item; target = target.parentElement);
			event.targetItem = target.item;
			//console.log('DRAG END', event, event.screenX, window.screenX, window.screenX + window.outerWidth, event.screenY, window.screenY, window.screenLeft, window.outerWidth, window.screenTop, window.outerHeight);
			//console.log(event.dataTransfer.dropEffect, event.target, p.item);

			if (!event.ctrlKey && !event.altKey) {
				console.log('DRAGEND', 'cut', target, target.item.id, Aim.dragTransferData);


				//OM.update(Aim.dragTransferData, null, 'cut')

				//for (var i = 0, typename; typename = event.dataTransfer.types[i]; i++) {
				//	console.log(typename);
				//	if (typename == "application/json" && OM.update(event.dataTransfer.getData(typename), event.targetItem, event.eventType)) return;
				//}
				//console.log(event, event.dataTransfer.getData("application/json"));
				//OM.update({ value: [{ id: target.item.id, eventType: 'cut' }] });
				//if (p.item) console.log('VERWIJDER SOURCE ELEMENTEN', p.item);
			}
			else if (event.ctrlKey) {
				console.log('COPY DOE NIETS');
			}
			else if (event.dataTransfer.dropEffect == 'none' && p && p.item && outside) {
				//OUTSIDE OPEN WINDOW
				//console.log(this, event, p, p.item);
				Aim.openwindow.call(p.item, event);
			}

			//if (event.screenX < window.screenLeft || event.screenX > window.screenLeft + window.outerWidth || event.screenY < window.screenY || event.screenY < window.screenY + window.outerHeight) console.log('OUTSIDE');
			if (OM.dropDisplayElement) OM.dropDisplayElement.removeAttribute('dropElement');
			Aim.dragdata = null;
		},
		drop: function (event) {
			event.eventType = 'cut';
			if (event.shiftKey && !event.ctrlKey && !event.altKey) event.eventType = 'cut';
			if (!event.shiftKey && event.ctrlKey && !event.altKey) event.eventType = 'copy';
			if (event.shiftKey && event.ctrlKey && !event.altKey) event.eventType = 'link';

			for (var target = event.target; target && !target.item; target = target.parentElement);
			event.targetItem = target.item;
			//for (var el = event.target; el; el = el.parentElement) if (event.targetItem = el.item) break;


			event.preventDefault();
			event.stopPropagation();

			console.log('DROP', event.type, event.eventType, el, event.targetItem);
			for (var i = 0, typename; typename = event.dataTransfer.types[i]; i++) {
				console.log('DROP', typename);

				if (typename == "application/json" && OM.update(event.dataTransfer.getData(typename), event.targetItem, event.eventType)) return;
				//{
				//	var data = JSON.parse(event.dataTransfer.getData(typename));
				//	if (!data.value) return;
				//	data.post = 1;
				//	data.value.forEach(function (row) {
				//		Object.assign(row, { eventType: event.eventType });
				//		data.value.push({ id: row.id, masterID: event.targetItem ? event.targetItem.id : null, eventType: 'paste' });
				//	});
				//	console.log('drop application/json data', data);
				//	OM.update(data, true);
				//}
				//event.targetItem is master, zend data

				//if ()
			}
			return;

			if (targetdata.action == 'move into') return Aim.api.mergeinto(targetdata.item.id, Aim.dragdata.item.id);
			if (Aim.dragdata) {
				if (Aim.dragdata.ofile && targetdata.item) {
					targetdata.item.files.afiles.push(Aim.dragdata.ofile);
					targetdata.item.submit();
					if (targetdata.action == 'move') {
						Aim.dragdata.item.files.afiles.splice(Aim.dragdata.item.files.afiles.indexOf(Aim.dragdata.ofile), 1);
						Aim.dragdata.item.submit();
					}
					api.item[get.id].load();
					return;
				}
				if (Aim.dragdata.item) {
					if (navtree.contains(event.target)) {
						if (targetdata.action == 'link') return targetdata.item.appendChild(null, { detailID: Aim.dragdata.item.id }, null, true);
						else if (targetdata.action == 'move') return Aim.dragdata.item.movetoidx(targetdata.item);
						if (targetdata.item && targetdata.item.linkclasses) {
							for (var linkclassid in targetdata.item.linkclasses) {
								if (linkclassid == Aim.dragdata.item.classID) {
									var newclassid = targetdata.item.linkclasses[linkclassid];
									Aim.load({ post: { exec: 'itemAdd', masterID: targetdata.item.detailID || targetdata.item.id, classID: newclassid, srcID: Aim.dragdata.item.id }, onload: this.onload || function () { targetdata.item.loadItems(true); } });
									return;
								}
							}
						}
						if (targetdata.action == 'copy') targetdata.item.appendChild(null, {}, Aim.dragdata.item);
						return;
					}
					for (var attributeName in targetdata.item.attributes) {
						var field = targetdata.item.attributes[attributeName];
						if (Aim.dragdata.item.classID == field.link2classID) {
							link2fieldname = targetdata.item.attributes[attributeName].link2fieldname;
							console.log('LINK 2', attributeName);
							return;
							Aim.load({
								post: {
									exec: 'itemAdd', classID: targetdata.item.attributes[attributeName].linkclassID
								},
								onload: function () {
									var itemID = this.data.set[0][0].id;
									OM.show({
										id: itemID
									});
									api.item[itemID].onloadEdit = true;
									api.item[itemID].setdefault = this.setdefault;
								},
								setdefault: function () {
									for (var attributeName in this.properties) {
										var field = this.properties[attributeName];
										console.log(attributeName, field, Aim.dragdata.item, targetdata.item);
										if (targetdata.item && field.classID == targetdata.item.classID) {
											console.log('TARGET', attributeName, field, Aim.dragdata.item, targetdata.item);
											field.elInp.value = targetdata.item.title;
											field.elInp.setAttribute('itemID', targetdata.item.itemID);
											targetdata.item = null;
										}
										else if (Aim.dragdata.item && field.classID == Aim.dragdata.item.classID) {
											console.log('DRAG', attributeName, field, Aim.dragdata.item, targetdata.item);
											field.elInp.value = Aim.dragdata.item.title;
											field.elInp.setAttribute('itemID', Aim.dragdata.item.itemID);
											Aim.dragdata.item = null;
										}
									}
									this.setdefault = null;
								}
							});
							return;
						}
					}
					if (targetdata.action == 'link') Aim.load({ api: 'link', put: { id: Aim.dragdata.item.id, fromID: targetdata.item.id }, onload: function () { console.log('LINKADD DONE', this.src); } });
					return;
				}
			}
			if (event.target.tagName != 'DIV' || !event.target.getAttribute('contenteditable') || event.dataTransfer.files) {
				for (var i = 0, typename; typename = event.dataTransfer.types[i]; i++) {
					var html = event.dataTransfer.getData(typename);
					if (typename == "Files") {
						App.files.filesUploadAll.call(targetdata.filesParent || targetdata.item, event.dataTransfer.files);
						return;
					}
					else if (["text/uri-list", "Url"].indexOf(typename) !== -1) {
						var url = event.dataTransfer.getData(typename);
						console.log(url);
						var par = Aim.URL.parse(url);
						if (par && par.imgurl) {
							var src = decodeURIComponent(par.imgurl).split('?')[0];
							targetdata.item.filesAppendFile({ ext: src.split('.').pop(), src: src, name: decodeURI(src.split('/').pop()) });
							return;
						}
						var img = new Image();
						img.item = targetdata.item;
						img.onerror = function () {
							var src = this.src.split('?')[0];
							console.log('DROP ERROR', this);
							this.item.filesAppendFile({ ext: src.split('.').pop(), src: this.src, name: decodeURI(src.split('/').pop()) });
						};
						img.onload = function () {
							var src = this.src.split('?')[0];
							this.item.filesAppendFile({ type: 'image', ext: src.split('.').pop(), src: this.src, name: decodeURI(src.split('/').pop()) });
							if (!this.item.editing) this.item.submit();
						};
						img.src = url;
						return;
					}
					else if (typename == "text/html") {
						var html = event.dataTransfer.getData(typename);
						var el = document.body.appendTag('div', { innerHTML: html });
						var elTemp = elAttach.appendTag('div', { innerHTML: html });
						var c = elTemp.getElementsByTagName('img');
						if (c[0] && c[0].src) {
							var src = c[0].src;
							if (src.substr(0, 4) == 'data') {
								var a = src.split(':');
								var a = a[1].split(',');
								var a = a[0].split(';');
								var b = a[0].split('/');
								OM.files.postdata(c[0].src, elAttach, { ext: b[1], name: c[0].name + '.' + b[1], alt: c[0].alt, type: a[0] });
							}
							else elAttach.appendFile({ ext: c[0].src.split('.').pop(), src: c[0].src, name: decodeURI(c[0].src.split('/').pop()) });
						}
						var c = elTemp.getElementsByTagName('video');
						if (c[0] && c[0].src) {
							var par = {};
							for (var attrname in c[0]) par[attrname] = c[0][attrname];
							par.ext = c[0].src.split('.').pop();
							par.name = decodeURI(c[0].src.split('/').pop());
							elAttach.appendFile(par);
						}
						var c = elTemp.getElementsByTagName('a');
						if (c[0] && c[0].href) elAttach.appendFile({ ext: c[0].href.split('.').pop(), src: c[0].href, name: decodeURI(c[0].href.split('/').pop()) });
						elAttach.removeChild(elTemp);
						return;
					}
				}
			}
		},
		paste: function (event) {
			//Doe niets als er een edit element actief is
			if (document.activeElement && ['input', 'select', 'button', 'textarea'].indexOf(document.activeElement.tagName.toLowerCase()) !== -1) return;
			event.stopPropagation();
			//event.targetItem = Aim.itemClicked;
			//console.log(event);
			//Kijk of er een interne actie is gedaan, copy of cut. Dan uitvoeren
			//var obj = JSON.parse(event.clipboardData.getData('application/json') | '{}');


			//console.log('PASTE', event.clipboardData.getData("application/json"));
			//if (Aim.keydownEvent.shiftKey) console.log('PASTE + SHIFT');

			//if (Aim.keyControl == 'KeyK') console.log('link')
			if (OM.update(event.clipboardData.getData("application/json"), Aim.targetItem, Aim.keyControl == 'KeyK' ? 'link' : null)) return;

			//var s = event.clipboardData.getData("application/json",);
			//if (s) {
			//	var data = JSON.parse(s);
			//	if (!event.targetItem || !data.value) return;
			//	data.value.forEach(function (row) { data.value.push(Object.assign({}, row, { eventType: row.eventType == 'cut' ? 'move' : 'copy', masterID: event.targetItem ? event.targetItem.id : null })); });
			//	OM.updatePost(Object.assign(data, { post: 1 }), true);
			//	return;
			//}

			var html = event.clipboardData.getData("text/html");
			if (html) {
				console.log('HTML', html);
				var tmpStr = html.match("<!--StartFragment-->(.*)<!--EndFragment-->");
				var fragment = tmpStr[1];
				console.log('FRAGMENT', fragment);
				if (fragment.substr(0, 3) == '<a>') { console.log('REF', fragment); }
				else if (fragment.substr(0, 5) == '<img ') { console.log('IMG', fragment); }
				//return;
			}

			//console.log("application/json", event.clipboardData.getData("application/json"));
			//console.log("text/html", event.clipboardData.getData("text/html"));
			//console.log("text", event.clipboardData.getData("text"));
			//console.log("text/plain", event.clipboardData.getData("text/plain"));


			var text = event.clipboardData.getData("text");
			if (text) {
				console.log('TEXT', text);
				if (text.substr(0, 4) == 'http') console.log('URL', text);
			}

			//return;

			//AFhandelen clipboard data
			var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
			var clipboarditems = clipboardData.items;
			console.log('clipboarditems', clipboarditems);
			for (var i = 0, clipboarditem; clipboarditem = clipboarditems[i]; i++) {
				console.log('clipboarditem', clipboarditem);
				if (clipboarditem.kind === 'string' && clipboarditem.type == 'application/json') {
					console.log('application/json');
					clipboarditem.getAsString(function (s) {
						console.log('getAsString application/json', s);
						var data = JSON.parse(s);
						if (!data.value) return;
						data.post = 1;
						data.value.forEach(function (row) { data.value.push({ id: row.id, eventType: 'paste', masterID: Aim.targetItem ? Aim.targetItem.id : null }); });
						console.log('getAsString application/json data', data);
						OM.update(data, true);


						return;







						if (data.value && OM.clipitems.length) {
							if (OM.colActive == Listview) var masterID = get.lid;
							else if (OM.colActive == OM.pv) var masterID = get.id;
							else if (OM.elColActive == Aim.navtree.el) var masterID = get.lid;
							else return console.log('GEEN COL ITEM ACTIEF', OM.elColActive);
							console.log('PASTE clipitems', OM.clipitems);
							//console.log('targetdata', targetdata);
							var moveactie = function () {
								console.log('moveaction', OM.clipitems);
								delete this.onloaditems;
								OM.clipitems.forEach(function (e) {
									if (e.elLi.hasAttribute('checked')) {
										console.log('paste clipitem', e.elLi.getAttribute('checked'));
										//return;

										if (e.elLi.getAttribute('checked') == 'CUT') e.movetoidx(Aim.navtree.itemFocus);
										if (e.elLi.getAttribute('checked') == 'COPY') Aim.navtree.itemFocus.appendChild(null, null, e, true);

										//e.copytoidx(Aim.navtree.itemFocus);
									}
								});
								//app.selection.cancel();
							};
							Aim.navtree.itemFocus.open();
							if (!Aim.navtree.itemFocus.children.length) Aim.navtree.itemFocus.onloaditems = moveactie;
							else moveactie();
						}
					});
					return;
				}


				if (clipboarditem.kind === 'file') {
					event.preventDefault();
					//if (fragment && fragment.substr(0, 5) == '<img ' && !confirm('Kopieer afbeelding')) {
					//	console.log('paste link');
					//} else {
					var blob = clipboarditem.getAsFile(), reader = new FileReader(), p = OM.activeElement;
					while (p && !p.item) p = p.parentElement;
					if (!p) return;
					//var target = p.item;
					console.log('paste.activeelement', p);
					reader.item = p.item;
					//reader.el = { item: target };
					reader.onload = function (event) {
						//App.files.fileUpload(event.target.result, this.item, { name: 'paste.png', type: 'image/png', ext: 'png' });
						App.files.fileUpload(this.item, { name: 'paste.png', type: 'image/png' }, event.target.result);
						//App.files.fileUpload(this.item, { name: 'paste.png' }, event.target.result);

						//console.log('IMG PASTE', this.item);

					};
					reader.readAsDataURL(blob);
					//}
					return;
				}
				//switch (clipboarditem.kind) {
				//	//case 'string':
				//	//	console.log(clipboarditem.type);
				//	//	if (clipboarditem.type.match('^text/plain')) {
				//	//		var text = event.clipboardData.getData("text");
				//	//		if (text.substr(0, 4) == 'http') console.log('URL', text);

				//	//		console.log('text', event.clipboardData.getData("text"));

				//	//		clipboarditem.getAsString(function (s) {
				//	//			if (s.substr(0, 4) == 'http') console.log('URL', s);
				//	//			console.log('getAsString text/plain', s);
				//	//		});
				//	//	}
				//	//	if (clipboarditem.type.match('^text/rtf')) {
				//	//		console.log('text/rtf', event.clipboardData.getData("text/rtf"));
				//	//		clipboarditem.getAsString(function (s) {
				//	//			if (s.substr(0, 4) == 'http') console.log('URL', s);
				//	//			console.log('getAsString text/rtf', s);
				//	//		});
				//	//	}
				//	//	if (clipboarditem.type.match('^text/html')) {
				//	//		var html=event.clipboardData.getData("text/html");
				//	//		//console.log('text/html', event.clipboardData.getData("text/html"));
				//	//		var tmpStr  = html.match("<!--StartFragment-->(.*)<!--EndFragment-->");
				//	//		var fragment = tmpStr[1];
				//	//		console.log('FRAGMENT',fragment);
				//	//		//var elFrame = document.body.appendTag('iframe', { style: 'display:none' });
				//	//		//elFrame.contentWindow.document.open();
				//	//		//elFrame.contentWindow.document.write(html);
				//	//		//elFrame.contentWindow.document.close();
				//	//		//for (varelDoc = elFrame.contentWindow.document;

				//	//	}
				//	//	if (clipboarditem.type.match('^text/uri-list')) {
				//	//		console.log('text/uri-list', event.clipboardData.getData("text/uri-list"));
				//	//	}
				//	//	if (['INPUT', 'TEXTAREA', 'DIV'].indexOf(event.target.tagName) != -1) return;
				//	//	break;
				//	case 'file':
				//		event.preventDefault();
				//		var blob = clipboarditem.getAsFile(), reader = new FileReader(), p = OM.activeElement;
				//		while (p && !p.item) p = p.parentElement;
				//		if (!p) return;
				//		//var target = p.item;
				//		console.log('paste.activeelement', p);
				//		reader.item = p.item;
				//		//reader.el = { item: target };
				//		reader.onload = function (event) {
				//			//App.files.fileUpload(event.target.result, this.item, { name: 'paste.png', type: 'image/png', ext: 'png' });
				//			App.files.fileUpload(this.item, { name: 'paste.png', type: 'image/png' }, event.target.result);
				//			//App.files.fileUpload(this.item, { name: 'paste.png' }, event.target.result);

				//			//console.log('IMG PASTE', this.item);

				//		};
				//		reader.readAsDataURL(blob);
				//		return;
				//	default:
				//}
				//console.log('item', clipboarditem.kind, clipboarditem.type, data);

				//if (event.target.tagName == 'INPUT' && clipboarditem.kind === 'string') return;
				//else if (event.target.tagName == 'TEXTAREA' && clipboarditem.kind === 'string') return;
				//else if (event.target.tagName == 'DIV' && clipboarditem.kind === 'string') return;
				//else if (clipboarditem.kind === 'file') {
				//	event.preventDefault();
				//	var blob = clipboarditem.getAsFile();
				//	var reader = new FileReader();

				//	var p = OM.activeElement;
				//	while (p && !p.item) p = p.parentElement;
				//	if (!p) return;
				//	var target = p.item;

				//	console.log('paste.activeelement', p);

				//	reader.item = target;
				//	//reader.el = { item: target };
				//	reader.onload = function (event) {
				//		//App.files.fileUpload(event.target.result, this.item, { name: 'paste.png', type: 'image/png', ext: 'png' });
				//		App.files.fileUpload(this.item, { name: 'paste.png', type: 'image/png' }, event.target.result);
				//		//App.files.fileUpload(this.item, { name: 'paste.png' }, event.target.result);

				//		//console.log('IMG PASTE', this.item);

				//	};
				//	reader.readAsDataURL(blob);
				//}
			}

			return;


			var html = event.clipboardData.getData("text/html");
			var text = event.clipboardData.getData("Text");





			console.log('PASTE', clipitems);

			if (targetdata.item && text.substr(0, 4) == 'http') {
				event.preventDefault();
				var filename = text.split('/').pop();
				var ext = filename.split('.').pop().toLowerCase();
				filename = filename.split('_');
				if (filename[0].length == 32) filename.shift();
				filename = filename.join('_');

				var ofile = { name: filename, src: text, type: ['jpg', 'png', 'bmp', 'jpeg', 'gif'].indexOf(ext) !== -1 ? 'image' : ['pdf', 'doc', 'docx', 'xls', 'xlsx'].indexOf(ext) !== -1 ? 'file' : null };
				if (!ofile.type) return;
				targetdata.item.filesAppendFile(ofile);
				if (!targetdata.item.editing) {
					targetdata.item.files.afiles.push(ofile);
					targetdata.item.submit();
				}
				return;
			}






			//Uitvoeren clipitems van treelist
			if (OM.clipitems.length) {
				if (OM.colActive == Listview) var masterID = get.lid;
				else if (OM.colActive == OM.pv) var masterID = get.id;
				else if (OM.elColActive == Aim.navtree.el) var masterID = get.lid;
				console.log('PASTE clipitems', OM.clipitems);
				//console.log('targetdata', targetdata);
				var moveactie = function () {
					console.log('moveaction', OM.clipitems);
					delete this.onloaditems;
					OM.clipitems.forEach(function (e) {
						if (e.elLi.hasAttribute('checked')) {
							console.log('paste clipitem', e.elLi.getAttribute('checked'));
							//return;

							if (e.elLi.getAttribute('checked') == 'CUT') e.movetoidx(Aim.navtree.itemFocus);
							if (e.elLi.getAttribute('checked') == 'COPY') Aim.navtree.itemFocus.appendChild(null, null, e, true);

							//e.copytoidx(Aim.navtree.itemFocus);
						}
					});
					//app.selection.cancel();
				};
				Aim.navtree.itemFocus.open();
				if (!Aim.navtree.itemFocus.children.length) Aim.navtree.itemFocus.onloaditems = moveactie;
				else moveactie();
				return;
			}

			targetdata = { e: event.target };
			while (targetdata.e && !targetdata.item) {
				targetdata.ofile = targetdata.ofile || targetdata.e.ofile;
				targetdata.item = targetdata.item || targetdata.e.item;
				targetdata.e = targetdata.e.parentElement;
			}

			console.log('PASTE', targetdata);
			//return;

			if (!Aim.navtree.elFocus) Aim.navtree.elFocus = targetdata.e;
			var elForm = Aim.navtree.elFocus;
			while (elForm && elForm.tagName != 'FORM') elForm = elForm.parentElement;
			if (elForm) var elAttach = elForm.getElementsByClassName('files')[0];







			//Kijk of paste data is HTML, Zo ja, uitvoeren ALLEEN VOR LINKED IN, VERVALT
			return;
			if (html) {
				//console.log(html);
				//return;
				var elFrame = document.body.appendTag('iframe', { style: 'width:100%;height:900px;' });
				elFrame.contentWindow.document.open();
				elFrame.contentWindow.document.write(html);
				elFrame.contentWindow.document.close();
				elDoc = elFrame.contentWindow.document;
				var c = elDoc.getElementById('profile-wrapper');// el.getElementsByClassName('pv-top-card-section__information');
				if (c) {
					getbyclass = function (cname, root) {
						root = root || elDoc;
						if (!root.getElementsByClassName) return {};
						var c = root.getElementsByClassName(cname);
						return c[0] ? c[0] : {};
					};
					getlinkclass = function (cname) {
						var c = elDoc.getElementsByClassName(cname);
						if (c[0]) {
							var c = c[0].getElementsByTagName('A');
							return c[0] ? {
								innerText: c[0].innerText, href: c[0].href
							} : {};
						}
					};
					if (linkedID = getlinkclass('ci-vanity-url')) {
						elDoc.innerHTML = c.innerHTML;
						p = {
							linkedID: linkedID.href.split('/').pop(),
							DisplayName: getbyclass('pv-top-card-section__name').innerText,
							CompanyName: getbyclass('pv-top-card-section__company').innerText,
							JobTitle: getbyclass('pv-top-card-section__headline').innerText,
							school: getbyclass('pv-top-card-section__school').innerText,
							location: getbyclass('pv-top-card-section__location').innerText,
							linkedin: getlinkclass('ci-vanity-url'),
							mail: getlinkclass('ci-email'),
							//phone: getlinkclass('ci-phone'),
							twitter: getlinkclass('ci-twitter'),
							//birthday: getlinkclass('ci-birthday'),
							link: [],
						};
						//var e = getbyclass('ci-phone');

						if (p.DisplayName) {
							var DisplayName = p.DisplayName.split(' ');
							p.Surname = DisplayName.pop();
							if (DisplayName) p.GivenName = DisplayName.shift();
							if (DisplayName) p.MiddleName = DisplayName.join(' ');
						}

						var e = getbyclass('ci-phone'); if (e) p.phone = getbyclass('Sans-15px-black-85%', e).innerText;
						p.birthday = getbyclass('pv-contact-info__contact-item', getbyclass('ci-birthday')).innerText;

						var photo = getbyclass('pv-top-card-section__photo');
						if (photo && photo.style) p.photo = (photo.style.backgroundImage.split('"'))[1];

						//if (p.linkedin.href) p.linkedID = p.linkedin.href.split('/').pop();
						if (p.mail && p.mail.href) p.email = p.mail.href.split(':').pop();

						var c = elDoc.getElementsByClassName('pv-contact-info__contact-link');
						for (var i = 0, e; e = c[i]; i++) p.link.push({
							innerText: e.innerText, href: e.href
						});
						console.log(p);
						Aim.load({
							post: {
								li: JSON.stringify(p)
							}, onload: function () {
								console.log(this.data);
								OM.show(this.data);
							}
						});
						console.log('LI PAGE', p);
					};
					if (!linkedID) alert('U dient "meer weergeven" te openen in linkedin en dan de pagina te kopieren.');
				}
				document.body.removeChild(elFrame);
				//return;
			}

			//console.log('CLIPBOARD S HTML', s)
			//console.log('1');

			//var s = event.clipboardData.getData("Text");
			//console.log('CLIPBOARD S',s)
			//console.log('2');

			//if (s[0] == '[') {
			//    var s = JSON.parse(s);
			//    for (var i = 0, e; e = s[i]; i++) {
			//        if (e.ofile && elAttach) elAttach.appendFile(e.ofile);
			//        if (e.id) console.log(e);
			//    }
			//    event.preventDefault();
			//    return;
			//}


			//controleer paste data type TEXT
			//console.log('4');
			//return;


		},
	},
	createElementList: function () {
		console.log('LIST', this.src, this.data);
		this.data.value.schema = this.data.schema;
		Listview.items = this.data.value;
		Listview.show();
	},
	createElementPage: function () {
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
		if (!this.data) return;
		//if (!this.data.value) return;
		if (!this.get) return;

		this.get.schema = this.get.schema || 'item';
		//console.log(this.get);
		if (!api[this.get.schema]) return;
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
	openwindows: {
	},
	openwindow: function (event) {
		this.url = apiorigin + "/" + Aim.client.domain.name + "/" + Aim.version + "/app/form/?select*&schema=" + this.schema + "&id=" + (this.detailID || this.id) + (this.uid ? "&uid=" + this.uid : "");
		if (Aim.openwindows[this.url]) {
			Aim.openwindows[this.url].focus();

		}
		else {
			Aim.openwindows[this.url] = window.open(this.url, this.url, 'width=600,height=800,left=' + (event.screenX || 0) + ',top=' + (event.screenY || 0));
			Aim.openwindows[this.url].name = this.url;
			Aim.openwindows[this.url].onbeforeunload = function () { Aim.openwindows[this.name] = null };
		}
	},
});


//Aim.beforeLoad();
//Aim.wss.addEventListener('connect', function () {
//	console.log('CONNECT', this, event);
//});
//console.log('TEST', JSON.stringify({ id: 123, value: "afsdfasd' fa \"sd" }).replace(/'/g, "''").replace(/{"/g, "@").replace(/"}/g, "'").replace(/":/g, "=").replace(/,"/g, ",@").replace(/="/g, "='").replace(/\\"/g, '"'));
//var s = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJzaGEyNTYifQ.eyJzY2hlbWEiOiJXZWJzaXRlIiwiaWQiOiIyNzUzMjgxIn0.174_8NQV1zH1R-ZiVfZhqaFfnRXTDCMgxrsGmNEgqHk';
//var s = 'eyJzY2hlbWEiOiJXZWJzaXRlIiwiaWQiOiIyNzUzMjgxIiwidWlkIjoiMzczQjU3N0QtMTg1Mi00OTNBLUE5MkQtQTU4RjdCMzM5REYwIn0=';
//console.log(s);
//var s = 'AAMkADk1ZDg0NjhmLTNmNDctNDhiMC05ZmY2LTFlYWZhZWU0YTMxMgBGAAAAAABCoLA8cwnTTqlEyFLfqavXBwCfT5bS86RjQLBEo4jdDYD3AAAAAAEPAACfT5bS86RjQLBEo4jdDYD3AAVH1bGAAAA=';
//var s = 'eyJhdWQiOiJodHRwczpcL1wvYWxpY29ubmVjdC5ubCIsImV4cCI6MTU2ODgwODczMSwiYWlkIjoiMzU2NTM5NiIsImNpZCI6IjM1NjUzOTUiLCJhcHBfZGlzcGxheW5hbWUiOiJUZXN0IGFwcGxpY2F0aW9uIiwiYXBwaWQiOiI2NTFGMzhDOC05MjY0LTQ0RTctOTkxQi0zRDc4QTgyQzJBNzAiLCJuYW1lIjp7Imdyb3VwIjp7fSwiYWNjb3VudCI6e30sImhvc3QiOnt9LCJ1c2VyIjp7fSwiaXAiOiI6OjEifSwidW5pcXVlX25hbWUiOiJtYXgudmFuLmthbXBlbkBhbGljb24ubmwifQ==';
//console.log(atob(s));
//cb9d20b7f0139e8d30b95dd0418db53e
//Users('f40f8462-da7f-457c-bd8c-d9e5639d2975@09786696-f227-4199-91a0-45783f6c660b');
//console.log(s);
//console.log(atob(s));
//console.log(atob('EQAAABYAAACfT5bS86RjQLBEo4jdDYD3AAVNEqYG'));
//console.log(atob('AAMkADk1ZDg0NjhmLTNmNDctNDhiMC05ZmY2LTFlYWZhZWU0YTMxMgAuAAAAAABCoLA8cwnTTqlEyFLfqavXAQCfT5bS86RjQLBEo4jdDYD3AAAAAAEPAAA=').substr(4, 36));
//console.log(atob('AAMkADk1ZDg0NjhmLTNmNDctNDhiMC05ZmY2LTFlYWZhZWU0YTMxMgBGAAAAAABCoLA8cwnTTqlEyFLfqavXBwCfT5bS86RjQLBEo4jdDYD3AAAAAAEPAACfT5bS86RjQLBEo4jdDYD3AAVH1bGAAAA=').substr(4, 36));
//console.log(JSON.parse(atob(s)));
//console.log(btoa(JSON.stringify({ schema: 'Product', id: 123121 })));
//console.log(btoa(JSON.stringify({ schema: 'Website', id: 2753281 })));
//console.log(([btoa(JSON.stringify({ typ: 'JWT', alg: "sha256" }))] + '.' + [btoa(JSON.stringify({ schema: 'Website', id: 2753281 }))]).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, ''));

