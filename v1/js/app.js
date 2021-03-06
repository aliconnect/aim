﻿/*jhgjhjgjhg*/
var accent_fold = (function () {
	var accent_map = {
		'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', // a
		'ç': 'c',                                                   // c
		'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',                     // e
		'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',                     // i
		'ñ': 'n',                                                   // n
		'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', // o
		'ß': 's',                                                   // s
		'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',                     // u
		'ÿ': 'y'                                                    // y
	};
	return function accent_fold(s) {
		if (!s) { return ''; }
		var ret = '';
		for (var i = 0; i < s.length; i++) {
			ret += accent_map[s.charAt(i)] || s.charAt(i);
		}
		return ret;
	};
}());
Aim.date = date = {
	local: function (dts) {
		dts = dts ? new Date(dts) : new Date();
		return new Date(dts.valueOf() - dts.getTimezoneOffset());
	},
	date: function (dts) {
		var dt = dts ? new Date(dts) : new Date();
		dt.setHours(0, -dt.getTimezoneOffset(), 0, 0);
		return dt;
	},
	workday: function (dts) {
		var dt = date.localdate(dts);
		if (!dt.getDay()) dt.setDate(dt.getDate() - 2);
		return dt;
	}
};
date.localdate = date.date;
date.today = date.localdate();
date.startdate = date.localdate();
while (date.startdate.getDay()) date.startdate.setDate(date.startdate.getDate() - 1);
date.startdate.setDate(date.startdate.getDate() + 1);
function aDate(d) {
	if (!d) return new Date();
	var resdate = new Date(d);
	//console.log('new date 1', d, resdate.toLocaleString());
	if (d.length == 10) resdate.setTime(resdate.getTime() + resdate.getTimezoneOffset() * 60 * 1000);
	//console.log('new date 2', d, resdate.toLocaleString());
	//console.log(['new date 2', d, res.toDateTimeStr(), res.toLocaleString(), res.toGMTString(), res.toISOString(), res.toLocal(), res.getTimezoneOffset()].join(';'));
	return resdate;
}
function swipedetect(el, callback) {
	var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function (swipedir) { };

	touchsurface.addEventListener('touchstart', function (e) {
		var touchobj = e.changedTouches[0],
		swipedir = 'none',
		dist = 0,
		startX = touchobj.pageX,
		startY = touchobj.pageY,
		startTime = new Date().getTime(); // record time when finger first makes contact with surface
		e.preventDefault();
	}, false);

	touchsurface.addEventListener('touchmove', function (e) {
		e.preventDefault(); // prevent scrolling when inside DIV
	}, false);

	touchsurface.addEventListener('touchend', function (e) {
		var touchobj = e.changedTouches[0],
		distX = touchobj.pageX - startX, // get horizontal dist traveled by finger while in contact with surface
		distY = touchobj.pageY - startY, // get vertical dist traveled by finger while in contact with surface
		elapsedTime = new Date().getTime() - startTime; // get time elapsed
		if (elapsedTime <= allowedTime) { // first condition for awipe met
			if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
				swipedir = (distX < 0) ? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
			}
			else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
				swipedir = (distY < 0) ? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
			}
		}
		handleswipe(swipedir);
		e.preventDefault();
	}, false);
}
allobjects = [];

Aim.assign({
	Shop: {
		payform: function (el) {
			with (el || document.body.appendTag('div', { className: 'payform row' })) {
				with (appendTag('div', { className: 'col', style: 'width:33%' })) {
					appendTag('h1', { innerText: '1. Vul je gegevens in' });
					appendTag('p', { innerText: 'Heb je al een account? Dan kun je inloggen.' });
					with (appendTag('div')) {
						appendTag('input', { type: 'radio' });
						appendTag('label', { innerText: 'Particulier' });
						appendTag('input', { type: 'radio' });
						appendTag('label', { innerText: 'Zakelijk' });
					}
					with (appendTag('div', { className: 'row' })) {
						with (appendTag('div', { className: 'col aco' })) {
							appendTag('div', { innerText: 'Bedrijfsnaam *' });
							appendTag('input', { type: 'text' });
						}
						with (appendTag('div', { className: 'col aco' })) {
							appendTag('div', { innerText: 'Btw-nummer' });
							appendTag('input', { type: 'text' });
						}
					}
					with (appendTag('div', { className: 'row' })) {
						with (appendTag('div', { className: 'col aco' })) {
							appendTag('div', { innerText: 'Voornaam *' });
							appendTag('input', { type: 'text' });
						}
						with (appendTag('div', { className: 'col aco' })) {
							appendTag('div', { innerText: 'Achternaam' });
							appendTag('input', { type: 'text' });
						}
					}
					appendTag('div', { innerText: 'Land *' });
					appendTag('input', { type: 'text' });
					with (appendTag('div', { className: 'row' })) {
						with (appendTag('div', { className: 'col aco', style: 'width:50%' })) {
							appendTag('div', { innerText: 'Postcode *' });
							appendTag('input', { type: 'text' });
						}
						with (appendTag('div', { className: 'col aco', style: 'width:30%' })) {
							appendTag('div', { innerText: 'Huisnr. *' });
							appendTag('input', { type: 'text' });
						}
						with (appendTag('div', { className: 'col aco' })) {
							appendTag('div', { innerText: 'Toev.' });
							appendTag('input', { type: 'text' });
						}
					}
					with (appendTag('div')) {
						appendTag('input', { type: 'checkbox' });
						appendTag('label', { innerText: 'Ik wil een afwijkend afleveradres opgeven' });
					}
					appendTag('div', { innerText: 'Bedrijfsnaam' });
					appendTag('input', { type: 'text' });
					appendTag('div', { innerText: 'Naam *' });
					appendTag('input', { type: 'text' });
					appendTag('div', { innerText: 'Land *' });
					appendTag('input', { type: 'text' });
					with (appendTag('div', { className: 'row' })) {
						with (appendTag('div', { className: 'col aco', style: 'width:50%' })) {
							appendTag('div', { innerText: 'Postcode *' });
							appendTag('input', { type: 'text' });
						}
						with (appendTag('div', { className: 'col aco', style: 'width:30%' })) {
							appendTag('div', { innerText: 'Huisnr. *' });
							appendTag('input', { type: 'text' });
						}
						with (appendTag('div', { className: 'col aco' })) {
							appendTag('div', { innerText: 'Toev.' });
							appendTag('input', { type: 'text' });
						}
					}
					appendTag('div', { innerText: 'Telefoon *' });
					appendTag('input', { type: 'text' });
					appendTag('div', { innerText: 'E-mail *' });
					appendTag('input', { type: 'text' });
					with (appendTag('div')) {
						appendTag('input', { type: 'checkbox' });
						appendTag('label', { innerText: 'Ja, ik wil nieuwsbrieven van ontvangen' });
					}
					with (appendTag('div')) {
						appendTag('input', { type: 'checkbox' });
						appendTag('label', { innerText: 'Ja, stuur mij relevante deals afgestemd op mijn interesses' });
					}
					with (appendTag('div')) {
						appendTag('input', { type: 'checkbox' });
						appendTag('label', { innerText: 'Ik wil een account aanmaken' });
					}
					with (appendTag('div')) {
						appendTag('div', { innerText: 'Kies een wachtwoord *' });
						appendTag('input', { type: 'text' });
					}
					appendTag('div', { innerText: '* Verplicht in te vullen velden' });

				}
				with (appendTag('div', { className: 'col aco' })) {
					with (appendTag('div', { className: 'row' })) {
						with (appendTag('div', { className: 'col', style: 'width:50%' })) {
							appendTag('h1', { innerText: '2. Kies een verzendmethode' });
							appendTag('div', { innerText: 'Maak een keuze: (zie Verzendkosten)' });
							with (appendTag('div')) {
								appendTag('input', { type: 'checkbox' });
								appendTag('label', { innerText: 'Afhalen bij een DHL ServicePoint' });
							}
							with (appendTag('div')) {
								appendTag('input', { type: 'checkbox' });
								appendTag('label', { innerText: 'Afhalen locatie Westerfoort' });
								appendTag('info', { innerText: 'i', title: 'Openingstijden: di/wo/vr: 9:00-18:00\Ado: 9:00-20:00, za: 09:00-17:00\AAdres: Hopjesweg 12A, 1234AB, Westerfoort' });
							}
							with (appendTag('div')) {
								appendTag('input', { type: 'checkbox' });
								appendTag('label', { innerText: 'Bezorgen op het afleveradres' });
							}

						}
						with (appendTag('div', { className: 'col aco' })) {
							appendTag('h1', { innerText: '3. Kies een betaalmethode' });
							appendTag('div', { innerText: 'Kies de betaalmethode die je makkelijk vindt.' });
							with (appendTag('div', { className: 'row' })) {
								appendTag('input', { type: 'checkbox' });
								appendTag('label', { innerText: 'Waardebon- of actiecode invoeren' });
							}
							with (appendTag('div', { className: 'row' })) {
								appendTag('input', { className: 'aco', type: 'text' });
								appendTag('button', { innerText: 'Activeren' });
							}
							with (appendTag('div', { className: 'row' })) {
								appendTag('input', { type: 'radio' });
								with (appendTag('label', { innerText: 'iDEAL', style: '' })) {
									with (appendTag('select', { title: 'Kies bank.', className: 'required', name: 'issuer_id', id: 'issuerID' })) {
										appendTag('option', { value: '', innerText: 'Kies jouw bank ...' });
										appendTag('option', { value: '0031', innerText: 'ABN Amro bank' });
										appendTag('option', { value: '0761', innerText: 'ASN Bank' });
										appendTag('option', { value: '0802', innerText: 'bunq' });
										appendTag('option', { value: '0721', innerText: 'ING' });
										appendTag('option', { value: '0801', innerText: 'Knab' });
										appendTag('option', { value: '0021', innerText: 'Rabobank' });
										appendTag('option', { value: '0771', innerText: 'RegioBank' });
										appendTag('option', { value: '0751', innerText: 'SNS Bank' });
										appendTag('option', { value: '0511', innerText: 'Triodos Bank' });
										appendTag('option', { value: '0161', innerText: 'Van Lanschot Bankiers' });
									}
								}
							}
							with (appendTag('div', { className: 'row' })) {
								appendTag('input', { type: 'radio' });
								with (appendTag('label', { innerText: 'PayPAL' })) {
									appendTag('small', { innerText: '+ 1.90%' });
								}
							}
							with (appendTag('div', { className: 'col' })) {
								with (appendTag('div', { className: 'row' })) {
									appendTag('input', { type: 'radio' });
									with (appendTag('label', { innerText: 'Achteraf betalen' })) {
										appendTag('small', { innerText: '+ € 1.95' });
									}
								}
								appendTag('div', { innerText: 'Geslacht *' });
								with (appendTag('div')) {
									appendTag('input', { type: 'radio' });
									appendTag('label', { innerText: 'Man' });
									appendTag('input', { type: 'radio' });
									appendTag('label', { innerText: 'Vrouw' });
								}

								appendTag('div', { innerText: 'Geboortedatum *' });
								with (appendTag('div')) {
									appendTag('input', { type: 'number', min: 1, max: 31 });
									appendTag('input', { type: 'number', min: 1, max: 12 });
									appendTag('input', { type: 'number', min: 1900, max: 2019 });
								}
							}
							with (appendTag('div', { className: 'row' })) {
								appendTag('input', { type: 'radio' });
								appendTag('label', { innerText: 'Mastercard' });
							}
							with (appendTag('div', { className: 'row' })) {
								appendTag('input', { type: 'radio' });
								appendTag('label', { innerText: 'VISA' });
							}
							with (appendTag('div', { className: 'row' })) {
								appendTag('input', { type: 'radio' });
								appendTag('label', { innerText: 'Maestro' });
							}
						}
					}
					var order = {
						btwInkoop: 21,
						btw: 19,
						regels: [
								{ title: 'Artikel 1', amount: 1, catalogPrice: 8.2, catalogPrice: 6.78, discount: 0 },
								//{ title: 'Artikel 2', aantal: 2, excl: 18.2, korting: 12, btw: 21 },
								//{ title: 'Artikel 3', aantal: 4, excl: 4.2, korting: 12, btw: 21 },
						]
					}

					with (appendTag('div', { className: 'col aco' })) {
						appendTag('h1', { innerText: '4. Overzicht van je bestelling' });
						with (appendTag('table')) {
							with (appendTag('thead').appendTag('tr')) ',Aantal,Prijs,Totaal'.split(',').forEach(function (val) { appendTag('th', { innerText: val }) })
							with (appendTag('tbody')) {
								order.totaal = 0;
								order.regels.forEach(function (row) {
									row.discountPrice = Math.round(row.catalogPrice * (100 - (row.discount || 0))) / 100;
									order.totaal += (row.totaal = row.amount * (row.price = row.discountPrice + (row.btwbedrag = Math.round(row.discountPrice * order.btwInkoop) / 100)));
									with (appendTag('tr'))[row.title, row.amount, row.price, row.totaal].forEach(function (val) { appendTag('td', { innerText: val }) });
								});
								with (appendTag('tr'))['Subtotaal', '', '', order.totaal].forEach(function (val) { appendTag('td', { innerText: val }) });
								order.verzendkosten = 4.95;
								if (order.verzendkosten) with (appendTag('tr'))['Verzendkosten', '', '', order.verzendkosten].forEach(function (val) { appendTag('td', { innerText: val }) });
								order.transactiekosten = 1.95;
								if (order.transactiekosten) with (appendTag('tr'))['Transactie kosten', '', '', order.transactiekosten].forEach(function (val) { appendTag('td', { innerText: val }) });
								with (appendTag('tr'))['Totaal', '', '', order.totaal += order.verzendkosten + order.transactiekosten].forEach(function (val) { appendTag('td', { innerText: val }) });
								with (appendTag('tr'))['btw bedrag ' + order.btw + '%', '', '', order.btwbedrag = Math.round((-order.totaal / (100 + order.btw) * 100 + order.totaal) * 100) / 100].forEach(function (val) { appendTag('td', { innerText: val }) });
							}
						}
						console.log(order);
						appendTag('div', { innerText: 'Als je op de bestelknop klikt ga je akkoord met onze algemene leveringsvoorwaarden.' });
						appendTag('button', { innerText: 'Bestellen en betalen' });
						appendTag('div', { innerText: 'Door op de bestelknop te klikken rond je de bestelling af.' });
						appendTag('div', { innerText: 'Als je nu bestelt, gaan we direct aan de slag!' });


					}
				}
			}
		}
	},
	Manual: Manual = {
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
		//allobjects: allobjects = [],
		getObjectClass: function (obj) {
			//console.log(obj.name, typeof obj, Object.prototype.toString.call(obj));
			return Object.prototype.toString.call(obj).replace(/\[object|\]/g, '').trim();
		},
	},
	client: {
		app: 'om'
	},
	collist: Listview = {
		//assign: function (el) {
		//	Object.assign(el, {
		//		colName: 'lv',
		//		onmousedown: Aim.Element.onclick,
		//	});
		//},

		keydown: {
			ShiftAltArrowDown: function (event) {
				this.Aim.pageItem.movedown();
				event.preventDefault();
			},
			ShiftAltArrowUp: function (event) {
				this.Aim.pageItem.moveup();
				event.preventDefault();
			},
			ArrowUp: function (event) {
				event.preventDefault();
				Aim.collist.elementFocus(collist.elFocus.previousElementSibling);
				//OM.timeoutKeyup = setTimeout(function () { Aim.URL.setitem(collist.elFocus.item); }, 500);
			},
			ArrowDown: function (event) {
				event.preventDefault();
				Aim.collist.elementFocus(collist.elFocus.nextElementSibling && collist.elFocus.nextElementSibling.item ? collist.elFocus.nextElementSibling : null);
				//OM.timeoutKeydown = setTimeout(function () { Aim.URL.setitem(collist.elFocus.item); }, 500);
			},
			ArrowRight: function (event) {
				event.preventDefault();
				Aim.URL.set({ folder: collist.elFocus.item.id });
			},
			ArrowLeft: function (event) {
				event.preventDefault();
				var master = collist.elFocus.item.master;
				if (master) {
					if (master.master) Aim.URL.set({ folder: master.master.id });
					Aim.URL.setitem(master);
				}
			},
			ShiftArrowUp: function (event) {
				console.log(this.Aim.pageItem);
				if (this.Aim.pageItem.elLvLi && this.Aim.pageItem.elLvLi.previousElementSibling) {
					var c = collist.getElementsByTagName('LI');
					for (var i = 0, e; e = c[i]; i++) if (e.getAttribute('focus') == '') break;
					if (!collist.selstart) collist.selstart = i;
					collist.showsel(i--);
					if (e.previousElementSibling) e.previousElementSibling.item.listfocus();
					event.preventDefault();
				}
			},
			ShiftArrowDown: function (event) {
				var c = collistItems.children;
				for (var i = 0, e; e = c[i]; i++) if (e.getAttribute('focus') == '') break;
				if (!collist.selstart) collist.selstart = i;
				collist.showsel(i++);
				if (e.nextElementSibling) e.nextElementSibling.item.listfocus();
			},

		},
		keyup: {
			ArrowUp: function (event) {
				console.log('a');
				event.preventDefault();
				Aim.keyupTimeout = setTimeout(function () { Aim.nav({ schema: collist.elFocus.item.schema, id: collist.elFocus.item.id }); }, 150);
			},
			ArrowDown: function (event) {
				event.preventDefault();
				Aim.keyupTimeout = setTimeout(function () { Aim.nav({ schema: collist.elFocus.item.schema, id: collist.elFocus.item.id }); }, 150);
			},
		},

		items: [],
		filtersopen: {},
		get: {},
		data: {},
		elementFocus: function (el) {
			if (!el) return;
			if (collist.elFocus) collist.elFocus.removeAttribute('focus');
			(collist.elFocus = el).setAttribute('focus', '');
			Aim.Element.scrollIntoView(collist.elFocus, collist.elOa);
		},
		elementSelect: function (el) {
			if (!el) return;
			this.elementFocus(el);
			if (collist.elSelect) collist.elSelect.removeAttribute('selected');
			(collist.elSelect = el).setAttribute('selected', '');
		},
		set: function (set) {
			console.log('LIST SET', this.get.filter, set);
			//console.log('LIST SET', set);
			//if (!set.q) this.get = {};
			//'folder,function,q,filter,search,title,id,child,select,src,master,users,link,refby,origin,source'.split(',').forEach(function (name) { if (name in set) this.get[name] = set[name]; }, this);
			//Aim.URL.sethis(this.get);

			//Object.assign(set, { id: '', schema: '', tv: '', lv: '', reload: '' , title: '' });
			//Object.assign(set, { id: '', schema: '', reload: '' });
			//console.log('LIST SET', set.title, set.filter);
			for (var name in set) if (this.get[name] != set[name]) break; else name = null;
			if (!name) return;
			//console.log('LIST SET', set);
			//console.log(set);

			console.log('LIST SET', this.get.filter, set);
			Object.assign(this.get, set);

			//indien er een filter aanstaat en er een zoekopdracht wordt gegeven, schakelen we het filter uit. Zoeken vindt plaats op alle items van een masterclass
			//Voorbeeld is EWR moba. Filter is actief, alleen actieve items. Bij zoeken alle items.
			//if (this.get.q && this.get.q != '*' && this.get.filter) this.get.filter = '';

			this.schema = this.get.schema || (api.item[this.get.folder] ? api.item[this.get.folder].schema : null) || this.get.folder;
			this.childClasses = api.definitions[this.schema] && api.definitions[this.schema].childClasses ? api.definitions[this.schema].childClasses : [this.schema];
			//console.log('SCHEMA', this.schema, this.childClasses);


			//console.log('LIST SET', this.get.filter, set);
			for (var name in this.get) if (!this.get[name]) delete this.get[name];

			//console.log('LIST SET', this.get.filter, set.filter);

			if (this.get.folder && Number(this.get.folder) && api.item[this.get.folder]) {
				api.item[this.get.folder].focus();
				if (api.item[this.get.folder].children.length) {
					this.show(api.item[this.get.folder].children);
					return
				}
			}

			this.show(this.data[this.get.title] || []);

			//console.log('LIST SET', this.get);

			if (!this.get.q) return;
			//console.log('LIST SET', this.get.filter, set.filter);

			var get = this.get;
			collist.loadget = {};
			"folder,filter,child,q,select".split(",").forEach(function (name) { if (get[name]) collist.loadget[name] = get[name]; });
			delete collist.loadget.select;


			Aim.load({
				get: collist.loadget, onload: function (event) {
					//console.log('list_set',this.responseText,event.data);
					collist.show(event.data.value);
				}
			});



			//if (!get.value) this.items = [];

			//var par = Object.assign(Aim.URL.par(document.location.search.substr(1)), { q: this.value, search: 'title,subject,summary' }), get = {};
			//'folder,q,filter,search'.split(',').forEach(function (name) { if (par[name]) get[name] = par[name]; });
			//Aim.URL.set(get);
		},
		//item: {

		//},
		maps: function () {
			collist.setAttribute('view', 'maps');
			console.log('MAPSSSSSS');
			//collist.rewrite();
			with (Listview.elOa) {
				innerText = '';
				this.mapel = appendTag('div', { className: 'googlemap', style: 'width:100%;height:100%;' });
				OM.map = new google.maps.Map(this.mapel, this.mapOptions);
				var bounds = new google.maps.LatLngBounds();
				var focusmarker;

				function getCircle(color) {
					return {
						//url: document.location.protocol+'//developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
						//// This marker is 20 pixels wide by 32 pixels high.
						//size: new google.maps.Size(20, 32),
						//// The origin for this image is (0, 0).
						//origin: new google.maps.Point(0, 0),
						//// The anchor for this image is the base of the flagpole at (0, 32).
						//anchor: new google.maps.Point(0, 32)
						path: google.maps.SymbolPath.CIRCLE,
						fillColor: color,
						fillOpacity: .6,
						scale: 10,//Math.pow(2, magnitude) / 2,
						strokeColor: 'white',
						strokeWeight: .5
					};
				}
				for (var i = 0, row; row = this.items[i]; i++) {
					if (!row.hidden) {
						if (row.fields.geolocatie && row.fields.geolocatie.value) row.geolocatie = row.fields.geolocatie.value;
						if (row.geolocatie) {
							//console.log(row.state ,row.state.value ,row.state.states ,row.state.states[row.state.value]);
							var loc = row.geolocatie.split(',');
							var locatie = {
								lat: Number(loc[0]), lng: Number(loc[1])
							};
							var marker = new google.maps.Marker({
								position: locatie,
								map: OM.map,
								item: row,
								zIndex: Number(1),
								title: row.Title,
								icon: getCircle((row.fields.state && row.fields.state.value && row.fields.state.options && row.fields.state.options[row.fields.state.value]) ? row.fields.state.options[row.fields.state.value].color : 'red')
								//icon: (row.state) ? 'icon/' + row.state.value + '.png' : null,
							});
							marker.addListener('click', row.show);
							bounds.extend(marker.getPosition());
							var focusmarker = locatie;
						}
					}
				}
				if (bounds) {
					OM.map.fitBounds(bounds);
					google.maps.event.addListenerOnce(OM.map, 'bounds_changed', function () { this.setZoom(Math.min(15, this.getZoom())); });
				}
			}
		},
		flt: {},
		rewrite: function (event) {
			if (event) return Listview.rewrite();
			//if (!this) return;
			this.setfilter();
			this.iCreate = 0;
			this.iWrite = 0;
			//console.log('Listview', Listview);
			if (Listview.elOa) with (Listview.elOa) {
				innerText = '';
				if (this.displaytype == 'chart') return Aim.Charts.create({ el: Listview.elOa, data: this.items });
				if (this.displaytype == 'go') return Aim.Go.create({ el: Listview.elOa, data: this.items });
				if (this.displaytype) return this[this.displaytype]();
				Listview.elItems = appendTag('ul', { className: "col list" });
				this.writeitems();
			}
		},
		setfilter: function () {
			this.itemsVisible = [];
			//var idx = 0;
			for (var i = 0, row; row = this.items[i]; i++) if (!row.hidden) {
				//row.idx = idx++;
				this.itemsVisible.push(row);
				for (var attributeName in this.filter) if (row.filterfieldslower && row.filterfieldslower[attributeName] && this.filter[attributeName].values) {
					var value = row.filterfieldslower[attributeName];
					if (this.filter[attributeName].values[value]) {
						this.filter[attributeName].values[value].cnt++;
						this.filter[attributeName].cnt++;
					}
				}
			}
			//console.log('SETFILTER', this.itemsVisible, this.filter);
		},
		createElementListRow: function (el) {
			if (this.detailID) return this.detail.writeitem(el);
			with (this.elListBody = el) {
				el.item = el.row = this;
				el.onclick = el.row.onclick || function (event) {
					//console.log('KLICK ROW ', this.row, this.row.id);
					if (event.shiftKey) {
						OM.selaction = true;
						if (!collist.selected) collist.selected = collist.firstChild;
						for (var i = 0, e, c = collist.getElementsByTagName('li') ; e = c[i]; i++) {
							if (e == collist.selected) collist.selstart = i;
							else if (e == this) collist.selend = i;
							e.removeAttribute('checked');
						}
						if (collist.selend > collist.selstart) for (var i = collist.selstart; i <= collist.selend; i++) c[i].setAttribute('checked', '');
						else for (var i = collist.selend; i <= collist.selstart; i++) c[i].setAttribute('checked', '');
					}
					else if (event.ctrlKey) {
						OM.selaction = true;
						for (var i = 0, e, c = collist.getElementsByTagName('li') ; e = c[i]; i++) if (e.hasAttribute('selected')) e.setAttribute('checked', '');
						this.setAttribute('checked', '');
					}
					else {
						for (var i = 0, e, c = collist.getElementsByTagName('li') ; e = c[i]; i++) { c[i].removeAttribute('checked'); }
						collist.selected = this;
						Aim.URL.set({ origin: row.origin || '', schema: row.schema, id: this.row.id });
					}
				};
				className = ['itemrow col card noselect ', this.className || this.schema, this.id, this.id + 'online'].join(' ');
				setAttribute('online', this.online || '');
				setAttribute('modified', this.modified || '');
				//if (this.modifiedDT){
				//	if (!this.lastvisitDT || new Date().valueOf(this.modifiedDT) > new Date().valueOf(this.lastvisitDT))) appendTag('div', { className: 'modified' });
				//	if (this.modifiedDT && (!this.lastvisitDT || new Date().valueOf(this.modifiedDT) > new Date().valueOf(this.lastvisitDT))) appendTag('div', { className: 'modified' });
				//}
				innerText = '';
				with (appendTag('div').appendTag('sym')) for (var i = 0; i < 3; i++) appendTag('i');
				if (this.checked) setAttribute('checked', this.checked);
				//if (this.hasModified = !Aim.his[this.id] || new Date(Aim.his[this.id]) < new Date(this.modifiedDT)) appendTag('div', { className: !Aim.his[this.id] ? 'created' : 'modified' });

				appendTag('div', { className: 'modified' });
				if (this.properties && this.properties.state && this.properties.state.options) appendTag('div', { className: 'stateicon ' + (this.state || ''), item: this, contextmenu: this.properties.state.options }).style.backgroundColor = this.stateColor;
				with (appendTag('div', { className: 'icn listimg ' + (this.className || this.schema) })) {
					style.borderColor = this.modColor;
					if (this.iconsrc) appendTag('img', { src: this.iconsrc });
				}
				appendTag('div', { className: 'kop kop0', innerText: this.title || "" });
				appendTag('div', { className: 'kop kop1', innerHTML: this.subject || "" });
				appendTag('div', { className: 'kop kop2', innerHTML: this.summary || "" });
				if (this.operations) with (appendTag('div', { className: 'operations' })) Object.values(this.operations).forEach(function (operation) {
					operation.item = this;
					Object.assign(appendTag('a'), operation, { innerText: operation.title });
				}.bind(this));

				//appendTag('div', { className: 'bt sel', item: this, onclick: OM.selitem });

				with (appendTag('div', { className: 'icon attr' })) {
					if (this.srcID) appendTag('div', { className: 'icn ' + (this.isClass ? 'derived' : this.inherit ? 'inherit' : 'source'), item: this, onclick: function () { document.location.href = '#id=' + this.item.srcID; } });
					if (el.linkrow) {
						appendTag('div', {
							className: 'del linkeditem', par: { method: 'delete', api: 'link', get: { id: this.itemID || this.id, fromID: el.linkrow.id }, onload: function () { console.log('LINKDEL', this.src, this.responseText); } }, onclick: function (event) {
								Aim.load(this.par);
								event.stopPropagation();
								var e = this.parentElement.parentElement; e.parentElement.removeChild(e);
							}
						});
						appendTag('div', { className: 'hyperlink' });
					}
					else appendTag('div', { className: 'icn del', id: this.id, item: this, onclick: function (event) { this.item.delete(); event.stopPropagation(); } });
					row.Categories = 'test1,test2,test3';
					with (appendTag('div', { className: 'cat' })) {
						var cats = (row.Categories || '').split(',');
						for (var j = 0, cat; cat = cats[j]; j++) { appendTag('div').style.backgroundColor = cat; }
					}



					//if (row.detailID) appendTag('div', { className: 'hyperlink hdn' });
					//if (row.inheritId) appendTag('div', { className: 'inherit hdn' });
					if (this.hasAttach) appendTag('div', { className: 'icn attach hdn' });
					if (this.hasImage) appendTag('div', { className: 'icn image hdn' });
					this.btnLvFav = appendTag('div', { className: 'icn fav', item: this, attr: this.fav ? { checked: 1 } : {}, onclick: this.favToggle, });
					//console.log(Aim.popup);
					this.elFlag = appendTag('div', {
						className: 'icn flag', row: this, item: this, attr: { flag: this.flag || '' }, contextmenu: Aim.menuitems.flag.menu, onclick: function () {
							if (!this.row.finishDT) this.row.finishDT = aDate().toISOString();
							else { this.row.finishDT = ''; var d = aDate(); d.setDate(aDate().getDate() + 6); d.setHours(16, 0, 0, 0); d.toLocal(); this.row.endDT = d.toISOString(); }
							//row.flagSet();
							this.setAttribute('flag', this.row.flag);
							Aim.load({
								post: {
									//exec: 'submitItems1',
									rows: JSON.stringify([{ id: this.row.itemID, finishDT: this.row.finishDT, endDT: this.row.endDT }])
								},
								onload: function () {
									console.log(this.responseText);
								}
							});
						}
					});
					if (this.srcID && this.revertshow) appendTag('a', { className: 'copy', par: { id: this.srcID }, onclick: Aim.Element.onclick });
				}
				if (this.writeprice) this.writeprice(this.elListBody, 0);
			}
		},
		table: function () {
			with (this.elOa.appendTag('table')) {

				with (appendTag('thead').appendTag('tr')) {
					appendTag('th', { className: 'icn doc' });
					'Title,Subject,Summary'.split(',').forEach(function (field) { appendTag('th', { innerText: field }); });
					for (var attributeName in this.filter) appendTag('th', { innerText: attributeName });
					appendTag('th', { innerText: 'ID' });
				}
				with (appendTag('tbody')) {
					for (var i = this.iCreate, row; row = this.itemsVisible[i]; i++) {
						(row.elLvLi = appendTag('tr', {
							//draggable: true,
							contextmenu: Aim.popupmenuitems(row),
							select: function () {
								if (!this.innerText) Listview.writeitem(this, this.item);
								Aim.Element.scrollIntoView(this);//.scrollIntoViewIfNeeded(false);
								if (this.item.elListBody) this.item.elListBody.click();
							},
							item: row,
							className: row.id,
							onclick: row.show,
							rewrite: function () {
								with (this) {
									innerText = '';
									var row = this.item;
									appendTag('td', { className: ['icn', row.schema, row.typical ? String(row.typical).replace(' ', '_') : ''].join(' '), draggable: true, item: this.item, });
									[row.title, row.subject, row.summary].forEach(function (field) { appendTag('td', { innerText: field }); });
									for (var attributeName in Aim.collist.filter) appendTag('td', { innerText: row.filterfields[attributeName] || '' });
									appendTag('td', { innerText: row.id || '' });
								}
							}
						}));
					}
				}
			}
		},
		writeitems: function (all) {
			//console.log('WRITEITEMS');
			this.elOa.onscroll = null;
			this.elOa.onscroll = this.writeitems.bind(this);
			if (!Listview.elItems.lastChild || Listview.elOa.scrollTop + Listview.elOa.clientHeight + 80 > Listview.elItems.lastChild.offsetTop) {
				//Listview.items.writeitems();
				var max = this.iCreate + 50;
				for (var i = this.iCreate, row; row = this.itemsVisible[i]; i++) {
					//console.log(i);
					if (i > max) break;
					this.appendListitem(row);

					//row.elLvLi.rewrite();
				}
				this.iCreate = i;
				if (!row) {
					var alid = String(get.lid).split(';');
					//console.log(this.qAll ? this.qAll.length : 0, this.qAll, OM.elInputZoek.value.substr(0, this.qAll ? this.qAll.length : 0));
					if (!this.elMeer && (!this.qAll || this.qAll != OM.elInputZoek.value.substr(0, this.qAll.length))) {
						//this.qAll = OM.elInputZoek.value;
						var onclick = function (event) {
							this.onclick = null;
							this.items.qAll = OM.elInputZoek.value;
							this.innerText = 'Ophalen van meer informatie, een ogenblik geduld a.u.b.';
							console.log('SEARCH FOR MORE', this.data, OM.loadpar);
							//MVK
							OM.loadpar.get.filter = '';// = { classID: a.shift() || '', keyID: a.shift() || '', filter: a.shift() || '', order: a.shift() || '', group: a.shift() || '', link: a.shift() || '', cid: get.cid || '', ClientID: Aim.clientID || '', q: encodeURI(String(this.q || '').replace(/ /g, '+')) };
							//if (!Number(OM.loadget.classID)) OM.loadget.schema = OM.loadget.classID;
							Aim.load(OM.loadpar);

							//Aim.load({
							//    items: this.items,
							//    post: this.post,
							//    onload: function () {
							//        console.log('MORE', this.data, this.items);
							//        if (this.data) {
							//            for (var i = 0, item; item = this.data[i]; i++) {
							//                if (!api.item[item.id]) api.item[item.id] = Aim.get(item);
							//                else for (var name in item) api.item[item.id][name] = api.item[item.id][name] || item[name];
							//                api.item[item.id].refresh();
							//                if (this.items.indexOf(api.item[item.id]) === -1) this.items.push(api.item[item.id]);
							//            }
							//            this.OM.show();
							//        }
							//    }
							//});
							event.preventDefault();
						};
						//var alid = get.lid.split(';');
						if (alid.length > 3) {
							//console.log('LV items', Listview.items);
							//if (!Listview.items.length) {
							//    if (!Listview.Aim.loadmore) {
							//        Listview.Aim.loadmore = true;
							//        OM.load({ msg: 'Loading more items', post: { exec: 'itemItemsGet', id: get.lid, where: '', q: OM.elInputZoek.value }, item: Listview, onload: this.onloadItems });
							//        //OM.show({ lid: get.lid, where: '', q: OM.elInputZoek.value });
							//    }
							//}
							//else
							this.elMeer = Listview.elItems.appendTag('li', {
								className: 'itemrow zoekverder', innerText: 'Zoek verder buiten het filter',
								post: { exec: 'itemItemsGet', classID: alid[1], q: OM.elInputZoek.value },
								items: this,
								onclick: onclick,
							});
						}
						//else this.elMeer = Listview.elItems.appendTag('li', {
						//	className: 'itemrow zoekverder', innerText: 'Zoek verder buiten de organisatie',
						//	post: { exec: 'itemItemsGet', classID: alid[1], keyID: 1, q: OM.elInputZoek.value }, items: this, onclick: onclick,
						//});
					}
					//.appendTag('a', { innerText: 'Meer', href: '#q=' + OM.elInputZoek.value + '&lid=;' + alid[1] });
					//for (var i = 0; i < 9; i++) Listview.elItems.appendTag('li', { className: 'itemrow ghost', ghost: 1 });
				}
				for (var i = 0; i < 10; i++) {
					if (!Listview.elItems.children[i] || Listview.elItems.children[i].offsetTop) break;
				}
				//Listview.elItems.style = 'min-height:' + (Listview.items.length / i * 72) + 'px;';
				Listview.elItems.style = 'padding-bottom:' + ((Listview.items.length - this.iCreate) / i * 72) + 'px;';
				//console.log(i, Listview.items.length, Listview.items.length / i * 72);
				if (Aim.pageItem && Aim.pageItem.elLvLi) Aim.pageItem.elLvLi.setAttribute('selected', '');
				//Listview.elItems.style = '';
				//setTimeout(function () {
				//    console.log('WRITEITEMS', Listview.elItems.lastChild.offsetHeight,Listview.elItems.lastChild.offsetTop, Listview.elItems.childElementCount, Listview.items.length, Listview.elOa.scrollTop + Listview.elOa.clientHeight + 80);
				//    Listview.elItems.style = 'min-height:' + (Listview.elItems.lastChild.offsetTop / Listview.elItems.childElementCount * Listview.items.length) + 'px;';
				//    console.log('WRITEITEMS', Listview.elItems.lastChild.offsetTop, Listview.elItems.childElementCount, Listview.items.length, Listview.elOa.scrollTop + Listview.elOa.clientHeight + 80);
				//}, 10);
				//console.log('WRITEITEMS', i, Listview.elItems.lastChild.offsetTop, Listview.elItems.childElementCount, Listview.items.length, Listview.elOa.scrollTop + Listview.elOa.clientHeight + 80);
			}
		},
		init: function (get) {
			Object.assign(this, get);
			this.refilter();
		},
		sortby: function (sortname) {
			this.sortdir = this.sortname == sortname ? -this.sortdir : 1;
			this.sortname = sortname;
			console.log(this.sortdir, this.sortname, this.btns.sort);
			this.btns.sort.className = this.sortdir == 1 ? '' : 'asc';
			this.items.sort(function (a, b) {
				return this.sortdir * String(a[this.sortname]).localeCompare(String(b[this.sortname]), {}, 'numeric');
			}.bind(this));
			this.refilter();
			//this.show();
		},
		show: function (items) {
			this.items1 = this.items = items || this.items;
			//console.log('show', items, Listview.items);
			if (!this.get.id) this.data[this.get.title] = this.items;
			//if (Number(this.get.folder) && !this.items.length) {
			//	console.log('PPPPPPPPPPPPPP', this.get.folder, get);
			//	Aim.URL.set({ schema: 'item', id: Number(this.get.folder) });
			//}



			//MKAN
			//if (this.items.length && Aim.OM) Aim.URL.set({ schema: this.items[0].schema, id: Number(this.items[0].id) });


			//this.items = items || this.items || [];
			//this.title = title || this.title;
			//this.forEach(function (row) { console.log(row.title); });

			//OM.show({ bv: 0 });
			if (window.aThree && window.aThree.initdone) return;
			//console.log('SHOW', this);
			//OM.elInputZoek.value = decodeURI(this.q || '');
			//if (this.afilter) this.refilter();
			//this.items = listitems || this.items;
			this.elMeer = null;
			this.filter = {};

			var item = api.item[this.get.folder];

			//if (item) console.log('DDDDDDDDDDD', this.get.folder, item.masterID, item.srcID);
			//console.log('this.childClasses', this.childClasses, this);
			this.btns = {
				filter: { title: 'Lijst filteren', onclick: function () { OM.show({ flt: get.flt ^= 1 }); } },
				//sort: { title: 'Lijst sorteren', onclick: function () { } },
				//printmenu : { menu: this.printmenu, onclick: Aim.popup.show },
				add: this.childClasses && this.childClasses.length > 1 ? {
					title: 'Nieuw item toevoegen op deze locatie', popupmenu: (function (childClasses) {
						for (var i = 0, childclass; childclass = childClasses[i]; i++) {
							//var schema = api.definitions[className];
							console.log(childclass);
							//if (!schema) return;
							//var menuitem = menuitems[className] = { title: schema.title || className };
							////var childclass = childClasses[name];
							////schema.title = schema.title || className;
							////if (item) menuitem.masterID = item.id;
							////menuitem.onclick = api.definitions.item.add.bind({ schema: className, srcID: childclass.scrID, masterID: childclass.masterID, });
							childclass.onclick = api.definitions.item.add.bind({ schema: childclass.schema || childclass.title, masterID: item ? item.id : null });
							//if (item && item.schema == name) childClasses["Typical"] = { schema: "System", srcID: item.scrID }
						}
						//console.log('childClasses', childClasses);
						return childClasses;
					})(this.childClasses)
				} : {
					title: 'Nieuw item toevoegen', onclick: api.definitions.item.add.bind(this)
				},
				refresh: {
					title: 'Gegevens vernieuwen', attr: { rotate: '' }, onclick: function () {
						console.log('VERNIEUWEN', get, collist.loadget);
						Aim.load({
							get: { folder: get.folder, filter: get.filter || '', child: 1 }, onload: function (event) {
								console.log('VERNIEUWEN DATA', this.src, event.data);
								Listview.show(event.data.value);
							}
						});
					}.bind(this)
				},
				title: { innerText: document.body.getAttribute('title') + ' (' + this.items.length + ')' },

				download: {
					title: 'Download', className: 'r', popupmenu: {
						toexcel: {
							title: 'Excel', onclick: function () {
								var wb = XLSX.utils.book_new();
								wb.Props = {
									Title: "Aliconnect Export",
									Subject: "Export",
									Author: "Aliconnect",
									CreatedDate: new Date()
								};
								var sheetname = "Export";
								wb.SheetNames.push(sheetname);
								var row = 'Title,Subject,Summary'.split(',');
								for (var attributeName in Aim.collist.filter) row.push(attributeName);
								row.push('ID');
								var ws_data = [row];
								for (var i = 0, row; row = Aim.collist.itemsVisible[i]; i++) {
									var xlsrow = [row.title, row.subject, row.summary];
									for (var attributeName in Aim.collist.filter) xlsrow.push(row.filterfields && row.filterfields[attributeName] ? row.filterfields[attributeName] : '');
									xlsrow.push(row.id);
									ws_data.push(xlsrow);
								}
								var ws = XLSX.utils.aoa_to_sheet(ws_data);
								wb.Sheets[sheetname] = ws;
								var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
								function s2ab(s) {
									var buf = new ArrayBuffer(s.length);
									var view = new Uint8Array(buf);
									for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
									return buf;
								}
								saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'AliconnectExport.xlsx');
							}
						}
					}
				},
				sort: {
					title: 'Menu Opties sorteren openen', popupmenu: {
						title: { title: 'Title', onclick: function () { this.sortby('title'); }.bind(Aim.collist) },
						subject: { title: 'Onderwerp', onclick: function () { this.sortby('subject'); }.bind(Aim.collist) },
						summary: { title: 'Samenvatting', onclick: function () { this.sortby('summary'); }.bind(Aim.collist) },
						endDT: { title: 'Deadline', onclick: function () { this.sortby('endDT'); }.bind(Aim.collist) },
					}
				},
				view: {
					title: 'Menu Opties weergeven openen', className: collist.getAttribute('view'), popupmenu: {
						//list: { title: 'Lijst', },
						rows: { title: 'Lijst', onclick: function () { this.displaytype = ''; collist.setAttribute('view', 'rows'); this.rewrite(); }.bind(this) },
						table: { title: 'Tabel', onclick: function () { this.displaytype = 'table'; collist.setAttribute('view', 'table'); this.rewrite(); }.bind(this) },
						cols: { title: 'Tegels', onclick: function () { this.displaytype = ''; collist.setAttribute('view', 'cols'); this.rewrite(); }.bind(this) },
						maps: { title: 'Google Maps', hidden: true, onclick: function () { this.displaytype = 'maps'; this.rewrite(); }.bind(this) },
						ganth: { title: 'Ganth chart', hidden: true, onclick: function () { Aim.Ganth.create(collist.appendTag('div', { className: 'row abs ganth' }), this.items) }.bind(this) },
						chart: { title: 'Grafiek', hidden: true, onclick: function () { this.displaytype = 'chart'; this.rewrite(); }.bind(this) },
						calendar: { title: 'Calender', hidden: true, onclick: function () { Aim.Calendar.create(collist.appendTag('div', { className: 'row abs calendar' }), this.items); }.bind(this) },
						//flowchart: { title: 'Flow', },
						model: { title: 'Relationeel model', hidden: true, onclick: function () { this.displaytype = 'go'; this.rewrite(); }.bind(this) },
						model2d: {
							title: 'Toon 2D Overzicht',
							//get hidden() {
							//	var item = Aim.itemPage;
							//	return !item || !item.attributes || !item.attributes.x || !item.attributes.y || !item.attributes.z || !(item.attributes.x.value || item.attributes.y.value || item.attributes.z.value);
							//},
							onclick: function () { Aim.itemPage.model2d(); }
						},
						model3d: {
							title: 'Toon 3D Model',
							//get hidden() {
							//	var item = Aim.itemPage;
							//	return !item || !item.attributes || !item.attributes.x || !item.attributes.y || !item.attributes.z || !(item.attributes.x.value || item.attributes.y.value || item.attributes.z.value);
							//},
							onclick: function () { Aim.itemPage.model3d(); }
						},



					}
				},
			};
			if (this.get.function && this.get.folder && api.definitions[this.get.folder] && api.definitions[this.get.folder][this.get.function]) api.definitions[this.get.folder][this.get.function](this.items);

			this.items.sort(function (a, b) { return a.idx > b.idx ? 1 : a.idx < b.idx ? -1 : 0; });
			for (var i = 0, row; row = this.items[i]; i++) {
				if (row.endDT && row.startDT) this.btns.view.popupmenu.ganth.hidden = this.btns.view.popupmenu.calendar.hidden = false;
				if (row.datachart && row.datachart.value) this.btns.view.popupmenu.chart.hidden = false;
				if (row.geolocatie) this.btns.view.popupmenu.maps.hidden = false;
				if (row.label && row.category && row.value) this.btns.view.popupmenu.chart.hidden = false;
				if (row.title && row.linkto) this.btns.view.popupmenu.model.hidden = false;
				row.writeitem = row.writeitem || api.definitions.item.writeitem;
				row = this.items[i] = Aim.get(row);
				row.filterfields = row.filterfields || {};
				//row.class = api.definitions[api.find(row.classID)];
				if (row.state && row.fields && row.fields.state && row.fields.state.options && row.fields.state.options[row.state]) row.stateColor = row.fields.state.options[row.state].color;
				//this.iconsrc = (this.files && this.files.avalue && this.files.avalue[0]) ? this.iconsrc = files.avalue[0].src : (this.class && this.class.className ? apiroot + 'img/icon/' + this.class.className + '.png' : '');
				//App.listitem.call(row);
				var cfgclass = api.definitions[api.find(row.classID)], filterfields = {};
				row.filtervalues = [];
				for (var attributeName in row.filterfields) {
					var fieldtitle = attributeName;
					if (cfgclass && cfgclass.fields && cfgclass.fields[attributeName]) var fieldtitle = cfgclass.fields[attributeName].title || cfgclass.fields[attributeName].placeholder || attributeName;
					row.filtervalues.push(row.filterfields[attributeName]);
					var value = String(row.filterfields[attributeName]).trim().toLowerCase();
					filterfields[attributeName] = value;
					if (!this.filter[attributeName]) this.filter[attributeName] = { values: [], avalues: [], title: fieldtitle };
					this.filter[attributeName].values[value] = { value: value, title: row.filterfields[attributeName], checked: false }
				};
				row.filterfieldslower = filterfields;
			}
			if (this.displaytype == 'chart' && this.btns.chart.disabled) this.displaytype = '';
			this.afilter = [];
			for (var attributeName in this.filter) {
				for (var fieldvalue in this.filter[attributeName].values) this.filter[attributeName].avalues.push(this.filter[attributeName].values[fieldvalue]);
				this.filter[attributeName].name = attributeName;
				this.afilter.push(this.filter[attributeName]);
			};
			if (get.f) Listview.flt = Aim.Object.parse(get.f);
			for (var attributeName in Listview.flt) {
				if (!(attributeName in this.filter)) delete Listview.flt[attributeName];
				else {
					for (var i = 0, val; val = Listview.flt[attributeName][i]; i++) if (!(val in this.filter[attributeName].values)) {
						Listview.flt[attributeName].splice(Listview.flt[attributeName].indexOf(val), 1);
						i--;
					}
					if (!Listview.flt[attributeName].length) delete Listview.flt[attributeName];
				}
			}
			this.idxstart = 0;
			//this.sort();
			//console.log(this.afilter);
			//Listview.items = this;
			//console.log('SHOW ITEMS',this);
			//this.sort(this.sortlist);
			//console.log('SHOW LIST ',this);

			this.afilter.sort(function (a, b) { return a.name.localeCompare(b.name, {}, 'numeric'); });
			this.refilter();
		},
		sortlist: function (a, b) {
			//console.log('SORT',a, b);
			if (a.masterID && b.masterID && a.masterID == b.masterID) {
				if (a.idx < b.idx) return -1;
				if (a.idx > b.idx) return 1;
				return 0;
			}
			if (a.prio && b.prio && a.prio < b.prio) return -1;
			if (a.prio && b.prio && a.prio > b.prio) return 1;

			if (a.finishDT && !b.finishDT) return 1;
			if (!a.finishDT && b.finishDT) return -1;
			if (a.finishDT && b.finishDT) {
				if (a.finishDT < b.finishDT) return -1;
				if (a.finishDT > b.finishDT) return 1;
			}

			if (a.fav && !b.fav) return -1;
			if (!a.fav && b.fav) return 1;

			//console.log(a, b);

			if (a.lastvisitDT && !b.lastvisitDT) return -1;
			if (!a.lastvisitDT && b.lastvisitDT) return 1;
			if (a.lastvisitDT && b.lastvisitDT) {
				if (a.lastvisitDT.substr(0, 10) < b.lastvisitDT.substr(0, 10)) return -1;
				if (a.lastvisitDT.substr(0, 10) > b.lastvisitDT.substr(0, 10)) return 1;
			}

			if (a.accountprice && !b.accountprice) return -1;
			if (!a.accountprice && b.accountprice) return 1;

			//if (sortname) {
			//    if (a[sortname].value < b[sortname].value) return -1;
			//    if (a[sortname].value > b[sortname].value) return 1;
			//}

			//if (a.endDT && !b.endDT) return -1;
			//if (!a.endDT && b.endDT) return 1;
			if (a.endDT && b.endDT) {
				if (a.endDT < b.endDT) return -1;
				if (a.endDT > b.endDT) return 1;
			}

			//if (a.startDT && !b.startDT) return 1;
			//if (!a.startDT && b.startDT) return -1;
			if (a.startDT && b.startDT) {
				if (a.startDT < b.startDT) return -1;
				if (a.startDT > b.startDT) return 1;
			}

			//if (a.lastvisitDT && b.lastvisitDT) {
			//    if (a.lastvisitDT < b.lastvisitDT) return -1;
			//    if (a.lastvisitDT > b.lastvisitDT) return 1;
			//}

			if (a.searchname && b.searchname) {
				var awords = a.searchname.match(/\w+/g),
					bwords = b.searchname.match(/\w+/g),
				ia = 999,
				ib = 999,
				l = OM.elInputZoek.value.length;
				for (var i = 0, word; word = awords[i]; i++) {
					//console.log(word);
					if (word.indexOf(OM.elInputZoek.value) != -1) ia = Math.min(ia, word.indexOf(OM.elInputZoek.value) + word.length - l);
					//var pos = word.indexOf(OM.elInputZoek.value);
					//ia -= pos != -1 ? l + word.length - pos : 0;
				}
				for (var i = 0, word; word = bwords[i]; i++) {
					//console.log(word);
					if (word.indexOf(OM.elInputZoek.value) != -1) ib = Math.min(ib, word.indexOf(OM.elInputZoek.value) + word.length - l);
					//var pos = word.indexOf(OM.elInputZoek.value);
					//ib -= pos != -1 ? l + word.length - pos : 0;
					//ib += word.length - l + (pos != -1 ? pos - l : 0);
					//ib += pos != -1 ? pos : word.length;
					//ib += word.indexOf(OM.elInputZoek.value) || word.length;
				}
				//console.log(a, a.searchname, ia, b, b.searchname, ib);

				//var ia = a.searchname.indexOf(OM.elInputZoek.value);
				//var ib = b.searchname.indexOf(OM.elInputZoek.value);
				//if (ia == -1 && ib != -1) return 1;
				//if (ia != -1 && ib == -1) return -1;
				if (ia < ib) return -1;
				if (ia > ib) return 1;
			}
			return 0;
		},
		appendListitem: function (row) {
			if (Listview.elItems) {
				//if (row.fields.state) itemmenu.state = {
				//    title: 'Status',
				//    menu: row.fields.state.options
				//}
				return row.elLvLi = Listview.elItems.appendTag('li', {
					draggable: true,
					contextmenu: Aim.popupmenuitems(row),
					//oncontextmenu: Aim.popup.show,
					//attr: function (row) {
					//	var res = {};
					//	if (Aim.fav && Aim.fav[row.id]) res.Fav = 1;
					//	if (row.fields && row.fields.state) res.state = row.fields.state.value;
					//	//if (row.srcID) res.derived = '';
					//	return res;
					//}(row),
					userID: row.userID || '0',
					level: row.level || '0',
					select: function () {
						if (!this.innerText) Listview.writeitem(this, this.item);
						Aim.Element.scrollIntoView(this);//.scrollIntoViewIfNeeded(false);
						if (this.item.elListBody) this.item.elListBody.click();
					},
					//onclick: this.click,
					//ondblclick: function () {
					//	console.log('DBL CLICK');
					//	Aim.URL.set({folder:this.id,child:1,});
					//	//OM.show({ lid: this.item.id, q: '*', search: '' });
					//}.bind(this),
					item: row,
					//itemID: row.id,
					className: row.id,
					//writeElement: row.writeElementRow,
					rewrite: function () {
						//console.log('REWRITE FUNCTIE');
						this.item.writeitem(this, this.item);
					},
				});
			}
		},
		clickfilter: function () {
			Listview.items = Listview.items1;
			//console.log('clickfilter', Listview.items, Listview.items1);
			if (!(this.name in Listview.flt)) Listview.flt[this.name] = [];
			var idx = Listview.flt[this.name].indexOf(this.value);
			if (idx == -1) Listview.flt[this.name].push(this.value); else Listview.flt[this.name].splice(idx, 1);
			if (Listview.flt[this.name].length == 0) delete Listview.flt[this.name];
			//console.log('FLTR', this.items.flt);
			//console.log(this.flt);
			get.f = Aim.Object.stringify(Listview.flt);
			window.history.pushState('page', 'PAGINA', '?' + Aim.URL.stringify(get));
			Listview.refilter();
		},
		refilter: function () {
			//console.log('refilter', Listview.items)
			//Aim.setfocus(collist);
			if (window.collist) with (collist) {
				innerText = '';
				var get = Aim.URL.parse();
				Aim.createButtonbar(appendTag('div'), this.btns);
				//with (this.elTop = appendTag('div', { className: "row top btnbar np", })) {
				//	appendTag('a', { className: 'abtn icn filter', title: 'Lijst filteren', onclick: function () { OM.show({ flt: get.flt ^= 1 }); } });
				//	var get = Aim.URL.parse();
				//	appendTag('span', { className: 'aco', innerText: decodeURI(this.get.title) });
				//	var btns = {};
				//	btns.refresh = { title: 'Lijst verversen', attr: { rotate: '' }, href: '#lid=' + get.lid };
				//	btns.sort = { title: 'Lijst sorteren', onclick: function () { } };
				//	btns.toexcel = {
				//		tag: 'a', title: 'Naar Excel', download: "list.xls", href: "#", onclick: function () {
				//			a = [[{ value: 'name', style: 'background:#EEE;' }, { value: 'subject', style: 'background:#EEE;' }, { value: 'summary', style: 'background:#EEE;' }]];
				//			for (var i = 0, row; row = Listview.api.item[i]; i++) a.push([{ value: row.title }, { value: row.subject }, { value: row.summary }]);
				//			return xls.arraytoexcel(this, a, 'List');
				//		}
				//	};
				//	if (this.parent) this.aId = String(this.parent.id).split(';');
				//	//console.log('LISTSSSS', this, this.item, get.lid);
				//	//this.childclassID = (this.item && this.item.classID && api.definitions[api.find(this.item.classID)].childClasses) ? api.definitions[api.find(this.item.classID)].childClasses[0] : get.lid ? get.lid[1] : null;
				//	//if(get.lid && get.lid.split(';')[1]=='')
				//	//if (this.childclassID)
				//	btns.add = { title: 'Nieuw item toevoegen', caller: this, onclick: collist.item.add }
				//	if (this.printmenu) btns.printmenu = { menu: this.printmenu, onclick: Aim.popup.show }
				//	//else btns.printmenu = {
				//	//    onclick: function () {
				//	//        if (!items.printdoc) OM.printdoc = document.body.appendTag('div');
				//	//        Listview.writeitems(true);
				//	//        OM.printdoc.className = 'col aco printablediv';
				//	//        OM.printdoc.innerHTML = Listview.elOa.innerHTML;
				//	//        window.print();
				//	//    }
				//	//}
				//	if (this.btns) {
				//		if (this.btns.btnGanth) btns.ganth = { title: 'Ganth planning view', onclick: function () { this.displaytype = 'ganth'; this.rewrite(); }.bind(this) }
				//		if (this.btns.btnGanth) btns.calendar = { title: 'Calender view', onclick: function () { this.displaytype = 'calander'; this.rewrite(); }.bind(this) }
				//		//if (this.btns.btnGanth) btns.calendar = { title: 'Calender view', item: this, par: { lv: 'cal' }, onclick: Aim.Element.onclick }
				//		if (this.btns.btnChart) btns.chart = { title: 'Chart view', par: { lv: 'chart' }, onclick: function () { this.displaytype = 'chart'; collist.setAttribute('view', 'chart'); this.rewrite(); } }
				//		if (this.btns.btnFlowChart) btns.flowchart = { title: 'Flowchart view', item: this, par: { lv: 'flowchart' }, onclick: Aim.Element.onclick }
				//		if (this.btns.btnMaps) btns.maps = { title: 'Weergave Google maps', onclick: function () { this.displaytype = 'maps'; this.rewrite(); } };
				//	}
				//	btns.rows = { title: 'Weergave regels', items: this, onclick: function () { this.displaytype = ''; collist.setAttribute('view', 'rows'); this.rewrite(); } };
				//	btns.cols = { title: 'Weergave tegels', items: this, onclick: function () { this.displaytype = ''; collist.setAttribute('view', 'cols'); this.rewrite(); } };
				//	for (var btName in btns) { var bt = btns[btName]; bt.className = 'abtn icn ' + btName; appendTag('a', bt); }
				//}
				//console.log('TEST', Listview);
				with (this.elContent = appendTag('div', { className: "row aco" })) {
					this.elFilter = appendTag('ul', { className: "col afilter liopen np noselect", onclick: function (event) { document.body.setAttribute('ca', 'lvfilter'); } });
					this.elOa = appendTag('div', { className: "col aco oa" });
				}
			}
			for (var attributeName in this.filter) {
				this.filter[attributeName].cnt = 0;
				this.filter[attributeName].checked = false;
				for (var fieldvalue in this.filter[attributeName].values) {
					var field = this.filter[attributeName].values[fieldvalue];
					field.cnt = 0;
					field.checked = Listview.flt && Listview.flt[attributeName] && Listview.flt[attributeName].indexOf(fieldvalue) > -1;
					this.filter[attributeName].checked = this.filter[attributeName].checked || field.checked;
				}
			}
			//console.log(Listview.flt, Listview.items);
			for (var i = 0, row; row = Listview.items[i]; i++) {
				row.hidden = false;
				for (var attributeName in Listview.flt) {
					if (!(attributeName in row.filterfieldslower) || Listview.flt[attributeName].indexOf(row.filterfieldslower[attributeName]) == -1) { row.hidden = true; break; }
				}
				//console.log(row.hidden);
				//if (OM.elInputZoek.value && row.name.indexOf(OM.elInputZoek.value)==-1) row.hidden = true;
			}
			//console.log('ELFILTER');
			this.rewrite();
			if (this.elFilter) with (this.elFilter) {
				innerText = '';
				//for (var attributeName in this.filter) {
				//    var filterfield = this.filter[attributeName];
				//console.log(this.afilter);
				for (var ii = 0, filterfield; filterfield = this.afilter[ii]; ii++) {
					//var attributeName = filterfield.name;
					with (filterfield.elLi = appendTag('li', { className: 'col', attr: { cnt: filterfield.cnt || 0, checked: filterfield.checked || 0, open: filterfield.open = Listview.filtersopen[filterfield.name] || filterfield.checked || 0 }, })) {
						appendTag('a', { className: 'row', f: filterfield, attributeName: filterfield.name, onclick: function (event) { this.f.elLi.setAttribute('open', this.f.open ^= 1); Listview.filtersopen[this.attributeName] = this.f.open; } }).appendTag('span', { className: 'aco', innerText: filterfield.title, });
						with (appendTag('ul', { attr: { checked: filterfield.checked || 0, meer: filterfield.meer || 0 } })) {
							filterfield.avalues.sort(App.sort.filter);
							var ic = 0;
							for (var i = 0, field; field = filterfield.avalues[i]; i++) {
								//console.log(field);
								if (!field.title) continue;
								if (filterfield.checked || field.checked || field.cnt) {
									if (field.checked) filterfield.elLi.setAttribute('open', filterfield.open = 1);
									var dragover = function (event) {
										event.dataTransfer.dropEffect = 'move';
										event.stopPropagation();
										event.preventDefault();
									};
									var drop = function (event) {
										console.log(this.filterfield, this.field, Aim.dragdata.item, event);
										var par = {};
										par[this.filterfield.name] = this.field.title;
										if (Aim.dragdata.item) Aim.dragdata.item.set(par);
									};
									with (appendTag('li', { className: 'row', filterfield: filterfield, field: field, ondragover: dragover, ondrop: drop })) {
										field.elInp = appendTag('input', { attr: { value: field.value }, name: filterfield.name, type: 'checkbox', id: filterfield.name + field.value + i, checked: field.checked, onclick: this.clickfilter });
										appendTag('label', { className: 'aco', innerText: field.title, title: field.title, attr: { for: filterfield.name + field.value + i } });
										appendTag('span', { innerText: ' (' + field.cnt + ')' });
										ic++;
									}
								}
							}
							if (ic > 5) appendTag('li', { className: 'meer', group: filterfield, event: { click: function () { with (this.parentElement) setAttribute('meer', this.group.meer ^= 1) } } });
						}
					}
				}
			}
		}
	},
	popupmenuitems: function (item) {
		var itemmenu = Aim.menuitems;
		if (item.attributes && item.attributes.state && item.attributes.state.options) {
			item.attributes.state.options.onclick = function () {
				console.log('SET STATE', this.item);
				this.item.set({ state: Aim.Object.findFieldValue(this.item.attributes.state.options, 'title', this.menuitem.title) });
			};

			itemmenu.state.menu = item.attributes.state.options;
		}
		return itemmenu;
	},

	App: App = {
		msg: msg = elementMessage = {
			row2item: function (row) {
				var item = JSON.parse(row.obj || '{}');
				delete row.obj;
				for (var attr in row) item[attr] = row[attr];
				return item;
			},

			items: [],
			onload: function () {
				this.elMsgPopup = document.body.appendTag('div', { className: "amsg", onclick: function () { msg.btnMsg.click(); } });
				msg.check();
			},
			setcnt: function (e, cnt) {
				if (!e) return;
				if (!e.elCnt) e.elCnt = e.appendTag('span', { className: 'cnt' });
				e.setAttribute('cnt', cnt);
				e.elCnt.innerText = (Number(cnt)) ? cnt : '';
			},
			write: function () {
				if (!msg.elMsgPopup) return;
				msg.elMsgPopup.innerText = '';
				//if (!msg.itemsNew[0]) return;
				msg.loaded = false;
				//var itemsupdate = [];
				//for (var i = 0, row; row = msg.itemsNew[i]; i++) itemsupdate[row.itemID] = true;
				//forEach(itemsupdate, function (row, i, itemID) {
				//    if (itemID == get.id || (items[get.id] && itemID == items[get.id].detailID)) { items[get.id].btnMsg.click(); }
				//});
				//if (!msg.itemsNew[0].subject) return;
				//console.log(msg.items);
				//var lastAim.messenger = msg.items[msg.items.length - 1];
				msg.elMsgPopup.appendTag('div', { innerHTML: msg.newItem.name + '<small><br>' + msg.newItem.subject + '<br>' + msg.newItem.modifiedDT + '</small>' });
				msg.elMsgPopup.setAttribute('show', '');
				msg.newItem = null;
				OM.play('/wav/Windows Notify Email.wav').then(function () { console.log('PLAYING'); }, function () { console.log('NOT PLAYING'); });
				setTimeout(function () { msg.elMsgPopup.innerText = ''; }, 7000);
				//Aim.audio.autoplay = false;
				//setInterval(function () {
				//    console.log('PLAY');

				//    OM.play("http://localhost/wav/Windows Notify Email.wav").then(function () {
				//        console.log('PLAYING');
				//    },function () {
				//        console.log('NOT PLAYING');
				//    });
				//}, 3000);

			},
			checkonload: function () {
				msg.busy = false;
				if (this.data && this.data.set && this.data.set[0] && this.data.set[0][0]) {
					for (var i = 0, row; row = this.data.set[0][i]; i++) {
						row = msg.row2item(row);
						if (msg.items.indexOf(items[row.id]) == -1) {
							msg.items.push(OM.get(row));
							if (Number(row.new)) msg.newItem = items[row.id];
						}
						//console.log(row);
						//if (Number(row.new)) msg.newItem = items[row.id];
					}
					//msg.cnt = (this.data && this.data.set && this.data.set[0]) ? this.data.set[0][0].cnt : 0;
					msg.setcnt(msg.btnMsg, msg.items.length);
					//msg.itemsNew = this.data.set[1];
				}
				//console.log('MSG CHECK', this.data, msg.newItem, msg.items);
				//msg.to = setTimeout(function () { msg.busy = false; msg.check(); }, 10000);
			},
			check: function (force) {
				if (msg.busy) return;
				clearTimeout(msg.to);
				//console.log(msg.to);
				msg.busy = true;
				if (msg.elMsgPopup) msg.elMsgPopup.removeAttribute('show');
				//Aim.load({ msg: 'Message state', nowait: true, post: { exec: 'msgGet', a: 'check', all: msg.items ? 0 : 1 }, onload: this.checkonload });
				Aim.load({
					msg: 'Message state',
					nowait: true,
					api: 'message/check',
					get: { all: msg.items ? 0 : 1 },
					onload: this.checkonload
				});
				msg.items = msg.items || [];
			},
			submit: function (event) {
				if (event) event.preventDefault();
				//console.log('SUBMIT',this.files);
				Aim.load({
					api: 'message', get: { id: this.itemID = this.item.detailID || this.item.itemID || this.item.id, from: Aim.userName },
					put: {
						Subject: this.item.name,
						description: this.item.subject,
						summary: this.item.summary,
						Hostname: Aim.client.domain.name,
						from: Aim.userName,
						msgs: [{
							name: this.item.name,
							content: this.elMsg.value,
							href: Aim.origin + '/?msg=1&id=' + this.itemID,
							files: this.files ? this.files : '',
						}]
					},
					item: this.item,
					onload: function () {
						console.log('MSG', this.responseText, this.get, this.put);
						if (this.item.users) Aim.wss.send({
							to: this.item.users, Notification: {
								title: this.put.Subject, options: {
									body: "Bericht geplaatst door " + this.get.from,
									url: "https://aliconnect.nl/tms/app/om/#id=" + this.get.id,
									//icon: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
									//image: "https://aliconnect.nl/sites/aliconnect/shared/611/2776611/8ACC0C4510E447A6A46496A44BAA2DA4/Naamloos300x225.jpg?2018-10-01T11:50:14.594Z",
									data: { href: '#?id=' + this.get.id },
								}
								//api: this.api, get: this.get, put: this.put
							}
						});
						//if (window.node) window.node.send({ msgitemID: this.item.itemID });
						console.log('MSG', this);
						msg.itemrefresh.call(this.item);
					}
				});
				console.log(this);
				this.elMsg.value = elMsgTextarea.value = elMsgTextarea.style = this.elImages.innerText = this.elAttach.innerText = '';
			},
			itemrefresh: function () {
				//console.log('MSG.ITEMS', msg, msg.items);

				if (msg.items.length) {
					for (var i = 0, omsg; omsg = msg.items[i]; i++) if (omsg.itemID == this.itemID) { msg.items.splice(i, 1); break; }
					msg.setcnt(msg.btnMsg, msg.items.length);
				}
				Aim.load({
					//msg: 'Refresh messages ' + this.title,
					item: this,
					api: 'message',
					get: { id: this.id },
					//post: {
					//    exec: 'msgGet', a: 'get', id: this.item.id
					//},
					onload: function () {
						console.log('REFRESG', this.data);
						elementMessage.setcnt(this.item.btnMsg, this.data.set[0].length);
						with (this.item.elMsg) if (this.data && this.data.set && this.data.set[0]) {
							console.log('MSGS', this.src, this.data);
							innerText = '';
							appendTag('h2', { innerText: 'Berichten' });
							tToday = aDate();
							tToday.setHours(0, 0, 0, 0);
							tToday.toLocal();
							var s = { time: '', date: '', from: '' };
							var sLastTime, sLastDate, FromName = '', lastEl = null, sl1 = '';
							for (var i = 0, row; row = this.data.set[0][i]; i++) {
								//row.createdDT = row.createdDT.substr(0, 10) + 'T' + row.createdDT.substr(11, 8);
								var tSend = aDate(row.createdDT);
								sSendDate = tSend.toDateText();
								//console.log('MSG', row);
								tSend.toLocal();
								sSendTime = tSend.toISOString().substr(11, 5);
								var a = [];
								if (s.from != row.FromName) a.push(row.FromName);
								if (s.date != sSendDate) a.push(sSendDate);
								//if (s.time != sSendTime) a.push(sSendTime);
								//if (s.from != row.FromName) a.push(row.FromName);
								s = { time: sSendTime, date: sSendDate, from: row.FromName };
								//var sl = [row.FromName, sSendDate, sSendTime].join(' ');
								//if (sl1 != sl2) { sl1 = sl2; }
								var isuser = row.FromId == Aim.client.user.id;
								//if (sLastTime != sSendTime || sLastDate != sSendDate) appendTag('div', { className: 'sender u' + isuser, innerText: sLastTime });
								//if (sLastDate != sSendDate) { appendTag('h3', { innerText: sSendDate }); sLastTime = null; }
								//if (sLastDate != sSendDate) { sSendTime = sSendDate + ' ' + sSendTime; sLastDate = sSendDate; sLastTime = null; }
								//console.log(row.FromName, FromName);
								//if (row.FromName != FromName) {
								//    sSendTime = row.FromName + ' ' + sSendTime;
								//    //if (!isuser && row.FromName != FromName) appendTag('h3', { innerText: row.FromName }); //sSendTime += ' ' + row.FromName;
								//    FromName = row.FromName;
								//}
								//sLastTime = sSendTime;
								//sLastDate = sSendDate;
								with (lastEl = appendTag('pre', { row: row, className: 'notitie u' + isuser })) {
									appendTag('button', {
										type: 'button', className: 'abtn icn close abs', onclick: function (event) {
											Aim.load({
												method: 'delete',
												api: 'message',
												get: { aid: row.aid },
												msg: 'Delete messages '.name,
												//post: { exec: 'msgGet', a: 'del', aid: row.aid }
											});
											this.parentElement.parentElement.removeChild(this.parentElement);
										}
									});
									if (!row.msg) continue;
									row.msg = JSON.parse(row.msg);
									//sl2 = sl.substr(0, sl.length - 1);
									row.msg.msgs.forEach(function (objMsg) {
										//forEach(row.msg.msgs, function (msg, i) {
										console.log(objMsg);
										if (objMsg.files) {
											//msg.value = JSON.stringify(msg.files);
											Object.assign(objMsg, App.files);
											//App.files.call(objMsg);
											objMsg.filesWrite(appendTag('div'));
										}
										with (appendTag('div', { className: 'body' })) {
											if (a[0]) appendTag('div', { className: 'sender', innerText: a.join(', ') });
											appendTag('div', { innerHTML: objMsg.content });
										}
									});
									//appendTag('div', { className: 'sender u' + isuser, innerText: sLastTime });
								}
							}
						}
						//if (lastEl) lastEl.scrollIntoView();
						Aim.Element.scrollIntoView(lastEl);

						//msg.check(true);
					},
				});
			}
		},
		file: {
			isImg: function (ext) { if (ext) return ['jpg', 'png', 'bmp', 'jpeg', 'gif', 'bin'].indexOf(ext.toLowerCase()) != -1; },
			isImgSrc: function (src) {
				if (src) for (var i = 0, ext; ext = ['.jpg', '.png', '.bmp', '.jpeg', '.gif', '.bin'][i]; i++) if (src.toLowerCase().indexOf(ext) != -1) return true;
				return false;
			},
			oisImg: function (ofile) {
				return (ofile.type || '').indexOf('image') != -1 || App.file.isImgSrc(ofile.src)
			},
			onClick: function () {
				//elInpFile = document.body.appendTag('input', { type: 'file', multiple: true, onchange: function () { elInpFile.elAttach.filesUploadAll(this.files); } });
				elInpFile = document.body.appendTag('input', { type: 'file', item: this.item, multiple: true, onchange: function () { App.files.filesUploadAll.call(this.item, this.files); } });
				elInpFile.accept = this.accept;
				elInpFile.elAttach = this.elAttach || OM.pv;
				elInpFile.click();
				document.body.removeChild(elInpFile);
			},
		},
		files: {
			filesSave: function () {
				console.log(this);
				this.files = [];
				var c = this.elImages.getElementsByTagName('IMG');
				for (var i = 0, e; e = c[i]; i++) this.files.push(e.ofile);
				var c = this.elAttach.getElementsByTagName('A');
				for (var i = 0, e; e = c[i]; i++) this.files.push(e.ofile);
				//var item = OM.elItem(this.elFiles); // MVK
				//console.log('SAVE FILE', this.id, this.files);
				Aim.load({
					api: 'item', put: { value: [{ id: this.id, files: this.files }] }, onload: function () {
						//console.log(this.responseText);
					}
				});
				//this.write();
				//if (this.elListBody && this.elListBody.parentElement) this.writeitem(this.elListBody);
			},
			filesNext: function () {
				this.filesSlide(1);
				if (this.slideIdx == 0 && get.pv) {
					//console.log('NEXT PAGE');
				}
			},
			filesSlide: function (step) {
				//var elSlide = this.images[this.slideIdx];
				//if (elSlide) {
				//    if (elSlide.pause) this.elSlide.pause();
				//    elSlide.parentElement.removeAttribute('show');
				//}
				this.images = this.elFiles.getElementsByClassName('aImage');
				//console.log('IMAGES', this.images);
				this.slideIdx += step || 0;
				this.elImages.setAttribute('prev', this.slideIdx > 0);
				this.elImages.setAttribute('next', this.slideIdx < this.images.length - 1);
				//if (this.slideIdx == 0) this.setAttribute('dir', 'r');
				//if (this.slideIdx < 0) this.slideIdx = this.images.length - 1;
				//console.log(this, step, elSlide,this.slideIdx);
				var elSlide = this.images[this.slideIdx];
				if (!elSlide) {
					this.slideIdx = 0;
					var elSlide = this.images[this.slideIdx];
				}
				if (!elSlide) return;
				elSlide.show();
				if (elSlide.play && checkVisible(elSlide)) {
					if (OM.player.elPlaying) items.player.elPlaying.pause();
					elSlide.currentTime = 0;
					//items.player.elPlaying = elSlide;
					elSlide.play();
				}
				//else
				//    items.player.play();
			},
			filesAppend: function (ofile) {
				//console.log(this.edit,this);
				if (!ofile.src) return;
				var ext = ofile.ext = ofile.ext || ofile.src.split('.').pop();
				var fnShow = function () {
					var c = this.parentElement.parentElement.getElementsByClassName('aImage');
					var play = false;
					for (var i = 0, e; e = c[i]; i++) if (e != this) {
						if (e.pause) e.pause();
						e.parentElement.removeAttribute('show');
					}
					this.parentElement.setAttribute('show', '');
				};
				//console.log('OFILE', this, ofile, App.file.oisImg(ofile));
				var el;
				if (['mp4', 'webm', 'mov'].indexOf(ofile.ext.toLowerCase()) !== -1) {
					with (el = this.elImages.appendTag('div', { className: 'row file elplay video', ofile: ofile, files: this })) {
						with (vid = el.elImg = appendTag('video', { className: 'aImage', files: this, src: ofile.src, show: fnShow, attr: { preload: 'auto', poster: ofile.poster, } })) {
							if (!this.elFiles.edit) {
								onclick = ImageSlider.Large;
								el.elImg.playFullscreen = function () {
									if (this.requestFullscreen) {
										this.requestFullscreen();
									} else if (this.mozRequestFullScreen) {
										this.mozRequestFullScreen();
									} else if (this.webkitRequestFullscreen) {
										this.webkitRequestFullscreen();
									}
								};
								onended = function (event) {
									OM.player.elPlaying = null;
									this.files.next(1);
									OM.player.play(this);
								};
								onplaying = function () {
									OM.player.elPlaying = this;
									this.parentElement.setAttribute('playing', '');
								};
								onpause = function () {
									OM.player.elPlaying = null;
									this.parentElement.removeAttribute('playing', '');
								};
							}
							appendTag('source', { type: 'video/' + ofile.ext.toLowerCase(), src: ofile.src });
							if (ofile.srcmp4) appendTag('source', { type: 'video/mp4', src: ofile.srcmp4 });
						}
						appendTag('button', {
							className: 'btr play', el: el, onclick: function (event) {
								var vid = el.elImg;
								if (vid.currentTime > 0 && !vid.paused && !vid.ended && vid.readyState > 2) {
									vid.pause();
								}
								else {
									var c = document.getElementsByTagName('video');
									for (var i = 0, e; e = c[i]; i++) e.pause();
									vid.play();
								}
							}
						});
						appendTag('button', { className: 'btr maximize', el: el, onclick: function (event) { el.elImg.playFullscreen(); } });
						appendTag('button', { className: 'btr fullsize', el: el, onclick: function (event) { el.setAttribute('fullsize', this.fullsize ^= 1); } });

					}
				}
				else if (App.file.oisImg(ofile)) {
					el = this.elImages.appendTag('div', { className: 'row file elplay', files: this });
					el.elImg = App.elementImage(el.appendTag('img', { className: 'aImage', ofile: ofile }), ofile, this.elFiles.edit);
					el.elImg.show = fnShow;
				}
				else {
					var filename = ofile.src.split('/').pop();
					var ext = ofile.ext || ofile.src.split('.').pop();
					filename = filename.split('_');
					if (filename[0].length == 32) filename.shift();
					filename = filename.join('_');

					el = this.elAttach.appendTag('a', { className: 'row file icn file_' + ext, title: filename, ofile: ofile, files: this, target: 'file' });
					with (el.appendTag('div', { className: 'aco col' })) {
						appendTag('div', { className: '', innerText: ofile.name });
						el.elModDate = appendTag('div', { className: '', innerText: (ofile.lastModifiedDate ? new Date(ofile.lastModifiedDate).toLocaleString() + ' ' : '') + ((ofile.size) ? Math.round(ofile.size / 1000) + 'kB' : '') });
					}

					if (!this.elFiles.edit) {
						if (ofile.fid) {
							var fid = ofile.fid.split('.');
							//this.el.href = encodeURI("https://onedrive.live.com/edit.aspx?auth=1&page=view&id=" + fid[2] + "&cid=" + fid[1]);
							el.href = encodeURI("https://onedrive.live.com/edit.aspx?page=view&resid=" + fid[2] + "&cid=" + fid[1]);
						}
						else
							el.href = ofile.src;

						var pdmenu = {
							verwijderen: {
								title: 'Bijlage verwijderen', el: el, item: this,
								onclick: function (event) {
									//console.log(this,this.item,this.el);
									this.el.parentElement.removeChild(this.el);
									App.files.filesSave.call(this.item);
								}
							},
							bewerken: {
								title: 'Bewerken', hidden: !(['docx', 'doc', 'xlsx', 'xls'].indexOf(ext) != -1),// && Aim.aliconnector && Aim.aliconnector.state == 'online'),
								onclick: function (event) {
									var url = "http://www.alicon.nl" + ofile.src;

									console.log('OPEN', url);
									Aim.wss.send({ to: { deviceUID: Aim.deviceUID }, editfile: url });
									return false;
								}
							},

						}
						el.appendTag('div', { className: 'col pulldown', popupmenu: pdmenu });


						//console.log('aaaa', servicestate);
						//if (Aim.aliconnector && Aim.aliconnector.state == 'online' && ['docx', 'doc', 'xlsx', 'xls'].indexOf(ext) != -1) {
						//	el.appendTag('span', {
						//		className: 'icn editfile', attr: { name: filename }, onclick: function (event) {
						//			var url = "http://www.alicon.nl" + ofile.src;

						//			console.log('OPEN', url);
						//			Aim.wss.send({ to: { deviceUID: Aim.deviceUID }, editfile: url });
						//			return false;
						//		}
						//	});
						//	el.appendTag('span', {
						//		className: 'icn filemenu', onclick: function (event) {
						//			//Aim.wss.send({ exec: "editfile", url: 'http://www.alicon.nl' + ofile.src });
						//			return false;
						//		}
						//	});
						//}



						//if (window.ext) {
						//	el.btFileEdit = el.appendTag('button', {
						//		fname: a.pop(), className: 'bt edit', el: el,
						//		upload: function () {
						//			var a = el.ofile.src.split('/');
						//			this.value = '';
						//			var ofile = external.FileUpload(a.pop(), a.join('/'), Aim.origin, el.ofile.id);
						//			ofile = JSON.parse(ofile);
						//			el.ofile.lastModifiedDate = ofile.lastModifiedDate;
						//			el.elModDate.innerText = ofile.lastModifiedDate;
						//		},
						//		getstate: function (p) {
						//			p = p || this;
						//			p.value = external.FileState(p.fname);
						//			if (p.value == 'inuse') setTimeout(p.getstate, 3000, p);
						//			else if (p.value == 'exists') p.upload();
						//		},
						//		onclick: function (event) {
						//			if (this.value == '') { var a = el.ofile.src.split('/'); external.FileEdit(el.ofile.id, a.pop(), a.join('/'), Aim.origin); this.getstate(); }
						//			else if (this.value == 'exists') { }
						//			else alert('File is in use');
						//			return false;
						//		},
						//	});
						//	el.btFileEdit.getstate();
						//}

						//el.appendTag('span', { className: 'filemenu', pulldownmenu: pdmenu });
						//console.log('aaaa', servicestate);
						//if (Aim.aliconnector && Aim.aliconnector.state == 'online' && ['docx', 'doc', 'xlsx', 'xls'].indexOf(ext) != -1) {
						//	el.appendTag('span', {
						//		className: 'icn editfile', attr: { name: filename }, onclick: function (event) {
						//			var url = "http://www.alicon.nl" + ofile.src;

						//			console.log('OPEN', url);
						//			Aim.wss.send({ to: { deviceUID: Aim.deviceUID }, editfile: url });
						//			return false;
						//		}
						//	});
						//	el.appendTag('span', {
						//		className: 'icn filemenu', onclick: function (event) {
						//			//Aim.wss.send({ exec: "editfile", url: 'http://www.alicon.nl' + ofile.src });
						//			return false;
						//		}
						//	});
						//}

					}
				}
				el.onclick = this.setfocus;
				el.draggable = true;
				el.appendTag('div', { className: 'bt icn sel', el: el, onclick: items.selectitem, });
				if (this.elFiles.edit) {
					el.appendTag('div', {
						className: 'bt icn del', el: el, item: this, onclick: function (event) {
							el.parentElement.removeChild(el);
							App.files.filesSave.call(this.item);
						}
					});
				}

			},
			filesUploadNext: function (item) {
				App.files.fileUpload(item, App.files.filesUploadArray ? App.files.filesUploadArray[++App.files.sendFileId] : null);
			},
			fileUpload: function (item, file, data) {// gebruikt bij PASTE
				console.log('dataToFile', item, item.id, file, data);
				if (!file) {
					App.files.filesUploadArray = null;
					if (OM.elBar) {
						if (OM.elBar.parentElement) OM.elBar.parentElement.removeChild(OM.elBar);
						OM.elBar = null;
					}
					App.files.filesSave.call(item);
					if (item.refresh && !item.editing) {
						item.refresh();
						item.write();
					}
					return;
				}
				xhr = new XMLHttpRequest;
				xhr.item = item;
				xhr.open("put", '/' + Aim.client.domain.name + '/v1/api/file?' + Aim.URL.stringify({
					itemID: item.id, name: file.name, base64: data ? 1 : 0, size: file.size || '', type: file.type || '', lastModifiedDate: (file.lastModifiedDate ? file.lastModifiedDate : new Date()).toISOString()
				}), true);
				if (OM.elBar) xhr.upload.addEventListener("progress", function (event) {
					this.setAttribute("value", this.tot + event.loaded);
				}.bind(OM.elBar), false);
				xhr.onreadystatechange = function (e) {
					if (xhr.readyState == 4) {
						if (xhr.status == 200) {
							console.log(this.responseText);
							var data = JSON.parse(this.responseText);
							console.log('DATA', data, this.item, this);
							// Replace | insert image into div container
							if (document.activeElement.tagName == 'DIV' && document.activeElement.contentEditable) {
								var sel, range, html;
								if (window.getSelection) {
									sel = window.getSelection();
									if (sel.getRangeAt && sel.rangeCount) {
										//let offset = sel.focusOffset;
										range = sel.getRangeAt(0);
										range.deleteContents();
										var elImg = document.createElement('img');
										elImg.src = data.srcs || data.src;
										range.insertNode(elImg);
										range.setStartAfter(elImg);
										//range.setEnd(elImg, 0);
										//range.setStart()
										//range.set
										//window.getSelection().addRange()


										//range.setStart(el.childNodes[2], 5);

										//range.collapse(true);

										sel.removeAllRanges();
										sel.addRange(range);
										//document.activeElement.setSelectionRange(5,5);
									}
								}
								else if (document.selection && document.selection.createRange) {
									document.selection.createRange().text = text;
								}
							}
							else {
								console.log(this.item);
								this.item.files = this.item.files || [];
								this.item.files.push(data);
								App.files.filesAppend.call(this.item, data);
							}
							//if (!OM.elBar) {
							//	return;
							//}
							if (OM.elBar) OM.elBar.tot += Number(data.size);
							App.files.filesUploadNext(this.item);
						}
						else { alert(xhr, 'error uploading file'); }
					}
				};
				xhr.send(data || file);
			},

			filesWrite: function (el) {
				//console.log(this);
				this.elFiles = el;
				el.files = this.files;
				el.className = 'col files';
				//this.pause = function () { };
				//this.play = function () { };
				this.elImages = el.appendTag('div', {
					className: 'row images',
					files: this,
					//images:[],
					//onmouseenter: this.pause,
					//onmouseleave: this.play,
				});
				this.elAttach = el.appendTag('div', { className: 'row attach', });
				colpage.files = el;
				el.parentElement.parentElement.parentElement.addEventListener('click', function () {
					if (App.files.elFocus) {
						App.files.elFocus.removeAttribute('focus', '');
						App.files.elFocus = null;
					}
				}, true);
				if (this.files) for (var i = 0, ofile; ofile = this.files[i]; i++) this.filesAppend(ofile);
			},
			//this.slideinit = function () {
			//    with (this.elImages) {
			//        var c = this.elImages.children;
			//        this.elImages.items = [];
			//        for (var i = 0, e; e = c[i]; i++) this.elImages.items.push(e);
			//        //this.elImages.items = this.elImages.getElementsByTagName('div');
			//        appendTag('div', { className: 'btr prev', sender: this, onclick: function () { this.sender.slide(-1); } });
			//        appendTag('div', { className: 'btr next', sender: this, onclick: function () { this.sender.slide(1); } });
			//    }
			//    this.slide();
			//}
			//this.value = JSON.stringify(this.afiles);
			//filesUploadArray:[],
			//sendFileId:0,
			filesUploadAll: function (afiles, id) {
				App.files.filesUploadArray = afiles;
				//var max = 0;
				OM.elBar = document.body.appendTag('progress', { className: 'progressbar bgd', max: 0, tot: 0 });
				for (var i = 0, f; f = afiles[i]; i++) OM.elBar.max += f.size;
				//OM.elBar.tot = 0;
				App.files.sendFileId = -1;
				App.files.filesUploadNext(this);
			},
			//onloadFile: function (event) {
			//	var data = event.target.result.split(',');
			//	this.f.type = data[0];
			//	this.f.data = data[1];
			//	this.f.exec = 'uploadfiledata';
			//	this.f.hostId = A.host.hostId;
			//	this.f.itemId = get.id;
			//	delete this.f.slice;
			//	delete this.f.webkitRelativePath;
			//	items.load({
			//		msg: 'Uploading files', files: this.files, post: this.f, onload: function () {
			//			this.files.appendFile(this.data);
			//			this.files.UploadNextFile();
			//		}
			//	});
			//},

		},
		task: {
			plan: function () {
				//console.log('TASK PLAN', api, arguments.callee);
				if (!ganth.init(arguments.callee)) return;
				if (task.Owners) return ganth.show(document.body.appendTag('div', { className: 'formFixed ganth row aco' }), task.Owners);
				Aim.load({
					api: 'task/plan', onload: function () {
						console.log('API DATA', api);
						//tasks.data = this.data;
						//console.log(this.data);
						task.Owners = {};
						api.task.plan.forEach(function (row, id) {
							//tasks.owners[row.Owner] = tasks.owners[row.Owner] || { id: id };
							(task.Owners[row.Owner] = task.Owners[row.Owner] || { title: row.Owner, children: [] }).children.push(row);
							//task.Owners[row.Owner].work += row.Work;

						});
						task.Owners = Aim.Object.toArray(task.Owners);
						var maxEndDT = date.localdate(date.startdate);
						task.Owners.forEach(function (Owner) {
							Owner.children.sort(function (a, b) {
								var n;
								var stateorder = ['input', 'sales', ''];
								//if (a.state && !b.state) return 1;
								//if (!a.state && b.state) return -1;
								if (stateorder.indexOf(a.state || '') > stateorder.indexOf(b.state || '')) return 1;
								if (stateorder.indexOf(a.state || '') < stateorder.indexOf(b.state || '')) return -1;
								if (n = String(a.endDT).localeCompare(String(b.endDT))) return n;
								//if (n = a.startDT.localeCompare(b.startDT)) return n;
								return 0;
							});
							var sdt = date.localdate(new Date());
							Owner.endDT = date.localdate(new Date());
							//console.log(sdt.toISOString().substr(0, 10));
							Owner.days = {};
							Owner.Work = 0;
							Owner.children.forEach(function (row) {
								row.parent = Owner;
								var Work = Number(row.Work);
								if (!Work) return;
								Owner.Work += Work;
								row.bars = [];
								//row.sdt = row.edt = date.localdate(row.endDT);
								while (Work) {
									var DayString = sdt.toISOString().substr(0, 10);
									var DayWork = Math.min(Work, 5 - (Owner.days[DayString] = Number(Owner.days[DayString] || 0)));
									//console.log(Owner.title, row.title,  DayString, DayWork, Work);
									row.sdt = row.sdt || date.localdate(sdt);
									row.edt = sdt;
									if (DayWork) {
										//row.bars.push({ sdt: row.sdt.valueOf() - today.valueOf(), wdt: 24, hdt: DayWork * 2 });
										//console.log(today.toISOString().substr(0, 10), row.sdt.toISOString().substr(0, 10), row.sdt.valueOf(), today.valueOf(), left);
										Owner.days[DayString] += DayWork;
										Work -= DayWork;
									}
									//if (sdt.getDay() == 5) sdt.setDate(sdt.getDate() + 3);
									//if (Owner.title == 'Gerben van den Hoorn') console.log(Owner.title, row.title, sdt.toISOString().substr(0, 10), Work, row.sdt.toISOString().substr(0, 10), row.edt.toISOString().substr(0, 10));
									if (Work) sdt = date.workday(sdt.setDate(sdt.getDate() + (sdt.getDay() == 5 ? 3 : 1)));
								}
								var left = (row.sdt.valueOf() - date.startdate.valueOf()) / 3600000;
								var width = (row.edt.valueOf() - row.sdt.valueOf()) / 3600000 + 24;

								if (row.edt.valueOf() > maxEndDT.valueOf()) maxEndDT = date.localdate(row.edt);
								if (row.edt.valueOf() > Owner.endDT.valueOf()) Owner.endDT = date.localdate(row.edt);

								var endDT = date.localdate(row.endDT);
								if (row.endDT) row.bars.push({ left: (endDT.valueOf() - date.startdate.valueOf()) / 3600000 + 20, className: 'milestone' });

								row.bars.push({ left: left + 1, width: width, title: row.Work, className: 'bar ' + (row.pastdeadline = endDT.valueOf() < row.edt.valueOf() ? 'overdate' : '') });
								if (row.pastdeadline) row.style = 'color:red;';

								//row.edt = row.edt.toISOString().substr(0, 10);


								//row.sdt = row.sdt.toISOString().substr(0, 10);
								row.title += ' (' + row.startDT + ' / ' + row.endDT + ')';
								//console.log(Work, row.Work, row.bars);
							});
							//console.log(Owner.title, Owner);
							Owner.bars = [{ left: 1, width: (Owner.endDT.valueOf() - date.startdate.valueOf()) / 3600000 + 24, title: Owner.Work }];
						});
						task.Owners.width = (maxEndDT.valueOf() - date.startdate.valueOf()) / 3600000 + 24;

						task.plan();
					}
				});
				//console.log('PLANDATA', this.data);
				//with (document.getElementById('aList')) {
				//    var owners = {};
				//    this.data.forEach(function (row) {
				//        (owners[row.Owner] = owners[row.Owner] || []).push(row);
				//    });
				//    with (appendTag('div', { className: 'tasktable' }).appendTag('ul')) {
				//        for (var OwnerName in owners) {
				//            var work = 0;
				//            with (appendTag('li', { className: 'group', rows: owners[OwnerName], onclick: function () { this.rows.forEach(function (row) { row.li.style.display = row.li.style.display ? '' : 'none'; }) } })) {
				//                //with (appendTag('div')) {
				//                appendTag('div').appendTag('span', { innerText: OwnerName });
				//                elWork = appendTag('div', { innerText: '' });
				//                appendTag('div', { innerText: '' });
				//                appendTag('div', { innerText: '' });
				//                appendTag('div', { innerText: '' });
				//                //}
				//                //appendTag('caption', { innerText: OwnerName });
				//            }
				//            //with (appendTag('ul')) {
				//            owners[OwnerName].forEach(function (row) {
				//                if (!isNaN(row.Work)) work += (row.work = Number(row.Work));
				//                with (row.li = appendTag('li', { className: 'sub', style: 'display:none;' })) {
				//                    //style.display = 'none;';
				//                    //with (appendTag('div')) {
				//                    appendTag('div').appendTag('div', { innerText: row.name });
				//                    appendTag('div', { innerText: row.Work || '' });
				//                    appendTag('div', { innerText: (row.startDT || '').substr(0, 10) });
				//                    appendTag('div', { innerText: (row.endDT || '').substr(0, 10) });
				//                    var eDT = new Date(row.endDT);
				//                    var sDT = Math.max(new Date(row.startDT), eDT - 24 * 3600000 * row.work / 4 / 5 * 7);
				//                    appendTag('div', { className: 'bar' }).appendTag('span', { style: 'margin-left:' + (sDT - today) / 3600000 + 'px;width:' + (eDT - sDT) / 3600000 + 'px;' });
				//                    //}
				//                }
				//            });
				//            //}
				//            //}
				//            elWork.innerText = work || 0;
				//        }
				//    }
				//}
			}
		},
		date: {
			today: today = date.localdate(new Date()),
			startdate: today,
		},
		originpath: document.location.origin + document.location.pathname,
		elementImage: function (el, ofile, edit) {
			if (!ofile.src) return el;
			var pre = ''; var post = '';
			if (ofile.src.indexOf('http') == -1) {
				var pre = Aim.origin;
				var post = '?' + ofile.lastModifiedDate;
			}
			el.src = pre + (ofile.srcs || ofile.src) + post;
			//el.src = '/api/v1/img/?w=120&h=120&s=' + pre + ofile.src;
			el.srcl = pre + (ofile.src) + post;
			el.alt = ofile.name || '';
			//el.ofile = ofile;
			el.ondragstart = items.ondragstart;
			if (!edit) el.onclick = ImageSlider.Large;
			return el;
		},
		sort: {
			title: function (a, b) { return String(a.title.toLowerCase()).localeCompare(String(b.title.toLowerCase())) },
			idx: function (a, b) {
				if (a.idx != undefined && b.idx == undefined) return -1;
				if (a.idx != undefined && b.idx == undefined) return 1;
				if (a.idx > b.idx) return 1;
				if (a.idx < b.idx) return -1;
				return 0;
			},
			id: function (a, b) {
				if (a.id < b.id)
					return -1;
				if (a.id > b.id)
					return 1;
				return 0;
			},
			filter: function (a, b) {
				if (a.cnt > 0 && b.cnt == 0) return -1;
				if (a.cnt == 0 && b.cnt > 0) return 1;
				return a.value.localeCompare(b.value, {}, 'numeric');
			},
			value: function (a, b) {
				var va = (isNaN(a.value)) ? a.value.toLowerCase() : a.value;
				var vb = (isNaN(b.value)) ? b.value.toLowerCase() : b.value;
				if (va < vb) return -1;
				if (va > vb) return 1;
				return 0;
			},
			prijs: function (a, b) {
				if (Number(isnull(a.Prijs, 0)) < Number(isnull(b.Prijs, 0)))
					return -1;
				if (Number(isnull(a.Prijs, 0)) > Number(isnull(b.Prijs, 0)))
					return 1;
				return 0;
			},
			prijsLaagHoog: function (a, b) {
				if (Number(isnull(a.field.Prijs.value, 0)) < Number(isnull(b.field.Prijs.value, 0)))
					return -1;
				if (Number(isnull(a.field.Prijs.value, 0)) > Number(isnull(b.field.Prijs.value, 0)))
					return 1;
				return 0;
			},
			prijsHoogLaag: function (a, b) {
				if (Number(isnull(a.field.Prijs.value, 0)) < Number(isnull(b.field.Prijs.value, 0)))
					return 1;
				if (Number(isnull(a.field.Prijs.value, 0)) > Number(isnull(b.field.Prijs.value, 0)))
					return -1;
				return 0;
			},
			nameAz: function (a, b) {
				if ((a.field.Name.value || '').toLowerCase() < (b.field.Name.value || '').toLowerCase())
					return -1;
				if ((a.field.Name.value || '').toLowerCase() > (b.field.Name.value || '').toLowerCase())
					return 1;
				return 0;
			},
			nameZa: function (a, b) {
				if ((a.field.Name.value || '').toLowerCase() < (b.field.Name.value || '').toLowerCase())
					return 1;
				if ((a.field.Name.value || '').toLowerCase() > (b.field.Name.value || '').toLowerCase())
					return -1;
				return 0;
			},
			prijsdesc: function (a, b) {
				if (Number(isnull(a.Prijs, 0)) < Number(isnull(b.Prijs, 0)))
					return 1;
				if (Number(isnull(a.Prijs, 0)) > Number(isnull(b.Prijs, 0)))
					return -1;
				return 0;
			},
			idx1: function (a, b) {
				if (a.idx < b.idx)
					return -1;
				if (a.idx > b.idx)
					return 1;
				return 0;
			},
			az: function (a, b) {
				if (isnull(a.Name, '') < isnull(b.Name, ''))
					return 1;
				if (isnull(a.Name, '') > isnull(b.Name, ''))
					return -1;
				return 0;
			},
			za: function (a, b) {
				if (isnull(a.Name, '') < isnull(b.Name, ''))
					return -1;
				if (isnull(a.Name, '') > isnull(b.Name, ''))
					return 1;
				return 0;
			},
			cntdn: function (a, b) {
				if (a.cnt < b.cnt)
					return 1;
				if (a.cnt > b.cnt)
					return -1;
				return 0;
			},
		},
		windowShow: function (url) {
			var borderHeight = window.outerHeight - window.innerHeight;
			var windowWidth = window.innerWidth * 0.6 - 100;
			var windowHeight = (window.outerHeight - borderHeight) * 0.6 - 100;
			//console.log('WINDOW OPEN', url, "top=" + (window.screenTop + 150) + ",left=" + (window.screenLeft + window.outerWidth - windowWidth - 50) + ",width=" + windowWidth + ",height=" + windowHeight);

			window.open(url, "_blank", "top=" + (window.screenTop + 150) + ",left=" + (window.screenLeft + window.outerWidth - windowWidth - 50) + ",width=" + windowWidth + ",height=" + windowHeight);
			//window.open(url, "test", "top=10,left=10,width=200,height=200");
		},
		toggleopen: function () {
			//console.log('toggleopen', this);
			if (this.parentElement.getAttribute('open') != undefined) {
				this.parentElement.setAttribute('open', this.parentElement.getAttribute('open') ^ 1); if (this.onopen) this.onopen.call(this, this.parentElement.getAttribute('open'));
			}
			if (this.getAttribute('open') != undefined) {
				this.setAttribute('open', this.getAttribute('open') ^ 1);
				if (this.onopen) this.onopen.call(this, this.getAttribute('open'));
			}
		},
		accentsTidy: function (s) {
			if (!s) return;
			var r = String(s).toLowerCase();
			r = r.replace(new RegExp("\\s", 'g'), "");
			r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
			r = r.replace(new RegExp("æ", 'g'), "ae");
			r = r.replace(new RegExp("ç", 'g'), "c");
			r = r.replace(new RegExp("[èéêë]", 'g'), "e");
			r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
			r = r.replace(new RegExp("ñ", 'g'), "n");
			r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
			r = r.replace(new RegExp("œ", 'g'), "oe");
			r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
			r = r.replace(new RegExp("[ýÿ]", 'g'), "y");
			r = r.replace(new RegExp("\\W", 'g'), "");
			return r;
		},
		use: function (lib, callback) {
			if (window[lib]) return false;
			console.log('USE', lib);
			return App.lib[lib] = document.body.appendTag('script', { src: '/lib/' + lib + '/js/' + lib + '.js' }).onload = callback;
		},
		createTreelist: function (el, rows, par, level) {
			if (!rows) return;
			par = par || {};
			rows.sort(App.sort.idx);
			with (el = typeof el == 'string' ? document.getElementById(el) : el) rows.forEach(function (row) {
				with (appendTag('li', par.li || { className: 'col', onmouseenter: Aim.Element.open, onmouseleave: Aim.Element.close, onclick: Aim.Element.close, draggable: true })) {
					//var obj;
					//if (row.href && (obj = Aim.URL.objbyref(row.href)) && typeof obj.e === 'function') appendTag('a', { innerText: row.title, obj: obj, onclick: function () { this.obj.e.call(this.obj.p, this.obj.pars) } }); //return obj.e.call(obj.p, obj.pars) || true;
					//else
					appendTag('a', { href: ('#?schema=' + row.schema + '&id=' + row.id), innerText: row.title, });
					row.children = row.children || row.items;
					if (row.children) {
						setAttribute('open', par.opendefault || 0);
						App.createTreelist(appendTag('ul', { className: 'bg', attr: { open: 1 } }), row.children, par, level + 1);
					}
				}
			});
		},
		listitem: function () {
			//if (!this.classGroup && this.classID && items.classitems) (this.classGroup = items.classitems[this.classID] = items.classitems[this.classID] || [])[this.id] = this;
			//if (this.title) this.searchname = accent_fold([String(this.title).toLowerCase(), this.subject ? String(this.subject).toLowerCase() : '', this.summary ? String(this.summary).toLowerCase() : ''].join(' '));

			//this.flagSet();
			//if (this.flag && this.filterfields) this.filterfields.Flag = this.flag;

			////if (this.properties && this.properties.price) this.price = this.properties.price.value;
			//this.cd = this.properties && this.properties.cd ? this.properties.cd.value : this.cd;
			//this.discount = this.cd || this.sd || 0;
			//this.pricedefault = this.discount == null ? null : this.cp;
			//this.price = this.discount == null ? null : Number(this.cp) * (100 - this.discount) / 100;
			//this.stateColor = this.state && this.class && this.properties && this.properties.state && this.properties.state.options && this.properties.state.options[this.state] ? this.properties.state.options[this.state].color : null;
			//this.pricedefault = Number(this.pricedefault || this.listpricedefault || this.price);
			//if (shop.items && shop.items[this.id]) this.accountprice = shop.items[this.id];
			//var price = this.accountprice || this.price;
			//this.sd = (price) ? (this.pricedefault - price) / this.pricedefault * 100 : 0;

			//this.class = aliconnect.class[this.classID] || {};
			//console.log(this.schema,this.classID,this.id,this.name,this);
			//this.schema = api.find(this.classID) || '';
			//if (this.id && )
			//if (this.class = api.definitions[this.schema = api.find(this.classID) || ''] || {}) {
			//    console.log('PROP', this.class, this.properties);
			//    this.class = JSON.parse(JSON.stringify({ fields: this.properties, classID: this.classID, files: this.files, btns: this.btns, printmenu: this.printmenu, childClasses: this.childClasses }));
			//}
			//this.properties = this.properties;

			//for (var attributeName in this.values) {
			//    if (!this.properties || !this.properties[attributeName]) continue;
			//    this.properties[attributeName].value = this.values[attributeName] ? this.values[attributeName].title || this.values[attributeName] : this[attributeName] || '';
			//    if (this.values[attributeName].itemID) this.properties[attributeName].itemID = this.values[attributeName].itemID;
			//}
			//this.name = this.schema;

			//console.log(this.state, this.properties);
			//this.hasImage = false;
			//this.hasAttach = false;
			//if (this.files && this.files) for (var iFile = 0, ofile; ofile = this.files[iFile]; iFile++) {
			//	if (App.file.oisImg(ofile)) {
			//		this.hasImage = true;
			//		this.iconsrc = this.iconsrc || ofile.src;
			//	}
			//	else this.hasAttach = true;
			//}
			//this.parent = Aim.get(this.masterID);
			//if (this.masterID) {
			//    this.master = Aim.get({ id: this.masterID });
			//    this.master.items = this.master.items || [];
			//    if (this.master.items.indexOf(this) == -1) {
			//        this.master.items.push(this);
			//    }
			//    //console.log('Master Items', this.masterID, this.title, this.id, this.master.items, this.master);
			//}
			//if (this.srcID) {
			//    this.source = Aim.get({ id: this.srcID });
			//}

			//this.master = Aim.get({ id: this.masterID });
			//if (this.master.items.indexOf(this) == -1) this.master.items.push(this);
			//if (this.masterID) {
			//    this.master = Aim.get({ id: this.masterID });
			//    this.master.items.push(this);
			//    //if (this.master.elUl) this.appendTo(this.master.elUl);
			//    //console.log(this.master.items.indexOf(this));
			//    //if (this.master.items.indexOf(this) === -1) {
			//    //    this.master.items.push(this);
			//    //}
			//    //console.log('MASTER', this, this.masterID, items[this.masterID], this.master);
			//}
			//this.iconsrc = this.class && this.className ? apiroot + 'img/icon/' + this.className + '.png' : '';
			//console.log(this.class,this.classID,this.iconsrc);
			//this.iconsrc = (this.files && this.files.avalue && this.files.avalue[0]) ? this.iconsrc = files.avalue[0].src : (this.class && this.className ? apiroot + 'img/icon/' + this.className + '.png' : '');
		},
		pagerow: function (el, level) {
			//console.log('pagerow', el, this);
			var href = '#' + this.schema + '/' + this.id + '?select=*';
			with (el) {
				with (appendTag('div', { className: 'row header' })) {
					if (this.files && this.files.length) appendTag('a', { className: 'images', href: href }).appendTag('img', { src: (this.files[0].src.substr(0, 4) != 'http' ? document.location.protocol + '//aliconnect.nl/' : '') + this.files[0].src });
					with (appendTag('div', { className: 'col aco' })) {
						appendTag('h' + level).appendTag('a', { innerText: this.title, href: href });
						with (appendTag('div', { className: 'row path', style: 'top:-20px;' })) {
							//if (row.values.state) appendTag('span', { attr: { state: row.values.state } });
							//if (row.values.startDT) appendTag('span', { className: 'startDT', innerText: row.values.startDT });
							//if (row.values.endDT) appendTag('span', { className: 'endDT', innerText: row.values.endDT });
							if (this.startDT) appendTag('span', { className: 'startDT', innerText: date.localdate(this.startDT).toDateText() });
						}
						if (this.subject) appendTag('div', { className: 'subject', innerHTML: this.subject });
					}
				}

			}
			return el;
		},
		page: function (row) {
			//console.log('row');
			if (this.id == row.id) return;
			this.id = row.id;
			Aim.load({
				api: row.schema, get: { id: row.id, child: -1, filter: 'startDT+IS+NOT+NULL+AND+finishDT+IS+NULL' }, parent: row, onload: function () {
					if (this.parent.children) this.parent.children.forEach(function (row) {
						//Aim.itemSite.call(row);
						if (theme.createElementSection) return theme.createElementSection.call(row);
						App.pagerow.call(row, colpage, 2);
					});
				}
			});
			App.pageItem = row = api[row.schema][row.id];
			//Aim.itemSite.call(row);
			if (theme.createElementPage) theme.createElementPage.call(row);
			else with (this) {
				innerText = '';
				this.className += ' ' + row.schema;
				App.pagerow.call(row, this, 1);//.scrollIntoView(true);
				appendTag('div', { className: 'BodyHTML', innerHTML: row.BodyHTML });
			}
			var scrolledY = window.scrollY;
			if (scrolledY) {
				window.scroll(0, scrolledY - 50);
			}
		},
		listrow: function (row, i, rows) {
			//Host.activeList = el || Host.activeList;
			//console.log(row.id, row.title,i,rows);
			with (rows.el) {
				appendTag('li', { className: 'col', val: App.accentsTidy(row.title) }).appendTag('a', { className: 'row aco', href: '#' + row.schema + "/" + row.id + '?select=*' }).appendTag('div', { className: 'col aco' }).appendTag('div', { title: row.getAttribute('title'), innerHTML: row.getAttribute('innerHTML') || row.getAttribute('title') });
			}
		},
		list: function (rows, el) {
			with (rows.el = el) {
				innerText = '';
				onscroll = function () {
					Aim.settings[this.id + '_scrollTop'] = this.scrollTop;
					App.setDelayed();
				};
				//Host.activeList = appendTag('ul');
				rows.forEach(App.listrow);
				if (Aim.settings[id + '_scrollTop']) scrollTop = Aim.settings[id + '_scrollTop'];
			}
		},
		onloadrow: function () {
			console.log('onloadrow', this.src, this.data);
			//if (!this.data || !this.schema || !this.data[this.schema]) return;
			Host.activerow = this;
			//var rows = Aim.Object.toArray(this.data[this.schema]);
			//var schema = api.definitions[this.schema];
			//if (!schema.properties) return Aim.load({ api: 'definitions/' + this.schema, row: this, onload: function () { App.onloadrow.call(this.row); } });

			var item = api.items[this.data.id];
			//console.log(colpage, item.elPage, document.getElementById('aPage'), document.getElementById('elPv'));
			App.page.call(colpage = item.elPage = colpage || item.elPage || document.getElementById('elPage') || document.getElementById('elPv'), item);





			return;
			App.item.call(item);
			//console.log('ITEM', item);
			colpage = item.elPage = document.getElementById('aPage') || document.getElementById('elPv');
			Aim.load({
				item: item, api: 'item', get: { id: item.id, child: 1, link: 1, refby: 1, filter: "startDT+IS+NOT+NULL+AND+finishDT+IS+NULL", select: 'item' }, onload: function () {
					console.log('CHILDRENs', this.data, this.item, this.item.children);
					this.item.writepage();
				}
			});
			item.writepage();

			//return;
			//if (document.getElementById('aPage')) with (document.getElementById('aPage')) {
			//    innerText = '';
			//    //console.log('HISTORY', window.history);
			//    with (appendTag("div", { className: 'row bar top' })) {
			//        appendTag("div").appendTag("a", {
			//            className: 'ico-back', innerText: 'Terug',
			//            //href: history.length ? 'javascript:history.back()' : '#' + (schema.api || this.schema + '?top=0&properties=id,title&where=title+IS+NOT+NULL'),
			//            //onclick: function () { document.getElementById('aPage').innerText = ''; },
			//            onclick: function () { document.getElementById('aPage').innerText = ''; },
			//            //href: '#' + (schema.api || this.schema + '?top=0&select=id,title&where=title+IS+NOT+NULL')
			//        });
			//    }
			//    //console.log('METHODS', App.definition, schema);
			//    if (schema.method) with (appendTag("div", { className: 'row bar bottom' })) {
			//        for (var methodname in schema.method) { appendTag('a', { row: rows[0], id: 'btn_' + methodname, className: 'ico-' + methodname, onclick: schema.method[methodname], }).appendTag('div', { innerText: methodname }); }
			//    }

			//    App.item.call(api.items[this.data.id]);
			//    console.log('ITEM',api.items[this.data.id]);
			//    //App.page.call(App.elFocus = appendTag("div", { className: 'col aco fields details' }), api.items[this.data.id]);


			//    //rows.forEach(App.page, App.elFocus = appendTag("div", { className: 'col aco' }));
			//}
		},
		onloadrows: function () {
			App.list(this.data.value, api.definitions[this.get.schema].elList);
		},
		protocol: document.location.protocol,
		id: function (id) { return document.getElementById(id); },
		login: function () {
			var
					form = function () {
						var post = {};
						for (var i = 0, e; e = this.elements[i]; i++) if (e.value) post[e.name] = e.value;
						document.getElementById('aPage').innerText = '';
						//console.log(post);
						Aim.load({
							src: this.action, post: post, onload: function () {
								console.log(this.src, this.responseText, this.data);
								if (this.data) Aim.client.user.id = this.data.userID;
								else if (document.getElementById('aPage')) document.getElementById('aPage').innerHTML = this.responseText;
								Aim.init();
							}
						});
						return false;
					};
			with (document.getElementById('aPage').appendTag('form', { action: '/auth.json', onsubmit: submitform })) {
				with (appendTag('div')) {
					appendTag('label', { innerText: 'Account email' });
					appendTag('input', { name: 'username', type: 'email', autocomplete: 'username', required: '' });
				}
				with (appendTag('div')) {
					appendTag('label', { innerText: 'Password' });
					appendTag('input', { name: 'password', type: 'password', required: '' });
				}
				appendTag('button', { innerText: 'Aanmelden' });
			}
			return;
			//}
		},
		submit: function () {
			console.log('SUBMIT', this.elements);
			var post = {};
			for (var i = 0, e; e = this.elements[i]; i++) if (e.value) post[e.name] = e.value;
			//console.log(post);
			Aim.load({
				api: this.action, post: post, onload: function () {
					if (this.data) console.log(this.data);
					else if (document.getElementById('aPage')) document.getElementById('aPage').innerHTML = this.responseText;
				}
			});
			return false;
		},
		setDelayed: function () {
			if (this.setTO) clearTimeout(this.setTO);
			this.setTO = setTimeout(App.set, 2000);
		},
		set: function (par) {
			for (var name in par) Aim.settings[name] = par[name];
			Aim.settings.hash = document.location.hash.substr(1);
			var currentsettings = JSON.stringify(Aim.settings);
			if (currentsettings != Aim.settings) {
				//document.getElementById('log').innerText = 'NEW SETTINGS' + currentsettings;
				//cookies.settings = currentsettings;
				//console.log('NEW SETTINGS', currentsettings);
				//document.getElementById('log').innerText = currentsettings;

				//document.getElementById('aPage').appendTag('div', { innerText: 'NEW SETTINGS'+ currentsettings });
				//console.log(currentsettings);
				Aim.load({
					api: '', post: { settings: Aim.settings = currentsettings }, onload: function () {
						console.log('SETTINGS', this.post, this.responseText);
					}
				});
				//console.log(Aims());
			}
		},
		ImageSlider: ImageSlider = {
			show: function (e) {
				if (ImageSlider.elDiv) ImageSlider.elDiv.parentElement.removeChild(ImageSlider.elDiv);
				var el = ImageSlider.elDiv = ImageSlider.elCont.appendTag(e.tagName, { className: 'img', ImageSlider: ImageSlider });
				if (e.tagName == 'VIDEO') with (el) {
					vid = el;
					frameNumber = 0;
					onclick = function () {
						if (!this.paused) {
							this.pause();
							frameNumber = vid.currentTime;
						}
						else this.play();
					};
					onwheel = function (event) {
						if (!this.paused) {
							this.pause();
							frameNumber = vid.currentTime;
						}
						frameNumber += event.deltaY / 1000;
						window.requestAnimationFrame(scrollPlay);
					};

					function scrollPlay() {
						vid.currentTime = frameNumber;
						//window.requestAnimationFrame(scrollPlay);
					};

					window.requestAnimationFrame(scrollPlay);


					setAttribute('controls', '');
					setAttribute('autobuffer', '');
					setAttribute('preload', '');
					setAttribute('autoplay', '');
					onended = function (event) {
						this.ImageSlider.Next();
					};
				};
				el.src = e.srcl || e.src;
				//console.log(e, ImageSlider.Image.src, i);
				ImageSlider.elTop.innerHTML = (e.alt || '') + ' ' + ((e.ofile) ? ((e.ofile.lastModifiedDate || '') + ' ' + (e.ofile.size || '')) : '');
			},
			Prior: function (e) {
				ImageSlider.show(ImageSlider.c1[--ImageSlider.imgnr] || ImageSlider.c1[ImageSlider.imgnr = ImageSlider.c1.length - 1]);
			},
			Next: function (e) {
				ImageSlider.show(ImageSlider.c1[++ImageSlider.imgnr] || ImageSlider.c1[ImageSlider.imgnr = 0]);
			},
			Large: function (event) {
				event.stopPropagation();
				//var c = ImageSlider.elSrc.getElementsByTagName('video');
				ImageSlider.c = ImageSlider.elSrc.getElementsByClassName('aImage');
				for (var i = 0, e; e = ImageSlider.c[i]; i++) if (e.pause) e.pause();

				with (ImageSlider.el = document.body.appendTag('div', { className: 'ImageSlider' })) {
					with (appendTag('div', { className: 'cont' })) {
						appendTag('button', {
							className: 'abtn icn close abs', event: {
								click: ImageSlider.Out
							}
						});
						with (ImageSlider.elCont = appendTag('div', { className: 'Image' })) {
							appendTag('div', { className: 'Sliderbutton Prior', event: { click: ImageSlider.Prior } }).appendTag('span');
							appendTag('div', { className: 'Sliderbutton Next', event: { click: ImageSlider.Next } }).appendTag('span');
						}
					}
					ImageSlider.elTop = appendTag('div', { className: 'row top' });
				}
				swipedetect(ImageSlider.el, function (swipedir) {
					//swipedir contains either "none", "left", "right", "top", or "down"
					if (swipedir == 'left') ImageSlider.Next();
					else if (swipedir == 'right') ImageSlider.Prior();
				});


				ImageSlider.onkeydown = function (event) {
					if (ImageSlider.el && ImageSlider.el.show) {
						//if (event.keyCode == key.esc) { ImageSlider.Out(); }
						//else
						//console.log('KEY',event,event.keyCode);
						event.preventDefault(); //event.stopPropagation();
						//if (event.code == "Escape") { ImageSlider.Out(); }
						if (event.code == "ArrowLeft") { ImageSlider.Prior(); }
						else if (event.code == "ArrowRight") { ImageSlider.Next(); }

					}
				};
				document.addEventListener("keydown", ImageSlider.onkeydown, true);
				//event = window.event;

				ImageSlider.c1 = [];
				for (var i = 0, e; e = ImageSlider.c[i]; i++) if (e.src) ImageSlider.c1.push(e);

				for (var i = 0, e; e = ImageSlider.c1[i]; i++) if (e == this) break;
				ImageSlider.el.show = true;
				ImageSlider.el.setAttribute('show', '');
				ImageSlider.show(ImageSlider.c1[ImageSlider.imgnr = i]);
				//document.body.innerHTML = 'CLICK';
			},
			Out: function () {
				document.removeEventListener('keydown', ImageSlider.onkeydown, true);
				if (ImageSlider.el) { ImageSlider.el.innerText = ''; document.body.removeChild(ImageSlider.el); }
			},
		},
	},
	menuitems: {
		copy: { title: 'Kopieren', key: 'Ctrl+C', onclick: function () { app.selection.copy(); } },
		cut: { title: 'Knippen', key: 'Ctrl+X', onclick: function () { app.selection.cut(); } },
		paste: { title: 'Plakken', key: 'Ctrl+V', onclick: function () { app.selection.paste(); } },
		hyperlink: { title: 'Hyperlink plakken', key: 'Ctrl+K', onclick: function () { app.selection.link(); } },
		del: { title: 'Verwijderen', key: 'Ctrl+Del', onclick: function () { app.selection.delete(); } },
		//add: {
		//    title: 'Nieuw',
		//    click: function () { console.log(this); },
		//    menu: {
		//        map: { title: 'Map', key: 'Ctrl+N', },
		//        contact: { title: 'Contact', },
		//    }
		//},
		move: {
			title: 'Verplaatsen',
			popupmenu: {
				moveup: { title: 'Omhoog', key: 'Alt+Shift+Up', },
				movedown: { title: 'Omlaag', key: 'Alt+Shift+Dwon', },
				ident: { title: 'Inspringen', key: 'Alt+Shift+Right', },
				unident: { title: 'Terughalen', key: 'Alt+Shift+Left', },
			}
		},
		flag: {
			title: 'Plannen',
			menu: {
				vandaag: {
					title: 'Vandaag', className: 'flag', attr: { days: 0 },
					onclick: function () {
						this.item.set({ finishDT: '', endDT: aDate().toISOString().substr(0, 10) });
						//this.item.show();
					}

				},
				morgen: {
					title: 'Morgen', className: 'flag', attr: { days: 1 },
					onclick: function () {
						var d = aDate();
						d.setDate(d.getDate() + 1);
						this.item.set({ finishDT: '', endDT: d.toISOString().substr(0, 10) });
						//this.item.show();
					}
				},
				dezeweek: {
					title: 'Deze week', className: 'flag', attr: { days: 'w' },
					onclick: function () {
						var d = aDate();
						while (d.getDay() != 5) d.setDate(d.getDate() + 1);
						this.item.set({ finishDT: '', endDT: d.toISOString().substr(0, 10) });
						//this.item.show();
					}
				},
				volgendeWeek: {
					title: 'Volgende week', className: 'flag', attr: { days: 'w1' },
					onclick: function () {
						var d = aDate();
						d.setDate(d.getDate() + 7);
						while (d.getDay() != 5) d.setDate(d.getDate() + 1);
						this.item.set({ finishDT: '', endDT: d.toISOString().substr(0, 10) });
						//this.item.show();
					}
				},
				over2weken: {
					title: 'Over 2 weken', className: 'flag', attr: { days: 'w2' },
					onclick: function () {
						var d = aDate();
						d.setDate(d.getDate() + 14);
						while (d.getDay() != 5) d.setDate(d.getDate() + 1);
						this.item.set({ finishDT: '', endDT: d.toISOString().substr(0, 10) });
						//this.item.show();
					}
				},
				over3weken: {
					title: 'Over 3 weken', className: 'flag', attr: { days: 'w3' },
					onclick: function () {
						var d = aDate();
						d.setDate(d.getDate() + 21);
						while (d.getDay() != 5) d.setDate(d.getDate() + 1);
						this.item.set({ finishDT: '', endDT: d.toISOString().substr(0, 10) });
						//this.item.show();
					}
				},
				over4weken: {
					title: 'Over 4 weken', className: 'flag', attr: { days: 'w4' },
					onclick: function () {
						var d = aDate();
						d.setDate(d.getDate() + 28);
						while (d.getDay() != 5) d.setDate(d.getDate() + 1);
						this.item.set({ finishDT: '', endDT: d.toISOString().substr(0, 10) });
						//this.item.show();
					}
				},
				datum: {
					title: 'Datum', className: 'calendar',
					onclick: function () {
						console.log(this.item);

					}
				},
				gereed: {
					title: 'Gereed', className: 'checked',
					onclick: function () {
						this.item.set({ finishDT: aDate().toISOString() });
						//this.item.write();
						//this.item.refresh();
					}
				},
			}
		},
		//cat: {
		//    title: 'Categoriseren',
		//    menu: {
		//        Ja: { title: 'Ja', color: 'black', },
		//        Nee: { title: 'Nee', color: 'red', },
		//        Groen: { title: 'Groen', color: 'green', },
		//        Blauw: { title: 'Blauw', color: 'blue', },
		//    }
		//},
		state: {
			title: 'Status',
			//menu: this.item.class.fields.state.options
		},
	},
	events: {
		init: function () {
			//console.log('load');
			//if (Aim.libraries) Aim.libraries.forEach(function (library) {
			//    if (window[library] && window[library].init) {
			//        //console.log('execute: init of', library);
			//        window[library].init();
			//        //console.log('executed: init of', library);
			//    }
			//});
			//Aim.init.forEach(function (fn) { fn(); });
			App.callback = App.callback || 'init';
			//if (window[Aim.client.domain.name] && window[Aim.client.domain.name].init) { window[Aim.client.domain.name].init(); console.log();}
			if (window.host && window.host.init) {
				window.host.init();
				//console.log('executed: init of host', Aim.client.domain.name);
			}
			//if (App.callback && window[App.callback]) {
			//	window[App.callback]();
			//	//console.log('executed:', App.callback);
			//}
			//App.addEventListener(window, 'hashchange', App.hashchange);
			if (Aim.mobile) document.location.hash = document.location.hash || Aim.settings.hash || '';
			//if (document.location.hash) App.hashchange();
			//console.log(document.location.origin);
			//App.runurl('LOAD');
			//console.log('CONFIG', document.getElementById('elPublish'));
			//if (App.elPublish = App.elPublish || document.getElementById('elPublish')) {
			//App.elPublish.style.display = 'none';
			//console.log('CONFIG', document.location.origin);
			//if (document.location.host == 'localhost') {
			//	Aim.load({
			//		src: "/.config.aliconnect.json", onload: function () {
			//			console.log('JSON', this.src, this.responseText);
			//			if (!this.data || !this.data[Aim.client.domain.name]) return;
			//			//console.log('JSON', this.data, Aim.client.domain.name, this.data[Aim.client.domain.name]);
			//			aliconnect.secret = this.data[Aim.client.domain.name].secret;
			//			//pas op key zetten beinvloed aliconnector, Aim.wss e.d. Aim.wss kijkt naar get key. aliconnector set cookie key
			//			aliconnect.key = this.data[Aim.client.domain.name].key;
			//			if (aliconnect.secret) { App.elPublish.style.display = ''; App.elPublish.onclick = App.publish; }
			//			//App.runurl('LOAD');
			//		}
			//	});
			//}
			//}
		},
		dragenter: function (event) {
			event.target.setAttribute('dragover', '');
			//console.log(event.target);
		},
		dragend: function (event) {
			App.dragitem = null;
		},
		dragleave: function (event) {
			event.target.removeAttribute('dragover');
			//console.log(event.target);
		},
		dragstart: function (event) {
			App.dragitem = this;
		},
		dragover: function (event) {
			//console.log(event, this);
			event.stopPropagation();
			event.preventDefault();
			//event.dataTransfer.dropEffect = 'move';
			event.dataTransfer.dropEffect =
			!App.dragitem || !event.shiftKey && event.ctrlKey && !event.altKey ? 'copy' :
			event.shiftKey && event.ctrlKey && !event.altKey ? 'link' :
			event.shiftKey && !event.ctrlKey && event.altKey ? 'move into' :
			'move';
		},
		//drop: function (event) {
		//	console.log('DROP APP', event, this, App.dragitem);
		//	event.stopPropagation();
		//	event.preventDefault();
		//	for (var i = 0, typename; typename = event.dataTransfer.types[i]; i++) {
		//		console.log(typename, event.dataTransfer.getData(typename));
		//	}
		//},
	},
	definitions: {
		item: Object.assign({
			add: function (event) {
				//Geeft inzicht in bal bla
				//console.log('ADD', this.caller);
				//return;
				//var a = String(this.id || get.lid).split(';');
				//var schemaname;// = api.find(post.classID);
				//var schema = api.definitions[this.caller.schema];// || api.definitions[schemaname = api.find(post.classID)];
				//var post = { id: a.shift(), };
				//if (schema.onadd) schema.onadd.call(post);
				var put = { schema: this.schema || this.get.folder };
				//console.log('ADD', this, put, this.caller);
				Aim.load({
					api: this.schema,
					put: { value: [put] },
					onload: this.onload || function (event) {
						console.log('ADDED', this.data);
						//return;
						//console.log(this.src, this.responseText, this.data.id, this.data, api.item[this.data.id]);
						//var itemID = this.data[];//.set[0][0].id;
						var item = Aim.itemAdded = api.item[event.data.value.shift().id];
						item.onloadEdit = true;
						for (var name in item.properties) if (item.properties[name].initvalue) item.setAttribute(name, item.properties[name].initvalue);


						Aim.URL.set({ schema: item.schema, id: item.id });




						//console.log('LV', Listview);
						//Listview.elItems.insertBefore(Listview.items.appendListitem(item), Listview.elItems.firstChild);

						//OM.show({ id: item.id });
					}
				});
			},
			allOf: [App.files],
			writeprice: function (el, idx) {
				//console.log('PRICE', this);
				if (this.price) {
					var elPrice = el.appendTag('div', { className: 'pricerow row' });
					with (elPrice) {
						with (appendTag('div', { className: 'price aco' })) {
							with (appendTag('div')) {
								var elPriceVal = appendTag('span', { className: 'currency', innerText: Number(this.pricedefault).toFixed(2) });
								if (this.price != this.pricedefault) {
									elPriceVal.className += ' del';
									var elPriceVal = appendTag('span', { className: 'currency', innerText: this.price.toFixed(2) });
									el.insertBefore(appendTag('div', { className: 'labelkorting' }), el.firstChild);
								}
								if (this.accountprice) {
									elPriceVal.className += ' del';
									var elPriceVal = appendTag('span', { className: 'currency', innerText: this.accountprice.toFixed(2) });
									el.insertBefore(appendTag('div', { className: 'labelkortingklant' }), el.firstChild);
								}
							}
							if (Number(this.discount)) appendTag('div', { innerText: 'U bespaart ' + Number(this.discount).toFixed(1) + '%' });
							if (this.stock)
								appendTag('div', { className: 'delivery', innerText: "Op voorraad " + this.stock + " stuks. " + ((this.Levertijd) ? ((this.Levertijd + ' dag' + ((this.Levertijd > 1) ? 'en' : '') + ' levertijd') || '') : '') });
							else
								appendTag('div', { className: 'delivery', innerText: "Niet op voorraad. " + ((this.Besteltijd) ? ((this.Besteltijd + this.Levertijd + ' dag' + ((this.Besteltijd + this.Levertijd > 1) ? 'en' : '') + ' levertijd') || '') : '') });

						}
						(this.elBagCnt = this.elBagCnt || [])[idx] = appendTag('input', {
							className: 'addbag', row: this, type: 'number', min: 0, value: (shop.data && shop.data[this.id]) ? shop.data[this.id].quant : '', onchange: function (event) {
								//console.log(this.value);
								//shop.data.push({ name: this.this.name, summary: this.this.summary });
								//this.row.quant = Number(this.value);
								shop.add(this.row.id, this.value);
							}
						});
						appendTag('button', {
							className: 'abtn icn bagAdd', type: 'button', row: this, onclick: function (event) {
								//console.log(shop.data, shop.data[this.row.id], this.row.id);
								shop.add(this.row.id, (shop.data && shop.data[this.row.id]) ? Number(shop.data[this.row.id].quant) + 1 : 1);
								event.stopPropagation();
								//shop.data[this.row.id] = this.row;
								//this.row.quant += 1;
								//for (var i = 0; i <= 1; i++) {
								//    var elBag = this.row.elBagCnt[i];
								//    if (elBag) {
								//        elBag.value = this.row.quant;
								//        elBag.onchange();
								//    }
								//}
								//shop.add(this.row);
								//console.log(elBag, shop.data);
								return false;
							},
						});
					}
				}
			},
			pgedit: function (event) {
				//if (event) return this.item.pgedit();
				this.editing = true;
				Aim.itemPage = Aim.pageItem = App.select = this;
				var c = document.getElementsByTagName('video');
				for (var i = 0, e; e = c[i]; i++) e.pause();
				with (OM.elEdit = colpage) {
					innerText = '';
					//console.log('EDIT >>>>>>>>>', this, this.files);
					//with (OM.elEdit = appendTag('div', { className: 'col aco edit atc', item: this, })) {
					OM.formBtnBar = this.elbtnBar = appendTag('div', { className: 'row top btnbar np' });
					with (this.WriteHeader(this.elEditHeader = appendTag('div', { className: 'row header', item: this, }))) {
						//this.elEditHeader.elClose.onclick = function (event) {
						//	this.parentElement.item.btnCancel.click(); event.stopPropagation()
						//};
					}
					this.onAppendField = function (event) {
						Aim.load({
							msg: 'Appending field',
							item: this.item,
							api: this.item.id + 'appendfield',
							get: { groupname: this.groupname || '' },
							//post: { exec: 'appendfield', id: this.item.id, groupname: this.groupname || '' },
							onload: function () {
								this.item.attributesedit.push(this.data);
								this.item.appendField(this.data);
							},
						});
					};
					var groupname = '';
					label = '';
					with (elEditForm = appendTag('form', { className: 'col aco fields oa', item: this, autocomplete: "off", onsubmit: this.submit })) {
						with (this.elForm = appendTag('div', { className: 'col aco oa', })) {
							//if (this.users) {
							with (this.elUsers = appendTag('div', { className: 'col users' })) {
								appendTag('label', { className: 'aan', innerText: 'Aan' });
								with (appendTag('div', { className: 'row aco field' })) {
									//console.log(this.users);
									if (this.link && this.link.users) this.link.users.forEach(function (userID) {
										//console.log('USERS', {u:u,i:i,j:j});
										var itemUser = api.item[userID];
										appendTag('a', { className: ['c', itemUser.fav, itemUser.id].join(' '), onclick: Aim.Element.onclick, id: itemUser.id, innerText: api.item[itemUser.id].title }).appendTag('button', {
											type: 'button',
											onclick: function (event) {
												this.parentElement.parentElement.removeChild(this.parentElement);
												elNewUsers.focus();
												event.preventDefault();
												event.stopPropagation();
												return false;
											}
										});
									});
									elNewUsers = Object.assign(appendTag('input', {
										placeholder: " ", autocomplete: 'off', className: 'aco ainp', item: this, schema: 'contact', onitemselect: function (event) {
											//console.log(this, this.id);
											if (this.value) {
												var el = appendTag('a', { className: 'c', onclick: Aim.Element.onclick, id: this.id, innerText: this.value });
												el.appendTag('button', { type: 'button', onclick: function (event) { this.parentElement.parentElement.removeChild(this.parentElement); return false; } });
												this.parentElement.insertBefore(el, this);
												this.value = '';
												this.select();
												this.focus();
											}
										}
									}), Aim.Element.Pulldown);
								}
							}
							this.oldusers = this.elUsers.innerText;
							//}
							if (this.files = this.files || []) {
								Object.assign(this, App.files);
								this.filesWrite(this.elFilesInp = appendTag('div', { edit: true, item: this, name: 'files' }));
								this.oldfiles = this.elFilesInp.innerHTML;
								var btns = {
									attach: { className: 'r', item: this, elAttach: this.elFilesInp, accept: '', onclick: App.file.onClick },
									image: { item: this, elAttach: this.elFilesInp, accept: 'image/*', onclick: App.file.onClick },
									camera: { item: this, onclick: OM.panel.camera },
									freedraw: { item: this, onclick: OM.panel.freedraw },
									close: { title: 'Sluit formulier', item: this, onclick: function () { this.item.submit(); } },

								};
								Aim.createButtonbar(this.elbtnBar, btns);



								//with (this.elbtnBar) {
								//	appendTag('button', { className: 'abtn icn attach r', item: this, elAttach: this.elFilesInp, accept: '', onclick: App.file.onClick });
								//	appendTag('button', { className: 'abtn icn image', item: this, elAttach: this.elFilesInp, accept: 'image/*', onclick: App.file.onClick });
								//	appendTag('button', { className: 'abtn icn camera', item: this, onclick: OM.panel.camera });
								//	appendTag('button', { className: 'abtn icn freedraw', item: this, onclick: OM.panel.freedraw });
								//}
							}
							var elGroup = this.elForm, groupname = '', label = '', elInpFocus = null, elGroupH;
							//console.log('>>>>>>>>>>', this.attributes);
							with (elGroup) for (var attributeName in this.attributes) {
								var field = this.getAttribute(attributeName), displayvalue = field.value;//new Aim.attribute(this, attributeName);
								field.item = this;
								var newgroupname = field.groupname || newgroupname;
								var newlabel = field.label || newlabel;
								//console.log(newlabel, attributeName);
								if (!field.hidden && !field.view && (!field.disabled || displayvalue)) {
									if (newgroupname && groupname != newgroupname) with (elGroup = appendTag('ul', { attr: { open: field.open } })) {
										appendTag('div', { innerHTML: newgroupname, onclick: function () { with (this.parentElement) setAttribute('open', getAttribute('open') ^ 1); } });
										groupname = newgroupname;
									}
									if (!elGroupH || (newlabel && label != newlabel)) {
										elGroupH = this.elForm.appendTag('h2', { innerText: newlabel || this.typical || this.schema, open: 0 });
										if (field.labelvisible) {
											elGroupH.className += ' checkvisible';
											elGroupH.checkvisible = field.labelvisible.bind(this);
										}
										elGroup = this.elForm.appendTag('div', { className: 'col wrap' });
										label = newlabel;
									};
									field.innertovalue = function () { this.value = this.innerText; };
									if (field.type != 'hidden') {
										elGroup.appendChild(field.createEdit());
										if (field.elInp && field.type != 'files') {
											var innerValue = field.value || field.defaultvalue || field.publicvalue;
											if (innerValue) elGroupH.setAttribute('open', 1);
											if (!field.elInp.value && innerValue) field.elInp.value = innerValue;
											if (field.defaultvalue) {
												if (field.defaultvalue == field.elInp.value) field.elInp.setAttribute('default', '');
												else field.elInp.setAttribute('title', field.defaultvalue);
											}
											field.elInp.field = field;
											if (field.readOnly) field.elInp.setAttribute('readonly', '');
											if (!elInpFocus) (elInpFocus = field.elInp).focus();
											if (field.description) field.elInp.title = field.description;
										}
									}
								}
							}
						}
						with (appendTag('div', { className: 'row abtns' })) {
							this.btnSave = appendTag('button', { className: 'abtn icn', attr: { default: true }, innerText: 'Afsluiten' });
						}
					}
					//}
				}
				if (this.elPc) with (this.elPc) {
					innerText = '';
					OM.elPc.item = this;
					var tags = {
						id: {}, class: {}, groupname: {}, categories: { type: 'textarea' }, selected: {}, states: {}, classID: {}, detailID: {}, hostID: {}, userID: {}, masterID: {}, parentId: {}, linkId: {}, srcID: {}, inheritedId: {}, derivedId: {}, tblkeyID: {}, idx: {},
					};
					for (var name in tags) {
						with (appendTag('div')) {
							appendTag('label', { innerText: name });
							appendTag(tags[name].tag || 'input', { name: name, value: this[name] || '' });
						}
					}
					appendTag('button');
				}
				if (this.attributes && this.attributes.DisplayName) {
					//console.log('DISPLAY NAME 1');
					this.attributes.DisplayName.elInp.onchange = function () {
						var a = this.value.split(' ');
						if (a) this.item.attributes.Surname = a.pop();
						if (a) this.item.attributes.GivenName = a.shift();
						if (a) this.item.attributes.MiddleName = a.join(' ');
						//console.log(this, this.item, 'DISPLAY NAME CHANGE');
					}
				}
				this.refresh();
			},
			delete: function (event) {
				//if (event) return this.item.delete();
				console.log('DELETING', this);
				//Aim.load({ msg: 'Deleting ' + this.name, post: { exec: 'itemdel', id: this.itemID || this.id } });
				Aim.load({
					method: 'delete', get: { id: this.itemID || this.id }, onload: function () {
						console.log(this.src, this.responseText);
					}
				});
				if (Aim.pageItem == this) colpage.innerText = '';
				if (this.elLi) {
					if (this.elLi.nextElementSibling) this.elLi.nextElementSibling.item.focus();
					else if (this.elLi.previousElementSibling) this.elLi.previousElementSibling.item.focus();
					else if (this.elLi.parentElement.parentElement) this.elLi.parentElement.parentElement.item.focus();
					this.elLi.parentElement.removeChild(this.elLi);
				}
				if (this.elLvLi) {
					if (this.elLvLi.nextElementSibling && !this.elLvLi.nextElementSibling.ghost) var el = this.elLvLi.nextElementSibling;//.item.show();
					else if (this.elLvLi.previousElementSibling) var el = this.elLvLi.previousElementSibling;
					if (el && el.item) el.item.show();
					if (this.elLvLi.parentElement) this.elLvLi.parentElement.removeChild(this.elLvLi);
				}
				if (this.master && this.master.items) this.master.items.splice(this.master.items.indexOf(this), 1);
				delete api.item[this.id];
				delete this;
			},
			show: function (event) {
				if (event) return this.item.show();
				get.id = this.id;
				if (Aim.pageItem && Aim.pageItem.editing) Aim.pageItem.editclose();
				this.write();
				if (OM.elErr) {
					var c = OM.elErr.children;
					for (var i = 0, elErrRow; elErrRow = c[i]; i++) if (elErrRow.meshitem.src.itemID == this.id) break;
					if (elErrRow) {
						elErrRow.accept = new Date();
						elErrRow.elAccept.innerText = elErrRow.accept.toISOString().substr(11, 8);
						elErrRow.refresh();
					}
				}
			},
			writeitem: Listview.createElementListRow,
			appendAttribute: function (attributeName, level, el) {
				if (!attributeName) return;
				var attribute = this.getAttribute(attributeName);
				if (attribute.type == 'hidden') return;
				var elValue = null, displayvalue = attribute.value || attribute.displayvalue || attribute.defaultvalue || attribute.mastervalue;
				//if (attributeName == "Product") console.log(this.id, attributeName, displayvalue, this.attributes[attributeName].value, this.values[attributeName].value);




				//if (attribute.defaultvalue) console.log('DEFAULT1', attribute.name, attribute.displayvalue, attribute.defaultvalue);
				//if (attribute.defaultvalue) console.log('DEFAULT2', attribute.name, attribute.displayvalue, attribute.defaultvalue);
				elWrite.fieldgroupname = attribute.groupname || elWrite.fieldgroupname;
				elWrite.fieldlabel = attribute.label || elWrite.fieldlabel;
				//console.log(attributeName,displayvalue);
				if (displayvalue == '' && !attribute.operation) return;

				//colpage.setAttribute(attributeName, attribute.value);

				//console.log(attributeName, displayvalue, attribute.type, attribute.createView, );

				elWrite.fieldtype = attribute.type || elWrite.fieldtype;
				elWrite.fieldplaceholder = (attribute.title || attribute.placeholder || attribute.label) || elWrite.fieldplaceholder;
				if (String(displayvalue).substr(0, 6) == '<html>') {
					console.log('HTML PAGE');
					var elFrame = el.appendTag('iframe');
					elFrame.contentWindow.document.open();
					elFrame.contentWindow.document.write(displayvalue);
					elFrame.contentWindow.document.close();
					elFrame.style.height = (elFrame.contentWindow.document.body.scrollHeight + 20) + 'px';
					return;
				}
				if (!level) {
					if (elWrite.groupname != elWrite.fieldgroupname) {
						elWrite.groupname = elWrite.fieldgroupname;
						el.appendTag('h1', { innerText: fieldgroupname });
						elWrite.label = '';
					}
					if (elWrite.label != elWrite.fieldlabel) {
						elWrite.label = elWrite.fieldlabel;
						elWrite.placeholder = '';
						//console.log(attribute, attribute.open);
						Aim.Element.setOpen(el.appendTag('h2', { label: elWrite.fieldlabel, innerText: elWrite.fieldlabel }));
						el.elTbl = el.appendTag('div', { className: 'col fields' });
					}
				}
				//if (!attribute.operation && !displayvalue) return;

				//console.log(this.id,this.schema,attributeName,this.attributes);
				if (attribute.createView) (el.elTbl = el.elTbl || el.appendTag('div', { className: 'col fields' })).appendChild(attribute.createView());
			},
			writedetails: function (el, level) {
				with (el) {
					var groupname = '', label = '', fieldgroupname = '', fieldlabel = '', fieldtype = '';
					elWrite = { groupname: '', label: '', fieldgroupname: '', fieldlabel: '', fieldtype: '' };
					//for (var attributeName in this.properties) this.appendAttribute(this.createField(attributeName), 0, el);



					//console.log('VALUES', this.schema, this.id, this.title, this.values, this);
					for (var attributeName in this.attributes) this.appendAttribute(attributeName, 0, el);
					if (this.operations) {
						Aim.Element.setOpen(appendTag('h2', { label: 'Operations', innerText: 'Operations' }));
						with (appendTag('ul')) {
							for (var attributeName in this.operations) {
								//console.log(attributeName, this.operations[attributeName]);
								with (appendTag('li', { className: 'row' })) {
									var send = function () {
										console.log('SENDDDDDDD', Aim.client.domain.id, this.item.id, this.name);
										var item = { id: this.item.id, operations: {} };
										item.operations[this.name] = (this.value || this.elInp.value).split(',');
										Aim.wss.send({ to: [Aim.client.domain.id], value: [item] });
									};
									var elBtn = appendTag('button', { innerText: this.operations[attributeName].title || attributeName, item: this, name: attributeName, onclick: send, });
									elBtn.elInp = this.operations[attributeName].arguments ? appendTag('input', { item: this, name: attributeName, onchange: send }) : { value: '' };

									//var elInp = this.operations[attributeName].arguments ? appendTag('input', { item: this, name: attributeName, onchange:send }) : '';
									//appendTag('button', { innerText: '>', item: this, name: attributeName, elInp:elInp, onclick: send });
								}
							}
						}
					}
					//console.log('DETAIL', this.createDetail);
					if (this.createDetail) {
						Aim.Element.setOpen(appendTag('h2', { label: 'Detail', innerText: 'Detail' }));
						this.createDetail(appendTag('ul', { className: 'detail' }).appendTag('li', {}).appendTag('div', { className: this.id + ' ' + this.name, attr: { storing: 1 } }));
						this.refreshValues();
					}
					if (level) return;
					if (this.classlinks && this.classlinks.length) {
						appendTag('h2', { innerText: 'Object relaties' });
						for (var i = 0, classlink; classlink = this.classlinks[i]; i++) {
							with (appendTag('div', { className: 'row' })) {
								appendTag('label', { innerText: classlink.class });
								appendTag('a', { className: 'aco', innerText: classlink.quant + ' stuks', href: '#n=' + this.title + ' / ' + classlink.class + '&q=*&lid=;' + classlink.classID + ';;;;;' + classlink.id });
							}
						}
					}
					if (this.rel) {
						for (var linkname in this.rel) {
							with (Aim.Element.setOpen(appendTag('h2', { label: linkname }))) {
								appendTag('span', { className: 'icn add' });
								appendTag('span', { innerText: linkname });
							}
							with (appendTag('ul', { className: 'bgd lv' })) {
								var item = this;
								this.rel[linkname].forEach(function (row) { row.writeitem(appendTag('li', { linkrow: item, className: row.linkclass, draggable: true })); });
							}
						}
					}
					if (this.reports) {
						appendTag('h2', { innerText: 'Reports' });
						elRpt = appendTag('div', { className: 'report' });
						Aim.load({
							src: this.reports.src, post: { id: this.id }, nojson: 1, onload: function () {
								elRpt.innerHTML = this.responseText;
							}
						});
					}
					//console.log('CLASS', this.class);
					if (this.graphs) {
						//                if (!window.AmCharts) {
						//                    dpcument.bodu.appendTag(<script src="/inc/js/amcharts/amcharts.js" type="text/javascript"></script>
						//<script src="/inc/js/amcharts/serial.js" type="text/javascript"></script>

						//                }
						appendTag('h2', { innerText: 'Charts' });
						//appendTag('div', { className: 'amchart nopb', style: 'width:100%;position:relative;height:400px;page-break-inside:avoid;background:green;' });
						elAmChart = appendTag('div', { className: 'amchart', style: 'width:100%;position:relative;height:400px;page-break-inside:avoid;' });
						//AmCharts.ready(function () {
						Aim.load({
							src: this.graphs.src + '?id=' + this.id, onload: function () {
								console.log('CHART', this.data);
								for (var chartname in this.data) {
									//document.body.appendTag('h1', { innerText: chartname });
									row = this.data[chartname];
									if (row.dataProvider) {
										var chartEl = elAmChart.appendTag('div', { className: '', style: "width: 100%; height: 400px;position:relative;" });
										chartEl.style.pageBreakInside = "avoid";
										chart = new AmCharts.makeChart(chartEl, row);
									}
									else elAmChart.appendTag('div', { innerHTML: row });
								};
							}
						});
					}
				}
			},
			writepage: function () {
				with (this.elPage) {
					innerText = '';
					var labels = {};
					with (this.elementFields = appendTag('div', { className: 'fields aco oa details', item: this })) {
						this.elementFields.ontouchend = function (e) {
							if (!this.item.loaded) item.load();
						};
						this.elementFields.ontouchmove = function (e) {
							if (this.scrollTop < -40 && this.item.loaded) {
								this.item.loaded = false;
								Aim.Element.BtnRefresh.className += 'z100';
							}
							if (document.body.scrollTop < 0) {
								e.preventDefault();
							}
						};
						this.writeprice(this.elementFields.appendTag('div', { className: 'pricecontainer' }), 1);
						var label = "";

						this.elMasterPath = appendTag('div', { className: 'row path' });
						(function () {
							//return;
							with (this.elMasterPath) {
								innerText = '';
								var arrayPath = [];
								if (this.masterID) for (var row = this; row = Aim.get(row.masterID) ;) {
									if (!('masterID' in row)) return Aim.load({ get: { id: row.id }, masterID: row.masterID = null, onload: arguments.callee.bind(this) });
									if (row.open) row.open();
									arrayPath.unshift(row);
									if (!row.masterID) break;
								}
								arrayPath.forEach(function (row, i) {
									if (i > 0) appendText(' / ');
									if (row.open) row.open();
									appendTag('a', { className: 'aco', schema: row.schema, itemID: row.id, innerText: String(row.title || '').replace(row.source ? row.source.title : '', '').trim() });
								});
							}
						}.bind(this))();
						this.elSourcePath = appendTag('div', { className: 'row path' });
						(function () {
							with (this.elSourcePath) {
								innerText = '';
								if (this.srcID) for (var i = 0, row = this; row = Aim.api.item[row.srcID]; i++) {
									if (!('srcID' in row)) return Aim.load({ get: { id: this.id }, srcID: row.srcID = null, onload: arguments.callee.bind(this) })
									if (i > 0) insertBefore(appendTag('span', { innerText: '/' }), firstChild);
									insertBefore(appendTag('a', { className: 'aco', schema: row.schema, itemID: row.id, innerText: String(row.title || '').replace(row.source ? row.source.title : '', '').trim() }), firstChild);
									if (!row.masterID || i > 20) break;
								}
							}
						}.bind(this))();

						if (this.link && this.link.users) with (appendTag('div', { className: 'row users view' })) this.link.users.forEach(function (userID, i) {
							var itemUser = Aim.get({ id: userID });
							var el = appendTag('a', { className: 'c' + itemUser.fav, itemID: itemUser.id, innerText: itemUser.title });
							//Aim.Element.popup(el);
							//= items[u.id] || {}
							el.appendTag('span', { className: 'userstate', attr: { name: 'state' + itemUser.id, state: items[itemUser.id].onlinestate || '' } });
						});
						this.filesWrite(this.elFilesView = appendTag('div'), { value: this.files });
						this.writedetails(this.elementFields);
						this.elMsg = appendTag('div', { className: 'col berichten' });
					}
					if (Aim.client.user.id) with (this.elMsgForm = appendTag('form', { className: 'col brd np', item: this, onsubmit: msg.submit, files: [] })) {
						Object.assign(this.elMsgForm, App.files, { id: this.id });
						//App.files.call(this.elMsgForm);
						this.elMsgForm.filesWrite(appendTag('div', { className: 'row', edit: true }));
						with (appendTag('div', { className: 'row' })) {
							function resize(event) {
								elMsgTextarea.style.height = 'auto';
								elMsgTextarea.style.height = (elMsgTextarea.scrollHeight) + 'px';
							}
							/* 0-timeout to get the already changed text */
							function delayedResize() {
								window.setTimeout(resize, 0);
							}

							this.elMsgForm.elMsg = elMsgTextarea = appendTag('textarea', {
								className: 'aco', placeholder: 'Schrijf een bericht of voeg een bestand toe', files: this.elMsgForm.elAttach, name: '', attr: { tabindex: 4, contenteditable: true }, form: this.elMsgForm,

								onchange: resize, oncut: delayedResize, onpaste: delayedResize, ondrop: delayedResize, onkeyup: resize,
								event: {
									keyup: function (event) {
										if (event.ctrlKey && event.key == 'Enter') {
											event.preventDefault();
											this.form.onsubmit();
										}
									}
								}
							});

							//CKEDITOR.inline(this.elMsgForm.elMsg);
							//with (appendTag('div', {className:'btns'})) {
							appendTag('button', { className: 'abtn icn send' });
							appendTag('button', {
								className: 'abtn icn image', type: 'button', //elAttach: this.elMsgForm,
								item: this.elMsgForm,
								accept: 'image/*', onclick: App.file.onClick
							});
							appendTag('button', {
								className: 'abtn icn attach', type: 'button',
								//elAttach: this.elMsgForm,
								item: this.elMsgForm,
								accept: '', onclick: App.file.onClick
							});
							//}
						}
					}
				}
			},
			WriteHeader: function (el) {
				//console.log('WRITEHEADER', this);
				with (el) {
					if (this.properties && this.properties.state) {
						if (this.properties.state.options) {
							this.properties.state.options.onclick = function () {
								this.item.set({ state: Aim.Object.findFieldValue(this.item.properties.state.options, 'title', this.menuitem.title) });
								if (App.select == this.item) this.item.write();
							}
						}
						appendTag('div', { className: 'stateicon ' + (this.state || ''), item: this, contextmenu: this.attributes.state.options }).style.backgroundColor = this.stateColor;
					}
					appendTag('div', { className: 'modified' });
					with (appendTag('sym')) for (var i = 0; i < 3; i++) appendTag('i');

					if (this.www) appendTag('div', { className: 'icn www ' + (this.hostID == 1 ? 'public' : '') });

					with (this.elTopImg = appendTag('div', { className: 'icn topimg ' + (this.className || this.schema) })) {
						style.borderColor = this.modColor;
						if (this.iconsrc) appendTag('img', { src: this.iconsrc });
					}
					//this.elTopImg = appendTag('div', { className: (this.iconsrc ? '' : 'icn') + ' topimg ' + (this.class ? this.name.toLowerCase() : ''), style: this.iconsrc ? 'background-image:url("' + this.iconsrc + '")' : '' });

					with (Aim.printHeader = colpage.header = this.elHdrName = appendTag('div', { className: 'aco col headername inline' })) {
						this.elKop = [appendTag('div', { className: 'title' }), appendTag('div', { className: 'subject' }), appendTag('div', { className: 'summary' })];
						document.title = this.elKop[0].innerHTML = this.title;
						this.elKop[1].innerHTML = this.subjectText;
						this.elKop[2].innerHTML = this.summaryText;
						//Aim.printheader = { kop0: this.title, kop1: this.subject, kop2: this.summary };

						//if (this.attributes && this.attributes.state && this.state) {
						//	if (this.attributes.state.options) {
						//		this.attributes.state.options.onclick = function () {
						//			this.item.set({ state: Aim.Object.findFieldValue(this.item.attributes.state.options, 'title', this.menuitem.title) });
						//			console.log(this.item);
						//			//this.item.write();//MVK
						//			this.item.write();

						//		}
						//		appendTag('span', { className: 'blk' }).style.backgroundColor = (this.state && this.attributes.state.options[this.state]) ? this.attributes.state.options[this.state].color : '';
						//		appendTag('span', { innerText: (this.state && this.attributes.state.options && this.attributes.state.options[this.state]) ? this.attributes.state.options[this.state].title || this.state : '', item: this, menu: this.attributes.state.options });
						//	}
						//}



						if (this.values) with (appendTag('div', { className: 'row date', item: this, contextmenu: Aim.menuitems.flag.menu })) {
							var sd = aDate(this.startDT), ed = aDate(this.endDT), cd = aDate(this.createdDT);
							if (this.startDT) appendTag('span', { className: 'icn clock', innerText: sd.toDateText(1) });
							else appendTag('span', { className: 'icn clock', innerText: cd.toDateText(1) });
							if (this.finishDT) with (appendTag('span')) {
								appendTag('span', { className: 'icn flag', attr: { flag: this.flag }, });
								appendTag('span', { innerText: aDate(this.finishDT).toDateText(1) });
							}
							else if (this.endDT) with (appendTag('span')) {
								appendTag('span', { className: 'icn flag', attr: { flag: this.flag }, });
								appendTag('span', { innerText: ((String(this.startDT || '').substr(0, 10) != String(this.endDT || '').substr(0, 10)) ? ed.toDateText(1) : ed.toLocaleTimeString().substr(0, 5)) });
							}
						}

					}
				}
				return this.elHdrName;
			},
			createElementPage: function () {
				this.write()
			},
			write: function () {
				//console.log('WRITE >>>>>>>>>>>>', this.onloadEdit, this.id, this.loaded, this);
				if (this.onloadEdit) {
					this.onloadEdit = false;
					this.pgedit();
					return;
				}
				this.getrel('master', this);
				this.getrel('source', this);

				Aim.itemPage = Aim.pageItem = App.select = this;
				if (get.sv || !this.id) return;
				//if (!this.loaded) return this.load();
				//console.log('WRITE2', this.id, this.loaded, this);
				//if (!this.class) return;
				if (this.detailID) return this.detail.write();
				//this.flagSet();
				//if (OM.pv) {
				//Aim.pageItem = this;
				//if (this.elList) {
				//    this.elList.setAttribute('selected', '');
				//    Aim.Element.scrollIntoView(this.elList, Listview.elOa);
				//}




				//MKAN
				//Aim.his[this.id] = this.modifiedDT;
				//if (Aim.pageItem && Aim.pageItem.elLvLi) Aim.pageItem.elLvLi.removeAttribute('selected');

				//Aim.pageItem = Aim.pageItem = this;
				//}
				colpage.setAttribute('name', [this.schema, this.id].join('-'));
				colpage.setAttribute('state', this.state || '');

				(colpage.rewrite = function () {
					with (colpage) {
						innerText = '';

						className = "col apv printcol " + this.id;

						setAttribute('state', this.values && this.state ? this.state : '');
						//console.log('WRITE', this.id, this.title, this, this.class);
						//if (!this.class) Aim.item.call(this).construct();//MVK waarom opnieuw construct???





						var edit = !Number(this.userID) || Number(this.userID) == Aim.client.user.id;
						//if (this.printmenu) for (var menuname in this.printmenu) {
						//	menuitem = this.printmenu[menuname];
						//	menuitem.name = menuname;
						//	menuitem.id = this.id;
						//	//menuitem.href = this.href;
						//	menuitem.item = this;
						//	//console.log('MENU ITEM ', menuname);
						//	break;


						//	//console.log('menuitem href', menuitem.href);
						//	//if (this.ref) this.printmenu[menuname].href = this.href+'/'+
						//	if (!menuitem.href) this.printmenu[menuname].onclick = menuitem.ref ? Aim.URL.objbyref(menuitem.ref).e : function (event) {
						//		if (this.menuitem.object) {
						//			if (window[this.menuitem.object]) window[this.menuitem.object].onload(this.menuitem.id);
						//			else window[this.menuitem.script] = document.body.appendTag('script', { src: this.menuitem.script, menuitem: this.menuitem, onload: function () { window[this.menuitem.object].onload(this.menuitem.id) } });
						//			return false;
						//		}
						//		if (this.menuitem.href) return true;// document.location.href = this.menuitem.href;
						//		this.menuitem.post = this.menuitem.post || {};
						//		this.menuitem.get = this.menuitem.get || {};
						//		this.menuitem.get.name = this.menuitem.name;
						//		this.menuitem.get.title = this.menuitem.title;
						//		this.menuitem.get.id = this.menuitem.id;
						//		//console.log('MENUITEM PRINT', this.menuitem.post, this.menuitem.src);
						//		//if (Aim.URL.byref())
						//		Aim.load({
						//			menuitem: this.menuitem,
						//			item: this.menuitem.item,
						//			api: this.menuitem.api ? this.menuitem.api : rpt ? this.menuitem.item.class.name + '/' + this.menuitem.id + '/' + this.menuitem.rpt + '.html' : null,
						//			src: this.menuitem.src,
						//			post: this.menuitem.post,
						//			get: this.menuitem.get,
						//			onload: OM.doc.onload
						//		});
						//	};
						//}

						var level = 3;
						var btns = colpage.btns = {
							//add: { title: "Toevoegen", hidden: !edit, onclick: this.pgedit.bind(this) },
							edit: { title: "Wijzigen", hidden: !edit, onclick: this.pgedit.bind(this) },
							fav: { title: "Favoriet", attr: this.fav ? { checked: 1 } : {}, item: this, onclick: this.favToggle },
							shop: {
								title: 'Koppel organisatie aan winkelmand', item: this, onclick: this.setShop, hidden: this.schema != 'company'
							},
							send: {
								title: 'Pagina verzenden als mailing naar alle abbonnees', hidden: true, item: this, onclick: function () {
									Aim.load({
										api: this.item.id + '/mailing', onload: function () {
											console.log(this.responseText);
											alert(this.responseText);
										}
									});
									return false;
								}
							},
							locker: {
								title: "Persoonlijk", className: !this.userID ? 'unlock' : 'lock', popupmenu: {
									personal: {
										title: "Persoonlijk", disabled: this.userID && Aim.client.user.id != this.userID, onclick: function () {
											this.set({ userID: this.userID == Aim.client.user.id ? 0 : Aim.client.user.id }, function () {
												//console.log('yyyyyyy');
												this.write();
											}.bind(this));
										}.bind(this)
									},
									group: {
										title: "Group", disabled: this.userID && Aim.client.user.id != this.userID, onclick: function () {
											this.set({ userID: this.userID == Aim.client.user.id ? 0 : Aim.client.user.id }, function () {
												//console.log('yyyyyyy');
												this.write();
											}.bind(this));
										}.bind(this)
									},
									setPublic: {
										title: "Public", className: 'row abtn icn www', disabled: this.userID && Aim.client.user.id != this.userID, onclick: function () {

											this.set({ www: this.www ^= 1 }, function () {
												//console.log('yyyyyyy');
												this.write();
											}.bind(this));
										}.bind(this)
									},
								}
							},
							//fav: { attr: Aim.fav.indexOf(this.detailID || this.id) != -1 ? { checked: 1 } : (this.attributes && this.attributes.Fav && this.attributes.Fav.value ? { checked: 2 } : {}), item: this, onclick: this.favToggle },
							del: { title: "Verwijderen", hidden: !edit, onclick: this.delete.bind(this) },
							refresh: { title: "Gegevens vernieuwen", get: { schema: get.schema, id:get.id, reload: 1, select:'*' }, onclick: Aim.Element.onclick },
							space: { className: 'r' },
							msg: { title: "Toon berichten", hidden: !this.msgCnt, onclick: msg.itemrefresh.bind(this) },
							print: {},
							printmenu: {},
							printmenu1: {
								//title: 'Print formulier', className: 'abtn icn print', item: this, popupmenu: this.printmenu, right: 0, onclick: function (event) {
								//	//event.stopPropagation();
								//	//console.log('PRINT MENU', this);
								//	if (this.menu) Aim.popup.show.call(this, event);
								//	//else if (items.printfile) items.printfile({ src: apiroot + 'form.php', post: { id: this.item.id } });
								//}
							},
							view: {
								title: 'Pagina verzenden als mailing naar alle abbonnees',
								item: this, hidden: !this.view, onclick: this.view ? this.view.onclick : null
							},
							//slide: {
							//	className: 'abtn icn slide', item: this, onclick: function () {
							//		var el = document.documentElement, rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
							//		rfs.call(el);
							//		OM.show({ sv: this.item.id });
							//	}
							//},
							//dashboard: { item: this, href: '#' + Aim.URL.stringify({ dbv: this.id }) },
							network: {
								popupmenu: {
									network: {
										title: 'Ophalen netwerk analyse', hidden: !this.printmenu, get: { folder: this.id, src: level, master: level, users: level, link: level, refby: level, child: level }, onclick: Aim.Element.onclick
									},
									showInherited: { title: 'Toon master-class', hidden: !this.srcID, item: this, onclick: function () { items.show({ id: this.item.srcID }) } },
									clone: { title: 'Overnemen class eigenschappen', hidden: !this.srcID, item: this, on: { click: function () { this.setAttribute('clone', 1, { post: 1 }); }.bind(this) } },
								},
							},
							download: {
								popupmenu: {
									exportJson: {
										title: "Export JSON",
										href: "/" + Aim.client.domain.name + "/api/" + Aim.version + "/api/build.php?download&rootID=" + this.id,
										//target: "download",
										//onclick: function (event) {
										//	//event.stopPropagation();
										//	console.log("Export JSON");
										//},
									},
								}
							},
							upload: {
								popupmenu: {
									mailimport: {
										title: 'Importeer mail uit outlook', hidden: !Aim.Aliconnector.connected, className: 'abtn icn mailimport', onclick: function () {
											external.Mailimport();
										}
									},
								}
							},
							//show3d: {
							//	title: 'Toon 3D Model', hidden: true,
							//	hidden: !this.attributes || !this.attributes.x || !this.attributes.y || !this.attributes.z || !(this.attributes.x.value || this.attributes.y.value || this.attributes.z.value),
							//	//hidden: this.schema != 'system',
							//	item: this, onclick: this.model3d,
							//},
							//revert: { disabled: !this.srcID, title: 'Revert to inherited', item: this, onclick: function () { this.item.revertToInherited(); } },
							popout: { schema: this.schema, id: this.id, uid: this.uid, onclick: Aim.openwindow },
							close: {
								title: 'Sluit formulier', onclick: function () {
									this.parentElement.parentElement.innerText = '';
									Aim.pageItem = null;
									if (OM.show) OM.show({ id: 0 });
									if (window.onWindowResize) window.onWindowResize();
								}
							},

						};
						//console.log(btns, this.btnbar, Aim.merge({}, btns, this.btnbar));

						Aim.createButtonbar(appendTag('div'), Object.assign({}, btns, this.btnbar));




						if (this.msgCnt) btns.msg.el.setAttribute('cnt', this.msgCnt);
						this.WriteHeader(this.elHdr = appendTag('div', { className: 'row header np', item: this, draggable: true, }));
						colpage.body = elPg = this.elPage = appendTag('div', { className: ['col aco pg oa', this.schema, String(this.title || '').split(' ').join('_')].join(' ') });
						this.writepage();
						if (get.msg == 1) { this.btnMsg.click(); items.show({ msg: 0 }); }

						//console.log(this.lastvisitDT, this.modifiedDT, this.modified);
						this.lastvisitDT = new Date().toISOString();
						//console.log(this.lastvisitDT,this.modifiedDT, this.modified);

						if (this.elLvLi) {
							this.elLvLi.rewrite();
							Aim.collist.elementSelect(this.elLvLi);
						}

					}
				}.bind(this))();

				//this.lastvisitDT = this.visitDT;
				//if (this.elListBody && this.elListBody.parentElement) this.writeitem(this.elListBody);

				if (window.onWindowResize) window.onWindowResize();
			},
			reindex: function (event) {
				//console.log('REINDEX', arguments.callee.caller);
				if (!this.id) return;
				//console.log('REINDEX', this.id, this.title);
				var item = this, el, hasChildren = this.children && this.children.length > 0;
				if (hasChildren != this.hasChildren) Aim.load({ put: { value: [{ id: this.id, hasChildren: this.hasChildren = hasChildren }] }, onload: function () { } });
				if (this.elLi && hasChildren) {
					var a = [];
					this.elLi.setAttribute('open', this.opened = this.opened || 0);
					this.children.sort(function (a, b) { return a.idx > b.idx ? 1 : a.idx < b.idx ? -1 : 0; });
					this.children.forEach(function (row, i) {
						if (row.idx == undefined) console.log('ERROR ROW.idx UNDEFINED,',row);
						if (row.idx != i) a.push({ id: row.id, idx: row.idx = i });
						row.appendTo(item.elUl);
						if (row.elLvLi) {
							if (Listview.items.indexOf(row) != -1) {
								row.elLvLi.parentElement.insertBefore(row.elLvLi, el || row.elLvLi.parentElement.firstChild);
								el = row.elLvLi.nextElementSibling;
							}
							else if (row.elLvLi.parentElement) {
								row.elLvLi.parentElement.removeChild(row.elLvLi);
							}
						}
					});
					//return;
					//console.log(a);
					if (a.length) Aim.load({ put: { value: a }, onload: function () { } });
				}
			},
		}
		, App.files),
	},
	createElementPage: function () {
		console.log(api[this.get.schema][this.get.id]);
		api[this.get.schema][this.get.id].write();
	},
});
if (Aim.beforeLoad) Aim.beforeLoad();


//console.log('aim loaded');
