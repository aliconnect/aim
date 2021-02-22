content = [
	{
		title: "API",
		children: [
			{
				title: "Account",
				children: [
					{
						title: "Aliconnect Host",
						par: { api: "", method: "GET", get: { id: Aim.client.domain.id, select: "*" }, },
					},
					{
						title: "Aliconnect User",
						par: { api: "", method: "GET", get: { id: Aim.client.user.id, select: "*" }, },
						children: [
							{
								title: "Add Attribute Tutorial",
								summary: " with value 'Created'. Update odata 4.0 gebeurd met PATCH, hier is het nog een PUT",
								par: { api: "", method: "PATCH", put: { value: [{ id: Aim.client.user.id, values: { Tutorial: 'Created' } }], }, },
							},
							{
								title: "Change Attribute Tutorial ",
								summary: "with value 'Modified'",
								par: { api: "", method: "PATCH", put: { value: [{ id: Aim.client.user.id, values: { Tutorial: 'Modified' } }], }, },
							},
							{
								title: "Remove Attribute Tutorial",
								summary: "If you create the Attribute after a removal the attribute keeps the original attribute id",
								par: { api: "", method: "PATCH", put: { value: [{ id: Aim.client.user.id, values: { Tutorial: '' } }], }, },
							},
						],
					},
					{
						title: "Aliconnect Account",
						summary: "",
						par: { api: "", method: "GET", get: { id: Aim.client.account.id }, },
					},
					//{
					//	title: "Aliconnect Group",
					//	par: { api: "", method: "GET", get: { id: Aim.client.group.id }, },
					//},
					{
						title: "Aliconnect Contact List",
						par: { api: "Contact", method: "GET", get: { search: '*', select: '*', top: 2 }, },
					},
					{
						title: "Aliconnect Add Contact",
						par: { api: "Contact", method: "PUT", put: { value: [{ schema: "Contact", title: "", values: { FirstName: "John", Surname: "Doo" } }] } },
					},
					{
						title: "Aliconnect Search Contact John Doo",
						par: { api: "Contact", method: "GET", get: { q: 'Kampen', select: '*', top: 2 }, },
					},
				],
			},
			{
				title: "SMS",
				children: [
					{
						title: "Send message",
						par: { api: 'sms/send?originator=Aliconnect&recipients=+31620068073&body=Hierbij stuur ik uw code', method: 'GET' },
					},
				],
			},
			{
				title: "Breakdown Structures",
				children: [
					{
						title: "Requesting children of node for treeview A",
						summary: "As the REST principles go, \"Everything is a Resource\". As a simple start, let's see how resources can be retrieved from the OData RESTful APIs. The sample service used is the TripPin service which simulates the service of an open trip management system. Our friend, Russell Whyte, who has formerly registered TripPin, would like to find out who are the other people in it.",
						par: {
							api: "WebSite(2753246)/Children(1)",
							method: "GET",
							get: {
								select: "title,typical,state,hasChildren,idx,srcID,inheritedID,selected,detailID,createdDT,startDT,endDT,finishDT",
								filter: "finishDT+IS+NULL"
							},
						},
					},
					{
						title: "Requesting children of node for treeview",
						par: {
							api: "WebSite(2753246)/Children(1)",
							method: "GET",
							get: {
								select: "title,typical,state,hasChildren,idx,srcID,inheritedID,selected,detailID,createdDT,startDT,endDT,finishDT",
								filter: "finishDT+IS+NULL"
							},
						},
					},
					{
						title: "",
					},
				],
			},
			{
				title: "Microsoft Exchange",
				children: [
					{
						title: "Contacts",
						children: [
							{
								title: "Select",
								par: { api: "contacts", method: "GET", get: { top: 3 }, },
							},
						],
					},
					{
						title: "People",
						children: [
							{
								title: "Select",
								par: { api: "people?top=2", method: "GET" },
							},
						],
					},
					{
						title: "Messages",
						children: [
							{
								title: "Select, Search and order",
								par: { api: "messages?search=bereken&select=Id,Subject&order=LastModifiedDateTime DESC&top=2", method: "GET" },
							},
							{
								title: "Select, Search on attribute Subject and order",
								par: { api: 'messages?search="subject:verdiepende"&select=Id,Subject,ReceivedDateTime,From&order=LastModifiedDateTime DESC&top=2', method: "GET" },
							},
							{
								title: "Filter on received date",
								par: { api: "messages?select=Id,Subject,ReceivedDateTime,From&order=LastModifiedDateTime+DESC&filter=ReceivedDateTime+ge+2014-09-01+and+HasAttachments+eq+true&top=2", method: "GET" },
							},
							{
								title: "Filter is Read",
								par: { api: "messages?filter=IsRead eq false&top=2", method: "GET" },
							},
							{
								title: "Filter on from email address",
								par: { api: "messages?filter=From/EmailAddress/Address eq 'nick@ictwaarborg.nl'&top=2", method: "GET" },

							},
							{
								title: "Filter on Importance",
								par: { api: "messages?filter=Importance eq 'High'&order=Subject,Importance,Sender&top=2", method: "GET" },
							},
						],
					},
					{
						title: "Events",
						children: [
							{
								title: "Select",
								summary: "De datum moet tussen enkele quotes (') staan. Dubbele quotes (\") werken niet evenals het weglaten van de quotes.",
								par: { api: "events?select=*&filter=Start/DateTime+ge+'2016-04-01T08:00'&top=2", method: "GET" },
							},
						],
					},
					{
						title: "Calenderview",
						children: [
							{
								title: "Select between dates",
								par: { api: "calendarview?startDateTime=2017-01-01T01:00:00&endDateTime=2017-03-31T23:00:00&select=Id,Subject,BodyPreview,HasAttachments&top=2", method: "GET" },
							},
							{
								title: "Search",
								summary: 'De search tekst moet tussen dubbel quotes staan (").',
								par: { api: 'messages?search="from:janvanhoef@limex.nl"&select=Id,Subject,ReceivedDateTime,From&order=LastModifiedDateTime+DESC&top=2', method: 'GET' },
							},
						],
					},
				],
			},
		],
	},
]
