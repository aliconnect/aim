Aim.add({
	Go: {
		//go: document.head.appendTag('script', { src: "https://aliconnect.nl/inc/js/go/go-debug.js" }),
		show: function (event) {
			console.log('GRAPH.onload', this.el, this.data);
			//if (!('go' in window)) return document.head.appendTag('script', { src: "https://aliconnect.nl/inc/js/go/go-debug.js", el: this.el, data: this.data, onload: graph.show });
			//with (OM.elDiagram = collist.appendTag('div', { className: 'slidepanel col bgd oa pu', })) {

			var rows = this.data;
			this.data = {
				items: {},
				links: [],
			}
			linecolors = {
				Child: 'blue',
				Derivative: 'green',
				Subscribers: 'yellow',
				Attribute: 'orange',
				Link: 'red',
			}
			rows.forEach(function (row) {
				if (row.hidden) return;
				//this.data.items.push({ key: row.id, text: row.title, color: row.srcID == row.masterID ? 'yellow' : row.backgroundColor });
				for (var toID in row.linkto) {
					this.data.links.push({ from: row.id, to: toID, color: linecolors[row.linkto[toID]] });
					var item = Aim.api.item[row.id];
					if (item) this.data.items[item.id] = { item:item, key: item.id, text: item.title, color: item.id == get.id ? 'green' : item.srcID == item.masterID ? 'yellow' : item.backgroundColor }
					var item = Aim.api.item[toID];
					if (item) this.data.items[item.id] = { item: item, key: item.id, text: item.title, color: item.id == get.id ? 'green' : item.srcID == item.masterID ? 'yellow' : item.backgroundColor }
				}
			}.bind(this));
			this.data.items = Object.values(this.data.items);
			console.log(this.data);
			//this.data = {
			//	//color: ['rgb(60,70,90)', 'rgba(60,70,90,.9)', 'rgba(60,70,90,.8)', 'rgba(60,70,90,.7)'],
			//	items: [
			//		{ key: "1", text: "Tata Steel", color: "#eb158f" },
			//		{ key: "2", text: "Tata Steel 2", color: "#eb158f" },
			//	],
			//	links: [
			//		{from:1, to:2, color:'red'}
			//	],
			//}

			with (OM.elDiagram = this.el) {
				appendTag('div', { style: 'display:block;position:absolute;background:#fff;top:9px;left:13px;width:164px;height:56px;z-index:3;' });
				with (appendTag('div', { className: 'row top btnbar', style: 'position:absolute;z-index:4;width:100%;background:rgba(0,0,0,0.5);' })) {
					appendTag('button', { className: 'abtn icn close r', onclick: function () { var p = this.parentElement.parentElement; p.parentElement.removeChild(p); }, });
				}
				//if (!this.item.elDiagram) return;
				//var elDiagram = this.item.elDiagram = appendTag('div', { className: 'col aco', style: 'background:white;height:100%;' }).appendTag('div', { style: "height:100%;width:100%;" });
				var elDiagram = appendTag('div', { className: 'col aco', style: 'background:white;height:100%;' }).appendTag('div', { style: "height:100%;width:100%;" });
				//var elDiagram1 = this.item.elDiagram1 = appendTag('div', { id: "myPaths", style: 'flex-basis:100px', size: "10" });
				function init() {
					//if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
					var $ = go.GraphObject.make;  // for conciseness in defining templates
					myDiagram =
						$(go.Diagram, elDiagram, // must be the ID or reference to div
							{
								initialAutoScale: go.Diagram.UniformToFill,
								padding: 10,
								contentAlignment: go.Spot.Center,
								layout: $(go.ForceDirectedLayout, { defaultSpringLength: 10 }),
								maxSelectionCount: 2
							});
					// define the Node template
					myDiagram.nodeTemplate =
						$(go.Node, "Horizontal",
							{
								locationSpot: go.Spot.Center,  // Node.location is the center of the Shape
								locationObjectName: "SHAPE",
								selectionAdorned: false,
								//selectionchanged: nodeSelectionchanged
							},
							$(go.Panel, "Auto",
								$(go.Shape, "Ellipse",
									{
										name: "SHAPE",
										fill: "lightgray",  // default value, but also data-bound
										stroke: "transparent",  // modified by highlighting
										strokeWidth: 2,
										desiredSize: new go.Size(30, 30),
										portId: ""
									},  // so links will go to the shape, not the whole node
									new go.Binding("fill", "isSelected", function (s, obj) { return s ? "red" : obj.part.data.color; }).ofObject()),
								$(go.TextBlock,
									new go.Binding("text", "distance", function (d) { if (d === Infinity) return "INF"; else return d | 0; }))),
							$(go.TextBlock,
								new go.Binding("text")));
					// define the Link template
					myDiagram.linkTemplate =
						$(go.Link,
							{
								selectable: false,      // links cannot be selected by the user
								curve: go.Link.Bezier,
								layerName: "Background"  // don't cross in front of any nodes
							},
							$(go.Shape,  // this shape only shows when it isHighlighted
										{
											isPanelMain: true, stroke: null, strokeWidth: 5
										},
								new go.Binding("stroke", "isHighlighted", function (h) { return h ? "red" : null; }).ofObject()),
							$(go.Shape,
								// mark each Shape to get the link geometry with isPanelMain: true
										{
											isPanelMain: true, stroke: "black", strokeWidth: 1
										},
								new go.Binding("stroke", "color")),
							$(go.Shape, { toArrow: "Standard" })
						);
					// Override the clickSelectingTool's standardMouseSelect
					// If less than 2 nodes are selected, always add to the selection
					myDiagram.toolManager.clickSelectingTool.standardMouseSelect = function (event) {
						console.log('CLICK',event, this);
						var diagram = this.diagram;
						if (diagram === null || !diagram.allowSelect) return;
						var e = diagram.lastInput;
						var count = diagram.selection.count;
						var curobj = diagram.findPartAt(e.documentPoint, false);

						console.log('CLICK', event, this, e, count, curobj);

						if (curobj !== null) {
							console.log('standardMouseSelect', curobj);
							Aim.URL.set({ schema: curobj.Cg.item.schema, id: curobj.Cg.item.id });
							return;

							if (count < 2) {  // add the part to the selection
								if (!curobj.isSelected) {
									var part = curobj;
									if (part !== null) part.isSelected = true;
								}
							} else {
								if (!curobj.isSelected) {
									var part = curobj;
									if (part !== null) diagram.select(part);
								}
							}
						} else if (e.left && !(e.control || e.meta) && !e.shift) {
							// left click on background with no modifier: clear selection
							diagram.clearSelection();
						}
					}
					//generateGraph();
					//console.log(this.data);
					myDiagram.model = new go.GraphLinksModel(this.data.items, this.data.links);

				}
				function findDistances(source) {
					console.log('findDistances');
					var diagram = source.diagram;
					// keep track of distances from the source node
					var distances = new go.Map(go.Node, "number");
					// all nodes start with distance Infinity
					var nit = diagram.nodes;
					while (nit.next()) {
						var n = nit.value;
						distances.add(n, Infinity);
					}
					// the source node starts with distance 0
					distances.add(source, 0);
					// keep track of nodes for which we have set a non-Infinity distance,
					// but which we have not yet finished examining
					var seen = new go.Set(go.Node);
					seen.add(source);
					// keep track of nodes we have finished examining;
					// this avoids unnecessary traversals and helps keep the SEEN collection small
					var finished = new go.Set(go.Node);
					while (seen.count > 0) {
						// look at the unfinished node with the shortest distance so far
						var least = leastNode(seen, distances);
						var leastdist = distances.getAttribute(least);
						// by the end of this loop we will have finished examining this LEAST node
						seen.remove(least);
						finished.add(least);
						// look at all Links connected with this node
						var it = least.findLinksOutOf();
						while (it.next()) {
							var link = it.value;
							var neighbor = link.getOtherNode(least);
							// skip nodes that we have finished
							if (finished.contains(neighbor)) continue;
							var neighbordist = distances.getAttribute(neighbor);
							// assume "distance" along a link is unitary, but could be any non-negative number.
							var dist = leastdist + 1;  //Math.sqrt(least.location.distanceSquaredPoint(neighbor.location));
							if (dist < neighbordist) {
								// if haven't seen that node before, add it to the SEEN collection
								if (neighbordist === Infinity) {
									seen.add(neighbor);
								}
								// record the new best distance so far to that node
								distances.add(neighbor, dist);
							}
						}
					}
					return distances;
				}
				// This helper function finds a Node in the given collection that has the smallest distance.
				function leastNode(coll, distances) {
					var bestdist = Infinity;
					var bestnode = null;
					var it = coll.iterator;
					while (it.next()) {
						var n = it.value;
						var dist = distances.getAttribute(n);
						if (dist < bestdist) {
							bestdist = dist;
							bestnode = n;
						}
					}
					return bestnode;
				}
				// Find a path that is shortest from the BEGIN node to the END node.
				// (There might be more than one, and there might be none.)
				function findShortestPath(begin, end) {
					// compute and remember the distance of each node from the BEGIN node
					distances = findDistances(begin);
					// now find a path from END to BEGIN, always choosing the adjacent Node with the lowest distance
					var path = new go.List();
					path.add(end);
					while (end !== null) {
						var next = leastNode(end.findNodesInto(), distances);
						if (next !== null) {
							if (distances.getAttribute(next) < distances.getAttribute(end)) {
								path.add(next);  // making progress towards the beginning
							} else {
								next = null;  // nothing better found -- stop looking
							}
						}
						end = next;
					}
					// reverse the list to start at the node closest to BEGIN that is on the path to END
					// NOTE: if there's no path from BEGIN to END, the first node won't be BEGIN!
					path.reverse();
					return path;
				}
				// Recursively walk the graph starting from the BEGIN node;
				// when reaching the END node remember the list of nodes along the current path.
				// Finally return the collection of paths, which may be empty.
				// This assumes all links are unidirectional.
				function collectAllPaths(begin, end) {
					var stack = new go.List(go.Node);
					var coll = new go.List(go.List);
					function find(source, end) {
						source.findNodesOutOf().each(function (n) {
							if (n === source) return;  // ignore reflexive links
							if (n === end) {  // success
								var path = stack.copy();
								path.add(end);  // finish the path at the end node
								coll.add(path);  // remember the whole path
							} else if (!stack.contains(n)) {  // inefficient way to check having visited
								stack.add(n);  // remember that we've been here for this path (but not forever)
								find(n, end);
								stack.removeAt(stack.count - 1);
							}  // else might be a cycle
						});
					}
					stack.add(begin);  // start the path at the begin node
					find(begin, end);
					return coll;
				}
				// Return a string representation of a path for humans to read.
				function pathToString(path) {
					var s = path.length + ": ";
					for (var i = 0; i < path.length; i++) {
						if (i > 0) s += " -- ";
						s += path.elt(i).data.text;
					}
					return s;
				}
				// When a node is selected show distances from the first selected node.
				// When a second node is selected, highlight the shortest path between two selected nodes.
				// If a node is deselected, clear all highlights.
				function nodeSelectionchanged(node) {
					console.log('changed');
					var diagram = node.diagram;
					if (diagram === null) return;
					diagram.clearHighlighteds();
					if (node.isSelected) {
						console.log(node);
						OM.show({ id: node.Pg.key });
						// when there is a selection made, always clear out the list of all paths
						//var sel = document.getElementById("myPaths");
						//sel.innerText = "";
						// show the distance for each node from the selected node
						var begin = diagram.selection.first();
						showDistances(begin);
						if (diagram.selection.count === 2) {
							var end = node;  // just became selected
							// highlight the shortest path
							highlightShortestPath(begin, end);
							// list all paths
							//listAllPaths(begin, end);
						}
					}
				}
				// Have each node show how far it is from the BEGIN node.
				function showDistances(begin) {
					// compute and remember the distance of each node from the BEGIN node
					distances = findDistances(begin);
					// show the distance on each node
					var it = distances.iterator;
					while (it.next()) {
						var n = it.key;
						var dist = it.value;
						myDiagram.model.setDataProperty(n.data, "distance", dist);
					}
				}
				// Highlight links along one of the shortest paths between the BEGIN and the END nodes.
				// Assume links are unidirectional.
				function highlightShortestPath(begin, end) {
					highlightPath(findShortestPath(begin, end));
				}
				// List all paths from BEGIN to END
				//function listAllPaths(begin, end) {
				//    // compute and remember all paths from BEGIN to END: Lists of Nodes
				//    paths = collectAllPaths(begin, end);
				//    // update the Selection element with a bunch of Option elements, one per path
				//    var sel = document.getElementById("myPaths");
				//    sel.innerText = "";  // clear out any old Option elements
				//    paths.each(function (p) {
				//        var opt = document.createElement("option");
				//        opt.text = pathToString(p);
				//        sel.appendChild(opt, null);
				//    });
				//    sel.onchange = highlightSelectedPath;
				//}
				// A collection of all of the paths between a pair of nodes, a List of Lists of Nodes
				var paths = null;
				// This is only used for listing all paths for the selection onchange event.
				// When the selected item changes in the Selection element,
				// highlight the corresponding path of nodes.
				function highlightSelectedPath() {
					var sel = document.getElementById("myPaths");
					var idx = sel.selectedIndex;
					var opt = sel.options[idx];
					var val = opt.value;
					highlightPath(paths.elt(sel.selectedIndex));
				}
				// Highlight a particular path, a List of Nodes.
				function highlightPath(path) {
					myDiagram.clearHighlighteds();
					for (var i = 0; i < path.count - 1; i++) {
						var f = path.elt(i);
						var t = path.elt(i + 1);
						f.findLinksTo(t).each(function (l) { l.isHighlighted = true; });
					}
				}
				init.call(this);
			}
		},
	}
});


function findDistances(source) {
	var diagram = source.diagram;
	// keep track of distances from the source node
	var distances = new go.Map(go.Node, "number");
	// all nodes start with distance Infinity
	var nit = diagram.nodes;
	while (nit.next()) {
		var n = nit.value;
		distances.add(n, Infinity);
	}
	// the source node starts with distance 0
	distances.add(source, 0);
	// keep track of nodes for which we have set a non-Infinity distance,
	// but which we have not yet finished examining
	var seen = new go.Set(go.Node);
	seen.add(source);
	// keep track of nodes we have finished examining;
	// this avoids unnecessary traversals and helps keep the SEEN collection small
	var finished = new go.Set(go.Node);
	while (seen.count > 0) {
		// look at the unfinished node with the shortest distance so far
		var least = leastNode(seen, distances);
		var leastdist = distances.getAttribute(least);
		// by the end of this loop we will have finished examining this LEAST node
		seen.remove(least);
		finished.add(least);
		// look at all Links connected with this node
		var it = least.findLinksOutOf();
		while (it.next()) {
			var link = it.value;
			var neighbor = link.getOtherNode(least);
			// skip nodes that we have finished
			if (finished.contains(neighbor)) continue;
			var neighbordist = distances.getAttribute(neighbor);
			// assume "distance" along a link is unitary, but could be any non-negative number.
			var dist = leastdist + 1;  //Math.sqrt(least.location.distanceSquaredPoint(neighbor.location));
			if (dist < neighbordist) {
				// if haven't seen that node before, add it to the SEEN collection
				if (neighbordist === Infinity) {
					seen.add(neighbor);
				}
				// record the new best distance so far to that node
				distances.add(neighbor, dist);
			}
		}
	}
	return distances;
}
// This helper function finds a Node in the given collection that has the smallest distance.
function leastNode(coll, distances) {
	var bestdist = Infinity;
	var bestnode = null;
	var it = coll.iterator;
	while (it.next()) {
		var n = it.value;
		var dist = distances.getAttribute(n);
		if (dist < bestdist) {
			bestdist = dist;
			bestnode = n;
		}
	}
	return bestnode;
}
// Find a path that is shortest from the BEGIN node to the END node.
// (There might be more than one, and there might be none.)
function findShortestPath(begin, end) {
	// compute and remember the distance of each node from the BEGIN node
	distances = findDistances(begin);
	// now find a path from END to BEGIN, always choosing the adjacent Node with the lowest distance
	var path = new go.List();
	path.add(end);
	while (end !== null) {
		var next = leastNode(end.findNodesInto(), distances);
		if (next !== null) {
			if (distances.getAttribute(next) < distances.getAttribute(end)) {
				path.add(next);  // making progress towards the beginning
			} else {
				next = null;  // nothing better found -- stop looking
			}
		}
		end = next;
	}
	// reverse the list to start at the node closest to BEGIN that is on the path to END
	// NOTE: if there's no path from BEGIN to END, the first node won't be BEGIN!
	path.reverse();
	return path;
}
// Recursively walk the graph starting from the BEGIN node;
// when reaching the END node remember the list of nodes along the current path.
// Finally return the collection of paths, which may be empty.
// This assumes all links are unidirectional.
function collectAllPaths(begin, end) {
	var stack = new go.List(go.Node);
	var coll = new go.List(go.List);
	function find(source, end) {
		source.findNodesOutOf().each(function (n) {
			if (n === source) return;  // ignore reflexive links
			if (n === end) {  // success
				var path = stack.copy();
				path.add(end);  // finish the path at the end node
				coll.add(path);  // remember the whole path
			} else if (!stack.contains(n)) {  // inefficient way to check having visited
				stack.add(n);  // remember that we've been here for this path (but not forever)
				find(n, end);
				stack.removeAt(stack.count - 1);
			}  // else might be a cycle
		});
	}
	stack.add(begin);  // start the path at the begin node
	find(begin, end);
	return coll;
}
// Return a string representation of a path for humans to read.
function pathToString(path) {
	var s = path.length + ": ";
	for (var i = 0; i < path.length; i++) {
		if (i > 0) s += " -- ";
		s += path.elt(i).data.text;
	}
	return s;
}
// When a node is selected show distances from the first selected node.
// When a second node is selected, highlight the shortest path between two selected nodes.
// If a node is deselected, clear all highlights.
function nodeSelectionchanged(node) {
	var diagram = node.diagram;
	if (diagram === null) return;
	diagram.clearHighlighteds();
	if (node.isSelected) {
		console.log(node);
		OM.show({ id: node.Pg.key });
		// when there is a selection made, always clear out the list of all paths
		//var sel = document.getElementById("myPaths");
		//sel.innerText = "";
		// show the distance for each node from the selected node
		var begin = diagram.selection.first();
		showDistances(begin);
		if (diagram.selection.count === 2) {
			var end = node;  // just became selected
			// highlight the shortest path
			highlightShortestPath(begin, end);
			// list all paths
			//listAllPaths(begin, end);
		}
	}
}
// Have each node show how far it is from the BEGIN node.
function showDistances(begin) {
	// compute and remember the distance of each node from the BEGIN node
	distances = findDistances(begin);
	// show the distance on each node
	var it = distances.iterator;
	while (it.next()) {
		var n = it.key;
		var dist = it.value;
		myDiagram.model.setDataProperty(n.data, "distance", dist);
	}
}
// Highlight links along one of the shortest paths between the BEGIN and the END nodes.
// Assume links are unidirectional.
function highlightShortestPath(begin, end) {
	highlightPath(findShortestPath(begin, end));
}
// List all paths from BEGIN to END
//function listAllPaths(begin, end) {
//    // compute and remember all paths from BEGIN to END: Lists of Nodes
//    paths = collectAllPaths(begin, end);
//    // update the Selection element with a bunch of Option elements, one per path
//    var sel = document.getElementById("myPaths");
//    sel.innerText = "";  // clear out any old Option elements
//    paths.each(function (p) {
//        var opt = document.createElement("option");
//        opt.text = pathToString(p);
//        sel.appendChild(opt, null);
//    });
//    sel.onchange = highlightSelectedPath;
//}
// A collection of all of the paths between a pair of nodes, a List of Lists of Nodes
var paths = null;
// This is only used for listing all paths for the selection onchange event.
// When the selected item changes in the Selection element,
// highlight the corresponding path of nodes.
function highlightSelectedPath() {
	var sel = document.getElementById("myPaths");
	var idx = sel.selectedIndex;
	var opt = sel.options[idx];
	var val = opt.value;
	highlightPath(paths.elt(sel.selectedIndex));
}
// Highlight a particular path, a List of Nodes.
function highlightPath(path) {
	myDiagram.clearHighlighteds();
	for (var i = 0; i < path.count - 1; i++) {
		var f = path.elt(i);
		var t = path.elt(i + 1);
		f.findLinksTo(t).each(function (l) { l.isHighlighted = true; });
	}
}




function initFlowchart(ele, obj, data) {
	var $ = go.GraphObject.make;  // for conciseness in defining templates
	//console.log(myDiagram);
	with (ele) {
		innerHTML = '';
		with (addtag('div', { className: 'diagramFlowchart row' }, { style: "height:400px;width:100%;" })) {
			with (addtag('div', { className: 'diagram myPalette' }, { style: "height:400px;" })) {
				obj.myPaletteDiv = addtag('div', {}, { style: "height:400px;" });
				obj.myPaletteDiv.id = 'myPalette';
			}
			with (addtag('div', { className: 'diagram myDiagram row content' }, { style: "height:400px;" })) {
				obj.myDiagramDiv = addtag('div', { className: 'content' }, { style: "height:100%;" });
				obj.myDiagramDiv.id = 'myDiagram';
			}
		}
	}


	var myDiagram =
		$(go.Diagram, obj.myDiagramDiv,  // must name or refer to the DIV HTML element
			{
				initialContentAlignment: go.Spot.Center,
				allowDrop: true,  // must be true to accept drops from the Palette
				"LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
				"LinkRelinked": showLinkLabel,
				"animationManager.duration": 800, // slightly longer than default (600ms) animation
				"undoManager.isEnabled": true  // enable undo & redo
			});

	obj.myDiagram = myDiagram;

	// when the document is modified, add a "*" to the title and enable the "Save" button
	obj.myDiagram.addDiagramListener("Modified", function (event) {
		//console.log('Diagram Modified');
		var button = om.panel.item.panel.diagramSaveButton;
		//console.log(button);
		if (button) button.disabled = !myDiagram.isModified;
		//var idx = document.title.indexOf("*");
		//if (myDiagram.isModified) {
		//    if (idx < 0) document.title += "*";
		//} else {
		//    if (idx >= 0) document.title = document.title.substr(0, idx);
		//}
		//console.log(om.detail.item.panel.myDiagram.selection);


	});

	// helper definitions for node templates

	function nodeStyle() {
		return [
			// The Node.location comes from the "loc" property of the node data,
			// converted by the Point.parse static method.
			// If the Node.location is changed, it updates the "loc" property of the node data,
			// converting back using the Point.stringify static method.
			new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
			{
				// the Node.location is at the center of each node
				locationSpot: go.Spot.Center,
				//isShadowed: true,
				//shadowColor: "#888",
				// handle mouse enter/leave events to show/hide the ports
				mouseEnter: function (e, obj) { showPorts(obj.part, true); },
				mouseLeave: function (e, obj) { showPorts(obj.part, false); }
			}
		];
	}

	// Define a function for creating a "port" that is normally transparent.
	// The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
	// and where the port is positioned on the node, and the boolean "output" and "input" arguments
	// control whether the user can draw links from or to the port.
	function makePort(name, spot, output, input) {
		// the port is basically just a small circle that has a white stroke when it is made visible
		return $(go.Shape, "Circle",
						 {
						 	fill: "transparent",
						 	stroke: null,  // this is changed to "white" in the showPorts function
						 	desiredSize: new go.Size(8, 8),
						 	alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
						 	portId: name,  // declare this object to be a "port"
						 	fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
						 	fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
						 	cursor: "pointer"  // show a different cursor to indicate potential link point
						 });
	}

	// define the Node templates for regular nodes

	var lightText = 'whitesmoke';

	myDiagram.nodeTemplateMap.add("",  // the default category
		$(go.Node, "Spot", nodeStyle(),
			// the main object is a Panel that surrounds a TextBlock with a rectangular Shape
			$(go.Panel, "Auto",
				$(go.Shape, "Rectangle",
					{ fill: "#00A9C9", stroke: null },
					new go.Binding("figure", "figure")),
				$(go.TextBlock,
					{
						font: "bold 11pt Helvetica, Arial, sans-serif",
						stroke: lightText,
						margin: 8,
						maxSize: new go.Size(160, NaN),
						wrap: go.TextBlock.WrapFit,
						editable: true
					},
					new go.Binding("text").makeTwoWay())
			),
			// four named ports, one on each side:
			makePort("T", go.Spot.Top, false, true),
			makePort("L", go.Spot.Left, true, true),
			makePort("R", go.Spot.Right, true, true),
			makePort("B", go.Spot.Bottom, true, false)
		));

	myDiagram.nodeTemplateMap.add("Start",
		$(go.Node, "Spot", nodeStyle(),
			$(go.Panel, "Auto",
				$(go.Shape, "Circle",
					{ minSize: new go.Size(40, 40), fill: "#79C900", stroke: null }),
				$(go.TextBlock, "Start",
					{ font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
					new go.Binding("text"))
			),
			// three named ports, one on each side except the top, all output only:
			makePort("L", go.Spot.Left, true, false),
			makePort("R", go.Spot.Right, true, false),
			makePort("B", go.Spot.Bottom, true, false)
		));

	myDiagram.nodeTemplateMap.add("End",
		$(go.Node, "Spot", nodeStyle(),
			$(go.Panel, "Auto",
				$(go.Shape, "Circle",
					{ minSize: new go.Size(40, 40), fill: "#DC3C00", stroke: null }),
				$(go.TextBlock, "End",
					{ font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
					new go.Binding("text"))
			),
			// three named ports, one on each side except the bottom, all input only:
			makePort("T", go.Spot.Top, false, true),
			makePort("L", go.Spot.Left, false, true),
			makePort("R", go.Spot.Right, false, true)
		));

	myDiagram.nodeTemplateMap.add("Comment",
		$(go.Node, "Auto", nodeStyle(),
			$(go.Shape, "File",
				{ fill: "#EFFAB4", stroke: null }),
			$(go.TextBlock,
				{
					margin: 5,
					maxSize: new go.Size(200, NaN),
					wrap: go.TextBlock.WrapFit,
					textAlign: "center",
					editable: true,
					font: "bold 12pt Helvetica, Arial, sans-serif",
					stroke: '#454545'
				},
				new go.Binding("text").makeTwoWay())
			// no ports, because no links are allowed to connect with a comment
		));


	// replace the default Link template in the linkTemplateMap
	myDiagram.linkTemplate =
		$(go.Link,  // the whole link panel
			{
				routing: go.Link.AvoidsNodes,
				curve: go.Link.JumpOver,
				corner: 5, toShortLength: 4,
				relinkableFrom: true,
				relinkableTo: true,
				reshapable: true,
				resegmentable: true,
				// mouse-overs subtly highlight links:
				mouseEnter: function (e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
				mouseLeave: function (e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
			},
			new go.Binding("points").makeTwoWay(),
			$(go.Shape,  // the highlight shape, normally transparent
				{ isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
			$(go.Shape,  // the link path shape
				{ isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
			$(go.Shape,  // the arrowhead
				{ toArrow: "standard", stroke: null, fill: "gray" }),
			$(go.Panel, "Auto",  // the link label, normally not visible
				{ visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
				new go.Binding("visible", "visible").makeTwoWay(),
				$(go.Shape, "RoundedRectangle",  // the label shape
					{ fill: "#F8F8F8", stroke: null }),
				$(go.TextBlock, "Yes",  // the label
					{
						textAlign: "center",
						font: "10pt helvetica, arial, sans-serif",
						stroke: "#333333",
						editable: true
					},
					new go.Binding("text", "text").makeTwoWay())
			)
		);

	// Make link labels visible if coming out of a "conditional" node.
	// This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
	function showLinkLabel(e) {
		var label = e.subject.findObject("LABEL");
		if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
	}

	// temporary links used by LinkingTool and RelinkingTool are also orthogonal:
	myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
	myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;


	var JSONdata = {
		nodeKeyProperty: "id",
		class: "go.GraphLinksModel",
		linkFromPortIdProperty: "fromPort",
		linkToPortIdProperty: "toPort"
	}
	if (data) {
		if (data.nodeDataArray) JSONdata.nodeDataArray = data.nodeDataArray;
		if (data.linkDataArray) JSONdata.linkDataArray = data.linkDataArray;
	}

	myDiagram.model = go.Model.fromJson(JSON.stringify(JSONdata));

	// initialize the Palette that is on the left side of the page
	myPalette =
		$(go.Palette, obj.myPaletteDiv,  // must name or refer to the DIV HTML element
			{
				"animationManager.duration": 800, // slightly longer than default (600ms) animation
				nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
				model: new go.GraphLinksModel([  // specify the contents of the Palette
					{ category: "Start", text: "Start" },
					{ category: "Start", text: "Start" },
					{ text: "Step" },
					{ text: "?", figure: "Diamond" },
					{ category: "End", text: "End" },
					{ category: "Comment", text: "Comment" }
				])
			});
	return obj.myDiagramDiv;
}

// Make all ports on a node visible when the mouse is over the node
function showPorts(node, show) {
	var diagram = node.diagram;
	if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
	node.ports.each(function (port) {
		port.stroke = (show ? "white" : null);
	});
}


// Show the diagram's model in JSON format that the user may edit
function diagramsave() {
	document.getElementById("mySavedModel").value = myDiagram.model.toJson();
	myDiagram.isModified = false;
}
function diagramload() {
	myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}

// add an SVG rendering of the diagram at the end of this page
function makeSVG() {
	var svg = myDiagram.makeSvg({
		scale: 0.5
	});
	svg.style.border = "1px solid black";
	obj = document.getElementById("SVGArea");
	obj.appendChild(svg);
	if (obj.children.length > 0) {
		obj.replaceChild(svg, obj.children[0]);
	}
}
