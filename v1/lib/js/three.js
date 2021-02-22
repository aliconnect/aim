//console.log('THREE v0.2 aliconnect', aliconnect);
A = window.A || { origin: '' };
items = window.items || [];
selectopacity = 0.8;
baseopacity = 1;

Aim.assign({
	Three: {
		show: function () {
			console.log('init1', this, this.el, this.id);
			this.el = this.el || document.body.appendTag('div', { className: 'col aco' });

			Three.id = this.id;
			this.el.innerText = '';
			with (this.el.appendTag('div', { className: 'row top btnbar' })) {
				appendTag('button', { className: 'abtn icn r refresh', onclick: Three.loaddata.bind(this) });
				appendTag('button', { className: 'abtn icn close', onclick: function () { Three.initdone = false; this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement); } });
			}

			Three.loaddata();
			loader = new THREE.TextureLoader();
			//if (Detector.webgl)
				renderer = new THREE.WebGLRenderer({ antialias: true });
			//else renderer = new THREE.CanvasRenderer();
			renderer.setClearColor(0xcfcfcf, .5);
			container = this.el.appendTag('div', {
				className: 'aco', style: 'overflow:hidden;',
				onmouseenter: function (event) {
					controls = new THREE.OrbitControls(camera, renderer.domElement);
					controls.addEventListener('change', Three.render);
				},
				onmouseleave: function (event) {
					controls.dispose();
				}
			});
			container.addEventListener('mousedown', Three.onDocumentMouseDown, false);
			container.addEventListener('mouseup', Three.onDocumentMouseUp, false);
			container.addEventListener('mousemove', Three.onDocumentMouseMove, false);
			container.appendChild(renderer.domElement);

			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera(100, 1, 0.1, 6000);
			var light = new THREE.PointLight(0xffffff, 0.8, 0, 20);
			camera.add(light);
			scene.add(camera);

			var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
			hemiLight.position.set(0, 500, 0);
			scene.add(hemiLight);

			window.onWindowResize = function () {
				camera.aspect = container.clientWidth / container.clientHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(container.clientWidth, container.clientHeight);
			}
			window.addEventListener('resize', window.onWindowResize, false);
			window.onWindowResize();
			//Three.render();
		},
		loaddata: function () {
			Aim.load({
				api: 'three', get: { id: this.id }, onload: function () {
					//console.log('DATA3D', this.responseText);
					data3d = this.data;
					console.log('DATA3D', data3d);
					scale = data3d.scale;
					size = { x: data3d.object.w / scale, y: data3d.object.depth / scale };
					data3d.object.depth = null;
					data3d.object.w = null;

					Three.targetList = [];
					Three.meshitems = [];
					if (this.initdone) {
						console.log('INIT DONE');
						function clearThree(obj) {
							if (obj.children) {
								while (obj.children.length > 0) {
									clearThree(obj.children[0])
									obj.remove(obj.children[0]);
								}
							}
							if (obj.geometry) obj.geometry.dispose()
							if (obj.material) obj.material.dispose()
							if (obj.texture) obj.texture.dispose()
						}
						clearThree(group);
						//targetList = [];
						//redraw();
						//Three.render();
						//return;
					}
					else Three.init(); // initialiseer en bouw model op
					Three.redraw();
					//renderer.render(scene, camera);
					//renderer.render(scene, camera);
					//animate();
				}
			});
		},
		init: function () {
			console.log('THREE.JS INIT', camera);
			Three.initdone = true;

			camera.position.set(0, size.x / 2, size.y / 2);
			camera.lookAt(scene.position);
			console.log('Floorplan',data3d.floorplan.src);
			var floorMaterial = new THREE.MeshBasicMaterial({ map: loader.load(data3d.floorplan.src), side: THREE.DoubleSide });
			var floorGeometry = new THREE.PlaneGeometry(size.x, size.y, 0, 0);
			var floor = new THREE.Mesh(floorGeometry, floorMaterial);
			floor.rotation.x = -Math.PI / 2;
			scene.add(floor);
			group = new THREE.Group();
			group.position.x = -size.x / 2;
			group.position.z = size.y / 2;
			group.rotation.y = Math.PI * (data3d.object.r + 180) / 180;
			var s = 1 / scale;
			group.scale.set(s, s, s);
			scene.add(group);
		},
		blinkoff: 0,
		//stateitemlist = [],
		targetList: [],
		//meshitems: {},
		projector: null,
		baseopacity: 1,
		selectopacity: .8,
		hoveropacity: .6,
		mouse: { x: 0, y: 0 },
		dmouse: { x: 0, y: 0 },
		namedobjects: {},
		objecthover: null,
		objectclick: null,
		objectselect: null,
		container: null,
		stats: null,
		camera: null,
		scene: null,
		renderer: null,
		group: null,
		//getCenterPoint: function (mesh) {
		//	var box = new THREE.Box3().setFromObject(mesh)
		//	var sphere = box.getBoundingSphere()
		//	var centerPoint = sphere.center
		//	return sphere.center;
		//},
		render: function () {
			//console.log('RENDER');
			renderer.render(scene, camera);
		},
		redraw: function () {
			Three.obj.call(data3d.object, group);
			setTimeout(function () { Three.render(); }, 1);
			//sendMessage({ guiID: Three.id });
		},
		animate: function () {
			requestAnimationFrame(Three.animate);
			Three.render();//renderer.render(scene, camera);
		},
		shape: function (shapename, fx) {
			var apts = [];
			if (!data3d.shape[shapename]) console.log(shapename, this);
			var vectors = data3d.shape[shapename].vectors.slice(0);
			var width = 0;
			var left = 9999999;
			var height = 0;
			var minheight = 9999999;
			var vecbottom = 999999;
			var vecleft = 999999;
			for (var i = 0; i < vectors.length; i += 2) {
				vectors[i] *= -1;
				vecbottom = Math.min(vecbottom, vectors[i + 1]);
				vecleft = Math.min(vecleft, vectors[i]);
			}
			for (var i = 0; i < vectors.length; i += 2) {
				vectors[i + 1] -= vecbottom;
				vectors[i] -= vecleft;
				left = Math.min(left, vectors[i]);
				width = Math.max(width, vectors[i]);
				height = Math.max(height, vectors[i + 1]);
			}
			for (var i = 0; i < vectors.length; i += 2) {
				if (fx) vectors[i] = -vectors[i] + width / 2;
				else vectors[i] -= width / 2;
				var pts = new THREE.Vector2(vectors[i], vectors[i + 1]);
				apts.push(pts);
			}
			var shape = new THREE.Shape(apts);
			shape.left = left;
			shape.width = width;
			shape.height = height;
			return shape;
		},
		obj: function (grp) {
			//console.log('SHAPE', this, this.shape);
			if (grp.src) {
				if (this.left != undefined && this.right != undefined) { this.w = grp.src.w - this.left - this.right; }
				else if (!this.w) { this.w = grp.src.w; }
				if (this.left != undefined) this.x = -grp.src.w / 2 + this.left + this.w / 2;
				else if (this.right != undefined) this.x = grp.src.w / 2 - this.right - this.w / 2;

				if (!this.h) this.h = grp.src.h - (this.bottom || 0) - (this.top || 0);
				if (this.bottom != undefined) this.y = this.bottom;
				else if (this.top != undefined) this.y = grp.src.h - this.top - this.h;

				if (this.begin != undefined && this.end != undefined) { this.depth = grp.src.depth - this.begin - this.end; }
				else if (!this.depth) { this.depth = grp.src.depth - 10; if (this.z == undefined) this.z = 5; }
				if (this.begin != undefined) { this.z = this.begin; }
				else if (this.end != undefined) { this.z = grp.src.depth - this.end - this.src.depth; }
			}
			this.baseColor = this.color || '0x999999';
			if (this.shape) {
				this.shape = Three.shape.call(this, this.shape, this.fx);
				//this.w = this.shape.width;
				//this.h = this.shape.height;
				var geometry = new THREE.ExtrudeGeometry(this.shape, { depth: this.depth });
				//geometry.translate(0, 0, -this.depth / 2);
				if (this.shape.color) this.baseColor = this.shape.color;
				//if (this.baseColor != undefined || this.shape.baseColor != undefined) {
				//    //console.log(this.color, this.shape.color, this.baseColor);
				//    var material = new THREE.MeshStandardMaterial({
				//        //color: parseInt(this.baseColor) || parseInt(this.shape.baseColor),
				//        reflectivity: 0,
				//    });
				//}
				//else
				if (this.shininess == -1) var material = new THREE.MeshStandardMaterial({
					color: parseInt(this.baseColor),
					//color: parseInt(this.baseColor) || parseInt(this.shape.baseColor),
					reflectivity: 0,
					transparent: true,
				});
				else var material = new THREE.MeshPhongMaterial({
					color: parseInt(this.baseColor),
					//shininess: this.shininess || 80,
					reflectivity: .5,
					transparent: true,
				});
				var mesh = this.mesh = new THREE.Mesh(geometry, material);
				if (this.h) mesh.scale.y = this.h / this.shape.height; //console.log('SCALE', this, mesh, mesh.scale);
				if (this.w) mesh.scale.x = this.w / this.shape.width;
				Three.targetList.push(mesh);
			}
			else var mesh = this.mesh = new THREE.Group();

			mesh.colorSet = function (color) {
				if (this.material) {
					//if (!this.oldcolor) this.oldcolor = color;
					this.material.color.setHex(parseInt(color || this.src.baseColor));
					//else this.material.color.setHex(parseInt(this.oldcolor));
				}
				var c = this.children;
				for (var i = 0, e; e = c[i]; i++) e.colorSet(color);
			}
			//if (this.baseColor != undefined) this.colorSet(this.baseColor);

			mesh.src = this;


			//console.log(this.name,this.id);

			if (this.name) Three.namedobjects[this.name] = mesh;
			if (this.id) {
				//stateitemlist.push(this.id);
				Three.meshitems[this.id] = mesh;
				mesh.itemID = this.id;
			}



			//mesh.position.set((-this.x || 0), (this.y || 0), (this.z || 0) );
			grp.posz = grp.posz || 0;
			grp.posx = grp.posx || 0;
			//mesh.absry = mesh.absry || 0;


			if (this.z != undefined) grp.posz = this.z;
			if (this.x != undefined) grp.posx = -this.x;
			mesh.position.z = grp.posz;
			mesh.position.x = grp.posx;

			//mesh.position.x = -this.x || 0;
			mesh.position.y = this.y || 0;

			if (this.ry == 180) mesh.position.z += this.depth;

			if (this.ry == 90) { grp.posz += this.w; grp.posx -= this.depth }
			else if (this.ry == -90) { grp.posz += this.w; grp.posx += this.depth }
			else grp.posz += this.depth;

			mesh.rotation.x = (this.rx || 0) / 180 * Math.PI;
			mesh.rotation.y = (-this.ry || 0) / 180 * Math.PI;
			mesh.rotation.z = (this.rz || 0) / 180 * Math.PI;

			mesh.absr = (grp.absr || 0) + (this.rz || 0);
			if (mesh.absr == 90) { mesh.position.x += this.depth; }
			grp.add(mesh);
			if (this.children) for (var i = 0, child; child = this.children[i]; i++) Three.obj.call(child, mesh);
		},
		onDocumentMouseMove: function (event) {
			var rect = container.getBoundingClientRect();
			Three.mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
			Three.mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
			var vector = new THREE.Vector3(Three.mouse.x, Three.mouse.y, 1);
			vector.unproject(camera);
			var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
			var intersects = ray.intersectObjects(Three.targetList);
			if (Three.objecthover) {
				//hoverelement.object.material.color = hoverelement.orgcolor;
				Three.objecthover.material.opacity = Three.objecthover.opacity;
			}
			if (intersects.length > 0) {
				Three.objecthover = intersects[0].object;
				if (!Three.objecthover.opacity) Three.objecthover.opacity = Three.objecthover.material.opacity;
				if (!Three.objecthover.color) Three.objecthover.color = Three.objecthover.material.color;
				Three.objecthover.material.opacity = Three.hoveropacity;
				//hoverelement.object.material.color = { r: 255, g: 0, b: 0 };
			}
			if (Three.objectselect) Three.objectselect.material.opacity = selectopacity;
			Three.render();
		},
		onDocumentMouseDown: function (event) {
			console.log('DOWN');

			var rect = container.getBoundingClientRect();
			Three.mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
			Three.mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
			var vector = new THREE.Vector3(Three.mouse.x, Three.mouse.y, 1);
			vector.unproject(camera);
			var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

			console.log(Three.targetList);

			var intersects = ray.intersectObjects(Three.targetList);

			console.log(intersects);

			if (intersects.length > 0) {
				Three.objectclick = intersects[0].object;
			}
			console.log(Three.objectclick);
			Three.render();
		},
		onDocumentMouseUp: function (event) {
			var rect = container.getBoundingClientRect();
			Three.mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
			Three.mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
			var vector = new THREE.Vector3(Three.mouse.x, Three.mouse.y, 1);
			vector.unproject(camera);
			var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
			var intersects = ray.intersectObjects(Three.targetList);

			if (intersects.length > 0) {
				var p = Three.objectclick = intersects[0].object;
				while (p && !p.itemID) p = p.parent;
				var itemID = p.itemID;// || Three.objectclick.parent.itemID || Three.objectclick.parent.parent.itemID;

				if (itemID) {
					console.log('HIT',itemID);
					Three.objectselect = Three.objectclick;
					for (var i = 0, e; e = Three.targetList[i]; i++) { e.material.opacity = baseopacity; }
					//intersects[0].object.selected = true;
					Three.objectselect.material.opacity = selectopacity;
					console.log("Hit @ ", Three.objectselect, itemID);
					Aim.URL.set({ schema:'item', id: itemID });
				}
			}
			Three.render();

		}
	}
});

//document.body.appendTag('script', {
//	src: "https://aliconnect.nl/inc/js/three/build/three.js", onload: function () {
//		with (document.body) {
//			appendTag('script', { src: "https://aliconnect.nl/inc/js/three/examples/js/renderers/Projector.js" });
//			appendTag('script', { src: "https://aliconnect.nl/inc/js/three/examples/js/Detector.js" });
//			appendTag('script', { src: "https://aliconnect.nl/inc/js/three/examples/js/controls/OrbitControls.js" });
//			appendTag('script', { src: "https://aliconnect.nl/inc/js/three/examples/js/renderers/CanvasRenderer.js" });
//			appendTag('script', { src: "https://aliconnect.nl/inc/js/three/examples/js/libs/stats.min.js" });
//			//Three.init();
//		}
//	}
//});
//var blinkoff = 0;
//setInterval(function () {
//    var c = OM.elErr.children;
//    for (var i = 0, e; e = c[i]; i++) {
//        if (e.meshitem) {
//            //console.log('Emesh', e.meshitem);
//            e.meshitem.colorSet(!e.end && (e.accept || blinkoff) ? '0xFF0000' : '0xFFAAAA');
//            e.setAttribute('on', !e.end && (e.accept || blinkoff) ? 1 : 0);
//        }
//    }
//    blinkoff ^= 1;
//}, 500);


//console.log('THREE end v0.2 aliconnect', aliconnect);
