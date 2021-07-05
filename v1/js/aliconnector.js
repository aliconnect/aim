//console.log('ALICONNECTOR v0.2 aliconnect', aliconnect);
var app, to = null;
console.log = console.log || function () { };
//Aim.client.device = Aim.device = { id: Aim.device.id = get.deviceID || Aim.device.id || '', uid: Aim.device.uid = get.deviceUID || Aim.device.uid || '' };
var get = window.get || {}, api = window.api || { item: {}};
Aim.client = Aim.client || {};


Aim.appScript = get.script || Aim.appScript || '';
//Object.assign(Aim, get);
//console.log(Aim);
Aim.client.app = 'aliconnector';
//Aim.name = 'aliconnector';
api.item[Aim.deviceID] = {};

setchecksrvdata = function (tmsec) {
	if (to) clearTimeout(to);
	to = setTimeout(checksrvdata, tmsec);
}
printurldone = function (par) {
	//setchecksrvdata(5000);
}


//Data ontvangen 2019-05-06 09:42:52undefinedhttps://aliconnect.nl/aliconnect/aliconnector/checksrvdata{"count":0,"value":[]}

checksrvdata = function () {
	//return;
	setchecksrvdata(5000);


	//console.log('checksrvdata', Aim.client, Aim.access_token);

	Aim.load({
		src: 'https://aliconnect.nl/aim/' + Aim.version + '/api/aliconnector/checksrvdata/?dt='+new Date().toISOString(), onload: function (event) {
			//elStatus.appendTag('div',{innerText:this.src});
			var d = new Date();
			var d = (new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000)).toISOString().replace(/[T|Z]/g, ' ').split('.').shift();
			elCheckServerData.innerHTML = 'Data ontvangen ' + d + this.responseText;
			//console.log(this.data);
			if (this.data && this.data.printjob) {
				elCheckServerData.innerHTML += '<br>Printing ' + (this.data.printjob.documentname || this.data.printjob.aid);
				// Aim.Element.FramePrint = Aim.Element.FramePrint || document.body.appendTag('iframe', {
				// 	onload: function () {
				// 		Aim.Element.FramePrint.focus();
				// 		Aim.Element.FramePrint.contentWindow.print();
				// 		setchecksrvdata(4000);
				// 	}
				// });
				// Aim.Element.FramePrint.src = 'https://aliconnect.nl/aliconnect/aliconnector/printjob/' + this.data.printjob.aid;
				try {
					external.printurl('https://aliconnect.nl/aim/' + Aim.version + '/api/aliconnector/printjob/' + this.data.printjob.aid);
				} catch (err) {
					elCheckServerData.innerHTML += '<br>Error: ' + err.message;
				}
				setchecksrvdata(5000);
			}
			//else setchecksrvdata(15000);
		}
	});
}
editfiledone = function (url) {
	url = url.split('/').pop();
	Aim.messenger.send({ msg: { editfiledone: url } });
}
focusapp = function () {
	document.body.focus();
}

activitytracker = function () {
	if (aliconnector.toActivitytracker) clearTimeout(aliconnector.toActivitytracker);
	//alert(JSON.stringify(Aim.location));

	if (aliconnector.state != 'focus') {
		//aliconnector.state = 'focus';
		Aim.wss.send({ msg: { state: aliconnector.state = 'focus', ip: Aim.location.ip } });
	}
	aliconnector.toActivitytracker = setTimeout(function () {
		//aliconnector.state = 'online';
		Aim.wss.send({ msg: { state: aliconnector.state = 'online', ip: Aim.location.ip } });
	}, 5000);
}



//console.log(document.location,get);

Aim.assign(aliconnector = {
	//scripts:[],
	on: {
		load: function () {
			//console.log(Aim.scripts);
			if (Aim.scripts.length){
				document.head.appendTag('script', { type: "text/javascript", charset: "UTF-8", src: Aim.scripts.shift(), onload:arguments.callee.bind(this) });
				return;
			}
			//console.log('ALICONNECT ONLOAD11');
			with (document.body) {
				elName = appendTag('div', { innerText: '' });
				body = appendTag('div', { className: 'aco oa pages' });
				menubtns = appendTag('div', { className: 'row menubtns' });
			}
			if (get && get.username) {
				window.addEventListener('blur', function () {
					setTimeout(function () {
						external.hide();
					}, 100);
				});
			}
			//console.log(Aim);
			//console.log(Host);
			//if (Aim.appScript) {
			//	var a = Aim.appScript.split(';');
			//	script = { src: a.shift(), method: a.shift() };
			//	console.log(script);
			//	//var fnName = Aim.appScript.split(':')[1];
			//	document.head.appendTag('script', {
			//		src: script.src, method: script.method, onload: function () {
			//			console.log('loaded', Aim[this.method]);
			//			if (Aim.aliconnector) Object.assign(aliconnector.panels, Aim.aliconnector);//  && Aim[this.method].init) Aim[this.method].init();
			//			//if (fnName) {
			//			//	if (('Host' in window) && (fnName in Host)) { if ('init' in Host[fnName]) Host[fnName].init(); else Host[fnName](); }
			//			//	else if (fnName in window) window[fnName]();
			//			//}
			//			aliconnector.show();
			//		}
			//	});
			//}
			aliconnector.show();

			Aim.messenger.to = { deviceUID: Aim.deviceUID };


		},
		//blur: aliconnector.statemessage,
		//focus: aliconnector.statemessage,
	},
	// setVar: setVar = function (par) {
	// 	var values = {};
	// 	var field = opc.values[par.itemId]; //.value = par.value;
	// 	field.value = par.value;
	// 	var item = { id: field.id, values: {} };
	// 	if (field && field.name && par && par.value) item.values[field.name] = par.value;
	// 	Aim.messenger.send({ to: [Aim.client.domain.id], value: [item] });
	// 	//source: 'aliconnector', id: property.id, values: values, to: { key: Aim.key } });
	// },
	messenger: {
		onreceive: function (event) {
			var data=this.data;
			//var data = this.data, msg = data.msg;
			//console.log('onreceive', this.data);
			//elStatus.innerText=JSON.stringify(this.data);
			if(data.device && confirm('Link connector to active browser?')){
				Aim.elDeviceID.value=data.device.uid;
				Aim.elFormSettings.submit();
			}
			if(data.state && data.from.app=='om' && data.from.device==Aim.client.device.id){
				if (data.state=='disconnected') {
					document.body.style.color='red';
				}
				if (data.state=='connected') {
					document.body.style.color='green';
					if(!data.ack) Aim.messenger.send({to:{client:data.from.client},state:'connected',ack:1});
				}
			}


			if (this.data.alert) alert(this.data.alert);
			return;

			if (msg) {
				if (data.client.app == 'app' && data.client.deviceUID == Aim.messenger.sender.deviceUID) {
					if (msg.state == 'connected') Aim.messenger.send({ to: { deviceUID: Aim.messenger.sender.deviceUID }, msg: { state: aliconnector.state = 'connected', ack: true } });
					//if (msg.userName) { elName.innerText = msg.userName; aliconnector.statemessage(); }
					if (msg.userName) { elName.innerText = msg.userName; activitytracker(); }
					if (msg.userUID) { Aim.messenger.sender.userUID = msg.userUID }
					return;
				}
				if (data.target == 'rci' && data.id && data.values && window.opc && api.items[data.id] && api.items[data.id].values) for (var name in data.values) {
					//console.log(name, api.items[data.id].values);
					if (api.items[data.id].values[name] && api.items[data.id].values[name].opcItemID) {
						//console.log('RCI', api.items[data.id].values[name].opcItemID, data.values[name]);
						//document.body.appendTag('div', {innerText: api.items[data.id].values[name].opcItemID+'='+data.values[name]});
						external.opcSet(api.items[data.id].values[name].opcItemID, data.values[name]);
					}
				}
				if (msg.editfile) try { external.filedownload(msg.editfile); } catch (err) { if (elStatus) elStatus.innerText = 'Error: ' + err.message; }
				if (msg.deviceUID == Aim.deviceUID || (msg.appUID && Aim.appUID && (msg.appUID == Aim.appUID))) {
					if (msg.printurl) {
						elStatus.innerText = msg.printurl;
						try { external.printurl(msg.printurl); } catch (err) { if (elStatus) elStatus.innerText = 'Error: ' + err.message; }
					}
				}
				if (msg.deviceUID && Aim.deviceUID && msg.deviceUID == Aim.deviceUID) {
					if (msg.exec == 'mailimport') external.mailimport(App.sessionID, msg.hostID, msg.userID);
					if (msg.exec == 'contactimport') external.contactimport(App.sessionID, msg.hostID, msg.userID);
					if (msg.EditFile) external.EditFile(msg.fileId, msg.userID, msg.filename, msg.uid, msg.ext, msg.edituid);
				}
			}
		},
	},
	elStatus: elStatus = {},
	panels: panels = {
		admin: {
			title: 'Alle instellingen',
			init: function () {
				// 			iframesubmit=document.body.appendTag('iframe',{name:'submit',onload:function(){
				// console.log('IFRAME LOAD');
				// 				//document.location.reload();
				// 			}});
				//if(document.getElementById('submit'))document.getElementById('submit').onload=function(){
				//	//console.log('IFRAME LOAD');
				//				document.location.reload();
				//			}

				with (this.el) {
					elStatus = elCheckServerData = appendTag('div', { innerText: 'STATUS' });
					with (Aim.elFormSettings = appendTag('div').appendTag('form', { method: 'post', action: '/api/' + Aim.version + '/aliconnector?redirect_uri=' + encodeURIComponent(document.location.href), className: 'init' })) {
						appendTag('label', { innerText: 'Login' });
						var labels = { IP: Aim.location.ip }
						if (Aim.location.ref && Aim.location.ref.get) Object.assign(labels, { Userdomain: Aim.location.ref.get.userdomain, Username: Aim.location.ref.get.username, Computername: Aim.location.ref.get.computername, Serial: Aim.location.ref.get.serial });
						for (var name in labels) if (labels[name]) appendTag('div', { className: 'label', innerText: name }).appendTag('div').appendTag('input', { attr: { value: labels[name] || '', readonly: true } });
						Aim.elDeviceID = appendTag('div', { className: 'label', innerText: 'Device' }).appendTag('div').appendTag('input', { attr: { name: 'deviceUID', placeholder: 'Device' } });
						appendTag('div', { className: 'label', innerText: 'Key' }).appendTag('div').appendTag('input', { attr: { name: 'key', placeholder: 'Key', value: Aim.key || '' } });
						appendTag('div', { className: 'label', innerText: 'Script' }).appendTag('div').appendTag('input', { attr: { name: 'appScript', placeholder: 'Script', value: Aim.appScript} });
						appendTag('button', { innerText: 'Opslaan' });
					}
						appendTag('button', { innerText: 'Logout', onclick:function(){
							document.location.href= '/aim/' + Aim.version + '/api/auth/logout?redirect_uri=' + document.location.href;
					}});
				}
				checksrvdata();
			}
		}
	},
	// add: function (panel) {
	// 	aliconnector.panels.push(panel);
	// },
	show: function () {
		with (menubtns) {
			console.log(aliconnector.panels);
			for (var name in Aim.panels){
				var pnl = Aim.panels[name];
				pnl.name = name;
				pnl.el = body.appendTag('div', { className: 'panel' });
				pnl.elTitle = pnl.el.appendTag('label', { innerText: pnl.title });
				pnl.btn = appendTag('button', {
					pnl: pnl, onclick: pnl.show = function () {
						//var pnl = this.pnl || this;
						//console.log(aliconnector.panels,this.pnl);
						for (var name in Aim.panels) Aim.panels[name].el.style.display = 'none';
						//var c = pnl.el.parentElement.children;
						//for (var i = 0, e; e = c[i]; i++) e.style.display = 'none';
						this.pnl.el.style.display = '';
					}
				}).appendTag('div', { className: 'icn ' + pnl.name, innerText: pnl.title, });
				pnl.init();
			};
		}
		//Aim.messenger.connect();
		//Aim.messenger.send({to:{user:Aim.userID,app:'om'},aliconnector:'start',ip:Aim.ip});
	},
});

if (Aim.appScript) {
	var a = Aim.appScript.split(';');
	script = { src: a.shift(), method: a.shift() };
	//console.log(script);
	//var fnName = Aim.appScript.split(':')[1];
	//alert('ja');
	Aim.scripts.push(script.src);

	//document.body.appendTag('script', { type: "text/javascript", charset: "UTF-8", src: script.src, onload:aliconnector.show });

	//document.head.appendTag('script', {
	//	src: script.src, method: script.method, onload: function () {
	//		console.log('loaded', Aim[this.method]);
	//		if (Aim.aliconnector) Object.assign(aliconnector.panels, Aim.aliconnector);//  && Aim[this.method].init) Aim[this.method].init();
	//		//if (fnName) {
	//		//	if (('Host' in window) && (fnName in Host)) { if ('init' in Host[fnName]) Host[fnName].init(); else Host[fnName](); }
	//		//	else if (fnName in window) window[fnName]();
	//		//}
	//		aliconnector.show();
	//	}
	//});
}

if (Aim.location && Aim.location.ref && Aim.location.ref.get && Aim.location.ref.get.rci) panels.push({
	name: 'rci',
	title: 'RCI TMS',
	show: function () {
		panels.rci = this;
		//elTitle.innerText = 'RCI TMS ' + Aim.deviceID;
		Aim.table = body.appendTag('table');
	}
});
if (Aim.beforeLoad) Aim.beforeLoad();
//onload = function () { document.body.innerText = 'seeedfgs'; }
