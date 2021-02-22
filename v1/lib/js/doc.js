var cookie = document.cookie ? JSON.parse('{"' + document.cookie.replace(/=/g, '":"').replace(/; /g, '","') + '"}') : {};
var get = document.location.search ? JSON.parse('{"' + document.location.search.substr(1).replace(/=/g, '":"').replace(/&/g, '","') + '"}') : {};
if (get.code) auth.getTokenFromAuthCode(get.code);

var auth = {
	authority: "http://localhost",
	tokenUrl: "/aim/v1/api/oauth2/token",
	redirect_uri: document.location.href,

	clientId: "651F38C8-9264-44E7-991B-3D78A82C2A70",
	scope: 'email name adres',
	getLoginUrl: function () {
		return this.authority + '/aim/v1/api/oauth2/authorize?response_type=code&client_id=' + this.clientId + '&redirect_uri=' + encodeURIComponent(this.redirect_uri) + '&prompt=login&scope=' + this.scope.replace(/ /g, "+");
	},
	getTokenFromAuthCode: function (authCode) {
		var formdata = new FormData();
		formdata.append('grant_type', 'authorization_code');
		formdata.append('code', authCode);
		formdata.append('redirect_uri', this.redirect_uri);
		formdata.append('client_id', this.clientId);
		var xhr = new XMLHttpRequest();
		xhr.open('post', this.authority + this.tokenUrl, true);
		xhr.send(formdata);
		xhr.onload = function () {
			console.log(this.responseText);
		}

	},
}

indexId = 0;



//srctext = "My cow /* always gives */ milk and water.";
//var re = /(.*\/\*+)(.*)(\*\/.*)/;
//var newtext = srctext.replace(re, "$2");

//console.log(newtext);

//var testRE = srctext.match("\/[\*](.*)[\*]\/");
//console.log(testRE);
//if (testRE) console.log(testRE[1]);
//a = ['c', 'b', 'A'];
//a.sort(function (a, b) { return a.localeCompare(b, 'en', { 'sensitivity': 'base' }); });
//console.log(a);
//a.sort(function (a, b) { return a.localeCompare(b, undefined, { 'sensitivity': 'base', caseFirst: "lower", }); });
//console.log(a);
//a.sort(function (a, b) { return a.localeCompare(b, undefined, { 'sensitivity': 'base', caseFirst: "lower", }); });
//console.log(a);
//a.sort(function (a, b) { return a.localeCompare(b, 'en', { sensitivity: 'case', caseFirst: "upper", numeric: "true" }); });
//console.log(a);
//a.sort(function (a, b) { return a.localeCompare(b, 'en-US', { sensitivity: 'case', caseFirst: false, numeric: "true" }); });
//console.log(a);
//a.sort(function (a, b) { return a.localeCompare(b, 'en-US', { sensitivity: 'case', caseFirst: "lower", numeric: "true" }); });
//console.log(a);
//a.sort(function (a, b) { return a.localeCompare(b, 'en', { caseFirst: "lower" }); });
//console.log(a);
//a.sort(function (a, b) { return a.localeCompare(b, 'en', { caseFirst: "upper" }); });
//console.log(a);
//a.sort(function (a, b) { return a.localeCompare(b, 'en', { caseFirst: "lower" }); });
//console.log(a);
//a.sort(function (a, b) { return a.localeCompare(b, 'en', { caseFirst: "lower" }); });
//console.log(a);
//a.sort(function (a, b) { return a.localeCompare(b, 'en', { caseFirst: "lower" }); });
//console.log(a);
//a.sort(function (a, b) { return a.localeCompare(b, 'en', { caseFirst: "lower" }); });
//console.log(a);

Aim.assign(Doc = {
	//Object: {
	//	valuesSortByName: function (object) {
	//		var a = [], b = [];
	//		for (var name in object) a.push({ name: name, value: object[name] });
	//		a.sort(function (a, b) { return a.name.localeCompare(b.name, 'en'); });
	//		a.forEach(function (row) { b.push(row.value) });
	//		return b;
	//	}
	//},
	codeText: function (par) {
		return [[par.method, [par.api, par.get ? "?" + JSON.stringify(par.get).replace(/":"/g, "=").replace(/","/g, "&").replace(/{"|"}/g, "") : ""].join(''), 'HTTP/1.1'].join(' '), par.header ? JSON.stringify(par.header).replace(/":/g, ": ").replace(/"|{|}/g, '').replace(/,/g, "\r\n") : "", JSON.stringify(par.put, null, 2)].join("\r\n")
	},
	createIndex: function () {
		elementLevel = [elementIndex = document.getElementById('index')];
		elementIndex.innerText = '';
		elementIndex.appendTag('div').appendTag('b', { className: 'ac-header', innerText: 'Table of contents' });
		var topElement = null;
		(getHeaderTags = function (element, toplevel) {
			for (var i = 0, e, c = element.children; e = c[i]; i++) {
				//console.log(e.tagName, e.innerText);
				if (['H1', 'H2', 'H3', 'H4'].indexOf(e.tagName) != -1) {
					//console.log('JAAAAAAAAAAA', e.tagName, e.innerText);
					var level = e.tagName[1], name = e.name || 'index' + indexId++;
					with (elementLevel[level - 1].appendTag('li')) {
						var indexElement = appendTag('a', { innerText: e.innerText, href: '#' + name, attr: { open: 0 }, onclick: Doc.selectIndexElement });
						topElement = topElement || indexElement;
						elementLevel[level] = appendTag('ul');
					}
					e.insertBefore(e.appendTag('a', { name: name, indexElement: indexElement }), e.firstChild);
				}
				if (toplevel<=2 && ['DIV'].indexOf(e.tagName) != -1) {
					getHeaderTags(e,toplevel+1);
				}
			}
		})(document.getElementById('content'), 1);
		window.scrollTo({ top: 0, behavior: 'smooth' });
		if (topElement) Doc.selectIndexElement.call(topElement);

	},
	createChapters: function (item) {

		//console.log(level);
		with (document.getElementById('content')) {
			//for (var title in content) {
			//elementIndex.appendTag('li', { open: 0 }).appendTag('a', { innerText: title, href: '#' + indexId });

			////OPTIE 1: 15433,15720
			//with (elementLevel[this.level - 1].appendTag('li')) {
			//	var indexElement = appendTag('a', { innerText: item.title, href: '#' + item.id, attr: { open: 0 }, onclick: selectIndexElement });
			//	elementLevel[this.level] = appendTag('ul');
			//}
			//appendTag('h' + this.level, {
			//	innerText: item.title,
			//	bookmark: appendTag('a', { name: item.id, title: item.title, level: this.level, item: item, className: "offsetAbove", indexElement: indexElement }),
			//});

			//OPTIE 2: 18260,17141
			appendTag('h' + this.level, { innerText: item.title });





			//appendTag('h' + this.level, { innerText: item.title,  });
			//var item = content[title];
			if (item.summary) appendTag('div', { className: 'intro', innerText: item.summary });
			//if (item.hasAttribute('BodyHTML'))
			if (item.BodyHTML) appendTag('div', { className: 'body', innerHTML: item.BodyHTML.replace(/"\/shared/g, '"https://aliconnect.nl/shared') });
			//console.log(item.BodyHTML);
			if (item.par) {
				with (appendTag('div', { className: 'panel' })) {
					with (appendTag('div', { className: 'tabControl' })) {
						var navTabs = appendTag('nav', { className: 'row' });
						with (appendTag('ul')) {
							//var pane = navTabs.appendTag('button', { innerText: 'Aim 1.0', pane: appendTag('div') });
							var tabOnclick = function () {
								for (var i = 0, e, c = this.parentElement.children; e = c[i]; i++) {
									e.removeAttribute('selected');
								}
								this.setAttribute('selected', '');
								console.log(this.pane);
								this.pane.parentElement.insertBefore(this.pane, this.pane.parentElement.firstChild);
							};
							with (navTabs.appendTag('span', { innerText: 'AData 1.0', pane: appendTag('li'), onclick: tabOnclick, attr: { selected: 1 } }).pane) {
								appendTag('pre').appendTag('code', { innerText: Doc.codeText({ method: item.par.method, api: item.par.api, header: { 'AData-Version': 1.0 }, get: item.par.get, put: item.par.put }) });
								appendTag('div', { className: 'row buttonBar' }).appendTag('button', {
									innerText: 'View the response', par: item.par, onclick: function () {
										this.par.header = this.par.header || {};
										delete this.par.header['OData-Version'];
										this.par.onload = response.onload;
										Aim.load(this.par);
									}
								});
							}
							with (navTabs.appendTag('span', { innerText: 'OData 4.0', pane: appendTag('li'), onclick: tabOnclick }).pane) {
								appendTag('pre').appendTag('code', { innerText: Doc.codeText({ method: item.par.method, api: item.par.api, header: { 'OData-Version': 4.0 }, get: item.par.get, put: item.par.put }) });
								appendTag('div', { className: 'row buttonBar' }).appendTag('button', {
									innerText: 'View the response', par: item.par, onclick: function () {
										this.par.header = this.par.header || {};
										this.par.header['OData-Version'] = 4.0;
										this.par.onload = response.onload;
										Aim.load(this.par);
									}
								});
							}
							with (navTabs.appendTag('span', { innerText: 'JS', pane: appendTag('li'), onclick: tabOnclick }).pane) {
								var params = { header: { 'OData-Version': 4.0 } };
								//var stringify = function (par) { return JSON.stringify(par).replace(/{"/g, "{").replace(/,"/g, ",").replace(/":/g, ":"); }

								if (item.par.get) params.get = item.par.get;
								if (item.par.post) params.post = item.par.post;
								if (item.par.put) params.put = item.par.put;
								appendTag('pre').appendTag('code', { innerText: "Aim.load(" + JSON.stringify(params, null, 2).replace(/  "/g, "  ").replace(/":/g, ":") + ");" });
							}
							with (navTabs.appendTag('span', { innerText: 'PHP', pane: appendTag('li'), onclick: tabOnclick }).pane) {
								var header = ['"Authorization: Bearer ".$_SESSION["access_token"]', '"Accept: application/json"', '"OData-Version: 4.0"'];
								if (item.par.post || item.par.put) header.push('"Content-Type: application/json"');
								var lines = [
									'$url = "https://aliconnect.nl/' + Aim.access.host.name + '/v1/api/' + (item.par.api || "") + '";',
									'$curl = curl_init($url)',
									'$headers = array(\r\n  ' + header.join(",\r\n  ") + '\r\n);',
									'curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);',
									'curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);',
									'curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);',
								];
								if (item.par.post) lines.push("$payload = '" + JSON.stringify(item.par.post) + "'", 'curl_setopt($curl, CURLOPT_POST, true);', "curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);");
								if (item.par.put) lines.push("$payload = '" + JSON.stringify(item.par.put) + "'", 'curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PATCH");', "curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);");
								lines.push('$response = curl_exec($curl);', 'curl_close($curl);');
								appendTag('pre').appendTag('code', { innerText: lines.join("\r\n") });
							}
							with (navTabs.appendTag('span', { innerText: 'PHP SOAP', pane: appendTag('li'), onclick: tabOnclick }).pane) {
								var options = ['"http://localhost/aim/v1/api/soapserver"', '"http://localhost/aim/v1/api/soapclient1asadfasd.php"', '$_SESSION["client_id"]', '$_SESSION["access_token"]'];
								var lines = [
									'$options = array(\r\n  ' + options.join(",\r\n  ") + '\r\n);',
									'$client=new SoapClient(null,$options);',
									'$response = $client->getMessage(aaa);',
								];
								if (item.par.post) lines.push("$payload = '" + JSON.stringify(item.par.post) + "'", 'curl_setopt($curl, CURLOPT_POST, true);', "curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);");
								if (item.par.put) lines.push("$payload = '" + JSON.stringify(item.par.put) + "'", 'curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PATCH");', "curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);");
								lines.push('$response = curl_exec($curl);', 'curl_close($curl);');
								appendTag('pre').appendTag('code', { innerText: lines.join("\r\n") });
							}
							//with (navTabs.appendTag('span', { innerText: 'C#', pane: appendTag('li'), onclick: tabOnclick }).pane) {
							//	appendTag('pre').appendTag('code', {
							//		innerText: [
							//			'var context = new DefaultContainer(new Uri("https://aliconnect.nl/aim/v1/api/"));',
							//			'var people = context.'+this.par.get.folder+'.Execute();',
							//		].join("\r\n")
							//	});
							//	appendTag('div', { innerHTML: 'The client library used is the <a href="https://visualstudiogallery.msdn.microsoft.com/9b786c0e-79d1-4a50-89a5-125e57475937">OData v4 Client Code Generator</a>' });
							//}
							//with (navTabs.appendTag('span', { innerText: 'C++', pane: appendTag('li'), onclick: tabOnclick }).pane) {
							//	appendTag('pre').appendTag('code', {
							//		innerText: [
							//			'auto service_context = std::make_shared<DefaultContainer>(U("https://aliconnect.nl/aim/v1/(S(34wtn2c0hkuk5ekg0pjr513b))/"));',
							//			'auto people = service_context->create_' + this.par.get.folder + '_query()->execute_query().get();',
							//		].join("\r\n")
							//	});
							//}
							with (navTabs.appendTag('span', { innerText: 'C++', pane: appendTag('li'), onclick: tabOnclick }).pane) {
								appendTag('pre').appendTag('code', {
									innerText: [
										'#include <iostream>',
										'#include <string>',
										'#include <curl/curl.h>',
										'static size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp)',
										'{',
										'	((std::string*)userp)->append((char*)contents, size * nmemb);',
										'	return size * nmemb;',
										'}',
										'int main(void)',
										'{',
										'	CURL *curl;',
										'	CURLcode res;',
										'	std::string readBuffer;',
										'	curl = curl_easy_init();',
										'	if(curl) {',
										'		curl_easy_setopt(curl, CURLOPT_URL, "https://aliconnect.nl/aim/v1/api/' + (item.par.api || '') + '");',
										'		curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);',
										'		curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);',
										'		res = curl_easy_perform(curl);',
										'		curl_easy_cleanup(curl);',
										'		std::cout << readBuffer << std::endl;',
										'	}',
										'	return 0;',
										'}'
									].join("\r\n")
								});
							}
							with (navTabs.appendTag('span', { innerText: 'Node.js', pane: appendTag('li'), onclick: tabOnclick }).pane) {
								appendTag('pre').appendTag('code', {
									innerText: [
										"var http = require('http');",
										"var serviceRoot = 'https://aliconnect.nl/aim/v1/api/';",
										"getURL(serviceRoot + '" + (item.par.schema) + "');",
										"function getURL(url) {",
										"	var body = '';",
										"	http.get(url, function (response) {",
										"		response.on('data', function (chunk) {",
										"			body+=chunk;",
										"		});",
										"		response.on('end', function () {",
										"			console.log(body);",
										"		});",
										"	});",
										"	response.on('error', function(e) {",
										"		console.log('ERROR: ' + e.message);",
										"	});",
										"}"
									].join("\r\n")
								});
							}
						}
					}
				}
			}
		}
		if (item.children) {
			item.children.sort(function (a, b) { return a.idx > b.idx ? 1 : a.idx < b.idx ? -1 : 0; });
			item.children.forEach(Doc.createChapters.bind({ level: this.level + 1 }));
		}
	},
	selectIndexElement: function () {
		for (var i = 0, e, c = elementIndex.getElementsByTagName('A') ; e = c[i]; i++) {
			e.setAttribute('open', 0);
			e.removeAttribute('selected');
		}
		for (var i = 0, e = this; e != elementIndex; i++) {
			if (e.tagName == 'LI') e.firstChild.setAttribute('open', 1);
			e = e.parentElement;
		}
		this.setAttribute('selected', '')
		this.scrollIntoViewIfNeeded(false);
		//this.scrollIntoViewIfNeeded();
	},
	response: response = {
		onload: function (body) {
			//console.log(this, event, this.getAllResponseHeaders());
			with (responsepanel.appendTag('div', { className: 'col' })) {
				appendTag('div', { innerText: 'Response' });
				appendTag('pre', { className: 'aco oa' }).appendTag('code', { innerText: this.getAllResponseHeaders() + (this.responseText[0] == "{" ? JSON.stringify(JSON.parse(this.responseText), null, 2) : this.responseText) });
				appendTag('div').appendTag('button', { innerText: 'Close', onclick: function (event) { responsepanel.innerText = ''; } });
			}
		}
	},
	keys: {
		Escape: function (event) {
			responsepanel.innerText = '';
		}
	},
	events: {
		keydown: function (event) {
			if (Doc.keys[event.key]) Doc.keys[event.key](event);
		},
		scroll: function (event) {
			Doc.navPath = Doc.navPath || document.body.appendTag('nav', { className: 'path' });
			Doc.navPath.innerText = '';
			var a = [], currentlevel = 0, currentElement = null;
			for (var i = 0, e, c = document.getElementById('content').getElementsByTagName('A') ; e = c[i]; i++) if (e.indexElement) {
				var rect = e.getBoundingClientRect();
				if (rect.top < 100) currentElement = e;
				if (rect.top > 70) break;

				var level = e.parentElement.tagName[1];
				currentlevel = level;
				a[level] = e.parentElement;
			}
			if (currentElement) Doc.selectIndexElement.call(currentElement.indexElement);


			//console.log(a, currentlevel);
			for (var i = 1; i <= currentlevel; i++) {
				Doc.navPath.appendTag('a', { innerText: a[i].innerText });
				if (i <= currentlevel - 1) Doc.navPath.appendText(' / ');
			}
			//console.log("SCROLL", window.scrollY, document.body.scrollTop, cookie.scrollTop, cookie.scrollY);
			document.cookie = "scrollY=" + window.scrollY;
		},
		init: function () {
			with (document.getElementById('indexLeft')) {
				for (var name in Doc.show) {
					(Doc.show[name].element = appendTag('li')).appendTag('a', { innerText: ' ' + name + ' ', onclick: Aim.show[name].onclick, open: 0 });
					if (Doc.show[name].oncreate) Doc.show[name].oncreate();

				}
			}
		}

	},
	buildobj: function (obj, level, path) {
		if (!obj) return;
		var objectClass = obj.objectClass || Manual.getObjectClass(obj.obj);
		if (objectClass == 'HTMLDivElement') return;
		if (['aliconnect', 'window', 'stylesheet'].indexOf(obj.name) != -1) return console.log('skip', obj.name);
		if (allobjects.indexOf(obj.obj) != -1) return console.log('REEDS GEDAAN by INDEX', obj.name);
		allobjects.push(obj.obj);
		with (document.getElementById('content')) {
			appendTag('a', { name: obj.name });
			appendTag('h' + level, { innerText: obj.name }).appendTag('small', { innerText: ": " + objectClass });
			with (appendTag('div', { className: 'row reverse' })) {
				appendTag('a', { innerText: obj.name });
				for (var parent = obj.parent; parent.name; parent = parent.parent) appendTag('a', { innerText: parent.name, href: '#' + parent.name });
			}
			if (obj.name in window && window[obj.name] == obj.obj) obj.parent = topParent;

			if (typeof obj.obj == 'function') {
				var s = String(obj.obj).replace(/\r\n\t/g, "\r\n").replace(/\t/g, '  ');

				//s = "My cow/*always gives*/milk and water.";
				var a = s.split(/\/[\*]|[\*]\//);
				if (a.length > 1) {
					appendTag('p', { innerHTML: a.splice(1, 1).shift().trim().replace(/\r\n/g, "<br>") });
					s = a.join('');
				}
				s = s.split(/\r\n/g).filter(function (el) { var el = el.trim(); return el == '' || el.substr(0, 2) == '//' || el.substr(0, 11) == 'console.log' ? false : true; }).join("\r\n");

				//var comment = s.match("\/[\*](.*)[\*]\/");
				//console.log('COMMENT',comment);
				//if (comment) appendTag('pre', { innerText: comment[1] }); 


				//var comment = s.replace(/(.*\/\*+)(.*)(\*\/.*)/, "$2");
				////var a = s.split(/\/\*|\*\//);
				////var code = s.shift();
				//if (comment) appendTag('pre', {innerText:comment});
				appendTag('code', { innerText: s })

				//appendTag('code', {
				//	innerText: 'Click to show code', obj: obj.obj, onclick: function () {
				//		this.innerText = String(this.obj).replace(/\r\n\t/g, "\r\n").replace(/\t/g, '  ');
				//	}
				//})
			}

			var objchildren = [], chapters = {
				Attribute: { title: 'Attributes', items: [] },
				Object: { title: 'Objects', items: [] },
				Function: { title: 'Functions', items: [] },
			};
			for (var name in obj.obj) if (listobj = obj.obj[name]) {
				var type = Manual.getObjectClass(listobj);
				objchildren.push({ name: name, obj: listobj, parent: obj, type: type, chapter: ['String', 'Date', 'Number', 'Array'].indexOf(type) != -1 ? 'Attribute' : 'Object' });
			}
			objchildren.sort(function (a, b) {
				return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
				return a.name.localeCompare(b.name, "en", { caseFirst: 'upper' });
			});
			objchildren.forEach(function (listobj) {
				chapters[listobj.chapter].items.push(listobj);
			});
			for (var name in chapters) {
				chapter = chapters[name];
				if (chapter.items.length) {
					if (chapter.title == 'Attributes') {
						with (appendTag('table')) {
							chapter.items.forEach(function (obj) {
								with (appendTag('tr')) {
									//console.log(obj.name,obj.obj);
									appendTag('td', { className: 'code', innerText: obj.name });
									appendTag('td', { className: 'code', innerText: obj.type });
									appendTag('td', { className: 'code', innerText: JSON.stringify(obj.obj, null, 2) });
								}
							})
						}
						continue;
					}
					chapter.items.forEach(function (listobj) {
						if (level <= 3) Doc.buildobj(listobj, level + 1, path + (path ? '.' : '') + obj.name);
					});
				}
			}
		}
	},

	//ifrm: document.body.appendTag('iframe', { style: 'display:none;' }),
	getLib: function (fname) {
		var fname = Doc.getLibList.shift();
		if (!fname) return Doc.createIndex();
		//console.log(fname);
		var ifrm = document.body.appendTag('iframe', { style: 'display:none;' });
		ifrmw = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
		ifrmw.fname = fname;
		ifrmw.document.open();
		ifrmw.document.write('<script>Aim={add:function(obj){ Aim=obj; },beforeLoad:function(){},config:{}};</script><script src="/aim/v1/lib/js/' + fname + '"></script>');
		ifrmw.addEventListener('load', function () {
			//console.log('onload', this.fname, this.Aim, this.Aim.user);
			allobjects = [];

			Doc.buildobj({ name: 'Aim', objectClass: fname, obj: this.Aim, parent: topParent = {} }, 1, '');
			//console.log(this.frameElement);
			this.frameElement.parentElement.removeChild(this.frameElement);
			Doc.getLib();
		}, true)
		ifrmw.document.close();

		//allobjects = [];
		//Manual.buildobj({ name: fname, obj: ifrmw.Aim, parent: topParent = {} }, 1, '');
		////console.log(this.frameElement);
		//document.body.removeChild(ifrm);
		//Doc.getLib();



		return;
	},

	showItemTree: function (itemId) {
		console.log('showItemTree', Aim.api.item[itemId]);
		if (Aim.api.item[itemId] && Aim.api.item[itemId].children && Aim.api.item[itemId].children.length) {
			console.log(this.data);

			Aim.api.item[itemId].children.forEach(Doc.createChapters.bind({ level: 1 }));
			Doc.createIndex();
			return;
		}
		//console.log('startLoad', dStart = new Date());
		Aim.load({
			get: { schema: 'item', id: itemId, child: 5, select: 'idx,title,subject,summary,BodyHTML' }, onload: function (event) {
				//console.log('loaded, create chapter', -dStart.valueOf() + (dStart = new Date()).valueOf());
				//console.log(this.data);
				Aim.api.item[this.get.id].children.sort(function (a, b) { return a.idx > b.idx ? 1 : a.idx < b.idx ? -1 : 0; });
				Aim.api.item[this.get.id].children.forEach(Doc.createChapters.bind({ level: 1 }));
				//setTimeout(createIndex, 1);
				//console.log('chapter created, create Index', -dStart.valueOf() + (dStart = new Date()).valueOf());
				Doc.createIndex();

				//console.log('index Created, build screen', -dStart.valueOf() + (dStart = new Date()).valueOf());
				//setTimeout(function () {
				//	console.log('build screen done', -dStart.valueOf() + (dStart = new Date()).valueOf());
				//}, 0);
				//window.scrollTo(0, cookie.scrollY);
			}
		})
	},
	showTutorial: function () {
	},
	show: {
		Site: {
			onclick: function () {
				document.getElementById('content').innerText = '';
				Aim.load({
					get: { folder: "Website", select: "title", q: "*", filter: "masterID=" + Aim.access.host.id }, onload: function () {
						itemWebsite = this.data.value.shift();
						console.log(itemWebsite);
						Doc.showItemTree(itemWebsite.id);
					}
				});
				//Doc.showItemTree();
			},
		},
		Shop: {
			onclick: function () {
				document.getElementById('content').innerText = '';
				Aim.load({
					get: { folder: Aim.access.host.id, top: 1, child: 1, top: 1, filter: "class eq 'System'", order:"idx" }, onload: function () {
						console.log(this.src, this.data.value);
						itemTopSystem = this.data.value.shift();
						Aim.load({
							get: { folder: itemTopSystem.id, top: 1, child: 1, top: 1, filter: "class eq 'System' and srcID eq masterID", order: "idx" }, onload: function () {
								document.getElementById('content').innerText = '';
								console.log(this.src, this.data.value);
								itemTopProduct = this.data.value.shift();
								Doc.showItemTree(itemTopProduct.id);
							}
						});

						//itemWebsite = this.data.value.shift();
						//console.log(itemWebsite);
						//Doc.showItemTree(itemWebsite.id);
					}
				});
				//Doc.showItemTree();
			},
		},
		Definitions: {
			onclick: function () {
				with (document.getElementById('content')) {
					innerText = '';
					//for (var name in Aim.api.definitions) Aim.api.definitions[name].name = name;
					////var classObjects = Doc.Object.valuesSortByName(Aim.api.definitions);
					//Object.values(Aim.api.definitions)
					//var classObjects = Object.values(Aim.api.definitions);
					////classObjects.sort(function (a, b) { return a.name.localeCompare(b.name); });
					//classObjects.sort(function (a, b) { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0; });


					Object.forEachSorted(Aim.api.definitions, function (obj, schemaName) {
						if (!obj.properties) return;
						appendTag('h1', { innerText: schemaName });
						appendTag('h2', { innerText: 'Properties' });
						//var attributes = obj.properties;
						//for (var attributeName in attributes) attributes[attributeName].name = attributeName;
						//attributes = Object.values(attributes);
						//attributes.forEach(function (attribute, i) { attribute.index = i; });
						////attributes.sort(function (a, b) { return a.name.localeCompare(b.name, 'en-US-u-kf-lower', { casefirst: "lower" }); });
						//attributes.sort(function (a, b) { return a.name.localeCompare(b.name, 'en'); });
						////attributes.sort(function (a, b) { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0; });
						with (appendTag('ol')) {
							Object.forEach(obj.properties, function (attribute, attributeName, i) {
								with (appendTag('li')) {
									appendTag('a', { innerText: attributeName, href: '#' + [schemaName, attributeName].join('_') });
									appendTag('span', { innerText: ":" + (attribute.type = attribute.type || "text") });
									if (attribute.placeholder && attribute.placeholder != attributeName) appendTag('span', { innerText: ' ("' + attribute.placeholder + '")' });
								}
							});
						}

						Object.forEachSorted(obj.properties, function (attribute, attributeName, index, i) {
							appendTag('h3', { innerText: attributeName, name: [schemaName, attributeName].join('_') });
							//appendTag('p', { innerText: "Attribute index: " + index });
							with (appendTag('table', { className: 'code' })) {
								var attributeProperties = [];
								//for (var propertyName in attributeProperties) attributeProperties[propertyName].name = propertyName;
								//console.log(attributeName, attributeProperties);
								//attributeProperties = Object.values(attributeProperties);
								//console.log(attributeName, attributeProperties);
								//attributeProperties.sort(function (a, b) { return a.name.localeCompare(b.name); });
								//for (var attributeProperties.forEach(function (property) {
								Object.forEachSorted(attribute, function (property, propertyName) {
									//for (var propertyName in attribute) {
									with (appendTag('tr')) {
										appendTag('td', { className: 'label', innerText: propertyName });
										appendTag('td', {
											innerText: JSON.stringify(property, function (key, value) {
												//console.log(this, key, value);
												return typeof value === 'function' ? undefined : value;
											}, 2)
										});
									}
								});
								//});
							}
						});
					});

					//appendTag('pre').appendTag('code', {
					//	innerText: JSON.stringify(Aim.api.definitions, function (key, value) {
					//		//console.log(this, key, value);
					//		return typeof value === 'function' ? undefined : value;
					//	}, 2)
					//});


					Doc.createIndex();
				}

			},
		},
		Help: {
			oncreate: function () {
				Aim.load({
					element: this.element.appendTag('ul'), get: { select: 'idx,title,subject,summary,BodyHTML', order:"idx", folder: Aim.access.host.id, child: 2, filter: "class='Helppage'" }, onload: function (event) {
						console.log(this.element);
						console.log(this.data);
						Aim.get(Aim.access.host.id).children.forEach(function (item) {
							if (item.schema != 'Helppage') return;
							with (this.element.appendTag('li')) {
								appendTag('a', {
									open: 1, innerText: item.title, item: item, onclick: function () {
										document.getElementById('content').innerText = '';
										//with (document.getElementById('content')) {
										//	innerText = '';
										//	//appendTag('h1', { innerText: 'Client' });
										//	//with (appendTag('table')) {
										//	//	for (var name in Aim.client) {
										//	//		with (appendTag('tr')) {
										//	//			appendTag('td', { innerText: name });
										//	//			if (Aim.client[name]) {
										//	//				appendTag('td', { innerText: Aim.client[name].name || '' });
										//	//				appendTag('td', { innerText: Aim.client[name].id || '' });
										//	//				appendTag('td', { innerText: Aim.client[name].uid || '' });
										//	//			}
										//	//		}
										//	//	}
										//	//}
										//	//appendTag('div').appendTag('a', { innerText: 'Auth', href: auth.getLoginUrl() });
										//}
										Doc.showItemTree(this.item.id);
									},
								})

							}
							console.log(item);
						}.bind(this));
					}
				})
			},
		},
		Libraries: {
			onclick: function () {
				with (document.getElementById('content')) {
					innerText = '';
					Doc.getLibList = ['main.js', 'app.js', 'om.js', 'site.js', 'mobile.js', 'aliconnector.js', 'upload.js', 'word.js', 'calendar.js', 'ganth.js', 'go.js', 'charts.js', 'three.js', 'doc.js', 'auth.js'];
					//Doc.getLibList = ['main.js'];
					Doc.getLib();
				}
			},
		},
		API: {
			onclick: function () {
				with (document.getElementById('content')) {
					innerText = '';
					content.forEach(Doc.createChapters.bind({ level: 1 }));
					Doc.createIndex();
				}
			},
		},
		PHP: {
			onclick: function () {
				document.getElementById('content').innerText = '';
				//Aim.load({
				//	api: "build?phplibs", onload: function () {
				//		console.log(this.data);
				this.data = 'api.php'.split(',');
				//return;
				this.data.forEach(function (fname) {
					Aim.load({
						api: "build?phplib=" + fname, fname: fname, onload: function () {
							with (document.getElementById('content')) {
								console.log(this.fname, this.data);
								appendTag('h1', { innerText: this.fname });
								for (var classname in this.data) {
									console.log(this.fname, classname);
									appendTag('h2', { innerText: classname });
									for (var methodname in this.data[classname]) {
										console.log(this.fname, classname, methodname);
										appendTag('h3', { innerText: methodname });
										var s = this.data[classname][methodname];
										var a = s.split(/\/[\*]|[\*]\//);
										if (a.length > 1) {
											appendTag('p', { innerHTML: a.splice(1, 1).shift().trim().replace(/\r\n/g, "<br>") });
											s = a.join('');
										}
										s = s.split(/\r\n/g).filter(function (el) { var el = el.trim(); return el == '' || el.substr(0, 2) == '//' || el.substr(0, 11) == 'console.log' ? false : true; }).join("\r\n");

										appendTag('code', { innerText: s });
									}
								}
							}
							Doc.createIndex();
						}
					});

				});
				//	}
				//});
			},
		},
		SQL: {
			onclick: function () {
				document.getElementById('content').innerText = '';
				Aim.load({
					api: "build?sqljson", onload: function () {
						with (document.getElementById('content')) {
							console.log(this.data);
							for (var type in this.data) {
								appendTag('h1', { innerText: type });
								for (var name in this.data[type]) {
									appendTag('h2', { innerText: name });
									if (this.data[type][name].code) {
										var s = this.data[type][name].code;
										var a = s.split(/\/[\*]|[\*]\//);
										if (a.length > 1) {
											appendTag('p', { innerHTML: a.splice(1, 1).shift().trim().replace(/\r\n/g, "<br>") });
											s = a.join('');
										}
										s = s.split(/\r\n/g).filter(function (el) { var el = el.trim(); return el == '' || el.substr(0, 2) == '--' || el.substr(0, 11) == 'console.log' ? false : true; }).join("\r\n");
										appendTag('code', { innerText: s });
									}
									if (this.data[type][name].columns) {
										with (appendTag('table')) {
											for (var columnname in this.data[type][name].columns) {
												with (appendTag('tr')) {
													appendTag('td', { className: 'label', innerText: columnname });
													appendTag('td', { innerText: this.data[type][name].columns[columnname].type });
												}
											}
										}
									}
								}
							}
							Doc.createIndex();
						}
					}
				});
			},
		},
		SQL_GEN: {
			onclick: function () {
				document.getElementById('content').innerText = '';
				Aim.load({
					api: "build?sql", onload: function () {
						with (document.getElementById('content')) {
							appendTag('h1', { innerText: 'done' });
						}
					}
				});
			},
		},
		//Tables: function () {
		//	document.getElementById('content').innerText = '';
		//	Aim.load({
		//		api: "build?tables", onload: function () {
		//			with (document.getElementById('content')) for (var tablename in this.data) {
		//				appendTag('h1', { innerText: tablename });
		//				for (var columnname in this.data[tablename].columns) {
		//					appendTag('h2', { innerText: columnname });
		//					for (var propertyname in this.data[tablename].columns[columnname]) {
		//						appendTag('td', { innerText: propertyname });
		//						appendTag('td', { innerText: this.data[tablename].columns[columnname][propertyname] });
		//					}

		//				}
		//			}
		//			Doc.createIndex();
		//		}
		//	});
		//},
		//JS: function () {
		//	//document.getElementById('content').innerText = 'Please wait, loading content from server.';
		//	document.getElementById('content').innerText = '';
		//	setTimeout(function () {
		//		with (document.getElementById('content')) {
		//			allobjects = [];
		//			Aim.Manual.buildobj({ name: 'Aim', obj: Aim, parent: topParent = {} }, 1, '');
		//			Doc.createIndex();
		//		}
		//	}, 0);
		//},
	},
});

