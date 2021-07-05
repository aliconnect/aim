Aim.add({
	Charts: {
		show: function () {
			//console.log('CHART START', this.el, this.data);
			var cat = {}, keys = {}, config = {
				cursor: { type: "XYCursor", behavior: "zoomY" },
				legend: { type: "Legend", position: "right" },
				scrollbarX: { type: "XYChartScrollbar", scrollbarX: "scrollbarX" },
				yAxes: [{ type: "CategoryAxis", renderer: { minGridDistance: 20, grid: { location: 0 } }, dataFields: { category: "category" } }],
				xAxes: [{ type: "ValueAxis", }],
				data: [],
				series: [],
			};
			//console.log(this.data);
			this.data.forEach(function (row) {
				if (row.hidden) return;
				cat[row.category] = cat[row.category] || { category: row.category }
				cat[row.category][row.label] = cat[row.category][row.label] || 0;
				cat[row.category][row.label] += Number(row.value);
				keys[row.label] = keys[row.label] || { value: 0, name: row.label };
				keys[row.label].value += Number(row.sort);
			});
			for (var name in cat) config.data.push(cat[name]);
			keys = Object.values(keys);
			keys.sort(function (a, b) { return a.value > b.value ? 1 : a.value < b.value ? -1 : 0; });
			keys.forEach(function (key) {
				config.series.push({
					type: "ColumnSeries",
					dataFields: { valueX: key.name, categoryY: "category" },
					name: key.name,
					//fill: "#FAFAFA",
					strokeWidth: 1, stroke: '#FAFAFA',
					columns: { tooltipText: "[bold]{name}[/]\n[font-size:14px]{categoryY}: {valueX}" },
					bullets: [{ type: "LabelBullet", locationX: 0.5, label: { text: "{valueX}", fill: "black" } }],
					stacked: true,
				});
			});

			//console.log('CONFIG',config);
			var chart = am4core.createFromConfig(config, this.el.appendTag('div', { style: 'width:100%;height:100%;background:white;' }), "XYChart");
		}
	}
});