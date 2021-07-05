Aim.assign(auth = {
	post: {},
	forms: {
		panelcontainer: {
			submit: function (event) {
				for (var post = auth.post, i = 0, el; el = this.elements[i]; i++) if (el.name) post[el.name] = el.value;
				//for (var i = 0, el; el = Aim.clickPath[i]; i++) if (el.id) break;
				console.log('SUBMT', post, auth.forms[Aim.elShow.id].onload);
				Aim.load({ api: 'auth/' + Aim.elShow.id, post: post, onload: auth.forms[Aim.elShow.id].onload.bind(Aim.elShow) });
				return false;
			},
		},
		login: {
			show: function () {
				console.log('requestfordata', this, get.client);
				if (get.client) Aim.wss.send({ to: { client: get.client }, state: 'loginopen', description: 'Login pagina is opgestart' });
			},
			onload: function (event) {
				console.log(event.data);
				this.getElementsByClassName('msg')[0].innerText = (auth.userID = event.data.userID) ? "" : "Dit E-mail adres is niet bekend. Probeer een ander email adres of vraag een account aan bij de beheerder van het domein.";
				for (var i = 0, el, c = document.getElementsByName('email') ; el = c[i]; i++) el.value = event.data.email;
				for (var i = 0, el, c = document.body.getElementsByClassName('userName') ; el = c[i]; i++) el.innerText = event.data.email;
				auth.post.userID = auth.userID;
				if (auth.userID) Aim.nav({ prompt: 'getpassword' });
			},
		},
		getpassword: {
			show: function () {
				if (!Aim.post.userID) Aim.nav({ prompt: 'login' });
			},
			//show: function () {
			//	this.elements.password.select();
			//},
			onload: function (event) {
				console.log('getpassword', this, event, event.data, this.data, this.responseText, document.location.origin + document.location.pathname + '?prompt=login');
				//return;
				if (Number(event.data.pwdcompare)) return document.location.href = auth.redirect_uri ? decodeURIComponent(auth.redirect_uri) : (document.location.pathname + '?prompt=login');
				else this.getElementsByClassName('msg')[0].innerText = "Incorrect wachtwoord.";
			},
			//submit: function (event) {
			//	inputpassword.type = 'password';
			//	var post = { userID: auth.userID };
			//	for (var i = 0, el; el = this.elements[i]; i++) if (el.name) post[el.name] = el.value;
			//	console.log('getpassword', post);
			//	Aim.load({
			//		api: 'auth/password', post: post, form: this, onload: function () {
			//			console.log(this.data);
			//			if (Number(this.data.pwdcompare)) return document.location.href = decodeURIComponent(auth.redirect_uri) || document.location.href;
			//			else this.form.getElementsByClassName('msg')[0].innerText = "Incorrect wachtwoord.";
			//		}
			//	});
			//	return false;
			//},
		},
		createaccount: {
			submit: function (event) {
				var post = {};
				for (var i = 0, el; el = this.elements[i]; i++) if (el.name) post[el.name] = el.value;
				console.log(post);
				//Aim.load({
				//	api: 'auth/' + this.id, post: post, form: this, onload: function () {
				//		console.log(this.data);
				//		this.form.getElementsByClassName('msg')[0].innerText = (auth.userID = this.data.userID) ? "" : "Dit E-mail adres is niet bekend. Probeer een ander email adres of vraag een account aan bij de beheerder van het domein.";
				//		for (var i = 0, el, c = document.body.getElementsByClassName('userName') ; el = c[i]; i++) el.innerText = this.data.userName;
				//		if (auth.userID) auth.prompt('Password');
				//	}
				//});
				return false;
			},
		},

		requestfordata: {
			show: function () {
				console.log('requestfordata', get.client);
				Aim.wss.send({ to: { client: get.client }, state: 'requestfordatashow' });
			},
		},
		waitforallow: {
			create: function (el) {
				with (el) {
					with (appendTag('div', { className: 'aco' })) {
						appendTag('h1', { innerText: 'We wachten op uw acceptatie' });
						this.elWelkom = appendTag('p');//, { innerText: 'Welkom '+user.userName+', u kunt het delen van uw gegevens acceptere of weigeren.' });
					}
				}
			},
			show: function () {
				this.elWelkom.innerText = 'Welkom ' + user.userName + ', u kunt het delen van uw gegevens acceptere of weigeren.';
			},
		},
		allowrequestfordata: {
			// op mobile device
			create: function (el) {
				with (el) {
					with (appendTag('div', { className: 'aco' })) {
						appendTag('h1', { innerText: 'Verzoek om informatie' });
						appendTag('p', { innerText: 'De applicate ... van ... vezrzoekt op de volgende gegevens.' });
						appendTag('p', { innerText: get.scope });
						appendTag('p', { innerText: 'U blijft eigenaar van deze gegevens. Zij worden alleen gebruikt waarvoor u deze gegevens deelt.' });
					}
					with (appendTag('div', { className: 'row btns' })) {
						appendTag('button', { innerText: "Weigeren", type: "submit", className: "button", name: "deny", onclick: function () { this.value = true; }, tabindex: -1 });
						appendTag('button', { innerText: "Delen", type: "submit", className: "button", name: "allow", onclick: function () { this.value = true; }, tabindex: -1 });
					}
				}
			},
			show: function () {
				//elMsg.innerText = 'Request for data';
				document.getElementById("canvas").style.display = 'none';
				video.style.display = 'none';
				Aim.wss.send({ to: { client: this.client = wssdata.from.client }, state: 'waitforallow' });

			},
			submit: function (event) {
				var post = { userID: auth.userID };
				for (var i = 0, el; el = this.elements[i]; i++) if (el.name) post[el.name] = el.value;
				console.log('allowrequestfordata', post);
				var state = post.allow ? 'allowrequestfordataok' : 'allowrequestfordatanok';
				//auth.prompt(state);
				Aim.wss.send({ to: { client: this.client }, state: state, post: post });

				//Aim.load({
				//	api: 'auth/' + this.id, post: post, form: this, onload: function () {
				//		this.form.getElementsByClassName('msg')[0].innerText = this.data.pwdcompare ? "" : "Incorrect wachtwoord.";
				//		if (this.data.pwdcompare) return document.location.href = decodeURIComponent(auth.redirect_uri) || document.location.href;
				//	}
				//});
				return false;
			},
		},
		allowrequestfordataok: {
			create: function (el) {
				with (el) {
					with (appendTag('div', { className: 'aco' })) {
						appendTag('h1', { innerText: 'Uw data ontvangen' });
						appendTag('p', { innerText: 'Uw keuze is verwerkt, wij danken u voor uw gegevens' });
					}
				}
			},
			show: function () {
				var values = { FirstName: 'Max', MiddleName: 'van', LastName: 'Kampen' };
				Aim.wss.send({ to: { client: this.client = wssdata.from.client }, state: 'reload' });
				Aim.wss.send({ to: { client: get.client }, state: 'datatransfered', values: values, description: 'Gegevens zijn aan u verstrekt' });
			},
		},

		allowrequestfordatanok: {
			create: function (el) {
				with (el) {
					with (appendTag('div', { className: 'aco' })) {
						appendTag('h1', { innerText: 'Uw data is niet gedeeld' });
						appendTag('p', { innerText: 'Tot onze spijt kunnen we u niet verder helpen.' });
					}
				}
			},
			show: function () {
				Aim.wss.send({ to: { client: this.client = wssdata.from.client }, state: 'login' });
				Aim.wss.send({ to: { client: get.client }, state: 'done', description: 'Gegevens zijn NIET verstrekt' });
			},
		},

		newpassword: {
			show: function (event) {
				//send mail met code
				Aim.load({
					api: 'auth/' + this.id, form: this, onload: function () {
						console.log('newpassword', this.data);
					}
				});

			},
			submit: function (event) {
				var post = { userID: auth.userID };
				for (var i = 0, el; el = this.elements[i]; i++) if (el.name) post[el.name] = el.value;
				console.log('submit newpassword code', post);
				Aim.load({
					api: 'auth/' + this.id, form: this, onload: function () {
						console.log('submit newpassword', this.data);
						auth.prompt('setpassword');
					}
				});
				return false;
			},
		},

		setpassword: {
			submit: function (event) {
				password1.type = password2.type = 'password';
			},
		},
	},



	redirect_uri: document.location.search.split('redirect_uri=').pop().split('&').shift(),
	setpassword: function () {
		auth.elMsg.innerText = "Er is een beveiligingscode per mail aan U verstuurd. Voer hieronder deze code in en uw nieuwe wachtwoord.";
		divCode.appendTag('input', { id: 'signinCode', name: 'signinCode', required: '', placeholder: 'Beveiligings code', autofocus: true }).select();
		divPassword2.appendTag('input', { id: 'password2', name: 'password2', autocomplete: 'off', type: 'password', required: true, placeholder: 'Wachtwoord herhalen' });
		elSendPassword.style.display = 'none';
	},
	submitOnload: function () {
		console.log('submitOnload', this.src, this.data);
		//console.log('submitOnload', this.data, this.src);
		auth.elMsg.innerText = '';
		if (!this.data) return auth.elMsg.innerText = 'Error: ' + this.responseText;

		if (this.data.msg) return auth.elMsg.innerText = this.data.msg;
		//console.log('submitOnload', this.src, this.post, this.method, this.responseText, this.data, divForm.elements.password);
		if (this.data.pwOk == 1) {
			divForm.innerText = 'Ogenblik, uw pagina wordt geladen.';
			console.log(decodeURIComponent(auth.redirect_uri));
			document.location.href = decodeURIComponent(auth.redirect_uri) || document.location.href;
			return;
		}
		if (this.data.userId) {
			with (auth.elEmail) {
				appendTag('button', { innerText: "<" });
				appendTag('span', { innerText: this.data.email });
			}
			auth.elCreateLink.style.display = 'none';
			//divUsername.style.display = 'none';
			elUsername.style.display = 'none';
			if (auth.div1) auth.div1.style.display = 'none';
			if (auth.div2) auth.div2.style.display = 'none';
			h1.innerText = 'Wachtwoord invoeren';
			divPassword.style.display = '';
			divPassword.autofocus = true;
			divPassword.required = true;
			divPassword.name = 'password';
			divPassword.select();
			//.appendTag('input', { id: 'password', name: 'password', autocomplete: 'off', type: 'password', autofocus: true, required: true, placeholder: 'Wachtwoord' }).select();
			elSendPassword = divExtra.appendTag('p').appendTag('a', {
				innerText: 'Ik ben mijn wachtwoord vergeten?', href: '#', onclick: function () {
					Aim.load({ api: 'auth/np', post: { username: username.value }, onload: auth.setpassword });
					return false;
				}
			});
			elAuthApp = divExtra.appendTag('p').appendTag('a', {
				innerText: 'Gebruik de Aliconnect Authenticator-Webapp', href: '#', onclick: function () {
					//Aim.load({ api: 'auth/np', post: { username: username.value }, onload: auth.setpassword });
					return false;
				}
			});
			if (this.data.pwOk == -1) auth.setpassword();
			return;
		}
	},
	randompassword: function () {
		a = [];
		for (var i = 0; i < 20; i++) {
			a.push(String.fromCharCode(48 + Math.round(74 * Math.random())));
		}
		return a.join('');
	},
	submit: function (event) {
		var c = this.elements;
		var post = {};
		for (var i = 0, e; e = c[i]; i++) if (e.name) post[e.name] = e.value;
		console.log("AUTH POST111", post);
		Aim.load({ api: 'auth', post: post, onload: auth.submitOnload });
		event.preventDefault();
		return false;
	},
	prompt: function (id, pos) {
		var elShow = Aim.elShow = document.getElementById(id), pos = pos || 'l';
		console.log('prompt', id, Aim.elShow);

		//for (var i = 0, el, c = panelcontainer.getElementsByTagName('BUTTON') ; el = c[i]; i++) el.setAttribute('disabled', true);


		for (var i = 0, el, c = panelcontainer.children ; el = c[i]; i++) {
			//console.log(el, el.id, id, el == elShow);
			if (el == elShow) {
				el.setAttribute('pos', pos = 'm');
				pos = 'r';
				continue;
			}
			el.setAttribute('pos', pos);
		}
		if (auth.forms[id] && auth.forms[id].show) auth.forms[id].show.call(elShow);
		document.getElementById('panelcontainer').scrollLeft = 0;
		if (elShow) {
			for (var i = 0, el, c = elShow.getElementsByTagName('INPUT') ; el = c[i]; i++) break;
			if (!el) for (var i = 0, el, c = elShow.getElementsByTagName('A') ; el = c[i]; i++) break;
			if (el) setTimeout(function (el) { el.focus(); if (el.select) el.select(); }, 300, el);
		}
		return elShow;

	},
	on: {
		message: function (event) {
			console.log('auth message', event.data);
			var data = wssdata = event.data;
			var elMsg = document.getElementById('divExtra');
			console.log('auth message state', data.state);
			if (document.getElementById(data.state)) auth.prompt(data.state);

			switch (data.state) {
				case 'reload':
					document.location.reload();
					break;
				case 'scanned':
					console.log('auth message state', data.state);
					document.getElementById('UserName').value = data.user.userName;
					console.log('auth message state', data.state, data.from.client, get.client);

					Aim.wss.send({ to: { client: data.from.client }, state: 'allowrequestfordata' });
					Aim.wss.send({ to: { client: get.client }, state: 'allowrequestfordata', description: 'Code is gescanned, verzoek om acceptatie' });

					console.log('auth message state', data.state);
					break;
					//case 'allowrequestfordata':
					//	//elMsg.innerText = 'Request for data';
					//	//document.getElementById("canvas").style.display = 'none';
					//	//video.style.display = 'none';
					//	//Aim.wss.send({ to: { client: data.from.client }, state: 'waitforallow' });
					//	//btnLogout.style.display = btnNext.style.display = 'none';
					//	//btnDeny.style.display = btnAllow.style.display = '';
					//	//btnDeny.onclick = function () { Aim.wss.send({ to: { client: wssdata.from.client }, state: 'deny' }); return false; };
					//	//btnAllow.onclick = function () { Aim.wss.send({ to: { client: wssdata.from.client }, state: 'allow' }); return false; };
					//	break;
					//case 'waitforallow':

					//	break;

					//case 'allow':
					//	Aim.wss.send({ to: { client: this.data.from.client }, state: 'done' });
					//	document.location.href = get.redirect_uri;
					//	break;
					//case 'deny':
					//	Aim.wss.send({ to: { client: this.data.from.client }, state: 'done' });
					//	document.location.href = get.redirect_uri;
					//	break;
					//case 'done':
					//	document.location.reload();
					//	break;
			}
		},
		connect: function (event) {
			console.log(Aim.client);
			qrcode.makeCode(Aim.client.socket.id);
		},
		init: function () {
			//document.getElementById('panelcontainer').scrollLeft = 0;
			console.log('SETTINGS', Aim.settings);


			panelcontainer.onscroll = function () { this.scrollLeft = 0; }
			if (window.screen.width > 600) document.body.style.backgroundImage = 'url("/shared/auth/i' + Math.round(Math.random() * 12) + '.JPG")';
			for (var i = 0, el, c = panelcontainer.getElementsByTagName('BUTTON') ; el = c[i]; i++) if (el.type == 'submit') {
				el.onclick = function () {
					Aim.clickPath = event.path;
				}
			}
			for (var i = 0, el, c = document.body.getElementsByTagName('FORM') ; el = c[i]; i++) {
				el.method = 'post';
				el.action = '/aim/v1/api/auth/?redirect_uri=' + document.location.href;
				el.onsubmit = auth.forms.panelcontainer.submit;
			}

			//for (var name in auth.forms) {
			//	if (document.getElementById(name)) document.getElementById(name).onsubmit = auth.forms[name].submit;
			//	//if (auth.forms[name].create) auth.forms[name].create(panelcontainer.appendTag('form', { method: 'post', action: '/aim/v1/api/auth/?redirect_uri=' + document.location.href, className: 'col aco', id: name }));
			//}


			//for (var i = 0, el, c = document.body.getElementsByTagName('FORM') ; el = c[i]; i++) if (auth.forms[el.id]) el.onsubmit = auth.forms[el.id].submit;
			if (Aim.client.user.id) {
				//alert('userId='+Aim.userId);

				//alert('json='+atob(Aim.userId));

				//user = JSON.parse(atob(Aim.userId));

				//alert('username=' + user.userName);
				document.getElementById('UserName').innerText = 'Welkom ' + Aim.client.user.name;
				//alert('doc username=' + user.userName);
			}
			auth.prompt('', 'r');
			if (!get.prompt) Aim.nav({ prompt: 'login' });
			//setTimeout(function () {
			//	console.log(get.prompt);
			//	//auth.prompt(get.prompt || 'login');
			//}, 10);

			if (get.response_type == 'code') {
				//MVK
				//authForm.action = '/aim/v1/api/auth/authorize/' + document.location.search;
				//authForm.method = 'post';
				//btnQrScan.hidden = true;
			}
			else if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				//alert('OK');
				document.getElementById("qrcode").appendTag('button', {
					innerText: 'CAM', type: 'button', onclick: function () {
						video = document.createElement("video");
						//video.style.display = '';
						video.setAttribute('playsinline', '');
						canvasElement = document.getElementById("canvas");
						//canvasElement.style.display = '';
						canvas = canvasElement.getContext("2d");

						function drawLine(begin, end, color) {
							canvas.beginPath();
							canvas.moveTo(begin.x, begin.y);
							canvas.lineTo(end.x, end.y);
							canvas.lineWidth = 4;
							canvas.strokeStyle = color;
							canvas.stroke();
						}

						navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
							video.srcObject = stream;
							video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
							video.play();
							requestAnimationFrame(tick);
						});

						function tick() {
							if (video.readyState === video.HAVE_ENOUGH_DATA) {
								canvasElement.hidden = false;
								canvasElement.height = video.videoHeight;
								canvasElement.width = video.videoWidth;
								canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
								var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
								var code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert", });
								if (code) {
									drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
									drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
									drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
									drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
									document.getElementById('divExtra').innerText = code.data;
									Aim.wss.send({ to: { client: code.data }, state: 'scanned', get: get, user: user });
									video.stop();

									return;
								}
								else {
								}
							}
							requestAnimationFrame(tick);
						}
					}
				});
			}
			else
				qrcode = new QRCode(document.getElementById("qrcode"), {
					width: 140,
					height: 140,
					//text: 'https://aliconnect.nl',
				});



			//panelcontainer.onscroll = function () {
			//	console.log('JAAA',this);
			//	this.scrollLeft = 0;
			//};
			//document.getElementById('panelcontainer').scrollLeft = 0;
			//(event) {
			//	event.preventDefault();
			//	event.stopPropagation();
			//	return false;
			//}
			//auth.prompt('Login');
			return;




			with (document.getElementById('authState')) {
				if (Aim.userID) {
					innerText = ' Welkom ' + Aim.account.Name + '.';
					if (Aim.client && Aim.client.account && Aim.client.account.id) innerText += ' U heeft een account op domein ' + Aim.client.domain.name + '.';
				}
				if (get.scope) innerText += ' Deze app wil toegang tot: ' + get.scope.split('+').join(', ');
			}


			return;
			divForm = document.getElementById('authForm');
			divForm.onsubmit = auth.submit;
			auth.elEmail = document.getElementById('userEmail');
			auth.elMsg = document.getElementById('formMessages');
			elUsername = document.getElementById('username');
			h1 = document.getElementById('formTitle');
			btnAllow = document.getElementById('btnAllow');
			btnDeny = document.getElementById('btnDeny');
			btnNext = document.getElementById('btnNext');


			Aim.load({
				get: { schema: 'Account', id: 265090 }, onload: function () {
					console.log(this.data);
				}
			});


			with (document.getElementById('authState')) {
				if (Aim.userID) {
					innerText = ' Welkom ' + Aim.account.Name + '.';
					if (Aim.client && Aim.client.account && Aim.client.account.id) innerText += ' U heeft een account op domein ' + Aim.client.domain.name + '.';
				}
				if (get.scope) innerText += ' Deze app wil toegang tot: ' + get.scope.split('+').join(', ');
			}

			auth.elCreateLink = document.getElementById('btnCreateAccount');
			divPassword = document.getElementById('password');
			divPassword2 = document.getElementById('password2');
			divExtra = document.getElementById('password2');
			if (!Aim.userName) btnLogout.style.display = 'none';


			if (get.response_type) qrcode = new QRCode(document.getElementById("qrcode"), {
				width: 100,
				height: 100,
				//text: 'https://aliconnect.nl',
			});

			btnAllow.style.display = get.scope ? '' : 'none';
			btnDeny.style.display = get.scope ? '' : 'none';
			btnNext.style.display = !get.scope ? '' : 'none';

			if (get.response_type == 'code') {
				authForm.action = '/aim/v1/api/auth/authorize/' + document.location.search;
				authForm.method = 'post';
				btnQrScan.hidden = true;
			}
			else {
				btnQrScan.onclick = function () {
					video = document.createElement("video");
					video.setAttribute('playsinline', '');
					canvasElement = document.getElementById("canvas");
					canvas = canvasElement.getContext("2d");

					function drawLine(begin, end, color) {
						canvas.beginPath();
						canvas.moveTo(begin.x, begin.y);
						canvas.lineTo(end.x, end.y);
						canvas.lineWidth = 4;
						canvas.strokeStyle = color;
						canvas.stroke();
					}

					navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
						video.srcObject = stream;
						video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
						video.play();
						requestAnimationFrame(tick);
					});

					function tick() {
						if (video.readyState === video.HAVE_ENOUGH_DATA) {
							canvasElement.hidden = false;
							canvasElement.height = video.videoHeight;
							canvasElement.width = video.videoWidth;
							canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
							var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
							var code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert", });
							if (code) {
								drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
								drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
								drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
								drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
								document.getElementById('divExtra').innerText = code.data;
								Aim.wss.send({ to: { client: code.data }, state: 'scanned', get: get, client: Aim.client });
								return;
							}
							else {
							}
						}
						requestAnimationFrame(tick);
					}
				}
			}
		}
	}
});


//if (Aim.userID && auth.redirect_uri) document.location.href = auth.redirect_uri;
