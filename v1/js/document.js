console.log('DOC');
document.head.appendTag('link', { rel: 'stylesheet', href: libroot +'/css/document.css' });

Aim.add({
	Document: {
		createIndexListItem: function (el, Title, name) {
			//console.log('AAAAAAAAAAAAAAAAAAAAAAAAA',el.level);
			if (el.previousElementSibling) el.previousElementSibling.setAttribute('open', 0);
			with (el.appendTag('li')) {
				var elH = appendTag('h' + el.level, { onclick: Aim.Element.onclick }).appendTag('a', { innerText: Title, href: '#' + (name || Title) });
				elH.list = appendTag('ul', { level: el.level + 1 });
				//el.list.level = Number(el.level) + 1;
				with (Aim.Document.elBody) {
					appendTag('a', { name: name || Title });
					elH.header = appendTag('h' + el.level, { innerText: Title });
				}
			}
			//console.log(elH);
			return elH;
		},
		show: function () {
			console.log('DOC SHOW N', this);
			with (this.elDoc = document.body.appendTag('div', { className: 'row doc-body' })) {
				with (this.elInfo = appendTag('div', { className: 'col panel doc-content oa docinfo np' })) {
					with (appendTag('div', { className: 'row' })) {
						appendTag('button', { innerText: 'MS-Word', onclick: this.createWord.bind(this) });
						appendTag('button', { innerText: 'Annuleren', onclick: function () { this.elDoc.parentElement.removeChild(this.elDoc); }.bind(this) });
					}
				}
				this.elBody = appendTag('div', { className: 'col aco oa' }).appendTag('div', { className: 'doc-content' });
				this.elIndex = appendTag('div', { className: 'col panel doc-content oa docindex np' });
				//Aim.createButtonbar(appendTag('div'), {
				//	msword: { className: 'r', onclick: this.createWord.bind(this) },
				//	//popout: {target: 'doc', href: '../doc/' + api.items[Document.id].ID },
				//	close: { onclick: function () { this.elDoc.parentElement.removeChild(this.elDoc); }.bind(this) },
				//});
			}
			//var types = {}, swObjecten = [];

			if (this.onload) this.onload();

			if (this.par) Aim.load(this.par);// || { get: { schema: this.item.schema, id: this.item.id, child: 8, src: 10, link: 10, refby: 10, select: '*', selectall: 1 }, onload: Aim.Document.sbs.bind(this) });
		},
		createWord: function (html) {
			console.log(html);
			var xhr = new XMLHttpRequest();
			//xhr.open('GET', this.menuitem.template, true);//'/moba/utildoc/sjabloon.mht', true);
			xhr.open('GET', '/sites/' + Aim.host + '/app/mht/template.mht', true);
			xhr.responseType = 'blob';
			//xhr.menuitem = this.menuitem;
			xhr.onload = function () {
				var blob = new Blob([this.response], { type: 'text/html' });
				var reader = new FileReader();
				//reader.menuitem = this.menuitem;
				reader.onload = function () {
					var item = items[get.id], aFilename = [], s = reader.result, today = aDate().toLocaleDateString();
					s = s.split(',')[1];
					var content = atob(s);
					content = content.replace(/=\r\n/g, '').replace(/=3D/g, '=');
					//aFilename.push(this.menuitem.title);
					for (var fieldname in item.fields) {
						var re = new RegExp('#' + fieldname + '#', "g");
						content = content.replace(re, item.fields[fieldname].value || '');
						if (item.fields[fieldname].kop === 0 && item.fields[fieldname].value) aFilename.push(item.fields[fieldname].value);
					}
					if (item.elFilesView) {
						content = content.replace('#files#', item.elFilesView.innerHTML);
					}
					var c = Document.elBody.getElementsByTagName('p');
					for (var i = 0, e; e = c[i]; i++) e.className = 'MsoNormal';
					var c = Document.elBody.getElementsByTagName('div');
					for (var i = 0, e; e = c[i]; i++) e.className = 'MsoNormal';
					var c = Document.elBody.getElementsByTagName('table');
					for (var i = 0, e; e = c[i]; i++) e.className = 'MsoNormalTable';
					var sIn = html || '';
					sIn = sIn.replace(/[\u00A0-\u2666]/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; });
					content = content.replace('##', sIn);
					//content = content.replace(/#title#/g, this.menuitem.innerText);
					content = content.replace(/#today#/g, today);
					content = content.replace(/#author#/g, Aim.accountName);
					content = content.replace(/=/g, '=3D');
					aFilename.push(Aim.accountName);
					aFilename.push(today);
					var s = btoa(content);
					function b64toBlob(b64Data, contentType, sliceSize) {
						contentType = contentType || '';
						sliceSize = sliceSize || 512;
						var byteCharacters = atob(b64Data);
						var byteArrays = [];
						for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
							var slice = byteCharacters.slice(offset, offset + sliceSize);
							var byteNumbers = new Array(slice.length);
							for (var i = 0; i < slice.length; i++) {
								byteNumbers[i] = slice.charCodeAt(i);
							}
							var byteArray = new Uint8Array(byteNumbers);
							byteArrays.push(byteArray);
						}
						var blob = new Blob(byteArrays, { type: contentType });
						return blob;
					}
					var blob = b64toBlob(s, 'text/html');
					url = window.URL.createObjectURL(blob);
					var link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', aFilename.join(' ') + '.mht');
					link.click();
					window.URL.revokeObjectURL(url);
				}
				reader.readAsDataURL(blob);
			}
			xhr.send();
		},
		//createContent: function (el) {
		//	console.log('Create',el);
		//	with (Document.elContent = (el || ('items' in window && Aim.Element.lv ? Aim.Element.lv : document.body)).appendTag('div', { className: 'row abs aco doc-body' })) {
		//		with (Document.elIndex = appendTag('div', { className: 'col index' })) { }
		//		Document.elBody = appendTag('div', { className: 'col aco doc-content' });
		//		//with (appendTag('div', { className: 'row top abs' })) {
		//		//	appendTag('a', { className: 'abtn icn msword', onclick: function () { Document.createWord(Document.elBody.innerHTML); } });
		//		//	//appendTag('a', { className: "abtn icn popout", target: 'doc', href: '../doc/' + api.items[Document.id].ID });
		//		//	appendTag('a', { className: 'abtn r close', onclick: function () { (this.p = this.parentElement.parentElement).parentElement.removeChild(this.p); } });
		//		//}
		//	}
		//	return Document.elBody;
		//},
		createIndex: function () {
			var html = this.elBody.innerHTML;
			//with (this.elContent.appendTag('div', { className: "row aco", attr: { style: 'height:250px' } })) {
			this.elIndex = this.el.appendTag('div', { className: "col atv noselect np", }).appendTag('ul', { className: "liopen", }).appendTag('li').appendTag('ul');

			OM.printdiv = Document.elBody = appendTag('div', {
				className: "col aco oa doc", innerHTML: html, onscroll: function () {
					var c = Document.elIndex.getElementsByTagName('LI');
					var elFocus = null, elPrev = null;
					for (var i = 0, e; e = c[i]; i++) {
						if (e.h.offsetTop - 25 >= Document.elBody.scrollTop) elFocus = elFocus || elPrev || e;
						elPrev = e;
						if (e.getAttribute('open') != undefined) e.setAttribute('open', 0);
						e.removeAttribute('focus');
					}
					elFocus = elFocus || elPrev || e;
					if (!elFocus) return;
					elFocus.setAttribute('focus', 1);
					while (elFocus.h) {
						if (elFocus.getAttribute('open') != undefined) elFocus.setAttribute('open', 1);
						elFocus = elFocus.parentElement.parentElement;
					}
				}
			});

			var c = Document.elBody.getElementsByTagName('H1');
			//for (var i = 0, e; e = c[i]; i++) if (e.tagName == 'DIV') break;
			//c[0].parentElement;
			var elFirstChapter = null;
			var ul = [null, Document.elIndex];
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
			//}
		},
		sbs: function (event) {
			console.log('SBS', event.par.src, event.data, this.el);
			this.data = event.data;
			//console.log(event.data, this.el);
			//Document.id = event.par.get.id;
			with (this.elBody) {
				(writeItem = function (item, i, rows) {
					//console.log(this,rows.level);
					var value,
						name = item.id;
					//name = item.schema + item.id;
					appendTag('a', { name: name });
					appendTag('h' + rows.level, { innerText: item.title });
					(item.elIndexTitle = (item.elIndexLI = rows.elIndexUL.appendTag('li')).appendTag('h' + rows.level, { onclick: Aim.Element.onclick })).appendTag('a', { innerText: item.title, href: '#' + name, });

					with (appendTag('table', { className: 'properties' })) {
						for (var name in item.attributes) if (value = item.getValue(name, true)) with (appendTag('tr')) {
							appendTag('th', { innerText: name });
							if (item.attributes[name].itemID) appendTag('td').appendTag('a', { innerText: value, href: '#' + item.attributes[name].itemID });
							else appendTag('td', { innerText: value });
						}
					}
					if (item.children) {
						item.elIndexTitle.setAttribute('open', 0);
						item.children.level = rows.level + 1;
						item.children.elIndexUL = item.elIndexLI.appendTag('ul');
						item.children.forEach(writeItem.bind(this));
					}
				})(this.item, 0, { level: 0, elIndexUL: this.elIndex.appendTag('ul') });
				//appendTag('h1', { innerText: 'sdfgsdfgsdf' });
			}
			//this.createIndex();
		}
	},
});



//em = { definitions: {} };
//wrDoc = function (obj) {
//	with (document.body) {
//		with (appendTag('table')) {
//			'ref,description,type,title,conditie,actie,init,comment'.split(',').forEach(function (name) {
//				if (obj[name]) with (appendTag('tr', {})) {
//					appendTag('th', { innerText: name });
//					appendTag('td', { className: name, innerHTML: String(obj[name]).replace(/;/g, "<br>") });
//				}
//			});
//		}
//	}
//}
//wrSystem = function (item) {
//	//console.log(this);
//	with (document.body) {
//		appendTag('a', { name: item.id });
//		appendTag('h' + item.level, { innerText: item.title });
//		with (appendTag('table')) {
//			with (appendTag('tr')) {
//				appendTag('th', { innerText: 'id:' });
//				appendTag('td', { innerText: item.id });
//			}
//			if (item.typical) with (appendTag('tr')) {
//				appendTag('th', { innerText: 'Typical:' });
//				appendTag('td', { innerText: item.typical });
//			}

//			//if (item.objectClass) with (appendTag('tr')) {
//			//	appendTag('th', { innerText: 'Class:' });
//			//	appendTag('td').appendTag('a', { href: '#' + item.objectClass.name, innerText: item.objectClass.name });
//			//}

//			var config = {};
//			if (item.children && item.children.length) {
//				item.children.sort(function (a, b) {
//					return a.idx > b.idx ? 1 : a.idx < b.idx ? -1 : 0;
//				});
//				with (appendTag('tr')) {
//					appendTag('th', { innerText: 'Consists of:' });
//					with (appendTag('td').appendTag('ol')) {
//						item.children.forEach(function (child) {
//							//console.log(id);
//							appendTag('li').appendTag('a', { href: '#' + child.id, innerText: child.title + child.fullTag }).appendTag('small').appendTag('i', { innerText: ' ' + child.id });
//							if (!child.objectClass) return;
//							config[child.objectClass.name] = config[child.objectClass.name] || [];
//							config[child.objectClass.name].push(child);
//						});
//					}
//				}
//			}

//			if (item.source && item.source.name) {
//				with (appendTag('tr')) {
//					appendTag('th', { innerText: 'Source:' });
//					appendTag('td', { innerText: item.source.name });
//				}
//				if (hoortbij[item.source.name]) {
//					with (appendTag('tr')) {
//						appendTag('th', { innerText: 'Software objecten:' });
//						with (appendTag('td').appendTag('ol')) {
//							hoortbij[item.source.name].forEach(function (typical) {
//								//console.log(typical);
//								//appendTag('h' + (Number(item.level) + 1), { innerText: typical.title });
//								appendTag('li').appendTag('a', { href: '#' + typical.name, innerText: typical.name });
//							});
//						}
//					}
//				}
//			}
//			if (item.rel) {
//				with (appendTag('tr')) {
//					appendTag('th', { innerText: 'Relaties:' });
//					with (appendTag('td').appendTag('ol')) {
//						for (var classname in item.rel) {
//							item.rel[classname].forEach(function (id) {
//								var child = api.items[id];
//								//config[child.objectClass.name] = config[child.objectClass.name] || [];
//								//config[child.objectClass.name].push(child);
//								//console.log(id);
//								appendTag('li').appendTag('a', { href: '#' + id, innerText: api.items[id] ? api.items[id].title : 'Unkown' });
//							});
//						}
//					}
//				}
//			}

//			if (item.functions) {
//				for (var name in item.functions) {
//					var fnObj = item.functions[name];
//					appendTag('a', { name: item.id + name });
//					with (appendTag('tr')) {
//						appendTag('th', { innerText: name + ':' });
//						with (appendTag('td').appendTag('ul')) {
//							with (appendTag('li', { innerText: 'configuratie_elementen' }).appendTag('ul')) {
//								for (var cname in fnObj.configuratie_elementen) {
//									with (appendTag('li', { innerText: cname }).appendTag('ul')) {
//										if (fnObj[cname]) fnObj[cname].forEach(function (obj) {
//											appendTag('li').appendTag('a', { href: '#' + obj.item.id + obj.name, innerText: obj.item.id + obj.name });
//										})
//									}
//								}
//							}

//							//	for (var name in config) {
//							//		appendTag('li', { innerText: name });
//							//		with (appendTag('ol')) {
//							//			config[name].forEach(function (child) {
//							//				appendTag('li').appendTag('a', { href: '#' + child.id, innerText: child.objectClass.name }).appendTag('small').appendTag('i', { innerText: ' ' + child.id });
//							//			})
//							//		}
//							//	}
//						}
//					}
//				}
//			}

//			//with (appendTag('tr')) {
//			//	appendTag('th', { innerText: 'Configuratie:' });
//			//	with (appendTag('td').appendTag('ul')) {
//			//		for (var name in config) {
//			//			appendTag('li', { innerText: name });
//			//			with (appendTag('ol')) {
//			//				config[name].forEach(function (child) {
//			//					appendTag('li').appendTag('a', { href: '#' + child.id, innerText: child.objectClass.name }).appendTag('small').appendTag('i', { innerText: ' ' + child.id });
//			//				})
//			//			}
//			//		}
//			//	}
//			//}

//		}
//		if (item.children) item.children.forEach(wrSystem);
//	}
//}
//addMasterConfig = function (master) {
//	if (master && master.functions) {
//		//console.log(master.name);
//		for (var name in master.functions) {
//			//console.log(name);
//			var fnObjMaster = master.functions[name];
//			if (fnObjMaster.configuratie_elementen) {
//				for (var name in this.functions) {
//					if (name in fnObjMaster.configuratie_elementen) {
//						fnObjMaster.configuratie_elementen[name].value = fnObjMaster[name] = fnObjMaster[name] || [];
//						fnObjMaster[name].push(this.functions[name]);
//					}
//				}
//			}
//		}
//		addMasterConfig.call(this, master.master);
//	}
//}
//doc = {
//	onload: function (id) {
//		var types = {}, swObjecten = [];
//		Aim.load({
//			api: 'item', get: { id: id || get.id, child: 8, src: 10, link: 10, refby: 10, select: '*' }, onload: function () {
//				console.log(this.src);
//				hoortbij = {};
//				//objectClass = {};
//				fn = {};
//				for (var name in def) {
//					var obj = def[name];
//					//var objName = name.split('_')[1];
//					//objectClass[name.split('_')[1]] = obj;
//					obj.name = name;
//					obj.title = obj.title || name;
//					if (obj.hoortbij) {
//						hoortbij[obj.hoortbij] = hoortbij[obj.hoortbij] || [];
//						hoortbij[obj.hoortbij].push(obj);
//					}
//				}
//				api.items.forEach(function (item) {
//					//if (item.objectClass = objectClass[item.typical]) item.objectClassName = item.objectClass.name;
//					item.functions = {};
//					if (hoortbij[item.typical]) {
//						//console.log(hoortbij[item.typical]);
//						hoortbij[item.typical].forEach(function (obj) {
//							var s = item.functions[obj.name] = new function () { };
//							s.item = item;
//							Object.assign(s, obj);
//							swObjecten.push(s);
//						});
//						//console.log(item.functions);
//					}
//					addMasterConfig.call(item, item.master);
//					if (item.rel) for (var name in item.rel) item.rel[name].forEach(function (id) {
//						console.log('REL', id, api.items[id]);
//						for (var name in item.functions) {
//							var fnObjMaster = item.functions[name];
//							if (fnObjMaster.configuratie_elementen) {
//								for (var name in api.items[id].functions) {
//									if (name in fnObjMaster.configuratie_elementen) {
//										fnObjMaster.configuratie_elementen[name].value = fnObjMaster[name] = fnObjMaster[name] || [];
//										fnObjMaster[name].push(api.items[id].functions[name]);
//									}
//								}
//							}
//						}
//					});
//				});
//				console.log(api.items[this.data.id]);

//				wrSystem(api.items[this.data.id]);

//				with (document.body) {
//					style = 'background:white;color:black;';
//					for (var name in def) {
//						var fn = def[name];
//						a = name.split('_');
//						a.shift();
//						var typeName = a.shift();
//						types[typeName] = {};
//						appendTag('a', { name: name });
//						appendTag('h1', { innerText: name });
//						chapters = {
//							configuratie_elementen: {
//								title: 'Configuratie elementen',
//							},
//							variabelen: {
//								title: 'Variabelen',
//							},
//							bedieningen: {
//								title: 'Bedieningen',
//							},
//							besturingen: {
//								title: 'Besturingen',
//							},
//							signaleringen: {
//								title: 'Signaleringen',
//							},
//							autonome_processen: {
//								title: 'Autonome processen',
//							},
//						}
//						for (var chapter in chapters) {
//							if (fn[chapter]) {
//								appendTag('h2', { innerText: chapters[chapter].title });
//								for (var subname in fn[chapter]) {
//									appendTag('h3', { innerText: subname });
//									wrDoc(fn[chapter][subname]);
//								}
//							}
//						}
//						//new (def[name]);
//					}
//				}
//			}
//		});
//	}

//}
