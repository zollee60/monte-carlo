import Canvas from './Canvas.js';
import CustomChart from './CustomChart.js';
import {loadResults, resetResults} from './ResultLoader.js'

let r = 100;
let canvas = new Canvas('canvas');
canvas.drawCircleQuadrant();

let cc = new CustomChart('chart');

document.getElementById('calc').addEventListener("click", () => {
    const D = parseFloat(document.getElementById('D').value);
    const N = parseFloat(document.getElementById('N').value);
    
    cc.init(N);
    canvas.subscribe(cc);
    canvas.genNewRandom(D,N);
    loadResults(canvas.closestValues,'results');
});

document.getElementById('reset').addEventListener("click", () => {
    canvas.resetCanvas();
    cc.resetChart();
    resetResults('results');
});

