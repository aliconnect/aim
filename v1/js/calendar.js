//document.head.appendTag('link', { rel: 'stylesheet', href: Aim.libroot +'/css/calendar.css' });



Number.prototype.pad = function (size) {
	var s = String(this);
	while (s.length < (size || 2)) { s = "0" + s; }
	return s;
}
Date.prototype.adddays = function (i) {
	var day = new Date(this);
	day.setDate(this.getDate() + i);
	return day;
}
Date.prototype.getWeek = function () {
	var d = new Date(+this);
	d.setHours(0, 0, 0);
	d.setDate(d.getDate() + 4 - (d.getDay() || 7));
	return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
}
Date.prototype.getWeekday = function () {
	return (this.getDay() + 6) % 7;
}
Date.prototype.toDateTimeString = function () {
	//    return this.getDate().pad(2) + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getFullYear() + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
	return this.getFullYear() + '-' + (this.getMonth() + 1).pad(2) + '-' + this.getDate().pad(2) + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + '.' + this.getMilliseconds().pad(3);
}
Aim.assign({
	Calendar: {
		app: [],
		dayofweek: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'],
		maand: ['Januari', 'Februarie', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
		elcalender: null,
		eldag: null,
		//init: function () {
		//    document.getElementById('nav').appendTag('button', { className: "button calender" }).addEventListener("click", this.show);
		//    this.addapp(2014, 6, 6, { name: "overleg", startDt: '2015-06-6 10:00:00' });
		//},
		show: function () {
			console.log('SHOW CAL');

			for (var i = 0, row; row = this.data[i]; i++) {
				//console.log(row.fields);
				var disiplines = { ME: '', HW: '', SW: '' };
				for (var n in disiplines) {
					if (row.startDt && row.startDt.value) {// && row.fields[n].value) {
						prow = { name: row.name + ' ' + n };
						prow.dend = new Date(row.startDt.value);
						prow.dend.setHours(16, 0, 0, 0);
						prow.dstart = new Date(prow.dend.getTime());
						prow.uren = row.fields[n].value;
						//prow.wdgn = Math.ceil(prow.uren / (8 * row.fields.FTE.value));
						for (var d = 1; d < prow.wdgn; d++) {
							prow.dstart = new Date(prow.dstart.getTime() - 24 * 60 * 60 * 1000);
							if (prow.dstart.getDay() == 0) prow.dstart = new Date(prow.dstart.getTime() - 24 * 60 * 60 * 1000);
							if (prow.dstart.getDay() == 6) prow.dstart = new Date(prow.dstart.getTime() - 24 * 60 * 60 * 1000);
						}
						prow.dstart.setHours(8, 0, 0, 0);
						//row.dgn = Math.floor(row.wdgn / 5) * 2 + row.wdgn;

						prow.left = (prow.dstart - dstart) / 60 / 60 / 1000;
						prow.width = (prow.dend - prow.dstart) / 60 / 60 / 1000;
						console.log('PLANROW', prow.dend.toISOString(), 'WD', prow.wdgn, 'D', prow.dgn, prow.upd, prow.dstart.toISOString());
						if (prow.dend > maxdate) maxdate = prow.dend;
						this.items.push(prow);
					}
				}
			}

			//if (!this.elcalender) {
			with (this.el) {
				innerHTML = '';
				//with (appendTag('div', { className: 'row aco calendar' })) {
					this.elcalender = appendTag('div', { className: "col agenda" });
					with (this.eldag = appendTag('div', { className: "col aco" })) {
						Aim.createButtonbar(appendTag('div', { className: "row top" }), this.buttons = {
							previous: {},
							next: {},
							title: {},
							today: { className: "r", },
							workweek: {},
							week: {},
							month: {},
							close: { onclick: function () { this.el.parentElement.removeChild(this.el); }.bind(this) },
						});
						//with (appendTag('div', { className: "content col", id: "contentweek" })) {
						//appendTag('div', { className: "weeks", id: "weeks" });
						//with (appendTag('div', { className: 'weekview aco oa' })) {
						this.elweekheader = appendTag('div', { className: 'week row weekheader' });
						this.elweek = appendTag('div', { className: 'row aco oa week weekbody' });
						//}
						//}
						//appendTag('span', { className: "seperator" });
					}
				//}
			}
			//this.app[pd.getFullYear()] && this.app[pd.getFullYear()][pd.getMonth()] && this.app[pd.getFullYear()][pd.getMonth()][pd.getDate()]

			this.addappdate({ name: "overleg", startDt: '2017-01-30 10:00:00', endDt: '2017-01-30 12:00:00' });
			this.addappdate({ name: "overleg", startDt: '2017-01-30 13:00:00', endDt: '2017-01-30 14:00:00' });
			this.addappdate({ name: "overleg", startDt: '2017-01-30 13:45:00', endDt: '2017-01-30 15:00:00' });
			this.addappdate({ name: "overleg", startDt: '2017-01-30 14:45:00', endDt: '2017-01-30 16:00:00' });
			this.addappdate({ name: "overleg", startDt: '2017-01-31 11:00:00', endDt: '2017-01-31 12:30:00' });
			this.addappdate({ name: "overleg", startDt: '2017-02-02 14:00:00', endDt: '2017-02-02 16:00:00' });
			//console.log(this.app);

			this.vandaag = new Date();
			this.vandaag.setHours(0, 0, 0, 0);
			//gotodate(vandaag);
			this.gotomonth(this.vandaag);
			//}
			//screenfocus({ plan_on: false, cal_on: true });
		},
		addappdate: function (afspraak) {
			afspraak.sDt = new Date(afspraak.startDt);
			afspraak.eDt = new Date(afspraak.endDt);
			var jaar = afspraak.sDt.getFullYear();
			var maand = afspraak.sDt.getMonth();
			var dag = afspraak.sDt.getDate();
			if (!this.app[jaar]) this.app[jaar] = [];
			if (!this.app[jaar][maand]) this.app[jaar][maand] = [];
			if (!this.app[jaar][maand][dag]) this.app[jaar][maand][dag] = [];
			afspraak['duur'] = (afspraak.eDt - afspraak.sDt) / 60 / 1000;
			this.app[jaar][maand][dag].push(afspraak);
		},
		addapp: function (jaar, maand, dag, afspraak) {
			if (!this.app[jaar]) this.app[jaar] = [];
			if (!this.app[jaar][maand]) this.app[jaar][maand] = [];
			if (!this.app[jaar][maand][dag]) this.app[jaar][maand][dag] = [];
			afspraak['duur'] = 1;
			this.app[jaar][maand][dag].push(afspraak);
		},
		moveelement: function () {
			var deltaY = event.clientY - mouseY;
			var deltaX = event.clientX - mouseX;
			//    mouseY = event.clientY;     // Get the horizontal coordinate
			console.log();

			if (action == 0) {
				//        dayWidth = document.getElementById("week").offsetWidth
				activeElement.style.top = Math.round((activeElementTop + deltaY) / 15) * 15 + 'px';
				console.log(dayWidth);
				activeElement.style.left = Math.floor((activeElementLeft + deltaX) / dayWidth) * dayWidth + 'px';
			}
			else if (action == 1) {
				activeElement.style.height = Math.round((activeElementHeight + deltaY) / 15) * 15 + 'px';
			}
			else if (action == 2) {
				activeElement.style.top = Math.round((activeElementTop + deltaY) / 15) * 15 + 'px';
				activeElement.style.height = Math.round((activeElementHeight - deltaY) / 15) * 15 + 'px';
			}
		},
		agendacheckmouseup: function () {
			document.removeEventListener("mousemove", this.moveelement, true);
			document.removeEventListener("mouseup", this.agendacheckmouseup, true);
			console.log(activeElement.parentElement.date.toDateTimeString());
			//console.log(activeElement.this.app.startDt);
			var d = new Date(activeElement.parentElement.date);
			d.setHours(0);
			d.setSeconds(0);
			d.setMinutes(activeElement.offsetTop);
			if (!activeElement.app) activeElement.app = new Object;
			activeElement.app.startDt = d.toDateTimeString();

			var eind = new Date(d);
			eind.setHours(0);
			eind.setSeconds(0);
			eind.setMinutes(activeElement.offsetTop + activeElement.offsetHeight);
			activeElement.app.eindDt = eind.toDateTimeString();

			console.log(activeElement.app.startDt);
			console.log(activeElement.app.eindDt);

			//var xhr = new XMLHttpRequest();
			//xhr.open("POST", "../db/itempost.php?a=postitemfield&itemId=" + activeElement.app.itemId, true);
			//params = new FormData();
			//params.append('startDt', activeElement.app.startDt);
			//params.append('eindDt', activeElement.app.eindDt);
			//xhr.onload = function (e) {
			//    console.log(this.responseText);
			//};
			//xhr.send(params);
			//return xhr;

			resizeelement = null;
			this.appcumcount();
		},
		curyear: null,
		curmonth: null,
		appcumcount: function () {
			//console.log(this.app);
			if (this.app) for (var y in this.app) {
				for (var m in this.app[y]) {
					for (var d in this.app[y][m]) {
						for (var i = 0, a; a = this.app[y][m][d][i]; i++) {
							console.log(y, m, d);
							if (a.el) {
								a.cnt = a.cnt || 1;
								a.l = a.l || 1;
								for (var j = i, a2; a2 = this.app[y][m][d][j]; j++) {
									if (a != a2) {
										//console.log(a2.sDt < a.eDt && a2.sDt > a.sDt, a2.eDt > a.sDt && a2.eDt < a.eDt, a, a2);
										if ((a2.sDt < a.eDt && a2.sDt > a.sDt) || (a2.eDt > a.sDt && a2.eDt < a.eDt)) {

											a.cnt += 1;
											a2.cnt = (a2.cnt || 1) + 1;
											a.l += 1;
											console.log(a);
										}
									}
								}
								a.el.style.width = (100 / a.cnt) + '%';
								if (a.l > 1) a.el.style.left = (100 / a.l) + '%';
							}
						}
						//console.log(this.app[y][m][d]);
					}
				}
			}
		},
		divappointment: function (name) {
			this.el = document.createElement('div');
			with (this.el) {
				className = 'appointment';

				with (this.content = appendChild(document.createElement('div'))) {
					className = 'content';
					setAttribute("contenteditable", "true");
					innerText = name;
				}
				with (appendChild(document.createElement('div'))) {
					className = 'left';
					addEventListener("mousedown", function () {
						mouseY = event.clientY;     // Get the horizontal coordinate
						mouseX = event.clientX;     // Get the horizontal coordinate
						activeElement = this.parentElement;
						action = 0;
						activeElementTop = this.parentElement.offsetTop;
						activeElementLeft = this.parentElement.offsetLeft;
						activeElementHeight = this.parentElement.offsetHeight;
						document.addEventListener("mouseup", this.agendacheckmouseup, true);
						document.addEventListener("mousemove", this.moveelement, true);
					});
				}
				with (appendChild(document.createElement('div'))) {
					className = 'start';
					addEventListener("mousedown", function () {
						mouseY = event.clientY;     // Get the horizontal coordinate
						mouseX = event.clientX;     // Get the horizontal coordinate
						this.parentElement.style.width = '100%';
						activeElement = this.parentElement;
						action = 2;
						activeElementTop = this.parentElement.offsetTop;
						activeElementLeft = this.parentElement.offsetLeft;
						activeElementHeight = this.parentElement.offsetHeight;
						document.addEventListener("mouseup", this.agendacheckmouseup, true);
						document.addEventListener("mousemove", this.moveelement, true);
					});
				}
				with (appendChild(document.createElement('div'))) {
					className = 'eind';
					addEventListener("mousedown", function () {
						mouseY = event.clientY;     // Get the horizontal coordinate
						mouseX = event.clientX;     // Get the horizontal coordinate
						activeElement = this.parentElement;
						action = 1;
						activeElementHeight = this.parentElement.offsetHeight;
						document.addEventListener("mouseup", this.agendacheckmouseup, true);
						document.addEventListener("mousemove", this.moveelement, true);
					});
				}
			}
			return this.el;
		},
		newappointment: function (e) {
			console.log('nieuw');
			if (this.innerText == '') {
				with (this.parentElement.parentElement.parentElement.appendChild(this.divappointment(''))) {
					//            value = '';
					style.top = this.offsetTop + 'px';
					this.content.focus();
					this.content.addEventListener("blur", function (e) { if (this.innerText == '') { this.parentElement.parentElement.removeChild(this.parentElement); } });
				}
			}
		},
		gotoweek: function (day) {
			//with (document.getElementById("contentweek")) {
			this.buttons.title.innerText = startdate.getDate() + '-' + startdate.adddays(6).getDate() + ' ' + this.maand[startdate.getMonth()] + ' ' + startdate.getFullYear();

			with (this.elweekheader) {
				innerText = '';
				//className = 'week row content';
				//style.flexBasis = 50 + 'px';
				//style.backgroundColor = '#EEE';

				appendChild(document.createElement('div'));
				for (var d = 0; d < 5; d++) {
					var dag = new Date(startdate);
					dag.setDate(startdate.getDate() + d);
					with (appendChild(document.createElement('div'))) {
						innerText = dag.getDate() + ' ' + this.dayofweek[dag.getWeekday()];// + ' ' + dag.toString() ;
					}
				}
			}
			with (this.elweek) {
				innerText = '';
				//console.log('WEEK');
				var pd = new Date(startdate);
				for (var d = 0; d < 6; d++) {
					var divday = appendChild(document.createElement('div'));
					divday.date = new Date(pd);
					with (divday) {
						className = 'days';
						with (appendChild(document.createElement('div'))) {
							with (appendChild(document.createElement('div'))) {
								dayWidth = offsetWidth;
								className = 'g';
								for (var i = 0; i < 48; i++) {
									with (appendChild(document.createElement('div'))) {
										if (d == 0 && i % 2 == 0) innerText = i / 2;
										addEventListener("click", this.newappointment);
									}
								}
							}
						}
						//console.log('WEEK',d);
						if (d > 0) {
							//console.log(this.app, pd.getFullYear());
							if (this.app[pd.getFullYear()] && this.app[pd.getFullYear()][pd.getMonth()] && this.app[pd.getFullYear()][pd.getMonth()][pd.getDate()]) {
								//console.log('DATE',pd.getDate());
								for (var i = 0, afspraak; afspraak = this.app[pd.getFullYear()][pd.getMonth()][pd.getDate()][i]; i++) {
									//console.log('APP',afspraak);
									this.app[pd.getFullYear()][pd.getMonth()][pd.getDate()][i].el = this.divappointment(afspraak.name);
									appendChild(this.app[pd.getFullYear()][pd.getMonth()][pd.getDate()][i].el);
									this.app[pd.getFullYear()][pd.getMonth()][pd.getDate()][i].el.app = this.app[pd.getFullYear()][pd.getMonth()][pd.getDate()][i];
									with (this.app[pd.getFullYear()][pd.getMonth()][pd.getDate()][i].el) {
										//var starttijd = new Date(afspraak.startDt);
										//var eindtijd = new Date(afspraak.eindDt);
										//var duur = afspraak.duur;

										style.top = (afspraak.sDt.getHours() * 60 + afspraak.sDt.getMinutes()) + 'px';
										//if (eindtijd) duur = (eindtijd - starttijd) / 1000 / 60;
										//console.log(afspraak.name + ' ' + duur);
										style.height = (afspraak.duur) + 'px';

										//style.width = '100px';
										//style.left = i * 100 + 'px';


									}
								}
							}
							pd.setDate(pd.getDate() + 1);
						}
					}

				}

				//            console.log(clientHeight + ' ' + scrollHeight);
				scrollTop = Math.round((scrollHeight - clientHeight) / 2);
			}
			this.appcumcount();
			//}
		},
		gotomonth: function (day) {
			//console.log('d '+day.toDateTimeString());
			firstdayofmonth = new Date(day.adddays(-day.getDate() + 1));
			//console.log('fdom '+firstdayofmonth.toDateString());
			firstdayofcalender = new Date(firstdayofmonth.adddays(-firstdayofmonth.getWeekday()));
			startdate = new Date(day.adddays(-day.getWeekday()));
			//document.getElementById("weeks").innerText = '';
			//console.log('startdate  ' + startdate.toDateTimeString());


			with (this.elcalender) {
				innerText = '';
				with (appendChild(document.createElement('div'))) {
					className = 'row top';
					with (appendChild(document.createElement('div'))) {
						className = 'content';
						innerText = month[firstdayofmonth.getMonth()] + ' ' + firstdayofmonth.getFullYear();
					}
					var e = appendChild(document.createElement('button'));
					e.className = 'abtn up';
					e.date = firstdayofmonth;
					e.addEventListener("click", function (e) {
						var d = this.date.adddays(-1);
						//console.log(d.toDateString());
						this.gotodate(d.adddays(-d.getDate() + 1));
					});
					var e = appendChild(document.createElement('button'));
					e.className = 'abtn down';
					e.date = firstdayofmonth;
					e.addEventListener("click", function (e) {
						var d = this.date.adddays(+32);
						//console.log(d.toDateString());
						this.gotodate(d.adddays(-d.getDate() + 1));
					});
				}
				with (appendTag('div')) {
					className = 'maand';
					with (appendTag('div')) for (var i = 0, d; d = [' ', 'M', 'D', 'W', 'D', 'V', 'Z', 'Z'][i]; i++) appendTag('span', { innerHTML: d });
					var pd = new Date(firstdayofcalender);
					//console.log(pd.toDateTimeString());
					while ((pd.getFullYear() * 100 + pd.getMonth()) <= (firstdayofmonth.getFullYear() * 100 + firstdayofmonth.getMonth())) {

						//            while (pd.getMonth() <= firstdayofmonth.getMonth()) {


						//with (document.getElementById("weeks")) {
						//    var ele = appendChild(document.createElement('button'));
						//    ele.innerText = pd.getDate() + '-' + pd.adddays(6).getDate() + ' ' + maand[pd.adddays(6).getMonth()];
						//    ele.newdate = new Date(pd);
						//    ele.addEventListener("click", function (e) { this.gotodate(this.newdate); });
						//}

						with (appendTag('div')) {
							with (appendTag('span')) {
								innerText = pd.getWeek();
							}
							for (var d = 0; d < 7; d++) {
								var e = appendTag('button', { className: 'abtn' });
								e.date = new Date(pd);
								with (e) {
									innerText = pd.getDate();
									if (pd.valueOf() == today.valueOf()) setAttribute("vandaag", "");
									if (pd.valueOf() >= startdate.valueOf() && pd.valueOf() <= startdate.adddays(4).valueOf()) setAttribute("selected", "");
									if (pd.getMonth() != firstdayofmonth.getMonth()) setAttribute("othermonth", "");
									if (this.app[pd.getFullYear()] && this.app[pd.getFullYear()][pd.getMonth()] && this.app[pd.getFullYear()][pd.getMonth()][pd.getDate()]) setAttribute("app", "");
									addEventListener("click", function (e) { this.gotodate(this.date); });
								}
								pd.setDate(pd.getDate() + 1);
							}
						}
					}
				}
				//with (document.getElementById("weeks")) {
				//    var ele = appendChild(document.createElement('button'));
				//    ele.innerText = 'Vandaag';
				//    ele.newdate = today;
				//    ele.addEventListener("click", function (e) { this.gotodate(this.newdate); });
				//}

			}
			this.gotoweek(day);
		},
		loadday: function (day) {
			var jaar = day.getFullYear();
			if (!this.app[jaar]) this.app[jaar] = [];
			var maand = day.getMonth();
			if (!this.app[jaar][maand]) this.app[jaar][maand] = [];
			var xhr = new XMLHttpRequest();
			var params = new FormData();
			params.append('start', '1-' + (maand + 1) + '-' + jaar);
			params.append('p', 'appointments');
			xhr.day = day;
			xhr.open('POST', '../db/details.php', true);
			xhr.onload = function (e) {
				//console.log(this.responseText);
				var data = JSON.parse(this.responseText);
				for (var i = 0, d; d = data[i]; i++) {
					var day = new Date(d.startDt);
					//console.log(day.toString());
					addapp(day.getFullYear(), day.getMonth(), day.getDate(), d);
				}
				this.gotodate(this.day);
			}
			//xhr.send(params);
		},
		gotodate: function (day) {
			//console.log(day.toDateTimeString());
			//console.log(day.getMonth());
			if (typeof this.app[day.getFullYear()] == 'undefined' || typeof this.app[day.getFullYear()][day.getMonth()] == 'undefined') this.loadday(day);
			else if (day.getFullYear() != this.curyear || day.getMonth() != curmonth) this.gotomonth(day);
			else this.gotoweek(day);
		}
	}
});

//this.show();
