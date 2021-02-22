docgenerator = {
	toggleOpen: function () {
		if (!this.hasAttribute('open')) return;
		this.setAttribute('open', Number(open) || this.getAttribute('open') ^ 1);
		if (this.getAttribute('open')) for (var e = this.parentElement; e; e = e.parentElement) if (e.hasAttribute('open')) e.setAttribute('open', 1);
	},
	isEmpty: function (obj) {
		for (var key in obj) if (obj.hasOwnProperty && obj.hasOwnProperty(key)) return false;
		return true;
	},
	isConstruct: function (obj) {
		return obj.toString().split('constructor').length > 1;
		//if (s.indexOf('this.') == -1) return false;
		//var fn = doc.functionPar(obj);
		//var a = fn.code.split(/\r\n/);
		//for (var i = 0; i < a.length - 1; i++) if (a[i].substr(0, 5) == 'this.' && a[i].indexOf(' = ') != -1) return true;
		//return false;
	},
	typeObject: function (obj, name) {
		var typeObject = {
			type: Object.prototype.toString.call(obj) === '[object Object]' ? 'class'
				: Object.prototype.toString.call(obj) === '[object Array]' ? 'enum'
				: typeof obj == 'function' && doc.isConstruct(obj) ? 'constructor'
				//: typeof obj == 'function' && !doc.isEmpty(obj) ? 'constructor'
				: typeof obj == 'function' ? 'function'
				: 'property',
			name: name,
		}
		//if (typeObject == 'function') {
		//    var body = obj.toString();
		//    //console.log(body);
		//    var fline = body.substr(0, body.indexOf('{'));
		//    var arguments = body.substring(body.indexOf('(') + 1, body.indexOf(')')).trim();
		//    arguments = arguments ? arguments.split(',') : [];
		//    //var arguments = body.substring(body.indexOf('(') + 1, body.indexOf(')')).split(',');
		//    body = body.substr(body.indexOf('{') + 3).slice(0, -3);
		//    var abody = body.split(/\r\n/);
		//    var a = [];
		//    var cspace = null;
		//    abody.forEach(function (r) {
		//        if (!r) return;
		//        if (cspace == null) cspace = r.search(/\S/);
		//        var r = r.split(/\/\//).shift().substr(cspace);
		//        if (r.trim()) a.push(r);
		//    });
		//    //console.log(a);
		//    var info = abody.shift();
		//    if (info.indexOf('//')) var description = info.substr(info.indexOf('//') + 2);
		//    typeObject.arguments = arguments;
		//    typeObject.description = description;
		//    var code = typeObject.code = a.join("\r\n");
		//    var comment = code.substring(code.lastIndexOf("/*") + 1, code.lastIndexOf("*/"));
		//    if (comment) eval(""+comment);
		//}
	},
	hashchange: function () {
		var path = document.location.hash.substr(1).split('(').shift().split(/\/|\./);
		//console.log('PATH',path);
		var doctype = path.shift();
		//path.shift();
		var ref = docname = path.join('.').replace('window.', '');
		//var ref = doc;//.replace('.', '/');
		var obj = Aim.URL.objbyref(ref, window).e;
		//console.log('DOC HASH', doc, ref, obj);
		doc.buildpage(obj, docname, doctype);
	},
	objectType: function (obj) {
		//Get objecttype of argument obj
		return Object.prototype.toString.call(obj) === '[object Object]' ? 'class'
					: Object.prototype.toString.call(obj) === '[object Array]' ? 'enum'
					: typeof obj == 'function' && doc.isConstruct(obj) ? 'constructor'
					//: typeof obj == 'function' && !doc.isEmpty(obj) ? 'constructor'
					: typeof obj == 'function' ? 'function'
					: 'property'
	},
	getobjtype: function (obj) {
		var groupnames = { class: "Classes", enum: "Enums", contructor: "Constructors", function: "Functions", property: "Properties" };
		return groupnames[doc.objectType(obj)];
	},
	functionPar: function (obj) {
		var body = obj.toString();
		//console.log(body);
		var fline = body.substr(0, body.indexOf('{'));
		var arguments = body.substring(body.indexOf('(') + 1, body.indexOf(')')).trim();
		arguments = arguments ? arguments.split(',') : [];
		//var arguments = body.substring(body.indexOf('(') + 1, body.indexOf(')')).split(',');
		body = body.substr(body.indexOf('{') + 3).slice(0, -3);
		var abody = body.split(/\r\n/);
		var a = [];
		var cspace = null;
		abody.forEach(function (r) {
			if (!r) return;
			if (cspace == null) cspace = r.search(/\S/);
			var r = r.split(/\/\//).shift().substr(cspace);
			if (r.trim()) a.push(r);
		});
		//console.log(a);
		var info = abody.shift();
		if (info.indexOf('//')) var description = info.substr(info.indexOf('//') + 2);
		return { arguments: arguments, description: description, code: a.join("\r\n") }
	},
	buildpage: function (obj, objname, doctype) {
		//console.log('BUILD', obj);
		//var types = {
		//    class: { title: 'Class', groupTitle: 'Classes' },
		//    enum: { title: 'Enum', groupTitle: 'Enums' },
		//    constructor: { title: 'Contructor', groupTitle: 'Contructors' },
		//    function: { title: 'Function', groupTitle: 'Functions' },
		//    property: { title: '', groupTitle: '' }
		//};
		var sub = { Constructors: {}, Properties: {}, Classes: {}, Interfaces: {}, Enums: {}, Functions: {} }
		var typetitles = { class: "Class", constructor: "Constructor", function: "Function", enum: "Enum", property: "Property" }
		var groupnames = { class: "Classes", constructor: "Constructors", function: "Functions", enum: "Enums", property: "Properties" };
		var classes = { Properties: [], Enums: [], Functions: [], Constructors: [], Classes: [], Interfaces: [], }
		var aprop = [];
		var objectType = doc.objectType(obj);
		if (objectType == 'constructor') obj = new obj();
		var typetitle = typetitles[objectType];

		with (elContent) {
			innerText = '';
			var Title = doctype == 'doca' ? objname.replace(/\./g, '/').replace('/paths', '') : objname;
			appendTag('h1', { innerText: Title + (fn ? '(' + fn.arguments.join(',') + ')' : '') + ' ' + typetitle });

			//console.log('EMPTY', doc.isEmpty(obj));
			console.log('OBJ', objname, obj);
			var fn = typetitle == 'Function' ? doc.functionPar(obj) : null;
			//if (doctype=='doca') 

			if (objectType == 'property') appendTag('div', { innerText: obj });
			else for (var prop in obj) aprop.push({
				name: prop,
				obj: obj[prop]
			});
			aprop.sort(function (a, b) { return a.name.localeCompare(b.name); });

			aprop.forEach(function (prop) {
				prop.type = doc.objectType(prop.obj);
				prop.types = groupnames[prop.type];
				prop.ref = objname.split('/').join('.') + '.' + prop.name;
				//console.log(prop.type, prop.types);
				//if (prop.type == 'constructor') {
				//    console.log('CONSTRUCT', prop);
				//    prop.obj = new prop.obj();
				//}
				classes[prop.types].push(prop);
			});

			var path = objname.split('.'); path.pop(); //path = path.join('.');
			with (appendTag('p')) {
				var prepath = [];
				while (path.length) {
					var name = path.shift();
					prepath.push(name);
					appendTag('a', { innerText: name, href: '#doc.' + prepath.join('.') });
					if (path.length) appendText('.');
				};
			}
			if (fn) {
				//var fn = doc.functionPar(obj);
				console.log('FN', fn);
				if (fn.description) appendTag('p', { innerText: fn.description });
				if (fn.arguments.length) {
					appendTag('h2', { innerText: 'Parameters' });
					fn.arguments.forEach(function (par) {
						with (appendTag('div', { className: 'row' })) {
							appendTag('span', { innerText: par });
						}
					});
				}
				appendTag('h2', { innerText: 'code' });
				appendTag('code').appendTag('pre', { innerText: fn.code });
			}

			for (var name in classes) if (classes[name].length) {
				appendTag('h2', { innerText: name });
				classes[name].forEach(function (prop) {
					//var Title = objname.split('/').join('.') + '.' + prop.name;
					var Title = prop.name;
					var Description = typeof prop.obj != 'object' ? prop.obj : prop.type + ' for ...';
					//console.log(prop.type);
					if (prop.type == 'Function') {
						var fn = doc.functionPar(prop.obj);
						Title += '(' + fn.arguments.join(',') + ')';
						if (fn.description) Description = fn.description;

					}
					appendTag('a', { className: "offTop", name: "doc." + Title });
					with (appendTag('div', { className: 'row' })) {
						with (appendTag('div')) {
							appendTag('a', { obj: prop.obj, objname: objname, href: '#doc.' + objname.split('/').join('.') + '.' + prop.name, innerText: Title });
							if (prop.obj && prop.obj.classID) {
								var classObject = Aim.Object.find(api.definitions, function (obj) { return obj.classID == prop.obj.classID; });
								if (classObject != prop.obj)
									appendTag('a', { className: 'ofClass', obj: classObject, objname: objname, href: '#doc.api.definitions.' + classObject.name, innerText: classObject.name });
							}

						}
						appendTag('div', { innerText: Description })
					}
				});
			}
			document.body.scrollTop = 0;
		}
	},
	builddoc: function (obj, objname, elIndex) {
		var classes = { Constructors: {}, Properties: {}, Classes: {}, Interfaces: {}, Enums: {}, Functions: {} }
		var aprop = [];
		for (var prop in obj) aprop.push({ name: prop, obj: obj[prop] });
		aprop.sort(function (a, b) { return a.name.localeCompare(b.name); });
		var sub = { Constructors: {}, Properties: {}, Classes: {}, Interfaces: {}, Enums: {}, Functions: {} }
		var typetitle = { Constructors: "Contructor", Properties: "Property", Classes: "Class", Interfaces: "Interface", Enums: "Enum", Functions: "Function" }
		aprop.forEach(function (prop) {
			with (elIndex.appendTag('li', { className: 'col' })) {
				var Title = prop.name;
				var type = doc.getobjtype(prop.obj);
				//console.log(Title,doc.getobjtype(prop.obj));
				if (type == "Functions") Title += '(' + doc.functionPar(prop.obj).arguments.join(',') + ')';
				appendTag('a', { className: 'row', href: '#doc.' + objname + '.' + prop.name, propname: prop.name, findstring: prop.name.toLowerCase(), onclick: doc.toggleOpen, innerText: Title });
				if (!doc.isEmpty(prop.obj) && props.indexOf(prop.obj) == -1) {
					props.push(prop.obj);
					setAttribute('open', 0);
					doc.builddoc(prop.obj, objname + '.' + prop.name, appendTag('ul'));
				}
			}
		});
		for (var name in classes) if (doc.isEmpty(classes[name])) delete classes[name];
		return classes;
	},
	buildapi: function (obj, objname, elIndex) {
		var aprop = [];
		for (var prop in obj) aprop.push({ name: prop, obj: obj[prop] });
		aprop.sort(function (a, b) { return a.name.localeCompare(b.name); });
		aprop.forEach(function (prop) {
			with (elIndex.appendTag('li', { className: 'col' })) {
				var Title = prop.name.replace(/\./g, '/');
				var type = doc.getobjtype(prop.obj);
				//console.log(Title,doc.getobjtype(prop.obj));
				//if (type == "Functions") Title += '(' + doc.functionPar(prop.obj).arguments.join(',') + ')';
				appendTag('a', { className: 'row', href: '#doca.' + objname + '.' + prop.name, propname: prop.name, findstring: prop.name.toLowerCase(), onclick: doc.toggleOpen, innerText: Title });


				if (typeof prop.obj == 'object' && !doc.isEmpty(prop.obj) && props.indexOf(prop.obj) == -1) {
					props.push(prop.obj);
					setAttribute('open', 0);
					doc.buildapi(prop.obj, objname + '.' + prop.name, appendTag('ul'));
				}
			}
		});

	},
	init: function () {
		console.log('DOC INIT', aim, $aim);
		aim.load({
			api: 'openapi.json', onload: function () {
				console.log('OAS', this.data);
				doc.buildapi(this.data, 'api', document.getElementById('elApi'));
			}
		});
		props = [];
		var mydoc = doc.builddoc($aim, 'window', elIndex = document.getElementById('elIndex'));
		document.getElementById('findIndex').onkeyup = function () {
			var c = elIndex.getElementsByTagName('LI');
			var hit = [];
			for (var i = 0, e; e = c[i]; i++) {
				e.style.display = 'none';
				if (e.firstChild.findstring.indexOf(this.value) !== -1) {
					//console.log(e.propname, e.propname.indexOf(this.value));
					hit.push(e);
				}
			}
			console.log(this.value, hit);
			hit.forEach(function (e) {
				while (e) {
					e.style.display = '';
					//if (e.tagName=='LI') e.setAttribute('open',1);
					e = e.parentElement;
				}
			});
		};
		console.log('DOC', mydoc);
		aim.addEventListener(window, 'hashchange', doc.hashchange);
		doc.hashchange();

	},
}

var allobjects = [];
buildobj = function (obj, level) {
	if (!obj) return;

	//console.log(obj.name, allobjects.indexOf(obj.name));
	with (ElementContent) {

		//appendTag('div', { innerText: obj.type });
		appendTag('a', { name: obj.name });
		appendTag('h' + level, { innerText: obj.name }).appendTag('small', { innerText: " : "+obj.type });
		with (appendTag('div', { className: 'row reverse' })) {
			for (var parent = obj.parent; parent.name; parent = parent.parent) {
				appendTag('a', { innerText: parent.name, href: '#' + parent.name });
			}
		}


		if (obj.name in window && window[obj.name] == obj.obj) obj.parent = topParent;
		with (obj.parent.elUL.appendTag('li', {})) {
			//console.log(obj.parent.elTitle);
			if (obj.parent.elTitle) obj.parent.elTitle.setAttribute('open', 0);
			obj.elTitle = appendTag('a', { href: '#' + obj.name, innerText: obj.name, onclick: docgenerator.toggleOpen });
			obj.elUL = appendTag('ul');
		}
		if (typeof obj.obj == 'function') {
			appendTag('code', { innerText: String(obj.obj).replace(/\r\n\t/g, "\r\n").replace(/\t/g, '  ') });
		}

		var objchildren = [], chapters = {
			Attribute: { title: 'Attributes', items: [] },
			Function: { title: 'Functions', items: [] },
			Object: { title: 'Objects', items: [] },
		};
		for (var name in obj.obj) if (listobj = obj.obj[name]) {
			var type = typeof listobj == 'function' ? 'Function' : typeof listobj == 'string' ? 'String' : Object.prototype.toString.call(listobj).replace(/\[object/, '').replace(/\]/, '').trim();
			objchildren.push({ name: name, obj: listobj, parent: obj, type: type, chapter: type == 'String' || type == 'Number' || type == 'Array' ? 'Attribute' : type == 'Function' ? 'Function' : 'Object' });
			objchildren.sort(function (a, b) { return a.name.localeCompare(b.name, 'en', { caseFirst: 'upper' }); });
		}
		//console.log(objchildren);
		objchildren.forEach(function (listobj) { chapters[listobj.chapter].items.push(listobj); });
		//if (allobjects.indexOf(obj.obj) != -1) return console.log(obj.obj);

		for (var i = 0, listobj; listobj = allobjects[i];i++) if (listobj.obj == obj.obj) return console.log('REDDS GEDAAN',obj.name); 
		if (allobjects.indexOf(obj.name) != -1) return;
		allobjects.push(obj.name);
		allobjects.push(obj);
		//if (obj.name == 'prototype') return;
		if (obj.name == 'aliconnect') return;
		//if (obj.name == 'window') return;
		if (obj.name == 'stylesheet') return;

		for (var name in chapters) {
			chapter = chapters[name];
			if (chapter.items.length) {
				if (chapter.title == 'Attributes') {
					with (appendTag('table')) {
						chapter.items.forEach(function (obj) {
							with (appendTag('tr')) {
								appendTag('td', { innerText: obj.name });
								appendTag('td', { innerText: obj.type });
								appendTag('td', { innerText: obj.obj });
							}
						})
					}
					continue;
				}
				//appendTag('b', { innerText: chapter.title });
				chapter.items.forEach(function (listobj) {
					if (level > 6) {
						console.log(listobj);
						return;
					}

					buildobj(listobj, level + 1);
					//appendTag('a', { name: listobj.name });
					//appendTag('h' + (level + 2), { innerText: typeof listobj.obj + ' ' + listobj.name });
					//appendTag('div', { innerText: typeof listobj.obj });
					//if (typeof listobj.obj == 'function') {
					//	appendTag('div', { innerText: String(listobj.obj) });
					//}
					//if (typeof listobj.obj == 'object') {
					//console.log(listobj.name, allobjects.indexOf(listobj.obj));

					//buildobj(listobj, level + 2);
					//}
				});
			}
		}
		//objchildren.forEach(function (listobj) {
		//	if (allobjects.indexOf(listobj.obj) == -1) {
		//		allobjects.push(listobj.obj);
		//		document.getElementById('Index').appendTag('li').appendTag('a', { href: '#' + listobj.name, innerText: listobj.name });
		//		builddoc(listobj.obj, level + 1);
		//	}
		//});
	}
}
Aim.appendHead.css(['../manual/css/doc.css','../../lib/css/document.css']);
addEventListener('load', function () {

	with (document.body){
		with (appendTag('div', { className: "row aco document fixed" })) {
			ElementIndex = appendTag('div', { id: "ElementIndex", className: "col aco navtree" });
			ElementContent = appendTag('div', { id: "ElementContent", className: "col doc-content" });
			ElementInfo = appendTag('div', { id: "ElementInfo", className: "col aco" });
		}
	}

	buildobj({ name: 'Aim', obj: Aim, parent: topParent = { elUL: ElementIndex.appendTag('ul') } }, 0);
	console.log(Aim);
});

