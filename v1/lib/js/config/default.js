Aim.assign({
	definitions: {
		//modbusattribute: {
		//	masterclass: { System: {} },
		//	properties: {
		//		ReadRegisterStart: { label: "Modbus", placeholder: "ReadRegisterStart" },
		//		ReadRegisterLength: { placeholder: "ReadRegisterLength" },
		//		ReadRegister: { placeholder: "ReadRegister" },
		//	}
		//},
		Attribute: {
			header: [
				['Name'], // title = titel
				['Title'], // subject = onderwerp
				['Description'], // summary = beschrijving / samenvatting
			],
			treeTitleAttributeName: 'Name',
			attributes: {
				Name: { placeholder: "Name", label: "Attribute", idname: "name" },
				Title: { placeholder: "Title" },
				Description: { placeholder: "Description" },
				State: { placeholder: "State", idname: 'state' },
				StateMessage: { placeholder: "StateMessage" },
				//VALUES
				//Value: { placeholder: "Value", idname: "value", type: "meter", attr: { min: 200, max: 350, optimum: 230, low: 220, high: 280, unit: "°C" } },
				Value: { placeholder: "Value", },
				Quality: { placeholder: "Quality", type: "radio", options: { Valid: { title: "Valid", color: "green" }, NotValid: { title: "NotValid", color: "orange" }, CommunicationError: { title: "CommunicationError", color: "red" }, UnInitialized: { title: "UnInitialized", color: "gray" } } },

				AttributeType: {
					label: "Type", placeholder: "Attribute type", type: "select", options: AttributeTypeOption = {
						CriticalFailure: { title: "Critical Failure", color: "red" },
						NonCriticalFailure: { title: "Non Critical Failure", color: "orange" },
						Locking: { title: "Locking", color: "yellow" },
						Maintenance: { title: "Maintenance", },
						Running: { title: "Running", color: "green" },
						RunningMode: { title: "Running mode", },
						Security: { title: "Security", },
						PreWarning_1: { title: "Pre warning 1", },//count
						PreWarning_2: { title: "Pre warning 2", },//count
						PreWarning_3: { title: "Pre warning 3", },//count
						Measurement_1: { title: "Measurement 1", },//count
						Measurement_2: { title: "Measurement 2", },//count
						Measurement_3: { title: "Measurement 3", },//count
						Measurement_4: { title: "Measurement 4", },//count
						Measurement_5: { title: "Measurement 5", },//count
						MeasurementErrorFlag: { title: "MeasurementErrorFlag", },//count
						NotApplicable: { title: "Not Applicable", },
						"": { title: "NULL", },
					}
				},
				ModifiedDT: { placeholder: "Modified", idname: "modifiedDT" },
				ValueType: {
					placeholder: "Value type", type: "select", options: {
						text: { title: "String" },
						integer: { title: "Integer" },
						double: { title: "Double" },
						bool: { title: "Boolean" },
						date: { title: "Date" },
						time: { title: "Time" },
						datetime: { title: "Date and time" },
					}
				},
				//Enum: { placeholder: "Options", type: "text", options: { 0: { title: "0=Not Active|!1=Active" }, 1: { title: "0=Active|1=Not Active" } } },
				Enum: { placeholder: "Enummeration", type: "text" },
				Unit: { placeholder: "Unit", type: "text" },
				Calc: { placeholder: "Calculation function", type: "select", options: { OnlineHours: { title: "OnlineHours()" } } },

				//DisplayMin: { label: "Display", placeholder: "Min", type: "number" },
				//DisplayLow: { placeholder: "Low", type: "number" },
				//DisplayOptimum: { placeholder: "Optimum", type: "number" },
				//DisplayHigh: { placeholder: "High", type: "number" },
				//DisplayMax: { placeholder: "Max", type: "number" },

				Min: { label: "Display", placeholder: "Min", type: "number" },
				Max: { placeholder: "Max", type: "number" },
				Step: { placeholder: "Step", type: "number" },
				Optimum: { placeholder: "Optimum", type: "number" },
				Low: { placeholder: "Low", type: "number" },
				High: { placeholder: "High", type: "number" },
				Hysteresis: { placeholder: "Hysteresis", type: "number", step: "0.1" },

				//AlarmMax: { label: "Alarm", placeholder: "Low Alarm Margin", type: "number", step: "0.1" },
				//AlarmMin: { placeholder: "Low Alarm Margin", type: "number", step: "0.1" },

				//AlarmLow: { label: "Alarm", placeholder: "Low Alarm Margin", type: "number", step: "0.1" },
				//AlarmLowAttributeType: { placeholder: "Attribute type", type: "select", options: AttributeTypeOption },
				//AlarmLowCount: { placeholder: "Low Alarm Count", type: "number" },
				//AlarmLowWarning: { placeholder: "Low Warning Margin", type: "number", step: "0.1" },
				//AlarmLowWarningAttributeType: { placeholder: "Attribute type", type: "select", options: AttributeTypeOption },
				//AlarmLowWarningCount: { placeholder: "Low Warning Count", type: "number" },
				//AlarmHighWarning: { placeholder: "High Warning Margin", type: "number", step: "0.1" },
				//AlarmHighWarningAttributeType: { placeholder: "Attribute type", type: "select", options: AttributeTypeOption },
				//AlarmHighWarningCount: { placeholder: "High Warning Count", type: "number" },
				//AlarmHigh: { placeholder: "High Alarm Margin", type: "number", step: "0.1" },
				//AlarmHighAttributeType: { placeholder: "Attribute type", type: "select", options: AttributeTypeOption },
				//AlarmHighCount: { placeholder: "High Alarm Count", type: "number" },
				//AlarmHysteresis: { placeholder: "Hysteresis", type: "number", step: "0.1" },
			},
		},
		Key: {
			attributes: {
				Name: { label: "Key", placeholder: "Name", default: 1 },
				Description: { placeholder: "Description" },
				URL: { placeholder: "URL" },
				Username: { placeholder: "Username" },
				Password: { placeholder: "Password" },
			},
		},
		License: {
			attributes: {
				Name: { label: "License", placeholder: "Application name", default: 1 },
				Description: { placeholder: "Description", type: "textarea" },
				Licensekey: { placeholder: "License key" },
				Instruction: { placeholder: "Instruction", type: "div" },
			},
		},
		Alert: {
			attributes: {
				Name: { label: "Alert", placeholder: "Name", idname: "name", default: 1 },
				State: { placeholder: "State", idname: "state" },

				//Type: { placeholder: "Type", options: { message: { title: "Message" }, warning: { title: "Warnning" }, alert: { title: "Alert" } }, filter: 1, },
				Type: { placeholder: "Type", filter: 1, },
				startDT: { placeholder: "Start", type: "datetime" },
				finishDT: { placeholder: "Finish", type: "datetime" },
				Title: { placeholder: "Title" },
				Description: { placeholder: "Description" },
				Tag: { placeholder: "Tag", idname: "tag" },
				TagName: { placeholder: "Tag", idname: "tagname" },
			},
		},
		Groups: {
			name: "groups", methods: ["edit"], ids: { masterID: "Master" },
			header: [
				{},
				{},
				{}
			],
			filter: [],
			required: [],
			view: [],
			attributes: {
				Users: {
					type: "object"
				},
				Group: {
					label: "Group",
					title: "Groupname"
				},
				Master: {
					classID: 1103,
					title: "Valt onder"
				}
			}
		},
		Account: {
			title: "Persoon", className: "account", btns: [], files: {},
			attributes: {
				state: {
					label: "Persoon", type: "radio", filter: 1, send: 1, placeholder: "Functie Status", hostID: 1, options: {
						offline: {
							title: "Offline", color: "rgb(130,130,130)"
						},
						online: {
							title: "Online", color: "rgb(50,50,200)"
						},
						focus: {
							title: "Focus", color: "rgb(50,50,200)"
						},
					}
				},
				Aanhef: { label: "Persoon", placeholder: "Aanhef", options: ["De heer", "Mevrouw"] },
				Initials: { placeholder: "Initialen" },
				GivenName: { kop: 0, placeholder: "Roepnaam" },
				FirstName: { placeholder: "Voornamen volluit" },
				MiddleName: { kop: 0, placeholder: "Tussenvoegsel" },
				Surname: { kop: 0, placeholder: "Achternaam", "required": 1 },
				EmailAddresses2Address: { label: "Privé contactgegevens", placeholder: "Email", type: "email", "required": 1 },
				HomePhones0: { placeholder: "Privé mobiel", type: "tel" },
				HomePhones1: { placeholder: "Privé telefoon", type: "tel" },
				Linkedin: { placeholder: "Linkedin", type: "linkedin" },
				Twitter: { placeholder: "Twitter", type: "twitter" },
				Spouse: { placeholder: "Partner naam", classID: 1000 },
				Title: { placeholder: "Titel" },
				Birthday: { placeholder: "Geboorte datum" },
				PlaceOfBirth: { placeholder: "Geboorte plaats" },
				Anniversary: { placeholder: "Feestdag", type: "date" },

				Hobby: { placeholder: "Hobby" },
				Profession: { type: "text", placeholder: "Beroep", filter: 1 },

				HomeAddress: { label: "Privé adresgegevens", placeholder: "Privé adres", type: "address", "location": "geolocatie" },
				HomeAddressStreet: { address: "HomeAddress", addressField: "Street" },
				HomeAddressNumber: { address: "HomeAddress", addressField: "Number" },
				HomeAddressAdd: { address: "HomeAddress", addressField: "Add" },
				HomeAddressPostalCode: { address: "HomeAddress", addressField: "PostalCode" },
				HomeAddressCity: { address: "HomeAddress", filter: 1, addressField: "City", title: "Woonplaats" },
				HomeAddressTown: { address: "HomeAddress", addressField: "Town" },
				HomeAddressState: { address: "HomeAddress", addressField: "State" },
				HomeAddressCountry: { address: "HomeAddress", addressField: "Country" },
				geolocatie: { type: "hidden" },

				Toelichting: { label: "Toelichting", type: "div" },

				id: { label: "Account", placeholder: "ID", "view": 1 },
				KeyCode: { placeholder: "Druppelcode", type: "numeric" },
				createdDT: { placeholder: "Created", type: "date", disabled: 1 },
				startDT: { placeholder: "Start", type: "date" },
				endDT: { placeholder: "Deadline", type: "date" },
				contractDt: { placeholder: "Akkoord gebruikersovereenkomst", type: "date", "readonly": 1 },

				Arbeidsrelaties: { "linkclassId": 1004, "link2classId": 1002 }
			}
		},
		Contact: {
			btns: ["msg", "fav", "printmenu"], files: {}, title: "Contactpersoon", "listname": "Contactpersoon",
			apps: { mobile: {} },
			printmenu: {
				"obs": { title: "Organisation Breakdown Structure", src: '/api/' + Aim.version + '/doctree.php', post: { "flds": "FirstName,LastName" } }
			},
			sort: function (a, b) {
				return String(a.title).split(' ').pop().localeCompare(String(b.title).split(' ').pop());
			},
			row: function (row) {
				var a = String(row.title).split(' ');
				a.push('<b>' + a.pop() + '</b>');
				row.innerHTML = a.join(' ');
				//row.findstr = accentsTidy(row.title);
			},
			header: [
				'{GivenName} {FirstName} {MiddleName} {Surname}',
				'{Department} {FirstName} {MiddleName} {Surname}',
				'{GivenName} {FirstName} {MiddleName} {Surname}',
			],
			attributes: {
				state: {
					label: "Account", type: "radio", filter: 1, send: 1, placeholder: "Functie Status", hostID: 1, options: {
						"offline": { title: "Offline", color: "rgb(130,130,130)" },
						"online": { title: "Online", color: "rgb(50,50,200)" },
						"focus": { title: "Focus", color: "rgb(50,50,200)" },
					}
				},
				Fav: { placeholder: "Fav", type: "hidden" },

				Initials: { label: "Contactpersoon", placeholder: "Initialen" },
				GivenName: { placeholder: "Roepnaam" },
				FirstName: { placeholder: "Voornamen volluit" },
				MiddleName: { placeholder: "Tussenvoegsel" },
				Surname: { placeholder: "Achternaam" },

				Company: { label: "Organisatie", placeholder: "Organisatie", classID: 1002, idname: "masterID" },
				CompanyName: { placeholder: "Organisatie naam" },
				OfficeLocation: { placeholder: "Site/Vestiging" },
				Department: { placeholder: "Afdeling", filter: 1, classID: 1007 },
				Manager: { placeholder: "Manager", classID: 1004 },
				AssistantName: { placeholder: "Assistent", hostID: 1, classID: 1004 },
				//"Company": { placeholder: "Organisatie", filter: 1, classID: 1002, idname: "fromID" },

				JobTitle: { label: "Functie", placeholder: "Functie titel", filter: 1 },
				startDT: { placeholder: "Start datum", type: "date" },
				finishDT: { placeholder: "Eind datum", type: "date" },
				Arbeidsrelatie: { placeholder: "Contract", type: "radio", filter: 1, options: { "werknemer": { title: "Werknemer", color: "rgb(112,48,160)" }, "interim": { title: "Interim", color: "rgb(112,48,160)" }, "detachering": { title: "Detachering", color: "rgb(0,176,240)" } } },

				BusinessPhones0: { label: "Contactgegevens", placeholder: "Company Phone", type: "tel", hostID: 1 },
				BusinessHomePage: { placeholder: "Company Website", type: "url", hostID: 1 },
				EmailAddresses1Address: { placeholder: "Company Email", type: "email", hostID: 1 },

				MobilePhone1: { placeholder: "Contact Mobile", type: "tel" },
				BusinessPhones1: { placeholder: "Contact Phone", type: "tel" },
				EmailAddresses0Address: { placeholder: "Contact Email", type: "email", "rights": "3" },

				//"PersonalNotes": { placeholder: "Notities persoonlijk", type: "textarea", user: "user", "rights": "1" },
				//"GroupNotes": { placeholder: "Notities groep", type: "textarea", user: "group", "rights": "2" },
				//"DomainNotes": { placeholder: "Notities domein", type: "textarea", "rights": "3" },
				//"DomainPublicNotes": { placeholder: "Notities groep aan publiek", type: "textarea", "www": 1, "rights": "3" },
				//"DomainPublicNotesOverwrite": { placeholder: "Notities groep aan publiek overschrijfbaar", type: "textarea", "rights": "2" },
				//"PublicNotes": { placeholder: "Notities publiek", type: "textarea" },

				//"CompanyName": { label: "Organisatie", placeholder: "Organisatie naam", hostID: 1 },
				//"OfficeLocation": { placeholder: "Vestiging", filter: 1, hostID: 1 },

				BusinessAddress: { placeholder: "Vestigingsadres", type: "address", location: true },
				//"BusinessAddressStreet": { address: "BusinessAddress", addressField: "Street" },
				//"BusinessAddressNumber": { address: "BusinessAddress", addressField: "Number" },
				//"BusinessAddressAdd": { address: "BusinessAddress", addressField: "Add" },
				//"BusinessAddressPostalCode": { address: "BusinessAddress", addressField: "PostalCode" },
				//"BusinessAddressCity": { address: "BusinessAddress", filter: 1, title: "Plaats", addressField: "City" },
				//"BusinessAddressTown": { address: "BusinessAddress", addressField: "Town" },
				//"BusinessAddressState": { address: "BusinessAddress", addressField: "State" },
				//"BusinessAddressCountry": { address: "BusinessAddress", addressField: "Country" },
				//"geolocatie": { type: "hidden" },

				OtherAddress: { placeholder: "Post adres", type: "address" },
				//"OtherAddressStreet": { address: "PostAddress", addressField: "Street" },
				//"OtherAddressNumber": { address: "PostAddress", addressField: "Number" },
				//"OtherAddressAdd": { address: "PostAddress", addressField: "Add" },
				//"OtherAddressPostalCode": { address: "PostAddress", addressField: "PostalCode" },
				//"OtherAddressCity": { address: "PostAddress", addressField: "City" },
				//"OtherAddressTown": { address: "PostAddress", addressField: "Town" },
				//"OtherAddressState": { address: "PostAddress", addressField: "State" },
				//"OtherAddressCountry": { address: "PostAddress", addressField: "Country" },

				EmailAddresses2Address: { label: "Privé contactgegevens", placeholder: "Email", type: "email", "state": "personal" },
				HomePhones0: { placeholder: "Privé mobiel", type: "tel" },
				HomePhones1: { placeholder: "Privé telefoon", type: "tel" },
				SpouseName: { placeholder: "Partner naam" },
				Title: { placeholder: "Titel" },
				Birthday: { placeholder: "Geboorte datum", type: "date" },

				HomeAddress: { placeholder: "Thuis adres", type: "address" },
				//"HomeAddressStreet": { address: "HomeAddress", addressField: "Street" },
				//"HomeAddressNumber": { address: "HomeAddress", addressField: "Number" },
				//"HomeAddressAdd": { address: "HomeAddress", addressField: "Add" },
				//"HomeAddressPostalCode": { address: "HomeAddress", addressField: "PostalCode" },
				//"HomeAddressCity": { address: "HomeAddress", addressField: "City" },
				//"HomeAddressTown": { address: "HomeAddress", addressField: "Town" },
				//"HomeAddressState": { address: "HomeAddress", addressField: "State" },
				//"HomeAddressCountry": { address: "HomeAddress", addressField: "Country" },

				AfspraakDatum: { label: "Planning", placeholder: "Volgend overleg", user: "host", type: "date" },
				AfspraakTijd: { placeholder: "Starttijd", user: "host", type: "time" },
				AfspraakOnderwerp: { placeholder: "Onderwerp", user: "host", type: "textarea" },

				ResourceName: { label: "Resource settings", placeholder: "Resource name", idname: "keyname" },
				ResourceType: { placeholder: "Resource type" },
				ResourceAvail: { placeholder: "Beschikbaarheid", unit: "FTE" },
				ResourcePlan: { placeholder: "Planbaar", unit: "FTE" },
				verlof: { placeholder: "Verlof", type: "textarea" },

				Gebruiker: { label: "Account", placeholder: "User", class: "account", idname: "toID" },
				groupID: { placeholder: "Usergroup", type: "text", class: "groups", },
				//"aliconnectService": { placeholder: "aliconnectService" },
			}
		},
		Company: {
			btns: ["msg"], files: {}, className: "company", title: "Organisatie",
			childClasses: [{ title: "Company" }, { title: "Contact" }],
			onpost: function () {
				//console.log('ONPOST');
				if (Aim.client.domain.id == 1) this.postfields.www = 1;
			},
			attributes: {
				//files: { type: "files" },
				Keyname: { label: "Organisatie", placeholder: "Keyname", idname: "keyname" },
				Parent: { placeholder: "Onderdeel van", schema: "company", idname: "masterID" },
				//"Company": { placeholder: "Public company", classID: "1002", idname: "srcID", hostID: 1 },
				//Title: { placeholder: "Title", default: 1 },

				CompanyName: { placeholder: "Organisation", default: 1 },
				OfficeLocation: { placeholder: "Site" },
				Department: { placeholder: "Department" },

				BusinessPhones0: { placeholder: "Telefoon", type: "tel" },
				BusinessHomePage: { placeholder: "Website", type: "url" },
				EmailAddresses1Address: { placeholder: "Business Email", type: "email" },
				CompanyDescription: { placeholder: "Company Description", type: "textarea" },
				Activiteiten: { placeholder: "Company Activity", type: "textarea" },

				CompanyFax: { placeholder: "Company Fax", type: "tel", hostID: 0 },
				CompanyEmail: { placeholder: "Company Email", type: "emailaddress", address: { type: "email" }, Name: {}, hostID: 0 },
				CompanyEmailSales: { placeholder: "Company Email Verkoop", type: "email" },
				CompanyEmailPurchase: { placeholder: "Company Email Inkoop", type: "email" },
				CompanyEmailService: { placeholder: "Company Email Service", type: "email" },
				CompanyEmailInvoice: { placeholder: "Company Email Facturen", type: "email" },

				BusinessAddress: { placeholder: "Vestigingsadres", type: "address", location: "geolocatie" },
				BusinessAddressStreet: { address: "BusinessAddress", addressField: "Street" },
				BusinessAddressNumber: { address: "BusinessAddress", addressField: "Number" },
				BusinessAddressAdd: { address: "BusinessAddress", addressField: "Add" },
				BusinessAddressPostalCode: { address: "BusinessAddress", addressField: "PostalCode" },
				BusinessAddressCity: { address: "BusinessAddress", filter: 1, title: "Plaats", addressField: "City" },
				BusinessAddressTown: { address: "BusinessAddress", addressField: "Town" },
				BusinessAddressState: { address: "BusinessAddress", addressField: "State", filter: 1 },
				BusinessAddressCountry: { address: "BusinessAddress", addressField: "Country" },

				CompanyEmailInvoice1: { placeholder: "Company Email Facturen", type: "email" },
				CompanyEmailInvoice2: { placeholder: "Company Email Facturen", type: "email" },
				CompanyEmailInvoice3: { placeholder: "Company Email Facturen", type: "email" },

				geolocatie: { type: "text" },
				geolocatie2: { type: "text" },

				OtherAddress: { placeholder: "Post adres", type: "address" },
				OtherAddressStreet: { address: "PostAddress", addressField: "Street" },
				OtherAddressNumber: { address: "PostAddress", addressField: "Number" },
				OtherAddressAdd: { address: "PostAddress", addressField: "Add" },
				OtherAddressPostalCode: { address: "PostAddress", addressField: "PostalCode" },
				OtherAddressCity: { address: "PostAddress", addressField: "City" },
				OtherAddressTown: { address: "PostAddress", addressField: "Town" },
				OtherAddressState: { address: "PostAddress", addressField: "State" },
				OtherAddressCountry: { address: "PostAddress", addressField: "Country" },

				KvKnr: { label: "Basisgegevens", placeholder: "KvK nummer", idname: "keyid", type: "text" },
				KvKvestigingsnr: { placeholder: "Vestigingsnr" },
				KvKinschrijving: { placeholder: "Inschrijving" },
				KvKdatum: { placeholder: "Datum" },
				Branche: { placeholder: "Branche", filter: 1 },
				Hoofdcategorie: { placeholder: "Hoofdcategorie", filter: 1 },
				Categorie: { placeholder: "Categorie", filter: 1 },
				Subcategorie: { placeholder: "Subcategorie", filter: 1 },
				BTWnr: { placeholder: "BTW nummer" },
				IBAN: { placeholder: "IBAN nummer" },
				BIC: { placeholder: "BIC nummer" },
				CEO: { placeholder: "CEO" },

				filterproperties: { placeholder: "Filter eigenschappen", type: "textarea", prop: 1 },
				properties: { placeholder: "Extra eigenschappen", type: "textarea", prop: 2 },

				startDT: { label: "Planning", placeholder: "Volgend overleg", type: "date" },
				StartTijd: { placeholder: "Starttijd", user: "host", type: "time" },
				endDT: { placeholder: "Deadline", type: "date" },
				finishDT: { placeholder: "Gereed", type: "date" },
				Historie: { placeholder: "Historie", type: "div" },
				Aandachtspunten: { placeholder: "Actueel", type: "div" },

				AccountManager: { label: "Sales", placeholder: "Account Manager", classID: "1004", filter: 1 },

				DebNr: { label: "Customer", placeholder: "Debiteur nummer", user: "host" },
				//"keyname: { placeholder: "Klantcode", user: "host", idname: "keyname" },
				FactuurKorting: { placeholder: "Factuur korting", unit: "%", user: "host" },
				VrachtKost: { placeholder: "Vracht kosten", unit: "€", user: "host" },

				BtwProc: { placeholder: "BTW Percentage", unit: "%", user: "host" },
				DebSaldo: { placeholder: "Debiteur Saldo", user: "host" },
				DebLastOrder: { placeholder: "Laatste order", unit: "Maand", readonly: 1, filter: 1 },
				DebYearOrder: { placeholder: "Jaar bestelling", unit: "k€", readonly: 1, filter: 1 },
				DebState: {
					type: "radio", filter: 1, placeholder: "State", user: "host", options: {
						customer: { title: "Klant", color: "rgba(0,255,0,1)" },
						hot: { title: "Heet", color: "rgba(0,255,0,0.6)" },
						warm: { title: "Warm", color: "rgba(0,255,0,0.2)" },
						cold: { title: "Koud", color: "rgba(0,0,255,0.4)" },
						frozen: { title: "IJskoud", color: "rgba(0,0,255,0.6)" },
						stopped: { title: "Gestopt", color: "rgba(0,0,255,0.4)" },
						old: { title: "Oud", color: "rgba(0,0,255,0.2)" },
						prospect: { title: "Prospect", color: "rgba(0,0,255,1)" }
					}
				},

				CredNr: { label: "Supplier", placeholder: "Crediteur nummer", user: "host" },
				CredSaldo: { placeholder: "Crediteur Saldo", user: "host" },
				CredState: {
					type: "radio", filter: 1, placeholder: "State", user: "host", options: {
						customer: { title: "Klant", color: "rgba(0,255,0,1)" },
						hot: { title: "Heet", color: "rgba(0,255,0,0.6)" },
						warm: { title: "Warm", color: "rgba(0,255,0,0.2)" },
						cold: { title: "Koud", color: "rgba(0,0,255,0.4)" },
						frozen: { title: "IJskoud", color: "rgba(0,0,255,0.6)" },
						stopped: { title: "Gestopt", color: "rgba(0,0,255,0.4)" },
						old: { title: "Oud", color: "rgba(0,0,255,0.2)" },
						prospect: { title: "Prospect", color: "rgba(0,0,255,1)" }
					}
				},

				//id: { label: "aliconnect", placeholder: "Company ID", readonly: 1 },
				Owner: { placeholder: "Owner", schema: "Contact", idname: "userID" },
				hostName: { placeholder: "Host", idname: "keyname" },
				//"domain: { placeholder: "Domain" },
				//"accountPrice: { placeholder: "Account Price" },
				//"baseColor: { placeholder: "Base color" },
				//"slogans: { placeholder: "Slogans", type: "textarea" },
				placeid: { placeholder: "Place ID" },
				purchaseref: { placeholder: "aliconnect inkoop opdracht" },

				Employees: { label: "Organisatie", linkclassID: 1004, link2classID: 1000 },
				ASM: { placeholder: "Account Sales Manager", classID: 1004 },
				SalesSupport: { placeholder: "Sales Support", classID: 1004 },
				SalesSupport2: { placeholder: "Sales Support 2", classID: 1004 },
				Cluster: { placeholder: "Cluster" },
			}
		},
		Department: {
			title: "Department", "name": "department", "methods": [
						"msg",
						"fav"
			],
			ids: {
				"fromID": "Company"
			},
			header: [
				{},
				{},
				{}
			],
			filter: [],
			required: [],
			view: [],
			attributes: {
				users: {
					type: "object"
				},
				files: {
					type: "object"
				},
				state: {
					label: "Department",
					options: {
						"actief": {
							title: "Actief",
							color: "rgb(50,50,200)"
						},
						"nonactief": {
							title: "Non actief",
							color: "rgb(130,130,130)"
						}
					},
					type: "radio",
					title: "Functie Status"
				},
				Department: {
					title: "Afdeling"
				},
				Company: {
					classID: 1002,
					title: "Organisatie"
				},
				Master: {
					classID: 1007,
					title: "Onderdeel van"
				},
				Manager: {
					classID: 1004,
					title: "Manager"
				}
			}
		},
		Task: {
			btns: ["msg", "fav", "edit", "printmenu"], childClasses: [1162], files: {},
			printmenu: {
				ptl: {
					title: "Project Task List",
					onclick: function (event) {
						//Aim.Document.create({
						//	el: document.body, root: this.item, onload: function () {
						//		console.log(this.data, this.responseText);
						//		return;
						//		this.ulIndex = this.elIndex.appendTag('ul', { level: 1 });
						//		EM.createElementSystem(this.root, 0, { list: this.ulIndex });
						//		Aim.run = true;
						//		//Aim.wss.connect();
						//		//EM.onitemchange(api.items[this.data.id]);

						//		//console.log('JAAAAAAAAAAAAAAAAA');
						//	}
						//});
						Aim.Document.create({
							item: this.item,
							par: {
								get: { schema: this.item.schema, id: this.item.id, child: 8, src: 10, link: 10, refby: 10, select: '*', selectall: 1 }, onload: function (event) {
									console.log('PTL', event.par.src, event.data, this.el);
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
												for (var name in item.attributes) if (value = item.getAttribute(name, true)) with (appendTag('tr')) {
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
								}.bind(Aim.Document)
							}
						});



						//Aim.load({
						//	get: { id: this.item.id, select: '*' }, onload: function () {

						//	}
						//});
						//console.log('DOC PTL',this.item);
						//Aim.Document.create({ el: collist, item: this.item });
					},
					//object: 'ptl',
					//src: '/api/' + Aim.version + '/doctree.php',
					//post: {
					//	"flds": "Brand,Product,Model,Type,Serie,Water,Length,Width,Height,InstallLength,InstallWidth,InstallHeight"
					//}
				},
			},
			apps: { mobile: {} },

			onadd: function () {
				this.ownerID = Aim.client.user.id;
				this.startDT = new Date().toISOString();
				this.endDT = new Date().toISOString();
				this.state = 'input';
				this.prio = 'normal'
			},
			construct: function () {
				//console.log('construct task');
			},
			attributes: {
				State: {
					label: "Task", filter: 1, placeholder: "State", options: {
						sales: { title: "Sales", color: "rgb(112,48,160)" },
						option: { title: "Sales", color: "orange" },
						pe: { title: "PE Input", color: "rgb(0,176,240)" },
						engineering: { title: "Engineering", color: "orange" },
						doing: { title: "Doing", color: "green" },
						output: { title: "Output", color: "rgb(0,176,240)" },
						hold: { title: "Hold", color: "blue" },
						done: { title: "Done", color: "gray" },
						scp: { title: "SCP", color: "orange" },
						bb: { title: "BB", color: "rgb(117,113,113)" },
						gereed: { title: "Gereed", color: "rgb(255,0,0)" },
						assem: { title: "Assembly", color: "rgb(172,185,202)" },
						petest: { title: "Test", color: "rgb(255,51,153)" },
						pex: { title: "Leeg", color: "rgb(200,200,200)" },
						x: { title: "Vervallen", color: "rgb(200,200,200)" },
						nowork: { title: "Geenwerk", color: "rgb(200,200,200)" },
						shipping: { title: "Shipping", color: "orange" },
						installation: { title: "Installation", color: "orange" },
						installed: { title: "Installed", color: "orange" },
					},
				},
				CreatedDT: { placeholder: "Created", type: "date", disabled: 1, },
				StartDT: { placeholder: "Start", type: "date", },
				EndDT: { placeholder: "Deadline", type: "date", },
				FinishDT: { placeholder: "Gereed", type: "date", },
				Keyname: { placeholder: "Keyname", idname: "keyname" },
				KeyID: { placeholder: "KeyID", idname: "keyID" },
				SourceID: { placeholder: "SourceID", idname: "sourceID" },
				Prio: {
					type: "radio", filter: 1, placeholder: "Prioriteit", options: {
						"low": { title: "Laag", color: "yellow" },
						"normal": { title: "Normaal", color: "orange" },
						"high": { title: "Hoog", color: "red" }
					},
				},
				Type: {
					type: "radio", filter: 1, placeholder: "Type", options: {
						"ewr": { title: "EWR", color: "yellow" },
						"csp": { title: "CSP", color: "orange" },
						"todo": { title: "TODO", color: "red" },
					},
				},
				Source: { placeholder: "Derived from", classID: 1162, idname: "srcID" },
				Master: { placeholder: "Part of", classID: 1162, idname: "masterID" },

				Title: { placeholder: "Titel", default: true },
				Owner: { placeholder: "Eigenaar", classID: 1004, filter: 1, idname: "ownerID" },
				System: { placeholder: "System", classID: 2107, idname: "toID" },

				Customer: { placeholder: "Customer", classID: 1002, idname: "fromID" },
				CompanyName: { label: "Quote", placeholder: "Company name" },
				OfficeLocation: { placeholder: "Site" },
				Department: { placeholder: "Department" },

				//state: {
				//    type: "radio", filter: 1, placeholder: "State", options: {
				//        "create": { title: "Create", color: "rgb(112,48,160)" },
				//        "sales": { title: "Sales", color: "rgb(0,176,240)" },
				//        "input": { title: "Input", color: "rgb(0,176,240)" },
				//        "doing": { title: "Doing", color: "green" },
				//        "output": { title: "Output", color: "rgb(0,176,240)" },
				//        "hold": { title: "Hold", color: "blue" },
				//        "cancel": { title: "Vervallen", color: "#ccc" },
				//        "done": { title: "Done", color: "gray" }
				//    },
				//},

				//Master: { placeholder: "Deeltaak van", idname: "masterID", classID: 1162, },
				//keyname: { placeholder: "Keyname", idname: "keyname" },
				//Source: { placeholder: "Derived from", classID: 1002, idname: "srcID" },
				//Master: { placeholder: "Part of", classID: 1002, idname: "masterID" },




				//Project: { classID: 1177, filter: 1 },
				//System: { classID: 2107, filter: 1 },
				Subject: { placeholder: "Onderwerp", type: "textarea", },
				Vraagstelling: { placeholder: "Vraagstelling", type: "div", },
				Uitwerking: { placeholder: "Uitwerking", type: "div", },
				Department: { placeholder: "Department", classID: 1007, filter: 1 },
				ResourceType: {
					label: "Resource", placeholder: "Resource type", filter: 1, type: "radio", options: {
						"me": { title: "Mechanical", color: "rgb(112,48,160)" },
						"hw": { title: "Hardware", color: "rgb(112,48,160)" },
						"sw": { title: "Software", color: "rgb(112,48,160)" },
						"se": { title: "System", color: "rgb(112,48,160)" },
						"le": { title: "Lead", color: "rgb(112,48,160)" }
					}
				},
				Calc: { label: "Work", placeholder: "Calculatie uren", type: "number", unit: "h", },
				Work: { placeholder: "Nog uit te voeren werk uren", type: "number", unit: "h", },
				Voltooid: { placeholder: "Percentage voltooid", type: "number", unit: "%", },
			}
		},
		Document: {
			btns: ["msg", "fav", "send", "edit"], files: {},
			attributes: {
				state: {
					label: "Systeem", placeholder: "State", options: {
						"prefered": { "title": "Prefered matrix", "color": "green" },
						"second": { "title": "Second choice", "color": "yellow" },
						"custom": { "title": "Custom Specific Part", "color": "yellow" },
						"eol": { "title": "End of life", "color": "orange" },
						"deleted": { "title": "Unavailable", "color": "red" }
					}
				},
				createdDT: { label: "Schedule", placeholder: "Created", type: "date" },
				startDT: { placeholder: "Start", type: "date" },
				endDT: { placeholder: "Deadline", type: "date" },
				finishDT: { placeholder: "Completed", type: "date" },
				Title: { label: "Content", placeholder: "Title" },
				Subject: { placeholder: "Subject", type: "textarea" },
				Description: { placeholder: "Description", type: "div" },
			}
		},
		Chapter: {
			childClasses: [1093], name: "chapter",
			methods: [
				"slide",
				"msg",
				"fav",
				"send",
				"edit",
				"del"
			],
			ids: { masterID: "Master" },
			header: [
				{},
				{},
				{}
			],
			filter: [],
			required: [],
			view: [],
			attributes: {
				//users: {						type: "object"					},
				state: {
					label: "Webpage", type: "radio", title: "Status", options: {
						draft: { title: "In ontwikkeling", color: "orange" },
						concept: { title: "Concept", color: "yellow" },
						published: { title: "Zichtbaar", color: "green" }
					},
				},
				startDT: { type: "date", title: "Publish" },
				endDT: { type: "date", title: "End" },
				finishDT: { type: "date", title: "Finish" },
				news: { title: "Nieuws", type: "checkbox" },
				Master: { classID: "1092", title: "Onderdeel van" },
				title: { title: "Title" },
				Description: { type: "div", title: "Inleiding" },
				BodyHTML: { type: "div", title: "Hoofdtekst" }
			}
		},
		Website: {
			btns: ["edit"], childClasses: [1092], dashboard: {
				Relaties: {
					Projecten: {},
					Subsystemen: {}
				},
				Subsystemen: {}
			},
			attributes: {
				state: {
					label: "Website", type: "radio", title: "Status", options: {
						"draft": { title: "In ontwikkeling", color: "orange" },
						"concept": { title: "Concept", color: "yellow" },
						"published": { title: "Zichtbaar", color: "green" }
					},
				},
				startDT: { placeholder: "Start", type: "date" },
				endDT: { placeholder: "End", type: "date" },
				finishDT: { placeholder: "Publish", type: "date" },
				//Company: { label: "Website", classID: "1002;1", placeholder: "Organisatie" },
				Domain: { placeholder: "Domain", idname: "keyname", default: 1 },
				Description: { type: "div", title: "Inleiding" },
				BodyHTML: { type: "div", title: "Hoofdtekst" },
				AccountPrice: { title: "Account Price" },
				BaseColor: { title: "Base color" },
				Slogans: { type: "textarea", title: "Slogans" },
				Activiteiten: { type: "textarea", title: "Company Activity" },
				InvoiceRef: { title: "Factuur referentie" },
				InvoiceEmail: { title: "Factuur email" },
				//ContactName: { classID: 1004, title: "Contact naam" }
			},

		},
		Webpage: {
			//childClasses: [1092],
			btns: ["slide", "msg", "fav", "send", "edit", "del", "printmenu"],
			childClasses: ['Webpage'],
			header: [
				['Title'], // title = titel
				['Description'], // subject = onderwerp
				['BodyHTML'], // summary = beschrijving / samenvatting
			],
			treeTitleAttributeName: 'Title',

			attributes: {
				state: {
					label: "Webpage", type: "radio", title: "Status", options: {
						"draft": { title: "In ontwikkeling", color: "orange" },
						"concept": { title: "Concept", color: "yellow" },
						"published": { title: "Zichtbaar", color: "green" }
					},
				},
				startDT: { placeholder: "Start", type: "date" },
				endDT: { placeholder: "End", type: "date" },
				finishDT: { placeholder: "Publish", type: "date" },
				//www: { placeholder: "Publish", type: "checkbox" },
				News: { placeholder: "Nieuws", type: "checkbox" },
				Master: { classID: 1092, placeholder: "Onderdeel van" },
				Title: { placeholder: "Title" },
				Keywords: { placeholder: "Zoekwoorden" },
				Description: { type: "textarea", placeholder: "Inleiding" },
				BodyHTML: { type: "div", placeholder: "Hoofdtekst" }
			},
		},
		Helppage: {
			header: [['Title']],
			treeTitleAttributeName: 'Title',
			attributes: {
				state: {
					label: "Help page", type: "radio", title: "Status", options: {
						"draft": { title: "In ontwikkeling", color: "orange" },
						"concept": { title: "Concept", color: "yellow" },
						"published": { title: "Zichtbaar", color: "green" }
					},
				},
				//startDT: { placeholder: "Start", type: "date" },
				//endDT: { placeholder: "End", type: "date" },
				finishDT: { placeholder: "Publish", type: "date" },
				Title: { placeholder: "Title", treeEditField: 1 },
				Keywords: { placeholder: "Zoekwoorden" },
				Description: { type: "textarea", placeholder: "Inleiding" },
				BodyHTML: { type: "div", placeholder: "Hoofdtekst" }
			},
		},
		Softwarefunction: {
			btns: ["msg", "fav", "send", "clone", "edit", "show3d", "network", "printmenu"],
			attributes: {
				Name: { label: "Software Function", placeholder: "Name", idname: "name", default: 1 },
				//title: { placeholder: "Title", idname: "title", public: 1 },
				Master: { placeholder: "Onderdeel van", classID: 2107, idname: "masterID", "typeID": 11 },
				Source: { placeholder: "Afgeleid van", classID: 2107, idname: "srcID", filter: 1, },
				HoortBij: { placeholder: "Hoort bij", schema: 'system', filter: 1, },
				Categorie: { placeholder: "Categorie", filter: 1, },
			},
		},
		Instrument: {
			attributes: {
				keyname: {},
				FuncTag: { kop: 0, },
				Area: { kop: 0, filter: 1, },
				Loop_Function: { kop: 0, filter: 1, },
				Loop_Nr: { kop: 0, filter: 1, },
				Instr_soort: { filter: 1, },
				Instr_Description: { kop: 1 },
				PLC_IO_Type: { filter: 1, },
				Loop_suffix: { filter: 1, },
				Instr_IO_Description: {},
				P_ID: { filter: 1, },
				PID_REV: {},
				Equipment_MOD: {},
				Control_MOD: {},
				Location_CODE: { kop: 2 },
				Measurement_Type: {},
				Proces_Conn: {},
				Pressure_Rating: {},
				Instr_Media: {},
				Media_code: { filter: 1, },
				Appedage_nr: {},
				Inbouw_lengte: {},
				InOn_line: { filter: 1, },
				Line_NR: {},
				Sign_Default_range: {},
				HW_Range: {},
				Media_Comp_n: {},
				Unit_n_min: {},
				unit_n_nom: {},
				unit_n_max: {},
				Unit_n: {},
				Signal_n: {},
				Instr_power: { filter: 1, },
				Sign_Power: {},
				Cabinet: { filter: 1, },
				SIF_Ctrl_Loop: {},
				Transmitter_Loc: {},
				Typical: {},
				Loc_Conn_Box: {},
				Location: {},
				Instr_Remark: {},
				Instr_Tests_n: {},
				Manufacturer: { filter: 1, },
				Instr_Type: {},
				Supplier: {},
				Instr_Supplier_Art_code: {},
				Instr_Supplier_Ordercode: {},
				Ambient_Conditions: {},
				AC_Description: {},
				AC_Manufaturer: {},
				AC_Type: {},
				AC_Art_code: {},
				AC_Ordercode: {},
				AC_Power: {},
				AC_Datasheet_n: {},
				AC_Appendage_nr: {},
				Loopdiagram: {},
				Comp_NR: {},
				L_Page: {},
				L_stamien: {}
			},
		},
		Device: {
			className: "device",
			header: [
				['Product'], // title = titel
				['IPAddress','Port'], // subject = onderwerp
				['ReadAddress','ReadLength','Community'], // summary = beschrijving / samenvatting
			],
			treeTitleAttributeName: 'Product',
			attributes: {
				Product: { label: "Device", placeholder: "Name", idname: "name" },

				IPAddress: { label: "Network", placeholder: "IP address" },
				Port: { placeholder: "Port" },
				PollInterval: { placeholder: "Poll Interval", type: "number", unit: "ms" },

				ReadAddress: { label: "Modbus", placeholder: "Read Address" },
				ReadLength: { placeholder: "Read Length" },

				Community: { label: "SNMP", placeholder: "Community" },
			},
		},
		System: {
			btnbar: {
				view: {
					//pwa: { title: "PWA Specification", api: "system/fbs.html", get: { child: 10 }, },
					popupmenu: {
						sbs: {
							title: "SBS", object: 'sbs',
							onclick: function (event) {
								//event.stopPropagation();
								Aim.Document.create({ el: collist, item: this.item });
							},
							//script: '/lib/' + Aim.version + '/js/document.js',

						},
						show3d: {
							title: 'Toon 3D Model',
							//hidden: true,
							//hidden: !this.attributes || !this.attributes.x || !this.attributes.y || !this.attributes.z || !(this.attributes.x.value || this.attributes.y.value || this.attributes.z.value),
							//hidden: this.schema != 'system',
							get hidden() {
								//console.log('hidden', Aim.itemPage);
								var item = Aim.itemPage;
								return !item || !item.attributes || !item.attributes.x || !item.attributes.y || !item.attributes.z || !(item.attributes.x.value || item.attributes.y.value || item.attributes.z.value);
							},
							//item: this,
							onclick: function () {
								//console.log('3D', Aim.itemPage);
								Aim.itemPage.model3d();
							}
						},

						//fds1: { title: "Functional Specification v3", rpt: "fds" },


						//"fds": { title: "Functional specification", "src": "/api/v1/doctree.php", "post": { "flds": "Brand,Product,Model,Type,Serie,Version,Description,BodyHTML" } },
						//"pwa": { title: "Power Water Air specification", "src": "/api/v1/sbstreedoc.php", "post": { "flds": "files,Brand,Product,Model,Type,Serie,Version,Description,BodyHTML,PowerKVA,PowerFuse,PowerConnection,Air,AirConnection,Dewpoint,Water,WaterConnection,Length,Width,Height,InstallLength,InstallWidth,InstallHeight" } },
						//"sm": { title: "Service specification", "src": "/api/v1/doctree.php", "post": { "flds": "Brand,Product,Model,Type,Serie,Water,Length,Width,Height,InstallLength,InstallWidth,InstallHeight" } }
					},
				},
			},
			btns: ["msg", "fav", "send", "clone", "edit", "network", "printmenu"],
			childClasses: [{ title: "System" }, { title: "Product" }],
			//linkclasses: { "1107": 2107 },
			//childlist: { 0: { title: 'System child' }, 1: { title: 'System object' } },
			backgroundColor: 'blue',

			apps: { mobile: {} },
			header: [
				['Brand', 'Product', 'Model', 'Type', 'Serie', 'Version', 'Shape', 'Material', 'Quality', 'Color', 'Purpose', 'Unit', 'Content', 'ContentUnit', 'PackageUnit', 'PackageQuantity'], // title = titel
				[], // subject = onderwerp
				['Description'], // summary = beschrijving / samenvatting
			],

			attributes: {
				//TITEL
				Manufacturer: { placeholder: "Manufacturer", label: "Title", schema: 'Company' },
				Brand: { schema: 'Brand', placeholder: "Merk", filter: 1 },
				Product: { placeholder: "Product", filter: 1, default: true, },
				Model: { placeholder: "Model", filter: 1 },
				Type: { placeholder: "Type", filter: 1 },
				Serie: { placeholder: "Serie", filter: 1 },
				Version: { placeholder: "Version", filter: 1 },
				Shape: { placeholder: "Vorm", filter: 1 },
				Material: { placeholder: "Material", filter: 1 },
				Quality: { placeholder: "Quality", filter: 1 },
				Color: { placeholder: "Kleur", filter: 1, },
				Purpose: { placeholder: "Ten behoeve van", filter: 1 },

				Unit: { placeholder: "Eenheid", filter: 1 },
				Content: { placeholder: "Inhoud", filter: 1 },
				ContentUnit: { placeholder: "Inhoud eenheid", filter: 1, enum: ["liter", "meter", "mm", "nano", "mu"] },

				// TOELICHTING
				Description: { placeholder: "Omschrijving", label: "Toelichting", type: "textarea", },
				BodyHTML: { placeholder: "Pagina tekst", type: "div" },
				Remark: { placeholder: "Opmerking", type: "textarea" },
				ProductTitle: { placeholder: "Product titel" },


				//Keywords: { placeholder: "Zoekwoorden" },

				keyname: { placeholder: "Zoek code", idname: "keyname" },
				tag: { placeholder: "Label", idname: "tag" },


				// AFMETINGEN
				Dimensions: { label: "Afmetingen", placeholder: "Afmeting", filter: 1 },
				Length: { placeholder: "Length", type: "number", step: 10, unit: "mm" },
				Width: { placeholder: "Width", type: "number", step: 10, unit: "mm" },
				Height: { placeholder: "Height", type: "number", step: 10, unit: "mm" },
				Weight: { placeholder: "Weight", unit: "kg" },
				//depth: { placeholder: "Length 3D deprecated" },
				//w: { placeholder: "Width 3D deprecated" },
				//h: { placeholder: "Height 3D deprecated" },

				// VERPAKKING
				PackageUnit: { placeholder: "Verpakking eenheid", label: "Verpakking", filter: 1 },
				PackageQuantity: { placeholder: "Verpakking aantal", filter: 1, type: "number", step: 1 },

				PackageLength: { placeholder: "Length", type: "number", step: 10, unit: "mm" },
				PackageWidth: { placeholder: "Width", type: "number", step: 10, unit: "mm" },
				PackageHeight: { placeholder: "Height", type: "number", step: 10, unit: "mm" },
				PackageWeight: { placeholder: "Weight", unit: "kg" },
				EAN: { placeholder: "EAN" },

				//CONSUMPTION
				PowerKVA: { placeholder: "Power", label: "Verbruik", type: "number", step: 0.1, unit: "kVA" },
				PowerFuse: { placeholder: "Fuse", type: "number", step: 1, unit: "Amp" },
				PowerConnection: { placeholder: "Power connection", type: "textarea" },
				//"Power400V50Hz": { placeholder: "Power 400V/50Hz", type: "number", step: 0.1, unit: "kVA" },
				//"Power230V50Hz": { placeholder: "Power 230V/50Hz", type: "number", step: 0.1, unit: "kVA 230VAC, 50Hz" },
				//"Power400V60Hz": { placeholder: "Power 400V/60Hz", type: "number", step: 0.1, unit: "kVA 400VAC-3Phase+PE, 60Hz" },
				//"Power230V60Hz": { placeholder: "Power 230V/60Hz", type: "number", step: 0.1, unit: "kVA 230VAC, 60Hz" },

				Air: { placeholder: "Air", type: "number", step: 0.1, unit: "NL/MIN 6-8 BAR (dry air)" },
				AirConnection: { placeholder: "Air connection", type: "textarea" },
				Dewpoint: { placeholder: "Dewpoint", type: "number", step: 0.1, unit: "°C" },

				Water: { placeholder: "Water", type: "number", step: 0.1, unit: "L/MIN" },
				WaterConnection: { placeholder: "Water connection", type: "textarea" },


				// MAGAZIJN
				StockLocation: { placeholder: "Locatie", label: "Magazijn" },
				Stock: { placeholder: "Voorraad", step: 1, type: "number" },
				MinimumStock: { placeholder: "Minimum voorraad", step: 1, type: "number" },
				StartOfStock: { placeholder: "Begin voorraad", step: 1, type: "number" },

				// VERKOOP
				CatalogPrice: { placeholder: "Catalogus prijs", label: "Verkoop", type: "number", format: "currency", step: 0.01 }, // catalog price
				//ListPrice: { placeholder: "Adviesprijs, invoeren in catalog price", type: "number", step: 0.01 },
				SalesDiscount: { placeholder: "Verkoop korting", unit: "%" },
				SalesMargin: { placeholder: "Verkoop marge", unit: "%" },
				SalesPrice: {
					placeholder: "Verkoop prijs", readonly: 1, format: "currency", type: "number", step: 0.01, get: function () {
						var srcItem = api.items[this.srcID] || { values: {} }
						return Number(this.values.cp || srcItem.values.cp) * (100 - Number(this.values.sd || srcItem.values.sd || 0)) / 100
					}
				}, // sales price
				CustomerDiscount: { placeholder: "Klant korting", unit: "%" }, // client discount
				//Price: { placeholder: "Verkoopprijs, vervalt zie Price", lv: 1, type: "number", step: 0.01 },
				//FAT: { placeholder: "FAT" },
				FAT: { "default": "hoog", placeholder: "BTW soort, invoern in FAT", options: ["hoog", "laag"], },
				FixedCostPrice: { placeholder: "Kostprijs", lv: 1, type: "number", step: 0.01 },

				// INKOOP
				Supplier: { placeholder: "Leverancier", label: "Inkoop", schema: 'company' },
				PurchaseDiscount: { placeholder: "Inkoop korting", unit: "%" }, // purchase discount
				PurchasePrice: {
					placeholder: "Inkoop prijs", readonly: 1, format: "currency", get: function () {
						var srcItem = api.items[this.srcID] || { values: {} }
						return (this.values.cp || srcItem.values.cp) * (100 - Number(this.values.pd || srcItem.values.pd || 0)) / 100
					}
				}, // purchase price
				OrderQuant: { placeholder: "Inkoop hoeveelheid", step: 1, type: "number" },
				//OrderUnit: { placeholder: "Inkoop eenheid" },
				//PurchaseCode: { placeholder: "Inkoop code" },

				//Supplier: { placeholder: "Supplier", schema: 'Company' },
				//SupplierProductUrl: { type: "url", placeholder: "Product pagina" },
				//SupplierArtDescription: { placeholder: "Product omschrijving, opnemen in Description of Body", readOnly: 1 },
				//SupplierWebTitle: { placeholder: "Product titel, opnemen in Description of Body", readOnly: 1 },

				// MODEL
				CAD: { placeholder: "CAD model", label: "CAD model", type: "json1" },
				Children: { placeholder: "CAD onderdelen", type: "json1" },
				PosX: { label: "Position", placeholder: "Positie X" },
				PosY: { placeholder: "Positie Y" },
				PosZ: { placeholder: "Positie Z" },
				RotX: { placeholder: "Rotatie X-as" },
				RotY: { placeholder: "Rotatie Y-as" },
				RotZ: { placeholder: "Rotatie Z-as" },

				// STATUS
				State: {
					placeholder: "State", label: "State", filter: 1, options: {
						research: { title: "Research", color: "lightblue" },
						design: { title: "Design", color: "lightblue" },
						draft: { title: "Draft", color: "lightblue" },
						concept: { title: "Concept", color: "yellow" },
						final: { title: "Final", color: "yellow" },
						published: { title: "Published", color: "green" },
						sales: { title: "Sales", color: "orange" },
						ordered: { title: "Ordered", color: "orange" },
						build: { title: "Build", color: "yellow" },
						deleted: { title: "Deleted", color: "black" },
						deprecated: { title: "Deprecated", color: "orange" },
						replaced: { title: "Replaced", color: "orange" },

						aborted: { title: "Aborted", color: "green" },
						stopped: { title: "Stopped", color: "green" },
						idle: { title: "Idle", color: "green" },
						running: { title: "Running", color: "green" },
						complete: { title: "Complete", color: "green" },

						suspended: { title: "Suspended", color: "green" },
						held: { title: "Held", color: "green" },
						aborting: { title: "Aborting", color: "green" },
						stopping: { title: "Stopping", color: "green" },
						clearing: { title: "Clearing", color: "green" },
						resetting: { title: "Resetting", color: "green" },
						starting: { title: "Starting", color: "green" },
						completing: { title: "Completing", color: "green" },
						suspending: { title: "Suspending", color: "green" },
						unsuspending: { title: "Unsuspending", color: "green" },
						holding: { title: "Holding", color: "green" },
						unholding: { title: "Unholding", color: "green" },
						//"run": { title: "Run", color: "green" },
						//"hold": { title: "Hold", color: "blue" },
						//"warning": { title: "Warning", color: "orange" },
						//"stop": { title: "Stop", color: "red" },
					}
				},
				WWW: { placeholder: "Publish", title: "Deze pagina tonen op internet", type: "checkbox", idname: "www" },
				News: { placeholder: "News", title: "Deze pagina opnemen in nieuwsberichten", type: "checkbox" },

				CreatedDT: { placeholder: "Created", label: "Planning", type: "date", idname: "createdDT" },
				StartDT: { placeholder: "Start", type: "date", idname: "startDT" },
				EndDT: { placeholder: "Deadline", type: "date", idname: "endDT" },
				FinishDT: { placeholder: "Completed", type: "date", idname: "finishDT" },

				//DatumDelivery: { placeholder: "Delivery date", type: "date" },
				//DatumSales1: { placeholder: "Deadline Sales 1", type: "date" },
				//DatumSales2: { placeholder: "Deadline Sales 2", type: "date" },

				// MOBA
				//DaysQroc: { label: "Lead time", placeholder: "Sales", type: "number", unit: "days" },
				//DaysEng: { placeholder: "Engineering", type: "number", unit: "days" },
				//DaysPrep: { placeholder: "Preperation", type: "number", unit: "days" },
				//DaysProduce: { placeholder: "Purchase and production", type: "number", unit: "days" },
				//DaysAss: { placeholder: "Assembly", type: "number", unit: "days" },
				//DaysTest: { placeholder: "Factory test", type: "number", unit: "days" },
				//DaysShip: { placeholder: "Shipment", type: "number", unit: "days" },

				// REFERENTIES
				Master: { placeholder: "Onderdeel van", label: "Referenties", schema: 'system', idname: "masterID", "typeID": 11 },
				Source: { placeholder: "Afgeleid van", schema: 'system', idname: "srcID" },
				Layout: { placeholder: "Layout", schema: 'layout' },
				SystemFolder: { placeholder: "Network folder" },
				TagName: { placeholder: "TagName" },
				keyname: { placeholder: "Keyname", idname: "keyname" },

				// MOBA
				SofonNr: { placeholder: "Sofon nr" },
				ProjectNr: { placeholder: "Project nr", schema: 'project', },
				cspnummer: { placeholder: "CSP nummer" },

				//Category: { placeholder: "Category" },

				//Name: { placeholder: "Name", idname: "name", public: 1 },
				//keyname: { placeholder: "Tagname", idname: "keyname", public: 1 },
				//Tagname: { placeholder: "Tagname", idname: "tagname" },
				//keyID: { placeholder: "Key ID", idname: "keyID" },
				//tagName: { placeholder: "Tag Name", idname: "tagName" },
				//Value: { placeholder: "Value", idname: "value" },
				//Keywords: { placeholder: "Zoekwoorden" },
				//www: { placeholder: "Publish", type: "checkbox" },
				//nr: { placeholder: "Number", idname: "nr" },
				//Tag: { placeholder: "Tag", idname: "tag", calc: function (value) { return value ? ("000" + value).slice(-3) : ''; } },


				//PRODUCT EIGENSCHAPPEN



				//Text: { placeholder: "Text" },
				//Location: { placeholder: "Location", schema: 'location', get: { filter: '' } },

				//Source: { classID: 1060, placeholder: "Afgeleid van" },

				//Merk: { classID: 1016, placeholder: "Merk oud, vervalt", readOnly: 1 },
				//"Product": { placeholder: "Product" },
				//"Type": { placeholder: "Type" },
				//Soort: { placeholder: "Soort, vervalt, invoeren in type", readOnly: 1 },
				//"Serie": { placeholder: "Serie" },
				//"Version": { placeholder: "Versie" },

				//Machine: { placeholder: "Machine number, vervalt, invoeren in Number", readOnly: 1 },

				//ChildClassNr: { placeholder: "Child index", idname: "childClassNr" },
				//ClassNr: { placeholder: "Product index", idname: "classNr" },

				//Tag: { placeholder: "Tag", filter: 1 },
				//"AbisTekst": { "find": 1, placeholder: "ABIS" },


				//ProductCode: { label: "Product", placeholder: "Code", },
				//ProductTitle: { placeholder: "Title" },
				//ProductDescription: { placeholder: "Description", type: 'textarea' },
				//ProductUrl: { type: "url", placeholder: "Webpage" },
				//ArtNr: { placeholder: "ArtNr, invoeren in Name", readOnly: 1 },



				//Toepassing: { placeholder: "Toepassing, opnemen in Description of Body", readOnly: 1 },
				//Oms: { placeholder: "Extra tekst, opnemen in Description of Body", readOnly: 1 },
				//ExtraTitle: { placeholder: "Extra titel, opnemen in Description of Body", readOnly: 1 },



				//Dimensions


				//Btw: { "default": "hoog", placeholder: "BTW soort, invoern in FAT", options: ["hoog", "laag"], },
				//Fkpprice: { placeholder: "Vervalt, zie fkp", lv: 1, type: "number", step: 0.01 },


				//ProductieLocatie: { placeholder: "Productie locatie, vervalt, Stocklocation" },








				//InstallLength: { label: "Installation dimensions, vervalt", placeholder: "Installation Length", type: "number", step: 10, unit: "mm", readOnly: 1 },
				//InstallWidth: { placeholder: "Installation Width, vervalt", type: "number", step: 10, unit: "mm", readOnly: 1 },
				//InstallHeight: { placeholder: "Installation Height, vervalt", type: "number", step: 10, unit: "mm", readOnly: 1 },


				//System properties
				//FilterProperties: { label: "Properties", placeholder: "Filtered", type: "textarea", prop: 2 },
				//Properties: { placeholder: "Additional", type: "textarea", prop: 1 },

				//ExtProperties: { placeholder: "Invoeren in additional", type: "textarea", readOnly: 1 },
				////"properties": { type: "textarea", placeholder: "Extra eigenschappen" },
				//Performance: { placeholder: "Performance, invoeren in additional", readOnly: 1 },
				//Toepassing: { placeholder: "Toepassing, invoeren in additional", readOnly: 1 },
				//Options: { type: "options", placeholder: "Opties, invoeren in additional", readOnly: 1 },


				//ARTIKEL
				//"Unit2": { placeholder: "2e besteleenheid" },
				//"Unit2Quant": { step: 1, type: "number", placeholder: "2e besteleenheid aantal" },


				//Department: { placeholder: "Department" },

				//Productgroep: { placeholder: "Productgroep, vervalt > department" },
				//"ProductGroup": { placeholder: "Product group, vervalt, zie mappenstructuur", readOnly: 1 },


			}
		},
		Product: {
			files: {}, btns: ["msg", "fav", "send", "clone", "edit", "show3d", "network", "printmenu"],
			properties: {
				files: { type: "files" },
				state: {
					label: "Product", placeholder: "State", type: "radio", filter: 1, options: {
						"draft": { title: "Draft", color: "lightblue" },
						"concept": { title: "Concept", color: "yellow" },
						"published": { title: "Published", color: "green" },
						"replaced": { title: "Vervangen", color: "orange" },
						"deleted": { title: "Deleted", color: "#ccc" }
					},
				},
				www: { placeholder: "Publish", type: "checkbox" },
				Source: { classID: 1060, placeholder: "Afgeleid van" },
				SerialNumber: { placeholder: "Serial Number" },

				Merk: { classID: 1016, placeholder: "Merk" },
				Product: { placeholder: "Product", default: 1 },
				Type: { placeholder: "Type" },
				Soort: { placeholder: "Soort" },
				Serie: { placeholder: "Serie" },
				Version: { placeholder: "Versie" },
				Unit: { placeholder: "Eenheid" },
				Content: { placeholder: "Inhoud" },
				ContentUnit: { placeholder: "Inhoud eenheid" },
				ArtNr: { "find": 1, placeholder: "Product Code" },
				SupplierArtDescription: { placeholder: "Product omschrijving" },
				SupplierWebTitle: { placeholder: "Product titel" },
				ExtraTitle: { placeholder: "Extra titel" },
				Manufacturer: { classID: 1002, placeholder: "Fabrikant" },
				Productgroep: { placeholder: "Productgroep" },
				SupplierProductUrl: { type: "url", placeholder: "Product pagina" },
				AbisTekst: { "find": 1, placeholder: "AbisTekst" },
				Toepassing: { placeholder: "Toepassing" },
				Oms: { placeholder: "Extra tekst" },
				Description: { type: "textarea", placeholder: "Inleiding" },
				BodyHTML: { type: "div", placeholder: "Hoofdtekst" },
				Options: { type: "options", placeholder: "Opties" },
				filterproperties: { type: "textarea", placeholder: "Filter eigenschappen" },
				properties: { type: "textarea", placeholder: "Extra eigenschappen" },
				EAN: { placeholder: "EAN" },
				Btw: { "default": "hoog", placeholder: "BTW soort", options: ["hoog", "laag"], },
				Weight: { unit: "kg", placeholder: "Eenheid gewicht" },
				cp: { step: 0.01, type: "number", format: "currency", placeholder: "Catalogus prijs" }, // catalog price


				Unit1: { label: "Artikel", placeholder: "Besteleenheid", filter: 1 },
				Unit1Quant: { step: 1, type: "number", placeholder: "Besteleenheid aantal", filter: 1 },
				//"Unit2": { placeholder: "2e besteleenheid" },
				//"Unit2Quant": { step: 1, type: "number", placeholder: "2e besteleenheid aantal" },

				sd: { lv: 1, unit: "%", placeholder: "Verkoop korting" }, // sales discount
				sp: {
					placeholder: "Verkoop prijs", readonly: 1, format: "currency", get: function () {
						var srcItem = api.items[this.srcID] || { values: {} }
						return Number(this.values.cp || srcItem.values.cp) * (100 - Number(this.values.sd || srcItem.values.sd || 0)) / 100
					}
				}, // sales price

				cd: { lv: 1, unit: "%", placeholder: "Klant korting" }, // client discount
				pd: { unit: "%", placeholder: "Inkoop korting" }, // purchase discount
				pp: {
					placeholder: "Inkoop prijs", readonly: 1, format: "currency", get: function () {
						var srcItem = api.items[this.srcID] || { values: {} }
						return (this.values.cp || srcItem.values.cp) * (100 - Number(this.values.pd || srcItem.values.pd || 0)) / 100
					}
				}, // purchase price


				Supplier: { classID: 1002, placeholder: "Leverancier" },
				Stock: { step: 1, type: "number", placeholder: "Op voorraad" },
				Loc: { placeholder: "Locatie" },
				minStock: { step: 1, type: "number", placeholder: "Minimale voorraad" },
				orderQuant: { step: 1, type: "number", placeholder: "Bestel hoeveelheid" },
				id: { label: "aliconnect", "readOnly": true, placeholder: "Product ID" },

				IP: { label: "Network", placeholder: "IP adress" },
				Port: { placeholder: "Port" },



			}
		},
		Signal: {
			attributes: {
				//id: { label: "Identifier", readOnly: true, placeholder: "ID" },
				Keyname: { placeholder: "Key Name", idname: "keyname" },
				Master: { label: "Title", placeholder: "Onderdeel van", schema: 'iomodule', idname: "masterID" },
				Name: { placeholder: "Name", idname: "name", default: 1 },
				Description: { label: "Description", placeholder: "Summary", type: "textarea" },

				Signaltype: { placeholder: "type", options: { D: "Digital", A: "Analog" } },
				Direction: { placeholder: "Direction", options: { I: "Indicator", O: "Actuator" } },

				Area: { label: "System Breakdown", placeholder: "Area", schema: 'system', },
				Loop: { placeholder: "Loop", schema: 'system', },
				Template: { placeholder: "Template", schema: 'system', },
				Function: { placeholder: "Function", schema: 'system', },
				//Sensor: { placeholder: "Sensor", schema: 'system', },
				Signal: { placeholder: "Signal", schema: 'signal', },


				//Description: { placeholder: "Text", },
				PID: { placeholder: "PID", schema: 'document', },
				HwRange: { placeholder: "HwRange", },
				HwLoop: { placeholder: "HwLoop", },

				PLC: { label: "Hardware configuration", placeholder: "PLC", filter: 1, schema: 'controller', },
				RIO: { placeholder: "RIO", filter: 1, schema: 'iointerface', },
				Slot: { placeholder: "Slot", filter: 1, schema: 'iomodule', },
				IO: { placeholder: "IO", schema: 'io', },

				IOType: { placeholder: "IOType" },
				HwAddress: { placeholder: "Address", },
				Terminal: { placeholder: "Terminal" },
				Drawing: { placeholder: "Drawing", schema: 'document', },
			}
		},
		Controller: {
			attributes: {
				id: { label: "Controller", readOnly: true, placeholder: "ID" },
				Keyname: { placeholder: "Key Name", idname: "keyname" },
				Master: { placeholder: "Onderdeel van", schema: 'system', idname: "masterID" },
				Name: { placeholder: "Name", idname: "name" },
				Address: { placeholder: "Address", },
			}
		},
		IOInterface: {
			attributes: {
				//id: { label: "Identifier", readOnly: true, placeholder: "ID" },
				Keyname: { placeholder: "Key Name", idname: "keyname" },
				Master: { label: "Title", placeholder: "Onderdeel van", schema: 'controller', idname: "masterID" },
				Name: { placeholder: "Name", idname: "name" },
			}
		},
		IOModule: {
			attributes: {
				//id: { label: "Identifier", readOnly: true, placeholder: "ID" },
				Keyname: { placeholder: "Key Name", idname: "keyname" },
				Master: { label: "Title", placeholder: "Onderdeel van", schema: 'iocontroller', idname: "masterID" },
				Name: { placeholder: "Name", idname: "name" },
			}
		},

		ControlIO: {
			properties: {
				SignalType: {
					label: "Control IO", placeholder: "Type", type: "select", options: {
						Text: { title: "String" },
						D: { title: "Digital", color: "blue" },
						A: { title: "Analog", color: "yellow" },


						Bool: { title: "Boolean" },
						SByte: { title: "Signed Byte" },
						UBbyte: { title: "Unsigned Byte" },
						SInt: { title: "Signed Integer" },
						Uint: { title: "Unsigned Integer" },
						SDInt: { title: "Signed Double Integer" },
						UDInt: { title: "Unsigned Double Integer" },
						Float: { title: "Float" },
						Double: { title: "Double" },

						//integer: { title: "Integer" },
						//int8: { title: "Byte" },
						//uint8: { title: "Unsigned Byte" },
						//int16: { title: "Word" },
						//uint16: { title: "Unsigned Word" },
						//int32: { title: "Double" },
						//uint32: { title: "Unsigned Double" },

						//float4: { title: "Float 4 (4 Bytes)" },
						//inversefloat4: { title: "Inverse Float 4" },
						//float8: { title: "Float 8 (8 Bytes)" },
						//inversefloat8: { title: "Inverse Float 8" },
						//double: { title: "Double" },


						//bool: { title: "Boolean" },
						//number: { title: "Number" },
						Date: { title: "Date" },
						Time: { title: "Time" },
						Datetime: { title: "Date and time" },
						Array: { title: "Array" },
						Object: { title: "Object" },
						" ": { title: "Not applicable" },
					}
				},
				Permission: { placeholder: "Permission", type: "radio", options: { rw: "Read Write", r: "Read Only", w: "Write Only" } },
				Direction: { placeholder: "Direction (vervalt)", type: "radio", options: { I: "Input", O: "Output" } },

				Tag: { placeholder: "TAG", idname: "tag", default: 1 },

				Value: { placeholder: "Value", idname: "value", },
				Quality: { placeholder: "Quality", type: "radio", options: { Valid: { title: "Valid", color: "green" }, NotValid: { title: "NotValid", color: "orange" }, CommunicationError: { title: "CommunicationError", color: "red" }, UnInitialized: { title: "UnInitialized", color: "gray" } } },

				ReadAddress: { label: "Modbus", placeholder: "Read Address", type: "number" },
				//ReadAddressLength: { placeholder: "Read Address Length", defaultvalue: 1, type: "number" },
				ReadAddressBit: { placeholder: "Bit number", type: "number" },

				OID: { label: "SNMP", placeholder: "OID" },
				SNMPType: { placeholder: "SNMP Type" },

				//PollInterval: { label: "Scan configuration", placeholder: "Poll Interval", type: "number", unit: "ms" },


				////ModbusAddress: { placeholder: "Modbus Address", type: "number" },
				////ModbusAddressBit: { placeholder: "Modbus Address Bit", type: "number" },
				////RangeName: { placeholder: "Range Name" },

				//TagName: { placeholder: "Tagname" },
				//TagType: { placeholder: "Tagtype" },
				//SharedMemoryOffset: { placeholder: "Shared Memory Offset", type: "number" },
				//SharedMemoryBit: { placeholder: "Shared Memory Bit", type: "number" },
				//TextEnumeration: { placeholder: "Text enumeration" },
				//Description: { placeholder: "Description" },
				//Passthrough: { placeholder: "Passthrough" },

				//Unit: { placeholder: "Unit" },
				//Fraction: { placeholder: "Fraction", type: "number" },
				//IOType: { placeholder: "IO Type" },
				//Invert: { label: "Signal", placeholder: "Invert", type: "checkbox" },
				//AlarmText: { placeholder: "Alarm Text" },
				//Category: { placeholder: "Category" },
				//StandardOutput: { placeholder: "Standard Output" },


				//RANGE
				MinValidValue: { label: "Range", placeholder: "Min Valid Value", type: "number" },
				MaxValidValue: { placeholder: "Max Valid Value", type: "number" },
				Deadband: { placeholder: "Deadband", type: "number" },

				MinRawValue: { label: "Conversion", placeholder: "Min Raw Value", type: "number" },
				MaxRawValue: { placeholder: "Max Raw Value", type: "number" },
				MinEngValue: { placeholder: "Min Engineering Value", type: "number" },
				MaxEngValue: { placeholder: "Max Engineering Value", type: "number" },

				//RawMin: { placeholder: "Raw MIN" },
				//EngMin: { placeholder: "Eng MIN" },
				//Factor: { placeholder: "Eng Factor" },
				//EngMax: { placeholder: "Eng MAX" },
				//RawMax: { placeholder: "Raw MAX" },


			},
		},
		//controloutput: {
		//	className: 'controloutput',
		//	properties: {
		//		Signaltype: { placeholder: "Type", type: "radio", options: { D: "Digital", A: "Analog" } },
		//		Direction: { placeholder: "Direction", type: "radio", options: { I: "Input", O: "Output" } },
		//		Tag: { placeholder: "Name", idname: "tag", default: 1 },
		//	},
		//},
		IO: {
			attributes: {
				//id: { label: "Identifier", readOnly: true, placeholder: "ID" },
				Keyname: { placeholder: "Key Name", idname: "keyname" },
				Master: { label: "Title", placeholder: "Onderdeel van", schema: 'iomodule', idname: "masterID" },
				Name: { placeholder: "Name", idname: "name", default: 1 },
				Signaltype: { placeholder: "Type", options: { D: "Digital", A: "Analog" } },
				Direction: { placeholder: "Direction", options: { I: "Input", O: "Output" } },
				RawMax: { placeholder: "Raw Max", type: 'number' },
				RawMin: { placeholder: "Raw Min", type: 'number' },
				//tag: { placeholder: "Tag", },
				//Contact: { placeholder: "Contact", options: { NO: "NO", NC: "NC" }, },

			}
		},
		Location: {
			attributes: {
				//id: { label: "Identifier", readOnly: true, placeholder: "ID" },
				Keyname: { placeholder: "Key Name", idname: "keyname" },
				Master: { label: "Title", placeholder: "Onderdeel van", classID: 2107, idname: "masterID" },
				Name: { placeholder: "Name", idname: "name" },
				Title: { placeholder: "Title" },
			}
		},
		//MSE
		contacts: {
			origin: ['https://aliconnect.nl', 'aliconnect', 'api', Aim.version, ''].join('/'),
			attributes: {
				//ChangeKey: {},
				//ParentFolderId: {},
				CreatedDateTime: {},
				LastModifiedDateTime: {},
				Categories: [],
				Birthday: {},
				FileAs: {},
				DisplayName: { kop: 0 },
				GivenName: {},
				Initials: {},
				MiddleName: {},
				NickName: {},
				Surname: {},
				Title: {},
				//YomiGivenName: {},
				//YomiSurname: {},
				//YomiCompanyName: {},
				Generation: {},
				ImAddresses: {},
				JobTitle: {},
				CompanyName: {},
				Department: {},
				OfficeLocation: {},
				Profession: {},
				BusinessHomePage: {},
				AssistantName: {},
				Manager: {},
				HomePhones: { type: "array", max: 3, },
				MobilePhone1: {},
				BusinessPhones: { type: "array", max: 3, },
				SpouseName: {},
				PersonalNotes: {},
				Children: { type: "array", },
				EmailAddresses: { type: [{ Name: { type: "text" }, Address: { type: 'email' } }], max: 3, },
				HomeAddress: {
					Type: { Street: {}, City: {}, CountryOrRegion: {} },
				},
				BusinessAddress: {
					Type: { Street: {}, City: {}, CountryOrRegion: {} },
				},
				OtherAddress: {
					Type: { Street: {}, City: {}, CountryOrRegion: {} },
				},
			}
		},
		messages: {
			attributes: {
				Id: {},
				CreatedDateTime: {},
				LastModifiedDateTime: {},
				ChangeKey: {},
				Categories: {},
				ReceivedDateTime: {},
				SentDateTime: {},
				HasAttachments: {},
				InternetMessageId: {},
				Subject: {},
				BodyPreview: {},
				Importance: {},
				ParentFolderId: {},
				ConversationId: {},
				IsDeliveryReceiptRequested: {},
				IsReadReceiptRequested: {},
				IsRead: {},
				IsDraft: {},
				WebLink: {},
				InferenceClassification: {},
				InternetMessageHeaders: {},
				Body: {},
				Sender: {},
				From: {},
				ToRecipients: {},
				CcRecipients: {},
				BccRecipients: {},
				ReplyTo: {},
				UniqueBody: {},
				Flag: {},
			}
		},
		events: {
			attributes: {
				Id: {},
				CreatedDateTime: {},
				LastModifiedDateTime: {},
				ChangeKey: {},
				Categories: {},
				OriginalStartTimeZone: {},
				OriginalEndTimeZone: {},
				iCalUId: {},
				ReminderMinutesBeforeStart: {},
				IsReminderOn: {},
				HasAttachments: {},
				Subject: {},
				BodyPreview: {},
				Importance: {},
				Sensitivity: {},
				IsAllDay: {},
				IsCancelled: {},
				IsOrganizer: {},
				ResponseRequested: {},
				SeriesMasterId: {},
				ShowAs: {},
				Type: {},
				WebLink: {},
				OnlineMeetingUrl: {},
				ResponseStatus: {},
				Body: {},
				Start: {},
				End: {},
				Location: {},
				Locations: {},
				Recurrence: {},
				Attendees: {},
				Organizer: {},
			}
		},
		calendarview: {
			attributes: {
				Id: {},
				CreatedDateTime: {},
				LastModifiedDateTime: {},
				ChangeKey: {},
				Categories: {},
				OriginalStartTimeZone: {},
				OriginalEndTimeZone: {},
				iCalUId: {},
				ReminderMinutesBeforeStart: {},
				IsReminderOn: {},
				HasAttachments: {},
				Subject: {},
				BodyPreview: {},
				Importance: {},
				Sensitivity: {},
				IsAllDay: {},
				IsCancelled: {},
				IsOrganizer: {},
				ResponseRequested: {},
				SeriesMasterId: {},
				ShowAs: {},
				Type: {},
				WebLink: {},
				OnlineMeetingUrl: {},
				ResponseStatus: {},
				Body: {},
				Start: {},
				End: {},
				Location: {},
				Locations: {},
				Recurrence: {},
				Attendees: {},
				Organizer: {},
			}
		},


	},
	navleft: {
		items: {
			Start: {
				className: 'start', href: '#Aim.start?', items: {
					Favorieten: { className: "fav", get: { q: "*", filter: "id+IN(SELECT+id+FROM+om.itemFav+WHERE+userID=" + Aim.userID + ")" }, items: {} },
					Recent: { className: "History", get: { q: "*", filter: "id+IN(SELECT+id+FROM+om.itemuservisit+WHERE+userID=" + Aim.userID + ")" }, items: {} },
					//Gedeeld: { className: "group", get: { q: "*", filter: "id+IN(SELECT+id+FROM+om.itemuservisit+WHERE+userID=" + Aim.userID + ")" }, items: {} },
					//Prullenbak: { className: "trash", get: { q: "*", filter: "deletedDT+IS+NOT+NULL" }, items: {} },
				}
			},
			Website: {
				className: "Website", items: {
					"Websites": { className: "Website", title: "Web sites", get: { title: "Web sites", folder: 'Website', filter: "hostID<>1", q: "" } },
					"Webpages": { className: "Webpage", title: "Web pages", get: { title: "Web pages", folder: 'Webpage', filter: "hostID<>1", q: "" } },
					"Helppages": { className: "HelpPage", title: "Help pages", get: { title: "Help pages", folder: 'HelpPage', filter: "", q: "" } },
				}
			},
			Organisatie: {
				className: "crm", items: {
					"Contactpersonen": { className: "person", get: { title: 'Contact', folder: 'Contact', filter: "hostID<>1", q: '' }, },
					"Organisaties": { className: "company", get: { title: 'Company', folder: 'Company', filter: "hostID<>1", q: '' }, },
					//"Mailgroupen": { get: { folder: 'mailgroup', filter: "hostID<>1", q: '' } },
				}
			},
			SCADA: {
				title: "SCADA", className: "scada", items: {
					Alerts: { className: "alert", get: { title: "Alerts", folder: "alert", filter: "hostID<>1", q: "*", id: "" } },
				}
			},
			Engineering: {
				title: "Engineering", className: "se", items: {
					Signal: { className: "signal", get: { folder: 'signal', filter: "hostID<>1", q: '', id: '', title: 'Signals' } },
					SoftwareFunction: { className: "softwarefunction", get: { folder: 'softwarefunction', filter: "hostID<>1", q: '', id: '', title: 'Software functies' } },
					Instruments: { get: { folder: 'instrument', q: '' } },
					Products: { get: { title: 'Products', folder: 'system', filter: "hostID<>1+AND+srcID=masterID+AND+id+NOT+IN+(SELECT+masterID+FROM+api.items+WHERE+masterid=srcid)", q: '' } },
					Systems: { get: { title: 'Systems', folder: 'System', filter: "hostID<>1", q: '' } },
					IO: { get: { folder: 'io', filter: "hostID<>1", q: '' } },
					Document: { className: "document", get: { folder: 'document', filter: "hostID<>1", q: '', id: '', title: 'Documenten' } },
					Asset: { get: { folder: 'product', filter: "hostID<>1", q: '' } },
					Locations: { className: "location", get: { folder: 'location', filter: "hostID<>1", q: '', id: '', title: 'Locations' } },
				}
			},
			Work: {
				className: "taskboard", items: {
					"Taken": { className: "task", get: { folder: 'task', filter: "hostID<>1", q: '', id: '', title: 'Taken' } },
					"Mijn taken": { className: "task", get: { folder: 'task', filter: "hostID<>1+AND+ownerID=" + Aim.userID, q: '', id: '', title: 'Mijn taken' } },
					"Alicon support": { className: "support", get: { folder: 'task', filter: "hostID<>1+AND+ownerID=2753253", q: '', id: '', title: 'Support taken' } },
				}
			},
			Administratie: {
				className: "administratie"
			},
			Outlook: {
				className: "crm", items: {
					Contacts: { className: "person", get: { origin: 'https://aliconnect.nl/aliconnect/api/', folder: 'contacts', filter: '', q: '', id: '', title: 'Outlook contacten', select: 'DisplayName,EmailAddresses,MobilePhone1', } },
					Messages: { className: "company", get: { origin: 'https://aliconnect.nl/aliconnect/api/', folder: 'messages', filter: '', q: '', id: '', title: 'Outlook berichten' } },
					Events: { className: "company", get: { origin: 'https://aliconnect.nl/aliconnect/api/', folder: 'events', filter: '', q: '', id: '', title: 'Outlook gebeurtenissen' } },
					Calendar: { className: "company", get: { origin: 'https://aliconnect.nl/aliconnect/api/', folder: 'calenderview', filter: '', q: '', id: '', title: 'Outlook calendar' } },
				}
			},
			Admin: {
				className: "config", items: {
					"Groups": { className: "crm", get: { folder: 'groups', q: '', id: '', title: 'Groepen' } },
					"Keys": { className: "keys", get: { folder: 'keys', q: '', id: '', title: 'Keys' } },
					"License": { className: "License", get: { folder: 'License', q: '', id: '', title: 'License' } },
				}
			},
		}

	},
});
