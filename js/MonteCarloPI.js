import Canvas from './Canvas.js';
import CustomChart from './CustomChart.js';
import {loadPIResults, resetResults} from './ResultLoader.js'

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
    loadPIResults(canvas.closestValues,'results');
});

document.getElementById('reset').addEventListener("click", () => {
    canvas.resetCanvas();
    canvas.drawCircleQuadrant();
    cc.resetChart();
    resetResults('results');
});

